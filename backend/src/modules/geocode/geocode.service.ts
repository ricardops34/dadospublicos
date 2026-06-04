import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { RedisCacheService } from '../redis-cache/redis-cache.service';
import { CepGeo } from '../../entities/cep-geo.entity';
import { UfIbge } from '../../entities/uf-ibge.entity';
import { MunicipioIbge } from '../../entities/municipio-ibge.entity';

@Injectable()
export class GeocodeService {
  constructor(
    @InjectRepository(CepGeo, 'viacep') private ceps: Repository<CepGeo>,
    @InjectRepository(UfIbge, 'viacep') private ufs: Repository<UfIbge>,
    @InjectRepository(MunicipioIbge, 'viacep') private municipios: Repository<MunicipioIbge>,
    private cache: RedisCacheService,
  ) {}

  async buscarCep(cep: string): Promise<CepGeo> {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) throw new NotFoundException('CEP inválido.');

    const redisCacheKey = `cep:${cepLimpo}`;
    const redisHit = await this.cache.get<CepGeo>(redisCacheKey);
    if (redisHit) return redisHit;

    const cache = await this.ceps.findOne({ where: { cep: cepLimpo } });
    
    // Check if cache exists and is newer than 6 months
    if (cache && cache.atualizadoEm) {
      const seisMesesAtras = new Date();
      seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 6);
      
      if (cache.atualizadoEm > seisMesesAtras) {
        return cache;
      }
    }

    // ViaCEP
    let logradouro = '', bairro = '', municipio = '', uf = '';
    try {
      const { data } = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`, { timeout: 5000 });
      if (!data.erro) {
        logradouro = data.logradouro ?? '';
        bairro     = data.bairro ?? '';
        municipio  = data.localidade ?? '';
        uf         = data.uf ?? '';
      }
    } catch { /* sem ViaCEP — tenta geocodificar com CEP mesmo assim */ }

    // Nominatim (OSM) para lat/lng
    let lat: number | null = null;
    let lng: number | null = null;
    try {
      const query = logradouro
        ? `${logradouro}, ${municipio}, ${uf}, Brasil`
        : `${cepLimpo}, Brasil`;
      const { data } = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: { q: query, format: 'json', limit: 1, countrycodes: 'br' },
        headers: { 'User-Agent': 'RFBDataService/1.0' },
        timeout: 8000,
      });
      if (data.length > 0) {
        lat = parseFloat(data[0].lat);
        lng = parseFloat(data[0].lon);
      }
    } catch { /* geocodificação falhou — salva sem coordenadas */ }

    if (cache) {
      cache.logradouro = logradouro;
      cache.bairro = bairro;
      cache.municipio = municipio;
      cache.ufSigla = uf;
      cache.lat = lat;
      cache.lng = lng;
      cache.geocodificadoEm = lat ? new Date() : null;
      cache.atualizadoEm = new Date();
      const saved = await this.ceps.save(cache);
      await this.cache.set(redisCacheKey, saved, 604800); // 7 dias
      return saved;
    } else {
      const novo = this.ceps.create({
        cep: cepLimpo, logradouro, bairro, municipio, ufSigla: uf,
        lat, lng, geocodificadoEm: lat ? new Date() : null,
      });
      const saved = await this.ceps.save(novo);
      await this.cache.set(redisCacheKey, saved, 604800); // 7 dias
      return saved;
    }
  }

  async syncIbge(): Promise<{ ufs: number, municipios: number }> {
    // 1. Sincroniza UFs
    const { data: estadosData } = await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
    const ufsInsert = estadosData.map((uf: any) => this.ufs.create({
      sigla: uf.sigla,
      codigoIbge: uf.id,
      nome: uf.nome
    }));
    await this.ufs.save(ufsInsert);

    // 2. Sincroniza Municípios usando a API específica por estado
    let munInsert: any[] = [];
    for (const uf of estadosData) {
      const { data: munData } = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf.sigla}/municipios`);
      const munOfUf = munData.map((m: any) => this.municipios.create({
        codigoIbge: m.id,
        nome: m.nome,
        ufSigla: uf.sigla
      }));
      munInsert = munInsert.concat(munOfUf);
    }
    
    // Como são >5000 registros, salvamos em chunks para não estourar o limite de parâmetros do PG
    for (let i = 0; i < munInsert.length; i += 1000) {
      await this.municipios.save(munInsert.slice(i, i + 1000));
    }

    return { ufs: ufsInsert.length, municipios: munInsert.length };
  }

  async getUfs(filter?: string): Promise<any> {
    let query = this.ufs.createQueryBuilder('uf');
    if (filter) {
      query = query.where('uf.nome ILIKE :filter OR uf.sigla ILIKE :filter', { filter: `%${filter}%` });
    }
    const result = await query.orderBy('uf.sigla', 'ASC').getMany();
    return { items: result.map(uf => ({ label: `${uf.nome} (${uf.sigla})`, value: uf.sigla })) };
  }

  async getMunicipios(ufSigla: string, filter?: string): Promise<any> {
    let query = this.municipios.createQueryBuilder('mun').where('mun.ufSigla = :uf', { uf: ufSigla });
    if (filter) {
      query = query.andWhere('mun.nome ILIKE :filter', { filter: `%${filter}%` });
    }
    const result = await query.orderBy('mun.nome', 'ASC').getMany();
    return { items: result.map(m => ({ label: m.nome, value: m.nome })) };
  }
}

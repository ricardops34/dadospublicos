import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { CepGeo } from '../../entities/cep-geo.entity';

@Injectable()
export class GeocodeService {
  constructor(@InjectRepository(CepGeo) private ceps: Repository<CepGeo>) {}

  async buscarCep(cep: string): Promise<CepGeo> {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) throw new NotFoundException('CEP inválido.');

    const cache = await this.ceps.findOne({ where: { cep: cepLimpo } });
    if (cache) return cache;

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

    const novo = this.ceps.create({
      cep: cepLimpo, logradouro, bairro, municipio, ufSigla: uf,
      lat, lng, geocodificadoEm: lat ? new Date() : null,
    });
    await this.ceps.save(novo);
    return novo;
  }
}

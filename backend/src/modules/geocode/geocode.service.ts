import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { CepGeo } from '../../entities/cep-geo.entity';
import { UfIbge } from '../../entities/uf-ibge.entity';
import { MunicipioIbge } from '../../entities/municipio-ibge.entity';
import { ParametrosService } from '../parametros/parametros.service';
import { RedisCacheService } from '../redis-cache/redis-cache.service';

const CEP_CACHE_VALIDITY_DAYS_DEFAULT = 180;

@Injectable()
export class GeocodeService {
  private readonly logger = new Logger(GeocodeService.name);

  constructor(
    @InjectRepository(CepGeo, 'viacep') private ceps: Repository<CepGeo>,
    @InjectRepository(UfIbge, 'viacep') private ufs: Repository<UfIbge>,
    @InjectRepository(MunicipioIbge, 'viacep') private municipios: Repository<MunicipioIbge>,
    private params: ParametrosService,
    private cache: RedisCacheService,
  ) {}

  /**
   * Fluxo único para todos os usos:
   * 1. Banco local e válido → retorna direto (rápido)
   * 2. Não encontrado ou desatualizado → busca ViaCEP + Nominatim → salva → retorna
   * A base cresce organicamente à medida que os CEPs são consultados.
   */
  async buscarCep(cep: string): Promise<CepGeo> {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) throw new NotFoundException('CEP inválido.');

    // 1. Redis (mais rápido)
    const redisKey = `cep:${cepLimpo}`;
    const cached = await this.cache.get<CepGeo>(redisKey);
    if (cached) return cached;

    // 2. Banco local
    const registro = await this.ceps.findOne({ where: { cep: cepLimpo } });

    if (registro) {
      const valido = await this.registroEhValido(registro);
      if (valido) {
        await this.cache.set(redisKey, registro, 604800); // 7 dias
        return registro;
      }
    }

    // 3. Fontes externas (ViaCEP + Nominatim)
    const dados = await this.consultarFontesExternas(cepLimpo);
    const salvo = registro
      ? await this.atualizarRegistro(registro, dados)
      : await this.criarRegistro(cepLimpo, dados);

    await this.cache.set(redisKey, salvo, 604800); // 7 dias
    return salvo;
  }

  // ─── Validação de cache ───────────────────────────────────────────────────

  private async registroEhValido(registro: CepGeo): Promise<boolean> {
    const diasStr = await this.params.getValor(
      'CEP_CACHE_VALIDITY_DAYS',
      String(CEP_CACHE_VALIDITY_DAYS_DEFAULT),
    );
    const dias = parseInt(diasStr, 10) || CEP_CACHE_VALIDITY_DAYS_DEFAULT;
    const limite = new Date();
    limite.setDate(limite.getDate() - dias);
    return registro.atualizadoEm > limite;
  }

  // ─── Fontes externas ──────────────────────────────────────────────────────

  private async consultarFontesExternas(cep: string): Promise<Partial<CepGeo>> {
    const dados: Partial<CepGeo> = {};

    // 1. ViaCEP — dados de endereço
    try {
      this.logger.log(`[ViaCEP] Consultando CEP ${cep}`);
      const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`, { timeout: 5000 });
      if (!data.erro) {
        dados.logradouro    = data.logradouro  ?? null;
        dados.complemento   = data.complemento ?? null;
        dados.bairro        = data.bairro      ?? null;
        dados.municipio     = data.localidade  ?? null;
        dados.ufSigla       = data.uf          ?? null;
        dados.municipioIbge = data.ibge ? parseInt(data.ibge, 10) : null;
        dados.origemDados   = 'viacep';
        this.logger.log(`[ViaCEP] CEP ${cep} encontrado: ${data.localidade}/${data.uf}`);
      } else {
        this.logger.warn(`[ViaCEP] CEP ${cep} não encontrado`);
      }
    } catch (err: any) {
      this.logger.warn(`[ViaCEP] Falha ao consultar CEP ${cep}: ${err.message}`);
    }

    // 2. Nominatim (OSM) — coordenadas geográficas
    try {
      const query = dados.logradouro
        ? `${dados.logradouro}, ${dados.municipio}, ${dados.ufSigla}, Brasil`
        : `${cep}, Brasil`;
      this.logger.log(`[Nominatim] Geocodificando CEP ${cep}: ${query}`);
      const { data } = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: { q: query, format: 'json', limit: 1, countrycodes: 'br' },
        headers: { 'User-Agent': 'BuscaDados/1.0' },
        timeout: 8000,
      });
      if (data.length > 0) {
        dados.lat             = parseFloat(data[0].lat);
        dados.lng             = parseFloat(data[0].lon);
        dados.geocodificadoEm = new Date();
        this.logger.log(`[Nominatim] CEP ${cep} geocodificado: ${dados.lat},${dados.lng}`);
      } else {
        this.logger.warn(`[Nominatim] Nenhum resultado para CEP ${cep}`);
      }
    } catch (err: any) {
      this.logger.warn(`[Nominatim] Falha ao geocodificar CEP ${cep}: ${err.message}`);
    }

    return dados;
  }

  // ─── Persistência ─────────────────────────────────────────────────────────

  private async criarRegistro(cep: string, dados: Partial<CepGeo>): Promise<CepGeo> {
    const novo = this.ceps.create({ cep, ...dados });
    const salvo = await this.ceps.save(novo);
    this.logger.log(`[CEP] Registrado novo CEP ${cep}`);
    return salvo;
  }

  private async atualizarRegistro(registro: CepGeo, dados: Partial<CepGeo>): Promise<CepGeo> {
    Object.assign(registro, dados);
    const salvo = await this.ceps.save(registro);
    this.logger.log(`[CEP] Atualizado CEP ${registro.cep}`);
    return salvo;
  }

  // ─── UFs e Municípios ─────────────────────────────────────────────────────

  async syncIbge(): Promise<{ ufs: number; municipios: number }> {
    const { data: estadosData } = await axios.get(
      'https://servicodados.ibge.gov.br/api/v1/localidades/estados',
    );
    const ufsInsert = estadosData.map((uf: any) =>
      this.ufs.create({ sigla: uf.sigla, codigoIbge: uf.id, nome: uf.nome }),
    );
    await this.ufs.save(ufsInsert);

    let munInsert: any[] = [];
    for (const uf of estadosData) {
      const { data: munData } = await axios.get(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf.sigla}/municipios`,
      );
      munInsert = munInsert.concat(
        munData.map((m: any) =>
          this.municipios.create({ codigoIbge: m.id, nome: m.nome, ufSigla: uf.sigla }),
        ),
      );
    }

    for (let i = 0; i < munInsert.length; i += 1000) {
      await this.municipios.save(munInsert.slice(i, i + 1000));
    }

    return { ufs: ufsInsert.length, municipios: munInsert.length };
  }

  async getUfs(filter?: string): Promise<any> {
    let query = this.ufs.createQueryBuilder('uf');
    if (filter) {
      query = query.where('uf.nome ILIKE :filter OR uf.sigla ILIKE :filter', {
        filter: `%${filter}%`,
      });
    }
    const result = await query.orderBy('uf.sigla', 'ASC').getMany();
    return {
      items: result.map((uf) => ({ label: `${uf.nome} (${uf.sigla})`, value: uf.sigla })),
    };
  }

  async getMunicipios(ufSigla: string, filter?: string): Promise<any> {
    let query = this.municipios
      .createQueryBuilder('mun')
      .where('mun.ufSigla = :uf', { uf: ufSigla });
    if (filter) {
      query = query.andWhere('mun.nome ILIKE :filter', { filter: `%${filter}%` });
    }
    const result = await query.orderBy('mun.nome', 'ASC').getMany();
    return { items: result.map((m) => ({ label: m.nome, value: m.nome })) };
  }
}

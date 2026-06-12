import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Painel360Lote } from '../../entities/painel-360-lote.entity';
import { Painel360Item } from '../../entities/painel-360-item.entity';
import { Painel360Consulta } from '../../entities/painel-360-consulta.entity';
import { Estabelecimento } from '../../entities/estabelecimento.entity';
import { EmpresaRfb } from '../../entities/empresa-rfb.entity';
import { CepGeo } from '../../entities/cep-geo.entity';
import { Simples } from '../../entities/simples.entity';
import { Municipio } from '../../entities/municipio.entity';
import { Cnae } from '../../entities/cnae.entity';
import { Painel360BuscaDto } from './dto/painel-360-busca.dto';
import { Assinatura } from '../../entities/assinatura.entity';
import { GeocodeService } from '../geocode/geocode.service';
import { ClienteConfiguracaoService, CHAVE_GOOGLE_MAPS_API_KEY } from '../cliente-configuracao/cliente-configuracao.service';

type PortalUsuario = {
  sub: string;
  perfil: 'admin' | 'cliente';
  nome?: string;
  email?: string;
};

type BuscaRow = {
  cnpj: string;
  razaoSocial: string | null;
  nomeFantasia: string | null;
  situacaoCadastral: string | null;
  uf: string | null;
  municipioNome: string | null;
  bairro: string | null;
  cep: string | null;
  logradouro: string | null;
  numero: string | null;
  cnaeFiscalPrincipal: string | null;
  lat: string | number | null;
  lng: string | number | null;
};

type LoteLookupRow = {
  cnpj: string;
  razaoSocial: string | null;
  nomeFantasia: string | null;
  situacaoCadastral: string | null;
  uf: string | null;
  municipio: string | null;
  municipioIbge: number | null;
  cep: string | null;
  logradouro: string | null;
  numero: string | null;
  bairro: string | null;
  cnaeFiscalPrincipal: string | null;
  porteEmpresa: string | null;
  opcaoSimples: string | null;
  opcaoMei: string | null;
  lat: string | number | null;
  lng: string | number | null;
};

@Injectable()
export class Painel360Service {
  constructor(
    @InjectRepository(Painel360Lote, 'buscadados')
    private lotes: Repository<Painel360Lote>,
    @InjectRepository(Painel360Item, 'buscadados')
    private itens: Repository<Painel360Item>,
    @InjectRepository(Painel360Consulta, 'buscadados')
    private consultas: Repository<Painel360Consulta>,
    @InjectRepository(Estabelecimento)
    private readonly estabelecimentos: Repository<Estabelecimento>,
    @InjectRepository(Cnae)
    private readonly cnaesRepo: Repository<Cnae>,
    @InjectRepository(Municipio)
    private readonly municipios: Repository<Municipio>,
    @InjectRepository(CepGeo, 'viacep')
    private readonly cepsGeo: Repository<CepGeo>,
    private readonly geocode: GeocodeService,
    private readonly clienteConfig: ClienteConfiguracaoService,
    @InjectRepository(Assinatura, 'buscadados')
    private readonly assinaturas: Repository<Assinatura>,
  ) {}

  // ─── Busca por filtros (novo fluxo) ────────────────────────────────────────

  async buscar(usuario: PortalUsuario, dto: Painel360BuscaDto) {
    const limite = Math.min(dto.limite ?? 2000, 2000);
    const cnaes = this.normalizarCnaes(dto.cnaes);

    const rows = await this.executarBuscaRows(
      { uf: dto.uf, municipio: dto.municipio, bairro: dto.bairro, cnaes },
      limite,
      usuario.sub,
    );

    const geocodRows = rows.filter((r) => r.lat !== null && r.lng !== null);

    const consulta = await this.consultas.save(
      this.consultas.create({
        criadoPorId: usuario.sub,
        criadoPorPerfil: usuario.perfil,
        filtros: {
          uf: dto.uf || undefined,
          municipio: dto.municipio || undefined,
          bairro: dto.bairro || undefined,
          cnaes: cnaes.length ? cnaes : undefined,
        },
        totalResultados: rows.length,
        totalGeocod: geocodRows.length,
      }),
    );

    return {
      consultaId: consulta.id,
      total: rows.length,
      totalGeocod: geocodRows.length,
      geojson: this.rowsParaGeoJson(geocodRows),
    };
  }

  async listarConsultas(usuario: PortalUsuario) {
    const where = usuario.perfil === 'cliente' ? { criadoPorId: usuario.sub } : {};
    const lista = await this.consultas.find({
      where,
      order: { criadoEm: 'DESC' },
      take: 50,
    });
    return lista.map((c) => this.toConsultaResumo(c));
  }

  async recarregarGeoJson(consultaId: string, usuario: PortalUsuario) {
    const consulta = await this.buscarConsultaComAcesso(consultaId, usuario);
    const rows = await this.executarBuscaRows(consulta.filtros, 2000);
    const geocodRows = rows.filter((r) => r.lat !== null && r.lng !== null);
    return this.rowsParaGeoJson(geocodRows);
  }

  async gerarRelatorio(consultaId: string, usuario: PortalUsuario) {
    const consulta = await this.buscarConsultaComAcesso(consultaId, usuario);
    const rows = await this.executarBuscaRows(consulta.filtros, 10000);

    const header = [
      'cnpj', 'razao_social', 'nome_fantasia', 'situacao_cadastral',
      'uf', 'municipio', 'bairro', 'cep', 'logradouro', 'numero',
      'cnae_fiscal_principal', 'lat', 'lng',
    ];

    const linhas = rows.map((r) => [
      r.cnpj,
      r.razaoSocial ?? '',
      r.nomeFantasia ?? '',
      r.situacaoCadastral ?? '',
      r.uf ?? '',
      r.municipioNome ?? '',
      r.bairro ?? '',
      r.cep ?? '',
      r.logradouro ?? '',
      r.numero ?? '',
      r.cnaeFiscalPrincipal ?? '',
      r.lat ?? '',
      r.lng ?? '',
    ]);

    const conteudo = [header, ...linhas]
      .map((linha) => linha.map((v) => this.escaparCsv(v)).join(';'))
      .join('\n');

    return { nome: `painel-360-${consultaId}.csv`, conteudo };
  }

  async lookupCnaes(q?: string) {
    const qb = this.cnaesRepo
      .createQueryBuilder('c')
      .select(['c.codigo', 'c.descricao'])
      .orderBy('c.codigo', 'ASC');

    if (q) {
      qb.where('(c.codigo LIKE :prefix OR c.descricao ILIKE :like)', {
        prefix: `${q}%`,
        like: `%${q}%`,
      });
    }

    const rows = await qb.take(300).getMany();
    return rows.map((r) => ({
      value: r.codigo,
      label: `${r.codigo} — ${r.descricao}`,
    }));
  }

  async lookupMunicipios(uf?: string) {
    const qb = this.municipios
      .createQueryBuilder('m')
      .select(['m.codigoRfb', 'm.nome'])
      .orderBy('m.nome', 'ASC');

    if (uf) {
      qb.where('m.uf_sigla = :uf', { uf: uf.toUpperCase() });
    }

    const rows = await qb.take(1000).getMany();
    return rows.map((r) => ({
      value: r.codigoRfb,
      label: r.nome,
    }));
  }

  // ─── Lotes CSV (fluxo legado mantido) ──────────────────────────────────────

  async criarLote(usuario: PortalUsuario, arquivo: { originalname?: string; buffer?: Buffer } | undefined) {
    if (!arquivo?.buffer?.length) {
      throw new BadRequestException('Arquivo CSV obrigatorio.');
    }

    const parse = this.extrairCnpjsDoCsv(arquivo.buffer);
    if (!parse.cnpjs.length) {
      throw new BadRequestException('Nenhum CNPJ valido encontrado no arquivo.');
    }

    const lote = await this.lotes.save(this.lotes.create({
      criadoPorId: usuario.sub,
      criadoPorPerfil: usuario.perfil,
      arquivoNomeOriginal: arquivo.originalname ?? 'lote.csv',
      status: 'aguardando',
      totalLinhas: parse.totalLinhas,
      totalCnpjs: parse.cnpjs.length,
      processados: 0,
      encontrados: 0,
      naoEncontrados: 0,
      cnpjs: parse.cnpjs,
      filtros: null,
    }));

    await this.itens.save(
      parse.cnpjs.map((cnpj, index) => this.itens.create({
        loteId: lote.id,
        ordem: index + 1,
        cnpj,
        status: 'pendente',
        encontrado: false,
      })),
    );

    setImmediate(() => { void this.processarLote(lote.id); });
    return this.obterLote(lote.id, usuario);
  }

  async listarLotes(usuario: PortalUsuario) {
    const where = usuario.perfil === 'cliente' ? { criadoPorId: usuario.sub } : {};
    const lotes = await this.lotes.find({ where, order: { criadoEm: 'DESC' }, take: 100 });
    return lotes.map((lote) => this.toLoteResumo(lote));
  }

  async obterLote(id: string, usuario: PortalUsuario) {
    const lote = await this.buscarLoteComAcesso(id, usuario);
    return this.toLoteResumo(lote);
  }

  async obterResultados(id: string, usuario: PortalUsuario, pagina = 1, limite = 50) {
    const lote = await this.buscarLoteComAcesso(id, usuario);
    const take = Math.min(Math.max(limite || 50, 1), 500);
    const currentPage = Math.max(pagina || 1, 1);
    const [itens, total] = await this.itens.findAndCount({
      where: { loteId: lote.id },
      order: { ordem: 'ASC' },
      skip: (currentPage - 1) * take,
      take,
    });

    return {
      lote: this.toLoteResumo(lote),
      paginacao: { pagina: currentPage, limite: take, total, paginas: Math.max(1, Math.ceil(total / take)) },
      data: itens.map((item) => this.toResultado(item)),
    };
  }

  async gerarDownloadCsv(id: string, usuario: PortalUsuario) {
    const lote = await this.buscarLoteComAcesso(id, usuario);
    const itens = await this.itens.find({ where: { loteId: lote.id }, order: { ordem: 'ASC' } });

    const header = ['ordem','cnpj','status','razao_social','nome_fantasia','situacao_cadastral','uf','municipio','municipio_ibge','cep','logradouro','numero','bairro','cnae_fiscal_principal','porte_empresa','simples','mei','lat','lng'];
    const linhas = itens.map((item) => [
      item.ordem, item.cnpj, item.status,
      item.razaoSocial ?? '', item.nomeFantasia ?? '', item.situacaoCadastral ?? '',
      item.uf ?? '', item.municipio ?? '', item.municipioIbge ?? '',
      item.cep ?? '', item.logradouro ?? '', item.numero ?? '', item.bairro ?? '',
      item.cnaeFiscalPrincipal ?? '', item.porteEmpresa ?? '',
      item.opcaoSimples === null ? '' : item.opcaoSimples ? 'S' : 'N',
      item.opcaoMei === null ? '' : item.opcaoMei ? 'S' : 'N',
      item.lat ?? '', item.lng ?? '',
    ]);

    const conteudo = [header, ...linhas]
      .map((linha) => linha.map((valor) => this.escaparCsv(valor)).join(';'))
      .join('\n');

    return { nome: `painel-360-${lote.id}.csv`, conteudo };
  }

  async obterGeoJson(id: string, usuario: PortalUsuario) {
    const lote = await this.buscarLoteComAcesso(id, usuario);
    const itens = await this.itens.find({ where: { loteId: lote.id, encontrado: true }, order: { ordem: 'ASC' } });

    return {
      type: 'FeatureCollection',
      features: itens
        .filter((item) => item.lat !== null && item.lng !== null)
        .map((item) => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [Number(item.lng), Number(item.lat)] },
          properties: {
            id: item.id, ordem: item.ordem, cnpj: item.cnpj,
            razao_social: item.razaoSocial, nome_fantasia: item.nomeFantasia,
            situacao_cadastral: item.situacaoCadastral, uf: item.uf,
            municipio: item.municipio, municipio_ibge: item.municipioIbge,
            cep: item.cep, cnae_fiscal_principal: item.cnaeFiscalPrincipal,
            porte_empresa: item.porteEmpresa,
          },
        })),
    };
  }

  // ─── Internos ───────────────────────────────────────────────────────────────

  private async executarBuscaRows(
    filtros: { uf?: string; municipio?: string; bairro?: string; cnaes?: string[] },
    limite: number,
    usuarioId?: string,
  ): Promise<BuscaRow[]> {
    const cnaes = filtros.cnaes ?? [];

    // Query 1: estabelecimentos + empresa + municipio (todos no banco dados_rfb)
    const qb = this.estabelecimentos
      .createQueryBuilder('e')
      .leftJoin(EmpresaRfb, 'emp', 'emp.cnpj_basico = e.cnpj_basico')
      .leftJoin(Municipio, 'mun', 'mun.codigo_rfb = e.municipio')
      .select('CONCAT(e.cnpj_basico, e.cnpj_ordem, e.cnpj_dv)', 'cnpj')
      .addSelect('emp.razao_social', 'razaoSocial')
      .addSelect('e.nome_fantasia', 'nomeFantasia')
      .addSelect('e.situacao_cadastral', 'situacaoCadastral')
      .addSelect('e.uf', 'uf')
      .addSelect('mun.nome', 'municipioNome')
      .addSelect('e.bairro', 'bairro')
      .addSelect('e.cep', 'cep')
      .addSelect('e.logradouro', 'logradouro')
      .addSelect('e.numero', 'numero')
      .addSelect('e.cnae_fiscal_principal', 'cnaeFiscalPrincipal');

    if (filtros.uf) qb.andWhere('e.uf = :uf', { uf: filtros.uf.toUpperCase() });
    if (filtros.municipio) qb.andWhere('e.municipio = :municipio', { municipio: filtros.municipio });
    if (filtros.bairro) qb.andWhere('e.bairro ILIKE :bairro', { bairro: `%${filtros.bairro}%` });
    if (cnaes.length) qb.andWhere('e.cnae_fiscal_principal IN (:...cnaes)', { cnaes });

    type RawRow = Omit<BuscaRow, 'lat' | 'lng'> & { cep: string | null };
    const rows = await qb.take(limite).getRawMany<RawRow>();

    if (!rows.length) return [];

    // Query 2: coordenadas dos CEPs únicos (banco dados_viacep — não pode fazer join cross-database)
    const cepsUnicos = [...new Set(rows.map((r) => r.cep).filter((c): c is string => !!c))];
    const geoMap = new Map<string, { lat: number | null; lng: number | null }>();

    if (cepsUnicos.length) {
      const geoRows = await this.cepsGeo
        .createQueryBuilder('g')
        .select(['g.cep', 'g.lat', 'g.lng'])
        .where('g.cep IN (:...ceps)', { ceps: cepsUnicos })
        .getMany();

      for (const g of geoRows) {
        geoMap.set(g.cep, {
          lat: g.lat !== null ? Number(g.lat) : null,
          lng: g.lng !== null ? Number(g.lng) : null,
        });
      }
    }

    // Mescla em memória: associa lat/lng pelo CEP
    const resultado = rows.map((r) => {
      const geo = r.cep ? geoMap.get(r.cep) : undefined;
      return { ...r, lat: geo?.lat ?? null, lng: geo?.lng ?? null };
    });

    // Enriquece em background: CEPs ausentes ou sem lat/lng → ViaCEP + Nominatim (ou Google)
    const cepsParaEnriquecer = cepsUnicos.filter((cep) => {
      const geo = geoMap.get(cep);
      return !geo || geo.lat === null;
    });
    if (cepsParaEnriquecer.length && usuarioId) {
      const clienteId = await this.obterClienteIdPorUsuario(usuarioId);
      setImmediate(() => { void this.enriquecerCeps(cepsParaEnriquecer, clienteId); });
    } else if (cepsParaEnriquecer.length) {
      setImmediate(() => { void this.enriquecerCeps(cepsParaEnriquecer, null); });
    }

    return resultado;
  }

  private async enriquecerCeps(ceps: string[], clienteId: string | null) {
    const googleKey = clienteId
      ? await this.clienteConfig.obter(clienteId, CHAVE_GOOGLE_MAPS_API_KEY)
      : null;

    for (const cep of ceps) {
      try {
        if (googleKey) {
          // Google: chama ViaCEP para endereço, depois Google para coordenadas
          await this.geocode.buscarCep(cep);
          await this.geocode.geocodificarComGoogle(cep, googleKey);
          await new Promise((resolve) => setTimeout(resolve, 200));
        } else {
          // Padrão: ViaCEP + Nominatim (respeita 1 req/s do Nominatim)
          await this.geocode.buscarCep(cep);
          await new Promise((resolve) => setTimeout(resolve, 1100));
        }
      } catch {
        // ignora falhas individuais
      }
    }
  }

  private async obterClienteIdPorUsuario(usuarioId: string): Promise<string | null> {
    const assinatura = await this.assinaturas.findOne({
      where: { usuarioId },
      order: { criadoEm: 'DESC' },
    });
    return assinatura?.clienteId ?? null;
  }

  private rowsParaGeoJson(rows: BuscaRow[]) {
    return {
      type: 'FeatureCollection',
      features: rows.map((r) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [this.parseNullableNumber(r.lng), this.parseNullableNumber(r.lat)],
        },
        properties: {
          cnpj: r.cnpj,
          razao_social: r.razaoSocial,
          nome_fantasia: r.nomeFantasia,
          situacao_cadastral: r.situacaoCadastral,
          uf: r.uf,
          municipio: r.municipioNome,
          bairro: r.bairro,
          cep: r.cep,
          endereco: [r.logradouro, r.numero, r.bairro].filter(Boolean).join(', '),
          cnae_fiscal_principal: r.cnaeFiscalPrincipal,
        },
      })),
    };
  }

  private toConsultaResumo(c: Painel360Consulta) {
    return {
      id: c.id,
      filtros: c.filtros,
      totalResultados: c.totalResultados,
      totalGeocod: c.totalGeocod,
      criadoEm: c.criadoEm,
    };
  }

  private async buscarConsultaComAcesso(id: string, usuario: PortalUsuario) {
    const consulta = await this.consultas.findOne({ where: { id } });
    if (!consulta) throw new NotFoundException('Consulta nao encontrada.');
    if (usuario.perfil === 'cliente' && consulta.criadoPorId !== usuario.sub) {
      throw new ForbiddenException('Acesso negado a esta consulta.');
    }
    return consulta;
  }

  private normalizarCnaes(cnaes?: string | string[]): string[] {
    if (!cnaes) return [];
    if (Array.isArray(cnaes)) return cnaes.filter(Boolean);
    return cnaes.split(',').map((c) => c.trim()).filter(Boolean);
  }

  private async buscarLoteComAcesso(id: string, usuario: PortalUsuario) {
    const lote = await this.lotes.findOne({ where: { id } });
    if (!lote) throw new NotFoundException('Lote nao encontrado.');
    if (usuario.perfil === 'cliente' && lote.criadoPorId !== usuario.sub) {
      throw new ForbiddenException('Acesso negado a este lote.');
    }
    return lote;
  }

  private async buscarDadosPorCnpjs(cnpjs: string[]) {
    if (!cnpjs.length) return new Map<string, LoteLookupRow>();

    type RawLoteRow = Omit<LoteLookupRow, 'lat' | 'lng'>;
    const rows = await this.estabelecimentos
      .createQueryBuilder('e')
      .leftJoin(EmpresaRfb, 'emp', 'emp.cnpj_basico = e.cnpj_basico')
      .leftJoin(Simples, 'simp', 'simp.cnpj_basico = e.cnpj_basico')
      .leftJoin(Municipio, 'mun', 'mun.codigo_rfb = e.municipio')
      .select('CONCAT(e.cnpj_basico, e.cnpj_ordem, e.cnpj_dv)', 'cnpj')
      .addSelect('emp.razao_social', 'razaoSocial')
      .addSelect('e.nome_fantasia', 'nomeFantasia')
      .addSelect('e.situacao_cadastral', 'situacaoCadastral')
      .addSelect('e.uf', 'uf')
      .addSelect('mun.nome', 'municipio')
      .addSelect('mun.codigo_ibge', 'municipioIbge')
      .addSelect('e.cep', 'cep')
      .addSelect('e.logradouro', 'logradouro')
      .addSelect('e.numero', 'numero')
      .addSelect('e.bairro', 'bairro')
      .addSelect('e.cnae_fiscal_principal', 'cnaeFiscalPrincipal')
      .addSelect('emp.porte_empresa', 'porteEmpresa')
      .addSelect('simp.opcao_pelo_simples', 'opcaoSimples')
      .addSelect('simp.opcao_pelo_mei', 'opcaoMei')
      .where('CONCAT(e.cnpj_basico, e.cnpj_ordem, e.cnpj_dv) IN (:...cnpjs)', { cnpjs })
      .getRawMany<RawLoteRow>();

    if (!rows.length) return new Map<string, LoteLookupRow>();

    // Busca coordenadas em banco separado (dados_viacep)
    const cepsUnicos = [...new Set(rows.map((r) => r.cep).filter((c): c is string => !!c))];
    const geoMap = new Map<string, { lat: number | null; lng: number | null }>();

    if (cepsUnicos.length) {
      const geoRows = await this.cepsGeo
        .createQueryBuilder('g')
        .select(['g.cep', 'g.lat', 'g.lng'])
        .where('g.cep IN (:...ceps)', { ceps: cepsUnicos })
        .getMany();

      for (const g of geoRows) {
        geoMap.set(g.cep, {
          lat: g.lat !== null ? Number(g.lat) : null,
          lng: g.lng !== null ? Number(g.lng) : null,
        });
      }
    }

    const resultado = rows.map((row) => {
      const geo = row.cep ? geoMap.get(row.cep) : undefined;
      return { ...row, lat: geo?.lat ?? null, lng: geo?.lng ?? null } as LoteLookupRow;
    });

    return new Map(resultado.map((row) => [row.cnpj, row]));
  }

  private async processarLote(loteId: string) {
    const lote = await this.lotes.findOne({ where: { id: loteId } });
    if (!lote) return;

    try {
      lote.status = 'processando';
      lote.iniciadoEm = new Date();
      lote.erro = null;
      await this.lotes.save(lote);

      const itens = await this.itens.find({ where: { loteId: lote.id }, order: { ordem: 'ASC' } });

      const batchSize = 500;
      let processados = 0, encontrados = 0, naoEncontrados = 0;

      for (let offset = 0; offset < itens.length; offset += batchSize) {
        const batch = itens.slice(offset, offset + batchSize);
        const lookup = await this.buscarDadosPorCnpjs(batch.map((item) => item.cnpj));

        for (const item of batch) {
          const dados = lookup.get(item.cnpj);
          if (!dados) {
            item.status = 'nao_encontrado';
            item.encontrado = false;
            item.payload = null;
            naoEncontrados += 1;
            continue;
          }
          item.status = 'encontrado';
          item.encontrado = true;
          item.razaoSocial = dados.razaoSocial;
          item.nomeFantasia = dados.nomeFantasia;
          item.situacaoCadastral = dados.situacaoCadastral;
          item.uf = dados.uf;
          item.municipio = dados.municipio;
          item.municipioIbge = dados.municipioIbge;
          item.cep = dados.cep;
          item.logradouro = dados.logradouro;
          item.numero = dados.numero;
          item.bairro = dados.bairro;
          item.cnaeFiscalPrincipal = dados.cnaeFiscalPrincipal;
          item.porteEmpresa = dados.porteEmpresa;
          item.opcaoSimples = dados.opcaoSimples === null ? null : dados.opcaoSimples === 'S';
          item.opcaoMei = dados.opcaoMei === null ? null : dados.opcaoMei === 'S';
          item.lat = this.parseNullableNumber(dados.lat);
          item.lng = this.parseNullableNumber(dados.lng);
          item.payload = { cnpj: item.cnpj, razao_social: item.razaoSocial, nome_fantasia: item.nomeFantasia, situacao_cadastral: item.situacaoCadastral, uf: item.uf, municipio: item.municipio, municipio_ibge: item.municipioIbge, cep: item.cep, logradouro: item.logradouro, numero: item.numero, bairro: item.bairro, cnae_fiscal_principal: item.cnaeFiscalPrincipal, porte_empresa: item.porteEmpresa, simples: item.opcaoSimples, mei: item.opcaoMei, lat: item.lat, lng: item.lng };
          encontrados += 1;
        }

        processados += batch.length;
        await this.itens.save(batch);
        lote.processados = processados;
        lote.encontrados = encontrados;
        lote.naoEncontrados = naoEncontrados;
        await this.lotes.save(lote);
      }

      lote.status = 'concluido';
      lote.concluidoEm = new Date();
      await this.lotes.save(lote);
    } catch (error) {
      lote.status = 'erro';
      lote.erro = error instanceof Error ? error.message : 'Falha inesperada no processamento do lote.';
      lote.concluidoEm = new Date();
      await this.lotes.save(lote);
    }
  }

  private extrairCnpjsDoCsv(buffer: Buffer) {
    const conteudo = buffer.toString('utf8').replace(/^﻿/, '');
    const linhas = conteudo.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const vistos = new Set<string>();
    const cnpjs: string[] = [];
    for (const linha of linhas) {
      for (const coluna of linha.split(/[;,]/)) {
        const cnpj = coluna.replace(/\D/g, '');
        if (cnpj.length !== 14 || vistos.has(cnpj)) continue;
        vistos.add(cnpj);
        cnpjs.push(cnpj);
      }
    }
    return { totalLinhas: linhas.length, cnpjs };
  }

  private toLoteResumo(lote: Painel360Lote) {
    return {
      id: lote.id, status: lote.status, nome: lote.arquivoNomeOriginal,
      nomeArquivo: lote.arquivoNomeOriginal, arquivoOriginal: lote.arquivoNomeOriginal,
      totalLinhas: lote.totalLinhas, totalResultados: lote.encontrados,
      resumo: { total: lote.totalCnpjs, processados: lote.processados, sucesso: lote.encontrados, erro: lote.naoEncontrados, geocodificados: lote.encontrados },
      criado_em: lote.criadoEm, iniciado_em: lote.iniciadoEm, concluido_em: lote.concluidoEm, erro: lote.erro,
    };
  }

  private toResultado(item: Painel360Item) {
    return {
      id: item.id, ordem: item.ordem, cnpj: item.cnpj, status: item.status, encontrado: item.encontrado,
      razao_social: item.razaoSocial, nome_fantasia: item.nomeFantasia, situacao_cadastral: item.situacaoCadastral,
      uf: item.uf, municipio: item.municipio, municipio_ibge: item.municipioIbge, cep: item.cep,
      logradouro: item.logradouro, numero: item.numero, bairro: item.bairro,
      cnae_fiscal_principal: item.cnaeFiscalPrincipal, porte_empresa: item.porteEmpresa,
      simples: item.opcaoSimples, mei: item.opcaoMei, lat: item.lat, lng: item.lng,
    };
  }

  private parseNullableNumber(valor: string | number | null) {
    if (valor === null || valor === undefined || valor === '') return null;
    const n = Number(valor);
    return Number.isFinite(n) ? n : null;
  }

  private escaparCsv(valor: unknown) {
    const texto = String(valor ?? '');
    if (texto.includes(';') || texto.includes('"') || texto.includes('\n')) {
      return `"${texto.replace(/"/g, '""')}"`;
    }
    return texto;
  }
}

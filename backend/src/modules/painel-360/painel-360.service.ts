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
import { Estabelecimento } from '../../entities/estabelecimento.entity';
import { EmpresaRfb } from '../../entities/empresa-rfb.entity';
import { CepGeo } from '../../entities/cep-geo.entity';
import { Simples } from '../../entities/simples.entity';
import { Municipio } from '../../entities/municipio.entity';

type PortalUsuario = {
  sub: string;
  perfil: 'admin' | 'cliente';
  nome?: string;
  email?: string;
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
    @InjectRepository(Estabelecimento)
    private readonly estabelecimentos: Repository<Estabelecimento>,
  ) {}

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

    setImmediate(() => {
      void this.processarLote(lote.id);
    });

    return this.obterLote(lote.id, usuario);
  }

  async listarLotes(usuario: PortalUsuario) {
    const where = usuario.perfil === 'cliente' ? { criadoPorId: usuario.sub } : {};
    const lotes = await this.lotes.find({
      where,
      order: { criadoEm: 'DESC' },
      take: 100,
    });

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
      paginacao: {
        pagina: currentPage,
        limite: take,
        total,
        paginas: Math.max(1, Math.ceil(total / take)),
      },
      data: itens.map((item) => this.toResultado(item)),
    };
  }

  async gerarDownloadCsv(id: string, usuario: PortalUsuario) {
    const lote = await this.buscarLoteComAcesso(id, usuario);
    const itens = await this.itens.find({
      where: { loteId: lote.id },
      order: { ordem: 'ASC' },
    });

    const header = [
      'ordem',
      'cnpj',
      'status',
      'razao_social',
      'nome_fantasia',
      'situacao_cadastral',
      'uf',
      'municipio',
      'municipio_ibge',
      'cep',
      'logradouro',
      'numero',
      'bairro',
      'cnae_fiscal_principal',
      'porte_empresa',
      'simples',
      'mei',
      'lat',
      'lng',
    ];

    const linhas = itens.map((item) => [
      item.ordem,
      item.cnpj,
      item.status,
      item.razaoSocial ?? '',
      item.nomeFantasia ?? '',
      item.situacaoCadastral ?? '',
      item.uf ?? '',
      item.municipio ?? '',
      item.municipioIbge ?? '',
      item.cep ?? '',
      item.logradouro ?? '',
      item.numero ?? '',
      item.bairro ?? '',
      item.cnaeFiscalPrincipal ?? '',
      item.porteEmpresa ?? '',
      item.opcaoSimples === null ? '' : item.opcaoSimples ? 'S' : 'N',
      item.opcaoMei === null ? '' : item.opcaoMei ? 'S' : 'N',
      item.lat ?? '',
      item.lng ?? '',
    ]);

    const conteudo = [header, ...linhas]
      .map((linha) => linha.map((valor) => this.escaparCsv(valor)).join(';'))
      .join('\n');

    return {
      nome: `painel-360-${lote.id}.csv`,
      conteudo,
    };
  }

  async obterGeoJson(id: string, usuario: PortalUsuario) {
    const lote = await this.buscarLoteComAcesso(id, usuario);
    const itens = await this.itens.find({
      where: { loteId: lote.id, encontrado: true },
      order: { ordem: 'ASC' },
    });

    return {
      type: 'FeatureCollection',
      features: itens
        .filter((item) => item.lat !== null && item.lng !== null)
        .map((item) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [Number(item.lng), Number(item.lat)],
          },
          properties: {
            id: item.id,
            ordem: item.ordem,
            cnpj: item.cnpj,
            razao_social: item.razaoSocial,
            nome_fantasia: item.nomeFantasia,
            situacao_cadastral: item.situacaoCadastral,
            uf: item.uf,
            municipio: item.municipio,
            municipio_ibge: item.municipioIbge,
            cep: item.cep,
            cnae_fiscal_principal: item.cnaeFiscalPrincipal,
            porte_empresa: item.porteEmpresa,
          },
        })),
    };
  }

  private async processarLote(loteId: string) {
    const lote = await this.lotes.findOne({ where: { id: loteId } });
    if (!lote) {
      return;
    }

    try {
      lote.status = 'processando';
      lote.iniciadoEm = new Date();
      lote.erro = null;
      await this.lotes.save(lote);

      const itens = await this.itens.find({
        where: { loteId: lote.id },
        order: { ordem: 'ASC' },
      });

      const batchSize = 500;
      let processados = 0;
      let encontrados = 0;
      let naoEncontrados = 0;

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
          item.payload = {
            cnpj: item.cnpj,
            razao_social: item.razaoSocial,
            nome_fantasia: item.nomeFantasia,
            situacao_cadastral: item.situacaoCadastral,
            uf: item.uf,
            municipio: item.municipio,
            municipio_ibge: item.municipioIbge,
            cep: item.cep,
            logradouro: item.logradouro,
            numero: item.numero,
            bairro: item.bairro,
            cnae_fiscal_principal: item.cnaeFiscalPrincipal,
            porte_empresa: item.porteEmpresa,
            simples: item.opcaoSimples,
            mei: item.opcaoMei,
            lat: item.lat,
            lng: item.lng,
          };
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

  private async buscarLoteComAcesso(id: string, usuario: PortalUsuario) {
    const lote = await this.lotes.findOne({ where: { id } });
    if (!lote) {
      throw new NotFoundException('Lote nao encontrado.');
    }

    if (usuario.perfil === 'cliente' && lote.criadoPorId !== usuario.sub) {
      throw new ForbiddenException('Acesso negado a este lote.');
    }

    return lote;
  }

  private async buscarDadosPorCnpjs(cnpjs: string[]) {
    if (!cnpjs.length) {
      return new Map<string, LoteLookupRow>();
    }

    const rows = await this.estabelecimentos
      .createQueryBuilder('e')
      .leftJoin(EmpresaRfb, 'emp', 'emp.cnpj_basico = e.cnpj_basico')
      .leftJoin(CepGeo, 'geo', 'geo.cep = e.cep')
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
      .addSelect('geo.lat', 'lat')
      .addSelect('geo.lng', 'lng')
      .where('CONCAT(e.cnpj_basico, e.cnpj_ordem, e.cnpj_dv) IN (:...cnpjs)', { cnpjs })
      .getRawMany<LoteLookupRow>();

    return new Map(rows.map((row) => [row.cnpj, row]));
  }

  private extrairCnpjsDoCsv(buffer: Buffer) {
    const conteudo = buffer.toString('utf8').replace(/^\uFEFF/, '');
    const linhas = conteudo
      .split(/\r?\n/)
      .map((linha) => linha.trim())
      .filter(Boolean);

    const vistos = new Set<string>();
    const cnpjs: string[] = [];

    for (const linha of linhas) {
      const colunas = linha.split(/[;,]/);
      for (const coluna of colunas) {
        const cnpj = coluna.replace(/\D/g, '');
        if (cnpj.length !== 14 || vistos.has(cnpj)) {
          continue;
        }
        vistos.add(cnpj);
        cnpjs.push(cnpj);
      }
    }

    return {
      totalLinhas: linhas.length,
      cnpjs,
    };
  }

  private toLoteResumo(lote: Painel360Lote) {
    return {
      id: lote.id,
      status: lote.status,
      nome: lote.arquivoNomeOriginal,
      nomeArquivo: lote.arquivoNomeOriginal,
      arquivoOriginal: lote.arquivoNomeOriginal,
      totalLinhas: lote.totalLinhas,
      totalResultados: lote.encontrados,
      resumo: {
        total: lote.totalCnpjs,
        processados: lote.processados,
        sucesso: lote.encontrados,
        erro: lote.naoEncontrados,
        geocodificados: lote.encontrados,
      },
      arquivo_nome_original: lote.arquivoNomeOriginal,
      total_linhas: lote.totalLinhas,
      total_cnpjs: lote.totalCnpjs,
      processados: lote.processados,
      encontrados: lote.encontrados,
      nao_encontrados: lote.naoEncontrados,
      criado_por_perfil: lote.criadoPorPerfil,
      criado_em: lote.criadoEm,
      iniciado_em: lote.iniciadoEm,
      concluido_em: lote.concluidoEm,
      erro: lote.erro,
    };
  }

  private toResultado(item: Painel360Item) {
    return {
      id: item.id,
      ordem: item.ordem,
      cnpj: item.cnpj,
      status: item.status,
      encontrado: item.encontrado,
      razao_social: item.razaoSocial,
      nome_fantasia: item.nomeFantasia,
      situacao_cadastral: item.situacaoCadastral,
      uf: item.uf,
      municipio: item.municipio,
      municipio_ibge: item.municipioIbge,
      cep: item.cep,
      logradouro: item.logradouro,
      numero: item.numero,
      bairro: item.bairro,
      cnae_fiscal_principal: item.cnaeFiscalPrincipal,
      porte_empresa: item.porteEmpresa,
      simples: item.opcaoSimples,
      mei: item.opcaoMei,
      lat: item.lat,
      lng: item.lng,
    };
  }

  private parseNullableNumber(valor: string | number | null) {
    if (valor === null || valor === undefined || valor === '') {
      return null;
    }
    const numero = Number(valor);
    return Number.isFinite(numero) ? numero : null;
  }

  private escaparCsv(valor: unknown) {
    const texto = String(valor ?? '');
    if (texto.includes(';') || texto.includes('"') || texto.includes('\n')) {
      return `"${texto.replace(/"/g, '""')}"`;
    }
    return texto;
  }
}

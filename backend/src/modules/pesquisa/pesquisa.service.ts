import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Estabelecimento } from '../../entities/estabelecimento.entity';
import { EmpresaRfb } from '../../entities/empresa-rfb.entity';
import { Simples } from '../../entities/simples.entity';
import { PesquisaDto } from './pesquisa.dto';

@Injectable()
export class PesquisaService {
  constructor(
    @InjectRepository(Estabelecimento) private estabs: Repository<Estabelecimento>,
    @InjectRepository(EmpresaRfb) private empresas: Repository<EmpresaRfb>,
    @InjectRepository(Simples) private simples: Repository<Simples>,
  ) {}

  async pesquisar(dto: PesquisaDto) {
    const limite = Math.min(dto.limite ?? 20, 100);

    const qb: SelectQueryBuilder<Estabelecimento> = this.estabs
      .createQueryBuilder('e')
      .leftJoin(EmpresaRfb, 'emp', 'emp.cnpj_basico = e.cnpj_basico')
      .select(['e.cnpj_basico', 'e.cnpj_ordem', 'e.cnpj_dv', 'e.nome_fantasia',
               'e.situacao_cadastral', 'e.uf', 'e.municipio', 'e.cep',
               'e.cnae_fiscal_principal', 'e.data_inicio_atividade',
               'emp.razao_social', 'emp.porte_empresa']);

    if (dto.atividade_principal_id) qb.andWhere('e.cnae_fiscal_principal = :cnae', { cnae: dto.atividade_principal_id });
    if (dto.atividade_secundaria_id) qb.andWhere('e.cnae_fiscal_secundaria LIKE :cnae2', { cnae2: `%${dto.atividade_secundaria_id}%` });
    if (dto.uf) qb.andWhere('e.uf = :uf', { uf: dto.uf.toUpperCase() });
    if (dto.municipio_ibge) qb.andWhere('e.municipio = :mun', { mun: dto.municipio_ibge });
    if (dto.razao_social) qb.andWhere('emp.razao_social ILIKE :rs', { rs: `%${dto.razao_social}%` });
    if (dto.nome_fantasia) qb.andWhere('e.nome_fantasia ILIKE :nf', { nf: `%${dto.nome_fantasia}%` });
    if (dto.natureza_juridica_id) qb.andWhere('emp.natureza_juridica = :natju', { natju: dto.natureza_juridica_id });
    if (dto.porte_id) qb.andWhere('emp.porte_empresa = :porte', { porte: dto.porte_id });
    if (dto.cep) qb.andWhere('e.cep = :cep', { cep: dto.cep.replace(/\D/g, '') });
    if (dto.situacao_cadastral) qb.andWhere('e.situacao_cadastral = :sit', { sit: dto.situacao_cadastral });
    if (dto.data_inicio_atividade_de) qb.andWhere('e.data_inicio_atividade >= :de', { de: dto.data_inicio_atividade_de });
    if (dto.data_inicio_atividade_ate) qb.andWhere('e.data_inicio_atividade <= :ate', { ate: dto.data_inicio_atividade_ate });

    if (dto.simples !== undefined || dto.mei !== undefined) {
      qb.leftJoin(Simples, 's', 's.cnpj_basico = e.cnpj_basico');
      if (dto.simples !== undefined) qb.andWhere('s.opcao_pelo_simples = :simp', { simp: dto.simples ? 'S' : 'N' });
      if (dto.mei !== undefined) qb.andWhere('s.opcao_pelo_mei = :mei', { mei: dto.mei ? 'S' : 'N' });
    }

    // Paginação por cursor (cursor = ultimo cnpj visto em base64)
    if (dto.cursor) {
      const decoded = Buffer.from(dto.cursor, 'base64url').toString('utf8');
      const { cnpj } = JSON.parse(decoded);
      qb.andWhere(`CONCAT(e.cnpj_basico, e.cnpj_ordem, e.cnpj_dv) > :cursor`, { cursor: cnpj });
    }

    qb.orderBy('e.cnpj_basico', 'ASC').addOrderBy('e.cnpj_ordem', 'ASC');
    qb.take(limite + 1);

    const registros = await qb.getRawMany();
    const temProxima = registros.length > limite;
    const data = registros.slice(0, limite);

    const ultimoCnpj = data.length ? `${data[data.length - 1].e_cnpj_basico}${data[data.length - 1].e_cnpj_ordem}${data[data.length - 1].e_cnpj_dv}` : null;
    const proximoCursor = temProxima && ultimoCnpj
      ? Buffer.from(JSON.stringify({ cnpj: ultimoCnpj })).toString('base64url')
      : null;

    return {
      paginacao: {
        limite,
        tem_proxima_pagina: temProxima,
        cursor_atual: dto.cursor ?? null,
        proximo_cursor: proximoCursor,
      },
      filtros_aplicados: dto,
      data: data.map(r => `${r.e_cnpj_basico}${r.e_cnpj_ordem}${r.e_cnpj_dv}`),
    };
  }
}

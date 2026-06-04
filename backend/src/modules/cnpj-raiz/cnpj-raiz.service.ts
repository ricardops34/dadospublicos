import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmpresaRfb } from '../../entities/empresa-rfb.entity';
import { Estabelecimento } from '../../entities/estabelecimento.entity';

@Injectable()
export class CnpjRaizService {
  constructor(
    @InjectRepository(EmpresaRfb) private empresas: Repository<EmpresaRfb>,
    @InjectRepository(Estabelecimento) private estabs: Repository<Estabelecimento>,
  ) {}

  async buscar(cnpjRaiz: string, pagina = 1, limite = 20) {
    const basico = cnpjRaiz.replace(/\D/g, '').substring(0, 8);

    const empresa = await this.empresas.findOne({ where: { cnpjBasico: basico } });
    if (!empresa) throw new NotFoundException('CNPJ raiz não encontrado.');

    limite = Math.min(limite, 100);
    const skip = (pagina - 1) * limite;

    const [registros, total] = await this.estabs.findAndCount({
      where: { cnpjBasico: basico },
      skip,
      take: limite,
      order: { cnpjOrdem: 'ASC' },
    });

    return {
      paginacao: {
        pagina_atual: pagina,
        total_paginas: Math.ceil(total / limite),
        total_registros: total,
        limite,
      },
      cnpj_raiz: basico,
      razao_social: empresa.razaoSocial,
      estabelecimentos: registros.map(e => ({
        cnpj: `${e.cnpjBasico}${e.cnpjOrdem}${e.cnpjDv}`,
        tipo: e.identificadorMatrizFilial === '1' ? 'Matriz' : 'Filial',
        nome_fantasia: e.nomeFantasia,
        situacao_cadastral: e.situacaoCadastral,
        data_inicio_atividade: e.dataInicioAtividade,
        uf: e.uf,
        municipio: e.municipio,
        cep: e.cep,
        email: e.email,
        telefone: e.ddd1 && e.telefone1 ? `(${e.ddd1}) ${e.telefone1}` : null,
      })),
    };
  }
}

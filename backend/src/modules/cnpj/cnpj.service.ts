import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisCacheService } from '../redis-cache/redis-cache.service';
import { EmpresaRfb } from '../../entities/empresa-rfb.entity';
import { Estabelecimento } from '../../entities/estabelecimento.entity';
import { Socio } from '../../entities/socio.entity';
import { Simples } from '../../entities/simples.entity';
import { Cnae } from '../../entities/cnae.entity';
import { Municipio } from '../../entities/municipio.entity';
import { NaturezaJuridica } from '../../entities/natureza-juridica.entity';

const SITUACOES: Record<string, string> = {
  '01': 'Nula', '02': 'Ativa', '03': 'Suspensa', '04': 'Inapta', '08': 'Baixada',
};

const PORTES: Record<string, string> = {
  '00': 'Não informado', '01': 'Micro Empresa', '03': 'Empresa de Pequeno Porte', '05': 'Demais',
};

const FAIXAS_ETARIAS: Record<string, string> = {
  '0': 'Não se aplica', '1': '0 a 12 anos', '2': '13 a 20 anos', '3': '21 a 30 anos',
  '4': '31 a 40 anos', '5': '41 a 50 anos', '6': '51 a 60 anos', '7': '61 a 70 anos',
  '8': '71 a 80 anos', '9': 'Maiores de 80 anos',
};

@Injectable()
export class CnpjService {
  constructor(
    @InjectRepository(EmpresaRfb) private empresas: Repository<EmpresaRfb>,
    @InjectRepository(Estabelecimento) private estabs: Repository<Estabelecimento>,
    @InjectRepository(Socio) private socios: Repository<Socio>,
    @InjectRepository(Simples) private simples: Repository<Simples>,
    @InjectRepository(Cnae) private cnaes: Repository<Cnae>,
    @InjectRepository(Municipio) private municipios: Repository<Municipio>,
    @InjectRepository(NaturezaJuridica) private naturezas: Repository<NaturezaJuridica>,
    private cache: RedisCacheService,
  ) {}

  async buscar(cnpj: string) {
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    if (cnpjLimpo.length !== 14) throw new NotFoundException('CNPJ inválido.');

    const cacheKey = `cnpj:${cnpjLimpo}`;
    const cached = await this.cache.get<any>(cacheKey);
    if (cached) return cached;

    const basico = cnpjLimpo.substring(0, 8);
    const ordem = cnpjLimpo.substring(8, 12);
    const dv = cnpjLimpo.substring(12, 14);

    const [empresa, estab, socios, simples] = await Promise.all([
      this.empresas.findOne({ where: { cnpjBasico: basico } }),
      this.estabs.findOne({ where: { cnpjBasico: basico, cnpjOrdem: ordem, cnpjDv: dv } }),
      this.socios.find({ where: { cnpjBasico: basico } }),
      this.simples.findOne({ where: { cnpjBasico: basico } }),
    ]);

    if (!estab) throw new NotFoundException('CNPJ não encontrado.');

    const [cnaeObj, municipioObj, naturezaObj] = await Promise.all([
      estab.cnaeFiscalPrincipal ? this.cnaes.findOne({ where: { codigo: estab.cnaeFiscalPrincipal } }) : null,
      estab.municipio ? this.municipios.findOne({ where: { codigoRfb: estab.municipio } }) : null,
      empresa?.naturezaJuridica ? this.naturezas.findOne({ where: { codigo: empresa.naturezaJuridica } }) : null,
    ]);

    const cnaesSecundarios = estab.cnaeFiscalSecundaria
      ? estab.cnaeFiscalSecundaria.split(',').map(c => c.trim()).filter(Boolean)
      : [];

    const result = {
      cnpj_raiz: basico,
      razao_social: empresa?.razaoSocial ?? null,
      capital_social: empresa?.capitalSocial ?? null,
      porte: empresa?.porteEmpresa ? { id: empresa.porteEmpresa, descricao: PORTES[empresa.porteEmpresa] ?? empresa.porteEmpresa } : null,
      natureza_juridica: naturezaObj ? { id: naturezaObj.codigo, descricao: naturezaObj.descricao } : null,
      atualizado_em: empresa?.atualizadoEm ?? estab.atualizadoEm,
      estabelecimento: {
        cnpj: cnpjLimpo,
        cnpj_raiz: basico,
        cnpj_ordem: ordem,
        cnpj_digito_verificador: dv,
        tipo: estab.identificadorMatrizFilial === '1' ? 'Matriz' : 'Filial',
        nome_fantasia: estab.nomeFantasia,
        situacao_cadastral: SITUACOES[estab.situacaoCadastral] ?? estab.situacaoCadastral,
        data_situacao_cadastral: estab.dataSituacaoCadastral,
        data_inicio_atividade: estab.dataInicioAtividade,
        municipio: municipioObj ? { id: municipioObj.codigoRfb, nome: municipioObj.nome, ibge_id: municipioObj.codigoIbge } : null,
        uf: estab.uf,
        cep: estab.cep,
        logradouro: estab.logradouro,
        numero: estab.numero,
        complemento: estab.complemento,
        bairro: estab.bairro,
        tipo_logradouro: estab.tipoLogradouro,
        ddd1: estab.ddd1,
        telefone1: estab.telefone1,
        ddd2: estab.ddd2,
        telefone2: estab.telefone2,
        email: estab.email,
        atividade_principal: cnaeObj ? { id: cnaeObj.codigo, descricao: cnaeObj.descricao } : null,
        atividades_secundarias: cnaesSecundarios,
        situacao_especial: estab.situacaoEspecial,
        data_situacao_especial: estab.dataSituacaoEspecial,
      },
      socios: socios.map(s => ({
        nome: s.nomeSocio,
        tipo: s.identificadorSocio === '1' ? 'Pessoa Jurídica' : s.identificadorSocio === '2' ? 'Pessoa Física' : 'Estrangeiro',
        qualificacao: { id: s.qualificacaoSocio },
        data_entrada: s.dataEntradaSociedade,
        faixa_etaria: s.faixaEtaria ? FAIXAS_ETARIAS[s.faixaEtaria] : null,
        cnpj_cpf: s.cnpjCpfSocio,
      })),
      simples: simples ? {
        simples: simples.opcaoPeloSimples === 'S' ? 'Sim' : 'Não',
        data_opcao_simples: simples.dataOpcaoSimples,
        data_exclusao_simples: simples.dataExclusaoSimples,
        mei: simples.opcaoPeloMei === 'S' ? 'Sim' : 'Não',
        data_opcao_mei: simples.dataOpcaoMei,
        data_exclusao_mei: simples.dataExclusaoMei,
        atualizado_em: simples.atualizadoEm,
      } : null,
    };

    await this.cache.set(cacheKey, result, 86400);
    return result;
  }
}

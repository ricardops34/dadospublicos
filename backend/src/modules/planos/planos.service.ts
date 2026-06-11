import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plano } from '../../entities/plano.entity';
import { RecursoPlano } from '../../entities/recurso-plano.entity';
import { PlanoRecurso } from '../../entities/plano-recurso.entity';
import { CreatePlanoDto } from './dto/create-plano.dto';
import { UpdatePlanoDto } from './dto/update-plano.dto';

type SeedPlano = Omit<CreatePlanoDto, 'nome' | 'slug'> & {
  nome: string;
  slug: string;
  descricao: string;
  maisPopular: boolean;
  recursos: Array<{ slug: string; descricaoExibicao: string }>;
};

@Injectable()
export class PlanosService {
  constructor(
    @InjectRepository(Plano, 'buscadados') private planos: Repository<Plano>,
    @InjectRepository(RecursoPlano, 'buscadados') private recursos: Repository<RecursoPlano>,
    @InjectRepository(PlanoRecurso, 'buscadados') private planosRecursos: Repository<PlanoRecurso>,
  ) { }

  async findAll(apenasAtivos = true) {
    const planos = await this.planos.find({
      where: apenasAtivos ? { ativo: true, exibirNaLp: true } : {},
      relations: ['recursos', 'recursos.recurso'],
      order: { ordem: 'ASC' },
    });
    return planos.map((plano) => this.toPublicPayload(plano));
  }

  async findOne(id: string) {
    const plano = await this.planos.findOne({
      where: { id },
      relations: ['recursos', 'recursos.recurso'],
    });
    if (!plano) throw new NotFoundException('Plano não encontrado.');
    return this.toPublicPayload(plano);
  }

  async findBySlug(slug: string) {
    const plano = await this.planos.findOne({ where: { slug } });
    if (!plano) throw new NotFoundException(`Plano "${slug}" não encontrado.`);
    return plano;
  }

  async create(dto: CreatePlanoDto) {
    const existente = await this.planos.findOne({ where: { slug: dto.slug } });
    if (existente) throw new ConflictException(`Slug "${dto.slug}" já existe.`);
    return this.planos.save(this.planos.create(dto));
  }

  async update(id: string, dto: UpdatePlanoDto) {
    const plano = await this.planos.findOne({ where: { id } });
    if (!plano) throw new NotFoundException('Plano não encontrado.');
    Object.assign(plano, dto);
    return this.planos.save(plano);
  }

  // ─── Recursos (catálogo) ────────────────────────────────────────────────────

  findAllRecursos() {
    return this.recursos.find({ order: { nome: 'ASC' } });
  }

  async createRecurso(dto: { nome: string; slug: string }) {
    const existente = await this.recursos.findOne({ where: { slug: dto.slug } });
    if (existente) throw new ConflictException(`Slug "${dto.slug}" já existe.`);
    return this.recursos.save(this.recursos.create(dto));
  }

  async updateRecurso(id: string, dto: { nome?: string; ativo?: boolean }) {
    const recurso = await this.recursos.findOne({ where: { id } });
    if (!recurso) throw new NotFoundException('Recurso não encontrado.');
    Object.assign(recurso, dto);
    return this.recursos.save(recurso);
  }

  async removeRecurso(id: string) {
    const recurso = await this.recursos.findOne({ where: { id } });
    if (!recurso) throw new NotFoundException('Recurso não encontrado.');
    recurso.ativo = false;
    return this.recursos.save(recurso);
  }

  // ─── Recurso × Plano (associações) ──────────────────────────────────────────

  findRecursosDePlano(planoId: string) {
    return this.planosRecursos.find({
      where: { planoId },
      relations: ['recurso'],
      order: { ordem: 'ASC' },
    });
  }

  async addRecursoAoPlano(planoId: string, dto: { recursoId: string; descricaoExibicao: string; ordem?: number }) {
    const plano = await this.planos.findOne({ where: { id: planoId } });
    if (!plano) throw new NotFoundException('Plano não encontrado.');
    const existente = await this.planosRecursos.findOne({ where: { planoId, recursoId: dto.recursoId } });
    if (existente) throw new ConflictException('Recurso já associado a este plano.');
    return this.planosRecursos.save(
      this.planosRecursos.create({ planoId, recursoId: dto.recursoId, descricaoExibicao: dto.descricaoExibicao, ordem: dto.ordem ?? 0 }),
    );
  }

  async updateRecursoDoPlano(id: string, dto: { descricaoExibicao?: string; ordem?: number }) {
    const assoc = await this.planosRecursos.findOne({ where: { id } });
    if (!assoc) throw new NotFoundException('Associação não encontrada.');
    Object.assign(assoc, dto);
    return this.planosRecursos.save(assoc);
  }

  async removeRecursoDoPlano(id: string) {
    const assoc = await this.planosRecursos.findOne({ where: { id } });
    if (!assoc) throw new NotFoundException('Associação não encontrada.');
    return this.planosRecursos.remove(assoc);
  }

  async remove(id: string) {
    const plano = await this.planos.findOne({ where: { id } });
    if (!plano) throw new NotFoundException('Plano não encontrado.');
    plano.ativo = false;
    await this.planos.save(plano);
  }

  async seed() {
    const recursosPadrao = [
      { slug: 'limite-gratuito', nome: 'Limite Gratuito' },
      { slug: 'limite-basico', nome: 'Limite Básico' },
      { slug: 'limite-intermediario', nome: 'Limite Intermediário' },
      { slug: 'limite-avancado', nome: 'Limite Avançado' },
      { slug: 'limite-premium', nome: 'Limite Premium' },
      { slug: 'consulta-cnpj', nome: 'Consulta por CNPJ' },
      { slug: 'consulta-cep', nome: 'Consulta de CEP' },
      { slug: 'inscricao-estadual', nome: 'Inscrição Estadual' },
      { slug: 'inscricao-suframa', nome: 'Inscrição Suframa' },
      { slug: 'validacao-suframa', nome: 'Validação Suframa' },
      { slug: 'filtros-pesquisa', nome: 'Filtros de Pesquisa' },
      { slug: 'painel-360', nome: 'Painel 360' },
    ];

    const planosPadrao: SeedPlano[] = [

      {
        nome: 'Gratuito',
        slug: 'gratuito',
        descricao: 'Comece gratuitamente e explore a plataforma.',
        precoMensal: 0,
        precoSemestral: 0,
        precoAnual: 0,
        limiteMensal: 1000,
        rateLimitPorMinuto: 3,
        rateLimitPorHora: null,
        acessoCnpj: true,
        acessoCnpjRaiz: false,
        acessoPesquisa: false,
        acessoGeocode: false,
        acessoSuframa: false,
        acessoMapa: false,
        exibirNaLp: true,
        ordem: 1,
        maisPopular: false,
        seloDestaque: null,
        recursos: [
          { slug: 'limite-gratuito', descricaoExibicao: '1.000 requisições/mês' },
          { slug: 'consulta-cnpj', descricaoExibicao: 'Consulta por CNPJ' },
        ],
      },
      {
        nome: 'Básico',
        slug: 'basico',
        descricao: 'Entrada para integrações de menor volume.',
        precoMensal: 99,
        precoSemestral: 534.6,
        precoAnual: 1009.8,
        limiteMensal: 160000,
        rateLimitPorMinuto: 120,
        rateLimitPorHora: null,
        acessoCnpj: true,
        acessoCnpjRaiz: false,
        acessoPesquisa: false,
        acessoGeocode: true,
        acessoSuframa: true,
        acessoMapa: false,
        exibirNaLp: true,
        ordem: 2,
        maisPopular: false,
        seloDestaque: null,
        recursos: [
          { slug: 'limite-basico', descricaoExibicao: '160.000 requisições/mês' },
          { slug: 'consulta-cnpj', descricaoExibicao: 'Consulta por CNPJ' },
          { slug: 'consulta-cep', descricaoExibicao: 'Consulta por CEP' },
          { slug: 'inscricao-estadual', descricaoExibicao: 'Inscrição Estadual' },
          { slug: 'inscricao-suframa', descricaoExibicao: 'Inscrição Suframa' },
        ],
      },
      {
        nome: 'Intermediário',
        slug: 'intermediario',
        descricao: 'Mais volume com cobertura ampliada para dados cadastrais.',
        precoMensal: 199,
        precoSemestral: 1074.6,
        precoAnual: 2029.8,
        limiteMensal: 300000,
        rateLimitPorMinuto: 300,
        rateLimitPorHora: null,
        acessoCnpj: true,
        acessoCnpjRaiz: true,
        acessoPesquisa: false,
        acessoGeocode: true,
        acessoSuframa: true,
        acessoMapa: false,
        exibirNaLp: true,
        ordem: 3,
        maisPopular: false,
        seloDestaque: null,
        recursos: [
          { slug: 'limite-intermediario', descricaoExibicao: '300.000 requisições/mês' },
          { slug: 'consulta-cnpj', descricaoExibicao: 'Consulta por CNPJ' },
          { slug: 'consulta-cep', descricaoExibicao: 'Consulta por CEP' },
          { slug: 'inscricao-estadual', descricaoExibicao: 'Inscrições Estaduais' },
          { slug: 'inscricao-suframa', descricaoExibicao: 'Inscrições Suframa' },
          { slug: 'validacao-suframa', descricaoExibicao: 'Validação Suframa' },
        ],
      },
      {
        nome: 'Avançado',
        slug: 'avancado',
        descricao: 'Plano de maior giro com destaque comercial na landing.',
        precoMensal: 299,
        precoSemestral: 1614.6,
        precoAnual: 3049.8,
        limiteMensal: 600000,
        rateLimitPorMinuto: 600,
        rateLimitPorHora: null,
        acessoCnpj: true,
        acessoCnpjRaiz: true,
        acessoPesquisa: false,
        acessoGeocode: true,
        acessoSuframa: true,
        acessoMapa: false,
        exibirNaLp: true,
        ordem: 4,
        maisPopular: true,
        seloDestaque: 'Mais popular',
        recursos: [
          { slug: 'limite-avancado', descricaoExibicao: '600.000 requisições/mês' },
          { slug: 'consulta-cnpj', descricaoExibicao: 'Consulta por CNPJ' },
          { slug: 'consulta-cep', descricaoExibicao: 'Consulta por CEP' },
          { slug: 'inscricao-estadual', descricaoExibicao: 'Inscrições Estaduais' },
          { slug: 'inscricao-suframa', descricaoExibicao: 'Inscrições Suframa' },
          { slug: 'validacao-suframa', descricaoExibicao: 'Validação Suframa' },
        ],
      },
      {
        nome: 'Premium',
        slug: 'premium',
        descricao: 'Maior volume e filtros avançados de prospecção.',
        precoMensal: 499,
        precoSemestral: 2694.6,
        precoAnual: 5089.8,
        limiteMensal: 1000000,
        rateLimitPorMinuto: 1200,
        rateLimitPorHora: null,
        acessoCnpj: true,
        acessoCnpjRaiz: true,
        acessoPesquisa: true,
        acessoGeocode: true,
        acessoSuframa: true,
        acessoMapa: false,
        exibirNaLp: true,
        ordem: 5,
        maisPopular: false,
        seloDestaque: null,
        recursos: [
          { slug: 'limite-premium', descricaoExibicao: '1.000.000 requisições/mês' },
          { slug: 'consulta-cnpj', descricaoExibicao: 'Consulta por CNPJ' },
          { slug: 'consulta-cep', descricaoExibicao: 'Consulta por CEP' },
          { slug: 'inscricao-estadual', descricaoExibicao: 'Inscrições Estaduais' },
          { slug: 'inscricao-suframa', descricaoExibicao: 'Inscrições Suframa' },
          { slug: 'validacao-suframa', descricaoExibicao: 'Validação Suframa' },
          { slug: 'filtros-pesquisa', descricaoExibicao: 'Filtros de Pesquisa' },
          { slug: 'painel-360', descricaoExibicao: 'Painel 360 (Em breve)' },
        ],
      },
    ];

    const recursosPorSlug = new Map<string, RecursoPlano>();

    for (const recursoPadrao of recursosPadrao) {
      let recurso = await this.recursos.findOne({ where: { slug: recursoPadrao.slug } });

      if (!recurso) {
        recurso = this.recursos.create(recursoPadrao);
      } else {
        recurso.nome = recursoPadrao.nome;
        recurso.ativo = true;
      }

      recurso = await this.recursos.save(recurso);
      recursosPorSlug.set(recurso.slug, recurso);
    }

    for (const planoPadrao of planosPadrao) {
      const { recursos, ...dadosPlano } = planoPadrao;
      let plano = await this.planos.findOne({ where: { slug: dadosPlano.slug } });

      if (!plano) {
        plano = this.planos.create(dadosPlano);
      } else {
        Object.assign(plano, dadosPlano, { ativo: true });
      }

      plano = await this.planos.save(plano);
      await this.planos.update(plano.id, {
        ...dadosPlano,
        ativo: true,
      });
      await this.planosRecursos.delete({ planoId: plano.id });

      for (const [indice, recursoPlano] of recursos.entries()) {
        const recurso = recursosPorSlug.get(recursoPlano.slug);
        if (!recurso) continue;

        await this.planosRecursos.save(this.planosRecursos.create({
          planoId: plano.id,
          recursoId: recurso.id,
          descricaoExibicao: recursoPlano.descricaoExibicao,
          ordem: indice + 1,
        }));
      }
    }

    return this.findAll(false);
  }

  private toPublicPayload(plano: Plano) {
    const recursos = [...(plano.recursos ?? [])]
      .sort((a, b) => a.ordem - b.ordem)
      .map((item) => ({
        id: item.id,
        slug: item.recurso?.slug,
        nome: item.recurso?.nome,
        descricaoExibicao: item.descricaoExibicao,
        ordem: item.ordem,
      }));

    return {
      ...plano,
      destaque: plano.maisPopular || !!plano.seloDestaque,
      recursos,
    };
  }
}

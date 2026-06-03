import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plano } from '../../entities/plano.entity';
import { CreatePlanoDto } from './dto/create-plano.dto';
import { UpdatePlanoDto } from './dto/update-plano.dto';

@Injectable()
export class PlanosService {
  constructor(@InjectRepository(Plano) private planos: Repository<Plano>) {}

  findAll(apenasAtivos = true) {
    return this.planos.find({
      where: apenasAtivos ? { ativo: true } : {},
      order: { ordem: 'ASC' },
    });
  }

  async findOne(id: string) {
    const plano = await this.planos.findOne({ where: { id } });
    if (!plano) throw new NotFoundException('Plano não encontrado.');
    return plano;
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
    const plano = await this.findOne(id);
    Object.assign(plano, dto);
    return this.planos.save(plano);
  }

  async remove(id: string) {
    const plano = await this.findOne(id);
    plano.ativo = false;
    await this.planos.save(plano);
  }

  async seed() {
    const planosPadrao = [
      { nome: 'Gratuito',      slug: 'gratuito',     precoMensal: 0,      limiteMensal: null, rateLimitPorMinuto: 3,    acessoCnpj: true,  acessoCnpjRaiz: false, acessoPesquisa: false, acessoGeocode: false, acessoSuframa: false, acessoMapa: false, ordem: 0 },
      { nome: 'Básico',        slug: 'basico',        precoMensal: 49.90,  limiteMensal: 5000, rateLimitPorMinuto: 120,  acessoCnpj: true,  acessoCnpjRaiz: true,  acessoPesquisa: false, acessoGeocode: true,  acessoSuframa: true,  acessoMapa: false, ordem: 1 },
      { nome: 'Profissional',  slug: 'profissional',  precoMensal: 149.90, limiteMensal: 30000,rateLimitPorMinuto: 600,  acessoCnpj: true,  acessoCnpjRaiz: true,  acessoPesquisa: false, acessoGeocode: true,  acessoSuframa: true,  acessoMapa: true,  ordem: 2 },
      { nome: 'Premium',       slug: 'premium',       precoMensal: 349.90, limiteMensal: 100000,rateLimitPorMinuto: 2000, acessoCnpj: true, acessoCnpjRaiz: true,  acessoPesquisa: true,  acessoGeocode: true,  acessoSuframa: true,  acessoMapa: true,  ordem: 3 },
    ];

    for (const p of planosPadrao) {
      const existe = await this.planos.findOne({ where: { slug: p.slug } });
      if (!existe) await this.planos.save(this.planos.create(p));
    }
    return this.findAll(false);
  }
}

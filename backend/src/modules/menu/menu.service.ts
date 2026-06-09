import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Perfil } from '../../entities/perfil.entity';
import { MenuModulo } from '../../entities/menu-modulo.entity';
import { MenuRotina } from '../../entities/menu-rotina.entity';
import { PerfilRotina } from '../../entities/perfil-rotina.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Perfil, 'buscadados')
    private perfilRepo: Repository<Perfil>,

    @InjectRepository(MenuModulo, 'buscadados')
    private moduloRepo: Repository<MenuModulo>,

    @InjectRepository(MenuRotina, 'buscadados')
    private rotinaRepo: Repository<MenuRotina>,

    @InjectRepository(PerfilRotina, 'buscadados')
    private perfilRotinaRepo: Repository<PerfilRotina>,
  ) {}

  // ──────────────────────────────────────────────────────────────────────────
  // Menu dinâmico
  // ──────────────────────────────────────────────────────────────────────────

  async getMenuParaPerfil(perfilCodigo: string): Promise<any[]> {
    const perfil = await this.perfilRepo.findOne({ where: { codigo: perfilCodigo, ativo: true } });
    if (!perfil) return [];

    const perfilRotinas = await this.perfilRotinaRepo.find({
      where: { perfilId: perfil.id },
      relations: ['rotina', 'rotina.modulo'],
    });

    const rotinas = perfilRotinas
      .map((pr) => pr.rotina)
      .filter((r) => r && r.ativo);

    // Ordena por modulo.ordem → rotina.ordem
    rotinas.sort((a, b) => {
      const oA = (a.modulo?.ordem ?? 999) * 10000 + a.ordem;
      const oB = (b.modulo?.ordem ?? 999) * 10000 + b.ordem;
      return oA - oB;
    });

    // Agrupa por módulo
    const modulosMap = new Map<string, { modulo: MenuModulo; rotinas: MenuRotina[] }>();
    const standalone: MenuRotina[] = [];

    for (const rotina of rotinas) {
      if (rotina.moduloId && rotina.modulo) {
        const key = rotina.moduloId;
        if (!modulosMap.has(key)) {
          modulosMap.set(key, { modulo: rotina.modulo, rotinas: [] });
        }
        modulosMap.get(key)!.rotinas.push(rotina);
      } else {
        standalone.push(rotina);
      }
    }

    const toItem = (rotina: MenuRotina): any => {
      const item: any = {
        label: rotina.nome,
      };
      if (rotina.shortLabel) item.shortLabel = rotina.shortLabel;
      if (rotina.icone) item.icon = rotina.icone;
      if (rotina.tipo === 'danger') item.type = 'danger';

      if (rotina.rota === '/sair') {
        item.link = '/sair';
        item.action = '__sair__';
      } else if (rotina.rota) {
        item.link = rotina.rota;
      }

      return item;
    };

    const result: any[] = [];

    // Módulos com subItems (mantém a ordem de módulo)
    const modulosOrdenados = Array.from(modulosMap.values()).sort(
      (a, b) => a.modulo.ordem - b.modulo.ordem,
    );

    // Itens standalone que são de topo (sem módulo)
    // Intercalamos: primeiro os itens standalone sem módulo, depois módulos, de acordo com a ordem global
    // Para simplificar, itens sem módulo vão no topo, módulos depois
    for (const rotina of standalone) {
      if (rotina.rota !== '/sair') {
        result.push(toItem(rotina));
      }
    }

    for (const { modulo, rotinas: rots } of modulosOrdenados) {
      result.push({
        label: modulo.nome,
        shortLabel: modulo.shortLabel ?? undefined,
        icon: modulo.icone ?? undefined,
        subItems: rots.map(toItem),
      });
    }

    // Itens danger (sair) sempre no final
    for (const rotina of standalone) {
      if (rotina.rota === '/sair') {
        result.push(toItem(rotina));
      }
    }

    return result;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Perfis CRUD
  // ──────────────────────────────────────────────────────────────────────────

  findAllPerfis() {
    return this.perfilRepo.find({ order: { nome: 'ASC' } });
  }

  async findOnePerfil(id: string) {
    const p = await this.perfilRepo.findOne({ where: { id } });
    if (!p) throw new NotFoundException('Perfil não encontrado.');
    return p;
  }

  async upsertPerfil(dto: any) {
    const existing = dto.id
      ? await this.perfilRepo.findOne({ where: { id: dto.id } })
      : await this.perfilRepo.findOne({ where: { codigo: dto.codigo } });

    if (existing) {
      Object.assign(existing, dto);
      return this.perfilRepo.save(existing);
    }
    return this.perfilRepo.save(this.perfilRepo.create(dto));
  }

  async removePerfil(id: string) {
    const p = await this.findOnePerfil(id);
    return this.perfilRepo.remove(p);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Módulos CRUD
  // ──────────────────────────────────────────────────────────────────────────

  async findAllModulos(page = 1, pageSize = 50) {
    const [items, total] = await this.moduloRepo.findAndCount({
      order: { ordem: 'ASC', nome: 'ASC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { items, hasNext: page * pageSize < total };
  }

  async findOneModulo(id: string) {
    const m = await this.moduloRepo.findOne({ where: { id } });
    if (!m) throw new NotFoundException('Módulo não encontrado.');
    return m;
  }

  async upsertModulo(dto: any) {
    const existing = dto.id ? await this.moduloRepo.findOne({ where: { id: dto.id } }) : null;
    if (existing) {
      Object.assign(existing, dto);
      return this.moduloRepo.save(existing);
    }
    return this.moduloRepo.save(this.moduloRepo.create(dto));
  }

  async removeModulo(id: string) {
    const m = await this.findOneModulo(id);
    return this.moduloRepo.remove(m);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Rotinas CRUD
  // ──────────────────────────────────────────────────────────────────────────

  async findAllRotinas(page = 1, pageSize = 50, moduloId?: string) {
    const where: any = {};
    if (moduloId) where.moduloId = moduloId;

    const [items, total] = await this.rotinaRepo.findAndCount({
      where,
      relations: ['modulo'],
      order: { ordem: 'ASC', nome: 'ASC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const mapped = items.map((r) => ({
      ...r,
      'modulo.nome': r.modulo?.nome ?? null,
    }));

    return { items: mapped, hasNext: page * pageSize < total };
  }

  async findOneRotina(id: string) {
    const r = await this.rotinaRepo.findOne({ where: { id }, relations: ['modulo'] });
    if (!r) throw new NotFoundException('Rotina não encontrada.');
    return r;
  }

  async upsertRotina(dto: any) {
    const existing = dto.id ? await this.rotinaRepo.findOne({ where: { id: dto.id } }) : null;
    if (existing) {
      Object.assign(existing, dto);
      return this.rotinaRepo.save(existing);
    }
    return this.rotinaRepo.save(this.rotinaRepo.create(dto));
  }

  async removeRotina(id: string) {
    const r = await this.findOneRotina(id);
    return this.rotinaRepo.remove(r);
  }

  getRotinasDoModulo(moduloId: string) {
    return this.rotinaRepo.find({ where: { moduloId }, order: { ordem: 'ASC' } });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // PerfilRotina
  // ──────────────────────────────────────────────────────────────────────────

  async getRotinaIdsDoPerfil(perfilId: string): Promise<string[]> {
    const rows = await this.perfilRotinaRepo.find({ where: { perfilId } });
    return rows.map((r) => r.rotinaId);
  }

  async setRotinasParaPerfil(perfilId: string, rotinaIds: string[]) {
    await this.perfilRotinaRepo.delete({ perfilId });
    if (rotinaIds.length === 0) return;
    const entities = rotinaIds.map((rotinaId) =>
      this.perfilRotinaRepo.create({ perfilId, rotinaId }),
    );
    return this.perfilRotinaRepo.save(entities);
  }
}

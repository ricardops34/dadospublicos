import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VisitaLp } from '../../entities/visita-lp.entity';
import { EventoLp, TipoEvento } from '../../entities/evento-lp.entity';

@Injectable()
export class AnalyticsLpService {
  constructor(
    @InjectRepository(VisitaLp) private visitas: Repository<VisitaLp>,
    @InjectRepository(EventoLp) private eventos: Repository<EventoLp>,
  ) {}

  async registrarVisita(dto: {
    sessionId: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmTerm?: string;
    utmContent?: string;
    referrer?: string;
    landingUrl?: string;
    deviceType?: 'mobile' | 'tablet' | 'desktop';
    browser?: string;
    os?: string;
    screenWidth?: number;
  }) {
    const existe = await this.visitas.findOne({ where: { sessionId: dto.sessionId } });
    if (existe) return existe;

    const visita = this.visitas.create({
      sessionId: dto.sessionId,
      utmSource: dto.utmSource ?? null,
      utmMedium: dto.utmMedium ?? null,
      utmCampaign: dto.utmCampaign ?? null,
      utmTerm: dto.utmTerm ?? null,
      utmContent: dto.utmContent ?? null,
      referrer: dto.referrer ?? null,
      landingUrl: dto.landingUrl ?? null,
      deviceType: dto.deviceType ?? null,
      browser: dto.browser ?? null,
      os: dto.os ?? null,
      screenWidth: dto.screenWidth ?? null,
    });
    return this.visitas.save(visita);
  }

  async atualizarCookies(sessionId: string, aceito: boolean) {
    await this.visitas.update(
      { sessionId },
      { cookiesAceitos: aceito, cookiesAceitosEm: new Date() },
    );
    return { ok: true };
  }

  async registrarEvento(sessionId: string, tipo: TipoEvento, dados?: Record<string, any>) {
    const evento = this.eventos.create({ sessionId, tipo, dados: dados ?? null });
    return this.eventos.save(evento);
  }

  async registrarConversao(sessionId: string, clienteId: string) {
    await this.visitas.update({ sessionId }, { clienteId, converteuEm: new Date() });
    return { ok: true };
  }

  // --- Relatórios Admin ---

  async relatorio(dias = 30) {
    const desde = new Date();
    desde.setDate(desde.getDate() - dias);

    const [totalVisitas, totalConversoes] = await Promise.all([
      this.visitas.count({ where: { criadoEm: { $gte: desde } as any } }),
      this.visitas.count({ where: { clienteId: { $not: null } as any, criadoEm: { $gte: desde } as any } }),
    ]);

    const porFonte = await this.visitas
      .createQueryBuilder('v')
      .select('COALESCE(v.utm_source, \'direto\')', 'fonte')
      .addSelect('COUNT(*)', 'total')
      .where('v.criado_em >= :desde', { desde })
      .groupBy('fonte')
      .orderBy('total', 'DESC')
      .getRawMany();

    const porCampanha = await this.visitas
      .createQueryBuilder('v')
      .select('v.utm_campaign', 'campanha')
      .addSelect('COUNT(*)', 'total')
      .addSelect('COUNT(v.cliente_id)', 'conversoes')
      .where('v.criado_em >= :desde', { desde })
      .andWhere('v.utm_campaign IS NOT NULL')
      .groupBy('v.utm_campaign')
      .orderBy('total', 'DESC')
      .getRawMany();

    const porDispositivo = await this.visitas
      .createQueryBuilder('v')
      .select('COALESCE(v.device_type, \'desconhecido\')', 'dispositivo')
      .addSelect('COUNT(*)', 'total')
      .where('v.criado_em >= :desde', { desde })
      .groupBy('dispositivo')
      .getRawMany();

    const secoesVistas = await this.eventos
      .createQueryBuilder('e')
      .select("e.dados->>'secao'", 'secao')
      .addSelect('COUNT(*)', 'total')
      .where('e.tipo = :tipo', { tipo: 'secao_vista' })
      .andWhere('e.criado_em >= :desde', { desde })
      .andWhere("e.dados->>'secao' IS NOT NULL")
      .groupBy('secao')
      .orderBy('total', 'DESC')
      .getRawMany();

    const scrollMedio = await this.eventos
      .createQueryBuilder('e')
      .select("AVG(CAST(e.dados->>'percent' AS INTEGER))", 'media')
      .where('e.tipo = :tipo', { tipo: 'scroll' })
      .andWhere('e.criado_em >= :desde', { desde })
      .getRawOne();

    const porDia = await this.visitas
      .createQueryBuilder('v')
      .select("DATE_TRUNC('day', v.criado_em)", 'dia')
      .addSelect('COUNT(*)', 'visitas')
      .addSelect('COUNT(v.cliente_id)', 'conversoes')
      .where('v.criado_em >= :desde', { desde })
      .groupBy('dia')
      .orderBy('dia', 'ASC')
      .getRawMany();

    return {
      periodo_dias: dias,
      total_visitas: totalVisitas,
      total_conversoes: totalConversoes,
      taxa_conversao: totalVisitas > 0 ? ((totalConversoes / totalVisitas) * 100).toFixed(1) + '%' : '0%',
      por_fonte: porFonte,
      por_campanha: porCampanha,
      por_dispositivo: porDispositivo,
      secoes_vistas: secoesVistas,
      scroll_medio_percent: scrollMedio?.media ? Math.round(+scrollMedio.media) : 0,
      por_dia: porDia,
    };
  }

  async listarVisitas(pagina = 1, limite = 50) {
    return this.visitas.findAndCount({
      order: { criadoEm: 'DESC' },
      skip: (pagina - 1) * limite,
      take: limite,
    });
  }
}

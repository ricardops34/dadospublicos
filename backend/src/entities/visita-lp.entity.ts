import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EventoLp } from './evento-lp.entity';

@Entity('visitas_lp')
export class VisitaLp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'session_id', type: 'varchar', length: 64, unique: true })
  sessionId: string;

  // UTM
  @Column({ name: 'utm_source', type: 'varchar', length: 100, nullable: true })
  utmSource: string | null;

  @Column({ name: 'utm_medium', type: 'varchar', length: 100, nullable: true })
  utmMedium: string | null;

  @Column({ name: 'utm_campaign', type: 'varchar', length: 200, nullable: true })
  utmCampaign: string | null;

  @Column({ name: 'utm_term', type: 'varchar', length: 200, nullable: true })
  utmTerm: string | null;

  @Column({ name: 'utm_content', type: 'varchar', length: 200, nullable: true })
  utmContent: string | null;

  // Origem
  @Column({ type: 'varchar', length: 500, nullable: true })
  referrer: string | null;

  @Column({ name: 'landing_url', type: 'varchar', length: 1000, nullable: true })
  landingUrl: string | null;

  // Dispositivo
  @Column({ name: 'device_type', type: 'varchar', length: 20, nullable: true })
  deviceType: 'mobile' | 'tablet' | 'desktop' | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  browser: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  os: string | null;

  @Column({ name: 'screen_width', type: 'int', nullable: true })
  screenWidth: number | null;

  // LGPD
  @Column({ name: 'cookies_aceitos', type: 'boolean', nullable: true })
  cookiesAceitos: boolean | null;

  @Column({ name: 'cookies_aceitos_em', type: 'timestamp', nullable: true })
  cookiesAceitosEm: Date | null;

  // Conversão
  @Column({ name: 'cliente_id', type: 'uuid', nullable: true })
  clienteId: string | null;

  @Column({ name: 'converteu_em', type: 'timestamp', nullable: true })
  converteuEm: Date | null;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @OneToMany(() => EventoLp, (e) => e.visita)
  eventos: EventoLp[];
}

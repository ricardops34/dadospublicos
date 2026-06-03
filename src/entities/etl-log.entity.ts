import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type EtlStatus = 'iniciado' | 'download' | 'extracao' | 'carga' | 'concluido' | 'erro';

@Entity('etl_logs')
export class EtlLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, default: 'iniciado' })
  status: EtlStatus;

  @Column({ name: 'competencia', type: 'varchar', length: 7, nullable: true })
  competencia: string | null;

  @Column({ name: 'total_empresas', type: 'bigint', nullable: true })
  totalEmpresas: number | null;

  @Column({ name: 'total_estabelecimentos', type: 'bigint', nullable: true })
  totalEstabelecimentos: number | null;

  @Column({ name: 'total_socios', type: 'bigint', nullable: true })
  totalSocios: number | null;

  @Column({ name: 'detalhe', type: 'text', nullable: true })
  detalhe: string | null;

  @Column({ name: 'concluido_em', type: 'timestamp', nullable: true })
  concluidoEm: Date | null;

  @CreateDateColumn({ name: 'iniciado_em' })
  iniciadoEm: Date;
}

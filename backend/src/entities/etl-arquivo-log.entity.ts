import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type EtlArquivoStatus = 'iniciando' | 'ja_existe' | 'concluido' | 'erro';
export type EtlArquivoOperacao = 'download' | 'extracao' | 'carga';

@Entity('etl_arquivo_logs')
export class EtlArquivoLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'etl_log_id', type: 'varchar', nullable: true })
  etlLogId: string | null;

  @Column({ type: 'varchar', length: 80 })
  arquivo: string;

  @Column({ type: 'varchar', length: 10 })
  operacao: EtlArquivoOperacao;

  @Column({ type: 'varchar', length: 15, default: 'iniciando' })
  status: EtlArquivoStatus;

  @Column({ name: 'tamanho_mb', type: 'decimal', precision: 10, scale: 1, nullable: true })
  tamanhoMb: number | null;

  @Column({ name: 'duracao_ms', type: 'bigint', nullable: true })
  duracaoMs: number | null;

  @Column({ type: 'text', nullable: true })
  detalhe: string | null;

  @Column({ type: 'varchar', length: 7, nullable: true })
  competencia: string | null;

  @CreateDateColumn({ name: 'iniciado_em' })
  iniciadoEm: Date;

  @Column({ name: 'concluido_em', type: 'timestamp', nullable: true })
  concluidoEm: Date | null;
}

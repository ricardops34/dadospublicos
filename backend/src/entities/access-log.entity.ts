import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('access_logs')
export class AccessLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'token_id', type: 'uuid', nullable: true })
  tokenId: string | null;

  @Column({ name: 'cliente_id', type: 'uuid', nullable: true })
  clienteId: string | null;

  @Column({ name: 'token_prefixo', type: 'varchar', length: 12, nullable: true })
  tokenPrefixo: string | null;

  @Column({ name: 'plano', type: 'varchar', length: 20, nullable: true })
  plano: string | null;

  @Column({ name: 'ip', type: 'varchar', length: 45 })
  ip: string;

  @Column({ name: 'endpoint', type: 'varchar', length: 200 })
  endpoint: string;

  @Column({ name: 'metodo', type: 'varchar', length: 10 })
  metodo: string;

  @Column({ name: 'status_code', type: 'smallint' })
  statusCode: number;

  @Column({ name: 'tempo_ms', type: 'int', nullable: true })
  tempoMs: number | null;

  @Column({ name: 'user_agent', type: 'varchar', length: 500, nullable: true })
  userAgent: string | null;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;
}

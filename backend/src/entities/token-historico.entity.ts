import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tokens_historico')
export class TokenHistorico {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'cliente_id', type: 'uuid' })
  clienteId: string;

  @Column({ name: 'token_prefixo', type: 'varchar', length: 12 })
  tokenPrefixo: string;

  @Column({ name: 'token_sufixo', type: 'varchar', length: 4 })
  tokenSufixo: string;

  @Column({ name: 'plano', type: 'varchar', length: 20 })
  plano: string;

  @Column({ name: 'motivo_revogacao', type: 'varchar', length: 100, nullable: true })
  motivoRevogacao: string | null;

  @Column({ name: 'revogado_em', type: 'timestamp', nullable: true })
  revogadoEm: Date | null;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;
}

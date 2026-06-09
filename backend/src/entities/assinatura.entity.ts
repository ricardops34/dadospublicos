import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ClienteApi } from './cliente.entity';
import { Conta } from './conta.entity';
import { Plano } from './plano.entity';
import { Token } from './token.entity';
import { Fatura } from './fatura.entity';

export type AssinaturaStatus = 'ativa' | 'suspensa' | 'cancelada' | 'trial';

@Entity('assinaturas')
export class Assinatura {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'cliente_id', type: 'uuid' })
  clienteId: string;

  /** Tenant/conta a qual esta assinatura pertence */
  @Column({ name: 'conta_id', type: 'uuid', nullable: true })
  contaId: string | null;

  @ManyToOne(() => Conta, (c) => c.assinaturas, { nullable: true })
  @JoinColumn({ name: 'conta_id' })
  conta: Conta | null;

  @Column({ name: 'plano_id', type: 'uuid' })
  planoId: string;

  @Column({ name: 'token_id', type: 'uuid', nullable: true })
  tokenId: string | null;

  @Column({ type: 'varchar', length: 20, default: 'ativa' })
  status: AssinaturaStatus;

  @Column({ name: 'data_inicio', type: 'date' })
  dataInicio: string;

  @Column({ name: 'data_fim', type: 'date', nullable: true })
  dataFim: string | null;

  @Column({ name: 'proximo_vencimento', type: 'date', nullable: true })
  proximoVencimento: string | null;

  @Column({ name: 'cancelado_em', type: 'timestamp', nullable: true })
  canceladoEm: Date | null;

  @Column({ name: 'agendar_cancelamento_em', type: 'date', nullable: true })
  agendarCancelamentoEm: string | null;

  @Column({ name: 'motivo_cancelamento', type: 'text', nullable: true })
  motivoCancelamento: string | null;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: Date;

  @ManyToOne(() => ClienteApi, (c) => c.assinaturas)
  @JoinColumn({ name: 'cliente_id' })
  cliente: ClienteApi;

  @ManyToOne(() => Plano, (p) => p.assinaturas)
  @JoinColumn({ name: 'plano_id' })
  plano: Plano;

  @OneToOne(() => Token)
  @JoinColumn({ name: 'token_id' })
  token: Token;

  @OneToMany(() => Fatura, (f) => f.assinatura)
  faturas: Fatura[];
}

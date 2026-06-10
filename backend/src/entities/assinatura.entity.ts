import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Cliente } from './cliente.entity';
import { Plano } from './plano.entity';
import { Token } from './token.entity';
import { Fatura } from './fatura.entity';

export type AssinaturaStatus = 'ativa' | 'suspensa' | 'cancelada' | 'trial';

@Entity('assinaturas')
export class Assinatura {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Usuário que contratou (histórico) — o plano pertence ao Cliente */
  @Column({ name: 'usuario_id', type: 'uuid' })
  usuarioId: string;

  /** Cliente dono da assinatura/plano */
  @Column({ name: 'cliente_id', type: 'uuid', nullable: true })
  clienteId: string | null;

  @ManyToOne(() => Cliente, (c) => c.assinaturas, { nullable: true })
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente | null;

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

  @ManyToOne(() => Usuario, (u) => u.assinaturas)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Plano, (p) => p.assinaturas)
  @JoinColumn({ name: 'plano_id' })
  plano: Plano;

  @OneToOne(() => Token)
  @JoinColumn({ name: 'token_id' })
  token: Token;

  @OneToMany(() => Fatura, (f) => f.assinatura)
  faturas: Fatura[];
}

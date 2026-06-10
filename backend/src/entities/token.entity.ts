import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Cliente } from './cliente.entity';

export type Plano = 'gratuito' | 'basico' | 'intermediario' | 'avancado' | 'premium';

@Entity('tokens')
@Index('uq_tokens_cliente_ativo', ['clienteId'], { unique: true, where: '"ativo" = true AND "cliente_id" IS NOT NULL' })
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 64, unique: true })
  token: string;

  /**
   * Cliente dono do token — o token de API pertence ao Cliente e é
   * compartilhado por todos os seus usuários. Null apenas para tokens de
   * administradores da plataforma.
   */
  @Column({ name: 'cliente_id', type: 'uuid', nullable: true })
  clienteId: string | null;

  @ManyToOne(() => Cliente, { nullable: true })
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente | null;

  @Column({ type: 'varchar', length: 100 })
  nome: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  email: string | null;

  @Column({ type: 'varchar', length: 20, default: 'gratuito' })
  plano: Plano;

  @Column({ name: 'limite_mensal', type: 'integer', nullable: true })
  limiteMensal: number | null;

  @Column({ default: true })
  ativo: boolean;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: Date;
}

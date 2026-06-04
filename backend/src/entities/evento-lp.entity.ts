import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { VisitaLp } from './visita-lp.entity';

export type TipoEvento = 'scroll' | 'secao_vista' | 'clique' | 'tempo_pagina' | 'saida';

@Entity('eventos_lp')
export class EventoLp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'session_id', type: 'varchar', length: 64 })
  sessionId: string;

  @Column({ type: 'varchar', length: 30 })
  tipo: TipoEvento;

  @Column({ type: 'jsonb', nullable: true })
  dados: Record<string, any> | null;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @ManyToOne(() => VisitaLp, (v) => v.eventos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'session_id', referencedColumnName: 'sessionId' })
  visita: VisitaLp;
}

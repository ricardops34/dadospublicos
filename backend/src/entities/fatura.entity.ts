import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Assinatura } from './assinatura.entity';

export type FaturaStatus = 'pendente' | 'paga' | 'vencida' | 'cancelada';

@Entity('faturas')
export class Fatura {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'assinatura_id', type: 'uuid' })
  assinaturaId: string;

  @Column({ type: 'integer' })
  ano: number;

  @Column({ type: 'integer' })
  mes: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valor: number;

  @Column({ type: 'varchar', length: 20, default: 'pendente' })
  status: FaturaStatus;

  @Column({ name: 'data_vencimento', type: 'date' })
  dataVencimento: string;

  @Column({ name: 'data_pagamento', type: 'date', nullable: true })
  dataPagamento: string | null;

  @Column({ name: 'numero_nf', type: 'varchar', length: 50, nullable: true })
  numeroNf: string | null;

  @Column({ name: 'url_nf', type: 'text', nullable: true })
  urlNf: string | null;

  // Requisições no período (snapshot para cobrança)
  @Column({ name: 'total_requisicoes', type: 'integer', default: 0 })
  totalRequisicoes: number;

  @Column({ name: 'observacao', type: 'text', nullable: true })
  observacao: string | null;

  // Integração PIX
  @Column({ name: 'pix_txid', type: 'varchar', length: 100, nullable: true })
  pixTxid: string | null;

  @Column({ name: 'pix_copia_cola', type: 'text', nullable: true })
  pixCopiaECola: string | null;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @ManyToOne(() => Assinatura, (a) => a.faturas)
  @JoinColumn({ name: 'assinatura_id' })
  assinatura: Assinatura;
}

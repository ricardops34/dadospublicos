import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { Painel360Lote } from './painel-360-lote.entity';

export type Painel360ItemStatus = 'pendente' | 'encontrado' | 'nao_encontrado' | 'erro';

@Entity('painel_360_itens')
@Unique(['loteId', 'cnpj'])
@Index(['loteId', 'ordem'])
@Index(['loteId', 'status'])
export class Painel360Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'lote_id', type: 'uuid' })
  loteId: string;

  @Column({ type: 'integer' })
  ordem: number;

  @Column({ type: 'varchar', length: 14 })
  cnpj: string;

  @Column({ type: 'varchar', length: 20, default: 'pendente' })
  status: Painel360ItemStatus;

  @Column({ default: false })
  encontrado: boolean;

  @Column({ name: 'razao_social', type: 'varchar', length: 200, nullable: true })
  razaoSocial: string | null;

  @Column({ name: 'nome_fantasia', type: 'varchar', length: 200, nullable: true })
  nomeFantasia: string | null;

  @Column({ name: 'situacao_cadastral', type: 'varchar', length: 30, nullable: true })
  situacaoCadastral: string | null;

  @Column({ type: 'varchar', length: 2, nullable: true })
  uf: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  municipio: string | null;

  @Column({ name: 'municipio_ibge', type: 'integer', nullable: true })
  municipioIbge: number | null;

  @Column({ type: 'varchar', length: 8, nullable: true })
  cep: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  logradouro: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  numero: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  bairro: string | null;

  @Column({ name: 'cnae_fiscal_principal', type: 'varchar', length: 7, nullable: true })
  cnaeFiscalPrincipal: string | null;

  @Column({ name: 'porte_empresa', type: 'varchar', length: 2, nullable: true })
  porteEmpresa: string | null;

  @Column({ name: 'opcao_simples', type: 'boolean', nullable: true })
  opcaoSimples: boolean | null;

  @Column({ name: 'opcao_mei', type: 'boolean', nullable: true })
  opcaoMei: boolean | null;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  lat: number | null;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  lng: number | null;

  @Column({ type: 'jsonb', nullable: true })
  payload: Record<string, unknown> | null;

  @Column({ type: 'text', nullable: true })
  erro: string | null;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: Date;

  @ManyToOne(() => Painel360Lote, (lote) => lote.itens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lote_id' })
  lote: Painel360Lote;
}

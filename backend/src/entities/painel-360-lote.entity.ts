import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Painel360Item } from './painel-360-item.entity';

export type Painel360LoteStatus = 'aguardando' | 'processando' | 'concluido' | 'erro';

@Entity('painel_360_lotes')
@Index(['criadoPorId'])
@Index(['status'])
export class Painel360Lote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'criado_por_id', type: 'uuid' })
  criadoPorId: string;

  @Column({ name: 'criado_por_perfil', type: 'varchar', length: 20 })
  criadoPorPerfil: 'admin' | 'cliente';

  @Column({ name: 'arquivo_nome_original', type: 'varchar', length: 255 })
  arquivoNomeOriginal: string;

  @Column({ type: 'varchar', length: 20, default: 'aguardando' })
  status: Painel360LoteStatus;

  @Column({ name: 'total_linhas', type: 'integer', default: 0 })
  totalLinhas: number;

  @Column({ name: 'total_cnpjs', type: 'integer', default: 0 })
  totalCnpjs: number;

  @Column({ name: 'processados', type: 'integer', default: 0 })
  processados: number;

  @Column({ name: 'encontrados', type: 'integer', default: 0 })
  encontrados: number;

  @Column({ name: 'nao_encontrados', type: 'integer', default: 0 })
  naoEncontrados: number;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  cnpjs: string[];

  @Column({ type: 'jsonb', nullable: true })
  filtros: Record<string, unknown> | null;

  @Column({ type: 'text', nullable: true })
  erro: string | null;

  @Column({ name: 'iniciado_em', type: 'timestamp', nullable: true })
  iniciadoEm: Date | null;

  @Column({ name: 'concluido_em', type: 'timestamp', nullable: true })
  concluidoEm: Date | null;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: Date;

  @OneToMany(() => Painel360Item, (item) => item.lote)
  itens: Painel360Item[];
}

import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type NotificacaoTipo = 'sistema' | 'financeiro' | 'conta' | 'consumo';

@Entity('notificacoes')
export class Notificacao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** null = broadcast para todos os clientes */
  @Column({ name: 'cliente_id', type: 'uuid', nullable: true })
  clienteId: string | null;

  @Column({ length: 150 })
  titulo: string;

  @Column({ type: 'text' })
  mensagem: string;

  @Column({ type: 'varchar', length: 20, default: 'sistema' })
  tipo: NotificacaoTipo;

  @Column({ default: false })
  lida: boolean;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;
}

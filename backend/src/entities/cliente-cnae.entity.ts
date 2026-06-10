import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Cliente } from './cliente.entity';

/** CNAEs secundários do Cliente — somente pessoa jurídica (o principal fica em clientes.cnae_principal) */
@Entity('cliente_cnaes')
@Unique('uq_cliente_cnae', ['clienteId', 'codigo'])
export class ClienteCnae {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'cliente_id', type: 'uuid' })
  clienteId: string;

  @ManyToOne(() => Cliente, (c) => c.cnaesSecundarios, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @Column({ type: 'varchar', length: 7 })
  codigo: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  descricao: string | null;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;
}

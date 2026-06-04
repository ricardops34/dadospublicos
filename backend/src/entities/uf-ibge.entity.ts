import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('uf_ibge')
export class UfIbge {
  @PrimaryColumn({ type: 'varchar', length: 2 })
  sigla: string;

  @Column({ name: 'codigo_ibge', type: 'integer' })
  codigoIbge: number;

  @Column({ type: 'varchar', length: 100 })
  nome: string;
}

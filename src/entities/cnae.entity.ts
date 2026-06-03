import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('cnaes')
export class Cnae {
  @PrimaryColumn({ type: 'varchar', length: 7 })
  codigo: string;

  @Column({ type: 'varchar', length: 300 })
  descricao: string;

  @Column({ type: 'varchar', length: 1 })
  secao: string;

  @Column({ type: 'varchar', length: 2 })
  divisao: string;

  @Column({ type: 'varchar', length: 3 })
  grupo: string;

  @Column({ type: 'varchar', length: 5 })
  classe: string;
}

import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('motivos')
export class Motivo {
  @PrimaryColumn({ type: 'varchar', length: 2 })
  codigo: string;

  @Column({ type: 'varchar', length: 200 })
  descricao: string;
}

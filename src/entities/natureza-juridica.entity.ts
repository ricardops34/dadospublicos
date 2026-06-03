import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('naturezas_juridicas')
export class NaturezaJuridica {
  @PrimaryColumn({ type: 'varchar', length: 4 })
  codigo: string;

  @Column({ type: 'varchar', length: 200 })
  descricao: string;
}

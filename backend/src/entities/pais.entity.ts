import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('paises')
export class Pais {
  @PrimaryColumn({ type: 'varchar', length: 3 })
  codigo: string;

  @Column({ type: 'varchar', length: 100 })
  nome: string;

  @Column({ name: 'iso2', type: 'varchar', length: 2, nullable: true })
  iso2: string | null;

  @Column({ name: 'iso3', type: 'varchar', length: 3, nullable: true })
  iso3: string | null;

  @Column({ name: 'comex_id', type: 'varchar', length: 10, nullable: true })
  comexId: string | null;
}

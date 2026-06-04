import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UfIbge } from './uf-ibge.entity';

@Entity('municipio_ibge')
export class MunicipioIbge {
  @PrimaryColumn({ name: 'codigo_ibge', type: 'integer' })
  codigoIbge: number;

  @Column({ type: 'varchar', length: 150 })
  nome: string;

  @Column({ name: 'uf_sigla', type: 'varchar', length: 2 })
  ufSigla: string;

  @ManyToOne(() => UfIbge)
  @JoinColumn({ name: 'uf_sigla' })
  uf: UfIbge;
}

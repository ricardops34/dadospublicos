import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('municipios')
export class Municipio {
  @PrimaryColumn({ name: 'codigo_rfb', type: 'varchar', length: 4 })
  codigoRfb: string;

  @Column({ type: 'varchar', length: 100 })
  nome: string;

  @Column({ name: 'uf_sigla', type: 'varchar', length: 2, nullable: true })
  ufSigla: string | null;

  @Column({ name: 'codigo_ibge', type: 'integer', nullable: true })
  codigoIbge: number | null;

  @Column({ name: 'codigo_siafi', type: 'varchar', length: 5, nullable: true })
  codigoSiafi: string | null;
}

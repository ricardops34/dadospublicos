import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('ceps_geo')
export class CepGeo {
  @PrimaryColumn({ type: 'varchar', length: 8 })
  cep: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  logradouro: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  complemento: string | null;

  @Column({ type: 'varchar', length: 80, nullable: true })
  bairro: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  municipio: string | null;

  @Column({ name: 'municipio_ibge', type: 'integer', nullable: true })
  municipioIbge: number | null;

  @Column({ name: 'uf_sigla', type: 'varchar', length: 2, nullable: true })
  ufSigla: string | null;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  lat: number | null;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  lng: number | null;

  @Column({ name: 'geocodificado_em', type: 'timestamp', nullable: true })
  geocodificadoEm: Date | null;

  @Column({ name: 'origem_dados', type: 'varchar', length: 20, nullable: true })
  origemDados: string | null;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: Date;
}

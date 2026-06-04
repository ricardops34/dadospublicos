import { Column, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('socios')
@Index(['cnpjBasico'])
export class Socio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'cnpj_basico', type: 'varchar', length: 8 })
  cnpjBasico: string;

  @Column({ name: 'identificador_socio', type: 'varchar', length: 1, nullable: true })
  identificadorSocio: string | null;

  @Column({ name: 'nome_socio', type: 'varchar', length: 200, nullable: true })
  nomeSocio: string | null;

  @Column({ name: 'cnpj_cpf_socio', type: 'varchar', length: 14, nullable: true })
  cnpjCpfSocio: string | null;

  @Column({ name: 'qualificacao_socio', type: 'varchar', length: 2, nullable: true })
  qualificacaoSocio: string | null;

  @Column({ name: 'data_entrada_sociedade', type: 'date', nullable: true })
  dataEntradaSociedade: string | null;

  @Column({ name: 'pais', type: 'varchar', length: 3, nullable: true })
  pais: string | null;

  @Column({ name: 'representante_legal', type: 'varchar', length: 14, nullable: true })
  representanteLegal: string | null;

  @Column({ name: 'nome_representante', type: 'varchar', length: 200, nullable: true })
  nomeRepresentante: string | null;

  @Column({ name: 'qualificacao_representante', type: 'varchar', length: 2, nullable: true })
  qualificacaoRepresentante: string | null;

  @Column({ name: 'faixa_etaria', type: 'varchar', length: 1, nullable: true })
  faixaEtaria: string | null;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: Date;
}

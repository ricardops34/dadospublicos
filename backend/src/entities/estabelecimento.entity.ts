import { Column, Entity, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('estabelecimentos')
@Index(['cnpjBasico'])
@Index(['situacaoCadastral'])
@Index(['cnaeFiscalPrincipal'])
@Index(['municipio'])
@Index(['uf'])
@Index(['cep'])
export class Estabelecimento {
  @PrimaryColumn({ name: 'cnpj_basico', type: 'varchar', length: 8 })
  cnpjBasico: string;

  @PrimaryColumn({ name: 'cnpj_ordem', type: 'varchar', length: 4 })
  cnpjOrdem: string;

  @PrimaryColumn({ name: 'cnpj_dv', type: 'varchar', length: 2 })
  cnpjDv: string;

  @Column({ name: 'identificador_matriz_filial', type: 'varchar', length: 1, nullable: true })
  identificadorMatrizFilial: string | null;

  @Column({ name: 'nome_fantasia', type: 'varchar', length: 200, nullable: true })
  nomeFantasia: string | null;

  @Column({ name: 'situacao_cadastral', type: 'varchar', length: 2, nullable: true })
  situacaoCadastral: string | null;

  @Column({ name: 'data_situacao_cadastral', type: 'date', nullable: true })
  dataSituacaoCadastral: string | null;

  @Column({ name: 'motivo_situacao_cadastral', type: 'varchar', length: 2, nullable: true })
  motivoSituacaoCadastral: string | null;

  @Column({ name: 'nome_cidade_exterior', type: 'varchar', length: 100, nullable: true })
  nomeCidadeExterior: string | null;

  @Column({ name: 'pais', type: 'varchar', length: 3, nullable: true })
  pais: string | null;

  @Column({ name: 'data_inicio_atividade', type: 'date', nullable: true })
  dataInicioAtividade: string | null;

  @Column({ name: 'cnae_fiscal_principal', type: 'varchar', length: 7, nullable: true })
  cnaeFiscalPrincipal: string | null;

  @Column({ name: 'cnae_fiscal_secundaria', type: 'text', nullable: true })
  cnaeFiscalSecundaria: string | null;

  @Column({ name: 'tipo_logradouro', type: 'varchar', length: 20, nullable: true })
  tipoLogradouro: string | null;

  @Column({ name: 'logradouro', type: 'varchar', length: 200, nullable: true })
  logradouro: string | null;

  @Column({ name: 'numero', type: 'varchar', length: 10, nullable: true })
  numero: string | null;

  @Column({ name: 'complemento', type: 'varchar', length: 100, nullable: true })
  complemento: string | null;

  @Column({ name: 'bairro', type: 'varchar', length: 80, nullable: true })
  bairro: string | null;

  @Column({ name: 'cep', type: 'varchar', length: 8, nullable: true })
  cep: string | null;

  @Column({ name: 'uf', type: 'varchar', length: 2, nullable: true })
  uf: string | null;

  @Column({ name: 'municipio', type: 'varchar', length: 4, nullable: true })
  municipio: string | null;

  @Column({ name: 'ddd1', type: 'varchar', length: 4, nullable: true })
  ddd1: string | null;

  @Column({ name: 'telefone1', type: 'varchar', length: 10, nullable: true })
  telefone1: string | null;

  @Column({ name: 'ddd2', type: 'varchar', length: 4, nullable: true })
  ddd2: string | null;

  @Column({ name: 'telefone2', type: 'varchar', length: 10, nullable: true })
  telefone2: string | null;

  @Column({ name: 'ddd_fax', type: 'varchar', length: 4, nullable: true })
  dddFax: string | null;

  @Column({ name: 'fax', type: 'varchar', length: 10, nullable: true })
  fax: string | null;

  @Column({ name: 'email', type: 'varchar', length: 200, nullable: true })
  email: string | null;

  @Column({ name: 'situacao_especial', type: 'varchar', length: 100, nullable: true })
  situacaoEspecial: string | null;

  @Column({ name: 'data_situacao_especial', type: 'date', nullable: true })
  dataSituacaoEspecial: string | null;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: Date;
}

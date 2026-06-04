import { Column, Entity, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('empresas_rfb')
@Index(['naturezaJuridica'])
@Index(['porteEmpresa'])
export class EmpresaRfb {
  @PrimaryColumn({ name: 'cnpj_basico', type: 'varchar', length: 8 })
  cnpjBasico: string;

  @Column({ name: 'razao_social', type: 'varchar', length: 200, nullable: true })
  razaoSocial: string | null;

  @Column({ name: 'natureza_juridica', type: 'varchar', length: 4, nullable: true })
  naturezaJuridica: string | null;

  @Column({ name: 'qualificacao_responsavel', type: 'varchar', length: 2, nullable: true })
  qualificacaoResponsavel: string | null;

  @Column({ name: 'capital_social', type: 'decimal', precision: 18, scale: 2, nullable: true })
  capitalSocial: number | null;

  @Column({ name: 'porte_empresa', type: 'varchar', length: 2, nullable: true })
  porteEmpresa: string | null;

  @Column({ name: 'ente_federativo', type: 'varchar', length: 200, nullable: true })
  enteFederativo: string | null;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: Date;
}

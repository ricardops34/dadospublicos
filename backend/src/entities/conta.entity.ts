import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Assinatura } from './assinatura.entity';

@Entity('contas')
export class Conta {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** FK para o usuário proprietário da conta */
  @Column({ name: 'proprietario_id', type: 'uuid' })
  proprietarioId: string;

  @Column({ name: 'tipo_pessoa', type: 'varchar', length: 1, default: 'J' })
  tipoPessoa: 'F' | 'J';

  @Column({ type: 'varchar', length: 14, nullable: true })
  cnpj: string | null;

  @Column({ name: 'razao_social', type: 'varchar', length: 200, nullable: true })
  razaoSocial: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefone: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  cep: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  logradouro: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  numero: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  complemento: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  bairro: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  municipio: string | null;

  @Column({ type: 'varchar', length: 2, nullable: true })
  uf: string | null;

  @Column({ name: 'inscricao_estadual', type: 'varchar', length: 50, nullable: true })
  inscricaoEstadual: string | null;

  @Column({ name: 'inscricao_municipal', type: 'varchar', length: 50, nullable: true })
  inscricaoMunicipal: string | null;

  @Column({ default: true })
  ativo: boolean;

  @Column({ name: 'onboarding_pendente', default: true })
  onboardingPendente: boolean;

  @Column({ name: 'agendar_exclusao_em', type: 'timestamp', nullable: true })
  agendarExclusaoEm: Date | null;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: Date;

  @OneToMany(() => Assinatura, (a) => a.conta)
  assinaturas: Assinatura[];
}

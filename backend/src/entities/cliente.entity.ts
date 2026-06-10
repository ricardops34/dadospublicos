import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Assinatura } from './assinatura.entity';
import { ClienteCnae } from './cliente-cnae.entity';

/**
 * Cliente — pessoa física ou jurídica que contrata os serviços da plataforma.
 * Dono dos dados de negócio, do plano e do token de API (docs/regra-cliente-usuario.md).
 * Cliente (1) → (N) Usuários.
 */
@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** FK para o usuário principal (administrador) do Cliente */
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

  /** CNAE principal (código de 7 dígitos do catálogo RFB) — pessoa jurídica */
  @Column({ name: 'cnae_principal', type: 'varchar', length: 7, nullable: true })
  cnaePrincipal: string | null;

  @Column({ name: 'cnae_principal_descricao', type: 'varchar', length: 300, nullable: true })
  cnaePrincipalDescricao: string | null;

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

  @OneToMany(() => Assinatura, (a) => a.cliente)
  assinaturas: Assinatura[];

  @OneToMany(() => ClienteCnae, (c) => c.cliente)
  cnaesSecundarios: ClienteCnae[];
}

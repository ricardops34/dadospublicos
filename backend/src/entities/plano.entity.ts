import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Assinatura } from './assinatura.entity';
import { PlanoRecurso } from './plano-recurso.entity';

@Entity('planos')
export class Plano {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  nome: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  descricao: string | null;

  @Column({ name: 'preco_mensal', type: 'decimal', precision: 10, scale: 2, default: 0 })
  precoMensal: number;

  @Column({ name: 'preco_semestral', type: 'decimal', precision: 10, scale: 2, default: 0 })
  precoSemestral: number;

  @Column({ name: 'preco_anual', type: 'decimal', precision: 10, scale: 2, default: 0 })
  precoAnual: number;

  @Column({ name: 'limite_mensal', type: 'integer', nullable: true })
  limiteMensal: number | null;

  @Column({ name: 'rate_limit_por_minuto', type: 'integer', default: 3 })
  rateLimitPorMinuto: number;

  @Column({ name: 'rate_limit_por_hora', type: 'integer', nullable: true })
  rateLimitPorHora: number | null;

  @Column({ name: 'acesso_cnpj', default: true })
  acessoCnpj: boolean;

  @Column({ name: 'acesso_cnpj_raiz', default: false })
  acessoCnpjRaiz: boolean;

  @Column({ name: 'acesso_pesquisa', default: false })
  acessoPesquisa: boolean;

  @Column({ name: 'acesso_geocode', default: false })
  acessoGeocode: boolean;

  @Column({ name: 'acesso_suframa', default: false })
  acessoSuframa: boolean;

  @Column({ name: 'acesso_mapa', default: false })
  acessoMapa: boolean;

  @Column({ name: 'exibir_na_lp', default: true })
  exibirNaLp: boolean;

  @Column({ default: true })
  ativo: boolean;

  @Column({ default: 0 })
  ordem: number;

  @Column({ name: 'mais_popular', default: false })
  maisPopular: boolean;

  @Column({ name: 'selo_destaque', type: 'varchar', length: 60, nullable: true })
  seloDestaque: string | null;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: Date;

  @OneToMany(() => Assinatura, (assinatura) => assinatura.plano)
  assinaturas: Assinatura[];

  @OneToMany(() => PlanoRecurso, (planoRecurso) => planoRecurso.plano)
  recursos: PlanoRecurso[];
}

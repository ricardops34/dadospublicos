import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Assinatura } from './assinatura.entity';

@Entity('planos')
export class Plano {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  nome: string;           // ex: Gratuito, Básico, Profissional, Premium

  @Column({ type: 'varchar', length: 20, unique: true })
  slug: string;           // gratuito | basico | profissional | premium

  @Column({ type: 'text', nullable: true })
  descricao: string | null;

  @Column({ name: 'preco_mensal', type: 'decimal', precision: 10, scale: 2, default: 0 })
  precoMensal: number;    // 0 = gratuito

  @Column({ name: 'limite_mensal', type: 'integer', nullable: true })
  limiteMensal: number | null;   // null = ilimitado

  @Column({ name: 'rate_limit_por_minuto', type: 'integer', default: 3 })
  rateLimitPorMinuto: number;

  // Endpoints liberados
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

  @Column({ default: true })
  ativo: boolean;

  @Column({ default: 0 })
  ordem: number;          // ordem de exibição na página de preços

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: Date;

  @OneToMany(() => Assinatura, (a) => a.plano)
  assinaturas: Assinatura[];
}

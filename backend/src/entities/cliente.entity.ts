import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Assinatura } from './assinatura.entity';

@Entity('clientes_api')
export class ClienteApi {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  nome: string;

  @Column({ type: 'varchar', length: 200, unique: true })
  email: string;

  @Column({ name: 'senha_hash', type: 'varchar', length: 255 })
  senhaHash: string;

  @Column({ type: 'varchar', length: 18, nullable: true })
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

  @Column({ type: 'varchar', length: 20, default: 'cliente' })
  perfil: 'admin' | 'cliente';

  @Column({ default: true })
  ativo: boolean;

  @Column({ name: 'email_verificado', default: false })
  emailVerificado: boolean;

  @Column({ name: 'token_verificacao', type: 'varchar', length: 64, nullable: true })
  tokenVerificacao: string | null;

  @Column({ name: 'reset_token', type: 'varchar', length: 64, nullable: true })
  resetToken: string | null;

  @Column({ name: 'reset_token_expira', type: 'timestamp', nullable: true })
  resetTokenExpira: Date | null;

  @Column({ name: 'ultimo_login', type: 'timestamp', nullable: true })
  ultimoLogin: Date | null;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: Date;

  @OneToMany(() => Assinatura, (a) => a.cliente)
  assinaturas: Assinatura[];
}

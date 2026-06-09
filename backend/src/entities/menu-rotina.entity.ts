import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MenuModulo } from './menu-modulo.entity';
import { PerfilRotina } from './perfil-rotina.entity';

@Entity('menu_rotinas')
export class MenuRotina {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'modulo_id', type: 'uuid', nullable: true })
  moduloId: string | null;

  @ManyToOne(() => MenuModulo, (m) => m.rotinas, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'modulo_id' })
  modulo: MenuModulo | null;

  @Column({ type: 'varchar', length: 100 })
  nome: string;

  @Column({ name: 'short_label', type: 'varchar', length: 30, nullable: true })
  shortLabel: string | null;

  @Column({ type: 'varchar', length: 60, nullable: true })
  icone: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  rota: string | null;

  @Column({ type: 'varchar', length: 20, default: 'link' })
  tipo: string;

  @Column({ type: 'int', default: 0 })
  ordem: number;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  recurso: string | null;

  @OneToMany(() => PerfilRotina, (pr) => pr.rotina)
  perfilRotinas: PerfilRotina[];
}

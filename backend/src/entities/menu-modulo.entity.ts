import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MenuRotina } from './menu-rotina.entity';

@Entity('menu_modulos')
export class MenuModulo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  nome: string;

  @Column({ name: 'short_label', type: 'varchar', length: 30, nullable: true })
  shortLabel: string | null;

  @Column({ type: 'varchar', length: 60, nullable: true })
  icone: string | null;

  @Column({ type: 'int', default: 0 })
  ordem: number;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  @OneToMany(() => MenuRotina, (r) => r.modulo)
  rotinas: MenuRotina[];
}

import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Perfil } from './perfil.entity';
import { MenuRotina } from './menu-rotina.entity';

@Entity('perfil_rotinas')
export class PerfilRotina {
  @PrimaryColumn({ name: 'perfil_id', type: 'uuid' })
  perfilId: string;

  @PrimaryColumn({ name: 'rotina_id', type: 'uuid' })
  rotinaId: string;

  @ManyToOne(() => Perfil, (p) => p.perfilRotinas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'perfil_id' })
  perfil: Perfil;

  @ManyToOne(() => MenuRotina, (r) => r.perfilRotinas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'rotina_id' })
  rotina: MenuRotina;
}

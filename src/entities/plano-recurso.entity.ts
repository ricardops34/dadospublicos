import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Plano } from './plano.entity';
import { RecursoPlano } from './recurso-plano.entity';

@Entity('planos_recursos')
@Unique(['planoId', 'recursoId'])
export class PlanoRecurso {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'plano_id', type: 'uuid' })
  planoId: string;

  @Column({ name: 'recurso_id', type: 'uuid' })
  recursoId: string;

  @Column({ name: 'descricao_exibicao', type: 'varchar', length: 255 })
  descricaoExibicao: string;

  @Column({ default: 0 })
  ordem: number;

  @ManyToOne(() => Plano, (plano) => plano.recursos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'plano_id' })
  plano: Plano;

  @ManyToOne(() => RecursoPlano, (recurso) => recurso.planos, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recurso_id' })
  recurso: RecursoPlano;
}

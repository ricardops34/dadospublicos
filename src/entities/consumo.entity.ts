import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('consumos')
@Index(['tokenId', 'ano', 'mes'])
export class Consumo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'token_id', type: 'uuid' })
  tokenId: string;

  @Column({ type: 'integer' })
  ano: number;

  @Column({ type: 'integer' })
  mes: number;

  @Column({ type: 'integer', default: 0 })
  quantidade: number;

  @Column({ name: 'atualizado_em', type: 'timestamp', default: () => 'NOW()' })
  atualizadoEm: Date;
}

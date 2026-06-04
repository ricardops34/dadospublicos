import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('parametros')
export class Parametro {
  @PrimaryColumn({ length: 100 })
  chave: string;

  @Column({ type: 'text', nullable: true })
  valor: string;

  @Column({ length: 255, nullable: true })
  descricao: string;

  @UpdateDateColumn()
  atualizado_em: Date;
}

import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('simples')
export class Simples {
  @PrimaryColumn({ name: 'cnpj_basico', type: 'varchar', length: 8 })
  cnpjBasico: string;

  @Column({ name: 'opcao_pelo_simples', type: 'varchar', length: 1, nullable: true })
  opcaoPeloSimples: string | null;

  @Column({ name: 'data_opcao_simples', type: 'date', nullable: true })
  dataOpcaoSimples: string | null;

  @Column({ name: 'data_exclusao_simples', type: 'date', nullable: true })
  dataExclusaoSimples: string | null;

  @Column({ name: 'opcao_pelo_mei', type: 'varchar', length: 1, nullable: true })
  opcaoPeloMei: string | null;

  @Column({ name: 'data_opcao_mei', type: 'date', nullable: true })
  dataOpcaoMei: string | null;

  @Column({ name: 'data_exclusao_mei', type: 'date', nullable: true })
  dataExclusaoMei: string | null;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: Date;
}

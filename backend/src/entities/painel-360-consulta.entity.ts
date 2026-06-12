import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('painel_360_consultas')
@Index(['criadoPorId'])
export class Painel360Consulta {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'criado_por_id', type: 'uuid' })
  criadoPorId: string;

  @Column({ name: 'criado_por_perfil', type: 'varchar', length: 20 })
  criadoPorPerfil: 'admin' | 'cliente';

  @Column({ type: 'jsonb' })
  filtros: {
    uf?: string;
    municipio?: string;
    bairro?: string;
    cnaes?: string[];
  };

  @Column({ name: 'total_resultados', type: 'integer', default: 0 })
  totalResultados: number;

  @Column({ name: 'total_geocodificados', type: 'integer', default: 0 })
  totalGeocod: number;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;
}

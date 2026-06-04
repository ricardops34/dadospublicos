import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanosController } from './planos.controller';
import { PlanosService } from './planos.service';
import { Plano } from '../../entities/plano.entity';
import { RecursoPlano } from '../../entities/recurso-plano.entity';
import { PlanoRecurso } from '../../entities/plano-recurso.entity';
import { PortalModule } from '../portal/portal.module';

@Module({
  imports: [TypeOrmModule.forFeature([Plano, RecursoPlano, PlanoRecurso]), PortalModule],
  controllers: [PlanosController],
  providers: [PlanosService],
  exports: [PlanosService],
})
export class PlanosModule {}

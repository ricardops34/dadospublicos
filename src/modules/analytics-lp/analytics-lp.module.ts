import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitaLp } from '../../entities/visita-lp.entity';
import { EventoLp } from '../../entities/evento-lp.entity';
import { AnalyticsLpService } from './analytics-lp.service';
import { AnalyticsLpController } from './analytics-lp.controller';
import { PortalModule } from '../portal/portal.module';

@Module({
  imports: [TypeOrmModule.forFeature([VisitaLp, EventoLp]), PortalModule],
  controllers: [AnalyticsLpController],
  providers: [AnalyticsLpService],
  exports: [AnalyticsLpService],
})
export class AnalyticsLpModule {}

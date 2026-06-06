import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EtlController } from './etl.controller';
import { EtlService } from './etl.service';
import { EtlLog } from '../../entities/etl-log.entity';
import { PortalModule } from '../portal/portal.module';
import { ParametrosModule } from '../parametros/parametros.module';

@Module({
  imports: [TypeOrmModule.forFeature([EtlLog]), PortalModule, ParametrosModule],
  controllers: [EtlController],
  providers: [EtlService],
  exports: [EtlService],
})
export class EtlModule {}

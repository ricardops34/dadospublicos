import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parametro } from '../../entities/parametro.entity';
import { PortalModule } from '../portal/portal.module';
import { ConfigEmailController } from './config-email.controller';
import { ParametrosController } from './parametros.controller';
import { ParametrosService } from './parametros.service';

@Module({
  imports: [TypeOrmModule.forFeature([Parametro]), PortalModule],
  controllers: [ParametrosController, ConfigEmailController],
  providers: [ParametrosService],
  exports: [ParametrosService],
})
export class ParametrosModule {}

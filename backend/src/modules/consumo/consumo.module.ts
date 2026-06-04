import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsumoController } from './consumo.controller';
import { Consumo } from '../../entities/consumo.entity';
import { Token } from '../../entities/token.entity';
import { AuthModule } from '../auth/auth.module';
import { PortalModule } from '../portal/portal.module';

@Module({
  imports: [TypeOrmModule.forFeature([Consumo, Token]), AuthModule, PortalModule],
  controllers: [ConsumoController],
})
export class ConsumoModule {}

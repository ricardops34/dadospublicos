import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FaturasController } from './faturas.controller';
import { FaturasService } from './faturas.service';
import { Fatura } from '../../entities/fatura.entity';
import { Assinatura } from '../../entities/assinatura.entity';
import { Consumo } from '../../entities/consumo.entity';
import { PortalModule } from '../portal/portal.module';

@Module({
  imports: [TypeOrmModule.forFeature([Fatura, Assinatura, Consumo]), PortalModule],
  controllers: [FaturasController],
  providers: [FaturasService],
})
export class FaturasModule {}

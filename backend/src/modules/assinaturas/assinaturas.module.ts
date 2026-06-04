import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssinaturasController } from './assinaturas.controller';
import { AssinaturasService } from './assinaturas.service';
import { Assinatura } from '../../entities/assinatura.entity';
import { Token } from '../../entities/token.entity';
import { ClienteApi } from '../../entities/cliente.entity';
import { Plano } from '../../entities/plano.entity';
import { Fatura } from '../../entities/fatura.entity';
import { Consumo } from '../../entities/consumo.entity';
import { PortalModule } from '../portal/portal.module';

@Module({
  imports: [TypeOrmModule.forFeature([Assinatura, Token, ClienteApi, Plano, Fatura, Consumo], 'buscadados'), PortalModule],
  controllers: [AssinaturasController],
  providers: [AssinaturasService],
  exports: [AssinaturasService],
})
export class AssinaturasModule {}

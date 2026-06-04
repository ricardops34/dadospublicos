import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientesController } from './clientes.controller';
import { ClientesService } from './clientes.service';
import { ClienteApi } from '../../entities/cliente.entity';
import { Assinatura } from '../../entities/assinatura.entity';
import { PortalModule } from '../portal/portal.module';
import { ParametrosModule } from '../parametros/parametros.module';
import { ClientesPoUiController } from './clientes-poui.controller';
import { CnpjModule } from '../cnpj/cnpj.module';
import { GeocodeModule } from '../geocode/geocode.module';

@Module({
  imports: [TypeOrmModule.forFeature([ClienteApi, Assinatura], 'buscadados'), PortalModule, ParametrosModule, CnpjModule, GeocodeModule],
  controllers: [ClientesController, ClientesPoUiController],
  providers: [ClientesService],
  exports: [ClientesService, TypeOrmModule],
})
export class ClientesModule {}

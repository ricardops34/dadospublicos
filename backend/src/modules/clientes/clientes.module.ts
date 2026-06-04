import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientesController } from './clientes.controller';
import { ClientesService } from './clientes.service';
import { ClienteApi } from '../../entities/cliente.entity';
import { PortalModule } from '../portal/portal.module';
import { ParametrosModule } from '../parametros/parametros.module';

@Module({
  imports: [TypeOrmModule.forFeature([ClienteApi]), PortalModule, ParametrosModule],
  controllers: [ClientesController],
  providers: [ClientesService],
  exports: [ClientesService, TypeOrmModule],
})
export class ClientesModule {}

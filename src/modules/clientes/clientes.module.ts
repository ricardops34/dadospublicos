import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientesController } from './clientes.controller';
import { ClientesService } from './clientes.service';
import { ClienteApi } from '../../entities/cliente.entity';
import { AdminModule } from '../admin/admin.module';
import { ClienteGuard } from './cliente.guard';

@Module({
  imports: [TypeOrmModule.forFeature([ClienteApi]), AdminModule],
  controllers: [ClientesController],
  providers: [ClientesService, ClienteGuard],
  exports: [ClientesService, ClienteGuard, TypeOrmModule],
})
export class ClientesModule {}

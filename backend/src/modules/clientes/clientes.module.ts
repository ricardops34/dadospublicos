import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assinatura } from '../../entities/assinatura.entity';
import { ClienteCnae } from '../../entities/cliente-cnae.entity';
import { Cliente } from '../../entities/cliente.entity';
import { Usuario } from '../../entities/usuario.entity';
import { CnpjModule } from '../cnpj/cnpj.module';
import { GeocodeModule } from '../geocode/geocode.module';
import { PortalModule } from '../portal/portal.module';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { ClientesPoUiController } from './clientes-poui.controller';
import { ClientesService } from './clientes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente, ClienteCnae, Assinatura, Usuario], 'buscadados'), PortalModule, CnpjModule, GeocodeModule, UsuariosModule],
  controllers: [ClientesPoUiController],
  providers: [ClientesService],
  exports: [ClientesService],
})
export class ClientesModule {}

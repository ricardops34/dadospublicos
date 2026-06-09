import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { Usuario } from '../../entities/usuario.entity';
import { Assinatura } from '../../entities/assinatura.entity';
import { Conta } from '../../entities/conta.entity';
import { PortalModule } from '../portal/portal.module';
import { ParametrosModule } from '../parametros/parametros.module';
import { UsuariosPoUiController } from './usuarios-poui.controller';
import { CnpjModule } from '../cnpj/cnpj.module';
import { GeocodeModule } from '../geocode/geocode.module';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Assinatura, Conta], 'buscadados'), PortalModule, ParametrosModule, CnpjModule, GeocodeModule],
  controllers: [UsuariosController, UsuariosPoUiController],
  providers: [UsuariosService],
  exports: [UsuariosService, TypeOrmModule],
})
export class UsuariosModule {}

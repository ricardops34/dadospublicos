import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { Usuario } from '../../entities/usuario.entity';
import { Assinatura } from '../../entities/assinatura.entity';
import { Cliente } from '../../entities/cliente.entity';
import { ClienteCnae } from '../../entities/cliente-cnae.entity';
import { Token } from '../../entities/token.entity';
import { PortalModule } from '../portal/portal.module';
import { ParametrosModule } from '../parametros/parametros.module';
import { EmailModule } from '../email/email.module';
import { UsuariosPoUiController } from './usuarios-poui.controller';
import { CnpjModule } from '../cnpj/cnpj.module';
import { GeocodeModule } from '../geocode/geocode.module';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Assinatura, Cliente, ClienteCnae, Token], 'buscadados'), PortalModule, ParametrosModule, EmailModule, CnpjModule, GeocodeModule],
  controllers: [UsuariosController, UsuariosPoUiController],
  providers: [UsuariosService],
  exports: [UsuariosService, TypeOrmModule],
})
export class UsuariosModule {}

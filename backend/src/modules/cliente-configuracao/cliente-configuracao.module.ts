import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClienteConfiguracao } from '../../entities/cliente-configuracao.entity';
import { Assinatura } from '../../entities/assinatura.entity';
import { ClienteConfiguracaoService } from './cliente-configuracao.service';
import { ClienteConfiguracaoController } from './cliente-configuracao.controller';
import { PortalModule } from '../portal/portal.module';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClienteConfiguracao, Assinatura], 'buscadados'),
    PortalModule,
    AdminModule,
  ],
  controllers: [ClienteConfiguracaoController],
  providers: [ClienteConfiguracaoService],
  exports: [ClienteConfiguracaoService],
})
export class ClienteConfiguracaoModule {}

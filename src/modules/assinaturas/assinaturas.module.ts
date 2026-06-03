import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssinaturasController } from './assinaturas.controller';
import { AssinaturasService } from './assinaturas.service';
import { Assinatura } from '../../entities/assinatura.entity';
import { Token } from '../../entities/token.entity';
import { ClienteApi } from '../../entities/cliente.entity';
import { Plano } from '../../entities/plano.entity';
import { AdminModule } from '../admin/admin.module';
import { ClientesModule } from '../clientes/clientes.module';

@Module({
  imports: [TypeOrmModule.forFeature([Assinatura, Token, ClienteApi, Plano]), AdminModule, ClientesModule],
  controllers: [AssinaturasController],
  providers: [AssinaturasService],
})
export class AssinaturasModule {}

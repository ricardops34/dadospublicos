import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClienteApi } from '../../entities/cliente.entity';
import { Assinatura } from '../../entities/assinatura.entity';
import { PortalService } from './portal.service';
import { PortalController } from './portal.controller';
import { JwtPortalGuard } from './jwt-portal.guard';
import { RecursoGuard } from './recurso.guard';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([ClienteApi, Assinatura], 'buscadados'),
    AdminModule,
  ],
  controllers: [PortalController],
  providers: [PortalService, JwtPortalGuard, RecursoGuard],
  exports: [JwtPortalGuard, RecursoGuard, JwtModule],
})
export class PortalModule {}

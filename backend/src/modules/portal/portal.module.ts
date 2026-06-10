import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../../entities/usuario.entity';
import { Assinatura } from '../../entities/assinatura.entity';
import { Token } from '../../entities/token.entity';
import { PortalService } from './portal.service';
import { PortalController } from './portal.controller';
import { JwtPortalGuard } from './jwt-portal.guard';
import { RecursoGuard } from './recurso.guard';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || 'rfb-portal-secret',
        signOptions: { expiresIn: '8h' },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Usuario, Assinatura, Token], 'buscadados'),
    AdminModule,
  ],
  controllers: [PortalController],
  providers: [PortalService, JwtPortalGuard, RecursoGuard],
  exports: [JwtPortalGuard, RecursoGuard, JwtModule],
})
export class PortalModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Perfil } from '../../entities/perfil.entity';
import { MenuModulo } from '../../entities/menu-modulo.entity';
import { MenuRotina } from '../../entities/menu-rotina.entity';
import { PerfilRotina } from '../../entities/perfil-rotina.entity';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { PortalModule } from '../portal/portal.module';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Perfil, MenuModulo, MenuRotina, PerfilRotina], 'buscadados'),
    PortalModule,
    AdminModule,
  ],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}

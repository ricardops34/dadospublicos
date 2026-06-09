import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../admin/admin.guard';
import { JwtPortalGuard } from '../portal/jwt-portal.guard';
import { MenuService } from './menu.service';

@ApiTags('Menu Dinâmico')
@ApiBearerAuth()
@Controller('menu')
export class MenuController {
  constructor(private readonly svc: MenuService) {}

  // ── Menu do usuário autenticado ──────────────────────────────────────────

  @Get('meu')
  @UseGuards(JwtPortalGuard)
  getMeuMenu(@Request() req: any) {
    const perfilCodigo: string = req.usuario?.perfil ?? 'cliente';
    return this.svc.getMenuParaPerfil(perfilCodigo);
  }

  // ── Perfis ───────────────────────────────────────────────────────────────

  @Get('perfis/metadata')
  @UseGuards(AdminGuard)
  getPerfisMetadata() {
    return { version: 1 };
  }

  @Get('perfis')
  @UseGuards(AdminGuard)
  findAllPerfis() {
    return this.svc.findAllPerfis().then((items) => ({ items, hasNext: false }));
  }

  @Get('perfis/:id')
  @UseGuards(AdminGuard)
  findOnePerfil(@Param('id') id: string) {
    return this.svc.findOnePerfil(id);
  }

  @Post('perfis')
  @UseGuards(AdminGuard)
  createPerfil(@Body() dto: any) {
    return this.svc.upsertPerfil(dto);
  }

  @Put('perfis/:id')
  @UseGuards(AdminGuard)
  updatePerfil(@Param('id') id: string, @Body() dto: any) {
    return this.svc.upsertPerfil({ ...dto, id });
  }

  @Delete('perfis/:id')
  @UseGuards(AdminGuard)
  removePerfil(@Param('id') id: string) {
    return this.svc.removePerfil(id);
  }

  @Get('perfis/:id/rotinas')
  @UseGuards(AdminGuard)
  getRotinasDoPerfil(@Param('id') id: string) {
    return this.svc.getRotinaIdsDoPerfil(id);
  }

  @Put('perfis/:id/rotinas')
  @UseGuards(AdminGuard)
  setRotinasDoPerfil(@Param('id') id: string, @Body() body: { rotinaIds: string[] }) {
    return this.svc.setRotinasParaPerfil(id, body.rotinaIds ?? []);
  }

  // ── Módulos ──────────────────────────────────────────────────────────────

  @Get('modulos/metadata')
  @UseGuards(AdminGuard)
  getModulosMetadata() {
    return { version: 1 };
  }

  @Get('modulos')
  @UseGuards(AdminGuard)
  findAllModulos(@Query('page') page = '1', @Query('pageSize') pageSize = '50') {
    return this.svc.findAllModulos(+page, +pageSize);
  }

  @Get('modulos/:id')
  @UseGuards(AdminGuard)
  findOneModulo(@Param('id') id: string) {
    return this.svc.findOneModulo(id);
  }

  @Post('modulos')
  @UseGuards(AdminGuard)
  createModulo(@Body() dto: any) {
    return this.svc.upsertModulo(dto);
  }

  @Put('modulos/:id')
  @UseGuards(AdminGuard)
  updateModulo(@Param('id') id: string, @Body() dto: any) {
    return this.svc.upsertModulo({ ...dto, id });
  }

  @Delete('modulos/:id')
  @UseGuards(AdminGuard)
  removeModulo(@Param('id') id: string) {
    return this.svc.removeModulo(id);
  }

  // ── Rotinas ──────────────────────────────────────────────────────────────

  @Get('rotinas/metadata')
  @UseGuards(AdminGuard)
  getRotinasMetadata() {
    return { version: 1, fields: [] };
  }

  @Get('rotinas')
  @UseGuards(AdminGuard)
  findAllRotinas(
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '50',
    @Query('moduloId') moduloId?: string,
  ) {
    return this.svc.findAllRotinas(+page, +pageSize, moduloId);
  }

  @Get('rotinas/:id')
  @UseGuards(AdminGuard)
  findOneRotina(@Param('id') id: string) {
    return this.svc.findOneRotina(id);
  }

  @Post('rotinas')
  @UseGuards(AdminGuard)
  createRotina(@Body() dto: any) {
    return this.svc.upsertRotina(dto);
  }

  @Put('rotinas/:id')
  @UseGuards(AdminGuard)
  updateRotina(@Param('id') id: string, @Body() dto: any) {
    return this.svc.upsertRotina({ ...dto, id });
  }

  @Delete('rotinas/:id')
  @UseGuards(AdminGuard)
  removeRotina(@Param('id') id: string) {
    return this.svc.removeRotina(id);
  }
}

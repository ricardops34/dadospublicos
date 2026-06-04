import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AssinaturasService } from './assinaturas.service';
import { JwtPortalGuard } from '../portal/jwt-portal.guard';
import { Perfil } from '../portal/perfil.decorator';

@ApiTags('Assinaturas')
@Controller('assinaturas')
export class AssinaturasController {
  constructor(private readonly service: AssinaturasService) {}

  // --- Cliente autenticado ---

  @Post('assinar/:plano')
  @UseGuards(JwtPortalGuard)
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Assina um plano e recebe token de API' })
  assinar(@Req() req: any, @Param('plano') plano: string) {
    return this.service.assinar(req['usuario'].sub, plano);
  }

  @Get('minha')
  @UseGuards(JwtPortalGuard)
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Detalhes da assinatura ativa e permissões do plano' })
  minha(@Req() req: any) {
    return this.service.meuToken(req['usuario'].sub);
  }

  @Get('upgrade/preview')
  @UseGuards(JwtPortalGuard)
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Simula valores de upgrade com cálculo proporcional' })
  upgradePreview(@Req() req: any, @Query('plano') plano: string) {
    return this.service.upgradePreview(req['usuario'].sub, plano);
  }

  @Post('upgrade')
  @UseGuards(JwtPortalGuard)
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Realiza upgrade de plano com fatura proporcional' })
  upgrade(@Req() req: any, @Body('plano') plano: string) {
    return this.service.upgrade(req['usuario'].sub, plano);
  }

  @Post('cancelar')
  @UseGuards(JwtPortalGuard)
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Cancela assinatura ativa' })
  cancelar(@Req() req: any, @Body('motivo') motivo?: string, @Body('quando') quando: 'agora' | 'fim-vigencia' = 'agora') {
    return this.service.cancelar(req['usuario'].sub, motivo, quando);
  }

  @Post('regerar-token')
  @UseGuards(JwtPortalGuard)
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Regera token de API (invalida o anterior)' })
  regerarToken(@Req() req: any) {
    return this.service.regerarToken(req['usuario'].sub);
  }

  // --- Admin ---

  @Get()
  @UseGuards(JwtPortalGuard)
  @Perfil('admin')
  @ApiSecurity('bearer')
  @ApiOperation({ summary: '[Admin] Lista todas as assinaturas' })
  findAll(@Query('pagina') pagina = 1, @Query('limite') limite = 50) {
    return this.service.findAll(+pagina, +limite);
  }

  @Patch(':id')
  @UseGuards(JwtPortalGuard)
  @Perfil('admin')
  @ApiSecurity('bearer')
  @ApiOperation({ summary: '[Admin] Edita dados da assinatura (plano, datas)' })
  editarAdmin(@Param('id') id: string, @Body() dto: any) {
    return this.service.editarAdmin(id, dto);
  }

  @Get(':id/consumo')
  @UseGuards(JwtPortalGuard)
  @Perfil('admin')
  @ApiSecurity('bearer')
  @ApiOperation({ summary: '[Admin] Consumo da assinatura (cria mês corrente se não existir)' })
  consumo(@Param('id') id: string) {
    return this.service.consumoDaAssinatura(id);
  }

  @Patch(':id/suspender')
  @UseGuards(JwtPortalGuard)
  @Perfil('admin')
  @ApiSecurity('bearer')
  @ApiOperation({ summary: '[Admin] Suspende assinatura (token desativado)' })
  suspender(@Param('id') id: string) {
    return this.service.suspender(id);
  }

  @Patch(':id/reativar')
  @UseGuards(JwtPortalGuard)
  @Perfil('admin')
  @ApiSecurity('bearer')
  @ApiOperation({ summary: '[Admin] Reativa assinatura suspensa' })
  reativar(@Param('id') id: string) {
    return this.service.reativar(id);
  }
}

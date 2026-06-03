import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AssinaturasService } from './assinaturas.service';
import { AdminGuard } from '../admin/admin.guard';
import { ClienteGuard } from '../clientes/cliente.guard';

@ApiTags('Assinaturas')
@Controller('assinaturas')
export class AssinaturasController {
  constructor(private readonly service: AssinaturasService) {}

  // --- Cliente autenticado ---

  @Post('assinar/:plano')
  @UseGuards(ClienteGuard)
  @ApiSecurity('x_cliente_id')
  @ApiOperation({ summary: 'Assina um plano e recebe token de API' })
  assinar(@Req() req: any, @Param('plano') plano: string) {
    return this.service.assinar(req['clienteId'], plano);
  }

  @Get('minha')
  @UseGuards(ClienteGuard)
  @ApiSecurity('x_cliente_id')
  @ApiOperation({ summary: 'Detalhes da assinatura ativa e permissões do plano' })
  minha(@Req() req: any) {
    return this.service.meuToken(req['clienteId']);
  }

  @Post('cancelar')
  @UseGuards(ClienteGuard)
  @ApiSecurity('x_cliente_id')
  @ApiOperation({ summary: 'Cancela assinatura ativa' })
  cancelar(@Req() req: any, @Body('motivo') motivo?: string) {
    return this.service.cancelar(req['clienteId'], motivo);
  }

  @Post('regerar-token')
  @UseGuards(ClienteGuard)
  @ApiSecurity('x_cliente_id')
  @ApiOperation({ summary: 'Regera token de API (invalida o anterior)' })
  regerarToken(@Req() req: any) {
    return this.service.regerarToken(req['clienteId']);
  }

  // --- Admin ---

  @Get()
  @UseGuards(AdminGuard)
  @ApiSecurity('token')
  @ApiOperation({ summary: '[Admin] Lista todas as assinaturas' })
  findAll(@Query('pagina') pagina = 1, @Query('limite') limite = 50) {
    return this.service.findAll(+pagina, +limite);
  }

  @Patch(':id/suspender')
  @UseGuards(AdminGuard)
  @ApiSecurity('token')
  @ApiOperation({ summary: '[Admin] Suspende assinatura (token desativado)' })
  suspender(@Param('id') id: string) {
    return this.service.suspender(id);
  }

  @Patch(':id/reativar')
  @UseGuards(AdminGuard)
  @ApiSecurity('token')
  @ApiOperation({ summary: '[Admin] Reativa assinatura suspensa' })
  reativar(@Param('id') id: string) {
    return this.service.reativar(id);
  }
}

import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { FaturasService } from './faturas.service';
import { AdminGuard } from '../admin/admin.guard';
import { ClienteGuard } from '../clientes/cliente.guard';

@ApiTags('Faturas')
@Controller('faturas')
export class FaturasController {
  constructor(private readonly service: FaturasService) {}

  // --- Cliente autenticado ---

  @Get('minhas')
  @UseGuards(ClienteGuard)
  @ApiSecurity('x_cliente_id')
  @ApiOperation({ summary: 'Histórico de faturas do cliente logado' })
  minhas(@Req() req: any) {
    return this.service.findByCliente(req['clienteId']);
  }

  // --- Admin ---

  @Get()
  @UseGuards(AdminGuard)
  @ApiSecurity('token')
  @ApiOperation({ summary: '[Admin] Lista todas as faturas' })
  @ApiQuery({ name: 'status', required: false, enum: ['pendente', 'paga', 'vencida', 'cancelada'] })
  @ApiQuery({ name: 'pagina', required: false })
  @ApiQuery({ name: 'limite', required: false })
  findAll(@Query('status') status?: string, @Query('pagina') pagina = 1, @Query('limite') limite = 50) {
    return this.service.findAll(status, +pagina, +limite);
  }

  @Patch(':id/paga')
  @UseGuards(AdminGuard)
  @ApiSecurity('token')
  @ApiOperation({ summary: '[Admin] Marca fatura como paga e registra NF' })
  marcarPaga(
    @Param('id') id: string,
    @Body('numero_nf') numeroNf?: string,
    @Body('url_nf') urlNf?: string,
  ) {
    return this.service.marcarPaga(id, numeroNf, urlNf);
  }

  @Post('gerar-mensais')
  @UseGuards(AdminGuard)
  @ApiSecurity('token')
  @ApiOperation({ summary: '[Admin] Gera faturas do mês anterior (equivalente ao cron)' })
  gerarMensais() {
    return this.service.gerarFaturasMensais();
  }

  @Post('gerar-manual')
  @UseGuards(AdminGuard)
  @ApiSecurity('token')
  @ApiOperation({ summary: '[Admin] Gera fatura avulsa para uma assinatura' })
  gerarManual(
    @Body('assinatura_id') assinaturaId: string,
    @Body('ano') ano: number,
    @Body('mes') mes: number,
  ) {
    return this.service.gerarManual(assinaturaId, ano, mes);
  }
}

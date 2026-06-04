import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AccessLogService } from './access-log.service';
import { JwtPortalGuard } from '../portal/jwt-portal.guard';
import { Perfil } from '../portal/perfil.decorator';

@ApiTags('Access Logs')
@Controller('access-logs')
@UseGuards(JwtPortalGuard)
@Perfil('admin')
@ApiSecurity('bearer')
export class AccessLogController {
  constructor(private readonly svc: AccessLogService) {}

  @Get()
  @ApiOperation({ summary: '[Admin] Lista logs de acesso com filtros' })
  findAll(
    @Query('clienteId') clienteId?: string,
    @Query('tokenPrefixo') tokenPrefixo?: string,
    @Query('endpoint') endpoint?: string,
    @Query('pagina') pagina = 1,
    @Query('limite') limite = 100,
  ) {
    return this.svc.findAll({ clienteId, tokenPrefixo, endpoint, pagina: +pagina, limite: +limite });
  }

  @Get('extrato/:clienteId')
  @ApiOperation({ summary: '[Admin] Extrato de acesso por cliente' })
  extrato(
    @Param('clienteId') clienteId: string,
    @Query('pagina') pagina = 1,
    @Query('limite') limite = 50,
  ) {
    return this.svc.extratoPorCliente(clienteId, +pagina, +limite);
  }

  @Get('resumo/:clienteId')
  @ApiOperation({ summary: '[Admin] Resumo de consumo por endpoint para um cliente/mês' })
  resumo(
    @Param('clienteId') clienteId: string,
    @Query('mes') mes?: number,
    @Query('ano') ano?: number,
  ) {
    const now = new Date();
    return this.svc.extratoPorClienteResumo(
      clienteId,
      mes ? +mes : now.getMonth() + 1,
      ano ? +ano : now.getFullYear(),
    );
  }
}

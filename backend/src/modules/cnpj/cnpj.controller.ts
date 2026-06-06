import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CnpjService } from './cnpj.service';
import { AuthGuard } from '../auth/auth.guard';
import { ApiRateLimitGuard } from '../auth/rate-limit.guard';
import { PlanoMinimo } from '../auth/plano.decorator';

@ApiTags('CNPJ')
@Controller('cnpj')
@UseGuards(AuthGuard, ApiRateLimitGuard)
export class CnpjController {
  constructor(private readonly service: CnpjService) {}

  @Get(':cnpj')
  @PlanoMinimo('free')
  @ApiSecurity('token')
  @ApiOperation({ summary: 'Consulta dados completos de um CNPJ' })
  @ApiParam({ name: 'cnpj', example: '27865757000102' })
  buscar(@Param('cnpj') cnpj: string) {
    return this.service.buscar(cnpj);
  }
}

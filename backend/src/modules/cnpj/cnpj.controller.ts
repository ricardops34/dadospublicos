import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags, ApiResponse } from '@nestjs/swagger';
import { CnpjService } from './cnpj.service';
import { ApiRateLimitGuard } from '../auth/rate-limit.guard';

@ApiTags('CNPJ')
@Controller('cnpj')
@UseGuards(ApiRateLimitGuard)
export class CnpjController {
  constructor(private readonly service: CnpjService) {}

  @Get(':cnpj')
  @ApiOperation({ summary: 'Consulta dados completos de um CNPJ', description: 'Gratuito — 3 req/min sem token.' })
  @ApiParam({ name: 'cnpj', example: '27865757000102' })
  buscar(@Param('cnpj') cnpj: string) {
    return this.service.buscar(cnpj);
  }
}

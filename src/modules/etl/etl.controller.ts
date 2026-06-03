import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { PlanoMinimo } from '../auth/plano.decorator';
import { EtlService } from './etl.service';

@ApiTags('ETL')
@Controller('etl')
@UseGuards(AuthGuard)
export class EtlController {
  constructor(private readonly service: EtlService) {}

  @Get('status')
  @PlanoMinimo('premium')
  @ApiSecurity('token')
  @ApiOperation({ summary: 'Status e histórico de cargas ETL' })
  status() {
    return this.service.status();
  }

  @Post('executar')
  @PlanoMinimo('premium')
  @ApiSecurity('token')
  @ApiOperation({ summary: 'Dispara carga ETL manual (não aguarda conclusão)' })
  executar() {
    this.service.executar(true).catch(() => {});
    return { mensagem: 'ETL iniciado em background. Acompanhe em GET /etl/status.' };
  }
}

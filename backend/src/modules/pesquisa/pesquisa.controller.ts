import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { PlanoMinimo } from '../auth/plano.decorator';
import { PesquisaService } from './pesquisa.service';
import { PesquisaDto } from './pesquisa.dto';

@ApiTags('Pesquisa')
@Controller('v2/pesquisa')
@UseGuards(AuthGuard)
export class PesquisaController {
  constructor(private readonly service: PesquisaService) {}

  @Get()
  @PlanoMinimo('premium')
  @ApiSecurity('token')
  @ApiOperation({ summary: 'Pesquisa avançada com até 14 filtros (Premium)', description: 'Retorna lista de CNPJs. Use GET /cnpj/:cnpj para dados completos de cada um.' })
  pesquisar(@Query() dto: PesquisaDto) {
    return this.service.pesquisar(dto);
  }
}

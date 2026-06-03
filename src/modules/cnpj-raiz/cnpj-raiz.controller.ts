import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { PlanoMinimo } from '../auth/plano.decorator';
import { CnpjRaizService } from './cnpj-raiz.service';

@ApiTags('CNPJ Raiz')
@Controller('cnpj-raiz')
@UseGuards(AuthGuard)
export class CnpjRaizController {
  constructor(private readonly service: CnpjRaizService) {}

  @Get(':cnpj_raiz')
  @PlanoMinimo('basico')
  @ApiSecurity('token')
  @ApiOperation({ summary: 'Lista todas as filiais de um CNPJ raiz' })
  @ApiParam({ name: 'cnpj_raiz', example: '27865757' })
  @ApiQuery({ name: 'pagina', required: false, type: Number })
  @ApiQuery({ name: 'limite', required: false, type: Number })
  buscar(
    @Param('cnpj_raiz') cnpjRaiz: string,
    @Query('pagina') pagina = 1,
    @Query('limite') limite = 20,
  ) {
    return this.service.buscar(cnpjRaiz, +pagina, +limite);
  }
}

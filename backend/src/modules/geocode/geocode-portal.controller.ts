import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtPortalGuard } from '../portal/jwt-portal.guard';
import { CnpjService } from '../cnpj/cnpj.service';

@ApiTags('Geocode (Portal)')
@ApiSecurity('bearer')
@Controller('portal/geocode')
@UseGuards(JwtPortalGuard)
export class GeocodePortalController {
  constructor(
    private readonly cnpj: CnpjService,
  ) {}

  @Get('cnaes')
  @ApiOperation({ summary: 'Pesquisa CNAEs no catálogo RFB — formato combo PO-UI' })
  pesquisarCnaes(@Query('filter') filter?: string, @Query('value') value?: string) {
    return this.cnpj.pesquisarCnaes(filter, value);
  }

  @Get('cnaes/:codigo')
  @ApiOperation({ summary: 'Busca um CNAE pelo código' })
  @ApiParam({ name: 'codigo', example: '6201501' })
  obterCnae(@Param('codigo') codigo: string) {
    return this.cnpj.obterCnae(codigo);
  }
}

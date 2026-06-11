import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { PlanoMinimo } from '../auth/plano.decorator';
import { GeocodeService } from './geocode.service';
import { Post } from '@nestjs/common';
import { JwtPortalGuard } from '../portal/jwt-portal.guard';
import { Perfil } from '../portal/perfil.decorator';

@ApiTags('CEP')
@Controller('cep')
@UseGuards(AuthGuard)
export class GeocodeController {
  constructor(private readonly service: GeocodeService) { }

  @Get(':cep')
  @PlanoMinimo('gratuito')
  @ApiSecurity('token')
  @ApiOperation({ summary: 'Retorna dados de endereço e coordenadas de um CEP (cache permanente)' })
  @ApiParam({ name: 'cep', description: 'CEP sem formatação', example: '01310100' })
  buscarCep(@Param('cep') cep: string) {
    return this.service.buscarCep(cep);
  }

  @Get('ufs')
  @PlanoMinimo('gratuito')
  @ApiSecurity('token')
  @ApiOperation({ summary: 'Lista todas as Unidades Federativas (UFs) do Brasil' })
  @ApiQuery({ name: 'filter', required: false, description: 'Filtro por nome ou sigla da UF', example: 'São Paulo' })
  getUfs(@Query('filter') filter?: string) {
    return this.service.getUfs(filter);
  }

  @Get('municipios/:uf')
  @PlanoMinimo('gratuito')
  @ApiSecurity('token')
  @ApiOperation({ summary: 'Lista municípios de uma UF' })
  @ApiParam({ name: 'uf', description: 'Sigla da UF', example: 'SP' })
  @ApiQuery({ name: 'filter', required: false, description: 'Filtro por nome do município', example: 'Campinas' })
  getMunicipios(@Param('uf') uf: string, @Query('filter') filter?: string) {
    return this.service.getMunicipios(uf, filter);
  }

  @Post('admin/ibge/sync')
  @UseGuards(JwtPortalGuard)
  @Perfil('admin')
  @ApiOperation({ summary: 'Sincroniza UFs e Municípios do IBGE na base dados_viacep' })
  syncIbge() {
    return this.service.syncIbge();
  }
}

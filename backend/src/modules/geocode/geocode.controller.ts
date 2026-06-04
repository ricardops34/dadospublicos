import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { PlanoMinimo } from '../auth/plano.decorator';
import { GeocodeService } from './geocode.service';
import { Post } from '@nestjs/common';
import { JwtPortalGuard } from '../portal/jwt-portal.guard';
import { Perfil } from '../portal/perfil.decorator';

@ApiTags('Geocode')
@Controller('geocode')
@UseGuards(AuthGuard)
export class GeocodeController {
  constructor(private readonly service: GeocodeService) {}

  @Get('cep/:cep')
  @PlanoMinimo('gratuito')
  @ApiSecurity('token')
  @ApiOperation({ summary: 'Converte CEP em lat/lng (cache permanente)' })
  @ApiParam({ name: 'cep', example: '01310100' })
  buscarCep(@Param('cep') cep: string) {
    return this.service.buscarCep(cep);
  }

  @Post('admin/ibge/sync')
  @UseGuards(JwtPortalGuard)
  @Perfil('admin')
  @ApiOperation({ summary: 'Sincroniza UFs e Municípios do IBGE na base dados_viacep' })
  syncIbge() {
    return this.service.syncIbge();
  }
}

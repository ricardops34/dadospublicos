import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { PlanoMinimo } from '../auth/plano.decorator';
import { GeocodeService } from './geocode.service';

@ApiTags('Geocode')
@Controller('geocode')
@UseGuards(AuthGuard)
export class GeocodeController {
  constructor(private readonly service: GeocodeService) {}

  @Get('cep/:cep')
  @PlanoMinimo('basico')
  @ApiSecurity('token')
  @ApiOperation({ summary: 'Converte CEP em lat/lng (cache permanente)' })
  @ApiParam({ name: 'cep', example: '01310100' })
  buscarCep(@Param('cep') cep: string) {
    return this.service.buscarCep(cep);
  }
}

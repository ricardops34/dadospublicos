import { Controller, Get } from '@nestjs/common';
import { GeocodeService } from './geocode.service';

@Controller('public-seed')
export class SeedController {
  constructor(private readonly geocodeService: GeocodeService) {}

  @Get('ibge')
  async runSeed() {
    return this.geocodeService.syncIbge();
  }

  @Get('ufs')
  async getUfs() {
    return this.geocodeService.getUfs();
  }

  @Get('municipios/:uf')
  async getMunicipios(@Param('uf') uf: string) {
    return this.geocodeService.getMunicipios(uf);
  }
}

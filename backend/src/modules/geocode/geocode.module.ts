import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeocodeController } from './geocode.controller';
import { SeedController } from './seed.controller';
import { GeocodeService } from './geocode.service';
import { CepGeo } from '../../entities/cep-geo.entity';
import { UfIbge } from '../../entities/uf-ibge.entity';
import { MunicipioIbge } from '../../entities/municipio-ibge.entity';
import { AuthModule } from '../auth/auth.module';
import { PortalModule } from '../portal/portal.module';

@Module({
  imports: [TypeOrmModule.forFeature([CepGeo, UfIbge, MunicipioIbge], 'viacep'), AuthModule, PortalModule],
  controllers: [GeocodeController, SeedController],
  providers: [GeocodeService],
  exports: [GeocodeService],
})
export class GeocodeModule {}

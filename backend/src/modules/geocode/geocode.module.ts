import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeocodeController } from './geocode.controller';
import { GeocodePortalController } from './geocode-portal.controller';
import { GeocodeService } from './geocode.service';
import { CepGeo } from '../../entities/cep-geo.entity';
import { UfIbge } from '../../entities/uf-ibge.entity';
import { MunicipioIbge } from '../../entities/municipio-ibge.entity';
import { AuthModule } from '../auth/auth.module';
import { PortalModule } from '../portal/portal.module';
import { ParametrosModule } from '../parametros/parametros.module';
import { CnpjModule } from '../cnpj/cnpj.module';

@Module({
  imports: [TypeOrmModule.forFeature([CepGeo, UfIbge, MunicipioIbge], 'viacep'), AuthModule, PortalModule, ParametrosModule, CnpjModule],
  controllers: [GeocodeController, GeocodePortalController],
  providers: [GeocodeService],
  exports: [GeocodeService],
})
export class GeocodeModule {}

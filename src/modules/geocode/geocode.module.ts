import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeocodeController } from './geocode.controller';
import { GeocodeService } from './geocode.service';
import { CepGeo } from '../../entities/cep-geo.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([CepGeo]), AuthModule],
  controllers: [GeocodeController],
  providers: [GeocodeService],
  exports: [GeocodeService],
})
export class GeocodeModule {}

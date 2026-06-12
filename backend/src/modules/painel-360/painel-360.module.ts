import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Painel360Controller } from './painel-360.controller';
import { Painel360Service } from './painel-360.service';
import { Painel360Lote } from '../../entities/painel-360-lote.entity';
import { Painel360Item } from '../../entities/painel-360-item.entity';
import { Painel360Consulta } from '../../entities/painel-360-consulta.entity';
import { Estabelecimento } from '../../entities/estabelecimento.entity';
import { EmpresaRfb } from '../../entities/empresa-rfb.entity';
import { CepGeo } from '../../entities/cep-geo.entity';
import { Simples } from '../../entities/simples.entity';
import { Municipio } from '../../entities/municipio.entity';
import { Cnae } from '../../entities/cnae.entity';
import { Assinatura } from '../../entities/assinatura.entity';
import { PortalModule } from '../portal/portal.module';
import { GeocodeModule } from '../geocode/geocode.module';
import { ClienteConfiguracaoModule } from '../cliente-configuracao/cliente-configuracao.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Painel360Lote, Painel360Item, Painel360Consulta, Assinatura], 'buscadados'),
    TypeOrmModule.forFeature([CepGeo], 'viacep'),
    TypeOrmModule.forFeature([Estabelecimento, EmpresaRfb, Simples, Municipio, Cnae]),
    PortalModule,
    GeocodeModule,
    ClienteConfiguracaoModule,
  ],
  controllers: [Painel360Controller],
  providers: [Painel360Service],
})
export class Painel360Module {}

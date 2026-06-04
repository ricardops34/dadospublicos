import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Painel360Controller } from './painel-360.controller';
import { Painel360Service } from './painel-360.service';
import { Painel360Lote } from '../../entities/painel-360-lote.entity';
import { Painel360Item } from '../../entities/painel-360-item.entity';
import { Estabelecimento } from '../../entities/estabelecimento.entity';
import { EmpresaRfb } from '../../entities/empresa-rfb.entity';
import { CepGeo } from '../../entities/cep-geo.entity';
import { Simples } from '../../entities/simples.entity';
import { Municipio } from '../../entities/municipio.entity';
import { Assinatura } from '../../entities/assinatura.entity';
import { PortalModule } from '../portal/portal.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Painel360Lote, Painel360Item, Assinatura], 'buscadados'),
    TypeOrmModule.forFeature([CepGeo], 'viacep'),
    TypeOrmModule.forFeature([Estabelecimento, EmpresaRfb, Simples, Municipio]),
    PortalModule,
  ],
  controllers: [Painel360Controller],
  providers: [Painel360Service],
})
export class Painel360Module {}

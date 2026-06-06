import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CnpjController } from './cnpj.controller';
import { CnpjService } from './cnpj.service';
import { EmpresaRfb } from '../../entities/empresa-rfb.entity';
import { Estabelecimento } from '../../entities/estabelecimento.entity';
import { Socio } from '../../entities/socio.entity';
import { Simples } from '../../entities/simples.entity';
import { Cnae } from '../../entities/cnae.entity';
import { Municipio } from '../../entities/municipio.entity';
import { NaturezaJuridica } from '../../entities/natureza-juridica.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([EmpresaRfb, Estabelecimento, Socio, Simples, Cnae, Municipio, NaturezaJuridica]), AuthModule],
  controllers: [CnpjController],
  providers: [CnpjService],
  exports: [CnpjService],
})
export class CnpjModule {}

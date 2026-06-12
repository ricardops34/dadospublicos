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
import { Qualificacao } from '../../entities/qualificacao.entity';
import { Motivo } from '../../entities/motivo.entity';
import { Pais } from '../../entities/pais.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([
    EmpresaRfb,
    Estabelecimento,
    Socio,
    Simples,
    Cnae,
    Municipio,
    NaturezaJuridica,
    Qualificacao,
    Motivo,
    Pais,
  ]), AuthModule],
  controllers: [CnpjController],
  providers: [CnpjService],
  exports: [CnpjService],
})
export class CnpjModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CnpjRaizController } from './cnpj-raiz.controller';
import { CnpjRaizService } from './cnpj-raiz.service';
import { EmpresaRfb } from '../../entities/empresa-rfb.entity';
import { Estabelecimento } from '../../entities/estabelecimento.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([EmpresaRfb, Estabelecimento]), AuthModule],
  controllers: [CnpjRaizController],
  providers: [CnpjRaizService],
})
export class CnpjRaizModule {}

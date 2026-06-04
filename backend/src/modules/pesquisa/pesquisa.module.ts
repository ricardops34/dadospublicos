import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PesquisaController } from './pesquisa.controller';
import { PesquisaService } from './pesquisa.service';
import { Estabelecimento } from '../../entities/estabelecimento.entity';
import { EmpresaRfb } from '../../entities/empresa-rfb.entity';
import { Simples } from '../../entities/simples.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Estabelecimento, EmpresaRfb, Simples]), AuthModule],
  controllers: [PesquisaController],
  providers: [PesquisaService],
})
export class PesquisaModule {}

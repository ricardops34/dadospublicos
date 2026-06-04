import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from '../../entities/token.entity';
import { Consumo } from '../../entities/consumo.entity';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Token, Consumo])],
  providers: [AuthGuard],
  exports: [AuthGuard, TypeOrmModule],
})
export class AuthModule {}

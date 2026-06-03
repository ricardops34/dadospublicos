import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthController } from './health.controller';
import { EtlLog } from '../../entities/etl-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EtlLog])],
  controllers: [HealthController],
})
export class HealthModule {}

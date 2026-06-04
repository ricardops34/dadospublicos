import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessLog } from '../../entities/access-log.entity';
import { AccessLogMiddleware } from './access-log.middleware';
import { AccessLogService } from './access-log.service';
import { AccessLogController } from './access-log.controller';
import { PortalModule } from '../portal/portal.module';

@Module({
  imports: [TypeOrmModule.forFeature([AccessLog]), PortalModule],
  providers: [AccessLogService, AccessLogMiddleware],
  controllers: [AccessLogController],
  exports: [AccessLogMiddleware, TypeOrmModule],
})
export class AccessLogModule {}

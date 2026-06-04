import { Module } from '@nestjs/common';
import { InterPixService } from './inter-pix.service';
import { InterPixController } from './inter-pix.controller';
import { ParametrosModule } from '../parametros/parametros.module';

@Module({
  imports: [ParametrosModule],
  controllers: [InterPixController],
  providers: [InterPixService],
  exports: [InterPixService],
})
export class InterPixModule {}

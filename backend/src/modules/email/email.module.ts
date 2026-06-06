import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ParametrosModule } from '../parametros/parametros.module';

@Global()
@Module({
  imports: [ParametrosModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}

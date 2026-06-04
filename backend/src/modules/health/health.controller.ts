import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EtlLog } from '../../entities/etl-log.entity';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(@InjectRepository(EtlLog) private logs: Repository<EtlLog>) {}

  @Get()
  @ApiOperation({ summary: 'Health check do serviço' })
  async check() {
    const ultimoEtl = await this.logs.findOne({ where: { status: 'concluido' }, order: { concluidoEm: 'DESC' } });
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      etl_ultima_carga: ultimoEtl?.concluidoEm ?? null,
      etl_competencia: ultimoEtl?.competencia ?? null,
    };
  }
}

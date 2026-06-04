import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { EtlService } from './etl.service';
import { JwtPortalGuard } from '../portal/jwt-portal.guard';
import { Perfil } from '../portal/perfil.decorator';
import { EtlFase } from '../../entities/etl-log.entity';

@ApiTags('ETL')
@Controller('etl')
@UseGuards(JwtPortalGuard)
@Perfil('admin')
@ApiSecurity('bearer')
export class EtlController {
  constructor(private readonly service: EtlService) {}

  @Get('status')
  @ApiOperation({ summary: '[Admin] Status atual e histórico de execuções ETL' })
  status() {
    return this.service.status();
  }

  @Get('arquivos')
  @ApiOperation({ summary: '[Admin] Lista arquivos RFB no servidor (ZIP e CSV extraído)' })
  arquivos() {
    return this.service.listarArquivos();
  }

  @Post('executar')
  @ApiOperation({ summary: '[Admin] Inicia ETL — fase: completo | download | extracao | carga' })
  executar(@Body('fase') fase: EtlFase = 'completo') {
    return this.service.executar(fase);
  }
}

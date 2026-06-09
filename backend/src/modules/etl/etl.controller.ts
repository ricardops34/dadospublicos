import { Body, Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common';
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
  @ApiOperation({ summary: '[Admin] Status atual e historico de execucoes ETL' })
  status(@Query('page') page?: string, @Query('pageSize') pageSize?: string) {
    return this.service.status(Number(page), Number(pageSize));
  }

  @Get('arquivos')
  @ApiOperation({ summary: '[Admin] Lista arquivos RFB no servidor (ZIP e CSV extraido)' })
  arquivos() {
    return this.service.listarArquivos();
  }

  @Post('executar')
  @ApiOperation({ summary: '[Admin] Inicia ETL - fase: completo | download | extracao | carga; competencia: YYYY-MM (padrao: mes atual)' })
  executar(@Body('fase') fase: EtlFase = 'completo', @Body('competencia') competencia?: string) {
    return this.service.executar(fase, competencia);
  }

  @Post('extrair-tar')
  @ApiOperation({ summary: '[Admin] Extrai cnpj.tar.gz (ou outro .tar.gz) do downloadDir para o extrairDir. Após isso, execute fase=carga.' })
  extrairTar(@Body('arquivo') arquivo?: string) {
    return this.service.extrairTarGz(arquivo);
  }

  @Delete('logs')
  @ApiOperation({ summary: '[Admin] Limpa o historico de execucoes do ETL' })
  limparLogs() {
    return this.service.limparLogs();
  }
}

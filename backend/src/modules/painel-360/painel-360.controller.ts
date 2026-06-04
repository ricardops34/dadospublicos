import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Painel360Service } from './painel-360.service';
import { JwtPortalGuard } from '../portal/jwt-portal.guard';
import { Perfil } from '../portal/perfil.decorator';
import { RecursoPortal } from '../portal/recurso.decorator';
import { RecursoGuard } from '../portal/recurso.guard';

@Controller('painel-360')
@UseGuards(JwtPortalGuard, RecursoGuard)
@Perfil('admin', 'cliente')
@RecursoPortal('painel-360')
export class Painel360Controller {
  constructor(private readonly service: Painel360Service) {}

  @Post(['lotes', ':perfil/lotes'])
  @UseInterceptors(FileInterceptor('arquivo'))
  criarLote(@Req() req: any, @UploadedFile() arquivo: any) {
    return this.service.criarLote(req['usuario'], arquivo);
  }

  @Get(['lotes', ':perfil/lotes'])
  listarLotes(@Req() req: any) {
    return this.service.listarLotes(req['usuario']);
  }

  @Get(['lotes/:id', ':perfil/lotes/:id'])
  obterLote(@Req() req: any, @Param('id') id: string) {
    return this.service.obterLote(id, req['usuario']);
  }

  @Get(['lotes/:id/resultados', ':perfil/lotes/:id/resultados'])
  resultados(
    @Req() req: any,
    @Param('id') id: string,
    @Query('pagina') pagina?: string,
    @Query('limite') limite?: string,
  ) {
    return this.service.obterResultados(
      id,
      req['usuario'],
      pagina ? Number(pagina) : undefined,
      limite ? Number(limite) : undefined,
    );
  }

  @Get(['lotes/:id/download', ':perfil/lotes/:id/download'])
  async download(@Req() req: any, @Param('id') id: string, @Res() res: any) {
    const arquivo = await this.service.gerarDownloadCsv(id, req['usuario']);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${arquivo.nome}"`);
    res.send(arquivo.conteudo);
  }

  @Get(['lotes/:id/geojson', ':perfil/lotes/:id/geojson'])
  geojson(@Req() req: any, @Param('id') id: string) {
    return this.service.obterGeoJson(id, req['usuario']);
  }
}

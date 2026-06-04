import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../admin/admin.guard';
import { ParametrosService } from './parametros.service';

export class SalvarParametroDto {
  valor: string;
  descricao?: string;
}

@ApiTags('Parâmetros (Admin)')
@ApiHeader({ name: 'x-admin-key', required: true, description: 'Chave administrativa' })
@UseGuards(AdminGuard)
@Controller('admin/parametros')
export class ParametrosController {
  constructor(private readonly svc: ParametrosService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todos os parâmetros' })
  findAll() {
    return this.svc.findAll();
  }

  @Get(':chave')
  @ApiOperation({ summary: 'Busca parâmetro por chave' })
  findOne(@Param('chave') chave: string) {
    return this.svc.findOne(chave);
  }

  @Post(':chave')
  @ApiOperation({ summary: 'Cria ou atualiza um parâmetro' })
  createOrUpdate(@Param('chave') chave: string, @Body() dto: SalvarParametroDto) {
    return this.svc.createOrUpdate(chave, dto.valor, dto.descricao);
  }

  @Delete(':chave')
  @ApiOperation({ summary: 'Remove um parâmetro' })
  remove(@Param('chave') chave: string) {
    return this.svc.remove(chave);
  }
}

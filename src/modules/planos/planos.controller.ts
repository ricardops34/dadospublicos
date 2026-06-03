import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { PlanosService } from './planos.service';
import { CreatePlanoDto } from './dto/create-plano.dto';
import { UpdatePlanoDto } from './dto/update-plano.dto';
import { AdminGuard } from '../admin/admin.guard';

@ApiTags('Planos')
@Controller('planos')
export class PlanosController {
  constructor(private readonly service: PlanosService) {}

  // Público — exibe tabela de preços
  @Get()
  @ApiOperation({ summary: 'Lista planos disponíveis (público — tabela de preços)' })
  @ApiQuery({ name: 'todos', required: false, type: Boolean })
  findAll(@Query('todos') todos?: string) {
    return this.service.findAll(todos !== 'true');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhe de um plano' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // Admin
  @Post()
  @UseGuards(AdminGuard)
  @ApiSecurity('token')
  @ApiOperation({ summary: '[Admin] Cria novo plano' })
  create(@Body() dto: CreatePlanoDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiSecurity('token')
  @ApiOperation({ summary: '[Admin] Atualiza plano' })
  update(@Param('id') id: string, @Body() dto: UpdatePlanoDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiSecurity('token')
  @ApiOperation({ summary: '[Admin] Desativa plano' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Post('seed')
  @UseGuards(AdminGuard)
  @ApiSecurity('token')
  @ApiOperation({ summary: '[Admin] Popula planos padrão (Gratuito/Básico/Profissional/Premium)' })
  seed() {
    return this.service.seed();
  }
}

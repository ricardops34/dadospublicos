import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PlanosService } from './planos.service';
import { CreatePlanoDto } from './dto/create-plano.dto';
import { UpdatePlanoDto } from './dto/update-plano.dto';
import { JwtPortalGuard } from '../portal/jwt-portal.guard';
import { Perfil } from '../portal/perfil.decorator';

class CreateRecursoDto {
  @IsNotEmpty() @IsString() nome: string;
  @IsNotEmpty() @IsString() slug: string;
}

class UpdateRecursoDto {
  @IsOptional() @IsString() nome?: string;
  @IsOptional() @IsBoolean() ativo?: boolean;
}

class AddRecursoPlanoDto {
  @IsNotEmpty() @IsString() recursoId: string;
  @IsNotEmpty() @IsString() descricaoExibicao: string;
  @IsOptional() @IsNumber() @Min(0) ordem?: number;
}

class UpdateRecursoPlanoDto {
  @IsOptional() @IsString() descricaoExibicao?: string;
  @IsOptional() @IsNumber() @Min(0) ordem?: number;
}

@ApiTags('Planos')
@Controller('planos')
export class PlanosController {
  constructor(private readonly service: PlanosService) {}

  // ─── Público ──────────────────────────────────────────────────────────────

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

  // ─── Admin — Planos ───────────────────────────────────────────────────────

  @Post()
  @UseGuards(JwtPortalGuard) @Perfil('admin') @ApiSecurity('bearer')
  @ApiOperation({ summary: '[Admin] Cria novo plano' })
  create(@Body() dto: CreatePlanoDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtPortalGuard) @Perfil('admin') @ApiSecurity('bearer')
  @ApiOperation({ summary: '[Admin] Atualiza plano' })
  update(@Param('id') id: string, @Body() dto: UpdatePlanoDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtPortalGuard) @Perfil('admin') @ApiSecurity('bearer')
  @ApiOperation({ summary: '[Admin] Desativa plano' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Post('seed')
  @UseGuards(JwtPortalGuard) @Perfil('admin') @ApiSecurity('bearer')
  @ApiOperation({ summary: '[Admin] Popula planos padrão' })
  seed() {
    return this.service.seed();
  }

  // ─── Admin — Recursos (catálogo) ─────────────────────────────────────────

  @Get('recursos/catalogo')
  @UseGuards(JwtPortalGuard) @Perfil('admin') @ApiSecurity('bearer')
  @ApiOperation({ summary: '[Admin] Lista catálogo de recursos' })
  findAllRecursos() {
    return this.service.findAllRecursos();
  }

  @Post('recursos/catalogo')
  @UseGuards(JwtPortalGuard) @Perfil('admin') @ApiSecurity('bearer')
  @ApiOperation({ summary: '[Admin] Cria recurso no catálogo' })
  createRecurso(@Body() dto: CreateRecursoDto) {
    return this.service.createRecurso(dto);
  }

  @Patch('recursos/catalogo/:id')
  @UseGuards(JwtPortalGuard) @Perfil('admin') @ApiSecurity('bearer')
  @ApiOperation({ summary: '[Admin] Atualiza recurso do catálogo' })
  updateRecurso(@Param('id') id: string, @Body() dto: UpdateRecursoDto) {
    return this.service.updateRecurso(id, dto);
  }

  @Delete('recursos/catalogo/:id')
  @UseGuards(JwtPortalGuard) @Perfil('admin') @ApiSecurity('bearer')
  @ApiOperation({ summary: '[Admin] Desativa recurso do catálogo' })
  removeRecurso(@Param('id') id: string) {
    return this.service.removeRecurso(id);
  }

  // ─── Admin — Recurso × Plano (associações) ───────────────────────────────

  @Get(':planoId/recursos')
  @UseGuards(JwtPortalGuard) @Perfil('admin') @ApiSecurity('bearer')
  @ApiOperation({ summary: '[Admin] Lista recursos de um plano' })
  findRecursosDePlano(@Param('planoId') planoId: string) {
    return this.service.findRecursosDePlano(planoId);
  }

  @Post(':planoId/recursos')
  @UseGuards(JwtPortalGuard) @Perfil('admin') @ApiSecurity('bearer')
  @ApiOperation({ summary: '[Admin] Adiciona recurso a um plano' })
  addRecursoAoPlano(@Param('planoId') planoId: string, @Body() dto: AddRecursoPlanoDto) {
    return this.service.addRecursoAoPlano(planoId, dto);
  }

  @Patch(':planoId/recursos/:assocId')
  @UseGuards(JwtPortalGuard) @Perfil('admin') @ApiSecurity('bearer')
  @ApiOperation({ summary: '[Admin] Atualiza descrição/ordem de um recurso no plano' })
  updateRecursoDoPlano(@Param('assocId') assocId: string, @Body() dto: UpdateRecursoPlanoDto) {
    return this.service.updateRecursoDoPlano(assocId, dto);
  }

  @Delete(':planoId/recursos/:assocId')
  @UseGuards(JwtPortalGuard) @Perfil('admin') @ApiSecurity('bearer')
  @ApiOperation({ summary: '[Admin] Remove recurso de um plano' })
  removeRecursoDoPlano(@Param('assocId') assocId: string) {
    return this.service.removeRecursoDoPlano(assocId);
  }
}

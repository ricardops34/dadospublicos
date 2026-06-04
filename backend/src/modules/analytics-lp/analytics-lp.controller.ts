import { Body, Controller, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { IsIn, IsInt, IsObject, IsOptional, IsString, Max, Min } from 'class-validator';
import { AnalyticsLpService } from './analytics-lp.service';
import { JwtPortalGuard } from '../portal/jwt-portal.guard';
import { Perfil } from '../portal/perfil.decorator';
import { TipoEvento } from '../../entities/evento-lp.entity';

class RegistrarVisitaDto {
  @IsString() sessionId: string;
  @IsOptional() @IsString() utmSource?: string;
  @IsOptional() @IsString() utmMedium?: string;
  @IsOptional() @IsString() utmCampaign?: string;
  @IsOptional() @IsString() utmTerm?: string;
  @IsOptional() @IsString() utmContent?: string;
  @IsOptional() @IsString() referrer?: string;
  @IsOptional() @IsString() landingUrl?: string;
  @IsOptional() @IsIn(['mobile', 'tablet', 'desktop']) deviceType?: 'mobile' | 'tablet' | 'desktop';
  @IsOptional() @IsString() browser?: string;
  @IsOptional() @IsString() os?: string;
  @IsOptional() @IsInt() @Min(0) @Max(9999) screenWidth?: number;
}

class AtualizarCookiesDto {
  @IsString() sessionId: string;
  aceito: boolean;
}

class RegistrarEventoDto {
  @IsString() sessionId: string;
  @IsIn(['scroll', 'secao_vista', 'clique', 'tempo_pagina', 'saida']) tipo: TipoEvento;
  @IsOptional() @IsObject() dados?: Record<string, any>;
}

class RegistrarConversaoDto {
  @IsString() sessionId: string;
  @IsString() clienteId: string;
}

@ApiTags('Analytics LP')
@Controller('analytics-lp')
export class AnalyticsLpController {
  constructor(private readonly service: AnalyticsLpService) {}

  // --- Público (chamado pelo browser) ---

  @Post('visita')
  @ApiOperation({ summary: 'Registra nova visita à LP (UTM + device)' })
  registrarVisita(@Body() dto: RegistrarVisitaDto) {
    return this.service.registrarVisita(dto);
  }

  @Patch('cookies')
  @ApiOperation({ summary: 'Atualiza consentimento de cookies da sessão' })
  atualizarCookies(@Body() dto: AtualizarCookiesDto) {
    return this.service.atualizarCookies(dto.sessionId, dto.aceito);
  }

  @Post('evento')
  @ApiOperation({ summary: 'Registra evento de comportamento (scroll, seção vista, clique, tempo)' })
  registrarEvento(@Body() dto: RegistrarEventoDto) {
    return this.service.registrarEvento(dto.sessionId, dto.tipo, dto.dados);
  }

  @Post('conversao')
  @ApiOperation({ summary: 'Associa visita ao cliente após cadastro' })
  registrarConversao(@Body() dto: RegistrarConversaoDto) {
    return this.service.registrarConversao(dto.sessionId, dto.clienteId);
  }

  // --- Admin ---

  @Get('relatorio')
  @UseGuards(JwtPortalGuard)
  @Perfil('admin')
  @ApiSecurity('bearer')
  @ApiOperation({ summary: '[Admin] Relatório consolidado de analytics da LP' })
  relatorio(@Query('dias') dias = 30) {
    return this.service.relatorio(+dias);
  }

  @Get('visitas')
  @UseGuards(JwtPortalGuard)
  @Perfil('admin')
  @ApiSecurity('bearer')
  @ApiOperation({ summary: '[Admin] Lista visitas paginadas' })
  listarVisitas(@Query('pagina') pagina = 1, @Query('limite') limite = 50) {
    return this.service.listarVisitas(+pagina, +limite);
  }
}

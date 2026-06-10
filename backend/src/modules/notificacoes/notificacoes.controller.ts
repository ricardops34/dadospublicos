import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { NotificacoesService } from './notificacoes.service';
import { JwtPortalGuard } from '../portal/jwt-portal.guard';
import { AdminGuard } from '../admin/admin.guard';
import { NotificacaoTipo } from '../../entities/notificacao.entity';

class CriarNotificacaoDto {
  @IsNotEmpty() titulo: string;
  @IsNotEmpty() mensagem: string;
  @IsIn(['sistema', 'financeiro', 'conta', 'consumo']) tipo: NotificacaoTipo;
  @IsOptional() @IsUUID() usuarioId?: string;
  /** alias legado de usuarioId */
  @IsOptional() @IsUUID() clienteId?: string;
}

@ApiTags('Notificações')
@Controller('portal/notificacoes')
export class NotificacoesController {
  constructor(private readonly svc: NotificacoesService) {}

  @Get('minhas')
  @UseGuards(JwtPortalGuard)
  @ApiSecurity('token')
  @ApiOperation({ summary: 'Lista notificações do usuário logado (pessoais + broadcast)' })
  minhas(@Req() req: any) {
    return this.svc.minhas(req.usuario.sub);
  }

  @Get('nao-lidas/count')
  @UseGuards(JwtPortalGuard)
  @ApiSecurity('token')
  @ApiOperation({ summary: 'Conta notificações não lidas do usuário logado' })
  async contarNaoLidas(@Req() req: any) {
    const total = await this.svc.contarNaoLidas(req.usuario.sub);
    return { total };
  }

  @Patch('marcar-lidas')
  @UseGuards(JwtPortalGuard)
  @ApiSecurity('token')
  @ApiOperation({ summary: 'Marca todas as notificações do usuário como lidas' })
  marcarLidas(@Req() req: any) {
    return this.svc.marcarTodasLidas(req.usuario.sub);
  }

  @Post()
  @UseGuards(AdminGuard)
  @ApiSecurity('x-admin-key')
  @ApiOperation({ summary: '[Admin] Cria notificação (broadcast ou para usuário específico)' })
  criar(@Body() dto: CriarNotificacaoDto) {
    return this.svc.criar(dto.titulo, dto.mensagem, dto.tipo, dto.usuarioId ?? dto.clienteId);
  }
}

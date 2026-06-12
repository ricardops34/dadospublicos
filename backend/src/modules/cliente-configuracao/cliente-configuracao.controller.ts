import { Body, Controller, Delete, Get, Param, Put, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtPortalGuard } from '../portal/jwt-portal.guard';
import { AdminGuard } from '../admin/admin.guard';
import { ClienteConfiguracaoService } from './cliente-configuracao.service';
import { Assinatura } from '../../entities/assinatura.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

class SetConfiguracaoDto {
  valor: string;
}

@ApiTags('Integrações')
@Controller('integracoes')
export class ClienteConfiguracaoController {
  constructor(
    private readonly service: ClienteConfiguracaoService,
    @InjectRepository(Assinatura, 'buscadados')
    private readonly assinaturas: Repository<Assinatura>,
  ) {}

  // ─── Portal: cliente gerencia as próprias integrações ───────────────────

  @Get()
  @UseGuards(JwtPortalGuard)
  @ApiSecurity('token')
  @ApiOperation({ summary: 'Lista integrações do cliente autenticado' })
  async listar(@Req() req: any) {
    const clienteId = await this.obterClienteId(req.usuario.sub);
    if (!clienteId) return [];
    return this.service.listar(clienteId);
  }

  @Put(':chave')
  @UseGuards(JwtPortalGuard)
  @ApiSecurity('token')
  @ApiOperation({ summary: 'Salva ou atualiza uma integração do cliente' })
  async salvar(@Req() req: any, @Param('chave') chave: string, @Body() dto: SetConfiguracaoDto) {
    const clienteId = await this.obterClienteId(req.usuario.sub);
    if (!clienteId) return { ok: false };
    await this.service.salvar(clienteId, chave, dto.valor.trim());
    return { ok: true };
  }

  @Delete(':chave')
  @UseGuards(JwtPortalGuard)
  @ApiSecurity('token')
  @ApiOperation({ summary: 'Remove uma integração do cliente' })
  async remover(@Req() req: any, @Param('chave') chave: string) {
    const clienteId = await this.obterClienteId(req.usuario.sub);
    if (!clienteId) return { ok: false };
    await this.service.remover(clienteId, chave);
    return { ok: true };
  }

  // ─── Admin: gerencia integrações de qualquer cliente ────────────────────

  @Get('admin/:clienteId')
  @UseGuards(AdminGuard)
  @ApiSecurity('token')
  @ApiOperation({ summary: '[Admin] Lista integrações de um cliente' })
  listarAdmin(@Param('clienteId') clienteId: string) {
    return this.service.listar(clienteId);
  }

  @Put('admin/:clienteId/:chave')
  @UseGuards(AdminGuard)
  @ApiSecurity('token')
  @ApiOperation({ summary: '[Admin] Salva integração de um cliente' })
  async salvarAdmin(
    @Param('clienteId') clienteId: string,
    @Param('chave') chave: string,
    @Body() dto: SetConfiguracaoDto,
  ) {
    await this.service.salvar(clienteId, chave, dto.valor.trim());
    return { ok: true };
  }

  @Delete('admin/:clienteId/:chave')
  @UseGuards(AdminGuard)
  @ApiSecurity('token')
  @ApiOperation({ summary: '[Admin] Remove integração de um cliente' })
  async removerAdmin(@Param('clienteId') clienteId: string, @Param('chave') chave: string) {
    await this.service.remover(clienteId, chave);
    return { ok: true };
  }

  // ─── Auxiliar ────────────────────────────────────────────────────────────

  private async obterClienteId(usuarioId: string): Promise<string | null> {
    const assinatura = await this.assinaturas.findOne({
      where: { usuarioId },
      order: { criadoEm: 'DESC' },
    });
    return assinatura?.clienteId ?? null;
  }
}

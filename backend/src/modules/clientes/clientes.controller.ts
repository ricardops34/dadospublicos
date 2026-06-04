import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ClientesService } from './clientes.service';
import { AgendarExclusaoDto, CreateClienteDto, LoginClienteDto, RecuperarSenhaDto, UpdateClienteDto } from './dto/create-cliente.dto';
import { JwtPortalGuard } from '../portal/jwt-portal.guard';
import { Perfil } from '../portal/perfil.decorator';

@ApiTags('Clientes')
@Controller('clientes')
export class ClientesController {
  constructor(private readonly service: ClientesService) {}

  // --- Público ---

  @Post('signup')
  @ApiOperation({ summary: 'Cadastro de novo cliente (público)' })
  signup(@Body() dto: CreateClienteDto) {
    return this.service.signup(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login do cliente (retorna dados + assinatura ativa)' })
  login(@Body() dto: LoginClienteDto) {
    return this.service.login(dto);
  }

  @Post('recuperar-senha')
  @ApiOperation({ summary: 'Solicita link de redefinição de senha por e-mail' })
  recuperarSenha(@Body() dto: RecuperarSenhaDto) {
    return this.service.solicitarResetSenha(dto.email);
  }

  @Get('verificar-email/:token')
  @ApiOperation({ summary: 'Verifica e-mail via token enviado por e-mail' })
  verificarEmail(@Param('token') token: string) {
    return this.service.verificarEmail(token);
  }

  // --- Cliente autenticado ---

  @Get('me')
  @UseGuards(JwtPortalGuard)
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Perfil do cliente logado + assinatura + token de API' })
  meuPerfil(@Req() req: any) {
    return this.service.meuPerfil(req['usuario'].sub);
  }

  @Patch('me')
  @UseGuards(JwtPortalGuard)
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Atualiza dados do perfil' })
  atualizar(@Req() req: any, @Body() dto: UpdateClienteDto) {
    return this.service.atualizar(req['usuario'].sub, dto);
  }

  @Post('me/agendar-exclusao')
  @UseGuards(JwtPortalGuard)
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Solicita exclusão imediata ou agendada para fim do plano' })
  agendarExclusao(@Req() req: any, @Body() dto: AgendarExclusaoDto) {
    return this.service.agendarExclusao(req['usuario'].sub, dto);
  }

  // --- Admin ---

  @Get()
  @UseGuards(JwtPortalGuard)
  @Perfil('admin')
  @ApiSecurity('bearer')
  @ApiOperation({ summary: '[Admin] Lista todos os clientes' })
  findAll(
    @Query('pagina') pagina = 1,
    @Query('limite') limite = 50,
    @Query('busca') busca?: string,
    @Query('status') status?: string,
  ) {
    return this.service.findAll(+pagina, +limite, busca, status);
  }

  @Get(':id')
  @UseGuards(JwtPortalGuard)
  @Perfil('admin')
  @ApiSecurity('bearer')
  @ApiOperation({ summary: '[Admin] Detalhe do cliente com assinaturas e faturas' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtPortalGuard)
  @Perfil('admin')
  @ApiSecurity('bearer')
  @ApiOperation({ summary: '[Admin] Atualiza dados do cliente' })
  atualizarAdmin(@Param('id') id: string, @Body() dto: UpdateClienteDto) {
    return this.service.atualizar(id, dto);
  }

  @Patch(':id/ativo')
  @UseGuards(JwtPortalGuard)
  @Perfil('admin')
  @ApiSecurity('bearer')
  @ApiOperation({ summary: '[Admin] Ativa ou suspende cliente' })
  ativar(@Param('id') id: string, @Body('ativo') ativo: boolean) {
    return this.service.ativar(id, ativo);
  }

  @Patch(':id/confirmar-email')
  @UseGuards(JwtPortalGuard)
  @Perfil('admin')
  @ApiSecurity('bearer')
  @ApiOperation({ summary: '[Admin] Marca e-mail do cliente como verificado' })
  confirmarEmail(@Param('id') id: string) {
    return this.service.confirmarEmail(id);
  }

  @Post(':id/enviar-reset-senha')
  @UseGuards(JwtPortalGuard)
  @Perfil('admin')
  @ApiSecurity('bearer')
  @ApiOperation({ summary: '[Admin] Envia link de redefinição de senha ao cliente' })
  enviarResetSenha(@Param('id') id: string) {
    return this.service.enviarResetPorAdmin(id);
  }

  @Delete(':id')
  @UseGuards(JwtPortalGuard)
  @Perfil('admin')
  @ApiSecurity('bearer')
  @ApiOperation({ summary: '[Admin] Exclui e anonimiza imediatamente a conta do cliente' })
  excluirContaAdmin(@Param('id') id: string) {
    return this.service.excluirConta(id);
  }
}

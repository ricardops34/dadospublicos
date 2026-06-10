import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UsuariosService } from './usuarios.service';
import { AgendarExclusaoDto, CreateUsuarioDto, CriarUsuarioClienteDto, EditarUsuarioClienteDto, LoginUsuarioDto, RecuperarSenhaDto, UpdateUsuarioDto, VerificarEmailCodigoDto } from './dto/create-usuario.dto';
import { JwtPortalGuard } from '../portal/jwt-portal.guard';
import { ParametrosService } from '../parametros/parametros.service';

@ApiTags('Usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(
    private readonly service: UsuariosService,
    private readonly params: ParametrosService,
  ) {}

  @Get('status-registro')
  @ApiOperation({ summary: 'Retorna se novos cadastros estão habilitados (público)' })
  async statusRegistro() {
    const valor = await this.params.getValor('REGISTROS_HABILITADOS', 'false');
    return { habilitado: valor === 'true' };
  }

  @Post('signup')
  @ApiOperation({ summary: 'Cadastro de novo usuário (público)' })
  signup(@Body() dto: CreateUsuarioDto) {
    return this.service.signup(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login do usuário (retorna dados + assinatura ativa)' })
  login(@Body() dto: LoginUsuarioDto) {
    return this.service.login(dto);
  }

  @Post('recuperar-senha')
  @ApiOperation({ summary: 'Solicita link de redefinição de senha por e-mail' })
  recuperarSenha(@Body() dto: RecuperarSenhaDto) {
    return this.service.solicitarResetSenha(dto.email);
  }

  @Get('verificar-email/:token')
  @ApiOperation({ summary: 'Verifica e-mail via token enviado por e-mail (fluxo antigo)' })
  verificarEmail(@Param('token') token: string) {
    return this.service.verificarEmail(token);
  }

  @Post('verificar-email-codigo')
  @ApiOperation({ summary: 'Verifica e-mail por código de 6 dígitos' })
  verificarEmailCodigo(@Body() dto: VerificarEmailCodigoDto) {
    return this.service.verificarEmailCodigo(dto.email, dto.codigo);
  }

  @Post('reenviar-codigo')
  @ApiOperation({ summary: 'Reenvia código de verificação por e-mail' })
  reenviarCodigo(@Body('email') email: string) {
    return this.service.reenviarCodigoVerificacao(email);
  }

  @Post('verificar-codigo-reset')
  @ApiOperation({ summary: 'Valida código de redefinição de senha (6 dígitos)' })
  verificarCodigoReset(@Body('email') email: string, @Body('codigo') codigo: string) {
    return this.service.verificarCodigoReset(email, codigo);
  }

  @Post('redefinir-senha')
  @ApiOperation({ summary: 'Redefine senha com código de verificação' })
  redefinirSenha(
    @Body('email') email: string,
    @Body('codigo') codigo: string,
    @Body('novaSenha') novaSenha: string,
  ) {
    return this.service.redefinirSenhaComCodigo(email, codigo, novaSenha);
  }

  @Get('me')
  @UseGuards(JwtPortalGuard)
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Perfil do usuário logado + assinatura + token de API' })
  meuPerfil(@Req() req: any) {
    return this.service.meuPerfil(req['usuario'].sub);
  }

  @Patch('me')
  @UseGuards(JwtPortalGuard)
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Atualiza dados pessoais do usuário logado' })
  atualizar(@Req() req: any, @Body() dto: UpdateUsuarioDto) {
    return this.service.atualizar(req['usuario'].sub, dto);
  }

  @Patch('me/conta')
  @UseGuards(JwtPortalGuard)
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Atualiza dados de negócio do Cliente do usuário logado' })
  atualizarCliente(@Req() req: any, @Body() dto: any) {
    // JWT antigo usa contaId; o novo usa clienteId
    const clienteId = req['usuario'].clienteId ?? req['usuario'].contaId;
    if (!clienteId) return { mensagem: 'Sem cliente vinculado.' };
    return this.service.atualizarCliente(clienteId, dto);
  }

  // ─── Manutenção de usuários do Cliente (perfil cliente, módulo Minha Conta) ─

  @Get('me/conta/usuarios')
  @UseGuards(JwtPortalGuard)
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Lista os usuários do Cliente do usuário logado' })
  listarUsuariosCliente(@Req() req: any) {
    return this.service.listarUsuariosDoCliente(req['usuario'].sub);
  }

  @Post('me/conta/usuarios')
  @UseGuards(JwtPortalGuard)
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Cria usuário adicional do Cliente (somente usuário principal)' })
  criarUsuarioCliente(@Req() req: any, @Body() dto: CriarUsuarioClienteDto) {
    return this.service.criarUsuarioDoCliente(req['usuario'].sub, dto);
  }

  @Patch('me/conta/usuarios/:id')
  @UseGuards(JwtPortalGuard)
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Edita usuário do Cliente (somente usuário principal)' })
  editarUsuarioCliente(@Req() req: any, @Param('id') id: string, @Body() dto: EditarUsuarioClienteDto) {
    return this.service.editarUsuarioDoCliente(req['usuario'].sub, id, dto);
  }

  @Patch('me/conta/usuarios/:id/ativo')
  @UseGuards(JwtPortalGuard)
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Bloqueia/desbloqueia usuário do Cliente (somente usuário principal; não há exclusão)' })
  ativarUsuarioCliente(@Req() req: any, @Param('id') id: string, @Body('ativo') ativo: boolean) {
    return this.service.ativarUsuarioDoCliente(req['usuario'].sub, id, ativo);
  }

  @Post('me/conta/usuarios/:id/transferir-principal')
  @UseGuards(JwtPortalGuard)
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Transfere a função de usuário principal para outro usuário da conta' })
  transferirPrincipal(@Req() req: any, @Param('id') id: string) {
    return this.service.transferirPrincipal(req['usuario'].sub, id);
  }

  @Post('me/agendar-exclusao')
  @UseGuards(JwtPortalGuard)
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Solicita exclusão definitiva ou anonimização agendada' })
  agendarExclusao(@Req() req: any, @Body() dto: AgendarExclusaoDto) {
    return this.service.agendarExclusao(req['usuario'].sub, dto);
  }

  @Post('me/cancelar-exclusao')
  @UseGuards(JwtPortalGuard)
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Cancela exclusão agendada da própria conta' })
  cancelarExclusao(@Req() req: any) {
    return this.service.cancelarExclusao(req['usuario'].sub);
  }

}

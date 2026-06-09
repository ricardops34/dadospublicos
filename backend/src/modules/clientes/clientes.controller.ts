import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ClientesService } from './clientes.service';
import { AgendarExclusaoDto, CreateClienteDto, LoginClienteDto, RecuperarSenhaDto, UpdateClienteDto, VerificarEmailCodigoDto } from './dto/create-cliente.dto';
import { JwtPortalGuard } from '../portal/jwt-portal.guard';
import { ParametrosService } from '../parametros/parametros.service';

@ApiTags('Clientes')
@Controller('clientes')
export class ClientesController {
  constructor(
    private readonly service: ClientesService,
    private readonly params: ParametrosService,
  ) {}

  @Get('status-registro')
  @ApiOperation({ summary: 'Retorna se novos cadastros estão habilitados (público)' })
  async statusRegistro() {
    const valor = await this.params.getValor('REGISTROS_HABILITADOS', 'false');
    return { habilitado: valor === 'true' };
  }

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
  @ApiOperation({ summary: 'Perfil do cliente logado + assinatura + token de API' })
  meuPerfil(@Req() req: any) {
    return this.service.meuPerfil(req['usuario'].sub);
  }

  @Patch('me')
  @UseGuards(JwtPortalGuard)
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Atualiza dados pessoais do usuário logado' })
  atualizar(@Req() req: any, @Body() dto: UpdateClienteDto) {
    return this.service.atualizar(req['usuario'].sub, dto);
  }

  @Patch('me/conta')
  @UseGuards(JwtPortalGuard)
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Atualiza dados da empresa/conta do usuário logado' })
  atualizarConta(@Req() req: any, @Body() dto: any) {
    const contaId = req['usuario'].contaId;
    if (!contaId) return { mensagem: 'Sem conta vinculada.' };
    return this.service.atualizarConta(contaId, dto);
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

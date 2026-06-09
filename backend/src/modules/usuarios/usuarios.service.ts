import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository, ILike } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { Cron } from '@nestjs/schedule';
import { Usuario } from '../../entities/usuario.entity';
import { Assinatura } from '../../entities/assinatura.entity';
import { Conta } from '../../entities/conta.entity';
import { AgendarExclusaoDto, CreateUsuarioDto, LoginUsuarioDto, UpdateUsuarioDto } from './dto/create-usuario.dto';
import { ParametrosService } from '../parametros/parametros.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario, 'buscadados') private usuarios: Repository<Usuario>,
    @InjectRepository(Assinatura, 'buscadados') private assinaturas: Repository<Assinatura>,
    @InjectRepository(Conta, 'buscadados') private contas: Repository<Conta>,
    private params: ParametrosService,
    private emailSvc: EmailService,
  ) {}

  async signup(dto: CreateUsuarioDto) {
    const habilitado = await this.params.getValor('REGISTROS_HABILITADOS', 'false');
    if (habilitado !== 'true') {
      throw new BadRequestException('Novos cadastros estão temporariamente desabilitados. Em breve abriremos novas vagas!');
    }

    const existe = await this.usuarios.findOne({ where: { email: dto.email } });
    if (existe) throw new ConflictException('E-mail já cadastrado.');

    const senhaHash = await bcrypt.hash(dto.senha, 10);
    const codigoVerificacao = Math.floor(100000 + Math.random() * 900000).toString();
    const codigoVerificacaoExpira = new Date(Date.now() + 15 * 60 * 1000);

    // 1. Cria o usuário (dados pessoais)
    const usuario = this.usuarios.create({
      nome: dto.nome,
      email: dto.email,
      senhaHash,
      tipoPessoa: dto.tipoPessoa || 'J',
      cpf: dto.cpf ?? null,
      dataNascimento: dto.dataNascimento ? new Date(dto.dataNascimento) : null,
      telefone: dto.telefone ?? null,
      codigoVerificacao,
      codigoVerificacaoExpira,
      onboardingPendente: true,
    });
    await this.usuarios.save(usuario);

    // 2. Cria a conta/tenant (dados da empresa)
    const conta = this.contas.create({
      proprietarioId: usuario.id,
      tipoPessoa: dto.tipoPessoa || 'J',
      cnpj: dto.cnpj ?? null,
      razaoSocial: dto.razaoSocial ?? null,
      telefone: dto.telefone ?? null,
      cep: dto.cep ?? null,
      logradouro: dto.logradouro ?? null,
      numero: dto.numero ?? null,
      complemento: dto.complemento ?? null,
      bairro: dto.bairro ?? null,
      municipio: dto.municipio ?? null,
      uf: dto.uf ?? null,
      inscricaoEstadual: dto.inscricaoEstadual ?? null,
      inscricaoMunicipal: dto.inscricaoMunicipal ?? null,
      onboardingPendente: true,
    });
    await this.contas.save(conta);

    // 3. Vincula a conta ao usuário
    usuario.contaId = conta.id;
    await this.usuarios.save(usuario);

    this.emailSvc.enviarCodigoVerificacao(usuario.email, usuario.nome, codigoVerificacao).catch((err) => {
      console.error('[Email] Erro ao enviar código de verificação:', err);
    });

    return {
      mensagem: 'Cadastro realizado. Digite o código enviado para seu e-mail.',
      id: usuario.id,
      email: usuario.email,
    };
  }

  async adminCreate(dto: CreateUsuarioDto) {
    const existe = await this.usuarios.findOne({ where: { email: dto.email } });
    if (existe) throw new ConflictException('E-mail já cadastrado.');

    const senhaHash = await bcrypt.hash(dto.senha, 10);
    const perfil = dto.perfil ?? 'cliente';

    // Usuário (dados pessoais)
    const usuario = this.usuarios.create({
      nome: dto.nome,
      email: dto.email,
      senhaHash,
      perfil,
      tipoPessoa: dto.tipoPessoa || 'J',
      cpf: dto.cpf ?? null,
      dataNascimento: dto.dataNascimento ? new Date(dto.dataNascimento) : null,
      telefone: dto.telefone ?? null,
      emailVerificado: true,
      onboardingPendente: perfil === 'cliente',
    });
    await this.usuarios.save(usuario);

    // Conta/tenant (apenas para clientes, não para admin)
    if (perfil === 'cliente') {
      const conta = this.contas.create({
        proprietarioId: usuario.id,
        tipoPessoa: dto.tipoPessoa || 'J',
        cnpj: dto.cnpj ?? null,
        razaoSocial: dto.razaoSocial ?? null,
        telefone: dto.telefone ?? null,
        cep: dto.cep ?? null,
        logradouro: dto.logradouro ?? null,
        numero: dto.numero ?? null,
        complemento: dto.complemento ?? null,
        bairro: dto.bairro ?? null,
        municipio: dto.municipio ?? null,
        uf: dto.uf ?? null,
        inscricaoEstadual: dto.inscricaoEstadual ?? null,
        inscricaoMunicipal: dto.inscricaoMunicipal ?? null,
        onboardingPendente: true,
      });
      await this.contas.save(conta);
      usuario.contaId = conta.id;
      await this.usuarios.save(usuario);
    }

    return { mensagem: 'Usuário criado pelo admin.', id: usuario.id, email: usuario.email };
  }

  async login(dto: LoginUsuarioDto) {
    const usuario = await this.usuarios.findOne({ where: { email: dto.email, ativo: true } });
    if (!usuario) throw new UnauthorizedException('Credenciais inválidas.');

    const ok = await bcrypt.compare(dto.senha, usuario.senhaHash);
    if (!ok) throw new UnauthorizedException('Credenciais inválidas.');

    usuario.ultimoLogin = new Date();
    await this.usuarios.save(usuario);

    return { id: usuario.id, nome: usuario.nome, email: usuario.email, email_verificado: usuario.emailVerificado };
  }

  async solicitarResetSenha(email: string) {
    const usuario = await this.usuarios.findOne({ where: { email, ativo: true } });
    if (!usuario) {
      return { mensagem: 'Se esse e-mail estiver cadastrado, você receberá as instruções em breve.' };
    }

    const token = randomBytes(32).toString('hex');
    usuario.resetToken = token;
    usuario.resetTokenExpira = new Date(Date.now() + 60 * 60 * 1000);
    await this.usuarios.save(usuario);

    const baseUrl = await this.params.getValor('APP_URL', 'http://localhost:4200');
    const link = `${baseUrl}/redefinir-senha/${token}`;

    this.emailSvc.enviar(
      email,
      'Redefinição de senha - BuscaDados',
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#fff;border-radius:12px;border:1px solid #e5e7eb;">
        <div style="text-align:center;margin-bottom:24px;">
          <span style="font-size:1.4rem;font-weight:800;color:#111827;">Busca<span style="color:#7c3aed;">Dados</span></span>
        </div>
        <h2 style="color:#111827;">Olá, ${usuario.nome}!</h2>
        <p style="color:#6b7280;">Recebemos uma solicitação para redefinir sua senha.</p>
        <div style="text-align:center;margin:32px 0;">
          <a href="${link}" style="background:#7c3aed;color:#fff;padding:14px 28px;text-decoration:none;border-radius:8px;font-weight:700;display:inline-block;">Redefinir minha senha</a>
        </div>
        <p style="color:#9ca3af;font-size:0.8rem;">Este link expira em 1 hora. Se não solicitou, ignore.</p>
        <p style="color:#d1d5db;font-size:0.75rem;text-align:center;">BuscaDados · CNPJ 19.654.062/0001-45</p>
      </div>`,
    ).catch((err) => console.error('[Email] Erro ao enviar reset:', err));

    return { mensagem: 'Se esse e-mail estiver cadastrado, você receberá as instruções em breve.' };
  }

  async verificarEmail(token: string) {
    const usuario = await this.usuarios.findOne({ where: { tokenVerificacao: token } });
    if (!usuario) throw new NotFoundException('Token inválido ou expirado.');
    usuario.emailVerificado = true;
    usuario.tokenVerificacao = null;
    await this.usuarios.save(usuario);
    return { mensagem: 'E-mail verificado com sucesso.' };
  }

  async verificarEmailCodigo(email: string, codigo: string) {
    const usuario = await this.usuarios.findOne({ where: { email } });
    if (!usuario) throw new NotFoundException('Conta não encontrada.');
    if (usuario.emailVerificado) return { mensagem: 'E-mail já verificado.' };

    if (!usuario.codigoVerificacao || !usuario.codigoVerificacaoExpira) {
      throw new BadRequestException('CODIGO_NAO_ENCONTRADO');
    }

    if (new Date() > usuario.codigoVerificacaoExpira) {
      throw new BadRequestException('CODIGO_EXPIRADO');
    }

    if (usuario.codigoVerificacao !== codigo) {
      throw new BadRequestException('CODIGO_INVALIDO');
    }

    usuario.emailVerificado = true;
    usuario.codigoVerificacao = null;
    usuario.codigoVerificacaoExpira = null;
    await this.usuarios.save(usuario);
    return { mensagem: 'E-mail verificado com sucesso. Faça login para continuar.' };
  }

  async reenviarCodigoVerificacao(email: string) {
    const usuario = await this.usuarios.findOne({ where: { email, ativo: true } });
    if (!usuario || usuario.emailVerificado) {
      return { mensagem: 'Se o e-mail estiver pendente de verificação, o código foi reenviado.' };
    }

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    usuario.codigoVerificacao = codigo;
    usuario.codigoVerificacaoExpira = new Date(Date.now() + 15 * 60 * 1000);
    await this.usuarios.save(usuario);
    this.emailSvc.enviarCodigoVerificacao(usuario.email, usuario.nome, codigo).catch((err) =>
      console.error('[Email] Erro ao reenviar código:', err),
    );
    return { mensagem: 'Se o e-mail estiver pendente de verificação, o código foi reenviado.' };
  }

  async verificarCodigoReset(email: string, codigo: string) {
    const usuario = await this.usuarios.findOne({ where: { email, ativo: true } });
    if (!usuario || !usuario.resetToken || !usuario.resetTokenExpira) {
      throw new BadRequestException('CODIGO_INVALIDO');
    }

    if (new Date() > usuario.resetTokenExpira) {
      throw new BadRequestException('CODIGO_EXPIRADO');
    }

    if (usuario.resetToken.slice(0, 6) !== codigo) {
      throw new BadRequestException('CODIGO_INVALIDO');
    }

    return { mensagem: 'Código válido.' };
  }

  async redefinirSenhaComCodigo(email: string, codigo: string, novaSenha: string) {
    await this.verificarCodigoReset(email, codigo);
    const usuario = await this.usuarios.findOne({ where: { email, ativo: true } });
    if (!usuario) throw new NotFoundException('Conta não encontrada.');

    usuario.senhaHash = await bcrypt.hash(novaSenha, 10);
    usuario.resetToken = null;
    usuario.resetTokenExpira = null;
    await this.usuarios.save(usuario);

    return { mensagem: 'Senha redefinida com sucesso.' };
  }

  async meuPerfil(usuarioId: string) {
    const usuario = await this.usuarios.findOne({
      where: { id: usuarioId },
      relations: ['assinaturas', 'assinaturas.plano', 'assinaturas.token'],
    });
    if (!usuario) throw new NotFoundException('Usuário não encontrado.');

    // Carrega os dados da conta/tenant se existir
    let conta: Conta | null = null;
    if (usuario.contaId) {
      conta = await this.contas.findOne({ where: { id: usuario.contaId } });
    }

    const onboardingPendente = this.isOnboardingPendente(usuario, conta);
    if (usuario.onboardingPendente !== onboardingPendente) {
      usuario.onboardingPendente = onboardingPendente;
      await this.usuarios.save(usuario);
    }

    const dadosPessoais = this.sanitizeAdminResponse(usuario);
    return {
      ...dadosPessoais,
      onboardingPendente,
      // Dados da empresa/tenant (separados dos dados pessoais)
      conta: conta ? {
        id: conta.id,
        tipoPessoa: conta.tipoPessoa,
        cnpj: conta.cnpj,
        razaoSocial: conta.razaoSocial,
        telefone: conta.telefone,
        cep: conta.cep,
        logradouro: conta.logradouro,
        numero: conta.numero,
        complemento: conta.complemento,
        bairro: conta.bairro,
        municipio: conta.municipio,
        uf: conta.uf,
        inscricaoEstadual: conta.inscricaoEstadual,
        inscricaoMunicipal: conta.inscricaoMunicipal,
      } : null,
    };
  }

  async atualizarConta(contaId: string, dto: Partial<Conta>) {
    const conta = await this.contas.findOne({ where: { id: contaId } });
    if (!conta) throw new NotFoundException('Conta não encontrada.');
    Object.assign(conta, dto);
    return this.contas.save(conta);
  }

  isOnboardingPendente(
    usuario: Partial<Usuario> & { assinaturas?: Array<{ status?: string | null }> },
    conta?: Conta | null,
  ) {
    const tipoPessoa = conta?.tipoPessoa ?? usuario.tipoPessoa;
    const temDadosBasicos = !!usuario.nome && !!usuario.email && !!usuario.telefone;
    const temDocumento =
      tipoPessoa === 'F'
        ? !!usuario.cpf && !!usuario.dataNascimento
        : !!(conta?.cnpj ?? usuario.cnpj) && !!(conta?.razaoSocial ?? usuario.razaoSocial);
    const temEndereco =
      !!(conta?.cep ?? usuario.cep) &&
      !!(conta?.logradouro ?? usuario.logradouro) &&
      !!(conta?.numero ?? usuario.numero) &&
      !!(conta?.bairro ?? usuario.bairro) &&
      !!(conta?.municipio ?? usuario.municipio) &&
      !!(conta?.uf ?? usuario.uf);
    const temPlanoAtivo = !!usuario.assinaturas?.some((assinatura) => ['ativa', 'trial'].includes(assinatura.status ?? ''));

    return !(temDadosBasicos && temDocumento && temEndereco && temPlanoAtivo);
  }

  async atualizar(usuarioId: string, dto: UpdateUsuarioDto) {
    const usuario = await this.usuarios.findOne({
      where: { id: usuarioId },
      relations: ['assinaturas', 'assinaturas.plano'],
    });
    if (!usuario) throw new NotFoundException('Usuário não encontrado.');

    if (dto.email && dto.email !== usuario.email) {
      const existe = await this.usuarios.findOne({ where: { email: dto.email } });
      if (existe && existe.id !== usuarioId) {
        throw new ConflictException('E-mail já em uso.');
      }
      usuario.email = dto.email;
    }

    if (dto.senha) {
      usuario.senhaHash = await bcrypt.hash(dto.senha, 10);
    }

    const { email, senha, dataNascimento, ...rest } = dto;
    Object.assign(usuario, rest);

    if (dataNascimento !== undefined) {
      usuario.dataNascimento = dataNascimento ? new Date(dataNascimento) : null;
    }

    usuario.onboardingPendente = this.isOnboardingPendente(usuario);

    await this.usuarios.save(usuario);
    return this.sanitizeAdminResponse(usuario);
  }

  async agendarExclusao(usuarioId: string, dto: AgendarExclusaoDto) {
    return this.solicitarExclusao(usuarioId, dto);
  }

  async agendarExclusaoAdmin(usuarioId: string, dto: AgendarExclusaoDto) {
    return this.solicitarExclusao(usuarioId, dto);
  }

  async cancelarExclusao(usuarioId: string) {
    return this.cancelarExclusaoInterna(usuarioId);
  }

  async cancelarExclusaoAdmin(usuarioId: string) {
    return this.cancelarExclusaoInterna(usuarioId);
  }

  private async solicitarExclusao(usuarioId: string, dto: AgendarExclusaoDto) {
    const usuario = await this.carregarUsuarioParaExclusao(usuarioId);
    if (!this.temPlanoPagoAtivo(usuario)) {
      await this.excluirConta(usuarioId);
      return {
        mensagem: 'Conta excluída e dados anonimizados.',
        tipoFluxo: 'exclusao-imediata' as const,
        agendarExclusaoEm: null,
      };
    }

    const agendarExclusaoEm = await this.definirDataExclusaoAgendada(usuario, dto);
    usuario.agendarExclusaoEm = agendarExclusaoEm;
    await this.usuarios.save(usuario);

    return {
      mensagem: `Anonimização agendada para ${agendarExclusaoEm.toLocaleDateString('pt-BR')}.`,
      tipoFluxo: 'anonimizacao-agendada' as const,
      agendarExclusaoEm,
    };
  }

  private async cancelarExclusaoInterna(usuarioId: string) {
    const usuario = await this.usuarios.findOne({ where: { id: usuarioId } });
    if (!usuario) throw new NotFoundException('Usuário não encontrado.');
    if (!usuario.agendarExclusaoEm) {
      throw new BadRequestException('Nenhuma exclusão agendada para esta conta.');
    }

    usuario.agendarExclusaoEm = null;
    await this.usuarios.save(usuario);

    return {
      mensagem: 'Solicitação de exclusão cancelada com sucesso.',
      agendarExclusaoEm: null,
    };
  }

  private async carregarUsuarioParaExclusao(usuarioId: string) {
    const usuario = await this.usuarios.findOne({
      where: { id: usuarioId },
      relations: ['assinaturas', 'assinaturas.plano'],
    });
    if (!usuario) throw new NotFoundException('Usuário não encontrado.');
    return usuario;
  }

  private temPlanoPagoAtivo(usuario: Partial<Usuario> & { assinaturas?: Array<{ status?: string | null; plano?: { precoMensal?: number | string | null } | null }> }) {
    return !!usuario.assinaturas?.some((assinatura) => {
      const precoMensal = Number(assinatura.plano?.precoMensal ?? 0);
      return assinatura.status === 'ativa' && precoMensal > 0;
    });
  }

  private async definirDataExclusaoAgendada(usuario: Usuario & { assinaturas?: Array<{ status?: string | null; proximoVencimento?: string | null; plano?: { precoMensal?: number | string | null } | null }> }, dto: AgendarExclusaoDto) {
    const diasRetencao = parseInt(await this.params.getValor('DIAS_RETENCAO_CONTA', '30'), 10);
    const assinaturaPagaAtiva = usuario.assinaturas?.find((assinatura) => assinatura.status === 'ativa' && Number(assinatura.plano?.precoMensal ?? 0) > 0);

    if (dto.agendarPara === 'fim-plano' && assinaturaPagaAtiva?.proximoVencimento) {
      return new Date(`${assinaturaPagaAtiva.proximoVencimento}T00:00:00`);
    }

    return new Date(Date.now() + diasRetencao * 24 * 60 * 60 * 1000);
  }

  async excluirConta(usuarioId: string) {
    const usuario = await this.usuarios.findOne({ where: { id: usuarioId } });
    if (!usuario) throw new NotFoundException('Usuário não encontrado.');

    const ts = Date.now();
    Object.assign(usuario, {
      nome: `Excluido ${ts}`,
      email: `excluido_${ts}@anonimizado.invalid`,
      senhaHash: '',
      tipoPessoa: 'J',
      cpf: null,
      dataNascimento: null,
      cnpj: null,
      razaoSocial: null,
      telefone: null,
      cep: null,
      logradouro: null,
      numero: null,
      complemento: null,
      bairro: null,
      municipio: null,
      uf: null,
      inscricaoEstadual: null,
      inscricaoMunicipal: null,
      tokenVerificacao: null,
      codigoVerificacao: null,
      codigoVerificacaoExpira: null,
      resetToken: null,
      resetTokenExpira: null,
      agendarExclusaoEm: null,
      ativo: false,
      onboardingPendente: false,
    });

    const assinaturasAtivas = await this.assinaturas.find({ where: [{ clienteId: usuarioId, status: 'ativa' }, { clienteId: usuarioId, status: 'trial' }] });
    for (const assinatura of assinaturasAtivas) {
      assinatura.status = 'cancelada';
      assinatura.canceladoEm = new Date();
      assinatura.motivoCancelamento = 'Conta excluida';
      await this.assinaturas.save(assinatura);
    }

    await this.usuarios.save(usuario);
    return { mensagem: 'Conta excluída e dados anonimizados.' };
  }

  async findAll(pagina = 1, limite = 20, busca?: string, filtros?: any) {
    const baseWhere: any = {};

    if (filtros?.ativoStatus) {
      const status = Array.isArray(filtros.ativoStatus) ? filtros.ativoStatus[0] : filtros.ativoStatus;
      if (status === 'ativo' || status === 1 || status === '1') baseWhere.ativo = true;
      else if (status === 'suspenso' || status === 0 || status === '0') baseWhere.ativo = false;
    } else if (typeof filtros === 'string') {
      baseWhere.ativo = filtros === 'ativo';
    }

    if (filtros?.nome) baseWhere.nome = ILike(`%${filtros.nome}%`);
    if (filtros?.email) baseWhere.email = ILike(`%${filtros.email}%`);
    if (filtros?.cnpj) baseWhere.cnpj = ILike(`%${filtros.cnpj}%`);
    if (filtros?.cpf) baseWhere.cpf = ILike(`%${filtros.cpf}%`);
    if (filtros?.tipoPessoa) baseWhere.tipoPessoa = filtros.tipoPessoa;
    if (filtros?.emailVerificado !== undefined && filtros.emailVerificado !== '') {
      baseWhere.emailVerificado = Number(filtros.emailVerificado) === 1;
    }

    let where: any = baseWhere;
    if (busca) {
      where = [
        { ...baseWhere, nome: ILike(`%${busca}%`) },
        { ...baseWhere, email: ILike(`%${busca}%`) },
        { ...baseWhere, cnpj: ILike(`%${busca}%`) },
      ];
    }

    return this.usuarios.findAndCount({
      where,
      order: { criadoEm: 'DESC' },
      skip: (pagina - 1) * limite,
      take: limite,
      relations: ['assinaturas', 'assinaturas.plano'],
    });
  }

  async findOne(id: string) {
    const usuario = await this.usuarios.findOne({
      where: { id },
      relations: ['assinaturas', 'assinaturas.plano', 'assinaturas.token', 'assinaturas.faturas'],
    });
    if (!usuario) throw new NotFoundException('Usuário não encontrado.');
    return usuario;
  }

  async ativar(id: string, ativo: boolean) {
    const usuario = await this.usuarios.findOne({ where: { id } });
    if (!usuario) throw new NotFoundException('Usuário não encontrado.');
    usuario.ativo = ativo;
    await this.usuarios.save(usuario);
    return { mensagem: ativo ? 'Usuário reativado.' : 'Usuário suspenso.' };
  }

  async confirmarEmail(id: string) {
    const usuario = await this.usuarios.findOne({ where: { id } });
    if (!usuario) throw new NotFoundException('Usuário não encontrado.');
    usuario.emailVerificado = true;
    usuario.tokenVerificacao = null;
    usuario.codigoVerificacao = null;
    usuario.codigoVerificacaoExpira = null;
    await this.usuarios.save(usuario);
    return { mensagem: 'E-mail confirmado pelo admin.' };
  }

  sanitizeAdminResponse<T extends Record<string, any>>(usuario: T) {
    const { senhaHash, tokenVerificacao, codigoVerificacao, codigoVerificacaoExpira, resetToken, resetTokenExpira, ...safe } = usuario as any;
    return safe;
  }

  async enviarResetPorAdmin(id: string) {
    const usuario = await this.usuarios.findOne({ where: { id } });
    if (!usuario) throw new NotFoundException('Usuário não encontrado.');
    return this.solicitarResetSenha(usuario.email);
  }

  @Cron('0 3 * * *')
  async processarExclusoesAgendadas() {
    const agora = new Date();
    const pendentes = await this.usuarios.find({
      where: {
        agendarExclusaoEm: LessThanOrEqual(agora),
      },
    });

    for (const usuario of pendentes) {
      await this.excluirConta(usuario.id);
    }

    if (pendentes.length) {
      console.log(`[Cron] ${pendentes.length} conta(s) anonimizadas por agendamento.`);
    }
  }
}

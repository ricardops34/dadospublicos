import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository, ILike } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { Cron } from '@nestjs/schedule';
import { ClienteApi } from '../../entities/cliente.entity';
import { Assinatura } from '../../entities/assinatura.entity';
import { AgendarExclusaoDto, CreateClienteDto, LoginClienteDto, UpdateClienteDto } from './dto/create-cliente.dto';
import { ParametrosService } from '../parametros/parametros.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(ClienteApi, 'buscadados') private clientes: Repository<ClienteApi>,
    @InjectRepository(Assinatura, 'buscadados') private assinaturas: Repository<Assinatura>,
    private params: ParametrosService,
    private emailSvc: EmailService,
  ) {}

  async signup(dto: CreateClienteDto) {
    const habilitado = await this.params.getValor('REGISTROS_HABILITADOS', 'false');
    if (habilitado !== 'true') {
      throw new BadRequestException('Novos cadastros estão temporariamente desabilitados. Em breve abriremos novas vagas!');
    }

    const existe = await this.clientes.findOne({ where: { email: dto.email } });
    if (existe) throw new ConflictException('E-mail já cadastrado.');

    const senhaHash = await bcrypt.hash(dto.senha, 10);
    const codigoVerificacao = Math.floor(100000 + Math.random() * 900000).toString();
    const codigoVerificacaoExpira = new Date(Date.now() + 15 * 60 * 1000);

    const cliente = this.clientes.create({
      nome: dto.nome,
      email: dto.email,
      senhaHash,
      tipoPessoa: dto.tipoPessoa || 'J',
      cpf: dto.cpf ?? null,
      dataNascimento: dto.dataNascimento ? new Date(dto.dataNascimento) : null,
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
      codigoVerificacao,
      codigoVerificacaoExpira,
      onboardingPendente: true,
    });
    await this.clientes.save(cliente);

    this.emailSvc.enviarCodigoVerificacao(cliente.email, cliente.nome, codigoVerificacao).catch((err) => {
      console.error('[Email] Erro ao enviar código de verificação:', err);
    });

    return {
      mensagem: 'Cadastro realizado. Digite o código enviado para seu e-mail.',
      id: cliente.id,
      email: cliente.email,
    };
  }

  async adminCreate(dto: CreateClienteDto) {
    const existe = await this.clientes.findOne({ where: { email: dto.email } });
    if (existe) throw new ConflictException('E-mail já cadastrado.');

    const senhaHash = await bcrypt.hash(dto.senha, 10);
    const perfil = dto.perfil ?? 'cliente';

    const cliente = this.clientes.create({
      nome: dto.nome,
      email: dto.email,
      senhaHash,
      perfil,
      tipoPessoa: dto.tipoPessoa || 'J',
      cpf: dto.cpf ?? null,
      dataNascimento: dto.dataNascimento ? new Date(dto.dataNascimento) : null,
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
      emailVerificado: true,
      onboardingPendente: perfil === 'cliente',
    });
    await this.clientes.save(cliente);
    return { mensagem: 'Usuário criado pelo admin.', id: cliente.id, email: cliente.email };
  }

  async login(dto: LoginClienteDto) {
    const cliente = await this.clientes.findOne({ where: { email: dto.email, ativo: true } });
    if (!cliente) throw new UnauthorizedException('Credenciais inválidas.');

    const ok = await bcrypt.compare(dto.senha, cliente.senhaHash);
    if (!ok) throw new UnauthorizedException('Credenciais inválidas.');

    cliente.ultimoLogin = new Date();
    await this.clientes.save(cliente);

    return { id: cliente.id, nome: cliente.nome, email: cliente.email, email_verificado: cliente.emailVerificado };
  }

  async solicitarResetSenha(email: string) {
    const cliente = await this.clientes.findOne({ where: { email, ativo: true } });
    if (!cliente) {
      return { mensagem: 'Se esse e-mail estiver cadastrado, você receberá as instruções em breve.' };
    }

    const token = randomBytes(32).toString('hex');
    cliente.resetToken = token;
    cliente.resetTokenExpira = new Date(Date.now() + 60 * 60 * 1000);
    await this.clientes.save(cliente);

    const baseUrl = await this.params.getValor('APP_URL', 'http://localhost:4200');
    const link = `${baseUrl}/redefinir-senha/${token}`;

    this.emailSvc.enviar(
      email,
      'Redefinição de senha - BuscaDados',
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#fff;border-radius:12px;border:1px solid #e5e7eb;">
        <div style="text-align:center;margin-bottom:24px;">
          <span style="font-size:1.4rem;font-weight:800;color:#111827;">Busca<span style="color:#7c3aed;">Dados</span></span>
        </div>
        <h2 style="color:#111827;">Olá, ${cliente.nome}!</h2>
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
    const cliente = await this.clientes.findOne({ where: { tokenVerificacao: token } });
    if (!cliente) throw new NotFoundException('Token inválido ou expirado.');
    cliente.emailVerificado = true;
    cliente.tokenVerificacao = null;
    await this.clientes.save(cliente);
    return { mensagem: 'E-mail verificado com sucesso.' };
  }

  async verificarEmailCodigo(email: string, codigo: string) {
    const cliente = await this.clientes.findOne({ where: { email } });
    if (!cliente) throw new NotFoundException('Conta não encontrada.');
    if (cliente.emailVerificado) return { mensagem: 'E-mail já verificado.' };

    if (!cliente.codigoVerificacao || !cliente.codigoVerificacaoExpira) {
      throw new BadRequestException('CODIGO_NAO_ENCONTRADO');
    }

    if (new Date() > cliente.codigoVerificacaoExpira) {
      throw new BadRequestException('CODIGO_EXPIRADO');
    }

    if (cliente.codigoVerificacao !== codigo) {
      throw new BadRequestException('CODIGO_INVALIDO');
    }

    cliente.emailVerificado = true;
    cliente.codigoVerificacao = null;
    cliente.codigoVerificacaoExpira = null;
    await this.clientes.save(cliente);
    return { mensagem: 'E-mail verificado com sucesso. Faça login para continuar.' };
  }

  async reenviarCodigoVerificacao(email: string) {
    const cliente = await this.clientes.findOne({ where: { email, ativo: true } });
    if (!cliente || cliente.emailVerificado) {
      return { mensagem: 'Se o e-mail estiver pendente de verificação, o código foi reenviado.' };
    }

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    cliente.codigoVerificacao = codigo;
    cliente.codigoVerificacaoExpira = new Date(Date.now() + 15 * 60 * 1000);
    await this.clientes.save(cliente);
    this.emailSvc.enviarCodigoVerificacao(cliente.email, cliente.nome, codigo).catch((err) =>
      console.error('[Email] Erro ao reenviar código:', err),
    );
    return { mensagem: 'Se o e-mail estiver pendente de verificação, o código foi reenviado.' };
  }

  async verificarCodigoReset(email: string, codigo: string) {
    const cliente = await this.clientes.findOne({ where: { email, ativo: true } });
    if (!cliente || !cliente.resetToken || !cliente.resetTokenExpira) {
      throw new BadRequestException('CODIGO_INVALIDO');
    }

    if (new Date() > cliente.resetTokenExpira) {
      throw new BadRequestException('CODIGO_EXPIRADO');
    }

    if (cliente.resetToken.slice(0, 6) !== codigo) {
      throw new BadRequestException('CODIGO_INVALIDO');
    }

    return { mensagem: 'Código válido.' };
  }

  async redefinirSenhaComCodigo(email: string, codigo: string, novaSenha: string) {
    await this.verificarCodigoReset(email, codigo);
    const cliente = await this.clientes.findOne({ where: { email, ativo: true } });
    if (!cliente) throw new NotFoundException('Conta não encontrada.');

    cliente.senhaHash = await bcrypt.hash(novaSenha, 10);
    cliente.resetToken = null;
    cliente.resetTokenExpira = null;
    await this.clientes.save(cliente);

    return { mensagem: 'Senha redefinida com sucesso.' };
  }

  async meuPerfil(clienteId: string) {
    const cliente = await this.clientes.findOne({
      where: { id: clienteId },
      relations: ['assinaturas', 'assinaturas.plano', 'assinaturas.token'],
    });
    if (!cliente) throw new NotFoundException('Cliente não encontrado.');

    const onboardingPendente = this.isOnboardingPendente(cliente);
    if (cliente.onboardingPendente !== onboardingPendente) {
      cliente.onboardingPendente = onboardingPendente;
      await this.clientes.save(cliente);
    }

    return { ...this.sanitizeAdminResponse(cliente), onboardingPendente };
  }

  isOnboardingPendente(cliente: Partial<ClienteApi> & { assinaturas?: Array<{ status?: string | null }> }) {
    const tipoPessoa = cliente.tipoPessoa;
    const temDadosBasicos = !!cliente.nome && !!cliente.email && !!cliente.telefone;
    const temDocumento =
      tipoPessoa === 'F'
        ? !!cliente.cpf && !!cliente.dataNascimento
        : !!cliente.cnpj && !!cliente.razaoSocial;
    const temEndereco =
      !!cliente.cep &&
      !!cliente.logradouro &&
      !!cliente.numero &&
      !!cliente.bairro &&
      !!cliente.municipio &&
      !!cliente.uf;
    const temPlanoAtivo = !!cliente.assinaturas?.some((assinatura) => ['ativa', 'trial'].includes(assinatura.status ?? ''));

    return !(temDadosBasicos && temDocumento && temEndereco && temPlanoAtivo);
  }

  async atualizar(clienteId: string, dto: UpdateClienteDto) {
    const cliente = await this.clientes.findOne({
      where: { id: clienteId },
      relations: ['assinaturas', 'assinaturas.plano'],
    });
    if (!cliente) throw new NotFoundException('Cliente não encontrado.');

    if (dto.email && dto.email !== cliente.email) {
      const existe = await this.clientes.findOne({ where: { email: dto.email } });
      if (existe && existe.id !== clienteId) {
        throw new ConflictException('E-mail já em uso.');
      }
      cliente.email = dto.email;
    }

    if (dto.senha) {
      cliente.senhaHash = await bcrypt.hash(dto.senha, 10);
    }

    const { email, senha, dataNascimento, ...rest } = dto;
    Object.assign(cliente, rest);

    if (dataNascimento !== undefined) {
      cliente.dataNascimento = dataNascimento ? new Date(dataNascimento) : null;
    }

    cliente.onboardingPendente = this.isOnboardingPendente(cliente);

    await this.clientes.save(cliente);
    return this.sanitizeAdminResponse(cliente);
  }

  async agendarExclusao(clienteId: string, dto: AgendarExclusaoDto) {
    return this.solicitarExclusao(clienteId, dto);
  }

  async agendarExclusaoAdmin(clienteId: string, dto: AgendarExclusaoDto) {
    return this.solicitarExclusao(clienteId, dto);
  }

  async cancelarExclusao(clienteId: string) {
    return this.cancelarExclusaoInterna(clienteId);
  }

  async cancelarExclusaoAdmin(clienteId: string) {
    return this.cancelarExclusaoInterna(clienteId);
  }

  private async solicitarExclusao(clienteId: string, dto: AgendarExclusaoDto) {
    const cliente = await this.carregarClienteParaExclusao(clienteId);
    if (!this.temPlanoPagoAtivo(cliente)) {
      await this.excluirConta(clienteId);
      return {
        mensagem: 'Conta excluída e dados anonimizados.',
        tipoFluxo: 'exclusao-imediata' as const,
        agendarExclusaoEm: null,
      };
    }

    const agendarExclusaoEm = await this.definirDataExclusaoAgendada(cliente, dto);
    cliente.agendarExclusaoEm = agendarExclusaoEm;
    await this.clientes.save(cliente);

    return {
      mensagem: `Anonimização agendada para ${agendarExclusaoEm.toLocaleDateString('pt-BR')}.`,
      tipoFluxo: 'anonimizacao-agendada' as const,
      agendarExclusaoEm,
    };
  }

  private async cancelarExclusaoInterna(clienteId: string) {
    const cliente = await this.clientes.findOne({ where: { id: clienteId } });
    if (!cliente) throw new NotFoundException('Cliente não encontrado.');
    if (!cliente.agendarExclusaoEm) {
      throw new BadRequestException('Nenhuma exclusão agendada para esta conta.');
    }

    cliente.agendarExclusaoEm = null;
    await this.clientes.save(cliente);

    return {
      mensagem: 'Solicitação de exclusão cancelada com sucesso.',
      agendarExclusaoEm: null,
    };
  }

  private async carregarClienteParaExclusao(clienteId: string) {
    const cliente = await this.clientes.findOne({
      where: { id: clienteId },
      relations: ['assinaturas', 'assinaturas.plano'],
    });
    if (!cliente) throw new NotFoundException('Cliente não encontrado.');
    return cliente;
  }

  private temPlanoPagoAtivo(cliente: Partial<ClienteApi> & { assinaturas?: Array<{ status?: string | null; plano?: { precoMensal?: number | string | null } | null }> }) {
    return !!cliente.assinaturas?.some((assinatura) => {
      const precoMensal = Number(assinatura.plano?.precoMensal ?? 0);
      return assinatura.status === 'ativa' && precoMensal > 0;
    });
  }

  private async definirDataExclusaoAgendada(cliente: ClienteApi & { assinaturas?: Array<{ status?: string | null; proximoVencimento?: string | null; plano?: { precoMensal?: number | string | null } | null }> }, dto: AgendarExclusaoDto) {
    const diasRetencao = parseInt(await this.params.getValor('DIAS_RETENCAO_CONTA', '30'), 10);
    const assinaturaPagaAtiva = cliente.assinaturas?.find((assinatura) => assinatura.status === 'ativa' && Number(assinatura.plano?.precoMensal ?? 0) > 0);

    if (dto.agendarPara === 'fim-plano' && assinaturaPagaAtiva?.proximoVencimento) {
      return new Date(`${assinaturaPagaAtiva.proximoVencimento}T00:00:00`);
    }

    return new Date(Date.now() + diasRetencao * 24 * 60 * 60 * 1000);
  }

  async excluirConta(clienteId: string) {
    const cliente = await this.clientes.findOne({ where: { id: clienteId } });
    if (!cliente) throw new NotFoundException('Cliente não encontrado.');

    const ts = Date.now();
    Object.assign(cliente, {
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

    const assinaturasAtivas = await this.assinaturas.find({ where: [{ clienteId, status: 'ativa' }, { clienteId, status: 'trial' }] });
    for (const assinatura of assinaturasAtivas) {
      assinatura.status = 'cancelada';
      assinatura.canceladoEm = new Date();
      assinatura.motivoCancelamento = 'Conta excluida';
      await this.assinaturas.save(assinatura);
    }

    await this.clientes.save(cliente);
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

    return this.clientes.findAndCount({
      where,
      order: { criadoEm: 'DESC' },
      skip: (pagina - 1) * limite,
      take: limite,
      relations: ['assinaturas', 'assinaturas.plano'],
    });
  }

  async findOne(id: string) {
    const cliente = await this.clientes.findOne({
      where: { id },
      relations: ['assinaturas', 'assinaturas.plano', 'assinaturas.token', 'assinaturas.faturas'],
    });
    if (!cliente) throw new NotFoundException('Cliente não encontrado.');
    return cliente;
  }

  async ativar(id: string, ativo: boolean) {
    const cliente = await this.clientes.findOne({ where: { id } });
    if (!cliente) throw new NotFoundException('Cliente não encontrado.');
    cliente.ativo = ativo;
    await this.clientes.save(cliente);
    return { mensagem: ativo ? 'Cliente reativado.' : 'Cliente suspenso.' };
  }

  async confirmarEmail(id: string) {
    const cliente = await this.clientes.findOne({ where: { id } });
    if (!cliente) throw new NotFoundException('Cliente não encontrado.');
    cliente.emailVerificado = true;
    cliente.tokenVerificacao = null;
    cliente.codigoVerificacao = null;
    cliente.codigoVerificacaoExpira = null;
    await this.clientes.save(cliente);
    return { mensagem: 'E-mail confirmado pelo admin.' };
  }

  sanitizeAdminResponse<T extends Record<string, any>>(cliente: T) {
    const { senhaHash, tokenVerificacao, codigoVerificacao, codigoVerificacaoExpira, resetToken, resetTokenExpira, ...safe } = cliente as any;
    return safe;
  }

  async enviarResetPorAdmin(id: string) {
    const cliente = await this.clientes.findOne({ where: { id } });
    if (!cliente) throw new NotFoundException('Cliente não encontrado.');
    return this.solicitarResetSenha(cliente.email);
  }

  @Cron('0 3 * * *')
  async processarExclusoesAgendadas() {
    const agora = new Date();
    const pendentes = await this.clientes.find({
      where: {
        agendarExclusaoEm: LessThanOrEqual(agora),
      },
    });

    for (const cliente of pendentes) {
      await this.excluirConta(cliente.id);
    }

    if (pendentes.length) {
      console.log(`[Cron] ${pendentes.length} conta(s) anonimizadas por agendamento.`);
    }
  }
}

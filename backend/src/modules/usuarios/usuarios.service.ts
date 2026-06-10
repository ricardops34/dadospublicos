import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository, ILike } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { Cron } from '@nestjs/schedule';
import { Usuario } from '../../entities/usuario.entity';
import { Assinatura } from '../../entities/assinatura.entity';
import { Cliente } from '../../entities/cliente.entity';
import { ClienteCnae } from '../../entities/cliente-cnae.entity';
import { Token } from '../../entities/token.entity';
import { AgendarExclusaoDto, CnaeSecundarioInput, CreateUsuarioDto, CriarUsuarioClienteDto, EditarUsuarioClienteDto, LoginUsuarioDto, UpdateUsuarioDto } from './dto/create-usuario.dto';
import { ParametrosService } from '../parametros/parametros.service';
import { EmailService } from '../email/email.service';
import { CnpjService } from '../cnpj/cnpj.service';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario, 'buscadados') private usuarios: Repository<Usuario>,
    @InjectRepository(Assinatura, 'buscadados') private assinaturas: Repository<Assinatura>,
    @InjectRepository(Cliente, 'buscadados') private clientes: Repository<Cliente>,
    @InjectRepository(ClienteCnae, 'buscadados') private clienteCnaes: Repository<ClienteCnae>,
    @InjectRepository(Token, 'buscadados') private tokens: Repository<Token>,
    private params: ParametrosService,
    private emailSvc: EmailService,
    private cnpjSvc: CnpjService,
  ) {}

  // ─── Manutenção de usuários do Cliente (módulo Minha Conta, perfil cliente) ─
  // Regra (docs/regra-cliente-usuario.md): o usuário principal (clientes.proprietario_id)
  // gerencia os usuários do seu Cliente. Não há exclusão — apenas bloqueio.

  private async clienteDoUsuario(usuarioId: string) {
    const usuario = await this.usuarios.findOne({ where: { id: usuarioId } });
    if (!usuario?.clienteId) throw new NotFoundException('Usuário sem cliente vinculado.');
    const cliente = await this.clientes.findOne({ where: { id: usuario.clienteId } });
    if (!cliente) throw new NotFoundException('Cliente não encontrado.');
    return { usuario, cliente };
  }

  private async exigirPrincipal(usuarioId: string) {
    const { usuario, cliente } = await this.clienteDoUsuario(usuarioId);
    if (cliente.proprietarioId !== usuario.id) {
      throw new ForbiddenException('Apenas o usuário principal pode gerenciar os usuários do cliente.');
    }
    return { usuario, cliente };
  }

  private async usuarioDoCliente(clienteId: string, usuarioAlvoId: string) {
    const alvo = await this.usuarios.findOne({ where: { id: usuarioAlvoId, clienteId } });
    if (!alvo) throw new NotFoundException('Usuário não encontrado neste cliente.');
    return alvo;
  }

  async listarUsuariosDoCliente(solicitanteId: string) {
    const { cliente } = await this.clienteDoUsuario(solicitanteId);
    const usuarios = await this.usuarios.find({ where: { clienteId: cliente.id }, order: { criadoEm: 'ASC' } });
    return usuarios.map((u) => ({
      id: u.id,
      nome: u.nome,
      email: u.email,
      telefone: u.telefone,
      avatar: u.avatar,
      ativo: u.ativo,
      emailVerificado: u.emailVerificado,
      principal: u.id === cliente.proprietarioId,
      ultimoLogin: u.ultimoLogin,
      criadoEm: u.criadoEm,
    }));
  }

  async criarUsuarioDoCliente(solicitanteId: string, dto: CriarUsuarioClienteDto) {
    const { cliente } = await this.exigirPrincipal(solicitanteId);

    const existe = await this.usuarios.findOne({ where: { email: dto.email } });
    if (existe) throw new ConflictException('E-mail já cadastrado.');

    const usuario = this.usuarios.create({
      clienteId: cliente.id,
      nome: dto.nome,
      email: dto.email,
      telefone: dto.telefone,
      senhaHash: await bcrypt.hash(dto.senha, 10),
      perfil: 'cliente',
      emailVerificado: true, // criado e validado pelo usuário principal
      onboardingPendente: false,
    });
    await this.usuarios.save(usuario);
    return { mensagem: 'Usuário criado com sucesso.', id: usuario.id };
  }

  async editarUsuarioDoCliente(solicitanteId: string, alvoId: string, dto: EditarUsuarioClienteDto) {
    const { cliente } = await this.exigirPrincipal(solicitanteId);
    const alvo = await this.usuarioDoCliente(cliente.id, alvoId);

    if (dto.email && dto.email !== alvo.email) {
      const existe = await this.usuarios.findOne({ where: { email: dto.email } });
      if (existe && existe.id !== alvo.id) throw new ConflictException('E-mail já em uso.');
      alvo.email = dto.email;
    }
    if (dto.nome !== undefined) alvo.nome = dto.nome;
    if (dto.telefone !== undefined) alvo.telefone = dto.telefone;
    if (dto.senha) alvo.senhaHash = await bcrypt.hash(dto.senha, 10);

    await this.usuarios.save(alvo);
    return { mensagem: 'Usuário atualizado.', id: alvo.id };
  }

  async ativarUsuarioDoCliente(solicitanteId: string, alvoId: string, ativo: boolean) {
    const { usuario: principal, cliente } = await this.exigirPrincipal(solicitanteId);
    const alvo = await this.usuarioDoCliente(cliente.id, alvoId);

    if (!ativo) {
      if (alvo.id === principal.id) throw new BadRequestException('Você não pode bloquear a si mesmo.');
      if (alvo.id === cliente.proprietarioId) {
        throw new BadRequestException('O usuário principal não pode ser bloqueado. Transfira a função primeiro.');
      }
    }

    alvo.ativo = ativo;
    await this.usuarios.save(alvo);
    return { mensagem: ativo ? 'Usuário desbloqueado.' : 'Usuário bloqueado.' };
  }

  async transferirPrincipal(solicitanteId: string, novoPrincipalId: string) {
    const { cliente } = await this.exigirPrincipal(solicitanteId);
    if (novoPrincipalId === cliente.proprietarioId) throw new BadRequestException('Este usuário já é o principal.');

    const novo = await this.usuarioDoCliente(cliente.id, novoPrincipalId);
    if (!novo.ativo) throw new BadRequestException('O novo usuário principal precisa estar ativo.');

    cliente.proprietarioId = novo.id;
    await this.clientes.save(cliente);
    return { mensagem: `Função de usuário principal transferida para ${novo.nome}.` };
  }

  // ─── CNAE do Cliente (pessoa jurídica) ──────────────────────────────────────

  async listarCnaesSecundarios(clienteId: string) {
    return this.clienteCnaes.find({ where: { clienteId }, order: { codigo: 'ASC' } });
  }

  /**
   * Aplica CNAE principal e secundários no Cliente. Só altera o que veio definido no dto
   * (undefined = não mexe). Descrições ausentes são resolvidas no catálogo RFB.
   */
  private async aplicarCnaesCliente(
    cliente: Cliente,
    dto: { cnaePrincipal?: string | null; cnaePrincipalDescricao?: string | null; cnaesSecundarios?: CnaeSecundarioInput[] | null },
  ) {
    if (dto.cnaePrincipal !== undefined) {
      const codigo = (dto.cnaePrincipal ?? '').toString().replace(/\D/g, '') || null;
      cliente.cnaePrincipal = codigo;
      cliente.cnaePrincipalDescricao = null;
      if (codigo) {
        const [catalogo] = await this.cnpjSvc.obterCnaesPorCodigos([codigo]);
        cliente.cnaePrincipalDescricao = dto.cnaePrincipalDescricao || catalogo?.descricao || null;
      }
      await this.clientes.save(cliente);
    }

    if (dto.cnaesSecundarios !== undefined && dto.cnaesSecundarios !== null) {
      const itens = dto.cnaesSecundarios
        .map((item) => (typeof item === 'string' ? { codigo: item, descricao: null as string | null } : { codigo: item?.codigo ?? '', descricao: item?.descricao ?? null }))
        .map((item) => ({ codigo: item.codigo.toString().replace(/\D/g, ''), descricao: item.descricao }))
        .filter((item) => item.codigo && item.codigo !== cliente.cnaePrincipal);

      const unicos = new Map(itens.map((item) => [item.codigo, item]));
      const catalogo = await this.cnpjSvc.obterCnaesPorCodigos([...unicos.keys()]);

      await this.clienteCnaes.delete({ clienteId: cliente.id });
      const registros = [...unicos.values()].map((item) =>
        this.clienteCnaes.create({
          clienteId: cliente.id,
          codigo: item.codigo,
          descricao: item.descricao || catalogo.find((c) => c.codigo === item.codigo)?.descricao || null,
        }),
      );
      if (registros.length) await this.clienteCnaes.save(registros);
    }
  }

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

    // 1. Cria o usuário (apenas credenciais e dados pessoais)
    const usuario = this.usuarios.create({
      nome: dto.nome,
      email: dto.email,
      senhaHash,
      cpf: dto.cpf ?? null,
      dataNascimento: dto.dataNascimento ? new Date(dto.dataNascimento) : null,
      telefone: dto.telefone ?? null,
      codigoVerificacao,
      codigoVerificacaoExpira,
      onboardingPendente: true,
    });
    await this.usuarios.save(usuario);

    // 2. Cria o Cliente (dados de negócio)
    const cliente = this.clientes.create({
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
    await this.clientes.save(cliente);
    await this.aplicarCnaesCliente(cliente, dto);

    // 3. Vincula o Cliente ao usuário principal
    usuario.clienteId = cliente.id;
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

    // Usuário (apenas credenciais e dados pessoais)
    const usuario = this.usuarios.create({
      nome: dto.nome,
      email: dto.email,
      senhaHash,
      perfil,
      cpf: dto.cpf ?? null,
      dataNascimento: dto.dataNascimento ? new Date(dto.dataNascimento) : null,
      telefone: dto.telefone ?? null,
      emailVerificado: true,
      onboardingPendente: perfil === 'cliente',
    });
    await this.usuarios.save(usuario);

    // Cliente (apenas para perfil cliente, não para admin da plataforma)
    if (perfil === 'cliente') {
      const cliente = this.clientes.create({
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
      await this.clientes.save(cliente);
      await this.aplicarCnaesCliente(cliente, dto);
      usuario.clienteId = cliente.id;
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

    // Carrega o Cliente vinculado
    let cliente: Cliente | null = null;
    if (usuario.clienteId) {
      cliente = await this.clientes.findOne({ where: { id: usuario.clienteId } });
    }

    // Plano é do Cliente: usuários adicionais herdam a assinatura do Cliente
    const assinaturasCliente = cliente
      ? await this.assinaturas.find({ where: { clienteId: cliente.id } })
      : [];

    const onboardingPendente = this.isOnboardingPendente(usuario, cliente, assinaturasCliente);
    if (usuario.onboardingPendente !== onboardingPendente) {
      usuario.onboardingPendente = onboardingPendente;
      await this.usuarios.save(usuario);
    }

    const dadosPessoais = this.sanitizeAdminResponse(usuario);
    const cnaesSecundarios = cliente ? await this.listarCnaesSecundarios(cliente.id) : [];
    const dadosCliente = cliente ? {
      id: cliente.id,
      proprietarioId: cliente.proprietarioId,
      tipoPessoa: cliente.tipoPessoa,
      cnpj: cliente.cnpj,
      razaoSocial: cliente.razaoSocial,
      telefone: cliente.telefone,
      cep: cliente.cep,
      logradouro: cliente.logradouro,
      numero: cliente.numero,
      complemento: cliente.complemento,
      bairro: cliente.bairro,
      municipio: cliente.municipio,
      uf: cliente.uf,
      inscricaoEstadual: cliente.inscricaoEstadual,
      inscricaoMunicipal: cliente.inscricaoMunicipal,
      cnaePrincipal: cliente.cnaePrincipal,
      cnaePrincipalDescricao: cliente.cnaePrincipalDescricao,
      cnaesSecundarios: cnaesSecundarios.map((c) => ({ codigo: c.codigo, descricao: c.descricao })),
    } : null;

    return {
      ...dadosPessoais,
      // Compatibilidade: campos de negócio no topo (telas legadas leem perfil.cnpj etc.)
      tipoPessoa: cliente?.tipoPessoa ?? null,
      cnpj: cliente?.cnpj ?? null,
      razaoSocial: cliente?.razaoSocial ?? null,
      cep: cliente?.cep ?? null,
      logradouro: cliente?.logradouro ?? null,
      numero: cliente?.numero ?? null,
      complemento: cliente?.complemento ?? null,
      bairro: cliente?.bairro ?? null,
      municipio: cliente?.municipio ?? null,
      uf: cliente?.uf ?? null,
      inscricaoEstadual: cliente?.inscricaoEstadual ?? null,
      inscricaoMunicipal: cliente?.inscricaoMunicipal ?? null,
      onboardingPendente,
      /** True quando o usuário logado é o principal (administrador) do Cliente */
      usuarioPrincipal: cliente ? cliente.proprietarioId === usuario.id : false,
      // Dados do Cliente (a chave `conta` é alias legado e será removida)
      cliente: dadosCliente,
      conta: dadosCliente,
    };
  }

  async atualizarCliente(clienteId: string, dto: Partial<Cliente> & { cnaesSecundarios?: CnaeSecundarioInput[] }) {
    const cliente = await this.clientes.findOne({ where: { id: clienteId } });
    if (!cliente) throw new NotFoundException('Cliente não encontrado.');

    const { cnaePrincipal, cnaePrincipalDescricao, cnaesSecundarios, ...rest } = dto ?? {};
    Object.assign(cliente, rest);
    await this.clientes.save(cliente);
    await this.aplicarCnaesCliente(cliente, { cnaePrincipal, cnaePrincipalDescricao, cnaesSecundarios });

    const secundarios = await this.listarCnaesSecundarios(cliente.id);
    return {
      ...cliente,
      cnaesSecundarios: secundarios.map((c) => ({ codigo: c.codigo, descricao: c.descricao })),
    };
  }

  isOnboardingPendente(
    usuario: Partial<Usuario> & { assinaturas?: Array<{ status?: string | null }> },
    cliente?: Cliente | null,
    assinaturasCliente?: Array<{ status?: string | null }>,
  ) {
    const tipoPessoa = cliente?.tipoPessoa ?? 'J';
    const temDadosBasicos = !!usuario.nome && !!usuario.email && !!usuario.telefone;
    const temDocumento =
      tipoPessoa === 'F'
        ? !!usuario.cpf && !!usuario.dataNascimento
        : !!cliente?.cnpj && !!cliente?.razaoSocial;
    const temEndereco =
      !!cliente?.cep &&
      !!cliente?.logradouro &&
      !!cliente?.numero &&
      !!cliente?.bairro &&
      !!cliente?.municipio &&
      !!cliente?.uf;
    const temPlanoAtivo =
      !!usuario.assinaturas?.some((assinatura) => ['ativa', 'trial'].includes(assinatura.status ?? '')) ||
      !!assinaturasCliente?.some((assinatura) => ['ativa', 'trial'].includes(assinatura.status ?? ''));

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

    // Dados de negócio vão para o Cliente — nunca para o usuário
    // (docs/regra-cliente-usuario.md). Campos pessoais permanecem no usuário.
    const {
      email, senha, dataNascimento, tipoPessoa,
      cnaePrincipal, cnaePrincipalDescricao, cnaesSecundarios,
      cnpj, razaoSocial, cep, logradouro, numero, complemento, bairro, municipio, uf,
      inscricaoEstadual, inscricaoMunicipal,
      ...rest
    } = dto;
    Object.assign(usuario, rest);

    if (dataNascimento !== undefined) {
      usuario.dataNascimento = dataNascimento ? new Date(dataNascimento) : null;
    }

    let cliente: Cliente | null = null;
    if (usuario.clienteId) {
      cliente = await this.clientes.findOne({ where: { id: usuario.clienteId } });
    }

    const dadosNegocio = Object.fromEntries(
      Object.entries({
        tipoPessoa,
        cnpj, razaoSocial, cep, logradouro, numero, complemento, bairro, municipio, uf,
        inscricaoEstadual, inscricaoMunicipal,
      }).filter(([, valor]) => valor !== undefined),
    );

    if (cliente && Object.keys(dadosNegocio).length) {
      Object.assign(cliente, dadosNegocio);
      await this.clientes.save(cliente);
    }

    // CNAE pertence ao Cliente
    if (cliente && (cnaePrincipal !== undefined || cnaesSecundarios !== undefined)) {
      await this.aplicarCnaesCliente(cliente, { cnaePrincipal, cnaePrincipalDescricao, cnaesSecundarios });
    }

    const assinaturasCliente = cliente ? await this.assinaturas.find({ where: { clienteId: cliente.id } }) : [];
    usuario.onboardingPendente = this.isOnboardingPendente(usuario, cliente, assinaturasCliente);

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
      cpf: null,
      dataNascimento: null,
      telefone: null,
      tokenVerificacao: null,
      codigoVerificacao: null,
      codigoVerificacaoExpira: null,
      resetToken: null,
      resetTokenExpira: null,
      agendarExclusaoEm: null,
      ativo: false,
      onboardingPendente: false,
    });

    const assinaturasAtivas = await this.assinaturas.find({ where: [{ usuarioId, status: 'ativa' }, { usuarioId, status: 'trial' }] });
    for (const assinatura of assinaturasAtivas) {
      assinatura.status = 'cancelada';
      assinatura.canceladoEm = new Date();
      assinatura.motivoCancelamento = 'Conta excluida';
      await this.assinaturas.save(assinatura);
    }

    // Quando o excluído é o usuário principal, anonimiza também o Cliente:
    // dados de negócio, CNAEs, assinaturas e tokens do Cliente
    if (usuario.clienteId) {
      const cliente = await this.clientes.findOne({ where: { id: usuario.clienteId } });
      if (cliente && cliente.proprietarioId === usuario.id) {
        const assinaturasCliente = await this.assinaturas.find({
          where: [{ clienteId: cliente.id, status: 'ativa' }, { clienteId: cliente.id, status: 'trial' }],
        });
        for (const assinatura of assinaturasCliente) {
          assinatura.status = 'cancelada';
          assinatura.canceladoEm = new Date();
          assinatura.motivoCancelamento = 'Conta excluida';
          await this.assinaturas.save(assinatura);
        }

        await this.tokens.update({ clienteId: cliente.id, ativo: true }, { ativo: false });
        await this.clienteCnaes.delete({ clienteId: cliente.id });

        Object.assign(cliente, {
          tipoPessoa: 'J',
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
          cnaePrincipal: null,
          cnaePrincipalDescricao: null,
          ativo: false,
          agendarExclusaoEm: null,
        });
        await this.clientes.save(cliente);
      }
    }

    await this.usuarios.save(usuario);
    return { mensagem: 'Conta excluída e dados anonimizados.' };
  }

  async findAll(pagina = 1, limite = 20, busca?: string, filtros?: any, ordenacao?: string) {
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
    if (filtros?.cpf) baseWhere.cpf = ILike(`%${filtros.cpf}%`);
    if (filtros?.perfil) baseWhere.perfil = filtros.perfil;
    if (filtros?.emailVerificado !== undefined && filtros.emailVerificado !== '') {
      baseWhere.emailVerificado = Number(filtros.emailVerificado) === 1;
    }

    // Dados de negócio são do Cliente: tipo, CNPJ e razão social filtram pelo Cliente
    const clienteWhere: any = {};
    if (filtros?.cliente) clienteWhere.razaoSocial = ILike(`%${filtros.cliente}%`);
    if (filtros?.cnpj) clienteWhere.cnpj = ILike(`%${filtros.cnpj}%`);
    if (filtros?.tipoPessoa) clienteWhere.tipoPessoa = filtros.tipoPessoa;
    if (Object.keys(clienteWhere).length) baseWhere.cliente = clienteWhere;

    let where: any = baseWhere;
    if (busca) {
      where = [
        { ...baseWhere, nome: ILike(`%${busca}%`) },
        { ...baseWhere, email: ILike(`%${busca}%`) },
        { ...baseWhere, cliente: { ...(baseWhere.cliente ?? {}), cnpj: ILike(`%${busca}%`) } },
      ];
    }

    // Ordenação enviada pelo po-page-dynamic-table (ex: "nome" ou "-nome")
    const camposOrdenaveis = ['nome', 'email', 'criadoEm', 'ultimoLogin', 'perfil'];
    let order: any = { criadoEm: 'DESC' };
    if (ordenacao) {
      const desc = ordenacao.startsWith('-');
      const campo = desc ? ordenacao.slice(1) : ordenacao;
      if (camposOrdenaveis.includes(campo)) order = { [campo]: desc ? 'DESC' : 'ASC' };
    }

    return this.usuarios.findAndCount({
      where,
      order,
      skip: (pagina - 1) * limite,
      take: limite,
      relations: ['assinaturas', 'assinaturas.plano', 'cliente'],
    });
  }

  async findOne(id: string) {
    const usuario = await this.usuarios.findOne({
      where: { id },
      relations: ['assinaturas', 'assinaturas.plano', 'assinaturas.token', 'assinaturas.faturas'],
    });
    if (!usuario) throw new NotFoundException('Usuário não encontrado.');

    // Dados de negócio vêm do Cliente; CNAE em códigos (form dinâmico) e detalhe
    if (usuario.clienteId) {
      const cliente = await this.clientes.findOne({ where: { id: usuario.clienteId } });
      const secundarios = await this.listarCnaesSecundarios(usuario.clienteId);
      return {
        ...usuario,
        tipoPessoa: cliente?.tipoPessoa ?? 'J',
        cnpj: cliente?.cnpj ?? null,
        razaoSocial: cliente?.razaoSocial ?? null,
        cep: cliente?.cep ?? null,
        logradouro: cliente?.logradouro ?? null,
        numero: cliente?.numero ?? null,
        complemento: cliente?.complemento ?? null,
        bairro: cliente?.bairro ?? null,
        municipio: cliente?.municipio ?? null,
        uf: cliente?.uf ?? null,
        inscricaoEstadual: cliente?.inscricaoEstadual ?? null,
        inscricaoMunicipal: cliente?.inscricaoMunicipal ?? null,
        cnaePrincipal: cliente?.cnaePrincipal ?? null,
        cnaePrincipalDescricao: cliente?.cnaePrincipalDescricao ?? null,
        cnaesSecundarios: secundarios.map((c) => c.codigo),
        cnaesSecundariosDetalhe: secundarios.map((c) => ({ codigo: c.codigo, descricao: c.descricao })),
      };
    }

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

import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Not, IsNull, Repository, ILike } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import * as nodemailer from 'nodemailer';
import { Cron } from '@nestjs/schedule';
import { ClienteApi } from '../../entities/cliente.entity';
import { Assinatura } from '../../entities/assinatura.entity';
import { AgendarExclusaoDto, CreateClienteDto, LoginClienteDto, UpdateClienteDto } from './dto/create-cliente.dto';
import { ParametrosService } from '../parametros/parametros.service';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(ClienteApi, 'buscadados') private clientes: Repository<ClienteApi>,
    @InjectRepository(Assinatura, 'buscadados') private assinaturas: Repository<Assinatura>,
    private params: ParametrosService,
  ) {}

  // --- Público ---

  async signup(dto: CreateClienteDto) {
    const existe = await this.clientes.findOne({ where: { email: dto.email } });
    if (existe) throw new ConflictException('E-mail já cadastrado.');

    const senhaHash = await bcrypt.hash(dto.senha, 10);
    const tokenVerificacao = randomBytes(32).toString('hex');

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
      tokenVerificacao,
    });
    await this.clientes.save(cliente);

    // Enviar e-mail de verificação em background
    this.enviarEmailVerificacao(cliente.email, cliente.nome, tokenVerificacao).catch((err) => {
      console.error('Erro ao enviar email de verificação:', err);
    });

    return { mensagem: 'Cadastro realizado. Verifique seu e-mail para ativar a conta.', id: cliente.id };
  }

  private async enviarEmailVerificacao(email: string, nome: string, token: string) {
    const host = await this.params.getValor('SMTP_HOST', '');
    const port = parseInt(await this.params.getValor('SMTP_PORT', '587'), 10);
    const user = await this.params.getValor('SMTP_USER', '');
    const pass = await this.params.getValor('SMTP_PASS', '');
    const secure = (await this.params.getValor('SMTP_SECURE', 'false')) === 'true';

    if (!host || !user || !pass) {
      console.warn('SMTP não configurado. Email de verificação ignorado.');
      return;
    }

    const transporter = nodemailer.createTransport({
      host, port, secure, auth: { user, pass }
    });

    const baseUrl = await this.params.getValor('APP_URL', 'http://localhost:4200');
    const link = `${baseUrl}/verificar-email/${token}`;
    
    await transporter.sendMail({
      from: `"BuscaDados" <${user}>`,
      to: email,
      subject: 'Ative sua conta no BuscaDados',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #0b2d66;">Olá, ${nome}!</h2>
          <p>Obrigado por se cadastrar no <b>BuscaDados</b>.</p>
          <p>Para ativar sua conta e liberar seu acesso ao painel, por favor confirme seu e-mail clicando no botão abaixo:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${link}" style="background-color: #0044ff; color: #ffffff; padding: 14px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
              Verificar meu E-mail
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">Ou cole este link no seu navegador:<br> <a href="${link}">${link}</a></p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">BuscaDados — CNPJ: 19.654.062/0001-45</p>
        </div>
      `
    });
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
    // Não revela se o e-mail existe ou não
    if (!cliente) return { mensagem: 'Se esse e-mail estiver cadastrado, você receberá as instruções em breve.' };

    const token = randomBytes(32).toString('hex');
    const expira = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
    cliente.resetToken = token;
    cliente.resetTokenExpira = expira;
    await this.clientes.save(cliente);

    this.enviarEmailReset(cliente.email, cliente.nome, token).catch((err) => {
      console.error('Erro ao enviar e-mail de reset:', err);
    });

    return { mensagem: 'Se esse e-mail estiver cadastrado, você receberá as instruções em breve.' };
  }

  private async enviarEmailReset(email: string, nome: string, token: string) {
    const host = await this.params.getValor('SMTP_HOST', '');
    const port = parseInt(await this.params.getValor('SMTP_PORT', '587'), 10);
    const user = await this.params.getValor('SMTP_USER', '');
    const pass = await this.params.getValor('SMTP_PASS', '');
    const secure = (await this.params.getValor('SMTP_SECURE', 'false')) === 'true';
    const baseUrl = await this.params.getValor('APP_URL', 'http://localhost:4200');

    if (!host || !user || !pass) {
      console.warn('SMTP não configurado. E-mail de reset ignorado.');
      return;
    }

    const transporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass } });
    const link = `${baseUrl}/redefinir-senha/${token}`;

    await transporter.sendMail({
      from: `"BuscaDados" <${user}>`,
      to: email,
      subject: 'Redefinição de senha — BuscaDados',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:8px;">
          <h2 style="color:#0f172a;">Olá, ${nome}!</h2>
          <p>Recebemos uma solicitação para redefinir a senha da sua conta no <b>BuscaDados</b>.</p>
          <p>Clique no botão abaixo para criar uma nova senha. O link é válido por <b>1 hora</b>.</p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${link}" style="background:#7c3aed;color:#fff;padding:14px 28px;text-decoration:none;border-radius:8px;font-weight:700;display:inline-block;">
              Redefinir minha senha
            </a>
          </div>
          <p style="color:#6b7280;font-size:13px;">Se você não solicitou a redefinição, ignore este e-mail — sua senha permanece a mesma.</p>
          <p style="color:#6b7280;font-size:13px;">Ou cole este link no navegador:<br><a href="${link}">${link}</a></p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
          <p style="color:#9ca3af;font-size:11px;text-align:center;">BuscaDados · CNPJ 19.654.062/0001-45</p>
        </div>
      `,
    });
  }

  async verificarEmail(token: string) {
    const cliente = await this.clientes.findOne({ where: { tokenVerificacao: token } });
    if (!cliente) throw new NotFoundException('Token inválido ou expirado.');
    cliente.emailVerificado = true;
    cliente.tokenVerificacao = null;
    await this.clientes.save(cliente);
    return { mensagem: 'E-mail verificado com sucesso.' };
  }

  async meuPerfil(clienteId: string) {
    const cliente = await this.clientes.findOne({
      where: { id: clienteId },
      relations: ['assinaturas', 'assinaturas.plano', 'assinaturas.token'],
    });
    if (!cliente) throw new NotFoundException('Cliente não encontrado.');
    const { senhaHash, tokenVerificacao, resetToken, ...safe } = cliente;
    return safe;
  }

  async atualizar(clienteId: string, dto: UpdateClienteDto) {
    const cliente = await this.clientes.findOne({ where: { id: clienteId } });
    if (!cliente) throw new NotFoundException('Cliente não encontrado.');
    Object.assign(cliente, dto);
    return this.clientes.save(cliente);
  }

  // --- Admin ---

  findAll(pagina = 1, limite = 50, busca?: string, filtros?: any) {
    const baseWhere: any = {};
    
    // Filtros de status (PO-UI pode mandar como array ou string)
    if (filtros?.ativoStatus) {
      const status = Array.isArray(filtros.ativoStatus) ? filtros.ativoStatus[0] : filtros.ativoStatus;
      if (status === 'ativo') baseWhere.ativo = true;
      else if (status === 'suspenso') baseWhere.ativo = false;
    }

    if (filtros?.nome) baseWhere.nome = ILike(`%${filtros.nome}%`);
    if (filtros?.email) baseWhere.email = ILike(`%${filtros.email}%`);
    if (filtros?.cnpj) baseWhere.cnpj = ILike(`%${filtros.cnpj}%`);

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
    const cliente = await this.findOne(id);
    cliente.ativo = ativo;
    return this.clientes.save(cliente);
  }

  // Anonimiza imediatamente (chamado pelo admin ou pelo cron)
  async excluirConta(clienteId: string) {
    const cliente = await this.clientes.findOne({ where: { id: clienteId } });
    if (!cliente) throw new NotFoundException('Cliente não encontrado.');
    await this.anonimizarCliente(cliente);
    return { mensagem: 'Conta excluída com sucesso.' };
  }

  // Solicita exclusão imediata ou agendada para o fim do plano
  async agendarExclusao(clienteId: string, dto: AgendarExclusaoDto) {
    const cliente = await this.clientes.findOne({
      where: { id: clienteId },
      relations: ['assinaturas'],
    });
    if (!cliente) throw new NotFoundException('Cliente não encontrado.');
    if (cliente.agendarExclusaoEm) {
      return { mensagem: 'Exclusão já agendada.', agendarExclusaoEm: cliente.agendarExclusaoEm };
    }

    const diasRetencao = parseInt(await this.params.getValor('DIAS_RETENCAO_CONTA', '30'), 10);

    let dataExclusao: Date;

    if (dto.agendarPara === 'fim-plano') {
      const assinaturaAtiva = cliente.assinaturas?.find(
        (a) => a.status === 'ativa' && a.proximoVencimento,
      );
      if (!assinaturaAtiva?.proximoVencimento) {
        throw new BadRequestException('Nenhum plano ativo com data de vencimento encontrado.');
      }
      const fimPlano = new Date(assinaturaAtiva.proximoVencimento);
      dataExclusao = new Date(fimPlano.getTime() + diasRetencao * 86_400_000);
    } else {
      dataExclusao = new Date(Date.now() + diasRetencao * 86_400_000);
      cliente.ativo = false; // inativa imediatamente no caso "agora"
    }

    cliente.agendarExclusaoEm = dataExclusao;
    await this.clientes.save(cliente);

    return {
      mensagem: dto.agendarPara === 'agora'
        ? `Conta desativada. Dados serão removidos em ${diasRetencao} dias.`
        : `Exclusão agendada. Seus dados serão removidos após o fim do plano.`,
      agendarExclusaoEm: dataExclusao,
    };
  }

  // Roda todo dia às 03:00 — anonimiza contas com prazo vencido
  @Cron('0 3 * * *')
  async processarExclusoesAgendadas() {
    const contas = await this.clientes.find({
      where: {
        ativo: false,
        agendarExclusaoEm: LessThanOrEqual(new Date()),
      },
    });
    if (!contas.length) return;

    for (const c of contas) {
      await this.anonimizarCliente(c);
    }
    console.log(`[Cron] ${contas.length} conta(s) anonimizada(s).`);
  }

  private async anonimizarCliente(cliente: ClienteApi) {
    const ts = Date.now();
    cliente.ativo = false;
    cliente.nome = `Excluído-${ts}`;
    cliente.email = `excluido-${ts}@removido.invalid`;
    cliente.senhaHash = '';
    cliente.tipoPessoa = 'J';
    cliente.cpf = null;
    cliente.dataNascimento = null;
    cliente.cnpj = null;
    cliente.razaoSocial = null;
    cliente.telefone = null;
    cliente.cep = null;
    cliente.logradouro = null;
    cliente.numero = null;
    cliente.complemento = null;
    cliente.bairro = null;
    cliente.municipio = null;
    cliente.uf = null;
    cliente.tokenVerificacao = null;
    cliente.resetToken = null;
    cliente.agendarExclusaoEm = null;
    await this.clientes.save(cliente);
  }

  async confirmarEmail(id: string) {
    const cliente = await this.clientes.findOne({ where: { id } });
    if (!cliente) throw new NotFoundException('Cliente não encontrado.');
    cliente.emailVerificado = true;
    cliente.tokenVerificacao = null;
    await this.clientes.save(cliente);
    return { mensagem: 'E-mail confirmado com sucesso.' };
  }

  async enviarResetPorAdmin(id: string) {
    const cliente = await this.clientes.findOne({ where: { id } });
    if (!cliente) throw new NotFoundException('Cliente não encontrado.');
    return this.solicitarResetSenha(cliente.email);
  }
}

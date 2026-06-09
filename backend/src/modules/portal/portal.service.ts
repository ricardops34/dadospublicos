import { BadRequestException, ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { ClienteApi } from '../../entities/cliente.entity';
import { Assinatura } from '../../entities/assinatura.entity';
import { Token } from '../../entities/token.entity';
import { LoginPortalDto } from './dto/login-portal.dto';

@Injectable()
export class PortalService {
  constructor(
    @InjectRepository(ClienteApi, 'buscadados') private clientes: Repository<ClienteApi>,
    @InjectRepository(Assinatura, 'buscadados') private assinaturas: Repository<Assinatura>,
    @InjectRepository(Token, 'buscadados') private tokens: Repository<Token>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async login(dto: LoginPortalDto) {
    const cliente = await this.clientes.findOne({ where: { email: dto.email, ativo: true } });
    if (!cliente) throw new UnauthorizedException('Credenciais inválidas.');

    const ok = await bcrypt.compare(dto.senha, cliente.senhaHash);
    if (!ok) throw new UnauthorizedException('Credenciais inválidas.');

    if (!cliente.emailVerificado && cliente.perfil !== 'admin') {
      throw new ForbiddenException('EMAIL_NAO_VERIFICADO');
    }

    cliente.ultimoLogin = new Date();
    await this.clientes.save(cliente);

    const payload = {
      sub: cliente.id,
      nome: cliente.nome,
      email: cliente.email,
      perfil: cliente.perfil,
    };

    const jwt = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_SECRET', 'rfb-portal-secret'),
      expiresIn: '8h',
    });

    const apiToken = await this.resolverApiToken(cliente);

    return { token: jwt, perfil: cliente.perfil, nome: cliente.nome, apiToken };
  }

  // ─── Token de API ──────────────────────────────────────────────────────────

  private async resolverApiToken(cliente: ClienteApi): Promise<string | null> {
    if (cliente.perfil === 'admin') {
      return this.resolverTokenAdmin(cliente);
    }
    return this.resolverTokenCliente(cliente.id);
  }

  private async resolverTokenAdmin(cliente: ClienteApi): Promise<string> {
    // Admin tem token próprio identificado pelo e-mail
    const existente = await this.tokens.findOne({
      where: { email: cliente.email, ativo: true },
    });
    if (existente) return existente.token;

    // Cria token premium para o admin
    const novoToken = this.tokens.create({
      token:        randomBytes(32).toString('hex'),
      nome:         `Admin — ${cliente.nome}`,
      email:        cliente.email,
      plano:        'premium',
      limiteMensal: null,
      ativo:        true,
    });
    const salvo = await this.tokens.save(novoToken);
    return salvo.token;
  }

  private async resolverTokenCliente(clienteId: string): Promise<string | null> {
    const assinatura = await this.assinaturas.findOne({
      where: { clienteId, status: 'ativa' },
      relations: ['token'],
      order: { criadoEm: 'DESC' },
    });
    return assinatura?.token?.token ?? null;
  }

  // ─── Trocar senha ──────────────────────────────────────────────────────────

  async trocarSenha(clienteId: string, senhaAtual: string, novaSenha: string) {
    const cliente = await this.clientes.findOne({ where: { id: clienteId } });
    if (!cliente) throw new UnauthorizedException('Usuário não encontrado.');

    const ok = await bcrypt.compare(senhaAtual, cliente.senhaHash);
    if (!ok) throw new BadRequestException('Senha atual incorreta.');

    cliente.senhaHash = await bcrypt.hash(novaSenha, 10);
    await this.clientes.save(cliente);
    return { mensagem: 'Senha alterada com sucesso.' };
  }

  // ─── Seed admin ────────────────────────────────────────────────────────────

  async seedAdmin(email: string, senha: string, nome: string) {
    const existe = await this.clientes.findOne({ where: { email } });
    if (existe) {
      if (existe.perfil === 'admin') throw new ConflictException('Admin já existe.');
      existe.perfil = 'admin';
      existe.onboardingPendente = false;
      existe.senhaHash = await bcrypt.hash(senha, 10);
      await this.clientes.save(existe);
      return { mensagem: 'Usuário promovido a admin.', id: existe.id };
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const admin = this.clientes.create({
      nome,
      email,
      senhaHash,
      perfil: 'admin',
      ativo: true,
      emailVerificado: true,
      onboardingPendente: false,
    });
    await this.clientes.save(admin);
    return { mensagem: 'Admin criado com sucesso.', id: admin.id };
  }
}

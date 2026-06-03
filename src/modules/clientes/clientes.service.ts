import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { ClienteApi } from '../../entities/cliente.entity';
import { CreateClienteDto, LoginClienteDto, UpdateClienteDto } from './dto/create-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(@InjectRepository(ClienteApi) private clientes: Repository<ClienteApi>) {}

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
      cnpj: dto.cnpj ?? null,
      razaoSocial: dto.razaoSocial ?? null,
      telefone: dto.telefone ?? null,
      tokenVerificacao,
    });
    await this.clientes.save(cliente);

    // TODO: enviar e-mail de verificação
    return { mensagem: 'Cadastro realizado. Verifique seu e-mail para ativar a conta.', id: cliente.id };
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

  findAll(pagina = 1, limite = 50) {
    return this.clientes.findAndCount({
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
}

import { ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { ClienteApi } from '../../entities/cliente.entity';
import { LoginPortalDto } from './dto/login-portal.dto';

@Injectable()
export class PortalService {
  constructor(
    @InjectRepository(ClienteApi, 'buscadados') private clientes: Repository<ClienteApi>,
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

    const token = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_SECRET', 'rfb-portal-secret'),
      expiresIn: '8h',
    });

    return { token, perfil: cliente.perfil, nome: cliente.nome };
  }

  async seedAdmin(email: string, senha: string, nome: string) {
    const existe = await this.clientes.findOne({ where: { email } });
    if (existe) {
      if (existe.perfil === 'admin') throw new ConflictException('Admin já existe.');
      existe.perfil = 'admin';
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
    });
    await this.clientes.save(admin);
    return { mensagem: 'Admin criado com sucesso.', id: admin.id };
  }
}

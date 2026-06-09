import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../../entities/usuario.entity';

// Guard simples por ID+token de sessão (pode evoluir para JWT futuramente)
@Injectable()
export class UsuarioGuard implements CanActivate {
  constructor(@InjectRepository(Usuario, 'buscadados') private usuarios: Repository<Usuario>) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const clienteId = req.headers['x_cliente_id'];
    if (!clienteId) throw new UnauthorizedException('x_cliente_id obrigatório.');

    const usuario = await this.usuarios.findOne({ where: { id: clienteId, ativo: true } });
    if (!usuario) throw new UnauthorizedException('Cliente não encontrado ou inativo.');

    req['clienteId'] = clienteId;
    return true;
  }
}

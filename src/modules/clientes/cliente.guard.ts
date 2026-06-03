import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClienteApi } from '../../entities/cliente.entity';

// Guard simples por ID+token de sessão (pode evoluir para JWT futuramente)
@Injectable()
export class ClienteGuard implements CanActivate {
  constructor(@InjectRepository(ClienteApi) private clientes: Repository<ClienteApi>) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const clienteId = req.headers['x_cliente_id'];
    if (!clienteId) throw new UnauthorizedException('x_cliente_id obrigatório.');

    const cliente = await this.clientes.findOne({ where: { id: clienteId, ativo: true } });
    if (!cliente) throw new UnauthorizedException('Cliente não encontrado ou inativo.');

    req['clienteId'] = clienteId;
    return true;
  }
}

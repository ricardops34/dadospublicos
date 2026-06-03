import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private cfg: ConfigService) {}

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const adminKey = req.headers['x_admin_key'] ?? req.query['admin_key'];
    const expected = this.cfg.get<string>('ADMIN_KEY');

    if (!expected) throw new UnauthorizedException('ADMIN_KEY não configurada no servidor.');
    if (adminKey !== expected) throw new UnauthorizedException('Chave de administrador inválida.');
    return true;
  }
}

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private cfg: ConfigService) {}

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();

    // Opção 1: JWT com perfil admin (portal web)
    const authHeader: string = req.headers['authorization'] ?? '';
    const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (bearerToken) {
      try {
        const payload: any = jwt.verify(
          bearerToken,
          this.cfg.get<string>('JWT_SECRET', 'rfb-portal-secret'),
        );
        if (payload?.perfil === 'admin') return true;
      } catch {
        // token inválido — tenta chave admin abaixo
      }
    }

    // Opção 2: chave admin via header/query (integrações externas)
    const adminKey =
      req.headers['x-admin-key'] ??
      req.headers['x_admin_key'] ??
      req.query['admin_key'];
    const expected = this.cfg.get<string>('ADMIN_KEY');
    if (expected && adminKey === expected) return true;

    throw new UnauthorizedException('Acesso negado. Autentique-se como administrador.');
  }
}

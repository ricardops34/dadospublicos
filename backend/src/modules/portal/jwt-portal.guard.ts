import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PERFIL_KEY } from './perfil.decorator';

@Injectable()
export class JwtPortalGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private config: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    const authHeader: string = req.headers['authorization'] ?? '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) throw new UnauthorizedException('Token de sessão ausente.');

    let payload: any;
    try {
      payload = this.jwtService.verify(token, {
        secret: this.config.get('JWT_SECRET') || 'rfb-portal-secret',
      });
    } catch {
      throw new UnauthorizedException('Sessão inválida ou expirada.');
    }

    req['usuario'] = payload;

    const perfisMeta: ('admin' | 'cliente')[] = this.reflector.getAllAndOverride(PERFIL_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (perfisMeta && perfisMeta.length > 0 && !perfisMeta.includes(payload.perfil)) {
      throw new ForbiddenException('Acesso negado para este perfil.');
    }

    return true;
  }
}

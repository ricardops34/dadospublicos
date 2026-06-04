import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessLog } from '../../entities/access-log.entity';

const ENDPOINTS_IGNORADOS = ['/health', '/docs', '/docs-admin', '/favicon.ico'];

@Injectable()
export class AccessLogMiddleware implements NestMiddleware {
  constructor(@InjectRepository(AccessLog) private logs: Repository<AccessLog>) {}

  use(req: Request, res: Response, next: NextFunction) {
    const inicio = Date.now();
    const endpoint = req.path;

    if (ENDPOINTS_IGNORADOS.some((e) => endpoint.startsWith(e))) {
      return next();
    }

    res.on('finish', () => {
      const tempoMs = Date.now() - inicio;
      const token: any = (req as any)['tokenInfo'];
      const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ?? req.ip ?? '';

      this.logs.save(
        this.logs.create({
          tokenId:     token?.id ?? null,
          clienteId:   null,
          tokenPrefixo: token?.token ? token.token.substring(0, 8) : null,
          plano:        token?.plano ?? null,
          ip,
          endpoint,
          metodo:     req.method,
          statusCode: res.statusCode,
          tempoMs,
          userAgent:  req.headers['user-agent']?.substring(0, 500) ?? null,
        }),
      ).catch(() => {});
    });

    next();
  }
}

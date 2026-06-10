import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerRequest } from '@nestjs/throttler';
import { Request } from 'express';

@Injectable()
export class ApiRateLimitGuard extends ThrottlerGuard {

  protected async handleRequest(requestProps: ThrottlerRequest): Promise<boolean> {
    const { context } = requestProps;
    const req = context.switchToHttp().getRequest<Request>();

    const token = req.headers['x_api_token'] || req.query['token'];
    const tokenInfo = (req as any)['tokenInfo'];

    if (!token) {
      const ip = req.ip || (req.connection as any).remoteAddress;
      const key = `no_token:${ip}`;
      const { totalHits } = await this.storageService.increment(key, 60000, 10, 0, 'no-token');
      if (totalHits > 10) {
        throw new HttpException(
          { status: 429, titulo: 'Rate limit excedido', detalhes: 'Muitas requisições sem token.', validacao: [] },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
      return true;
    }

    if (tokenInfo?.plano === 'gratuito') {
      const tokenKey = `free_cnpj:${token}`;
      const { totalHits } = await this.storageService.increment(tokenKey, 3600000, 3, 0, 'free-plan');
      if (totalHits > 3) {
        throw new HttpException(
          { status: 429, titulo: 'Rate limit excedido', detalhes: 'Limite de 3 requisições por hora para o plano Free atingido.', validacao: [] },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
      return true;
    }

    const tokenKey = `token_tier:${token}`;
    const { totalHits } = await this.storageService.increment(tokenKey, 60000, 2000, 0, 'token-tier');
    if (totalHits > 2000) {
      throw new HttpException(
        { status: 429, titulo: 'Rate limit excedido', detalhes: 'Limite de requisições por minuto do token atingido.', validacao: [] },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}

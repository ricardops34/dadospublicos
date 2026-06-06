import { Injectable, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';
// ConsumoService e ClientesService serão integrados futuramente

@Injectable()
export class ApiRateLimitGuard extends ThrottlerGuard {
  
  // Como as regras são mistas (IP x Token), sobrescrevemos o método handleRequest
  protected async handleRequest(
    context: ExecutionContext,
    limit: number,
    ttl: number,
    throttler: any,
  ): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    
    // Extrai o Token (Header ou Query)
    const token = req.headers['x_api_token'] || req.query['token'];
    const tokenInfo = (req as any)['tokenInfo'];

    if (!token) {
      // Token obrigatório — AuthGuard rejeitará com 401, mas limitamos por IP como proteção extra
      const ip = req.ip || req.connection.remoteAddress;
      const key = `no_token:${ip}`;
      const { totalHits } = await this.storageService.increment(key, 60000);
      if (totalHits > 10) {
        throw new HttpException({ status: 429, titulo: 'Rate limit excedido', detalhes: 'Muitas requisições sem token.', validacao: [] }, HttpStatus.TOO_MANY_REQUESTS);
      }
      return true;
    }

    if (tokenInfo?.plano === 'free') {
      const tokenKey = `free_cnpj:${token}`;
      const { totalHits } = await this.storageService.increment(tokenKey, 3600000);

      if (totalHits > 3) {
        throw new HttpException({
          status: 429,
          titulo: 'Rate limit excedido',
          detalhes: 'Limite de 3 requisições por hora para o plano Free atingido.',
          validacao: []
        }, HttpStatus.TOO_MANY_REQUESTS);
      }

      return true;
    }

    const tokenKey = `token_tier:${token}`;
    
    // Aplicando a regra provisória de "4 requisições por minuto" se o plano exceder,
    // ou "2000 por minuto" caso esteja dentro do limite.
    // Vamos fixar provisoriamente em 2000 req/minuto até a integração com a Cota:
    const { totalHits } = await this.storageService.increment(tokenKey, 60000);
    
    if (totalHits > 2000) {
      throw new HttpException({
        status: 429,
        titulo: 'Rate limit excedido',
        detalhes: 'Limite de requisições por minuto do token atingido.',
        validacao: []
      }, HttpStatus.TOO_MANY_REQUESTS);
    }
    
    // TODO: Registrar a requisição no ConsumoService

    return true;
  }
}

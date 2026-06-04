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

    if (!token) {
      // REGRA GRATUITA: 3 requisições por minuto por IP
      const ip = req.ip || req.connection.remoteAddress;
      const key = `free_tier:${ip}`;
      
      const { totalHits } = await this.storageService.increment(key, 60000);
      
      if (totalHits > 3) {
        throw new HttpException({
          status: 429,
          titulo: 'Rate limit excedido',
          detalhes: 'Limite de 3 requisições por minuto atingido no plano gratuito.',
          validacao: []
        }, HttpStatus.TOO_MANY_REQUESTS);
      }
      
      return true;
    }

    // --- REGRA PAGA (TOKEN) ---
    // 1. O Token será validado aqui.
    // 2. Iremos verificar o plano e a cota mensal.
    // 3. Incrementaremos o ConsumoService.
    
    // Para fins do Goal atual, deixamos o gateway de IP ativo,
    // e criamos o bypass básico para tokens (a lógica profunda do token 
    // dependerá da unificação do Cliente com Token e do ConsumoService)
    
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

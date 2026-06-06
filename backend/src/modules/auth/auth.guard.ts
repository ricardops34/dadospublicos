import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Token, Plano } from '../../entities/token.entity';
import { Consumo } from '../../entities/consumo.entity';

export const PLANO_KEY = 'plano_minimo';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(Token, 'buscadados') private tokens: Repository<Token>,
    @InjectRepository(Consumo, 'buscadados') private consumos: Repository<Consumo>,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const planoMinimo = this.reflector.get<Plano>(PLANO_KEY, ctx.getHandler()) ?? 'gratuito';

    const req = ctx.switchToHttp().getRequest();
    const rawToken: string = req.headers['x_api_token'] ?? req.query['token'];

    if (!rawToken) throw new UnauthorizedException('Token de API obrigatório. Obtenha o seu em buscadados.bjsoft.com.br');

    const token = await this.tokens.findOne({ where: { token: rawToken, ativo: true } });
    if (!token) throw new UnauthorizedException('Token inválido ou inativo.');

    const ordem: Plano[] = ['free', 'gratuito', 'basico', 'intermediario', 'avancado', 'premium'];
    if (ordem.indexOf(token.plano) < ordem.indexOf(planoMinimo)) {
      throw new ForbiddenException(`Plano ${planoMinimo} necessário. Plano atual: ${token.plano}.`);
    }

    // Registra consumo
    const now = new Date();
    const ano = now.getFullYear();
    const mes = now.getMonth() + 1;
    await this.consumos
      .createQueryBuilder()
      .insert()
      .into(Consumo)
      .values({ tokenId: token.id, ano, mes, quantidade: 1 })
      .onConflict('DO NOTHING')
      .execute();
    await this.consumos
      .createQueryBuilder()
      .update(Consumo)
      .set({ quantidade: () => 'quantidade + 1', atualizadoEm: new Date() })
      .where('token_id = :tid AND ano = :ano AND mes = :mes', { tid: token.id, ano, mes })
      .execute();

    req['tokenInfo'] = token;
    return true;
  }
}

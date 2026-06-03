import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthGuard } from '../auth/auth.guard';
import { PlanoMinimo } from '../auth/plano.decorator';
import { Consumo } from '../../entities/consumo.entity';
import { Token } from '../../entities/token.entity';

@ApiTags('Consumo')
@Controller('consumo')
@UseGuards(AuthGuard)
export class ConsumoController {
  constructor(
    @InjectRepository(Consumo) private consumos: Repository<Consumo>,
    @InjectRepository(Token) private tokens: Repository<Token>,
  ) {}

  @Get()
  @PlanoMinimo('basico')
  @ApiSecurity('token')
  @ApiOperation({ summary: 'Monitora consumo mensal do token' })
  @ApiQuery({ name: 'ano', required: false, type: Number })
  @ApiQuery({ name: 'mes', required: false, type: Number })
  async consumo(@Req() req: any, @Query('ano') ano?: number, @Query('mes') mes?: number) {
    const token: Token = req['tokenInfo'];
    const qb = this.consumos.createQueryBuilder('c').where('c.token_id = :tid', { tid: token.id });
    if (ano) qb.andWhere('c.ano = :ano', { ano: +ano });
    if (mes) qb.andWhere('c.mes = :mes', { mes: +mes });
    qb.orderBy('c.ano', 'DESC').addOrderBy('c.mes', 'DESC');
    const data = await qb.getMany();
    return {
      plano: token.plano,
      limite_mensal: token.limiteMensal,
      data: data.map(c => ({ ano: c.ano, mes: c.mes, quantidade: c.quantidade, atualizado_em: c.atualizadoEm })),
    };
  }
}

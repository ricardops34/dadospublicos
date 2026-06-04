import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthGuard } from '../auth/auth.guard';
import { PlanoMinimo } from '../auth/plano.decorator';
import { JwtPortalGuard } from '../portal/jwt-portal.guard';
import { Perfil } from '../portal/perfil.decorator';
import { Consumo } from '../../entities/consumo.entity';
import { Token } from '../../entities/token.entity';

@ApiTags('Consumo')
@Controller('consumo')
export class ConsumoController {
  constructor(
    @InjectRepository(Consumo) private consumos: Repository<Consumo>,
    @InjectRepository(Token) private tokens: Repository<Token>,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  @PlanoMinimo('basico')
  @ApiSecurity('token')
  @ApiOperation({ summary: 'Monitora consumo mensal do token (cliente)' })
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

  @Get('portal')
  @UseGuards(JwtPortalGuard)
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Histórico de consumo do cliente logado (portal JWT)' })
  async consumoPortal(@Req() req: any) {
    const clienteId = req['usuario'].sub;
    const rows = await this.consumos
      .createQueryBuilder('c')
      .innerJoin('tokens', 't', 't.id = c.token_id')
      .innerJoin('assinaturas', 'a', 'a.token_id = t.id')
      .where('a.cliente_id = :clienteId', { clienteId })
      .select(['c.ano AS ano', 'c.mes AS mes', 'c.quantidade AS quantidade', 'c.atualizado_em AS atualizado_em'])
      .orderBy('c.ano', 'DESC')
      .addOrderBy('c.mes', 'DESC')
      .getRawMany();
    return rows.map(r => ({ ano: +r.ano, mes: +r.mes, quantidade: +r.quantidade, atualizadoEm: r.atualizado_em }));
  }

  @Get('admin')
  @UseGuards(JwtPortalGuard)
  @Perfil('admin')
  @ApiSecurity('bearer')
  @ApiOperation({ summary: '[Admin] Consumo de todos os clientes por mês/ano' })
  @ApiQuery({ name: 'mes', required: false, type: Number })
  @ApiQuery({ name: 'ano', required: false, type: Number })
  async consumoAdmin(@Query('mes') mes?: number, @Query('ano') ano?: number) {
    const now = new Date();
    const mesQ = mes ? +mes : now.getMonth() + 1;
    const anoQ = ano ? +ano : now.getFullYear();

    const rows = await this.consumos
      .createQueryBuilder('c')
      .innerJoin('tokens', 't', 't.id = c.token_id')
      .innerJoin('assinaturas', 'a', 'a.token_id = t.id')
      .innerJoin('clientes_api', 'cl', 'cl.id = a.cliente_id')
      .innerJoin('planos', 'p', 'p.id = a.plano_id')
      .select([
        'cl.nome AS cliente',
        'cl.email AS email',
        'p.nome AS plano',
        'p.limite_mensal AS limite',
        'c.quantidade AS quantidade',
        'c.mes AS mes',
        'c.ano AS ano',
      ])
      .where('c.mes = :mes AND c.ano = :ano', { mes: mesQ, ano: anoQ })
      .orderBy('c.quantidade', 'DESC')
      .getRawMany();

    return rows.map(r => ({
      cliente: r.cliente,
      email: r.email,
      plano: r.plano,
      limite: r.limite ? +r.limite : null,
      quantidade: +r.quantidade,
      mes: +r.mes,
      ano: +r.ano,
    }));
  }
}

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { Cron } from '@nestjs/schedule';
import { Assinatura } from '../../entities/assinatura.entity';
import { Token } from '../../entities/token.entity';
import { Usuario } from '../../entities/usuario.entity';
import { Plano } from '../../entities/plano.entity';
import { Fatura } from '../../entities/fatura.entity';
import { Consumo } from '../../entities/consumo.entity';
import { RedisCacheService } from '../redis-cache/redis-cache.service';

@Injectable()
export class AssinaturasService {
  constructor(
    @InjectRepository(Assinatura, 'buscadados') private assinaturas: Repository<Assinatura>,
    @InjectRepository(Token, 'buscadados') private tokens: Repository<Token>,
    @InjectRepository(Usuario, 'buscadados') private clientes: Repository<Usuario>,
    @InjectRepository(Plano, 'buscadados') private planos: Repository<Plano>,
    @InjectRepository(Fatura, 'buscadados') private faturas: Repository<Fatura>,
    @InjectRepository(Consumo, 'buscadados') private consumos: Repository<Consumo>,
    private cache: RedisCacheService,
  ) {}

  async assinar(clienteId: string, planoSlug: string) {
    const cliente = await this.clientes.findOne({ where: { id: clienteId, ativo: true } });
    if (!cliente) throw new NotFoundException('Cliente nao encontrado.');

    const plano = await this.planos.findOne({ where: { slug: planoSlug, ativo: true } });
    if (!plano) throw new NotFoundException(`Plano "${planoSlug}" nao encontrado.`);

    const ativa = await this.assinaturas.findOne({ where: { clienteId, status: 'ativa' } });
    if (ativa) {
      ativa.status = 'cancelada';
      ativa.canceladoEm = new Date();
      ativa.motivoCancelamento = 'Substituida por novo plano';
      await this.assinaturas.save(ativa);

      if (ativa.tokenId) {
        await this.tokens.update(ativa.tokenId, { ativo: false });
      }
    }

    const tokenValor = randomBytes(32).toString('hex');
    const token = await this.tokens.save(this.tokens.create({
      token: tokenValor,
      nome: `${cliente.nome} - ${plano.nome}`,
      email: cliente.email,
      plano: plano.slug as any,
      limiteMensal: plano.limiteMensal,
      ativo: true,
    }));

    const hoje = new Date();
    const vencimento = new Date(hoje.getFullYear(), hoje.getMonth() + 1, hoje.getDate());

    const assinatura = await this.assinaturas.save(this.assinaturas.create({
      clienteId,
      planoId: plano.id,
      tokenId: token.id,
      status: 'ativa',
      dataInicio: hoje.toISOString().split('T')[0],
      proximoVencimento: vencimento.toISOString().split('T')[0],
    }));

    await this.cache.del(`assinatura:minha:${clienteId}`);
    return {
      assinatura_id: assinatura.id,
      plano: plano.nome,
      token_api: tokenValor,
      proximo_vencimento: assinatura.proximoVencimento,
      mensagem: 'Assinatura ativada. Guarde seu token de API - ele nao sera exibido novamente.',
    };
  }

  async meuToken(clienteId: string) {
    const cacheKey = `assinatura:minha:${clienteId}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const assinatura = await this.assinaturas.findOne({
      where: { clienteId, status: 'ativa' },
      relations: ['plano', 'token', 'plano.recursos', 'plano.recursos.recurso'],
    });
    if (!assinatura) throw new NotFoundException('Nenhuma assinatura ativa encontrada.');

    const result = {
      plano: assinatura.plano.nome,
      plano_slug: assinatura.plano.slug,
      plano_id: assinatura.plano.id,
      status: assinatura.status,
      data_inicio: assinatura.dataInicio,
      proximo_vencimento: assinatura.proximoVencimento,
      preco_mensal: Number(assinatura.plano.precoMensal),
      rate_limit: assinatura.plano.rateLimitPorMinuto,
      limite_mensal: assinatura.plano.limiteMensal,
      acessos: {
        cnpj: assinatura.plano.acessoCnpj,
        cnpj_raiz: assinatura.plano.acessoCnpjRaiz,
        pesquisa: assinatura.plano.acessoPesquisa,
        geocode: assinatura.plano.acessoGeocode,
        suframa: assinatura.plano.acessoSuframa,
        mapa: assinatura.plano.acessoMapa,
      },
      recursos: this.extrairRecursosDoPlano(assinatura.plano),
    };
    await this.cache.set(cacheKey, result, 300); // 5 min
    return result;
  }

  async recursosDoPlanoAtivo(clienteId: string) {
    const assinatura = await this.assinaturas.findOne({
      where: { clienteId, status: 'ativa' },
      relations: ['plano', 'plano.recursos', 'plano.recursos.recurso'],
    });

    if (!assinatura?.plano) {
      return [];
    }

    return this.extrairRecursosDoPlano(assinatura.plano);
  }

  async cancelar(clienteId: string, motivo?: string, quando: 'agora' | 'fim-vigencia' = 'agora') {
    const assinatura = await this.assinaturas.findOne({ where: { clienteId, status: 'ativa' } });
    if (!assinatura) throw new NotFoundException('Nenhuma assinatura ativa.');

    if (quando === 'fim-vigencia') {
      if (!assinatura.proximoVencimento) throw new BadRequestException('Assinatura sem data de vencimento definida.');
      assinatura.agendarCancelamentoEm = assinatura.proximoVencimento;
      assinatura.motivoCancelamento = motivo ?? 'Cancelamento agendado pelo cliente';
      await this.assinaturas.save(assinatura);
      return {
        mensagem: `Cancelamento agendado para ${assinatura.proximoVencimento}. Voce mantem acesso ate la.`,
        agendarCancelamentoEm: assinatura.agendarCancelamentoEm,
      };
    }

    assinatura.status = 'cancelada';
    assinatura.canceladoEm = new Date();
    assinatura.motivoCancelamento = motivo ?? 'Cancelado pelo cliente';
    await this.assinaturas.save(assinatura);
    if (assinatura.tokenId) await this.tokens.update(assinatura.tokenId, { ativo: false });
    await this.cache.del(`assinatura:minha:${clienteId}`);
    return { mensagem: 'Assinatura cancelada com sucesso.' };
  }

  @Cron('0 4 * * *')
  async processarCancelamentosAgendados() {
    const hoje = new Date().toISOString().split('T')[0];
    const vencidas = await this.assinaturas.find({
      where: { status: 'ativa', agendarCancelamentoEm: LessThanOrEqual(hoje) },
    });
    if (!vencidas.length) return;

    for (const ass of vencidas) {
      ass.status = 'cancelada';
      ass.canceladoEm = new Date();
      ass.agendarCancelamentoEm = null;
      await this.assinaturas.save(ass);
      if (ass.tokenId) await this.tokens.update(ass.tokenId, { ativo: false });
    }
    console.log(`[Cron] ${vencidas.length} assinatura(s) cancelada(s) por agendamento.`);
  }

  async regerarToken(clienteId: string) {
    const assinatura = await this.assinaturas.findOne({
      where: { clienteId, status: 'ativa' },
      relations: ['plano'],
    });
    if (!assinatura) throw new NotFoundException('Nenhuma assinatura ativa.');

    if (assinatura.tokenId) await this.tokens.update(assinatura.tokenId, { ativo: false });

    const novoValor = randomBytes(32).toString('hex');
    const novoToken = await this.tokens.save(this.tokens.create({
      token: novoValor,
      nome: `${clienteId} - regerar`,
      plano: assinatura.plano.slug as any,
      limiteMensal: assinatura.plano.limiteMensal,
      ativo: true,
    }));

    assinatura.tokenId = novoToken.id;
    await this.assinaturas.save(assinatura);
    await this.cache.del(`assinatura:minha:${clienteId}`);
    return { token_api: novoValor, mensagem: 'Token regerado. O anterior foi invalidado.' };
  }

  findAll(pagina = 1, limite = 50) {
    return this.assinaturas.findAndCount({
      order: { criadoEm: 'DESC' },
      skip: (pagina - 1) * limite,
      take: limite,
      relations: ['cliente', 'plano', 'token'],
    });
  }

  async editarAdmin(id: string, dto: { planoId?: string; dataInicio?: string; proximoVencimento?: string }) {
    const ass = await this.assinaturas.findOne({ where: { id } });
    if (!ass) throw new NotFoundException('Assinatura nao encontrada.');

    if (dto.planoId && dto.planoId !== ass.planoId) {
      const novoPlano = await this.planos.findOne({ where: { id: dto.planoId } });
      if (!novoPlano) throw new NotFoundException('Plano nao encontrado.');
      ass.planoId = novoPlano.id;
      if (ass.tokenId) {
        await this.tokens.update(ass.tokenId, {
          plano: novoPlano.slug as any,
          limiteMensal: novoPlano.limiteMensal,
        });
      }
    }

    if (dto.dataInicio) ass.dataInicio = dto.dataInicio;
    if (dto.proximoVencimento) ass.proximoVencimento = dto.proximoVencimento;

    return this.assinaturas.save(ass);
  }

  async consumoDaAssinatura(id: string) {
    const ass = await this.assinaturas.findOne({ where: { id } });
    if (!ass) throw new NotFoundException('Assinatura nao encontrada.');
    if (!ass.tokenId) return [];

    const now = new Date();
    const ano = now.getFullYear();
    const mes = now.getMonth() + 1;

    const atual = await this.consumos.findOne({ where: { tokenId: ass.tokenId, ano, mes } });
    if (!atual) {
      await this.consumos.save(this.consumos.create({ tokenId: ass.tokenId, ano, mes, quantidade: 0, atualizadoEm: now }));
    }

    return this.consumos.find({ where: { tokenId: ass.tokenId }, order: { ano: 'DESC', mes: 'DESC' } });
  }

  async suspender(id: string) {
    const ass = await this.assinaturas.findOne({ where: { id } });
    if (!ass) throw new NotFoundException('Assinatura nao encontrada.');
    ass.status = 'suspensa';
    if (ass.tokenId) await this.tokens.update(ass.tokenId, { ativo: false });
    return this.assinaturas.save(ass);
  }

  async reativar(id: string) {
    const ass = await this.assinaturas.findOne({ where: { id }, relations: ['plano'] });
    if (!ass) throw new NotFoundException('Assinatura nao encontrada.');
    if (ass.status === 'cancelada') throw new BadRequestException('Assinatura cancelada nao pode ser reativada. Crie uma nova.');
    ass.status = 'ativa';
    if (ass.tokenId) await this.tokens.update(ass.tokenId, { ativo: true });
    return this.assinaturas.save(ass);
  }

  private calcularProrata(
    precoMensal: number,
    dataInicio: string,
    proximoVencimento: string,
    hoje: Date,
  ): { diasUsados: number; diasTotais: number; diasRestantes: number; valor: number } {
    const ms = 86_400_000;
    const toDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const ini = toDay(new Date(dataInicio));
    const ven = toDay(new Date(proximoVencimento));
    const hoj = toDay(hoje);

    const diasTotais = Math.round((ven.getTime() - ini.getTime()) / ms);
    const diasUsados = Math.max(0, Math.round((hoj.getTime() - ini.getTime()) / ms));
    const diasRestantes = Math.max(0, diasTotais - diasUsados);
    const valor = diasTotais > 0
      ? parseFloat(((diasRestantes / diasTotais) * Number(precoMensal)).toFixed(2))
      : 0;

    return { diasUsados, diasTotais, diasRestantes, valor };
  }

  async upgradePreview(clienteId: string, novoPlanoSlug: string) {
    const assinatura = await this.assinaturas.findOne({
      where: { clienteId, status: 'ativa' },
      relations: ['plano'],
    });
    if (!assinatura) throw new NotFoundException('Nenhuma assinatura ativa.');
    if (!assinatura.proximoVencimento) {
      throw new BadRequestException('Assinatura sem data de vencimento definida.');
    }

    const novoPlano = await this.planos.findOne({ where: { slug: novoPlanoSlug, ativo: true } });
    if (!novoPlano) throw new NotFoundException(`Plano "${novoPlanoSlug}" nao encontrado.`);
    if (Number(novoPlano.precoMensal) <= Number(assinatura.plano.precoMensal)) {
      throw new BadRequestException('O novo plano deve ser de valor superior ao atual.');
    }

    const hoje = new Date();
    const credito = this.calcularProrata(assinatura.plano.precoMensal, assinatura.dataInicio, assinatura.proximoVencimento, hoje);
    const cobranca = this.calcularProrata(novoPlano.precoMensal, assinatura.dataInicio, assinatura.proximoVencimento, hoje);
    const valorLiquido = parseFloat((cobranca.valor - credito.valor).toFixed(2));

    return {
      planoAtual: { nome: assinatura.plano.nome, precoMensal: Number(assinatura.plano.precoMensal) },
      novoPlano: { nome: novoPlano.nome, precoMensal: Number(novoPlano.precoMensal) },
      diasRestantes: credito.diasRestantes,
      diasTotais: credito.diasTotais,
      creditoPlanoAtual: credito.valor,
      cobrancaNovoPlano: cobranca.valor,
      valorLiquido,
      proximoVencimento: assinatura.proximoVencimento,
    };
  }

  async upgrade(clienteId: string, novoPlanoSlug: string) {
    const assinatura = await this.assinaturas.findOne({
      where: { clienteId, status: 'ativa' },
      relations: ['plano'],
    });
    if (!assinatura) throw new NotFoundException('Nenhuma assinatura ativa.');
    if (!assinatura.proximoVencimento) {
      throw new BadRequestException('Assinatura sem data de vencimento definida.');
    }

    const novoPlano = await this.planos.findOne({ where: { slug: novoPlanoSlug, ativo: true } });
    if (!novoPlano) throw new NotFoundException(`Plano "${novoPlanoSlug}" nao encontrado.`);
    if (Number(novoPlano.precoMensal) <= Number(assinatura.plano.precoMensal)) {
      throw new BadRequestException('So e possivel fazer upgrade para um plano de valor superior.');
    }

    const hoje = new Date();
    const credito = this.calcularProrata(assinatura.plano.precoMensal, assinatura.dataInicio, assinatura.proximoVencimento, hoje);
    const cobranca = this.calcularProrata(novoPlano.precoMensal, assinatura.dataInicio, assinatura.proximoVencimento, hoje);
    const valorLiquido = Math.max(0, parseFloat((cobranca.valor - credito.valor).toFixed(2)));

    const nomeAnterior = assinatura.plano.nome;

    const cliente = await this.clientes.findOne({ where: { id: clienteId } });
    if (assinatura.tokenId) await this.tokens.update(assinatura.tokenId, { ativo: false });

    const tokenValor = randomBytes(32).toString('hex');
    const novoToken = await this.tokens.save(this.tokens.create({
      token: tokenValor,
      nome: `${cliente!.nome} - ${novoPlano.nome}`,
      email: cliente!.email,
      plano: novoPlano.slug as any,
      limiteMensal: novoPlano.limiteMensal,
      ativo: true,
    }));

    assinatura.planoId = novoPlano.id;
    assinatura.tokenId = novoToken.id;
    await this.assinaturas.save(assinatura);

    const dataVenc = new Date(hoje.getFullYear(), hoje.getMonth() + (hoje.getDate() > 10 ? 1 : 0), 10);
    await this.faturas.save(this.faturas.create({
      assinaturaId: assinatura.id,
      ano: hoje.getFullYear(),
      mes: hoje.getMonth() + 1,
      valor: valorLiquido,
      status: 'pendente',
      dataVencimento: dataVenc.toISOString().split('T')[0],
      tipo: 'upgrade',
      observacao: `Upgrade de ${nomeAnterior} para ${novoPlano.nome}. Credito: R$ ${credito.valor.toFixed(2)} | Cobranca: R$ ${cobranca.valor.toFixed(2)}`,
    }));

    await this.cache.del(`assinatura:minha:${clienteId}`);
    return {
      mensagem: `Upgrade realizado para ${novoPlano.nome}.`,
      token_api: tokenValor,
      proximo_vencimento: assinatura.proximoVencimento,
      valor_upgrade: valorLiquido,
    };
  }

  private extrairRecursosDoPlano(plano: Plano) {
    return [...(plano.recursos ?? [])]
      .filter((item) => item.recurso?.ativo)
      .sort((a, b) => a.ordem - b.ordem)
      .map((item) => ({
        id: item.recurso.id,
        slug: item.recurso.slug,
        nome: item.recurso.nome,
        descricaoExibicao: item.descricaoExibicao,
        ordem: item.ordem,
      }));
  }
}

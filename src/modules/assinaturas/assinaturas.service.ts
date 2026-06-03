import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { Assinatura } from '../../entities/assinatura.entity';
import { Token } from '../../entities/token.entity';
import { ClienteApi } from '../../entities/cliente.entity';
import { Plano } from '../../entities/plano.entity';

@Injectable()
export class AssinaturasService {
  constructor(
    @InjectRepository(Assinatura) private assinaturas: Repository<Assinatura>,
    @InjectRepository(Token) private tokens: Repository<Token>,
    @InjectRepository(ClienteApi) private clientes: Repository<ClienteApi>,
    @InjectRepository(Plano) private planos: Repository<Plano>,
  ) {}

  async assinar(clienteId: string, planoSlug: string) {
    const cliente = await this.clientes.findOne({ where: { id: clienteId, ativo: true } });
    if (!cliente) throw new NotFoundException('Cliente não encontrado.');

    const plano = await this.planos.findOne({ where: { slug: planoSlug, ativo: true } });
    if (!plano) throw new NotFoundException(`Plano "${planoSlug}" não encontrado.`);

    // Cancela assinatura ativa anterior
    const ativa = await this.assinaturas.findOne({ where: { clienteId, status: 'ativa' } });
    if (ativa) {
      ativa.status = 'cancelada';
      ativa.canceladoEm = new Date();
      ativa.motivoCancelamento = 'Substituída por novo plano';
      await this.assinaturas.save(ativa);

      // Desativa token anterior
      if (ativa.tokenId) {
        await this.tokens.update(ativa.tokenId, { ativo: false });
      }
    }

    // Gera novo token de API
    const tokenValor = randomBytes(32).toString('hex');
    const token = await this.tokens.save(this.tokens.create({
      token: tokenValor,
      nome: `${cliente.nome} — ${plano.nome}`,
      email: cliente.email,
      plano: plano.slug as any,
      limiteMensal: plano.limiteMensal,
      ativo: true,
    }));

    // Cria assinatura
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

    return {
      assinatura_id: assinatura.id,
      plano: plano.nome,
      token_api: tokenValor,
      proximo_vencimento: assinatura.proximoVencimento,
      mensagem: 'Assinatura ativada. Guarde seu token de API — ele não será exibido novamente.',
    };
  }

  async meuToken(clienteId: string) {
    const assinatura = await this.assinaturas.findOne({
      where: { clienteId, status: 'ativa' },
      relations: ['plano', 'token'],
    });
    if (!assinatura) throw new NotFoundException('Nenhuma assinatura ativa encontrada.');

    return {
      plano: assinatura.plano.nome,
      status: assinatura.status,
      proximo_vencimento: assinatura.proximoVencimento,
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
      // token não é exibido aqui — foi mostrado apenas na ativação
    };
  }

  async cancelar(clienteId: string, motivo?: string) {
    const assinatura = await this.assinaturas.findOne({ where: { clienteId, status: 'ativa' } });
    if (!assinatura) throw new NotFoundException('Nenhuma assinatura ativa.');

    assinatura.status = 'cancelada';
    assinatura.canceladoEm = new Date();
    assinatura.motivoCancelamento = motivo ?? 'Cancelado pelo cliente';
    await this.assinaturas.save(assinatura);

    if (assinatura.tokenId) await this.tokens.update(assinatura.tokenId, { ativo: false });
    return { mensagem: 'Assinatura cancelada com sucesso.' };
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
      nome: `${clienteId} — regerar`,
      plano: assinatura.plano.slug as any,
      limiteMensal: assinatura.plano.limiteMensal,
      ativo: true,
    }));

    assinatura.tokenId = novoToken.id;
    await this.assinaturas.save(assinatura);

    return { token_api: novoValor, mensagem: 'Token regerado. O anterior foi invalidado.' };
  }

  // Admin
  findAll(pagina = 1, limite = 50) {
    return this.assinaturas.findAndCount({
      order: { criadoEm: 'DESC' },
      skip: (pagina - 1) * limite,
      take: limite,
      relations: ['cliente', 'plano'],
    });
  }

  async suspender(id: string) {
    const ass = await this.assinaturas.findOne({ where: { id } });
    if (!ass) throw new NotFoundException('Assinatura não encontrada.');
    ass.status = 'suspensa';
    if (ass.tokenId) await this.tokens.update(ass.tokenId, { ativo: false });
    return this.assinaturas.save(ass);
  }

  async reativar(id: string) {
    const ass = await this.assinaturas.findOne({ where: { id }, relations: ['plano'] });
    if (!ass) throw new NotFoundException('Assinatura não encontrada.');
    if (ass.status === 'cancelada') throw new BadRequestException('Assinatura cancelada não pode ser reativada. Crie uma nova.');
    ass.status = 'ativa';
    if (ass.tokenId) await this.tokens.update(ass.tokenId, { ativo: true });
    return this.assinaturas.save(ass);
  }
}

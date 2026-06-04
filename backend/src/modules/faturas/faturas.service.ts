import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { Fatura } from '../../entities/fatura.entity';
import { Assinatura } from '../../entities/assinatura.entity';
import { Consumo } from '../../entities/consumo.entity';

@Injectable()
export class FaturasService {
  constructor(
    @InjectRepository(Fatura, 'buscadados') private faturas: Repository<Fatura>,
    @InjectRepository(Assinatura, 'buscadados') private assinaturas: Repository<Assinatura>,
    @InjectRepository(Consumo, 'buscadados') private consumos: Repository<Consumo>,
  ) {}

  // Gera faturas no 1º de cada mês para assinaturas ativas pagas
  @Cron('0 6 1 * *')
  async gerarFaturasMensais() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth() + 1;
    const mesAnterior = mes === 1 ? 12 : mes - 1;
    const anoAnterior = mes === 1 ? ano - 1 : ano;

    const assinaturasAtivas = await this.assinaturas.find({
      where: { status: 'ativa' },
      relations: ['plano', 'cliente'],
    });

    let geradas = 0;
    for (const ass of assinaturasAtivas) {
      if (ass.plano.precoMensal === 0) continue; // Gratuito não gera fatura

      // Verifica se já existe fatura para este mês
      const jaExiste = await this.faturas.findOne({
        where: { assinaturaId: ass.id, ano: anoAnterior, mes: mesAnterior },
      });
      if (jaExiste) continue;

      // Busca total de requisições do mês anterior
      const consumo = await this.consumos.findOne({
        where: { tokenId: ass.tokenId, ano: anoAnterior, mes: mesAnterior },
      });

      const vencimento = new Date(ano, mes - 1, 10); // vence dia 10
      await this.faturas.save(this.faturas.create({
        assinaturaId: ass.id,
        ano: anoAnterior,
        mes: mesAnterior,
        valor: Number(ass.plano.precoMensal),
        status: 'pendente',
        dataVencimento: vencimento.toISOString().split('T')[0],
        totalRequisicoes: consumo?.quantidade ?? 0,
      }));
      geradas++;
    }
    return { geradas };
  }

  findByCliente(clienteId: string) {
    return this.faturas.find({
      where: { assinatura: { clienteId } },
      relations: ['assinatura', 'assinatura.plano'],
      order: { criadoEm: 'DESC' },
    });
  }

  // Admin
  findAll(status?: string, pagina = 1, limite = 50) {
    const where: any = {};
    if (status) where.status = status;
    return this.faturas.findAndCount({
      where,
      order: { criadoEm: 'DESC' },
      skip: (pagina - 1) * limite,
      take: limite,
      relations: ['assinatura', 'assinatura.cliente', 'assinatura.plano'],
    });
  }

  async marcarPaga(id: string, numeronf?: string, urlNf?: string) {
    const fatura = await this.faturas.findOne({ where: { id } });
    if (!fatura) throw new NotFoundException('Fatura não encontrada.');
    fatura.status = 'paga';
    fatura.dataPagamento = new Date().toISOString().split('T')[0];
    if (numeronf) fatura.numeroNf = numeronf;
    if (urlNf) fatura.urlNf = urlNf;
    return this.faturas.save(fatura);
  }

  async gerarManual(assinaturaId: string, ano: number, mes: number) {
    const ass = await this.assinaturas.findOne({ where: { id: assinaturaId }, relations: ['plano'] });
    if (!ass) throw new NotFoundException('Assinatura não encontrada.');
    const vencimento = new Date(ano, mes, 10);
    return this.faturas.save(this.faturas.create({
      assinaturaId,
      ano, mes,
      valor: Number(ass.plano.precoMensal),
      status: 'pendente',
      dataVencimento: vencimento.toISOString().split('T')[0],
    }));
  }
}

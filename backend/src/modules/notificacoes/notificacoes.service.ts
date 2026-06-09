import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Notificacao, NotificacaoTipo } from '../../entities/notificacao.entity';

@Injectable()
export class NotificacoesService {
  constructor(
    @InjectRepository(Notificacao, 'buscadados')
    private readonly repo: Repository<Notificacao>,
  ) {}

  async minhas(clienteId: string): Promise<Notificacao[]> {
    return this.repo.find({
      where: [{ clienteId }, { clienteId: IsNull() }],
      order: { criadoEm: 'DESC' },
      take: 30,
    });
  }

  async contarNaoLidas(clienteId: string): Promise<number> {
    return this.repo.count({
      where: [
        { clienteId, lida: false },
        { clienteId: IsNull(), lida: false },
      ],
    });
  }

  async marcarTodasLidas(clienteId: string): Promise<void> {
    const naoLidas = await this.repo.find({
      where: [{ clienteId, lida: false }, { clienteId: IsNull(), lida: false }],
    });
    if (naoLidas.length === 0) return;
    await this.repo.save(naoLidas.map((n) => ({ ...n, clienteId: n.clienteId ?? clienteId, lida: true })));
  }

  async criar(
    titulo: string,
    mensagem: string,
    tipo: NotificacaoTipo,
    clienteId?: string,
  ): Promise<Notificacao> {
    const n = this.repo.create({ titulo, mensagem, tipo, clienteId: clienteId ?? null });
    return this.repo.save(n);
  }
}

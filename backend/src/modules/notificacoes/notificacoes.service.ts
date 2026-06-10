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

  async minhas(usuarioId: string): Promise<Notificacao[]> {
    return this.repo.find({
      where: [{ usuarioId }, { usuarioId: IsNull() }],
      order: { criadoEm: 'DESC' },
      take: 30,
    });
  }

  async contarNaoLidas(usuarioId: string): Promise<number> {
    return this.repo.count({
      where: [
        { usuarioId, lida: false },
        { usuarioId: IsNull(), lida: false },
      ],
    });
  }

  async marcarTodasLidas(usuarioId: string): Promise<void> {
    const naoLidas = await this.repo.find({
      where: [{ usuarioId, lida: false }, { usuarioId: IsNull(), lida: false }],
    });
    if (naoLidas.length === 0) return;
    await this.repo.save(naoLidas.map((n) => ({ ...n, usuarioId: n.usuarioId ?? usuarioId, lida: true })));
  }

  async criar(
    titulo: string,
    mensagem: string,
    tipo: NotificacaoTipo,
    usuarioId?: string,
  ): Promise<Notificacao> {
    const n = this.repo.create({ titulo, mensagem, tipo, usuarioId: usuarioId ?? null });
    return this.repo.save(n);
  }
}

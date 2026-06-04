import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessLog } from '../../entities/access-log.entity';

@Injectable()
export class AccessLogService {
  constructor(@InjectRepository(AccessLog) private logs: Repository<AccessLog>) {}

  // Extrato por cliente: join com tokens via token_id
  async extratoPorCliente(clienteId: string, pagina = 1, limite = 50) {
    return this.logs.findAndCount({
      where: { clienteId },
      order: { criadoEm: 'DESC' },
      skip: (pagina - 1) * limite,
      take: limite,
    });
  }

  // Admin: todos os logs filtráveis
  async findAll(filtros: { clienteId?: string; tokenPrefixo?: string; endpoint?: string; pagina?: number; limite?: number }) {
    const { clienteId, tokenPrefixo, endpoint, pagina = 1, limite = 100 } = filtros;
    const qb = this.logs.createQueryBuilder('l').orderBy('l.criado_em', 'DESC');

    if (clienteId)    qb.andWhere('l.cliente_id = :clienteId', { clienteId });
    if (tokenPrefixo) qb.andWhere('l.token_prefixo LIKE :tp', { tp: `${tokenPrefixo}%` });
    if (endpoint)     qb.andWhere('l.endpoint LIKE :ep', { ep: `%${endpoint}%` });

    qb.skip((pagina - 1) * limite).take(limite);
    return qb.getManyAndCount();
  }

  // Resumo de consumo por cliente em um período
  async extratoPorClienteResumo(clienteId: string, mes: number, ano: number) {
    return this.logs
      .createQueryBuilder('l')
      .select('l.endpoint', 'endpoint')
      .addSelect('COUNT(*)', 'total')
      .addSelect('AVG(l.tempo_ms)', 'tempo_medio')
      .where('l.cliente_id = :clienteId', { clienteId })
      .andWhere("EXTRACT(MONTH FROM l.criado_em) = :mes AND EXTRACT(YEAR FROM l.criado_em) = :ano", { mes, ano })
      .groupBy('l.endpoint')
      .orderBy('total', 'DESC')
      .getRawMany();
  }
}

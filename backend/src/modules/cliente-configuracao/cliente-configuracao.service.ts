import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClienteConfiguracao } from '../../entities/cliente-configuracao.entity';

export const CHAVE_GOOGLE_MAPS_API_KEY = 'GOOGLE_MAPS_API_KEY';

export interface ConfiguracaoResumo {
  chave: string;
  configurada: boolean;
  valorParcial: string | null;
  atualizadoEm: Date | null;
}

@Injectable()
export class ClienteConfiguracaoService {
  constructor(
    @InjectRepository(ClienteConfiguracao, 'buscadados')
    private readonly repo: Repository<ClienteConfiguracao>,
  ) {}

  async obter(clienteId: string, chave: string): Promise<string | null> {
    const registro = await this.repo.findOne({ where: { clienteId, chave } });
    return registro?.valor ?? null;
  }

  async salvar(clienteId: string, chave: string, valor: string): Promise<void> {
    const existente = await this.repo.findOne({ where: { clienteId, chave } });
    if (existente) {
      existente.valor = valor;
      await this.repo.save(existente);
    } else {
      await this.repo.save(this.repo.create({ clienteId, chave, valor }));
    }
  }

  async remover(clienteId: string, chave: string): Promise<void> {
    await this.repo.delete({ clienteId, chave });
  }

  async listar(clienteId: string): Promise<ConfiguracaoResumo[]> {
    const registros = await this.repo.find({ where: { clienteId } });
    const mapaExistentes = new Map(registros.map((r) => [r.chave, r]));

    // Retorna todas as chaves conhecidas, configuradas ou não
    return CHAVES_CONHECIDAS.map((chave) => {
      const reg = mapaExistentes.get(chave);
      return {
        chave,
        configurada: !!reg,
        valorParcial: reg ? this.mascarar(reg.valor) : null,
        atualizadoEm: reg?.atualizadoEm ?? null,
      };
    });
  }

  private mascarar(valor: string): string {
    if (valor.length <= 8) return '****';
    return `${valor.slice(0, 4)}...${valor.slice(-4)}`;
  }
}

// Catálogo de chaves suportadas
export const CHAVES_CONHECIDAS: string[] = [CHAVE_GOOGLE_MAPS_API_KEY];

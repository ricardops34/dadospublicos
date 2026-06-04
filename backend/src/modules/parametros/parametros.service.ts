import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parametro } from '../../entities/parametro.entity';

@Injectable()
export class ParametrosService {
  constructor(
    @InjectRepository(Parametro)
    private readonly repo: Repository<Parametro>,
  ) {}

  async findAll(): Promise<Parametro[]> {
    return this.repo.find({ order: { chave: 'ASC' } });
  }

  async findOne(chave: string): Promise<Parametro> {
    return this.repo.findOne({ where: { chave } });
  }

  async getValor(chave: string, valorPadrao: string = ''): Promise<string> {
    const param = await this.findOne(chave);
    return param?.valor ?? valorPadrao;
  }

  async createOrUpdate(chave: string, valor: string, descricao: string = ''): Promise<Parametro> {
    let param = await this.findOne(chave);
    if (!param) {
      param = this.repo.create({ chave, valor, descricao });
    } else {
      param.valor = valor;
      if (descricao) param.descricao = descricao;
    }
    return this.repo.save(param);
  }

  async remove(chave: string): Promise<void> {
    await this.repo.delete(chave);
  }
}

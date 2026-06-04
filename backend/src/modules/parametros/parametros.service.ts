import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parametro } from '../../entities/parametro.entity';

@Injectable()
export class ParametrosService implements OnModuleInit {
  constructor(
    @InjectRepository(Parametro)
    private readonly repo: Repository<Parametro>,
  ) {}

  async onModuleInit() {
    const defaultParams = [
      { chave: 'INTER_CLIENT_ID', valor: '', descricao: 'Client ID da API Banco Inter' },
      { chave: 'INTER_CLIENT_SECRET', valor: '', descricao: 'Client Secret da API Banco Inter' },
      { chave: 'INTER_CERT_PATH', valor: './certs/inter.crt', descricao: 'Caminho do Certificado PIX (.crt)' },
      { chave: 'INTER_KEY_PATH', valor: './certs/inter.key', descricao: 'Caminho da Chave PIX (.key)' },
      { chave: 'PIX_CHAVE', valor: '', descricao: 'Chave PIX da empresa para recebimento' },
      { chave: 'REDIS_HOST', valor: 'localhost', descricao: 'Host do servidor Redis (Rate Limiter)' },
      { chave: 'REDIS_PORT', valor: '6379', descricao: 'Porta do servidor Redis (Rate Limiter)' }
    ];

    for (const p of defaultParams) {
      const existe = await this.findOne(p.chave);
      if (!existe) {
        await this.repo.save(this.repo.create(p));
      }
    }
  }

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

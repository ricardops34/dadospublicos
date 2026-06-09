import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parametro } from '../../entities/parametro.entity';

@Injectable()
export class ParametrosService implements OnModuleInit {
  constructor(
    @InjectRepository(Parametro, 'buscadados')
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
      { chave: 'REDIS_PORT', valor: '6379', descricao: 'Porta do servidor Redis (Rate Limiter)' },
      { chave: 'SMTP_HOST',   valor: 'smtp.umbler.com',       descricao: 'Servidor SMTP' },
      { chave: 'SMTP_PORT',   valor: '587',                    descricao: 'Porta SMTP' },
      { chave: 'SMTP_USER',   valor: 'ricardo@bjsoft.com.br',  descricao: 'Usuário SMTP (remetente)' },
      { chave: 'SMTP_PASS',   valor: 'Rica@1245',             descricao: 'Senha SMTP' },
      { chave: 'SMTP_SECURE', valor: 'false',                  descricao: 'TLS direto (false = STARTTLS na porta 587)' },
      { chave: 'APP_URL',              valor: 'https://app.bjsoft.com.br', descricao: 'URL base da aplicação (usada nos e-mails)' },
      { chave: 'DIAS_RETENCAO_CONTA', valor: '30',                        descricao: 'Dias de retenção após solicitação de exclusão de conta (LGPD)' },
      { chave: 'REGISTROS_HABILITADOS', valor: 'false',                   descricao: 'Habilita ou desabilita novos cadastros pela Landing Page (true/false)' },
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

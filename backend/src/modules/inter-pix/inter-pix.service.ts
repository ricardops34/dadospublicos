import { Injectable, Logger } from '@nestjs/common';
import * as https from 'https';
import * as fs from 'fs';
import axios from 'axios';
import { ParametrosService } from '../parametros/parametros.service';

@Injectable()
export class InterPixService {
  private readonly logger = new Logger(InterPixService.name);
  private readonly baseUrl = 'https://cdpj.partners.bancointer.com.br';

  constructor(private params: ParametrosService) {}

  /**
   * Obtém o agente HTTPS configurado com os certificados mTLS
   */
  private async getHttpsAgent() {
    const certPath = await this.params.getValor('INTER_CERT_PATH', '');
    const keyPath = await this.params.getValor('INTER_KEY_PATH', '');

    if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
      throw new Error(`Certificado ou Chave PIX não encontrados nos caminhos: ${certPath}, ${keyPath}`);
    }

    return new https.Agent({
      cert: fs.readFileSync(certPath),
      key: fs.readFileSync(keyPath),
    });
  }

  /**
   * Realiza a autenticação OAuth2
   */
  private async getToken(): Promise<string> {
    const clientId = await this.params.getValor('INTER_CLIENT_ID', '');
    const clientSecret = await this.params.getValor('INTER_CLIENT_SECRET', '');
    const httpsAgent = await this.getHttpsAgent();

    const data = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
      scope: 'cob.write cob.read pix.write pix.read webhook.read webhook.write',
    });

    try {
      const response = await axios.post(`${this.baseUrl}/oauth/v2/token`, data.toString(), {
        httpsAgent,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      return response.data.access_token;
    } catch (error) {
      this.logger.error('Erro ao obter token do Banco Inter', error?.response?.data || error);
      throw new Error('Falha na autenticação PIX');
    }
  }

  /**
   * Cria uma cobrança imediata (Cob)
   */
  async criarCobranca(faturaId: string, valor: number, cpfCnpj: string, nome: string) {
    const token = await this.getToken();
    const httpsAgent = await this.getHttpsAgent();
    const chavePix = await this.params.getValor('PIX_CHAVE', '');

    const payload = {
      calendario: { expiracao: 86400 }, // 1 dia de expiração
      devedor: {
        cpf: cpfCnpj.length <= 14 ? cpfCnpj.replace(/[^0-9]/g, '') : undefined,
        cnpj: cpfCnpj.length > 14 ? cpfCnpj.replace(/[^0-9]/g, '') : undefined,
        nome: nome,
      },
      valor: { original: valor.toFixed(2) },
      chave: chavePix,
      solicitacaoPagador: `Fatura BuscaDados #${faturaId}`,
      infoAdicionais: [{ nome: 'FaturaID', valor: faturaId }]
    };

    try {
      const response = await axios.post(`${this.baseUrl}/pix/v2/cob`, payload, {
        httpsAgent,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      return {
        txid: response.data.txid,
        copiaECola: response.data.pixCopiaECola,
      };
    } catch (error) {
      this.logger.error('Erro ao criar cobrança PIX', error?.response?.data || error);
      throw new Error('Falha ao gerar o PIX Copia e Cola');
    }
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ParametrosService } from '../parametros/parametros.service';

export interface SuporteConfig {
  whatsappNumero: string;
  atendente: string;
  mensagemBoasVindas: string;
  emailDestino: string;
}

export interface ContatoDto {
  nome: string;
  email: string;
  mensagem: string;
}

@Injectable()
export class SuporteService {
  constructor(
    private config: ConfigService,
    private paramSvc: ParametrosService
  ) {}

  async getConfig(): Promise<SuporteConfig> {
    return {
      whatsappNumero:     await this.paramSvc.getValor('SUPORTE_WHATSAPP', this.config.get('SUPORTE_WHATSAPP', '')),
      atendente:          await this.paramSvc.getValor('SUPORTE_ATENDENTE', this.config.get('SUPORTE_ATENDENTE', 'Suporte')),
      mensagemBoasVindas: await this.paramSvc.getValor('SUPORTE_MSG', this.config.get('SUPORTE_MSG', 'Olá! Como posso te ajudar hoje? 👋')),
      emailDestino:       await this.paramSvc.getValor('SUPORTE_EMAIL', this.config.get('SUPORTE_EMAIL', '')),
    };
  }

  async enviarContato(dto: ContatoDto) {
    const emailDestino = await this.paramSvc.getValor('SUPORTE_EMAIL', this.config.get('SUPORTE_EMAIL', ''));
    const smtpHost     = await this.paramSvc.getValor('SMTP_HOST', this.config.get('SMTP_HOST', ''));

    if (!smtpHost || !emailDestino) {
      // SMTP não configurado — apenas loga
      console.log(`[Suporte] Novo contato de ${dto.nome} <${dto.email}>: ${dto.mensagem}`);
      return { enviado: false, mensagem: 'Mensagem recebida. SMTP não configurado.' };
    }

    // Usa nodemailer dinamicamente para não exigir dependência em dev
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nodemailer = (() => { try { return require('nodemailer'); } catch { return null; } })();
    if (!nodemailer) return { enviado: false, mensagem: 'Nodemailer não instalado.' };

    const smtpPort = await this.paramSvc.getValor('SMTP_PORT', this.config.get('SMTP_PORT', '587'));
    const smtpSecure = await this.paramSvc.getValor('SMTP_SECURE', this.config.get('SMTP_SECURE', 'false'));
    const smtpUser = await this.paramSvc.getValor('SMTP_USER', this.config.get('SMTP_USER', ''));
    const smtpPass = await this.paramSvc.getValor('SMTP_PASS', this.config.get('SMTP_PASS', ''));

    const transporter = nodemailer.createTransport({
      host:   smtpHost,
      port:   +smtpPort,
      secure: smtpSecure === 'true',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from:    `"BuscaDados" <${smtpUser}>`,
      to:      emailDestino,
      subject: `[Suporte BuscaDados] Contato de ${dto.nome}`,
      html: `
        <h2>Novo contato via chat da landing page</h2>
        <p><strong>Nome:</strong> ${dto.nome}</p>
        <p><strong>E-mail:</strong> ${dto.email}</p>
        <p><strong>Mensagem:</strong><br>${dto.mensagem.replace(/\n/g, '<br>')}</p>
      `,
    });

    return { enviado: true, mensagem: 'Mensagem enviada com sucesso.' };
  }
}

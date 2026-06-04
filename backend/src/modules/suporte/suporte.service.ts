import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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
  constructor(private config: ConfigService) {}

  getConfig(): SuporteConfig {
    return {
      whatsappNumero:     this.config.get('SUPORTE_WHATSAPP', ''),
      atendente:          this.config.get('SUPORTE_ATENDENTE', 'Suporte'),
      mensagemBoasVindas: this.config.get('SUPORTE_MSG', 'Olá! Como posso te ajudar hoje? 👋'),
      emailDestino:       this.config.get('SUPORTE_EMAIL', ''),
    };
  }

  async enviarContato(dto: ContatoDto) {
    const emailDestino = this.config.get('SUPORTE_EMAIL', '');
    const smtpHost     = this.config.get('SMTP_HOST', '');

    if (!smtpHost || !emailDestino) {
      // SMTP não configurado — apenas loga
      console.log(`[Suporte] Novo contato de ${dto.nome} <${dto.email}>: ${dto.mensagem}`);
      return { enviado: false, mensagem: 'Mensagem recebida. SMTP não configurado.' };
    }

    // Usa nodemailer dinamicamente para não exigir dependência em dev
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nodemailer = (() => { try { return require('nodemailer'); } catch { return null; } })();
    if (!nodemailer) return { enviado: false, mensagem: 'Nodemailer não instalado.' };

    const transporter = nodemailer.createTransport({
      host:   smtpHost,
      port:   +this.config.get('SMTP_PORT', '587'),
      secure: this.config.get('SMTP_SECURE', 'false') === 'true',
      auth: {
        user: this.config.get('SMTP_USER', ''),
        pass: this.config.get('SMTP_PASS', ''),
      },
    });

    await transporter.sendMail({
      from:    `"BuscaDados" <${this.config.get('SMTP_USER', '')}>`,
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

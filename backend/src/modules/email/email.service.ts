import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ParametrosService } from '../parametros/parametros.service';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly params: ParametrosService) {}

  // ─── Envio base (genérico) ────────────────────────────────────────────────

  async enviar(to: string, subject: string, html: string, text?: string): Promise<void> {
    const host   = await this.params.getValor('SMTP_HOST', '');
    const port   = parseInt(await this.params.getValor('SMTP_PORT', '587'), 10);
    const user   = await this.params.getValor('SMTP_USER', '');
    const pass   = await this.params.getValor('SMTP_PASS', '');
    const secure = (await this.params.getValor('SMTP_SECURE', 'false')) === 'true';

    if (!host || !user || !pass) {
      this.logger.warn(`SMTP não configurado — e-mail para ${to} ignorado.`);
      return;
    }

    const transporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass } });

    await transporter.sendMail({
      from: `"BuscaDados" <${user}>`,
      to,
      subject,
      html,
      ...(text ? { text } : {}),
    });

    this.logger.log(`E-mail enviado para ${to}: ${subject}`);
  }

  // ─── Templates tipados ────────────────────────────────────────────────────

  async enviarCodigoVerificacao(to: string, nome: string, codigo: string): Promise<void> {
    const safe = (s: string) => s.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    await this.enviar(
      to,
      `${codigo} - seu código de verificação no BuscaDados`,
      this.wrapLayout(`
        <h2 style="font-size:1.1rem;font-weight:700;color:#111827;margin:0 0 8px;">Olá, ${safe(nome)}!</h2>
        <p style="color:#6b7280;font-size:0.9rem;margin:0 0 28px;line-height:1.6;">
          Use o código abaixo para verificar seu e-mail e ativar sua conta.
        </p>
        <div style="text-align:center;margin:0 0 28px;">
          <div style="display:inline-block;background:#f5f3ff;border:2px solid #7c3aed;border-radius:12px;padding:18px 40px;">
            <span style="font-size:2.4rem;font-weight:800;letter-spacing:10px;color:#5b21b6;">${safe(codigo)}</span>
          </div>
        </div>
        <p style="color:#9ca3af;font-size:0.8rem;text-align:center;margin:0 0 24px;">
          Este código expira em <strong>15 minutos</strong>. Não compartilhe com ninguém.
        </p>
      `),
    );
  }

  async enviarRedefinicaoSenha(to: string, nome: string, link: string): Promise<void> {
    const safe = (s: string) => s.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    await this.enviar(
      to,
      'Redefinição de senha — BuscaDados',
      this.wrapLayout(`
        <h2 style="font-size:1.1rem;font-weight:700;color:#111827;margin:0 0 8px;">Olá, ${safe(nome)}!</h2>
        <p style="color:#6b7280;font-size:0.9rem;margin:0 0 24px;line-height:1.6;">
          Recebemos uma solicitação para redefinir a senha da sua conta.
          Clique no botão abaixo para criar uma nova senha.
        </p>
        <div style="text-align:center;margin:0 0 24px;">
          <a href="${safe(link)}"
            style="display:inline-block;background:#7c3aed;color:#fff;text-decoration:none;
                   font-weight:700;font-size:0.95rem;padding:14px 32px;border-radius:8px;">
            Redefinir senha
          </a>
        </div>
        <p style="color:#9ca3af;font-size:0.8rem;text-align:center;margin:0 0 24px;">
          O link expira em <strong>1 hora</strong>.
          Se você não solicitou a redefinição, ignore este e-mail.
        </p>
      `),
    );
  }

  async enviarBoasVindas(to: string, nome: string, appUrl: string): Promise<void> {
    const safe = (s: string) => s.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    await this.enviar(
      to,
      `Bem-vindo ao BuscaDados, ${nome}!`,
      this.wrapLayout(`
        <h2 style="font-size:1.1rem;font-weight:700;color:#111827;margin:0 0 8px;">Bem-vindo, ${safe(nome)}!</h2>
        <p style="color:#6b7280;font-size:0.9rem;margin:0 0 24px;line-height:1.6;">
          Sua conta foi ativada com sucesso. Agora você tem acesso à API de dados públicos da Receita Federal.
        </p>
        <div style="text-align:center;margin:0 0 24px;">
          <a href="${safe(appUrl)}/portal/dashboard"
            style="display:inline-block;background:#7c3aed;color:#fff;text-decoration:none;
                   font-weight:700;font-size:0.95rem;padding:14px 32px;border-radius:8px;">
            Acessar meu painel
          </a>
        </div>
      `),
    );
  }

  async enviarConfirmacaoPagamento(to: string, nome: string, plano: string, valor: number, vencimento: string): Promise<void> {
    const safe = (s: string) => s.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const valorFmt = `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    await this.enviar(
      to,
      'Pagamento confirmado — BuscaDados',
      this.wrapLayout(`
        <h2 style="font-size:1.1rem;font-weight:700;color:#111827;margin:0 0 8px;">Pagamento confirmado!</h2>
        <p style="color:#6b7280;font-size:0.9rem;margin:0 0 20px;line-height:1.6;">
          Olá, ${safe(nome)}. Seu pagamento foi processado com sucesso.
        </p>
        <table role="presentation" style="width:100%;border-collapse:collapse;margin:0 0 24px;">
          <tr>
            <td style="padding:10px 12px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:700;width:140px;">Plano</td>
            <td style="padding:10px 12px;border:1px solid #e5e7eb;">${safe(plano)}</td>
          </tr>
          <tr>
            <td style="padding:10px 12px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:700;">Valor</td>
            <td style="padding:10px 12px;border:1px solid #e5e7eb;">${valorFmt}</td>
          </tr>
          <tr>
            <td style="padding:10px 12px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:700;">Próx. vencimento</td>
            <td style="padding:10px 12px;border:1px solid #e5e7eb;">${safe(vencimento)}</td>
          </tr>
        </table>
      `),
    );
  }

  async enviarDiagnostico(to: string, smtpHost: string, smtpPort: number, appUrl: string): Promise<void> {
    const safe = (s: string) => s.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const sentAt = new Date().toLocaleString('pt-BR');
    await this.enviar(
      to,
      'Diagnóstico de configuração de e-mail — BuscaDados',
      this.wrapLayout(`
        <p style="color:#374151;font-size:0.9rem;margin:0 0 16px;line-height:1.6;">
          Esta mensagem confirma que a aplicação conseguiu enviar e-mail com a configuração SMTP atual.
        </p>
        <table role="presentation" style="width:100%;border-collapse:collapse;margin:0 0 24px;">
          <tr>
            <td style="padding:10px 12px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:700;width:160px;">Destinatário</td>
            <td style="padding:10px 12px;border:1px solid #e5e7eb;">${safe(to)}</td>
          </tr>
          <tr>
            <td style="padding:10px 12px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:700;">Servidor SMTP</td>
            <td style="padding:10px 12px;border:1px solid #e5e7eb;">${safe(smtpHost)}:${smtpPort}</td>
          </tr>
          <tr>
            <td style="padding:10px 12px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:700;">Aplicação</td>
            <td style="padding:10px 12px;border:1px solid #e5e7eb;"><a href="${safe(appUrl)}" style="color:#7c3aed;">${safe(appUrl)}</a></td>
          </tr>
          <tr>
            <td style="padding:10px 12px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:700;">Gerado em</td>
            <td style="padding:10px 12px;border:1px solid #e5e7eb;">${safe(sentAt)}</td>
          </tr>
        </table>
        <p style="color:#9ca3af;font-size:0.8rem;margin:0;">Este e-mail não exige nenhuma ação.</p>
      `),
      `Diagnóstico SMTP - BuscaDados\nDestinatário: ${to}\nSMTP: ${smtpHost}:${smtpPort}\nGerado em: ${sentAt}`,
    );
  }

  // ─── Layout base ──────────────────────────────────────────────────────────

  private wrapLayout(content: string): string {
    return `
      <div style="margin:0;padding:0;background:#f4f7fb;">
        <div style="max-width:640px;margin:0 auto;padding:32px 20px;">
          <div style="background:#ffffff;border:1px solid #dbe4f0;border-radius:16px;overflow:hidden;">
            <div style="padding:20px 28px;background:#4c1d95;color:#ffffff;">
              <div style="font:700 20px Arial,sans-serif;">
                Busca<span style="color:#c4b5fd;">Dados</span>
              </div>
            </div>
            <div style="padding:28px;font:400 15px/1.6 Arial,sans-serif;color:#1f2937;">
              ${content}
            </div>
            <div style="padding:16px 28px;border-top:1px solid #e5e7eb;background:#f8fafc;
                        font:400 12px Arial,sans-serif;color:#9ca3af;text-align:center;">
              Enviado automaticamente pelo BuscaDados · Não responda este e-mail.
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import * as nodemailer from 'nodemailer';
import { JwtPortalGuard } from '../portal/jwt-portal.guard';
import { Perfil } from '../portal/perfil.decorator';
import { ParametrosService } from './parametros.service';

@ApiTags('Config E-mail (Admin)')
@ApiSecurity('bearer')
@UseGuards(JwtPortalGuard)
@Perfil('admin')
@Controller('admin/config-email')
export class ConfigEmailController {
  constructor(private readonly params: ParametrosService) {}

  @Get()
  @ApiOperation({ summary: 'Retorna configuração SMTP atual' })
  async get() {
    return {
      smtpHost:    await this.params.getValor('SMTP_HOST', ''),
      smtpPort:    await this.params.getValor('SMTP_PORT', '587'),
      smtpUser:    await this.params.getValor('SMTP_USER', ''),
      smtpPass:    await this.params.getValor('SMTP_PASS', ''),
      smtpSecure:  await this.params.getValor('SMTP_SECURE', 'false'),
      appUrl:      await this.params.getValor('APP_URL', 'http://localhost:4200'),
    };
  }

  @Post()
  @ApiOperation({ summary: 'Salva configuração SMTP' })
  async salvar(@Body() dto: {
    smtpHost: string; smtpPort: string; smtpUser: string;
    smtpPass: string; smtpSecure: string; appUrl: string;
  }) {
    await this.params.createOrUpdate('SMTP_HOST',   dto.smtpHost,   'Servidor SMTP');
    await this.params.createOrUpdate('SMTP_PORT',   dto.smtpPort,   'Porta SMTP');
    await this.params.createOrUpdate('SMTP_USER',   dto.smtpUser,   'Usuário SMTP (remetente)');
    await this.params.createOrUpdate('SMTP_SECURE', dto.smtpSecure, 'TLS direto (false = STARTTLS na porta 587)');
    await this.params.createOrUpdate('APP_URL',     dto.appUrl,     'URL base da aplicação (usada nos e-mails)');
    if (dto.smtpPass && dto.smtpPass !== '********') {
      await this.params.createOrUpdate('SMTP_PASS', dto.smtpPass, 'Senha SMTP');
    }
    return { mensagem: 'Configuração salva com sucesso.' };
  }

  @Post('teste')
  @ApiOperation({ summary: 'Envia e-mail de teste com a configuração atual' })
  async testar(@Body('destinatario') destinatario: string) {
    const host   = await this.params.getValor('SMTP_HOST', '');
    const port   = parseInt(await this.params.getValor('SMTP_PORT', '587'), 10);
    const user   = await this.params.getValor('SMTP_USER', '');
    const pass   = await this.params.getValor('SMTP_PASS', '');
    const secure = (await this.params.getValor('SMTP_SECURE', 'false')) === 'true';

    if (!host || !user || !pass) {
      throw new Error('Configure SMTP_HOST, SMTP_USER e SMTP_PASS antes de testar.');
    }

    const transporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass } });
    await transporter.sendMail({
      from: `"BuscaDados" <${user}>`,
      to: destinatario || user,
      subject: 'Teste de envio — BuscaDados',
      html: `
        <div style="font-family:Arial,sans-serif;padding:24px;max-width:500px;">
          <h2 style="color:#7c3aed;">✅ Configuração de e-mail funcionando!</h2>
          <p>Este é um e-mail de teste enviado pelo sistema BuscaDados.</p>
          <p style="color:#6b7280;font-size:13px;">SMTP: ${host}:${port}</p>
        </div>
      `,
    });
    return { mensagem: `E-mail de teste enviado para ${destinatario || user}.` };
  }
}

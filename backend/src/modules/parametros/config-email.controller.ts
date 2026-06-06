import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../admin/admin.guard';
import { ParametrosService } from './parametros.service';
import { EmailService } from '../email/email.service';

@ApiTags('Config E-mail (Admin)')
@ApiSecurity('bearer')
@UseGuards(AdminGuard)
@Controller('admin/config-email')
export class ConfigEmailController {
  constructor(
    private readonly params: ParametrosService,
    private readonly email: EmailService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Retorna configuracao SMTP atual' })
  async get() {
    return {
      smtpHost: await this.params.getValor('SMTP_HOST', ''),
      smtpPort: await this.params.getValor('SMTP_PORT', '587'),
      smtpUser: await this.params.getValor('SMTP_USER', ''),
      smtpPass: await this.params.getValor('SMTP_PASS', ''),
      smtpSecure: await this.params.getValor('SMTP_SECURE', 'false'),
      appUrl: await this.params.getValor('APP_URL', 'http://localhost:4200'),
    };
  }

  @Post()
  @ApiOperation({ summary: 'Salva configuracao SMTP' })
  async salvar(@Body() dto: {
    smtpHost: string; smtpPort: string; smtpUser: string;
    smtpPass: string; smtpSecure: string; appUrl: string;
  }) {
    await this.params.createOrUpdate('SMTP_HOST', dto.smtpHost, 'Servidor SMTP');
    await this.params.createOrUpdate('SMTP_PORT', dto.smtpPort, 'Porta SMTP');
    await this.params.createOrUpdate('SMTP_USER', dto.smtpUser, 'Usuario SMTP (remetente)');
    await this.params.createOrUpdate('SMTP_SECURE', dto.smtpSecure, 'TLS direto (false = STARTTLS na porta 587)');
    await this.params.createOrUpdate('APP_URL', dto.appUrl, 'URL base da aplicacao (usada nos e-mails)');
    if (dto.smtpPass && dto.smtpPass !== '********') {
      await this.params.createOrUpdate('SMTP_PASS', dto.smtpPass, 'Senha SMTP');
    }
    return { mensagem: 'Configuracao salva com sucesso.' };
  }

  @Post('teste')
  @ApiOperation({ summary: 'Envia e-mail de diagnostico com a configuracao atual' })
  async testar(@Body('destinatario') destinatario: string) {
    const host   = await this.params.getValor('SMTP_HOST', '');
    const port   = parseInt(await this.params.getValor('SMTP_PORT', '587'), 10);
    const user   = await this.params.getValor('SMTP_USER', '');
    const pass   = await this.params.getValor('SMTP_PASS', '');
    const appUrl = await this.params.getValor('APP_URL', 'http://localhost:4200');

    if (!host || !user || !pass) {
      throw new Error('Configure SMTP_HOST, SMTP_USER e SMTP_PASS antes de testar.');
    }

    const destino = destinatario || user;
    await this.email.enviarDiagnostico(destino, host, port, appUrl);

    return { mensagem: `E-mail de diagnóstico enviado para ${destino}.` };
  }
}

import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import * as nodemailer from 'nodemailer';
import { ConfigEmailController } from '../src/modules/parametros/config-email.controller';
import { EmailService } from '../src/modules/email/email.service';

test('testar envia mensagem com assunto descritivo, text e html', async () => {
  const originalCreateTransport = nodemailer.createTransport;
  let capturedMessage: Record<string, any> | undefined;

  (nodemailer as any).createTransport = () => ({
    sendMail: async (message: Record<string, any>) => {
      capturedMessage = message;
      return { messageId: 'test-id' };
    },
  });

  const paramsMock = {
    getValor: async (chave: string, valorPadrao: string) => {
      const valores: Record<string, string> = {
        SMTP_HOST: 'smtp.umbler.com',
        SMTP_PORT: '587',
        SMTP_USER: 'ricardo@bjsoft.com.br',
        SMTP_PASS: 'segredo',
        SMTP_SECURE: 'false',
        APP_URL: 'https://app.bjsoft.com.br',
      };
      return valores[chave] ?? valorPadrao;
    },
  } as any;

  const emailService = new EmailService(paramsMock);
  const controller = new ConfigEmailController(paramsMock, emailService);

  try {
    const response = await controller.testar('ricardops34@hotmail.com');

    assert.equal(response.mensagem, 'E-mail de diagnóstico enviado para ricardops34@hotmail.com.');
    assert.ok(capturedMessage);
    assert.equal(capturedMessage?.to, 'ricardops34@hotmail.com');
    assert.match(capturedMessage?.from ?? '', /ricardo@bjsoft\.com\.br/);
    assert.match(capturedMessage?.subject ?? '', /BuscaDados/);
    assert.match(capturedMessage?.text ?? '', /smtp\.umbler\.com:587/);
    assert.match(capturedMessage?.html ?? '', /https:\/\/app\.bjsoft\.com\.br/);
  } finally {
    (nodemailer as any).createTransport = originalCreateTransport;
  }
});

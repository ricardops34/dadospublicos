import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import * as nodemailer from 'nodemailer';
import { ConfigEmailController } from '../src/modules/parametros/config-email.controller';

test('testar envia mensagem com assunto descritivo, text e html', async () => {
  const originalCreateTransport = nodemailer.createTransport;
  let capturedMessage: Record<string, any> | undefined;

  (nodemailer as any).createTransport = () => ({
    sendMail: async (message: Record<string, any>) => {
      capturedMessage = message;
      return { messageId: 'test-id' };
    },
  });

  const controller = new ConfigEmailController({
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
  } as any);

  try {
    const response = await controller.testar('ricardops34@hotmail.com');

    assert.equal(response.mensagem, 'E-mail de teste enviado para ricardops34@hotmail.com.');
    assert.ok(capturedMessage);
    assert.equal(capturedMessage?.to, 'ricardops34@hotmail.com');
    assert.equal(capturedMessage?.replyTo, 'ricardo@bjsoft.com.br');
    assert.equal(capturedMessage?.subject, 'Diagnostico de configuracao de e-mail - BuscaDados');
    assert.match(capturedMessage?.text ?? '', /Este e um e-mail de diagnostico do BuscaDados/);
    assert.match(capturedMessage?.text ?? '', /Servidor SMTP: smtp\.umbler\.com:587/);
    assert.match(capturedMessage?.html ?? '', /endpoint oficial de teste do BuscaDados/);
    assert.match(capturedMessage?.html ?? '', /https:\/\/app\.bjsoft\.com\.br/);
  } finally {
    (nodemailer as any).createTransport = originalCreateTransport;
  }
});

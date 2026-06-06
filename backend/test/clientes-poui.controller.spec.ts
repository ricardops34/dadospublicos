import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import { ClientesPoUiController } from '../src/modules/clientes/clientes-poui.controller';

test('findAll retorna status numérico e plano ativo para a listagem PO-UI', async () => {
  const controller = new ClientesPoUiController(
    {
      findAll: async () => [[{
        id: '1',
        ativo: true,
        emailVerificado: true,
        assinaturas: [{ status: 'ativa', plano: { nome: 'Premium' } }],
      }], 1],
      findOne: async () => ({}),
      signup: async () => ({ id: '1' }),
      atualizar: async () => ({}),
      excluirConta: async () => ({}),
      sanitizeAdminResponse: (cliente: any) => cliente,
    } as any,
    {} as any,
    {} as any,
  );

  const response = await controller.findAll('1', '10', {});

  assert.equal(response.items[0].ativoStatus, 1);
  assert.equal(response.items[0].emailVerificado, 1);
  assert.equal(response.items[0].plano, 'Premium');
});

test('findOne não expõe credenciais nem tokens sensíveis no detalhe admin', async () => {
  const controller = new ClientesPoUiController(
    {
      findAll: async () => [[], 0],
      findOne: async () => ({
        id: '1',
        nome: 'Cliente',
        senhaHash: 'hash',
        tokenVerificacao: 'token',
        resetToken: 'reset',
        resetTokenExpira: new Date('2026-01-01T00:00:00.000Z'),
      }),
      signup: async () => ({ id: '1' }),
      atualizar: async () => ({}),
      excluirConta: async () => ({}),
      sanitizeAdminResponse: (cliente: any) => {
        const { senhaHash, tokenVerificacao, resetToken, resetTokenExpira, ...safe } = cliente;
        return safe;
      },
    } as any,
    {} as any,
    {} as any,
  );

  const response = await controller.findOne('1');

  assert.equal('senhaHash' in response, false);
  assert.equal('tokenVerificacao' in response, false);
  assert.equal('resetToken' in response, false);
  assert.equal('resetTokenExpira' in response, false);
});

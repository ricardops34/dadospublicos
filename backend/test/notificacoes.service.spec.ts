import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import { NotificacoesService } from '../src/modules/notificacoes/notificacoes.service';

function createService(overrides?: {
  find?: (options?: any) => Promise<any[]>;
  count?: (options?: any) => Promise<number>;
  save?: (value: any) => Promise<any>;
  create?: (value: any) => any;
}) {
  const calls = {
    find: [] as any[],
    count: [] as any[],
    save: [] as any[],
    create: [] as any[],
  };

  const repo = {
    find: async (options?: any) => {
      calls.find.push(options);
      return overrides?.find ? overrides.find(options) : [];
    },
    count: async (options?: any) => {
      calls.count.push(options);
      return overrides?.count ? overrides.count(options) : 0;
    },
    save: async (value: any) => {
      calls.save.push(value);
      return overrides?.save ? overrides.save(value) : value;
    },
    create: (value: any) => {
      calls.create.push(value);
      return overrides?.create ? overrides.create(value) : value;
    },
  };

  return {
    service: new NotificacoesService(repo as any),
    calls,
  };
}

test('minhas busca notificacoes pessoais e broadcast em ordem decrescente com limite de 30', async () => {
  const notificacoes = [
    { id: 'n1', titulo: 'Pessoal', usuarioId: 'usr-1' },
    { id: 'n2', titulo: 'Broadcast', usuarioId: null },
  ];

  const { service, calls } = createService({
    find: async () => notificacoes,
  });

  const result = await service.minhas('usr-1');

  assert.deepEqual(result, notificacoes);
  assert.equal(calls.find.length, 1);
  assert.equal(calls.find[0].where[0].usuarioId, 'usr-1');
  assert.equal(calls.find[0].order.criadoEm, 'DESC');
  assert.equal(calls.find[0].take, 30);
});

test('contarNaoLidas soma notificacoes pessoais e broadcast ainda nao lidas', async () => {
  const { service, calls } = createService({
    count: async () => 4,
  });

  const total = await service.contarNaoLidas('usr-1');

  assert.equal(total, 4);
  assert.equal(calls.count.length, 1);
  assert.equal(calls.count[0].where[0].usuarioId, 'usr-1');
  assert.equal(calls.count[0].where[0].lida, false);
  assert.equal(calls.count[0].where[1].lida, false);
});

test('marcarTodasLidas nao persiste nada quando nao houver notificacoes pendentes', async () => {
  const { service, calls } = createService({
    find: async () => [],
  });

  await service.marcarTodasLidas('usr-1');

  assert.equal(calls.find.length, 1);
  assert.equal(calls.save.length, 0);
});

test('marcarTodasLidas persiste notificacoes pessoais marcadas como lidas', async () => {
  const pendentes = [
    { id: 'n1', usuarioId: 'usr-1', lida: false, titulo: 'Conta' },
    { id: 'n2', usuarioId: 'usr-1', lida: false, titulo: 'Financeiro' },
  ];

  const { service, calls } = createService({
    find: async () => pendentes,
  });

  await service.marcarTodasLidas('usr-1');

  assert.equal(calls.save.length, 1);
  assert.deepEqual(calls.save[0], [
    { id: 'n1', usuarioId: 'usr-1', lida: true, titulo: 'Conta' },
    { id: 'n2', usuarioId: 'usr-1', lida: true, titulo: 'Financeiro' },
  ]);
});

test('criar salva notificacao broadcast quando usuarioId nao for informado', async () => {
  const { service, calls } = createService({
    save: async (value) => ({ id: 'n1', ...value }),
  });

  const result = await service.criar('Aviso geral', 'Mensagem do sistema', 'sistema');

  assert.equal(calls.create.length, 1);
  assert.deepEqual(calls.create[0], {
    titulo: 'Aviso geral',
    mensagem: 'Mensagem do sistema',
    tipo: 'sistema',
    usuarioId: null,
  });
  assert.equal(result.id, 'n1');
  assert.equal(result.usuarioId, null);
});

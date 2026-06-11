import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import { ForbiddenException } from '@nestjs/common';
import { RecursoGuard } from '../src/modules/portal/recurso.guard';

function makeExecutionContext(usuario: any, recursos: string[] = ['painel-360']) {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ usuario }),
    }),
    getHandler: () => 'handler',
    getClass: () => 'class',
    __recursos: recursos,
  } as any;
}

test('RecursoGuard usa clienteId do JWT para buscar assinatura ativa', async () => {
  let whereUsed: any = null;

  const guard = Object.create(RecursoGuard.prototype) as RecursoGuard & {
    reflector: { getAllAndOverride: (_key: string, _targets: any[]) => string[] };
    assinaturas: { findOne: (args: any) => Promise<any> };
  };

  guard.reflector = {
    getAllAndOverride: (_key: string, _targets: any[]) => ['painel-360'],
  };

  guard.assinaturas = {
    findOne: async (args: any) => {
      whereUsed = args.where;
      return {
        plano: {
          recursos: [{ recurso: { ativo: true, slug: 'painel-360' } }],
        },
      };
    },
  };

  const allowed = await guard.canActivate(
    makeExecutionContext({ sub: 'usuario-1', clienteId: 'cliente-1', perfil: 'cliente' }),
  );

  assert.equal(allowed, true);
  assert.deepEqual(whereUsed, { clienteId: 'cliente-1', status: 'ativa' });
});

test('RecursoGuard usa contaId como fallback legado quando clienteId não existe', async () => {
  let whereUsed: any = null;

  const guard = Object.create(RecursoGuard.prototype) as RecursoGuard & {
    reflector: { getAllAndOverride: (_key: string, _targets: any[]) => string[] };
    assinaturas: { findOne: (args: any) => Promise<any> };
  };

  guard.reflector = {
    getAllAndOverride: (_key: string, _targets: any[]) => ['painel-360'],
  };

  guard.assinaturas = {
    findOne: async (args: any) => {
      whereUsed = args.where;
      return {
        plano: {
          recursos: [{ recurso: { ativo: true, slug: 'painel-360' } }],
        },
      };
    },
  };

  const allowed = await guard.canActivate(
    makeExecutionContext({ sub: 'usuario-1', contaId: 'cliente-legado-1', perfil: 'cliente' }),
  );

  assert.equal(allowed, true);
  assert.deepEqual(whereUsed, { clienteId: 'cliente-legado-1', status: 'ativa' });
});

test('RecursoGuard falha para cliente sem clienteId nem contaId', async () => {
  const guard = Object.create(RecursoGuard.prototype) as RecursoGuard & {
    reflector: { getAllAndOverride: (_key: string, _targets: any[]) => string[] };
    assinaturas: { findOne: (_args: any) => Promise<any> };
  };

  guard.reflector = {
    getAllAndOverride: (_key: string, _targets: any[]) => ['painel-360'],
  };

  guard.assinaturas = {
    findOne: async () => null,
  };

  await assert.rejects(
    () => guard.canActivate(makeExecutionContext({ sub: 'usuario-1', perfil: 'cliente' })),
    (error: any) => {
      assert.ok(error instanceof ForbiddenException);
      assert.match(error.message, /cliente vinculado/i);
      return true;
    },
  );
});


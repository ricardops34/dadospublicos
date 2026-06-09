import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import { HttpException } from '@nestjs/common';
import { ApiRateLimitGuard } from '../src/modules/auth/rate-limit.guard';

function createContext(req: any) {
  return {
    switchToHttp: () => ({
      getRequest: () => req,
    }),
  } as any;
}

function makeRequestProps(req: any) {
  return {
    context: createContext(req),
    limit: 0,
    ttl: 0,
    throttler: {} as any,
    blockDuration: 0,
    getTracker: async () => '',
    generateKey: () => '',
  };
}

test('ApiRateLimitGuard limita plano free a 3 consultas de CNPJ por hora', async () => {
  let totalHits = 0;
  let usedKey = '';
  let usedTtl = 0;

  const guard = Object.create(ApiRateLimitGuard.prototype) as ApiRateLimitGuard & {
    storageService: {
      increment: (key: string, ttl: number, limit: number, blockDuration: number, name: string) => Promise<{ totalHits: number }>;
    };
  };

  guard.storageService = {
    increment: async (key: string, ttl: number, _limit: number, _blockDuration: number, _name: string) => {
      usedKey = key;
      usedTtl = ttl;
      totalHits += 1;
      return { totalHits };
    },
  };

  const req = {
    headers: { x_api_token: 'token-free' },
    query: {},
    tokenInfo: { plano: 'free' },
  };

  await guard['handleRequest'](makeRequestProps(req));
  await guard['handleRequest'](makeRequestProps(req));
  await guard['handleRequest'](makeRequestProps(req));

  await assert.rejects(
    () => guard['handleRequest'](makeRequestProps(req)),
    (error: any) => {
      assert.ok(error instanceof HttpException);
      assert.equal(error.getStatus(), 429);
      const response = error.getResponse() as any;
      assert.match(response.detalhes, /3 requisições por hora/i);
      return true;
    },
  );

  assert.equal(usedKey, 'free_cnpj:token-free');
  assert.equal(usedTtl, 3600000);
});

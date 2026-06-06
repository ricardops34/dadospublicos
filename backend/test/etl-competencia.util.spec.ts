import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import { competenciaPadraoRfb } from '../src/modules/etl/etl-competencia.util';

test('usa o mes anterior como competencia padrao da RFB', () => {
  assert.equal(competenciaPadraoRfb(new Date('2026-06-05T10:00:00Z')), '2026-05');
});

test('faz rollover para dezembro do ano anterior em janeiro', () => {
  assert.equal(competenciaPadraoRfb(new Date('2026-01-03T10:00:00Z')), '2025-12');
});

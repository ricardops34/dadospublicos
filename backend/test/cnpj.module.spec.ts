import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as path from 'node:path';

test('CnpjModule registra catalogos RFB usados pelo ETL e consultas', () => {
  const modulePath = path.join(process.cwd(), 'src', 'modules', 'cnpj', 'cnpj.module.ts');
  const source = fs.readFileSync(modulePath, 'utf-8');

  assert.match(source, /Qualificacao/);
  assert.match(source, /Motivo/);
  assert.match(source, /Pais/);
  assert.match(source, /TypeOrmModule\.forFeature\(\[[\s\S]*Qualificacao[\s\S]*\]\)/);
  assert.match(source, /TypeOrmModule\.forFeature\(\[[\s\S]*Motivo[\s\S]*\]\)/);
  assert.match(source, /TypeOrmModule\.forFeature\(\[[\s\S]*Pais[\s\S]*\]\)/);
});

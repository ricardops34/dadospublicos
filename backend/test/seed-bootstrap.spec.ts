import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as path from 'node:path';

const repoRoot = path.resolve(__dirname, '..', '..');

test('seed canônico cobre bootstrap inicial esperado', () => {
  const seedFile = fs.readFileSync(path.join(repoRoot, 'backend', 'seed.js'), 'utf8');

  assert.match(seedFile, /PlanosService/);
  assert.match(seedFile, /GeocodeService/);
  assert.match(seedFile, /INSERT INTO clientes/);
  assert.match(seedFile, /INSERT INTO perfis/);
  assert.match(seedFile, /INSERT INTO menu_modulos/);
  assert.match(seedFile, /INSERT INTO menu_rotinas/);
  assert.match(seedFile, /INSERT INTO perfil_rotinas/);
});

test('backend expõe comando explícito para seed inicial', () => {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(repoRoot, 'backend', 'package.json'), 'utf8'),
  );

  assert.equal(packageJson.scripts['seed:init'], 'node seed.js');
});

import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as path from 'node:path';

const repoRoot = path.resolve(__dirname, '..', '..');

test('script de seed da VPS não usa endpoint público de IBGE', () => {
  const script = fs.readFileSync(path.join(repoRoot, 'scripts', 'seed-vps.sh'), 'utf8');

  assert.doesNotMatch(script, /\/public-seed\/ibge/);
});

test('módulo de geocode não registra SeedController público', () => {
  const moduleFile = fs.readFileSync(
    path.join(repoRoot, 'backend', 'src', 'modules', 'geocode', 'geocode.module.ts'),
    'utf8',
  );

  assert.doesNotMatch(moduleFile, /SeedController/);
});

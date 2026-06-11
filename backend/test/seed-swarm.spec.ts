import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as path from 'node:path';

const repoRoot = path.resolve(__dirname, '..', '..');

test('script de seed do swarm delega para o seed canônico', () => {
  const script = fs.readFileSync(path.join(repoRoot, 'scripts', 'seed-swarm.sh'), 'utf8');

  assert.match(script, /node seed\.js/);
  assert.doesNotMatch(script, /AssinaturasService/);
  assert.doesNotMatch(script, /PlanosService/);
  assert.doesNotMatch(script, /GeocodeService/);
});

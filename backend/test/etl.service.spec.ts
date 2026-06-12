import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { EtlService } from '../src/modules/etl/etl.service';
import { EtlLog } from '../src/entities/etl-log.entity';

function createService(logsInDb: Partial<EtlLog>[] = []) {
  let currentLogs = [...logsInDb];

  const repo = {
    create: (data: Partial<EtlLog>) => data,
    save: async (data: Partial<EtlLog>) => data,
    count: async () => currentLogs.length,
    findAndCount: async ({ order, take, skip }: any) => {
      const sorted = [...currentLogs].sort((a, b) => {
        const aDate = new Date(a.iniciadoEm ?? 0).getTime();
        const bDate = new Date(b.iniciadoEm ?? 0).getTime();
        return order?.iniciadoEm === 'DESC' ? bDate - aDate : aDate - bDate;
      });

      return [sorted.slice(skip, skip + take), currentLogs.length];
    },
    clear: async () => {
      const affected = currentLogs.length;
      currentLogs = [];
      return { affected };
    },
  };

  const service = new EtlService(
    repo as any,
    { query: async () => [] } as any,
    { getValor: async (_key: string, fallback: string) => fallback } as any,
  );

  return { service, getLogs: () => currentLogs };
}

test('status pagina o historico de execucoes', async () => {
  const { service } = createService([
    { id: '1', iniciadoEm: new Date('2026-06-05T10:00:00Z') },
    { id: '2', iniciadoEm: new Date('2026-06-04T10:00:00Z') },
    { id: '3', iniciadoEm: new Date('2026-06-03T10:00:00Z') },
  ]);

  const result = await service.status(2, 1);

  assert.equal(result.page, 2);
  assert.equal(result.pageSize, 1);
  assert.equal(result.total, 3);
  assert.equal(result.historico.length, 1);
  assert.equal(result.historico[0].id, '2');
});

test('limpa logs quando nao ha processamento em andamento', async () => {
  const { service, getLogs } = createService([
    { id: '1', iniciadoEm: new Date('2026-06-05T10:00:00Z') },
    { id: '2', iniciadoEm: new Date('2026-06-04T10:00:00Z') },
  ]);

  const result = await service.limparLogs();

  assert.equal(result.removidos, 2);
  assert.equal(getLogs().length, 0);
});

test('carregarCsv trata ponto e virgula dentro de campo entre aspas', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'etl-csv-'));
  const csvPath = path.join(tempDir, 'Empresas0.csv');
  fs.writeFileSync(
    csvPath,
    [
      '"12345678";"EMPRESA UM";"2062";"49";"1000";"01";""',
      '"87654321";"EMPRESA; DOIS";"2062";"49";"2000";"03";""',
    ].join('\n'),
    'latin1',
  );

  const executed: Array<{ sql: string; params: unknown[] }> = [];
  const dataSource = {
    query: async (sql: string, params: unknown[]) => {
      const valuesSection = sql.split(' VALUES ')[1]?.split(' ON CONFLICT')[0] ?? '';
      const tupleLengths = (valuesSection.match(/\(([^)]+)\)/g) ?? []).map(
        (tuple) => tuple.split(',').length,
      );
      if (new Set(tupleLengths).size > 1) {
        throw new Error('VALUES lists must all be the same length');
      }
      executed.push({ sql, params });
      return [];
    },
  };

  const service = new EtlService(
    {
      create: (data: Partial<EtlLog>) => data,
      save: async (data: Partial<EtlLog>) => data,
    } as any,
    {
      create: (data: unknown) => data,
      save: async (data: unknown) => data,
    } as any,
    dataSource as any,
    { getValor: async (_key: string, fallback: string) => fallback } as any,
  );

  const total = await (service as any).carregarCsv(
    csvPath,
    'empresas_rfb',
    ['cnpj_basico', 'razao_social', 'natureza_juridica', 'qualificacao_responsavel', 'capital_social', 'porte_empresa', 'ente_federativo'],
    ['cnpj_basico'],
  );

  assert.equal(total, 2);
  assert.equal(executed.length, 1);
  assert.equal(executed[0].params.length, 14);

  fs.rmSync(tempDir, { recursive: true, force: true });
});

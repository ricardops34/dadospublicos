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

test('carregarCsv deriva hierarquia obrigatoria para cnaes a partir do codigo', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'etl-cnaes-'));
  const csvPath = path.join(tempDir, 'Cnaes.csv');
  fs.writeFileSync(
    csvPath,
    '"0111301";"Cultivo de arroz"\n',
    'latin1',
  );

  const executed: Array<{ sql: string; params: unknown[] }> = [];
  const dataSource = {
    query: async (sql: string, params: unknown[]) => {
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
    'cnaes',
    ['codigo', 'descricao', 'secao', 'divisao', 'grupo', 'classe'],
    ['codigo'],
  );

  assert.equal(total, 1);
  assert.equal(executed.length, 1);
  assert.deepEqual(executed[0].params, ['0111301', 'Cultivo de arroz', 'A', '01', '011', '01113']);

  fs.rmSync(tempDir, { recursive: true, force: true });
});

test('carregarCsvParalelo salva preview das 3 primeiras linhas no log de arquivo quando a carga falha', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'etl-preview-'));
  const csvPath = path.join(tempDir, 'Empresas0.csv');
  fs.writeFileSync(
    csvPath,
    [
      '"12345678";"EMPRESA UM";"2062"',
      '"87654321";"EMPRESA DOIS";"2062"',
      '"11111111";"EMPRESA TRES";"2062"',
      '"22222222";"EMPRESA QUATRO";"2062"',
    ].join('\n'),
    'latin1',
  );

  const savedArquivoLogs: any[] = [];
  const arquivoLogsRepo = {
    create: (data: any) => ({ ...data }),
    save: async (data: any) => {
      savedArquivoLogs.push({ ...data });
      return data;
    },
  };

  const previousExtractDir = process.env.ETL_EXTRACT_DIR;
  process.env.ETL_EXTRACT_DIR = tempDir;

  try {
    const service = new EtlService(
      {
        create: (data: Partial<EtlLog>) => data,
        save: async (data: Partial<EtlLog>) => data,
      } as any,
      arquivoLogsRepo as any,
      { query: async () => [] } as any,
      { getValor: async (_key: string, fallback: string) => fallback } as any,
    );

    await assert.rejects(
      () => (service as any).carregarCsvParalelo(
        'Empresas',
        'empresas_rfb',
        ['cnpj_basico', 'razao_social', 'natureza_juridica', 'qualificacao_responsavel', 'capital_social', 'porte_empresa', 'ente_federativo'],
        false,
      ),
      /Linha com 3 coluna\(s\) em Empresas0\.csv; esperado 7 para empresas_rfb\./,
    );

    const ultimoLog = savedArquivoLogs.at(-1);
    assert.equal(ultimoLog.status, 'erro');
    assert.match(ultimoLog.detalhe, /Primeiras 3 linhas do arquivo:/);
    assert.match(ultimoLog.detalhe, /1: "12345678";"EMPRESA UM";"2062"/);
    assert.match(ultimoLog.detalhe, /2: "87654321";"EMPRESA DOIS";"2062"/);
    assert.match(ultimoLog.detalhe, /3: "11111111";"EMPRESA TRES";"2062"/);
  } finally {
    if (previousExtractDir === undefined) {
      delete process.env.ETL_EXTRACT_DIR;
    } else {
      process.env.ETL_EXTRACT_DIR = previousExtractDir;
    }
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('carregarCsv normaliza decimal brasileiro em capital_social antes do insert', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'etl-decimal-'));
  const csvPath = path.join(tempDir, 'Empresas0.csv');
  fs.writeFileSync(
    csvPath,
    '"12345678";"EMPRESA UM";"2062";"49";"0,00";"01";""\n',
    'latin1',
  );

  const executed: Array<{ sql: string; params: unknown[] }> = [];
  const dataSource = {
    query: async (sql: string, params: unknown[]) => {
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

  assert.equal(total, 1);
  assert.equal(executed.length, 1);
  assert.deepEqual(executed[0].params, ['12345678', 'EMPRESA UM', '2062', '49', '0.00', '01', null]);

  fs.rmSync(tempDir, { recursive: true, force: true });
});

test('carregarCsv divide inserts grandes para evitar excesso de parametros por query', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'etl-chunk-'));
  const csvPath = path.join(tempDir, 'Empresas0.csv');
  const linhas = Array.from({ length: 1500 }, (_, i) =>
    `"${String(10000000 + i)}";"EMPRESA ${i}";"2062";"49";"0,00";"01";""`,
  );
  fs.writeFileSync(csvPath, `${linhas.join('\n')}\n`, 'latin1');

  const executed: Array<{ sql: string; params: unknown[] }> = [];
  const dataSource = {
    query: async (sql: string, params: unknown[]) => {
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

  assert.equal(total, 1500);
  assert.equal(executed.length, 2);
  assert.equal(executed[0].params.length, 9996);
  assert.equal(executed[1].params.length, 504);

  fs.rmSync(tempDir, { recursive: true, force: true });
});

test('carregarCsv converte sentinelas invalidas de data para null', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'etl-date-'));
  const csvPath = path.join(tempDir, 'Estabelecimentos0.csv');
  fs.writeFileSync(
    csvPath,
    '"12345678";"0001";"99";"1";"NOME";"02";"0";"00";"";"000";"00000000";"0111301";"";"RUA";"A";"10";"";"CENTRO";"78000000";"MT";"9067";"65";"12345678";"";"";"";"";"EMAIL@TESTE.COM";"";"0"\n',
    'latin1',
  );

  const executed: Array<{ sql: string; params: unknown[] }> = [];
  const dataSource = {
    query: async (sql: string, params: unknown[]) => {
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
    'estabelecimentos',
    [
      'cnpj_basico', 'cnpj_ordem', 'cnpj_dv', 'identificador_matriz_filial', 'nome_fantasia',
      'situacao_cadastral', 'data_situacao_cadastral', 'motivo_situacao_cadastral', 'nome_cidade_exterior', 'pais',
      'data_inicio_atividade', 'cnae_fiscal_principal', 'cnae_fiscal_secundaria', 'tipo_logradouro', 'logradouro',
      'numero', 'complemento', 'bairro', 'cep', 'uf', 'municipio', 'ddd1', 'telefone1', 'ddd2', 'telefone2',
      'ddd_fax', 'fax', 'email', 'situacao_especial', 'data_situacao_especial',
    ],
    ['cnpj_basico', 'cnpj_ordem', 'cnpj_dv'],
  );

  assert.equal(total, 1);
  assert.equal(executed.length, 1);
  assert.equal(executed[0].params[6], null);
  assert.equal(executed[0].params[10], null);
  assert.equal(executed[0].params[29], null);

  fs.rmSync(tempDir, { recursive: true, force: true });
});

test('detalhe do erro principal inclui o arquivo atual quando houver', () => {
  const service = new EtlService(
    { create: (data: Partial<EtlLog>) => data, save: async (data: Partial<EtlLog>) => data } as any,
    { create: (data: unknown) => data, save: async (data: unknown) => data } as any,
    { query: async () => [] } as any,
    { getValor: async (_key: string, fallback: string) => fallback } as any,
  );

  (service as any).progresso.arquivoAtual = 'Empresas42.csv';

  const detalhe = (service as any).montarDetalheErroPrincipal(new Error('falha de carga'));

  assert.match(detalhe, /Arquivo atual: Empresas42\.csv/);
  assert.match(detalhe, /Error: falha de carga/);
});

test('carregarCsv informa coluna e valor quando excede limite de varchar', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'etl-varchar-'));
  const csvPath = path.join(tempDir, 'Estabelecimentos0.csv');
  fs.writeFileSync(
    csvPath,
    '"12345678";"0001";"99";"1";"NOME";"02";"20240101";"00";"";"000";"20240101";"0111301";"";"RUA";"A";"10";"";"CENTRO";"78000000";"MT";"9067";"1234";"12345678";"";"";"";"";"EMAIL@TESTE.COM";"";"20240101"\n',
    'latin1',
  );

  const service = new EtlService(
    {
      create: (data: Partial<EtlLog>) => data,
      save: async (data: Partial<EtlLog>) => data,
    } as any,
    {
      create: (data: unknown) => data,
      save: async (data: unknown) => data,
    } as any,
    { query: async () => [] } as any,
    { getValor: async (_key: string, fallback: string) => fallback } as any,
  );

  await assert.rejects(
    () => (service as any).carregarCsv(
      csvPath,
      'estabelecimentos',
      [
        'cnpj_basico', 'cnpj_ordem', 'cnpj_dv', 'identificador_matriz_filial', 'nome_fantasia',
        'situacao_cadastral', 'data_situacao_cadastral', 'motivo_situacao_cadastral', 'nome_cidade_exterior', 'pais',
        'data_inicio_atividade', 'cnae_fiscal_principal', 'cnae_fiscal_secundaria', 'tipo_logradouro', 'logradouro',
        'numero', 'complemento', 'bairro', 'cep', 'uf', 'municipio', 'ddd1', 'telefone1', 'ddd2', 'telefone2',
        'ddd_fax', 'fax', 'email', 'situacao_especial', 'data_situacao_especial',
      ],
      ['cnpj_basico', 'cnpj_ordem', 'cnpj_dv'],
    ),
    /Valor '1234' excede o limite 3 da coluna ddd1 em estabelecimentos/,
  );

  fs.rmSync(tempDir, { recursive: true, force: true });
});

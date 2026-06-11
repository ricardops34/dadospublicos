import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import { PlanosService } from '../src/modules/planos/planos.service';

function createService() {
  const planos: any[] = [];
  const recursos: any[] = [];
  const planosRecursos: any[] = [];

  let planoSeq = 1;
  let recursoSeq = 1;
  let assocSeq = 1;

  const planosRepo = {
    findOne: async ({ where }: any) =>
      planos.find((plano) =>
        Object.entries(where).every(([key, value]) => plano[key] === value),
      ) ?? null,
    create: (dto: any) => ({ id: dto.id ?? `plano-${planoSeq++}`, ativo: true, ...dto }),
    save: async (plano: any) => {
      const index = planos.findIndex((item) => item.id === plano.id);
      const value = { ...plano };
      if (index >= 0) planos[index] = value;
      else planos.push(value);
      return value;
    },
    update: async (id: string, dto: any) => {
      const plano = planos.find((item) => item.id === id);
      if (plano) Object.assign(plano, dto);
    },
  };

  const recursosRepo = {
    findOne: async ({ where }: any) =>
      recursos.find((recurso) =>
        Object.entries(where).every(([key, value]) => recurso[key] === value),
      ) ?? null,
    create: (dto: any) => ({ id: dto.id ?? `recurso-${recursoSeq++}`, ativo: true, ...dto }),
    save: async (recurso: any) => {
      const index = recursos.findIndex((item) => item.id === recurso.id);
      const value = { ...recurso };
      if (index >= 0) recursos[index] = value;
      else recursos.push(value);
      return value;
    },
  };

  const planosRecursosRepo = {
    delete: async ({ planoId }: any) => {
      for (let i = planosRecursos.length - 1; i >= 0; i -= 1) {
        if (planosRecursos[i].planoId === planoId) {
          planosRecursos.splice(i, 1);
        }
      }
    },
    create: (dto: any) => ({ id: dto.id ?? `assoc-${assocSeq++}`, ...dto }),
    save: async (assoc: any) => {
      planosRecursos.push({ ...assoc });
      return assoc;
    },
  };

  const service = new PlanosService(
    planosRepo as any,
    recursosRepo as any,
    planosRecursosRepo as any,
    { del: async () => undefined } as any,
  );

  service.findAll = async () => planos.map((plano) => ({
    ...plano,
    recursos: planosRecursos
      .filter((assoc) => assoc.planoId === plano.id)
      .sort((a, b) => a.ordem - b.ordem)
      .map((assoc) => ({
        ...assoc,
        recurso: recursos.find((recurso) => recurso.id === assoc.recursoId),
      })),
  })) as any;

  return { service, planos, recursos, planosRecursos };
}

test('seed mantém gratuito sem CEP e libera CEP para planos pagos', async () => {
  const { service, planos, recursos, planosRecursos } = createService();

  await service.seed();

  const planoFree = planos.find((plano) => plano.slug === 'gratuito');
  assert.ok(planoFree);
  assert.equal(planoFree.nome, 'Gratuito');
  assert.equal(planoFree.acessoCnpj, true);
  assert.equal(planoFree.acessoGeocode, false);
  assert.equal(planoFree.rateLimitPorHora, null);
  assert.equal(planoFree.exibirNaLp, true);

  const recursosDoPlanoFree = planosRecursos
    .filter((assoc) => assoc.planoId === planoFree.id)
    .map((assoc) => recursos.find((recurso) => recurso.id === assoc.recursoId)?.slug);

  assert.ok(recursosDoPlanoFree.includes('consulta-cnpj'));
  assert.ok(!recursosDoPlanoFree.includes('consulta-cep'));

  const planoBasico = planos.find((plano) => plano.slug === 'basico');
  assert.ok(planoBasico);
  assert.equal(planoBasico.acessoGeocode, true);

  const recursosDoPlanoBasico = planosRecursos
    .filter((assoc) => assoc.planoId === planoBasico.id)
    .map((assoc) => recursos.find((recurso) => recurso.id === assoc.recursoId)?.slug);

  assert.ok(recursosDoPlanoBasico.includes('consulta-cep'));
});

test('findAll público retorna apenas planos ativos exibidos na LP', async () => {
  const service = new PlanosService(
    {
      find: async ({ where }: any) => {
        assert.deepEqual(where, { ativo: true, exibirNaLp: true });
        return [
          { id: '1', slug: 'gratuito', ativo: true, exibirNaLp: true, ordem: 0, recursos: [] },
        ];
      },
    } as any,
    {} as any,
    {} as any,
    { get: async () => null, set: async () => undefined } as any,
  );

  const result = await service.findAll(true);

  assert.equal(result.length, 1);
  assert.equal(result[0].slug, 'gratuito');
});

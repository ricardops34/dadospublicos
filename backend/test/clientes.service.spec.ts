import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import { ValidationPipe } from '@nestjs/common';
import { ClientesService } from '../src/modules/clientes/clientes.service';
import { AgendarExclusaoDto } from '../src/modules/usuarios/dto/create-usuario.dto';
import { CreateClienteDto, UpdateClienteDto } from '../src/modules/clientes/dto/create-cliente.dto';

function createService(overrides?: {
  clientesRepo?: Record<string, any>;
  clienteCnaesRepo?: Record<string, any>;
  assinaturasRepo?: Record<string, any>;
  usuariosRepo?: Record<string, any>;
  cnpjSvc?: Record<string, any>;
  usuariosService?: Record<string, any>;
}) {
  return new ClientesService(
    ({
      create: (value: any) => value,
      save: async (value: any) => value,
      findOne: async () => null,
      findAndCount: async () => [[], 0],
      ...(overrides?.clientesRepo ?? {}),
    }) as any,
    ({
      delete: async () => undefined,
      save: async () => undefined,
      create: (value: any) => value,
      ...(overrides?.clienteCnaesRepo ?? {}),
    }) as any,
    ({ ...(overrides?.assinaturasRepo ?? {}) }) as any,
    ({
      update: async () => undefined,
      find: async () => [],
      ...(overrides?.usuariosRepo ?? {}),
    }) as any,
    ({
      obterCnaesPorCodigos: async () => [],
      ...(overrides?.cnpjSvc ?? {}),
    }) as any,
    ({
      enviarResetPorAdmin: async () => ({ mensagem: 'ok' }),
      ...(overrides?.usuariosService ?? {}),
    }) as any,
  );
}

test('CreateClienteDto aceita cadastro admin sem senha e sem perfil', async () => {
  const pipe = new ValidationPipe({ whitelist: true, transform: true });

  const result = await pipe.transform(
    { tipoPessoa: 'J', cnpj: '12.345.678/0001-90', razaoSocial: 'Empresa LTDA', email: 'contato@empresa.com' },
    { type: 'body', metatype: CreateClienteDto },
  );

  assert.equal(result.razaoSocial, 'Empresa LTDA');
  assert.equal(result.email, 'contato@empresa.com');
  assert.equal('senha' in result, false);
});

test('UpdateClienteDto aceita campos empresariais do cadastro admin', async () => {
  const pipe = new ValidationPipe({ whitelist: true, transform: true });

  const result = await pipe.transform(
    { nomeFantasia: 'Fantasia', naturezaJuridicaCodigo: '2062', naturezaJuridicaDescricao: 'Sociedade Empresária Limitada' },
    { type: 'body', metatype: UpdateClienteDto },
  );

  assert.equal(result.nomeFantasia, 'Fantasia');
  assert.equal(result.naturezaJuridicaCodigo, '2062');
});

test('createAdmin cria cliente sem usuário principal obrigatório', async () => {
  let salvo: any;

  const service = createService({
    clientesRepo: {
      create: (value: any) => ({ id: 'cli-1', ...value }),
      save: async (value: any) => {
        salvo = { ...value };
        return value;
      },
    },
  });

  const result = await service.createAdmin({
    tipoPessoa: 'J',
    cnpj: '12.345.678/0001-90',
    razaoSocial: 'Empresa LTDA',
    email: 'contato@empresa.com',
  });

  assert.equal(result.id, 'cli-1');
  assert.equal(salvo.proprietarioId, null);
  assert.equal(salvo.email, 'contato@empresa.com');
});

test('updateAdmin atualiza dados do cliente sem depender de senha', async () => {
  const cliente = {
    id: 'cli-1',
    tipoPessoa: 'J',
    cnpj: '12.345.678/0001-90',
    razaoSocial: 'Empresa LTDA',
    nomeFantasia: null,
    cnaesSecundarios: [],
  };

  const service = createService({
    clientesRepo: {
      findOne: async () => cliente,
      save: async (value: any) => Object.assign(cliente, value),
    },
  });

  await service.updateAdmin('cli-1', {
    nomeFantasia: 'Fantasia',
    porteEmpresa: 'Empresa de Pequeno Porte',
  });

  assert.equal(cliente.nomeFantasia, 'Fantasia');
  assert.equal((cliente as any).porteEmpresa, 'Empresa de Pequeno Porte');
});

test('agendarExclusao exclui definitivamente cliente sem plano pago', async () => {
  const cliente = {
    id: 'cli-1',
    tipoPessoa: 'J',
    email: 'contato@empresa.com',
    ativo: true,
    assinaturas: [],
    agendarExclusaoEm: null,
  };

  const service = createService({
    clientesRepo: {
      findOne: async () => cliente,
      save: async (value: any) => Object.assign(cliente, value),
    },
  });

  const result = await service.agendarExclusao('cli-1', { agendarPara: 'agora' } as AgendarExclusaoDto);

  assert.equal(result.tipoFluxo, 'exclusao-imediata');
  assert.equal(cliente.ativo, false);
  assert.match(cliente.email, /@anonimizado\.invalid$/);
});

test('cancelarExclusao limpa agendamento pendente do cliente', async () => {
  const cliente = {
    id: 'cli-1',
    agendarExclusaoEm: new Date('2026-07-10T00:00:00.000Z'),
  };

  const service = createService({
    clientesRepo: {
      findOne: async () => cliente,
      save: async (value: any) => Object.assign(cliente, value),
    },
  });

  const result = await service.cancelarExclusao('cli-1');

  assert.equal(result.agendarExclusaoEm, null);
  assert.equal(cliente.agendarExclusaoEm, null);
});

test('criarUsuarioPrincipal cria usuário principal a partir do cliente e envia reset de senha', async () => {
  const cliente = {
    id: 'cli-1',
    tipoPessoa: 'J',
    razaoSocial: 'Empresa LTDA',
    nomeFantasia: 'Fantasia',
    email: 'contato@empresa.com',
    telefone: '(65) 3333-4444',
    proprietarioId: null,
  };
  let usuarioSalvo: any;
  let resetEnviadoPara: string | null = null;

  const service = createService({
    clientesRepo: {
      findOne: async () => cliente,
      save: async (value: any) => Object.assign(cliente, value),
    },
    usuariosRepo: {
      findOne: async ({ where }: any) => {
        if (where?.email) return null;
        return null;
      },
      create: (value: any) => ({ id: 'usr-1', ...value }),
      save: async (value: any) => {
        usuarioSalvo = { ...value };
        return value;
      },
    },
    usuariosService: {
      enviarResetPorAdmin: async (id: string) => {
        resetEnviadoPara = id;
        return { mensagem: 'ok' };
      },
    },
  });

  const result = await service.criarUsuarioPrincipal('cli-1');

  assert.equal(result.id, 'usr-1');
  assert.equal(usuarioSalvo.email, 'contato@empresa.com');
  assert.equal(usuarioSalvo.nome, 'Fantasia');
  assert.equal(cliente.proprietarioId, 'usr-1');
  assert.equal(resetEnviadoPara, 'usr-1');
});

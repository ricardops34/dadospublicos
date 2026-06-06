import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import { ValidationPipe } from '@nestjs/common';
import { ClientesService } from '../src/modules/clientes/clientes.service';
import { AgendarExclusaoDto, CreateClienteDto, UpdateClienteDto } from '../src/modules/clientes/dto/create-cliente.dto';

function createService(overrides?: {
  clientesRepo?: Record<string, any>;
  assinaturasRepo?: Record<string, any>;
  params?: Record<string, any>;
  emailSvc?: Record<string, any>;
}) {
  return new ClientesService(
    (overrides?.clientesRepo ?? {}) as any,
    (overrides?.assinaturasRepo ?? {}) as any,
    ({ getValor: async () => '', ...(overrides?.params ?? {}) }) as any,
    ({ enviar: async () => undefined, ...(overrides?.emailSvc ?? {}) }) as any,
  );
}

test('CreateClienteDto aceita cadastro público mínimo com nome, email e senha', async () => {
  const pipe = new ValidationPipe({ whitelist: true, transform: true });

  const result = await pipe.transform(
    { nome: 'Cliente Teste', email: 'novo@empresa.com', senha: 'Senha@123' },
    { type: 'body', metatype: CreateClienteDto },
  );

  assert.equal(result.nome, 'Cliente Teste');
  assert.equal(result.email, 'novo@empresa.com');
  assert.equal(result.senha, 'Senha@123');
});

test('isOnboardingPendente retorna true para cliente novo sem dados complementares e sem plano', () => {
  const service = createService();

  const result = service.isOnboardingPendente({
    nome: 'Cliente Novo',
    email: 'novo@empresa.com',
    tipoPessoa: 'J',
    telefone: null,
    cnpj: null,
    razaoSocial: null,
    cep: null,
    logradouro: null,
    numero: null,
    bairro: null,
    municipio: null,
    uf: null,
    assinaturas: [],
  } as any);

  assert.equal(result, true);
});

test('isOnboardingPendente retorna false com cadastro completo e plano ativo', () => {
  const service = createService();

  const result = service.isOnboardingPendente({
    nome: 'Cliente Completo',
    email: 'completo@empresa.com',
    tipoPessoa: 'J',
    telefone: '65999999999',
    cnpj: '12.345.678/0001-90',
    razaoSocial: 'Empresa LTDA',
    cep: '78000-000',
    logradouro: 'Rua A',
    numero: '10',
    bairro: 'Centro',
    municipio: 'Cuiaba',
    uf: 'MT',
    assinaturas: [{ status: 'ativa' }],
  } as any);

  assert.equal(result, false);
});

test('UpdateClienteDto aceita email e senha no fluxo admin', async () => {
  const pipe = new ValidationPipe({ whitelist: true, transform: true });

  const result = await pipe.transform(
    { email: 'novo@empresa.com', senha: 'Senha@123' },
    { type: 'body', metatype: UpdateClienteDto },
  );

  assert.equal(result.email, 'novo@empresa.com');
  assert.equal(result.senha, 'Senha@123');
});

test('atualizar aplica hash de senha e não persiste o campo senha bruto', async () => {
  let savedCliente: any;

  const clientesRepo = {
    findOne: async ({ where }: any) => {
      if (where.id) {
        return {
          id: where.id,
          email: 'antigo@empresa.com',
          senhaHash: 'hash-antigo',
          nome: 'Cliente',
          tipoPessoa: 'J',
          telefone: '65999999999',
          cnpj: '12.345.678/0001-90',
          razaoSocial: 'Empresa LTDA',
          cep: '78000-000',
          logradouro: 'Rua A',
          numero: '10',
          bairro: 'Centro',
          municipio: 'Cuiaba',
          uf: 'MT',
          assinaturas: [{ status: 'ativa' }],
        };
      }

      return null;
    },
    save: async (cliente: any) => {
      savedCliente = { ...cliente };
      return savedCliente;
    },
  };

  const service = createService({ clientesRepo });

  await service.atualizar('1', {
    email: 'novo@empresa.com',
    senha: 'Senha@123',
  } as any);

  assert.equal(savedCliente.email, 'novo@empresa.com');
  assert.equal(savedCliente.senhaHash === 'hash-antigo', false);
  assert.equal('senha' in savedCliente, false);
});

test('agendarExclusao exclui definitivamente cliente sem plano pago', async () => {
  const cliente = {
    id: '1',
    nome: 'Cliente Gratuito',
    email: 'cliente@empresa.com',
    senhaHash: 'hash',
    ativo: true,
    tipoPessoa: 'J',
    assinaturas: [],
    agendarExclusaoEm: null,
  };
  const saved: any[] = [];

  const clientesRepo = {
    findOne: async () => cliente,
    save: async (value: any) => {
      saved.push({ ...value });
      Object.assign(cliente, value);
      return value;
    },
  };
  const assinaturasRepo = {
    find: async () => [],
    save: async (value: any) => value,
  };

  const service = createService({ clientesRepo, assinaturasRepo });

  const result = await service.agendarExclusao('1', { agendarPara: 'agora' } as AgendarExclusaoDto);

  assert.equal(result.tipoFluxo, 'exclusao-imediata');
  assert.equal(cliente.ativo, false);
  assert.equal(cliente.agendarExclusaoEm, null);
  assert.match(cliente.email, /@anonimizado\.invalid$/);
  assert.ok(saved.length >= 1);
});

test('agendarExclusao agenda anonimização para cliente com plano pago', async () => {
  const cliente = {
    id: '1',
    nome: 'Cliente Pago',
    email: 'cliente@empresa.com',
    senhaHash: 'hash',
    ativo: true,
    tipoPessoa: 'J',
    agendarExclusaoEm: null,
    assinaturas: [{
      status: 'ativa',
      proximoVencimento: '2026-07-10',
      plano: { precoMensal: 199 },
    }],
  };

  const clientesRepo = {
    findOne: async () => cliente,
    save: async (value: any) => {
      Object.assign(cliente, value);
      return value;
    },
  };

  const service = createService({
    clientesRepo,
    params: { getValor: async (chave: string, fallback: string) => chave === 'DIAS_RETENCAO_CONTA' ? '30' : fallback },
  });

  const result = await service.agendarExclusao('1', { agendarPara: 'fim-plano' } as AgendarExclusaoDto);

  assert.equal(result.tipoFluxo, 'anonimizacao-agendada');
  assert.ok(result.agendarExclusaoEm);
  assert.equal(cliente.ativo, true);
  assert.ok(cliente.agendarExclusaoEm instanceof Date);
  assert.equal(cliente.email, 'cliente@empresa.com');
});

test('cancelarExclusao limpa agendamento pendente', async () => {
  const cliente = {
    id: '1',
    nome: 'Cliente Pago',
    email: 'cliente@empresa.com',
    senhaHash: 'hash',
    ativo: true,
    tipoPessoa: 'J',
    agendarExclusaoEm: new Date('2026-07-10T00:00:00.000Z'),
    assinaturas: [{
      status: 'ativa',
      proximoVencimento: '2026-07-10',
      plano: { precoMensal: 199 },
    }],
  };

  const clientesRepo = {
    findOne: async () => cliente,
    save: async (value: any) => {
      Object.assign(cliente, value);
      return value;
    },
  };

  const service = createService({ clientesRepo });

  const result = await service.cancelarExclusao('1');

  assert.equal(result.agendarExclusaoEm, null);
  assert.equal(cliente.agendarExclusaoEm, null);
});

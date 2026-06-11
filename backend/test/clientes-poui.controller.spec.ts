import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import { ClientesPoUiController } from '../src/modules/clientes/clientes-poui.controller';

test('create usa fluxo de cliente admin sem exigir senha nem perfil', async () => {
  let payloadRecebido: any;

  const controller = new ClientesPoUiController(
    {
      findAll: async () => [[], 0],
      findOne: async (id: string) => ({ id, razaoSocial: 'Empresa Admin' }),
      createAdmin: async (dto: any) => {
        payloadRecebido = dto;
        return { id: 'cli-1' };
      },
      updateAdmin: async () => ({}),
      ativar: async () => ({}),
      agendarExclusao: async () => ({}),
      cancelarExclusao: async () => ({}),
      sanitizeAdminResponse: (cliente: any) => cliente,
    } as any,
    {} as any,
    {} as any,
  );

  const dto = { tipoPessoa: 'J', cnpj: '12345678000190', razaoSocial: 'Empresa Admin', email: 'contato@empresa.com' };
  const response = await controller.create(dto as any);

  assert.deepEqual(payloadRecebido, dto);
  assert.equal(response.id, 'cli-1');
  assert.equal(response.razaoSocial, 'Empresa Admin');
});

test('validate-cnpj devolve campos empresariais editaveis no cadastro admin de cliente', async () => {
  const controller = new ClientesPoUiController(
    {} as any,
    {
      buscar: async () => ({
        razao_social: 'Empresa LTDA',
        porte: { id: '03', descricao: 'Empresa de Pequeno Porte' },
        natureza_juridica: { id: '2062', descricao: 'Sociedade Empresária Limitada' },
        estabelecimento: {
          cnpj: '12345678000190',
          nome_fantasia: 'Fantasia',
          situacao_cadastral: 'Ativa',
          cep: '78000000',
          logradouro: 'Rua A',
          numero: '10',
          complemento: 'Sala 1',
          bairro: 'Centro',
          municipio: { nome: 'Cuiabá' },
          uf: 'MT',
          email: 'contato@empresa.com',
          ddd1: '65',
          telefone1: '33334444',
          atividade_principal: { id: '6201501', descricao: 'Desenvolvimento de software' },
          atividades_secundarias: [{ id: '6202300', descricao: 'Desenvolvimento e licenciamento' }],
        },
      }),
    } as any,
    {} as any,
  );

  const response = await controller.validateCnpj({ value: '12.345.678/0001-90' });

  assert.equal(response.value.nomeFantasia, 'Fantasia');
  assert.equal(response.value.porteEmpresa, 'Empresa de Pequeno Porte');
  assert.equal(response.value.situacaoCadastral, 'Ativa');
  assert.equal(response.value.naturezaJuridicaCodigo, '2062');
  assert.equal(response.value.naturezaJuridicaDescricao, 'Sociedade Empresária Limitada');
  assert.equal(response.value.email, 'contato@empresa.com');
  assert.equal(response.value.telefone, '(65) 3333-4444');
  assert.equal(response.value.cnaePrincipal, '6201501');
});

test('criarUsuarioPrincipal delega ao serviço e retorna o usuário criado', async () => {
  const controller = new ClientesPoUiController(
    {
      criarUsuarioPrincipal: async (id: string) => ({ id: 'usr-1', clienteId: id }),
    } as any,
    {} as any,
    {} as any,
  );

  const response = await controller.criarUsuarioPrincipal('cli-1');

  assert.equal(response.id, 'usr-1');
  assert.equal(response.clienteId, 'cli-1');
});

import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import { UsuariosController } from '../src/modules/usuarios/usuarios.controller';

function makeController() {
  const service = {
    atualizarCliente: async (clienteId: string, dto: any) => ({ clienteId, dto }),
    listarUsuariosDoCliente: async (usuarioId: string) => [{ usuarioId }],
    criarUsuarioDoCliente: async (usuarioId: string, dto: any) => ({ usuarioId, dto }),
    editarUsuarioDoCliente: async (usuarioId: string, id: string, dto: any) => ({ usuarioId, id, dto }),
    ativarUsuarioDoCliente: async (usuarioId: string, id: string, ativo: boolean) => ({ usuarioId, id, ativo }),
    transferirPrincipal: async (usuarioId: string, id: string) => ({ usuarioId, id }),
  };
  const controller = new UsuariosController(service as any, {} as any);
  return { controller };
}

test('UsuariosController expõe aliases /me/cliente e /me/conta para atualizar cliente', async () => {
  const { controller } = makeController();
  const req = { usuario: { sub: 'usuario-1', clienteId: 'cliente-1' } };
  const dto = { razaoSocial: 'Empresa' };

  const viaConta = await (controller as any).atualizarCliente(req, dto);
  const viaCliente = await (controller as any).atualizarMeuCliente(req, dto);

  assert.deepEqual(viaConta, { clienteId: 'cliente-1', dto });
  assert.deepEqual(viaCliente, { clienteId: 'cliente-1', dto });
});

test('UsuariosController expõe aliases /me/cliente/usuarios e /me/conta/usuarios', async () => {
  const { controller } = makeController();
  const req = { usuario: { sub: 'usuario-1' } };
  const dto = { nome: 'Novo usuário' };

  assert.deepEqual(await (controller as any).listarUsuariosCliente(req), [{ usuarioId: 'usuario-1' }]);
  assert.deepEqual(await (controller as any).listarUsuariosMeuCliente(req), [{ usuarioId: 'usuario-1' }]);

  assert.deepEqual(await (controller as any).criarUsuarioCliente(req, dto), { usuarioId: 'usuario-1', dto });
  assert.deepEqual(await (controller as any).criarUsuarioMeuCliente(req, dto), { usuarioId: 'usuario-1', dto });
});

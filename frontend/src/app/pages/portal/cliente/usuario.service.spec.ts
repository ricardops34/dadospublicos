import { of } from 'rxjs';
import { UsuarioPortalService } from './usuario.service';

describe('UsuarioPortalService', () => {
  it('normaliza payload legado de conta para cliente sem expor alias conta em meuPerfil', async () => {
    const service = new UsuarioPortalService(
      {
        get: () =>
          of({
            id: 'usuario-1',
            nome: 'Usuário Teste',
            conta: {
              id: 'cliente-1',
              razaoSocial: 'Empresa Teste',
            },
          }),
      } as any,
      {} as any,
    );

    const perfil = await new Promise<any>((resolve) => service.meuPerfil().subscribe(resolve));
    expect(perfil.cliente?.id).toBe('cliente-1');
    expect(perfil.cliente?.razaoSocial).toBe('Empresa Teste');
    expect(perfil.conta).toBeUndefined();
  });
});

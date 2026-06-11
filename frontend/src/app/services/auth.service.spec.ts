import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    service = new AuthService({} as HttpClient);
  });

  function createJwt(payload: Record<string, unknown>) {
    const encoded = btoa(JSON.stringify(payload))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '');
    return `header.${encoded}.signature`;
  }

  it('prefere clienteId quando o payload novo está presente', () => {
    localStorage.setItem(
      'portal_token',
      createJwt({
        sub: 'usuario-1',
        clienteId: 'cliente-1',
        contaId: 'conta-legada-1',
        nome: 'Teste',
        email: 'teste@exemplo.com',
        perfil: 'cliente',
        iat: 1,
        exp: Math.floor(Date.now() / 1000) + 3600,
      }),
    );

    expect(service.getClienteId()).toBe('cliente-1');
    expect(service.getContaId()).toBe('cliente-1');
  });

  it('usa contaId como fallback legado quando clienteId não existe', () => {
    localStorage.setItem(
      'portal_token',
      createJwt({
        sub: 'usuario-1',
        contaId: 'conta-legada-1',
        nome: 'Teste',
        email: 'teste@exemplo.com',
        perfil: 'cliente',
        iat: 1,
        exp: Math.floor(Date.now() / 1000) + 3600,
      }),
    );

    expect(service.getClienteId()).toBe('conta-legada-1');
    expect(service.getContaId()).toBe('conta-legada-1');
  });
});

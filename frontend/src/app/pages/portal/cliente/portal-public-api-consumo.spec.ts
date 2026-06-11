import '@angular/compiler';
import { of } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { environment } from '../../../../environments/environment';
import { MinhaContaComponent } from './minha-conta/minha-conta.component';
import { PrimeiroAcessoComponent } from './primeiro-acesso/primeiro-acesso.component';

describe('Portal cliente consome API pública', () => {
  function criarHttpMock() {
    const chamadas: string[] = [];

    return {
      chamadas,
      get(url: string) {
        chamadas.push(url);

        if (url.includes('/cnpj/')) {
          return of({
            razaoSocial: 'Empresa Teste',
            cep: '78000000',
            logradouro: 'Rua A',
            numero: '10',
            complemento: '',
            bairro: 'Centro',
            municipio: 'Cuiabá',
            uf: 'MT',
            cnaePrincipal: '6201501',
            cnaePrincipalDescricao: 'Desenvolvimento de software',
            cnaesSecundarios: [],
          });
        }

        return of({
          logradouro: 'Rua A',
          complemento: '',
          bairro: 'Centro',
          municipio: 'Cuiabá',
          ufSigla: 'MT',
        });
      },
      patch() {
        return of({});
      },
    };
  }

  function criarMinhaConta(http: any) {
    return new MinhaContaComponent(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      http as any,
      { detectChanges() {} } as any,
    );
  }

  function criarPrimeiroAcesso(http: any) {
    return new PrimeiroAcessoComponent(
      {} as any,
      {} as any,
      {} as any,
      http as any,
      { detectChanges() {} } as any,
      { run(fn: () => void) { fn(); } } as any,
    );
  }

  it('minha conta usa GET público para CEP e CNPJ', () => {
    const http = criarHttpMock();
    const component = criarMinhaConta(http);

    component.formConta.cep = '78000-000';
    component.formConta.cnpj = '12.345.678/0001-99';

    component.buscarCep();
    component.buscarCnpj();

    expect(http.chamadas).toContain(`${environment.apiUrl}/cep/78000000`);
    expect(http.chamadas).toContain(`${environment.apiUrl}/cnpj/12345678000199`);
  });

  it('primeiro acesso usa GET público para CEP e CNPJ', () => {
    const http = criarHttpMock();
    const component = criarPrimeiroAcesso(http);

    component.form.cep = '78000-000';
    component.form.cnpj = '12.345.678/0001-99';

    component.buscarCep();
    component.buscarCnpj();

    expect(http.chamadas).toContain(`${environment.apiUrl}/cep/78000000`);
    expect(http.chamadas).toContain(`${environment.apiUrl}/cnpj/12345678000199`);
  });
});

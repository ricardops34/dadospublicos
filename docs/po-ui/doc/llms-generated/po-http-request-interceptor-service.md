# PoHttpRequestInterceptorService

**Tipo:** Serviço
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-http-request-interceptor-service

O serviço PO Http Request Interceptor realiza a contabilização de requisições pendentes na aplicação.

Existe a possibilidade de não efetuar a contabilização das requisições pendentes, utilizando o parâmetro
`X-PO-No-Count-Pending-Requests`. Para isso deve ser informado no cabeçalho da requisição com o valor `'true'`,
por exemplo:

```
...
 const headers = { 'X-PO-No-Count-Pending-Requests': 'true' };

 this.http.get(`/customers/1`, { headers: headers });
...

```
Para obter a quantidade de requisições pendentes, deve inscrever-se no método `getCountPendingRequests` do
serviço `PoHttpRequestInterceptorService`, com isso, ao realizar requisições utilizando `HttpClient`,
será retornado a quantidade de requisições pendentes.

Também existe a possibildade de travar a tela e mostrar uma imagem de _loading_ durante o processamento de uma requisição
deve-se passar o parâmetro `X-PO-Screen-Lock` no cabeçalho da requisição com valor `'true'`.

por exemplo:

```
...
 const headers = { 'X-PO-Screen-Lock': 'true' };

 this.http.get(`/customers/1`, { headers: headers });
...

```
> Após a validação no interceptor, o parâmetro será removido do cabeçalho da requisição.

## Configuração

É necessário configurar o `HttpClient` para utilizar os interceptors registrados via Dependency Injection (DI)
por meio da função `provideHttpClient(withInterceptorsFromDi())`.

### 1) NgModule

```
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { PoModule } from '@po-ui/ng-components';
...

@NgModule({
  imports: [
    ...
    PoModule
  ],
  declarations: [
    AppComponent,
    ...
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    ...
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Ao importar o módulo `PoModule` na aplicação, o `po-http-request-interceptor` é automaticamente configurado sem a necessidade
de qualquer configuração extra.

### 2) Standalone

No arquivo contendo a configuração da aplicação (geralmente `src/app/app.config.ts`), adicione os providers e configure o `HttpClient`,
como no exemplo abaixo:

```
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { PoHttpRequestModule } from '@po-ui/ng-components';

export const appConfig: ApplicationConfig = {
  providers: [
    ...
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom([
      PoHttpRequestModule
    ]),
    ...
  ]
};
```

## Como usar

Segue abaixo um exemplo de uso:

```
import { HttpClient } from '@angular/common/http';

...

@Injectable({
 providedIn: 'root'
})
export class CustomersService {

 headers = { 'X-PO-No-Count-Pending-Requests': true, 'X-PO-Screen-Lock': 'true' }
 pendingRequests: number = 0;
 subscription: Subscription;

 constructor(
   private http: HttpClient,
   private httpRequestInterceptor: PoHttpRequestInterceptorService) { }

 ngOnDestroy(): void {
   this.subscription.unsubscribe();
 }

 ngOnInit(): void {
   this.subscription = this.httpRequestInterceptor.getCountPendingRequests().subscribe(data => {
     this.pendingRequests = data;
   });
 }

 getCustomers() {
   return this.http.get(`/customers/1`, { headers: headers });
 }

 ...

}
```

# PoI18nService

**Tipo:** Serviço
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-i18n-service

O serviço `PoI18nService` possibilita utilizar múltiplos idiomas e contextos na aplicação.

> Antes da utilização do serviço, é necessário realizar a
[importação e configuração do módulo `PoI18nModule`](/documentation/po-i18n#i18n-config).
*Utilização do serviço `PoI18nService`:**

Para utilizar o serviço basta importá-lo nos componentes que necessitarem de literais e fazer a injeção de
dependência no construtor:
```
 import { PoI18nService } from '@po-ui/ng-components';
 ...
 constructor(private poI18nService: PoI18nService) { }
 ...
```

Por fim realizar a busca pelas literais, inscrevendo-se no [Observable](https://angular.io/guide/observables) pelo
método `getLiterals()`.

> O método `getLiterals()` pode receber um objeto do tipo da interface `PoI18nLiterals` como parâmetro,
porém, nenhuma das propriedades são obrigatórias. Caso nenhum parâmetro seja passado, serão buscadas
todas as literais do contexto definido com padrão, no idioma definido como padrão.
## Alterações a partir da versão 19
A partir da versão 19, para evitar conflitos com bibliotecas de terceiros que também utilizam i18n,
é necessário passar explicitamente o contexto ao chamar `getLiterals`, garantindo a correta exibição das literais.
Caso `getLiterals` seja chamado sem parâmetros, o retorno pode vir das configurações da biblioteca de terceiros.
*Exemplo de chamada com contexto explícito:**
```typescript
poI18nService.getLiterals({ context: 'general' }).subscribe(literals => console.log(literals));
```
*Cenário de Contextos Iguais:**
Caso tanto a aplicação quanto uma biblioteca de terceiros utilizem o mesmo nome de contexto,
o PO UI fará um merge das literais, priorizando os valores definidos na aplicação cliente.
*Recomendações:**
- Sempre informar o contexto ao chamar `getLiterals` para evitar conflitos de literais.
- Caso a aplicação utilize `lazy loading`, utilizar `setLanguage()` para garantir a correta configuração de idioma.

Exemplos de requisição:
```
literals = {};
literalsEn = {};
literalsCrm = {};

constructor(private poI18nService: PoI18nService) {
  poI18nService.getLiterals()
    .subscribe((literals) => {
      this.literals = literals;
    });

  poI18nService.getLiterals({context: 'crm', literals: ['add', 'remove']})
    .subscribe((literals) => {
      this.literalsCrm = literals;
    });

  poI18nService.getLiterals({language: 'en-us'})
    .subscribe((literals) => {
      this.literalsEn = literals;
    });
}
```

Para apresentar as literais capturadas acima no HTML do componente, deve-se utilizar o
seguinte código:

{{ literals?.add }}
{{ literals?.remove }}

Caso as literais contenham variáveis que precisem ser substituídas, pode-se utilizar o *pipe* `poI18n`.
É possível informar propriedades do componente como `name` e `nickname` ou
informar o valor diretamente com "" ou número, conforme o exemplo abaixo:

{{ literals?.people | poI18n:[120] }}
{{ literals?.greeting | poI18n:[name, nickname] }}
{{ literals?.greeting | poI18n:["Brad", "Green"] }}

> É importante o uso do operador `?` (Elvis) para evitar erros enquanto as literais não forem carregadas.

### Teste unitário

Abaixo segue um exemplo de *setup* inicial de teste unitário do *AppComponent* que utiliza o `PoI18nService`:

> Atenção: não declarar o `PoI18nService` no providers do TestBed pois a biblioteca realiza a injeção de dependência de forma dinâmica.
> Se o serviço for declarado o teste não fará a injeção e o teste apresentará erros.

```
import { async, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PoI18nModule } from '@po-ui/ng-components';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  const anotherPT = {
    text: 'texto',
    add: 'adicionar',
    remove: 'remover'
  };

  const generalPT = {
    text: 'texto',
    add: 'adicionar',
    remove: 'remover'
  };

  const config = {
    default: {
      language: 'pt-BR',
      context: 'general',
      cache: false
    },
    contexts: {
      general: {
        'pt-br': generalPT
      },
      another: {
        'pt-br': anotherPT
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        HttpClientTestingModule,
        PoI18nModule.config(config)
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;

    expect(app).toBeTruthy();
  }));

});

```

## Métodos

### `getLanguage()`

Método que retorna o idioma padrão ativo.

A busca deste idioma pelo método será feita na seguinte ordem:

1 - o idioma que foi armazenado no *localStorage*, através do método [`setLanguage()`](documentation/po-i18n#setLanguage).

2 - o valor inserido no módulo do i18n através do parâmetro `config`, sendo o idioma inserido na propriedade
`language` da interface [`PoI18nConfigDefault`](documentation/po-i18n#poI18nConfigDefault).

3 - o idioma do navegador utilizado.

> Caso o idioma do navegador não seja suportado pelo PO (`pt`, `en`, `es` ou `ru`), será retornado valor `pt`.

### `getShortLanguage()`

Método que retorna o idioma padrão ativo, com somente a abreviação do idioma (duas primeiras letras).
Por exemplo: "pt" ou "es".

A busca deste idioma é baseada no método [**getLanguage()**](/documentation/po-i18n#get-language).

### `setLanguage(language: string, reload: boolean)`

Método para alterar o idioma padrão do módulo do i18n.

Ao utilizar este método, o idioma ficará gravado no armazenamento local do navegador, que será utilizado pelo
serviço do `i18n` para buscar as literais no idioma padrão.

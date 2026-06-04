# PoPageDynamicEditComponent

**Seletor:** `po-page-dynamic-edit`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-page-dynamic-edit

O `po-page-dynamic-edit` é uma página que pode servir para editar ou criar novos registros,
o mesmo também suporta metadados conforme especificado na documentação.

### Utilização via rota

Ao utilizar as rotas para inicializar o template, o `page-dynamic-edit` disponibiliza propriedades que devem ser fornecidas no arquivo de configuração de rotas da aplicação, para
poder especificar o endpoint dos dados e dos metadados que serão carregados na inicialização.

Exemplo de utilização:

Arquivo de configuração de rotas da aplicação: `app-routing.module.ts`
```
const routes: Routes = [
{
  path: 'people',
  component: PoPageDynamicEditComponent,
  data: {
    serviceApi: 'http://localhost:3000/v1/people', // endpoint dos dados
    serviceMetadataApi: 'http://localhost:3000/v1/metadata', // endpoint dos metadados utilizando o método HTTP Get
    serviceLoadApi: 'http://localhost:3000/load-metadata' // endpoint de customizações dos metadados utilizando o método HTTP Post
  }
 },
 {
  path: 'home',
  component: HomeExampleComponent
 }
];

```
O componente primeiro irá carregar o metadado da rota definida na propriedade serviceMetadataApi
e depois irá buscar da rota definida na propriedade serviceLoadApi.

A requisição dos metadados é feita na inicialização do template para buscar os metadados da página passando o
tipo do metadado esperado e a versão cacheada pelo browser.

> Caso o servidor retornar um erro ao recuperar os metadados, serão repassados os metadados salvos em cache,
se o cache não existir será disparada uma notificação.

Para carregar com um recurso já existente, deve-se ser incluído um parâmetro na rota chamado `id`:

```
{
  path: 'people/:id',
  component: PoPageDynamicEditComponent,
  data: {
    serviceApi: 'http://localhost:3000/v1/people', // endpoint dos dados
    serviceMetadataApi: 'http://localhost:3000/v1/metadata', // endpoint dos metadados
    serviceLoadApi: 'http://localhost:3000/load-metadata' // endpoint de customizações dos metadados
  }
}
```

A requisição dos metadados é feita na inicialização do template para buscar os metadados da página passando o
tipo do metadado esperado e a versão cacheada pelo browser.

O formato esperado na resposta da requisição está especificado na interface
[PoPageDynamicEditMetadata](/documentation/po-page-dynamic-edit#po-page-dynamic-edit-metadata). Por exemplo:

```
 {
  version: 1,
  title: 'Person edit',
  fields: [
    { property: 'id', key: true, disabled: true },
    { property: 'status' },
    { property: 'name' },
    { property: 'nickname' },
    { property: 'birthdate', label: 'Birth date' },
    { property: 'genre' },
    { property: 'city' },
    { property: 'country' }
  ]
}
```

> Caso o endpoint dos metadados não seja especificado, será feito uma requisição utilizando o `serviceApi` da seguinte forma:
```
GET {end-point}/metadata?type=edit&version={version}
```

#### Tokens customizáveis

| Propriedade | Descrição | Valor Padrão |
|---------------------|---------------------------------------------|---------------------------------------|
| **Header** | | |
| `--padding` | Espaçamento do header | `var(--spacing-xs) var(--spacing-md)` |
| `--gap` | Espaçamento entre os breadcrumbs e o título | `var(--spacing-md)` |
| `--gap-actions` | Espaçamento entre as ações | `var(--spacing-xs)` |
| `--font-family` | Família tipográfica do título | `var(--font-family-theme)` |
| **Content** | | |
| `--padding-content` | Espaçamento do conteúdo | `var(--spacing-xs) var(--spacing-sm)` |

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `actions` | `'p-actions'` | `PoPageDynamicEditActions` | sim | - | Ações da página. |
| `autoRouter` | `'p-auto-router'` | `boolean` | sim | false | Cria automaticamente as rotas de edição (novo/duplicate) e detalhes caso as ações |
| `breadcrumb` | `'p-breadcrumb'` | `PoBreadcrumb` | sim | - | Objeto com propriedades do breadcrumb. |
| `componentsSize` | `'p-components-size'` | `string` | sim | `medium` | Define o tamanho dos componentes de formulário no template: |
| `fields` | `'p-fields'` | `Array<PoPageDynamicEditField>` | não | - | Lista dos campos usados na tabela e busca avançada. |
| `literals` | `'p-literals'` | `PoPageDynamicEditLiterals` | sim | - | Objeto com as literais usadas no `po-page-dynamic-edit`. |
| `notificationType` | `'p-notification-type'` | `string` | sim | warning | Tipo da notificação. |
| `onLoad` | `'p-load'` | `string | (() => PoPageDynamicEditOptions)` | não | - | Função ou serviço que será executado na inicialização do componente. |
| `onLoadData` | `'p-load-data'` | `unknown` | sim | - | Função que será executada após ser realizada a busca dos dados. |
| `serviceApi` | `'p-service-api'` | `string` | não | - | Endpoint usado pelo template para requisição do recurso que será exibido para edição. |
| `title` | `'p-title'` | `string` | não | - | Título da página. |

## Métodos

### `showAdditionalHelp(property: string)`

Método que exibe `p-helper` ou executa a ação definida em `p-helper{eventOnClick}` ou em `p-additionalHelp`.
Para isso, será necessário configurar uma tecla de atalho utilizando o evento `keydown`.

```
import { PoPageDynamicEditModule } from '@po-ui/ng-templates';
...
@ViewChild('dynamicEdit', { static: true }) dynamicEdit: PoPageDynamicEditComponent;

fields: Array<PoPageDynamicEditField> = [
 {
   property: 'name',
   ...
   help: 'Mensagem de ajuda.',
   helper: 'Mensagem de ajuda complementar com o componente po-helper implementado.',
   keydown: this.onKeyDown.bind(this, 'name')
 },
]

onKeyDown(property: string, event: KeyboardEvent): void {
 if (event.code === 'F9') {
   this.dynamicEdit.showAdditionalHelp(property);
 }
}
```

# PoPageDynamicDetailComponent

**Seletor:** `po-page-dynamic-detail`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-page-dynamic-detail

O `po-page-dynamic-detail` é uma página que serve para exibir registros em detalhes,
o mesmo também suporta metadados conforme especificado na documentação.

### Utilização via rota

Ao utilizar as rotas para inicializar o template, o `page-dynamic-detail` disponibiliza propriedades que devem ser fornecidas no arquivo de configuração de rotas da aplicação, para
poder especificar o endpoint dos dados e dos metadados que serão carregados na inicialização.

Exemplo de utilização:

Arquivo de configuração de rotas da aplicação: `app-routing.module.ts`
```
const routes: Routes = [
{
  path: 'people/:id',
  component: PoPageDynamicDetailComponent,
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

O formato esperado na resposta da requisição está especificado na interface
[PoPageDynamicDetailMetadata](/documentation/po-page-dynamic-detail#po-page-dynamic-detail-metadata). Por exemplo:

```
 {
  version: 1,
  title: 'Person Detail',
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
GET {end-point}/metadata?type=detail&version={version}
```

#### Tokens customizáveis

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

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
| `actions` | `'p-actions'` | `PoPageDynamicDetailActions` | sim | - | Define as ações da página de acordo com a interface `PoPageDynamicDetailActions`. |
| `autoRouter` | `'p-auto-router'` | `boolean` | sim | false | Cria automaticamente as rotas de edição (novo/duplicate) e detalhes caso as ações |
| `breadcrumb` | `'p-breadcrumb'` | `PoBreadcrumb` | sim | - | Objeto com propriedades do breadcrumb. |
| `componentsSize` | `'p-components-size'` | `string` | sim | `medium` | Define o tamanho dos componentes de formulário no template: |
| `fields` | `'p-fields'` | `Array<PoPageDynamicDetailField>` | não | - | Lista dos campos exibidos na página. |
| `onLoad` | `'p-load'` | `string | (() => PoPageDynamicDetailOptions)` | não | - | Função ou serviço que será executado na inicialização do componente. |
| `serviceApi` | `'p-service-api'` | `string` | não | - | Endpoint usado pelo template para requisição do recurso que serão exibido. |
| `title` | `'p-title'` | `string` | não | - | Título da página. |

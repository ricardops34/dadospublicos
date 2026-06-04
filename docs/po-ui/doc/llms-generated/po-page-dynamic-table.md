# PoPageDynamicTableComponent

**Seletor:** `po-page-dynamic-table`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-page-dynamic-table

O `po-page-dynamic-table` é uma página que exibe uma lista de registros em uma tabela baseado em uma lista de fields,
o mesmo também suporta metadados conforme especificado na documentação.

### Utilização via rota

Ao utilizar as rotas para inicializar o template, o `page-dynamic-table` disponibiliza propriedades que devem ser fornecidas no arquivo de configuração de rotas da aplicação, para
poder especificar o endpoint dos dados e dos metadados que serão carregados na inicialização.

Exemplo de utilização:

Arquivo de configuração de rotas da aplicação: `app-routing.module.ts`
```
const routes: Routes = [
{
  path: 'people',
  component: PoPageDynamicTableComponent,
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
[PoPageDynamicTableMetadata](/documentation/po-page-dynamic-table#po-page-dynamic-table-metadata). Por exemplo:

```
 {
  version: 1,
  title: 'Person Table',
  fields: [
    { property: 'id', key: true, disabled: true },
    { property: 'status' },
    { property: 'name' },
    { property: 'nickname' },
    { property: 'birthdate', label: 'Birth date' },
    { property: 'genre' },
    { property: 'city' },
    { property: 'country' }
  ],
  keepFilters: true
}
```

> Caso o endpoint dos metadados não seja especificado, será feito uma requisição utilizando o `serviceApi` da seguinte forma:
```
GET {end-point}/metadata?type=list&version={version}
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
| `actionRight` | `'p-actions-right'` | `boolean` | sim | `false` | Define que a coluna de ações ficará no lado direito da tabela. |
| `actions` | `'p-actions'` | `PoPageDynamicTableActions` | sim | - | Ações da página e da tabela. |
| `autoRouter` | `'p-auto-router'` | `boolean` | sim | false | Cria automaticamente as rotas de edição (novo/duplicate) e detalhes caso sejam definidas ações na propriedade `p-actions` |
| `breadcrumb` | `'p-breadcrumb'` | `PoBreadcrumb` | sim | - | Objeto com propriedades do breadcrumb. |
| `componentsSize` | `'p-components-size'` | `string` | sim | `medium` | Define o tamanho dos componentes de formulário no template: |
| `concatFilters` | `'p-concat-filters'` | `boolean` | sim | `false` | Permite a utilização da pesquisa rápida junto com a pesquisa avançada. |
| `draggable` | `'p-draggable'` | `boolean` | sim | - | Habilita o modo drag and drop para as colunas da tabela. |
| `fields` | `'p-fields'` | `Array<PoPageDynamicTableFilters>` | sim | - | Lista dos campos usados na tabela e busca avançada. |
| `height` | `'p-height'` | `number` | sim | - | Define a altura da tabela em *pixels* e fixa o cabeçalho. |
| `hideCloseDisclaimers` | `'p-hide-close-disclaimers'` | `Array<string>` | sim | - | Lista de filtros que terão a opção de fechar ocultada |
| `hideColumnsManager` | `'p-hide-columns-manager'` | `boolean` | sim | `false` | Permite que o gerenciador de colunas, responsável pela definição de quais colunas serão exibidas, seja escondido. |
| `hideRemoveAllDisclaimer` | `'p-hide-remove-all-disclaimer'` | `boolean` | sim | `false` | Oculta o botão para remover todos os *disclaimers* do grupo. |
| `infiniteScroll` | `'p-infinite-scroll'` | `boolean` | sim | `false` | Se verdadeiro, ativa a funcionalidade de scroll infinito para a tabela e o botão "Carregar Mais" deixará de ser exibido. Ao chegar no fim da tabela |
| `keepFilters` | `'p-keep-filters'` | `boolean` | sim | `false` | Mantém na modal de `Busca Avançada` os valores preenchidos do último filtro realizado pelo usuário. |
| `onLoad` | `'p-load'` | `string | (() => PoPageDynamicTableOptions)` | não | - | Função ou serviço que será executado na inicialização do componente. |
| `pageCustomActions` | `'p-page-custom-actions'` | `Array<PoPageDynamicTableCustomAction>` | sim | - | Lista de ações customizadas da página que serão incorporadas às ações |
| `quickSearchParam` | `'p-quick-search-param'` | `string` | sim | 'search' | Identificador do parâmetro enviado ao serviço ao realizar uma busca rápida. |
| `quickSearchValue` | `'p-quick-search-value'` | `string` | sim | - | Valor padrão na busca rápida ao inicializar o componente |
| `quickSearchWidth` | `'p-quick-search-width'` | `number` | sim | - | Largura do campo de busca, utilizando o *Grid System*, |
| `searchLiterals` | `'p-literals'` | `PoPageDynamicSearchLiterals` | sim | - | Objeto com as literais usadas no `po-page-dynamic-table`. |
| `serviceApi` | `'p-service-api'` | `string` | não | - | Endpoint usado pelo template para requisição dos recursos que serão exibidos. |
| `spacing` | `'p-spacing'` | `string` | sim | `medium` | Define o espaçamento interno das células, impactando diretamente na altura das linhas do table. Os valores |
| `tableCustomActions` | `'p-table-custom-actions'` | `Array<PoPageDynamicTableCustomTableAction>` | sim | - | Lista de ações customizadas na tabela da página que serão incorporadas às ações |
| `textWrap` | `'p-text-wrap'` | `boolean` | sim | `false` | Habilita ou desabilita a quebra automática de texto. Quando ativada, o texto que excede |
| `title` | `'p-title'` | `string` | não | - | Título da página. |
| `virtualScroll` | `'p-virtual-scroll'` | `boolean` | sim | `true` | Habilita o `virtual-scroll` na tabela para melhorar a performance com grandes volumes de dados. |
| `visibleFixedFilters` | `'p-visible-fixed-filters'` | `boolean` | sim | - | Controla a visibilidade dos filtros fixos na página. |

## Outputs

| Evento | Alias | Tipo | Descrição |
|---|---|---|---|
| `changeFixedColumns` | `p-change-fixed-columns` | `EventEmitter` | Evento disparado ao alterar o estado de fixação de uma coluna no gerenciador de colunas. |
| `changeVisibleColumns` | `'p-change-visible-columns'` | `EventEmitter` | Evento disparado ao fechar o popover do gerenciador de colunas após alterar as colunas visíveis. |
| `columnRestoreManager` | `'p-restore-column-manager'` | `EventEmitter` | Evento disparado ao clicar no botão de restaurar padrão no gerenciador de colunas. |
| `sortBy` | `'p-sort-by'` | `EventEmitter` | Evento executado ao ordenar colunas da tabela. |

## Métodos

### `updateDataTable(filter: RecordType)`

Função que realiza a atualização dos dados da tabela.

Para utilizá-la é necessário capturar a instância do `page dynamic table`, como por exemplo:

``` html
<po-page-dynamic-table #dynamicTable [p-service-api]="serviceApi"></po-page-dynamic-table>
```

``` javascript
import { PoPageDynamicTableComponent, PoDynamicFormField } from '@po-ui/ng-components';

...

@ViewChild('dynamicTable', { static: true }) dynamicTable: PoPageDynamicTableComponent;

pageCustomActions: Array<PoPageDynamicTableCustomAction> = [
{
  label: 'Update',
  action: this.updateTable.bind(this),
  icon: 'an-arrows-clockwise'
}]

updateTable() {
  this.dynamicTable.updateDataTable();
}
```

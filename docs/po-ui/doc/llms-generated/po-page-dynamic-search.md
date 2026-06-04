# PoPageDynamicSearchComponent

**Seletor:** `po-page-dynamic-search`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-page-dynamic-search

Componente com as ações de pesquisa já definidas, bastando que o desenvolvedor implemente apenas a chamada para as APIs
e exiba as informações.

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
| `actions` | `'p-actions'` | `Array<PoPageAction>` | sim | - | Nesta propriedade deve ser definido um array de objetos que implementam a interface `PoPageAction`. |
| `breadcrumb` | `'p-breadcrumb'` | `PoBreadcrumb` | sim | - | Objeto com propriedades do breadcrumb. |
| `componentsSize` | `'p-components-size'` | `string` | sim | `medium` | Define o tamanho dos componentes de formulário no template: |
| `concatFilters` | `'p-concat-filters'` | `boolean` | sim | `false` | Permite a utilização da pesquisa rápida junto com a pesquisa avançada. |
| `filters` | `'p-filters'` | `Array<PoPageDynamicSearchFilters>` | sim | - | Lista dos campos usados na busca avançada. Caso o mesmo não seja passado a busca avançada não será exibida. |
| `hideCloseDisclaimers` | `'p-hide-close-disclaimers'` | `Array<string>` | sim | - | Lista de filtros que terão a opção de fechar ocultada |
| `hideRemoveAllDisclaimer` | `'p-hide-remove-all-disclaimer'` | `boolean` | sim | `false` | Oculta o botão para remover todos os *disclaimers* do grupo. |
| `keepFilters` | `'p-keep-filters'` | `boolean` | sim | `false` | Mantém na busca avançada os valores preenchidos do último filtro realizado pelo usuário. |
| `literals` | `'p-literals'` | `PoPageDynamicSearchLiterals` | sim | - | Objeto com as literais usadas no `po-page-dynamic-search`. |
| `onLoad` | `'p-load'` | `string | (() => PoPageDynamicSearchOptions)` | não | - | Função ou serviço que será executado na inicialização do componente. |
| `quickSearchValue` | `'p-quick-search-value'` | `string` | sim | - | Valor padrão na busca rápida ao inicializar o componente |
| `quickSearchWidth` | `'p-quick-search-width'` | `number` | sim | - | Largura do campo de busca, utilizando o *Grid System*, |
| `title` | `'p-title'` | `string` | não | - | Título da página. |
| `visibleFixedFilters` | `'p-visible-fixed-filters'` | `boolean` | sim | - | Controla a visibilidade dos filtros fixos na página. |

## Outputs

| Evento | Alias | Tipo | Descrição |
|---|---|---|---|
| `advancedSearch` | `'p-advanced-search'` | `EventEmitter` | Evento disparado ao executar a pesquisa avançada, o mesmo irá repassar um objeto com os valores preenchidos no modal de pesquisa. |
| `changeDisclaimers` | `'p-change-disclaimers'` | `EventEmitter` | Evento disparado ao remover um ou todos os disclaimers pelo usuário. |
| `quickSearch` | `'p-quick-search'` | `EventEmitter` | Evento disparado ao realizar uma busca pelo campo de pesquisa rápida, o mesmo será chamado repassando o valor digitado. |

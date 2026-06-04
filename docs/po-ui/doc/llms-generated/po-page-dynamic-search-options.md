# PoPageDynamicSearchOptions

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-page-dynamic-search-options

Interface para a customização de uma página dinâmica.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `actions` | `Array<PoPageAction>` | sim | Lista de ações que o usuário poderá executar na página através de botões. |
| `breadcrumb` | `PoBreadcrumb` | sim | Objeto com propriedades do breadcrumb. |
| `concatFilters` | `boolean` | sim | Permite a utilização da pesquisa rápida junto com a pesquisa avançada. |
| `filters` | `Array<PoPageDynamicSearchFilters>` | sim | Lista dos campos usados na busca avançada. Caso não seja passado a busca avançada não será exibida. |
| `hideCloseDisclaimers` | `Array<string>` | sim | Lista de filtros que terão a opção de fechar ocultada |
| `hideRemoveAllDisclaimer` | `boolean` | sim | Oculta o botão para remover todos os *disclaimers*. |
| `keepFilters` | `boolean` | sim | Mantém na modal de busca avançada os valores preenchidos do último filtro realizado pelo usuário. |
| `quickSearchWidth` | `number` | sim | Largura do campo de busca, utilizando o *Grid System*, |
| `title` | `string` | sim | Título da página. |

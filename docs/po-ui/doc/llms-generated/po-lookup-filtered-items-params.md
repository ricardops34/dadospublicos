# PoLookupFilteredItemsParams

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-lookup-filtered-items-params

Interface do objeto enviado como parâmetro na função `getFilteredItems`.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `advancedFilters` | `{
    [key: string]: any;
}` | sim | Valores informados nos campos de busca avançada, que serão utilizados para filtrar a lista de itens. |
| `filter` | `string` | sim | Conteúdo utilizado para filtrar a lista de itens. |
| `filterParams` | `any` | sim | Valor informado através da propriedade `p-filter-params`. |
| `order` | `string` | sim | Coluna que está sendo ordenada na tabela. |
| `page` | `number` | sim | Controla a paginação dos dados e recebe valor automaticamente a cada clique no botão 'Carregar mais resultados'. |
| `pageSize` | `number` | sim | Quantidade de itens retornados cada vez que o serviço é chamado, por padrão é 10. |

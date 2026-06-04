# PoTableFilter

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-table-filter

Define o tipo de busca utilizado no po-table.

## Métodos

### `getFilteredItems(params: PoTableFilteredItemsParams)`

Método que será disparado ao filtrar a lista de itens ou carregar mais resultados no componente, deve-se retornar um *Observable* com a resposta da API no formato da interface `PoTableResponseApi`.

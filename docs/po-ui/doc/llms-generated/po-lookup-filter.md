# PoLookupFilter

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-lookup-filter

Define o tipo de busca utilizado no po-lookup.

## Métodos

### `getFilteredItems(params: PoLookupFilteredItemsParams)`

Método que será disparado ao filtrar a lista de itens ou carregar mais resultados no componente, deve-se retornar
um *Observable* com a resposta da API no formato da interface `PoLookupResponseApi`.

### `getObjectByValue(value: TypeUnion, filterParams: any)`

Método responsável por enviar um valor que será buscado no serviço.

Caso a funcionalidade de múltipla seleção estver habilitada, o parametro value será enviado como uma lista de valores
e o observable deve retornar uma lista de objetos.

# PoMenuFilter

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-menu-filter

Interface do serviço utilizado no componente `po-menu`.

## Métodos

### `getFilteredData(search: string, params: any)`

Método responsável por retornar um *Observable* que retorne uma lista de objetos que seguem a interface `PoMenuItemFiltered`.
Será informado por parâmetro o valor a ser pesquisado e as informações adicionais preenchidas através da propriedade `p-params`.

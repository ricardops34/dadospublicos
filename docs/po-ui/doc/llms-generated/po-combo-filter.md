# PoComboFilter

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-combo-filter

Interface para os serviços que serão utilizados no po-combo.

## Métodos

### `getFilteredData(params: any, filterParams: any)`

Método responsável por retornar um Observable que contém uma coleção de objetos que seguem a interface PoComboOption,
será informado por parametro o campo, de acordo com o fieldLabel, e o valor a ser pesquisado.

### `getObjectByValue(value: TypeUnion, filterParams: any)`

Método responsável por retornar um Observable que contém apenas o objeto filtrado que seguem a interface PoComboOption,
será informado por parametro valor a ser pesquisado.

# PoMultiselectFilter

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-multiselect-filter

Interface para os serviços que serão utilizados no po-multiselect.

## Métodos

### `getFilteredData(params: RecordType)`

Método que será chamado ao realizar uma busca no componente, deve retornar um Observable que contém uma coleção de objetos que seguem
a interface `PoMultiselectOption`, será informado por parametro o campo e o valor a ser pesquisado.

### `getObjectsByValues(values: TypeApplication)`

Método que será chamado ao iniciar o componente com valor, deve retornar um Observable que contém apenas os objetos filtrados que
seguem a interface `PoMultiselectOption`, será informado por parâmetro valor a ser pesquisado.

# PoDataTransform

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-data-transform

Classe responsável por adaptar dados de APIs que não seguem
o padrão de [API do PO UI](https://po-ui.io/guides/api).

Essa classe deve ser estendida por uma classe que implemente cada um de seus métodos, adaptando os parâmetros de
acordo com a API do *backend* existente que se deseja comunicar.

## Métodos

### `getDateFieldName()`

Retorna o nome da propriedade responsável por informar a data da última sincronização.

### `getItemsFieldName()`

Retorna o nome da propriedade responsável por informar a lista de registros vindos da API.

### `getPageParamName()`

Retorna o nome da propriedade responsável por informar o número da página de registros que a API
recebe como parâmetro.

### `getPageSizeParamName()`

Retorna o nome da propriedade responsável pela quantidade de registros que serão exibidos por página
que a API recebe como parâmetro.

### `hasNext()`

Retorna um valor `boolean`, responsável por informar se há uma nova página de registros disponível.

# PoMediaQueryTokens

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-media-query-tokens

Interface que define os tokens CSS utilizados em regras de media queries.
Cada chave representa uma variável CSS que pode ser dinamicamente modificada.

> Os tipos de valores aceitos para cada token são: `pixels` , `em` e `rem`.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `lg` | `{
    'gridSystemLgMinWidth': string;
    'gridSystemLgMaxWidth': string;
}` | sim | Define a regra para lg. |
| `md` | `{
    'gridSystemMdMinWidth': string;
    'gridSystemMdMaxWidth': string;
}` | sim | Define a regra para md. |
| `offset` | `{
    'gridSystemOffsetMinWidth': string;
    'gridSystemOffsetMaxWidth': string;
}` | sim | Define a regra offset. |
| `pull` | `{
    'gridSystemPullMaxWidth': string;
}` | sim | Define a regra pull. |
| `sm` | `{
    'gridSystemSmMaxWidth': string;
}` | sim | Define a regra para sm. |
| `xl` | `{
    'gridSystemXlMinWidth': string;
}` | sim | Define a regra xl. |

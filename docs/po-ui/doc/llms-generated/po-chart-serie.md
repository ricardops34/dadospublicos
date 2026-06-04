# PoChartSerie

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-chart-serie

Interface das series dinâmicas do `po-chart` que possibilita desenhar gráficos dos tipos `area`, `bar`, `column`, `line`, `donut`, `pie` e `radar`

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `areaStyle` | `boolean` | sim | Define se a série terá sua área preenchida. |
| `color` | `string` | sim | Determina a cor da série. As maneiras de customizar o *preset* padrão de cores são: |
| `data` | `number | Array<number>` | sim | Define a lista de valores para a série. Os tipos esperados são de acordo com o tipo de gráfico: |
| `from` | `number` | sim | Alcance inicial da cor. |
| `label` | `string` | sim | Rótulo referência da série. |
| `stackGroupName` | `string` | sim | Agrupa as séries em barras ou colunas que receberem o mesmo `stackGroupName`. Exemplo: |
| `to` | `number` | sim | Alcance final da cor. |
| `tooltip` | `string | ((params: any) => string)` | sim | Define o texto que será exibido na tooltip ao passar o mouse por cima das séries do *chart*. |
| `type` | `PoChartType` | sim | Define em qual tipo de gráfico que será exibida a série. É possível combinar séries dos tipos `column` e `line` no mesmo gráfico. Para isso, basta criar as séries com as configurações: |

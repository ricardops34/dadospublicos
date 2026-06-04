# PoChartOptions

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-chart-options

Interface* para configurações dos elementos do gráfico.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `areaStyle` | `boolean` | sim | Define se as séries terão sua área preenchida. |
| `axis` | `PoChartAxisOptions` | sim | Define um objeto do tipo `PoChartAxisOptions` para configuração dos eixos. |
| `borderRadius` | `number` | sim | Define borda entre os itens do gráfico. Válido para os gráficos `Donut`, `Pie`. |
| `bottomDataZoom` | `boolean | number` | sim | Define a distância inferior do componente DataZoom. |
| `dataZoom` | `boolean` | sim | Permite aplicar zoom ao gráfico com o scroll do mouse; |
| `descriptionChart` | `string` | sim | Define a descrição do gráfico exibido acima do gráfico. |
| `fillPoints` | `boolean` | sim | Define se os pontos do gráfico serão preenchidos. |
| `firstColumnName` | `string` | sim | Valor que permite customizar o nome da `TH` da primeira coluna da tabela descritiva. |
| `header` | `PoChartHeaderOptions` | sim | Define um objeto do tipo `PoChartHeaderOptions` para configurar a exibição de botões no cabeçalho do gráfico. |
| `innerRadius` | `number` | sim | Define o diâmetro, em valor percentual entre `0` e `100`, da área central para gráficos do tipo `donut`. |
| `legend` | `boolean` | sim | Define a exibição da legenda do gráfico. Valor padrão é `true` |
| `legendPosition` | `'left' | 'center' | 'right'` | sim | Define o alinhamento horizontal da legenda. |
| `legendType` | `'plain' | 'scroll'` | sim | Define o tipo da legenda. |
| `legendVerticalPosition` | `'top' | 'bottom'` | sim | Define a posição vertical da legenda no gráfico. |
| `pointer` | `boolean` | sim | Define a exibição do ponteiro. |
| `rendererOption` | `'canvas' | 'svg'` | sim | Define como o gráfico será renderizado. |
| `roseType` | `boolean` | sim | Transforma os gráficos do tipo `Donut` ou `Pie` num gráfico de área polar. |
| `showContainerGauge` | `boolean` | sim | Esconde a estilização do container em volta do gráfico. |
| `showFromToLegend` | `boolean` | sim | Exibe os valores das propriedades `from` e `to` no gráfico do no texto da legenda entre parênteses. |
| `stacked` | `boolean` | sim | Agrupa todas as séries numa única coluna ou barra por categoria. Essa propriedade sobrescreve a propriedade `stackGroupName` da interface `PoChartSerie` |
| `subtitleGauge` | `string` | sim | Define um subtítulo para o Gauge. Indicamos um subtítulo pequeno, com uma quantidade máxima de 32 caracteres na altura padrão. |
| `textCenterGraph` | `string` | sim | Aplica texto centralizado customizado nos gráficos de `Donut`. |

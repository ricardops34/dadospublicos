# PoGaugeOptions

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-gauge-options

Interface* para configurações dos elementos do gráfico.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `descriptionChart` | `string` | sim | Define a descrição do gráfico exibido acima do gráfico. |
| `header` | `PoChartHeaderOptions` | sim | Define um objeto do tipo `PoChartHeaderOptions` para configurar a exibição de botões no cabeçalho do gráfico. |
| `pointer` | `boolean` | sim | Define a exibição do ponteiro. |
| `showContainerGauge` | `boolean` | sim | Esconde a estilização do container em volta do gráfico. |
| `showFromToLegend` | `boolean` | sim | Exibe os valores das propriedades `from` e `to` no gráfico do no texto da legenda entre parênteses. |
| `subtitleGauge` | `string` | sim | Define um subtítulo para o Gauge. Indicamos um subtítulo pequeno, com uma quantidade máxima de 32 caracteres na altura padrão. |

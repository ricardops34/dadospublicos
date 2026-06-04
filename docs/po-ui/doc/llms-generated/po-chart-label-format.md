# PoChartLabelFormat

**Tipo:** Enum
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-chart-label-format

Enum* `PoChartLabelFormat` para especificação dos tipos de formatação do eixo de valor no gráfico.

## Valores

| Valor | Descrição |
|---|---|
| `Number` | Os valores serão exibidos no formato numérico com duas casas decimais. Equivalente ao formato `'1.2-2'` da [DecimalPipe](https://angular.io/api/common/DecimalPipe). |
| `Currency` | Os valores serão exibidos com o símbolo monetário de acordo com a formatação padrão da aplicação, isto é, o valor do token [DEFAULT_CURRENCY_CODE](https://angular.dev/api/core/DEFAULT_CURRENCY_CODE). Para adequar ao padrão numérico brasileiro, é necessário configurar o [LOCALE_ID](https://angular.dev/api/core/LOCALE_ID) da aplicação. A configuração pode ser feita da seguinte forma: |

# PoChartComponent

**Seletor:** `po-chart`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-chart

O `po-chart` é um componente para renderização de dados através de gráficos, com isso facilitando a compreensão e tornando a
visualização destes dados mais agradável.

Através de suas principais propriedades é possível definir atributos, tais como tipo de gráfico, altura, título, cores customizadas, opções para os eixos, entre outros.

O componente permite utilizar em conjunto séries do tipo linha e coluna.

Além disso, também é possível definir uma ação que será executada ao clicar em determinado elemento do gráfico
e outra que será executada ao passar o *mouse* sobre o elemento.

#### Guia de uso para Gráficos

> Veja nosso [guia de uso para gráficos](/guides/guide-charts) para auxiliar na construção do seu gráfico,
informando em qual caso utilizar, o que devemos evitar e boas práticas relacionada a cores.

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade | Descrição | Valor Padrão |
|------------------------------------------|-------------------------------------------------------------------------|---------------------------------------------------|
| **Chart (po-chart)** | | |
| `--background-color-grid` | Cor de background dos gráficos | `var(--color-neutral-light-00)` |
| `--color-description-chart` | Cor da descrição dos gráficos | `var(--color-neutral-dark-70)` |
| `--font-family-description-chart` | Fonte da descrição dos gráficos | `var(--font-family-theme)` |
| `--font-size-description-chart` | Tamanho da fonte da descrição dos gráficos | `var(--font-size-sm)` |
| `--font-weight-description-chart` | Peso da fonte da descrição dos gráficos | `var(--font-weight-normal)` |
| **Header (po-chart .po-chart-header )** | | |
| `--background-color` | Cor de background do cabeçalho | `var(--color-neutral-light-00)` |
| `--color` | Cor da fonte do cabeçalho | `var(--color-neutral-dark-70)` |
| `--font-family` | Família tipográfica usada | `var(--font-family-theme)` |
| `--font-size-title` | Tamanho da fonte | `var(--font-size-default)` |
| `--font-size-icons` | Tamanho dos ícones | `var(--font-size-md)` |
| `--font-weight` | Peso da fonte | `var(--font-weight-bold)` |
| **Chart (po-chart .po-chart)** | | |
| `--color-grid` | Cor da linha dos gráficos que possuem eixo | `var(--color-neutral-light-20)` |
| `--font-family-grid` | Família tipográfica usada nos valores dos eixos | `var(--font-family-theme)` |
| `--font-size-grid` | Tamanho da fonte usada nos valores dos eixos | `var(--font-size-xs)` |
| `--font-weight-grid` | Peso da fonte usada nos valores dos eixos | `var(--font-weight-normal)` |
| `--color-legend` | Cor da fonte da legenda | `var(--color-neutral-dark-70)` |
| `--color-legend-scroll-icon-active` | Cor do ícone de scroll da legenda no estado ativo, pro tipo `scroll` | `var(--color-action-default)` |
| `--color-legend-scroll-icon-inactive` | Cor do ícone de scroll da legenda no estado inativo, pro tipo `scroll` | `var(--color-action-disabled)` |
| `--border-radius-bar` | Tamanho da borda nos graficos `Bar` e `Column` | `var(--border-radius-none)` |
| `--border-color` | Cor da borda do gráfico nos Gráficos `Donut` e `Pie` | `var(--color-neutral-light-00)` |
| `--color-hightlight-value` | Cor do valor de destaque nos Gráficos `Donut` e `Gauge` | `var(--color-neutral-dark-70)` |
| `--font-family-hightlight-value` | Família tipográfica do valor de destaque nos Gráficos `Donut` e `Gauge` | `var(--font-family-theme)` |
| `--font-weight-hightlight-value` | Peso da fonte do valor de destaque nos Gráficos `Donut` e `Gauge` | `var(--font-weight-bold)` |
| `--color-base-gauge` | Cor da base do gráfico `Gauge` | `var(--color-neutral-light-20)` |
| `--color-gauge-pointer-color` | Cor do ponteiro do gráfico `Gauge` | `var(--color-neutral-dark-70)` |
| `--color-chart-line-point-fill` | Cor de dentro do círculo dos gráficos `Line` e `Area` | `var(--color-neutral-light-00)` |
| `--border-color-radar` | Cor do eixo da grid do gráfico `Radar` | `var(--color-neutral-light-30)` |
| `--color-background-zebra` | Cor das áreas alternadas (efeito zebrado) da grid do gráfico `Radar` | `var(--color-neutral-light-10)` |
| `--color-background-line` | Cor das áreas entre as faixas zebradas da grade do `Radar` | `none` |
| **Wrapper (.po-chart-container-gauge)** | | |
| `--background-color-container-gauge` | Cor de background do container do gauge | `var(--color-neutral-light-00)` |

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `categories` | `'p-categories'` | `Array<string> | PoChartRadarOptions` | sim | - | Define os valores utilizados na construção das categorias do gráfico. |
| `customActions` | `'p-custom-actions'` | `Array<PoPopupAction>` | sim | - | Essa propriedade permite que o desenvolvedor adicione ações customizadas no popup do header, oferecendo mais flexibilidade e controle sobre as interações do componente. |
| `dataLabel` | `'p-data-label'` | `PoChartDataLabel` | sim | - | Permite configurar as propriedades de exibição dos rótulos das séries no gráfico. |
| `height` | `'p-height'` | `number` | sim | `400` | Define a altura do gráfico em px. |
| `literals` | `'p-literals'` | `PoChartLiterals` | sim | - | Objeto com as literais usadas no `po-chart`. |
| `options` | `'p-options'` | `PoChartOptions` | sim | - | Objeto com as configurações usadas no `po-chart`. |
| `series` | `'p-series'` | `Array<PoChartSerie>` | não | - | Define os elementos do gráfico que serão criados dinamicamente. |
| `title` | `'p-title'` | `string` | sim | - | Define o título do gráfico. |
| `type` | `'p-type'` | `PoChartType` | sim | - | Define o tipo de gráfico. |
| `valueGaugeMultiple` | `'p-value-gauge-multiple'` | `number` | sim | - | Define o valor do gráfico do tipo `Gauge` quando utliza as propriedades `From` `To`. |

## Outputs

| Evento | Alias | Tipo | Descrição |
|---|---|---|---|
| `seriesClick` | `'p-series-click'` | `EventEmitter` | Evento executado quando o usuário clicar sobre um elemento do gráfico. |
| `seriesHover` | `'p-series-hover'` | `EventEmitter` | Evento executado quando o usuário passar o *mouse* sobre um elemento do gráfico. |

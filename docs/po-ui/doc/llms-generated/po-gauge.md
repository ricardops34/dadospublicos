# PoGaugeComponent

**Seletor:** `po-gauge`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-gauge

> ESSE COMPONENTE ESTÁ DEPRECIADO E SERÁ REMOVIDO NA v22.x.x. Indicamos a utilização do `po-chart` com `type` Gauge.

O componente `po-gauge` provê a representação de um valor através de um arco. É muito comum, por exemplo, para demonstrar o desempenho ou progresso de algo.
O `po-gauge` possui dois tipos de tratamentos:
- É possível demonstrar um dado percentual simples em conjunto com uma descrição resumida em seu interior;
- Para um demonstrativo mais elaborado, consegue-se definir alcances em cores, um breve texto descritivo e um ponteiro indicando o valor desejado.

#### Guia de uso para Gráficos

> Veja nosso [guia de uso para gráficos](/guides/guide-charts) para auxiliar na construção do seu gráfico,
informando em qual caso utilizar, o que devemos evitar e boas práticas relacionada a cores.

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `description` | `'p-description'` | `string` | sim | - | Define o texto que será exibido no gauge. |
| `height` | `'p-height'` | `number` | sim | `300px` | Define a altura do gauge. |
| `options` | `'p-options'` | `PoGaugeOptions` | sim | - | Objeto com as configurações usadas no `po-gauge`. |
| `ranges` | `'p-ranges'` | `Array<PoGaugeRanges>` | sim | - | Definição para o alcance de cores. Ao adicionar pelo menos um item na lista, |
| `showFromToLegend` | `'p-show-from-to-legend'` | `boolean` | sim | `false` | Define a exibição dos valores de `from` - `to` entre parênteses caso haja definição de `p-ranges`. |
| `showPointer` | `'p-show-pointer'` | `boolean` | sim | `true` | Define a exibição do ponteiro caso haja definição de `p-ranges`. |
| `title` | `'p-title'` | `string` | sim | - | Define o título do gauge. |
| `value` | `'p-value'` | `number` | sim | - | Valor referente ao valor da série. Seu comportamento segue a seguintes regras: |

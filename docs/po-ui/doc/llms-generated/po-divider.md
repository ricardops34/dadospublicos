# PoDividerComponent

**Seletor:** `po-divider`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-divider

Este componente apresenta uma linha demarcadora de blocos e pode conter um *label*. Seu uso é indicado para definição
e organização de informações em uma tela e sua característica é semelhante à tag `<hr>`.

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade | Descrição | Valor Padrão |
|----------------------------------------|-------------------------------------------------------|-------------------------------------------------|
| **Default Values** | | |
| `--color` | Cor principla do divider | `var(--color-neutral-mid-40)` |
| `--stroke-linecap` | Extremidade da linha | `round` |

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `borderWidth` | `'p-border-width'` | `string` | sim | `small` | Define a espessura da linha. |
| `label` | `'p-label'` | `string` | sim | - | Valor do rótulo a ser exibido. |

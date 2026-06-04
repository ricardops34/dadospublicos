# PoTagComponent

**Seletor:** `po-tag`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-tag

Este componente permite exibir um valor em forma de um marcador colorido, sendo possível definir uma legenda e realizar customizações
na cor, iconografia e tipo.

Além disso, é possível definir uma ação que será executada tanto ao *click* quanto através das teclas *enter/space* enquanto navega
utilizando a tecla *tab*.

Seu uso é recomendado para informações que necessitem de destaque em forma de marcação.

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade | Descrição | Valor Padrão |
|----------------------------------------|-------------------------------------------------------|-------------------------------------------------|
| **Default Values** | | |
| `--font-family` | Família tipográfica usada | `var(--font-family-theme)` |
| `--font-size` | Tamanho da fonte | `var(--font-size-sm)` |
| `--line-height` | Tamanho da label | `var(---line-height-sm)` |
| `--border-radius` | Contém o valor do raio dos cantos do elemento | `var(--border-radius-pill)` |
| `--gap` | Espaçamento entre o label e o value | `var(--spacing-xs)` |
| **Neutral** | | |
| `--color-neutral` | Cor principal no estado neutral | `var(--color-neutral-light-10)` |
| `--text-color-positive` | Cor do texto no estado neutral | `var(--color-neutral-dark-80)` |
| **Positive** | | |
| `--color-positive` | Cor principal no estado positive | `var(--color-feedback-positive-lightest)` |
| `--text-color-positive` | Cor do texto no estado positive | `var(--color-feedback-positive-dark)` |
| **Negative** | | |
| `--color-negative` | Cor principal no estado danger | `var(--color-feedback-negative-lightest)` |
| `--text-color-negative` | Cor do texto no estado danger | `var(--color-feedback-negative-darker)` |
| **Warning** | | |
| `--color-tag-warning` | Cor principal no estado warning | `var(--color-feedback-warning-lightest)` |
| `--text-color-warning` | Cor do texto no estado warning | `var(--color-feedback-warning-darkest)` |
| **Info** | | |
| `--color-info` | Cor principal no estado info | `var(--color-feedback-info-lightest)` |
| `--text-color-info` | Cor do texto no estado info | `var(--color-feedback-info-dark)` |
| **Removable** | | |
| `--color` | Cor principal quando removable | `var(--color-brand-01-lightest)` |
| `--border-color` | Cor de borda quando removable | `var(--color-brand-01-lighter)` |
| `--color-icon` | Cor do ícone quando removable | `var(--color-action-default)` |
| `--text-color` | Cor do texto quando removable | `var(--color-neutral-dark-80)` |
| `--color-hover` | Cor do hover no estado removable | `var(--color-brand-01-lighter)` |
| **Focused** | | |
| `--outline-color-focused` | Cor do outline do estado de focus | `var(--color-action-focus)` |
| **Disabled** | | |
| `--color-disabled` | Cor principal no estado disabled | `var(--color-neutral-light-20)` |
| `--border-color-disabled` | Cor da borda no estado disabled | `var(--color-action-disabled)` |
| `--color-icon-disabled` | Cor do icone no estado disabled | `var(--color-action-disabled)` |
| `--text-color-disabled` | Cor do texto no estado disabled | `var(--color-neutral-mid-60)` |

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `color` | `'p-color'` | `string` | sim | - | Determina a cor da tag. As maneiras de customizar as cores são: |
| `disabled` | `'p-disabled'` | `boolean` | sim | `false` | Desabilita o `po-tag` e não permite que o usuário interaja com o mesmo. |
| `icon` | `'p-icon'` | `string | boolean | TemplateRef<void>` | sim | `false` | Define ou ativa um ícone que será exibido ao lado do valor da *tag*. |
| `label` | `'p-label'` | `string` | sim | - | Define uma legenda que será exibida acima ou ao lado da *tag*, de acordo com a `p-orientation`. |
| `literals` | `'p-literals'` | `PoTagLiterals` | sim | - | Objeto com as literais usadas no `po-tag`. |
| `orientation` | `'p-orientation'` | `PoTagOrientation` | sim | `vertical` | Define o *layout* de exibição. |
| `removable` | `'p-removable'` | `boolean` | sim | `false` | Habilita a opção de remover a tag |
| `textColor` | `'p-text-color'` | `string` | sim | - | Determina a cor do texto da tag. As maneiras de customizar as cores são: |
| `type` | `'p-type'` | `PoTagType` | sim | `info` | Define o tipo da *tag*. |
| `value` | `'p-value'` | `string` | não | - | Texto da tag. |

## Outputs

| Evento | Alias | Tipo | Descrição |
|---|---|---|---|
| `click` | `'p-click'` | `EventEmitter` | Ação que será executada ao clicar sobre o `po-tag` e que receberá como parâmetro um objeto contendo o seu valor e tipo. |
| `remove` | `'p-close'` | `EventEmitter` | Ação que sera executada quando clicar sobre o ícone de remover no `po-tag` |

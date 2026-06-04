# PoProgressComponent

**Seletor:** `po-progress`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-progress

Componente de barra de progresso que possibilita exibir visualmente o progresso/carregamento de uma tarefa.

Este componente pode ser utilizado no *upload* de arquivos, uma atualização no sistema ou o processamento de uma imagem.

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade | Descrição | Valor Padrão |
|----------------------------------------|-------------------------------------------------------|-------------------------------------------------|
| **Default Values** | | |
| `--font-family` | Família tipográfica usada | `var(--font-family-theme)` |
| `--text-color` | Cor do texto | `var(--color-neutral-dark-90)` |
| **Error** | | |
| `--text-color-error` | Cor do texto no estado error | `var(--color-feedback-negative-dark)` |
| `--color-icon-error` | Cor do ícone no estado error | `var(--color-feedback-negative-dark)` |
| **po-progress-bar** | | |
| `--background-color-tray` | Cor do background | `var(--color-brand-01-lightest)` |
| `--background-color-indicator` | Cor do background do indicador | `var(--color-action-default)` |
| **po-progress-circle** | | |
| `--background-color-tray` | Cor do background | `var(--color-brand-01-lightest)` |
| `--background-color-indicator` | Cor do background do indicador | `var(--color-action-default)` |

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `ariaLabel` | `'p-aria-label'` | `string` | sim | - | Define um nome acessível para o elemento com `role="progressbar"`. |
| `customAction` | `'p-custom-action'` | `PoProgressAction` | sim | - | Permite definir uma ação personalizada no componente `po-progress`, exibindo um botão no canto inferior direito |
| `disabledCancel` | `'p-disabled-cancel'` | `boolean` | sim | `false` | Desabilita botão de cancelamento na parte inferior da barra de progresso. |
| `indeterminate` | `'p-indeterminate'` | `boolean` | sim | `false` | Habilita o modo indeterminado na barra de progresso, que mostra uma animação fixa sem um valor estabelecido. |
| `info` | `'p-info'` | `string` | sim | - | Informação adicional que aparecerá abaixo da barra de progresso ao lado direito. |
| `infoIcon` | `'p-info-icon'` | `string | TemplateRef<void>` | sim | - | Ícone que aparecerá ao lado do texto da propriedade `p-info`. |
| `radius` | `p-radius` | `number` | sim | `45` (automático) | Define o raio do círculo SVG em pixels. Permite ao usuário customizar o tamanho |
| `shape` | `p-shape` | `string` | sim | `bar` | Define o formato visual do componente de progresso. |
| `showPercentage` | `'p-show-percentage'` | `boolean` | sim | `false` | Ativa a exibição da porcentagem atual da barra de progresso. |
| `size` | `'p-size'` | `string` | sim | `large` | Define a expessura da barra de progresso. |
| `sizeActions` | `'p-size-actions'` | `string` | sim | `medium` | Define o tamanho das ações no componente com excessão da barra de progresso que pode ser ajustada através da propriedade `p-size`: |
| `status` | `'p-status'` | `PoProgressStatus` | sim | `PoProgressStatus.Default` | Status da barra de progresso que indicará visualmente ao usuário |
| `text` | `'p-text'` | `string` | sim | - | Texto principal que aparecerá abaixo da barra de progresso no lado esquerdo. |
| `value` | `'p-value'` | `number` | sim | `0` | Valor que representará o progresso. |

## Outputs

| Evento | Alias | Tipo | Descrição |
|---|---|---|---|
| `cancel` | `'p-cancel'` | `EventEmitter` | Evento que será disparado ao clicar no ícone de cancelamento ("x") na parte inferior da barra de progresso. |
| `customActionClick` | `'p-custom-action-click'` | `EventEmitter` | Evento emitido quando o botão definido em `p-custom-action` é clicado. Este evento retorna informações |
| `retry` | `'p-retry'` | `EventEmitter` | Evento que será disparado ao clicar no ícone de tentar novamente na parte inferior da barra de progresso. |

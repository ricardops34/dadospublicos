# PoTimepickerComponent

**Seletor:** `po-timepicker`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-timepicker

O `po-timepicker` é um componente para seleção de horário que permite a digitação e/ou seleção via painel flutuante.

O formato de exibição do horário pode ser de 24 horas (`HH:mm`) ou 12 horas (`hh:mm AM/PM`),
e opcionalmente incluir segundos (`HH:mm:ss`).

O valor de saída segue o formato ISO 8601 para horários (`HH:mm` ou `HH:mm:ss`).
*Importante:**

- Caso o valor digitado seja inválido, o `model` receberá uma string vazia.
- Caso o `input` esteja passando um `[(ngModel)]`, mas não tenha um `name`, então irá ocorrer um erro
do próprio Angular (`[ngModelOptions]="{standalone: true}"`).

> Não esqueça de importar o `FormsModule` em seu módulo, tal como para utilizar o `input default`.

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):
Obs: Só é possível realizar alterações ao adicionar a classe `.po-input`

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade | Descrição | Valor Padrão |
|----------------------------------------|-------------------------------------------------------|--------------------------------------------------|
| **Default Values** | | |
| `--font-family` | Família tipográfica usada | `var(--font-family-theme)` |
| `--font-size` | Tamanho da fonte | `var(--font-size-default)` |
| `--text-color-placeholder` | Cor do texto placeholder | `var(--color-neutral-light-30)` |
| `--color` | Cor principal do timepicker | `var(--color-neutral-dark-70)` |
| `--background` | Cor de background | `var(--color-neutral-light-05)` |
| `--padding` | Preenchimento | `0 0.5rem` |
| `--text-color` | Cor do texto | `var(--color-neutral-dark-90)` |
| `--field-container-title-justify` | Alinhamento horizontal do título (`justify-content`) | `space-between` |
| `--field-container-title-flex` | Flex do título (`flex`) | `1 auto` |
| **Hover** | | |
| `--color-hover` | Cor principal no estado hover | `var(--color-brand-01-dark)` |
| `--background-hover` | Cor de background no estado hover | `var(--color-brand-01-lightest)` |
| **Focused** | | |
| `--color-focused` | Cor principal no estado de focus | `var(--color-action-default)` |
| `--outline-color-focused` | Cor do outline do estado de focus | `var(--color-action-focus)` |
| **Disabled** | | |
| `--color-disabled` | Cor principal no estado disabled | `var(--color-neutral-light-30)` |
| `--background-disabled` | Cor de background no estado disabled | `var(--color-neutral-light-20)` |
| `--text-color-disabled` | Cor do texto no estado disabled | `var(--color-neutral-dark-70)` |

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `appendBox` | `'p-append-in-body'` | `boolean` | sim | `false` | Define que o painel do timer será incluído no body da página. |
| `autoFocus` | `'p-auto-focus'` | `boolean` | sim | `false` | Aplica foco no elemento ao ser iniciado. |
| `compactLabel` | `p-compact-label` | `boolean` | sim | `false` | Define se o título do campo será exibido de forma compacta. |
| `errorLimit` | `'p-error-limit'` | `boolean` | sim | `false` | Limita a exibição da mensagem de erro a duas linhas e exibe um tooltip com o texto completo. |
| `errorPattern` | `'p-error-pattern'` | `string` | sim | - | Mensagem apresentada quando o horário for inválido ou fora do período. |
| `format` | `'p-format'` | `PoTimerFormat` | sim | `24` | Define o formato de exibição do timer. |
| `help` | `'p-help'` | `string` | sim | - | Texto de apoio do campo. |
| `label` | `'p-label'` | `string` | sim | - | Rótulo do campo. |
| `labelTextWrap` | `p-label-text-wrap` | `boolean` | sim | `false` | Habilita a quebra automática do texto da propriedade `p-label`. |
| `loading` | `'p-loading'` | `boolean` | sim | `false` | Exibe um ícone de carregamento no lado direito do campo para sinalizar que uma operação está em andamento. |
| `locale` | `'p-locale'` | `string` | sim | - | Idioma do componente. |
| `maxTime` | `'p-max-time'` | `string` | sim | - | Define o horário máximo permitido. Formato: `HH:mm` ou `HH:mm:ss`. |
| `minTime` | `'p-min-time'` | `string` | sim | - | Define o horário mínimo permitido. Formato: `HH:mm` ou `HH:mm:ss`. |
| `minuteInterval` | `'p-minute-interval'` | `number` | sim | `5` | Define o intervalo entre os minutos exibidos no painel. |
| `modelFormat` | `'p-model-format'` | `PoTimepickerModelFormat` | sim | - | Padrão de formatação para saída do *model*. |
| `name` | `'name'` | `string` | não | - | Nome do componente. |
| `noAutocomplete` | `'p-no-autocomplete'` | `boolean` | sim | `false` | Define a propriedade nativa `autocomplete` do campo como `off`. |
| `optional` | `'p-optional'` | `boolean` | sim | `false` | Define se a indicação de campo opcional será exibida. |
| `placeholder` | `'p-placeholder'` | `string` | sim | - | Mensagem que aparecerá enquanto o campo não estiver preenchido. |
| `poHelperComponent` | `p-helper` | `PoHelperOptions | string` | sim | - | Define as opções do componente de ajuda (po-helper). |
| `secondInterval` | `'p-second-interval'` | `number` | sim | `1` | Define o intervalo entre os segundos exibidos no painel. |
| `showErrorMessageRequired` | `'p-required-field-error-message'` | `boolean` | sim | `false` | Exibe a mensagem setada na propriedade `p-error-pattern` se o campo estiver vazio e for requerido. |
| `showRequired` | `'p-show-required'` | `boolean` | não | - | Define se a indicação de campo obrigatório será exibida. |
| `showSeconds` | `'p-show-seconds'` | `boolean` | sim | `false` | Exibe a coluna de segundos no painel. |
| `size` | `'p-size'` | `string` | sim | `medium` | Define o tamanho do componente: |

## Outputs

| Evento | Alias | Tipo | Descrição |
|---|---|---|---|
| `keydown` | `'p-keydown'` | `EventEmitter` | Evento disparado quando uma tecla é pressionada enquanto o foco está no componente. |
| `onblur` | `'p-blur'` | `EventEmitter` | Evento disparado ao sair do campo. |
| `onchange` | `'p-change'` | `EventEmitter` | Evento disparado ao alterar valor do campo. |

## Métodos

### `focus()`

Função que atribui foco ao componente.

Para utilizá-la é necessário ter a instância do componente no DOM, podendo ser utilizado o ViewChild da seguinte forma:

```
import { PoTimepickerComponent } from '@po-ui/ng-components';

...

@ViewChild(PoTimepickerComponent, { static: true }) timepicker: PoTimepickerComponent;

focusTimepicker() {
  this.timepicker.focus();
}
```

### `showAdditionalHelp()`

Método que exibe `p-helper` ou executa a ação definida em `p-helper{eventOnClick}` ou em `p-additionalHelp`.

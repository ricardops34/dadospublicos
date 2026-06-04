# PoDatepickerComponent

**Seletor:** `po-datepicker`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-datepicker

O `po-datepicker` é um componente específico para manipulação de datas permitindo a digitação e / ou seleção.

O formato de exibição da data, ou seja, o formato que é apresentado ao usuário é o dd/mm/yyyy,
mas podem ser definidos outros padrões (veja mais na propriedade `p-format`).

O idioma padrão do calendário será exibido de acordo com o navegador, caso tenha necessidade de alterar
use a propriedade `p-locale`.

O datepicker aceita três formatos de data: o E8601DZw (yyyy-mm-ddThh:mm:ss+|-hh:mm), o E8601DAw (yyyy-mm-dd) e o
Date padrão do Javascript.

> Por padrão, o formato de saída do *model* se ajustará conforme o formato de entrada. Se por acaso precisar controlar o valor de saída,
a propriedade `p-iso-format` provê esse controle independentemente do formato de entrada. Veja abaixo os formatos disponíveis:

- Formato de entrada e saída (E8601DZw) - `'2017-11-28T00:00:00-02:00'`;

- Formato de entrada e saída (E8601DAw) - `'2017-11-28'`;

- Formato de entrada (Date) - `new Date(2017, 10, 28)` e saída (E8601DAw) - `'2017-11-28'`;
*Importante:**

- Para utilizar datas com ano inferior a 100, verificar o comportamento do [`new Date`](https://www.w3schools.com/js/js_dates.asp)
e utilizar o método [`setFullYear`](https://www.w3schools.com/jsref/jsref_setfullyear.asp).
- Caso a data esteja inválida, o `model` receberá **'Data inválida'**.
- Caso o `input` esteja passando um `[(ngModel)]`, mas não tenha um `name`, então irá ocorrer um erro
do próprio Angular (`[ngModelOptions]="{standalone: true}"`).

Exemplo:

```
<po-datepicker
  [(ngModel)]="pessoa.nome"
  [ngModelOptions]="{standalone: true}"
</po-datepicker>
```

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
| `--text-color-placeholder` | Cor principal do texto do placeholder | `var(--color-neutral-light-30)` |
| `--color` | Cor principal do datepicker | `var(--color-neutral-dark-70)` |
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
| `additionalHelpTooltip` | `'p-additional-help-tooltip'` | `string` | sim | - | Exibe um ícone de ajuda adicional, com o texto desta propriedade sendo passado para o popover do componente `po-helper`. |
| `appendBox` | `'p-append-in-body'` | `boolean` | sim | `false` | Define que o `calendar` e/ou tooltip (`p-additional-help-tooltip` e/ou `p-error-limit`) serão incluídos no body da |
| `autoFocus` | `'p-auto-focus'` | `boolean` | sim | `false` | Aplica foco no elemento ao ser iniciado. |
| `compactLabel` | `p-compact-label` | `boolean` | sim | `false` | Define se o título do campo será exibido de forma compacta. |
| `errorAsync` | `'p-error-async'` | `(value) => Observable<boolean>` | sim | - | Função executada para realizar a validação assíncrona personalizada. |
| `errorLimit` | `'p-error-limit'` | `boolean` | sim | `false` | Limita a exibição da mensagem de erro a duas linhas e exibe um tooltip com o texto completo. |
| `errorPattern` | `'p-error-pattern'` | `string` | sim | - | Mensagem apresentada quando a data for inválida ou fora do período. |
| `format` | `'p-format'` | `string` | sim | `dd/mm/yyyy` | Formato de exibição da data. |
| `help` | `'p-help'` | `string` | sim | - | Texto de apoio do campo. |
| `isoFormat` | `'p-iso-format'` | `PoDatepickerIsoFormat` | sim | - | Padrão de formatação para saída do *model*, independentemente do formato de entrada. |
| `label` | `'p-label'` | `string` | sim | - | Rótulo do campo. |
| `labelTextWrap` | `p-label-text-wrap` | `boolean` | sim | `false` | Habilita a quebra automática do texto da propriedade `p-label`. Quando `p-label-text-wrap` for verdadeiro, o texto que excede |
| `loading` | `'p-loading'` | `boolean` | sim | `false` | Exibe um ícone de carregamento no lado direito do campo para sinalizar que uma operação está em andamento. |
| `maxDate` | `'p-max-date'` | `string | Date` | sim | - | Define uma data máxima para o `po-datepicker`. |
| `minDate` | `'p-min-date'` | `string | Date` | sim | - | Define uma data mínima para o `po-datepicker`. |
| `mode` | `'p-mode'` | `'month-year' | 'year'` | sim | - | Define o modo de operação do datepicker. |
| `noAutocomplete` | `'p-no-autocomplete'` | `boolean` | sim | `false` | Define a propriedade nativa `autocomplete` do campo como `off`. |
| `optional` | `'p-optional'` | `boolean` | sim | `false` | Define se a indicação de campo opcional será exibida. |
| `placeholder` | `'p-placeholder'` | `string` | sim | - | Mensagem que aparecerá enquanto o campo não estiver preenchido. |
| `poHelperComponent` | `p-helper` | `PoHelperOptions | string` | sim | - | Define as opções do componente de ajuda (po-helper) que será exibido ao lado do label quando a propriedade `p-label` for definida, ou, ao lado do componente na ausência da propriedade `p-label`. |
| `showErrorMessageRequired` | `'p-required-field-error-message'` | `boolean` | sim | `false` | Exibe a mensagem setada na propriedade `p-error-pattern` se o campo estiver vazio e for requerido. |
| `showRequired` | `'p-show-required'` | `boolean` | não | - | Define se a indicação de campo obrigatório será exibida. |
| `size` | `'p-size'` | `string` | sim | `medium` | Define o tamanho do componente: |
| `yearRangeLimit` | `'p-year-range-limit'` | `number` | sim | 150 | Define o limite de anos exibidos nas variações `month-year` e `year`, |

## Outputs

| Evento | Alias | Tipo | Descrição |
|---|---|---|---|
| `additionalHelp` | `'p-additional-help'` | `EventEmitter` | Evento disparado ao clicar no ícone de ajuda adicional. |
| `keydown` | `'p-keydown'` | `EventEmitter` | Evento disparado quando uma tecla é pressionada enquanto o foco está no componente. |
| `onblur` | `'p-blur'` | `EventEmitter` | Evento disparado ao sair do campo. |
| `onchange` | `'p-change'` | `EventEmitter` | Evento disparado ao alterar valor do campo. |

## Métodos

### `focus()`

Função que atribui foco ao componente.

Para utilizá-la é necessário ter a instância do componente no DOM, podendo ser utilizado o ViewChild da seguinte forma:

```
import { PoDatepickerComponent } from '@po-ui/ng-components';

...

@ViewChild(PoDatepickerComponent, { static: true }) datepicker: PoDatepickerComponent;

focusDatepicker() {
  this.datepicker.focus();
}
```

### `showAdditionalHelp()`

Método que exibe `p-helper` ou executa a ação definida em `p-helper{eventOnClick}` ou em `p-additionalHelp`.
Para isso, será necessário configurar uma tecla de atalho utilizando o evento `p-keydown`.

> Exibe ou oculta o conteúdo do componente `po-helper` quando o componente estiver com foco.

```
// Exemplo com p-label e p-helper
<po-datepicker
 #datepicker
 ...
 p-label="Label do datepicker"
 [p-helper]="helperOptions"
 (p-keydown)="onKeyDown($event, datepicker)"
></po-datepicker>
```
```
...
onKeyDown(event: KeyboardEvent, inp: PoDatepickerComponent): void {
 if (event.code === 'F9') {
   inp.showAdditionalHelp();
 }
}
```

# PoInputComponent

**Seletor:** `po-input`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-input

Este é um componente baseado em input, com várias propriedades do input nativo e outras
propriedades extras como: máscara, pattern, mensagem de erro e etc.
Você deve informar a variável que contém o valor como [(ngModel)]="variavel", para que o
input receba o valor da variável e para que ela receba as alterações do valor (two-way-databinding).
A propriedade name é obrigatória para que o formulário e o model funcionem corretamente.

Importante:

- Caso o input tenha um [(ngModel)] sem o atributo name, ocorrerá um erro de angular.
Então você precisa informar o atributo name ou o atributo [ngModelOptions]="{standalone: true}".
Exemplo: [(ngModel)]="pessoa.nome" [ngModelOptions]="{standalone: true}".

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

Obs: Só é possível realizar alterações ao adicionar a classe `.po-input`

> Para correto alinhamento é recomendado o uso das classes de espaçamento do [Grid System](https://po-ui.io/guides/grid-system).

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade | Descrição | Valor Padrão |
|----------------------------------------|-------------------------------------------------------|-------------------------------------------------|
| **Default Values** | | |
| `--font-family` | Família tipográfica usada | `var(--font-family-theme)` |
| `--font-size` | Tamanho da fonte | `var(--font-size-default)` |
| `--text-color-placeholder` | Cor do texto placeholder | `var(--color-neutral-light-30)` |
| `--color` | Cor pincipal do input | `var(--color-neutral-dark-70)` |
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
| `appendBox` | `'p-append-in-body'` | `boolean` | sim | `false` | Define que o popover (`p-helper` e/ou `p-error-limit`) será incluído no body da página e não |
| `autoFocus` | `'p-auto-focus'` | `boolean` | sim | `false` | Aplica foco no elemento ao ser iniciado. |
| `compactLabel` | `p-compact-label` | `boolean` | sim | `false` | Define se o título do campo será exibido de forma compacta. |
| `emitAllChanges` | `'p-emit-all-changes'` | `boolean` | sim | `false` | Sempre emite as alterações do model mesmo quando o valor atual for igual ao valor anterior. |
| `errorAsyncProperties` | `'p-error-async-properties'` | `ErrorAsyncProperties` | sim | - | Realiza alguma validação customizada assíncrona no componente. |
| `errorLimit` | `'p-error-limit'` | `boolean` | sim | `false` | Limita a exibição da mensagem de erro a duas linhas e exibe um tooltip com o texto completo. |
| `errorPattern` | `'p-error-pattern'` | `string` | sim | - | Mensagem que será apresentada quando o `pattern` ou a máscara não for satisfeita. |
| `help` | `'p-help'` | `string` | sim | - | Texto de apoio do campo. |
| `icon` | `'p-icon'` | `string | TemplateRef<void>` | sim | - | Define o ícone que será exibido no início do campo. |
| `label` | `'p-label'` | `string` | sim | - | Rótulo do campo. |
| `labelTextWrap` | `p-label-text-wrap` | `boolean` | sim | `false` | Habilita a quebra automática do texto da propriedade `p-label`. Quando `p-label-text-wrap` for verdadeiro, o texto que excede |
| `loading` | `'p-loading'` | `boolean` | sim | `false` | Exibe um ícone de carregamento no lado direito do campo para sinalizar que uma operação está em andamento. |
| `maskNoLengthValidation` | `'p-mask-no-length-validation'` | `boolean` | não | `false` | Controla como o componente aplica as validações de comprimento mínimo (`minLength`) e máximo (`maxLength`) quando há uma máscara (`p-mask`) definida. |
| `maxlength` | `'p-maxlength'` | `number` | sim | - | Indica a quantidade máxima de caracteres que o campo aceita. |
| `minlength` | `'p-minlength'` | `number` | sim | - | Indica a quantidade mínima de caracteres que o campo aceita. |
| `name` | `'name'` | `string` | não | - | Nome e identificador do campo. |
| `noAutocomplete` | `'p-no-autocomplete'` | `boolean` | sim | `false` | Define a propriedade nativa `autocomplete` do campo como `off`. |
| `optional` | `'p-optional'` | `boolean` | sim | `false` | Define se a indicação de campo opcional será exibida. |
| `placeholder` | `'p-placeholder'` | `string` | sim | '' | Mensagem que aparecerá enquanto o campo não estiver preenchido. |
| `poHelperComponent` | `p-helper` | `PoHelperOptions | string` | sim | - | Define as opções do componente de ajuda (po-helper) que será exibido ao lado do label quando a propriedade `p-label` for definida, ou, ao lado do componente na ausência da propriedade `p-label`. |
| `showErrorMessageRequired` | `'p-required-field-error-message'` | `boolean` | sim | `false` | Exibe a mensagem setada na propriedade `p-error-pattern` se o campo estiver vazio e for requerido. |
| `showRequired` | `'p-show-required'` | `boolean` | não | - | Define se a indicação de campo obrigatório será exibida. |
| `size` | `'p-size'` | `string` | sim | `medium` | Define o tamanho do componente: |
| `upperCase` | `'p-upper-case'` | `boolean` | não | - | Converte o conteúdo do campo em maiúsulo automaticamente. |

## Outputs

| Evento | Alias | Tipo | Descrição |
|---|---|---|---|
| `additionalHelp` | `'p-additional-help'` | `EventEmitter` | Evento disparado ao clicar no ícone de ajuda adicional. |
| `blur` | `'p-blur'` | `EventEmitter` | Evento disparado ao sair do campo. |
| `change` | `'p-change'` | `EventEmitter` | Evento disparado ao alterar valor e deixar o campo. |
| `changeModel` | `'p-change-model'` | `EventEmitter` | Evento disparado ao alterar valor do model. |
| `enter` | `'p-enter'` | `EventEmitter` | Evento disparado ao entrar do campo. |
| `keydown` | `'p-keydown'` | `EventEmitter` | Evento disparado quando uma tecla é pressionada enquanto o foco está no componente. |

## Métodos

### `showAdditionalHelp()`

Método que exibe `p-helper` ou executa a ação definida em `p-helper{eventOnClick}` ou em `p-additionalHelp`.
Para isso, será necessário configurar uma tecla de atalho utilizando o evento `p-keydown`.

> Exibe ou oculta o conteúdo do componente `po-helper` quando o componente estiver com foco.

```
// Exemplo com p-label e p-helper
<po-nome-component
 #component
 ...
 p-label="Label do componente"
 [p-helper]="helperOptions"
 (p-keydown)="onKeyDown($event, component)"
></po-nome-component>
```

```
...
onKeyDown(event: KeyboardEvent, inp: PoNomeDoComponente): void {
 if (event.code === 'F9') {
   inp.showAdditionalHelp();
 }
}
```

### `focus()`

Função que atribui foco ao componente.

Para utilizá-la é necessário ter a instância do componente no DOM, podendo ser utilizado o ViewChild da seguinte forma:

```
import { PoNomeDoComponenteComponent } from '@po-ui/ng-components';

...

@ViewChild(PoNomeDoComponenteComponent, { static: true }) nomeDoComponente: PoNomeDoComponenteComponent;

focusComponent() {
  this.nomeDoComponente.focus();
}
```

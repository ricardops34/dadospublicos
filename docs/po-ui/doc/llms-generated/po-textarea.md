# PoTextareaComponent

**Seletor:** `po-textarea`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-textarea

Este é um componente de entrada de dados que possibilita o preechimento com múltiplas linhas.
É recomendado para observações, detalhamentos e outras situações onde o usuário deva preencher com um texto.

Importante:

- A propriedade `name` é obrigatória para que o formulário e o `model` funcionem corretamente. Do contrário, ocorrerá um erro de
_Angular_, onde será necessário informar o atributo `name` ou o atributo `[ngModelOptions]="{standalone: true}"`, por exemplo:

```
<po-textarea
  [(ngModel)]="pessoa.nome"
  [ngModelOptions]="{standalone: true}">
</po-textarea>
```

#### Acessibilidade tratada no componente
Algumas diretrizes de acessibilidade já são tratadas no componente, internamente, e não podem ser alteradas. São elas:

- O Text area foi desenvolvido com uso de controles padrões HTML, o que permite a identificação do mesmo na interface por tecnologias
assistivas. [WCAG 4.1.2: Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value)
- O foco é visível e possui uma espessura superior a 2 pixels CSS, não ficando escondido por outros
elementos da tela. [WCAG 2.4.12: Focus Appearance)](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance-enhanced)
- A identificação do erro acontece também através da mudança de cor do campo, mas também de um ícone
junto da mensagem. [WGAG 1.4.1: Use of Color, 3.2.4: Consistent Identification](https://www.w3.org/WAI/WCAG21/Understanding/use-of-color)

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade | Descrição | Valor Padrão |
|----------------------------------------|-------------------------------------------------------|-------------------------------------------------|
| **Default Values** | | |
| `--font-family` | Família tipográfica usada | `var(--font-family-theme)` |
| `--font-size` | Tamanho da fonte | `var(--font-size-default)` |
| `--text-color-placeholder` | Cor do texto placeholder | `var(--color-neutral-light-30)` |
| `--color` | Cor pincipal do campo | `var(--color-neutral-dark-70)` |
| `--background` | Cor de background | `var(--color-neutral-light-05)` |
| `--field-container-title-justify` | Alinhamento horizontal do título (`justify-content`) | `space-between` |
| `--field-container-title-flex` | Flex do título (`flex`) | `1 auto` |

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `additionalHelpTooltip` | `'p-additional-help-tooltip'` | `string` | sim | - | Exibe um ícone de ajuda adicional, com o texto desta propriedade sendo passado para o popover do componente `po-helper`. |
| `appendBox` | `'p-append-in-body'` | `boolean` | sim | `false` | Define que o popover (`p-helper` e/ou `p-error-limit`) será incluído no body da página e não |
| `autoFocus` | `'p-auto-focus'` | `boolean` | sim | `false` | Aplica foco no elemento ao ser iniciado. |
| `compactLabel` | `p-compact-label` | `boolean` | sim | `false` | Define se o título do campo será exibido de forma compacta. |
| `disabled` | `'p-disabled'` | `boolean` | sim | `false` | Indica que o campo será desabilitado. |
| `errorLimit` | `'p-error-limit'` | `boolean` | sim | `false` | Limita a exibição da mensagem de erro a duas linhas e exibe um tooltip com o texto completo. |
| `fieldErrorMessage` | `'p-field-error-message'` | `string` | sim | - | Exibe a mensagem setada se o campo estiver vazio e for requerido. |
| `help` | `'p-help'` | `string` | sim | - | Texto de apoio do campo. |
| `label` | `'p-label'` | `string` | sim | - | Label do campo. |
| `labelTextWrap` | `p-label-text-wrap` | `boolean` | sim | `false` | Habilita a quebra automática do texto da propriedade `p-label`. Quando `p-label-text-wrap` for verdadeiro, o texto que excede |
| `loading` | `'p-loading'` | `boolean` | sim | `false` | Exibe um ícone de carregamento no lado direito do campo para sinalizar que uma operação está em andamento. |
| `maxlength` | `'p-maxlength'` | `number` | sim | - | Indica a quantidade máxima de caracteres que o campo aceita. |
| `minlength` | `'p-minlength'` | `number` | sim | - | Indica a quantidade mínima de caracteres que o campo aceita. |
| `name` | `'name'` | `string` | não | - | Nome e Id do componente. |
| `optional` | `'p-optional'` | `boolean` | sim | `false` | Define se a indicação de campo opcional será exibida. |
| `placeholder` | `'p-placeholder'` | `string` | não | - | Placeholder, mensagem que aparecerá enquanto o campo não estiver preenchido. |
| `poHelperComponent` | `p-helper` | `PoHelperOptions | string` | sim | - | Define as opções do componente de ajuda (po-helper) que será exibido ao lado do label quando a propriedade `p-label` for definida, ou, ao lado do componente na ausência da propriedade `p-label`. |
| `readonly` | `'p-readonly'` | `boolean` | sim | `false` | Indica que o campo será somente leitura. |
| `required` | `'p-required'` | `boolean` | sim | `false` | Define que o campo será obrigatório. |
| `rows` | `'p-rows'` | `number` | sim | `3` | Indica a quantidade de linhas que serão exibidas. |
| `showRequired` | `'p-show-required'` | `boolean` | não | - | Define se a indicação de campo obrigatório será exibida. |
| `size` | `'p-size'` | `string` | sim | `medium` | Define o tamanho do componente: |

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

### `focus()`

Função que atribui foco ao componente.

Para utilizá-la é necessário ter a instância do componente no DOM, podendo ser utilizado o ViewChild da seguinte forma:

```
import { PoTextareaComponent } from '@po-ui/ng-components';

...

@ViewChild(PoTextareaComponent, { static: true }) textarea: PoTextareaComponent;

focusTextarea() {
  this.textarea.focus();
}
```

### `showAdditionalHelp()`

Método que exibe `p-helper` ou executa a ação definida em `p-helper{eventOnClick}` ou em `p-additionalHelp`.
Para isso, será necessário configurar uma tecla de atalho utilizando o evento `p-keydown`.

> Exibe ou oculta o conteúdo do componente `po-helper` quando o componente estiver com foco.

```
//Exemplo com p-label e p-helper
<po-textarea
 #textarea
 ...
 p-label="Label do textarea"
 [p-helper]="helperOptions"
 (p-keydown)="onKeyDown($event, textarea)"
></po-textarea>
```
```
...
onKeyDown(event: KeyboardEvent, inp: PoTextareaComponent): void {
 if (event.code === 'F9') {
   inp.showAdditionalHelp();
 }
}
```

# PoCheckboxComponent

**Seletor:** `po-checkbox`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-checkbox

O componente `po-checkbox` exibe uma caixa de opção com um texto ao lado, na qual é possível marcar e desmarcar através tanto
no *click* do *mouse* quanto por meio da tecla *space* quando estiver com foco.

Cada opção poderá receber um estado de marcado, desmarcado, indeterminado/mixed e desabilitado, como também uma ação que será disparada quando
ocorrer mudanças do valor.

> O *model* deste componente aceitará valores igual à `true`, `false` ou `null` para quando for indeterminado/mixed.
*Acessibilidade tratada no componente:**

Algumas diretrizes de acessibilidade já são tratadas no componente, internamente, e não podem ser alteradas pelo proprietário do conteúdo. São elas:

- O componente foi desenvolvido utilizando controles padrões HTML para permitir a identificação do mesmo na interface por tecnologias assistivas. [WCAG 4.1.2: Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value)
- A área do foco precisar ter uma espessura de pelo menos 2 pixels CSS e o foco não pode ficar escondido por outros elementos da tela. [WCAG 2.4.12: Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance-enhanced)
- A cor não deve ser o único meio para diferenciar o componente do seu estado marcado e desmarcado. [WGAG 1.4.1: Use of Color, 3.2.4: Consistent Identification](https://www.w3.org/WAI/WCAG21/Understanding/use-of-color)

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade | Descrição | Valor Padrão |
|----------------------------------------|--------------------------------------------------------------|-------------------------------------------------|
| **Default Values** | | |
| `--border-color` | Cor da borda | `var(--color-neutral-dark-70)` |
| `--color-unchecked` | Cor quando não selecionado | `var(--color-neutral-light-00)` |
| `--color-checked` | Cor quando selecionado | `var(--color-action-default)` |
| `--field-container-title-justify` | Alinhamento horizontal do título (`justify-content`) | `space-between` |
| `--field-container-title-flex` | Flex do título (`flex`) | `1 auto` |
| **Hover** | | |
| `--color-hover` | Cor principal no estado hover | `var(--color-action-hover)` |
| `--shadow-color-hover` | Cor da sombra no estado hover | `var(--color-brand-01-lighter)` |
| **Focused** | | |
| `--outline-color-focused` | Cor do outline do estado de focus | `var(--color-action-focus)` |
| **Disabled** | | |
| `--color-unchecked-disabled` | Cor pricipal quando não selecionado no estado disabled | `var(--color-action-disabled)` |
| `--color-checked-disabled` | Cor pricipal quando selecionado no estado disabled | `var(--color-neutral-dark-70)` |

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `additionalHelpTooltip` | `'p-additional-help-tooltip'` | `string` | sim | - | Exibe um ícone de ajuda adicional, com o texto desta propriedade sendo passado para o popover do componente `po-helper`. |
| `appendBox` | `'p-append-in-body'` | `boolean` | sim | `false` | Define que o popover (`p-helper`) será incluído no body da página e não dentro do componente. Essa |
| `autoFocus` | `'p-auto-focus'` | `boolean` | sim | `false` | Aplica foco no elemento ao ser iniciado. |
| `compactLabel` | `p-compact-label` | `boolean` | sim | `false` | Define se o título do campo será exibido de forma compacta. |
| `disabled` | `'p-disabled'` | `boolean` | sim | `false` | Define o estado do *checkbox* como desabilitado. |
| `help` | `'p-help'` | `string` | sim | - | Texto de apoio do campo |
| `label` | `'p-label'` | `string` | sim | - | Texto de exibição do *checkbox*. |
| `labelTextWrap` | `p-label-text-wrap` | `boolean` | sim | `false` | Habilita a quebra automática do texto da propriedade `p-label`. Quando `p-label-text-wrap` for verdadeiro, o texto que excede |
| `name` | `'name'` | `string` | não | - | Define o nome do *checkbox*. |
| `poHelperComponent` | `p-helper` | `PoHelperOptions | string` | sim | - | Define as opções do componente de ajuda (po-helper) que será exibido ao lado do label quando a propriedade `p-label` for definida, ou, ao lado do componente na ausência da propriedade `p-label`. |
| `size` | `'p-size'` | `string` | sim | `medium` | Define o tamanho da caixa de seleção do componente: |

## Outputs

| Evento | Alias | Tipo | Descrição |
|---|---|---|---|
| `additionalHelp` | `'p-additional-help'` | `EventEmitter` | Evento disparado ao clicar no ícone de ajuda adicional. |
| `blur` | `'p-blur'` | `EventEmitter` | Evento disparado ao sair do campo. |
| `change` | `'p-change'` | `EventEmitter` | Evento disparado quando o valor do *checkbox* for alterado. |
| `keydown` | `'p-keydown'` | `EventEmitter` | Evento disparado quando uma tecla é pressionada enquanto o foco está no componente. |

## Métodos

### `focus()`

Função que atribui foco ao *checkbox*.

Para utilizá-la é necessário capturar a referência do componente no DOM através do `ViewChild`, como por exemplo:

```
...
import { ViewChild } from '@angular/core';
import { PoCheckboxComponent } from '@po-ui/ng-components';

...

@ViewChild(PoCheckboxComponent, { static: true }) checkbox: PoCheckboxComponent;

focusCheckbox() {
  this.checkbox.focus();
}
```

### `showAdditionalHelp()`

Método que exibe `p-helper` ou executa a ação definida em `p-helper{eventOnClick}` ou em `p-additionalHelp`.
Para isso, será necessário configurar uma tecla de atalho utilizando o evento `p-keydown`.

> Exibe ou oculta o conteúdo do componente `po-helper` quando o componente estiver com foco.

```
//Exemplo com label e p-helper
<po-checkbox
 #checkbox
 ...
 p-label="Label do checkbox"
 [p-helper]="helperOptions"
 (p-keydown)="onKeyDown($event, checkbox)"
></po-checkbox>
```
```
...
onKeyDown(event: KeyboardEvent, inp: PoCheckboxComponent): void {
 if (event.code === 'F9') {
   inp.showAdditionalHelp();
 }
}
```

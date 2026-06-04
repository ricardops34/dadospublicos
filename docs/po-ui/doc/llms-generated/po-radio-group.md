# PoRadioGroupComponent

**Seletor:** `po-radio-group`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-radio-group

O componente `po-radio-group` deve ser utilizado para disponibilizar múltiplas opções ao usuário, permitindo a ele que
selecione apenas uma delas. Seu uso é recomendado para um número pequeno de opções, caso contrário, recomenda-se o uso
do [**po-combo**](/documentation/po-combo) ou [**po-select**](/documentation/po-select).

Este não é um componente de multiseleção, se for este o caso, deve-se utilizar o
[**po-checkbox-group**](/documentation/po-checkbox-group).

> Ao passar um valor para o *model* que não esteja na lista de opções, o mesmo será definido como `undefined`.

#### Acessibilidade tratada no componente interno `po-radio`:

Algumas diretrizes de acessibilidade já são tratadas no componente, internamente, e não podem ser alteradas pelo proprietário do conteúdo. São elas:

- O componente foi desenvolvido utilizando controles padrões HTML para permitir a identificação do mesmo na interface por tecnologias assistivas. [WCAG 4.1.2: Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value)
- A cor não deve ser o único meio para diferenciar o radio button normal do selecionado, por isso deve-se manter uma diferença visual entre os estados. [WGAG 1.4.1: Use of Color, 3.2.4: Consistent Identification](https://www.w3.org/WAI/WCAG21/Understanding/use-of-color)
- Quando em foco, o componente é ativado usando as teclas de Espaço e Enter do teclado. [W3C WAI-ARIA 3.5 Button - Keyboard Interaction](https://www.w3.org/TR/wai-aria-practices-1.1/#keyboard-interaction-3)
- A área do foco precisar ter uma espessura de pelo menos 2 pixels CSS e o foco não pode ficar escondido por outros elementos da tela. [(WCAG 2.4.12: Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance-enhanced)

Conforme documentação em: https://doc.animaliads.io/docs/components/radio

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

Obs: No componente Radio Group, a customização ocorre principalmente nos elementos `po-radio` que compõem o grupo de opções.

Portanto, ao aplicar estilos customizados, é importante focar na customização dos elementos `po-radio` em vez do próprio `po-radio-group`.

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade | Descrição | Valor Padrão |
|----------------------------------------|-------------------------------------------------------------|-------------------------------------------------|
| **Default Values** | | |
| `--border-color` | Cor da borda | `var(--color-neutral-dark-70)` |
| `--field-container-title-justify` | Alinhamento horizontal do título (`justify-content`) | `space-between` |
| `--field-container-title-flex` | Flex do título (`flex`) | `1 auto` |
| **Hover** | | |
| `--shadow-color-hover` | Cor da sombra no estado hover | `var(--color-brand-01-lighter)` |
| `--color-hover` | Cor principal no estado hover | `var(--color-brand-01-dark)` |
| **Focused** | | |
| `--outline-color-focused` | Cor do outline do estado de focus | `var(--color-brand-01-darkest)` |
| **checked** | | |
| `--color-unchecked` | Cor quando não selecionado | `var(--color-neutral-light-00)` |
| `--color-checked` | Cor quando selecionado | `var(--color-action-default)` |
| **Disabled** | | |
| `--color-unchecked-disabled` | Cor pricipal quando não selecionado no estado disabled | `var(--color-neutral-light-30)` |
| `--color-checked-disabled` | Cor pricipal quando selecionado no estado disabled | `var(--color-neutral-dark-70)` |

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `additionalHelpTooltip` | `'p-additional-help-tooltip'` | `string` | sim | - | Exibe um ícone de ajuda adicional, com o texto desta propriedade sendo passado para o popover do componente `po-helper`. |
| `appendBox` | `'p-append-in-body'` | `boolean` | sim | `false` | Define que o popover (`p-helper` e/ou `p-error-limit`) será incluído no body da página e não |
| `autoFocus` | `'p-auto-focus'` | `boolean` | sim | `false` | Aplica foco no elemento ao ser iniciado. |
| `columns` | `'p-columns'` | `number` | sim | `2` | Define a quantidade de colunas para exibição das opções. |
| `compactLabel` | `p-compact-label` | `boolean` | sim | `false` | Define se o título do campo será exibido de forma compacta. |
| `disabled` | `'p-disabled'` | `boolean` | sim | `false` | Indica que o campo será desabilitado. |
| `errorLimit` | `'p-error-limit'` | `boolean` | sim | `false` | Limita a exibição da mensagem de erro a duas linhas e exibe um tooltip com o texto completo. |
| `fieldErrorMessage` | `'p-field-error-message'` | `string` | sim | - | Exibe a mensagem setada se o campo estiver vazio e for requerido. |
| `help` | `'p-help'` | `string` | sim | - | Texto de apoio do campo. |
| `label` | `'p-label'` | `string` | sim | - | Label do campo. |
| `labelTextWrap` | `p-label-text-wrap` | `boolean` | sim | `false` | Habilita a quebra automática do texto da propriedade `p-label`. Quando `p-label-text-wrap` for verdadeiro, o texto que excede |
| `name` | `'name'` | `string` | não | - | Nome das opções. |
| `optional` | `'p-optional'` | `boolean` | sim | `false` | Define se a indicação de campo opcional será exibida. |
| `options` | `'p-options'` | `PoRadioGroupOption[]` | não | - | Lista de opções que serão exibidas. |
| `poHelperComponent` | `p-helper` | `PoHelperOptions | string` | sim | - | Define as opções do componente de ajuda (po-helper) que será exibido ao lado do label quando a propriedade `p-label` for definida, ou, ao lado do componente na ausência da propriedade `p-label`. |
| `required` | `'p-required'` | `boolean` | sim | `false` | Define que o campo será obrigatório. |
| `showRequired` | `'p-show-required'` | `boolean` | não | - | Define se a indicação de campo obrigatório será exibida. |
| `size` | `'p-size'` | `string` | sim | `medium` | Define o tamanho dos radios do componente: |

## Outputs

| Evento | Alias | Tipo | Descrição |
|---|---|---|---|
| `additionalHelp` | `'p-additional-help'` | `EventEmitter` | Evento disparado ao clicar no ícone de ajuda adicional. |
| `change` | `'p-change'` | `EventEmitter` | Evento ao alterar valor do campo. |
| `keydown` | `'p-keydown'` | `EventEmitter` | Evento disparado quando uma tecla é pressionada enquanto o foco está no componente. |

## Métodos

### `focus()`

Função que atribui foco ao componente.

Para utilizá-la é necessário ter a instância do componente no DOM, podendo ser utilizado o ViewChild da seguinte forma:

```
import { PoRadioGroupComponent } from '@po-ui/ng-components';

...

@ViewChild(PoRadioGroupComponent, { static: true }) radio: PoRadioGroupComponent;

focusRadio() {
  this.radio.focus();
}
```

### `showAdditionalHelp()`

Método que exibe `p-helper` ou executa a ação definida em `p-helper{eventOnClick}` ou em `p-additionalHelp`.
Para isso, será necessário configurar uma tecla de atalho utilizando o evento `p-keydown`.

> Exibe ou oculta o conteúdo do componente `po-helper` quando o componente estiver com foco.

```
// Exemplo com p-label e p-helper
<po-radio-group
 #radioGroup
 ...
 p-label="Label do radioGroup"
 [p-helper]="helperOptions"
 (p-keydown)="onKeyDown($event, radioGroup)"
></po-radio-group>
```
```
...
onKeyDown(event: KeyboardEvent, inp: PoRadioGroupComponent): void {
 if (event.code === 'F9') {
   inp.showAdditionalHelp();
 }
}
```

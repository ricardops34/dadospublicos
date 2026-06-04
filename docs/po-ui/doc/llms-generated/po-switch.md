# PoSwitchComponent

**Seletor:** `po-switch`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-switch

O componente `po-switch` é um [checkbox](/documentation/po-checkbox-group) mais intuitivo, pois faz analogia a um interruptor.
Deve ser usado quando deseja-se transmitir a ideia de ligar / desligar uma funcionalidade específica.

Pode-se ligar ou desligar o switch utilizando a tecla de espaço ou o clique do mouse.

O texto exibido pode ser alterado de acordo com o valor setado aumentando as possibilidades de uso do componente,
portanto, recomenda-se informar textos que contextualizem seu uso para que facilite a compreensão do usuário.

> O componente não altera o valor incial informado no *model*, portanto indica-se inicializa-lo caso ter necessidade.

#### Boas práticas

- Evite `labels` extensos que quebram o layout do `po-switch`, use `labels` diretos, curtos e intuitivos.

#### Acessibilidade tratada no componente

Algumas diretrizes de acessibilidade já são tratadas no componente, internamente, e não podem ser alteradas pelo proprietário do conteúdo. São elas:

- Quando em foco, o switch é ativado usando a tecla de Espaço. [W3C WAI-ARIA 3.5 Switch - Keyboard Interaction](https://www.w3.org/WAI/ARIA/apg/patterns/switch/#keyboard-interaction-19)
- A área do foco precisar ter uma espessura de pelo menos 2 pixels CSS e o foco não pode ficar escondido por outros elementos da tela. [WCAG 2.4.12: Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance-enhanced)

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade | Descrição | Valor Padrão |
|----------------------------------------|-------------------------------------------------------|-------------------------------------------------|
| **Unchecked** | | |
| `--color-unchecked` | Cor principal no estado desmarcado | `var(--color-neutral-light-00)` |
| `--border-color` | Cor da borda | `var(--color-neutral-dark-70)` |
| `--track-unchecked` | Cor principal da faixa no estado desmarcado | `var(--color-neutral-light-20)` |
| **Checked** | | |
| `--color-checked` | Cor principal no estado selecionado | `var(--color-action-default)` |
| `--track-checked` | Cor da faixa no estado selecionado | `var(--color-brand-01-light)` |
| **Hover** | | |
| `--color-unchecked-hover` | Cor principal no estado hover desmarcado | `var(--color-action-pressed)` |
| `--color-checked-hover` | Cor principal no estado hover marcado | `var(--color-action-pressed)` |
| **Focused** | | |
| `--outline-color-focused` | Cor do outline do estado de focus | `var(--color-action-focus)` |
| **Disabled** | | |
| `--color-unchecked-disabled` | Cor principal do disabled no estado desmarcado | `var(--color-neutral-light-20)` |
| `--color-checked-disabled` | Cor principal do disabled no estado marcado | `var(--color-action-disabled)` |

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `additionalHelpTooltip` | `'p-additional-help-tooltip'` | `string` | sim | - | Exibe um ícone de ajuda adicional, com o texto desta propriedade sendo passado para o popover do componente `po-helper`. |
| `appendBox` | `'p-append-in-body'` | `boolean` | sim | `false` | Define que o popover (`p-helper` e/ou `p-error-limit`) será incluído no body da página e não |
| `compactLabel` | `p-compact-label` | `boolean` | sim | `false` | Define se o título do campo será exibido de forma compacta. |
| `disabled` | `'p-disabled'` | `boolean` | sim | `false` | Indica se o campo será desabilitado. |
| `errorLimit` | `'p-error-limit'` | `boolean` | sim | `false` | Limita a exibição da mensagem de erro a duas linhas e exibe um tooltip com o texto completo. |
| `fieldErrorMessage` | `'p-field-error-message'` | `string` | sim | - | Exibe a mensagem de erro configurada quando o campo estiver desligado(off/false). |
| `formatModel` | `'p-format-model'` | `boolean` | sim | `false` | Indica se o `model` receberá o valor formatado pelas propriedades `p-label-on` e `p-label-off` ou |
| `help` | `'p-help'` | `string` | não | - | Texto de apoio para o campo. |
| `hideLabelStatus` | `'p-hide-label-status'` | `boolean` | sim | `false` | Indica se o status do `model` será escondido visualmente ao lado do switch. |
| `invalidValue` | `'p-invalid-value'` | `boolean` | sim | `false` | Define qual valor será considerado como inválido para exibir a mensagem da propriedade `p-field-error-message`. |
| `label` | `'p-label'` | `string` | não | - | Rótulo exibido pelo componente. |
| `labelOff` | `'p-label-off'` | `string` | não | `false` | Texto exibido quando o valor do componente for `false`. |
| `labelOn` | `'p-label-on'` | `string` | não | `true` | Texto exibido quando o valor do componente for `true`. |
| `labelPosition` | `'p-label-position'` | `PoSwitchLabelPosition` | sim | - | Posição de exibição do rótulo que fica ao lado do switch. |
| `labelTextWrap` | `p-label-text-wrap` | `boolean` | sim | `false` | Habilita a quebra automática do texto da propriedade `p-label`. Quando `p-label-text-wrap` for verdadeiro, o texto que excede |
| `loading` | `'p-loading'` | `boolean` | sim | `false` | Exibe um ícone de carregamento substituindo o switch para sinalizar que uma operação está em andamento. |
| `name` | `'name'` | `string` | não | - | Nome do componente. |
| `poHelperComponent` | `p-helper` | `PoHelperOptions | string` | sim | - | Define as opções do componente de ajuda (po-helper) que será exibido ao lado do label quando a propriedade `p-label` for definida, ou, ao lado do componente na ausência da propriedade `p-label`. |
| `size` | `'p-size'` | `string` | sim | `medium` | Define o tamanho do componente: |

## Outputs

| Evento | Alias | Tipo | Descrição |
|---|---|---|---|
| `additionalHelp` | `'p-additional-help'` | `EventEmitter` | Evento disparado ao clicar no ícone de ajuda adicional. |
| `change` | `'p-change'` | `EventEmitter` | Evento disparado ao alterar valor do campo. |
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
 p-label="Label do component"
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
import { PoSwitchComponent } from '@po-ui/ng-components';

...

@ViewChild(PoSwitchComponent, { static: true }) switch: PoSwitchComponent;

focusSwitch() {
  this.switch.focus();
}
```

### `showAdditionalHelp()`

Método que exibe `p-helper` ou executa a ação definida em `p-helper{eventOnClick}` ou em `p-additionalHelp`.
Para isso, será necessário configurar uma tecla de atalho utilizando o evento `p-keydown`.

> Exibe ou oculta o conteúdo do componente `po-helper` quando o componente estiver com foco.

```
//Exemplo com p-label e p-helper
<po-switch
 #switch
 ...
 p-label="Label do switch"
 [p-helper]="helperOptions"
 (p-keydown)="onKeyDown($event, switch)"
></po-switch>
```
```typescript
onKeyDown(event: KeyboardEvent, inp: PoSwitchComponent): void {
 if (event.code === 'F9') {
   inp.showAdditionalHelp();
 }
}
```

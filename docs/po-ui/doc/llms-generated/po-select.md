# PoSelectComponent

**Seletor:** `po-select`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-select

O componente po-select exibe uma lista de valores e permite que o usuário selecione um desses valores.
Os valores listados podem ser fixos ou dinâmicos de acordo com a necessidade do desenvolvedor, dando mais flexibilidade ao componente.
O po-select não permite que o usuário informe um valor diferente dos valores listados, isso garante a consistência da informação.
O po-select não permite que sejam passados valores duplicados, undefined e null para as opções, excluindo-os da lista.

> Ao passar um valor para o _model_ que não está na lista de opções, o mesmo será definido como `undefined`.

Também existe a possibilidade de utilizar um _template_ para a exibição dos itens da lista,
veja mais em **[p-combo-option-template](/documentation/po-combo-option-template)**.

> Obs: o template **[p-select-option-template](/documentation/po-select-option-template)** será depreciado na versão 14.x.x.

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade | Descrição | Valor Padrão |
|----------------------------------------|-------------------------------------------------------|-------------------------------------------------|
| **Default Values** | | |
| `--font-family` | Família tipográfica usada | `var(--font-family-theme)` |
| `--font-size` | Tamanho da fonte | `var(--font-size-default)` |
| `--text-color-empty` | Cor do placeholder | `var(--color-neutral-light-30)` |
| `--color` | Cor da borda | `var(--color-neutral-dark-70)` |
| `--background` | Cor de background | `var(--color-neutral-light-05)` |
| `--text-color` | Cor do texto | `var(--color-neutral-dark-90)` |
| `--padding-horizontal` | Preenchimento horizontal | `0.5em` |
| `--padding-vertical` | Preenchimento vertical | `0.7em` |
| `--field-container-title-justify` | Alinhamento horizontal do título (`justify-content`) | `space-between` |
| `--field-container-title-flex` | Flex do título (`flex`) | `1 auto` |
| **Hover** | | |
| `--color-hover` | Cor principal no estado hover | `var(--color-brand-01-dark)` |
| `--background-hover` | Cor de background no estado hover | `var(--color-brand-01-lighter)` |
| **Focused** | | |
| `--outline-color-focused` | Cor do outline do estado de focus | `var(--color-action-focus)` |
| `--color-focused` | Cor da borda no estado de focus | `var(--color-action-default)` |
| **Disabled** | | |
| `--color-disabled` | Cor principal no estado disabled | `var(--color-neutral-light-30)` |
| `--background-color-disabled` | Cor de background no estado disabled | `var(--color-neutral-light-20)` |

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `additionalHelpTooltip` | `'p-additional-help-tooltip'` | `string` | sim | - | Exibe um ícone de ajuda adicional, com o texto desta propriedade sendo passado para o popover do componente `po-helper`. |
| `appendBox` | `'p-append-in-body'` | `boolean` | sim | `false` | Define que o popover (`p-helper` e/ou `p-error-limit`) será incluído no body da página e não |
| `compactLabel` | `p-compact-label` | `boolean` | sim | `false` | Define se o título do campo será exibido de forma compacta. |
| `disabled` | `'p-disabled'` | `boolean` | sim | `false` | Indica se o campo será desabilitado. |
| `errorLimit` | `'p-error-limit'` | `boolean` | sim | `false` | Limita a exibição da mensagem de erro a duas linhas e exibe um tooltip com o texto completo. |
| `fieldErrorMessage` | `'p-field-error-message'` | `string` | sim | - | Exibe a mensagem setada se o campo estiver vazio e for requerido. |
| `fieldLabel` | `'p-field-label'` | `string` | sim | `label` | Deve ser informado o nome da propriedade do objeto que será utilizado para a conversão dos itens apresentados na lista do componente |
| `fieldValue` | `'p-field-value'` | `string` | sim | `value` | Deve ser informado o nome da propriedade do objeto que será utilizado para a conversão dos itens apresentados na lista do componente |
| `help` | `'p-help'` | `string` | não | - | Texto de apoio para o campo. |
| `label` | `'p-label'` | `string` | não | - | Rótulo exibido pelo componente. |
| `labelTextWrap` | `p-label-text-wrap` | `boolean` | sim | `false` | Habilita a quebra automática do texto da propriedade `p-label`. Quando `p-label-text-wrap` for verdadeiro, o texto que excede |
| `loading` | `'p-loading'` | `boolean` | sim | `false` | Exibe um ícone de carregamento no lado direito do campo para sinalizar que uma operação está em andamento. |
| `name` | `'name'` | `string` | não | - | Nome do componente. |
| `optional` | `'p-optional'` | `boolean` | sim | `false` | Define se a indicação de campo opcional será exibida. |
| `options` | `'p-options'` | `any[]` | não | - | Nesta propriedade deve ser definido uma coleção de objetos que implementam a interface `PoSelectOption`, |
| `placeholder` | `'p-placeholder'` | `string` | sim | - | Mensagem que aparecerá enquanto nenhuma opção estiver selecionada. |
| `poHelperComponent` | `p-helper` | `PoHelperOptions | string` | sim | - | Define as opções do componente de ajuda (po-helper) que será exibido ao lado do label quando a propriedade `p-label` for definida, ou, ao lado do componente na ausência da propriedade `p-label`. |
| `readonly` | `'p-readonly'` | `boolean` | sim | `false` | Indica que o campo será somente para leitura. |
| `required` | `'p-required'` | `boolean` | sim | `false` | Define que o campo será obrigatório. |
| `showRequired` | `'p-show-required'` | `boolean` | não | - | Define se a indicação de campo obrigatório será exibida. |
| `size` | `'p-size'` | `string` | sim | `medium` | Define o tamanho do componente: |

## Outputs

| Evento | Alias | Tipo | Descrição |
|---|---|---|---|
| `additionalHelp` | `'p-additional-help'` | `EventEmitter` | Evento disparado ao clicar no ícone de ajuda adicional. |
| `blur` | `'p-blur'` | `EventEmitter` | Evento disparado ao sair do campo. |
| `change` | `'p-change'` | `EventEmitter` | Evento disparado ao alterar valor do campo. |
| `keydown` | `'p-keydown'` | `EventEmitter` | Evento disparado quando uma tecla é pressionada enquanto o foco está no componente. |
| `ngModelChange` | `'ngModelChange'` | `EventEmitter` | Função para atualizar o ngModel do componente, necessário quando não for utilizado dentro da tag form. |

## Métodos

### `focus()`

Função que atribui foco ao componente.

Para utilizá-la é necessário ter a instância do componente no DOM, podendo ser utilizado o ViewChild da seguinte forma:

```
import { PoSelectComponent } from '@po-ui/ng-components';

...

@ViewChild(PoSelectComponent, { static: true }) select: PoSelectComponent;

focusSelect() {
  this.select.focus();
}
```

### `showAdditionalHelp()`

Método que exibe `p-helper` ou executa a ação definida em `p-helper{eventOnClick}` ou em `p-additionalHelp`.
Para isso, será necessário configurar uma tecla de atalho utilizando o evento `p-keydown`.

> Exibe ou oculta o conteúdo do componente `po-helper` quando o componente estiver com foco.

```
//Exemplo com p-label e p-helper
<po-select
 #select
 ...
 p-label="Label do select"
 [p-helper]="helperOptions"
 (p-keydown)="onKeyDown($event, select)"
></po-select>
```
```typescript
onKeyDown(event: KeyboardEvent, inp: PoSelectComponent): void {
 if (event.code === 'F9') {
   inp.showAdditionalHelp();
 }
}
```

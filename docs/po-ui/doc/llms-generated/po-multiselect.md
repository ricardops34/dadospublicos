# PoMultiselectComponent

**Seletor:** `po-multiselect`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-multiselect

O po-multiselect é um componente de múltipla seleção.
Este componente é recomendado para dar ao usuário a opção de selecionar vários itens em uma lista.

Quando a lista possuir poucos itens, deve-se dar preferência para o uso do po-checkbox-group, por ser mais simples
e mais rápido para a seleção do usuário.

Este componente também não deve ser utilizado em casos onde a seleção seja única. Nesses casos, deve-se utilizar o
po-select, po-combo ou po-radio-group.

Com ele também é possível definir uma lista à partir da requisição de um serviço definido em `p-filter-service`.

#### Boas práticas

- Caso a lista apresente menos de 5 itens, considere utilizar outro componente;
- Não utilize o multiselect caso o usuário possa selecionar apenas uma opção. Para esse caso, opte por utilizar po-radio ou po-select;

#### Acessibilidade tratada no componente

Algumas diretrizes de acessibilidade já são tratadas no componente internamente, e não podem ser alteradas pelo proprietário do conteúdo. São elas:

- Quando em foco, o multiselect abre o listbox usando as teclas de Espaço ou Enter do teclado.
- Utilize as teclas Arrow Up [seta para cima] ou Arrow Down [seta para baixo] do teclado para navegar entre os itens do listbox.
- Utilize a tecla Esc do teclado para fechar o listbox.
- Quando um item estiver em foco, utilize as teclas Arrow Right [seta para direita] ou Arrow Left [seta para esquerda] do teclado para navegar entre eles.
- Quando em foco e havendo um item ou mais já selecionado, utilize a tecla Arrow Down [seta para baixo] do teclado para abrir o listbox.

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade | Descrição | Valor Padrão |
|----------------------------------------|-------------------------------------------------------|---------------------------------------------------|
| **Default Values** | | |
| `--font-family` | Família tipográfica usada | `var(--font-family-theme)` |
| `--font-size` | Tamanho da fonte | `var(--font-size-default)` |
| `--text-color-placeholder` | Cor do texto do placeholder | `var(--color-action-disabled)` |
| `--color` | Cor principal do multiselect | `var(--color-neutral-dark-70)` |
| `--background` | Cor de background | `var(--color-neutral-light-05)` |
| `--field-container-title-justify` | Alinhamento horizontal do título (`justify-content`) | `space-between` |
| `--field-container-title-flex` | Flex do título (`flex`) | `1 auto` |
| **Hover** | | |
| `--color-hover` | Cor principal no estado hover | `var(--color-action-hover)` |
| `--background-hover` | Cor de background no estado hover | `var(--color-brand-01-lighter)` |
| **Focused** | | |
| `--color-focused` | Cor principal no estado de focus | `var(--color-action-default)` |
| `--outline-color-focused` | Cor do outline do estado de focus | `var(--color-action-focus)` |
| **Disabled** | | |
| `--color-disabled` | Cor principal no estado disabled | `var(--color-action-disabled)` |
| `--background-disabled` | Cor de background no estado disabled | `var(--color-neutral-light-20)` |
| **Error** | | |
| `--color-error` | Cor principal no estado error | `var(--color-feedback-negative-base)` |

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `additionalHelpTooltip` | `'p-additional-help-tooltip'` | `string` | sim | - | Exibe um ícone de ajuda adicional, com o texto desta propriedade sendo passado para o popover do componente `po-helper`. |
| `appendBox` | `'p-append-in-body'` | `boolean` | sim | `false` | Define que o `listbox` e/ou popover (`p-helper` e/ou `p-error-limit`) serão incluídos no body da |
| `autoFocus` | `'p-auto-focus'` | `boolean` | sim | `false` | Aplica foco no elemento ao ser iniciado. |
| `autoHeight` | `'p-auto-height'` | `boolean` | sim | `false` | Define que a altura do componente será auto ajustável, possuindo uma altura minima porém a altura máxima será de acordo |
| `compactLabel` | `p-compact-label` | `boolean` | sim | `false` | Define se o título do campo será exibido de forma compacta. |
| `debounceTime` | `'p-debounce-time'` | `number` | sim | `400` | Esta propriedade define em quanto tempo (em milissegundos), aguarda para acionar o evento de filtro após cada pressionamento de tecla. |
| `disabled` | `'p-disabled'` | `boolean` | sim | `false` | Indica que o campo será desabilitado. |
| `errorLimit` | `'p-error-limit'` | `boolean` | sim | `false` | Limita a exibição da mensagem de erro a duas linhas e exibe um tooltip com o texto completo. |
| `fieldErrorMessage` | `'p-field-error-message'` | `string` | sim | - | Exibe a mensagem setada se o campo estiver vazio e for requerido. |
| `fieldLabel` | `'p-field-label'` | `string` | sim | `label` | Deve ser informado o nome da propriedade do objeto que será utilizado para a conversão dos itens apresentados na lista do componente |
| `fieldValue` | `'p-field-value'` | `string` | sim | `value` | Deve ser informado o nome da propriedade do objeto que será utilizado para a conversão dos itens apresentados na lista do componente |
| `filterMode` | `'p-filter-mode'` | `PoMultiselectFilterMode` | sim | `startsWith` | Define o modo de pesquisa utilizado no campo de busca, quando habilitado. |
| `filterService` | `'p-filter-service'` | `string | PoMultiselectFilter` | sim | - | Nesta propriedade pode ser informada a URL do serviço em que será realizado o filtro para carregamento da lista de itens no componente. |
| `help` | `'p-help'` | `string` | sim | - | Texto de apoio para o campo. |
| `hideSearch` | `'p-hide-search'` | `boolean` | sim | `false` | Esconde o campo de pesquisa existente dentro do dropdown do po-multiselect. |
| `hideSelectAll` | `'p-hide-select-all'` | `boolean` | sim | `false` | Indica se o campo "Selecionar todos" será escondido. |
| `label` | `'p-label'` | `string` | sim | - | Label no componente. |
| `labelTextWrap` | `p-label-text-wrap` | `boolean` | sim | `false` | Habilita a quebra automática do texto da propriedade `p-label`. Quando `p-label-text-wrap` for verdadeiro, o texto que excede |
| `listboxControlPosition` | `'p-listbox-control-position'` | `'top' | 'bottom'` | sim | `bottom` | Define a direção preferida para exibição do `listbox` em relação ao campo (`top` ou `bottom`). |
| `literals` | `'p-literals'` | `PoMultiselectLiterals` | sim | - | Objeto com as literais usadas no `po-multiselect`. |
| `loading` | `'p-loading'` | `boolean` | sim | `false` | Exibe um ícone de carregamento no lado direito do campo para sinalizar que uma operação está em andamento. |
| `name` | `'name'` | `string` | não | - | Nome do componente. |
| `optional` | `'p-optional'` | `boolean` | sim | `false` | Define se a indicação de campo opcional será exibida. |
| `options` | `'p-options'` | `Array<PoMultiselectOption | any>` | não | - | Nesta propriedade deve ser definida uma lista de objetos que será exibida no multiselect. |
| `placeholder` | `'p-placeholder'` | `string` | sim | - | Mensagem apresentada enquanto o campo estiver vazio. |
| `placeholderSearch` | `'p-placeholder-search'` | `string` | sim | `Buscar` | Placeholder do campo de pesquisa. |
| `poHelperComponent` | `p-helper` | `PoHelperOptions | string` | sim | - | Define as opções do componente de ajuda (po-helper) que será exibido ao lado do label quando a propriedade `p-label` for definida, ou, ao lado do componente na ausência da propriedade `p-label`. |
| `required` | `'p-required'` | `boolean` | sim | `false` | Define que o campo será obrigatório. |
| `showRequired` | `'p-show-required'` | `boolean` | não | - | Define se a indicação de campo obrigatório será exibida. |
| `size` | `'p-size'` | `string` | sim | `medium` | Define o tamanho do componente: |
| `sort` | `'p-sort'` | `boolean` | sim | `false` | Indica que a lista definida na propriedade p-options será ordenada pelo label antes de ser apresentada no |

## Outputs

| Evento | Alias | Tipo | Descrição |
|---|---|---|---|
| `additionalHelp` | `'p-additional-help'` | `EventEmitter` | Evento disparado ao clicar no ícone de ajuda adicional. |
| `blur` | `'p-blur'` | `EventEmitter` | Evento disparado ao sair do campo. |
| `change` | `'p-change'` | `EventEmitter` | Pode ser informada uma função que será disparada quando houver alterações no ngModel. |
| `keydown` | `'p-keydown'` | `EventEmitter` | Evento disparado quando uma tecla é pressionada enquanto o foco está no componente. |

## Métodos

### `focus()`

Função que atribui foco ao componente.

Para utilizá-la é necessário ter a instância do componente no DOM, podendo ser utilizado o ViewChild da seguinte forma:

```
import { PoMultiselectComponent } from '@po-ui/ng-components';

...

@ViewChild(PoMultiselectComponent, { static: true }) multiselect: PoMultiselectComponent;

focusMultiselect() {
  this.multiselect.focus();
}
```

### `showAdditionalHelp()`

Método que exibe `p-helper` ou executa a ação definida em `p-helper{eventOnClick}` ou em `p-additionalHelp`.
Para isso, será necessário configurar uma tecla de atalho utilizando o evento `p-keydown`.

> Exibe ou oculta o conteúdo do componente `po-helper` quando o componente estiver com foco.

```
// Exemplo com p-label e p-helper
<po-multiselect
 #multiselect
 ...
 p-label="Label do multiselect"
 [p-helper]="helperOptions"
 (p-keydown)="onKeyDown($event, multiselect)"
></po-multiselect>
```
```
...
onKeyDown(event: KeyboardEvent, inp: PoMultiselectComponent): void {
 if (event.code === 'F9') {
   inp.showAdditionalHelp();
 }
}
```

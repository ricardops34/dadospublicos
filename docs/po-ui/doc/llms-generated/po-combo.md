# PoComboComponent

**Seletor:** `po-combo`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-combo

O `po-combo` exibe uma lista de opções com fácil seleção e filtragem.

Além da exibição padrão, nele é possível listar as opões em agrupamentos.

É possível selecionar e navegar entre as opções da lista tanto através do *mouse* quanto do teclado. No teclado navegue com
as setas e pressione *Enter* na opção que desejar.

Com ele também é possível definir uma lista à partir da requisição de um serviço definido em `p-filter-service`.

Em `p-filter-mode`, o filtro poderá ser configurado para buscar opões que correspondam ao início, fim ou que contenha o valor digitado.

O `po-combo` guarda o último valor caso o usuário desista de uma busca, deixando o campo ou pressionando *Esc*. Caso seja digitado no
campo de busca a descrição completa de um item, então a seleção será automaticamente efetuada ao deixar o campo ou pressionando *Enter*.

Utilizando po-combo com serviço, é possivel digitar um valor no campo de entrada e pressionar a tecla 'tab' para que o componente
faça uma requisição à URL informada passando o valor digitado no campo. Se encontrado o valor, então o mesmo será selecionado, caso
não seja encontrado, então a lista de itens voltará para o estado inicial.

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade | Descrição | Valor Padrão |
|----------------------------------------|-------------------------------------------------------|---------------------------------------------------|
| **Default Values** | | |
| `--font-family` | Família tipográfica usada | `var(--font-family-theme)` |
| `--font-size` | Tamanho da fonte | `var(--font-size-default)` |
| `--text-color` | Cor do texto | `var(--color-neutral-dark-90)` |
| `--text-color-placeholder` | Cor do texto no placeholder | `var(--color-neutral-light-30)` |
| `--color` | Cor principal do Combo | `var(--color-neutral-dark-70)` |
| `--background` | Cor de background | `var(--color-neutral-light-05)` |
| `--border-radius` | Contém o valor do raio dos cantos do elemento | `var(--border-width-lg)` |
| `--min-width` | Largura mínima do combo | `150px` |
| `--field-container-title-justify` | Alinhamento horizontal do título (`justify-content`) | `space-between` |
| `--field-container-title-flex` | Flex do título (`flex`) | `1 auto` |
| **Hover** | | |
| `--color-hover` | Cor principal no estado hover | `var(--color-action-hover)` |
| `--background-hover` | Cor de background no estado hover | `var(--color-brand-01-lightest)` |
| **Focused** | | |
| `--color-focused` | Cor principal no estado de focus | `var(--color-action-default)` |
| `--outline-color-focused` | Cor do outline do estado de focus | `var(--color-action-focus)` |
| **Error** | | |
| `--color-error` | Cor principal no estado de erro | `var(--color-feedback-negative-base)` |
| **Disabled** | | |
| `--color-disabled` | Cor principal no estado disabled | `var(--color-neutral-light-30)` |
| `--background-disabled` | Cor de background no estado disabled | `var(--color-neutral-light-20)` |
| **Suggestion** | | |
| `--text-color-suggestion` | Cor do texto no estado suggestion | `var(--color-neutral-mid-60)` |
| `--background-suggestion` | Cor do background no estado suggestion | `var(--color-brand-01-lightest)` |

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `additionalHelpTooltip` | `'p-additional-help-tooltip'` | `string` | sim | - | Exibe um ícone de ajuda adicional, com o texto desta propriedade sendo passado para o popover do componente `po-helper`. |
| `appendBox` | `'p-append-in-body'` | `boolean` | sim | `false` | Define que o `listbox` e/ou popover (`p-helper` e/ou `p-error-limit`) serão incluídos no body da |
| `autoFocus` | `'p-auto-focus'` | `boolean` | sim | `false` | Aplica foco no elemento ao ser iniciado. |
| `cache` | `'p-cache'` | `boolean` | sim | `true` | Define se o componente irá guardar o valor do model para evitar requisições repetidas. |
| `changeOnEnter` | `'p-change-on-enter'` | `boolean` | sim | `false` | Indica que o evento `p-change` só será disparado ao clicar ou pressionar a tecla "Enter" sobre uma opção selecionada. |
| `clean` | `'p-clean'` | `boolean` | sim | - | Se verdadeiro, o campo receberá um botão para ser limpo. |
| `compactLabel` | `p-compact-label` | `boolean` | sim | `false` | Define se o título do campo será exibido de forma compacta. |
| `debounceTime` | `'p-debounce-time'` | `number` | sim | `400` | Esta propriedade define em quanto tempo (em milissegundos), aguarda para acionar o evento de filtro após cada pressionamento de tecla. |
| `disabled` | `'p-disabled'` | `boolean` | sim | `false` | Indica que o campo será desabilitado. |
| `disabledInitFilter` | `'p-disabled-init-filter'` | `boolean` | sim | `false` | Desabilita o filtro inicial no serviço, que é executado no primeiro clique no campo. |
| `disabledTabFilter` | `'p-disabled-tab-filter'` | `boolean` | sim | `false` | Se verdadeiro, desabilitará a busca de um item via TAB. |
| `emitObjectValue` | `'p-emit-object-value'` | `boolean` | sim | `false` | Se verdadeiro, o evento `p-change` receberá como argumento o `PoComboOption` referente à opção selecionada. |
| `errorLimit` | `'p-error-limit'` | `boolean` | sim | `false` | Limita a exibição da mensagem de erro a duas linhas e exibe um tooltip com o texto completo. |
| `fieldErrorMessage` | `'p-field-error-message'` | `string` | sim | - | Exibe a mensagem setada se o campo estiver vazio e for requerido. |
| `fieldLabel` | `'p-field-label'` | `string` | sim | `label` | Deve ser informado o nome da propriedade do objeto que será utilizado para a conversão dos itens apresentados na lista do componente |
| `fieldValue` | `'p-field-value'` | `string` | sim | `value` | Deve ser informado o nome da propriedade do objeto que será utilizado para a conversão dos itens apresentados na lista do componente |
| `filterMinlength` | `'p-filter-minlength'` | `number` | sim | `0` | Valor mínimo de caracteres para realizar o filtro no serviço. |
| `filterMode` | `'p-filter-mode'` | `PoComboFilterMode` | sim | `startsWith` | Define o modo de pesquisa utilizado no filtro da lista de seleção: `startsWith`, `contains` ou `endsWith`. |
| `filterParams` | `'p-filter-params'` | `any` | sim | - | Valor que será repassado como parâmetro para a URL ou aos métodos do serviço que implementam a interface *PoComboFilter*. |
| `filterService` | `'p-filter-service'` | `PoComboFilter | string` | sim | - | Nesta propriedade deve ser informada a URL do serviço em que será realizado o filtro para carregamento da lista de |
| `help` | `'p-help'` | `string` | sim | - | Texto de apoio para o campo. |
| `icon` | `'p-icon'` | `string | TemplateRef<void>` | sim | - | Define o ícone que será exibido no início do campo. |
| `infiniteScroll` | `'p-infinite-scroll'` | `boolean` | sim | `false` | Se verdadeiro ativa a funcionalidade de scroll infinito para o combo, Ao chegar ao fim da tabela executará nova busca dos dados conforme paginação. |
| `infiniteScrollDistance` | `'p-infinite-scroll-distance'` | `number` | sim | - | Define o percentual necessário para disparar o evento `show-more`, que é responsável por carregar mais dados no combo. Caso o valor seja maior que 100 ou menor que 0, o valor padrão será 100%. |
| `label` | `'p-label'` | `string` | sim | - | Label no componente. |
| `labelTextWrap` | `p-label-text-wrap` | `boolean` | sim | `false` | Habilita a quebra automática do texto da propriedade `p-label`. Quando `p-label-text-wrap` for verdadeiro, o texto que excede |
| `listboxControlPosition` | `'p-listbox-control-position'` | `'top' | 'bottom'` | sim | `bottom` | Define a direção preferida para exibição do `listbox` em relação ao campo (`top` ou `bottom`). |
| `literals` | `'p-literals'` | `PoComboLiterals` | sim | - | Objeto com as literais usadas no `po-combo`. |
| `loading` | `'p-loading'` | `boolean` | sim | `false` | Exibe um ícone de carregamento no lado direito do campo para sinalizar que uma operação está em andamento. |
| `name` | `'name'` | `string` | não | - | Nome do componente. |
| `optional` | `'p-optional'` | `boolean` | sim | `false` | Define se a indicação de campo opcional será exibida. |
| `options` | `'p-options'` | `Array<PoComboOption | PoComboOptionGroup | any>` | não | - | Nesta propriedade define a lista de opções do `po-combo`. |
| `placeholder` | `'p-placeholder'` | `string` | não | - | Mensagem apresentada enquanto o campo estiver vazio. |
| `poHelperComponent` | `p-helper` | `PoHelperOptions | string` | sim | - | Define as opções do componente de ajuda (po-helper) que será exibido ao lado do label quando a propriedade `p-label` for definida, ou, ao lado do componente na ausência da propriedade `p-label`. |
| `removeInitialFilter` | `'p-remove-initial-filter'` | `boolean` | sim | `false` | Define se o filtro inicial será removido no primeiro clique do campo. |
| `required` | `'p-required'` | `boolean` | sim | `false` | Define que o campo será obrigatório. |
| `showRequired` | `'p-show-required'` | `boolean` | não | - | Define se a indicação de campo obrigatório será exibida. |
| `size` | `'p-size'` | `string` | sim | `medium` | Define o tamanho do componente: |
| `sort` | `'p-sort'` | `boolean` | não | - | Indica que a lista definida na propriedade p-options será ordenada pela descrição. |

## Outputs

| Evento | Alias | Tipo | Descrição |
|---|---|---|---|
| `additionalHelp` | `'p-additional-help'` | `EventEmitter` | Evento disparado ao clicar no ícone de ajuda adicional. |
| `blur` | `'p-blur'` | `EventEmitter` | Evento disparado ao sair do campo. |
| `change` | `'p-change'` | `EventEmitter` | Deve ser informada uma função que será disparada quando houver alterações no ngModel. A função receberá como argumento o model modificado. |
| `inputChange` | `'p-input-change'` | `EventEmitter` | Deve ser informada uma função que será disparada quando houver alterações no Search input. A função receberá como argumento o input modificado. |
| `keydown` | `'p-keydown'` | `EventEmitter` | Evento disparado quando uma tecla é pressionada enquanto o foco está no componente. |
| `ngModelChange` | `'ngModelChange'` | `EventEmitter` | Função para atualizar o ngModel do componente, necessário quando não for utilizado dentro da tag form. |

## Métodos

### `focus()`

Função que atribui foco ao componente.

Para utilizá-la é necessário ter a instância do componente no DOM, podendo ser utilizado o ViewChild da seguinte forma:

```
import { PoComboComponent } from '@po-ui/ng-components';

...

@ViewChild(PoComboComponent, { static: true }) combo: PoComboComponent;

focusCombo() {
  this.combo.focus();
}
```

### `showAdditionalHelp()`

Método que exibe `p-helper` ou executa a ação definida em `p-helper{eventOnClick}` ou em `p-additionalHelp`.
Para isso, será necessário configurar uma tecla de atalho utilizando o evento `p-keydown`.

> Exibe ou oculta o conteúdo do componente `po-helper` quando o componente estiver com foco.

```
// Exemplo com p-label e p-helper
<po-combo
 #combo
 ...
 p-label="Label do combo"
 [p-helper]="helperOptions"
 (p-keydown)="onKeyDown($event, combo)"
></po-combo>
```
```
...
onKeyDown(event: KeyboardEvent, inp: PoComboComponent): void {
 if (event.code === 'F9') {
   inp.showAdditionalHelp();
 }
}
```

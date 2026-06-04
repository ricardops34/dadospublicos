# PoCheckboxGroupComponent

**Seletor:** `po-checkbox-group`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-checkbox-group

O componente `po-checkbox-group` exibe uma lista de múltipla escolha onde o usuário pode marcar e desmarcar,
utilizando a tecla de espaço ou o clique do mouse, várias opções.

> Para seleção única, utilize o [**PO Radio Group**](/documentation/po-radio-group).

Por padrão, o po-checkbox-group retorna um array com os valores dos itens selecionados para o model.

```
favorites = ['PO', 'Angular'];
```

Na maioria das situações, o array com os objetos setados já atende as necessidades mas, caso o desenvolvedor
tenha necessidade de usar um valor indeterminado (`null`), ou seja, nem marcado (`true`) e nem desmarcado (`false`),
deve setar a propriedade `p-indeterminate` como `true`.

Nesse caso, o po-checkbox-group vai retornar um objeto com todas as opções disponíveis e seus valores.

```
favorites = {
 PO: true,
 Angular: true,
 VueJS: false,
 React: null // indeterminado
};
```

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `additionalHelpTooltip` | `'p-additional-help-tooltip'` | `string` | sim | - | Exibe um ícone de ajuda adicional, com o texto desta propriedade sendo passado para o popover do componente `po-helper`. |
| `appendBox` | `'p-append-in-body'` | `boolean` | sim | `false` | Define que o popover (`p-helper` e/ou `p-error-limit`) será incluído no body da página e não |
| `autoFocus` | `'p-auto-focus'` | `boolean` | sim | `false` | Aplica foco no elemento ao ser iniciado. |
| `columns` | `'p-columns'` | `number` | sim | `2` | Possibilita definir a quantidade de colunas para exibição dos itens do *checkbox*. |
| `compactLabel` | `p-compact-label` | `boolean` | sim | `false` | Define se o título do campo será exibido de forma compacta. |
| `disabled` | `'p-disabled'` | `boolean` | sim | `false` | Desabilita todos os itens do checkbox. |
| `errorLimit` | `'p-error-limit'` | `boolean` | sim | `false` | Limita a exibição da mensagem de erro a duas linhas e exibe um tooltip com o texto completo. |
| `fieldErrorMessage` | `'p-field-error-message'` | `string` | sim | - | Exibe a mensagem setada se o campo estiver vazio e for requerido. |
| `help` | `'p-help'` | `string` | sim | - | Texto de apoio do campo |
| `indeterminate` | `'p-indeterminate'` | `boolean` | sim | `false` | Caso exista a necessidade de usar o valor indeterminado (`null`) dentro da lista de opções, é necessário setar |
| `label` | `'p-label'` | `string` | sim | - | Label do campo |
| `labelTextWrap` | `p-label-text-wrap` | `boolean` | sim | `false` | Habilita a quebra automática do texto da propriedade `p-label`. Quando `p-label-text-wrap` for verdadeiro, o texto que excede |
| `name` | `'name'` | `string` | não | - | Nome dos checkboxes |
| `optional` | `'p-optional'` | `boolean` | sim | `false` | Define se a indicação de campo opcional será exibida. |
| `options` | `'p-options'` | `PoCheckboxGroupOption[]` | sim | - | Lista de opções que serão exibidas |
| `poHelperComponent` | `p-helper` | `PoHelperOptions | string` | sim | - | Define as opções do componente de ajuda (po-helper) que será exibido ao lado do label quando a propriedade `p-label` for definida, ou, ao lado do componente na ausência da propriedade `p-label`. |
| `required` | `'p-required'` | `boolean` | sim | `false` | Define que o campo será obrigatório. |
| `showRequired` | `'p-show-required'` | `boolean` | não | - | Define se a indicação de campo obrigatório será exibida. |
| `size` | `'p-size'` | `string` | sim | `medium` | Define o tamanho dos checkboxes do componente: |

## Outputs

| Evento | Alias | Tipo | Descrição |
|---|---|---|---|
| `additionalHelp` | `'p-additional-help'` | `EventEmitter` | Evento disparado ao clicar no ícone de ajuda adicional. |
| `change` | `'p-change'` | `EventEmitter` | Evento disparado ao alterar valor do campo |
| `keydown` | `'p-keydown'` | `EventEmitter` | Evento disparado quando uma tecla é pressionada enquanto o foco está no componente. |
| `ngModelChange` | `'ngModelChange'` | `EventEmitter` | Função para atualizar o `ngModel` do componente, necessário quando não for utilizado dentro da tag form. |

## Métodos

### `focus()`

Função que atribui foco ao componente.

Para utilizá-la é necessário ter a instância do componente no DOM, podendo ser utilizado o ViewChild da seguinte forma:

```
import { PoCheckboxGroupComponent } from '@po-ui/ng-components';

...

@ViewChild(PoCheckboxGroupComponent, { static: true }) checkbox: PoCheckboxGroupComponent;

focusCheckbox() {
  this.checkbox.focus();
}
```

### `showAdditionalHelp()`

Método que exibe `p-helper` ou executa a ação definida em `p-helper{eventOnClick}` ou em `p-additionalHelp`.
Para isso, será necessário configurar uma tecla de atalho utilizando o evento `p-keydown`.

> Exibe ou oculta o conteúdo do componente `po-helper` quando o componente estiver com foco.

```
//Exemplo com p-label e p-helper
<po-checkbox-group
 #checkboxGroup
 ...
 p-label="Label do checkbox"
 [p-helper]="helperOptions"
 (p-keydown)="onKeyDown($event, checkboxGroup)"
></po-checkbox-group>
```
```
...
onKeyDown(event: KeyboardEvent, inp: PoCheckboxGroupComponent): void {
 if (event.code === 'F9') {
   inp.showAdditionalHelp();
 }
}
```

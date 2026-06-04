# PoRichTextComponent

**Seletor:** `po-rich-text`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-rich-text

O componente `po-rich-text` é um editor de textos enriquecidos.

Para edição de texto simples sem formatação recomenda-se o uso do componente [**po-textarea**](/documentation/po-textarea).

> No navegador Internet Explorer não é possível alterar a cor do texto.

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `additionalHelpTooltip` | `'p-additional-help-tooltip'` | `string` | sim | - | Exibe um ícone de ajuda adicional, com o texto desta propriedade sendo passado para o popover do componente `po-helper`. |
| `appendBox` | `'p-append-in-body'` | `boolean` | sim | `false` | Define que o popover (`p-helper` e/ou `p-error-limit`) será incluído no body da página e não |
| `autoFocus` | `'p-auto-focus'` | `boolean` | sim | `false` | Aplica foco no elemento ao ser iniciado. |
| `compactLabel` | `p-compact-label` | `boolean` | sim | `false` | Define se o título do campo será exibido de forma compacta. |
| `disabled` | `'p-disabled'` | `boolean` | sim | `false` | Indica que o campo será desabilitado. |
| `disabledTextAlign` | `'p-disabled-text-align'` | `boolean` | sim | `false` | Define se o alinhamento de texto será desabilitado. |
| `errorLimit` | `'p-error-limit'` | `boolean` | sim | `false` | Limita a exibição da mensagem de erro a duas linhas e exibe um tooltip com o texto completo. |
| `errorMessage` | `'p-error-message'` | `string` | sim | - | Mensagem que será apresentada quando a propriedade required estiver habilitada e o campo for limpo após algo ser digitado. |
| `height` | `'p-height'` | `number` | sim | - | Define a altura da área de edição de texto. |
| `help` | `'p-help'` | `string` | sim | - | Texto de apoio do campo. |
| `hideToolbarActions` | `'p-hide-toolbar-actions'` | `Array<PoRichTextToolbarActions>` | sim | `[]`
 | Define as ações da barra de ferramentas do `PoRichTextComponent` que serão ocultadas. |
| `label` | `'p-label'` | `string` | sim | - | Rótulo do campo. |
| `labelTextWrap` | `p-label-text-wrap` | `boolean` | sim | `false` | Habilita a quebra automática do texto da propriedade `p-label`. Quando `p-label-text-wrap` for verdadeiro, o texto que excede |
| `loading` | `'p-loading'` | `boolean` | sim | `false` | Exibe um ícone de carregamento no lado direito do campo para sinalizar que uma operação está em andamento. |
| `name` | `'name'` | `string` | não | - | Nome e identificador do campo. |
| `optional` | `'p-optional'` | `boolean` | sim | `false` | Define se a indicação de campo opcional será exibida. |
| `placeholder` | `'p-placeholder'` | `string` | sim | '' | Mensagem que aparecerá enquanto o campo não estiver preenchido. |
| `poHelperComponent` | `p-helper` | `PoHelperOptions | string` | sim | - | Define as opções do componente de ajuda (po-helper) que será exibido ao lado do label quando a propriedade `p-label` for definida, ou, ao lado do componente na ausência da propriedade `p-label`. |
| `readonly` | `'p-readonly'` | `boolean` | sim | `false` | Indica que o campo será somente leitura. |
| `required` | `'p-required'` | `boolean` | sim | `false` | Define que o campo será obrigatório. |
| `showRequired` | `'p-show-required'` | `boolean` | não | - | Define se a indicação de campo obrigatório será exibida. |
| `size` | `'p-size'` | `string` | sim | `medium` | Define o tamanho do componente: |

## Outputs

| Evento | Alias | Tipo | Descrição |
|---|---|---|---|
| `additionalHelp` | `'p-additional-help'` | `EventEmitter` | Evento disparado ao clicar no ícone de ajuda adicional. |
| `change` | `'p-change'` | `EventEmitter` | Evento disparado ao deixar o campo e que recebe como parâmetro o valor alterado. |
| `changeModel` | `'p-change-model'` | `EventEmitter` | Evento disparado ao modificar valor do model e que recebe como parâmetro o valor alterado. |
| `keydown` | `'p-keydown'` | `EventEmitter` | Evento disparado quando uma tecla é pressionada enquanto o foco está no componente. |

## Métodos

### `focus()`

Função que atribui foco ao componente.

Para utilizá-la é necessário ter a instância do componente no DOM, podendo ser utilizado o ViewChild da seguinte forma:

```
import { PoRichTextComponent } from '@po-ui/ng-components';

...

@ViewChild(PoRichTextComponent, { static: true }) richText: PoRichTextComponent;

focusRichText() {
  this.richText.focus();
}
```

### `showAdditionalHelp()`

Método que exibe `p-helper` ou executa a ação definida em `p-helper{eventOnClick}` ou em `p-additionalHelp`.
Para isso, será necessário configurar uma tecla de atalho utilizando o evento `p-keydown`.

> Exibe ou oculta o conteúdo do componente `po-helper` quando o componente estiver com foco.

```
// Exemplo com p-label e p-helper
<po-rich-text
 #richtext
 ...
 p-label="Label do richtext"
 [p-helper]="helperOptions"
 (p-keydown)="onKeyDown($event, richtext)"
></po-rich-text>
```
```
...
onKeyDown(event: KeyboardEvent, inp: PoRichTextComponent): void {
 if (event.code === 'F9') {
   inp.showAdditionalHelp();
 }
}
```

# PoLookupComponent

**Seletor:** `po-lookup`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-lookup

Componente utilizado para abrir uma janela de busca com uma tabela que lista dados de um serviço. Nesta janela é possível buscar e
selecionar um ou mais registros que serão enviados para o campo. O `po-lookup` permite que o usuário digite um valor e pressione a tecla *TAB* para
buscar um registro.

> Caso o campo seja iniciado ou preenchido com um valor inexistente na busca, o mesmo será limpado.
No segundo caso ocorrerá após este perder o foco; ambos os casos o campo ficará inválido quando requerido.

> Enquanto o componente realiza a requisição ao servidor, o componente ficará desabilitado e com o status interno do
[modelo](https://angular.io/guide/form-validation#creating-asynchronous-validators) como `pending`.

Este componente não é recomendado quando a busca dos dados possuir poucas informações, para isso utilize outros componentes como o
`po-select` ou o `po-combo`. Quando existe muitos dados o po-lookup por padrão traz apenas 10 itens na tabela e os demais são carregados por demanda através do
botão 'Carregar mais resultados'. Para que funcione corretamente, é importante que o serviço siga o
[Guia de implementação das APIs TOTVS](https://po-ui.io/guides/api).

Importante:

- Caso o po-lookup contenha o [(ngModel)] sem o atributo name, ocorrerá um erro de angular.
Então será necessário informar o atributo name ou o atributo [ngModelOptions]="{standalone: true}".
```
  <po-lookup
    [(ngModel)]="pessoa.nome"
    [ngModelOptions]="{standalone: true}">
  </po-lookup>
  ```

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade | Descrição | Valor Padrão |
|----------------------------------------|-------------------------------------------------------|--------------------------------------------------|
| **Default Values** | | |
| `--font-family` | Família tipográfica usada | `var(--font-family-theme)` |
| `--font-size` | Tamanho da fonte | `var(--font-size-default)` |
| `--text-color-placeholder` | Cor do texto no placeholder | `var(--color-neutral-light-30)` |
| `--color` | Cor principal do lookup | `var(--color-neutral-dark-70)` |
| `--border-radius` | Contém o valor do raio dos cantos do elemento | `var(--border-radius-md)` |
| `--background` | Cor de background | `var(--color-neutral-light-05)` |
| `--text-color` | Cor do texto | `var(--color-neutral-dark-90)` |
| `--color-clear` | Cor principal do icone clear | `var(--color-action-default)` |
| **Icon** | | |
| `--color-icon` | Cor principal do icone pesquisar | `var(--color-action-default)` |
| **Hover** | | |
| `--color-hover` | Cor principal no estado hover | `var(--color-brand-01-dark)` |
| `--background-hover` | Cor de background no estado hover | `var(--color-brand-01-lightest)` |
| **Focused** | | |
| `--color-focused` | Cor principal no estado de focus | `var(--color-action-default)` |
| `--outline-color-focused` | Cor do outline do estado de focus | `var(--color-action-focus)` |
| **Disabled** | | |
| `--color-disabled` | Cor principal no estado disabled | `var(--color-action-disabled)` |
| `--background-disabled` | Cor de background no estado disabled | `var(--color-neutral-light-20)` |
| `--text-color-disabled` | Cor do texto quando campo está desabilitado | `var(--color-action-disabled)` |
| **Error** | | |
| `--color-error` | Cor de background no estado de requerido | `var(--color-feedback-negative-base)` |

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `additionalHelpTooltip` | `'p-additional-help-tooltip'` | `string` | sim | - | Exibe um ícone de ajuda adicional, com o texto desta propriedade sendo passado para o popover do componente `po-helper`. |
| `advancedFilters` | `'p-advanced-filters'` | `Array<PoLookupAdvancedFilter>` | sim | - | Lista de objetos dos campos que serão criados na busca avançada. |
| `appendBox` | `'p-append-in-body'` | `boolean` | sim | `false` | Define que o popover (`p-helper` e/ou `p-error-limit`) será incluído no body da página e não |
| `autoFocus` | `'p-auto-focus'` | `boolean` | sim | `false` | Aplica foco no elemento ao ser iniciado. |
| `autoHeight` | `'p-auto-height'` | `boolean` | sim | `false` | Define que a altura do componente será auto ajustável, possuindo uma altura minima porém a altura máxima será de acordo |
| `clean` | `'p-clean'` | `boolean` | não | - | Exibe um ícone que permite limpar o campo. |
| `columns` | `'p-columns'` | `Array<PoLookupColumn>` | sim | - | Lista das colunas da tabela. |
| `compactLabel` | `p-compact-label` | `boolean` | sim | `false` | Define se o título do campo será exibido de forma compacta. |
| `disabled` | `'p-disabled'` | `boolean` | sim | false | Indica que o campo será desabilitado. |
| `errorLimit` | `'p-error-limit'` | `boolean` | sim | `false` | Limita a exibição da mensagem de erro a duas linhas e exibe um tooltip com o texto completo. |
| `fieldErrorMessage` | `'p-field-error-message'` | `string` | sim | - | Exibe a mensagem setada se o campo estiver vazio e for requerido. |
| `fieldFormat` | `'p-field-format'` | `((value) => string) | Array<string>` | sim | - | Formato de exibição do campo. |
| `fieldLabel` | `'p-field-label'` | `string` | não | - | Indica a coluna que será utilizada como descrição do campo e como filtro dentro da janela. |
| `fieldValue` | `'p-field-value'` | `string` | não | - | Indica a coluna que será utilizada como valor do campo. |
| `filterParams` | `'p-filter-params'` | `any` | sim | - | Valor que será repassado como parâmetro para a URL ou aos métodos do serviço que implementam a interface `PoLookupFilter`. |
| `filterService` | `'p-filter-service'` | `string | PoLookupFilter` | não | - | Serviço responsável por buscar os dados da tabela na janela. Pode ser informado um serviço que implemente a interface |
| `help` | `'p-help'` | `string` | sim | - | Texto de apoio do campo. |
| `hideColumnsManager` | `'p-hide-columns-manager'` | `boolean` | sim | `false` | Permite que o gerenciador de colunas, responsável pela definição de quais colunas serão exibidas, seja escondido. |
| `infiniteScroll` | `'p-infinite-scroll'` | `boolean` | sim | `false` | Ativa a funcionalidade de scroll infinito para a tabela exibida no retorno da consulta. |
| `label` | `'p-label'` | `string` | sim | - | Label do campo. |
| `labelTextWrap` | `p-label-text-wrap` | `boolean` | sim | `false` | Habilita a quebra automática do texto da propriedade `p-label`. Quando `p-label-text-wrap` for verdadeiro, o texto que excede |
| `literals` | `'p-literals'` | `PoLookupLiterals` | não | - | Objeto com as literais usadas no `po-lookup`. |
| `loading` | `'p-loading'` | `boolean` | sim | `false` | Exibe um ícone de carregamento no lado direito do campo para sinalizar que uma operação está em andamento. |
| `multiple` | `'p-multiple'` | `boolean` | sim | `false` | Permite a seleção de múltiplos itens. |
| `name` | `'name'` | `string` | não | - | Nome e Id do componente. |
| `noAutocomplete` | `'p-no-autocomplete'` | `boolean` | sim | `false` | Define a propriedade nativa `autocomplete` do campo como `off`. |
| `optional` | `'p-optional'` | `boolean` | sim | `false` | Define se a indicação de campo opcional será exibida. |
| `placeholder` | `'p-placeholder'` | `string` | não | - | Mensagem que aparecerá enquanto o campo não estiver preenchido. |
| `poHelperComponent` | `p-helper` | `PoHelperOptions | string` | sim | - | Define as opções do componente de ajuda (po-helper) que será exibido ao lado do label quando a propriedade `p-label` for definida, ou, ao lado do componente na ausência da propriedade `p-label`. |
| `required` | `'p-required'` | `boolean` | sim | `false` | Define que o campo será obrigatório. |
| `showRequired` | `'p-show-required'` | `boolean` | não | - | Define se a indicação de campo obrigatório seré exibida. |
| `size` | `'p-size'` | `string` | sim | `medium` | Define o tamanho do componente: |
| `spacing` | `'p-spacing'` | `string` | sim | `medium` | Define o espaçamento interno das células, impactando diretamente na altura das linhas do table dentro do modal. Os |
| `textWrap` | `'p-text-wrap'` | `boolean` | sim | `false` | Habilita ou desabilita a quebra automática de texto. Quando ativada, o texto que excede |
| `virtualScroll` | `'p-virtual-scroll'` | `boolean` | sim | `true` | Habilita o `virtual-scroll` na tabela para melhorar a performance com grandes volumes de dados. |

## Outputs

| Evento | Alias | Tipo | Descrição |
|---|---|---|---|
| `additionalHelp` | `'p-additional-help'` | `EventEmitter` | Evento disparado ao clicar no ícone de ajuda adicional. |
| `change` | `'p-change'` | `EventEmitter` | Evento que será disparado ao alterar o model. |
| `changeVisibleColumns` | `'p-change-visible-columns'` | `EventEmitter` | Evento disparado ao fechar o popover do gerenciador de colunas após alterar as colunas visíveis. |
| `columnRestoreManager` | `'p-restore-column-manager'` | `EventEmitter` | Evento disparado ao clicar no botão de restaurar padrão no gerenciador de colunas. |
| `keydown` | `'p-keydown'` | `EventEmitter` | Evento disparado quando uma tecla é pressionada enquanto o foco está no componente. |
| `onError` | `'p-error'` | `EventEmitter` | Evento será disparado quando ocorrer algum erro na requisição de busca do item. |
| `selected` | `'p-selected'` | `EventEmitter` | Evento será disparado quando ocorrer alguma seleção. |

## Métodos

### `focus()`

Função que atribui foco ao componente.

Para utilizá-la é necessário ter a instância do componente no DOM, podendo ser utilizado o ViewChild da seguinte forma:

```
import { PoLookupComponent } from '@po-ui/ng-components';

...

@ViewChild(PoLookupComponent, { static: true }) lookup: PoLookupComponent;

focusLookup() {
  this.lookup.focus();
}
```

### `showAdditionalHelp()`

Método que exibe `p-helper` ou executa a ação definida em `p-helper{eventOnClick}` ou em `p-additionalHelp`.
Para isso, será necessário configurar uma tecla de atalho utilizando o evento `p-keydown`.

> Exibe ou oculta o conteúdo do componente `po-helper` quando o componente estiver com foco.

```
// Exemplo com p-label e p-helper
<po-lookup
 #lookup
 ...
 p-label="Label do lookup"
 [p-helper]="helperOptions"
 (p-keydown)="onKeyDown($event, lookup)"
></po-lookup>
```
```
...
onKeyDown(event: KeyboardEvent, inp: PoLookupComponent): void {
 if (event.code === 'F9') {
   inp.showAdditionalHelp();
 }
}
```

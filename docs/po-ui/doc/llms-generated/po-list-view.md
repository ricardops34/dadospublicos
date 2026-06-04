# PoListViewComponent

**Seletor:** `po-list-view`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-list-view

Componente de lista que recebe um array de objetos e renderiza de forma dinâmica os dados de
acordo com a necessidade de cada tela e deve ser utilizado em conjunto com as diretivas de *templates*
*[p-list-view-content-template](/documentation/po-list-view-content-template)** e
*[p-list-view-detail-template](/documentation/po-list-view-detail-template)**.

O componente disponibiliza uma área específica para exibição informações adicionais,
através da diretiva **[p-list-view-detail-template](/documentation/po-list-view-detail-template)**.

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `actions` | `'p-actions'` | `PoListViewAction[]` | sim | - | Lista de ações que serão exibidas no componente. |
| `componentsSize` | `'p-components-size'` | `string` | sim | `medium` | Define o tamanho dos componentes de formulário no template: |
| `height` | `'p-height'` | `number` | sim | - | Define a altura do `po-list-view` em *pixels*. |
| `hideSelectAll` | `'p-hide-select-all'` | `boolean` | não | `false` | Esconde o *checkbox* para seleção de todos os itens. |
| `items` | `'p-items'` | `any[]` | não | - | Lista de itens que serão exibidos no componente. |
| `literals` | `'p-literals'` | `PoListViewLiterals` | sim | - | Objeto com as literais usadas no `po-list-view`. |
| `propertyLink` | `'p-property-link'` | `string` | sim | - | Recebe uma propriedade que será utilizada para recuperar o valor do objeto que será usado como link para o título. |
| `propertyTitle` | `'p-property-title'` | `string` | sim | - | Recebe uma propriedade que será utilizada para recuperar o valor do objeto que será exibido como o título de cada item. |
| `select` | `'p-select'` | `boolean` | sim | `false` | Habilita um *checkbox* para cada item da lista. Todos os items possuem a propriedade dinâmica `$selected` para identificar se o |
| `showMoreDisabled` | `'p-show-more-disabled'` | `boolean` | sim | - | Indica que o botão `Carregar Mais Resultados` será desabilitado. |

## Outputs

| Evento | Alias | Tipo | Descrição |
|---|---|---|---|
| `showDetail` | `'p-show-detail'` | `EventEmitter` | Ação que será executada ao clicar no botão exibir detalhes. |
| `showMore` | `'p-show-more'` | `EventEmitter` | Recebe uma ação, que será executada quando clicar no botão "Carregar mais resultados". |
| `titleAction` | `'p-title-action'` | `EventEmitter` | Ação que será executada ao clicar no título. |

# PoTableComponent

**Seletor:** `po-table`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-table

Este componente de tabela é utilizado para exibição de dados com diferentes tipos como por exemplo textos, data, horas e números com
formato personalizado.

Também é possivel criar tabelas com ordenação de dados, linhas com detalhes, coluna para seleção de linhas, coluna com ações e também
carregamento por demanda através do botão **Carregar mais resultados**.

> As linhas de detalhes podem também ser customizadas através do [`p-table-row-template`](/documentation/po-table-row-template).

> As colunas podem ser customizadas através dos templates [`p-table-column-template`](/documentation/po-table-column-template)
e [`p-table-cell-template`](/documentation/po-table-cell-template).

O componente permite gerenciar a exibição das colunas dinamicamente. Esta funcionalidade pode ser acessada através do ícone de engrenagem
no canto superior direito do cabeçalho da tabela.

Caso a largura de todas as colunas forem definidas e o total ultrapassar o tamanho tabela, será exibido um *scroll* na horizontal para a
completa visualização dos dados.

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade | Descrição | Valor Padrão |
|----------------------------------------|-------------------------------------------------------|---------------------------------------------------|
| **Default Values** | | |
| `--font-family` | Família tipográfica usada | `var(--font-family-theme)` |
| `--background-color` | Cor de background | `var(--color-neutral-light-00)` |
| `--color` | Cor principal da table | `var(--color-neutral-dark-95)` |
| `--background-striped-color` | Cor do background quando striped | `var(--color-neutral-light-05)` |
| `--color-line` | Cor das linhas | `var(--color-neutral-mid-40)` |
| **Hover** | | |
| `--color-hover` | Cor principal no estado hover | `var(--color-action-hover)` |
| `--background-color-hover` | Cor de background no estado hover | `var(--color-brand-01-lighter)` |
| **Focused** | | |
| `--outline-color-focused` | Cor do outline do estado de focus | `var(--color-action-focus)` |
| **Disabled** | | |
| `--color-disabled` | Cor principal no estado disabled | `var(--color-neutral-mid-40)` |
| **Headline** | | |
| `--background-color-headline` | Cor do cabeçalho | `var(--color-neutral-light-10)` |
| `--font-weight-headline` | Peso da fonte do cabeçalho | `var(--font-weight-bold)` |
| **Selected** | | |
| `--background-color-selected` | Cor de background no estado de selecionado | `var(--color-brand-01-lightest)` |
| **Actived** | | |
| `--color-actived` | Cor do texto no estado de selecionado | `var(--color-neutral-dark-90)` |
| `--background-color-actived` | Cor de background no estado de selecionado | `var(--color-brand-01-light)` |

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `actionRight` | `'p-actions-right'` | `boolean` | sim | `false` | Define que a coluna de ações ficará no lado direito da tabela. |
| `actions` | `'p-actions'` | `PoTableAction[]` | sim | - | Define uma lista de ações. |
| `autoCollapse` | `'p-auto-collapse'` | `boolean` | sim | `false` | Permite fechar um detalhe ou row template automaticamente, ao abrir outro item. |
| `columns` | `'p-columns'` | `PoTableColumn[]` | sim | - | Lista das colunas da tabela, deve receber um *array* de objetos que implementam a interface `PoTableColumn`. |
| `componentsSize` | `'p-components-size'` | `string` | sim | `medium` | Define o tamanho dos componentes de formulário no table: |
| `container` | `'p-container'` | `string` | sim | `border` | Adiciona um contorno arredondado ao `po-table`, as opções são: |
| `draggable` | `'p-draggable'` | `boolean` | sim | `false` | Habilita o modo drag and drop para as colunas da tabela. |
| `filterType` | `'p-filter-type'` | `PoSearchFilterMode` | sim | `startsWith` | Define o modo de pesquisa utilizado no campo de busca, quando habilitado. |
| `filteredColumns` | `'p-filtered-columns'` | `Array<string>` | sim | - | Define as colunas que serão filtradas no campo de pesquisa. |
| `height` | `'p-height'` | `number` | sim | - | Define a altura da tabela em *pixels* e fixa o cabeçalho. |
| `hideActionFixedColumns` | `'p-hide-action-fixed-columns'` | `boolean` | sim | `false` | Permite que as ações para fixar uma coluna da tabela sejam escondidas. |
| `hideBatchActions` | `'p-hide-batch-actions'` | `boolean` | sim | `true` | Permite que as ações em lote, responsável por excluir e exibir a quantidade de itens, sejam escondidas. |
| `hideColumnsManager` | `'p-hide-columns-manager'` | `boolean` | sim | `false` | Permite que o gerenciador de colunas, responsável pela definição de quais colunas serão exibidas, seja escondido. |
| `hideDetail` | `'p-hide-detail'` | `boolean` | sim | `false` | Habilita a visualização da lista de detalhes de cada linha da coluna. |
| `hideSelectAll` | `'p-hide-select-all'` | `boolean` | não | `false` | Esconde o *checkbox* para seleção de todas as linhas. |
| `hideTableSearch` | `'p-hide-table-search'` | `boolean` | sim | `true` | Permite que o campo de pesquisa seja escondido. |
| `infiniteScroll` | `'p-infinite-scroll'` | `boolean` | sim | `false` | Se verdadeiro, ativa a funcionalidade de scroll infinito para a tabela e o botão "Carregar Mais" deixará de ser exibido. Ao chegar no fim da tabela |
| `infiniteScrollDistance` | `'p-infinite-scroll-distance'` | `number` | sim | - | Define o percentual necessário para disparar o evento `p-show-more`, que é responsável por carregar mais dados na tabela. Caso o valor informado seja maior que 100 ou menor |
| `items` | `'p-items'` | `any[]` | não | - | Lista de itens da tabela. |
| `literals` | `'p-literals'` | `PoTableLiterals` | sim | - | Objeto com as literais usadas no `po-table`. |
| `loading` | `'p-loading'` | `boolean` | sim | `false` | Bloqueia a interação do usuário com os dados da _table_. |
| `loadingShowMore` | `'p-loading-show-more'` | `boolean` | sim | `false` | Permite que seja adicionado o estado de carregamento no botão "Carregar mais resultados". |
| `maxColumns` | `'p-max-columns'` | `number` | sim | - | Define uma quantidade máxima de colunas que serão exibidas na tabela. |
| `paramDeleteApi` | `'p-param-delete-api'` | `string` | sim | `id` | Adiciona o parâmetro a ser enviado para a requisição de DELETE. |
| `selectable` | `'p-selectable'` | `boolean` | sim | `false` | Permite a seleção de linhas na tabela e, caso a propriedade `p-single-select` esteja definida será possível |
| `selectableEntireLine` | `'p-selectable-entire-line'` | `boolean` | não | `true` | Permite selecionar um item da tabela clicando na linha. |
| `serviceApi` | `'p-service-api'` | `string` | sim | - | URL da API responsável por retornar os registros. |
| `serviceDeleteApi` | `'p-service-delete'` | `string` | sim | - | URL da API responsável por excluir os registros. |
| `showMoreDisabled` | `'p-show-more-disabled'` | `boolean` | não | `false` | Se verdadeiro, torna habilitado o botão "Carregar mais resultados". |
| `singleSelect` | `'p-single-select'` | `boolean` | não | - | Define que somente uma linha da tabela pode ser selecionada. |
| `sort` | `'p-sort'` | `boolean` | sim | `false` | Habilita em todas as colunas a opção de ordenação de dados. Caso a coluna seja do tipo 'data' ou 'dateTime' a |
| `spacing` | `'p-spacing'` | `string` | sim | `medium` | Define o espaçamento interno das células, impactando diretamente na altura das linhas do table. Os valores |
| `striped` | `'p-striped'` | `boolean` | não | `false` | Habilita ou desabilita o estilo listrado da tabela (`striped`). |
| `textWrap` | `'p-text-wrap'` | `boolean` | sim | `false` | Habilita ou desabilita a quebra automática de texto. Quando ativada, o texto que excede |
| `virtualScroll` | `'p-virtual-scroll'` | `boolean` | sim | `true` | Habilita o `virtual-scroll` na tabela para melhorar a performance com grandes volumes de dados. |

## Outputs

| Evento | Alias | Tipo | Descrição |
|---|---|---|---|
| `allSelected` | `'p-all-selected'` | `EventEmitter` | Evento executado quando todas as linhas são selecionadas por meio do *checkbox* que seleciona todas as linhas. |
| `allUnselected` | `'p-all-unselected'` | `EventEmitter` | Evento executado quando a seleção das linhas é desmarcada por meio do *checkbox* que seleciona todas as linhas. |
| `changeFixedColumns` | `p-change-fixed-columns` | `EventEmitter` | Evento disparado ao alterar o estado de fixação de uma coluna no gerenciador de colunas. |
| `changeVisibleColumns` | `'p-change-visible-columns'` | `EventEmitter` | Evento disparado ao fechar o page slide do gerenciador de colunas após alterar as colunas visíveis. |
| `collapsed` | `'p-collapsed'` | `EventEmitter` | Evento executado ao colapsar uma linha do `po-table`. |
| `columnRestoreManager` | `'p-restore-column-manager'` | `EventEmitter` | Evento disparado ao clicar no botão de restaurar padrão no gerenciador de colunas. |
| `eventDelete` | `'p-delete-items'` | `EventEmitter` | Evento executado após o método de exclusão ser finalizado. |
| `expanded` | `'p-expanded'` | `EventEmitter` | Evento executado ao expandir uma linha do `po-table`. |
| `selected` | `'p-selected'` | `EventEmitter` | Evento executado ao selecionar uma linha do `po-table`. |
| `showMore` | `'p-show-more'` | `EventEmitter` | Recebe uma ação de clique para o botão "Carregar mais resultados", caso nenhuma ação for definida o mesmo |
| `sortBy` | `'p-sort-by'` | `EventEmitter` | Evento executado ao ordenar colunas da tabela. |
| `unselected` | `'p-unselected'` | `EventEmitter` | Evento executado ao desmarcar a seleção de uma linha do `po-table`. |

## Métodos

### `applyFilters(queryParams: RecordType)`

Método responsável por realizar busca no serviço de dados podendo informar filtros e com o retorno, atualiza a tabela.

Caso não seja informado parâmetro, nada será adicionado ao GET, conforme abaixo:
```
url + ?page=1&pageSize=10
```
> Obs: os parâmetros `page` e `pageSize` sempre serão chamados independente de ser enviados outros parâmetros.

Caso sejam informados os parâmetros `{ name: 'JOHN', age: '23' }`, todos serão adicionados ao GET, conforme abaixo:
```
url + ?page=1&pageSize=10&name=JOHN&age=23
```

### `applyFixedColumns()`

Verifica se columns possuem a propriedade width.

### `collapse(rowIndex: number)`

Método que colapsa uma linha com detalhe quando executada.

### `expand(rowIndex: number)`

Método que expande uma linha com detalhe quando executada.

### `getSelectedRows()`

Retorna as linhas do `po-table` que estão selecionadas.

### `getUnselectedRows()`

Retorna as linhas do `po-table` que não estão selecionadas.

### `unselectRows()`

Desmarca as linhas que estão selecionadas.

### `unselectRowItem()`

Desmarca uma linha que está selecionada.

### `selectRowItem()`

Seleciona uma linha do 'po-table'.

### `deleteItems()`

Método responsável pela exclusão de itens em lote.
Caso a tabela esteja executando a propriedade `p-service-delete`, será necessário excluir 1 item por vez.

Ao utilizar `p-service-delete` mas sem a propriedade `p-service-api`, será responsabilidade do usuário o tratamento
após a requisição DELETE ser executada.

Caso a tabela utilize `p-height` e esteja sem serviço, é necessário a reatribuição dos itens utilizando o evento `(p-delete-items)`, por exemplo:

```
<po-table
 (p-delete-items)="items = $event"
>
</po-table>
```

### `removeItem(item: TypeUnion)`

Método que remove um item da tabela.

### `updateItem(item: TypeUnion, updatedItem: RecordType)`

Método que atualiza um item da tabela.

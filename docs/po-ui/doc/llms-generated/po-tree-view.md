# PoTreeViewComponent

**Seletor:** `po-tree-view`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-tree-view

O componente fornece um modelo de visualização em árvore, possibilitando a visualização das informações de maneira
hierárquica, desta forma sendo possível utilizar até 4 níveis.

Nele é possível navegar entre os itens através da tecla *tab*, permitindo expandir ou colapsar o item em foco
por meio das teclas *enter* e *space*.

Além da navegação, o componente possibilita também a seleção dos itens do primeiro ao último nível, tanto de forma parcial como completa.

O componente também possui eventos disparados ao marcar/desmarcar e expandir/colapsar os itens.

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `componentsSize` | `'p-components-size'` | `string` | sim | `medium` | Define o tamanho dos componentes de formulário: |
| `inputedItems` | `'p-items'` | `Array<PoTreeViewItem>` | não | - | Lista de itens do tipo `PoTreeViewItem` que será renderizada pelo componente. |
| `maxLevel` | `'p-max-level'` | `number` | sim | 4 | Define o máximo de níveis para o tree-view. |
| `selectable` | `'p-selectable'` | `boolean` | sim | false | Habilita uma caixa de seleção para selecionar e/ou desmarcar um item da lista. |
| `singleSelect` | `'p-single-select'` | `boolean` | sim | false | Habilita a seleção para item único atráves de po-radio. |

## Outputs

| Evento | Alias | Tipo | Descrição |
|---|---|---|---|
| `collapsed` | `'p-collapsed'` | `EventEmitter` | Ação que será disparada ao colapsar um item. |
| `expanded` | `'p-expanded'` | `EventEmitter` | Ação que será disparada ao expandir um item. |
| `selected` | `'p-selected'` | `EventEmitter` | Ação que será disparada ao selecionar um item. |
| `unselected` | `'p-unselected'` | `EventEmitter` | Ação que será disparada ao desfazer a seleção de um item. |

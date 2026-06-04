# PoTreeViewItem

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-tree-view-item

Interface para definição dos itens do componente `po-tree-view`.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `expanded` | `boolean` | sim | Expande o item. |
| `isSelectable` | `boolean | null` | sim | Permite ativar/desativar a seleção do item |
| `label` | `string` | não | Desabilita a selecão do item. |
| `selected` | `boolean | null` | sim | Marca o item como selecionado. |
| `subItems` | `Array<PoTreeViewItem>` | sim | Lista de itens do próximo nível, e assim consecutivamente até que se atinja o quarto nível. |
| `value` | `string | number` | não | Valor do item que poderá ser utilizado como referência para sua identificação. |

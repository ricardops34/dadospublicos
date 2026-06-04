# PoGridRowActions

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-grid-row-actions

Ações executadas durante a manipulação das linhas do grid.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `afterRemove` | `() => void` | sim | Método executado após uma linha do grid ser removida. |
| `afterSave` | `(row: any) => void` | sim | Método executado após uma linha do grid ser salva, ao ser executado, o método irá receber um objeto com os dados atualizados. |
| `beforeInsert` | `(row: any) => boolean` | sim | Método executado antes de uma nova linha ser inserida no grid, se o método retornar algo diferente de `true` a ação |
| `beforeRemove` | `(row: any) => boolean` | sim | Método executado antes de uma linha ser removida do grid, ao ser executado, o método irá receber uma cópia do objeto |
| `beforeSave` | `(updatedRow: any, originalRow: any) => boolean` | sim | Método executado antes de uma linha ser atualizada, ao ser executado, o método irá receber um objeto com os dados atualizados |

# PoPageDynamicTableBeforeRemoveAll

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-page-dynamic-table-before-remove-all

Definição da estrutura de retorno da url ou método executado através da
propriedade `beforeRemoveAll`.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `allowAction` | `boolean` | sim | Define se deve ou não executar a ação de exclusão `(remove all)` |
| `newUrl` | `string` | sim | Nova rota para enviar o `remove all`, deve substituir a rota definida anteriormente. |
| `resources` | `Array<any>` | sim | Lista com as keys dos recursos que serão enviados para a ação `removeAll` |

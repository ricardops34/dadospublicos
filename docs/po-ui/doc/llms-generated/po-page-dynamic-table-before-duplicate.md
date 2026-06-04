# PoPageDynamicTableBeforeDuplicate

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-page-dynamic-table-before-duplicate

Definição da estrutura de retorno da url ou método executado através da
propriedade `beforeDuplicate`.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `allowAction` | `boolean` | sim | Define se deve ou não executar a ação de duplicação de recurso (*duplicate*) |
| `newUrl` | `string` | sim | Nova rota para navegação que substituirá a definida anteriormente em `duplicate`. |
| `resource` | `any` | sim | Objeto com as novas propriedades para duplicação, o mesmo substituirá o objeto atual. |

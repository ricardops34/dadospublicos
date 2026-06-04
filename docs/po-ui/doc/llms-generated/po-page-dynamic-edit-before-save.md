# PoPageDynamicEditBeforeSave

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-page-dynamic-edit-before-save

Definição da estrutura de retorno da url ou método executado através da
propriedade `beforeSave`.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `allowAction` | `boolean` | sim | Define se deve ou não executar a ação salvar (save). |
| `newUrl` | `string` | sim | Nova rota para salvar o recurso, que substituirá a rota definida anteriormente em `save`. |
| `resource` | `any` | sim | Recurso atualizado. |

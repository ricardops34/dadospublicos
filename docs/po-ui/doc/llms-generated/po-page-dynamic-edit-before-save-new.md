# PoPageDynamicEditBeforeSaveNew

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-page-dynamic-edit-before-save-new

Definição da estrutura de retorno da url ou método executado através da
propriedade `beforeSaveNew`.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `allowAction` | `boolean` | sim | Define se deve ou não executar a ação salvar e novo (saveNew). |
| `newUrl` | `string` | sim | Nova rota de redirecionamento, que substituirá a rota definida anteriormente em `saveNew`. |
| `resource` | `any` | sim | Recurso atualizado. |

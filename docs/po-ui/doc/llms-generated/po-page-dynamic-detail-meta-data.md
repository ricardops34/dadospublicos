# PoPageDynamicDetailMetaData

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-page-dynamic-detail-meta-data

Interface para as propriedades de uma página dinâmica.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `actions` | `PoPageDynamicDetailActions` | sim | Ações que o usuário poderá executar na página através de botões. |
| `autoRouter` | `boolean` | sim | Cria automaticamente as rotas de edição (novo/duplicate) e detalhes caso sejam definidas ações na propriedade `p-actions` |
| `breadcrumb` | `PoBreadcrumb` | sim | Objeto com propriedades do breadcrumb. |
| `fields` | `Array<PoPageDynamicDetailField>` | sim | Lista dos campos usados no formulário de detalhe. |
| `title` | `string` | sim | Título da página. |
| `version` | `string` | sim | Versão do metadata, o sistema irá buscar a versão nas próximas iteração. |

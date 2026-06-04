# PoPageDynamicEditMetadata

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-page-dynamic-edit-metadata

Interface para as propriedades de uma página dinâmica.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `actions` | `PoPageDynamicEditActions` | sim | Ações que o usuário poderá executar na página através de botões. |
| `autoRouter` | `boolean` | sim | Cria automaticamente as rotas de edição (novo/duplicate) e detalhes caso sejam definidas ações na propriedade `p-actions` |
| `breadcrumb` | `PoBreadcrumb` | sim | Objeto com propriedades do breadcrumb. |
| `fields` | `Array<PoPageDynamicEditField>` | sim | Lista dos campos usados. |
| `title` | `string` | sim | Título da página. |
| `version` | `number` | não | Versão do metadado devolvido pelo backend. |

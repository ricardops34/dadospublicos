# PoPageDynamicDetailActions

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-page-dynamic-detail-actions

Interface para as ações do componente po-page-dynamic-detail.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `back` | `string | boolean | Function` | sim | Rota de redirecionamento para ação de voltar, caso não seja especificada será usado o comando `history.back()`. |
| `beforeBack` | `string | (() => PoPageDynamicDetailBeforeBack)` | sim | Ação que é executada antes da ação `back` e que serve para realização de validações prévias. |
| `beforeEdit` | `string | ((id: any, resource: any) => PoPageDynamicDetailBeforeEdit)` | sim | Rota ou método que será chamado antes de editar um recurso (edit). |
| `beforeRemove` | `string | ((id: any, resource: any) => PoPageDynamicDetailBeforeRemove)` | sim | Rota ou método que será chamado antes de excluir um recurso (remove). |
| `edit` | `string | ((id: any, resource: any) => void)` | sim | Rota para edição do recurso, caso seja preenchida irá habilitar a ação de edição na tabela. |
| `remove` | `string | ((id: any, resource: any) => void)` | sim | Rota de redirecionamento que será executada após a confirmação da exclusão do registro. |

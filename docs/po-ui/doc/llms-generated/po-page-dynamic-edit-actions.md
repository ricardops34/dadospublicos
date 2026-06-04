# PoPageDynamicEditActions

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-page-dynamic-edit-actions

Interface para as ações do componente po-page-dynamic-edit.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `beforeCancel` | `string | (() => PoPageDynamicEditBeforeCancel)` | sim | Rota ou método que será chamado antes de executar a ação de cancelamento (cancel). |
| `beforeSave` | `string | ((resource: any, id: string) => PoPageDynamicEditBeforeSave)` | sim | Rota ou método que será chamado antes de salvar um recurso (save). |
| `beforeSaveNew` | `string | ((resource: any, id: string) => PoPageDynamicEditBeforeSaveNew)` | sim | Rota ou método que será chamado antes de executar o evento salvar e abrir novo registro (saveNew). |
| `cancel` | `string | boolean | Function` | sim | Rota de redirecionamento para ação de cancelar, caso não seja especificada será usado o comando `navigator.back()`. |
| `save` | `string | ((resource: any, id: string) => void)` | sim | Rota de redirecionamento ou método para executar o envio dos dados ao servidor. |
| `saveNew` | `string | ((resource: any, id?: string) => void)` | sim | Rota de redirecionamento ou método para executar o envio dos dados ao servidor. |

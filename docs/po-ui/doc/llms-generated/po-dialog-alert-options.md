# PoDialogAlertOptions

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-dialog-alert-options

Interface para o título e a mensagem do serviço po-dialog. Interface com as propriedades da caixa de diálogo de alerta do serviço po-dialog.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `componentsSize` | `string` | sim | Define o tamanho dos componentes de formulário no dialog: |
| `literals` | `PoDialogAlertLiterals` | sim | Objeto com as literais usadas no `po-dialog` do tipo alerta. |
| `message` | `string` | não | Mensagem da caixa de diálogo. |
| `ok` | `Function` | sim | Ação executada ao fechar o alerta pelo botão "Ok". |
| `title` | `string` | não | Título da caixa de diálogo. |

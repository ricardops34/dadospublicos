# PoDialogConfirmOptions

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-dialog-confirm-options

Interface para o título e a mensagem do serviço po-dialog. Interface com as propriedades da caixa de diálogo de confirmação do serviço po-dialog.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `cancel` | `Function` | sim | Ação de cancelamento da caixa de diálogo. |
| `close` | `Function` | sim | Ação de fechamento da caixa de diálogo. |
| `componentsSize` | `string` | sim | Define o tamanho dos componentes de formulário no dialog: |
| `confirm` | `Function` | não | Ação de confirmação da caixa de diálogo. |
| `literals` | `PoDialogConfirmLiterals` | sim | Objeto com as literais usadas no `po-dialog` do tipo confirmação. |
| `message` | `string` | não | Mensagem da caixa de diálogo. |
| `title` | `string` | não | Título da caixa de diálogo. |

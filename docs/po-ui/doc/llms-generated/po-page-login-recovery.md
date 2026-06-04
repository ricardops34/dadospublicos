# PoPageLoginRecovery

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-page-login-recovery

Interface para especificação do tipo de recuperação de senha no `po-modal-password-recovery`.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `contactMail` | `string` | sim | Definição do e-mail que é exibido na mensagem para contato de suporte. |
| `phoneMask` | `string` | sim | Definição da máscara do campo de telefone. |
| `type` | `PoModalPasswordRecoveryType` | sim | Enum para especificação do tipo de recuperação de senha [PoModalPasswordRecoveryType](/documentation/po-modal-password-recovery). |
| `url` | `string` | não | Endpoint usado pelo template **PoModalPasswordRecovery** para requisição do recurso. |

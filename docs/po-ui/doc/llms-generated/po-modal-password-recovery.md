# PoModalPasswordRecovery

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-modal-password-recovery

Interface com a definição do objeto gerado pelo formulário do componente `po-modal-password-recovery`.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `code` | `string` | sim | Valor contendo o código enviado por SMS e digitado pelo usuário. |
| `email` | `string` | sim | Valor contendo o email enviado pelo usuário. |
| `hash` | `string` | sim | Código de validação da solicitação do SMS para ser enviado junto com o código de verificação do SMS |
| `retry` | `number` | sim | Número de tentativas de reenvio. |
| `sms` | `string` | sim | Valor contendo o número de telefone enviado pelo usuário. |
| `token` | `string` | sim | Token de alteração de senha |
| `urlChangePassword` | `string` | sim | URL para o formulário de alteração de senha |
| `urlValidationCode` | `string` | sim | URL usada para validação do código enviado por SMS |

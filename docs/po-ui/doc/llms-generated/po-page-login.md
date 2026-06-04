# PoPageLogin

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-page-login

Interface com a definição do objeto gerado pelo formulário do componente `po-page-login`.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `login` | `string` | não | Login preenchido pelo usuário. |
| `password` | `string` | não | Senha preenchida pelo usuário, a mesma será convertida para [hash/md5] antes de ser enviada para a aplicação. |
| `rememberUser` | `boolean` | não | Essa propriedade informa se o usuário quer que seus dados sejam lembrados em um acesso futuro. |

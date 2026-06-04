# PoHttpRequestData

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-http-request-data

Interface para definição de uma requisição HTTP.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `body` | `any` | sim | Corpo da requisição. |
| `formField` | `string` | sim | Nome da propriedade que conterá o arquivo enviado para o servidor |
| `headers` | `Array<PoHttpHeaderOption>` | sim | Cabeçalho da requisição. |
| `method` | `PoHttpRequestType` | não | Método HTTP que será utilizado. |
| `url` | `string` | não | URL que será utilizada na requisição. |

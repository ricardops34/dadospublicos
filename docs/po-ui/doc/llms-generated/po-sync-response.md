# PoSyncResponse

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-sync-response

Define a resposta dos eventos enviados ao servidor.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `customRequestId` | `string` | sim | Identificador customizado do registro. |
| `id` | `number` | não | Identificador do evento na fila. |
| `request` | `PoHttpRequestData` | não | Dados da requisição. |
| `response` | `HttpResponse<object> | HttpErrorResponse | PoEventSourcingErrorResponse` | não | Resposta retornada após a tentativa de envio para o servidor. |

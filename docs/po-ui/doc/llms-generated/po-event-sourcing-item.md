# PoEventSourcingItem

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-event-sourcing-item

Classe que irá mapear as informações dos `EventSourcing` gerados pela aplicação.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `customRequestId` | `string` | sim | Identificador customizado do registro. |
| `dateTime` | `number` | não | Valor numérico correspondente ao horário da data em que o registro foi criado de acordo com o horário universal. |
| `id` | `number` | não | Identificador do registro. |
| `operation` | `PoEventSourcingOperation` | não | Especifica a operação que deverá ser realizada na API. |
| `record` | `any | PoHttpRequestData` | não | Objeto *json* com os dados do registro. |
| `schema` | `string` | sim | Nome do *schema* à qual se refere o `EventSourcing`. |

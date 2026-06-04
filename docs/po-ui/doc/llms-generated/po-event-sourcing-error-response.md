# PoEventSourcingErrorResponse

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-event-sourcing-error-response

Classe que define a resposta de erro para um item da fila de eventos que não foi enviado ao servidor por
alguma inconsistência.

> Pode ser utilizada em casos onde um item da fila é enviado ao servidor com inconsistência nos dados, por exemplo
uma operação de *delete* ou *update* sem o `id` do objeto.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `message` | `string` | não | Mensagem de erro. |
| `operation` | `PoEventSourcingOperation` | não | Operação que havia sido requisitada. |

# PoResponseApi

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-response-api

Interface que representa a estrutura de uma resposta de sucesso HTTP.

> Utilizada apenas quando a resposta incluir uma coleção de itens.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `hasNext` | `boolean` | não | Indica se existe uma próxima página com mais registros para aquela coleção de itens. |
| `items` | `Array<any>` | não | Lista de itens retornados. |

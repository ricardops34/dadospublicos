# ErrorAsyncProperties

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/error-async-properties

Interface para realizar uma validação assíncrona no componente.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `errorAsync` | `(value) => Observable<boolean>` | não | Função obrigatória executada para realizar a validação assíncrona personalizada. |
| `triggerMode` | `'change' | 'changeModel'` | sim | Controla se o método será executado no disparo do output `change` ou `change-model`. |

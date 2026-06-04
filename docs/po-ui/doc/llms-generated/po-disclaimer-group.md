# PoDisclaimerGroup

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-disclaimer-group

Interface que representa o objeto `po-disclaimer-group`.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `change` | `Function` | sim | Função que será disparada quando a lista de *disclaimers* for modificada. |
| `disclaimers` | `Array<PoDisclaimer>` | não | Lista de *disclaimers*. |
| `hideRemoveAll` | `boolean` | sim | Oculta o botão para remover todos os *disclaimers* do grupo. |
| `remove` | `Function` | sim | Função que será disparada quando um *disclaimer* for removido da lista de |
| `removeAll` | `Function` | sim | Função que será disparada quando todos os *disclaimers* forem removidos da lista de *disclaimers* pelo usuário, |
| `title` | `string` | sim | Título do grupo de *disclaimers*. |

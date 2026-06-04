# PoTableFilteredItemsParams

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-table-filtered-items-params

Interface do objeto enviado como parâmetro da função `getItems`.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `filter` | `string` | sim | Conteúdo utilizado para filtrar a lista de items. |
| `order` | `string` | sim | Coluna que está sendo ordenada na tabela. |
| `page` | `number` | sim | Controla a paginação dos dados e recebe um valor automaticamente a cada clique no botão 'Carregar mais resultados'. |
| `pageSize` | `number` | sim | Quantidade de itens retornados cada vez que o serviço é chamado, por padrão é 10. |
| `queryParams` | `{
    [key: string]: string | number | boolean;
}` | sim | Objeto utilizado para filtros personalizados. |
| `size` | `string` | sim | Define o tamnho dos componentes de formulário no table. |

# PoTableColumn

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-table-column

Interface para configuração das colunas do `po-table`.

As definições das colunas serão aplicadas linha a linha.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `action` | `Function` | sim | Define uma ação na coluna quando o tipo da coluna for `link` ou `icon`. |
| `boolean` | `PoTableBoolean` | sim | Define um objeto do tipo `PoTableBoolean` para as colunas do tipo _boolean_. Por exemplo: |
| `color` | `string | Function` | sim | Define a cor que será aplicada no conteúdo da coluna. |
| `detail` | `PoTableDetail` | sim | Define um objeto que segue a interface `PoTableDetail`, para as colunas de detalhes. Por exemplo: |
| `disabled` | `Function` | sim | Função que deve retornar um booleano para habilitar ou desabilitar o *link* e sua ação. |
| `format` | `string` | sim | Formato de exibição do valor da coluna. |
| `icons` | `Array<PoTableColumnIcon>` | sim | Define um *array* de objetos para colunas de ícones que irá sobrepor os valores como `action` e `color` |
| `label` | `string` | sim | Texto para título da coluna. |
| `labels` | `Array<PoTableColumnLabel>` | sim | Define um array de objetos para as colunas de label, onde 'labels' é uma lista de objetos |
| `link` | `string` | sim | Define o nome da propriedade que conterá o `link` a ser redirecionado. |
| `property` | `string` | sim | Nome identificador da coluna. Também permite objetos aninhados conforme exemplo abaixo. |
| `sortable` | `boolean` | sim | Controla se a coluna será considerada como "ordenavel". Caso seja definido um valor falso, a coluna não será usada para |
| `subtitles` | `Array<PoTableSubtitleColumn>` | sim | Define um array de objetos para as colunas de legenda. Onde, `subtitles` é uma lista de objetos do tipo PoTableSubtitle na qual |
| `tooltip` | `string` | sim | Define um texto de ajuda que será exibido ao passar o *mouse* sobre um texto. |
| `type` | `string` | sim | Tipo da coluna. |
| `visible` | `boolean` | sim | Controla a exibição da coluna. Caso seja definido um valor falso, a coluna não será exibida mas mas será possível torná-la |
| `width` | `string` | sim | hoje o tamanho mínimo das colunas é de 32px, respeitando o padding lateral. |

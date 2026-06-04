# PoPageDynamicDetailField

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-page-dynamic-detail-field

Interface dos fields usados para compor o template `po-page-dynamic-detail`.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `alt` | `string` | sim | Defini o texto alternativo descrevendo a imagem. |
| `booleanFalse` | `string` | sim | Texto exibido quando o valor do componente for *false*. |
| `booleanTrue` | `string` | sim | Texto exibido quando o valor do componente for *true*. |
| `color` | `string` | sim | Determina a cor da tag. As maneiras de customizar as cores são: |
| `concatLabelValue` | `boolean` | sim | Permite que seja exibido em tela, de forma concatenada as propriedades `fieldLabel` + `fieldValue`. |
| `container` | `string` | sim | Exibirá um container para todos os campos abaixo dessa propriedade. |
| `divider` | `string` | sim | Exibirá um divisor acima, utilizando o seu conteudo como título. |
| `duplicate` | `boolean` | sim | Indica se o campo será duplicado caso seja executada a ação de duplicação. |
| `fieldLabel` | `string` | sim | Nome da propriedade do objeto retornado que será utilizado como descrição do campo. |
| `fieldValue` | `string` | sim | Nome da propriedade do objeto retornado que será utilizado como valor do campo. |
| `format` | `string | Array<string>` | sim | Define o formato de exibição para o valor de um campo. |
| `gridColumns` | `number` | sim | Tamanho de exibição do campo em telas. |
| `gridLgColumns` | `number` | sim | Tamanho de exibição do campo em telas grandes (lg). |
| `gridLgPull` | `number` | sim | Tamanho do espaçamento após o campo antes da exibição do próximo campo em telas grandes (lg). |
| `gridMdColumns` | `number` | sim | Tamanho de exibição do campo em telas médias (md). |
| `gridMdPull` | `number` | sim | Tamanho do espaçamento após o campo antes da exibição do próximo campo em telas médias (md). |
| `gridSmColumns` | `number` | sim | Tamanho de exibição do campo em telas menores (sm). |
| `gridSmPull` | `number` | sim | Tamanho do espaçamento após o campo antes da exibição do próximo campo em telas menores (sm). |
| `gridXlColumns` | `number` | sim | Tamanho de exibição do campo em telas extra grandes (xl). |
| `gridXlPull` | `number` | sim | Tamanho do espaçamento após o campo antes da exibição do próximo campo em telas extra grandes (xl). |
| `height` | `string` | sim | Defini o texto alternativo descrevendo a imagem. |
| `icon` | `string` | sim | Define um ícone que será exibido ao lado do valor para o campo do tipo *tag*. |
| `image` | `boolean` | sim | Possibilita a utilização de imagem. |
| `isArrayOrObject` | `boolean` | sim | Define que a propriedade `property` é uma lista ou um objeto. |
| `key` | `boolean` | sim | Identificador |
| `label` | `string` | sim | Rótulo do campo exibido. |
| `offsetColumns` | `number` | sim | Tamanho do espaço de exibição do campo em telas. |
| `offsetLgColumns` | `number` | sim | Tamanho do espaço de exibição do campo em telas grandes (lg). |
| `offsetMdColumns` | `number` | sim | Tamanho do espaço de exibição do campo em telas médias (md). |
| `offsetSmColumns` | `number` | sim | Tamanho do espaço de exibição do campo em telas menores (sm). |
| `offsetXlColumns` | `number` | sim | Tamanho do espaço de exibição do campo em telas extra grandes (xl). |
| `options` | `Array<{
    label: string;
    value: string | number;
}>` | sim | Lista de opções que podem ser vinculadas à propriedade p-value. |
| `optionsMulti` | `boolean` | sim | Habilita a visualização de múltiplos itens. |
| `optionsService` | `string | PoComboFilter | PoMultiselectFilter` | sim | Serviço que será utilizado para buscar os itens e preencher a lista de opções dinamicamente. |
| `order` | `number` | sim | Informa a ordem de exibição do campo. |
| `params` | `any` | sim | Objeto que será enviado como parâmetro nas requisições de busca `searchService` ou `optionsService` |
| `property` | `string` | não | Nome de referência do campo. |
| `searchService` | `string | PoDynamicViewRequest` | sim | Serviço customizado para um campo em específico. |
| `tag` | `boolean` | sim | Indica se o campo será um `po-tag`. |
| `textColor` | `string` | sim | Determina a cor do texto da tag. As maneiras de customizar as cores são: |
| `type` | `string | PoDynamicFieldType` | sim | Tipo do valor campo. |
| `visible` | `boolean` | sim | Indica se o campo será visível. |

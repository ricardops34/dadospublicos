# PoTableColumnLabel

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-table-column-label

Interface para configuração das colunas de labels do `po-table`.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `color` | `string` | sim | Define a cor do label. |
| `icon` | `boolean | string | TemplateRef<void>` | sim | Define ou ativa um ícone que será exibido ao lado do valor da *tag*. |
| `label` | `string` | não | Texto que será exibido na coluna. |
| `textColor` | `string` | sim | Determina a cor do texto da tag. As maneiras de customizar as cores são: |
| `tooltip` | `string` | sim | Define um texto de ajuda que será exibido ao passar o *mouse* em cima do *label*. |
| `type` | `PoTagType` | sim | Define o tipo da *tag*. |
| `value` | `string | number` | não | Valor que será usado como referência para exibição do conteúdo na coluna. |

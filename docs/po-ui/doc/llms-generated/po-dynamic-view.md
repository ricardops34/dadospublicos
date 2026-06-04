# PoDynamicViewComponent

**Seletor:** `po-dynamic-view`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-dynamic-view

Componente para listar dados dinamicamente a partir de uma lista de objetos.

> Por padrão esse componente cria `po-info` para exibição, é possível criar `po-tag` passando a propriedade { tag: true }.

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `componentsSize` | `'p-components-size'` | `string` | sim | `medium` | Define o tamanho dos componentes no template entre `small` ou `medium`. |
| `fields` | `'p-fields'` | `PoDynamicViewField[]` | sim | `[]` | Lista de objetos que implementam a interface `PoDynamicView`. |
| `load` | `'p-load'` | `string | Function` | sim | - | Possibilita executar uma função quando o componente é inicializado. |
| `showAllValue` | `'p-show-all-value'` | `boolean` | sim | `false` | Indica se exibirá todas as informações contidas dentro do objeto informado na propriedade `p-value`. |
| `textWrap` | `'p-text-wrap'` | `boolean` | sim | `false` | Permite a quebra de linha no texto do `p-value`, aplicando-a onde há `\n`. |
| `value` | `'p-value'` | `object` | não | - | Objeto que será utilizado para exibir as informações dinâmicas, o valor será recuperado através do atributo *property* |

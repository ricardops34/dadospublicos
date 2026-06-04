# PoInfoComponent

**Seletor:** `po-info`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-info

Este componente tem como objetivo renderizar valores na tela no estilo label na parte superior e
valor na parte inferior. Facilita a exibição de dados pois vem com layout padrão PO.

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `label` | `'p-label'` | `string` | não | - | Valor do rótulo a ser exibido. |
| `labelSize` | `'p-label-size'` | `number` | sim | - | Quantidade de [colunas](/guides/grid-system) usadas para a exibição da `p-label` quando o componente for |
| `orientation` | `'p-orientation'` | `PoInfoOrientation` | sim | `vertical` | Define o layout de exibição. |
| `size` | `'p-size'` | `string` | sim | `medium` | Define o tamanho do componente entre `small` ou `medium`. |
| `url` | `'p-url'` | `string` | sim | - | Ao informar uma URL, o conteúdo será exibido na forma de um *link* e ao ser clicado será redirecionado para a URL informada. |
| `value` | `'p-value'` | `string` | sim | - | Valor do conteúdo a ser exibido. |

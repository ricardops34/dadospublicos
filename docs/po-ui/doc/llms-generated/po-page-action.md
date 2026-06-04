# PoPageAction

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-page-action

Interface para as ações dos componentes `po-page-default` e `po-page-list`.

As ações podem ser exibidas como botões no cabeçalho ou agrupadas em um *dropdown*,
conforme o `PoPageActionsLayout` e o tamanho da tela.

> As propriedades `separator`, `selected` e `subItems` possuem efeito apenas quando
a ação é exibida dentro do *dropdown*.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `action` | `Function` | sim | Ação que será executada, sendo possível passar o nome ou a referência da função. |
| `disabled` | `boolean | Function` | sim | Desabilita a ação. Aceita um valor booleano ou uma função que retorna booleano. |
| `icon` | `string | TemplateRef<void>` | sim | Ícone exibido ao lado esquerdo do rótulo. |
| `kind` | `string` | sim | Define o estilo visual da ação quando exibida como botão fora do *dropdown*. |
| `label` | `string` | não | Rótulo da ação. |
| `selected` | `boolean` | sim | Define se a ação está selecionada. |
| `separator` | `boolean` | sim | Atribui uma linha separadora acima do item. |
| `subItems` | `Array<PoPopupAction>` | sim | Define uma lista de subitens para criação de menus aninhados. |
| `type` | `string` | sim | Define a cor do item. |
| `url` | `string` | sim | URL para redirecionamento. Aceita rotas internas e links externos. |
| `visible` | `boolean | Function` | sim | Define a visibilidade da ação. Aceita um valor booleano ou uma função que retorna booleano. |

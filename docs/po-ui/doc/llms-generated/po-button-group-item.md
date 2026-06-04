# PoButtonGroupItem

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-button-group-item

Interface para os itens do `po-button-group`.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `action` | `Function` | não | Ação executada ao clicar sobre o botão. |
| `disabled` | `boolean` | sim | Se verdadeiro, define o botão como desabilitado. |
| `icon` | `string | TemplateRef<void>` | sim | Ícone exibido ao lado esquerdo do label do botão. |
| `label` | `string` | sim | Label do botão. |
| `selected` | `boolean` | sim | Define se o botão está selecionado. Utilizado juntamente à propriedade `p-toggle`. |
| `tooltip` | `string` | sim | Define a mensagem a ser exibida ao posicionar o *mouse* sobre o botão. |

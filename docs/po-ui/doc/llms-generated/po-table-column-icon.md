# PoTableColumnIcon

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-table-column-icon

Interface que define a coluna com ícone(s) do `po-table`.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `action` | `Function` | sim | Define a ação que será executada ao clicar no ícone. |
| `color` | `string | Function` | sim | Define a cor do ícone. |
| `disabled` | `Function` | sim | Função que deve retornar um booleano para habilitar ou desabilitar o ícone e sua ação. |
| `icon` | `string | TemplateRef<void>` | sim | É possível usar qualquer um dos ícones da [Biblioteca de ícones](https://po-ui.io/icons). conforme exemplo abaixo: |
| `tooltip` | `string` | sim | Define um texto de ajuda que será exibido ao passar o *mouse* em cima do ícone. |
| `value` | `string` | não | Define o valor do ícone que será exibido. |

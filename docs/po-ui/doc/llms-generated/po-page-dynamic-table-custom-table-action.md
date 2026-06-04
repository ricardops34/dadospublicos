# PoPageDynamicTableCustomTableAction

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-page-dynamic-table-custom-table-action

Interface com as propriedades para adicionar uma ação customizada na tabela da página.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `action` | `string | ((resource?: any) => any)` | sim | Ação que será executada ao clicar no botão. |
| `concatKeys` | `boolean` | sim | Permite concatenar o valor de propriedades definidas como keys na url via path parameter. |
| `disabled` | `boolean | Function` | sim | Função que deve retornar um booleano para habilitar ou desabilitar a ação para o registro selecionado. |
| `icon` | `string | TemplateRef<void>` | sim | Define um ícone que será exibido ao lado esquerdo do rótulo. |
| `label` | `string` | não | Rótulo do botão que será exibido. |
| `url` | `string` | sim | Rota para o qual será redirecionado ao clicar no botão. |
| `visible` | `boolean | Function` | sim | Define se a ação será visível. |

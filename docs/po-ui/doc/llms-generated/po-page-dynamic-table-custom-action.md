# PoPageDynamicTableCustomAction

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-page-dynamic-table-custom-action

Interface com as propriedades para adicionar uma ação customizada na página.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `action` | `string | ((resources?: any) => void)` | sim | Ação que será executada ao clicar no botão. |
| `icon` | `string | TemplateRef<void>` | sim | Define um ícone que será exibido ao lado esquerdo do rótulo. |
| `label` | `string` | não | Rótulo do botão que será exibido. |
| `selectable` | `boolean` | sim | Ao utilizar essa propriedade ela habilita a seleção na tabela e também desabilita |
| `url` | `string` | sim | Rota para o qual será redirecionado ao clicar no botão. |
| `visible` | `boolean | Function` | sim | Define se a ação será visível. |

# PoProgressAction

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-progress-action

Interface para as ações dos componentes po-progress e po-upload.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `disabled` | `boolean | Function` | sim | Função que deve retornar um booleano para habilitar ou desabilitar a ação para o registro selecionado. |
| `icon` | `string | TemplateRef<void>` | sim | Define um ícone que será exibido ao lado esquerdo do rótulo. |
| `label` | `string` | sim | Rótulo da ação. |
| `type` | `string` | sim | Define a cor do item, sendo `default` o padrão. |
| `visible` | `boolean | Function` | sim | Define se a ação será visível. |

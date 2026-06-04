# PoNavbarIconAction

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-navbar-icon-action

Interface para lista de ações dos ícones do componente.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `action` | `Function` | sim | Ação que será executada, deve-se passar a referência da função. |
| `icon` | `string | TemplateRef<void>` | sim | Ícone exibido. |
| `label` | `string` | não | Rótulo da ação, será exibido quando o mesmo for aberto no popup. |
| `link` | `string` | sim | link utilizado no redirecionamento das páginas. |
| `tooltip` | `string` | sim | Mensagem exibida ao passar o mouse no ícone quando o mesmo estiver na navbar. |

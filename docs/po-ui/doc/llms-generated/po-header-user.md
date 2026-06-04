# PoHeaderUser

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-header-user

Interface* que define a seção de Customer do header.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `action` | `Function` | sim | Evento emitido ao clicar na seção |
| `avatar` | `string` | não | Logo representando o perfil |
| `customerBrand` | `string` | não | Imagem da marca |
| `items` | `Array<PoHeaderActionToolItem>` | sim | Itens de ações |
| `popover` | `PoHeaderActionPopoverAction` | sim | Template que será utilizado na ação |
| `status` | `'positive' | 'negative' | 'warning' | 'disabled'` | sim | Indicação representando o estado do usuário |

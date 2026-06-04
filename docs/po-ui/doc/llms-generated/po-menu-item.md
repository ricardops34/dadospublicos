# PoMenuItem

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-menu-item

Interface para os itens de menu do componente po-menu.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `action` | `Function` | sim | Ação personalizada para clique do item de menu. |
| `badge` | `PoMenuItemBadge` | sim | Badge do item de menu. |
| `icon` | `string | TemplateRef<void>` | sim | É possível usar qualquer um dos ícones da [Biblioteca de ícones](https://po-ui.io/icons). conforme exemplo abaixo: |
| `label` | `string` | não | Texto do item de menu. |
| `link` | `string` | sim | Link para redirecionamento no click do item do menu, podendo ser um link interno ou externo. |
| `shortLabel` | `string` | sim | Texto curto exibido através de um tooltip para o item que aparece quando o menu estiver colapsado. |
| `subItems` | `Array<PoMenuItem>` | sim | Lista de sub-items, criando novos níveis dentro do menu. O número máximo de níveis do menu é igual a 4. |

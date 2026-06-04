# PoBadgeComponent

**Seletor:** `po-badge`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-badge

Utilizado para exibir a quantidade de notificações.

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `ariaLabel` | `'p-aria-label'` | `string` | não | - | Define um `aria-label` para o `po-badge` |
| `color` | `'p-color'` | `string` | sim | `color-07` | Determina a cor do `po-badge`. As maneiras de customizar as cores são: |
| `icon` | `'p-icon'` | `PoBadgeIcon` | sim | - | Ícone exibido no `po-badge`. |
| `showBorder` | `'p-show-border'` | `boolean` | não | - | Exibe uma borda para o `po-badge` |
| `size` | `'p-size'` | `PoBadgeSize` | não | `medium` | Define o tamanho do `po-badge` |
| `status` | `'p-status'` | `PoBadgeStatus` | não | - | Define o estado do `po-badge` |
| `value` | `'p-value'` | `number` | não | - | Número exibido no componente, caso o mesmo seja maior que 9 o valor exibido será 9+. |

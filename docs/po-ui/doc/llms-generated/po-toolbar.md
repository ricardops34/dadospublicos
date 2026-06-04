# PoToolbarComponent

**Seletor:** `po-toolbar`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-toolbar

O componente `po-toolbar` é um cabeçalho para o título da aplicação e informações de usuário e notificações quando houver necessidade.

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `actions` | `'p-actions'` | `Array<PoToolbarAction>` | sim | - | Define uma lista de ações que serão exibidas ao clicar no ícone declarado em `p-actions-icon`. |
| `actionsIcon` | `'p-actions-icon'` | `string | TemplateRef<void>` | sim | `an-dots-three` | Define um [ícone](https://po-ui.io/icons) para a propriedade `p-actions`. |
| `notificationActions` | `'p-notification-actions'` | `Array<PoToolbarAction>` | sim | - | Lista de ações da notificação. |
| `notificationNumber` | `'p-notification-number'` | `number` | sim | - | Número de notificações. |
| `profile` | `'p-profile'` | `PoToolbarProfile` | sim | - | Define o objeto que será o cabeçalho da lista de ações com as informações do perfil. |
| `profileActions` | `'p-profile-actions'` | `Array<PoToolbarAction>` | sim | - | Define uma lista de ações que serão exibidas ao clicar no ícone do perfil. |
| `showNotification` | `'p-show-notification'` | `boolean` | sim | - | Se falso, oculta o ícone de notificações. |
| `title` | `'p-title'` | `string` | não | - | Título do *toolbar* e aplicação. |

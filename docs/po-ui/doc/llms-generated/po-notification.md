# PoNotification

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-notification

Interface para uso do serviço PoNotification.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `action` | `Function` | sim | Ação para a notificação. |
| `actionLabel` | `string` | sim | Label do botão quando houver uma ação definida. |
| `duration` | `number` | sim | Define em milissegundos o tempo de duração que a notificação ficará disponível em tela. O padrão é 9000 milissegundos. |
| `message` | `string` | não | Mensagem a ser exibida na notificação. |
| `mode` | `PoToasterMode` | sim | Define o Modo/Tipo do Toaster. |
| `orientation` | `PoToasterOrientation` | sim | Posição da notificação na página que pode ser ```Top``` (topo) ou ```Bottom```(rodapé). A posição padrão é `bottom`. |
| `showClose` | `boolean` | sim | Exibe o botão de fechar a notificação. |
| `sizeActions` | `string` | sim | Define o tamanho das ações: |
| `supportMessage` | `string` | sim | Mensagem de suporte a ser exibida na notificação. |

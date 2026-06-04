# PoNotificationService

**Tipo:** Serviço
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-notification-service

Serviço responsável por emitir as notificações em uma página. São disponibilizados os métodos de:

- success,
- warning,
- error,
- information.

Cada um destes métodos recebe como parâmetro o objeto `PoNotification` que contém os dados da mensagem e o
objeto ViewContainerRef que é a representação do container do componente onde será criada a notificação.

Estas notificações serão exibidas durante 9 segundos por padrão, podendo ser alterada conforme necessidade.
Após este tempo a mesma é removida automaticamente.

Notificações com ação ou notificações de `erro` permanecerão em tela até o usuário fecha-lá ou clicar na ação.

O serviço possui um limite de até 5 notificações por vez, a partir do sexto a primeira notificação será removida dando lugar a nova.

## Métodos

### `success(notification: TypeUnion)`

Emite uma notificação de sucesso.

### `warning(notification: TypeUnion)`

Emite uma notificação de atenção.

### `error(notification: TypeUnion)`

Emite uma notificação de erro.

### `information(notification: TypeUnion)`

Emite uma notificação de informação.

### `setDefaultDuration(defaultDuration: number)`

Define em milissegundos a duração padrão para as notificações.

> Padrão 9 segundos.

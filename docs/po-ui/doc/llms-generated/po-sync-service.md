# PoSyncService

**Tipo:** Serviço
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-sync-service

O `PoSyncService` é utilizado para configurar toda a base de dados que receberá as informações que serão
armazenadas *offline* vindas do servidor. Nele ocorre toda a preparação dos modelos de dados retornados por
cada consulta.

## Métodos

### `destroy()`

Destrói todas as chaves do *storage* referentes ao `po-sync`, ou seja,
as definições dos *schemas*, os registros de cada *schema* e a fila
de eventos que estão para ser enviados ao servidor *(EventSourcing)*.

> Para que não venham ocorrer erros em ações que dependam das definições dos *schemas*,
recomenda-se utilizar o método `prepare()` em seguida.

> Veja mais detalhes em [Fundamentos do PO Sync - Alterando as definições dos schemas](/guides/sync-fundamentals).

### `disableSync()`

Desabilita todos os tipos de sincronização de dados (periódica, reativa e manual).

> Para habilitar novamente a sincronização utilize o método [`PoSyncService.enableSync()`](documentation/po-sync#enable-sync).

### `enableSync()`

Habilita todos os tipos de sincronização de dados (periódica, reativa e manual).

Por padrão, sempre que se inicializa uma aplicação com PO Sync as sincronizações já estão habilitadas.

### `getResponses()`

Método que disponibiliza a partir de sua inscrição o evento de retorno das operações da fila de eventos que
foram enviadas ao servidor. A cada operação enviada para o servidor, será disparado um evento para a inscrição
deste método.

> Veja mais detalhes em [Fundamentos do PO Sync - Capturando respostas da sincronização](/guides/sync-fundamentals).

### `getModel(schemaName: string)`

Retorna uma instância de `PoEntity` para um determinado *schema*.

> Veja mais detalhes em [Fundamentos do PO Sync - Manipulando os registros de um schema](/guides/sync-fundamentals).

### `insertHttpCommand(poHttpRequestData: PoHttpRequestData, customRequestId: string)`

Insere uma requisição HTTP na fila de eventos do `po-sync`.

> Veja mais detalhes em [Fundamentos do PO Sync - Inserindo requisições HTTP na fila de eventos](/guides/sync-fundamentals).

### `loadData()`

Efetua uma chamada na API do servidor para realizar a carga inicial dos dados. Deve ser chamado apenas uma vez
na aplicação, após a preparação dos *schemas* realizada através do método `PoSyncService.prepare()`.

> Veja mais detalhes em [Fundamentos do PO Sync - Carga inicial dos dados](/guides/sync-fundamentals).

### `onSync()`

Responsável por notificar sempre que houver sincronismo.

> Veja mais detalhes em [Fundamentos do PO Sync - Notificação pós-sincronização](/guides/sync-fundamentals).

### `prepare(schemas: TypeApplication, config: PoSyncConfig)`

Prepara a aplicação criando os schemas e aplica as configurações.

> Veja mais detalhes em [Fundamentos do PO Sync - Preparando a aplicação](/guides/sync-fundamentals).

### `removeItemOfSync(idEventSourcing: any)`

Remove um item da fila de eventos que espera a sincronização.

> Veja mais detalhes em [Fundamentos do PO Sync - Capturando respostas da sincronização](/guides/sync-fundamentals).

### `resumeSync()`

Reenvia os comandos pendentes na fila (inclusão, alteração e exclusão) e busca novos dados do servidor.

> Veja mais detalhes em [Fundamentos do PO Sync - Capturando respostas da sincronização](/guides/sync-fundamentals).

### `sync()`

Dispara o sincronismo enviando os eventos pendentes (inclusão, alteração e exclusão) e buscando novos dados do servidor.

O sincronismo somente será executado depois que o acesso a base de dados local do dispositivo for liberada.

> Veja mais detalhes em [Fundamentos do PO Sync - Sincronização manual](/guides/sync-fundamentals).

# PoStorageService

**Tipo:** Serviço
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-storage-service

O PO Storage é uma biblioteca que fornece um serviço para armazenamento de dados no dispositivo local, sendo semelhante
ao funcionamento do [IonicStorage](https://ionicframework.com/docs/storage/).
É possível utilizar os drivers [Websql](https://dev.w3.org/html5/webdatabase/), [Indexeddb](https://www.w3.org/TR/IndexedDB/),
[LocalStorage](https://html.spec.whatwg.org/multipage/webstorage.html) e também [LokiJS](https://github.com/techfort/LokiJS/wiki).

Para um melhor ganho de performance ao buscar e salvar dados, recomendamos a utilização do `LokiJS`, um *database*
orientado a documento semelhante ao MongoDB, que além de permitir a persistência dos dados no dispositivo possibilita
também o armazenamento dos dados em memória. Outra vantagem, é o aumento do limite de armazenamento para
aproximadamente `300mb`.

A estrutura utilizada para armazenar os dados é a de chave/valor, onde uma chave funciona como um identificador exclusivo.

#### Instalando o PO Storage

Para instalar o `po-storage` em sua aplicação execute o seguinte comando:

```shell
`ng add @po-ui/ng-storage`
```
Será instalado o pacote `@po-ui/ng-storage` e também já importará `PoStorageModule` no módulo principal da sua aplicação, conforme abaixo:

```typescript
import { PoStorageModule } from '@po-ui/ng-storage';

@NgModule({
 declarations: [...],
 imports: [
   // Importação do módulo PoStorageModule
   PoStorageModule.forRoot(),
 ],
 bootstrap: [IonicApp],
 providers: [...]
})
export class AppModule {}
```

Com a declaração do módulo, é criada uma base de dados no armazenamento local e o serviço `PoStorageService` estará
pronto para ser utilizada na sua aplicação.

#### Configurando as opções de armazenamento

Na importação do módulo, o método `PoStorageModule.forRoot()` pode receber como parâmetro um objeto do tipo
[`PoStorageConfig`](documentation/po-storage#po-storage-config),
que serve para configurar as opções personalizadas do armazenamento, como por exemplo: o tipo de armazenamento
preferêncial.

Caso não seja passada nenhuma configuração a ordem padrão será: ['websql', 'indexeddb', 'localstorage', 'lokijs'].

Abaixo segue um exemplo de configuração onde o storage preferencial passa a ser o `lokijs`:

```typescript
import { PoStorageModule } from '@po-ui/ng-storage';

@NgModule({
 declarations: [...],
 imports: [
   // Importação do módulo PoStorageModule com a configuração personalizada
   PoStorageModule.forRoot({
     name: 'mystorage',
     storeName: '_mystore',
     driverOrder: ['lokijs', 'websql', 'indexeddb', 'localstorage']
   }),
 ],
 bootstrap: [IonicApp],
 providers: [...]
})
export class AppModule {}
```

## Métodos

### `appendArrayToArray(key: string, value: Array)`

Busca uma lista armazenada pela chave e concatena com a lista passada por parâmetro.

Por exemplo:

``` typescript
const clients = [ { name: 'Marie', age: 23 }, { name: 'Pether', age: 39 }];

this.poStorageService.set('clientKey', clients).then(() => {});

...

const newClients = [ { name: 'Lisa', age: 36 }, { name: 'Bruce', age: 18 } ];

this.poStorageService.appendArrayToArray('clientKey', newClients).then(() => {
  // A lista agora será:
  // [ { name: 'Marie', age: 23 }, { name: 'Pether', age: 39 }, { name: 'Lisa', age: 36 }, { name: 'Bruce', age: 18 }];
});
```

### `appendItemToArray(key: string, value: Array)`

Acrescenta um item em uma lista armazenada pela chave.

### `clear()`

Remove todos os itens da base de dados local configurada na declaração do módulo `PoStorageModule`.

> Utilize este método com cautela, para evitar a perda indesejada de dados.

### `exists(key: string)`

Verifica se existe um valor dentro de uma determinada chave.

### `forEach(iteratorCallback: any)`

Itera sobre todas as chaves armazenadas.

### `get(key: string, lock: boolean)`

Retorna o valor armazenado em uma determinada chave.

### `getDriver()`

Retorna o nome do *driver* que está sendo usado para armazenar os dados, por exemplo: localStorage.

### `getFirstItem(key: string)`

Retorna o primeiro item de uma lista para uma determinada chave.

### `getItemAndRemove(key: string)`

Remove o primeiro item de uma lista a partir da chave.

### `getItemByField(key: string, fieldName: string, fieldValue: any)`

Busca o primeiro objeto encontrado dentro de uma lista pelo do valor de um campo.

Por exemplo:

``` typescript
const clients = [ { name: 'Marie', age: 23 }, { name: 'Pether', age: 39 }];

this.poStorageService.set('clientKey', clients).then(() => {});

...

this.poStorageService.getItemByField('clientKey', 'name', 'Marie').then(client => {
  // Resultado do console.log: { name: 'Marie', age: 23 }
  console.log(client);
});
```

### `keys()`

Lista com todas as chaves armazenadas.

### `length()`

Quantidade de chaves armazenadas.

### `limitedCallWrap(limitedResource: FunctionType)`

Utilizado para gerenciar o bloqueio e desbloqueio de recursos no `PoStorageService`.
Aguardando a liberação da utilização dos recursos que participam deste comportamento e posteriormente envolve o recurso
passado como parâmetro em um comportamento de bloqueio e desbloqueio.

Este método se comporta igual a utilização em conjunta dos métodos: `PoStorageService.requestIdlePromise()`,
`PoStorageService.lock()` e `PoStorageService.unlook()`.

Veja mais no método: [`PoStorage.requestIdlePromise()`](documentation/po-storage#request-idle-promise).

### `lock()`

Incrementa um valor na fila de bloqueio do `PoStorageService`. Utilizado juntamente com o método `unlock` para poder
controlar a execução de uma determinada tarefa com o `PoStorage.requestIdlePromise()`.

Veja mais no método: [`PoStorage.requestIdlePromise()`](documentation/po-storage#request-idle-promise).

### `ready()`

Determina se o processo de inicialização do *driver* assíncrono foi concluído.

### `remove(key: key)`

Remove um valor associado a uma chave.

### `removeIndexFromObject(key: string, property: string)`

Remove uma propriedade de um objeto armazenado.

### `removeItemFromArray(key: string, field: string, value: string)`

Remove um objeto de uma lista armazenada pelo valor de uma propriedade.

Por exemplo:

``` typescript
const clients = [ { name: 'Marie', age: 23 }, { name: 'Pether', age: 39 }];

this.poStorageService.set('clientKey', clients).then(() => {});

...

this.poStorageService.removeItemFromArray('clientKey', 'name', 'Marie').then(() => {
  // O objeto { name: 'Marie', age: 23 } foi removido da lista que está na chave 'clientKey'
});
```

### `requestIdlePromise()`

Método que verifica se o acesso a base de dados configurada está liberado.

Utilizado em conjunto com os métodos `lock()` e `unlock()` entre tarefas que não podem ser executadas de forma
paralela, para não causar inconsistências nos dados.

Exemplo de utilização:

```
// Aguarda a liberação para continuar
await this.poStorage.requestIdlePromise();

this.poStorage.lock();

// Executa uma tarefa que irá ler e/ou escrever na base de dados configurada.

this.poStorage.unlock();
```

> É importante sempre utilizá-lo antes de executar os métodos `lock()` e `unlock()` para garantir que a tarefa só
será executada caso o acesso esteja livre.

### `set(key: string, value: any, lock: boolean)`

Grava um valor em uma determinada chave.

### `setIndexToObject(key: string, property: string, value: any)`

Atribui um valor a uma propriedade de um objeto armazenado pela chave.

Por exemplo:

``` typescript
const clients = [ { name: 'Marie', age: 23 }, { name: 'Pether', age: 39 }];

this.poStorageService.set('clientKey', clients).then(() => {});

...

this.poStorageService.setIndexToObject('clientKey', 'name', 'Clare').then(() => {
  // O objeto { name: 'Marie', age: 23 } passa a ser { name: 'Clare', age: 23 }
});
```

### `unlock()`

Decrementa um valor na fila de bloqueio. Utilizado juntamente com o método `lock` para poder
controlar a execução de uma determinada tarefa com o `PoStorage.requestIdlePromise()`.

Veja mais no método: [`PoStorage.requestIdlePromise()`](documentation/po-storage#request-idle-promise).

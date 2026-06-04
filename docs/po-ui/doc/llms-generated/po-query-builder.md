# PoQueryBuilder

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-query-builder

Classe utilitária para construir consultas sobre os registros de um *schema*.

A utilização dos métodos desta classe é feita a partir do retorno do método `PoEntity.find()`. Por exemplo,
para utilizar o método `PoQueryBuilder.page()`, é necessário:

``` typescript
PoSyncService.getModel('schema name').find().page(2).exec();
```

O `PoQueryBuilder` foi projetado para que os seus métodos sejam
chamados em cascata e ao final desse encadeamento invocar o método
`PoQueryBuilder.exec()` para que a busca seja concluída. Por exemplo:

``` typescript
PoSyncService
  .getModel('schema name')
  .find()
  .page(2)
  .pageSize(5)
  .sort()
  .exec();
```

## Métodos

### `exec()`

Ao final da chamada dos métodos do `PoQueryBuilder` utilizados, este método deve ser chamado para que a busca seja concluída.

### `filter(filter: object)`

Aplica filtros sobre os registros, baseados nos campos e valores definidos como filtro. Por exemplo:

```
PoQueryBuilder.filter({ name: 'Marie', age: 24 });
```
Retorna todos os registros que contenham a propriedade `name` igual a Marie e `age` igual a 24.

### `limit(limit: number)`

Limita o número de registros que serão retornados.

### `page(page: number)`

Especifica a página de registros que se deseja retornar.

### `pageSize(pageSize: number)`

Define quantos elementos serão retornados por página.

### `select(fields: string)`

Utilizado para definir quais campos do *schema* serão retornados na consulta.

### `sort(field: string)`

Ordena os registros por um campo.

### `where(filter: object)`

Essa função serve como alias para o `PoQueryBuilder.filter()`. É utilizada somente para dar maior legibilidade ao código.

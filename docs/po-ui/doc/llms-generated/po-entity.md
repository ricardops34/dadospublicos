# PoEntity

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-entity

Uma instância `PoEntity` representa um *schema* e ela contém métodos que possibilitam manipular seus registros,
como por exemplo: buscar, criar e remover.

Esta instância pode ser obtida a partir do retorno do método `PoSyncService.getModel('schema name')`.

## Métodos

### `find(filter: object, fields: string)`

Busca os registros do *schema*, podendo filtrar o resultado a partir do filtro passado e retornando apenas
os campos definidos.

Para que esta busca seja concluída é necessário utilizar o método `PoQueryBuilder.exec()`.
Veja mais em: [PoQueryBuilder](/documentation/po-query-builder).

### `findById(id: any, fields: string)`

Busca um registro pelo seu *id*.

Para que esta busca seja concluída é necessário utilizar o método `PoQueryBuilder.exec()`.
Veja mais em: [PoQueryBuilder](/documentation/po-query-builder).

### `findOne(filter: any, fields: string)`

Semelhante ao método `PoEntity.find()`, porém retorna apenas o primeiro registro encontrado na busca.

Para que esta busca seja concluída é necessário utilizar o método `PoQueryBuilder.exec()`.
Veja mais em: [PoQueryBuilder](/documentation/po-query-builder).

### `remove(record: object, customRequestId: string)`

Remove um registro.

### `save(record: object, customRequestId: string)`

Altera ou inclui um registro.

> O registro será alterado se ele possuir um *id*, caso contrário um novo registro será criado.

### `saveAll(records: TypeApplication, customRequestIds: TypeUnion)`

Salva uma lista de registros em lote.

> Para cada registro da lista, será inserido um novo registro se o mesmo não tiver *id*, caso contrário
será contado como uma atualização de um registro existente.

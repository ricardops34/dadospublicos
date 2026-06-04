# PoPageDynamicTableMetaData

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-page-dynamic-table-meta-data

Interface para as propriedades de uma página dinâmica.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `actions` | `PoPageDynamicTableActions` | sim | Ações que o usuário poderá executar na página através de botões. |
| `autoRouter` | `boolean` | sim | Cria automaticamente as rotas de edição (novo/duplicate) e detalhes caso sejam definidas ações na propriedade `p-actions` |
| `breadcrumb` | `PoBreadcrumb` | sim | Objeto com propriedades do breadcrumb. |
| `concatFilters` | `boolean` | sim | Permite a utilização da pesquisa rápida junto com a pesquisa avançada. |
| `fields` | `Array<PoPageDynamicTableFilters>` | sim | Lista dos campos usados na tabela e busca avançada. |
| `hideCloseDisclaimers` | `Array<string>` | sim | Lista de filtros que terão a opção de fechar ocultada |
| `hideRemoveAllDisclaimer` | `boolean` | sim | Oculta o botão para remover todos os *disclaimers*. |
| `keepFilters` | `boolean` | sim | Mantém na modal de Busca Avançada os valores preenchidos do último filtro realizado pelo usuário. |
| `pageCustomActions` | `Array<PoPageDynamicTableCustomAction>` | sim | Lista de ações customizadas da página que serão incorporadas às ações informadas através da propriedade `actions` |
| `quickSearchWidth` | `number` | sim | Largura do campo de busca, utilizando o *Grid System*, |
| `tableCustomActions` | `Array<PoPageDynamicTableCustomTableAction>` | sim | Lista de ações customizadas da tabela que serão incorporadas às ações informadas através da propriedade `actions`. |
| `title` | `string` | sim | Título da página. |
| `version` | `string` | sim | Versão do metadata, o sistema irá buscar a versão nas próximas iteração. |

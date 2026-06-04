# PoPageListComponent

**Seletor:** `po-page-list`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-page-list

O componente `po-page-list` é utilizado como o container principal para as telas de listagem de dados,
podendo ser apresentado como lista ou tabela.

Este componente possibilita realizar filtro dos dados, no qual permite que seja atribuido uma função que será executada no momento
da filtragem. Este comportamento pode ser acionado tanto ao *click* do ícone [an-magnifying-glass](https://po-ui.io/icons)
quanto ao pressionar da tecla *ENTER* quando o foco estiver no campo de pesquisa.

Para facilitar a manipulação e visualização dos filtros aplicados, é possível também utilizar o componente
[`po-disclaimer-group`](/documentation/po-disclaimer-group).

#### Tokens customizáveis

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade | Descrição | Valor Padrão |
|---------------------|---------------------------------------------|---------------------------------------|
| **Header** | | |
| `--padding` | Espaçamento do header | `var(--spacing-xs) var(--spacing-md)` |
| `--gap` | Espaçamento entre os breadcrumbs e o título | `var(--spacing-md)` |
| `--gap-actions` | Espaçamento entre as ações | `var(--spacing-xs)` |
| `--font-family` | Família tipográfica do título | `var(--font-family-theme)` |
| **Content** | | |
| `--padding-content` | Espaçamento do conteúdo | `var(--spacing-xs) var(--spacing-sm)` |

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `actions` | `'p-actions'` | `Array<PoPageAction>` | sim | - | Nesta propriedade deve ser definido um array de objetos que implementam a interface `PoPageAction`. |
| `breadcrumb` | `'p-breadcrumb'` | `PoBreadcrumb` | sim | - | Objeto que implementa as propriedades da interface `PoBreadcrumb`. |
| `componentsSize` | `'p-components-size'` | `string` | sim | `medium` | Define o tamanho dos componentes de formulário no template: |
| `disclaimerGroup` | `'p-disclaimer-group'` | `PoDisclaimerGroup` | sim | - | Objeto que implementa as propriedades da interface `PoDisclaimerGroup`. |
| `filter` | `'p-filter'` | `PoPageFilter` | não | - | Objeto que implementa as propriedades da interface `PoPageFilter`. |
| `literals` | `'p-literals'` | `PoPageListLiterals` | sim | - | Objeto com as literais usadas no `po-page-list`. |
| `quickSearchValue` | `'p-quick-search-value'` | `string` | sim | - | Valor padrão na busca rápida ao inicializar o componente |
| `subtitle` | `'p-subtitle'` | `string` | sim | - | Subtitulo do Header da página |
| `title` | `'p-title'` | `string` | não | - | Título da página. |

## Métodos

### `clearInputSearch()`

Limpa o campo de pesquisa.

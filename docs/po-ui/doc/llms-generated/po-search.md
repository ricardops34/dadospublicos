# PoSearchComponent

**Seletor:** `po-search`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-search

O componente search, também conhecido como barra de pesquisa, é utilizado para ajudar os usuários a localizar um determinado conteúdo.

Normalmente localizado no canto superior direito, junto com o ícone de lupa, uma vez que este ícone é amplamente reconhecido.

#### Boas práticas

Foram estruturados os padrões de usabilidade para auxiliar na utilização do componente e garantir uma boa experiência
aos usuários. Portanto, é de extrema importância que, ao utilizar este componente, as pessoas responsáveis por seu
desenvolvimento considerem os seguintes critérios:
- Utilize labels para apresentar resultados que estão sendo exibidos e apresente os resultados mais relevantes
primeiro.
- Exiba uma mensagem clara quando não forem encontrados resultados para busca e sempre que possível ofereça outras
sugestões de busca.
- Mantenha o texto original no campo de input, que facilita a ação do usuário caso queira fazer uma nova busca com
alguma modificação na pesquisa.
- Caso seja possível detectar um erro de digitação, mostre os resultados para a palavra "corrigida", isso evita a
frustração de não obter resultados e não força o usuário a realizar uma nova busca.
- Quando apropriado, destaque os termos da busca nos resultados.
- A entrada do campo de pesquisa deve caber em uma linha. Não use entradas de pesquisa de várias linhas.
- Recomenda-se ter apenas uma pesquisa por página. Se você precisar de várias pesquisas, rotule-as claramente para
indicar sua finalidade.
- Se possível, forneça sugestões de pesquisa, seja em um helptext ou sugestão de pesquisa que é um autocomplete. Isso
ajuda os usuários a encontrar o que estão procurando, especialmente se os itens pesquisáveis forem complexos.

#### Acessibilidade tratada no componente

Algumas diretrizes de acessibilidade já são tratadas no componente, internamente, e não podem ser alteradas pelo
proprietário do conteúdo. São elas:
- Permitir a interação via teclado (2.1.1: Keyboard (A));
- Alteração entre os estados precisa ser indicada por mais de um elemento além da cor (1.4.1: Use of Color);

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade | Descrição | Valor Padrão |
|----------------------------------------|-------------------------------------------------------|---------------------------------------------------|
| **Default Values** | | |
| `--font-family` | Família tipográfica do campo | `var(--font-family-theme)` |
| `--font-size` | Tamanho da fonte do campo | `var(--font-size-default)` |
| `--text-color-placeholder` | Cor do texto no placeholder | `var(--color-neutral-light-30)` |
| `--color` | Cor das bordas | `var(--color-neutral-dark-70)` |
| `--border-radius` | Raio das bordas | `var(--border-radius-md)` |
| `--background` | Cor de background | `var(--color-neutral-light-05)` |
| `--text-color` | Cor do texto editável | `var(--color-neutral-dark-90)` |
| `--color-clear` | Cor do ícone close | `var(--color-action-default)` |
| `--color-controls` | Cor dos ícones de controle do mode location | `var(--color-action-default)` |
| `--transition-property` | Atributo da transição | `all` |
| `--transition-duration` | Duração da transição | `var(--duration-extra-fast)` |
| `--transition-timing` | Duração da transição com o tipo de transição | `var(--timing-standart)` |
| **Icon** | | |
| `--color-icon-read` | Cor do ícone de busca no modo action | `var(--color-neutral-dark-70)` |
| `--color-icon` | Cor do ícone de busca no modo trigger | `var(--color-action-default)` |
| **Hover** | | |
| `--color-hover` | Cor das bordas no estado hover | `var(--color-action-hover)` |
| `--background-hover` | Cor de background no estado hover | `var(--color-brand-01-lightest)` |
| **Focused** | | |
| `--color-focused` | Cor das bordas no estado de focus | `var(--color-action-default)` |
| `--outline-color-focused` | Cor do outline no estado de focus | `var(--color-action-focus)` |
| **Disabled** | | |
| `--color-disabled` | Cor principal no estado disabled | `var(--color-action-disabled)` |
| `--background-disabled` | Cor de background no estado disabled | `var(--color-neutral-light-20)` |

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `ariaLabel` | `'p-aria-label'` | `string` | sim | - | Define um aria-label para o po-search. |
| `disabled` | `'p-disabled'` | `boolean` | sim | `false` | Desabilita o po-search e não permite que o usuário interaja com o mesmo. |
| `filterKeys` | `'p-filter-keys'` | `Array<any>` | não | - | Define os nomes das propriedades do objeto que serão utilizados para busca em `p-items`. Cada valor definido no |
| `filterSelect` | `'p-filter-select'` | `PoSearchFilterSelect[]` | não | - | Habilita um seletor de filtros à esquerda do campo, permitindo a aplicação de filtros agrupados na busca ou sobre |
| `filterType` | `'p-filter-type'` | `PoSearchFilterMode` | sim | `startsWith` | Define o modo de pesquisa utilizado no campo de busca. Os valores permitidos são definidos pelo enum |
| `icon` | `'p-icon'` | `string | TemplateRef<void>` | sim | - | Permite customizar o ícone de busca que acompanha o campo. |
| `items` | `'p-items'` | `Array<any>` | sim | - | Lista de itens que serão utilizados para pesquisa. |
| `keysLabel` | `'p-keys-label'` | `Array<string>` | sim | - | Define os nomes das propriedades do objeto que serão exibidos como rótulos (labels) no `listbox` quando a propriedade |
| `literals` | `'p-literals'` | `PoSearchLiterals` | sim | - | Objeto com as literais usadas no `po-search`, permitindo personalizar os textos exibidos no componente. |
| `loading` | `'p-loading'` | `boolean` | sim | `false` | Exibe um ícone de carregamento no lado direito do campo para sinalizar que uma operação está em andamento. |
| `locateSummary` | `'p-locate-summary'` | `PoSearchLocateSummary` | sim | - | Define os valores do contador exibido ao usar a propriedade `p-search-type` do tipo `locate`, indicando a posição |
| `name` | `'name'` | `string` | sim | - | Nome e identificador do campo. |
| `noAutocomplete` | `'p-no-autocomplete'` | `boolean` | sim | `false` | Define a propriedade nativa `autocomplete` do campo como `off`. |
| `showListbox` | `'p-show-listbox'` | `boolean` | sim | `false` | Exibe uma lista (auto-complete) com as opções definidas em `p-filter-keys` ou `p-filter-select` enquanto realiza |
| `size` | `'p-size'` | `string` | sim | `medium` | Define o tamanho do componente: |
| `type` | `'p-search-type'` | `searchMode` | sim | `action` | Determina a forma de realizar a pesquisa no componente. Valores aceitos: |

## Outputs

| Evento | Alias | Tipo | Descrição |
|---|---|---|---|
| `blur` | `'p-blur'` | `EventEmitter` | Evento disparado ao sair do campo. |
| `changeModel` | `'p-change-model'` | `EventEmitter` | Evento disparado ao alterar valor do model. |
| `filter` | `'p-filter'` | `EventEmitter` | Pode ser informada uma função que será disparada quando houver alterações nos filtros. |
| `filteredItemsChange` | `'p-filtered-items-change'` | `EventEmitter` | Pode ser informada uma função que será disparada quando houver alterações no input. |
| `focusEvent` | `'p-focus'` | `EventEmitter` | Evento emitido quando o campo de entrada (input) recebe foco. |
| `footerAction` | `'p-footer-action-listbox'` | `EventEmitter` | Evento disparado ao clicar no botão de ação exibido no rodapé do `listbox`. |
| `keydown` | `'p-keydown'` | `EventEmitter` | Evento disparado quando uma tecla é pressionada enquanto o foco está no componente. |
| `listboxOnClick` | `'p-listbox-onclick'` | `EventEmitter` | Pode ser informada uma função que será disparada quando houver click no listbox. |
| `locateNext` | `'p-locate-next'` | `EventEmitter` | Evento disparado ao clicar no controle "Próximo resultado". |
| `locatePrevious` | `'p-locate-previous'` | `EventEmitter` | Evento disparado ao clicar no controle "Resultado anterior". |

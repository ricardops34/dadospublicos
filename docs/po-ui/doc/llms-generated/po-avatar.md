# PoAvatarComponent

**Seletor:** `po-avatar`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-avatar

O componente `po-avatar` é um container para imagens em miniatura, possui um formato redondo e cinco opções de
tamanho, pode ser utilizado para mostrar a foto do perfil de um usuário, entre outras possibilidades.

Além de poder ser utilizado separadamente, é possível usar o `po-avatar` juntamente com outros componentes e criar
layouts ricos e bem interessantes para os usuários, como por exemplo, uma lista de itens ou produtos.

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `loading` | `'p-loading'` | `'eager' | 'lazy'` | sim | `eager` | Indica como o navegador deve carregar a imagem. |
| `size` | `'p-size'` | `string` | sim | `md` | Tamanho de exibição do componente. |
| `src` | `'p-src'` | `string` | não | - | Fonte da imagem que pode ser um caminho local (`./assets/images/logo-black-small.png`) |

## Outputs

| Evento | Alias | Tipo | Descrição |
|---|---|---|---|
| `click` | `'p-click'` | `EventEmitter` | Evento disparado ao clicar na imagem do *avatar*. |

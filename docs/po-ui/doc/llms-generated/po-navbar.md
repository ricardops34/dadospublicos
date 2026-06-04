# PoNavbarComponent

**Seletor:** `po-navbar`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-navbar

O componente `po-navbar` é um cabeçalho fixo que permite apresentar uma lista de links para facilitar a navegação pelas
páginas da aplicação. Também possui ícones com ações.

Quando utilizado em uma resolução menor que `768px`, o componente utilizará o menu corrente da aplicação para
incluir seus itens.

Ao utilizar Navbar com Menu e ambos tiverem logo, será mantido o logo do Navbar.

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `iconActions` | `'p-icon-actions'` | `Array<PoNavbarIconAction>` | sim | - | Define uma lista de ações apresentadas em ícones no lado direito do `po-navbar`. |
| `items` | `'p-items'` | `Array<PoNavbarItem>` | sim | - | Define uma lista de items do `po-navbar`. |
| `literals` | `'p-literals'` | `PoNavbarLiterals` | sim | - | Objeto com a literal usada na propriedade `p-literals`. |
| `logo` | `'p-logo'` | `string` | sim | - | Define a logo apresentada `po-navbar`. |
| `logoAlt` | `'p-logo-alt'` | `string` | sim | `Logomarca início` | Define o texto alternativo para a logomarca. |
| `shadow` | `'p-shadow'` | `boolean` | sim | `false` | Aplica uma sombra na parte inferior do `po-navbar`. |

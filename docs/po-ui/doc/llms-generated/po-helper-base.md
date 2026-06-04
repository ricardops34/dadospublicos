# PoHelperBaseComponent

**Seletor:** `po-helper-base`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-helper-base

O componente `po-helper` exibe um ícone de ajuda ou informação ao lado de campos, botões ou outros elementos, permitindo ao usuário acessar conteúdos explicativos em um popover.

Principais funcionalidades:
- Exibe ícone de ajuda (`help`) ou informação (`info`) conforme configuração.
- Permite definir título, conteúdo e ações no popover via propriedade `p-helper`.
- Suporte a acessibilidade: navegação por teclado, atributos ARIA e leitura do conteúdo por leitores de tela.
- Controle do tamanho do componente via propriedade `p-size` (`small` ou `medium`).
- Permite customizar ações no rodapé do popover.

Exemplo de uso:
```html
<po-helper
  [p-helper]="{ title: 'Ajuda', content: 'Texto explicativo', type: 'help' }"
  [p-size]="'medium'"
></po-helper>
```

Também é possível passar apenas uma string para o conteúdo:
```html
<po-helper p-helper="Texto explicativo"></po-helper>
```

A propriedade `p-helper` aceita um objeto do tipo `PoHelperOptions`:
```typescript
interface PoHelperOptions {
  title?: string;
  content: string;
  type?: 'help' | 'info';
  eventOnClick?: Function;
  footerAction?: { label: string; action: Function };
}
```

> **Importante:** A propriedade `footerAction` não pode ser utilizada quando o tipo do helper for `info`, pois o ícone de informação é destinado apenas para exibir informações estáticas sem ações adicionais.

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade | Descrição | Valor Padrão |
|--------------------------------------------|---------------------------------------------------------------|---------------------------------------------------|
| `--color` | Cor principal do ícone | `var(--color-action-default)` |
| `--border-color-hover` | Cor da borda no estado hover | `var(--color-brand-01-darkest)` |
| `--background-pressed` | Cor de background no estado de pressionado | `var(--color-brand-01-light)` |
| `--color-disabled` | Cor principal no estado disabled | `var(--color-action-disabled)` |

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `appendBox` | `p-append-in-body` | `boolean` | sim | - | Define que o popover será inserido no body da página em vez do elemento definido em `p-target`. Essa opção pode |
| `disabled` | `p-disabled` | `boolean` | sim | `false` | Indica se o helper deve ser exibido no estado desativado, desabilitando interações do usuário. |
| `helper` | `p-helper` | `PoHelperOptions | string` | sim | - | Define o conteúdo e as opções do popover de ajuda/informação. |
| `size` | `p-size` | `string` | sim | `medium` | Define o tamanho do componente: |

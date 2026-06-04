# PoHelperOptions

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-helper-options

Interface* que define as opções de configuração do componente po-helper.

Permite customizar o conteúdo, título, tipo do ícone, modo de abertura do popover, ações customizadas e eventos.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `content` | `string` | sim | Texto explicativo exibido no popover. |
| `eventOnClick` | `Function` | sim | Evento disparado ao clicar no ícone do helper. |
| `footerAction` | `{
    label: string;
    action: Function;
}` | sim | Ação customizada exibida no rodapé do popover. |
| `title` | `string` | sim | Título do helper exibido no popover. |
| `type` | `'info' | 'help'` | sim | Tipo do ícone exibido: `info` ou `help`. |

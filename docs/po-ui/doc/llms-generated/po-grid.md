# PoGridComponent

**Seletor:** `po-grid`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-grid

> Componente em desenvolvimento, podendo haver BREAKING CHANGES nas próximas versões.

Componente grid.

Ações / atalhos:

- ARROW-UP: Navega para celula superior / Na ultima linha adiciona uma linha em branco no grid;
- ARROW-DOWN: Navega para celula inferior;
- ARROW-RIGHT: Navega para celula direita;
- ARROW-LEFT: Navega para celula esquerda;
- TAB: Navega para próxima celula;
- SHIFT+TAB: Navega para celula anterior;
- CTRL+DEL: Remove linha;
- DEL/BACKSPACE: Limpa celula;
- ENTER: Edita linha com valor atual/Confirma edição da celula;
- DOUBLE-CLICK: Edita linha com valor atual;
- ESC: Cancela edição da celula / Cancela inserção de linhas em branco;
- A..Z/0..9: Inicia edição com valor em branco.

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `columns` | `'p-columns'` | `Array<any>` | não | - | Colunas exibidas no grid. |
| `data` | `'p-data'` | `Array<any>` | não | - | Lista com os dados que serão exibidos no grid. |
| `rowActions` | `'p-row-actions'` | `PoGridRowActions` | não | - | Ações disparadas quando uma linha do grid é manipulada. |

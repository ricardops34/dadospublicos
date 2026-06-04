# PoCalendarComponent

**Seletor:** `po-calendar`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-calendar

O `po-calendar` é um componente para seleção de datas que permite a navegação entre meses por meio das setas direcionais
e dos seletores de mês e ano exibidos no cabeçalho.

O componente é recomendado para casos de seleção de datas próximas ao tempo presente. Por padrão, apresenta os dados do
mês atual e apenas um mês por vez, podendo exibir uma data pré-estabelecida conforme o contexto.

Este componente pode receber os seguintes formatos de data:

| Formato | Exemplo |
|--------------------------|-----------------------------|
| `ISO 8601 (Data/Hora)` | `2017-11-28T00:00:00-02:00` |
| `ISO 8601 (Data)` | `2017-11-28` |
| `JavaScript Date Object` | `new Date(2017, 10, 28)` |
> O valor é tratado internamente como **yyyy-mm-dd**.
*Importante:**
- Datas fora do intervalo (`p-min-date` / `p-max-date`) aparecem desabilitadas sem alterar o *model*.

#### Boas práticas

- Evite datas distantes: O uso do calendário não é recomendado para datas muito distantes (como data de nascimento), pois
exige excesso de cliques. Nesses casos, prefira um campo de texto para digitação.
- Impeça seleções ilógicas: Utilize as propriedades de limite para impedir que o usuário selecione períodos inválidos (ex:
data de retorno anterior à de partida).
- Sinalize a disponibilidade: Para datas que não podem ser selecionadas devido a um contexto específico, mantenha-as
inativas por meio de opacidade e desabilite a opção de clique.
- Contexto claro: Certifique-se de que o mês e o ano estejam sempre visíveis no cabeçalho para orientar a pessoa usuária
durante a navegação.

#### Acessibilidade tratada no componente

Algumas diretrizes de acessibilidade já são tratadas no componente, internamente, e não podem ser alteradas pelo
proprietário do conteúdo. São elas:

- Navegação por teclado: O componente permite interação via tecla Tab entre os controles do cabeçalho e navegação no grid
de dias por meio das setas direcionais.
- Foco visual: A área de foco possui espessura de pelo menos 2 pixels CSS e não é sobreposta por outros elementos da tela,
garantindo visibilidade para usuários que utilizam teclado. [WCAG 2.4.12: Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance-enhanced)

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade | Descrição | Valor Padrão |
|----------------------------------|------------------------------------------------------|-----------------------------------|
| **Default Values** | | |
| `--background` | Cor de fundo | `var(--color-neutral-light-00)` |
| `--border-color` | Cor da borda | `var(--color-neutral-light-20)` |
| `--border-radius` | Raio da borda | `var(--border-radius-md)` |
| `--border-width` | Largura da borda | `var(--border-width-sm)` |
| `--shadow` | Contém o valor da sombra do elemento | `var(--shadow-md)` |
| **Weekly cells** | | |
| `--text-color-weekly` | Cor da fonte utilizada nas células semanais | `var(--color-neutral-dark-90)` |
| `--font-family` | Fonte utilizada nas células semanais | `var(--font-family-text)` |
| `--font-size` | Tamanho da fonte utilizada nas células semanais | `var(--font-size-sm)` |
| `--font-weight-weekly` | Peso da fonte utilizada nas células semanais | `var(--font-weight-bold)` |
| **Days cells** | | |
| `--font-weight-days` | Peso da fonte utilizada nas células de dias | `var(--font-weight-normal)` |
| `--text-color` | Cor da fonte utilizada nas células de dias | `var(--color-neutral-dark-90)` |
| `--border-radius-days` | Raio da borda | `var(--border-radius-md)` |
| `--border-width-days` | Largura da borda | `var(--border-width-sm)` |
| `--day-cell-transition-duration` | Duração da transição | `var(--duration-extra-fast)` |
| `--day-cell-transition-property` | Atributo da transição | `all` |
| `--day-cell-transition-timing` | Duração da transição com o tipo de transição | `var(--timing-standart)` |
| **Today** | | |
| `--font-weight-today` | Peso da fonte utilizada na célula de hoje | `var(--font-weight-bold)` |
| `--text-color-today` | Cor da fonte utilizada na célula de hoje | `var(--color-action-default)` |
| **Focused** | | |
| `--outline-color-focused` | Cor do outline do estado de focus | `var(--color-action-focus)` |
| **Hover** | | |
| `--color-hover` | Cor de fundo das células ao passar o mouse | `var(--color-neutral-light-00)` |
| `--text-color-hover` | Cor da fonte utilizada nas células ao passar o mouse | `var(--color-action-hover)` |
| **Interval** | | |
| `--color-interval` | Cor de fundo das células de intervalo | `var(--color-brand-01-lighter)` |
| `--text-color-interval` | Cor da fonte utilizada nas células de intervalo | `var(--color-action-default)` |
| **Next Month** | | |
| `--text-color-next` | Cor da fonte utilizada nas células do próximo mês | `var(--color-action-default)` |
| **Disabled** | | |
| `--border-disabled` | Cor da borda das células desabilitadas | `var(--color-action-disabled)` |
| `--text-color-disabled` | Cor da fonte utilizada nas células desabilitadas | `var(--color-action-disabled)` |
| **Selected** | | |
| `--color-selected` | Cor de fundo das células selecionadas | `var(--color-neutral-light-00)` |
| `--text-color-selected` | Cor da fonte utilizada nas células selecionadas | `var(--color-action-default)` |

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `locale` | `'p-locale'` | `string` | sim | - | Idioma do componente. |
| `maxDate` | `'p-max-date'` | `any` | sim | - | Define a data máxima permitida para seleção. As datas posteriores ao limite definido permanecem visíveis, mas ficam |
| `minDate` | `'p-min-date'` | `any` | sim | - | Define a data mínima para seleção. As datas anteriores ao limite permanecem visíveis, mas desabilitadas para clique. |
| `mode` | `'p-mode'` | `PoCalendarMode` | sim | - | Define o modo de exibição do calendário. |
| `rangePresetOptions` | `'p-range-preset-options'` | `Array<PoCalendarRangePreset>` | sim | - | Lista de presets customizados de intervalos de data exibidos no painel lateral do calendário em modo *range*. |
| `rangePresets` | `'p-range-presets'` | `boolean | Array<string>` | sim | `false` | Habilita a exibição dos presets padrão de intervalos de data no painel lateral do calendário em modo *range*. |
| `rangePresetsOrder` | `'p-range-presets-order'` | `'asc' | 'desc'` | sim | `asc` | Define a ordenação dos presets na lista. |
| `size` | `'p-size'` | `string` | sim | `medium` | Define o tamanho do componente. |

## Outputs

| Evento | Alias | Tipo | Descrição |
|---|---|---|---|
| `change` | `'p-change'` | `EventEmitter` | Evento disparado ao alterar o valor do model. |
| `changeMonthYear` | `'p-change-month-year'` | `EventEmitter` | Evento disparado ao alterar o mês ou o ano no cabeçalho do calendário. |

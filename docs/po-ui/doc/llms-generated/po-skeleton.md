# PoSkeletonComponent

**Seletor:** `po-skeleton`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-skeleton

O componente `po-skeleton` é utilizado para exibir placeholders durante o carregamento de conteúdo,
melhorando a experiência do usuário ao indicar que a informação está sendo processada.

Ele oferece diferentes variantes visuais (texto, retângulo, círculo) e animações (pulse, shimmer)
para simular diversos tipos de conteúdo em estado de carregamento.

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade | Descrição | Valor Padrão |
|----------------------------------------|------------------------------------------------------|---------------------------------|
| **Cores** | | |
| `--color` | Cor de fundo do skeleton (tipo normal) | `var(--color-neutral-light-20)` |
| `--color-primary` | Cor de fundo do skeleton (tipo primary) | `var(--color-neutral-mid-40)` |
| `--color-content` | Cor de fundo do skeleton (tipo content) | `var(--color-neutral-light-00)` |
| `--shimmer-highlight` | Cor de destaque do shimmer (tipo normal) | `var(--color-neutral-light-30)` |
| `--shimmer-highlight-primary` | Cor de destaque do shimmer (tipo primary) | `var(--color-neutral-light-20)` |
| `--shimmer-highlight-content` | Cor de destaque do shimmer (tipo content) | `var(--color-neutral-light-05)` |
| **Espaçamento** | | |
| `--margin-bottom` | Margem inferior do skeleton | `var(--spacing-xs)` |
| **Bordas** | | |
| `--border-radius` | Raio da borda do skeleton | `var(--border-radius-md)` |
| `--border-radius-text` | Raio da borda para a variante text | `var(--border-radius-md)` |
| `--border-radius-primary` | Raio da borda do skeleton (tipo primary) | `var(--border-radius-md)` |
| `--border-radius-content` | Raio da borda do skeleton (tipo content) | `var(--border-radius-lg)` |
| **Transições** | | |
| `--transition-property` | Propriedade CSS da transição | `all` |
| `--transition-duration` | Duração da transição de cor | `var(--duration-moderate)` |
| `--transition-timing` | Função de temporização da transição/animação | `var(--timing-continuous)` |
| **Animações** | | |
| `--animation-duration-pulse` | Duração da animação de pulsação | `var(--duration-very-slow)` |
| `--animation-duration-shimmer` | Duração da animação de brilho deslizante | `var(--duration-ultra-slow)` |

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `animation` | `p-animation` | `PoSkeletonAnimation` | sim | `shimmer` | Define o tipo de animação do skeleton. |
| `ariaLabel` | `p-aria-label` | `string` | sim | - | Define a descrição acessível do conteúdo que está sendo carregado. |
| `borderRadius` | `p-border-radius` | `string` | sim | - | Define o raio da borda do skeleton. |
| `height` | `p-height` | `string` | sim | - | Define a altura do skeleton. |
| `size` | `p-size` | `PoSkeletonSize` | sim | `md` | Define o tamanho do skeleton para as variantes pré-definidas (`rectangle`, `square`, `circle`). |
| `type` | `p-type` | `PoSkeletonType` | sim | `normal` | Define o tipo visual do skeleton, alterando sua cor de fundo. |
| `variant` | `p-variant` | `PoSkeletonVariant` | sim | `text` | Define a variante visual do skeleton. |
| `width` | `p-width` | `string` | sim | `100%` para variante `text`, tamanho baseado em `p-size` para outras variantes | Define a largura do skeleton. |

# PoThemeService

**Tipo:** Serviço
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-theme-service

O serviço `PoThemeService` permite customizar as cores do tema padrão do `PO-UI` e definir o nível de acessibilidade
mais adequado ao projeto.

O nível **AAA** (padrão) garante maior contraste, áreas clicáveis amplas e espaçamentos maiores entre os elementos,
enquanto o nível **AA** mantém a conformidade com as diretrizes de acessibilidade, mas com proporções mais equilibradas
e contornos mais sutis.

O serviço também possibilita configurar a **densidade de espaçamentos**, permitindo ajustar o espaço entre e dentro dos
componentes. Essa configuração pode ser utilizada com qualquer nível de acessibilidade.

> Observação: a customização das cores de `feedback` não é recomendada por motivos de acessibilidade e usabilidade.

> Para saber mais sobre como customizar o tema padrão, consulte o item
[Customização de Temas usando o serviço PO-UI](guides/theme-service) na aba `Guias`.

## Métodos

### `setTheme(themeConfig: PoTheme, themeType: PoThemeTypeEnum, a11yLevel: PoThemeA11yEnum, persistPreference: boolean)`

Aplica um tema ao componente de acordo com o tipo de tema e o nível de acessibilidade especificados.

Este método configura o tema do componente com base no objeto `themeConfig` fornecido, no `themeType` e no `a11yLevel`.
Além disso, ele pode opcionalmente salvar a preferência de tema no localStorage, se solicitado.

### `getA11yLevel()`

Retorna o nível de acessibilidade configurado no tema.
Se não estiver configurado, retorna `AAA` como padrão.

### `setA11yDefaultSizeSmall(enable: boolean)`

Define o tamanho `small` como padrão para componentes que não possuem um tamanho definido. Essa configuração é
aplicada globalmente apenas quando o nível de acessibilidade for `AA`. O valor definido é salvo no
`localStorage` sob a chave `po-default-size` e o atributo `data-default-size` é adicionado ao elemento HTML
para que os componentes possam aplicar o tamanho

Exemplo de uso:

```typescript
import { poThemeDefault, PoThemeService, PoThemeTypeEnum, PoThemeA11yEnum } from '@po-ui/ng-components';

private themeService = inject(PoThemeService);

constructor() {
 this.themeService.setA11yDefaultSizeSmall(true);
 this.themeService.setTheme(poThemeDefault, PoThemeTypeEnum.light, PoThemeA11yEnum.AA);
}
```

> Para garantir que o tamanho `small` seja aplicado corretamente a todos os componentes, recomendamos
definir esta configuração **junto com o nível de acessibilidade `AA` na inicialização da aplicação**.
> Para ajustar a densidade visual dos componentes agrupadores (como pages, container, etc.), utilize também
o método `setDensityMode` conforme necessário.

### `getDensityMode()`

Retorna o modo de adensamento dos componentes agrupadores.
Se não estiver configurado, retorna `medium` como padrão.

### `setDensityMode(mode: TypeUnion)`

Aplica o modo de adensamento compacto (`small`) ou espaçoso (`medium`) para os componentes agrupadores,
independentemente do nível de acessibilidade. O valor definido é salvo no `localStorage` sob a chave
`po-density-mode`.

### `persistThemeActive()`

Restaura e aplica as preferências visuais do usuário para o tema da aplicação, garantindo que essas preferências
sejam persistidas no `localStorage` para uso em recarregamentos futuros.

### `changeCurrentThemeType(themeType: PoThemeTypeEnum)`

Altera o tipo do tema armazenado e aplica os novos estilos ao documento.

Este método altera o tipo do tema armazenado ativo (light/dark)

### `cleanThemeActive(persistPreference: boolean)`

Método remove o tema armazenado e limpa todos os estilos de tema
aplicados ao documento.

### `getThemeActive()`

Retorna o tema ativo como um observable. Este método funcionará apenas se o tema estiver armazenado no `localStorage`.

### `setDefaultTheme(type: PoThemeTypeEnum)`

Define o tema atual como o tema "PoUI Padrão".

### `setThemeType(theme: PoTheme, themeType: PoThemeTypeEnum)`

Define o tipo (light/dark) quando um tema está sendo aplicado.

### `setCurrentThemeType(themeType: PoThemeTypeEnum)`

Define o tipo (light/dark) para um tema já ativo.

### `setThemeA11y(theme: PoTheme, a11y: PoThemeA11yEnum)`

Define o nível de acessibilidade quando um tema está sendo aplicado.

### `setCurrentThemeA11y(a11y: PoThemeA11yEnum)`

Define o nível de acessibilidade para um tema já ativo.

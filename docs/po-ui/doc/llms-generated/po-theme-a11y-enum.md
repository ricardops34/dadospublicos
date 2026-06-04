# PoThemeA11yEnum

**Tipo:** Enum
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-theme-a11y-enum

Enum para configurar o nível de acessibilidade dos componentes através do serviço de tema.

```
import { PoThemeA11yEnum } from '@po-ui/theme';

// Definindo o nível de acessibilidade ao configurar as cores e o tipo do tema (light | dark)
themeService.setTheme(...theme, ...type, PoThemeA11yEnum.AA);

// Definindo o nível de acessibilidade ao configurar apenas as cores do tema
themeService.setThemeA11y(...theme, PoThemeA11yEnum.AAA);

// Alterando o nível de acessibilidade com as cores do tema já definidas
themeService.setCurrentThemeA11y(PoThemeA11yEnum.AAA);
```

## Valores

| Valor | Descrição |
|---|---|
| `AA` | Nível de acessibilidade AA. |
| `AAA` | Nível de acessibilidade AAA. |

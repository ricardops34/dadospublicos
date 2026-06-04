# Tema PO UI inspirado na ALLIA

Este guia descreve um tema PO UI baseado na linguagem visual observada em `https://allia.com.br/` em `2026-05-18`.

## Arquivos gerados

- [temas/allia/allia-theme.ts](C:/Ricardo/po-ui/temas/allia/allia-theme.ts:1)
- [temas/allia/allia-theme-fonts.css](C:/Ricardo/po-ui/temas/allia/allia-theme-fonts.css:1)
- [temas/allia/README.md](C:/Ricardo/po-ui/temas/allia/README.md:1)

## Base visual usada

- tipografia principal `Onest`
- tipografia de destaque `Righteous`
- magenta institucional `#9E1F63`
- roxo de apoio `#662D91`
- teal de contraste `#00AEA5`
- dourado de destaque `#FBBA33`
- superfícies claras com tons lavanda muito suaves
- cards arredondados, sombras suaves e botões pill

## Como aplicar

```typescript
import { inject } from '@angular/core';
import {
  PoThemeA11yEnum,
  PoThemeService,
  PoThemeTypeEnum
} from '@po-ui/ng-components';
import { alliaPoUiTheme } from 'src/temas/allia/allia-theme';

const poThemeService = inject(PoThemeService);

poThemeService.setTheme(
  alliaPoUiTheme,
  PoThemeTypeEnum.light,
  PoThemeA11yEnum.AAA,
  true
);
```

No `angular.json`:

```json
"styles": [
  "node_modules/@po-ui/style/css/po-theme-default.min.css",
  "src/styles.css",
  "src/temas/allia/allia-theme-fonts.css"
]
```

## O que esse tema cobre

- paleta institucional principal
- modos `light` e `dark`
- niveis `AA` e `AAA`
- ajustes globais de tipografia, raios e densidade
- refinamentos por componente para `po-button`, `po-widget`, `po-container`, `po-toolbar`, `po-menu`, `po-tag`, `po-modal` e `po-table`

## Limites

O tema PO UI adapta cor, tipografia, densidade e acabamento dos componentes. Ele nao recria sozinho o layout do site da ALLIA. Para reproduzir a interface completa, ainda seria necessario construir a home e os templates da aplicacao.

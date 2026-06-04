# Tema PO UI inspirado na RCG

Este guia descreve um tema PO UI baseado na linguagem visual observada em `https://rcgdist.com.br/` em `2026-05-18`.

## Arquivos gerados

- [temas/rcg/rcg-theme.ts](C:/Ricardo/po-ui/temas/rcg/rcg-theme.ts:1)
- [temas/rcg/rcg-theme-fonts.css](C:/Ricardo/po-ui/temas/rcg/rcg-theme-fonts.css:1)
- [temas/rcg/README.md](C:/Ricardo/po-ui/temas/rcg/README.md:1)

## Base visual usada

- tipografia principal `Roboto`
- tipografia de destaque `Roboto Slab`
- tipografia de apoio `Jost`
- azul principal `#4097CC`
- azul petróleo `#076085`
- azul acinzentado `#81A6B4`
- magenta de contraste `#B51B7E`
- superfícies claras frias e contraste técnico

## Como aplicar

```typescript
import { inject } from '@angular/core';
import {
  PoThemeA11yEnum,
  PoThemeService,
  PoThemeTypeEnum
} from '@po-ui/ng-components';
import { rcgPoUiTheme } from 'src/temas/rcg/rcg-theme';

const poThemeService = inject(PoThemeService);

poThemeService.setTheme(
  rcgPoUiTheme,
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
  "src/temas/rcg/rcg-theme-fonts.css"
]
```

## O que esse tema cobre

- paleta institucional principal
- modos `light` e `dark`
- níveis `AA` e `AAA`
- ajustes globais de tipografia, raios e densidade
- refinamentos por componente para `po-button`, `po-widget`, `po-container`, `po-toolbar`, `po-menu`, `po-tag`, `po-modal`, `po-table` e `po-page-default`

# Tema RCG para PO UI

Tema PO UI inspirado na linguagem visual observada em `https://rcgdist.com.br/` em `2026-05-18`.

## Direcao visual

- tipografia principal `Roboto`
- tipografia de destaque `Roboto Slab`
- tipografia de apoio `Jost`
- azul principal `#4097CC`
- azul petroleo `#076085`
- azul acinzentado `#81A6B4`
- magenta de contraste `#B51B7E`
- superfícies claras frias, com cards limpos e contraste técnico

## Arquivos

- `rcg-theme.ts`: objeto `PoTheme` com modos `light` e `dark`, em `AA` e `AAA`
- `rcg-theme-fonts.css`: import das fontes usadas como referencia visual

## Uso

```typescript
import { Component, inject, OnInit } from '@angular/core';
import {
  PoThemeA11yEnum,
  PoThemeService,
  PoThemeTypeEnum
} from '@po-ui/ng-components';
import { rcgPoUiTheme } from './rcg-theme';

@Component({
  selector: 'app-root',
  template: '<router-outlet />'
})
export class AppComponent implements OnInit {
  private readonly themeService = inject(PoThemeService);

  ngOnInit(): void {
    this.themeService.setTheme(
      rcgPoUiTheme,
      PoThemeTypeEnum.light,
      PoThemeA11yEnum.AAA,
      true
    );
  }
}
```

No `angular.json`:

```json
"styles": [
  "node_modules/@po-ui/style/css/po-theme-default.min.css",
  "src/styles.css",
  "src/temas/rcg/rcg-theme-fonts.css"
]
```

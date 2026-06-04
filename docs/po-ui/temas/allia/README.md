# Tema ALLIA para PO UI

Tema PO UI inspirado na linguagem visual observada em `https://allia.com.br/` em `2026-05-18`.

## Direcao visual

- tipografia principal `Onest`
- tipografia de destaque `Righteous`
- brand principal magenta `#9E1F63`
- apoio institucional roxo `#662D91`
- acento complementar teal `#00AEA5`
- destaque quente dourado `#FBBA33`
- fundos claros com lavanda muito suave e cards brancos
- cantos arredondados e botoes em formato pill

## Arquivos

- `allia-theme.ts`: objeto `PoTheme` com modos `light` e `dark`, em `AA` e `AAA`
- `allia-theme-fonts.css`: import das fontes usadas como referencia visual

## Uso

```typescript
import { Component, inject, OnInit } from '@angular/core';
import {
  PoThemeA11yEnum,
  PoThemeService,
  PoThemeTypeEnum
} from '@po-ui/ng-components';
import { alliaPoUiTheme } from './allia-theme';

@Component({
  selector: 'app-root',
  template: '<router-outlet />'
})
export class AppComponent implements OnInit {
  private readonly themeService = inject(PoThemeService);

  ngOnInit(): void {
    this.themeService.setTheme(
      alliaPoUiTheme,
      PoThemeTypeEnum.light,
      PoThemeA11yEnum.AAA,
      true
    );
  }
}
```

No `angular.json`, mantenha o css base do PO UI e inclua o arquivo de fontes:

```json
"styles": [
  "node_modules/@po-ui/style/css/po-theme-default.min.css",
  "src/styles.css",
  "src/temas/allia/allia-theme-fonts.css"
]
```

## Ajustes esperados

O site da ALLIA usa uma pilha visual propria, fora do ecossistema PO UI. Entao este tema busca equivalencia de marca, nao reproducao literal de layout.

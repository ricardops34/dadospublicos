import { enableProdMode } from '@angular/core';
import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app-module';

// Suprime NG0100 causado pelo PoPageContentComponent (PO-UI)
// que altera contentOpacity em setTimeout após ngAfterViewInit,
// abortando ciclos de CD e impedindo renderização de dados HTTP.
enableProdMode();

platformBrowser()
  .bootstrapModule(AppModule, {})
  .catch((err) => console.error(err));

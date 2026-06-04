import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoModule } from '@po-ui/ng-components';
import { Painel360MapaComponent } from './painel-360-mapa.component';

@NgModule({
  declarations: [Painel360MapaComponent],
  imports: [CommonModule, PoModule],
  exports: [Painel360MapaComponent],
})
export class Painel360MapaModule {}

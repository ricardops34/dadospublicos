import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { Painel360MapaModule } from '../../painel-360/mapa/painel-360-mapa.module';
import { Painel360Component } from './painel-360.component';

@NgModule({
  declarations: [Painel360Component],
  imports: [
    CommonModule,
    FormsModule,
    PoModule,
    Painel360MapaModule,
    RouterModule.forChild([{ path: '', component: Painel360Component }]),
  ],
})
export class Painel360ClienteModule {}

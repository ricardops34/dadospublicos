import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { Painel360MapaModule } from '../../painel-360/mapa/painel-360-mapa.module';
import { Painel360AdminComponent } from './painel-360-admin.component';

@NgModule({
  declarations: [Painel360AdminComponent],
  imports: [
    CommonModule,
    FormsModule,
    PoModule,
    Painel360MapaModule,
    RouterModule.forChild([{ path: '', component: Painel360AdminComponent }]),
  ],
})
export class Painel360AdminModule {}

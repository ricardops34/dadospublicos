import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { ConsumoComponent } from './consumo.component';

@NgModule({
  declarations: [ConsumoComponent],
  imports: [CommonModule, PoModule, RouterModule.forChild([{ path: '', component: ConsumoComponent }])],
})
export class ConsumoModule {}

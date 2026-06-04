import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { ConsumoAdminComponent } from './consumo-admin.component';

@NgModule({
  declarations: [ConsumoAdminComponent],
  imports: [CommonModule, FormsModule, PoModule, RouterModule.forChild([{ path: '', component: ConsumoAdminComponent }])],
})
export class ConsumoAdminModule {}

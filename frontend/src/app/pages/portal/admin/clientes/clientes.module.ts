import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { PortalClientesComponent } from './clientes.component';

@NgModule({
  declarations: [PortalClientesComponent],
  imports: [CommonModule, PoModule, RouterModule.forChild([{ path: '', component: PortalClientesComponent }])],
})
export class PortalClientesModule {}

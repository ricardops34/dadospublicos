import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { PortalPlanosComponent } from './planos.component';

@NgModule({
  declarations: [PortalPlanosComponent],
  imports: [CommonModule, FormsModule, PoModule, RouterModule.forChild([{ path: '', component: PortalPlanosComponent }])],
})
export class PortalPlanosModule {}

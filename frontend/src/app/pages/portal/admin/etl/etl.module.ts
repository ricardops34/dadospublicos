import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { PortalEtlComponent } from './etl.component';

@NgModule({
  declarations: [PortalEtlComponent],
  imports: [
    CommonModule,
    PoModule,
    RouterModule.forChild([{ path: '', component: PortalEtlComponent }]),
  ],
})
export class PortalEtlModule {}

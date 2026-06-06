import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { PortalEtlComponent } from './etl.component';

@NgModule({
  declarations: [PortalEtlComponent],
  imports: [
    CommonModule,
    FormsModule,
    PoModule,
    RouterModule.forChild([{ path: '', component: PortalEtlComponent }]),
  ],
})
export class PortalEtlModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { PortalRecursosComponent } from './recursos.component';

@NgModule({
  declarations: [PortalRecursosComponent],
  imports: [CommonModule, FormsModule, PoModule, RouterModule.forChild([{ path: '', component: PortalRecursosComponent }])],
})
export class PortalRecursosModule {}

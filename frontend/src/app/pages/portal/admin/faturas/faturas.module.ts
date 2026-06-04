import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { PortalFaturasComponent } from './faturas.component';

@NgModule({
  declarations: [PortalFaturasComponent],
  imports: [CommonModule, FormsModule, PoModule, RouterModule.forChild([{ path: '', component: PortalFaturasComponent }])],
})
export class PortalFaturasModule {}

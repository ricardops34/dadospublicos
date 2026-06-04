import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { PortalAssinaturasComponent } from './assinaturas.component';

@NgModule({
  declarations: [PortalAssinaturasComponent],
  imports: [CommonModule, FormsModule, PoModule, RouterModule.forChild([{ path: '', component: PortalAssinaturasComponent }])],
})
export class PortalAssinaturasModule {}

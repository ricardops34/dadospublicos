import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { MinhasFaturasComponent } from './minhas-faturas.component';

@NgModule({
  declarations: [MinhasFaturasComponent],
  imports: [CommonModule, PoModule, RouterModule.forChild([{ path: '', component: MinhasFaturasComponent }])],
})
export class MinhasFaturasModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { MinhaContaComponent } from './minha-conta.component';

@NgModule({
  declarations: [MinhaContaComponent],
  imports: [CommonModule, FormsModule, PoModule, RouterModule.forChild([{ path: '', component: MinhaContaComponent }])],
})
export class MinhaContaModule {}

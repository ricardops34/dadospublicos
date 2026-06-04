import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { MeuTokenComponent } from './meu-token.component';

@NgModule({
  declarations: [MeuTokenComponent],
  imports: [CommonModule, PoModule, RouterModule.forChild([{ path: '', component: MeuTokenComponent }])],
})
export class MeuTokenModule {}

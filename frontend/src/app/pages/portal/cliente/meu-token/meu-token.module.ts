import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { MeuTokenComponent } from './meu-token.component';

@NgModule({
  declarations: [MeuTokenComponent],
  imports: [CommonModule, FormsModule, PoModule, RouterModule.forChild([{ path: '', component: MeuTokenComponent }])],
})
export class MeuTokenModule {}

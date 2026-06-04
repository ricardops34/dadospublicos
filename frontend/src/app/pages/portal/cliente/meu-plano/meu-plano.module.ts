import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { MeuPlanoComponent } from './meu-plano.component';

@NgModule({
  declarations: [MeuPlanoComponent],
  imports: [CommonModule, FormsModule, PoModule, RouterModule.forChild([{ path: '', component: MeuPlanoComponent }])],
})
export class MeuPlanoModule {}

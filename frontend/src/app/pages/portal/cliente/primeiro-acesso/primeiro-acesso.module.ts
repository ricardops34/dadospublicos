import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { PrimeiroAcessoComponent } from './primeiro-acesso.component';

@NgModule({
  declarations: [PrimeiroAcessoComponent],
  imports: [
    CommonModule,
    FormsModule,
    PoModule,
    RouterModule.forChild([{ path: '', component: PrimeiroAcessoComponent }]),
  ],
})
export class PrimeiroAcessoModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { VerificarEmailComponent } from './verificar-email.component';

const routes: Routes = [
  { path: '', component: VerificarEmailComponent }
];

@NgModule({
  declarations: [VerificarEmailComponent],
  imports: [
    CommonModule,
    PoModule,
    RouterModule.forChild(routes)
  ]
})
export class VerificarEmailModule { }

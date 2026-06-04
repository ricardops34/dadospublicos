import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { ParametrosComponent } from './parametros.component';

const routes: Routes = [
  { path: '', component: ParametrosComponent }
];

@NgModule({
  declarations: [ParametrosComponent],
  imports: [
    CommonModule,
    FormsModule,
    PoModule,
    RouterModule.forChild(routes)
  ]
})
export class ParametrosModule { }

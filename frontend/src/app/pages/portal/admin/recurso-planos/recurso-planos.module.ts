import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { RecursosPlanosComponent } from './recurso-planos.component';

@NgModule({
  declarations: [RecursosPlanosComponent],
  imports: [CommonModule, FormsModule, PoModule, RouterModule.forChild([{ path: '', component: RecursosPlanosComponent }])],
})
export class RecursosPlanosModule {}

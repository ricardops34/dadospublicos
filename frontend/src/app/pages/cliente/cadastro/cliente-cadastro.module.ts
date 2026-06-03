import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { FormsModule } from '@angular/forms';
import { ClienteCadastroComponent } from './cliente-cadastro.component';

const routes: Routes = [{ path: '', component: ClienteCadastroComponent }];

@NgModule({
  declarations: [ClienteCadastroComponent],
  imports: [CommonModule, PoModule, FormsModule, RouterModule.forChild(routes)],
})
export class ClienteCadastroModule {}

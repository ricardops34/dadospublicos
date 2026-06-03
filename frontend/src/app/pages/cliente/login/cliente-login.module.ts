import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { FormsModule } from '@angular/forms';
import { ClienteLoginComponent } from './cliente-login.component';

const routes: Routes = [{ path: '', component: ClienteLoginComponent }];

@NgModule({
  declarations: [ClienteLoginComponent],
  imports: [CommonModule, PoModule, FormsModule, RouterModule.forChild(routes)],
})
export class ClienteLoginModule {}

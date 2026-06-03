import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { FormsModule } from '@angular/forms';
import { AdminLoginComponent } from './admin-login.component';

const routes: Routes = [{ path: '', component: AdminLoginComponent }];

@NgModule({
  declarations: [AdminLoginComponent],
  imports: [CommonModule, PoModule, FormsModule, RouterModule.forChild(routes)],
})
export class AdminLoginModule {}

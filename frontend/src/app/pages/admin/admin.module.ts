import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { AdminDashboardComponent } from './admin-dashboard.component';

const routes: Routes = [
  { path: 'dashboard', component: AdminDashboardComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  declarations: [AdminDashboardComponent],
  imports: [CommonModule, PoModule, RouterModule.forChild(routes)],
})
export class AdminModule {}

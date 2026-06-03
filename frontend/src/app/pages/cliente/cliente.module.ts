import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { ClienteDashboardComponent } from './cliente-dashboard.component';

const routes: Routes = [
  { path: 'dashboard', component: ClienteDashboardComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  declarations: [ClienteDashboardComponent],
  imports: [CommonModule, PoModule, RouterModule.forChild(routes)],
})
export class ClienteModule {}

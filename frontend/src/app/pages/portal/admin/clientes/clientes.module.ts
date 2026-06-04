import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { PoTemplatesModule } from '@po-ui/ng-templates';
import { ClientesDetailComponent } from './clientes-detail.component';
import { ClientesFormComponent } from './clientes-form.component';
import { ClientesListComponent } from './clientes-list.component';

const routes = [
  { path: '', component: ClientesListComponent },
  { path: 'new', component: ClientesFormComponent },
  { path: 'edit/:id', component: ClientesFormComponent },
  { path: 'view/:id', component: ClientesDetailComponent }
];

@NgModule({
  declarations: [
    ClientesDetailComponent, 
    ClientesFormComponent, 
    ClientesListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PoModule,
    PoTemplatesModule,
    RouterModule.forChild(routes),
  ],
})
export class PortalClientesModule {}

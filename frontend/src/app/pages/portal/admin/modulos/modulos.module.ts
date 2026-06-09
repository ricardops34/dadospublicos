import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { PoTemplatesModule } from '@po-ui/ng-templates';
import { ModulosListComponent } from './modulos-list.component';
import { ModulosFormComponent } from './modulos-form.component';

const routes = [
  { path: '', component: ModulosListComponent },
  { path: 'new', component: ModulosFormComponent },
  { path: 'edit/:id', component: ModulosFormComponent },
];

@NgModule({
  declarations: [ModulosListComponent, ModulosFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    PoModule,
    PoTemplatesModule,
    RouterModule.forChild(routes),
  ],
})
export class PortalModulosModule {}

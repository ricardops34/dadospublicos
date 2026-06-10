import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { PoTemplatesModule } from '@po-ui/ng-templates';
import { UsuariosAdminListComponent } from './usuarios-admin-list.component';

const routes = [
  { path: '', component: UsuariosAdminListComponent },
];

@NgModule({
  declarations: [UsuariosAdminListComponent],
  imports: [
    CommonModule,
    FormsModule,
    PoModule,
    PoTemplatesModule,
    RouterModule.forChild(routes),
  ],
})
export class UsuariosAdminModule {}

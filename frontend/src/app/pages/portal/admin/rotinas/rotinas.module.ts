import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { PoTemplatesModule } from '@po-ui/ng-templates';
import { RotinasListComponent } from './rotinas-list.component';
import { RotinasFormComponent } from './rotinas-form.component';

const routes = [
  { path: '', component: RotinasListComponent },
  { path: 'new', component: RotinasFormComponent },
  { path: 'edit/:id', component: RotinasFormComponent },
];

@NgModule({
  declarations: [RotinasListComponent, RotinasFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    PoModule,
    PoTemplatesModule,
    RouterModule.forChild(routes),
  ],
})
export class PortalRotinasModule {}

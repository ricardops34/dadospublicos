import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { PoTemplatesModule } from '@po-ui/ng-templates';
import { PerfisListComponent } from './perfis-list.component';
import { PerfisFormComponent } from './perfis-form.component';

const routes = [
  { path: '', component: PerfisListComponent },
  { path: 'new', component: PerfisFormComponent },
  { path: 'edit/:id', component: PerfisFormComponent },
];

@NgModule({
  declarations: [PerfisListComponent, PerfisFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    PoModule,
    PoTemplatesModule,
    RouterModule.forChild(routes),
  ],
})
export class PortalPerfisModule {}

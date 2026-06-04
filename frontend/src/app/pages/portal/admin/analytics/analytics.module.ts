import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PoModule } from '@po-ui/ng-components';
import { PortalAnalyticsComponent } from './analytics.component';

@NgModule({
  declarations: [PortalAnalyticsComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    PoModule,
    RouterModule.forChild([{ path: '', component: PortalAnalyticsComponent }]),
  ],
})
export class PortalAnalyticsModule {}

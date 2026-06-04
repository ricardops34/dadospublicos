import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { DocsComponent } from './docs.component';
import { LandingModule } from '../landing/landing.module';

@NgModule({
  declarations: [DocsComponent],
  imports: [CommonModule, RouterModule, PoModule, LandingModule],
})
export class DocsModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LegalComponent } from './legal.component';
import { LandingModule } from '../landing/landing.module';

@NgModule({
  declarations: [LegalComponent],
  imports: [CommonModule, RouterModule, LandingModule],
})
export class LegalModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { LandingComponent } from './landing.component';
import { HeroComponent } from './sections/hero/hero.component';
import { PlanosComponent } from './sections/planos/planos.component';
import { ExemplosComponent } from './sections/exemplos/exemplos.component';
import { ComoFuncionaComponent } from './sections/como-funciona/como-funciona.component';
import { FooterComponent } from './sections/footer/footer.component';
import { NavbarComponent } from './sections/navbar/navbar.component';

const routes: Routes = [{ path: '', component: LandingComponent }];

@NgModule({
  declarations: [
    LandingComponent,
    HeroComponent,
    PlanosComponent,
    ExemplosComponent,
    ComoFuncionaComponent,
    FooterComponent,
    NavbarComponent,
  ],
  imports: [CommonModule, PoModule, RouterModule.forChild(routes)],
  exports: [FooterComponent, NavbarComponent],
})
export class LandingModule {}

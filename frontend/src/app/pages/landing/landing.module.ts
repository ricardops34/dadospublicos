import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { LandingComponent } from './landing.component';
import { HeroComponent } from './sections/hero/hero.component';
import { PlanosComponent } from './sections/planos/planos.component';
import { ExemplosComponent } from './sections/exemplos/exemplos.component';
import { ComoFuncionaComponent } from './sections/como-funciona/como-funciona.component';
import { FooterComponent } from './sections/footer/footer.component';
import { NavbarComponent } from './sections/navbar/navbar.component';
import { CookieBannerComponent } from '../../shared/cookie-banner/cookie-banner.component';
import { WhatsappButtonModule } from '../../shared/whatsapp-button/whatsapp-button.module';

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
    CookieBannerComponent,
  ],
  imports: [CommonModule, FormsModule, PoModule, RouterModule.forChild(routes), WhatsappButtonModule],
  exports: [FooterComponent, NavbarComponent],
})
export class LandingModule {}

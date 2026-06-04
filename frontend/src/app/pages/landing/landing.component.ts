import { Component, OnInit } from '@angular/core';
import { LpAnalyticsService } from '../../services/lp-analytics.service';

@Component({
  selector: 'app-landing',
  standalone: false,
  template: `
    <app-navbar></app-navbar>
    <main class="landing-main">
      <app-hero></app-hero>
      <app-como-funciona></app-como-funciona>
      <app-planos></app-planos>
      <app-exemplos></app-exemplos>
    </main>
    <app-footer></app-footer>

    <app-cookie-banner
      (onAceitar)="analytics.cookiesAceitos()"
      (onRecusar)="analytics.cookiesRecusados()">
    </app-cookie-banner>

    <app-whatsapp-button></app-whatsapp-button>
  `,
  styles: [`.landing-main { padding-top: 64px; }`],
})
export class LandingComponent implements OnInit {
  constructor(public analytics: LpAnalyticsService) {}

  ngOnInit() {
    this.analytics.init();
  }
}

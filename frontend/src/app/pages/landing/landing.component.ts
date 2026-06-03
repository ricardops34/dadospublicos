import { Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  standalone: false,
  template: `
    <app-navbar></app-navbar>
    <main>
      <app-hero></app-hero>
      <app-como-funciona></app-como-funciona>
      <app-planos></app-planos>
      <app-exemplos></app-exemplos>
    </main>
    <app-footer></app-footer>
  `,
})
export class LandingComponent {}

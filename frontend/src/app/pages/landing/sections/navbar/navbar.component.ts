import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  menuAberto = false;
  docsUrl = '/docs';
  private readonly navbarOffset = 76;
  private readonly maxScrollTentativas = 20;

  constructor(private router: Router) {}

  irParaAncora(ancora: string) {
    const naLanding = this.router.url === '/' || this.router.url.startsWith('/#');

    if (naLanding) {
      this.rolarParaElemento(ancora);
      return;
    }

    this.router.navigateByUrl('/').then(() => this.rolarParaElemento(ancora));
  }

  private rolarParaElemento(ancora: string, tentativa = 0) {
    const elemento = document.getElementById(ancora);

    if (!elemento) {
      if (tentativa < this.maxScrollTentativas) {
        window.setTimeout(() => this.rolarParaElemento(ancora, tentativa + 1), 100);
      }
      return;
    }

    const topo = elemento.getBoundingClientRect().top + window.scrollY - this.navbarOffset;
    window.scrollTo({ top: Math.max(topo, 0), behavior: 'smooth' });
  }
}

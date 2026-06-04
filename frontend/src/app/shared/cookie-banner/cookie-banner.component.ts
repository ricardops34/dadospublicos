import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type CookiePrefs = {
  necessario: true;
  analise: boolean;
  marketing: boolean;
  funcional: boolean;
};

@Component({
  selector: 'app-cookie-banner',
  standalone: false,
  templateUrl: './cookie-banner.component.html',
  styleUrl: './cookie-banner.component.scss',
})
export class CookieBannerComponent implements OnInit {
  private readonly storageKey = 'bjsoft_cookie_preferences';
  visivel = false;
  personalizando = false;
  preferencias: CookiePrefs = {
    necessario: true,
    analise: false,
    marketing: false,
    funcional: false,
  };

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const salvo = localStorage.getItem(this.storageKey);
    this.visivel = !salvo;

    if (salvo) {
      try {
        this.preferencias = { ...this.preferencias, ...JSON.parse(salvo) };
      } catch {
        this.visivel = true;
      }
    }
  }

  aceitarTudo() {
    this.preferencias = {
      necessario: true,
      analise: true,
      marketing: true,
      funcional: true,
    };
    this.salvar();
  }

  rejeitarOpcionais() {
    this.preferencias = {
      necessario: true,
      analise: false,
      marketing: false,
      funcional: false,
    };
    this.salvar();
  }

  abrirPersonalizacao() {
    this.personalizando = true;
  }

  fechar() {
    this.rejeitarOpcionais();
  }

  voltar() {
    this.personalizando = false;
  }

  salvar() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.setItem(this.storageKey, JSON.stringify(this.preferencias));
    this.visivel = false;
    this.personalizando = false;
  }
}

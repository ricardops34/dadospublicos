import { Injectable } from '@angular/core';

type Tema = 'claro' | 'escuro';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly KEY = 'rfb_tema';

  get tema(): Tema {
    return (localStorage.getItem(this.KEY) as Tema) ?? 'claro';
  }

  get isEscuro(): boolean {
    return this.tema === 'escuro';
  }

  alternar() {
    this.aplicar(this.isEscuro ? 'claro' : 'escuro');
  }

  inicializar() {
    const salvo = localStorage.getItem(this.KEY) as Tema | null;
    const prefereSistema: Tema = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro';
    this.aplicar(salvo ?? prefereSistema);
  }

  private aplicar(tema: Tema) {
    localStorage.setItem(this.KEY, tema);
    document.documentElement.setAttribute('data-theme', tema);
  }
}

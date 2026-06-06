import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LpAnalyticsService } from '../../../../services/lp-analytics.service';

@Component({
  selector: 'app-hero',
  standalone: false,
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  cnpjExemplo = '27865757000102';
  docsUrl = '/docs';
  respostaExemplo = JSON.stringify(
    {
      cnpj_raiz: '27865757',
      razao_social: 'GLOBO COMUNICACAO E PARTICIPACOES S/A',
      situacao_cadastral: 'Ativa',
      uf: 'RJ',
      cnae: { id: '6010100', descricao: 'Atividades de radio' },
      simples: 'Nao',
    },
    null,
    2,
  );

  constructor(
    private router: Router,
    private analytics: LpAnalyticsService,
  ) {}

  irParaCadastro() {
    this.analytics.registrarClique('hero', 'cadastro');
    this.router.navigateByUrl('/cliente/cadastro');
  }

  registrarCliqueDocumentacao() {
    this.analytics.registrarClique('hero', 'documentacao');
  }
}

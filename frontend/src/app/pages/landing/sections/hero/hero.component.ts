import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: false,
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  constructor(private router: Router) {}

  irParaCadastro() { this.router.navigateByUrl('/cliente/cadastro'); }
  cnpjExemplo = '27865757000102';
  docsUrl = '/docs';
  respostaExemplo = JSON.stringify(
    {
      cnpj_raiz: '27865757',
      razao_social: 'GLOBO COMUNICACAO E PARTICIPACOES S/A',
      situacao_cadastral: 'Ativa',
      uf: 'RJ',
      cnae: { id: '6010100', descricao: 'Atividades de rádio' },
      simples: 'Não',
    },
    null,
    2,
  );
}

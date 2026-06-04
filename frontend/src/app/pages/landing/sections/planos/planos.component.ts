import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';

type CicloCobranca = 'mensal' | 'semestral' | 'anual';

@Component({
  selector: 'app-planos',
  standalone: false,
  templateUrl: './planos.component.html',
  styleUrl: './planos.component.scss',
})
export class PlanosComponent implements OnInit {
  planos: any[] = [];
  cicloSelecionado: CicloCobranca = 'mensal';
  planosFallback = [
    {
      nome: 'Básico',
      slug: 'basico',
      descricao: 'Entrada para integrações de menor volume.',
      precoMensal: 99,
      precoSemestral: 534.6,
      precoAnual: 1009.8,
      destaque: false,
      seloDestaque: null,
      recursos: [
        { descricaoExibicao: '160.000 requisições/mês' },
        { descricaoExibicao: 'Consulta por CNPJ' },
        { descricaoExibicao: 'Inscrição Estadual' },
        { descricaoExibicao: 'Inscrição Suframa' },
      ],
    },
    {
      nome: 'Intermediário',
      slug: 'intermediario',
      descricao: 'Mais volume com cobertura ampliada para dados cadastrais.',
      precoMensal: 199,
      precoSemestral: 1074.6,
      precoAnual: 2029.8,
      destaque: false,
      seloDestaque: null,
      recursos: [
        { descricaoExibicao: '300.000 requisições/mês' },
        { descricaoExibicao: 'Consulta por CNPJ' },
        { descricaoExibicao: 'Inscrições estaduais' },
        { descricaoExibicao: 'Inscrições Suframa' },
        { descricaoExibicao: 'Validação Suframa' },
      ],
    },
    {
      nome: 'Avançado',
      slug: 'avancado',
      descricao: 'Plano de maior giro com destaque comercial na landing.',
      precoMensal: 299,
      precoSemestral: 1614.6,
      precoAnual: 3049.8,
      destaque: true,
      seloDestaque: 'Mais popular',
      recursos: [
        { descricaoExibicao: '600.000 requisições/mês' },
        { descricaoExibicao: 'Consulta por CNPJ' },
        { descricaoExibicao: 'Inscrições estaduais' },
        { descricaoExibicao: 'Inscrições Suframa' },
        { descricaoExibicao: 'Validação Suframa' },
      ],
    },
    {
      nome: 'Premium',
      slug: 'premium',
      descricao: 'Maior volume e filtros avançados de prospecção.',
      precoMensal: 499,
      precoSemestral: 2694.6,
      precoAnual: 5089.8,
      destaque: false,
      seloDestaque: null,
      recursos: [
        { descricaoExibicao: '1.000.000 requisições/mês' },
        { descricaoExibicao: 'Consulta por CNPJ' },
        { descricaoExibicao: 'Inscrições estaduais' },
        { descricaoExibicao: 'Inscrições Suframa' },
        { descricaoExibicao: 'Validação Suframa' },
        { descricaoExibicao: 'Filtros de pesquisa' },
      ],
    },
  ];
  ciclos: Array<{ id: CicloCobranca; label: string; icone: string }> = [
    { id: 'mensal',    label: 'Mensalmente',    icone: 'an an-calendar' },
    { id: 'semestral', label: 'A cada 6 meses', icone: 'an an-calendar-check' },
    { id: 'anual',     label: 'Anualmente',     icone: 'an an-crown' },
  ];

  constructor(private http: HttpClient, private router: Router) {}

  irParaCadastro() { this.router.navigateByUrl('/cliente/cadastro'); }

  ngOnInit() {
    this.planos = this.planosFallback;

    this.http.get<any[]>(`${environment.apiUrl}/planos`).subscribe({
      next: (data) => (this.planos = data?.length ? data : this.planosFallback),
      error: () => (this.planos = this.planosFallback),
    });
  }

  selecionarCiclo(ciclo: CicloCobranca) {
    this.cicloSelecionado = ciclo;
  }

  precoDoPlano(plano: any): number {
    if (this.cicloSelecionado === 'semestral') return Number(plano.precoSemestral ?? plano.precoMensal ?? 0);
    if (this.cicloSelecionado === 'anual') return Number(plano.precoAnual ?? plano.precoMensal ?? 0);
    return Number(plano.precoMensal ?? 0);
  }

  periodoDoPlano(): string {
    if (this.cicloSelecionado === 'semestral') return '/6 meses';
    if (this.cicloSelecionado === 'anual') return '/ano';
    return '/mês';
  }

  rotuloCobranca(plano: any): string {
    const preco = this.precoDoPlano(plano);

    if (this.cicloSelecionado === 'semestral') {
      return `Cobrança única de ${this.formatarPreco(preco)} a cada 6 meses`;
    }

    if (this.cicloSelecionado === 'anual') {
      return `Cobrança única de ${this.formatarPreco(preco)} por ano`;
    }

    return 'Cobrança mensal recorrente';
  }

  formatarPreco(valor: number): string {
    return `R$ ${valor.toLocaleString('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  }
}

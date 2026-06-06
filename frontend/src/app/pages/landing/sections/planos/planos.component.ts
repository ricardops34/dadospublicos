import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { LpAnalyticsService } from '../../../../services/lp-analytics.service';

type CicloCobranca = 'mensal' | 'semestral' | 'anual';

@Component({
  selector: 'app-planos',
  standalone: false,
  templateUrl: './planos.component.html',
  styleUrl: './planos.component.scss',
})
export class PlanosComponent implements OnInit {
  planos: any[] = [];
  carregando = false;
  erroCarregamento = false;
  cicloSelecionado: CicloCobranca = 'mensal';

  ciclos: Array<{ id: CicloCobranca; label: string; icone: string }> = [
    { id: 'mensal', label: 'Mensalmente', icone: 'an an-calendar' },
    { id: 'semestral', label: 'A cada 6 meses', icone: 'an an-calendar-check' },
    { id: 'anual', label: 'Anualmente', icone: 'an an-crown' },
  ];

  constructor(
    private http: HttpClient,
    private router: Router,
    private analytics: LpAnalyticsService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.carregarPlanos();
  }

  irParaCadastro(plano?: any) {
    this.analytics.registrarClique('planos', plano?.slug ?? 'cadastro');
    this.router.navigateByUrl('/cliente/cadastro');
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
    return '/mes';
  }

  rotuloCobranca(plano: any): string {
    const preco = this.precoDoPlano(plano);

    if (this.cicloSelecionado === 'semestral') {
      return `Cobranca unica de ${this.formatarPreco(preco)} a cada 6 meses`;
    }

    if (this.cicloSelecionado === 'anual') {
      return `Cobranca unica de ${this.formatarPreco(preco)} por ano`;
    }

    return 'Cobranca mensal recorrente';
  }

  formatarPreco(valor: number): string {
    return `R$ ${valor.toLocaleString('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  }

  private carregarPlanos() {
    this.carregando = true;
    this.erroCarregamento = false;

    this.http.get<any[]>(`${environment.apiUrl}/planos`).subscribe({
      next: (data) => {
        this.planos = Array.isArray(data) ? data.filter((plano) => plano.exibirNaLp !== false) : [];
        this.erroCarregamento = this.planos.length === 0;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.planos = [];
        this.erroCarregamento = true;
        this.carregando = false;
        this.cdr.detectChanges();
      },
    });
  }
}

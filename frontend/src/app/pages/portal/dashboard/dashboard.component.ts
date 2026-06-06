import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PoChartSerie, PoChartType } from '@po-ui/ng-components';
import { AuthService } from '../../../services/auth.service';
import { ClientePortalService } from '../cliente/cliente.service';

@Component({
  selector: 'app-portal-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  nome = '';
  isAdmin = false;
  carregando = true;

  // Cliente
  assinatura: any = null;
  consumoAtual: any = null;
  ultimasFaturas: any[] = [];
  tokenMascarado = '';

  readonly chartTypeBar = PoChartType.Bar;
  chartConsumo: PoChartSerie[] = [];
  chartCategories: string[] = [];

  constructor(private auth: AuthService, private clienteSvc: ClientePortalService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.nome = this.auth.getNome();
    this.isAdmin = this.auth.isAdmin();

    if (this.isAdmin) { this.carregando = false; this.cdr.detectChanges(); return; }

    forkJoin({
      perfil:    this.clienteSvc.meuPerfil().pipe(catchError(() => of(null))),
      assinatura: this.clienteSvc.minhaAssinatura().pipe(catchError(() => of(null))),
      consumo:   this.clienteSvc.meuConsumo().pipe(catchError(() => of([]))),
      faturas:   this.clienteSvc.minhasFaturas().pipe(catchError(() => of([]))),
    }).subscribe(({ perfil, assinatura, consumo, faturas }) => {
      this.assinatura = assinatura;

      // Token mascarado
      const tokenStr = perfil?.assinaturas?.find((a: any) => a.status === 'ativa')?.token?.token;
      if (tokenStr) this.tokenMascarado = tokenStr.substring(0, 8) + '••••••••' + tokenStr.slice(-4);

      // Consumo atual + gráfico (últimos 6 meses)
      const now = new Date();
      this.consumoAtual = (consumo as any[]).find(
        (r: any) => r.mes === now.getMonth() + 1 && r.ano === now.getFullYear(),
      );
      const ultimos6 = [...(consumo as any[])].slice(-6);
      this.chartCategories = ultimos6.map((r: any) => `${String(r.mes).padStart(2,'0')}/${r.ano}`);
      this.chartConsumo = [{ label: 'Requisições', data: ultimos6.map((r: any) => r.quantidade) }];

      // Últimas 3 faturas
      this.ultimasFaturas = (faturas as any[]).slice(0, 3).map((f: any) => ({
        ...f,
        plano: f.assinatura?.plano?.nome ?? '—',
        competencia: `${String(f.mes).padStart(2,'0')}/${f.ano}`,
      }));

      this.carregando = false;
      this.cdr.detectChanges();
    });
  }

  get percentualUso(): number {
    if (!this.consumoAtual || !this.assinatura?.limite_mensal) return 0;
    return Math.min(100, Math.round((this.consumoAtual.quantidade / this.assinatura.limite_mensal) * 100));
  }

  get corProgresso(): string {
    if (this.percentualUso >= 90) return 'color-05';
    if (this.percentualUso >= 70) return 'color-07';
    return 'color-10';
  }
}

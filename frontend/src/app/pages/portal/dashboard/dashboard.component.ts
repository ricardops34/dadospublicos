import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PoChartSerie, PoChartType, PoUserGuidePosition, PoUserGuideService } from '@po-ui/ng-components';
import { AuthService } from '../../../services/auth.service';
import { UsuarioPortalService } from '../cliente/usuario.service';

const TOUR_KEY = 'dashboard_tour_visto';

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

  constructor(
    private auth: AuthService,
    private clienteSvc: UsuarioPortalService,
    private cdr: ChangeDetectorRef,
    private userGuide: PoUserGuideService,
  ) {}

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

      if (!localStorage.getItem(TOUR_KEY)) {
        setTimeout(() => this.iniciarTour(), 400);
      }
    });
  }

  private iniciarTour() {
    this.userGuide
      .setSteps([
        {
          title: 'Bem-vindo ao seu painel!',
          content: 'Este é o seu dashboard. Aqui você acompanha tudo sobre sua conta em um só lugar.',
        },
        {
          element: '#dash-card-plano',
          title: 'Seu plano ativo',
          content: 'Veja qual plano está ativo e acesse os detalhes para fazer upgrade ou cancelar.',
          position: PoUserGuidePosition.Bottom,
        },
        {
          element: '#dash-card-consumo',
          title: 'Requisições do mês',
          content: 'Acompanhe quantas consultas à API você já realizou neste mês e qual é o seu limite.',
          position: PoUserGuidePosition.Bottom,
        },
        {
          element: '#dash-card-token',
          title: 'Token de API',
          content: 'Este é o seu token de acesso. Use-o nas chamadas à API. Clique em "Gerenciar" para visualizar o token completo ou regenerá-lo.',
          position: PoUserGuidePosition.Bottom,
        },
        {
          element: '#dash-grafico',
          title: 'Histórico de consumo',
          content: 'O gráfico mostra a evolução das suas requisições nos últimos 6 meses.',
          position: PoUserGuidePosition.Top,
        },
        {
          element: '#dash-faturas',
          title: 'Suas faturas',
          content: 'As últimas faturas geradas aparecem aqui. Clique em "Ver todas" para o histórico completo.',
          position: PoUserGuidePosition.Top,
          doneLabel: 'Entendido!',
        },
      ])
      .setOptions({
        showProgress: true,
        allowClose: true,
        progressTemplate: 'Passo {current} de {total}',
        literals: { next: 'Próximo', previous: 'Anterior', done: 'Entendido!', close: 'Fechar' },
      })
      .start()
      .then(() => {
        this.userGuide.tourEnd$.subscribe(() => {
          localStorage.setItem(TOUR_KEY, '1');
        });
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

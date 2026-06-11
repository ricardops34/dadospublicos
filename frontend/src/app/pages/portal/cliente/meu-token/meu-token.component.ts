import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PoUserGuidePosition, PoUserGuideService } from '@po-ui/ng-components';
import { NotifService } from '../../../../services/notif.service';
import { UsuarioPortalService } from '../usuario.service';
import { environment } from '../../../../../environments/environment';

const TOUR_KEY = 'meu_token_tour_visto';

@Component({
  selector: 'app-meu-token',
  standalone: false,
  templateUrl: './meu-token.component.html',
  styleUrls: ['./meu-token.component.scss'],
})
export class MeuTokenComponent implements OnInit {
  perfil: any = null;
  assinatura: any = null;
  carregando = true;
  tokenVisivel = false;
  regerando = false;
  novoToken: string | null = null;

  testeCnpj = '';
  testeCarregando = false;
  testeResultado: any = null;
  testeErro = '';

  constructor(
    private svc: UsuarioPortalService,
    private notif: NotifService,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private userGuide: PoUserGuideService,
  ) {}

  ngOnInit() {
    this.svc.meuPerfil().subscribe({
      next: (p) => {
        this.perfil = p;
        this.carregando = false;
        this.cdr.detectChanges();
        if (!localStorage.getItem(TOUR_KEY) && this.tokenAtivo) {
          setTimeout(() => this.iniciarTour(), 400);
        }
      },
      error: () => { this.carregando = false; this.cdr.detectChanges(); },
    });
    this.svc.minhaAssinatura().subscribe({
      next: (a) => { this.assinatura = a; },
      error: () => {},
    });
  }

  get tokenAtivo(): string | null {
    const assinaturaAtiva = this.perfil?.assinaturas?.find((a: any) => a.status === 'ativa');
    return assinaturaAtiva?.token?.token ?? null;
  }

  get tokenExibido(): string {
    const t = this.novoToken ?? this.tokenAtivo;
    if (!t) return '';
    if (this.tokenVisivel) return t;
    return t.substring(0, 8) + '••••••••••••••••••••••••••••••••••••••••••••••••' + t.slice(-4);
  }

  toggleVisivel() { this.tokenVisivel = !this.tokenVisivel; }

  copiar() {
    const t = this.novoToken ?? this.tokenAtivo;
    if (!t) return;
    navigator.clipboard.writeText(t).then(() => {
      this.notif.success('Token copiado para a área de transferência.');
    });
  }

  get testeCnpjNumeros(): string {
    return this.testeCnpj.replace(/\D/g, '');
  }

  testarApi() {
    const cnpj = this.testeCnpjNumeros;
    const token = this.novoToken ?? this.tokenAtivo;
    if (!token) return;

    this.testeCarregando = true;
    this.testeResultado = null;
    this.testeErro = '';

    const headers = new HttpHeaders({ 'x_api_token': token });
    this.http.get(`${environment.apiUrl}/cnpj/${cnpj}`, { headers }).subscribe({
      next: (res) => {
        this.testeResultado = res;
        this.testeCarregando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.testeErro = err?.error?.message ?? `Erro ${err.status}: ${err.statusText}`;
        this.testeCarregando = false;
        this.cdr.detectChanges();
      },
    });
  }

  copiarResultado() {
    if (!this.testeResultado) return;
    navigator.clipboard.writeText(JSON.stringify(this.testeResultado, null, 2)).then(() => {
      this.notif.success('JSON copiado para a área de transferência.');
    });
  }

  private iniciarTour() {
    this.userGuide
      .setSteps([
        {
          element: '#token-box',
          title: 'Seu token de API',
          content: 'Este é o seu token de acesso. Ele identifica sua conta em todas as chamadas à API. Mantenha-o em segredo.',
          position: PoUserGuidePosition.Bottom,
          showButtons: ['next', 'close'],
        },
        {
          element: '#token-box',
          title: 'Mostrar e copiar',
          content: 'Use os botões <strong>olho</strong> para revelar o token e <strong>copiar</strong> para enviá-lo para a área de transferência.',
          position: PoUserGuidePosition.Bottom,
        },
        {
          element: '#token-info',
          title: 'Limites do seu plano',
          content: 'Aqui você confere o <strong>rate limit</strong> (requisições por minuto) e o <strong>limite mensal</strong> do seu plano atual.',
          position: PoUserGuidePosition.Top,
        },
        {
          element: '#token-uso',
          title: 'Como usar o token',
          content: 'Você pode enviar o token via <strong>header HTTP</strong> (<code>x_api_token</code>) ou como <strong>query string</strong> (<code>?token=...</code>). Acesse a documentação completa pelo botão abaixo.',
          position: PoUserGuidePosition.Top,
        },
        {
          element: '#token-teste',
          title: 'Teste sua integração',
          content: 'Informe um CNPJ e clique em <strong>Consultar</strong> para fazer uma chamada real à API com seu token agora mesmo.',
          position: PoUserGuidePosition.Top,
        },
        {
          element: '#token-regenerar',
          title: 'Regenerar token',
          content: '<strong>Atenção:</strong> ao regenerar, o token anterior é invalidado imediatamente. Atualize todas as integrações que o utilizam antes de regenerar.',
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

  regerarToken() {
    this.regerando = true;
    this.svc.regerarToken().subscribe({
      next: (res) => {
        this.novoToken = res.token_api;
        this.tokenVisivel = true;
        this.regerando = false;
        this.notif.warning('Novo token gerado. O token anterior foi invalidado. Copie e guarde em local seguro.');
      },
      error: () => {
        this.notif.error('Erro ao regenerar token.');
        this.regerando = false;
      },
    });
  }
}

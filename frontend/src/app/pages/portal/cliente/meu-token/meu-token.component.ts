import { Component, OnInit } from '@angular/core';
import { PoNotificationService } from '@po-ui/ng-components';
import { ClientePortalService } from '../cliente.service';

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

  constructor(private svc: ClientePortalService, private notif: PoNotificationService) {}

  ngOnInit() {
    this.svc.meuPerfil().subscribe({
      next: (p) => {
        this.perfil = p;
        this.carregando = false;
      },
      error: () => { this.carregando = false; },
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

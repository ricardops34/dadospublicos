import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PoHeaderActionTool, PoHeaderBrand, PoHeaderUser, PoMenuItem } from '@po-ui/ng-components';
import { AuthService } from '../../services/auth.service';
import { UsuarioPortalService } from './cliente/usuario.service';
import { Notificacao, NotificacoesService } from '../../services/notificacoes.service';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-portal-shell',
  standalone: false,
  templateUrl: './portal-shell.component.html',
})
export class PortalShellComponent implements OnInit {
  @ViewChild('notifPopover', { static: true }) notifPopoverRef!: TemplateRef<any>;

  menuItems: PoMenuItem[] = [];
  notificacoes: Notificacao[] = [];
  carregandoNotif = false;

  headerBrand: PoHeaderBrand = {
    title: 'BuscaDados',
    logo: 'logo_bj.png',
  };

  /** Avatar exibido enquanto o usuário não escolheu um próprio */
  private readonly AVATAR_PADRAO = 'avatar/avatar_01.png';

  headerUser: PoHeaderUser = {
    avatar: 'avatar/avatar_01.png',
    customerBrand: 'logo_bj.png',
    items: [
      {
        label: 'Minha Conta',
        action: () => this.router.navigate(['/portal/minha-conta']),
      },
      {
        label: 'Trocar Senha',
        action: () => this.router.navigate(['/portal/minha-conta'], { queryParams: { acao: 'trocar-senha' } }),
      },
      {
        label: 'Sair',
        action: () => this.sair(),
      },
    ],
  };

  headerActionsTools: PoHeaderActionTool[] = [];

  // Fallback para onboarding enquanto o menu dinâmico não carrega
  private readonly MENUS_CLIENTE_ONBOARDING_FALLBACK: PoMenuItem[] = [
    { label: 'Primeiro acesso', shortLabel: 'Onboarding', icon: 'an an-user-circle', link: '/portal/primeiro-acesso' },
    { label: 'Minha Conta', shortLabel: 'Conta', icon: 'an an-shield-warning', link: '/portal/minha-conta' },
    { label: 'Sair', shortLabel: 'Sair', icon: 'an an-sign-out', action: () => this.sair(), type: 'danger' },
  ];

  constructor(
    private auth: AuthService,
    private router: Router,
    private clienteService: UsuarioPortalService,
    private notifSvc: NotificacoesService,
    private menuService: MenuService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    const perfil = this.auth.getPerfil();
    const role = perfil === 'admin' ? 'Administrador' : 'Cliente';
    const nome = this.auth.getNome();
    this.headerUser.customerBrand = nome ? `${nome} · ${role}` : role;

    this.configurarNotificacoes();
    this.configurarAvatar();

    if (perfil === 'admin') {
      this.headerActionsTools = [
        { icon: 'an an-gear', tooltip: 'Configuração de E-mail', action: () => this.router.navigate(['/portal/config-email']) },
      ];
      // Para cliente o perfil é carregado no fluxo de menu; para admin busca aqui o avatar salvo
      this.clienteService.meuPerfil().subscribe({ error: () => { } });
      this.carregarMenuDinamico();
      return;
    }

    if (perfil === 'cliente') {
      // Exibe onboarding enquanto carrega
      this.menuItems = this.MENUS_CLIENTE_ONBOARDING_FALLBACK;

      this.clienteService.meuPerfil().subscribe({
        next: (perfilCliente) => {
          if (this.clienteService.temOnboardingPendente(perfilCliente)) {
            this.menuService.getMenu().subscribe({
              next: (items) => {
                this.menuItems = this.processarMenuDinamico(items);
                this.cdr.detectChanges();
              },
              error: () => {
                this.menuItems = this.MENUS_CLIENTE_ONBOARDING_FALLBACK;
                this.cdr.detectChanges();
              },
            });
            return;
          }

          // Cliente normal — carrega menu do banco
          this.carregarMenuDinamico();
        },
        error: () => {
          this.menuItems = this.MENUS_CLIENTE_ONBOARDING_FALLBACK;
          this.cdr.detectChanges();
        },
      });
    }
  }

  /**
   * Mantém o avatar do header sincronizado com o perfil do usuário —
   * inclusive quando ele troca o avatar na tela Minha Conta.
   */
  private configurarAvatar() {
    this.clienteService.avatar$.subscribe((avatar) => {
      this.headerUser = {
        ...this.headerUser,
        avatar: avatar ? `avatar/${avatar}` : this.AVATAR_PADRAO,
      };
      this.cdr.detectChanges();
    });
  }

  private carregarMenuDinamico() {
    this.menuService.getMenu().subscribe({
      next: (items) => {
        this.menuItems = this.processarMenuDinamico(items);
        this.cdr.detectChanges();
      },
      error: () => { },
    });
  }

  /**
   * Percorre a lista retornada pela API e substitui a sentinela '__sair__'
   * pela action real de logout (não pode ser serializada em JSON).
   */
  private processarMenuDinamico(items: any[]): PoMenuItem[] {
    return items.map((item) => {
      if (item.action === '__sair__') {
        const { action, link, ...rest } = item;
        return { ...rest, action: () => this.sair() } as PoMenuItem;
      }
      if (item.subItems && Array.isArray(item.subItems)) {
        return { ...item, subItems: this.processarMenuDinamico(item.subItems) } as PoMenuItem;
      }
      return item as PoMenuItem;
    });
  }

  private configurarNotificacoes() {
    this.notifSvc.carregarContagem();
    this.notifSvc.listar().subscribe({
      next: (lista) => { this.notificacoes = lista; this.cdr.detectChanges(); },
      error: () => { },
    });
    this.notifSvc.naoLidas.subscribe((total) => {
      this.atualizarBadgeNotif(total);
      this.cdr.detectChanges();
    });
  }

  private atualizarBadgeNotif(total: number) {
    const notifTool: PoHeaderActionTool = {
      icon: 'an an-bell',
      tooltip: 'Notificações',
      badge: total > 0 ? total : undefined,
      action: () => this.abrirNotificacoes(),
      popover: {
        content: this.notifPopoverRef,
        width: 380,
      },
    };

    const perfil = this.auth.getPerfil();
    if (perfil === 'admin') {
      this.headerActionsTools = [
        { icon: 'an an-gear', tooltip: 'Configuração de E-mail', action: () => this.router.navigate(['/portal/config-email']) },
        notifTool,
      ];
    } else {
      this.headerActionsTools = [notifTool];
    }
  }

  abrirNotificacoes() {
    this.carregandoNotif = true;
    this.notifSvc.listar().subscribe({
      next: (lista) => {
        this.notificacoes = lista;
        this.carregandoNotif = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.carregandoNotif = false;
        this.cdr.detectChanges();
      },
    });
  }

  marcarNotificacoesLidas() {
    this.notifSvc.marcarTodasLidas().subscribe({
      next: () => {
        this.notificacoes = this.notificacoes.map((n) => ({ ...n, lida: true }));
      },
    });
  }

  notifIcone(tipo: string): string {
    const map: Record<string, string> = {
      sistema: 'an an-info',
      financeiro: 'an an-currency-dollar',
      conta: 'an an-user-circle',
      consumo: 'an an-chart-bar',
    };
    return map[tipo] ?? 'an an-bell';
  }

  sair() {
    this.clienteService.invalidarPerfilCache();
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}

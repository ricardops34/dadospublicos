import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PoHeaderActionTool, PoHeaderBrand, PoHeaderUser, PoMenuItem } from '@po-ui/ng-components';
import { AuthService } from '../../services/auth.service';
import { ClientePortalService } from './cliente/cliente.service';
import { Notificacao, NotificacoesService } from '../../services/notificacoes.service';

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

  headerUser: PoHeaderUser = {
    avatar: '',
    customerBrand: '',
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

  private readonly MENUS_ADMIN: PoMenuItem[] = [
    {
      label: 'Dashboards',
      shortLabel: 'Dashboard',
      icon: 'an an-gauge',
      subItems: [
        { label: 'Visão Geral', shortLabel: 'Visão', link: '/portal/dashboard' },
        { label: 'Analytics LP', shortLabel: 'Analytics', link: '/portal/analytics' },
      ],
    },
    { label: 'Painel 360', shortLabel: '360', icon: 'an an-map-trifold', link: '/portal/painel-360-admin' },
    {
      label: 'Comercial',
      shortLabel: 'Comercial',
      icon: 'an an-handshake',
      subItems: [
        { label: 'Clientes', shortLabel: 'Clientes', link: '/portal/clientes' },
        { label: 'Planos', shortLabel: 'Planos', link: '/portal/planos' },
        { label: 'Recursos', shortLabel: 'Recursos', link: '/portal/recursos' },
        { label: 'Recurso × Planos', shortLabel: 'Rec×Plan', link: '/portal/recurso-planos' },
      ],
    },
    {
      label: 'Financeiro',
      shortLabel: 'Financeiro',
      icon: 'an an-currency-dollar',
      subItems: [
        { label: 'Assinaturas', shortLabel: 'Assinat.', link: '/portal/assinaturas' },
        { label: 'Faturas', shortLabel: 'Faturas', link: '/portal/faturas' },
        { label: 'Consumo', shortLabel: 'Consumo', link: '/portal/consumo-admin' },
      ],
    },
    {
      label: 'Configurações',
      shortLabel: 'Config',
      icon: 'an an-gear',
      subItems: [
        { label: 'Parâmetros', shortLabel: 'Params', link: '/portal/parametros' },
        { label: 'Config. E-mail', shortLabel: 'E-mail', link: '/portal/config-email' },
        { label: 'ETL / Sistema', shortLabel: 'ETL', link: '/portal/etl' },
      ],
    },
    {
      label: 'Minha Conta',
      shortLabel: 'Minha Cta',
      icon: 'an an-user-circle',
      subItems: [
        { label: 'Dados pessoais', shortLabel: 'Dados', link: '/portal/minha-conta' },
        { label: 'Meu Plano', shortLabel: 'Plano', link: '/portal/meu-plano' },
        { label: 'Meu Token API', shortLabel: 'Token', link: '/portal/meu-token' },
        { label: 'Meu Consumo', shortLabel: 'Consumo', link: '/portal/consumo' },
        { label: 'Minhas Faturas', shortLabel: 'Faturas', link: '/portal/minhas-faturas' },
      ],
    },
    { label: 'Sair', shortLabel: 'Sair', icon: 'an an-sign-out', action: () => this.sair(), type: 'danger' },
  ];

  private readonly MENUS_CLIENTE_BASE: PoMenuItem[] = [
    { label: 'Início', shortLabel: 'Início', icon: 'an an-house', link: '/portal/dashboard' },
    { label: 'Minha Conta', shortLabel: 'Conta', icon: 'an an-user-circle', link: '/portal/minha-conta' },
    { label: 'Meu Plano', shortLabel: 'Plano', icon: 'an an-tag', link: '/portal/meu-plano' },
    { label: 'Meu Token API', shortLabel: 'Token', icon: 'an an-key', link: '/portal/meu-token' },
    { label: 'Consumo', shortLabel: 'Consumo', icon: 'an an-chart-bar', link: '/portal/consumo' },
    { label: 'Faturas', shortLabel: 'Faturas', icon: 'an an-receipt', link: '/portal/minhas-faturas' },
    { label: 'Sair', shortLabel: 'Sair', icon: 'an an-sign-out', action: () => this.sair(), type: 'danger' },
  ];

  private readonly MENUS_CLIENTE_ONBOARDING: PoMenuItem[] = [
    { label: 'Primeiro acesso', shortLabel: 'Onboarding', icon: 'an an-user-circle', link: '/portal/primeiro-acesso' },
    { label: 'Minha Conta', shortLabel: 'Conta', icon: 'an an-shield-warning', link: '/portal/minha-conta' },
    { label: 'Sair', shortLabel: 'Sair', icon: 'an an-sign-out', action: () => this.sair(), type: 'danger' },
  ];

  constructor(
    private auth: AuthService,
    private router: Router,
    private clienteService: ClientePortalService,
    private notifSvc: NotificacoesService,
  ) {}

  ngOnInit() {
    const perfil = this.auth.getPerfil();
    const role = perfil === 'admin' ? 'Administrador' : 'Cliente';
    const nome = this.auth.getNome();
    this.headerUser.customerBrand = nome ? `${nome} · ${role}` : role;

    this.configurarNotificacoes();

    if (perfil === 'admin') {
      this.menuItems = this.MENUS_ADMIN;
      this.headerActionsTools = [
        { icon: 'an an-gear', tooltip: 'Configuração de E-mail', action: () => this.router.navigate(['/portal/config-email']) },
      ];
      return;
    }

    if (perfil === 'cliente') {
      this.menuItems = this.MENUS_CLIENTE_ONBOARDING;
      this.clienteService.meuPerfil().subscribe({
        next: (perfilCliente) => {
          if (this.clienteService.temOnboardingPendente(perfilCliente)) {
            this.menuItems = this.MENUS_CLIENTE_ONBOARDING;
            return;
          }

          this.clienteService.minhaAssinatura().subscribe({
            next: (assinatura) => {
              this.menuItems = this.montarMenuCliente(this.clienteService.assinaturaTemPainel360(assinatura));
            },
            error: () => {
              this.menuItems = this.montarMenuCliente(false);
            },
          });
        },
        error: () => {
          this.menuItems = this.MENUS_CLIENTE_ONBOARDING;
        },
      });
    }
  }

  private configurarNotificacoes() {
    this.notifSvc.carregarContagem();
    this.notifSvc.listar().subscribe({
      next: (lista) => (this.notificacoes = lista),
      error: () => {},
    });
    this.notifSvc.naoLidas.subscribe((total) => {
      this.atualizarBadgeNotif(total);
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
      },
      error: () => {
        this.carregandoNotif = false;
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

  private montarMenuCliente(temPainel360: boolean): PoMenuItem[] {
    const menu = [...this.MENUS_CLIENTE_BASE];

    if (temPainel360) {
      menu.splice(menu.length - 1, 0, {
        label: 'Painel 360',
        shortLabel: '360',
        icon: 'an an-map-trifold',
        link: '/portal/painel-360',
      });
    }

    return menu;
  }

  sair() {
    this.clienteService.invalidarPerfilCache();
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}

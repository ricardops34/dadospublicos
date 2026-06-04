import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PoHeaderActionTool, PoHeaderBrand, PoHeaderUser, PoMenuItem } from '@po-ui/ng-components';
import { AuthService } from '../../services/auth.service';
import { ClientePortalService } from './cliente/cliente.service';

@Component({
  selector: 'app-portal-shell',
  standalone: false,
  templateUrl: './portal-shell.component.html',
})
export class PortalShellComponent implements OnInit {
  menuItems: PoMenuItem[] = [];

  headerBrand: PoHeaderBrand = {
    title: 'BuscaDados',
    logo: 'logo_bj.png',
  };

  headerUser: PoHeaderUser = {
    avatar: '',
    customerBrand: '',
    items: [
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

  constructor(
    private auth: AuthService,
    private router: Router,
    private clienteService: ClientePortalService,
  ) {}

  ngOnInit() {
    const perfil = this.auth.getPerfil();
    this.headerUser.customerBrand = perfil === 'admin' ? 'Administrador' : 'Cliente';

    if (perfil === 'admin') {
      this.menuItems = this.MENUS_ADMIN;
      this.headerActionsTools = [
        { icon: 'an an-gear', tooltip: 'Configuração de E-mail', action: () => this.router.navigate(['/portal/config-email']) },
      ];
      return;
    }

    this.menuItems = this.montarMenuCliente(false);

    if (perfil === 'cliente') {
      this.clienteService.minhaAssinatura().subscribe({
        next: (assinatura) => {
          this.menuItems = this.montarMenuCliente(this.clienteService.assinaturaTemPainel360(assinatura));
        },
        error: () => {
          this.menuItems = this.montarMenuCliente(false);
        },
      });
    }
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
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}

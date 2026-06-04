import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PoMenuItem, PoHeaderBrand, PoHeaderUser, PoHeaderActionTool } from '@po-ui/ng-components';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-portal-shell',
  standalone: false,
  templateUrl: './portal-shell.component.html',
})
export class PortalShellComponent implements OnInit {
  menuItems: PoMenuItem[] = [];

  headerBrand: PoHeaderBrand = {
    title: 'BuscaDados',
    logo: 'logo_bj.png'
  };

  headerUser: PoHeaderUser = {
    avatar: '',
    customerBrand: '',
    items: [
      {
        label: 'Sair',
        icon: 'an an-sign-out',
        action: () => this.sair(),
      }
    ]
  };

  headerActionsTools: PoHeaderActionTool[] = [];

  private readonly MENUS_ADMIN: PoMenuItem[] = [
    { label: 'Dashboard',          icon: 'an an-gauge',        link: '/portal/dashboard' },
    { label: 'Recursos',           icon: 'an an-puzzle-piece', link: '/portal/recursos' },
    { label: 'Planos',             icon: 'an an-tag',          link: '/portal/planos' },
    { label: 'Recurso × Planos',   icon: 'an an-link',         link: '/portal/recurso-planos' },
    { label: 'Clientes',           icon: 'an an-users',        link: '/portal/clientes' },
    { label: 'Assinaturas',        icon: 'an an-file-text',    link: '/portal/assinaturas' },
    { label: 'Faturas',            icon: 'an an-receipt',      link: '/portal/faturas' },
    { label: 'Consumo',            icon: 'an an-chart-bar',    link: '/portal/consumo-admin' },
    { label: 'ETL / Sistema',      icon: 'an an-gear',         link: '/portal/etl' },
    { label: 'Analytics LP',       icon: 'an an-chart-line',   link: '/portal/analytics' },
  ];

  private readonly MENUS_CLIENTE: PoMenuItem[] = [
    { label: 'Início',           icon: 'an an-house',        link: '/portal/dashboard' },
    { label: 'Minha Conta',      icon: 'an an-user-circle',  link: '/portal/minha-conta' },
    { label: 'Meu Plano',        icon: 'an an-tag',          link: '/portal/meu-plano' },
    { label: 'Meu Token API',    icon: 'an an-key',          link: '/portal/meu-token' },
    { label: 'Consumo',          icon: 'an an-chart-bar',    link: '/portal/consumo' },
    { label: 'Faturas',          icon: 'an an-receipt',      link: '/portal/minhas-faturas' },
  ];

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    const perfil = this.auth.getPerfil();
    this.menuItems = perfil === 'admin' ? this.MENUS_ADMIN : this.MENUS_CLIENTE;
    
    // Atualiza nome do usuario no avatar/profile
    this.headerUser.customerBrand = perfil === 'admin' ? 'Administrador' : 'Cliente';

    if (perfil === 'admin') {
      this.headerActionsTools = [
        { icon: 'an an-gear', action: () => console.log('Configurações') },
        { icon: 'an an-squares-four', action: () => console.log('Apps') },
        { icon: 'an an-chat-circle', action: () => console.log('Mensagens') }
      ];
    }
  }

  sair() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}

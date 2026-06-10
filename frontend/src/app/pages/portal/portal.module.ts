import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PoModule } from '@po-ui/ng-components';
import { PoTemplatesModule } from '@po-ui/ng-templates';

import { PortalShellComponent } from './portal-shell.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { adminGuard, clienteGuard } from '../../guards/auth.guard';
import { clienteOnboardingGuard } from '../../guards/cliente-onboarding.guard';
import { clienteRecursoGuard } from '../../guards/cliente-recurso.guard';

const routes: Routes = [
  {
    path: '',
    component: PortalShellComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [clienteOnboardingGuard] },

      // Área Admin (lazy)
      { path: 'recursos',        canActivate: [adminGuard], loadChildren: () => import('./admin/recursos/recursos.module').then((m) => m.PortalRecursosModule) },
      { path: 'planos',          canActivate: [adminGuard], loadChildren: () => import('./admin/planos/planos.module').then((m) => m.PortalPlanosModule) },
      { path: 'recurso-planos',  canActivate: [adminGuard], loadChildren: () => import('./admin/recurso-planos/recurso-planos.module').then((m) => m.RecursosPlanosModule) },
      { path: 'clientes',        canActivate: [adminGuard], loadChildren: () => import('./admin/clientes/clientes.module').then((m) => m.PortalClientesModule) },
      { path: 'usuarios-admin',  canActivate: [adminGuard], loadChildren: () => import('./admin/usuarios-admin/usuarios-admin.module').then((m) => m.UsuariosAdminModule) },
      { path: 'assinaturas',     canActivate: [adminGuard], loadChildren: () => import('./admin/assinaturas/assinaturas.module').then((m) => m.PortalAssinaturasModule) },
      { path: 'faturas',         canActivate: [adminGuard], loadChildren: () => import('./admin/faturas/faturas.module').then((m) => m.PortalFaturasModule) },
      { path: 'consumo-admin',   canActivate: [adminGuard], loadChildren: () => import('./admin/consumo-admin/consumo-admin.module').then((m) => m.ConsumoAdminModule) },
      { path: 'etl',             canActivate: [adminGuard], loadChildren: () => import('./admin/etl/etl.module').then((m) => m.PortalEtlModule) },
      { path: 'analytics',       canActivate: [adminGuard], loadChildren: () => import('./admin/analytics/analytics.module').then((m) => m.PortalAnalyticsModule) },
      { path: 'parametros',      canActivate: [adminGuard], loadChildren: () => import('./parametros/parametros.module').then((m) => m.ParametrosModule) },
      { path: 'config-email',    canActivate: [adminGuard], loadChildren: () => import('./admin/config-email/config-email.module').then((m) => m.ConfigEmailModule) },
      { path: 'painel-360-admin', canActivate: [adminGuard], loadChildren: () => import('./admin/painel-360-admin/painel-360-admin.module').then((m) => m.Painel360AdminModule) },
      { path: 'perfis',   canActivate: [adminGuard], loadChildren: () => import('./admin/perfis/perfis.module').then((m) => m.PortalPerfisModule) },
      { path: 'modulos',  canActivate: [adminGuard], loadChildren: () => import('./admin/modulos/modulos.module').then((m) => m.PortalModulosModule) },
      { path: 'rotinas',  canActivate: [adminGuard], loadChildren: () => import('./admin/rotinas/rotinas.module').then((m) => m.PortalRotinasModule) },

      // Área Cliente (lazy)
      {
        path: 'primeiro-acesso',
        canActivate: [clienteGuard],
        loadChildren: () => import('./cliente/primeiro-acesso/primeiro-acesso.module').then((m) => m.PrimeiroAcessoModule),
      },
      {
        path: 'minha-conta',
        canActivate: [clienteOnboardingGuard],
        loadChildren: () => import('./cliente/minha-conta/minha-conta.module').then((m) => m.MinhaContaModule),
      },
      {
        path: 'meu-plano',
        canActivate: [clienteOnboardingGuard],
        loadChildren: () => import('./cliente/meu-plano/meu-plano.module').then((m) => m.MeuPlanoModule),
      },
      {
        path: 'meu-token',
        canActivate: [clienteOnboardingGuard],
        loadChildren: () => import('./cliente/meu-token/meu-token.module').then((m) => m.MeuTokenModule),
      },
      {
        path: 'consumo',
        canActivate: [clienteOnboardingGuard],
        loadChildren: () => import('./cliente/consumo/consumo.module').then((m) => m.ConsumoModule),
      },
      {
        path: 'minhas-faturas',
        canActivate: [clienteOnboardingGuard],
        loadChildren: () => import('./cliente/minhas-faturas/minhas-faturas.module').then((m) => m.MinhasFaturasModule),
      },
      {
        path: 'painel-360',
        canActivate: [clienteOnboardingGuard, clienteRecursoGuard],
        loadChildren: () => import('./cliente/painel-360/painel-360.module').then((m) => m.Painel360ClienteModule),
      },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  declarations: [PortalShellComponent, DashboardComponent],
  imports: [CommonModule, FormsModule, PoModule, PoTemplatesModule, RouterModule.forChild(routes)],
  providers: [],
})
export class PortalModule {}

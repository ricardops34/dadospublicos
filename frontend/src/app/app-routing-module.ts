import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { DocsComponent } from './pages/docs/docs.component';
import { DocsModule } from './pages/docs/docs.module';
import { LegalComponent } from './pages/legal/legal.component';
import { LegalModule } from './pages/legal/legal.module';

const routes: Routes = [
  // Páginas públicas
  { path: 'docs', component: DocsComponent },
  { path: 'termos-de-uso', component: LegalComponent, data: { tipo: 'termos' } },
  { path: 'privacidade', component: LegalComponent, data: { tipo: 'privacidade' } },

  // Landing page
  { path: '', loadChildren: () => import('./pages/landing/landing.module').then((m) => m.LandingModule) },

  // Login único
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then((m) => m.LoginModule) },

  // Cadastro público (mantido para link da landing)
  { path: 'cliente/cadastro', loadChildren: () => import('./pages/cliente/cadastro/cliente-cadastro.module').then((m) => m.ClienteCadastroModule) },

  // Portal unificado (admin + cliente — guarda apenas exige JWT válido)
  {
    path: 'portal',
    canActivate: [authGuard],
    loadChildren: () => import('./pages/portal/portal.module').then((m) => m.PortalModule),
  },

  // Redirects de compatibilidade com rotas antigas
  { path: 'admin/login', redirectTo: '/login', pathMatch: 'full' },
  { path: 'admin', redirectTo: '/portal', pathMatch: 'full' },
  { path: 'cliente/login', redirectTo: '/login', pathMatch: 'full' },
  { path: 'cliente', redirectTo: '/portal', pathMatch: 'full' },

  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [
    DocsModule,
    LegalModule,
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

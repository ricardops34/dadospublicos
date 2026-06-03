import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';
import { clienteGuard } from './guards/cliente.guard';

const routes: Routes = [
  // Landing Page — pública
  {
    path: '',
    loadChildren: () => import('./pages/landing/landing.module').then(m => m.LandingModule),
  },

  // Login / cadastro sem guard
  { path: 'admin/login',    loadChildren: () => import('./pages/admin/login/admin-login.module').then(m => m.AdminLoginModule) },
  { path: 'cliente/login',  loadChildren: () => import('./pages/cliente/login/cliente-login.module').then(m => m.ClienteLoginModule) },
  { path: 'cliente/cadastro', loadChildren: () => import('./pages/cliente/cadastro/cliente-cadastro.module').then(m => m.ClienteCadastroModule) },

  // Área administrativa
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule),
  },

  // Área do cliente
  {
    path: 'cliente',
    canActivate: [clienteGuard],
    loadChildren: () => import('./pages/cliente/cliente.module').then(m => m.ClienteModule),
  },

  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}

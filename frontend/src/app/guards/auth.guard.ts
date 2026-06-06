import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLogado()) return true;
  router.navigate(['/login']);
  return false;
};

export const adminGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLogado() && auth.isAdmin()) return true;
  router.navigate(['/login']);
  return false;
};

export const clienteGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLogado() && auth.isCliente()) return true;
  router.navigate(['/login']);
  return false;
};

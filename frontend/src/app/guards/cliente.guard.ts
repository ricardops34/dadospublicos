import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const clienteGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isCliente()) return true;
  router.navigate(['/cliente/login']);
  return false;
};

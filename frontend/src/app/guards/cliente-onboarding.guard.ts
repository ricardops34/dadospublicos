import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { ClientePortalService } from '../pages/portal/cliente/cliente.service';
import { AuthService } from '../services/auth.service';

export const clienteOnboardingGuard = (_route?: any, state?: any) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const clienteService = inject(ClientePortalService);

  if (!auth.isCliente()) {
    return true;
  }

  if (state?.url === '/portal/minha-conta') {
    return true;
  }

  return clienteService.meuPerfil().pipe(
    map((perfil) => {
      if (clienteService.temOnboardingPendente(perfil)) {
        return router.createUrlTree(['/portal/primeiro-acesso']);
      }
      return true;
    }),
    catchError(() => of(router.createUrlTree(['/portal/primeiro-acesso']))),
  );
};

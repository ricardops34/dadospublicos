import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UsuarioPortalService } from '../pages/portal/cliente/usuario.service';
import { temRecursoPainel360 } from '../pages/portal/painel-360/painel-360.types';
import { AuthService } from '../services/auth.service';

export const clienteRecursoGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const clienteService = inject(UsuarioPortalService);

  if (auth.isAdmin()) {
    return true;
  }

  if (!auth.isCliente()) {
    return router.createUrlTree(['/cliente/login']);
  }

  return clienteService.minhaAssinatura().pipe(
    map((assinatura): boolean | UrlTree => {
      if (temRecursoPainel360(assinatura)) {
        return true;
      }

      return router.createUrlTree(['/portal/meu-plano']);
    }),
    catchError(() => of(router.createUrlTree(['/portal/dashboard']))),
  );
};

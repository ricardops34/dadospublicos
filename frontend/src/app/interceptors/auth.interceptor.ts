import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

// Prefixos de rota que exigem token de API (AuthGuard no backend)
const API_TOKEN_PATHS = ['/geocode/', '/cnpj/', '/cnpj-raiz/', '/pesquisa/', '/consumo/', '/suframa/', '/mapa/'];

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.url.startsWith(environment.apiUrl)) {
      return next.handle(req);
    }

    const path = req.url.slice(environment.apiUrl.length);
    const headers: Record<string, string> = {};

    // JWT portal para endpoints /portal/ e /admin/
    const jwt = this.auth.getToken();
    if (jwt) {
      headers['Authorization'] = `Bearer ${jwt}`;
    }

    // API token para endpoints públicos de dados
    const apiToken = this.auth.getApiToken();
    if (apiToken && API_TOKEN_PATHS.some((p) => path.startsWith(p))) {
      headers['x_api_token'] = apiToken;
    }

    if (Object.keys(headers).length === 0) {
      return next.handle(req);
    }

    return next.handle(req.clone({ setHeaders: headers }));
  }
}

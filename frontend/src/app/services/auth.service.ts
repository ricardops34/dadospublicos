import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface JwtPayload {
  sub: string;
  clienteId?: string | null;
  contaId: string | null;
  nome: string;
  email: string;
  perfil: 'admin' | 'cliente';
  iat: number;
  exp: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY    = 'portal_token';
  private readonly API_TOKEN_KEY = 'api_token';
  private readonly ADMIN_KEY    = 'admin_key';
  private readonly CLIENTE_ID   = 'cliente_id';
  private readonly CLIENTE_NOME = 'cliente_nome';

  constructor(private http: HttpClient) {}

  login(email: string, senha: string) {
    return this.http
      .post<{ token: string; perfil: string; nome: string; apiToken?: string }>(
        `${environment.apiUrl}/portal/login`, { email, senha },
      )
      .pipe(
        tap((res) => {
          localStorage.setItem(this.TOKEN_KEY, res.token);
          if (res.apiToken) {
            localStorage.setItem(this.API_TOKEN_KEY, res.apiToken);
          } else {
            localStorage.removeItem(this.API_TOKEN_KEY);
          }
        }),
      );
  }

  getApiToken(): string | null {
    return localStorage.getItem(this.API_TOKEN_KEY);
  }

  loginApi(email: string, senha: string) {
    return this.http.post<any>(`${environment.apiUrl}/usuarios/login`, { email, senha });
  }

  signupApi(dados: any) {
    return this.http.post<any>(`${environment.apiUrl}/usuarios/signup`, dados);
  }

  recuperarSenha(email: string) {
    return this.http.post<{ mensagem: string }>(`${environment.apiUrl}/usuarios/recuperar-senha`, { email });
  }

  verificarEmailCodigo(email: string, codigo: string) {
    return this.http.post<{ mensagem: string }>(`${environment.apiUrl}/usuarios/verificar-email-codigo`, { email, codigo });
  }

  reenviarCodigoVerificacao(email: string) {
    return this.http.post<{ mensagem: string }>(`${environment.apiUrl}/usuarios/reenviar-codigo`, { email });
  }

  verificarCodigoReset(email: string, codigo: string) {
    return this.http.post<{ mensagem: string }>(`${environment.apiUrl}/usuarios/verificar-codigo-reset`, { email, codigo });
  }

  redefinirSenhaComCodigo(email: string, codigo: string, novaSenha: string) {
    return this.http.post<{ mensagem: string }>(`${environment.apiUrl}/usuarios/redefinir-senha`, { email, codigo, novaSenha });
  }

  loginCliente(id: string, nome: string) {
    localStorage.setItem(this.CLIENTE_ID, id);
    localStorage.setItem(this.CLIENTE_NOME, nome);
  }

  logoutCliente() {
    localStorage.removeItem(this.CLIENTE_ID);
    localStorage.removeItem(this.CLIENTE_NOME);
    this.logout();
  }

  getClienteNome(): string {
    return localStorage.getItem(this.CLIENTE_NOME) ?? this.getNome();
  }

  setAdminKey(key: string) {
    localStorage.setItem(this.ADMIN_KEY, key);
  }

  getAdminKey(): string {
    return localStorage.getItem(this.ADMIN_KEY) ?? '';
  }

  logoutAdmin() {
    localStorage.removeItem(this.ADMIN_KEY);
    this.logout();
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.API_TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getPayload(): JwtPayload | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64)) as JwtPayload;
    } catch {
      return null;
    }
  }

  isLogado(): boolean {
    const p = this.getPayload();
    if (p) return p.exp * 1000 > Date.now();
    return !!localStorage.getItem(this.CLIENTE_ID) || !!localStorage.getItem(this.ADMIN_KEY);
  }

  getPerfil(): 'admin' | 'cliente' | null {
    if (localStorage.getItem(this.ADMIN_KEY)) return 'admin';
    if (localStorage.getItem(this.CLIENTE_ID)) return 'cliente';
    return this.getPayload()?.perfil ?? null;
  }

  getNome(): string {
    return this.getPayload()?.nome ?? localStorage.getItem(this.CLIENTE_NOME) ?? '';
  }

  getClienteId(): string | null {
    const payload = this.getPayload();
    return payload?.clienteId ?? payload?.contaId ?? null;
  }

  getContaId(): string | null {
    return this.getClienteId();
  }

  isAdmin(): boolean {
    return this.getPerfil() === 'admin';
  }

  isCliente(): boolean {
    return this.getPerfil() === 'cliente';
  }
}

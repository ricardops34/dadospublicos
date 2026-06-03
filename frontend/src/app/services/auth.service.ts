import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  // ── Admin ──────────────────────────────────────
  isAdmin(): boolean {
    return !!localStorage.getItem('admin_key');
  }

  setAdminKey(key: string) {
    localStorage.setItem('admin_key', key);
  }

  getAdminKey(): string {
    return localStorage.getItem('admin_key') ?? '';
  }

  logoutAdmin() {
    localStorage.removeItem('admin_key');
  }

  // ── Cliente ────────────────────────────────────
  isCliente(): boolean {
    return !!localStorage.getItem('cliente_id');
  }

  getClienteId(): string {
    return localStorage.getItem('cliente_id') ?? '';
  }

  loginCliente(clienteId: string, nome: string) {
    localStorage.setItem('cliente_id', clienteId);
    localStorage.setItem('cliente_nome', nome);
  }

  logoutCliente() {
    localStorage.removeItem('cliente_id');
    localStorage.removeItem('cliente_nome');
  }

  getClienteNome(): string {
    return localStorage.getItem('cliente_nome') ?? '';
  }

  // ── API calls ──────────────────────────────────
  loginApi(email: string, senha: string) {
    return this.http.post<any>(`${environment.apiUrl}/clientes/login`, { email, senha });
  }

  signupApi(dados: any) {
    return this.http.post<any>(`${environment.apiUrl}/clientes/signup`, dados);
  }
}

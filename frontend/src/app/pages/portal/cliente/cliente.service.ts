import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

const API = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class ClientePortalService {

  constructor(private http: HttpClient) {}

  // ─── Perfil ───────────────────────────────────────────────────────────────
  meuPerfil() {
    return this.http.get<any>(`${API}/clientes/me`);
  }

  atualizarPerfil(dto: { nome?: string; telefone?: string; cnpj?: string; razaoSocial?: string }) {
    return this.http.patch<any>(`${API}/clientes/me`, dto);
  }

  // ─── Assinatura ───────────────────────────────────────────────────────────
  minhaAssinatura() {
    return this.http.get<any>(`${API}/assinaturas/minha`);
  }

  assinar(plano: string) {
    return this.http.post<any>(`${API}/assinaturas/assinar/${plano}`, {});
  }

  cancelarAssinatura(motivo?: string) {
    return this.http.post<any>(`${API}/assinaturas/cancelar`, { motivo });
  }

  regerarToken() {
    return this.http.post<any>(`${API}/assinaturas/regerar-token`, {});
  }

  // ─── Planos públicos ──────────────────────────────────────────────────────
  listarPlanos() {
    return this.http.get<any[]>(`${API}/planos`);
  }

  // ─── Consumo ──────────────────────────────────────────────────────────────
  meuConsumo() {
    return this.http.get<any[]>(`${API}/consumo/portal`);
  }

  // ─── Faturas ──────────────────────────────────────────────────────────────
  minhasFaturas() {
    return this.http.get<any[]>(`${API}/faturas/minhas`);
  }
}

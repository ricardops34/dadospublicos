import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Painel360Service } from '../painel-360/painel-360.service';
import {
  Painel360GeoJsonCollection,
  Painel360Lote,
  Painel360ResultadosResponse,
  temRecursoPainel360,
} from '../painel-360/painel-360.types';

const API = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class ClientePortalService {
  constructor(
    private http: HttpClient,
    private painel360Service: Painel360Service,
  ) {}

  // ─── Perfil ───────────────────────────────────────────────────────────────
  meuPerfil() {
    return this.http.get<any>(`${API}/clientes/me`);
  }

  atualizarPerfil(dto: { nome?: string; telefone?: string; cnpj?: string; razaoSocial?: string }) {
    return this.http.patch<any>(`${API}/clientes/me`, dto);
  }

  upgradePreview(planoSlug: string) {
    return this.http.get<any>(`${API}/assinaturas/upgrade/preview?plano=${planoSlug}`);
  }

  realizarUpgrade(planoSlug: string) {
    return this.http.post<any>(`${API}/assinaturas/upgrade`, { plano: planoSlug });
  }

  agendarExclusao(agendarPara: 'agora' | 'fim-plano') {
    return this.http.post<{ mensagem: string; agendarExclusaoEm: Date }>(`${API}/clientes/me/agendar-exclusao`, { agendarPara });
  }

  // ─── Assinatura ───────────────────────────────────────────────────────────
  minhaAssinatura() {
    return this.http.get<any>(`${API}/assinaturas/minha`);
  }

  assinar(plano: string) {
    return this.http.post<any>(`${API}/assinaturas/assinar/${plano}`, {});
  }

  cancelarAssinatura(quando: 'agora' | 'fim-vigencia', motivo?: string) {
    return this.http.post<any>(`${API}/assinaturas/cancelar`, { quando, motivo });
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

  uploadPainel360Url() {
    return this.painel360Service.obterUploadUrl('cliente');
  }

  listarPainel360Lotes(): Observable<Painel360Lote[]> {
    return this.painel360Service.listarLotes('cliente');
  }

  detalharPainel360Lote(loteId: string): Observable<Painel360Lote> {
    return this.painel360Service.obterLote('cliente', loteId);
  }

  listarPainel360Resultados(loteId: string, pagina = 1, limite = 50): Observable<Painel360ResultadosResponse> {
    return this.painel360Service.listarResultados('cliente', loteId, pagina, limite);
  }

  obterPainel360GeoJson(loteId: string): Observable<Painel360GeoJsonCollection> {
    return this.painel360Service.obterGeoJson('cliente', loteId);
  }

  baixarPainel360Resultado(loteId: string) {
    return this.painel360Service.baixarResultado('cliente', loteId);
  }

  assinaturaTemPainel360(assinatura: unknown): boolean {
    return temRecursoPainel360(assinatura);
  }
}

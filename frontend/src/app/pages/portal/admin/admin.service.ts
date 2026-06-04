import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

const API = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private http: HttpClient) {}

  // ─── Clientes ─────────────────────────────────────────────────────────────
  listarClientes(pagina = 1, limite = 20) {
    const params = new HttpParams().set('pagina', pagina).set('limite', limite);
    return this.http.get<any>(`${API}/clientes`, { params });
  }

  detalheCliente(id: string) {
    return this.http.get<any>(`${API}/clientes/${id}`);
  }

  ativarCliente(id: string, ativo: boolean) {
    return this.http.patch<any>(`${API}/clientes/${id}/ativo`, { ativo });
  }

  // ─── Assinaturas ──────────────────────────────────────────────────────────
  listarAssinaturas(pagina = 1, limite = 20) {
    const params = new HttpParams().set('pagina', pagina).set('limite', limite);
    return this.http.get<any>(`${API}/assinaturas`, { params });
  }

  suspenderAssinatura(id: string) {
    return this.http.patch<any>(`${API}/assinaturas/${id}/suspender`, {});
  }

  reativarAssinatura(id: string) {
    return this.http.patch<any>(`${API}/assinaturas/${id}/reativar`, {});
  }

  // ─── Faturas ──────────────────────────────────────────────────────────────
  listarFaturas(status?: string, pagina = 1, limite = 20) {
    let params = new HttpParams().set('pagina', pagina).set('limite', limite);
    if (status) params = params.set('status', status);
    return this.http.get<any>(`${API}/faturas`, { params });
  }

  marcarFaturaPaga(id: string, numeroNf?: string, urlNf?: string) {
    return this.http.patch<any>(`${API}/faturas/${id}/paga`, { numero_nf: numeroNf, url_nf: urlNf });
  }

  gerarFaturasMensais() {
    return this.http.post<any>(`${API}/faturas/gerar-mensais`, {});
  }

  // ─── Planos ───────────────────────────────────────────────────────────────
  listarPlanos() {
    return this.http.get<any[]>(`${API}/planos?todos=true`);
  }

  criarPlano(dto: any) {
    return this.http.post<any>(`${API}/planos`, dto);
  }

  atualizarPlano(id: string, dto: any) {
    return this.http.patch<any>(`${API}/planos/${id}`, dto);
  }

  desativarPlano(id: string) {
    return this.http.delete<any>(`${API}/planos/${id}`);
  }

  seedPlanos() {
    return this.http.post<any>(`${API}/planos/seed`, {});
  }

  // ─── Recursos (catálogo) ──────────────────────────────────────────────────
  listarRecursos() {
    return this.http.get<any[]>(`${API}/planos/recursos/catalogo`);
  }

  criarRecurso(dto: { nome: string; slug: string }) {
    return this.http.post<any>(`${API}/planos/recursos/catalogo`, dto);
  }

  atualizarRecurso(id: string, dto: { nome?: string; ativo?: boolean }) {
    return this.http.patch<any>(`${API}/planos/recursos/catalogo/${id}`, dto);
  }

  desativarRecurso(id: string) {
    return this.http.delete<any>(`${API}/planos/recursos/catalogo/${id}`);
  }

  // ─── Recurso × Plano ─────────────────────────────────────────────────────
  listarRecursosDePlano(planoId: string) {
    return this.http.get<any[]>(`${API}/planos/${planoId}/recursos`);
  }

  addRecursoAoPlano(planoId: string, dto: { recursoId: string; descricaoExibicao: string; ordem?: number }) {
    return this.http.post<any>(`${API}/planos/${planoId}/recursos`, dto);
  }

  updateRecursoDoPlano(planoId: string, assocId: string, dto: { descricaoExibicao?: string; ordem?: number }) {
    return this.http.patch<any>(`${API}/planos/${planoId}/recursos/${assocId}`, dto);
  }

  removeRecursoDoPlano(planoId: string, assocId: string) {
    return this.http.delete<any>(`${API}/planos/${planoId}/recursos/${assocId}`);
  }
}

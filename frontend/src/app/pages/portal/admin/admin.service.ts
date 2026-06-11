import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Painel360Service } from '../painel-360/painel-360.service';
import {
  Painel360GeoJsonCollection,
  Painel360Lote,
  Painel360ResultadosResponse,
} from '../painel-360/painel-360.types';

const API = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(
    private http: HttpClient,
    private painel360Service: Painel360Service,
  ) {}

  detalheCliente(id: string) {
    return this.http.get<any>(`${API}/admin/clientes-poui/${id}`);
  }

  ativarCliente(id: string, ativo: boolean) {
    return this.http.patch<any>(`${API}/admin/clientes-poui/${id}/ativo`, { ativo });
  }

  agendarExclusaoCliente(id: string, agendarPara: 'agora' | 'fim-plano') {
    return this.http.post<any>(`${API}/admin/clientes-poui/${id}/agendar-exclusao`, { agendarPara });
  }

  cancelarExclusaoCliente(id: string) {
    return this.http.post<any>(`${API}/admin/clientes-poui/${id}/cancelar-exclusao`, {});
  }

  criarUsuarioPrincipalCliente(id: string) {
    return this.http.post<any>(`${API}/admin/clientes-poui/${id}/criar-usuario-principal`, {});
  }

  confirmarEmailCliente(id: string) {
    return this.http.patch<any>(`${API}/admin/usuarios-poui/${id}/confirmar-email`, {});
  }

  enviarResetSenhaCliente(id: string) {
    return this.http.post<any>(`${API}/admin/usuarios-poui/${id}/enviar-reset-senha`, {});
  }

  lookupCnpj(cnpj: string) {
    return this.http.get<any>(`${API}/admin/clientes-poui/lookup/cnpj/${cnpj.replace(/\D/g, '')}`);
  }

  lookupCep(cep: string) {
    return this.http.get<any>(`${API}/admin/clientes-poui/lookup/cep/${cep.replace(/\D/g, '')}`);
  }

  listarAssinaturas(pagina = 1, limite = 20) {
    const params = new HttpParams().set('pagina', pagina).set('limite', limite);
    return this.http.get<any>(`${API}/assinaturas`, { params });
  }

  editarAssinatura(id: string, dto: any) {
    return this.http.patch<any>(`${API}/assinaturas/${id}`, dto);
  }

  suspenderAssinatura(id: string) {
    return this.http.patch<any>(`${API}/assinaturas/${id}/suspender`, {});
  }

  reativarAssinatura(id: string) {
    return this.http.patch<any>(`${API}/assinaturas/${id}/reativar`, {});
  }

  consumosDaAssinatura(id: string) {
    return this.http.get<any[]>(`${API}/assinaturas/${id}/consumo`);
  }

  editarConsumo(consumoId: string, quantidade: number) {
    return this.http.patch<any>(`${API}/consumo/admin/${consumoId}`, { quantidade });
  }

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

  flushCachePlanos() {
    return this.http.post<any>(`${API}/planos/cache/flush`, {});
  }

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

  uploadPainel360Url() {
    return this.painel360Service.obterUploadUrl('admin');
  }

  listarPainel360Lotes(): Observable<Painel360Lote[]> {
    return this.painel360Service.listarLotes('admin');
  }

  detalharPainel360Lote(loteId: string): Observable<Painel360Lote> {
    return this.painel360Service.obterLote('admin', loteId);
  }

  listarPainel360Resultados(loteId: string, pagina = 1, limite = 50): Observable<Painel360ResultadosResponse> {
    return this.painel360Service.listarResultados('admin', loteId, pagina, limite);
  }

  obterPainel360GeoJson(loteId: string): Observable<Painel360GeoJsonCollection> {
    return this.painel360Service.obterGeoJson('admin', loteId);
  }

  baixarPainel360Resultado(loteId: string) {
    return this.painel360Service.baixarResultado('admin', loteId);
  }
}

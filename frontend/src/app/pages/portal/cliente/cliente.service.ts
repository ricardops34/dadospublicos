import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Painel360Service } from '../painel-360/painel-360.service';
import {
  Painel360GeoJsonCollection,
  Painel360Lote,
  Painel360ResultadosResponse,
  temRecursoPainel360,
} from '../painel-360/painel-360.types';

const API = environment.apiUrl;

export interface ClienteExclusaoResponse {
  mensagem: string;
  tipoFluxo?: 'exclusao-imediata' | 'anonimizacao-agendada';
  agendarExclusaoEm: Date | string | null;
}

export interface ClientePerfil {
  id: string;
  nome: string;
  email: string;
  tipoPessoa?: 'F' | 'J' | null;
  telefone?: string | null;
  cpf?: string | null;
  dataNascimento?: string | null;
  cnpj?: string | null;
  razaoSocial?: string | null;
  cep?: string | null;
  logradouro?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  municipio?: string | null;
  uf?: string | null;
  inscricaoEstadual?: string | null;
  inscricaoMunicipal?: string | null;
  agendarExclusaoEm?: Date | string | null;
  onboardingPendente?: boolean;
  assinaturas?: any[];
  /** Dados da empresa/tenant separados dos dados pessoais */
  conta?: {
    id: string;
    tipoPessoa?: 'F' | 'J';
    cnpj?: string | null;
    razaoSocial?: string | null;
    telefone?: string | null;
    cep?: string | null;
    logradouro?: string | null;
    numero?: string | null;
    complemento?: string | null;
    bairro?: string | null;
    municipio?: string | null;
    uf?: string | null;
    inscricaoEstadual?: string | null;
    inscricaoMunicipal?: string | null;
  } | null;
}

@Injectable({ providedIn: 'root' })
export class ClientePortalService {
  private _perfilCache: ClientePerfil | null = null;

  constructor(
    private http: HttpClient,
    private painel360Service: Painel360Service,
  ) {}

  meuPerfil(): Observable<ClientePerfil> {
    if (this._perfilCache) return of(this._perfilCache);
    return this.http.get<ClientePerfil>(`${API}/clientes/me`).pipe(
      tap(p => (this._perfilCache = p)),
    );
  }

  invalidarPerfilCache() {
    this._perfilCache = null;
  }

  atualizarPerfil(dto: Partial<ClientePerfil> & { senha?: string }) {
    return this.http.patch<ClientePerfil>(`${API}/clientes/me`, dto).pipe(
      tap(() => this.invalidarPerfilCache()),
    );
  }

  upgradePreview(planoSlug: string) {
    return this.http.get<any>(`${API}/assinaturas/upgrade/preview?plano=${planoSlug}`);
  }

  realizarUpgrade(planoSlug: string) {
    return this.http.post<any>(`${API}/assinaturas/upgrade`, { plano: planoSlug });
  }

  agendarExclusao(agendarPara: 'agora' | 'fim-plano') {
    return this.http.post<ClienteExclusaoResponse>(`${API}/clientes/me/agendar-exclusao`, { agendarPara });
  }

  cancelarExclusao() {
    return this.http.post<ClienteExclusaoResponse>(`${API}/clientes/me/cancelar-exclusao`, {});
  }

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

  listarPlanos() {
    return this.http.get<any[]>(`${API}/planos`);
  }

  temOnboardingPendente(perfil: ClientePerfil | null | undefined): boolean {
    return !!perfil?.onboardingPendente;
  }

  assinaturaEhPaga(assinatura: any): boolean {
    return assinatura?.status === 'ativa' && Number(assinatura?.plano?.precoMensal ?? 0) > 0;
  }

  meuConsumo() {
    return this.http.get<any[]>(`${API}/consumo/portal`);
  }

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

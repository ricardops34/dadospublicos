import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Painel360Service } from '../painel-360/painel-360.service';
import {
  Painel360BuscaResult,
  Painel360CnaeOption,
  Painel360Consulta,
  Painel360FiltrosBusca,
  Painel360GeoJsonCollection,
  Painel360MunicipioOption,
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
  cliente?: {
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
    cnaePrincipal?: string | null;
    cnaePrincipalDescricao?: string | null;
    cnaesSecundarios?: Array<{ codigo: string; descricao?: string | null }>;
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
    return this.http.get<ClientePerfil>(`${API}/usuarios/me`).pipe(
      tap((perfil) => (this._perfilCache = perfil)),
    );
  }

  invalidarPerfilCache() {
    this._perfilCache = null;
  }

  atualizarPerfil(dto: Partial<ClientePerfil> & { senha?: string }) {
    return this.http.patch<ClientePerfil>(`${API}/usuarios/me`, dto).pipe(
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
    return this.http.post<ClienteExclusaoResponse>(`${API}/usuarios/me/agendar-exclusao`, { agendarPara });
  }

  cancelarExclusao() {
    return this.http.post<ClienteExclusaoResponse>(`${API}/usuarios/me/cancelar-exclusao`, {});
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

  buscarPainel360(filtros: Painel360FiltrosBusca): Observable<Painel360BuscaResult> {
    return this.painel360Service.buscar('cliente', filtros);
  }

  listarConsultasPainel360(): Observable<Painel360Consulta[]> {
    return this.painel360Service.listarConsultas('cliente');
  }

  recarregarGeoJsonPainel360(consultaId: string): Observable<Painel360GeoJsonCollection> {
    return this.painel360Service.recarregarGeoJson('cliente', consultaId);
  }

  gerarRelatorioPainel360(consultaId: string) {
    return this.painel360Service.gerarRelatorio('cliente', consultaId);
  }

  lookupCnaePainel360(q?: string): Observable<Painel360CnaeOption[]> {
    return this.painel360Service.lookupCnaes(q);
  }

  lookupMunicipiosPainel360(uf: string): Observable<Painel360MunicipioOption[]> {
    return this.painel360Service.lookupMunicipios(uf);
  }

  assinaturaTemPainel360(assinatura: unknown): boolean {
    return temRecursoPainel360(assinatura);
  }
}

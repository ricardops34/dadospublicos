import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
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

export interface UsuarioExclusaoResponse {
  mensagem: string;
  tipoFluxo?: 'exclusao-imediata' | 'anonimizacao-agendada';
  agendarExclusaoEm: Date | string | null;
}

export interface CnaeSecundario {
  codigo: string;
  descricao?: string | null;
}

export interface UsuarioPerfil {
  id: string;
  nome: string;
  email: string;
  avatar?: string | null;
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
    cnaesSecundarios?: CnaeSecundario[];
  } | null;
}

@Injectable({ providedIn: 'root' })
export class UsuarioPortalService {
  private _perfilCache: UsuarioPerfil | null = null;

  private _avatar$ = new BehaviorSubject<string | null>(null);
  readonly avatar$ = this._avatar$.asObservable();

  constructor(
    private http: HttpClient,
    private painel360Service: Painel360Service,
  ) {}

  private normalizarPerfil(perfil: UsuarioPerfil): UsuarioPerfil {
    const { conta, ...perfilSemConta } = perfil as UsuarioPerfil & { conta?: UsuarioPerfil['cliente'] };
    const cliente = perfilSemConta.cliente ?? conta ?? null;
    return { ...perfilSemConta, cliente };
  }

  meuPerfil(): Observable<UsuarioPerfil> {
    if (this._perfilCache) return of(this._perfilCache);
    return this.http.get<UsuarioPerfil>(`${API}/usuarios/me`).pipe(
      map((perfil) => this.normalizarPerfil(perfil)),
      tap((perfil) => {
        this._perfilCache = perfil;
        this._avatar$.next(perfil.avatar ?? null);
      }),
    );
  }

  atualizarAvatar(avatar: string) {
    return this.http.patch<UsuarioPerfil>(`${API}/usuarios/me`, { avatar }).pipe(
      tap(() => {
        if (this._perfilCache) this._perfilCache.avatar = avatar;
        this._avatar$.next(avatar);
      }),
    );
  }

  invalidarPerfilCache() {
    this._perfilCache = null;
  }

  atualizarPerfil(dto: Partial<UsuarioPerfil> & { senha?: string }) {
    return this.http.patch<UsuarioPerfil>(`${API}/usuarios/me`, dto).pipe(
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
    return this.http.post<UsuarioExclusaoResponse>(`${API}/usuarios/me/agendar-exclusao`, { agendarPara });
  }

  cancelarExclusao() {
    return this.http.post<UsuarioExclusaoResponse>(`${API}/usuarios/me/cancelar-exclusao`, {});
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

  temOnboardingPendente(perfil: UsuarioPerfil | null | undefined): boolean {
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

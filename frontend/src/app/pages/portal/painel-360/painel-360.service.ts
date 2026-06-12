import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  Painel360BuscaResult,
  Painel360CnaeOption,
  Painel360Consulta,
  Painel360FiltrosBusca,
  Painel360GeoJsonCollection,
  Painel360MunicipioOption,
  Painel360Perfil,
} from './painel-360.types';

const API = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class Painel360Service {
  constructor(private http: HttpClient) {}

  buscar(perfil: Painel360Perfil, filtros: Painel360FiltrosBusca): Observable<Painel360BuscaResult> {
    return this.http.post<Painel360BuscaResult>(`${this.baseUrl(perfil)}/busca`, filtros);
  }

  listarConsultas(perfil: Painel360Perfil): Observable<Painel360Consulta[]> {
    return this.http.get<Painel360Consulta[]>(`${this.baseUrl(perfil)}/consultas`);
  }

  recarregarGeoJson(perfil: Painel360Perfil, consultaId: string): Observable<Painel360GeoJsonCollection> {
    return this.http.get<Painel360GeoJsonCollection>(`${this.baseUrl(perfil)}/consultas/${consultaId}/geojson`);
  }

  gerarRelatorio(perfil: Painel360Perfil, consultaId: string): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.baseUrl(perfil)}/consultas/${consultaId}/relatorio`, {
      observe: 'response',
      responseType: 'blob',
    });
  }

  lookupCnaes(q?: string): Observable<Painel360CnaeOption[]> {
    const url = q
      ? `${API}/painel-360/lookup/cnaes?q=${encodeURIComponent(q)}`
      : `${API}/painel-360/lookup/cnaes`;
    return this.http.get<Painel360CnaeOption[]>(url);
  }

  lookupMunicipios(uf: string): Observable<Painel360MunicipioOption[]> {
    return this.http.get<Painel360MunicipioOption[]>(
      `${API}/painel-360/lookup/municipios?uf=${encodeURIComponent(uf)}`,
    );
  }

  private baseUrl(perfil: Painel360Perfil): string {
    return `${API}/painel-360/${perfil}`;
  }
}

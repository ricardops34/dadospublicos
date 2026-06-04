import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  extrairLista,
  extrairTotal,
  Painel360GeoJsonCollection,
  Painel360Lote,
  Painel360Perfil,
  Painel360Resultado,
  Painel360ResultadosResponse,
} from './painel-360.types';

const API = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class Painel360Service {
  constructor(private http: HttpClient) {}

  obterUploadUrl(perfil: Painel360Perfil): string {
    return `${this.baseUrl(perfil)}/lotes`;
  }

  listarLotes(perfil: Painel360Perfil): Observable<Painel360Lote[]> {
    return this.http
      .get<unknown>(`${this.baseUrl(perfil)}/lotes`)
      .pipe(map((response) => extrairLista<Painel360Lote>(response)));
  }

  obterLote(perfil: Painel360Perfil, loteId: string): Observable<Painel360Lote> {
    return this.http.get<Painel360Lote>(`${this.baseUrl(perfil)}/lotes/${loteId}`);
  }

  listarResultados(
    perfil: Painel360Perfil,
    loteId: string,
    pagina = 1,
    limite = 50,
  ): Observable<Painel360ResultadosResponse> {
    const params = new HttpParams().set('pagina', pagina).set('limite', limite);

    return this.http.get<unknown>(`${this.baseUrl(perfil)}/lotes/${loteId}/resultados`, { params }).pipe(
      map((response) => {
        const items = extrairLista<Painel360Resultado>(response);
        return {
          items,
          total: extrairTotal(response, items.length),
        };
      }),
    );
  }

  obterGeoJson(perfil: Painel360Perfil, loteId: string): Observable<Painel360GeoJsonCollection> {
    return this.http.get<Painel360GeoJsonCollection>(`${this.baseUrl(perfil)}/lotes/${loteId}/geojson`);
  }

  baixarResultado(perfil: Painel360Perfil, loteId: string): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.baseUrl(perfil)}/lotes/${loteId}/download`, {
      observe: 'response',
      responseType: 'blob',
    });
  }

  private baseUrl(perfil: Painel360Perfil): string {
    return `${API}/painel-360/${perfil}`;
  }
}

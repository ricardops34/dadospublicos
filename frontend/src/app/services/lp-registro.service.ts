import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LpRegistroService {
  private status$: Observable<boolean> | null = null;

  constructor(private http: HttpClient) {}

  registrosHabilitados(): Observable<boolean> {
    if (!this.status$) {
      this.status$ = this.http
        .get<{ habilitado: boolean }>(`${environment.apiUrl}/clientes/status-registro`)
        .pipe(
          map((r) => r.habilitado),
          catchError(() => of(false)),
          shareReplay(1),
        );
    }
    return this.status$;
  }
}

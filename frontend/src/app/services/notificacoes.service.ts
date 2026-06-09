import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: 'sistema' | 'financeiro' | 'conta' | 'consumo';
  lida: boolean;
  criadoEm: string;
}

@Injectable({ providedIn: 'root' })
export class NotificacoesService {
  private readonly base = `${environment.apiUrl}/portal/notificacoes`;
  private naoLidas$ = new BehaviorSubject<number>(0);

  naoLidas = this.naoLidas$.asObservable();

  constructor(private http: HttpClient) {}

  carregarContagem() {
    this.http.get<{ total: number }>(`${this.base}/nao-lidas/count`).subscribe({
      next: (r) => this.naoLidas$.next(r.total),
      error: () => {},
    });
  }

  listar(): Observable<Notificacao[]> {
    return this.http.get<Notificacao[]>(`${this.base}/minhas`);
  }

  marcarTodasLidas(): Observable<void> {
    return this.http.patch<void>(`${this.base}/marcar-lidas`, {}).pipe(
      tap(() => this.naoLidas$.next(0)),
    );
  }
}

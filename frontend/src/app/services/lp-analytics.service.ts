import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const SECOES_LP = ['hero', 'como-funciona', 'planos', 'exemplos'];
const SCROLL_MARCOS = [25, 50, 75, 100];
const SESSION_KEY = 'buscadados_session';

@Injectable({ providedIn: 'root' })
export class LpAnalyticsService implements OnDestroy {
  private sessionId = '';
  private cookiesAtivos = false;
  private scrollMarcosEnviados = new Set<number>();
  private secoesVistas = new Set<string>();
  private inicioVisita = Date.now();
  private intersectionObserver: IntersectionObserver | null = null;
  private scrollListener: (() => void) | null = null;
  private readonly api = `${environment.apiUrl}/analytics-lp`;

  constructor(private http: HttpClient) {}

  init() {
    this.sessionId = this.obterOuCriarSessionId();
    const cookiesJaAceitos = localStorage.getItem('bjsoft_cookies_accepted') === 'true';

    const payload = this.coletarInfoDispositivo();
    this.http.post(`${this.api}/visita`, { sessionId: this.sessionId, ...payload }).subscribe();

    if (cookiesJaAceitos) {
      this.cookiesAtivos = true;
      this.iniciarTracking();
    }
  }

  cookiesAceitos() {
    this.cookiesAtivos = true;
    this.http.patch(`${this.api}/cookies`, { sessionId: this.sessionId, aceito: true }).subscribe();
    this.iniciarTracking();
  }

  cookiesRecusados() {
    this.http.patch(`${this.api}/cookies`, { sessionId: this.sessionId, aceito: false }).subscribe();
  }

  registrarConversao(clienteId: string) {
    this.http.post(`${this.api}/conversao`, { sessionId: this.sessionId, clienteId }).subscribe();
  }

  getSessionId(): string {
    return this.sessionId;
  }

  private iniciarTracking() {
    this.inicioVisita = Date.now();
    this.registrarScrollDepth();
    this.registrarSecoesVistas();
    window.addEventListener('beforeunload', this.onSaida);
  }

  private onSaida = () => {
    const segundos = Math.round((Date.now() - this.inicioVisita) / 1000);
    navigator.sendBeacon(
      `${this.api}/evento`,
      JSON.stringify({ sessionId: this.sessionId, tipo: 'saida', dados: { segundos } }),
    );
  };

  private registrarScrollDepth() {
    this.scrollListener = () => {
      if (!this.cookiesAtivos) return;
      const el = document.documentElement;
      const percent = Math.round((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
      for (const marco of SCROLL_MARCOS) {
        if (percent >= marco && !this.scrollMarcosEnviados.has(marco)) {
          this.scrollMarcosEnviados.add(marco);
          this.enviarEvento('scroll', { percent: marco });
        }
      }
    };
    window.addEventListener('scroll', this.scrollListener, { passive: true });
  }

  private registrarSecoesVistas() {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const secao = entry.target.id;
            if (secao && !this.secoesVistas.has(secao)) {
              this.secoesVistas.add(secao);
              this.enviarEvento('secao_vista', { secao });
            }
          }
        }
      },
      { threshold: 0.3 },
    );

    for (const id of SECOES_LP) {
      const el = document.getElementById(id);
      if (el) this.intersectionObserver.observe(el);
    }
  }

  private enviarEvento(tipo: string, dados?: Record<string, any>) {
    this.http.post(`${this.api}/evento`, { sessionId: this.sessionId, tipo, dados }).subscribe();
  }

  private obterOuCriarSessionId(): string {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  }

  private coletarInfoDispositivo() {
    const ua = navigator.userAgent;
    const w = window.screen.width;

    let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
    if (/Mobi|Android/i.test(ua)) deviceType = w >= 768 ? 'tablet' : 'mobile';

    let browser = 'Outro';
    if (/Edg/i.test(ua)) browser = 'Edge';
    else if (/Chrome/i.test(ua)) browser = 'Chrome';
    else if (/Firefox/i.test(ua)) browser = 'Firefox';
    else if (/Safari/i.test(ua)) browser = 'Safari';

    let os = 'Outro';
    if (/Windows/i.test(ua)) os = 'Windows';
    else if (/Mac OS/i.test(ua)) os = 'macOS';
    else if (/Android/i.test(ua)) os = 'Android';
    else if (/iOS|iPhone|iPad/i.test(ua)) os = 'iOS';
    else if (/Linux/i.test(ua)) os = 'Linux';

    const params = new URLSearchParams(window.location.search);

    return {
      utmSource: params.get('utm_source') ?? undefined,
      utmMedium: params.get('utm_medium') ?? undefined,
      utmCampaign: params.get('utm_campaign') ?? undefined,
      utmTerm: params.get('utm_term') ?? undefined,
      utmContent: params.get('utm_content') ?? undefined,
      referrer: document.referrer || undefined,
      landingUrl: window.location.href,
      deviceType,
      browser,
      os,
      screenWidth: w,
    };
  }

  ngOnDestroy() {
    if (this.scrollListener) window.removeEventListener('scroll', this.scrollListener);
    if (this.intersectionObserver) this.intersectionObserver.disconnect();
    window.removeEventListener('beforeunload', this.onSaida);
  }
}

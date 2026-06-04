import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { PoNotificationService, PoTableColumn } from '@po-ui/ng-components';

interface Progresso {
  fase: string;
  arquivoAtual: string;
  feitos: number;
  total: number;
  percentual: number;
}

interface EtlStatus {
  rodando: boolean;
  progresso: Progresso | null;
  historico: any[];
}

interface ArquivoRfb {
  nome: string;
  grupo: string;
  tabela: string;
  status: 'nao_baixado' | 'baixado' | 'extraido';
  zip: { existe: boolean; tamanhoMb: number | null; modificadoEm: string | null };
  csv: { existe: boolean; tamanhoMb: number | null; modificadoEm: string | null };
}

@Component({
  selector: 'app-portal-etl',
  standalone: false,
  templateUrl: './etl.component.html',
  styleUrls: ['./etl.component.scss'],
})
export class PortalEtlComponent implements OnInit, OnDestroy {
  status: EtlStatus = { rodando: false, progresso: null, historico: [] };
  arquivos: ArquivoRfb[] = [];
  carregando = true;
  private intervalo: any;

  // ─── Colunas de tabelas ───────────────────────────────────────────────────

  colunasArquivos: PoTableColumn[] = [
    { property: 'nome',    label: 'Arquivo',  width: '25%' },
    { property: 'grupo',   label: 'Grupo',    width: '10%' },
    { property: 'tabela',  label: 'Tabela BD', width: '20%' },
    { property: 'status',  label: 'Status',   type: 'label', width: '15%',
      labels: [
        { value: 'nao_baixado', label: 'Não baixado', color: 'color-07' },
        { value: 'baixado',     label: 'Baixado',     color: 'color-08' },
        { value: 'extraido',    label: 'Extraído',    color: 'color-10' },
      ],
    },
    { property: 'zip.tamanhoMb',  label: 'ZIP (MB)',  width: '10%' },
    { property: 'csv.tamanhoMb',  label: 'CSV (MB)',  width: '10%' },
  ];

  colunasHistorico: PoTableColumn[] = [
    { property: 'competencia',  label: 'Competência', width: '12%' },
    { property: 'fase',         label: 'Fase',        width: '12%' },
    { property: 'status',       label: 'Status',      type: 'label', width: '12%',
      labels: [
        { value: 'iniciado',   label: 'Iniciado',   color: 'color-08' },
        { value: 'download',   label: 'Download',   color: 'color-08' },
        { value: 'extracao',   label: 'Extração',   color: 'color-08' },
        { value: 'carga',      label: 'Carga',      color: 'color-08' },
        { value: 'concluido',  label: 'Concluído',  color: 'color-10' },
        { value: 'erro',       label: 'Erro',       color: 'color-07' },
      ],
    },
    { property: 'totalEmpresas',        label: 'Empresas',     type: 'number', width: '13%' },
    { property: 'totalEstabelecimentos', label: 'Estab.',      type: 'number', width: '13%' },
    { property: 'totalSocios',          label: 'Sócios',       type: 'number', width: '13%' },
    { property: 'iniciadoEm',           label: 'Início',       type: 'dateTime', width: '13%' },
    { property: 'concluidoEm',          label: 'Conclusão',    type: 'dateTime', width: '13%' },
  ];

  constructor(
    private http: HttpClient,
    private notif: PoNotificationService,
  ) {}

  ngOnInit() {
    this.carregar();
  }

  ngOnDestroy() {
    this.pararPolling();
  }

  // ─── Ações ─────────────────────────────────────────────────────────────────

  executar(fase: 'completo' | 'download' | 'extracao' | 'carga') {
    const labels: Record<string, string> = {
      completo:  'ETL Completo iniciado.',
      download:  'Download dos arquivos iniciado.',
      extracao:  'Extração dos ZIPs iniciada.',
      carga:     'Carga no banco iniciada.',
    };
    this.http.post<{ mensagem: string }>(`${environment.apiUrl}/etl/executar`, { fase })
      .subscribe({
        next: (res) => {
          this.notif.information(labels[fase]);
          this.iniciarPolling();
        },
        error: (err) => {
          this.notif.error(err.error?.message ?? 'Erro ao iniciar ETL.');
        },
      });
  }

  // ─── Dados ─────────────────────────────────────────────────────────────────

  carregar() {
    this.carregando = true;
    this.http.get<EtlStatus>(`${environment.apiUrl}/etl/status`).subscribe({
      next: (s) => {
        this.status = s;
        this.carregando = false;
        if (s.rodando) this.iniciarPolling();
      },
      error: () => { this.carregando = false; },
    });

    this.http.get<ArquivoRfb[]>(`${environment.apiUrl}/etl/arquivos`).subscribe({
      next: (a) => { this.arquivos = a; },
    });
  }

  private iniciarPolling() {
    if (this.intervalo) return;
    this.intervalo = setInterval(() => {
      this.http.get<EtlStatus>(`${environment.apiUrl}/etl/status`).subscribe((s) => {
        this.status = s;
        if (!s.rodando) {
          this.pararPolling();
          this.notif.success('ETL concluído!');
          // Recarrega lista de arquivos após conclusão
          this.http.get<ArquivoRfb[]>(`${environment.apiUrl}/etl/arquivos`).subscribe((a) => { this.arquivos = a; });
        }
      });
    }, 3000);
  }

  private pararPolling() {
    if (this.intervalo) { clearInterval(this.intervalo); this.intervalo = null; }
  }

  get percentual(): number {
    return this.status.progresso?.percentual ?? 0;
  }

  get faseLabel(): string {
    if (!this.status.rodando) return '';
    const p = this.status.progresso;
    if (!p?.fase) return 'Iniciando...';
    return `${p.fase} — ${p.arquivoAtual}  (${p.feitos}/${p.total})`;
  }

  arquivosBaixados(): number {
    return this.arquivos.filter(a => a.status !== 'nao_baixado').length;
  }

  arquivosExtraidos(): number {
    return this.arquivos.filter(a => a.status === 'extraido').length;
  }
}

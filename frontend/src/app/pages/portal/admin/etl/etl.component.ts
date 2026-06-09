import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PoModalAction, PoModalComponent, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { environment } from '../../../../../environments/environment';
import { NotifService } from '../../../../services/notif.service';

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
  page: number;
  pageSize: number;
  total: number;
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
  @ViewChild('modalErro') modalErro!: PoModalComponent;

  status: EtlStatus = { rodando: false, progresso: null, historico: [], page: 1, pageSize: 10, total: 0 };
  arquivos: ArquivoRfb[] = [];
  historicoItens: any[] = [];
  carregando = true;
  carregandoHistorico = false;
  carregandoMaisHistorico = false;
  limpandoLogs = false;
  erroDetalhe = '';
  competencia = this.competenciaAtualPadrao();
  historicoPage = 1;
  readonly historicoPageSize = 10;
  private intervalo: any;

  colunasArquivos: PoTableColumn[] = [
    { property: 'nome', label: 'Arquivo', width: '25%' },
    { property: 'grupo', label: 'Grupo', width: '10%' },
    { property: 'tabela', label: 'Tabela BD', width: '20%' },
    {
      property: 'status', label: 'Status', type: 'label', width: '15%',
      labels: [
        { value: 'nao_baixado', label: 'Nao baixado', color: 'color-07' },
        { value: 'baixado', label: 'Baixado', color: 'color-08' },
        { value: 'extraido', label: 'Extraido', color: 'color-10' },
      ],
    },
    { property: 'zip.tamanhoMb', label: 'ZIP (MB)', width: '10%' },
    { property: 'csv.tamanhoMb', label: 'CSV (MB)', width: '10%' },
  ];

  colunasHistorico: PoTableColumn[] = [
    { property: 'competencia', label: 'Competencia', width: '12%' },
    { property: 'fase', label: 'Fase', width: '12%' },
    {
      property: 'status', label: 'Status', type: 'label', width: '12%',
      labels: [
        { value: 'iniciado', label: 'Iniciado', color: 'color-08' },
        { value: 'download', label: 'Download', color: 'color-08' },
        { value: 'extracao', label: 'Extracao', color: 'color-08' },
        { value: 'carga', label: 'Carga', color: 'color-08' },
        { value: 'concluido', label: 'Concluido', color: 'color-10' },
        { value: 'erro', label: 'Erro', color: 'color-07' },
      ],
    },
    { property: 'totalEmpresas', label: 'Empresas', type: 'number', width: '11%' },
    { property: 'totalEstabelecimentos', label: 'Estab.', type: 'number', width: '11%' },
    { property: 'totalSocios', label: 'Socios', type: 'number', width: '11%' },
    { property: 'iniciadoEm', label: 'Inicio', type: 'dateTime', width: '12%' },
    { property: 'concluidoEm', label: 'Conclusao', type: 'dateTime', width: '12%' },
  ];

  acoesHistorico: PoTableAction[] = [
    {
      label: 'Ver erro',
      icon: 'an an-warning-circle',
      action: (row: any) => this.verErro(row),
      visible: (row: any) => row.status === 'erro' && !!row.detalhe,
    },
  ];

  acaoFecharErro: PoModalAction = {
    label: 'Fechar',
    action: () => this.modalErro.close(),
  };

  constructor(
    private http: HttpClient,
    private notif: NotifService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.carregar();
  }

  ngOnDestroy() {
    this.pararPolling();
  }

  competenciaAtualPadrao(): string {
    const dataBase = new Date();
    const ano = dataBase.getFullYear();
    const mes = dataBase.getMonth();

    if (mes === 0) {
      return `${ano - 1}-12`;
    }

    return `${ano}-${String(mes).padStart(2, '0')}`;
  }

  executar(fase: 'completo' | 'download' | 'extracao' | 'carga') {
    const labels: Record<string, string> = {
      completo: 'ETL completo iniciado.',
      download: 'Download dos arquivos iniciado.',
      extracao: 'Extracao dos ZIPs iniciada.',
      carga: 'Carga no banco iniciada.',
    };

    const payload: { fase: string; competencia?: string } = { fase };
    if (/^\d{4}-\d{2}$/.test(this.competencia.trim())) {
      payload.competencia = this.competencia.trim();
    }

    this.http.post<{ mensagem: string }>(`${environment.apiUrl}/etl/executar`, payload)
      .subscribe({
        next: () => {
          this.notif.information(labels[fase]);
          this.iniciarPolling();
        },
        error: (err) => {
          this.notif.error(err.error?.message ?? 'Erro ao iniciar ETL.');
        },
      });
  }

  carregar() {
    this.carregando = true;
    this.carregarStatus(true, false, false);
    this.carregarArquivos();
  }

  limparLogs() {
    if (this.status.rodando || this.limpandoLogs) return;
    if (!confirm('Limpar todo o historico de execucoes do ETL?')) return;

    this.limpandoLogs = true;
    this.http.delete<{ removidos: number }>(`${environment.apiUrl}/etl/logs`).subscribe({
      next: (res) => {
        this.notif.success(`Logs removidos: ${res.removidos}`);
        this.historicoPage = 1;
        this.historicoItens = [];
        this.carregarStatus(true, false, false);
      },
      error: (err) => {
        this.limpandoLogs = false;
        this.notif.error(err.error?.message ?? 'Erro ao limpar logs.');
      },
    });
  }

  carregarMaisHistorico() {
    if (this.showMoreHistoricoDisabled || this.carregandoMaisHistorico) return;
    this.historicoPage += 1;
    this.carregarStatus(false, true, false);
  }

  verErro(row: any) {
    this.erroDetalhe = row.detalhe ?? 'Sem detalhes disponiveis.';
    this.modalErro.open();
  }

  get percentual(): number {
    return this.status.progresso?.percentual ?? 0;
  }

  get faseLabel(): string {
    if (!this.status.rodando) return '';
    const p = this.status.progresso;
    if (!p?.fase) return 'Iniciando...';
    return `${p.fase} - ${p.arquivoAtual} (${p.feitos}/${p.total})`;
  }

  get showMoreHistoricoDisabled(): boolean {
    return this.historicoItens.length >= this.status.total;
  }

  arquivosBaixados(): number {
    return this.arquivos.filter((a) => a.status !== 'nao_baixado').length;
  }

  arquivosExtraidos(): number {
    return this.arquivos.filter((a) => a.status === 'extraido').length;
  }

  private iniciarPolling() {
    if (this.intervalo) return;
    this.intervalo = setInterval(() => {
      this.carregarStatus(this.historicoItens.length === 0, false, true);
    }, 3000);
  }

  private pararPolling() {
    if (this.intervalo) {
      clearInterval(this.intervalo);
      this.intervalo = null;
    }
  }

  private carregarStatus(resetHistorico: boolean, appendHistorico: boolean, origemPolling: boolean) {
    const page = appendHistorico ? this.historicoPage : 1;

    if (appendHistorico) {
      this.carregandoMaisHistorico = true;
    } else {
      this.carregandoHistorico = true;
    }

    this.http.get<EtlStatus>(`${environment.apiUrl}/etl/status?page=${page}&pageSize=${this.historicoPageSize}`).subscribe({
      next: (s) => {
        const estavaRodando = this.status.rodando;
        this.status = s;

        if (resetHistorico) {
          this.historicoPage = 1;
          this.historicoItens = s.historico;
        } else if (appendHistorico) {
          this.historicoItens = [...this.historicoItens, ...s.historico];
        }

        this.carregando = false;
        this.carregandoHistorico = false;
        this.carregandoMaisHistorico = false;
        this.limpandoLogs = false;
        this.cdr.detectChanges();

        if (s.rodando) {
          this.iniciarPolling();
          return;
        }

        if (origemPolling && estavaRodando) {
          this.pararPolling();
          this.notif.success('ETL concluido.');
          this.historicoPage = 1;
          this.historicoItens = s.historico;
          this.carregarArquivos();
        }
      },
      error: () => {
        this.carregando = false;
        this.carregandoHistorico = false;
        this.carregandoMaisHistorico = false;
        this.limpandoLogs = false;
        this.cdr.detectChanges();
      },
    });
  }

  private carregarArquivos() {
    this.http.get<ArquivoRfb[]>(`${environment.apiUrl}/etl/arquivos`).subscribe({
      next: (a) => { this.arquivos = a; },
    });
  }
}

import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PoModalAction, PoModalComponent, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { environment } from '../../../../../environments/environment';
import { NotifService } from '../../../../services/notif.service';
import { forkJoin } from 'rxjs';

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

interface EtlArquivoLogItem {
  id: string;
  etlLogId: string | null;
  arquivo: string;
  operacao: 'download' | 'extracao' | 'carga';
  status: 'iniciando' | 'ja_existe' | 'concluido' | 'erro';
  tamanhoMb: number | null;
  duracaoMs: number | null;
  detalhe: string | null;
  competencia: string | null;
  iniciadoEm: string;
  concluidoEm: string | null;
}

interface EtlResumo {
  tarGzExiste: boolean;
  zipsEmExtraidos: number;
  csvsExtraidos: number;
  zipsIncrementais: number;
  bancoPrimeiraUso: boolean;
}

interface ArquivoRfb {
  nome: string;
  grupo: string;
  tabela: string;
  status: 'nao_baixado' | 'baixado' | 'extraido';
  zip: { existe: boolean; tamanhoMb: number | null; modificadoEm: string | null };
  csv: { existe: boolean; tamanhoMb: number | null; modificadoEm: string | null };
  zipTamanho?: string;
  csvTamanho?: string;
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
  selecionados: ArquivoRfb[] = [];
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
  private intervaloExtracao: any;
  extraindo = false;

  resumo: EtlResumo = { tarGzExiste: false, zipsEmExtraidos: 0, csvsExtraidos: 0, zipsIncrementais: 0, bancoPrimeiraUso: true };

  logArquivosItens: EtlArquivoLogItem[] = [];
  logArquivosTotal = 0;
  logArquivosPage = 1;
  readonly logArquivosPageSize = 30;
  carregandoLogArquivos = false;
  carregandoMaisLogArquivos = false;
  limpandoLogArquivos = false;

  colunasLogArquivos: PoTableColumn[] = [
    { property: 'arquivo',    label: 'Arquivo',    width: '22%' },
    {
      property: 'operacao', label: 'Operação', type: 'label', width: '11%',
      labels: [
        { value: 'download', label: 'Download', color: 'color-01' },
        { value: 'extracao', label: 'Extração', color: 'color-08' },
        { value: 'carga',    label: 'Carga',    color: 'color-10' },
      ],
    },
    {
      property: 'status', label: 'Status', type: 'label', width: '12%',
      labels: [
        { value: 'iniciando', label: 'Iniciando', color: 'color-08' },
        { value: 'ja_existe', label: 'Já existe', color: 'color-06' },
        { value: 'concluido', label: 'Concluído', color: 'color-10' },
        { value: 'erro',      label: 'Erro',      color: 'color-07' },
      ],
    },
    { property: 'competencia',  label: 'Competência', width: '10%' },
    { property: 'tamanhoFmt',   label: 'Tamanho',     width: '10%' },
    { property: 'duracaoFmt',   label: 'Duração',     width: '10%' },
    { property: 'detalhe',      label: 'Detalhe',     width: '15%' },
    { property: 'iniciadoEm',   label: 'Início',      type: 'dateTime', width: '10%' },
  ];

  acoesArquivos: PoTableAction[] = [
    {
      label: 'Baixar',
      icon: 'an an-download-simple',
      action: (row: ArquivoRfb) => this.baixarArquivoLinha(row),
    },
    {
      label: 'Extrair',
      icon: 'an an-arrows-down-up',
      action: (row: ArquivoRfb) => this.extrairArquivoLinha(row),
      visible: (row: ArquivoRfb) => row.status === 'baixado',
    },
    {
      label: 'Processar',
      icon: 'an an-database',
      action: (row: ArquivoRfb) => this.processarArquivoLinha(row),
      visible: (row: ArquivoRfb) => row.status === 'extraido',
    },
    {
      label: 'Apagar',
      icon: 'an an-trash',
      type: 'danger',
      action: (row: ArquivoRfb) => this.apagarZipArquivoLinha(row),
    },
  ];

  colunasArquivos: PoTableColumn[] = [
    { property: 'competencia', label: 'Competência', width: '10%' },
    { property: 'nome', label: 'Arquivo', width: '22%' },
    {
      property: 'grupo', label: 'Grupo', type: 'label', width: '12%',
      labels: [
        { value: 'base',     label: 'Base',     color: 'color-09' },
        { value: 'tabelas',  label: 'Tabelas',  color: 'color-08' },
        { value: 'empresas', label: 'Empresas', color: 'color-01' },
      ],
    },
    { property: 'tabela', label: 'Tabela BD', width: '20%' },
    {
      property: 'status', label: 'Status', type: 'label', width: '15%',
      labels: [
        { value: 'nao_baixado', label: 'Nao baixado', color: 'color-07' },
        { value: 'baixado',     label: 'Baixado',     color: 'color-08' },
        { value: 'extraido',    label: 'Extraido',    color: 'color-10' },
      ],
    },
    { property: 'zipTamanho', label: 'ZIP', width: '12%' },
    { property: 'csvTamanho', label: 'CSV', width: '13%' },
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
    this.pararPollingExtracao();
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

  executar(fase: 'completo' | 'download' | 'download-base' | 'download-tabelas' | 'download-empresas' | 'extracao' | 'extracao-base' | 'extracao-incrementais' | 'carga' | 'carga-base' | 'carga-incremental') {
    const labels: Record<string, string> = {
      completo: 'ETL completo iniciado.',
      download: 'Download de tabelas e empresas iniciado.',
      'download-base': 'Download do cnpj.tar.gz (base) iniciado.',
      'download-tabelas': 'Download das tabelas de referencia iniciado.',
      'download-empresas': 'Download dos dados de empresas iniciado.',
      extracao: 'Extracao dos ZIPs iniciada.',
      'extracao-base': 'Extraindo ZIPs da base (extraidos/) → CSVs.',
      'extracao-incrementais': 'Extraindo ZIPs incrementais (downloads/) → CSVs.',
      carga: 'Carga no banco iniciada.',
      'carga-base': 'Carga base no banco iniciada (truncate + insert).',
      'carga-incremental': 'Carga incremental no banco iniciada (upsert).',
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
          setTimeout(() => { this.carregarResumo(); this.carregarArquivos(); }, 2000);
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
    this.carregarLogArquivos();
    this.carregarResumo();
  }

  carregarResumo() {
    this.http.get<EtlResumo>(`${environment.apiUrl}/etl/resumo`).subscribe({
      next: (r) => { this.resumo = r; this.cdr.detectChanges(); },
    });
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

  private iniciarPollingExtracao(nomeArquivo: string) {
    this.extraindo = true;
    this.cdr.detectChanges();
    let tentativas = 0;
    const MAX = 60;

    this.intervaloExtracao = setInterval(() => {
      tentativas++;
      this.carregarArquivos();
      this.carregarLogArquivos();

      const arq = this.arquivos.find((a) => a.nome === nomeArquivo);
      if ((arq && arq.status === 'extraido') || tentativas >= MAX) {
        this.pararPollingExtracao();
      }
    }, 2000);
  }

  private pararPollingExtracao() {
    if (this.intervaloExtracao) {
      clearInterval(this.intervaloExtracao);
      this.intervaloExtracao = null;
    }
    this.extraindo = false;
    this.cdr.detectChanges();
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
          if (origemPolling) {
            this.carregarLogArquivos();
          }
          this.iniciarPolling();
          return;
        }

        if (origemPolling && estavaRodando) {
          this.pararPolling();
          this.notif.success('ETL concluido.');
          this.historicoPage = 1;
          this.historicoItens = s.historico;
          this.carregarArquivos();
          this.carregarLogArquivos();
          this.carregarResumo();
        }

        if (origemPolling) {
          this.carregarResumo();
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

  carregarLogArquivos(reset = true) {
    const page = reset ? 1 : this.logArquivosPage + 1;
    if (reset) {
      this.carregandoLogArquivos = true;
    } else {
      this.carregandoMaisLogArquivos = true;
    }

    this.http.get<{ logs: EtlArquivoLogItem[]; total: number; page: number }>(
      `${environment.apiUrl}/etl/log-arquivos?page=${page}&pageSize=${this.logArquivosPageSize}`,
    ).subscribe({
      next: (res) => {
        const formatados = res.logs.map((l) => ({
          ...l,
          tamanhoFmt: this.formatarTamanho(l.tamanhoMb),
          duracaoFmt: this.formatarDuracao(l.duracaoMs),
        }));
        if (reset) {
          this.logArquivosItens = formatados;
          this.logArquivosPage = 1;
        } else {
          this.logArquivosItens = [...this.logArquivosItens, ...formatados];
          this.logArquivosPage = page;
        }
        this.logArquivosTotal = res.total;
        this.carregandoLogArquivos = false;
        this.carregandoMaisLogArquivos = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.carregandoLogArquivos = false;
        this.carregandoMaisLogArquivos = false;
        this.cdr.detectChanges();
      },
    });
  }

  carregarMaisLogArquivos() {
    if (this.logArquivosItens.length >= this.logArquivosTotal || this.carregandoMaisLogArquivos) return;
    this.carregarLogArquivos(false);
  }

  limparLogArquivos() {
    if (this.limpandoLogArquivos) return;
    if (!confirm('Limpar todo o log de arquivos?')) return;
    this.limpandoLogArquivos = true;
    this.http.delete<{ removidos: number }>(`${environment.apiUrl}/etl/log-arquivos`).subscribe({
      next: (res) => {
        this.notif.success(`${res.removidos} registros removidos.`);
        this.logArquivosItens = [];
        this.logArquivosTotal = 0;
        this.limpandoLogArquivos = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.limpandoLogArquivos = false;
        this.notif.error(err.error?.message ?? 'Erro ao limpar log.');
        this.cdr.detectChanges();
      },
    });
  }

  get showMoreLogArquivosDisabled(): boolean {
    return this.logArquivosItens.length >= this.logArquivosTotal;
  }

  onSelecionado(row: ArquivoRfb) {
    if (!this.selecionados.find((s) => s.nome === row.nome)) {
      this.selecionados = [...this.selecionados, row];
    }
  }

  onDeselecionado(row: ArquivoRfb) {
    this.selecionados = this.selecionados.filter((s) => s.nome !== row.nome);
  }

  onTodosSelecionados() {
    this.selecionados = [...this.arquivos];
  }

  onTodosDeselecionados() {
    this.selecionados = [];
  }

  extrairArquivoLinha(row: ArquivoRfb) {
    const isTarGz = row.nome.endsWith('.tar.gz');
    this.extraindo = true;
    this.cdr.detectChanges();

    this.http.post<{ mensagem: string }>(`${environment.apiUrl}/etl/extrair-arquivo`, { nome: row.nome }).subscribe({
      next: (res) => {
        this.notif.information(res.mensagem);
        if (isTarGz) {
          this.carregarArquivos();
          this.carregarLogArquivos();
          this.extraindo = false;
          this.cdr.detectChanges();
        } else {
          this.iniciarPollingExtracao(row.nome);
        }
      },
      error: (err) => {
        this.notif.error(err.error?.message ?? 'Erro ao extrair arquivo.');
        this.extraindo = false;
        this.cdr.detectChanges();
      },
    });
  }

  processarArquivoLinha(row: ArquivoRfb) {
    this.http.post<{ mensagem: string }>(`${environment.apiUrl}/etl/processar-arquivo`, { nome: row.nome }).subscribe({
      next: (res) => {
        this.notif.information(res.mensagem);
        setTimeout(() => { this.carregarArquivos(); this.carregarLogArquivos(); }, 4000);
      },
      error: (err) => this.notif.error(err.error?.message ?? 'Erro ao processar arquivo.'),
    });
  }

  baixarArquivoLinha(row: ArquivoRfb) {
    const payload = { nome: row.nome, competencia: this.competencia.trim() };
    this.http.post<{ mensagem: string }>(`${environment.apiUrl}/etl/baixar-arquivo`, payload).subscribe({
      next: (res) => this.notif.information(res.mensagem),
      error: (err) => this.notif.error(err.error?.message ?? 'Erro ao iniciar download.'),
    });
  }

  apagarTodosExtraidos() {
    const total = this.arquivos.filter((a) => a.status === 'extraido').length;
    if (!total) { this.notif.information('Nenhum arquivo extraído para apagar.'); return; }
    if (!confirm(`Apagar todos os ${total} CSV(s) extraídos?\nOs arquivos ZIP serão mantidos.`)) return;
    this.http.delete<{ apagados: number }>(`${environment.apiUrl}/etl/arquivos-csv`).subscribe({
      next: (res) => {
        this.notif.success(`${res.apagados} CSV(s) apagado(s).`);
        this.carregarArquivos();
        this.carregarLogArquivos();
      },
      error: (err) => this.notif.error(err.error?.message ?? 'Erro ao apagar CSVs.'),
    });
  }

  moverParaCompetencia() {
    const comp = this.competencia.trim();
    if (!/^\d{4}-\d{2}$/.test(comp)) { this.notif.error('Informe uma competência válida (AAAA-MM) antes de mover.'); return; }
    if (!confirm(`Mover todos os ZIPs soltos de downloads/ para a pasta ${comp}?`)) return;
    this.http.post<{ movidos: string[] }>(`${environment.apiUrl}/etl/mover-para-competencia`, { competencia: comp }).subscribe({
      next: (res) => {
        this.notif.success(`${res.movidos.length} arquivo(s) movido(s) para ${comp}/.`);
        this.carregarArquivos();
        this.carregarResumo();
        this.cdr.detectChanges();
      },
      error: (err) => this.notif.error(err.error?.message ?? 'Erro ao mover arquivos.'),
    });
  }

  limparExtraidos() {
    if (this.status.rodando) return;
    if (!confirm('Limpar TUDO na pasta extraidos/?\nIsso remove CSVs, ZIPs e qualquer arquivo que esteja lá.')) return;
    this.http.delete<{ apagados: number }>(`${environment.apiUrl}/etl/extraidos`).subscribe({
      next: (res) => {
        this.notif.success(`${res.apagados} arquivo(s) removido(s) de extraidos/.`);
        this.carregarArquivos();
        this.cdr.detectChanges();
      },
      error: (err) => this.notif.error(err.error?.message ?? 'Erro ao limpar extraidos/.'),
    });
  }

  apagarZipArquivoLinha(row: ArquivoRfb) {
    if (!confirm(`Apagar o arquivo ${row.nome}?\nO CSV extraído será mantido.`)) return;
    this.http.delete(`${environment.apiUrl}/etl/arquivo-zip?nome=${encodeURIComponent(row.nome)}`).subscribe({
      next: () => { this.notif.success(`${row.nome} apagado.`); this.carregarArquivos(); },
      error: (err) => this.notif.error(err.error?.message ?? 'Erro ao apagar arquivo.'),
    });
  }

  apagarCsvArquivoLinha(row: ArquivoRfb) {
    if (!confirm(`Apagar o CSV de ${row.nome}?\nO arquivo ZIP será mantido.`)) return;
    this.http.delete(`${environment.apiUrl}/etl/arquivo-csv?nome=${encodeURIComponent(row.nome)}`).subscribe({
      next: () => { this.notif.success(`CSV de ${row.nome} apagado.`); this.carregarArquivos(); },
      error: (err) => this.notif.error(err.error?.message ?? 'Erro ao apagar CSV.'),
    });
  }

  apagarArquivoLinha(row: ArquivoRfb) {
    if (!confirm(`Apagar ${row.nome}?\nEsta ação remove o ZIP e o CSV do disco.`)) return;
    this.http.delete(`${environment.apiUrl}/etl/arquivo?nome=${encodeURIComponent(row.nome)}`).subscribe({
      next: () => { this.notif.success(`${row.nome} apagado.`); this.carregarArquivos(); },
      error: (err) => this.notif.error(err.error?.message ?? 'Erro ao apagar arquivo.'),
    });
  }

  baixarLote() {
    const arqs = [...this.selecionados];
    if (!arqs.length) return;
    const competencia = this.competencia.trim();
    for (const arq of arqs) {
      this.http.post<{ mensagem: string }>(
        `${environment.apiUrl}/etl/baixar-arquivo`,
        { nome: arq.nome, competencia },
      ).subscribe({ error: (err) => this.notif.error(`${arq.nome}: ${err.error?.message ?? 'Erro'}`) });
    }
    this.notif.information(`Download iniciado para ${arqs.length} arquivo(s).`);
  }

  apagarLote() {
    const arqs = [...this.selecionados];
    if (!arqs.length) return;
    if (!confirm(`Apagar ${arqs.length} arquivo(s)?\nEsta ação remove o ZIP e o CSV de cada um.`)) return;

    const total = arqs.length;
    let concluidos = 0;
    let erros = 0;

    for (const arq of arqs) {
      this.http.delete(`${environment.apiUrl}/etl/arquivo?nome=${encodeURIComponent(arq.nome)}`).subscribe({
        next: () => {
          concluidos++;
          if (concluidos + erros === total) this.finalizarLoteApagar(concluidos, erros);
        },
        error: () => {
          erros++;
          if (concluidos + erros === total) this.finalizarLoteApagar(concluidos, erros);
        },
      });
    }
  }

  apagarArquivoLote() {
    const arqs = [...this.selecionados];
    if (!arqs.length) return;
    if (!confirm(`Apagar o arquivo (ZIP/tar.gz) de ${arqs.length} item(ns) selecionado(s)?`)) return;
    let concluidos = 0;
    let erros = 0;
    for (const arq of arqs) {
      this.http.delete(`${environment.apiUrl}/etl/arquivo-zip?nome=${encodeURIComponent(arq.nome)}`).subscribe({
        next: () => { concluidos++; if (concluidos + erros === arqs.length) this.finalizarLoteArquivo(concluidos, erros); },
        error: () => { erros++;     if (concluidos + erros === arqs.length) this.finalizarLoteArquivo(concluidos, erros); },
      });
    }
  }

  apagarCsvLote() {
    const arqs = [...this.selecionados];
    if (!arqs.length) return;
    if (!confirm(`Apagar o CSV de ${arqs.length} item(ns) selecionado(s)?`)) return;
    let concluidos = 0;
    let erros = 0;
    for (const arq of arqs) {
      this.http.delete(`${environment.apiUrl}/etl/arquivo-csv?nome=${encodeURIComponent(arq.nome)}`).subscribe({
        next: () => { concluidos++; if (concluidos + erros === arqs.length) this.finalizarLoteArquivo(concluidos, erros); },
        error: () => { erros++;     if (concluidos + erros === arqs.length) this.finalizarLoteArquivo(concluidos, erros); },
      });
    }
  }

  private finalizarLoteArquivo(concluidos: number, erros: number) {
    this.selecionados = [];
    if (erros) this.notif.error(`${concluidos} apagado(s), ${erros} com erro.`);
    else this.notif.success(`${concluidos} item(ns) apagado(s).`);
    this.carregarArquivos();
  }

  private finalizarLoteApagar(concluidos: number, erros: number) {
    this.selecionados = [];
    if (erros) {
      this.notif.error(`${concluidos} apagado(s), ${erros} com erro.`);
    } else {
      this.notif.success(`${concluidos} arquivo(s) apagado(s).`);
    }
    this.carregarArquivos();
  }

  private formatarTamanho(mb: number | null): string {
    if (mb === null || mb === undefined) return '-';
    if (mb < 1) return `${(mb * 1024).toFixed(0)} KB`;
    if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
    return `${mb.toFixed(1)} MB`;
  }

  private formatarDuracao(ms: number | null): string {
    if (ms === null || ms === undefined) return '-';
    if (ms < 1000) return `${ms}ms`;
    const s = Math.floor(ms / 1000);
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return rem ? `${m}m ${rem}s` : `${m}m`;
  }

  carregarArquivos() {
    this.http.get<ArquivoRfb[]>(`${environment.apiUrl}/etl/arquivos`).subscribe({
      next: (a) => {
        this.arquivos = a.map((arq) => ({
          ...arq,
          zipTamanho: this.formatarTamanho(arq.zip.tamanhoMb),
          csvTamanho: this.formatarTamanho(arq.csv.tamanhoMb),
        }));
        this.selecionados = [];
        this.cdr.detectChanges();
      },
    });
  }
}

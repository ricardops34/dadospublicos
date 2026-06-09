import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { PoTableAction, PoTableColumn, PoUploadFileRestrictions } from '@po-ui/ng-components';
import { AuthService } from '../../../../services/auth.service';
import { NotifService } from '../../../../services/notif.service';
import { UsuarioPortalService } from '../usuario.service';
import {
  Painel360GeoJsonCollection,
  Painel360Lote,
  Painel360Resultado,
  Painel360ResumoLote,
} from '../../painel-360/painel-360.types';

type Painel360LoteView = Painel360Lote & {
  arquivoExibicao: string;
  totalExibicao: number;
};

@Component({
  selector: 'app-painel-360',
  standalone: false,
  templateUrl: './painel-360.component.html',
  styleUrls: ['./painel-360.component.scss'],
})
export class Painel360Component implements OnInit {
  lotes: Painel360LoteView[] = [];
  resultados: Painel360Resultado[] = [];
  geoJson: Painel360GeoJsonCollection | null = null;
  loteSelecionado: Painel360LoteView | null = null;
  carregandoLotes = true;
  carregandoDetalhes = false;
  totalResultados = 0;

  readonly uploadUrl: string;
  readonly uploadHeaders: { [name: string]: string | string[] } = {};
  readonly uploadRestricoes: PoUploadFileRestrictions = {
    allowedExtensions: ['.csv', '.xlsx', '.xls'],
    maxFiles: 1,
    maxFileSize: 25 * 1024 * 1024,
  };

  readonly colunasLotes: PoTableColumn[] = [
    { property: 'arquivoExibicao', label: 'Arquivo', width: '32%' },
    {
      property: 'status',
      label: 'Status',
      type: 'label',
      width: '14%',
      labels: [
        { value: 'pendente', label: 'Pendente', color: 'color-08' },
        { value: 'processando', label: 'Processando', color: 'color-07' },
        { value: 'concluido', label: 'Concluido', color: 'color-10' },
        { value: 'erro', label: 'Erro', color: 'color-05' },
      ],
    },
    { property: 'criadoEm', label: 'Criado em', type: 'dateTime', width: '18%' },
    { property: 'concluidoEm', label: 'Concluido em', type: 'dateTime', width: '18%' },
    { property: 'totalExibicao', label: 'Registros', type: 'number', width: '12%' },
  ];

  readonly colunasResultados: PoTableColumn[] = [
    { property: 'cnpj', label: 'CNPJ', width: '16%' },
    { property: 'razaoSocial', label: 'Razao social', width: '30%' },
    { property: 'cidade', label: 'Cidade', width: '18%' },
    { property: 'uf', label: 'UF', width: '8%' },
    { property: 'status', label: 'Status', width: '14%' },
    { property: 'mensagem', label: 'Mensagem', width: '14%' },
  ];

  readonly acoesLotes: PoTableAction[] = [
    { label: 'Abrir', icon: 'an an-eye', action: (lote: Painel360LoteView) => this.selecionarLote(lote) },
    { label: 'Download', icon: 'an an-download-simple', action: (lote: Painel360LoteView) => this.baixarLote(lote) },
  ];

  constructor(
    private clienteService: UsuarioPortalService,
    private auth: AuthService,
    private notif: NotifService,
  ) {
    this.uploadUrl = this.clienteService.uploadPainel360Url();
    const token = this.auth.getToken();
    if (token) {
      this.uploadHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  ngOnInit() {
    this.carregarLotes();
  }

  carregarLotes(loteIdSelecionado?: string) {
    this.carregandoLotes = true;
    this.clienteService.listarPainel360Lotes().subscribe({
      next: (lotes) => {
        this.lotes = lotes.map((lote) => this.normalizarLote(lote));
        this.carregandoLotes = false;

        const lote =
          this.lotes.find((item) => item.id === loteIdSelecionado) ??
          this.lotes.find((item) => item.id === this.loteSelecionado?.id) ??
          this.lotes[0];

        if (lote) {
          this.selecionarLote(lote);
        } else {
          this.limparDetalhes();
        }
      },
      error: () => {
        this.carregandoLotes = false;
        this.notif.error('Erro ao carregar seus lotes do Painel 360.');
      },
    });
  }

  selecionarLote(lote: Painel360LoteView) {
    this.loteSelecionado = lote;
    this.carregandoDetalhes = true;

    forkJoin({
      resultados: this.clienteService.listarPainel360Resultados(lote.id, 1, 200),
      geoJson: this.clienteService.obterPainel360GeoJson(lote.id),
    }).subscribe({
      next: ({ resultados, geoJson }) => {
        this.resultados = resultados.items.map((item) => this.normalizarResultado(item));
        this.totalResultados = resultados.total;
        this.geoJson = geoJson;
        this.carregandoDetalhes = false;
      },
      error: () => {
        this.resultados = [];
        this.totalResultados = 0;
        this.geoJson = null;
        this.carregandoDetalhes = false;
        this.notif.error('Erro ao carregar o lote selecionado.');
      },
    });
  }

  onUploadSuccess(event: any) {
    const loteId = event?.body?.lote?.id ?? event?.body?.id ?? event?.lote?.id ?? event?.id;
    this.notif.success('Arquivo enviado com sucesso.');
    this.carregarLotes(loteId);
  }

  onUploadError() {
    this.notif.error('Nao foi possivel enviar o arquivo do lote.');
  }

  baixarLote(lote: Painel360LoteView) {
    this.clienteService.baixarPainel360Resultado(lote.id).subscribe({
      next: (response) => {
        this.salvarArquivo(response, lote.arquivoExibicao);
      },
      error: () => {
        this.notif.error('Erro ao baixar o resultado do lote.');
      },
    });
  }

  get resumoSelecionado(): Painel360ResumoLote {
    return this.loteSelecionado?.resumo ?? {};
  }

  private limparDetalhes() {
    this.loteSelecionado = null;
    this.resultados = [];
    this.totalResultados = 0;
    this.geoJson = null;
  }

  private normalizarLote(lote: Painel360Lote): Painel360LoteView {
    return {
      ...lote,
      arquivoExibicao: lote.nomeArquivo ?? lote.arquivoOriginal ?? lote.nome ?? `Lote ${lote.id}`,
      totalExibicao: lote.resumo?.total ?? lote.totalLinhas ?? lote.totalResultados ?? 0,
    };
  }

  private normalizarResultado(item: Painel360Resultado): Painel360Resultado {
    return {
      ...item,
      razaoSocial: item.razaoSocial ?? (item as any).razao_social ?? item.nomeFantasia ?? '-',
      cidade: item.cidade ?? (item as any).municipio ?? '-',
      uf: item.uf ?? '-',
      status: item.status ?? ((item as any).erro ? 'erro' : 'sucesso'),
      mensagem: item.mensagem ?? '',
    };
  }

  private salvarArquivo(response: HttpResponse<Blob>, fallback: string) {
    const disposition = response.headers.get('content-disposition') ?? '';
    const match = disposition.match(/filename="?([^"]+)"?/i);
    const fileName = match?.[1] ?? `${fallback.replace(/\.[^.]+$/, '') || 'painel-360'}-resultado.csv`;
    const blobUrl = URL.createObjectURL(response.body as Blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(blobUrl);
  }
}

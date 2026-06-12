import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PoSelectOption, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { AdminService } from '../admin.service';
import { NotifService } from '../../../../services/notif.service';
import {
  Painel360BuscaResult,
  Painel360CnaeOption,
  Painel360Consulta,
  Painel360FiltrosBusca,
  Painel360GeoJsonCollection,
  Painel360MunicipioOption,
} from '../../painel-360/painel-360.types';

@Component({
  selector: 'app-painel-360-admin',
  standalone: false,
  templateUrl: './painel-360-admin.component.html',
  styleUrls: ['./painel-360-admin.component.scss'],
})
export class Painel360AdminComponent implements OnInit {
  filtros: Painel360FiltrosBusca = {};
  geoJson: Painel360GeoJsonCollection | null = null;
  consultas: Painel360Consulta[] = [];
  consultaId: string | null = null;
  totalResultados = 0;
  totalGeocod = 0;

  pesquisando = false;
  carregandoConsultas = false;
  carregandoCnaes = false;
  carregandoMunicipios = false;

  cnaeOptions: Painel360CnaeOption[] = [];
  municipioOptions: Painel360MunicipioOption[] = [];

  readonly ufOptions: PoSelectOption[] = [
    { value: 'AC', label: 'AC — Acre' },
    { value: 'AL', label: 'AL — Alagoas' },
    { value: 'AP', label: 'AP — Amapá' },
    { value: 'AM', label: 'AM — Amazonas' },
    { value: 'BA', label: 'BA — Bahia' },
    { value: 'CE', label: 'CE — Ceará' },
    { value: 'DF', label: 'DF — Distrito Federal' },
    { value: 'ES', label: 'ES — Espírito Santo' },
    { value: 'GO', label: 'GO — Goiás' },
    { value: 'MA', label: 'MA — Maranhão' },
    { value: 'MT', label: 'MT — Mato Grosso' },
    { value: 'MS', label: 'MS — Mato Grosso do Sul' },
    { value: 'MG', label: 'MG — Minas Gerais' },
    { value: 'PA', label: 'PA — Pará' },
    { value: 'PB', label: 'PB — Paraíba' },
    { value: 'PR', label: 'PR — Paraná' },
    { value: 'PE', label: 'PE — Pernambuco' },
    { value: 'PI', label: 'PI — Piauí' },
    { value: 'RJ', label: 'RJ — Rio de Janeiro' },
    { value: 'RN', label: 'RN — Rio Grande do Norte' },
    { value: 'RS', label: 'RS — Rio Grande do Sul' },
    { value: 'RO', label: 'RO — Rondônia' },
    { value: 'RR', label: 'RR — Roraima' },
    { value: 'SC', label: 'SC — Santa Catarina' },
    { value: 'SP', label: 'SP — São Paulo' },
    { value: 'SE', label: 'SE — Sergipe' },
    { value: 'TO', label: 'TO — Tocantins' },
  ];

  readonly colunasConsultas: PoTableColumn[] = [
    { property: 'criadoEm', label: 'Data', type: 'dateTime', width: '18%' },
    { property: 'ufLabel', label: 'Estado', width: '10%' },
    { property: 'municipioLabel', label: 'Município', width: '16%' },
    { property: 'bairroLabel', label: 'Bairro', width: '16%' },
    { property: 'cnaesLabel', label: 'CNAEs', width: '20%' },
    { property: 'totalResultados', label: 'Resultados', type: 'number', width: '10%' },
    { property: 'totalGeocod', label: 'No mapa', type: 'number', width: '10%' },
  ];

  readonly acoesConsultas: PoTableAction[] = [
    { label: 'Ver no mapa', icon: 'an an-map-pin-line', action: (c: any) => this.recarregarConsulta(c) },
    { label: 'Relatório', icon: 'an an-download-simple', action: (c: any) => this.baixarRelatorio(c.id) },
  ];

  constructor(
    private adminService: AdminService,
    private notif: NotifService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.carregarCnaes();
    this.carregarConsultas();
  }

  onUfChange(uf: string) {
    this.filtros.municipio = undefined;
    this.municipioOptions = [];
    if (!uf) return;
    this.carregandoMunicipios = true;
    this.adminService.lookupMunicipiosPainel360(uf).subscribe({
      next: (items) => {
        this.municipioOptions = items;
        this.carregandoMunicipios = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.carregandoMunicipios = false;
        this.cdr.detectChanges();
      },
    });
  }

  pesquisar() {
    const semFiltro = !this.filtros.uf && !this.filtros.municipio && !this.filtros.bairro && !this.filtros.cnaes?.length;
    if (semFiltro) {
      this.notif.warning('Informe ao menos um filtro para pesquisar.');
      return;
    }

    this.pesquisando = true;
    this.geoJson = null;
    this.adminService.buscarPainel360(this.filtros).subscribe({
      next: (result: Painel360BuscaResult) => {
        this.geoJson = result.geojson;
        this.consultaId = result.consultaId;
        this.totalResultados = result.total;
        this.totalGeocod = result.totalGeocod;
        this.pesquisando = false;
        this.carregarConsultas();
        this.cdr.detectChanges();
      },
      error: () => {
        this.pesquisando = false;
        this.cdr.detectChanges();
        this.notif.error('Erro ao executar a pesquisa.');
      },
    });
  }

  gerarRelatorio() {
    if (!this.consultaId) return;
    this.baixarRelatorio(this.consultaId);
  }

  limparFiltros() {
    this.filtros = {};
    this.municipioOptions = [];
    this.geoJson = null;
    this.consultaId = null;
    this.totalResultados = 0;
    this.totalGeocod = 0;
    this.cdr.detectChanges();
  }

  get consultasView() {
    return this.consultas.map((c) => ({
      ...c,
      ufLabel: c.filtros.uf ?? '—',
      municipioLabel: this.labelMunicipio(c.filtros.municipio) ?? '—',
      bairroLabel: c.filtros.bairro ?? '—',
      cnaesLabel: c.filtros.cnaes?.length ? c.filtros.cnaes.join(', ') : '—',
    }));
  }

  private carregarCnaes() {
    this.carregandoCnaes = true;
    this.adminService.lookupCnaePainel360().subscribe({
      next: (items) => {
        this.cnaeOptions = items;
        this.carregandoCnaes = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.carregandoCnaes = false;
        this.cdr.detectChanges();
      },
    });
  }

  private carregarConsultas() {
    this.carregandoConsultas = true;
    this.adminService.listarConsultasPainel360().subscribe({
      next: (lista) => {
        this.consultas = lista;
        this.carregandoConsultas = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.carregandoConsultas = false;
        this.cdr.detectChanges();
      },
    });
  }

  private recarregarConsulta(consulta: Painel360Consulta) {
    this.pesquisando = true;
    this.filtros = { ...consulta.filtros };
    if (consulta.filtros.uf) {
      this.onUfChange(consulta.filtros.uf);
    }
    this.adminService.recarregarGeoJsonPainel360(consulta.id).subscribe({
      next: (geojson) => {
        this.geoJson = geojson;
        this.consultaId = consulta.id;
        this.totalResultados = consulta.totalResultados;
        this.totalGeocod = consulta.totalGeocod;
        this.pesquisando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.pesquisando = false;
        this.cdr.detectChanges();
        this.notif.error('Erro ao recarregar a consulta.');
      },
    });
  }

  private baixarRelatorio(consultaId: string) {
    this.adminService.gerarRelatorioPainel360(consultaId).subscribe({
      next: (response) => this.salvarArquivo(response, `painel-360-${consultaId}`),
      error: () => this.notif.error('Erro ao gerar o relatório.'),
    });
  }

  private labelMunicipio(codigoRfb?: string): string | null {
    if (!codigoRfb) return null;
    const found = this.municipioOptions.find((m) => m.value === codigoRfb);
    return found?.label ?? codigoRfb;
  }

  private salvarArquivo(response: any, fallback: string) {
    const disposition = response.headers?.get('content-disposition') ?? '';
    const match = disposition.match(/filename="?([^"]+)"?/i);
    const fileName = match?.[1] ?? `${fallback}.csv`;
    const blobUrl = URL.createObjectURL(response.body as Blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(blobUrl);
  }
}

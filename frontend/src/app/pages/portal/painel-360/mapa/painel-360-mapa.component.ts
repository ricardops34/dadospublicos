import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Painel360GeoJsonCollection, Painel360GeoJsonFeature } from '../painel-360.types';

type LeafletModule = typeof import('leaflet');

@Component({
  selector: 'app-painel-360-mapa',
  standalone: false,
  templateUrl: './painel-360-mapa.component.html',
  styleUrls: ['./painel-360-mapa.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class Painel360MapaComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('mapaHost') mapaHost?: ElementRef<HTMLDivElement>;

  @Input() geoJson: Painel360GeoJsonCollection | null = null;
  @Input() loading = false;
  @Input() altura = '420px';

  private leaflet?: LeafletModule;
  private mapa?: import('leaflet').Map;
  private clusterLayer: any;
  private resizeObserver?: ResizeObserver;
  private readonly centroBrasil: [number, number] = [-14.235, -51.9253];

  async ngAfterViewInit() {
    await this.inicializarMapa();
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes['geoJson'] || changes['loading']) && this.mapa) {
      this.renderizarDados();
    }
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
    this.mapa?.remove();
  }

  private async inicializarMapa() {
    if (!this.mapaHost || this.mapa) {
      return;
    }

    const L = await import('leaflet');
    await import('leaflet.markercluster');

    this.leaflet = L;
    this.mapa = L.map(this.mapaHost.nativeElement, {
      zoomControl: true,
      attributionControl: true,
    }).setView(this.centroBrasil, 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(this.mapa);

    const clusterFactory = (L as LeafletModule & { markerClusterGroup?: (options?: unknown) => any }).markerClusterGroup;
    this.clusterLayer = clusterFactory
      ? clusterFactory({
          showCoverageOnHover: false,
          spiderfyOnMaxZoom: true,
          disableClusteringAtZoom: 12,
        })
      : L.layerGroup();

    this.clusterLayer.addTo(this.mapa);
    this.resizeObserver = new ResizeObserver(() => this.mapa?.invalidateSize());
    this.resizeObserver.observe(this.mapaHost.nativeElement);
    this.renderizarDados();
  }

  private renderizarDados() {
    if (!this.mapa || !this.leaflet || !this.clusterLayer) {
      return;
    }

    if (typeof this.clusterLayer.clearLayers === 'function') {
      this.clusterLayer.clearLayers();
    }

    const features = this.geoJson?.features ?? [];
    const bounds: Array<[number, number]> = [];

    features.forEach((feature) => {
      const marker = this.criarMarker(feature);
      if (!marker) {
        return;
      }

      marker.addTo(this.clusterLayer);
      const [lng, lat] = feature.geometry.coordinates;
      bounds.push([lat, lng]);
    });

    if (bounds.length) {
      this.mapa.fitBounds(bounds, { padding: [24, 24] });
    } else {
      this.mapa.setView(this.centroBrasil, 4);
    }
  }

  private criarMarker(feature: Painel360GeoJsonFeature) {
    if (!this.leaflet) {
      return null;
    }

    const [lng, lat] = feature.geometry.coordinates;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return null;
    }

    const tipo = String(feature.properties.tipo ?? 'resultado').toLowerCase();
    const marker = this.leaflet.marker([lat, lng], {
      icon: this.criarIcone(tipo),
    });

    marker.bindPopup(this.construirPopup(feature));
    return marker;
  }

  private criarIcone(tipo: string) {
    const cor =
      tipo === 'carteira'
        ? 'azul'
        : tipo === 'prospect'
          ? 'verde'
          : tipo === 'ambos'
            ? 'laranja'
            : 'magenta';

    return this.leaflet!.divIcon({
      className: 'painel-360-marker',
      html: `<span class="painel-360-marker__pin painel-360-marker__pin--${cor}"></span>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
      popupAnchor: [0, -10],
    });
  }

  private construirPopup(feature: Painel360GeoJsonFeature): string {
    const props = feature.properties;
    const razaoSocial = this.escapeHtml(String(props['razao_social'] ?? props['razaoSocial'] ?? 'Registro sem nome'));
    const cnpj = this.escapeHtml(String(props['cnpj'] ?? ''));
    const situacao = this.escapeHtml(String(props['situacao_cadastral'] ?? props['situacao'] ?? props['status'] ?? ''));
    const municipio = this.escapeHtml(String(props['municipio'] ?? props['cidade'] ?? ''));
    const uf = this.escapeHtml(String(props['uf'] ?? ''));
    const endereco = this.escapeHtml(String(props['endereco'] ?? ''));

    return `
      <div class="painel-360-popup">
        <strong>${razaoSocial}</strong>
        ${cnpj ? `<span>CNPJ: ${cnpj}</span>` : ''}
        ${situacao ? `<span>Status: ${situacao}</span>` : ''}
        ${(municipio || uf) ? `<span>${municipio}${municipio && uf ? '/' : ''}${uf}</span>` : ''}
        ${endereco ? `<span>${endereco}</span>` : ''}
      </div>
    `;
  }

  private escapeHtml(valor: string): string {
    return valor
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

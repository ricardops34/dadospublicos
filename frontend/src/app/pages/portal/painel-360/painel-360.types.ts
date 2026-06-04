export const PAINEL_360_RECURSO_SLUG = 'painel-360';

export type Painel360Perfil = 'admin' | 'cliente';

export type Painel360StatusLote =
  | 'pendente'
  | 'processando'
  | 'concluido'
  | 'erro'
  | 'cancelado'
  | string;

export interface Painel360ResumoLote {
  total?: number;
  processados?: number;
  sucesso?: number;
  erro?: number;
  geocodificados?: number;
}

export interface Painel360Lote {
  id: string;
  nome?: string;
  nomeArquivo?: string;
  arquivoOriginal?: string;
  status: Painel360StatusLote;
  criadoEm?: string;
  atualizadoEm?: string;
  concluidoEm?: string;
  mensagem?: string;
  totalLinhas?: number;
  totalResultados?: number;
  resumo?: Painel360ResumoLote;
}

export interface Painel360Resultado {
  id?: string;
  cnpj?: string;
  razaoSocial?: string;
  nomeFantasia?: string;
  situacao?: string;
  cidade?: string;
  uf?: string;
  cep?: string;
  endereco?: string;
  status?: string;
  mensagem?: string;
  latitude?: number;
  longitude?: number;
}

export interface Painel360ResultadosResponse {
  items: Painel360Resultado[];
  total: number;
}

export interface Painel360GeoJsonProperties {
  [key: string]: unknown;
  tipo?: string;
  cnpj?: string;
  razao_social?: string;
  razaoSocial?: string;
  nome_fantasia?: string;
  nomeFantasia?: string;
  situacao?: string;
  cidade?: string;
  uf?: string;
  endereco?: string;
  status?: string;
}

export interface Painel360GeoJsonFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: Painel360GeoJsonProperties;
}

export interface Painel360GeoJsonCollection {
  type: 'FeatureCollection';
  features: Painel360GeoJsonFeature[];
}

export function extrairLista<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (!payload || typeof payload !== 'object') {
    return [];
  }

  const candidate = payload as Record<string, unknown>;

  if (Array.isArray(candidate['items'])) {
    return candidate['items'] as T[];
  }

  if (Array.isArray(candidate['data'])) {
    return candidate['data'] as T[];
  }

  if (Array.isArray(candidate['resultados'])) {
    return candidate['resultados'] as T[];
  }

  if (Array.isArray(candidate['lotes'])) {
    return candidate['lotes'] as T[];
  }

  return [];
}

export function extrairTotal(payload: unknown, fallback: number): number {
  if (!payload || typeof payload !== 'object') {
    return fallback;
  }

  const candidate = payload as Record<string, unknown>;
  const total = candidate['total'] ?? candidate['count'] ?? candidate['quantidade'];
  return typeof total === 'number' ? total : fallback;
}

function normalizarSlug(valor: unknown): string | null {
  if (typeof valor !== 'string') {
    return null;
  }

  const slug = valor.trim().toLowerCase();
  return slug ? slug : null;
}

export function extrairRecursosLiberados(payload: unknown): string[] {
  if (!payload || typeof payload !== 'object') {
    return [];
  }

  const candidate = payload as Record<string, unknown>;
  const recursos = new Set<string>();

  const adicionar = (valor: unknown) => {
    if (!Array.isArray(valor)) {
      return;
    }

    valor.forEach((item) => {
      if (typeof item === 'string') {
        const slug = normalizarSlug(item);
        if (slug) {
          recursos.add(slug);
        }
        return;
      }

      if (item && typeof item === 'object') {
        const registro = item as Record<string, unknown>;
        const slug =
          normalizarSlug(registro['slug']) ??
          normalizarSlug(registro['nome']) ??
          normalizarSlug(registro['codigo']);

        if (slug) {
          recursos.add(slug);
        }
      }
    });
  };

  adicionar(candidate['recursos']);
  adicionar((candidate['plano'] as Record<string, unknown> | undefined)?.['recursos']);
  adicionar((candidate['assinatura'] as Record<string, unknown> | undefined)?.['recursos']);

  const acessos = candidate['acessos'];
  if (acessos && typeof acessos === 'object') {
    Object.entries(acessos as Record<string, unknown>).forEach(([chave, valor]) => {
      if (valor === true) {
        const slug = normalizarSlug(chave.replace(/_/g, '-'));
        if (slug) {
          recursos.add(slug);
        }
      }
    });
  }

  return [...recursos];
}

export function temRecursoPainel360(payload: unknown): boolean {
  return extrairRecursosLiberados(payload).includes(PAINEL_360_RECURSO_SLUG);
}

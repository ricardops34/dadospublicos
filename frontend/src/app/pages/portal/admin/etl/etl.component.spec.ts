import { of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { PortalEtlComponent } from './etl.component';

describe('PortalEtlComponent', () => {
  it('atualiza log de arquivos durante polling quando o ETL esta rodando', () => {
    const http = {
      get: vi.fn().mockReturnValue(of({
        rodando: true,
        progresso: { fase: 'Carga no banco', arquivoAtual: 'Empresas0.csv', feitos: 1, total: 3, percentual: 33 },
        historico: [],
        page: 1,
        pageSize: 10,
        total: 0,
      })),
    };
    const notif = {
      success: vi.fn(),
      error: vi.fn(),
      information: vi.fn(),
    };
    const cdr = { detectChanges: vi.fn() };

    const component = new PortalEtlComponent(http as any, notif as any, cdr as any);
    const carregarLogArquivosSpy = vi.spyOn(component as any, 'carregarLogArquivos').mockImplementation(() => {});
    vi.spyOn(component as any, 'iniciarPolling').mockImplementation(() => {});

    (component as any).carregarStatus(false, false, true);

    expect(carregarLogArquivosSpy).toHaveBeenCalledTimes(1);
  });
});

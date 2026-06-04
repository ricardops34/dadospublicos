import { Injectable } from '@angular/core';
import { PoNotificationService } from '@po-ui/ng-components';

const DURACAO = 3500;
const DURACAO_ERRO = 5000;

@Injectable({ providedIn: 'root' })
export class NotifService {
  constructor(private po: PoNotificationService) {}

  success(mensagem: string) {
    this.po.success({ message: mensagem, duration: DURACAO });
  }

  warning(mensagem: string) {
    this.po.warning({ message: mensagem, duration: DURACAO });
  }

  information(mensagem: string) {
    this.po.information({ message: mensagem, duration: DURACAO });
  }

  error(mensagem: string) {
    this.po.error({ message: mensagem });
    // PO-UI nunca registra timer para o tipo Error por design.
    // Forçamos o auto-close via API interna após DURACAO_ERRO ms.
    const svc = this.po as any;
    const allRefs = [...(svc.stackTop ?? []), ...(svc.stackBottom ?? [])];
    const ref = allRefs[allRefs.length - 1];
    if (ref) {
      setTimeout(() => {
        if (ref.instance?.alive) svc.destroyToaster(ref);
      }, DURACAO_ERRO);
    }
  }
}

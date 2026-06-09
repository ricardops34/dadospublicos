import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PoModalAction, PoModalComponent, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { NotifService } from '../../../services/notif.service';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-parametros',
  standalone: false,
  templateUrl: './parametros.component.html'
})
export class ParametrosComponent implements OnInit {
  @ViewChild('modalEdit', { static: true }) modalEdit!: PoModalComponent;

  parametros: any[] = [];
  parametrosVisiveis: any[] = [];
  loading = false;
  loadingMore = false;

  columns: PoTableColumn[] = [
    { property: 'chave',    label: 'Chave',     width: '25%' },
    { property: 'valor',    label: 'Valor',     width: '35%' },
    { property: 'descricao', label: 'Descrição', width: '40%' },
  ];

  actions: PoTableAction[] = [
    { action: this.edit.bind(this),   icon: 'an an-pencil', label: 'Editar' },
    { action: this.delete.bind(this), icon: 'an an-trash',  label: 'Excluir', type: 'danger' },
  ];

  isEditing = false;
  currentItem: any = {};

  modalPrimaryAction: PoModalAction = {
    action: () => this.save(),
    label: 'Salvar',
  };

  modalSecondaryAction: PoModalAction = {
    action: () => this.modalEdit.close(),
    label: 'Cancelar',
  };

  constructor(private http: HttpClient, private notif: NotifService) {}

  ngOnInit() {
    this.loadData();
  }

  get showMoreDisabled(): boolean {
    return this.parametrosVisiveis.length >= this.parametros.length;
  }

  onShowMore() {
    this.loadingMore = true;
    setTimeout(() => {
      const next = this.parametros.slice(0, this.parametrosVisiveis.length + PAGE_SIZE);
      this.parametrosVisiveis = next;
      this.loadingMore = false;
    }, 0);
  }

  loadData() {
    this.loading = true;
    this.http.get<any[]>(`${environment.apiUrl}/admin/parametros`).subscribe({
      next: (res) => {
        this.parametros = res.map(p => {
          if (p.chave === 'SMTP_PASS' && p.valor) {
            p._valorOriginal = p.valor;
            p.valor = '********';
          }
          return p;
        });
        this.parametrosVisiveis = this.parametros.slice(0, PAGE_SIZE);
        this.loading = false;
      },
      error: () => {
        this.notif.error('Erro ao carregar parâmetros');
        this.loading = false;
      }
    });
  }

  create() {
    this.isEditing = false;
    this.currentItem = { chave: '', valor: '', descricao: '' };
    this.modalEdit.open();
  }

  edit(item: any) {
    this.isEditing = true;
    this.currentItem = { ...item };
    if (this.currentItem.chave === 'SMTP_PASS') {
      this.currentItem.valor = this.currentItem._valorOriginal || '';
    }
    this.modalEdit.open();
  }

  save() {
    if (!this.currentItem.chave) {
      return this.notif.warning('A chave é obrigatória');
    }
    this.http.post(`${environment.apiUrl}/admin/parametros/${this.currentItem.chave}`, this.currentItem).subscribe({
      next: () => {
        this.notif.success('Parâmetro salvo com sucesso!');
        this.modalEdit.close();
        this.loadData();
      },
      error: () => this.notif.error('Erro ao salvar o parâmetro'),
    });
  }

  delete(item: any) {
    if (confirm(`Tem certeza que deseja excluir o parâmetro ${item.chave}?`)) {
      this.http.delete(`${environment.apiUrl}/admin/parametros/${item.chave}`).subscribe({
        next: () => {
          this.notif.success('Parâmetro excluído!');
          this.loadData();
        },
        error: () => this.notif.error('Erro ao excluir parâmetro'),
      });
    }
  }
}

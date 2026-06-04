import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PoModalAction, PoModalComponent, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { NotifService } from '../../../services/notif.service';

@Component({
  selector: 'app-parametros',
  standalone: false,
  templateUrl: './parametros.component.html'
})
export class ParametrosComponent implements OnInit {
  @ViewChild('modalEdit', { static: true }) modalEdit!: PoModalComponent;

  parametros: any[] = [];
  loading = false;

  columns: PoTableColumn[] = [
    { property: 'chave', label: 'Chave' },
    { property: 'valor', label: 'Valor' },
    { property: 'descricao', label: 'Descrição' }
  ];

  actions: PoTableAction[] = [
    { action: this.edit.bind(this), icon: 'po-icon-edit', label: 'Editar' },
    { action: this.delete.bind(this), icon: 'po-icon-delete', label: 'Excluir', type: 'danger' }
  ];

  isEditing = false;
  currentItem: any = {};

  modalPrimaryAction: PoModalAction = {
    action: () => this.save(),
    label: 'Salvar'
  };

  modalSecondaryAction: PoModalAction = {
    action: () => this.modalEdit.close(),
    label: 'Cancelar'
  };

  constructor(private http: HttpClient, private notif: NotifService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.http.get<any[]>(`${environment.apiUrl}/admin/parametros`).subscribe({
      next: (res) => {
        // Ocultar a senha da exibição
        this.parametros = res.map(p => {
          if (p.chave === 'SMTP_PASS' && p.valor) {
            p._valorOriginal = p.valor;
            p.valor = '********';
          }
          return p;
        });
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
      error: () => this.notif.error('Erro ao salvar o parâmetro')
    });
  }

  delete(item: any) {
    if (confirm(`Tem certeza que deseja excluir o parâmetro ${item.chave}?`)) {
      this.http.delete(`${environment.apiUrl}/admin/parametros/${item.chave}`).subscribe({
        next: () => {
          this.notif.success('Parâmetro excluído!');
          this.loadData();
        },
        error: () => this.notif.error('Erro ao excluir parâmetro')
      });
    }
  }
}

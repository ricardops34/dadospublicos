import { Component, OnInit } from '@angular/core';
import { PoNotificationService } from '@po-ui/ng-components';
import { ClientePortalService } from '../cliente.service';

@Component({
  selector: 'app-minha-conta',
  standalone: false,
  templateUrl: './minha-conta.component.html',
})
export class MinhaContaComponent implements OnInit {
  perfil: any = null;
  carregando = true;
  salvando = false;
  editando = false;

  form = { nome: '', telefone: '', cnpj: '', razaoSocial: '' };

  constructor(private svc: ClientePortalService, private notif: PoNotificationService) {}

  ngOnInit() {
    this.svc.meuPerfil().subscribe({
      next: (p) => {
        this.perfil = p;
        this.form = {
          nome: p.nome ?? '',
          telefone: p.telefone ?? '',
          cnpj: p.cnpj ?? '',
          razaoSocial: p.razaoSocial ?? '',
        };
        this.carregando = false;
      },
      error: () => { this.carregando = false; },
    });
  }

  iniciarEdicao() { this.editando = true; }

  cancelarEdicao() {
    this.editando = false;
    this.form = {
      nome: this.perfil.nome ?? '',
      telefone: this.perfil.telefone ?? '',
      cnpj: this.perfil.cnpj ?? '',
      razaoSocial: this.perfil.razaoSocial ?? '',
    };
  }

  salvar() {
    this.salvando = true;
    this.svc.atualizarPerfil(this.form).subscribe({
      next: (p) => {
        this.perfil = { ...this.perfil, ...p };
        this.editando = false;
        this.salvando = false;
        this.notif.success('Dados atualizados com sucesso.');
      },
      error: () => {
        this.notif.error('Erro ao salvar dados.');
        this.salvando = false;
      },
    });
  }

  get emailVerificadoLabel() {
    return this.perfil?.emailVerificado ? 'Verificado' : 'Pendente';
  }
}

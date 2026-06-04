import { Component, OnInit } from '@angular/core';
import { NotifService } from '../../../../services/notif.service';
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

  form = { 
    nome: '', telefone: '', cnpj: '', razaoSocial: '',
    cep: '', logradouro: '', numero: '', complemento: '', bairro: '', 
    municipio: '', uf: '', inscricaoEstadual: '', inscricaoMunicipal: ''
  };

  constructor(private svc: ClientePortalService, private notif: NotifService) {}

  ngOnInit() {
    this.svc.meuPerfil().subscribe({
      next: (p) => {
        this.perfil = p;
        this.form = {
          nome: p.nome ?? '', telefone: p.telefone ?? '', cnpj: p.cnpj ?? '', razaoSocial: p.razaoSocial ?? '',
          cep: p.cep ?? '', logradouro: p.logradouro ?? '', numero: p.numero ?? '', complemento: p.complemento ?? '',
          bairro: p.bairro ?? '', municipio: p.municipio ?? '', uf: p.uf ?? '', 
          inscricaoEstadual: p.inscricaoEstadual ?? '', inscricaoMunicipal: p.inscricaoMunicipal ?? ''
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
      nome: this.perfil.nome ?? '', telefone: this.perfil.telefone ?? '', cnpj: this.perfil.cnpj ?? '', razaoSocial: this.perfil.razaoSocial ?? '',
      cep: this.perfil.cep ?? '', logradouro: this.perfil.logradouro ?? '', numero: this.perfil.numero ?? '', complemento: this.perfil.complemento ?? '',
      bairro: this.perfil.bairro ?? '', municipio: this.perfil.municipio ?? '', uf: this.perfil.uf ?? '', 
      inscricaoEstadual: this.perfil.inscricaoEstadual ?? '', inscricaoMunicipal: this.perfil.inscricaoMunicipal ?? ''
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

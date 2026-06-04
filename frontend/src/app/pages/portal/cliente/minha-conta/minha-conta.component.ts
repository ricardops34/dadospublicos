import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PoModalAction, PoModalComponent } from '@po-ui/ng-components';
import { NotifService } from '../../../../services/notif.service';
import { AuthService } from '../../../../services/auth.service';
import { ClientePortalService } from '../cliente.service';

@Component({
  selector: 'app-minha-conta',
  standalone: false,
  templateUrl: './minha-conta.component.html',
})
export class MinhaContaComponent implements OnInit {
  @ViewChild('modalExclusao') modalExclusao!: PoModalComponent;

  perfil: any = null;
  carregando = true;
  salvando = false;
  editando = false;

  // Exclusão
  excluindo = false;
  temPlanoAtivo = false;
  dataFimPlano: string | null = null;
  agendarExclusaoEm: Date | null = null;
  opcaoExclusao: 'agora' | 'fim-plano' = 'agora';

  acaoConfirmarExclusao: PoModalAction = {
    label: 'Confirmar exclusão',
    action: () => this.confirmarExclusao(),
    loading: false,
    danger: true,
  };
  acaoCancelarExclusao: PoModalAction = {
    label: 'Cancelar',
    action: () => this.modalExclusao.close(),
  };

  opcoesExclusao: any[] = [];

  form = {
    nome: '', telefone: '', cnpj: '', razaoSocial: '',
    cep: '', logradouro: '', numero: '', complemento: '', bairro: '',
    municipio: '', uf: '', inscricaoEstadual: '', inscricaoMunicipal: ''
  };

  constructor(
    private svc: ClientePortalService,
    private notif: NotifService,
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.svc.meuPerfil().subscribe({
      next: (p) => {
        this.perfil = p;
        this.form = {
          nome: p.nome ?? '', telefone: p.telefone ?? '', cnpj: p.cnpj ?? '',
          razaoSocial: p.razaoSocial ?? '', cep: p.cep ?? '', logradouro: p.logradouro ?? '',
          numero: p.numero ?? '', complemento: p.complemento ?? '', bairro: p.bairro ?? '',
          municipio: p.municipio ?? '', uf: p.uf ?? '',
          inscricaoEstadual: p.inscricaoEstadual ?? '', inscricaoMunicipal: p.inscricaoMunicipal ?? ''
        };

        const assinaturaAtiva = p.assinaturas?.find(
          (a: any) => a.status === 'ativa' && a.proximoVencimento,
        );
        this.temPlanoAtivo = !!assinaturaAtiva;
        this.dataFimPlano = assinaturaAtiva?.proximoVencimento ?? null;
        this.agendarExclusaoEm = p.agendarExclusaoEm ?? null;

        this.opcaoExclusao = 'agora';
        this.opcoesExclusao = this.temPlanoAtivo
          ? [
              { label: 'Excluir agora (perde o acesso imediatamente)', value: 'agora' },
              { label: `Agendar para o fim do plano (${this.formatarData(this.dataFimPlano)})`, value: 'fim-plano' },
            ]
          : [{ label: 'Excluir minha conta permanentemente', value: 'agora' }];

        this.carregando = false;
      },
      error: () => { this.carregando = false; },
    });
  }

  iniciarEdicao() { this.editando = true; }

  cancelarEdicao() {
    this.editando = false;
    this.form = {
      nome: this.perfil.nome ?? '', telefone: this.perfil.telefone ?? '', cnpj: this.perfil.cnpj ?? '',
      razaoSocial: this.perfil.razaoSocial ?? '', cep: this.perfil.cep ?? '',
      logradouro: this.perfil.logradouro ?? '', numero: this.perfil.numero ?? '',
      complemento: this.perfil.complemento ?? '', bairro: this.perfil.bairro ?? '',
      municipio: this.perfil.municipio ?? '', uf: this.perfil.uf ?? '',
      inscricaoEstadual: this.perfil.inscricaoEstadual ?? '',
      inscricaoMunicipal: this.perfil.inscricaoMunicipal ?? ''
    };
  }

  salvar() {
    this.salvando = true;
    this.svc.atualizarPerfil(this.form).subscribe({
      next: (p) => { this.perfil = { ...this.perfil, ...p }; this.editando = false; this.salvando = false; this.notif.success('Dados atualizados.'); },
      error: () => { this.notif.error('Erro ao salvar.'); this.salvando = false; },
    });
  }

  solicitarExclusao() {
    if (this.agendarExclusaoEm) return;
    this.modalExclusao.open();
  }

  confirmarExclusao() {
    this.acaoConfirmarExclusao = { ...this.acaoConfirmarExclusao, loading: true };
    this.svc.agendarExclusao(this.opcaoExclusao).subscribe({
      next: (res) => {
        this.acaoConfirmarExclusao = { ...this.acaoConfirmarExclusao, loading: false };
        this.modalExclusao.close();
        if (this.opcaoExclusao === 'agora') {
          this.notif.success('Conta desativada. Seus dados serão removidos em breve.');
          this.auth.logout();
          setTimeout(() => this.router.navigate(['/']), 1500);
        } else {
          this.agendarExclusaoEm = res.agendarExclusaoEm;
          this.notif.success('Exclusão agendada para o fim do seu plano.');
        }
      },
      error: () => {
        this.acaoConfirmarExclusao = { ...this.acaoConfirmarExclusao, loading: false };
        this.notif.error('Erro ao solicitar exclusão.');
      },
    });
  }

  get dataExclusaoFormatada(): string {
    return this.agendarExclusaoEm ? this.formatarData(this.agendarExclusaoEm.toString()) : '';
  }

  get emailVerificadoLabel() {
    return this.perfil?.emailVerificado ? 'Verificado' : 'Pendente';
  }

  formatarData(iso: string | null): string {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('pt-BR');
  }
}

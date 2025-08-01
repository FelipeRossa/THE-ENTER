import { AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { ElectronService } from '../../../../services/electron/electron.service';
import { Host } from '../../../../models/Host';

declare var bootstrap: any;

@Component({
  selector: 'app-cadastro-hosts',
  standalone: false,
  templateUrl: './cadastro-hosts.component.html',
  styleUrl: './cadastro-hosts.component.scss'
})
export class CadastroHostsComponent implements AfterViewInit {
  @ViewChild('modalNovoHost') modalRef!: ElementRef;
  @Output() hostSalvo = new EventEmitter<any>();

  @ViewChild('erroModal') erroModal!: any;
  modalTitle = 'Erro';
  mensagemErro = '';

  modalInstance: any;
  modoEdicao = false;
  grupoAtual: any;

  hostAntigo: Host | undefined = undefined;

  host = {
    onOff: true,
    ip: '',
    nmHost: '',
    comentario: '',
    corExadecimal: '#cccccc'
  };

  constructor(private electronService: ElectronService) {
  }

  ngAfterViewInit(): void {
    if (this.modalRef) {
      this.modalInstance = new bootstrap.Modal(this.modalRef.nativeElement);
    }
  }

  abrirModal(grupo: any, host?: any): void {
    this.grupoAtual = grupo;
    this.modoEdicao = !!host;

    if (host) {
      this.host = { ...host };
      this.hostAntigo = { ...host };
    } else {
      this.host = {
        onOff: true,
        ip: '',
        nmHost: grupo.titulo || '',
        comentario: '',
        corExadecimal: grupo.corExadecimal || '#ffffff'
      };
      this.hostAntigo = undefined;
    }

    this.modalInstance?.show();
  }

  fecharModal(): void {
    this.modalInstance?.hide();
  }

  salvar(): void {
    this.electronService.salvarHost(this.grupoAtual.titulo, this.hostAntigo as Host, this.host).then(async sucess => {
      this.hostSalvo.emit();
    }, err => {
      this.modalTitle = 'Erro ao atualizar host';
      this.mensagemErro = err;
      this.erroModal.open();
    });


    // const novoHost = { ...this.host };
    // { grupo: this.grupoAtual, host: novoHost, modoEdicao: this.modoEdicao }
    this.hostSalvo.emit();
    this.fecharModal();
  }

}

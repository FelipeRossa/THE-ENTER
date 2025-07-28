import { AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

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

  modalInstance: any;
  modoEdicao = false;
  grupoAtual: any;

  ngAfterViewInit(): void {
    if (this.modalRef) {
      this.modalInstance = new bootstrap.Modal(this.modalRef.nativeElement);
    }
  }

  host = {
    onOff: true,
    ip: '',
    nmHost: '',
    comentario: '',
    corExadecimal: '#cccccc'
  };

  abrirModal(grupo: any, host?: any): void {
    this.grupoAtual = grupo;
    this.modoEdicao = !!host;

    if (host) {
      this.host = { ...host };
    } else {
      this.host = {
        onOff: true,
        ip: '',
        nmHost: grupo.titulo || '',
        comentario: '',
        corExadecimal: grupo.corExadecimal || '#ffffff'
      };
    }

    this.modalInstance?.show();
  }

  fecharModal(): void {
    this.modalInstance?.hide();
  }

  salvar(): void {
    const novoHost = { ...this.host };
    this.hostSalvo.emit({ grupo: this.grupoAtual, host: novoHost, modoEdicao: this.modoEdicao });
    this.fecharModal();
  }

}

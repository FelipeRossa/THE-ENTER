import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

import * as bootstrap from 'bootstrap';
import { GrupoHosts } from '../../../../models/GrupoHosts';
import { ElectronService } from '../../../../services/electron/electron.service';

@Component({
  selector: 'app-cadastro-grupo-host',
  standalone: false,
  templateUrl: './cadastro-grupo-host.component.html',
  styleUrl: './cadastro-grupo-host.component.scss'
})
export class CadastroGrupoHostComponent {
  grupo: GrupoHosts = {
    titulo: '', corExadecimal: '#0d6efd', hosts: [],
    onOff: false
  };

  @Output() grupoCriado = new EventEmitter<GrupoHosts>();
  @ViewChild('modalNovoGrupo', { static: false }) modalRef!: ElementRef;

  @ViewChild('erroModal') erroModal!: any;
  modalTitle = 'Erro';
  mensagemErro = '';

  private modalInstance: any;

  modoEdicao = false;

  grupoAntigo: GrupoHosts | undefined = undefined;

  constructor(private electronService: ElectronService) {
  }

  abrirModal(grupoEdicao?: GrupoHosts): void {
    this.modoEdicao = !!grupoEdicao;
    
    if (grupoEdicao)  {
      this.grupo = { ...grupoEdicao };
      this.grupoAntigo = { ...grupoEdicao };
    } else {
      this.grupo = {
        titulo: '',
        corExadecimal: '#0d6efd',
        hosts: [],
        onOff: false
      };
      this.grupoAntigo = undefined;
    }

    this.modalInstance = new bootstrap.Modal(document.getElementById('modalNovoGrupo')!);
    this.modalInstance.show();
  }

  adicionarGrupo() {
    if (this.grupo.titulo.trim() === '') return;

    this.electronService.salvarGrupo(this.grupoAntigo as GrupoHosts, this.grupo).then(async sucess => {
      this.modalInstance.hide();
      if (this.modoEdicao) {
        this.grupoCriado.emit();
      } else {
        this.grupoCriado.emit({ ...this.grupo });
      }
      
    }, err => {
      this.modalTitle = 'Erro ao atualizar host';
      this.mensagemErro = err;
      this.erroModal.open();
    });

    
  }

}

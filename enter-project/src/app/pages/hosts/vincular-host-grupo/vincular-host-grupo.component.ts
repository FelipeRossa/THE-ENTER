import { AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { GrupoHosts } from '../../../models/GrupoHosts';
import { ElectronService } from '../../../services/electron/electron.service';

declare var bootstrap: any;

@Component({
  selector: 'app-vincular-host-grupo',
  standalone: false,
  templateUrl: './vincular-host-grupo.component.html',
  styleUrl: './vincular-host-grupo.component.scss'
})
export class VincularHostGrupoComponent implements AfterViewInit {

  @ViewChild('erroModal') erroModal!: any;
  modalTitle = 'Erro';
  mensagemErro = '';

  @ViewChild('modalVincularHostGrupo', { static: false }) modalRef!: ElementRef;
  modalInstance: any;

  @Output() hostVinculado = new EventEmitter<any>();

  groupsHosts: GrupoHosts[] = [];
  hostVincular: any = null;

  grupoSelecionado: GrupoHosts | null = null

  constructor(private electronService: ElectronService) {
  }

  ngAfterViewInit(): void {
  }

  abrirModal(host: any, grupos: GrupoHosts[]) {

    this.hostVincular = host;
    for (let grupo of grupos) {
      if (grupo.titulo != 'SGD' ) {
        this.groupsHosts.push(grupo);
      }
    }

    this.modalInstance = new bootstrap.Modal(document.getElementById('modalVincularHostGrupo'));
    this.modalInstance?.show();
  }

  fecharModal(): void {
    this.modalInstance?.hide();
  }

  vincular() {
    if (!this.grupoSelecionado) {
      return;
    }

    this.electronService.vincularGrupoHost(this.grupoSelecionado, this.hostVincular).then(() => {
      this.hostVinculado.emit();
      this.fecharModal();
      this.hostVincular = null;
      this.grupoSelecionado = null;
      this.groupsHosts = [];

    }).catch(err => {
      this.modalTitle = 'Erro ao atualizar host';
      this.mensagemErro = err;
      this.erroModal.open();
    })
  }

}

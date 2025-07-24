import { Component, OnInit, ViewChild } from '@angular/core';
import { ElectronService } from '../../services/electron/electron.service';
import { GrupoHosts } from '../../models/GrupoHosts';
import { Host } from '../../models/Host';

@Component({
  selector: 'app-hosts.component',
  standalone: false,
  templateUrl: './hosts.component.html',
  styleUrl: './hosts.component.scss'
})
export class HostsComponent implements OnInit {

  @ViewChild('erroModal') erroModal!: any;

  groupsHosts: GrupoHosts[] = [];
  search = '';
  filteredHosts: any[] = [];

  modalTitle = 'Erro';
  mensagemErro = '';

  constructor(private electronService: ElectronService) {

  }

  async ngOnInit(): Promise<void> {
    this.loadHosts();
  }

  filterHosts(): void {
    const value = this.search.toLowerCase();
    this.filteredHosts = this.groupsHosts.filter(h => h.titulo && h.titulo.toLowerCase().includes(value));
  }

  ligaDesligaGrupo(grupo: GrupoHosts) {
    const ativar = !this.grupoAtivo(grupo); // Se está ativo, desliga. Se está desligado, ativa.

    this.electronService.ligarDesligarGrupo(grupo.titulo, ativar).then(async () => {
      this.loadHosts();
    }).catch(err => {
      this.modalTitle = 'Erro ao atualizar grupo: ' + grupo.titulo;
      this.mensagemErro = err;
      this.erroModal.open();
    });
  }

  grupoAtivo(grupo: GrupoHosts): boolean {
    if (grupo.hosts) {
      return grupo.hosts.every(h => h.onOff);
    }

    return false;
  }

  addNovoHost(grupo: GrupoHosts) {
    console.log('Editar grupo:', grupo);
    // futuramente abrir modal
  }

  novoGrupoHost(): void {
    // lógica futura para adicionar host
    alert('Novo host!');
  }


  editarHost(grupo: Host) {
    console.log('Editar grupo:', grupo);
    // futuramente abrir modal
  }

  ligaDesligaHost(host: Host, tituloGrupo: string) {
    host.onOff = !host.onOff;
    this.electronService.ligarDesligarHost(tituloGrupo, host).then(async sucess => {
      this.loadHosts();
    }, err => {
      this.modalTitle = 'Erro ao atualizar host';
      this.mensagemErro = err;
      this.erroModal.open();
    });
  }

  async loadHosts() {
    this.groupsHosts = await this.electronService.getHostsContent();
    this.groupsHosts.forEach(group => group.onOff = this.grupoAtivo(group));
    this.filterHosts();
  }

}

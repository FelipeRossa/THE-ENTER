import { Component, OnInit, ViewChild } from '@angular/core';
import { ElectronService } from '../../services/electron/electron.service';
import { GrupoHosts } from '../../models/GrupoHosts';
import { Host } from '../../models/Host';
import { CadastroHostsComponent } from './cadastro/cadastro-hosts.component/cadastro-hosts.component';
import { Dropdown } from 'bootstrap';

@Component({
  selector: 'app-hosts.component',
  standalone: false,
  templateUrl: './hosts.component.html',
  styleUrl: './hosts.component.scss'
})
export class HostsComponent implements OnInit {

  @ViewChild('erroModal') erroModal!: any;

  @ViewChild('modalCadastroHost') modalCadastroHost!: CadastroHostsComponent;


  groupsHosts: GrupoHosts[] = [];
  search = '';
  filteredHosts: any[] = [];
  modalTitle = 'Erro';
  mensagemErro = '';

  constructor(private electronService: ElectronService) { }

  async ngOnInit(): Promise<void> {
    this.loadHosts();
  }

  filterHosts(): void {
    const value = this.search.toLowerCase().trim();

    this.filteredHosts = this.groupsHosts
      .map(group => {
        // Filtra hosts dentro do grupo que batem com o valor
        const matchingHosts = group.hosts.filter(host =>
          host.nmHost.toLowerCase().includes(value) ||
          host.ip.includes(value) ||
          group.titulo.toLowerCase().includes(value)
        );

        // Retorna novo grupo apenas com os hosts encontrados
        if (matchingHosts.length > 0 || group.hosts.length === 0) {
          return {
            ...group,
            hosts: matchingHosts
          };
        }

        return null;
      })
      .filter(group => group !== null);
  }

  ligaDesligaGrupo(grupo: GrupoHosts) {
    const ativar = !this.grupoAtivo(grupo); // Se está ativo, desliga. Se está desligado, ativa.

    const grupoAlterar = !grupo.hosts[0]?.padraoLinear ? grupo.titulo : grupo.hosts[0].ip;
    this.electronService.ligarDesligarGrupo(grupoAlterar, grupo.hosts[0]?.padraoLinear, ativar).then(async () => {
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

  novoGrupoHost(): void {
    // lógica futura para adicionar host
    alert('Novo host!');
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

  onHostSalvo(event: { grupo: any, host: any, modoEdicao: boolean }) {
    // TODO se pa não precisa desse metodo

    // if (event.modoEdicao) {
    //   // Lógica para atualizar host existente
    // } else {
    //   event.grupo.hosts.push(event.host);
    // }
  }

  criarGrupoEAdicionarHost(novoGrupo: GrupoHosts) {
    this.loadHosts();
    // TODO verificar a regra na edição pra abrir esse modal
    if (novoGrupo != null) {
      this.modalCadastroHost.abrirModal(novoGrupo);
    }
  }

  pingHost(host: Host) {
    this.electronService.pingHost(host.nmHost);
  }

  abrirAnonimo(url: string) {
    this.electronService.abrirChrome(url, true);
  }

  abrirChrome(url: string) {
    this.electronService.abrirChrome(url, false);
  }

}

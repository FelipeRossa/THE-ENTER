import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../../services/electron/electron.service';
import { GrupoHosts } from '../../models/GrupoHosts';

@Component({
  selector: 'app-hosts.component',
  standalone: false,
  templateUrl: './hosts.component.html',
  styleUrl: './hosts.component.scss'
})
export class HostsComponent implements OnInit {
  groupsHosts: GrupoHosts[] = [];
  search = '';
  filteredHosts: any[] = [];

  constructor(private electronService: ElectronService) {

  }

  async ngOnInit(): Promise<void> {
    this.groupsHosts = await this.electronService.getHostsContent();

    this.filterHosts();
  }

  filterHosts(): void {
    const value = this.search.toLowerCase();
    this.filteredHosts = this.groupsHosts.filter(h => h.titulo && h.titulo.toLowerCase().includes(value));
    debugger
  }

  getEnvClass(host: string): string {
    const match = host.split('#')[1]?.trim().toUpperCase();
    switch (match) {
      case 'DEV': return 'dev';
      case 'TESTE': return 'teste';
      case 'PROD': return 'prod';
      default: return '';
    }
  }

  ligaDesligaGrupo(grupo: GrupoHosts) {
    if (grupo.hosts) {
      const todosAtivos = grupo.hosts.every(h => h.onOff);
      grupo.hosts.forEach(h => h.onOff = !todosAtivos);
    }
    
  }

  grupoAtivo(grupo: GrupoHosts): boolean {
    if (grupo.hosts) {
      return grupo.hosts.every(h => h.onOff);
    }

    return false;
    
  }

  editarGrupo(grupo: GrupoHosts) {
    console.log('Editar grupo:', grupo);
    // futuramente abrir modal
  }

  novoGrupoHost(): void {
    // lógica futura para adicionar host
    alert('Novo host!');
  }

}

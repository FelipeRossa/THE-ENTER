import { Injectable } from '@angular/core';
import { GrupoHosts } from '../../models/GrupoHosts';

declare global {
  interface Window {
    electronAPI: any;
    require: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  private ipcRenderer: any;

  constructor() {
    // Checar se Electron está disponível
    if (window.require) {
      const electron = window.require('electron');
      this.ipcRenderer = electron.ipcRenderer;
    }
  }

  async getHostsContent(): Promise<GrupoHosts[]> {
    return await this.ipcRenderer.invoke('hosts:get');
  }

  ligarDesligarHost(tituloGrupo: any, host: any): Promise<boolean> {

    return new Promise<boolean>((resolve, reject) => {
      this.ipcRenderer.once('host:toggle:success', (event: any, res: { ip: any; onOff: any; }) => {
        console.log(`Host ${res.ip} atualizado:`, res.onOff ? 'ativo' : 'comentado');
        resolve(true);
      });

      this.ipcRenderer.once('host:toggle:error', (event: any, err: any) => {
        console.error('Erro ao atualizar host:', err);
        reject(err);
      });

      // Envia para o Electron
      this.ipcRenderer.send('host:toggle', {
        grupoTitulo: tituloGrupo,
        ip: host.ip,
        nome: host.nmHost,
        onOff: host.onOff
      });
    });
  }

  ligarDesligarGrupo(grupoTitulo: string, ativar: boolean): Promise<boolean> {
    return this.ipcRenderer.invoke('host:toggle-group', grupoTitulo, ativar);
  }

}

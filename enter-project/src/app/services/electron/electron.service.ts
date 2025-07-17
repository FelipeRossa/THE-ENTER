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
}

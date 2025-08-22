const { ipcMain } = require('electron');
const hostsService = require('../services/hosts.service');

function registerIpcHandlers() {
  //disponibiliza o serviço da hoosts service
  ipcMain.handle('hosts:get', async () => {
    return hostsService.getHostsGroup();
  });

  ipcMain.on('host:toggle', (event, host) => {
    try {
      hostsService.ligarDesligarHost(host);
      event.reply('host:toggle:success', { ip: host.ip, onOff: host.onOff });
    } catch (err) {
      event.reply('host:toggle:error', err.message);
    }

  });

  ipcMain.handle('host:toggle-group', (event, grupoTitulo, padraoLinear, ativar) => {
    try {
      hostsService.ligarDesligarGrupo(grupoTitulo, padraoLinear, ativar);
      return true;
    } catch (err) {
      throw err;
    }
  });

  ipcMain.handle('host:salvar', (event, grupoTitulo, hostAntigo, novoHost) => {
    try {
      hostsService.salvar(grupoTitulo, hostAntigo, novoHost);
      return true;
    } catch (err) {
      throw err;
    }
  });

  ipcMain.handle('grupo:salvar', (event, grupoAntigo, novoGrupo) => {
    try {
      hostsService.salvarGrupo(grupoAntigo, novoGrupo);
      return true;
    } catch (err) {
      throw err;
    }
  });

  ipcMain.handle('excluir-host', async (event, grupoTitulo, host) => {
    return hostsService.excluirHost(grupoTitulo, host);
  });

  ipcMain.handle('excluir-grupo', async (event, grupo) => {
    return hostsService.excluirGrupo(grupo);
  });

  ipcMain.handle('vincular-host-grupo', async (event, grupo, host) => {
    return hostsService.vincularHostGrupo(grupo, host);
  });

}

module.exports = { registerIpcHandlers };
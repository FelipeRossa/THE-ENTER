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

  ipcMain.handle('host:toggle-group', (event, grupoTitulo, ativar) => {
    try {
      hostsService.ligarDesligarGrupo(grupoTitulo, ativar);
      return true;
    } catch (err) {
      throw err;
    }
  });
}

module.exports = { registerIpcHandlers };
const { ipcMain } = require('electron');
const hostsService = require('../services/hosts.service');

function registerIpcHandlers() {
    //disponibiliza o serviço da hoosts service
    ipcMain.handle('hosts:get', async () => {
        return hostsService.getHostsGroup();
    });

    // Futuro:
    // ipcMain.handle('hosts:save', async (event, data) => {
    //   return hostsService.saveHostsContent(data);
    // });
}

module.exports = { registerIpcHandlers };
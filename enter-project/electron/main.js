// app: aplicativo electron
// BrowserWindow janela do app
const { app, BrowserWindow } = require('electron');

// variavel path é usada para obter o arquivo principal do angular (index.html) quando o angular for compilado
const path = require('path');

const { registerIpcHandlers } = require('./ipc/index');


// Esse é o arquivo principal do Electron, aqui é criada a janela do app e é possível disponibilizar as funções IPC para o Angular.

function createWindow() {
    // configurações da janela do app
    const win = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    const isDev = process.env.ELECTRON_ENV === 'development';

  if (isDev) {
    // win.loadURL para poder depurar o front e publicar as alterações sem precisar fazer o build novamente
    win.loadURL('http://localhost:4200');
    win.webContents.openDevTools();
  } else {
    // win.loadFile para ler o conteudo da dist quando é compilado o angular
    win.loadFile(path.join(__dirname, '../dist/enter-project/browser/index.html'));
  }
}

app.whenReady().then(() => {
    // registra os handlers para comunicação IPC
    registerIpcHandlers();

    // ao rodar o app, cria a janela
    createWindow();

});



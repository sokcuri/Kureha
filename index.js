const electron = require('electron');
const ipcMain = electron.ipcMain;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Configure = require('./app/config');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var win, settingWin;

function createWindow () {
  win = new BrowserWindow({width: 600, height: 800});
  win.loadURL(`file://${__dirname}/app/index.html`);
  win.on('closed', () => {
    if (settingWin) {
      settingWin.close();
    }
    win = null;
  });
}

ipcMain.on('load-config', (event, arg) => {
  const config = Configure.load();
  event.returnValue = config;
});

ipcMain.on('save-config', (event, arg) => {
  Configure.save(arg);
  win.webContents.send('reload-config', arg);
});

ipcMain.on('open-setting', (event, arg) => {
  if (settingWin) {
    settingWin.focus();
    return;
  }
  settingWin = new BrowserWindow({
    width: 450,
    height: 365,
    center: true,
    autoHideMenuBar: true,
  });
  settingWin.on('closed', () => {
    settingWin = null;
  });
  settingWin.loadURL(`file://${__dirname}/app/settings.html`);
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

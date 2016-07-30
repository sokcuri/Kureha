const electron = require('electron');
const ipcMain = electron.ipcMain;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const dialog = electron.dialog;
const request = require('request');
const fs = require('fs');
const path = require('path');
const Configure = require('./app/config');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var win, settingWin, imageViewWin;

function createWindow () {
  win = new BrowserWindow({width: 600, height: 800});
  win.loadURL(`file://${__dirname}/app/index.html`);
  win.on('closed', () => {
    [settingWin, imageViewWin].forEach(subwin => {
      if (subwin) {
        subwin.close();
      }
    });
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

ipcMain.on('open-image-view', (event, arg) => {
  if (imageViewWin) {
    imageViewWin.focus();
  } else {
    imageViewWin = new BrowserWindow({
      width: 1000,
      height: 650,
      minWidth: 320,
      minHeight: 240,
      backgroundColor: '#000',
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: true,
      },
    });
    imageViewWin.on('closed', () => {
      imageViewWin = null;
    });
  }
  let href = encodeURIComponent(arg[0]);
  let more = encodeURIComponent(arg[1]);
  imageViewWin.loadURL(`file://${__dirname}/app/viewer.html?img=${href}&more=${more}`);
});

ipcMain.on('save-media', (event, url) => {
  var saveDialogOption = {
    title: '미디어 파일 저장하기',
  };
  var ext = url.match(/\.\w{3}/gi).pop();
  if (ext) {
    ext = ext.slice(1); // strip dot
    saveDialogOption.filters = [
      {name: `${ext} 파일`, extensions: [ext]},
    ];
  }
  var focusedWindow = BrowserWindow.getFocusedWindow();
  dialog.showSaveDialog(focusedWindow, saveDialogOption, filepath => {
    if (filepath) {
      let output = fs.createWriteStream(filepath);
      request(url)
        .on('error', error => {
          console.error(error);
        })
        .on('response', response => { 
          //window.alert('다운로드 완료!');
          event.sender.send('on-download-complete');
        })
        .pipe(output);
    }
  });
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

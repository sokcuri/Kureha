const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
const BrowserWindow = electron.remote.BrowserWindow;
const shell = electron.shell;
const fs = require('fs');
const path = require('path');

function urlify (text) {
  var urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, function (url) {
    //return '<a href="' + url + '" target="_blank">' + url + '</a>';
    return '<a href="javascript:void(0)" onclick="openPopup(\'' + url + '\')">' + url + '</a>';
  });
}

function tagRemove (text) {
  var regex = /(<([^>]+)>)/ig;
  return text.replace(regex, '');
}

function openExternal (href) {
  shell.openExternal(href);
}

function openPopup (href) {
  if (window.popup && !window.closed) window.popup.close();
  var width = 1000;
  var height = 800;
  var x = (screen.width / 2) - (width / 2);
  var y = (screen.height / 2) - (height / 2);
  var win = new BrowserWindow({
    width, height, x, y,
    center: true,
    webPreferences: {
      nodeIntegration: false,
      plugins: true,
    },
  });
  win.id = 'popup';
  var url = `file://${__dirname}/popup.html?href=${encodeURIComponent(href)}`;
  win.loadURL(url);
  window.win = win;
  /*
  nw.Window.open('app/popup.html?href=' + encodeURIComponent(href), {x: left, y: top, width: w, height: h},
  function (win) {
    window.popup = win.window;

    // do not open the window and open it in external browser
    win.on('new-win-policy', function (frame, url, policy) {
      policy.ignore();
      nw.Shell.openExternal(url);
    });

    win.window.id = 'popup';
    win.window.config = App.config;
    win.focus();
  });
  */
}

function openImageview (href, more) {
  if (window.popup) window.popup.close();
  var width = 1000;
  var height = 650;
  var x = (screen.width / 2) - (width / 2);
  var y = (screen.height / 2) - (height / 2);
  var win = new BrowserWindow({
    width, height, x, y,
    center: true,
    backgroundColor: '#000',
    webPreferences: {
      nodeIntegration: false,
    },
  });
  win.id = 'popup';
  var url = `file://${__dirname}/viewer.html?img=${encodeURIComponent(href)}&more=${encodeURIComponent(more)}`
  win.loadURL(url);
  window.win = win;
  /*
  nw.Window.open('app/viewer.html?img=' + encodeURIComponent(href) + '&more=' + encodeURIComponent(more), 
  {x: left, y: top, width: w, height: h},
  function (win) {
    window.popup = win.window;
    win.window.id = 'popup';
    win.window.config = App.config;
    win.focus();
  });
  */
}

function isOffscreen (t, el) {
  return ((el.offsetLeft + el.offsetWidth) < 0 || (el.offsetTop + el.offsetHeight) < 0 ||
    (el.offsetLeft + el.getClientRects()[0].width < t.scrollLeft || el.offsetleft > t.scrollLeft + t.getClientRects()[0].width) ||
    (el.offsetTop + el.getClientRects()[0].height + Number(t.style.paddingTop.replace('px','')) < t.scrollTop || el.offsetTop > t.scrollTop + t.getClientRects()[0].height + Number(t.style.paddingTop.replace('px',''))));
}

function getOffscreenHPos (t, el) {
  if (el.offsetTop + el.getClientRects()[0].height < t.scrollTop)
    return -1;
  else if (el.offsetTop > t.scrollTop + t.getClientRects()[0].height)
    return 1;
  else return 0;
}

function createTempFile (content, callback) {
  let tmpdir = os.tmpdir();
  let filename = 'krhTemp-' + Date.now();
  let filepath = path.join(tmpdir, filename);
  fs.writeFile(filepath, content, 'binary', (error) => {
    callback(error, filepath);
  });
}

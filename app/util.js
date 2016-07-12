var os = require('os');
var fs = require('fs');
var path = require('path');

function urlify(text) {
var urlRegex = /(https?:\/\/[^\s]+)/g;
	return text.replace(urlRegex, function(url) {
		//return '<a href="' + url + '" target="_blank">' + url + '</a>';
	    return '<a href="javascript:void(0)" onclick="openPopup(\'' + url + '\')">' + url + '</a>';
	})
}

function tagRemove(text) {
var regex = /(<([^>]+)>)/ig;
	return text.replace(regex, "");
}

function openExternal(href) {
	require('nw.gui').Shell.openExternal( href );
	/*if(event)
	{
		event.stopPropagation();
		event.stopImmediatePropagation();
	}*/
}
function openPopup(href) {
	/*
	var gui = require('nw.gui');
	var win = gui.Window.open (href, {
	  position: 'center',
	  width: 1000,
	  height: 800
	});*/

  var w = 1000;
  var h = 800;
  var left = (screen.width/2)-(w/2);
  var top = (screen.height/2)-(h/2);
  var win = window.open(href, 'popup');
  win.resizeTo(w, h);
  win.moveTo(left, top);

  var wind = nw.Window.get(win)
  wind.focus();
}

function openImageview(href, more) {
	if(window.popup) nw.Window.get(window.popup).close(true);
	var w = 1000;
	var h = 650;
	var left = (screen.width/2)-(w/2);
	var top = (screen.height/2)-(h/2);
	nw.Window.open('app/viewer.html?img=' + encodeURIComponent(href) + '&more=' + encodeURIComponent(more), 
	{x: left, y: top, width: w, height: h},
	function(win) {
		window.popup = win.window;
		win.window.id = 'popup';
		win.window.config = App.config;
	    win.focus();
  });
}

function isOffscreen(t, el) {
	return ((el.offsetLeft + el.offsetWidth) < 0 || (el.offsetTop + el.offsetHeight) < 0 ||
		(el.offsetLeft + el.getClientRects()[0].width < t.scrollLeft || el.offsetleft > t.scrollLeft + t.getClientRects()[0].width) ||
		(el.offsetTop + el.getClientRects()[0].height + Number(t.style.paddingTop.replace('px','')) < t.scrollTop || el.offsetTop > t.scrollTop + t.getClientRects()[0].height + Number(t.style.paddingTop.replace('px',''))));
}

function getOffscreenHPos(t, el) {
	if (el.offsetTop + el.getClientRects()[0].height < t.scrollTop)
		return -1;
	else if (el.offsetTop > t.scrollTop + t.getClientRects()[0].height)
		return 1;
	else return 0;
}

function createTempFile(content, callback) {
	let tmpdir = os.tmpdir();
	let filename = 'krhTemp-' + Date.now();
	let filepath = path.join(tmpdir, filename);
	fs.writeFile(filepath, content, 'binary', (error) => {
		callback(error, filepath);
	});
}

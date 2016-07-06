
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
  	window.popup = nw.Window.open('app/viewer.html?img=' + encodeURIComponent(href) + '&more=' + encodeURIComponent(more), 
	function(win) {
		var w = 1000;
		var h = 650;
		var left = (screen.width/2)-(w/2);
		var top = (screen.height/2)-(h/2);

		window.popup = win.window;
		win.id = 'popup';
		win.width = w;
		win.height = h;
		win.x = left;
		win.y = top;
	    win.focus();
  });
}
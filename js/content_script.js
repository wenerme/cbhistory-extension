/* global chrome,U5 */
"use strict";

//Element.prototype.prependChild = function(child) { this.insertBefore(child, this.firstChild); };

(function(){
//=========================在页面中注入代码============================//
	// 因为运行的时候 还没有head,所以注入到 HTML
	var html = document.querySelector("html");
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = chrome.extension.getURL('js/cbhistory.js');

	// 通信标签
	var meta = document.createElement('meta');
	meta.name = 'cbhistory';
	meta.id = 'cbhistory';
	meta.addEventListener("ready", function()
	{
//		JSON.parse(meta.getAttribute("data"));
		U5.sendMessage("showIcon");
	});

	html.appendChild(meta);
	html.appendChild(script);

})();
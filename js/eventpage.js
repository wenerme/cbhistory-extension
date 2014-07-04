/**
 * @preserve
 * @author: wener <wenermail@gmail.com>
 * @version: 1.0
 * @copyright: wener 2013
 *
 * @overview A javascript file
 */

/* jshint globalstrict: true */
/* global chrome, U5 */

"use strict";// strip this line

/** @const */
var DEBUG = true;// strip this line
/* strip this line
 var DEBUG = false;
// var contentScriptFilePath = "js/cs.js";
 strip this line */
//var contentScriptFilePath = "js/contentscript.js";// strip this line

var tabTable = {};

var DEFAULT_SERVERS =
{
	"本地测试服务器":"http://localhost:8080/"
	,"JAE 服务器":"http://cbhistory.jd-app.com/"
};

var MessageHandler =
{
	getSetting: function (request, sender, sendResponse)
	{
		sendResponse((localStorage['setting'] && JSON.parse(localStorage['setting'])) || {});
	},
	setSetting: function (request, sender, sendResponse)
	{
		localStorage['setting'] = JSON.stringify(request.data);
		sendResponse(true);
	},
	log: function (request)
	{
		console.log(request.data);
	},
	OpenTab: function (request, sender, sendResponse)
	{
		chrome.tabs.create({url: request.data.url}, function (tab)
		{
			tabTable[tab.id] = request.data;
		});
		sendResponse(true);
	},
	getTabOption: function (request, sender, sendResponse)
	{
		if (sender && sender.tab)
		{
			sendResponse(tabTable[sender.tab.id]);
		} else
		{
			sendResponse({});
		}
	},
	showIcon: function (request, sender)
	{
		var tabId = sender.tab.id;
//		chrome.pageAction.setIcon({path:"images/logo-16.png"});
		chrome.pageAction.setPopup({tabId:tabId, popup:"popup.html"});
		chrome.pageAction.show(tabId);
	},
	/**
	 * 获取一个可用的服务器
	 */
	getServer: function()
	{},
	getServerList: function()
	{},
	setServerList: function()
	{}
};
U5.BindMessageHandlerTo(MessageHandler, chrome.runtime.onMessage);

// 点击图标的时候输出一个当前tab信息,作为测试
chrome.pageAction.onClicked.addListener(function (tab)
{
	console.log(tab);
});
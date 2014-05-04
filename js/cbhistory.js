/* global Event */
"use strict";

var cmtXhr = null;
var fakeCmtRequestUrl = "http://localhost:8080/cmt";

(function() {

	// region 因为不能导入 U5,所以造一个非常简单的logger
	var Logger = function()
	{};
	Logger.prototype.debug = function()
	{
		console.log.apply(console, arguments);
	};
	Logger.prototype.error = function()
	{
		console.error.apply(console, arguments);
	};
	Logger.prototype.info = function()
	{
		console.info.apply(console, arguments);
	};
	// endregion

	var log = new Logger();
	var cbhMeta = document.querySelector("#cbhistory");
	var params = null;
	var open = XMLHttpRequest.prototype.open;
	var send = XMLHttpRequest.prototype.send;
	// 一般没有评论的回复都是这样的
	// cnbeta{"cmntdict":[],"hotlist":[],"cmntlist":[],
	// var regNoComment = btoa('cnbeta{"cmntdict":[],"hotlist":[],"cmntlist":[]').replace(/=$/,'');
	// 预算出来的结果为
	// Y25iZXRheyJjbW50ZGljdCI6W10sImhvdGxpc3QiOltdLCJjbW50bGlzdCI6W10
	var regNoComment = /^Y25iZXRheyJjbW50ZGljdCI6W10sImhvdGxpc3QiOltdLCJjbW50bGlzdCI6W10/;

	XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
		if(url === '/cmt')// 请求评论的时候 url 为 /cmt
		{
			log.debug("Found comment xhr.");
			cmtXhr = this;

			this.send = function(args)
			{
				params = args;
				log.debug("send with params:", args);
				return send.apply(this, arguments);
			};

			// 监听该xhr
			this.addEventListener("readystatechange", function()
			{
				if(this.readyState === 4)
				{
					log.debug("Finished get response");
					var responseText = cmtXhr.responseText;
//					var response = cmtXhr.response;
					var result = JSON.parse(responseText)['result'];

					// 如果没有回复,则尝试从私有服务器请求
					if(regNoComment.test(result))
					{
						// 无评论信息,则同步请求私有的评论服务器
						log.info("该页面无评论信息");
						//
						cbhMeta.dispatchEvent(new Event("ready"));

						// 同步调用其他的评论服务器
						var fakeXhr = new XMLHttpRequest();
						fakeXhr.open("GET", fakeCmtRequestUrl+"?"+params, false);
						fakeXhr.send();
						var fakeResponseText;
						// 确保即便是服务器请求失败,本地也能看到返回.
						if(fakeXhr.status === 200)
						{
							fakeResponseText = fakeXhr.responseText;
							// 如果服务器也没有这个的评论,则使用原先的返回信息
							if(regNoComment.test(JSON.parse(fakeResponseText)['result']))
							{
								log.info("服务器也没有该条消息的评论信息.");
								fakeResponseText = responseText;
							}
						}else{
							fakeResponseText = responseText;
						}

						// 完成后会请求这个
						cmtXhr.__defineGetter__("responseText",function()
						{
							return fakeResponseText;
						});
					}

				}
			}, false);// addEventListener
		}// if

		open.call(this, method, url, async, user, pass);
	};
})();

/**
 * @preserve
 * @author: wener <wenermail@gmail.com>
 * @version: 1.0
 * @copyright: wener 2013
 *
 * @overview A javascript file
 */
/* jshint globalstrict: true, expr: true,devel:true, jquery: true, newcap: false */
/* global chrome */
"use strict";// strip this line

/**
 * U5 = utils
 * @class
 * @name U5
 */

// 当前上下文对象
(function(U5)
{
	var ctx = {
		DEBUG:true
	};

	U5['Context'] = ctx;

})(window.U5 || (window.U5 = {}));

// for
// 基本 扩展
(function(U5)
{
	/**
	 * 格式化字符串
	 * 格式为 'param1 {0} param2 {1}'
	 * @returns {string|void}
	 */
	U5['format'] = function(strformat)
	{
		var args = arguments;

		return strformat.replace(/{(\d+)}/g, function(match, number)
		{
			number ++;// 第一个参数为格式参数
			return typeof args[number] !== 'undefined' ? args[number] : match;
		});
	};

})(window.U5 || (window.U5 = {}));

// chrome 扩展
(/** @param {U5} U5 */function(U5)
{
	var DEBUG = true;// strip this line
	/* strip this line
	 var DEBUG = false;
	 strip this line */

	/**
	 * 消息结构
	 * @struct
	 * @dict
	 * @constructor
	 */
	U5['MessageData'] = function ()
	{
		/**
		 * @type {string}
		 */
		this.action = '';
		/**
		 * @type {*}
		 */
		this.data = {};
	};

	/**
	 * 绑定处理句柄到事件
	 * @param handlerTable
	 * @param {{addListener:function}} event
	 */
	U5['BindMessageHandlerTo'] = function (handlerTable, event)
	{
		/** @return {*} */
		function OnHandler(request, sender, sendResponse)
		{
			DEBUG && console.warn('I got message ', request, ' sender is ', sender);

			//
			if(typeof request === 'string')
			{
				var action = request;
				request = new U5.MessageData();
				request.action = action;
			}
			//
			var handler = handlerTable[request.action];
			if(typeof handler === 'function')
			{
				return handler(request, sender, sendResponse);
			}else{
				DEBUG && console.error(request.action + ' action not found');
			}
		}
		//
		event.addListener(OnHandler);
	};

	/**
	 * 发送消息
	 * @param action
	 * @param {U5.MessageData?} data
	 * @param {function(U5.MessageData)} callback
	 */
	U5['sendMessage'] = function (action, data, callback)
	{
		var request = {action: action};
		if(typeof action !== 'string')
		{
			throw new Error('action must be a string.');
		}
		if(typeof data !== 'function')
		{
			request.data = data;
		}else if(!!callback){
			throw new Error("argument error, unused callback.");
		}else{
			callback = data;
		}
		//
		chrome.runtime.sendMessage(request, callback);
	};

	/**
	 * 加载配置
	 * @param callback
	 */
	U5['LoadSetting'] = function (callback)
	{
		U5.sendMessage('getSetting',callback);
	};

	/**
	 * 存储配置
	 * @param setting
	 * @param callback
	 */
	U5['SaveSetting'] = function (setting,callback)
	{
		U5.sendMessage('setSetting', setting, callback);
	};

	/**
	 * 加载配置到界面,data-setting属性指定setting项
	 * @param setting
	 */
	U5['LoadSettingToUI'] = function (setting)
	{
		$('[data-setting]')
			.each(function()
			{
				var $this = $(this);
				var val;
				val = setting[$this.data('setting')];
				// 根据不同的类型进行值的转换
				if($this.is('select[data-role=slider]'))// 这里没有使用jqmData来判断,考虑兼容问题
				{
					$this.val(val?'on':'off');
				}else if($this.is('[type=checkbox]'))
				{
					$this.prop('checked',!!val);
				}else{
					$this.val(val);
				}
			});
	};
	/**
	 * 从页面获取配置,data-setting属性指定setting项
	 * @return {object}
	 */
	U5['GetSettingFromUI'] = function ()
	{
		var setting = {};
		$('[data-setting]').each(function()
		{
			var $this = $(this);
			/**
			 * @type {string|boolean}
			 */
			var val;
			val = $this.val();
			// 根据不同的类型进行值的转换
			if(/^on|off$/.test(val))
			{
				val = val === 'on';
			}else if($this.is('[type=checkbox]'))
			{
				val = $this.prop('checked');
			}
			//
			setting[$this.data('setting')] = val;
		});
		return setting;
	};
})(window.U5 || (window.U5 = {}));



// 日志 扩展
(/** @param {U5} U5 */function(U5)
{
	// 非常简单的logger
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


	U5['Logger'] = function ()
	{
		return new Logger();
	};

})(window.U5 || (window.U5 = {}));

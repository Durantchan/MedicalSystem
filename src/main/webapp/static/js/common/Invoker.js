/**
 * Ajax请求
 * 依赖jquery.min.js，Utils.js，json2.js
 */
function Invoker(){
	
}

/**
 * 异步请求
 * @param action
 * @param method
 * @param params
 * @param success
 * @param error
 * @param loading
 */
Invoker.prototype.async = function(action, method, params, success, error, loading){
	this._ajaxCall(true, action, method, params, success, error, loading);
};

/**
 * 同步请求
 * @param action
 * @param method
 * @param params
 * @param success
 * @param error
 * @param loading
 */
Invoker.prototype.sync = function(action, method, params, success, error, loading){
	this._ajaxCall(false, action, method, params, success, error, loading);
};

/**
 * ajax请求
 * @param async
 * @param action
 * @param method
 * @param params
 * @param success
 * @param error
 * @param loading
 */
Invoker.prototype._ajaxCall = function(async, action, method, params, success, error, loading){
	var _self = this;
	
	//第6、7个是可选参数
	if(typeof arguments[5] === "boolean"){
		_self.loading = arguments[5];
	}
	else{
		_self.loading = loading;
	}
	
	_self._loading();
	
	var context_path = Utils.getContextPath();
	var url = context_path + "/" + action + "/" + method + ".do";
	
	if(!params || (typeof(params) === "string" && !jQuery.trim(params))){
		params = "{}";
	}
	
	try{
		params = typeof(params) !== "string" ? JSON.stringify(params) : params;
	}
	catch(e){}
	
	jQuery.ajax({
		url: url,
		async: async,
		contentType: "application/json;charset=UTF-8",
		data: params,
		dataType: "text",
		type: "POST",
		dataFilter: function(data, type){
			try{
				data = jQuery.parseJSON(data);
			}
			catch(e){}
			
			return data;
		},
		success: function(data){
			_self._loaded();
			if(jQuery.isFunction(success)){
				success.call(_self, data);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			_self._loaded();

			var status = XMLHttpRequest.status;
			switch(status){
				case 400 :
					_self._badRequestHandler(status, action, method);
					break;
				case 403 :
					_self._forbiddenHandler(status, action, method);
					break;
				case 404 :
					_self._notFoundHandler(status, action, method);
					break;
				case 500 :
					_self._serverErrorHandler(XMLHttpRequest);
					break;
				case 503 :
					_self._serviceUnavailableHandler(status, action, method);
					break;
				case 999:
					_self._loginTimeoutHandler();
					break;
				default :
					_self._serviceUnavailableHandler(status, action, method);
			}
			
			if(jQuery.isFunction(error)){
				error.apply(_self, arguments);
			}
		}
	});
};

/**
 * 显示loading信息
 */
Invoker.prototype._loading = function(){
	var _self = this;
	if(_self.loadcount === undefined){
		_self.loadcount = 0;
	}
	//loading计数器，防止重复显示loading
	_self.loadcount++;
	
	if(_self.loading !== false && _self.loadcount == 1){
		layer.load();
	}
};

/**
 * 移除loading信息
 */
Invoker.prototype._loaded = function(){
	var _self = this;
	if(_self.loadcount === undefined){
		_self.loadcount = 0;
	}
	//loading计数器，防止重复显示loading
	_self.loadcount--;
	
	if(_self.loadcount < 1){
		layer.closeAll('loading');
	}
};

Invoker.prototype._badRequestHandler = function(status, action, method){
	Utils.alert("状态码：" + status + "\n服务：" + action + "." + method + "\n信息：请求的服务不存在", 5000);
};

Invoker.prototype._forbiddenHandler = function(status, action, method){
	Utils.alert("状态码：" + status + "\n服务：" + action + "." + method + "\n信息：请求被禁止", 5000);
};

Invoker.prototype._notFoundHandler = function(status, action, method){
	Utils.alert("状态码：" + status + "\n服务：" + action + "." + method + "\n信息：请求的资源不可用", 5000);
};

Invoker.prototype._serverErrorHandler = function(XMLHttpRequest){
	var response_text = XMLHttpRequest.responseText;
	response_text = response_text.replace(/\n/g, "\\n");//回车
	response_text = response_text.replace(/\r/g, "\\r");//换行
	response_text = response_text.replace(/\t/g, "\\t");//水平制表符
	var index = response_text.lastIndexOf("}");
	if(index != response_text.length -1){
		response_text = response_text.substring(0, index + 1);
	}
	

	if(jQuery.isEmptyObject(response_text) || "" == response_text){
		Utils.alert("非常抱歉，服务器目前不可用，请您稍候重试", 5000);
		return;
	}
	
	try{
		var response = jQuery.parseJSON(response_text);
		Utils.alert(response.message);
		//alert(response.stack);
//		var more_id = "more_" + Math.round(Math.random() * 10000);
//		var more = "<img id=" + more_id + " src='" + Utils.getContextPath() + "/zop/css/images/more.jpg' style='vertical-align:middle;cursor:pointer;margin-left:5px;'/>";
//		Utils.show(response.message + more, 5000);
//		
//		//点击more显示堆栈信息
//		$("#" + more_id).bind("click", {stack: response.stack}, function(e){
//			var content = "<div style='overflow:hidden;'><textarea style='overflow:auto;width:580px;height:359px;' readonly='readonly'>" + e.data.stack + "</textarea></div>";
//			$(content).dialog({
//				title: "堆栈信息",
//				width: 600,
//				height: 400,
//				modal: true,
//				shadow: false,
//				onClose: function(){
//					$(this).dialog("destroy");
//                }
//			});
//		});
	}
	catch(e){
		alert(response_text);
	}
};

Invoker.prototype._serviceUnavailableHandler = function(status, action, method){
	Utils.alert("状态码：" + status + "\n服务：" + action + "." + method + "\n信息：服务器不可用", 5000);
};

Invoker.prototype._loginTimeoutHandler = function(status, action, method){
	layer.alert("登录超时，请重新登录系统", {
		skin: "layui-layer-lan",
		time: 3000,
		end: function(){
			window.location.href = "/iotportal/login.html";
		}
	});
};

var Invoker = new Invoker();
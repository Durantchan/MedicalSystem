function Common(){
	
}

/**
 * 组件库定义(包含依赖)
 */
Common.prototype.libs = {
	js: {
		jquery: {
			url: "/static/lib/jquery.min.js"
		},
		json: {
			url: "/static/lib/json2.js"
		},
		utils: {
			url: "/static/js/common/Utils.js",
			depjs: ["jquery"]
		},
		md5: {
			url: "/static/lib/md5.min.js"
		},
		invoker: {
			url: "/static/js/common/Invoker.js",
			depjs: ["jquery", "utils", "json"]
		},
		query: {
			url: "/static/lib/jquery.query-object.js"
		},
		bootstrap: {
			url: "/static/lib/bootstrap/js/bootstrap.min.js",
			depcss: ["bootstrap"]
		},
		easyui: {
			url: ["/static/lib/easyui/jquery.easyui.min.js", 
			      "/static/lib/easyui/locale/easyui-lang-zh_CN.js",
			      "/static/js/common/easyuiExt.js"],
			depjs: ["jquery"],
			depcss: ["easyui"]
		},
		placeholder: {
			url: "/static/lib/jquery.placeholder.js",
			depjs: ["jquery"]
		},
		csrfguard: {////自服务门户
			//<!-- OWASP CSRFGuard JavaScript Support --> added by cai.zhengluan
			url: "/JavaScriptServlet"
			//url: "/static/js/common/csrfguard.portal.js"	//静态化js 放于web前端，减少网络开销
		}
	},
	css: {
		bootstrap: ["/static/lib/bootstrap/css/bootstrap.min.css", 
		            "/static/lib/bootstrap/css/bootstrap-theme.min.css"],
		easyui: "/static/lib/easyui/themes/bootstrap/easyui.css"
	}
};

/**
 * 组件组，组件组的key不能与组件库(libs.js)的key重复
 */
Common.prototype.groups = {
	//kernel: ["jquery", "invoker"]
	kernel: ["jquery", "invoker", "csrfguard"]/// 加入安全csrfguard防御
};

Common.prototype.importLibs = function(libIds){
	if(typeof libIds === "string"){
		libIds = libIds.split(",");
	}
	
	if(!libIds || libIds.length < 1){
		return;
	}
	
	var _self = this;
	var jsLibIds = [];
	var cssLibIds = [];
	
	for(var i = 0; i < libIds.length; i++){
		var lib_id = libIds[i].trim();
		_self.addLib(jsLibIds, cssLibIds, lib_id);
	}
	
	for(var i = 0; i < cssLibIds.length; i++){
		var css_lib_id = cssLibIds[i];
		var css_url = _self.libs.css[css_lib_id];
		if(ArrayUtils.isArray(css_url) && css_url.length > 0){
			for(var j = 0; j < css_url.length; j++){
				var url = css_url[j];
				if(!url){
					continue;
				}
				_self.importLib("css", url);
			}
		}
		else if(css_url){
			_self.importLib("css", css_url);
		}
	}
	
	for(var i = 0; i < jsLibIds.length; i++){
		var js_lib_id = jsLibIds[i];
		var jsLib = _self.libs.js[js_lib_id];
		if(jsLib && jsLib.url){
			if(ArrayUtils.isArray(jsLib.url) && jsLib.url.length > 0){
				for(var j = 0; j < jsLib.url.length; j++){
					var url = jsLib.url[j];
					if(!url){
						continue;
					}
					_self.importLib("js", url);
				}
			}
			else if(jsLib.url){
				_self.importLib("js", jsLib.url);
			}
		}
	}
};

Common.prototype.addLib = function(jsLibIds, cssLibIds, lib_id){
	var _self = this;
	//先从组件组中查找
	if(_self.groups[lib_id] && _self.groups[lib_id].length > 0){
		var libIds = _self.groups[lib_id];
		for(var i = 0; i < libIds.length; i++){
			_self.addLib(jsLibIds, cssLibIds, libIds[i]);
		}
	}
	else{
		if(!jsLibIds.uniqueAdd(lib_id)){
			return;
		}
		
		if(!_self.libs.js[lib_id]){
			return;
		}
		
		//添加依赖组件
		if(_self.libs.js[lib_id].depjs && _self.libs.js[lib_id].depjs.length > 0){
			var depjs = _self.libs.js[lib_id].depjs;
			for(var i = 0; i < depjs.length; i++){
				_self.addLib(jsLibIds, cssLibIds, depjs[i]);
			}
		}
		
		//添加依赖样式
		if(_self.libs.js[lib_id].depcss && _self.libs.js[lib_id].depcss.length > 0){
			var depcss = _self.libs.js[lib_id].depcss;
			for(var i = 0; i < depcss.length; i++){
				cssLibIds.uniqueAdd(depcss[i]);
			}
		}
	}
	
};

Common.prototype.importLib = function(type, url){
	if(!type || !url){
		return;
	}
	
	var context_path = this.getContextPath();
	
	if(type.toLowerCase() === "js"){
		document.write("<script type='text/javascript' src='" + context_path + url + "'></script>");
	}
	else if(type.toLowerCase() === "css"){
		document.write("<link rel='stylesheet' type='text/css' href='" + context_path + url + "'>");
	}
};

Common.prototype.getContextPath = function(){
	var pathname = document.location.pathname;
	var index = pathname.substr(1).indexOf("/");
	var context_path = "";
	
	if(index !== -1){
		context_path = pathname.substr(0, index + 1);
	}
	
	return context_path;
};

/**String扩展 start*/
String.prototype.trim = function(){
	return this.replace(/(^\s*)|(\s*$)/g, "");
};

String.prototype.ltrim = function(){
	return this.replace(/(^\s*)/g, "");
};

String.prototype.rtrim = function(){
	return this.replace(/(\s*$)/g, "");
};
/**String扩展 end*/

/**Array扩展 start*/
Array.prototype.contains = function(o){
	for(var i = 0; i < this.length; i++){
		if(this[i] === o){
			return true;
		}
	}
	
	return false;
};

Array.prototype.uniqueAdd = function(o){
	if(!this.contains(o)){
		this.push(o);
		return true;
	}
	
	return false;
};

var ArrayUtils = {
	isArray: function(o){
		return Object.prototype.toString.call(o) === "[object Array]";
	}
};
/**Array扩展 end*/

(function(){
	var libIds = [];
	
	var metas = document.getElementsByTagName("meta");
	if(metas && metas.length > 0){
		for(var i = 0; i < metas.length; i++){
			var meta = metas[i];
			if(typeof meta.httpEquiv !== "string" || typeof meta.content !== "string"){
				continue;
			}
			
			if(meta.httpEquiv.toLowerCase() !== "libs"){
				continue;
			}
			
			libIds = meta.content.split(",");
		}
		libIds.push("fixFile");
	}
	
	if(!libIds.contains("kernel")){
		//默认添加kernel组的组件
		libIds = ["kernel"].concat(libIds);
	}
	var common = new Common();
	common.importLibs(libIds);
	
	//屏蔽回退事件
	function disablebs(e){
		var event = e || window.event;
		if(event && event.keyCode === 8){//退格键
			var doPrevent = true;
			var dom = event.target || event.srcElement;
			
			if(!dom){
				return;
			}
			
			if(dom.tagName.toLowerCase() === "input" || dom.tagName.toLowerCase() === "textarea"){
				if(!dom.readOnly && !dom.disabled){
					doPrevent = false;
				}
			}
			
			if(doPrevent){
				//取消事件的默认动作
				if(event.preventDefault){
					event.preventDefault();
				}
				else{
					event.returnValue = false;
				}
			}
		}
	}
	
	if(document.attachEvent){//IE
		document.attachEvent("onkeydown", disablebs);
	}
	else if(document.addEventListener){
		document.addEventListener("keydown", disablebs);
	}
})();
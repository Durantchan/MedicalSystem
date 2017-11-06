var WYUtil = {
	pop_data : null,
	static_data : null,
	pop_result : "",
	pop_call : null,
	setInputDomain : function(json,context) {
		var me = this;
		context =context || $("body");
		if(typeof(context) =="string")
			context =$("#"+context);
		for(p in json){
			var currJq =$("[dbField='"+p+"'][fieldType='db']",context);
			if(currJq && currJq.length>0){
				//静态编码转义
				var is_attrCode = false;
				var attr_value_name = '';
				var attr_code = currJq.attr("attrCode");
				if(attr_code != undefined && attr_code != null && attr_code != ''){
					is_attrCode = true;
					var attrValues = me.getItem(attr_code);
					var attr_value_name = '';
					if(attrValues != null){
						for(var i=0;i<attrValues.length;i++){
							if(attrValues[i].attr_value == json[p] ){
								attr_value_name = attrValues[i].attr_value_name;
								break;
							}
						}
					}
				}
				
				if((currJq[0].tagName=='INPUT' && currJq[0].type !='radio' ) || currJq[0].tagName=='SELECT' || currJq[0].tagName=='TEXTARES'){
					currJq.val(json[p]);
					currJq[0].tagName=='SELECT' && $(currJq).trigger("change");
				}else if(currJq[0].tagName=='INPUT' && currJq[0].type =='radio'   ){
					var currJq2=$("[dbField='"+p+"'][fieldType='db'][type='radio'][value='"+json[p]+"']",context);
					currJq2.attr("checked","checked");
				}else if(currJq[0].tagName=='IMG'){
					if(json[p]){
						currJq.attr({"src":json[p],"title":json["username"],"alt":json["username"]});
					}
				}else if(currJq[0].tagName=='DIV'){
					if($("[dbField='"+p+"'][fieldType='db']",context).eq(0).hasClass("inp-select")){
						$("[dbField='"+p+"'][fieldType='db']",context).eq(0).find("ul li[val='"+json[p]+"']").trigger('click');
					}
				}else if(currJq[0].tagName=='TEXTAREA'){
					currJq.val(json[p]);
				}else{
					if(is_attrCode){
						currJq.html(attr_value_name);
					}else{
						currJq.html(json[p]);
					}
				}
			}
		}
	},
	
	getInputDomain : function(context) {
		var iv = {}, me = this;
		context = context || $("body");
		if (typeof (context) == "string")
			context = $("#" + context);
		$("input[type='checkbox'][fieldType='db']:checked", context).each(
				function() {
					var $obj = $(this);
					var ivId = $obj.attr("dbField") || $obj.attr("name");
					// 真值
					var ivVal = $obj.val();
					me.setObjVal(iv, ivId, ivVal);
					// 显示值
					var ivValDesc = $obj.attr("cname");
					me.setObjVal(iv, ivId + "_desc", ivValDesc);
				});

		// text
		$("input[type='text'][fieldType='db']", context).each(function() {
			var $obj = $(this);
			var ivId = $obj.attr("dbField") || $obj.attr("id");
			var ivVal = $obj.val();
			me.setObjVal(iv, ivId, ivVal);

		});
		$("input[type='password'][fieldType='db']", context).each(function() {
			var $obj = $(this);
			var ivId = $obj.attr("dbField") || $obj.attr("id");
			var ivVal = $obj.val();
			me.setObjVal(iv, ivId, ivVal);

		});

		// hidden
		$("input[type='hidden'][fieldType='db']", context).each(function() {
			var $obj = $(this);
			var ivId = $obj.attr("dbField") || $obj.attr("id");
			var ivVal = $obj.val();
			me.setObjVal(iv, ivId, ivVal);
		});

		// select
		$("[fieldType='db']select option:selected", context).each(
				function() {
					var $obj = $(this);
					var ivId = $obj.parent().attr("dbField")
							|| $obj.parent().attr("id");
					// 真值
					var ivVal = $obj.val();
					me.setObjVal(iv, ivId, ivVal);
					// 显示值
					var ivValDesc = $obj.text();
					me.setObjVal(iv, ivId + "_desc", ivValDesc);

				});
		// textarea
		$("textarea[fieldType='db']", context).each(function() {
			var $obj = $(this);
			var ivId = $obj.attr("dbField") || $obj.attr("id");
			// 真值
			var ivVal = $obj.val();
			me.setObjVal(iv, ivId, ivVal);
		});

		$("span[fieldType='db']", context).each(function() {
			var $obj = $(this);
			var ivId = $obj.attr("dbField") || $obj.attr("id");
			// 真值
			var ivVal = $obj.text();

			me.setObjVal(iv, ivId, ivVal);

		});
		$("a[fieldType='db']", context).each(function() {
			var $obj = $(this);
			var ivId = $obj.attr("dbField") || $obj.attr("name");
			// 真值
			var ivVal = $obj.attr("value");
			me.setObjVal(iv, ivId, ivVal);

		});
		// radio
		$("input[type='radio'][fieldType='db']:checked", context).each(
				function() {
					var $obj = $(this);
					var ivId = $obj.attr("dbField") || $obj.attr("name");
					// 真值
					var ivVal = $obj.val();

					me.setObjVal(iv, ivId, ivVal);
					// 显示值
					var ivValDesc = $obj.next("span").text();
					me.setObjVal(iv, ivId + "_desc", ivValDesc);
				});
		// select
		$("div.inp-select[fieldType='db']", context).each(
				function() {
					var $obj = $(this);
					var ivId = $obj.attr("dbField") || $obj.attr("name");
					var ivVal = $obj.find("input.input_selectValue").val();
					me.setObjVal(iv, ivId, ivVal);
				});
		return iv;
	},
	
	/**
	 * 只取显示的数据域
	 */
	getInputDomainByvisible : function(context) {
		var iv = {}, me = this;
		context = context || $("body");
		if (typeof (context) == "string")
			context = $("#" + context);
		$("input[type='checkbox'][fieldType='db']:checked", context).each(
				function() {
					var $obj = $(this);
					if ($obj.is(":visible")) {
						var ivId = $obj.attr("dbField") || $obj.attr("name");
						if (!iv[ivId]) {
							iv[ivId] = [];
						}
						// 真值
						var ivVal = $obj.val();
//						me.setObjVal(iv, ivId, ivVal);
						iv[ivId].push(ivVal);
						// 显示值
						var ivValDesc = $obj.next().text();
						me.setObjVal(iv, ivId + "_desc", ivValDesc);
					}
				});

		// text
		$("input[type='text'][fieldType='db']", context).each(function() {
			var $obj = $(this);
			if ($obj.is(":visible")) {
				var ivId = $obj.attr("dbField") || $obj.attr("id");
				var ivVal = $obj.val();
				me.setObjVal(iv, ivId, ivVal);
			}

		});
		$("input[type='password'][fieldType='db']", context).each(function() {
			var $obj = $(this);
			if ($obj.is(":visible")) {
				var ivId = $obj.attr("dbField") || $obj.attr("id");
				var ivVal = $obj.val();
				me.setObjVal(iv, ivId, ivVal);
			}

		});

		// hidden
		$("input[type='hidden'][fieldType='db']", context).each(function() {
			var $obj = $(this);
//			if ($obj.is(":visible")) {
				var ivId = $obj.attr("dbField") || $obj.attr("id");
				var ivVal = $obj.val();
				me.setObjVal(iv, ivId, ivVal);
//			}
		});

		// select
		$("[fieldType='db']select option:selected", context).each(
				function() {
					var $obj = $(this);
					if ($obj.parent().is(":visible")) {
						var ivId = $obj.parent().attr("dbField")
								|| $obj.parent().attr("id");
						// 真值
						var ivVal = $obj.val();
						me.setObjVal(iv, ivId, ivVal);
						// 显示值
						var ivValDesc = $obj.text();
						me.setObjVal(iv, ivId + "_desc", ivValDesc);
					}

				});
		// textarea
		$("textarea[fieldType='db']", context).each(function() {
			var $obj = $(this);
			if ($obj.is(":visible")) {
				var ivId = $obj.attr("dbField") || $obj.attr("id");
				// 真值
				var ivVal = $obj.val();
				me.setObjVal(iv, ivId, ivVal);
			}
		});

		$("span[fieldType='db']", context).each(function() {
			var $obj = $(this);
			if ($obj.is(":visible")) {
				var ivId = $obj.attr("dbField") || $obj.attr("id");
				// 真值
				var ivVal = $obj.text();

				me.setObjVal(iv, ivId, ivVal);
			}

		});
		$("a[fieldType='db']", context).each(function() {
			var $obj = $(this);
			if ($obj.is(":visible")) {
				var ivId = $obj.attr("dbField") || $obj.attr("name");
				// 真值
				var ivVal = $obj.attr("value");
				me.setObjVal(iv, ivId, ivVal);
			}

		});
		// radio
		$("input[type='radio'][fieldType='db']:checked", context).each(
				function() {
					var $obj = $(this);
					if ($obj.is(":visible")) {
						var ivId = $obj.attr("dbField") || $obj.attr("name");
						// 真值
						var ivVal = $obj.val();

						me.setObjVal(iv, ivId, ivVal);
						// 显示值
						var ivValDesc = $obj.next("span").text();
						me.setObjVal(iv, ivId + "_desc", ivValDesc);
					}
				});
		return iv;
	},
	
	setObjVal : function(obj, id, val) {
		if (obj == "undefined" || null == obj || null == id || '' == id)
			return;
		var beforeVal = obj[id];
		if(beforeVal && beforeVal != ''){
			beforeVal = beforeVal + ","+val;
			obj[id] = beforeVal;
		}else{
			obj[id] = val;
		}
		
		
	},
	apply : function(o, c, defaults) {
		if (defaults) {
			WYUtil.apply(o, c);
		}
		if (o && c && typeof c == 'object') {
			for ( var p in c) { 					// 字符串的false转换为boolean
				if (c[p] == "false") {
					c[p] = false;
				}
				if (c[p] == "true") {
					c[p] = true;
				}
				o[p] = c[p];
			}
		}
		return o;
	},
	getDcStatic : function(attrCode){
		var result = null;
		if(WYUtil.static_data == null){
			//Service.sync("WXBS", "getDcStaticData", {}, function(reply) {
			//	WYUtil.static_data = reply.RESULT;
			//});
			
			ApCaller.executeSync('/common/getDropdown',null,{"cache_key":attrCode},function(reply){
				//WYUtil.static_data = reply.RESULT;
				if(reply.error_code == '0000'){
					result = reply.body;
				}
			});
		}
		//result = WYUtil.static_data[attrCode];
		return result;
	},
	initSelet : function(form_id,callBack){
		var context = form_id || $("body");
		if (typeof(context) == "string")
			context = $("#" + context);

		context.find("select").each(function(){
	        var attrCode = $(this).attr("attr_code");
	        if(null != attrCode && attrCode != '' && attrCode != 'undefined'){
	        	var options = WYUtil.getDcStatic(attrCode);
	        	if(null == options || '' == options || 'undefined' == options)
	        	{
	        		$(this).empty();
	        		return ;
	        	}
	        		
                $("select[attr_code='"+attrCode+"']").each(function(){
                	if($(this).children("option").size() == 0){
                		 var self_option = $(this).attr("self_option");
                		 if(null != self_option && self_option != '' && self_option != "undefined")
                			 $(this).append(self_option);
                		 for(p in options){
                			 $(this).append("<option "+"value="+p+">"+options[p]+"</option>"); 
                		 }
//	            		 for(var i = 0; i < options.length; i++){
//	                         var option =options[i];
//	                         var attr_value = option['pkey'];
//	                         var attr_desc = option['pname'];
//	                         $(this).append("<option "+"value="+attr_value+">"+attr_desc+"</option>");
//	                     }
                	}
                });
                var onchangeCall = $(this).attr("onchangeCall");
                if(onchangeCall){ //活动配置专用
	                $(this).bind("change",function(){
	                	var value = $(this).val();
	                	//Draw.selectChange(value,attrCode);
	                });
                }
	    	    callBack && callBack();
	        }
	    });
	},
	popBox : function(head_ele, qry_cond, qry_mothod, key_name,callBack){
		this.pop_data = {"head_ele":head_ele, "qry_cond":qry_cond, "qry_mothod":qry_mothod, "key_name":key_name};
		$('body').append(
				$("<div id='pop_dialog'></div>").load("/BackWeb/system/pop/pop_list.html")).
				append("<div class='trans_div' id='pop_dialog_trans'");
		this.pop_call = callBack;
	},
	getParam : function() {
		var me = this;
		var ret = {};
		var url = window.location.href;
		var pos = url.indexOf("?");
		var paraStr = url.substring(pos + 1);
		if (pos > 0) {
			if (paraStr.indexOf("&") > 0) {
				var paras = paraStr.split("&");
				for (var i = 0, iSize = paras.length; i < iSize; i++) {
					me.getP(paras[i].replace(/#$/g,''), ret);	
				}
			} else {
				me.getP(paraStr, ret);
			}
		}
		return ret;
	},
	getP : function(temp, ret) {
		var me = this;
		if (!me.isEmpty(temp) && temp.indexOf("=") > 0) {
			var signPos = temp.indexOf("=");
			var pName = temp.substring(0, signPos);
			var pVal = temp.substring(signPos + 1);
			if (!me.isEmpty($.trim(pName))) {
				ret[pName] = $.trim(pVal);
			}
		}		
	},
	getParam_bak : function() {
		var me = this;
		var ret = {};
		location.search.replace(/[A-Z0-9]+?=(\w*)/gi, function(a) {
			ret[a.split("=").shift()] = a.split("=").pop();
		});
		return ret;
	},		
	getByteLen : function(str) {
		var l = str.length;
		var n = l;
		for (var i = 0; i < l; i++) {
			if (str.charCodeAt(i) < 0 || str.charCodeAt(i) > 255) {
				n++;
			}
		}
		return n;
	},
	isEmpty : function(obj) {
		var me = this;
		if (null == obj || "undefined" == obj) {
			return true;
		} else {
			var objType = typeof obj;
			if ('string' === objType && me.getByteLen(obj) == 0) {
				return true;
			}
			if ($.isArray(obj) && obj.length == 0) {
				return true;
			}
			return false;
		}
	},
	validPhoneNo : function(value) {
		if (/^13\d{9}$/g.test(value) || (/^15[0-35-9]\d{8}$/g.test(value))
				 || (/^18[02-9]\d{8}$/g.test(value))) {
			return true;
		} else {
			return false;
		} 
	},
	valid6Num : function(value) {
		if (/^\d{6}$/g.test(value)) return true;
		return false;
	},
	validNum : function(value) {
		if (/^[0-9]*$/g.test(value)) return true;
		return false;
	},
	validEmail : function(value) {
		if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/g.test(value)) return true;
		return false;
	},
	scrollToTop : function() {
    	var me = this;
    	$("body").animate({scrollTop:0},100);
    },
    
    //根据静态编码的值获取对应的中文名称
    getAttrValueName: function(attrCode, attr_value){
    	var me =this;
    	var attr_value_name = '';
		var attrValues = me.getItem(attrCode);
		if(attrValues!=null && attr_value != ''){
			for(var i=0;i<attrValues.length;i++){
				if(attrValues[i].attr_value == attr_value ){
					attr_value_name = attrValues[i].attr_value_name;
					break;
				}
			}
		}
		return attr_value_name;
    },
    
    //查询静态编码值
	queryAttrCodeValue: function(jqDom){
		var me = this;
		jqDom = jqDom|| $(document);
		/*遍历出所有需要查找的数据*/
		var fieldsArray = [];
		var attrCodes = [];
		$(jqDom).find("td").each(function(index,elem){
			
			var attr_code = $(elem).attr("attrCode");
			if(attr_code != undefined && attr_code != null && attr_code != ''){
				var attrValues = me.getItem(attr_code);
				if(attrValues==null){
					attrCodes.push(attr_code);
				}
			}
		});
		
		if(attrCodes.length > 0){
			var sync = true;//目前默认是异步
			//一次性加载所有attr_value，减少前后端的交互
			if(sync){
				Invoker.sync("CacheController", "getMultiAttrValues", attrCodes, function(data){
					if($.isEmptyObject(data)){
						return;
					}
					for(var attr_code in data){
						//添加到本地缓存中
						me.setItem(attr_code, data[attr_code]);
					}
				}, false);
			}
		}
	},
	
	
	/**获取本地缓存*/
	getItem: function(key){
		if(window.localStorage){
			var value = window.localStorage.getItem(key);
			if(value != null){
				try{
					value = $.parseJSON(value);
				}
				catch(e){
				}
			}
			return value;
		}
		return null;
	},
	
	
	/**添加本地缓存*/
	setItem: function(key, value){
		if(window.localStorage){
			if(typeof(value) !== "string"){
				value = JSON.stringify(value);
			}
			window.localStorage.setItem(key, value);
		}
	}
};
$.fn.extend({
	setValue : function(name, value) {
		if ($(this).find("[name='" + name + "']").length > 0) {
			var obj = $(this).find("[name='" + name + "']")
			var tagName = obj.get(0).tagName;
			if (tagName == "INPUT") {
				obj.val(value);
			} else if (tagName == "IMG" && value) {
				obj.attr({
					"src" : value
				});
			} else {
				var attrCode = obj.attr("attr_code");
				if(attrCode != null && "" != attrCode && "undefined" != attrCode){
					var result = WYUtil.getDcStatic(attrCode);
					if(null != result && "undefined" != result && result instanceof Object){
						for(var i = 0; i < result.length; i++){
							var map = result[i];
							if(map.pkey == value){
								obj.html(map.pname);
								break;
							}
						}
					}
				}else{
					obj.html(value);
				}
			}

		}
	},
	setValues : function(queryData) {
		for (p in queryData) {
			$(this).setValue(p, queryData[p]);
		}
	},
	validate : function() {
		var result = true;
		context = $(this);
		$("[fieldType='db']:visible", context).each(function() {
			var is_null = $(this).attr("is_null");
			var value = $(this).val();
			var vtype_code = $(this).attr("vtype");
			var cname = $(this).attr("cname");
			if ("F" == is_null && !value) {
				$("#error_info").html("【" + cname + "】不能为空！");
				result = false;
				return false;
			}
			if (vtype_code && !VTypes[vtype_code](value)) {
				$("#error_info").html("【" + cname + "】输入格式非法！");
				result = false;
				return false;
			}
		});
		return result;
	},
	setHeight : function(callBack){
		var height = $(this).height();
		$(this).height(height);
		if(typeof(callBack) == 'function'){
			callBack();
		}
		return false;
	}
});

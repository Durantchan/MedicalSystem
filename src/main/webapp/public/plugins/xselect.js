/**
 * 注意：下拉框选项的值的长度不能超过下拉框的长度，否则选择这个超长的选项是显示不出来的，因为样式影响了这个显示。
 * 
 * 1、需要引用的文件：
 * <link rel="stylesheet" href="public/lib/xenon/css/fonts/fontawesome/css/font-awesome.min.css">
 * <link rel="stylesheet" href="public/lib/xenon/css/bootstrap.css">
 * <link rel="stylesheet" href="public/lib/xenon/css/xenon-core.css">
 * <link rel="stylesheet" href="public/lib/xenon/css/xenon-forms.css">
 * 
 * <script type="text/javascript" src="public/lib/jquery.min.js"></script>
 * <script type="text/javascript" src="public/lib/xenon/js/jquery-ui/jquery-ui.min.js"></script>
 * <script type="text/javascript" src="public/lib/xenon/js/selectboxit/jquery.selectBoxIt.min.js"></script>
 * <script type="text/javascript" src="public/lib/xenon/js/joinable.js"></script>
 * 
 * 2、使用样例
 * <div style="width:200px;">
 *	<select data-options="attr_code:'ABILITY_STATUS',blank_value:'-1',blank_name:'--请选择--'" style="display:none;"></select>
 * </div>
 * $("select").xselect();
 * 
 * 3、宽度控制
 * 在select外层添加div控制
 */

(function($){
	//定义jquery的扩展方法xselect
	$.fn.xselect = function(options, params){
		var $this = this;
		//执行方法
		if(typeof options == "string"){
			if(!$this.data("xselect")){
				//没初始化，不执行
				return null;
			}
			
			var method = $.fn.xselect.methods[options];
			if($.isFunction(method)){
				return method($this, params);
			}

			return null;
		}
		
		options = options || {};
		var attrCodes = [];
		var async = $.fn.xselect.defaults.async;
		$this.each(function(){
			var _self = $(this);
			//使用selectBoxIt初始化select
			_self.selectBoxIt();
			
			//从data-options中获取attr_code、blank_value、blank_name属性
			var s = $.trim(_self.attr("data-options"));
			var dataOptions = {};
			if(s){
				if(s.substring(0, 1) != "{"){
					s = "{" + s + "}";
				}
				dataOptions = (new Function("return " + s))();
			}
			
			var _options = $.extend({}, dataOptions, options);
			
			//根据属性初始化
			var data = _self.data("xselect");
			if(data){
				data.options = $.extend(data.options, _options);
				_options = data.options;
			}
			else{
				//覆盖默认属性
				_options = $.extend({}, $.fn.xselect.defaults, _options);
				_self.data("xselect", {options: _options});
			}
			
			/**
			if(_options.attr_code){
				if(_options.async){
					Invoker.async("CacheController", "getAttrValues", _options.attr_code, function(data){
						$.fn.xselect.methods.loadData(_self, data);
					}, false);
				}
				else{
					//使用同步的方式加载，防止setValue方法在数据返回前执行
					Invoker.sync("CacheController", "getAttrValues", _options.attr_code, function(data){
						$.fn.xselect.methods.loadData(_self, data);
					});
				}
			}
			else if(_options.blank_value != undefined){
				_self.data("selectBox-selectBoxIt").add({value: _options.blank_value, text: _options.blank_name});
			}
			*/
			
			if(_options.attr_code){
				//先从本地缓存中取，没有再从服务器取
				var attrValues = Utils.getItem(_options.attr_code);
				if(attrValues != null){
					$.fn.xselect.methods.loadData(_self, attrValues);
				}
				else{
					//把attr_code记录下来，后面一次加载所有的attr_value
					attrCodes.push(_options.attr_code);
				}
			}
			else if(_options.blank_value != undefined){
				_self.data("selectBox-selectBoxIt").add({value: _options.blank_value, text: _options.blank_name});
			}
			async = _options.async;
			
			//鼠标按下时记录老值
			_self.mousedown(function(){
				_self.data("old_value", $.fn.xselect.methods.getValue(_self));
			});
			
			//触发改变事件
			_self.change(function(){
				var old_value = _self.data("old_value");
				var new_value = $.fn.xselect.methods.getValue(_self);
				if(old_value != new_value && $.isFunction(_options.onChange)){
					_options.onChange(old_value, new_value);
				}
			});
		});
		
		if(attrCodes.length > 0){
			//一次性加载所有attr_value，减少前后端的交互
			if(async){
				Invoker.async("CacheController", "getMultiAttrValues", attrCodes, function(data){
					if($.isEmptyObject(data)){
						return;
					}
					
					for(var attr_code in data){
						//添加到本地缓存中
						Utils.setItem(attr_code, data[attr_code]);
						
						$this.each(function(){
							var _self = $(this);
							var options = $.fn.xselect.methods.options(_self);
							if(attr_code == options.attr_code){
								$.fn.xselect.methods.loadData(_self, data[attr_code]);
							}
						});
					}
				}, false);
			}
			else{
				//使用同步的方式加载，防止setValue方法在数据返回前执行
				Invoker.sync("CacheController", "getMultiAttrValues", attrCodes, function(data){
					if($.isEmptyObject(data)){
						return;
					}
					
					for(var attr_code in data){
						//添加到本地缓存中
						Utils.setItem(attr_code, data[attr_code]);
						
						$this.each(function(){
							var _self = $(this);
							var options = $.fn.xselect.methods.options(_self);
							if(attr_code == options.attr_code){
								$.fn.xselect.methods.loadData(_self, data[attr_code]);
							}
						});
					}
				});
			}
		}
		
		return $this;
	};
	
	$.fn.xselect.methods = {
		/**xselect插件属性*/
		options: function(jq){
			return jq.eq(0).data("xselect").options || {};
		},
		/**设置选中的值，value可以是值或index*/
		setValue: function(jq, value){
			jq.each(function(){
				var _self = $(this);
				_self.data("old_value", $.fn.xselect.methods.getValue(_self));
				_self.data("selectBox-selectBoxIt").selectOption(value);
			});
		},
		/**获取选中的值*/
		getValue: function(jq){
			return jq.eq(0).val();
		},
		/**获取选中项的文本名称*/
		getName: function(jq){
			var attr_value = jq.eq(0).val();
			var attr_name = "";
			jq.eq(0).find("option").each(function(){
				var _self = $(this);
				if(_self.val() == attr_value){
					attr_name = _self.text();
					return false;
				}
			});
			return attr_name;
		},
		/**加载下拉框数据，params：[{attr_value: "xx", attr_value_name: "oo"}]*/
		loadData: function(jq, data){
			if($.isArray(data)){
				$.fn.xselect.methods.remove(jq);
				jq.each(function(){
					var _self = $(this);
					var options = $.fn.xselect.methods.options(_self) || {};
					
					if(options.blank_value != undefined){
						_self.data("selectBox-selectBoxIt").add({value: options.blank_value, text: options.blank_name});
					}
					
					var attrValues = [];
					$.each(data, function(i, attrValue){
						attrValues.push({value: attrValue.attr_value, text: attrValue.attr_value_name});
					});
					
					_self.data("selectBox-selectBoxIt").add(attrValues);
				});
			}
		},
		/**获取下拉框的值，返回：[{attr_value: "xx", attr_value_name: "oo"}]*/
		getData: function(jq){
			var data = [];
			var options = $.fn.xselect.methods.options(jq) || {};
			jq.eq(0).find("option").each(function(){
				var attr_value = $(this).val();
				var attr_value_name = $(this).text();
				
				if(options.blank_value != undefined && options.blank_value == attr_value){
					return true;
				}
				
				data.push({attr_value: attr_value, attr_value_name: attr_value_name});
			});
			
			return data;
		},
		/**使下拉框不可用*/
		disable: function(jq){
			jq.each(function(){
				$(this).data("selectBox-selectBoxIt").disable();
			});
		},
		/**使下拉框可用*/
		enable: function(jq){
			jq.each(function(){
				$(this).data("selectBox-selectBoxIt").enable();
			});
		},
		/**删除下拉框的值*/
		remove: function(jq, params){
			jq.each(function(){
				var _self = $(this);
				if(params == undefined){
					//清空所有option
					_self.data("selectBox-selectBoxIt").remove();
				}
				if(typeof(params) === "string"){
					//删除某个value的option
					var index = _self.find("option[value=" + params + "]").index();
					if(index != -1){
						_self.data("selectBox-selectBoxIt").remove(index);
					}
				}
				else if($.isNumeric(params)){
					//删除某个index的option
					_self.data("selectBox-selectBoxIt").remove(params);
				}
				else if($.isArray(params)){
					//数组参数，可以是value数组或index数组
					var indexs = [];
					var values = [];
					$.each(params, function(i, element){
						if(typeof(element) === "string"){
							values.push(element);
						}
						else if($.isNumeric(element)){
							indexs.push(element);
						}
					});
					
					if(values.length > 0){
						$.each(values, function(i, value){
							var index = _self.find("option[value=" + value + "]").index();
							if(index != -1){
								indexs.push(index);
							}
						});
						
					}
					
					if(indexs.length > 0){
						_self.data("selectBox-selectBoxIt").remove(indexs);
					}
				}
			});
		}
	};
	
	//默认属性
	$.fn.xselect.defaults = $.extend({}, {
		attr_code: "",
		blank_value: undefined,
		blank_name: "",
		async: false,
		onChange: function(old_value, new_value){}
	});
})(jQuery);

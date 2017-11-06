/**
 * easyui扩展
 */
(function($){
	function ajaxLoader(plugin){
		return function(param, success, error){
			var _self = $(this);
			var opts = _self[plugin]("options");
			var url = opts.url;
			if(!$.trim(url)){
				return false;
			}
			
			var index = url.indexOf(".");
			if(index == -1){
				return false;
			}
			
			var action = url.substring(0, index);
			var method = url.substr(index + 1);
			
			var _success = function(data){
				if(opts.onBeforeSuccess){
					opts.onBeforeSuccess(data);
				}
				success(data);
			};
			
			var _error = function(){
				error.apply(this, arguments);
			};
			
			Invoker.async(action, method, param, _success, _error, false);
		};
	}
	
	function comboboxLoader(param, success, error){
		var opts = $(this).combobox("options");
		var code = opts.code;
		var url = opts.url;
		if(code){
			var _success = function(data){
				data = data || [];
				var blankValue = opts.blankValue;
				var blankName = opts.blankName || "---请选择---";
				if(blankValue !== undefined){
					var blankAttr = {};
					blankAttr[opts.valueField] = blankValue;
					blankAttr[opts.textField] = blankName;
					
					data = $.merge([blankAttr], data);
				}
				success(data);
			};
			
			var _error = function(){
				error.apply(this, arguments);
			};
			
			Invoker.async("CacheController", "getAttrValues", code, _success, _error, false);
		}
		else if(url){
			ajaxLoader("combobox");
		}
	}
	
	/**
	 * 扩展datagrid.columns，增加code属性，翻译值
	 */
	$.extend($.fn.datagrid.defaults.view, {
		onBeforeRender: function(target, rows){
			var opts = $.data(target, "datagrid").options;
			var columns = opts.columns;
			
			var codes = [];
			for(var i = 0; i < columns.length; i++){
				for(var j = 0; j < columns[i].length; j++){
					var column = columns[i][j];
					if(column.code && !column.formatter && !column.attrList){
						codes.push(column.code);
					}
				}
			}
			
			if(codes.length > 0){
				Invoker.sync("CacheController", "getMultiAttrValues", codes, function(data){
					for(var i = 0; i < columns.length; i++){
						for(var j = 0; j < columns[i].length; j++){
							var column = columns[i][j];
							if(column.code && !column.formatter && !column.attrList){
								column.attrList = data[column.code];
							}
						}
					}
				});
			}
			
			for(var i = 0; i < columns.length; i++){
				for(var j = 0; j < columns[i].length; j++){
					var column = columns[i][j];
					if(column.attrList && column.attrList.length > 0){
						var attrList = column.attrList;
						column.formatter = function(value, row, index){
							for(var k = 0; k < attrList.length; k++){
								var attrValue = attrList[k];
								if(attrValue.attr_value == value){
									return attrValue.attr_value_name;
								}
							}
							
							return value;
						};
					}
				}
			}
		}
	});
	
	/**
	 * 补充下拉框属性(code、blankValue、blankName)
	 */
	$.extend($.fn.combobox, {
		oldParseOptions: $.fn.combobox.parseOptions,
		parseOptions: function(target){
			var t = $(target);
			return $.extend({}, $.fn.combobox.oldParseOptions(target), {code: t.attr("code"), valueField: t.attr("valueField") != null ? t.attr("valueField") : "attr_value", textField: t.attr("textField") != null ? t.attr("textField") : "attr_value_name", blankValue: t.attr("blankValue"), blankName: t.attr("blankName")});
		}
	});
	
	/**
	 * 设置下拉框默认属性
	 */
	$.extend($.fn.combobox.defaults, {
		panelHeight: "auto",
		editable: false,
		onLoadSuccess: function(){
			var data = $(this).combobox("getData");
			if(data && data.length > 0){
				$(this).combobox("select", data[0].attr_value);
			}
		}
	});
	
	$.fn.datagrid.defaults.loader = ajaxLoader("datagrid");
	$.fn.combobox.defaults.loader = comboboxLoader;
})(jQuery);
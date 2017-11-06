/**
 * 动态生成控件
 */
var Control = {
		//根据ATTR_CODE获取静态数据
		getAttrValues: function(attr_code){
			var attrValues = [];
			Invoker.sync("CacheController", "getAttrValues", attr_code, function(data){
				attrValues = data;
			});
			return attrValues;
		},
		//创建checkbox控件
		createCheckbox: function(attr_code,name){
			if(!attr_code) return "";
			var html = [];
			var data = Control.getAttrValues(attr_code);
			if($.isArray(data)){
				$.each(data, function(i, attrValue){
					html.push("<input type='checkbox' name='"+name+"' value='"+attrValue.attr_value+"'/>"+attrValue.attr_value_name+" \n");
				});
			}
			return html.join("");
		},
		//创建Radio控件
		createRadio: function(attr_code,name){
			if(!attr_code) return "";
			var html = [];
			var data = Control.getAttrValues(attr_code);
			if($.isArray(data)){
				$.each(data, function(i, attrValue){
					html.push("<input type='radio' value='"+attrValue.attr_value+"' name='"+name+"'/>"+attrValue.attr_value_name+" \n");
				});
			}
			return html.join("");
		},
		//创建下拉值
		createSelectOption: function(attr_code){
			if(!attr_code) return "";
			var html = [];
			var data = Control.getAttrValues(attr_code);
			if($.isArray(data)){
				$.each(data, function(i, attrValue){
					html.push("<option value='"+attrValue.attr_value+"'>"+attrValue.attr_value_name+"</option>\n");
				});
			}
			return html.join("");
		}
};
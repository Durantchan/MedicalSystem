//在线信息查询
var dropDown = {
		
	//初始化
	init : function(jqDom) {
		jqDom = jqDom || $(document);
		$(jqDom).click(function() {
			$(".inp-select").removeClass("show");
			$(".inp-select").find(".inp-slt-main").hide();
		});
		this.querySelectValue(jqDom);
		
		//控制点击选择框外面，收起选择框效果
		$(document).click(function(e){
            var target = $(e.target);
            if(!target.hasClass("inp-select")&&target.closest("div.inp-select").length==0){
            	$("div.inp-select div.inp-slt-main").hide();
            	$(".inp-select").removeClass("show");
            }
        });
	},
	
	
	//初始化下拉选择事件
	initSelectDropDown:function(jqDom){
		
		jqDom.find(".inp-select").each(function(index,ele){
			$(ele).unbind("click").bind("click",function(e){
				$(".inp-select").removeClass("show");
				$(".inp-select").find(".inp-slt-main").hide();
				// 展示当前的下拉框
				$(ele).find(".inp-slt-main").slideDown(300);
				$(ele).addClass("show");
				// 阻止事件冒泡
				e.stopPropagation();
			});
		});
		
		// 模拟选中事件
		jqDom.find(".inp-select ul li").each(function(index,elem){
			
			$(elem).unbind("click").click(function(e){
				
				var showText = $(elem).text();
				var attrValue =  $(elem).attr("val");
				attrValue = attrValue==null?showText:attrValue;
				
				$(elem).parents(".inp-select").eq(0).find(".inp-slt-tt").eq(0).html(showText);
				$(elem).parents(".inp-select").eq(0).find(".input_selectValue").eq(0).val(attrValue);
				$(elem).parents(".inp-select").find(".inp-slt-main").hide();
				$(elem).parents(".inp-select").removeClass("show");
				e.stopPropagation();
			});
		});
	},
	
	
	querySelectValue: function(jqDom){
		
		var me = this;
		jqDom = jqDom|| $(document);
		var mthis = this;
		/*遍历出所有需要查找的数据*/
		var fieldsArray = [];
		var attrCodes = [];
		$(jqDom).find(".inp-select").each(function(index,elem){
			$(elem).find("input").attr("readOnly",true);
			//检查根元素有没有置顶的field
			var attr = $(elem).attr("field");
			//先从缓存中获取下拉值，没有的后面进行全部的更新
			var attrValues = me.getItem(attr);
			if(attrValues==null){
				attrCodes.push(attr);
			}
			else{
				var domHtml = $("<ul class='inp-slt-list'></ul>");
				for(var i=0;i<attrValues.length;i++){
					
						var html = "<li class='inp-slt-item' val='" + attrValues[i].attr_value +"'>"+attrValues[i].attr_value_name +"</li>";
						domHtml.append(html);
				}
				$(elem).find("ul").eq(0).append(domHtml.html());
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
						if(data[attr_code]){
							var arr = data[attr_code];
							var domHtml = $("<ul class='inp-slt-list'></ul>");
							for(var i=0;i<arr.length;i++){
									var html = "<li class='inp-slt-item' val='" + arr[i].attr_value +"'>"+arr[i].attr_value_name +"</li>";
									domHtml.append(html);
							}
							$(jqDom).find("[field='"+attr_code+"']").find("ul").eq(0).append(domHtml.html());
						}
					}
				}, false);
			}
		}
		
		me.initSelectDropDown(jqDom);
		
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

$(function() {
//	dropDown.init();
});
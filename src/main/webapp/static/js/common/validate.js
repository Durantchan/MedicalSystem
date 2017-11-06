/**
 * 动态生成控件
 */
var Validate = {
		//校验数据
		validate: function(jqdom){
			
			var me = this;
			var result = new Boolean(true);
			//校验是否为空,nullable='0'不能为空
			jqdom.find("input[nullable='0'],textarea[nullable='0']").each(function(index,ele){
				
				var tagName = $(ele).attr("tagName");
				if($(ele).hasClass("input_selectValue")){//select
					if($(ele).val()==""){
						var null_tip = $(ele).attr("null_tip");
						if(null_tip!=null&&null_tip!=""){
							 Utils.alert(null_tip);
							result = false;
							return false;
						}
					}
				}else{//input
					if($(ele).val()==""){
						var null_tip = $(ele).attr("null_tip");
						if(null_tip!=null&&null_tip!=""){
							 Utils.alert(null_tip);
							result = false;
							return false;
						}
					}
				}
			});
			
			//校验是否符合正则表达式
			jqdom.find("input[regexp],textarea[regexp]").each(function(index,ele){
				
				if(!result){
					return false;
				}
				var tagName = $(ele).attr("tagName");
				if($(ele).hasClass("input_selectValue")){//select
					
				}else{//input
					if($(ele).val()!=""){
						
						var apregex = $(ele).attr("regexp");  
						apregex = me.regex[apregex];
	        			var patt=new RegExp(apregex);
				        var r = patt.test($(ele).val());
				        if(!r){
				        	var reg_tip=$(ele).attr("reg_tip");
				            Utils.alert(reg_tip); //
				            result = false;
							return false;
				        }
					}
				}
			});
			
			return result;
		},
		
		
		regex: {
        	"number":/^[0-9]*$/,
        	"phone":/^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/,
        	"email":/^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+(\.[a-zA-Z]{2,3})+$/,
        	"idcard":/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/,
        	"name":/^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9])*$/,
        	"numberCode":/^[0-9a-zA-Z]*$/,
        	"password":/^\w{4,20}$/,
        	"money":/^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/,
        	"ip":/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/
        },
        
        
};
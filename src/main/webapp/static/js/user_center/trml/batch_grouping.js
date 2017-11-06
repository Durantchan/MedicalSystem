/**
 * 批量分组弹出窗
 */
var batchGroup = {
	
	//新增imei设备
	imeiGroup : [],	
	
	//删除imei设备
	delImei : [],
	
	//已分组的imei设备
	hasGroupingImei : [],
	
	//防止重复点击
	flag : true,
	
	initClick : function(){
		var me = this;
		$('#close_layer').bind("click", function() {
			Utils.layerClose();
		});
		
		$('#save_btn').bind("click", function() {
			if(!me.flag)
				return false;
			me.flag = false;
			me.batch_grouping();
		});
	},
	/**
	 * 批量分组
	 * @returns {Boolean}
	 */
	batch_grouping : function() {
		var me = this;
		if(me.imeiGroup.length < 1 && me.delImei.length < 1) {
			Utils.alert("设备IMEI没有变更!");
			me.flag = true;
			return false;
		}
		var param = {};
		param.imei_group_id = me.current_imei_group_id;
		param.addImei = me.imeiGroup;
		param.delImei = me.delImei;
		Invoker.async("ImeiGroupController", "batchGrouping", param, function(result){
			if(result.res_code == "00000"){
				layer.msg("操作成功！");
			}else {
				Utlis.alert("操作失败，请重试");
			}
			
			me.initImeiArray();
			me.flag = true;
		}, true);
	},
	
	//初始化imei数组
	initImeiArray : function() {
		var me = this;
		me.imeiGroup = [];
		me.delImei = [];
		me.hasGroupingImei = [];
	},
	
	/**
	 * 群组列表
	 */
	queryGroupList : function() {
		var me = this;
		Invoker.async("ImeiGroupController", "queryImeiGroupList", {} , function(result){
			if(result.res_code == "00000" && result.result.length > 0){
				var list = result.result;
				for(var i=0;i<list.length;i++) {
					var data = list[i];
					var clone = $('#group_li_temp').clone().removeAttr("id");
					clone.find("span").text(data.group_name);
					clone.data("id", data.imei_group_id);
					clone.bind("click", function() {
						$(this).siblings().find("label").removeClass("active");
						$(this).find("label").addClass("active");
						//alert($(this).data("id"))
						var id = $(this).data("id");
						me.current_imei_group_id = id;
						
						me.initImeiArray();
						
						me.queryTrmlPage(null, null, id);
					});
					$('#group_ul').append(clone);
				}
			}else {
				var clone = $('#group_li_temp').clone().removeAttr("id");
				clone.find("span").text("IMEI群组无数据！").css({"color":"red"});
				var icon = clone.find("i");
				icon.remove();
				$('#group_ul').append(clone);
			}
		});
	},
	
	/**
	 * 设备分页
	 * @param pageNum
	 * @param pageRow
	 * @param id imei_group_id
	 */
	queryTrmlPage : function(pageNum, pageRow, id){
		var me = this;
		$('#trml_tbody').empty();
		var param = {};
		var num = 1;
		var row = 5;
		param.pageNum = pageNum==null? num : pageNum;
		param.pageRow = pageRow==null? row : pageRow;
		param.imei_group_id = id;
		Invoker.async("ImeiGroupController", "queryMemTrmlGroup", param, function(data) {
			if (data && data.total>0) {
				me.renderData(data);
				laypage({
					cont: 'trmlPage',
					pages: data.pageCount, //总页数
					curr: data.pageNumber, //当前页
					groups: '3', //连续页数
					skip: true, //跳页
					jump: function(obj, first){ //触发分页后的回调
						if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
							me.queryTrmlPage(obj.curr, null, me.current_imei_group_id);
						}
					}
				});
			}
			else{
				$('#trml_tbody').append("<tr><td colspan='99' align='center'><font color='red'>无数据，请重新查询！</font></td></tr>");
			}
		});
	},
	
	/**
	 * 渲染数据
	 * @param data
	 */
	renderData: function(data){
		var me = this;
		var rows = data.rows;
		if(rows != null){
			$.each(rows, function(i,value){
				var clone = $('#tr_temp').clone().removeAttr("id").show();
				WYUtil.setInputDomain(value, clone);
				//console.log(value.imei_group_id)
				if(value.imei_group_id) {
					if(!me.checkArrayVal(me.delImei, value.imei)) {
						clone.find("input").click();
						clone.find(".inp-checkbox").addClass("active");
						me.push(me.hasGroupingImei, value.imei);
					}
				}else {
					if(me.checkArrayVal(me.imeiGroup, value.imei)) {
						clone.find("input").click();
						clone.find(".inp-checkbox").addClass("active");
					}
				}
				
				$('#trml_tbody').append(clone);
			});
			
			$("input[type='checkbox']").unbind().bind("change",function(){
				var imei = $.trim($(this).siblings("span").text());
				if($(this).is(':checked')){ //选中
					$(this).closest(".inp-checkbox").addClass("active");
					if(!me.checkArrayVal(me.hasGroupingImei, imei)) {
						me.push(me.imeiGroup, imei);
					}
					
					me.remove(me.delImei, imei);
				}else{
					$(this).closest(".inp-checkbox").removeClass("active");
					if(me.checkArrayVal(me.hasGroupingImei, imei)) {
						me.push(me.delImei, imei);
					}else {
						me.remove(me.imeiGroup, imei);
					}
				}
			});
		} else{
			$('#trml_tbody').append("<tr><td colspan='99' align='center'><font color='red'>暂无数据，请重新查询！</font></td></tr>");
		}
	},
	
	/**
	 * 移除数组里面值
	 * @param arry
	 * @param val
	 */
    remove : function(arry, val) {  
        for(var i =0;i <arry.length;i++){  
            var temp = arry[i];  
            if(temp == val){  
                for(var j = i;j <arry.length;j++){  
                	arry[j]=arry[j+1];  
                }  
                arry.length = arry.length-1;  
            }     
        }  
    },
    
    /**
     * 检查val是否在array数组中
     * @param arry
     * @param val
     */
    checkArrayVal : function(arry, val) {
    	for(var i =0;i <arry.length;i++){  
            var temp = arry[i];  
            if(temp == val){  
                return true; 
            }     
        }  
    	return false;
    },
    
    /**
     * 将val放入数组，存在则忽略
     * @param arry
     * @param val
     */
    push : function(arry, val) {
    	var me = this;
    	if(!me.checkArrayVal(arry, val)) {
    		arry.push(val);
    	}
    },
	
	init : function() {
		var me = this;
		me.initClick();
		me.queryGroupList();
	}
};

$(function(){
	batchGroup.init();
});



/**
 * 批量分组弹出窗
 */
var batchGroup = {
	
	//已选中imei设备
	imeiGroup : [],	
	
	initClick : function(){
		var me = this;
		$('#close_layer').bind("click", function() {
			Utils.layerClose();
		});
		
		$('#save_btn').bind("click", function() {
			me.batch_grouping();
		});
	},
	/**
	 * 批量分组
	 * @returns {Boolean}
	 */
	batch_grouping : function() {
		//现在成员与成员群组关联表清除当页面的所有成员，再添加选择的成员上去
		var me = this;
		
		var param = {};
		//debugger
		//获取本页所有成员
		var mem_user_all_list = new Array();
		$.each($("[dbField='mem_user_id']",$("#mem_groud_table")), function(i,data){
			mem_user_all_list.push($(data).text());
		});
		
		//获取本页选择的成员
		var mem_user_select_list = new Array();
		$.each($("[dbField='mem_user_id']",$(".inp-checkbox.active",$("#mem_groud_table"))), function(i,data){
			var object = new Object();
			object.group_id = me.current_imei_group_id;
			object.mem_user_id = $(data).text();
			mem_user_select_list.push(object);
		});
//		
//		if(mem_user_select_list.length < 1) {
//			Utils.alert("请选择成员!");
//			return false;
//		}
		
		param.group_id = me.current_imei_group_id;
		//debugger
		param.mem_user_select_list = mem_user_select_list;
		param.mem_user_all_list = mem_user_all_list;
		Invoker.async("CustMemGroupController", "batchGrouping", param, function(result){
			if(result.res_code == "00000"){
				layer.msg("操作成功！");
			}else {
				Utlis.alert("操作失败，请重试");
			}
		});
	},
	/**
	 * 群组列表
	 */
	queryGroupList : function() {
		var me = this;
		Invoker.async("CustMemGroupController", "queryCustMemGroupList", {} , function(result){
			if(result.res_code == "00000" && result.result.length > 0){
				var list = result.result;
				for(var i=0;i<list.length;i++) {
					var data = list[i];
					var clone = $('#group_li_temp').clone().removeAttr("id");
					clone.find("span").text(data.group_name);
					clone.data("id", data.group_id);
					clone.bind("click", function() {
						$(this).siblings().find("label").removeClass("active");
						$(this).find("label").addClass("active");
						//alert($(this).data("id"))
						var id = $(this).data("id");
						me.current_imei_group_id = id;
						me.imeiGroup = [];
						me.queryTrmlPage(null, null, id);
					});
					$('#group_ul').append(clone);
				}
			}else {
				var clone = $('#group_li_temp').clone().removeAttr("id");
				clone.find("span").text("成员群组无数据！").css({"color":"red"});
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
		var mem_user_list = [];
		//获取选择的员工，显示出来,若是没选择，则显示当前页面全部员工
		var $mem_user_lsit = $("i",$(".single_checkbox.active",window.parent.document));
		
		if($mem_user_lsit.length == 0){
			$mem_user_lsit = $("i",$(".single_checkbox",window.parent.document));
		}
		$.each($mem_user_lsit, function(i,data){
			mem_user_list.push($(data).attr("mem_user_id"));
		});
		
		param.group_id = id;
		if(mem_user_list.length > 0){			
			param.mem_user_list = mem_user_list;
		}
		Invoker.async("CustMemController", "batchQueryCustMember", param, function(data) {
			if (data && data.total>0) {
				me.renderData(data,id);
				laypage({
					cont: 'trmlPage',
					pages: data.pageCount, //总页数
					curr: data.pageNumber, //当前页
					groups: '3', //连续页数
					skip: true, //跳页
					jump: function(obj, first){ //触发分页后的回调
						if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
							me.queryTrmlPage(obj.curr,row,id);
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
	renderData: function(data,id){
		var me = this;
		var rows = data.rows;
		if(rows != null){
			$.each(rows, function(i,value){
				var clone = $('#tr_temp').clone().removeAttr("id").show();
				WYUtil.setInputDomain(value, clone);
				//console.log(value.imei_group_id)
				if(value.group_id == id) {
					clone.find("input").click();
					clone.find(".inp-checkbox").addClass("active");
					me.imeiGroup.push(value.imei);
				}
				
				$("input[type='checkbox']",clone).unbind().bind("change",function(){
					var imei = $.trim($(this).siblings("span").text());
					if($(this).is(':checked')){ //选中
						$(this).closest(".inp-checkbox").addClass("active");
						me.remove(me.imeiGroup, imei);
						me.imeiGroup.push(imei);
					}else{
						$(this).closest(".inp-checkbox").removeClass("active");
						me.remove(me.imeiGroup, imei);
					}
				});
				
				$('#trml_tbody').append(clone);
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
    remove : function(arry, val){  
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
	
	init : function() {
		var me = this;
		me.initClick();
		me.queryGroupList();
	}
};

$(function(){
	batchGroup.init();
});



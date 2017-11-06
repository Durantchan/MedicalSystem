/**
 * 成员群组和IMEI群组绑定弹出窗,根据会员群组查询IMEI群组
 */
var trml_binding_popup = {
	
	initClick : function(){
		var me = this;
		$('#close_layer').bind("click", function() {
			Utils.layerClose();
		});
		
		$('#save_btn').bind("click", function() {
			me.addImeiBindingSetting();
		});
		
		$('#del_btn').bind("click", function() {
			me.delImeiBindingSetting();
		});
	},
	
	/**
	 * IMEI群组列表
	 */
	queryGroupList : function(id) {
		$('#group_ul').empty();
		Invoker.async("TrmlBindingController", "queryImeiGroupByMemGroup", {"mem_group_id":id} , function(result){
			if(result.res_code == "00000" && result.result.length > 0){
				var list = result.result;
				for(var i=0;i<list.length;i++) {
					var data = list[i];
					var clone = $('#group_li_temp').clone().removeAttr("id");
					clone.find("span").text(data.group_name);
					clone.data("id", data.imei_group_id);
					
					if(data.mem_group_id) {
						clone.find("label").addClass("active");
					}
					
					clone.bind("click", function() {
						//var id = $(this).data("id");
						//me.current_imei_group_id = id;
						//me.queryMemGroupList(id);
						$(this).siblings().find("label").removeClass("active");
						$(this).find("label").addClass("active");
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
	 * 集团成员群组列表
	 */
	queryMemGroupList : function() {
		var me = this;
		$('#mem_group_ul').empty();
		Invoker.async("TrmlBindingController", "queryMemGroup", {} , function(result){
			if(result.res_code == "00000" && result.result.length > 0){
				var list = result.result;
				for(var i=0;i<list.length;i++) {
					var data = list[i];
					var clone = $('#mem_group_li_temp').clone().removeAttr("id");
					clone.find("span").text(data.group_name);
					clone.data("id", data.group_id);
					
					clone.bind("click", function() {
						var id = $(this).data("id");
						me.current_mem_group_id = id;
						me.queryGroupList(id);
						
						$(this).siblings().find("label").removeClass("active");
						$(this).find("label").addClass("active");
					});
					$('#mem_group_ul').append(clone);
				}
			}else {
				var clone = $('#group_li_temp').clone().removeAttr("id");
				var icon = clone.find("i");
				icon.remove();
				clone.find("span").text("成员群组无数据！").css({"color":"red"});
				$('#mem_group_ul').append(clone);
			}
		});
	},
	
	addImeiBindingSetting : function() {
		var me = this;
		if(!me.current_mem_group_id) {
			layer.msg("请选择成员群组！");
			return false;
		}
		
		var select_li = $("label.active", '#group_ul');
		if(select_li.length != 1) {
			layer.msg("请选择IMEI群组！");
			return false;
		} 
		
		var params = {};
		params.mem_group_id = me.current_mem_group_id;
		params.imei_group_id = select_li.closest("li").data("id");
		
		Invoker.async("TrmlBindingController", "addMemGroupImeiGroupRel", params, function(result) {
			if(result.res_code = '0000') {
				layer.msg("操作成功");
			}else {
				Utils.alert("操作失败，请重试！");
			}
		});
	},
	
	delImeiBindingSetting : function() {
		var me = this;
		if(!me.current_mem_group_id) {
			layer.msg("请选择成员群组！");
			return false;
		}
		
		var select_li = $("label.active", '#group_ul');
		if(select_li.length != 1) {
			layer.msg("该成员群组尚未绑定IMEI群组！");
			return false;
		} 
		
		//确认信息 options：{title: "标题", yes: "确定按钮事件", cancel: "取消按钮事件"} 
		Utils.confirm("你确定要删除该成员群组的绑定配置吗？", {yes : function() {
			var params = {"mem_group_id" : me.current_mem_group_id};
			Invoker.async("TrmlBindingController", "delMemGroupImeiGroupRel", params, function(result) {
				if(result.res_code = '0000') {
					layer.msg("操作成功");
					$('#group_ul').find("label").removeClass("active");
				}else {
					Utils.alert("操作失败，请重试！");
				}
			});
		}});
		
	},
	
	init : function() {
		var me = this;
		me.initClick();
		me.queryMemGroupList();
	}
};

$(function(){
	trml_binding_popup.init();
});



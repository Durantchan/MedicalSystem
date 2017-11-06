var appCreate = {
	init: function(){
		$("#popAbility").bind("click", appCreate.selAbility);
		$(".big-submit-btn.found-btn").bind("click", appCreate.createApp);
		
		$("#backList").bind("click", function(){
			$("#main_warp").load("manage/app/app_list.html");
		});
	},
	
	selAbility: function(){
		var index = layer.open({
			title: "编辑应用 > 选择能力",
			type: 2,
			area: ['1000px', '610px'],
			fix: true, //不固定
			maxmin: true,
			content: 'manage/app/sel_ability.html'
		});
		$("#layer_index").val(index);
	},
	
	createApp: function(){
		var app_name = $("#createApp input[name='app_name']").val();
		if(app_name == ""){
			Utils.alert("应用名称不能为空！");
			return false;
		}
		//组装所有能力ID
		var ids = "";
		$.each($("#abilitys").find("tr"),function(){
			var id = $(this).attr("id");
			if(id != "menuTop"){
				ids += id + ",";
			}
		});
		//预留图片上传
		if(ids == ""){
			layer.confirm('应用还未关联能力，是否创建应用？', function(index){
				appCreate.submitForm(ids);
				layer.close(index);
			});
		}else{
			appCreate.submitForm(ids);
		}
	},
	
	submitForm: function(ids){
		$("#createApp").form("submit", {
			type: "POST",
			data: "Json",
			url: "ManageAppController/createApp.do?abilityIds="+ ids,
			success: function(data){
				var dataVal = JSON.parse(data);
				if(dataVal.res_code != "00000"){
					Utils.alert(dataVal.res_message);
					return;
				}
				else{
					$("#main_warp").load("manage/app/app_list.html");
				}
			},
			error:function(data){
				var dataVal = JSON.parse(data);
				alert(dataVal.res_code+"："+dataVal.res_message);
			}
		});
	}
};

function delAbility(id){
	layer.confirm('确定删除当前能力？', function(index){
		$("#"+id).remove();
		layer.close(index);
	});
}

$(function(){
	appCreate.init();
});
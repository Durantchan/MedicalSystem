var appEdit = {
	init: function(){
		appEdit.initButton();
		appEdit.initApp();
	},
	
	initButton: function(){
		$(".inp-btn").bind("click", appEdit.copyUrl);
		$(".big-submit-btn").bind("click", appEdit.submitApp);
		$("#selAbility").bind("click", appEdit.popAbilityList);
		$("#backList").bind("click", function(){
			$("#main_warp").load("manage/app/app_list.html");
		});
	},
	
	initApp: function(){
		var id = $("#app_id").val();
		Invoker.async("ManageAppController","showAppInfo",{"app_id":id},function(data){
			if(data.res_code != "00000"){
				Utils.alert(data.res_message);
			}
			else{
				var result = data.result;
				var _ability = "";
				$("#appForm").form("load", result);
				$(".app-edit-edition").html("APPID:" + result.app_id);
				
				//能力
				_ability += "<table><tbody id='abilitys'><tr id='menuTop'><th style='text-align:left;'>能力名称</th>" +
						"<th style='text-align:left;'>方法</th>" +
						"<th style='text-align:center;'>版本</th>" +
						"<th style='text-align:left;'>所属目录</th>" +
						"<th style='text-align:center;'>操作</th></tr>";
				if(result.abilityLists != null){
					$.each(result.abilityLists, function(index, value){
						var name = value.ability_name==null?"":value.ability_name;
						var version = value.version==null?"":value.version;
						var method = value.method==null?"":value.method;
						//var desc = value.ability_desc==null?"":value.ability_desc;
						var catalog_name = value.catalog_name==null?"":value.catalog_name;
						_ability += "<tr id='"+value.ability_id+"'><td style='text-align:left;'>"+name+"</td>" +
								"<td style='text-align:left;'>"+method+"</td>" +
								"<td style='text-align:center;'>"+version+"</td>" +
								"<td style='text-align:left;'>"+catalog_name+"</td>" +
								"<td style='text-align:center;'><a href='javascript:void(0)' onclick='delAbility("+value.ability_id+")'><font color='#4d99d5'>删除</font></td></tr>"
					});
				}
				_ability += "</tbody></table>";
				$(".search-list").html(_ability);
				//$("#abilitys").html(_ability);
				
				$("#delAbility").bind("click",appEdit.delAbility);
			}
		});
	},
	
	copyUrl: function(){
		//alert("复制成功！");
	},
	
	submitApp: function(){
		var app_name = $("#appForm input[name='app_name']").val();
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
		})
		//$("#abilityIds").val(ids);
		//预留图片上传
		$("#appForm").form("submit", {
			type: "POST",
			data: "Json",
			url: "ManageAppController/appEditor.do?abilityIds="+ ids,
			success: function(data){
				var dataVal = JSON.parse(data);
				if(dataVal.res_code != "00000"){
					Utils.alert(dataVal.res_message);
					return ;
				}
				else{
					$("#main_warp").load("manage/app/app_list.html");
					return ;
				}
			},
			error:function(data){
				var dataVal = JSON.parse(data);
				alert(dataVal.res_code+"："+dataVal.res_message);
			}
		});
	},
	
	popAbilityList: function(){
		var index = layer.open({
			title: "编辑应用 > 选择能力",
		    type: 2,
		    area: ['1000px', '610px'],
		    fix: true, //不固定
		    maxmin: true,
		    content: 'manage/app/sel_ability.html'
		});
		$("#layer_index").val(index);
	}
};

function delAbility(id){
	layer.confirm('确定删除当前能力？', function(index){
		$("#"+id).remove();
		layer.close(index);
	});
}

$(function(){
	appEdit.init();
});
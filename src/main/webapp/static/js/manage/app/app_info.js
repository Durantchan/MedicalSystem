var appInfo = {
	init: function(){
		appInfo.initButton();
		appInfo.initApp();
	},
	
	initButton: function(){
		$(".main-box-tit-btn").bind("click",function(){
			//window.history.back(-1);
			$("#main_warp").load("manage/app/app_list.html");
		});
	},
	
	initApp: function(){
		//var id = $.query.load(window.location.search).get("id");
		var id =  $("#app_id").val();
		Invoker.async("ManageAppController","showAppInfo",{"app_id":id},function(data){
			if(data.res_code != "00000"){
				Utils.alert(data.res_message);
			}
			else{
				var result = data.result;
				var _app = [];
				var _ability = [];
				var app_id = result.app_id ? result.app_id : "";
				var app_name = result.app_name ? result.app_name : "";
				var app_secret = result.app_secret ? result.app_secret : "";
				var access_token = result.access_token ? result.access_token : "";
				var app_url = result.app_url ? result.app_url : "";
				var app_desc = result.app_desc ? result.app_desc : "";
				
				_app.push("<div class='app-con-pic'><img src='static/images/app-icon-f.png' alt=''/></div>");
				_app.push("<h3 class='app-con-tit'>" + app_name + "</h3>");
				_app.push("<p><em class='app-con-key-tit'>应用标识：</em>" + app_id + "</p>");
				_app.push("<p><em class='app-con-key-tit'>应用密钥：</em>" + app_secret + "</p>");
				_app.push("<p><em class='app-con-key-tit'>授权令牌：</em>" + access_token + "</p>");
				_app.push("<p><em class='app-con-key-tit'>应用地址：</em>" + app_url + "</p>");
				_app.push("<h4 class='app-con-edition'>应用状态：<font style='color:#4d99d5;'>" + getStateDesc(result.status_cd) + "</font></h4>");
				_app.push("<h4 class='app-con-edition'>应用描述：" + app_desc + "</h4>");
				
				$(".app-content").html(_app.join(""));
				//能力列表
				_ability.push("<table><tr><th>能力名称</th>" +
						"<th>方法</th>" +
						"<th class='text-center'>版本</th>" +
						"<th>所属目录</th>");
				$.each(result.abilityLists, function(index, value){
					var name = value.ability_name==null?"":value.ability_name;
					var version = value.version==null?"":value.version;
					var method = value.method==null?"":value.method;
					var desc = value.ability_desc==null?"":value.ability_desc;
					var catalog_name = value.catalog_name==null?"":value.catalog_name;
					_ability.push("<tr><td>"+name+"</td>" +
							"<td>"+method+"</td>" +
							"<td class='text-center'>"+version+"</td>" +
							"<td>"+catalog_name+"</td>");
				});
				_ability.push("</table>");
				$(".search-list").html(_ability.join(""));
			}
		});
	}
};

var getStateDesc = function(s){
	var str = "";
	if(s == "1000"){
		str = "创建";
	}else if(s == "1001"){
		str = "测试";
	}else if(s == "1002"){
		str = "发布";
	}else if(s == "1100"){
		str = "无效";
	}else if(s == "1102"){
		str = "下线";
	}else if(s == "1003"){
		str = "暂停";
	}else if(s == "999"){
		str = "审核中";
	}
	return str;
};

$(function(){
	appInfo.init();
});

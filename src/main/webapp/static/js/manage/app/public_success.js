$(function(){
	var app_id = $("#app_id").val();
	Invoker.async("ManageAppController","showAppInfo",{"app_id" : app_id},function(data){
		if(data.res_code != "00000"){
			Utils.alert(data.res_message);
		}
		else{
			var result = data.result;
			var html = [];
			var app_id = result.app_id ? result.app_id : "";
			var app_name = result.app_name ? result.app_name : "";
			var app_secret = result.app_secret ? result.app_secret : "";
			var access_token = result.access_token ? result.access_token : "";
			var app_url = result.app_url ? result.app_url : "";
			var app_desc = result.app_desc ? result.app_desc : "";
			
			html.push("<div class='app-con-pic'><img src='static/images/app-icon-f.png' alt=''/></div>");
			html.push("<h3 class='app-con-tit'>" + app_name + "</h3>");
			html.push("<p><em class='app-con-key-tit'>应用标识：</em>" + app_id + "</p>");
			html.push("<p><em class='app-con-key-tit'>应用密钥：</em>" + app_secret + "</p>");
			html.push("<p><em class='app-con-key-tit'>授权令牌：</em>" + access_token + "</p>");
			html.push("<p><em class='app-con-key-tit'>应用地址：</em>" + app_url + "</p>");
			html.push("<h4 class='app-con-edition'>应用描述：" + app_desc + "</h4>");
			$(".app-content").html(html.join(""));
		}
	});
	
	$("#back").bind("click",function(){
		$("#main_warp").load("manage/app/app_list.html");
		$("#app_id").val(id);
	});
});
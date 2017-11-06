var home = {
	init: function(){
		$("#app_manage").bind("click",function(){
			home.checkPriv("manage/app/app_list.html");
		});
		
		$("#app_create").bind("click",function(){
			home.checkPriv("manage/app/app_create.html");
		});
		
		$(".crumb-nav").html("");
	},
	checkPriv: function(url){
		Invoker.async("UserPersonalInfoController", "checkUserInfo", {}, function(result){
			if(result.res_code == "00000"){
				Utils.load("#main_warp",url);
			}
			else if(result.res_code == "40005"){
				layer.alert("没有该菜单权限，请先填写合作关系资料", {
					skin: "layui-layer-lan",
					end: function(){
						Utils.load("#main_warp","manage/account/cooperation_apply.html");
						$(".crumb-nav").html("");
					}
				});
			}
			else if(result.res_code == "40007"){
				Utils.alert("没有该菜单权限，合作关系资料正在审核中");
			}else if (result.res_code == "40001"){
				Utils.alert("该功能只对注册用户开放，请登录后再尝试访问！",function(){window.location.href = "login.html";},null,function(){});
			}
		});
	}
};

$(function(){
	home.init();
});
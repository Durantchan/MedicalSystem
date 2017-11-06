var index = {
	//初始化
	init: function(){
		index.loadMenu();
		index.loadUserName();
//		index.checkUserInfo();
		Utils.load("#main_warp","home/home.html");
	},
	//获取用户名
	loadUserName: function(){
		Invoker.async("LoginController", "getUserName", {}, function(result){
			if(result.res_code == "00000"){
				$(".header-main .nav-login-tit").text(result.result);
			}else{
				if(result.res_code=="40018")
				{
					$(".header-main .nav-login-tit").text("游客");
					$(".header-main .nav-login-link").html('<i class="nav-esc-icon"></i>注册或登录');
					$(".header-main .nav-login-link").unbind("click").click(function(){
						window.location.href = "login.html";
					});
				}
			}
		}, false);
	},
	//加载菜单
	loadMenu: function(){
		Invoker.async("CacheController", "getSubMenu", "-1", function(data){
			if(data.res_code == "00000"){
				var rootMenu = data.result;
				var html = [];
				$.each(rootMenu, function(index,menu){
					html.push("<li class='nav-item' menu_id='" + menu.menu_id + "'>");
					html.push("    <a class='nav-link' href='javascript:void(0)' menu_code='" + menu.menu_code + "' >" + menu.menu_name + "</a>");
					html.push("</li>");
				});
				$(".header-main .nav > ul > li:eq(0)").before(html.join(""));
				
				//绑定一级菜单栏单击事件
				$(".header-main .nav-link").removeData("init").click(index.loadUrl);
				//初始化事件
				index.initEvent();
			}
			
		}, false);
	},
	//判断是否已经申请合作关系
	checkUserInfo: function(){
		//合作资料填写
		Invoker.async("UserPersonalInfoController", "checkUserInfo", {}, function(result){
			if(result.res_code == "40005"){
				layer.confirm("您未填写合作关系资料，是否现在填写?", {btn: ["确定", "取消"]}, function(index){
					Utils.load("#main_warp","manage/account/cooperation_apply.html");
					layer.close(index);
				});
			}
		}, false);
	},
	//初始化事件
	initEvent: function(){
		$(".header-main .nav-item").hover(index.menuOver, index.menuOut);
		//用户信息鼠标事件
		$(".header-main .nav-login").hover(function(){
			$(this).addClass("active").find(".nav-login-menu").addClass("sub-show");
		}, function(){
			$(this).removeClass("active").find(".nav-login-menu").removeClass("sub-show");
		});
		
		$(".header-main .nav-login-link").click(index.exit);
	},
	//菜单鼠标悬停事件
	menuOver: function(){
		var _self = $(this);
		if(!_self.data("init")){//未加载则进行查询加载
			var menu_id = _self.attr("menu_id");
			var menu_code = _self.find(".nav-link").attr("menu_code");
			Invoker.async("CacheController", "getSubMenu", menu_id , function(result){
				if(result.res_code == "00000"){
					var menus = result.result;
					if(!$.isArray(menus) || menus.length < 1){
						return;
					}
					
					var is_identify = false;//是否认证用户
					if(menu_code == "user_mg"){
						Invoker.sync("LoginController", "getUserStatus", {} , function(result){
							if(result.res_code == "00000" && result.result == "1001"){
								is_identify = true;
							}
						});
					}
					
					var html = [];
					html.push("<div class='nav-sub-list'><ul>");
					$.each(menus, function(i, menu){
						if(menu_code == "user_mg" && menu.menu_code == "cooperation_apply" && is_identify){
							//如果是认证用户，隐藏合作申请菜单
							return true;
						}
						
						html.push("<li class='nav-sub-item'>");
						html.push("    <a href='javascript:void(0)' class='nav-sub-link' menu_code='" + menu.menu_code + "'>" + menu.menu_name + "</a>");
						html.push("</li>");
					});
					
					if(menu_code == "user_mg" && is_identify){
						//如果是认证用户，个人信息菜单添加解除合作按钮
						html.push("<li class='nav-sub-item'>");
						html.push("    <a href='javascript:void(0)' class='nav-sub-link' onclick='index.removeCooperation()'>解除合作</a>");
						html.push("</li>");
					}
					
					html.push("</ul></div>");
					
					_self.append(html.join(""));
					
					$(".header-main .nav-sub-link").click(index.loadUrl);//绑定子菜单单击事件
					_self.addClass("active").find(".nav-sub-list").addClass("sub-show");
				}
			}, false);
			
			_self.data("init", true);
		}
		else{
			_self.addClass("active").find(".nav-sub-list").addClass("sub-show");
		}
	},
	//鼠标离开事件
	menuOut: function(){//mouseout事件
		$(this).removeClass("active").find(".sub-show").removeClass("sub-show");
	},
	//注销
	exit: function(){
		layer.confirm("确认注销当前登录用户？", {btn: ["确定", "取消"]}, function(){
			Invoker.async("LoginController", "exit", "-1", function(data){
				window.location.href = "login.html";
			});
		});
	},
	//解除合作关系
	removeCooperation: function(){
		layer.confirm("解除合作关系后会失去部分权限，是否解除?", {btn: ["确定", "取消"]}, function(){
			Invoker.async("UserPersonalInfoController", "removeCooperation", {} , function(result){
				if(result.res_code == "00000"){
					Utils.alert("用户解除合作关系申请提交成功，请等待审核");
				}
				else if(result.res_code == "40007"){
					Utils.alert("合作关系资料正在审核，不允许重复申请");
				}
			});
		});
	},
	//子菜单单击事件
	loadUrl: function(){
		var menu_code = $(this).attr("menu_code");
		if(!menu_code){
			return;
		}
		
		var currName = $(this).text();
		
		Invoker.async("CacheController", "getMenu", menu_code, function(data){
			if(data.res_code == "00000"){
				var menu = data.result;
				var menu_url = menu.menu_url;
				if(!menu_url){
					return;
				}
				
				Utils.load("#main_warp",menu_url);
				
				var subItem = $(".nav a[menu_code=" + menu_code + "]").closest(".nav-sub-item");
				var navLink = $(".nav a[menu_code=" + menu_code + "]").closest(".nav-item").find(".nav-link");
				if(subItem.length > 0 && navLink.length > 0){//二级菜单
					var html = [];
					html.push("<a class='bar-link' href='javascript:void(0)' menu_code='main'>首页</a>");
					html.push("<span class='mlr5'>&gt;</span>");
					html.push("<a href='javascript:void(0)'>" + navLink.text() + "</a>");
					html.push("<span class='mlr5'>&gt;</span>");
					html.push("<a href='javascript:void(0)' class='active' menu_code='" + menu_code + "'>" + currName + "</a>");
					$(".crumb-nav").html(html.join(""));
				}
				else{//一级菜单
					var html = [];
					html.push("<a class='bar-link' href='javascript:void(0)' menu_code='main'>首页</a>");
					html.push("<span class='mlr5'>&gt;</span>");
					html.push("<a href='javascript:void(0)' class='active' menu_code='" + menu_code + "'>" + currName + "</a>");
					$(".crumb-nav").html(html.join(""));
				}
				
				$(".crumb-nav a[menu_code]").click(function(){
					var _menu_code = $(this).attr("menu_code");
					if(_menu_code){
						$(".nav a[menu_code=" + _menu_code + "]").click();
					}
				});
			}
			else{
				//判断合作关系资料是否正在审核中
				Invoker.async("UserPersonalInfoController", "checkUserInfo", {}, function(result){
					if(result.res_code == "40007"){
						Utils.alert("没有该菜单权限，合作关系资料正在审核中");
					}
					else if(result.res_code == "40005"){
						layer.alert("没有该菜单权限，请先填写合作关系资料", {
							skin: "layui-layer-lan",
							end: function(){
								Utils.load("#main_warp","manage/account/cooperation_apply.html");
								$(".crumb-nav").html("");
							}
						});
					}else if (result.res_code == "40001"){
						Utils.alert("该功能只对注册用户开放，请登录后再尝试访问！",function(){window.location.href = "login.html";},null,function(){});
					}
				}, false);
			}
		});
	}
};

$(function(){
	index.init();
});
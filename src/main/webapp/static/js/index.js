/**
 * 首页头部登陆用户的信息
 */
var splogin = {
	
	need_load_home : false,
	/**初始化菜单*/
	initMenu: function(){
		var _self = this;
		Invoker.async("HomeController", "getPortalMenus", {}, function(menus){
			var menuData = _self.handleMenuData(menus);
			var rootMenus = menuData["-3"];
			_self.renderMenu(rootMenus, menuData, $("#menu_ul"));
			_self.initMenuEvent(menuData);
			//_self.loadFavorMenu(menus);
			//xenon-custom.js
			/*setup_horizontal_menu();*/			
			//打开第一个有url的菜单
			$.each(rootMenus, function(i, menu){
				if(!menu.menu_url){
					return true;
				}else{
					_self.need_load_home = true;
					$("#menu_ul a[menu_id=" + menu.menu_id + "]").click();
					return false;
				}
			});  
		});
	},

	/**渲染菜单*/
	renderMenu: function(menus, menuData, ul){
		var _self = this;
		if($.isArray(menus) && menus.length > 0){
				
			$.each(menus, function(i, menu){
				//var subMenus = menuData[menu.menu_id];
				//if($.isArray(subMenus) && subMenus.length > 0){
				var menuLi = _self.getMenuLi(menu);
					ul.append(menuLi);
					
				});
				
				}
		//	}
	
	},

	/**菜单数据处理，把相同parent_id分组*/
	handleMenuData:function(data){
		var menuData = {};

		if($.isArray(data) && data.length > 0){
			$.each(data, function(i, menu){
				if(menuData[menu.parent_id] == undefined){
					menuData[menu.parent_id] = [];
				}

				menuData[menu.parent_id].push(menu);
			});
		}

		return menuData;
	},

		/**获取菜单li模版*/
	getMenuLiHtml: function(){
		var html = [];
		html.push(" <li class='nav-item'>");
		html.push("    <a href='javascript:void(0)' class='nav-link' name='topMenu' >");
		html.push("    </a>");
		html.push("</li>");
		return html.join("");
	},

	/**生成菜单li对象*/
	getMenuLi: function(menu){
		var _self = this;

		var menu_id = menu.menu_id;//菜单id
		var menu_name = menu.menu_name;//菜单名称
		var menu_icon = menu.menu_icon;//图标样式
		var menuLi = $(_self.getMenuLiHtml());
		//菜单id&菜单数据
		menuLi.find("a[name=topMenu]").attr("menu_id", menu_id).data("topMenu", menu);
		menuLi.find("a[name=topMenu]").text(menu_name);
		if(menu.parent_id == "-1"){
			menuLi.find(".btn-favor").remove();
		}

		return menuLi;
	},
		
	/**初始化菜单事件*/
	initMenuEvent: function(menuData){
		var _self = this;
		$(".nav .nav-item").unbind("click").bind("click",function(){
			// $("#main_warp").load("business_query/business_query_submenu.html");
			$("a", $(this).parent()).removeClass("active");
			$(this).find("a").addClass("active");
		});

			
		$("#menu_ul a[name=topMenu]").click(function(e, jump_menu_id,params){
			var menu = $(this).data("topMenu");
			if($.isEmptyObject(menu)){
				return;
			}
			var menu_id = menu.menu_id;
			var menu_url = menu.menu_url;
			var show_type = menu.show_type;
			var subMenus = menuData[menu_id];
			if(!($.isArray(subMenus) && subMenus.length > 0)){
				if(!menu_url){
				return;
			}else{
				//没有子菜单
				if(menu_url == 'home/home.html'){
					$("#main_home").show();
					$("#main_warp").hide();
					if(_self.need_load_home == true){
						_self.need_load_home = false;
						$("#main_home").load(menu_url);
					}
				}else{
					$("#main_home").hide();
					$("#main_warp").show();
					$("#main_warp").load(menu_url);}
				}
			}else{
				//有子菜单
				$("#main_home").hide();
				$("#main_warp").show();
				$("#main_warp").load("home/sub_menu_center.html",[],function(){
				userMenuCenter.initMenu(subMenus, jump_menu_id,params);
			});
			}
		});
	},

	/**获取登录cust_name*/
	login: function(){
		//debugger;
		var params = {};
		Invoker.async("SPUserController", "getCustName", params, function(result){
			//debugger;
			//alert(JSON.stringify(result));
			var res_code = result.res_code;
			if(res_code == "00000"){
				$(".top-client-name").html(result.result.spuser.user_name);//放user_name
				$(".last_online_time").html(result.result.spuser.last_online_time);
			}
		});
	},
	
	initEvent : function() {
		var me = this;
		$(".Logout_btn").unbind("click").click(function(e) {
			Invoker.async("SPUserController", "spUserLogout", {}, function(result){
				var res_code = result.res_code;
				if(res_code == "00000"){
					Utils.alert("注销登录成功", function(){
						window.location.href = "login.html";
					});
				}else{
					Utils.alert("注销账号失败");
				}
			});
		});
		
		$(".ModifyPW_btn").unbind("click").click(function(e) {
			Utils.layerOpen("修改密码", "/index_panel/reset_password.html",null,"330","500");
		});
		//下载操作手册
		$(".downlod_guide_doc").unbind("click").click(function(e) {
			window.open(Utils.getContextPath() + "/servlet/downloadExcel?type=doc&fieldCode=10006"); 
		});
	},
	
	init : function() {
		var me = this;
		me.need_load_home = false;
		me.initDate();
		me.login();
		me.initEvent();
	},

	initDate : function() {
		var array = new Array("日", "一", "二", "三", "四", "五", "六");  
		var today = new Date();
		$('#today').text((today.getMonth()*1+1)+"月"+today.getDate()+"日");
		$('#this_week').text("星期" + array[today.getDay()]);
	}
};

$(function(){	
	splogin.init();
	splogin.initMenu();
});
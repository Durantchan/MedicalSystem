var manage = {
	init: function(){
		if(manage.relocate()){
			manage.loadMenu();
		}
		if(user_status!='1001'){
			$('#remove').css('display','none');
		} else{
			$('#remove').css('display','');
			$('#remove').css('float','left');

		}
		manage.showNotice();
		manage.initBtns();
	},
	
	//查询用户是否有站内通知
	showNotice:function(){
		Invoker.async("UserPersonalInfoController", "listNotice",{list_type:'F'}, function(ret){
			if(!ret.result||ret.result.length==0){
				$('.notice_icron').css('display','none');
			}else{
				$('.notice_icron').html(ret.result.length);
				$('.notice_icron').css('display','');
			}
		});
		
		
		
	},
	//初始化解除关系按钮,站内消息按钮
	initBtns:function(){
		$('#remove').click(function(){
			if(confirm('解除合作后,某些功能即将失效,是否要解除合作关系?')){
				Invoker.async("UserPersonalInfoController", "removeCoperation",null, function(data){
					if(data.res_code=='00000'){
						alert("用户解除合作关系成功!");
						location.href="index.html";
					}else{
						alert("系统内部出错,请稍候再试!");
					}
				});
			}
			
		});
	},
	
	loadMenu: function(){
		Invoker.async("CacheController", "getSubMenu", "-2", function(data){
			if($.isArray(data)){
				var m = $.query.load(window.location.search).get("m");
				var ap;
				var html = [];
				$.each(data, function(i, menu){
					var code = $.trim(menu.menu_code);
					var icon = $.trim(menu.menu_icon);
					if(code=='myapp'){
						ap = code;
					}
					html.push("<li>");
					html.push("    <a id='" + code + "' href='index.html?m=" + m + "&i=" + code + "'>");
					html.push("        <span class='icron " + icon + "'>" + menu.menu_name + "</span><span class='arr_r'></span>");
					html.push("    </a>");
					html.push("</li>");
				});
				
				$(".center_left > .leftmenu").html(html.join(""));
				$(".center_left > .leftmenu a").click(function(e){
				//	if(ap=='myapp'){return true;}
					return Utils.pjax(this, manage.relocate);
				});
				
				var i = $.query.load(window.location.search).get("i");
				var menu_code = !$.trim(i) ? "myapp" : $.trim(i);
				$(".center_left > .leftmenu a").removeClass("menu_on");
				$("#" + menu_code).addClass("menu_on");
				
				Utils.getLoginUser(function(data){
					if(data.result != null && data.result != ""){
						if( data.result.status_cd='1001'){
							$('#user_status').html("[认证用户]");
						}else{
							$('#user_status').html("[普通用户]");
						}
						$(".info").empty();
						$(".phone").empty();
						$(".info").html(data.result.user_name);
						$(".phone").html(data.result.mobile_phone);
					}
				});
			}
		});
	},
	relocate: function(){
		var load_menu = true;
		var i = $.query.load(window.location.search).get("i");
		var menu_code = !$.trim(i) ? "myapp" : $.trim(i);
		$(".center_left > .leftmenu a").removeClass("menu_on");
		$("#" + menu_code).addClass("menu_on");
		
		Invoker.sync("CacheController", "getMenu", menu_code, function(data){
			if(data.res_code == "00000"){
				var menu = data.result;
				var page_flag = $.trim(menu.page_flag);
				if(page_flag){
					load_menu = false;
					$(".footerBar").hide();
					$(page_flag).load(menu.menu_url, function(){
						if(!$(".footerBar").is(":visible")){
							$(".footerBar").show();
						}
					});
				}
				else{
					$(".center_right").load(menu.menu_url);
				}
			}
			else if(data.res_code == ""){
				//没有权限则跳转到首页
			}
			else{
				//没有权限跳转到首页
				location.href = 'index.html';
			}
		});
		
		return load_menu;
	}
	
};

$(function(){
	manage.init();
});
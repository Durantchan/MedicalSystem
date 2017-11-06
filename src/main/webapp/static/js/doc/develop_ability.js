var developAbility = {
	init : function(){
		developAbility.relocate();
	},
	
	drawPage : function(){
		var menu_code = $.query.load(window.location.search).get("m");  //开发文档菜单
		var catalog_id = $.query.load(window.location.search).get("i"); //一级目录
		var sub_catalog_id = $.query.load(window.location.search).get("j"); //二级目录
		var ability_id = $.query.load(window.location.search).get("k"); //能力
		Invoker.sync("AbilityController", "queryAbilityById", ability_id, function(ability){
			if(ability != null && ability.ability_name != null){
				$(".center_right .cer-main").find("[name=ability_name]").html(ability.ability_name);
			}
		});
		Invoker.sync("CacheController", "getApi", ability_id, function(apis){   
			var html = [];
			if($.isArray(apis)){
				$.each(apis, function(i,api){
					html.push("<a href='index.html?m=" + menu_code + "&i=" + catalog_id + "&j=" + sub_catalog_id + 
										"&k=" + ability_id + "&h=" + api.api_id + "'onClick='return false'  class='left'>" + api.api_name + "</a>");
				});
				$(".center_right .titCont span").html(html.join(''));
				
				$(".center_right .titCont span a").click(function(e){
					Utils.pjax(this , function(){
						$(".center_main").load("doc/develop_api.html", function(){
							
						});
					});

				});
				
			}
		});
		
	},
	
	relocate : function(){
		var h = $.query.load(window.location.search).get("h");
		if($.trim(h)){
			$(".center_main").load("doc/develop_api.html", function(){
				
			});
		}else{
			developAbility.drawPage();
		}

	}
};


$(function(){
	developAbility.init();
});
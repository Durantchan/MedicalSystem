var userCenter = {
	
	//初始化菜单点击事件
	initSubmenuClk : function(){
		$(".tab-nav .tab-item").unbind("click").bind("click",function(){
			Utils.load("#main_container",$(this).find("a").attr("url"));
			$("a", $(this).parent()).removeClass("active");
			$(this).find("a").addClass("active");
		});
	},
	
	init : function() {
		userCenter.initSubmenuClk();
		$(".tab-nav .tab-item").eq(0).click();
	}
};

$(function(){
	userCenter.init();
});



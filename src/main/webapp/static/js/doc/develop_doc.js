var abilityObj = {};
var abilityCatalogObj = {};
var developDoc = {
	init : function(){
		var me = this;
		
		//搜索按钮事件
		$(".submit-btn").unbind("click").click(function(){
			var text = $(".inp-text").val();
			$("#main_warp").load("doc/develop_api.html",function(){
				developApi.init();
				$(".inp-text").val(text);
				Invoker.async("AbilityApiDocController", "queryAbilityApiDocByName",text,function(reply){
					developApi.loadSearchResult(reply,text);
				});
			});
		});
		
		Invoker.sync("AbilityApiDocController", "queryApiDocList","",function(reply){
			me.loadAbilityCatalogs(reply);
		});
	},	
	
	loadAbilityCatalogs : function(array){
		var page_html = '<div class="help-doc-type">能力API</div>';
		Invoker.sync("CacheController", "getAbilityCatalog", "-1", function(AbilityCatalogs){   //一级目录
			if($.isArray(AbilityCatalogs)){
				//abilityCatalogObj["-1"] = AbilityCatalogs;
				$.each(AbilityCatalogs, function(i,abilityCatalog){
					var catalog_id = abilityCatalog.catalog_id;
					page_html += '<div class="help-doc-list-tit">'+abilityCatalog.catalog_name+'</div>';
					page_html += '<div class="clear-fix"><ul>';
					Invoker.sync("CacheController", "getAbilityCatalog", catalog_id, function(data){
						//二级目录
						if (!data || data.length== 0)
						{
							//如果这个目录下没有二级目录，那么也要检查是否挂了能力
							Invoker.sync("CacheController", "getAbility", catalog_id, function(abilitys){   
								//能力
								if($.isArray(abilitys)){
									var abi_count = 0;
									page_html += '<li class="help-doc-item"><div class="help-doc-sub-list" style="padding:0px 0 0px 1em"><ul>';
									$.each(abilitys, function(k,ability){
										if (true)
										{
											
										//判断是否有配置能力API文档，有才显示，备用
										abi_count++;
										page_html += '<li class="help-doc-item">';
										page_html += '<a href="javascript:void(0);" ability="'+ability.ability_id+'" class="help-doc-item-link"><i class="help-item-dot-icon"></i>'+ability.ability_name+'</a>';	
										page_html += '</li>';
										}
									});
									page_html += '</ul></div></li>';
								}
							});	
							return;
						}
						
						if($.isArray(data)){
							abilityCatalogObj[catalog_id] = data;						
							$.each(data, function(j,subAbilityCatalog){
								var subCatalog_id = subAbilityCatalog.catalog_id;
								page_html += '<li class="help-doc-item">';
								page_html += '<a href="javascript:void(0);" class="help-doc-item-link" catalog_id="'+subCatalog_id+'">'+subAbilityCatalog.catalog_name+'</a>';
								Invoker.sync("CacheController", "getAbility", subCatalog_id, function(abilitys){   
									//能力
									if($.isArray(abilitys)){
										var abi_count = 0;
										page_html += '<div catalog_id="'+subCatalog_id+'" class="help-doc-sub-list"><ul>';
										$.each(abilitys, function(k,ability){
											//jQuery.inArray(ability.ability_id,array)>=0
											if (true)
											{
												
											//判断是否有配置能力API文档，有才显示，备用
											abi_count++;
											page_html += '<li class="help-doc-item">';
											page_html += '<a href="javascript:void(0);" ability="'+ability.ability_id+'" class="help-doc-item-link"><i class="help-item-dot-icon"></i>'+ability.ability_name+'</a>';	
											page_html += '</li>';
											}
										});
										page_html += '</ul></div>';
									}
								});		
								page_html += '</li>';
							});
						}
					});
					page_html += '</ul></div>';
				});
				
			}
		});
		
		$(".help-doc-list").html(page_html);
		$("div[catalog_id]").hide();
		
		$("a[ability]").unbind("click").click(function(){
			var ability_id = $(this).attr('ability');
			$("#main_warp").load("doc/develop_api.html",function(){
				developApi.init(ability_id);
			});
		});
		
		$("a[catalog_id]").unbind("click").click(function(){
			var catalog_id = $(this).attr('catalog_id');
			if ($("div[catalog_id='"+catalog_id+"']").css("display")=="none")
			{
				$("div[catalog_id='"+catalog_id+"']").slideDown();
			}
			else
			{
				$("div[catalog_id='"+catalog_id+"']").slideUp();
			}
		});
	},
	
	drawLeft : function(){

	}
};

$(function(){
	supportPlaceholder='placeholder'in document.createElement('input'),
	 
	  placeholder=function(input){
	 
	    var text = input.attr('placeholder'),
	    defaultValue = input.defaultValue;
	 
	    if(!defaultValue){
	 
	      input.val(text).addClass("phcolor");
	    }
	 
	    input.focus(function(){
	 
	      if(input.val() == text){
	   
	        $(this).val("");
	      }
	    });
	 
	  
	    input.blur(function(){
	 
	      if(input.val() == ""){
	       
	        $(this).val(text).addClass("phcolor");
	      }
	    });
	 
	    //输入的字符不为灰色
	    input.keydown(function(){
	  
	      $(this).removeClass("phcolor");
	    });
	  };
	 
	  //当浏览器不支持placeholder属性时，调用placeholder函数
	  if(!supportPlaceholder){
	 
	    $('input').each(function(){
	 
	      text = $(this).attr("placeholder");
	 
	      if($(this).attr("type") == "text"){
	 
	        placeholder($(this));
	      }
	    });
	  }
	  
	developDoc.init();
});
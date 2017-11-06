var developApi = {
	ability_id: "",
	api_name : "",
	curMenu : null,
	zTree_Menu : null,
	catalog_list : [],
	target_ability : null,
	setting : {
		view: {
			showLine: false,
			showIcon: false,
			selectedMulti: false,
			dblClickExpand: false,
			addDiyDom: function(treeId, treeNode) {
				var spaceWidth = 5;
				var switchObj = $("#" + treeNode.tId + "_switch"),
					icoObj = $("#" + treeNode.tId + "_ico");
				switchObj.remove();
				icoObj.before(switchObj);
				
				if (treeNode.level > 1) {
					var spaceStr = "<span style='display: inline-block;width:" + (spaceWidth * treeNode.level)+ "px'></span>";
					switchObj.before(spaceStr);
				}
				}
		},
		async : {
			enable : true,
			url : "CacheController.getAbilityCatalogByMap",
			autoParam : ["catalog_id"]
		},
		data: {
			key : {
				name : "catalog_name"
			},
			simpleData: {
				enable: true,
				idKey : "catalog_id",
				pIdKey : "parent_id",
				rootPId: "-1"
			}
		},
		callback: {
			onClick: function(event, treeId, treeNode){
				if (treeNode.catalog_id.indexOf("ability_")!=-1)
				{
					//能力节点
					var ability_id = treeNode.catalog_id.substring(8);
					developApi.ability_id = ability_id;
					var title = treeNode.catalog_name;
					$(".help-col-title").html(title);
					
					Invoker.async("AbilityApiDocController", "queryAbilityApiDoc",ability_id,function(reply){
						if(reply)
						{
							developApi.ShowApi(reply);
						}
					});
				}
				else
				{
					zTree_Menu.expandNode(treeNode);
				}
			},
			onExpand:function(event, treeId, treeNode){
				if (developApi.catalog_list.length > 0)
				{
					var catalog_id = developApi.catalog_list[0];
					var target_nodes = zTree_Menu.getNodesByParam("catalog_id",catalog_id);
					developApi.catalog_list.splice(0,1);
					if (target_nodes && target_nodes.length > 0)
					{
						var target = target_nodes[0];
						zTree_Menu.expandNode(target,true,false,false,true);
					}
				}else{
					if(developApi.target_ability)
					{
						var click_node = zTree_Menu.getNodesByParam("catalog_id","ability_"+developApi.target_ability)[0];
						zTree_Menu.selectNode(click_node,false,true);
						developApi.target_ability = null;
					}
				}
			}
		}
	},
	init : function(ability_id){
		var me = this;
		$.fn.zTree.init($("#system-tree"), me.setting);
		zTree_Menu = $.fn.zTree.getZTreeObj("system-tree");
		
		$(".submit-btn").unbind("click").click(function(){
			//搜索按钮
			var text = $(".inp-text").val();

			Invoker.sync("AbilityApiDocController", "queryAbilityApiDocByName",text,function(reply){
				me.loadSearchResult(reply,text);
			});
		});
	},
	loadSearchResult:function(array,keyword){
		$(".help-col-title").html("搜索结果"+'<em class="help-col-tit-note">搜到“'+keyword+'”相关的结果，共'+array.length+'条 </em>');
		$(".help-article").css("line-height","1");
		$(".help-article").html("");
		var search_html = "";
		
		for(var i=0;i<array.length;i++)
		{
			search_html += '<dl class="help-col-item"><dt class="help-col-item-tit">';
			search_html += '<a href="javascript:void(0);" ability="'+array[i].ability_id+'" class="search_link_item">'+array[i].ability_name+'</a></dt>';
			search_html += '</dl>';
		}
		
		$(".help-article").html(search_html);
		
		$(".search_link_item").unbind("click").click(function(){
			var target_id = $(this).attr("ability");
			var target_name = $(this).html();
			developApi.target_ability = target_id;
			//立刻查询API，左侧目录树的跳转另行处理
			developApi.setting.callback.onClick(null,null,{catalog_id:"ability_"+target_id,catalog_name:target_name});
			//先进行全部折叠，后续只展开指定节点
			zTree_Menu.expandAll(false);
			Invoker.async("AbilityApiDocController", "queryApiDocCatalogByAbility",target_id,function(reply){
				if (reply.length && reply.length > 0)
				{
					reply.reverse();//逆序，这样就是从-1开始
					var catalog_id = reply[0];
					if(catalog_id == "-1" && reply.length > 1)
					{
						reply.splice(0,1);
						catalog_id = reply[0];
					}
						var target_nodes = zTree_Menu.getNodesByParam("catalog_id",catalog_id);
						reply.splice(0,1);
						for(var i=0;i<reply.length;i++)
						{
						developApi.catalog_list.push(reply[i]);
						}
						if (target_nodes && target_nodes.length > 0)
						{
							var target = target_nodes[0];
							zTree_Menu.expandNode(target,true,false,false,true);
						}
				}
			});
		});
	},
	ShowApi:function(apidoc){
		//API详细内容展示部分
		var detail_html = "该能力尚未提供开发文档";
		//console.log(apidoc);
		$(".help-article").css("line-height","1.6");
		if (apidoc.length)
		{
		detail_html = "";
			for(var i=0;i<apidoc.length;i++)
			{
				//构造详细内容展示
				var data = apidoc[i];
				detail_html += "<h3><b>"+data.api_attr_name+"</b></h3>";
				if (data.show_type != "table")
				{
					var div_head = "<p>";
					var div_tail = "</p>";

					if (data.show_type == "text") {
						div_head = "<pre class='help-article_code'><code>";
						div_tail = "</code></pre>";
					}

					if (data.api_attr_value) {
						//替换特殊字符避免显示异常
						data.api_attr_value = data.api_attr_value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
						detail_html += div_head + data.api_attr_value + div_tail;
					} else {
						detail_html += div_head + data.default_value + div_tail;
					}
				}
				else
				{
					//TABLE，表格型
					if (data.tablelist.length)
					{
						detail_html += '<div class="search-list param-list-0"><table class="table0">';
						detail_html += '<tr><th class="text-center">字段名称</th><th class="text-center">字段类型</th><th class="text-center">是否必填</th><th class="text-center">参数说明</th><th class="text-center">父节点</th></tr>';
						for(var j=0;j<data.tablelist.length;j++)
						{
							var tableparam = data.tablelist[j];
							detail_html += "<tr>";
							detail_html += '<td class="text-center">'+tableparam.api_param_name+'</td>';
							detail_html += '<td class="text-center">'+tableparam.api_param_type+'</td>';
							if (tableparam.is_must == 'T')
							{
								detail_html += '<td class="text-center">必填</td>';
							}
							else{
								detail_html += '<td class="text-center">非必填</td>';
							}
							detail_html += '<td class="text-center">'+tableparam.api_param_desc+'</td>';
							detail_html += '<td class="text-center">'+(tableparam.parent_node?tableparam.parent_node:"无")+'</td>';
							detail_html += "</tr>";
						}
						detail_html += "</table></div>";
					}
				}
			}
		}
		detail_html += "</br></br><button type='button' class='inp-btn-t' id='test_ability'>能力测试</button>";
		$(".help-article").html(detail_html);
		
		$("#test_ability").bind("click", developApi.testAbility);
	},
	
	testAbility: function(){
		if(developApi.ability_id){
			window.open('doc/test_ability.html?id=' + developApi.ability_id);
		}
	}
};

$(function(){
	$("input").placeholder();
	developApi.init();
});



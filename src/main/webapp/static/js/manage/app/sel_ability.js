var page_curr = "";
var index = parent.layer.getFrameIndex(window.name);
var catalog_id = "";
var setting = {
	view: {
		showLine: false,
		showIcon: false,
		selectedMulti: false,
		dblClickExpand: false,
		addDiyDom: addDiyDom
	},
	data: {
		simpleData: {
			enable: true
		}
	},
	callback: {
		onClick : function(event, treeId, treeNode) {
			var id = treeNode.id;
			catalog_id = id;
			selAbility.initAbility("1", "10", id);
		}
	}
};

var selAbility = {
	initButton: function(){
		$("#addAbility").bind("click", selAbility.addAbility);
		$("#content").bind("keydown", function(e){
			if(e.keyCode == 13){
				selAbility.initAbility("1", "10", catalog_id, $("#content").val());
			}
		});
		
		$("#serch").click(function(){
			selAbility.initAbility("1", "10", catalog_id, $("#content").val());
		});
		
		$("#celAbility").bind("click", function(){
			//关闭窗口
			parent.layer.close(index);
		});
	},
	
	initAbility: function(pageNum, pageRow, catalog_id, content){
		var param = {};
		var num = 1;
		var row = 10;
		param.pageNum = pageNum==null? num : pageNum;
		param.pageRow = pageRow==null? row : pageRow;
		param.catalog_id = catalog_id;
		param.content = content;
		Invoker.async("ManageAppController", "listAbilityPage", param, function(data) {
			if (data.res_code == "00000") {
				selAbility.appendAppInfo(data);
				
				laypage({
					cont: 'abilityPage',
					pages: data.result.pageCount, //总页数
					curr: data.result.pageNumber, //当前页
					//skin: '#6495ED',
					groups: '3', //连续页数
					skip: true, //跳页
					jump: function(obj, first){
						if(!first){ 
							page_curr = obj.curr;
							selAbility.initAbility(obj.curr);
						}
					}
				});
			}
			else{
				Utils.alert(data.res_message);
			}
		});
	},
	
	appendAppInfo: function(data){
		var page = [];
		var html = [];
		var rows = data.result.rows;
		html.push("<tbody><tr><th>图标/名称</th>" +
				"<th class='text-center'>状态</th>" +
				"<th class='text-center'>API版本</th>" +
				"<th class='text-center'>所属目录</th>" +
				"<th class='text-center'>创建时间</th></tr></tbody><tbody id='ability_tbody'>");
		if(rows != null){
			$.each(rows, function(i,value){
				var method = value.method==null?"":value.method;
				var version = value.version==null?"":value.version;
				html.push("<tr><td><input type='checkbox' name='chk_list' value='"+value.ability_id+"' style='margin-right: 10px;'/>" +
						"<div class='app-list-pic'><img src='../../static/images/menu-list-icon.png' alt=''/></div><a href='javascript:;' class='ctrl' title='查看详情'>"+value.ability_name+"</a></td>" +
						"<td class='text-center'><i class='ios-sign-icon'>"+selAbility.getAbilityState(value.status_cd)+"</i></td>" +
						"<td class='text-center'>"+version+"</td>" +
						"<td class='text-center'>"+value.catalog_name+"</td>" +
						"<td class='text-center'>"+value.create_date+"</td>");
			});
		}
		html.push("</tbody>");
		$("#ability_list").html(html.join(""));
	},
	
	addAbility: function(){
		var ids = new Array();
		$("#ability_list input[name='chk_list']").each(function(){
			if(this.checked){
				ids.push(this.value);
			}
		});
		if(ids.length == 0){
			Utils.alert("请选择能力！");
			return;
		}
		var _html = [];
		//var app_id = parent.$("#app_id").val();
		Invoker.async("ManageAppController", "queryAbilitys", {"ids":ids}, function(data) {
			if(data.res_code != "00000"){
				Utils.alert(data.res_message);
			}
			else{
				var oldIDs = new Array();
				//获取所有页面能力ID
				$.each(parent.$("#abilitys").find("tr"),function(){
					oldIDs.push($(this).attr("id"));
				});
				
				$.each(data.result,function(index,value){
					var ability_id = value.ability_id;
					if(selAbility.isExist(oldIDs, ability_id)){
						var version = value.version==null?"":value.version;
						var method = value.method==null?"":value.method;
						_html.push("<tr id='"+value.ability_id+"'><td style='text-align:left;'>"+value.ability_name+"</td>" +
							"<td style='text-align:left;'>"+method+"</td>" +
							"<td style='text-align:center;'>"+version+"</td>" +
							"<td style='text-align:left;'>"+value.catalog_name+"</td>" +
							"<td style='text-align:center;'><a href='javascript:void(0)' onclick='delAbility("+value.ability_id+")'><font color='#4d99d5'>删除</font></td></tr>");
					}
				});
				parent.$("#abilitys").append(_html);
				parent.layer.close(index);
			}
		});
	},
	
	isExist: function(oldIDs, ability_id){
		if($.inArray(ability_id, oldIDs) == "-1"){
			//不存在
			return true;
		}
		else{
			return false;
		}
	},
	
	getAbilityState: function(s){
		var str = "";
		if(s == "1000"){
			str = "创建";
		}
		else if(s == "1100"){
			str = "无效";
		}
		else if(s == "1101"){
			str = "暂停";
		}
		else if(s == "1001"){
			str = "测试";
		}
		else if(s == "1002"){
			str = "发布";
		}
		else if(s == "1102"){
			str = "下线";
		}
		return str;
	},
   	    
	initTree: function(){
		var zNodes = [];
		Invoker.sync("ManageAppController", "getCatalogTree", {"parent_id":"-1"}, function(data){   //一级目录
			if($.isArray(data)){
				$.each(data, function(i,value){
					var catalog = {};
					catalog.id = value.catalog_id;
					catalog.name = value.catalog_name;
					catalog.pId = value.parent_id;
					zNodes.push(catalog);
					if($.isArray(value.catalogs)){
						selAbility.appendChildNode(value.catalogs, zNodes);
					}
				});
			}
		});
		var treeObj = $("#catalog_tree");
		$.fn.zTree.init(treeObj, setting, zNodes);
	},
	appendChildNode: function(trees, zNodes){
		$.each(trees, function(index, value){
			var child = {};
			child.id = value.catalog_id;
			child.name = value.catalog_name;
			child.pId = value.parent_id;
			zNodes.push(child);
			if($.isArray(value.catalogs)){
				selAbility.appendChildNode(value.catalogs, zNodes);
			}
		});
	}
};

function addDiyDom(treeId, treeNode) {
	var spaceWidth = 5;
	var switchObj = $("#" + treeNode.tId + "_switch");
	var icoObj = $("#" + treeNode.tId + "_ico");
	switchObj.remove();
	icoObj.before(switchObj);

	if (treeNode.level > 1) {
		var spaceStr = "<span style='display: inline-block;width:" + (spaceWidth * treeNode.level)+ "px'></span>";
		switchObj.before(spaceStr);
	}
}

$(function(){
	$("input").placeholder();
	selAbility.initAbility(1);
	selAbility.initButton();
	selAbility.initTree();
});
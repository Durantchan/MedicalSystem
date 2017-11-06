var page_curr = "";
var check = false;
var myApp = {
		//初始
	init: function(){
		$("input").placeholder();
		$(".inp-search-btn").bind("click", myApp.searchApp); //应用查询
		$("#selAll").bind("click", myApp.selAllApp);  //全选
		$("#delApp").bind("click", myApp.delApp);	  //删除
		$("#copyApp").bind("click", myApp.copyApp);	  //复制
		
		$(".inp-text").bind("keydown", function(e){ //回车查询
			if(e.keyCode == 13){
				myApp.searchApp();
			}
		});
		
		$(".tab-nav-link").bind("click", myApp.searchAppByState); //根据状态查询应用
		
		$("#createApp").bind("click", myApp.createApp); //创建应用
	},
	
	//加载所有应用
	loadApp: function(status, pageNum, pageRow){
		var param = {};
		var num = 1;
		var row = 10;
		param.status = status == null? "-1" : status;
		param.pageNum = pageNum==null? num : pageNum;
		param.pageRow = pageRow==null? row : pageRow;
		param.content = $(".inp-text").val();
		Invoker.async("ManageAppController", "listApp", param, function(data) {
			if (data.res_code == "00000") {
				myApp.appendAppInfo(data);
				laypage({
					cont: 'appPage',
					pages: data.result.pageCount, //总页数
					curr: data.result.pageNumber, //当前页
					//skin: '#6495ED',
					groups: '3', //连续页数
					skip: true, //跳页
					jump: function(obj, first){ //触发分页后的回调
						if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
							var state = $(".tab-nav-link.active").attr("name");
							page_curr = obj.curr;
							myApp.loadApp(state, obj.curr);
						}
					}
				});
				myApp.initAppEvent();
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
				"<th class='text-center'>应用密钥</th>" +
				"<th class='text-center table-w80'>状态</th>" +
				"<th class='text-center'>创建时间</th>" +
				"<th class='text-center table-w80'>操作</th></tr></tbody><tbody id='app_tbody'>");
		if(rows != null){
			$.each(rows, function(i,value){
				var app_secret = value.app_secret==null?"":value.app_secret;
				var app_id = value.app_id;
				html.push("<tr><td><input type='checkbox' name='chk_list' value='"+app_id+"' style='margin-right: 10px;'/><div class='app-list-pic'><img src='static/images/app-icon-f.png' alt=''/></div><a href='#' class='ctrl' name='"+app_id+"' title='查看详情'>"+value.app_name+"</a></td>" +
						"<td class='text-center'>"+app_secret+"</td>" +
						"<td class='text-center'><i class='ios-sign-icon'>"+getStateDesc(value.status_cd)+"</i></td>" +
						"<td class='text-center'>"+value.create_date+"</td>" +
						"<td class='text-center'>" +
						"<div class='more-pop-warp'>" +
						"   <button type='button' class='btn-icon-ctrl' name='moreButton'></button>" +
						"   <div class='more-pop-main'>" +
						"       <i class='more-pop-icon'></i>" +
						"       <div class='more-pop-list'>" +
						"           <ul>" +
						"          	<li><a href='javascript:;' class='more-pop-item' name='pop' id="+app_id+">查看</a></li>" +
						"               <li><a href='javascript:;' class='more-pop-item' name='edit' id="+app_id+" state="+value.status_cd+">编辑</a></li>" +
						"               <li><a href='javascript:;' class='more-pop-item' name='pub' id="+app_id+">发布</a></li>" +
						"               <li><a href='javascript:;' class='more-pop-item' name='inst' id="+app_id+">下线</a></li>" +
						"           </ul>" +
						"       </div>" +
						"   </div>" +
						"</div>" +
						"</td>");
			});
		}
		else{
			html.push("<tr><td colspan='99' align='center'><font color='red'>暂无数据，请重新查询！</font></td></tr>");
		}
		html.push("</tbody>");
		$("#appList").html(html.join(""));
		
		$(".more-pop-item").bind("click",function(){ //应用查看
			var name = $(this).attr("name");
			var id = $(this).attr("id");
			var state = $(this).attr("state");
			if(name == "pop"){
				$("#main_warp").load("manage/app/app_info.html");
			}
			else if(name == "edit"){
				if(state == "1102"){
					Utils.alert("下线应用，不允许进行修改！");
					return false;
				}
				
				Invoker.async("ManageAppController", "checkEditor", {"app_id":id}, function(data) {
					if(data.res_code != "00000"){
						Utils.alert(data.res_message);
						return false;
					}
					$("#main_warp").load("manage/app/app_edit.html");
				});
			}
			else if(name == "pub"){
				layer.confirm('确定发布该应用？', function(index){
					Invoker.async("ManageAppController", "publicApp", {"app_id":id}, function(data) {
						if(data.res_code != "00000"){
							Utils.alert(data.res_message);
						}
						else{
							$("#main_warp").load("manage/app/public_success.html");
						}
					});
					layer.close(index);
				});
			}
			else if(name == "inst"){
				layer.confirm('确定下线该应用？', function(index){
					Invoker.async("ManageAppController", "downApp", {"app_id":id}, function(data) {
						if(data.res_code != "00000"){
							Utils.alert(data.res_message);
						}
						else{
							var state = $(".tab-nav-link.active").attr("name");
							var num = page_curr==""?"1":page_curr;
							myApp.loadApp(state, num);
							Utils.alert("应用下线成功！");
						}
					});
					layer.close(index);
				});
			}
			$("#app_id").val(id);
		}); 
		
		$(".ctrl").bind("click", function(){
			$("#app_id").val($(this).attr("name"));
			$("#main_warp").load("manage/app/app_info.html");			
		});
	},
	
	selAllApp: function(){
		var unSel = false;
		$("#appList input[name='chk_list']").each(function(){
			if(!this.checked){
				unSel = true;
			}
		});
		
		if(unSel){
			$("#appList input[name='chk_list']").each(function(){
				this.checked = true;
			});
		}
		else{
			$("#appList input[name='chk_list']").each(function(){
				this.checked = false;
			});
		}
	},
	
	delApp: function(){
		var ids = new Array();
		$("#appList input[name='chk_list']").each(function(){
			if(this.checked){
				ids.push(this.value);
			}
		});
		if(ids.length == 0){
			Utils.alert("请选择应用！");
			return;
		}
		//删除应用 状态更新为无效
		layer.confirm('确定删除选中应用？', function(index){
			Invoker.async("ManageAppController", "deleteApp", {ids:ids}, function(data) {
				if(data.res_code != "00000"){
					Utils.alert(data.res_message);
				}
				else{
					var state = $(".tab-nav-link.active").attr("name");
					var num = page_curr==""?"1":page_curr;
					myApp.loadApp(state, num);
				}
			});
			layer.close(index);
		});
	},
	
	copyApp: function(){
		Utils.alert("复制成功！");
	},
	
	initAppEvent: function(){
		$(".more-pop-warp").bind("click", function(){
			$(this).addClass("more-pop-show");
		});
		
		$("#appList tr").hover(function(){
			$("#appList div").removeClass("more-pop-show");
		});
	},
	
	searchAppByState: function(){
		var state = $(this).attr("name");
		myApp.loadApp(state);
		$(".tab-nav-link").removeClass("active");
		$(this).addClass("active");
	},
	
	searchApp:function(){
		var state = $(this).attr("name");
		myApp.loadApp(state);
	},
	
	createApp: function(){
		$("#main_warp").load("manage/app/app_create.html");
	}
};

var getStateDesc = function(s){
	var str = "";
	if(s == "1000"){
		str = "创建";
	}else if(s == "1001"){
		str = "测试";
	}else if(s == "1002"){
		str = "发布";
	}else if(s == "1100"){
		str = "无效";
	}else if(s == "1102"){
		str = "下线";
	}else if(s == "1003"){
		str = "暂停";
	}else if(s == "999"){
		str = "审核中";
	}
	return str;
};

$(function(){
	myApp.loadApp(-1);
	myApp.init();
});

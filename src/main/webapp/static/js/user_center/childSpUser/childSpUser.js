
var ChildSpUser = {
	//初始化
	name : '',
	treeEnable:false,
	isAdd:false,
	init : function() {
		var me = this;
		me.initEvent();
		$("#tree_add").addClass("disabled");
		$("#tree_add").removeClass("link");
		$("#tree_remove").removeClass("link");
		$("#tree_remove").addClass("disabled");
		me.btnShow(true);
		me.initFormTable();//默认不加载
	},
	btnShow: function(flag){
		var me = this;
		me.treeEnable = flag;
		if(flag){
			$("#btn_select_menu").prop("disabled",false);
		}else{
			$("#btn_select_menu").prop("disabled",true);
			$("#tree_add").addClass("disabled");
			$("#tree_remove").addClass("disabled");
		}
	},
	initEvent : function(){
		var me = this;
		$("#search_btn").click(function(e){
			me.initFormTable();
		});
		$("#add_spuser").click(function(e){
			$("#user_name").attr("disabled",false);
			$("[name='spuser_title']").html("新增子帐号");//
			$("#pwd_mode").find("span").css("background","#988A8B");
			me.isAdd = true;
			$("#pwd_tr").show();
			$("#pwd_mode").show();
			me.clearSpuser_div_tab();
			$("#spuser_div").show();
			$("#datafrom").hide();
			$("#user_name").val(me.name);
		});

		$("#pwd_tr #password").blur(function(){
				var password = $("#pwd_tr #password").val();
				$("#pwd_mode").find("span").css("background","#988A8B");
				if(password!="" && password!=null){
					if(password.length<8 || password.length>16){
						Utils.alert("密码格式错误(8~16位)，请重新输入！");
						return false;
					}
					//校验密码复杂度
					var mode = Utils.checkPasswdStrength(password);
					if(mode < 3){
						$("#pwd_mode #weak").addClass("mode").css("background","#f42a38");
						Utils.alert("您输入的密码为弱密码，请您采用至少由8位及以上大小写字母、"
								+ "数字及特殊字符等混合、随机组成（至少包括数字、小写字母、大写字母和特殊符号中的三种）的密码串。");
						return false;
					}else if(mode == 3){
						$("#pwd_mode #normal").addClass("mode").css("background","#f4a62a");
					}else if(mode > 3){
						$("#pwd_mode #strong").addClass("mode").css("background","#06e254");
					}
				}
			});
		
		//新增子账户
		$(".spuser_save_btn").click(function(e){
			me.to_addUser();
		});
		
		$(".spuser_back_btn").click(function(e){
			$("#spuser_div").hide();
			$("#datafrom").show();
		});
		
		$(".rule_back_btn").click(function(e){
			$("#rule_div").hide();
			$("#datafrom").show();
		});
		
		$(".rule_save_btn").click(function(e){
			me.saveMenu();
		});
		
		$(".gruop_back_btn").click(function(e){
			$("#group_div").hide();
			$("#datafrom").show();
		});
		
		$(".gruop_save_btn").click(function(e){
			me.saveGroup();
		});
	},
	menuTreeExpand:function(nodes){
		var me = this;
		var zTree = $.fn.zTree.getZTreeObj("menuTree");
		if(nodes){
			for (var i=0, l=nodes.length; i<l; i++) {
				zTree.expandNode(nodes[i], true, false, false);
				if (nodes[i].isParent && nodes[i].zAsync) {
					me.menuTreeExpand(nodes[i].children);
				}
			}
		}
	},
	menuTreeOnAsyncSuccess: function(event, treeId,treeNode, msg) {
		var me = this;
		var zTree = $.fn.zTree.getZTreeObj("menuTree");
		/*// 调用默认展开并选中第一个节点
		var nodes = zTree.getNodes();
		if(treeNode){
			me.menuTreeExpand(treeNode.children);
		}else{
			if(nodes && nodes.length>0)
			{
				zTree.expandNode(nodes[0], true,false,false);
			}
		}*/
		zTree.expandAll(true);
	},
	refreshSelMenuTree:function(nodes){
		var me = this;
		//已选节点设置
		var selsetting = {
				view: {
					nameIsHTML: true
				},
				data: {
					key: {
						name: "menu_name"
					},
					simpleData: {
						enable:true,
						idKey: "menu_id",
						pIdKey: "parent_id"
					}
				},
				edit:{
					enable:true,
					showRemoveBtn: false,
					showRenameBtn: false
				},
				callback: {
					onClick: function(event, treeId, treeNode){
						$("#tree_add").removeClass("link");
						$("#tree_add").addClass("disabled");
						$("#tree_remove").removeClass("disabled");
						$("#tree_remove").addClass("link");
						var seltree = $.fn.zTree.getZTreeObj("menuTree");
						seltree.cancelSelectedNode();
					},
					beforeDrag:function(){return false;},
					beforeClick:function(){return me.treeEnable;}
				}
			};
		$.fn.zTree.init($("#selmenuTree"), selsetting,nodes);
		var zTree = $.fn.zTree.getZTreeObj("selmenuTree");
		zTree.expandAll(true);
	},
	
	//保存菜单
	saveMenu: function(){
		var me = this;
	    var data = {};
	    var user_id = $("#rule_div input[name=user_id]").val();
	    data.user_id = user_id;
		var selmenuTree = $.fn.zTree.getZTreeObj("selmenuTree");
		var selMenus = selmenuTree.transformToArray(selmenuTree.getNodes());
		var menuList = [];
		if(selMenus.length>0){
			$.each(selMenus,function(i,menu){
				if(menu.menu_id != '' && menu.menu_id != '-3'){
					menuList.push(menu.menu_id);
				}
			});
		}
		data.menuList = menuList;
		Invoker.async("SPUserController", "updateChildSPUserPrivilege", data, function(result){
			if(result.res_code != "00000"){
				Utils.alert(result.res_message);
			}
			else{
				Utils.alert("操作成功", function(){
					$("#rule_div").hide();
					$("#datafrom").show();
					me.initFormTable();
				});
			}
		});
	},

	initFormTable : function(page, rows){
		var me = this;

		var msisdn = $.trim($('#search_input').val());//去除输入框中的空格
		if(msisdn == '请输入账号'){
			msisdn = '';
		}
		
		var param = {};
		var num = 1;
		var row = 10;
		//var search_content = $.trim($("#search_input").val());//除去输入框中的空格
		param.page = page==null? num : page;
		param.rows = rows==null? row : rows;
		param.user_name = msisdn;
		Invoker.async("SPUserController", "querySPUserListByUserName", param, function(data){
			var has_data = false;
			var pageCount = 0;
			if(data.rows[0] == null ){
				Invoker.sync("SPUserController", "queryCustByUserId", param, function(result){
					me.name = result.result.cust_code;
				});
			}else {
				me.name = data.rows[0].cust_code;
			}
			if(data && data.total>0){
				has_data = true;
				me.initTableData(data);
				pageCount = data.pageCount;
			}
			if(has_data == false){
				$(".search-from-list #form_table").find("tr:not(:first)").remove();
				var error_tr = '<tr><td colspan="99" align="center"><font color="red">无数据，请重新查询！</font></td></tr>';
				$(".search-from-list #form_table").append(error_tr);
			}
			laypage({
				cont: 'cardPage',
				pages: pageCount, //总页数
				curr: page, //当前页
				groups: '3', //连续页数
				skip: true, //跳页
				jump: function(obj, first){ //触发分页后的回调
					if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
						var state = $(".tab-nav-link.active").attr("name");
						page_curr = obj.curr;
						me.initFormTable(obj.curr);
					}
				}
			});
		});
	},
	initTableData : function(data){
		var me = this;
		$(".search-from-list #form_table").find("tr:not(:first)").remove();
		var total = data.total;
		if(total > 0){
			for(var i=0; i<data.rows.length; i++){
				var spUserInfo = data.rows[i];
				var curr = $(".search-from-list #tr_template").clone().removeAttr("id").show();
				WYUtil.setInputDomain(spUserInfo, curr);
				//修改子帐号
				$("#update",curr).click(function(e){
					$("#user_name").attr("disabled",true);
					var $td= $(this).parent("td");
					var user_id = $td.siblings(".member_list_div [dbfield='user_id']").text();
					var cust_id = $td.siblings(".member_list_div [dbfield='cust_id']").text();
					$("[name='spuser_title']").html("修改子帐号");//
					me.isAdd = false;
					$("#pwd_tr").hide();
					$("#pwd_mode").hide();
					me.clearSpuser_div_tab();
					$("#spuser_div").show();
					$("#datafrom").hide();
					var params = {};
					params.user_id = user_id;
					params.cust_id = cust_id;
					Invoker.async("SPUserController", "queryChildSPUserByID", params, function(result){
						if(result.res_code == '00000'){
							if(result.result != ''){
								WYUtil.setInputDomain(result.result, "spuser_div");
							}
						}
					});	
					
					
				});
				
				//删除子账户
				$("#delete",curr).click(function(e){
					var $td= $(this).parent("td");
					var user_id = $td.siblings(".member_list_div [dbfield='user_id']").text();
					var user_name = $td.siblings(".member_list_div [dbfield='user_name']").text();
					Utils.confirm('确定删除子账户  ' + user_name + '?', {yes:function(){
						me.to_deleteUser(user_id);
					}});
				});
				
				//菜单权限
				$("#rule",curr).click(function(e){
					var $td= $(this).parent("td");
					var user_id = $td.siblings(".member_list_div [dbfield='user_id']").text();					
					$("#rule_div").show();
					$("#datafrom").hide();
					$("#rule_div input[name=user_id]").val(user_id);
					
					//初始化树
					$("#tree_add").addClass("disabled");
					$("#tree_add").removeClass("link");
					$("#tree_remove").removeClass("link");
					$("#tree_remove").addClass("disabled");
					me.btnShow(true);
					me.initMenuTree();
					me.initPrivilege(user_id);
				});
				
				//成员分组权限
				$("#gruop", curr).click(function(e){
					var $td= $(this).parent("td");
					var user_id = $td.siblings(".member_list_div [dbfield='user_id']").text();
					$("#group_div input[name=user_id]").val(user_id);
					
					$("#group_div").show();
					$("#datafrom").hide();
					me.queryGroupList();
				});
			
		        $(".search-from-list #form_table").append(curr);
		     
			}
		}else{
			var error_tr = '<tr><td colspan="99" align="center"><font color="red">无数据，请重新查询！</font></td></tr>';
			$(".search-from-list #form_table").append(error_tr);
		}
	},

	//成员群组列表
	queryGroupList : function(){
		var me = this;
		$('#groupList li').remove();
		Invoker.async("CustMemGroupController", "queryCustMemGroupList", {} , function(result){
			if(result.res_code == "00000"){
				var list = result.result;
				if(list != ''){
					for(var i=0; i<list.length; i++) {
						var data = list[i];
						var li_template = '<li style="margin:5px;"><label class="inp-checkbox single_checkbox" group_id='+data.group_id+'>'+
							'<i class="inp-checkbox-ico checkbox_i"></i>&nbsp;&nbsp;'+data.group_name+'</label>'
						$('#groupList').append(li_template);
					}
					me.initGruopEvent();
					var user_id = $("#group_div input[name=user_id]").val();
					me.querySpUserGroupList(user_id);
				}
			}
		});
	},
	
	querySpUserGroupList : function(user_id){
		var me = this;
		var params = {};
		params.user_id = user_id;
		Invoker.async("SPUserController", "querySpUserGroupList", params , function(result){
			if(result.res_code == "00000"){
				var list = result.result;
				if(list != ''){
					var group_ids = '';
					for(var i=0; i<list.length; i++) {
						var data = list[i];
						group_ids += ',' + data.group_id;
					}
					group_ids += ',';
					
					$("#groupList").find('.single_checkbox').each(function(){
						var val = $(this).attr("group_id");
						if(group_ids.indexOf(val+',') > -1){
							$(this).addClass("active");
						}
					});
				}
			}
		});
	},
	
	initGruopEvent : function() {
		$("#groupList").find(".single_checkbox").unbind("click").click(function(e){
			if($(this).hasClass("active")) {
				$(this).removeClass("active");
			}else {
				$(this).addClass("active");
			}
		});
	},
	
	//保存成员群组
	saveGroup: function(){
		var me = this;
	    var params = {};
	    var user_id = $("#group_div input[name=user_id]").val();
	    params.user_id = user_id;
	    var group_ids = [];
	    $("#groupList").find('.single_checkbox').each(function(){
			if($(this).hasClass("active")){
				var group_id = $(this).attr("group_id");
				if(group_id != ''){
					group_ids.push(group_id);
				}
			}		
		});
	    
	    params.group_ids = group_ids;
	   
		Invoker.async("SPUserController", "updateSPUserGroupPrivilege", params, function(result){
			if(result.res_code != "00000"){
				Utils.alert(result.res_message);
			}
			else{
				Utils.alert("操作成功", function(){
					$("#group_div").hide();
					$("#datafrom").show();
					me.initFormTable();
				});
			}
		});
	},
	
	clearSpuser_div_tab : function(){
		$("#spuser_div [dbfield='user_id']").val("");
		$("#spuser_div [dbfield='user_name']").val("");
		$("#spuser_div [dbfield='chinese_name']").val("");
		$("#spuser_div [dbfield='password']").val("");
		$("#spuser_div [dbfield='validate_password']").val("");
		$("#spuser_div [dbfield='mobile_phone']").val("");
		$("#spuser_div [dbfield='email']").val("");
		$("#spuser_div [dbfield='comments']").val("");
	},
	
	queryMenu : function(){
		var me = this;
		Invoker.async("HomeController", "getPortalMenus", {}, function(menus){
			var menuData = me.handleMenuData(menus);
			var rootMenus = menuData["-3"];
			me.renderMenu(rootMenus, menuData);
		});
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
	
	/**渲染根部菜单*/
	renderMenu : function(rootmenus, menuData){
		var me = this;
		$("#rule_div #rule_tab").find("tr").remove();
		var tr = '<tr>';
		if($.isArray(rootmenus) && rootmenus.length > 0){
			$.each(rootmenus, function(i, menu){
				var menu_id = menu.menu_id;
				var ul_template = '<ul style="color:red;">'+
				'<label class="inp-checkbox all_checkbox" menu_id='+menu.menu_id+' >'+
				'<i class="inp-checkbox-ico checkbox_i"></i>'+
				menu.menu_name+'</label>';
				
				var subMenus = menuData[menu_id];
				if($.isArray(subMenus) && subMenus.length > 0){
					$.each(subMenus, function(j, sub_menu){
						ul_template += '<li  style="color:black;">'+
						'<label class="inp-checkbox single_checkbox" menu_id='+sub_menu.menu_id+'>'+
						'<i class="inp-checkbox-ico checkbox_i"></i>'+
						sub_menu.menu_name+'</label></li>';
					});
				}
				ul_template += '</ul>';
				tr += '<td valign="top">'+ul_template+'</td>';
			});	
			tr += '</tr>';
			$("#rule_tab").append(tr);
			me.initRuleEvent();
		}
	},
	
	initPrivilege : function(user_id){
		var me = this;
		var params = {};
		params.user_id = user_id
		Invoker.async("SPUserController", "querySPUserPrivilegeList", params, function(result){
			if(result.res_code == '00000'){
				if(result.result != ''){
					result.result.unshift({menu_id:-3,menu_name:"自服务门户菜单",isParent:true});
					me.refreshSelMenuTree(result.result);
				}
				
			}
		});	
	},
	initRuleEvent : function(){
		var me = this;
		$("#rule_tab").find(".all_checkbox").unbind("click").click(function(e){
			if($(this).hasClass("active")) {
				$(this).removeClass("active");
				$(this).parent().find(".single_checkbox").removeClass("active");
			}else {
				$(this).addClass("active");
				$(this).parent().find(".single_checkbox").addClass("active");
			}
		});
		
		$("#rule_tab").find(".single_checkbox").unbind("click").click(function(e){
			if($(this).hasClass("active")) {
				$(this).removeClass("active");
				var ul = $(this).parent().parent();
				if(!$(ul).find(".single_checkbox").hasClass("active")){
					$(ul).find(".all_checkbox").removeClass("active");
				}
			}else {
				$(this).addClass("active");
				//var mem_user_id = $(this).find(".checkbox_i").attr("mem_user_id");
				$(this).parent().parent().find(".all_checkbox").addClass("active");
			}
		});
	},
	
	to_addUser:function(){
		var me = this;
		var user_id = $("#spuser_div [dbfield='user_id']").val();
		var params = {};
		params = WYUtil.getInputDomain("spuser_div");
		var user_name = $("#user_name").val();
		if((user_name.indexOf(me.name)==-1)||(user_name==me.name)){
			Utils.alert("请您新增的子账户以集团客户编码开头！");
			return false;
		}
		params.cust_code = me.name;
		if(me.validateSpuserInput(params, user_id)){
			//校验账号的唯一性
			Invoker.async("SPUserController", "checkChildSPUserName", params, function(data){
				if(data.res_code == "00000"){
					var is_exists = data.result;
					if(is_exists){
						Utils.alert("操作失败，账号名称已被使用，请重新输入账号");
					}else{
						if(user_id == ''){
							var password = $.base64.encode($("#spuser_div [dbfield='password']").val());
							params.password = password;
							Invoker.async("SPUserController", "AddChildSPUser", params, function(data){
								if(data.res_code == "00000"){
									$("#spuser_div").hide();
									$("#datafrom").show();
									me.initFormTable();
									Utils.alert("添加成功，新增的子账号只有配置了菜单权限、成员群组权限才能正常使用！");
								}else if(data.res_code == 40000){
									Utils.alert(data.res_message);
								}else {
									Utils.alert("添加失败，请重试");
								}
							});
						}else{
							Invoker.async("SPUserController", "updateChildSPUserByID", params, function(data){
								if(data.res_code == "00000"){
									$("#spuser_div").hide();
									$("#datafrom").show();
									me.initFormTable();
									Utils.alert("修改成功！");
								}else {
									Utils.alert("修改失败，请重试");
								}
							});
						}
					}
				}else {
					Utils.alert("添加失败，请重试");
				}
			});
		}
	},
	
	validateSpuserInput : function(params, user_id){
		if(params.user_name == ''){
			Utils.alert("用户名不能为空");
			return false;
		}
		
		if(params.chinese_name == ''){
			Utils.alert("姓名不能为空");
			return false;
		}
		
		if(params.mobile_phone == ''){
			Utils.alert("手机号码不能为空");
			return false;
		}
		
		if(user_id == ''){
			if(params.password == ''){
				Utils.alert("密码为空");
				return false;
			}
			
			if(params.validate_password == ''){
				Utils.alert("确认密码不能为空");
				return false;
			}
			
			if(params.validate_password != params.password ){
				Utils.alert("密码不一致");
				return false;
			}
		}
		if(ChildSpUser.isAdd){
		if(Utils.checkPasswdStrength(params.password) < 3){
				Utils.alert("您输入的密码为弱密码，请您采用至少由8位及以上大小写字母、"
					+ "数字及特殊字符等混合、随机组成（至少包括数字、小写字母、大写字母和特殊符号中的三种）的密码串。");
				return false;
		}
		}
		if(params.mobile_phone != ''){
			if(!Utils.checkPhoneNumber(params.mobile_phone)){
				Utils.alert("手机号码格式错误");
				return false;
			}
		}
		
		if(params.email != ''){
			if(!Utils.isEmail(params.email)){
				Utils.alert("邮箱格式错误");
				return false;
			}
		}

		

		
		return true;
	},
	
	//删除子账户
	to_deleteUser : function(user_id){
		var me = this;
		var param = {};
		
		param.user_id = user_id;
		Invoker.async("SPUserController", "deleteChildSPUser", param, function(data){
			if(data.res_code == "00000"){
				Utils.alert("删除子账户成功！");
				me.initFormTable();
			}else {
				Utils.alert("删除子账户失败，请重试");
			}
		});
	},
	
	//修改权限信息
	to_updatePrivilege : function(){
		var me = this;
		var user_id = $("#rule_div input[name=user_id]").val();
		var menu_id_list = new Array();
		$("#rule_tab").find(".all_checkbox").each(function(){
			if($(this).hasClass("active")){
				var menu_id = $(this).attr("menu_id");
				if(menu_id != undefined && menu_id != '' ){
					menu_id_list.push(menu_id);
				}
			}
		});
		$("#rule_tab").find(".single_checkbox").each(function(){
			if($(this).hasClass("active")){
				var menu_id = $(this).attr("menu_id");
				if(menu_id != undefined && menu_id != '' ){
					menu_id_list.push(menu_id);
				}
			}
		});
		
		var params = {};
		params.user_id = user_id;
		params.menu_id_list = menu_id_list;
		Invoker.async("SPUserController", "updateChildSPUserPrivilege", params, function(data){
			if(data.res_code == "00000"){
				Utils.alert("修改子账户权限成功！");
				$("#rule_div").hide();
				$("#datafrom").show();
				me.initFormTable();		
			}else {
				Utils.alert("修改子账户权限失败，请重试");
			}
		});
	},
	initMenuTree:function(){
		//初始化选择/可选菜单目录树
		var me = this;
		var setting = {
				view: {
					nameIsHTML: true
				},
				async: {
					enable: true,
					url: "HomeController.getChildPortalMenus",
					autoParam: ["menu_id", "menu_name"]
				},
				data: {
					key: {
						name: "menu_name"
					},
					simpleData: {
						enable:true,
						idKey: "menu_id",
						pIdKey: "parent_id"
					}
				},
				edit:{
					enable:true,
					showRemoveBtn: false,
					showRenameBtn: false
				},
				callback: {
					onAsyncSuccess : me.menuTreeOnAsyncSuccess,
					onClick: function(event, treeId, treeNode){
						if(me.treeEnable){
							$("#tree_add").removeClass("disabled");
							$("#tree_add").addClass("link");
							$("#tree_remove").removeClass("link");
							$("#tree_remove").addClass("disabled");
							var seltree = $.fn.zTree.getZTreeObj("selmenuTree");
							seltree.cancelSelectedNode();
							var menutree = $.fn.zTree.getZTreeObj("menuTree");
							menutree.expandNode(treeNode, true, true, true);
						}
					},
					beforeDrag:function(){return false;},
					beforeClick:function(){return me.treeEnable;}
				}
			};
		
		//已选节点设置
		var selsetting = {
				view: {
					nameIsHTML: true
				},
				data: {
					key: {
						name: "menu_name"
					},
					simpleData: {
						enable:true,
						idKey: "menu_id",
						pIdKey: "parent_id"
					}
				},
				edit:{
					enable:true,
					showRemoveBtn: false,
					showRenameBtn: false
				},
				callback: {
					onClick: function(event, treeId, treeNode){
						$("#tree_add").removeClass("link");
						$("#tree_add").addClass("disabled");
						$("#tree_remove").removeClass("disabled");
						$("#tree_remove").addClass("link");
						var seltree = $.fn.zTree.getZTreeObj("menuTree");
						seltree.cancelSelectedNode();
					},
					beforeDrag:function(){return false;},
					beforeClick:function(){return me.treeEnable;}
				}
			};
		$.fn.zTree.init($("#menuTree"), setting);
		$.fn.zTree.init($("#selmenuTree"), selsetting);
		
		var menutree = $.fn.zTree.getZTreeObj("menuTree");
		me.menuTreeExpand(menutree.getNodes());
	
		$("#tree_remove").unbind("click").click(function(){
			var seltree = $.fn.zTree.getZTreeObj("selmenuTree");
			var selnode = seltree.getSelectedNodes();
			if(me.treeEnable && selnode.length > 0){
				seltree.removeNode(selnode[0]);
			}
		});
		
		$("#tree_add").unbind("click").click(function(){
			var menutree = $.fn.zTree.getZTreeObj("menuTree");
			var seltree = $.fn.zTree.getZTreeObj("selmenuTree");
			var selnode = menutree.getSelectedNodes();
			if(me.treeEnable && selnode.length > 0){
				var nodes = seltree.transformToArray(seltree.getNodes());
				var selnode_array = menutree.transformToArray(selnode[0]);
				for(var i=0;i<nodes.length;i++){
					//移除已经选中过的节点
					for(var j=0;j<selnode_array.length;j++)
					{
						if(nodes[i].menu_id == selnode_array[j].menu_id){
							seltree.removeNode(nodes[i]);
						}
					}
				}
				//从根节点开始复制节点树
				var parentnode = [];
				var node = $.extend({},selnode[0]);
				while(node){
					node = node.getParentNode();
					if(node){
						var newnode = {};
						newnode.menu_id = node.menu_id;
						newnode.menu_name = node.menu_name;
						parentnode.push(newnode);
					}
				}
				parentnode.reverse();
				var last_id = null;
				var parent_check = [];
				if(parentnode.length > 0)
				{
					//如果有父目录结构则进行组装父目录路径的操作
					last_id = parentnode[0].menu_id;
					for(i=1;i<parentnode.length;i++){
						parentnode[i].parent_id = parentnode[i-1].menu_id;
						last_id = parentnode[i].menu_id;
					}
					parent_check = seltree.getNodesByParam("menu_id", parentnode[0].menu_id);
				}
				
				var parent_treenode = null;
				while(parentnode.length>0 && parent_check.length > 0){
					parent_treenode = parent_check[0];
					parentnode.splice(0,1);
					if(parentnode.length > 0)
					{
						parent_check = seltree.getNodesByParam("menu_id", parentnode[0].menu_id);
					}
				}
				
				if(parentnode.length>0)
				{
					//如果所选节点的父目录路径在页面右侧已选择目录树中不完整，则进行补全
					seltree.addNodes(parent_treenode,parentnode);
				}
				//将目前选中的节点添加到已选择目录树中
				var n = seltree.getNodesByParam("menu_id", last_id)[0];
				seltree.copyNode(n,selnode[0],"inner");
			}
		});
	}
};

$(function() {
	ChildSpUser.init();
});
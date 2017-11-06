/**
 * IMEI群组管理
 */
var custMemGroup = {
	
	/**
	 * 初始化点击事件
	 */
	initClick : function(){
		/**
		 * 新建分组
		 */
		$('#add_group').bind("click", function() {
			custMemGroup.addGroup();
		});
		
		$('.inp-select').bind("click",function(e) {
	    	//阻止冒泡
			var ev = e || window.event;
	        if(ev.stopPropagation){
	        	ev.stopPropagation();
	        }else if(window.event){
	            window.event.cancelBubble = true;//兼容IE
	        }
	    });
		/**
		 * imei群组下拉框
		 */
		$('#imei_group').bind("click", function() {
			$(this).next().show();
		});
		
		/**
		 * imei群组管理
		 */
		$('#group_mgr_btn').bind("click", function() {
			custMemGroup.queryGroupList();
			$('#group_mgr_container').show();
			$('#mem_page_container').hide();
			
		});
		
		/**
		 * 从imei管理界面返回
		 */
		$('#go_back').bind("click", function() {
			custMemGroup.initImeiGroup();
			$('#group_mgr_container').hide();
			$('#mem_page_container').show();
		});
		
		/**
		 * 从分组界面返回
		 */
		$('#go_back_main').bind("click", function() {
			$('#grouping_container').hide();
			$('#mem_page_container').show();
			//重新触发查询事件
			$("#search_btn").trigger('click');
		});
		
		/**
		 * 批量分组弹出窗
		 */
		$('#batch_grouping').bind("click", function() {
			Utils.layerOpen("批量成员分组", "/user_center/cust_member/batch-cust-mem-group-popup.html",function(){
				//重新触发查询事件
				$("#search_btn").trigger('click');
			});
			/*layer.open({
				  type: 2,
				  title: '批量分组',
				  shadeClose: false,
				  shade: 0.8,
				  area: ['90%', '90%'],
				  content: Utils.getContextPath()+'/user_center/trml/batch-imei-group-popup.html' //iframe的url
				}); */
		});
		
		/**
		 * 保存分组
		 */
		$('#save_btn').bind("click",function() {
			custMemGroup.saveGroupRel();
		});
		
		//查询成员
		$("#search_btn").click(function(e){
			custMemGroup.initFormTable(null, null, custMemGroup.data_id);
		});
	},
	
	/**
	 * 保存分组
	 * @returns {Boolean}
	 */
	saveGroupRel : function() {
		var me = this;
		var list = $("li.active",'#imei_group_list');
		if(list.length < 1) {
			Utils.alert("请选择群组!");
			return false;
		}
		
		var me = this;
		var param = {};
		//debugger
		
		//获取本页选择的成员
		var mem_user_select_list = new Array();
		$.each($("[dbfield='group_id']",$(".group-tree-item.active")), function(i,data){
			var object = new Object();
			object.group_id = $(data).val();
			object.mem_user_id = me.mem_user_id;
			mem_user_select_list.push(object);
		});
		
		param.mem_user_id = me.mem_user_id;
		param.mem_user_select_list = mem_user_select_list;
		
		Invoker.async("CustMemGroupController", "GroupingForOne", param, function(result){
			if(result.res_code == "00000"){
				layer.msg("分组成功");
			}else {
				Utils.alert("新增失败，请重试");
			}
		});
	},
	
	/**
	 * 新增分组
	 */
	addGroup : function() {
		var clone = $('#add_group_temp').clone().removeAttr("id").show();
		$('#groupList').prepend(clone);
		$("[name='save_btn']", clone).bind("click", function() {
			var param = WYUtil.getInputDomain($(clone));
			if($.trim(param.group_name)=="") {
				Utils.alert("组名不能为空");
				return false;
			}
			Invoker.async("CustMemGroupController", "insertMemGroupGroup", param, function(result){
				if(result.res_code == "00000"){
					layer.msg("新增群组成功");
					custMemGroup.queryGroupList();
				}else {
					Utils.alert(result.res_message);
				}
			});
		});
		
		$("[name='cancel_btn']", clone).bind("click", function() {
			$(this).closest("li").remove();
		});
	},
	
	/**
	 * 查询群组列表
	 */
	queryGroupList : function() {
		$('#groupList').empty();
		Invoker.async("CustMemGroupController", "queryCustMemGroupList", {} , function(result){
				if(result.res_code == "00000"){
					var list = result.result;
					custMemGroup.initGroup(list);
				}
			});
	},
	
	/**
	 * 渲染群组内容
	 * @param list
	 */
	initGroup : function(list) {
		for(var i=0;i<list.length;i++) {
			var clone = $('#group_temp').clone().removeAttr("id").show();
			var data = list[i];
			WYUtil.setInputDomain(data, clone);
			$('#groupList').append(clone);
			$("[name='edit_btn']", clone).data(data).bind("click", function() {
				var temp = $('#add_group_temp').clone().removeAttr("id").show();
				$(this).closest("li").hide().after(temp);
				temp.append("<input type='hidden' dbField='group_id' name='group_id' fieldType='db'/>");
				WYUtil.setInputDomain($(this).data(), temp);
				$("[name='save_btn']", temp).bind("click", function() {
					
					var param = WYUtil.getInputDomain($(temp));
					if($.trim(param.group_name)=="") {
						Utils.alert("组名不能为空");
						return false;
					}
					Invoker.async("CustMemGroupController", "editCustMemGroup", param, function(result){
						if(result.res_code == "00000"){
							layer.msg("修改群组成功");
							custMemGroup.queryGroupList();
						}else {
							Utils.alert("修改失败，请重试");
						}
					});
					
				});
				
				$("[name='cancel_btn']", temp).bind("click", function() {
					$(this).closest("li").prev().show();
					$(this).closest("li").remove();
				});
			});
			
			$("[name='del_btn']", clone).bind("click", function() {
				var group_id = $(this).closest("li").find("input[name='group_id']").val();
				Utils.confirm("您确定要删除该群组吗？", {"yes":function() {
					Invoker.async("CustMemGroupController", "deleteCustMemGroup", {"group_id" : group_id} , function(result){
						if(result.res_code == "00000"){
							layer.msg("删除成功");
							custMemGroup.queryGroupList();
						}else {
							Utils.alert(result.res_message);
						}
					});
				}});
			});
			
		}
	},
	
	/**
	 * 分页查询设备
	 * @param pageNum
	 * @param pageRow
	 */
	queryTrmlPage : function(pageNum, pageRow, id){
		$('#trml_tbody').empty();
		var param = {};
		var num = 2;
		var row = 10;
		param.pageNum = pageNum==null? num : pageNum;
		param.pageRow = pageRow==null? row : pageRow;
		param.group_id = id==null? "" : id;
		Invoker.async("TrmlMgrController", "getTrmlList", param, function(data) {
			if (data && data.total>0) {
				custMemGroup.renderData(data);
				laypage({
					cont: 'trmlPage',
					pages: data.pageCount, //总页数
					curr: data.pageNumber, //当前页
					//skin: '#6495ED',
					groups: '3', //连续页数
					skip: true, //跳页
					jump: function(obj, first){ //触发分页后的回调
						if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
							//var state = $(".tab-nav-link.active").attr("name");
							//page_curr = obj.curr;
							imeiGroup.queryTrmlPage(obj.curr);
						}
					}
				});
			}
			else{
				$('#trml_tbody').append("<tr><td colspan='99' align='center'><font color='red'>无数据，请重新查询！</font></td></tr>");
			}
		});
	},
	
	/**
	 * 渲染分页数据
	 * @param data
	 */
	renderData: function(data){
		var me = this;
		var rows = data.rows;
		if(rows != null){
			$.each(rows, function(i,value){
				//debugger
				var clone = $('#tr_temp').clone().removeAttr("id").show();
				WYUtil.setInputDomain(value, clone);
				$('#trml_tbody').append(clone);
				/*$(".inp-handle-hd", clone).bind("click", function() {
					$(this).next().show();
				});*/
				
			});
		} else{
			$('#trml_tbody').append("<tr><td colspan='99' align='center'><font color='red'>暂无数据，请重新查询！</font></td></tr>");
		}
	},
	
	/**
	 * 分组
	 * @param imei
	 */
	imei_grouping : function(mem_user_id) {
		var me = this;
		me.current_imei = mem_user_id;
		$('#grouping_container').show();
		$('#mem_page_container').hide();
		
		Invoker.async("CustMemGroupController", "queryCustMemGroupList", {} , function(result){
			if(result.res_code == "00000"){
				//debugger
				var list = result.result;
				custMemGroup.intiImeiAndGroup(list, mem_user_id);
			}
		});
		
	},
	
	/**
	 * 渲染分组内容
	 * @param list
	 * @param imei
	 */
	intiImeiAndGroup : function(list, mem_user_id) {
		$('#imei_group_list').empty();
		for(var i=0;i<list.length;i++) {
			var clone = $('#imei_group_temp').clone().removeAttr("id").show();
			var data = list[i];
			WYUtil.setInputDomain(data, clone);
			$(clone).bind("click", function() {
				if($(this).hasClass("active")) {
					$(this).removeClass("active");
				}else {
					$(this).addClass("active");
				}
			});
			$('#imei_group_list').append(clone);
		}
		
		if(list.length > 0) {
			Invoker.async("CustMemGroupController", "queryGroupIdByMemId", {"mem_user_id":mem_user_id} , function(result){
				//debugger
				if(result.res_code == "00000"){
					var list = result.result;
					for(var i=0;i<list.length;i++) {
						$("input[name='group_id'][value='"+list[i]+"']",'#imei_group_list').parent().addClass("active");
					}
				}
			});
		}
	},
	
	/**
	 * 下拉框初始化
	 */
	initImeiGroup : function() {
		$('#imei_group_ul').empty();
		Invoker.async("CustMemGroupController", "queryCustMemGroupList", {}, function(data) {
			$('#imei_group_ul').append("<li class='inp-slt-item' data-id=''>全部</li>");
			if(data.res_code = '0000') {
				var result = data.result;
				for(var i=0; i<result.length; i++) {
					var t = result[i];
					var temp = "<li class='inp-slt-item' data-id='"+t.group_id+"'>"+t.group_name+"</li>";
					$('#imei_group_ul').append(temp);
				}
			}
			
			$('#imei_group_ul li').bind("click", function() {
				$('#imei_group').text($(this).text());
				$('#imei_group').next().hide();
				custMemGroup.data_id = $(this).data("id");
				custMemGroup.initFormTable(null, null, $(this).data("id"));
			});
		},false);
	},
	
	init : function() {
		var me = this;
		custMemGroup.initClick();
		WYUtil.queryAttrCodeValue($("#tab_template"));
		custMemGroup.initImeiGroup();
		custMemGroup.initFormTable();//默认不自动加载
		me.mem_user_id = "";
		me.data_id = ""; //选择群组的ID
	},
	
	initFormTable : function(page, rows,id){
		var me = this;

		var msisdn = $.trim($('#search_input').val());//去除输入框中的空格
		if(msisdn == '请输入卡号'){
			msisdn = '';
		}
		
		var param = {};
		var num = 1;
		var row = 10;
		//var search_content = $.trim($("#search_input").val());//除去输入框中的空格
		param.page = page==null? num : page;
		param.rows = rows==null? row : rows;
		param.group_id = id==null? "" : id;
		param.search_content = msisdn;
		Invoker.async("CustMemController", "queryCustMemberByGroupId", param, function(data){
			var has_data = false;
			
			if(data && data.total>0){
				has_data = true;
				me.initTableData(data);
				
			}
			if(has_data == false){
				$(".search-from-list #form_table").find("tr:not(:first)").remove();
				var error_tr = '<tr><td colspan="99" align="center"><font color="red">无数据，请重新查询！</font></td></tr>';
				$(".search-from-list #form_table").append(error_tr);
			}

			laypage({
					cont: 'cardPage',
					pages: data.pageCount, //总页数
					curr: page, //当前页
					//skin: '#6495ED',
					groups: '3', //连续页数
					skip: true, //跳页
					jump: function(obj, first){ //触发分页后的回调
						if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
							//var state = $(".tab-nav-link.active").attr("name");
							//page_curr = obj.curr;
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
				var memberInfo = data.rows[i];
				var curr = $(".search-from-list #tr_template").clone().removeAttr("id").show();
				$(curr).find(".checkbox_i").attr("mem_user_id", memberInfo.mem_user_id);
		        $(curr).find("a").attr("msisdn", memberInfo.msisdn);
		        $(curr).find("a").attr("mem_user_id",memberInfo.mem_user_id);
				$(curr).find('input[type="checkbox"]').attr("mem_user_id", memberInfo.mem_user_id);
				WYUtil.setInputDomain(memberInfo, curr);
				//debugger
				$("a[name='grouping']", curr).data("mem_user_id", memberInfo.mem_user_id);
				$("a[name='grouping']", curr).bind("click", function() {
					//debugger
					me.imei_grouping($(this).data("mem_user_id"));
					me.mem_user_id = $(this).data("mem_user_id");
				});
		        $(".search-from-list #form_table").append(curr);
		        me.initTableEvent();
			}
		}else{
			var error_tr = '<tr><td colspan="99" align="center"><font color="red">无数据，请重新查询！</font></td></tr>';
			$(".search-from-list #form_table").append(error_tr);
		}
	},
	
	initTableEvent : function(){
		var me = this;
		
		$("#form_table").find(".all_checkbox").unbind("click").click(function(e){
			if($(this).hasClass("active")) {
				$(this).removeClass("active");
				$("#form_table").find(".single_checkbox").removeClass("active");
			}else {
				$(this).addClass("active");
				$("#form_table").find(".single_checkbox").addClass("active");
			}
		});
		
		$("#form_table").find(".single_checkbox").unbind("click").click(function(e){
			//debugger
			if($(this).hasClass("active")) {
				$(this).removeClass("active");
			}else {
				$(this).addClass("active");
				var mem_user_id = $(this).find(".checkbox_i").attr("mem_user_id");
				//alert(mem_user_id);
			}
		});
		
//		$("#form_table").find("a").unbind("click").click(function(e){
//			debugger
//			var a_type = $(this).attr("name");
//			var msisdn = $(this).attr("msisdn");
//			var mem_user_id = $(this).attr("mem_user_id");
//			if("a1"==a_type){
//				$(".member_list_div").hide();
//				$(".member_detail_div").show();
//				$(".msisdn_detail_div").hide();
//				me.queryMemDetail(mem_user_id);
//			}else if("a2"==a_type){
//				//Utils.alert(msisdn+"成员组群");
//			}else if("msisdn"==a_type){
//				$(".member_list_div").hide();
//				$(".member_detail_div").hide();
//				$(".msisdn_detail_div").show();
//				var url = "business_query/client_info_details.html?msisdn="+msisdn;
//				Utils.load("#msisdn_detail_content", url);
//			}
//		});
		
		$(".back_a").unbind("click").click(function(e){
			$(".member_list_div").show();
			$(".member_detail_div").hide();
			$(".msisdn_detail_div").hide();
		});
	}
};

$(function(){
	custMemGroup.init();
});



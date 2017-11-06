/**
 * IMEI群组管理
 */
var imeiGroup = {
	
	/**
	 * 初始化点击事件
	 */
	initClick : function(){
		/**
		 * 新建分组
		 */
		$('#add_group').bind("click", function() {
			imeiGroup.addGroup();
		});
		
		/**
		 * 隐藏下拉框
		 */
		document.onclick = function(){
			$(".inp-slt-main").hide();
	    };
	    
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
			imeiGroup.queryGroupList();
			$('#group_mgr_container').show();
			$('#imei_page_container').hide();
			
		});
		
		/**
		 * 从imei管理界面返回
		 */
		$('#go_back').bind("click", function() {
			imeiGroup.initImeiGroup();
			$('#group_mgr_container').hide();
			$('#imei_page_container').show();
		});
		
		/**
		 * 从分组界面返回
		 */
		$('#go_back_main').bind("click", function() {
			$('#grouping_container').hide();
			$('#imei_page_container').show();
		});
		
		/**
		 * 批量分组弹出窗
		 */
		$('#batch_grouping').bind("click", function() {
			Utils.layerOpen("批量IMEI分组", "/user_center/trml/batch-imei-group-popup.html");
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
			imeiGroup.saveGroupRel();
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
		
		var param = {};
		param.imei = me.current_imei;
		param.group_list = [];
		$(list).each(function(i,ele) {
			param.group_list.push($(this).find("input[name='imei_group_id']").val());
		});
		
		Invoker.async("ImeiGroupController", "saveGrouping", param, function(result){
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
			Invoker.async("ImeiGroupController", "insertImeiGroup", param, function(result){
				if(result.res_code == "00000"){
					layer.msg("新增群组成功");
					imeiGroup.queryGroupList();
				}else {
					Utils.alert("新增失败，请重试");
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
		Invoker.async("ImeiGroupController", "queryImeiGroupList", {} , function(result){
				if(result.res_code == "00000"){
					var list = result.result;
					imeiGroup.initGroup(list);
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
				temp.append("<input type='hidden' dbField='imei_group_id' name='imei_group_id' fieldType='db'/>");
				WYUtil.setInputDomain($(this).data(), temp);
				$("[name='save_btn']", temp).bind("click", function() {
					
					var param = WYUtil.getInputDomain($(temp));
					if($.trim(param.group_name)=="") {
						Utils.alert("组名不能为空");
						return false;
					}
					Invoker.async("ImeiGroupController", "editImeiGroup", param, function(result){
						if(result.res_code == "00000"){
							layer.msg("修改群组成功");
							imeiGroup.queryGroupList();
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
				var imei_group_id = $(this).closest("li").find("input[name='imei_group_id']").val();
				Utils.confirm("您确定要删除该群组吗？", {"yes":function() {
					Invoker.async("ImeiGroupController", "deleteImeiGroup", {"imei_group_id" : imei_group_id} , function(result){
						if(result.res_code == "00000"){
							layer.msg("删除成功");
							imeiGroup.queryGroupList();
						}else {
							Utils.alert("删除失败，请重试");
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
		var num = 1;
		var row = 10;
		param.pageNum = pageNum==null? num : pageNum;
		param.pageRow = pageRow==null? row : pageRow;
		param.imei_group_id = id==null? "" : id;
		Invoker.async("TrmlMgrController", "getTrmlList", param, function(data) {
			if (data && data.total>0) {
				imeiGroup.renderData(data);
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
				var clone = $('#tr_temp').clone().removeAttr("id").show();
				WYUtil.setInputDomain(value, clone);
				$('#trml_tbody').append(clone);
				/*$(".inp-handle-hd", clone).bind("click", function() {
					$(this).next().show();
				});*/
				$("a[name='grouping']", clone).data("imei", value.imei);
				$("a[name='grouping']", clone).bind("click", function() {
					me.imei_grouping($(this).data("imei"));
				});
			});
		} else{
			$('#trml_tbody').append("<tr><td colspan='99' align='center'><font color='red'>暂无数据，请重新查询！</font></td></tr>");
		}
	},
	
	/**
	 * 分组
	 * @param imei
	 */
	imei_grouping : function(imei) {
		var me = this;
		me.current_imei = imei;
		$('#grouping_container').show();
		$('#imei_page_container').hide();
		
		Invoker.async("ImeiGroupController", "queryImeiGroupList", {} , function(result){
			if(result.res_code == "00000"){
				var list = result.result;
				imeiGroup.intiImeiAndGroup(list, imei);
			}
		});
		
	},
	
	/**
	 * 渲染分组内容
	 * @param list
	 * @param imei
	 */
	intiImeiAndGroup : function(list, imei) {
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
			Invoker.async("ImeiGroupController", "queryGroupIdByImei", {"imei":imei} , function(result){
				if(result.res_code == "00000"){
					var list = result.result;
					for(var i=0;i<list.length;i++) {
						$("input[name='imei_group_id'][value='"+list[i]+"']",'#imei_group_list').parent().addClass("active");
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
		Invoker.async("ImeiGroupController", "queryImeiGroupList", {}, function(data) {
			$('#imei_group_ul').append("<li class='inp-slt-item' data-id=''>全部</li>");
			if(data.res_code = '0000') {
				var result = data.result;
				for(var i=0; i<result.length; i++) {
					var t = result[i];
					var temp = "<li class='inp-slt-item' data-id='"+t.imei_group_id+"'>"+t.group_name+"</li>";
					$('#imei_group_ul').append(temp);
				}
			}
			
			$('#imei_group_ul li').bind("click", function() {
				$('#imei_group').text($(this).text());
				$('#imei_group').next().hide();
				imeiGroup.queryTrmlPage(null, null, $(this).data("id"));
			});
		},false);
	},
	
	init : function() {
		imeiGroup.initClick();
		//imeiGroup.queryGroupList();
		imeiGroup.queryTrmlPage();
		imeiGroup.initImeiGroup();
	}
};

$(function(){
	imeiGroup.init();
});




var CustNotice = {
	//初始化
	init : function() {
		var me = this;
		WYUtil.queryAttrCodeValue($("#tab_template"));
		WYUtil.queryAttrCodeValue($(".member_detail_tab"));
		me.initEvent();
		me.initFormTable();
	},
	initEvent : function(){
		var me = this;
		$("#search_btn").unbind("click").bind("click",function(){
			me.initFormTable();
		});
	},
	
	initFormTable : function(page, rows){
		var me = this;
		var param = {};
		var num = 1;
		var row = 10;
		var search_content = $("#search_input").val();
		param.page = page==null? num : page;
		param.rows = rows==null? row : rows;
		param.search_content = search_content;
		Invoker.async("CustHomePageController", "getCustNoticeList", param, function(data){
			var has_data = false;
			var pageCount = 0;
			if(data && data.total>0){
				has_data = true;
				me.initTableData(data);
				pageCount = data.pageCount;
			}
			if(has_data == false){
				$(".search-from-list #form_table").find("tr:not(:first)").remove();
				var error_tr = '<tr><td colspan="99" align="center"><font color="red">暂无数据</font></td></tr>';
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
						var state = $(".member_list_div .tab-nav-link.active").attr("name");
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
				var memberInfo = data.rows[i];
				var curr = $(".search-from-list #tr_template").clone().removeAttr("id").show();
				curr.data("data", memberInfo);
				WYUtil.setInputDomain(memberInfo, curr);
				var notice_content = memberInfo.notice_content;
				if(notice_content != ''){
					if(notice_content.length > 25){
						notice_content = notice_content.substring(0, 25)+'......';
						$(curr).find('[dbfield="notice_content"]').html(notice_content);
					}
				}
		        $(".search-from-list #form_table").append(curr);
		        $("#detail_view", curr).click(function(e){
		        	var ele = $(this).closest("tr");
		        	var data = ele.data("data");
					$(".member_list_div").hide();
					$(".member_detail_div").show();
					WYUtil.setInputDomain(data, $(".member_detail_tab"));
					$(".member_detail_tab #batch_id").val(data.batch_id);
					
					$("#tab_div").hide();
					if(data.issue_type == '10'){
						//$("#tab_div").show();
						//me.queryWarningPage();
					}
				});
		        me.initTableEvent();
			}
		}else{
			var error_tr = '<tr><td colspan="99" align="center"><font color="red">暂无数据</font></td></tr>';
			$(".search-from-list #form_table").append(error_tr);
		}
	},
	
	initTableEvent : function(){
		var me = this;
		$(".back_a").unbind("click").click(function(e){
			$(".member_list_div").show();
			$(".member_detail_div").hide();
		});
	},
	
	/**
	 * 分页查询告警信息列表
	 * @param pageNum
	 * @param pageRow
	 */
	queryWarningPage : function(pageNum, pageRow){
		var me = this;
		var batch_id = $(".member_detail_tab #batch_id").val();
		var param = {};
		var num = 1;
		var row = 10;
		param.page = pageNum==null? num : pageNum;
		param.rows = pageRow==null? row : pageRow;
		param.batch_id = batch_id;
		Invoker.async("TrmlBindingController", "queryTermBindWarningInfo", param, function(data) {
			$(".member_detail_div #detail_table").find("tr:not(:first)").remove();
			var has_data = false;
			var pageCount = 0;
			if(data && data.total>0){
				has_data = true;
				me.renderData(data);
				pageCount = data.pageCount;
			}
			if(has_data == false){
				$(".member_detail_div #detail_table").find("tr:not(:first)").remove();
				var error_tr = '<tr><td colspan="99" align="center"><font color="red">暂无数据</font></td></tr>';
				$(".member_detail_div #detail_table").append(error_tr);
			}			
			laypage({
				cont: 'viewPage',
				pages: pageCount, //总页数
				curr: page, //当前页
				groups: '3', //连续页数
				skip: true, //跳页
				jump: function(obj, first){ //触发分页后的回调
					if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
						var state = $(".member_detail_div .tab-nav-link.active").attr("name");
						page_curr = obj.curr;
						me.queryWarningPage(obj.curr);
					}
				}
			});
		});
	},
	/**
	 * 渲染数据
	 * @param data
	 */
	renderData: function(data){
		var me = this;
		$(".member_detail_div #detail_table").find("tr:not(:first)").remove();
		var total = data.total;
		if(total > 0){
			for(var i=0; i<data.rows.length; i++){
				var memberInfo = data.rows[i];
				var curr = $(".member_detail_div #view_tr_template").clone().removeAttr("id").show();
				curr.data("data", memberInfo);
				WYUtil.setInputDomain(memberInfo, curr);
			
		        $(".member_detail_div #detail_table").append(curr);
			}
		}else{
			var error_tr = '<tr><td colspan="99" align="center"><font color="red">暂无数据</font></td></tr>';
			$(".member_detail_div #detail_table").append(error_tr);
		}
	},
	
	initMemDetail : function(){
		
		$(".member_detail_tab").find("[dbfield='notice_title']").html("");
		$(".member_detail_tab").find("[dbfield='notice_type']").html("");
		$(".member_detail_tab").find("[dbfield='issue_date']").html("");
		$(".member_detail_tab").find("[dbfield='notice_content']").html("");
	}
};

$(function() {
	CustNotice.init();
});
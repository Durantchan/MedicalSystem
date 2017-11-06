
var AddUser = {
	//初始化
	init : function() {
		var me = this;
		me.initEvent();
		me.initFormTable();
	},
	initEvent : function(){
		var me = this;
		$("#search_btn").click(function(e){
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
		Invoker.async("CustMemController", "queryCustMemberInfo", param, function(data){
			//debugger
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
				var memberInfo = data.rows[i];
				var curr = $(".search-from-list #tr_template").clone().removeAttr("id").show();
				$(curr).find(".checkbox_i").attr("mem_user_id", memberInfo.mem_user_id);
		        $(curr).find("a").attr("msisdn", memberInfo.msisdn);
		        $(curr).find("a").attr("mem_user_id",memberInfo.mem_user_id);
				$(curr).find('input[type="checkbox"]').attr("mem_user_id", memberInfo.mem_user_id);
		        $(curr).find('[name="mem_user_name"]').html(memberInfo.mem_user_name);
		        $(curr).find('[name="mem_user_alias"]').html(memberInfo.mem_user_alias);
		        $(curr).find('[name="msisdn"]').html(memberInfo.msisdn);
		        $(curr).find('[name="iccid"]').html(memberInfo.iccid);
		        $(curr).find('[name="imsi"]').html(memberInfo.imsi);
		        $(curr).find('[name="message_port"]').html(memberInfo.message_port);
		        $(curr).find('[name="switch_status"]').html(memberInfo.switch_status_name);
		        $(curr).find('[name="is_sign_msg"]').html(memberInfo.is_sign_msg_name);
		        $(curr).find('[name="is_sign_gprs"]').html(memberInfo.is_sign_gprs_name);
		        $(curr).find('[name="is_sign_voice"]').html(memberInfo.is_sign_voice_name);
		        $(curr).find('[name="comments"]').html(memberInfo.comments);
		        $(".search-from-list #form_table").append(curr);
		        me.initTableEvent();
			}
		}else{
			var error_tr = '<tr><td colspan="99" align="center"><font color="red">暂无数据</font></td></tr>';
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
			if($(this).hasClass("active")) {
				$(this).removeClass("active");
			}else {
				$(this).addClass("active");
				var mem_user_id = $(this).find(".checkbox_i").attr("mem_user_id");
				//alert(mem_user_id);
			}
		});
		
		$("#form_table").find("a").unbind("click").click(function(e){
			var a_type = $(this).attr("name");
			var msisdn = $(this).attr("msisdn");
			var mem_user_id = $(this).attr("mem_user_id");
			if("a1"==a_type){
				$(".member_list_div").hide();
				$(".member_detail_div").show();
				$(".msisdn_detail_div").hide();
				me.queryMemDetail(mem_user_id);
			}else if("a2"==a_type){
				//Utils.alert(msisdn+"成员组群");
			}else if("msisdn"==a_type){
				$(".member_list_div").hide();
				$(".member_detail_div").hide();
				$(".msisdn_detail_div").show();
				/*var url = "business_query/client_info_details.html?msisdn="+msisdn;
				Utils.load("#msisdn_detail_content", url);*/
				$("div#msisdn_detail_content").load("business_query/client_info_details.html", [], function(){
					clientInfoDetail.initData(msisdn);
				});
			}
		});
		
		$(".back_a").unbind("click").click(function(e){
			$(".member_list_div").show();
			$(".member_detail_div").hide();
			$(".msisdn_detail_div").hide();
		});
	},
	
	queryMemDetail : function(mem_user_id){
		var me = this;
		var params = {};
		params.mem_user_id = mem_user_id;
		Invoker.async("CustMemController", "queryCustMemberDetail", params, function(result){
			if(result.res_code == '00000'){
				me.initMemDetail(result.result);
			}
		});	
	},
	
	initMemDetail : function(data){
		$(".member_detail_tab").find("[dbfield='mem_user_name']").html(data.mem_user_name);
		$(".member_detail_tab").find("[dbfield='mem_user_alias']").html(data.mem_user_alias);
		$(".member_detail_tab").find("[dbfield='msisdn']").html(data.msisdn);
		$(".member_detail_tab").find("[dbfield='iccid']").html(data.iccid);
		$(".member_detail_tab").find("[dbfield='imsi']").html(data.imsi);
		
		$(".member_detail_tab").find("[dbfield='opening_date']").html(data.opening_date);
		$(".member_detail_tab").find("[dbfield='card_status_name']").html(data.card_status_name);
		$(".member_detail_tab").find("[dbfield='switch_status_name']").html(data.switch_status_name);
		$(".member_detail_tab").find("[dbfield='is_sign_msg_name']").html(data.is_sign_msg_name);
		$(".member_detail_tab").find("[dbfield='is_sign_gprs_name']").html(data.is_sign_gprs_name);
		$(".member_detail_tab").find("[dbfield='is_sign_voice_name']").html(data.is_sign_voice_name);
		
		$(".member_detail_tab").find("[dbfield='count_msg_total']").html(data.used_msg);
		$(".member_detail_tab").find("[dbfield='count_flow_total']").html(data.used_gprs);
		$(".member_detail_tab").find("[dbfield='comments']").html(data.comments);
	}
};

$(function() {
	AddUser.init();
});
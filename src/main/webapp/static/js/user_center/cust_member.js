(function(scope) {
	var CustMember = Base.extend({
		//初始化
		init : function() {
			var me = this;
			WYUtil.queryAttrCodeValue($("#tab_template"));
			WYUtil.queryAttrCodeValue($(".member_detail_tab"));
			me.initEvent();
			//me.initFormTable();//默认不加载
		},
		initEvent : function(){
			var me = this;
			$("#search_btn").unbind("click").bind("click",function(){
				me.initFormTable();
			});
		
			$("button[name='export_btn']").unbind("click").bind("click",function(){
				me.downloadMemUserReq();
			});
			
			//点击批量查询
			/*$("button[name='upload_btn']").unbind("click").bind("click",function(){
				alert("fd");
				$('#msisdn_file').click();
			});*/
			
			//下载模板
			$("button[name='load_template_btn']").unbind("click").bind("click",function(){
				window.open(Utils.getContextPath() + "/servlet/downloadExcel?type=mould&mould=msisdn");
			});
			
			me.initUploadEvent();
		},
		
		initUploadEvent : function(){
			var me = this;
			//附件上传
			$('#cust_mem_info_file').unbind().on("change", function(){
				var fileName = $("#cust_mem_info_file").val();
				$("#cust_mem_info_file").siblings("input[type='hidden']").val(fileName.substring(fileName.lastIndexOf("\\") + 1, fileName.length));
				var extPattern = /.+\.(xls|xlsx)$/i;
				if($.trim(fileName) != ""){
					if(!extPattern.test(fileName)){
						Utils.alert("只能上传EXCEL文件！");
						$("#cust_mem_info_file").val("");
						return;
					}
				}
			    
				var params_str = {};
				params_str.upload_type = 'cust_mem_info';
				
				var other_params_str = JSON.stringify(params_str);
				var reg = new RegExp('"', "g");
	            var other_params_str = other_params_str.replace(reg, "?");
	            
				var params = {};
				params.params_str = other_params_str;
				
	        	$.ajaxFileUpload({
	    			url : Utils.getContextPath() + "/UploadController/uploadExcel.do",
	    			secureuri : false,
	    			fileElementId : "cust_mem_info_file",
	    			data: params,
	    			dataType : 'json',
	    			success : function(data) {
	    				layer.closeAll();
	    				$("#cust_mem_info_file").val("");
	    				if(data.res_code=="00000"){
	    					var info = data.result;
	    					var download_key = info.download_key;
	    					var exl_message = info.exl_message
	    					Utils.alert(exl_message, function(){
	            				window.open(Utils.getContextPath() + "/UploadController/downloadExcel.do?download_key="+download_key+"&download_type=cust_mem_info");
	    					});
	    				}else{
	    					Utils.alert(data.res_message);
	    				}
	       			},
	    			error : function(data) {
	    				Utils.alert("操作失败 ！  "+ data.res_message);
	    				$("#cust_mem_info_file").val("");
	    				layer.closeAll();
	    			}
	    		});
	        	layer.load();
	        	me.initUploadEvent();
	        });
		},
	
		//导出成员信息
		downloadMemUserReq : function(){
			var me = this;
			var params = {};
			var search_content = $("#search_input").val();
			if(search_content == '请输入卡号、ICCID、IMSI'){
				search_content = '';
			}	
			params.search_content = search_content;
			var contextPath = Utils.getContextPath();
			var url = contextPath + "/UploadController/exportMemUserInfo.do?search_content="+search_content;
			window.open(url);
	 	},
		initFormTable : function(page, rows){
			var me = this;

			var msisdn = $.trim($('#search_input').val());//去除输入框中的空格
			if(msisdn == '请输入卡号、ICCID、IMSI'){
				msisdn = '';
			}			
			
			var param = {};
			var num = 1;
			var row = 10;
			//var search_content = $.trim($("#search_input").val());//去除输入的空格			
			param.page = page==null? num : page;
			param.rows = rows==null? row : rows;
			param.search_content = msisdn;
			Invoker.async("CustMemController", "queryCustMemberInfo", param, function(data){
				var has_data = false;
				var pageCount = 0;
				if(data && data.total>0){
					has_data = true;
					me.initTableData(data);
					pageCount = data.pageCount;
				}
				if(has_data == false){
					$(".search-from-list #form_table").find("tr:not(:first)").remove();
					var error_tr = '<tr><td colspan="99" align="center"><font color="red">无数据，请重新查询！</font></td></tr>';//暂无数据
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
					curr.data("data", memberInfo);				
					WYUtil.setInputDomain(memberInfo, curr);
					//$(curr).find('[dbfield="used_gprs"]').html(memberInfo.used_gprs+"MB");
					//$(curr).find('[dbfield="used_msg"]').html(memberInfo.used_msg+"条");
					//$(curr).find('[dbfield="used_voice"]').html(memberInfo.used_voice+"分钟");
					$(curr).find('[dbfield="msisdn"]').html(memberInfo.msisdn);
			        //$(curr).find("a").attr("msisdn", memberInfo.msisdn);
			        $(curr).find("a").attr("mem_user_id", memberInfo.mem_user_id);
			        $(".search-from-list #form_table").append(curr);
			        $("#detail_view", curr).click(function(e){
			        	var ele = $(this).closest("tr");
			        	var data = ele.data("data");
						$(".member_list_div").hide();
						$(".member_detail_div").show();
						$(".msisdn_detail_div").hide();
						var params = {};
						params.mem_user_id = data.mem_user_id;
						Invoker.async("CustMemController", "queryCustMemberDetail", params, function(result){
							if(result.res_code == '00000'){
								WYUtil.setInputDomain(result.result, $(".member_detail_div"));
								var flow_map = me.unitTranslate_0(result.result.used_gprs)
								$(".member_detail_div").find('[dbfield="used_gprs"]').html(flow_map.flow_count+flow_map.unit);
							}
						});
											
					});
			        $("#msisdn_view", curr).click(function(e){
			        	var mem_user_id = $(this).attr("mem_user_id");
						var msisdn = $(this).attr("msisdn");
			        	$(".member_list_div").hide();
						$(".member_detail_div").hide();
						$(".msisdn_detail_div").show();
						$("div#msisdn_detail_content").load("business_query/client_info_details.html", [], function(){
							clientInfoDetail.initData(msisdn);
						});
					});
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
				if($(this).hasClass("active")) {
					$(this).removeClass("active");
				}else {
					$(this).addClass("active");
					var mem_user_id = $(this).find(".checkbox_i").attr("mem_user_id");
					//alert(mem_user_id);
				}
			});
			
			$(".back_a").unbind("click").click(function(e){
				$(".member_list_div").show();
				$(".member_detail_div").hide();
				$(".msisdn_detail_div").hide();
			});
		},
		
		queryMemDetail : function(mem_user_id, msisdn){
			var me = this;
			me.initMemDetail();
			var params = {};
			params.mem_user_id = mem_user_id;
			params.msisdn = msisdn;
			Invoker.async("CustMemController", "queryCustMemberDetail", params, function(result){
				if(result.res_code == '00000'){
					WYUtil.setInputDomain(result.result,$(".member_detail_div"));
				}
			});
			
			//查询套餐信息
			Invoker.async("CustMemController", "queryCustMemProdFeeInfo", params, function(data){
				if(data.res_code == "00000"){
					var $fee_info_table = $(".member_detail_tab");
					$.each(data.result, function(i, info) {
						var feeTr = $("#prod_fee_table_tr").eq(0).clone().show();
						WYUtil.setInputDomain(info, feeTr);
						$("tbody", $fee_info_table).append(feeTr);
					});
				}
				else{
					layer.msg(data.res_message);
				}
			});
		},
		
		initMemDetail : function(){
			
			$(".member_detail_tab").find("[dbfield='msisdn']").html("");
			$(".member_detail_tab").find("[dbfield='iccid']").html("");
			$(".member_detail_tab").find("[dbfield='imsi']").html("");
			
			$(".member_detail_tab").find("[dbfield='card_user_name']").html("");
			$(".member_detail_tab").find("[dbfield='card_brand_type']").html("");
			$(".member_detail_tab").find("[dbfield='card_status']").html("");
			
			$(".member_detail_tab").find("[dbfield='mem_user_name']").html("");
			$(".member_detail_tab").find("[dbfield='mem_user_alias']").html("");
			
			$(".member_detail_tab").find("[dbfield='opening_date']").html("");
			$(".member_detail_tab").find("[dbfield='switch_status']").html("");
			
			$(".member_detail_tab").find("[dbfield='sign_msg_name']").html("");
			$(".member_detail_tab").find("[dbfield='sign_gprs_name']").html("");
			$(".member_detail_tab").find("[dbfield='sign_voice_name']").html("");
			
			$(".member_detail_tab").find("[dbfield='used_msg']").html("");
			$(".member_detail_tab").find("[dbfield='used_gprs']").html("");
			$(".member_detail_tab").find("[dbfield='used_voice']").html("");
			$(".member_detail_tab").find("[dbfield='comments']").html("");
			
			var $fee_table = $(".member_detail_tab").find("table");
			$.each($("tr",$fee_table), function(i, tr) {
				//前五行不删除
				if (i <= 4) {
					return;
				}
				tr.remove();
			});
		},
		//单个数据流量单位转换
		unitTranslate_0 : function(flow_count){
			var unit = 'KB'
			if(flow_count == ''){
				flow_count = '0';
			}
			flow_count = (parseFloat(flow_count) / 1024);
			if(flow_count >= (1024 * 1024)){
				unit = 'G';
				flow_count = (parseFloat(flow_count) / (1024 * 1024)).toFixed(2);
			}else if(flow_count >= 1024){
				unit = 'MB';
				flow_count = (parseFloat(flow_count) / 1024).toFixed(2);
			}else{
				flow_count = parseFloat(flow_count).toFixed(2);
			}
			return {"flow_count" : flow_count, "unit" : unit}
		}
	});
	window.CustMember = new CustMember();
}(window));

$(function() {
	CustMember.init();
});
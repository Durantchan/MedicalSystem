var trmlSearch = {
	/**
	 * 初始化点击事件
	 * 
	 */
	initClick : function(){
		var me = this;
		//批量查询模板下载 
		$("button[name='batch_trml_temp']").unbind("click").bind("click",function(){
			window.open(Utils.getContextPath() + "/servlet/downloadExcel?type=mould&mould=imei");                 
		});
		
		
		/**
		 * 更新设备信息按钮
		 */
		$('#update_trml_btn').unbind().bind("click", function() {
			$('#update_container').show();
			$('#page_container').hide();
		});
		
		/**
		 * 从更新设备界面返回按钮
		 */
		$('#go_back').unbind().bind("click", function() {
			$('#update_container').hide();
			$('#page_container').show();
		});
		
		$('#detail_go_back').unbind().bind("click", function() {
			$('#detail_container').hide();
			$('#page_container').show();
		});
		
		$('#usage_go_back').unbind().bind("click", function() {
			$('#usage_container').hide();
			$('#page_container').show();
		});
		
		/**
		 * 保存更新设备信息
		 */
		$('#save_trml').unbind().bind("click", function() {
			var param = {};
			
			if(!me.current_trml_type) {
				layer.msg("设备类型不能为空！");
				return false;
			}
			
			param.terminal_type = me.current_trml_type;
			
			$(this).closest("table").find("input").each(function(i){
			    param[$(this).attr("name")] = $(this).val();
			    /*if($(this).val()=="") {
			    	Utils.alert(res_message);
			    	return false;
			    }*/
			});
			
			trmlSearch.updateTmrl(param);
		});
		
		/**
		 * 搜索
		 */
		$('#search_btn').bind("click", function() {
			var imei = $("#search_input").val().trim();
			if(imei ==''){
				Utils.alert("请输入卡号！");
				return;
			}
			if(!/^[1-9][0-9]*$/.test(imei)){
					Utils.alert("卡号格式错误");
					return;
			}
			trmlSearch.queryTrmlPage();
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
	    
	    $('.inp-slt-tt').bind("click", function() {
	    	$(this).next().show();
	    });
	},
	
	/**
	 * 更新终端设备信息
	 * @param param
	 */
	updateTmrl : function(param) {
		Invoker.async("TrmlMgrController", "updateTrmlInfo", param , function(result){
			if(result.res_code == "00000"){
				trmlSearch.queryTrmlPage();
				layer.msg("操作成功");
			}
			else{
				Utils.alert(result.res_message);
			}
		});
	},
	
	//初始化上传事件
	initBatchUpload : function(){
		var me = this;
		//附件上传
		$('#trml_file').unbind().on('change',function(){
			var fileName = $("#trml_file").val();
			$("#trml_file").siblings("input[type='hidden']").val(fileName.substring(fileName.lastIndexOf("\\") + 1, fileName.length));
			var extPattern = /.+\.(xls|xlsx)$/i;
			if($.trim(fileName) != ""){
				if(!extPattern.test(fileName)){
					Utils.alert("只能上传EXCEL文件！");
					$("#trml_file").val("");
					return;
				}
			}
			var params_str = {};
			params_str.upload_type = 'trml_info';
			var other_params_str = JSON.stringify(params_str);
			var reg = new RegExp('"', "g");
            var other_params_str = other_params_str.replace(reg, "?");
			var params = {};
			params.params_str = other_params_str;
			
        	$.ajaxFileUpload({
    			url : Utils.getContextPath() + "/UploadController/uploadExcel.do",
    			secureuri : false,
    			data: params,
    			fileElementId : "trml_file",
    			dataType : 'json',
    			success : function(data, status) {
    				layer.closeAll();
    				$("#trml_file").val("");
    				if(data.res_code == "00000"){
    					var info = data.result;
						var exl_message = info.exl_message;
						var mark = info.mark;
//		    			var res_list = info.phone_list
		    			//少于20条数据
		    			//Utils.alert(exl_message);
		    			if(""!=info.download_key && null!=info.download_key){
		    				var download_key = info.download_key;
							window.open(Utils.getContextPath() + "/UploadController/downloadExcel.do?download_key="+download_key+"&download_type=trml_info");   
		    			}else{
		    				var res_list = info.imei_list
		    				$('#trml_tbody').empty();
							trmlSearch.renderData(res_list);
		    			}
					
    				}else{
    					Utils.alert(data.res_message);
    				}
    				me.initBatchUpload();
    			},
    			
    			error : function(data, status, e) {
    				Utils.alert("操作失败");
    				me.initBatchUpload();
    				$("#balance_file").val("");
    				layer.closeAll();
    			}
    		});
        	layer.load();
        	me.initBatchUpload();
        });
	},
	
	
	/**
	 * 分页查询设备列表
	 * @param pageNum
	 * @param pageRow
	 * @param id
	 */
	queryTrmlPage : function(pageNum, pageRow, id){
		$('#trml_tbody').empty();
		var param = {};
		var num = 1;
		var row = 10;
		param.page = pageNum==null? num : pageNum;
		param.rows = pageRow==null? row : pageRow;
		var search_content = $.trim($('#search_input').val());
		if(search_content == '请输入卡号或IMEI'){
			search_content = '';
		}
		param.search_content = search_content;
		Invoker.async("TrmlMgrController", "getTrmlList", param, function(data) {
			if (data && data.total>0) {
				trmlSearch.renderData(data.rows);
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
							trmlSearch.queryTrmlPage(obj.curr);
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
	 * 渲染数据
	 * @param data
	 */
	renderData: function(data){
		var rows = data;
		if(rows != null){
			$.each(rows, function(i,value){
				var clone = $('#tr_temp').clone().removeAttr("id").show();
				WYUtil.setInputDomain(value, clone);
				$('#trml_tbody').append(clone);
				/*$(".inp-handle-hd", clone).bind("click", function() {
					$(this).next().show();
				});*/
				
				clone.data("imei", value.imei);
				clone.data("msisdn", value.msisdn);
				clone.data("detail", value);
				
				//详情
				clone.find("[name='detail']").bind("click", function() {
					var detail = $(this).closest("tr").data("detail");
					WYUtil.setInputDomain(detail, $('#detail_container'));
					$('#detail_container').show();
					$('#page_container').hide();
				});
				//使用情况
				clone.find("[name='usage']").bind("click", function() {
					var param = {};
					param.imei=$(this).closest("tr").data("imei");
					param.mem_user_id=$(this).closest("tr").data("msisdn");
					//alert(param.mem_user_id);
					Invoker.async("TrmlMgrController", "queryTrmlUsage", param, function(result){
						if(result.res_code == "00000"){
							if(!!result.result){
								$('#usage_container').find("[name='none']").hide();
								$('#usage_container').find("[name='data']").show();
							}else{
								$('#usage_container').find("[name='data']").hide();
								$('#usage_container').find("[name='none']").show();
							}
							WYUtil.setInputDomain(result.result, $('#usage_container'));
							$('#usage_container').show();
							$('#page_container').hide();
						}
					});
				});
			});
		} else{
			$('#trml_tbody').append("<tr><td colspan='99' align='center'><font color='red'>暂无数据，请重新查询！</font></td></tr>");
		}
	},
	
	/**
	 * 下拉框初始化
	 */
	initTrmlType : function() {
		var me = this;
		$('#terminal_type_ul').empty();
		Invoker.async("CacheController", "getAttrValues", "TERMINAL_TYPE", function(data) {
			$.each(data, function(i, attrValue){
				if(i==0) {
					$('#terminal_type').text(attrValue.attr_value_name);
					me.current_trml_type = attrValue.attr_value;
				}
				var temp = "<li class='inp-slt-item' data-id='"+attrValue.attr_value+"'>"+attrValue.attr_value_name+"</li>";
				$('#terminal_type_ul').append(temp);
			});
			
			$('#terminal_type_ul li').bind("click", function() {
				$('#terminal_type').text($(this).text());
				$('#terminal_type').next().hide();
				me.current_trml_type = $(this).data("id");
			});
		},false);
	},
	
	init : function() {
		trmlSearch.initClick();
		trmlSearch.initBatchUpload();
	}
};

$(function(){
	trmlSearch.init();
});



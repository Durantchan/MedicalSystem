//成员使用情况清单告警查询
var memUsingInfoNotice = {
	//初始化
	init : function() {
		
		//初始化菜单点击事件
		//businessQueryCommon.initSubmenuClk();
		var me = this;
		me.initData();
		me.queryMemUsingInfo();
		
	},
	
	initData : function () {
		var me = this;
		WYUtil.queryAttrCodeValue($("#tab_template"));
		dropDown.init($("#search-from-list"));
		me.bindEvent();
	},	
	
	queryMemUsingInfo : function(pageNum, pageRow){

    	var msisdn=$.trim($("#search_input").val());
		var batch_id = $("#usingInfoNotice_batch_id").val();//批次
		if(msisdn == '请输入卡号'){
			msisdn = '';
		}
		if(batch_id == '0'){
			if(msisdn != ''){
				if(!/^[1-9][0-9]*$/.test(msisdn)){
					Utils.alert("卡号格式错误");
					return;
				}
			}
			batch_id = '';
		}
		
		$('#trml_tbody').empty();
		var params = {};
		var num = 1;
		var row = 10;//设置多少行就多少为一个分页		
		params.pageNum = pageNum==null? num : pageNum;
		params.pageRow = pageRow==null? row : pageRow;
		params.batch_id = batch_id;
		params.msisdn=msisdn;
		$(".search-from-list #form_table").find("tr:not(:first)").remove();
		var me = this;		
		Invoker.async("CustMemController", "queryCustMemUsingInfo", params, function(data) {
			if (data && data.total>0) {
				memUsingInfoNotice.renderData(data);
				laypage({
					cont: 'memUsingInfoNoticePage',
					pages: data.pageCount, //总页数
					curr: data.pageNumber, //当前页
					//skin: '#6495ED',
					groups: '3', //连续页数
					skip: true, //跳页
					jump: function(obj, first){ //触发分页后的回调
						if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
							//var state = $(".tab-nav-link.active").attr("name");
							//page_curr = obj.curr;
							memUsingInfoNotice.queryMemUsingInfo(obj.curr);
						}
					}
				});
			}
			else{
				$('#form_table').append("<tr><td colspan='99' align='center'><font color='red'>无数据，请重新查询！</font></td></tr>");
			}
		});
	},
	
	
/*	renderData: function(data){
		var rows = data.rows;
		if(rows != null){
			$.each(rows, function(i,value){
				var clone = $('#tr_temp').clone().removeAttr("id").show();
				WYUtil.setInputDomain(value, clone);
				$('#trml_tbody').append(clone);
//				$(".inp-handle-hd", clone).bind("click", function() {
//					$(this).next().show();
//				});
			});
		} else{
			$('#trml_tbody').append("<tr><td colspan='99' align='center'><font color='red'>暂无数据，请重新查询！</font></td></tr>");
		}
	},*/
	
	renderData: function(data){
		var me = this;
		$(".search-from-list #form_table").find("tr:not(:first)").remove();
		if(data){
			for(var i=0;i<data.total;i++){
				var memUsingStatus = data.rows[i];
				var curr = $("#tr_template").clone().removeAttr("id").show();
		        $(curr).find('[name="mem_user_id"]').html(memUsingStatus.mem_user_id);
		        $(curr).find('[name="mem_type"]').html(memUsingStatus.mem_type);
		        if(memUsingStatus.mem_type=="流量"){
			        //$(curr).find('[name="usering_value"]').html(memUsingStatus.usering_value/1048576+"MB");
		        	$(curr).find('[name="usering_value"]').html(memUsingStatus.usering_value+"MB");
		        }else{
			        $(curr).find('[name="usering_value"]').html(memUsingStatus.usering_value);
		        }
		        $(curr).find('[name="warning_comment"]').html(memUsingStatus.warning_comment);
		        $(curr).find('[name="create_date"]').html(memUsingStatus.create_date);
		        $("#form_table").append(curr);
			}
		}else{
			var error_tr = '<tr><td colspan="99" align="center"><font color="red">无数据，请重新查询！</font></td></tr>';
			$("#form_table").append(error_tr);
		}
	},
	
	 bindEvent : function() {
     	
        var me = this;
        $("#usingInfoNotice_batch_id").val('0'); 
        $('#btn_search').unbind("click").bind("click",function() {
			me.queryMemUsingInfo();
		});
        
		//点击导出数据
        $("button[name='export_memUsingInfo_data']").unbind("click").bind("click",function() {
        			
        	var batch_id = $.trim($("#usingInfoNotice_batch_id").val());//批次		
    		if(batch_id == '0'){
    			batch_id = '';
    		}
			var contextPath = Utils.getContextPath();
			var url = contextPath + "/UploadController/exportforMemUsingNotice.do?batch_id="+batch_id;
			window.open(url);
        });        
        
     },
     
 	//首页告警公告跳转传batch_id来查询相应告警信息。
 	usingInfoNoticeBatchId : function(batch_id){

 		var me = this;
 		$("#usingInfoNotice_batch_id").val(batch_id);
 		me.queryMemUsingInfo();
 	}
};

$(function() {

	memUsingInfoNotice.init();
});

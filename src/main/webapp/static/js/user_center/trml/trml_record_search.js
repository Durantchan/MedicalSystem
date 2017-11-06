(function(scope) {
	
	var trmlRecord = Base.extend({
		//初始化
		init : function() {
			var me = this;
			me.initEvent();
			$("#start_time").val(me.addDate_yyyyMMdd(-7));
			$("#end_time").val(me.addDate_yyyyMMdd(0));
		},
		initEvent : function(){
			var me = this;
			//日期插件时间限制
			var minDate =  me.addDate(-30);
	     	var maxDate =  me.addDate(0);
	     	me.limitDate("start_time", 'yyyyMMdd', minDate, maxDate);
	     	me.limitDate("end_time", 'yyyyMMdd', minDate, maxDate);
	     	//查询按钮
			$("#btn_search").unbind("click").bind("click",function(){
				me.initFormTable();
			});
			//详情返回按钮
			$('#detail_go_back').unbind().bind("click", function() {
			$('#detail_container').hide();
			$('#page_container').show();
			});
			
			
		
		},
		
		
		initFormTable : function(page, rows){
			var me = this;
			if(!me.validate()){
				return false;
			}
			var param = {};
			var num = 1;
			var row = 10;
			var imei = $.trim($("#imei").val());//除去输入框中的空格
			var start_time = $("#start_time").val();
			var end_time = $("#end_time").val();
			param.page = page==null? num : page;
			param.rows = rows==null? row : rows;
			param.imei = imei;
			param.start_time = start_time;
			param.end_time = end_time;
			Invoker.async("TrmlMgrController", "queryTrmlRecord", param, function(data){
				var has_data = false;
				var pageCount = 0;
				if(data && data.total>0){
					has_data = true;
					me.initTableData(data);
					pageCount = data.pageCount;
				}
				if(has_data == false){
				
					$(".search-from-list #trml_tbody").html('');
					var error_tr = '<tr><td colspan="99" align="center"><font color="red">暂无数据</font></td></tr>';
					$(".search-from-list #trml_tbody").append(error_tr);
				}
				laypage({
					cont: 'trmlPage',
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
			$(".search-from-list #trml_tbody").html('');
			var total = data.total;
			if(total > 0){
				for(var i=0; i<data.rows.length; i++){
					var memDevice = data.rows[i];
					var curr = $(".search-from-list #tr_temp").clone().removeAttr("id").show();
					curr.data("data", memDevice);
					WYUtil.setInputDomain(memDevice, curr);
			        $(".search-from-list #trml_tbody").append(curr);
			        curr.data("imei", memDevice.imei);
					curr.data("mem_user_id", memDevice.mem_user_id);
					curr.data("detail", memDevice);
					//详情按钮
					curr.find("[name='detail']").bind("click", function() {
					var detail = $(this).closest("tr").data("detail");
					WYUtil.setInputDomain(detail, $('#detail_container'));
					$('#detail_container').show();
					$('#page_container').hide();
				});
				
				}
			}else{
				var error_tr = '<tr><td colspan="99" align="center"><font color="red">暂无数据</font></td></tr>';
				$(".search-from-list #tr_temp").append(error_tr);
			}
		},
		downloadCustMem : function(){
			var me = this;
			
			window.open(Utils.getContextPath() + "/UploadController/downloadExlforCustMemdevice.do?start_time="+start_time+"&end_time="+end_time);
		},
		
		validate : function(){
			var me = this;
			var imei = $.trim($("#imei").val());
			var start_time = $("#start_time").val();
			var end_time = $("#end_time").val();
			if(imei == ''){
				Utils.alert("查询号码不能为空");
				return false;
			}else{
				if(!/^[1-9][0-9]*$/.test(imei)){
					Utils.alert("卡号格式错误");
					return;
				}
			}
			if(start_time == '' || end_time == ''){
				Utils.alert("查询时间段不能为空");
				return false;
			}
			var startTime = me.getDateTime(start_time);
			var endTime = me.getDateTime(end_time);
			if(startTime > endTime){
				Utils.alert("开始时间不能大于结束时间");
				return false;
			}
			return true;
		},
		/**
	     * 时间控件日期限制
	     * @param key
	     * @param dfmt 日期格式 ： yyyy-mm-dd
	     * @param min  最小日期  
	     * @param max  最大日期
	     */
	    limitDate : function(key, dfmt , minDate , maxDate) {
	     	$("#"+key+"").unbind('focus').bind('focus',function(){
	        	WdatePicker({dateFmt:dfmt, minDate:minDate, maxDate:maxDate});
	        });
	    },
		showMonthSelect : function (monthNum) {
			var today = new Date();
			var str = '';
			var lastMonth = today.setMonth(today.getMonth()+ 1 + monthNum);
			var month = "01";
	        if(today.getMonth() < 10){
	        	month = "0" + today.getMonth();
	        }else{
	        	month =  today.getMonth();
	        }
	        str = today.getFullYear() + "-" + month;  
	        if (today.getMonth() == '0') {
	        	str = today.getFullYear() - 1 + "-" + "12";
			}
			return str;
		},
		addDate : function(days) {
			var d = new Date();
			d.setDate(d.getDate() + days);
			var month = d.getMonth() + 1;
			var day = d.getDate();
			if (month < 10) {
				month = "0" + month;
			}
			if (day < 10) {
				day = "0" + day;
			}
			var val = d.getFullYear() + "-" + month + "-" + day;
			return val;
		},
		addDate_yyyyMMdd : function(days) {
			var d = new Date();
			d.setDate(d.getDate() + days);
			var month = d.getMonth() + 1;
			var day = d.getDate();
			if (month < 10) {
				month = "0" + month;
			}
			if (day < 10) {
				day = "0" + day;
			}
			var val = d.getFullYear() + "" +  month + "" + day;
			return val;
		},
		getDateTime : function(dateStr){
			//var date = new Date(dateStr);
			//return  date.getTime();
			return parseInt(dateStr);
		}
	});
	window.trmlRecord = new trmlRecord();
}(window));

$(function() {
	trmlRecord.init();
});
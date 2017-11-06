/**
 * 设备绑定告警配置
 */
var trml_binding = {
	
	/**
	 * 初始化点击事件
	 * 
	 */
	initClick : function(){
		var me = this;
		
		$('#search_input').placeholder();
		
		/**
		 * 绑定按钮
		 */
		$('#binding_btn').unbind().bind("click", function() {
			//$('.container').show();
			//$('.container.mb20').hide();
			Utils.layerOpen("设备绑定配置", "/user_center/trml/trml_binding_popup.html");
		});
		
		/**
		 * 搜索
		 */
		$('#search_btn').bind("click", function() {
			me.queryWarningPage();
		});
	},
	
	/**
	 * 分页查询告警信息列表
	 * @param pageNum
	 * @param pageRow
	 */
	queryWarningPage : function(pageNum, pageRow){
		var me = this;
		$('#trml_tbody').empty();
		var param = {};
		var num = 1;
		var row = 10;
		param.pageNum = pageNum==null? num : pageNum;
		param.pageRow = pageRow==null? row : pageRow;
		param.imei = $('#search_input').val();
		Invoker.async("TrmlBindingController", "queryImeiWarningInfo", param, function(data) {
			if (data && data.total>0) {
				me.renderData(data);
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
							me.queryWarningPage(obj.curr);
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
		var rows = data.rows;
		if(rows != null){
			$.each(rows, function(i,value){
				var clone = $('#tr_temp').clone().removeAttr("id").show();
				WYUtil.setInputDomain(value, clone);
				$('#trml_tbody').append(clone);
			});
		} else{
			$('#trml_tbody').append("<tr><td colspan='99' align='center'><font color='red'>暂无数据，请重新查询！</font></td></tr>");
		}
	},
	
	init : function() {
		trml_binding.initClick();
		trml_binding.queryWarningPage();
	}
};

$(function(){
	trml_binding.init();
});



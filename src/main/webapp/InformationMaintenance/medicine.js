(function(){ 
	var medicine = Base.extend({
		init : function(){ 
			var me = this;
			me.queryMedicine();
			me.bindEvent();
		},
		
		bindEvent : function(){
			var me = this;
			
			$("#btn_add").click(function () {
				$("#myModalLabel").text("新增");
				$('#myModal').modal();
			});
			
			$("#btn_submit").click(function(){
				me.addNewMedicine();
			});
			
			$("#btn_search").click(function(){
				me.querySomeMedicine();
			});
			
			$("#btn_update").click(function(){
				var checkbox = $("#form_table").find("input:checked");
				if (!checkbox || checkbox.length == 0) {
					alert("请选择要修改的药品");
					return;
				}
				var data = checkbox.closest("tr").data("data");
				$("#myModel #drug_name").val(data.drug_name);
				$("#myModel #drug_type").val(data.drug_type);
				$("#myModel #drug_manufacturer").val(data.manufacturer);
				$("#myModel #drug_price").val(data.price);
				$("#myModel #drug_insurance").val(data.drug_propotion);
				$("#myModel #drug_propotion").val(data.drug_insurance);
				$("#myModel #drug_message").val(data.message);
				$("#myModelLabel").text("修改");
				$('#myModel').modal();
			});
			
			$("#submit").click(function(){
				me.updateMedicine();
			});
			
			$("#btn_delete").click(function(){
				me.deleteMedicine();
			});
		},
		
		queryMedicine : function(param){
			
			var me = this;
			if(!param) param = new Object();
			param.pn = 0;
			$.ajax({
				type : "POST",
				url : "medicine/querySome.action",
				dataType: "json",
				data:param,
				success: function(result){
					me.initTableData(result.page.list);
					me.build_page_nav("medicine/querySome.action",result);
				}
			
			});
		},
		
		initTableData : function(data){
			
			var me = this;
			$("#data_list #form_table").find("tr:not(:first)").remove();
			if(data.length!=0){
			$.each(data, function(i, drug_name){
				var curr = $("#data_list #tr_template").clone().removeAttr("id").show();
				curr.data("data", drug_name);				
				WYUtil.setInputDomain(drug_name, curr);
				$("#data_list #form_table").append(curr);
				});
			}
			else{
				var error_tr = '<tr><td colspan="99" align="center"><font color="red">暂无数据</font></td></tr>';
				$("#data_list #form_table").append(error_tr);
			}
		},
		
		addNewMedicine : function(){
			var me = this;
			var param = {};
			param.drug_name = $("#name").val();
			if(null==param.drug_name || ""==param.drug_name)
				alert("药品名不能为空");
			else{
			param.drug_type = $("#type").val();
			param.manufacturer = $("#manufacturer").val();
			param.price = $("#price").val();
			param.drug_propotion = $("#propotion").val();
			param.drug_insurance = $("#insurance").val();
			param.message = $("#message").val();
			if(param.drug_insurance=="是") param.drug_insurance = 1;
			else param.drug_insurance = 0;
			$.ajax({
				type:"POST",
				url:"medicine/add.action",
				data:param,
				datatype:"json",
				success:function(result){
					if(result=="0000")
						alert("添加成功");
					else 
						alert("添加失败");
						
				}
			});
			me.queryMedicine();
			}
		},
		
		querySomeMedicine : function(){

			var me = this;
			var param = {};
			var name = $("#Name").val();
			var type = $("#Type").val();
			if((null==name || ""==name) && (null==type || ""==type))
				alert("查询条件不能为空");
			else{
			param.drug_name = name;
			param.drug_type = type;
			me.queryMedicine(param);
			}
		},
		
		updateMedicine : function(){
			var me = this;
			var param = {};
			var name = $("#myModel #drug_name").val();
			var type = $("#myModel #drug_type").val();
			var manufacturer =$("#myModel #drug_manufacturer").val();
			var price = $("#myModel #drug_price").val();
			var propotion = $("#myModel #drug_insurance").val();
			var insurance = $("#myModel #drug_propotion").val();
			var message = $("#myModel #drug_message").val();
			if(null==name || ""==name){
				alert("药品名不能为空");
				return;
			}
			if(insurance=="是") insurance = 1;
			else insurance = 0;
			param.drug_name = name;
			param.drug_type = type;
			param.manufacturer = manufacturer;
			param.price = price;
			param.drug_propotion = propotion;
			param.drug_insurance = insurance;
			param.message = message;
			$.ajax({
				type:"POST",
				url:"medicine/update.action",
				data:param,
				datatype:"json",
				success:function(result){
					if(result=="0000")
						alert("修改成功");
					else 
						alert("修改失败");
				}
			});
			me.queryMedicine();
		},
		
		deleteMedicine : function(){
			var me = this;
			var param = {};
			var checkbox = $("#form_table").find("input:checked");
			if (!checkbox || checkbox.length == 0) {
				alert("请选择要删除的药品");
				return;
			}
			var obj = checkbox.closest("tr").data("data");
			var r = confirm("确认删除【"+obj.drug_name+"】这个药品？");
			if(true == r){
				param.drug_name = obj.drug_name;
				$.ajax({
					type:"POST",
					url:"medicine/delete.action",
					data:param,
					datatype:"json",
					success:function(result){
						if(result=="0000")
							alert("药品"+obj.drug_name+"已经删除");
						else 
							alert("删除失败");
					}
					
				});
			}
			me.queryMedicine();
		},
		
		build_page_nav : function(url,result) {
			var me = this;
		    $("#nav_page").empty();
		    var ul = $("<ul></ul>").addClass("pagination");
		    var firstPageLi = $("<li></li>").append($("<a></a>").append("首页").attr("href","#"));
		    var perPageLi = $("<li></li>").append($("<a></a>").append("&laquo;"));
		    if(result.page.hasPreviousPage == false){
		        firstPageLi.addClass("disabled");
		        perPageLi.addClass("disabled");
		    }else{
		        firstPageLi.click(function () {me.to_page(url,1);})

		        perPageLi.click(function(){me.to_page(url,result.page.pageNum-1);})
		    }
		    var nextPageLi = $("<li></li>").append($("<a></a>").append("&raquo;"));
		    var lastPageLi = $("<li></li>").append($("<a></a>").append("尾页").attr("href","#"));
		    if(result.page.hasNextPage == false){
		        nextPageLi.addClass("disabled");
		        lastPageLi.addClass("disabled");
		    }else {
		        lastPageLi.click(function(){me.to_page(url,result.page.pages)});
		        nextPageLi.click(function(){me.to_page(url,result.page.pageNum+1)});
		    }
		    ul.append(firstPageLi).append(perPageLi);
		    $.each(result.page.navigatepageNums, function (index, item) {

		        var numLi = $("<li></li>").append($("<a></a>").append(item));
		        if(result.page.pageNum==item){
		            numLi.addClass("active");
		        }else {
		            numLi.click(function () {
		                me.to_page(url,item);
		            })
		        }
		        ul.append(numLi);
		    })
		    ul.append(nextPageLi).append(lastPageLi).appendTo("#nav_page");
		},
		
		to_page : function(url,pn) {
		    var param = {};
		    var me = this;
		    param.pn = pn;
			$.ajax({
		        url:url,
		        type:"POST",
		        data:param,
		        datatype:"json",
		        success:function (data) {
		            me.initTableData(data.page.list);
		            me.build_page_nav(url,data);
		        }
		    });
		}
		
	});
	window.medicine = new medicine();
}());
$(function(){
	medicine.init();
});

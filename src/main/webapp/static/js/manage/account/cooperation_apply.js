 var cooperation = {
	//初始化信息
	init: function(){
		cooperation.initBtn();
		$("label[name=apply_type][value=personal]").click();
	},
	
	//初始化按钮
	initBtn: function(){
		$(".found-app-type-item").click(cooperation.checkboxClick);
		$(".submit-btn").click(cooperation.submitBtnClick);
	},
	
	//单选框
	checkboxClick: function(){
		$(".found-app-type-list").find("label[name=apply_type]").removeClass("active");
		$(this).find("label[name=apply_type]").addClass("active");
		var apply_type = $(this).find("label[name=apply_type]").attr("value");
		if(apply_type == "personal"){
			$("#apply_form").load("manage/account/user_apply_table.html", cooperation.initForm);
		}
		else{
			$("#apply_form").load("manage/account/company_apply_table.html", cooperation.initForm);
		}
	},
	//初始化表单数据
	initForm: function(){
		$("#apply_form input, #apply_form textarea").placeholder();
		
		//填写用户
		Invoker.async("LoginController", "getUserName", {}, function(result){
			if(result.res_code == "00000"){
				$("#apply_form strong[name=user_name]").text(result.result);
			}
		}, false);
		
		//填写手机号码/联系手机
		Invoker.async("LoginController", "getMobilePhone", {}, function(result){
			if(result.res_code == "00000"){
				$("#apply_form input[name=contact_mobile]").val(result.result);
			}
		}, false);
		
		//初始化省份下拉框
		cooperation.initProvince();
	},
	//提交按钮
	submitBtnClick: function(){
		$(".submit-btn").prop("disabled", true);
		if(!cooperation.validateParam()){
			$(".submit-btn").prop("disabled", false);
			return;
		}
		
		var apply_type = $("label[name=apply_type].active").attr("value");
		var url = Utils.getContextPath() + "/UserPersonalInfoController/savePersonalUser.do?type=personal";
		if(apply_type == "company"){
			url = Utils.getContextPath() + "/UserPersonalInfoController/saveCompanyUser.do?type=company";
		}
		
		$("#apply_form").form("submit", {
			url: url,
			success: function(data){
				if(data){
					var dataVal = $.parseJSON(data);
					if(dataVal.res_code == "00000"){
						Utils.alert("用户提交认证信息成功,请等待审核通过");
						$("#main_warp").load("home/home.html");
					}
					else{
						Utils.alert(dataVal.res_message);
					}
				}
				$(".submit-btn").prop("disabled", false);
			},
			error: function(data){
				if(data){
					var dataVal = $.parseJSON.parse(data);
					Utils.alert(dataVal.res_message);
				}
				$(".submit-btn").prop("disabled", false);
			}
		});
	},
	
	//校验
	validateParam: function(){
		//radio值
		var apply_type = $("label[name=apply_type].active").attr("value");
		//校验非空
		var params = ["nick_name", "email"];
		if(apply_type == "personal"){
			params.push("id_card_name", "id_card", "contact_mobile");
		}
		else{
			params.push("contact_name", "contact_mobile", "contact_phone", "province", "country", "company_desc", "company_name", "company_person_name");
		}
		
		var pass = true;
		$.each(params, function(i, name){
			var selector = "#apply_form *[name=" + name + "]";
			if(!$(selector).val()){
				var message = $(selector).closest("td").prev().text() + "不能为空";
				if(name == "country" || name == "province"){
					selector = "#country";
				}
				layer.tips(message, selector, {
					tipsMore: true
				});
				pass = false;
			}
		});
		
		//校验邮箱
		var email = $("#apply_form input[name=email]").val();
		if(email && !Utils.isEmail(email)){
			layer.tips("邮箱格式不正确", "#apply_form input[name=email]", {tipsMore: true});
			pass = false;
		}
		
		//校验手机号码
		var contact_mobile = $("#apply_form input[name=contact_mobile]").val();
		if(contact_mobile && !Utils.checkPhoneNumber(contact_mobile)){
			var message = "手机号码格式不正确";
			if(apply_type == "company"){
				message = "联系手机格式不正确";
			}
			layer.tips(message, "#apply_form input[name=contact_mobile]", {tipsMore: true});
			pass = false;
		}
		
		if(apply_type == "personal"){
			//校验身份证
			var id_card = $("#apply_form input[name=id_card]").val();
			if(id_card && !Utils.checkIdCard(id_card)){
				layer.tips("身份证号码格式不正确", "#apply_form input[name=id_card]", {tipsMore: true});
				pass = false;
			}
		}
		else{
			var contact_phone = $("#apply_form input[name=contact_phone]").val();
			//var reg = /^\d{3}-\d{8}|\d{4}-\d{7}$/;
			var reg = /^0\d{2,3}-\d{7,8}(-\d{1,6})?$/;
			if(contact_phone && !reg.test(contact_phone)){
				layer.tips("企业联系电话格式不正确", "#apply_form input[name=contact_phone]", {tipsMore: true});
				pass = false;
			}
		}
		
//		//校验文件格式
//		var selector = apply_type == "personal" ? "input[name=id_card_photo]" : "input[name=business_licence_photo]";
//		var file = $(selector).val().substring($(selector).val().lastIndexOf(".")+1).toUpperCase();
//		if($(selector).val() && !(file == "JPEG" || file == "PNG" || file == "BMP" || file == "JPG" || file == "GIF")){
//			layer.tips("上传文件非图片文件,请确认", selector, {tipsMore: true});
//			pass = false;
//		}
		
		return pass;
	},
	//加载省份下拉框
	initProvince: function(){
		Invoker.async("CacheController", "getAttrOrSubAttr", {code: "REGION_PRIVINCE"}, function(data){
			if(!$.isArray(data) || data.length < 1){
				return;
			}
			
			var html = [];
			$.each(data, function(i, attr){
				html.push("<li class='inp-select-item' value='" + attr.attr_value + "'>" + attr.attr_value_name + "</li>");
			});
			$("#province").find("ul").html(html.join(""));
			cooperation.selClick("province");
		}, false);
		
		$(document).click(function(){
			$(".inp-select-list").hide();
		});
	},
	//加载城市下拉框
	initCountry: function(province){
		Invoker.async("CacheController", "getAttrOrSubAttr", {code: "REGION_AREA", parent_attr_value: province}, function(data){
			if(!$.isArray(data) || data.length < 1){
				return;
			}
			
			var html = [];
			$.each(data, function(i, attr){
				html.push("<li class='inp-select-item' value='" + attr.attr_value + "'>" + attr.attr_value_name + "</li>");
			});
			$("#country").find("ul").html(html.join(""));
			$("label[name=country_label]").text("请选择城市");
			$("input[name=country]").val("");
			cooperation.selClick("country");
		}, false);
	},
	//下拉事件
	selClick: function(id){
		$("#" + id).find(".inp-select-tit").click(function(e){//div单击事件
			e.stopPropagation();
			$("#" + id).find(".inp-select-list").show();
		});
		
		$("#" + id).find(".inp-select-item").click(function(e){//下拉框单击事件
			$("#" + id).find(".inp-select-list").hide();
			$("#" + id).find("label").text($(this).text());
			$("input[name=" + id + "]").val($(this).attr("value"));
			if(id == "province"){
				cooperation.initCountry($(this).attr("value"));
			}
		});
	}
 };
 
 $(function(){
	 cooperation.init();
 });
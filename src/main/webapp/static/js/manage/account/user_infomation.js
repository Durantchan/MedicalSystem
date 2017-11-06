var info = {
		//初始化
		init:function(){
			var divMask = "<div class='divMask' style='position: absolute; width: 100%; height: 100%; left: 0px; top: 0px; background: #e8e8e8; opacity: 0; filter: alpha(opacity=0)'> </div>";
			$(".from-fill-table").append(divMask);	
			//按钮事件
			$(".edit-btn").click(this.editBtnClick);
			$(".submit-btn").click(this.submitBtnClick);
			$(".cancel-btn").click(this.cancelBtnClick);
			$("#province").click();
			$(".submit-btn").hide();
			$("input").placeholder();
			this.loadUserInfo();
		},
		//编辑按钮
		editBtnClick:function(){
			$(this).hide();
			$(".submit-btn").show();
			$(".cancel-btn").text("取消");
			$(".main-box").find(".divMask").remove();
		},
		//保存按钮
		submitBtnClick:function(){
			var user_type_id = "";
			Invoker.sync("LoginController", "getUserType", {}, function(result){
				if(result.res_code == "00000"){
					user_type_id = result.result;
				}
			});
			
			var checkAttrs = ["nick_name", "email"];
			if(user_type_id == "1001"){
				checkAttrs.push("contact_name", "contact_mobile", "contact_phone", "province", "country", "company_desc");
			}
			
			if(!info.validateInfo(checkAttrs, user_type_id)){
				return;
			}
			
			var checkArr =["nick_name", "email", "province","country", "address"];
			if(user_type_id == "1001"){
				checkArr.push("contact_name", "contact_mobile", "contact_phone", "company_desc");
			}
			var userAttr = info.checkExist(checkArr);
			if(userAttr){
				Invoker.async("UserPersonalInfoController","updateUserInfomation",userAttr,function(data){
					if(data.res_code=="00000"){
						data.res_message = "用户资料编辑成功";
						info.cancelEdit();
						$(".main-box").find("input").each(function(i){
							$(this).attr("attr_value",$(this).val());
						});
						$("label[name=province]").attr("attr_value",$("label[name=province]").attr("value"));
						$("label[name=country]").attr("attr_value",$("label[name=country]").attr("value"));
					}
					Utils.alert(data.res_message);
				});
			}else{
				Utils.alert("用户资料编辑成功");
				info.cancelEdit();
			}
		},
		
		//判断是否有新增或者修改
		checkExist:function(arr){
			var attrInfo = {};
			var modify = false;
			$.each(arr,function(i,name){
				if(name=="province"||name=="country"){
					if($("label[name="+name+"]").attr("value")!=$("label[name="+name+"]").attr("attr_value")){
						modify = true;
						attrInfo[name]=$("label[name="+name+"]").attr("value");
					}
				}else{
					if($("*[name="+name+"]").val()!=$("*[name="+name+"]").attr("attr_value")){
						if($("*[name="+name+"]").attr("attr_value")!=undefined){
							attrInfo[name]=$("*[name="+name+"]").val();
							modify = true;
						}else if($("*[name=address]").val()){
							attrInfo[name]=$("*[name="+name+"]").val()+"_ADD";
							modify = true;
						}
					}
				}
			});
			return modify? attrInfo:null;
		},
		
		//校验必填信息
		validateInfo:function(arr, user_type_id){
			var pass = true;
			$.each(arr, function(i, name){
				var value;
				if(name == "province" || name == "country"){
					value = $("label[name=" + name + "]").attr("value");
				}
				else{
					value = $("*[name=" + name + "]").val();
				}
				if(!value){
					var message = $("*[name=" + name + "]").closest("td").prev().text() + "不能为空";
					layer.tips(message, "*[name=" + name + "]", {tipsMore: true});
					pass = false;
				}
			});
			
			//校验邮箱
			var email = $("input[name=email]").val();
			if(email && !Utils.isEmail(email)){
				layer.tips("邮箱格式不正确", "input[name=email]", {tipsMore: true});
				pass = false;
			}
			
			if(user_type_id == "1001"){
				//校验联系手机
				var contact_mobile = $("input[name=contact_mobile]").val();
				if(contact_mobile && !Utils.checkPhoneNumber(contact_mobile)){
					layer.tips("联系手机格式不正确", "input[name=contact_mobile]", {tipsMore: true});
					pass = false;
				}
				
				//校验企业联系电话
				var contact_phone = $("input[name=contact_phone]").val();
				var reg = /^\d{3}-\d{8}|\d{4}-\d{7}$/;
				if(contact_phone && !reg.test(contact_phone)){
					layer.tips("企业联系电话格式不正确", "input[name=contact_phone]", {tipsMore: true});
					pass = false;
				}
			}
			
			return pass;
		},
		
		//取消关闭按钮
		cancelBtnClick:function(){
			if(!$(".submit-btn").is(":visible")){//关闭页面
				$("#main_warp").load("home/home.html");
				$(".crumb-nav").html("");
				return ;
			}
			
			layer.confirm('是否退出现正在编辑的信息？', {btn: ['确定','取消']}, function(index){
				$(".main-box").find("input,textarea").each(function(i){//还原文本框输入
					$(this).val($(this).attr("attr_value"));
				});
				//还原省份城市
				var proVal = $("label[name=province]").attr("attr_value");
				var proName =proVal? $("li[value="+proVal+"]").text():"请选择省份";
				$("label[name=province]").text(proName).attr("value",proVal);
				info.initCountry(proVal,$("label[name=country]").attr("attr_value"));
				$(".inp-select-list").hide();
				info.cancelEdit();
				layer.close(index);
			});
		},
		
		//取消编辑
		cancelEdit:function(){
			var divMask = "<div class='divMask' style='position: absolute; width: 100%; height: 100%; left: 0px; top: 0px; background: #e8e8e8; opacity: 0; filter: alpha(opacity=0)'> </div>";
			$(".main-box").append(divMask);	
			$(".edit-btn").show();
			$(".submit-btn").hide();
			$(".cancel-btn").text("关闭");
		},
		
		
		//加载化用户信息
		loadUserInfo:function(){
			Invoker.async("UserPersonalInfoController","loadUserInfomation",null,function(data){
				if(data.res_code=="00000"){
					$("strong[name=user_name]").text($(".nav-login-tit").text());
					$.each(data.result,function(i,attr){
						if(attr.attr_field=="province"||attr.attr_field=="country"){
							$("label[name="+attr.attr_field+"]").attr("value",attr.attr_value).attr("attr_value",attr.attr_value);
						}else{
							$("*[name="+attr.attr_field+"]").val(attr.attr_value).attr("attr_value",attr.attr_value);//.attr("value",attr.attr_value);
						}
					});
					info.initProvince($("label[name=province]").attr("attr_value"),$("label[name=country]").attr("attr_value"));
				}else if(data.res_code=="40001"){
					Utils.alert("用户未登录,请先登录");
					window.location.href="login.html";
				}
			});
		},
		
		
		//加载省份下拉框
		initProvince:function(province,country){
			Invoker.async("CacheController", "getAttrOrSubAttr", {code:'REGION_PRIVINCE'}, function(data){
				if(!data||data.length<1) return;
				var html = [];
				$.each(data,function(i,attr){
					html.push("<li class='inp-select-item' value='"+attr.attr_value+"'>"+attr.attr_value_name+"</li>");
				});
				$("#province").find("ul").html(html.join(""));
				if(province){
					$("label[name=province]").text($("#province").find("li[value="+province+"]").text());
				}else{
					$("label[name=province]").text("请选择省份");
				}
				info.selClick("province");
			});
			this.initCountry(province,country);
			
			$(document).click(function(){
				$(".inp-select-list").hide();
			});
		},
		
		//加载城市下拉框
		initCountry:function(province,country){
			if(!province){
				$("label[name=country]").text("请选择城市").attr("value","");
				return;
			}
			Invoker.async("CacheController", "getAttrOrSubAttr", {code:'REGION_AREA',parent_attr_value:province}, function(data){
				if(!data||data.length<1) return;
				var html = [];
				$.each(data,function(i,attr){
					html.push("<li class='inp-select-item' value='"+attr.attr_value+"'>"+attr.attr_value_name+"</li>");
				});
				$("#country").find("ul").html(html.join(""));
				if(country){
					$("label[name=country]").text($("#country").find("li[value="+country+"]").text()).attr("value",country);
				}else{
					$("label[name=country]").text("请选择城市").attr("value","");
				}
				info.selClick("country");
			});
		},
		//下拉事件
		selClick:function(id){
			$("#"+id).find(".inp-select-tit").click(function(e){//div单击事件
				e.stopPropagation();
				$("#"+id).find(".inp-select-list").show();
			});
			$("#"+id).find(".inp-select-item").click(function(){//下拉框单击事件
				$("#"+id).find(".inp-select-list").hide();
				$("#"+id).find("label").text($(this).text()).attr("value",$(this).attr("value"));
				if(id=="province"){
					if($("label[name=province]").val()!=$(this).attr("value")){
						info.initCountry($(this).attr("value"),null);
					}
				}
			});
		}
}

info.init();

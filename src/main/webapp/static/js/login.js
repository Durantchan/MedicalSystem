/**
 * 登录
 */
var login = {
	/**初始化*/
	init: function(){
		
		$("div[name=vericode]").hide();
		$("#user_name").placeholder();
		$("#password").placeholder();
		$("#verification_code").placeholder();
		
		$("#btn_login").click(function(){
			login.login();
		});
		
		$(".login-code-img").click(function(){
			login.refreshCode();
		});
		
		$("#btn_register").click(function(){
			window.location.href = "register/register.html";
		});
		
		$("#user_name").blur(function(){
			login.initCode();
		});
	},
	initCode : function(){
		var param = {};
		param.user_name = $.trim($("#user_name").val());
		Invoker.async("LoginController", "checkUserFail",param,function(reply){
			if (reply && reply.result == 1)
			{
				login.refreshCode();
				$("div[name=vericode]").show();
			}
		});
	},
	/**刷新验证码*/
	refreshCode: function(){
		$("div[name=vericode]").show();
		$("#code").attr("src", Utils.getContextPath() + "/verificationCode/generateCode.do?" + Math.random());
	},
	/**登录校验*/
	check: function(){
		var flag = true;
		var user_name = $.trim($("#user_name").val());
		var password = $.trim($("#password").val());
		var verification_code = $.trim($("#verification_code").val());
		
		if(!user_name){
			layer.tips("用户名或手机号码不能为空", "#user_name", {tips: [4, "#3595CC"], tipsMore: true});
			flag = false;
		}else{
			var reg = /^[0-9a-zA-Z_]*$/g;
			if(!reg.test(user_name)){
				layer.tips("用户名或手机号码只能由数字、字母、下划线组合成，请确认", "#user_name", {tips: [4, "#3595CC"], tipsMore: true});
				flag = false;
			}
		}
		
		if(!password){
			layer.tips("密码不能为空", "#password", {tips: [4, "#3595CC"], tipsMore: true});
			flag = false;
		}
		
		if(!verification_code && $("div[name=vericode]").css("display")!=="none"){
			layer.tips("验证码不能为空", "#verification_code", {tips: [4, "#3595CC"], tipsMore: true});
			flag = false;
		}
		
		return flag;
	},
	/**登录*/
	login: function(){
		if(!login.check()) return;
		var user_name = $.trim($("#user_name").val());
		var password = $.trim($("#password").val());
		var verification_code = $.trim($("#verification_code").val());
		
		var params = {};
		params.user_name = user_name;
		params.password = md5(password).toUpperCase();
		params.verification_code = verification_code;
		Invoker.async("LoginController", "login", params, function(result){
			var res_code = result.res_code;
			var res_message = result.res_message;
			
			if(res_code == "00000"){
				var is_need_pwd_notice = result.result.is_need_pwd_notice;
				if(is_need_pwd_notice == false){
					Utils.alert("尊敬的客户，您的密码已超过90天未更新，为了保障信息安全，请您及时更新密码。", 
					function(){
						window.location.href = "index.html";
					});
				}else{
					window.location.href = "index.html";
				}
			}
			else{
				if(res_code == "40011" || res_code == "40012"){
					//验证码提示信息
					layer.tips(res_message, "#verification_code", {tips: [4, "#3595CC"], tipsMore: true});
					login.refreshCode();
					return;
				}
				
				if(res_code == "40013" || res_code == "40014" || res_code == "40004"){
					//用户名提示信息
					layer.tips(res_message, "#user_name", {tips: [4, "#3595CC"], tipsMore: true});
					login.refreshCode();
					return;
				}
				
				if(res_code == "40015" || res_code == "40016"){
					//密码提示信息
					layer.tips(res_message, "#password", {tips: [4, "#3595CC"], tipsMore: true});
					login.refreshCode();
					return;
				}
			}
		});
	}
};

$(function(){
	login.init();
});
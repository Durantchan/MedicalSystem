/**
 * 用户注册
 */
var register = {
	/**初始化**/
	init: function(){
		$("#user_name").placeholder();
		$("#mobile_phone").placeholder();
		$("#password").placeholder();
		$("#confirm_password").placeholder();
		
		$("#btn_login").click(function(){
			window.location.href = "../login.html";
		});
		
		$("#btn_register").click(function(){
			register.register();
		});
	},
	/**注册*/
	register: function(){
		var user_name = $.trim($("#user_name").val());
		var mobile_phone = $.trim($("#mobile_phone").val());
		var password = $.trim($("#password").val());
		if(password){
			if(password.length < 6){
				layer.tips("密码长度不能小于6位", "#password", {tipsMore: true});
				return;
			}
			
			password = md5(password).toUpperCase();
		}
		var confirm_password = $.trim($("#confirm_password").val());
		if(confirm_password){
			confirm_password = md5(confirm_password).toUpperCase();
		}
		
		var params = {};
		params.user_name = user_name;
		params.mobile_phone = mobile_phone;
		params.password = password;
		params.confirm_password = confirm_password;
		
		Invoker.async("UserRegisterController", "userRegister", params, function(result){
			if("00000" != result.res_code){
				var checkMsg = result.result;
				for(var a in checkMsg){
					layer.tips(checkMsg[a], "#" + a, {tipsMore: true});
				}
			}
			else{
				layer.alert("用户注册成功，3秒后将会自动跳转到登录页面", {
					skin: "layui-layer-lan",
					time: 3000,
					end: function(){
						window.location.href = "../login.html";
					}
				});
			}
		});
	}
};

$(function(){
	register.init();
});

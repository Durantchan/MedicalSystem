 var password = {
		 //初始化按钮事件
		 initBtn:function(){
			 $("input").placeholder();
			 $(".submit-btn").click(this.submitBtnClick);
			 $(".cancel-btn").click(this.cancelBtnClick);
		 },
		 //提交按钮
		 submitBtnClick:function(){
			 if(!password.validateText()) return;
			 
			 var params = {password:md5($("#password_old").val()).toUpperCase(),new_password:md5($("#password_new1").val()).toUpperCase()};
			 Invoker.async("UserPersonalInfoController","modifyPassword",params,function(data){
				 if(data.res_code=="00000"){
					 Utils.alert("密码修改成功，下次登录请用新密码");
					 password.cancelBtnClick();
				 }else{
					layer.tips(data.res_message, "#password_old", {tipsMore: true});
				 }
			 });
			 
		 },
		 //取消按钮
		 cancelBtnClick:function(){
			$("#main_warp").load("home/home.html");
			$(".crumb-nav").html("");
			 
		 },
		 
		 //校验输入密码
		 validateText:function(){
			if(!$("#password_old").val()){
				layer.tips("密码不能为空", "#password_old", {tipsMore: true});
				return false;
			}
			if(!$("#password_new1").val()){
				layer.tips("新密码不能为空", "#password_new1", {tipsMore: true});
				return false;
			}else if($("#password_new1").val().length<4){
				layer.tips("新密码长度要大于4个字符", "#password_new1", {tipsMore: true});
				return false;
			}else if($("#password_old").val()==$("#password_new1").val()){
				layer.tips("新旧密码一致,未修改", "#password_new1", {tipsMore: true});
				return false;
			}
			if(!$("#password_new2").val()){
				layer.tips("新密码不能为空", "#password_new2", {tipsMore: true});
				return false;
			}else if($("#password_new1").val()!=$("#password_new2").val()){
				layer.tips("两次新密码不一致", "#password_new2", {tipsMore: true});
				return false;
			}
			return true;
		 }
};
password.initBtn();
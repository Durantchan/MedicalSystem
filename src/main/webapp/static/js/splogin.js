var verifyCorrectCode = 0;
/**
 * 登录
 */
var splogin = {

	/** 初始化 */
	init : function() {

		var me = this;
		me.initDate();
		
		$("#btn_login").click(function() {
			splogin.login();
		});

		// 跳转到流量查询页面
		$("#sp_login_btn").click(function() {
			splogin.servicePasswordLogin();
		});

		// 跳转到充值页面
		$("#btn_recharge").click(function() {
			
			window.open("http://shop.10086.cn/i/?f=rechargeinterofth&c=70");
			
		});

		// 换一张验证码
		$("#changeCode").click(function() {
			// me.reloadVerifyCode();
		});

		// 获取验证码
		$("#getCode").click(function() {
			// 先验证用户名密码
			if (!splogin.checkUser()) {
				return;
			}
			// 存在正确再发送短信验证码
			splogin.sendCode();
		});

		// 免登录流量查询登录按钮
		$("#btn_query_flow")
			.click(
					function() {
						var url = "https://openac.sh.chinamobile.com/open/access/oauth/thirdparty.html?"+
						"app_code=A0007777&callback=https://211.136.110.102:8084/iotportal/business_query/nologin_query_flow.html";
						var options = {
							title : "选择角色",
							width : "520px",
							height : "450px",
							autoClose : false
						};
						splogin.layerOpen("服务密码登录",url,null,"500","500");
					//	splogin.ajax_submit();

					});

		$("#btn_register").click(function() {
			window.location.href = "register/register.html";
		});

		// $("#user_name").blur(function(){
		// splogin.initCode();
		// });

		$("#btn_query_flow").click(function() {
			$("#sploginModal").modal('show');
		});

		// 键盘事件Enter登录
		$(window).keydown(function(e) {
			if (e.keyCode == "13") {
				$("#btn_login").focus().click();
			}
		});

	},

	layerOpen : function(title, pageUrl, endFun,height,width) {
        var me = this;
        height = height || "450"; //默认高度,宽带
        width = width || "520";
        
        layer.open({
            type : 2,
            title : title,
            // skin : "layui-layer-molv",
            fix : false,
            maxmin : true,
            area : [ width+"px", height+"px" ],
            content :  pageUrl,
            end : function() {
                if (null == endFun || undefined == endFun
                        || typeof (endFun) != "function")
                    return;
                endFun.apply(this);
            }
        });
    },

	initDate : function() {
		var array = new Array("日", "一", "二", "三", "四", "五", "六");
		var today = new Date();
		$('#today').text(
				(today.getMonth() * 1 + 1) + "月" + today.getDate() + "日");
		$('#this_week').text("星期" + array[today.getDay()]);
		$(".now_date").show();
	},

	/** 免登录查询流量登录 */
	servicePasswordLogin : function() {
		if (!splogin.checkServiceLogin())
			return;
		var user_name = $.trim($("#phoneNumber").val());
		var password = $.trim($("#servicePassword").val());
		// var verification_code = $.trim($("#verification_code").val());

		var params = {};
		params.user_name = user_name;
		params.password = md5(password).toUpperCase();

		// window.location.href = "business_query/nologin_query_flow.html";
		// window.location.href = "cust/custDetail.html";
		/*
		 * Invoker.async("SPUserController", "spUserLogin", params,
		 * function(result){ var res_code = result.res_code; var res_message =
		 * result.res_message;
		 * 
		 * if(res_code == "00000"){ window.location.href =
		 * "business_query/nologin_query_flow.html"; } else{ if(res_code ==
		 * "40011" || res_code == "40012"){ //验证码提示信息 layer.tips(res_message,
		 * "#verification_code", {tips: [4, "#3595CC"], tipsMore: true});
		 * splogin.refreshCode(); return; }
		 * 
		 * if(res_code == "40013" || res_code == "40014" || res_code ==
		 * "40004"){ //用户名提示信息 layer.tips(res_message, "#user_name", {tips: [4,
		 * "#3595CC"], tipsMore: true}); splogin.refreshCode(); return; }
		 * 
		 * if(res_code == "40015" || res_code == "40016"){ //密码提示信息
		 * layer.tips(res_message, "#password", {tips: [4, "#3595CC"], tipsMore:
		 * true}); splogin.refreshCode(); return; } } });
		 */
	},

	/** 服务密码登录校验 */
	checkServiceLogin : function() {
		var flag = true;
		var phoneNumber = $.trim($("#phoneNumber").val());
		var servicePassword = $.trim($("#servicePassword").val());
		// var verification_code = $.trim($("#verification_code").val());

		if (!phoneNumber) {
			layer.tips("手机号码不能为空", "#phoneNumber", {
				tips : [ 4, "#3595CC" ],
				tipsMore : true
			});
			flag = false;
		} else {
			if (!Utils.checkPhoneNumber(phoneNumber)) {
				layer.tips("请填写正确的手机号码", "#phoneNumber", {
					tips : [ 4, "#3595CC" ],
					tipsMore : true
				});
				flag = false;
			}
		}

		if (!servicePassword) {
			layer.tips("密码不能为空", "#servicePassword", {
				tips : [ 4, "#3595CC" ],
				tipsMore : true
			});
			flag = false;
		}

		return flag;
	},
	// 重载验证码
	/*
	 * reloadVerifyCode:function(){ var timenow = new Date().getTime(); var
	 * d=Math.random()*(9999-1000)+1000; verifyCorrectCode=parseInt(d);
	 * document.getElementById("safecode").src=Utils.getContextPath()
	 * +"/servlet/SecurityCodeServlet?verifyCorrectCode="+verifyCorrectCode; },
	 */

	/** 登录校验 */
	check : function() {
		var flag = true;
		var user_name = $.trim($("#user_name").val());
		var password = $.trim($("#password").val());
		var verifyCode = $.trim($("#verifyCode").val());
		// var verification_code = $.trim($("#verification_code").val());

		if (!user_name) {
			layer.tips("用户名或手机号码不能为空", "#user_name", {
				tips : [ 4, "#3595CC" ],
				tipsMore : true
			});
			flag = false;
		} else {
			var reg = /^[0-9a-zA-Z_]*$/g;
			if (!reg.test(user_name)) {
				layer.tips("用户名或手机号码只能由数字、字母、下划线组合成，请确认", "#user_name", {
					tips : [ 4, "#3595CC" ],
					tipsMore : true
				});
				flag = false;
			}
		}

		if (!password) {
			layer.tips("密码不能为空", "#password", {
				tips : [ 4, "#3595CC" ],
				tipsMore : true
			});
			flag = false;
		}

		// if(!verification_code &&
		// $("div[name=vericode]").css("display")!=="none"){
		// layer.tips("验证码不能为空", "#verification_code", {tips: [4, "#3595CC"],
		// tipsMore: true});
		// flag = false;
		// }
//1026
/*		if (!verifyCode) {
			layer.tips("验证码不能为空", "#verifyCode", {
				tips : [ 4, "#3595CC" ],
				tipsMore : true
			});
			flag = false;
		}*/
		return flag;
	},

	/** 用户名校验* */
	checkUser : function() {
		var flag = true;
		var user_name = $.trim($("#user_name").val());
		// var password = $.trim($("#password").val());
		if (!user_name) {
			layer.tips("用户名不能为空", "#user_name", {
				tips : [ 4, "#3595CC" ],
				tipsMore : true
			});
			flag = false;
		} else {
			var reg = /^[0-9a-zA-Z_]*$/g;
			if (!reg.test(user_name)) {
				layer.tips("用户名或手机号码只能由数字、字母、下划线组合成，请确认", "#user_name", {
					tips : [ 4, "#3595CC" ],
					tipsMore : true
				});
				flag = false;
			}
		}
		return flag;
	},

	

	/** 登录 */
	login : function() {

		var me = this;
		/*
		 * if(!me.check_Browser()){
		 * Utils.alert("当前IE版本过低，使用本系统可能会出现异常，暂时停止服务。建议使用IE9或更高级版本IE、
		 * firefox、chrome"); return ; }
		 */
		if (!splogin.check())
			return;

		var user_name = $.trim($("#user_name").val());
		var password = $.trim($("#password").val());
		var verification_code = $.trim($("#verifyCode").val());

		// base64加密
		// alert($.base64.encode(user_name));
		// alert($.base64.encode(password));
		var params = {};
		/*
		 * params.user_name = user_name; params.password=password;
		 */

		params.user_name = user_name;
		params.password = $.base64.encode(password);

		// params.password = md5(password).toUpperCase();
		params.verification_code = verification_code;
		Invoker.async("SPUserController", "spUserLogin", params, function(
				result) {
			var res_code = result.res_code;
			var res_message = result.res_message;
			if (res_code == "00000") {
				var is_need_pwd_notice = result.result.is_need_pwd_notice;
				checked = true;
				if(is_need_pwd_notice == true){
					Utils.alert("尊敬的客户，您的密码已超过90天未更新，为了保障信息安全，请您及时更新密码。", 
					function(){
						window.location.href = "index.html";
					});
				}else{
					Utils.clear();
					window.location.href = "index.html";
				}
			} else {
				if (res_code == "40011" || res_code == "40012" || res_code == "40020" || res_code == "40021") {
					// 验证码提示信息
					layer.tips(res_message, "#verifyCode", {
						tips : [ 4, "#3595CC" ],
						tipsMore : true
					});
					// splogin.reloadVerifyCode();
					return;
				}

				if (res_code == "40013" || res_code == "40014"
						|| res_code == "40004" || res_code == "40018") {
					// 用户名提示信息
					layer.tips(res_message, "#user_name", {
						tips : [ 4, "#3595CC" ],
						tipsMore : true
					});
					// splogin.reloadVerifyCode();
					return;
				}

				if (res_code == "40015" || res_code == "40016") {
					// 密码提示信息
					layer.tips(res_message, "#password", {
						tips : [ 4, "#3595CC" ],
						tipsMore : true
					});
					
					
					// splogin.reloadVerifyCode();
					return;
				}

				if (res_code == "40022" || res_code == "40023") {
					Utils.alert(res_message);
					return;
				}
				if (res_code == "40024" ) {
					Utils.alert(res_message);
					return;
				}
			}
		});
	},
	// 校验浏览器的类型、版本
	check_Browser : function() {
		var me = this;
		var userAgent = navigator.userAgent;
		var browser;
		var version;
		var browserMatch = me.uaMatch(userAgent.toLowerCase());
		if (browserMatch.browser) {
			browser = browserMatch.browser;
			version = browserMatch.version;
		}
		// console.log(version);
		if (browser == 'IE' && version < 9.0) {
			return true;
		}
		return true;
	},
	uaMatch : function(ua) {
		var rMsie = /(msie\s|trident.*rv:)([\w.]+)/, rFirefox = /(firefox)\/([\w.]+)/, rOpera = /(opera).+version\/([\w.]+)/, rChrome = /(chrome)\/([\w.]+)/, rSafari = /version\/([\w.]+).*(safari)/;

		var match = rMsie.exec(ua);
		if (match != null) {
			return {
				browser : 'IE' || "",
				version : match[2] || "0"
			};
		}
		var match = rFirefox.exec(ua);
		if (match != null) {
			return {
				browser : match[1] || "",
				version : match[2] || "0"
			};
		}
		var match = rOpera.exec(ua);
		if (match != null) {
			return {
				browser : match[1] || "",
				version : match[2] || "0"
			};
		}
		var match = rChrome.exec(ua);
		if (match != null) {
			return {
				browser : match[1] || "",
				version : match[2] || "0"
			};
		}
		var match = rSafari.exec(ua);
		if (match != null) {
			return {
				browser : match[2] || "",
				version : match[1] || "0"
			};
		}

		if (match != null) {
			return {
				browser : "",
				version : "0"
			};
		}
	},

	/** 根据用户名的手机号送短信验证码 */
	sendCode : function() {
		if (!splogin.checkUser())
			return;
		// 计时器
		var clock = '';
		var nums = 120;
		var dConeJq = $("#getCode");

		var user_name = $.trim($("#user_name").val());

		var params = {};
		params.user_name = user_name;
		Invoker.async("SPUserController", "querySPUserNumAndSendCode", params,
				function(result) {
					var res_code = result.res_code;
					var res_message = result.res_message;

					if (1 == 1) {/* res_code == "00000" */
						// 动态验证码计时器
						dConeJq.attr('disabled', true);
						clock = setInterval(function doLoop() {
							nums--;
							if (nums > 0) {
								dConeJq.html("重新获取(" + nums + "S)");
							} else {
								clearInterval(clock); // 清除js定时器
								dConeJq.attr('disabled', false);
								dConeJq.html("点击获取");
								nums = 120; // 重置时间
							}
						}, 1000); // 一秒执行一次

						Utils.alert("短信验证码已发送至您的手机号!");
					} else {

						if (res_code == "40013" || res_code == "40014"
								|| res_code == "40004" || res_code == "40018") {
							// 用户名提示信息
							layer.tips(res_message, "#user_name", {
								tips : [ 4, "#3595CC" ],
								tipsMore : true
							});
							return;
						}

						// if(res_code == "40015" || res_code == "40016"){
						// //密码提示信息
						// layer.tips(res_message, "#password", {tips: [4,
						// "#3595CC"], tipsMore: true});
						//					return;
						//				}
					}
				});
	},
	ajax_submit : function() {
			var url = "https://openac.sh.chinamobile.com/open/access/oauth/authorizeVerify.html?"+
					"appCode=A0007777&secret=LIpDwkV1yBxAQ2RDy++tqyaRMTIm2TdX&authorizeCode=2208668994753E81C59927187F7D2D5F";
    		var params = {};
			params.url = url;
			Invoker.async("CustMemController", "authorizeVerfy", params, function(result){
				if(result.res_code == "00000"){
					if(result.result.userPhone==null||result.result.userPhone==''){
						Utils.alert("请求错误！获取号码为空！");
						return;
					}
						var userPhone = result.result.userPhone;
						cust_info.loadCustInfo(userPhone);
				} else{
					Utils.alert("请求错误！");
					}
			});		
		/*	$.ajax({
    			
				url : url,
				dataType: "xml",
				data:"{}",
				type: "get",
				async: false,
				jsonp: "callbackparam", //服务端用于接收callback调用的function名的参数     
           		jsonpCallback: "success_jsonpCallback", //callback的function名称,服务端会把名称和data一起传递回来     
    			success : function(data) {
					Utils.alert("返回数据:--"+data);
					var obj = JSON.parse(data); 
				if(obj.errorCode!=null){
					Utils.alert("返回异常");
					return;
				}
				if(obj.result=="true"){
					
					cust_info.loadCustInfo(obj.userPhone);
				}else{
				Utils.alert(obj.res_message);
					
				}
					
    			},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
				var result = XMLHttpRequest.responseText;
				debugger;
				Utils.alert(XMLHttpRequest.responseText);
    			}
    		});*/
	
	}

};

$(function() {
	$.fn.myScroll = function(options){
		//默认配置
		var defaults = {
			speed:40,  //滚动速度,值越大速度越慢
			rowHeight:24 //每行的高度
		};
		
		var opts = $.extend({}, defaults, options),intId = [];
		
		function marquee(obj, step){
		
			obj.find("ul").animate({
				marginTop: '-=1'
			},0,function(){
				var s = Math.abs(parseInt($(this).css("margin-top")));
				if(s >= step){
					$(this).find("li").slice(0, 1).appendTo($(this));
					$(this).css("margin-top", 0);
				}
			});
		}
			
		this.each(function(i){
			var sh = opts["rowHeight"],speed = opts["speed"],_this = $(this);
			intId[i] = setInterval(function(){
				if(_this.find("ul").height()<=_this.height()){
					clearInterval(intId[i]);
				}else{
					marquee(_this, sh);
				}
			}, speed);

			_this.hover(function(){
				clearInterval(intId[i]);
			},function(){
				intId[i] = setInterval(function(){
					if(_this.find("ul").height()<=_this.height()){
						clearInterval(intId[i]);
					}else{
						marquee(_this, sh);
					}
				}, speed);
			});
		
		});
	}
	
	$("#iot_notice_ul").empty();
	Invoker.async("SPUserController", "queryIotNoticeList", '', function(result) {
		var res_code = result.res_code;
		var data = result.result;
		if(res_code == '00000' && data != ''){
		    for(var i=0; i<data.length; i++){
		    	var title = data[i].notice_title;
		    	if(title.length > 54){
		    		title = title.substring(0, 53) + "..."; 
		    	}
		    	var li_template = '<li class="notice-item"><p>'+
				'<a href="javascript:void(0);" class="a_blue" '+
		    	'title='+data[i].notice_title+'>'+
				title+'</a><span>'+data[i].create_date+'</span></p></li>';
		    	$("#iot_notice_ul").append(li_template);
		    }
		    $("div.notice-list").myScroll({speed:70, rowHeight:30});
		}
	});
	splogin.init();
});
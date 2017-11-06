var method = "";
var version = "";
var address = "";

$(function(){
	init();
	initAbility();
	initUrl();
});

function init(){
	$("#type").bind("change", function(){
		if("001" == $("#type").val()){
			showDefine();
		}
		else{
			showAuto();
		}
	});
	
	$("#testAbility").bind("click", testAbility);
	$("input[name=req_type]").bind("click", selProtocol);
}

/**
 * 显示自定义参数
 */
function showDefine(){
	$("#req_json").show();
	$("#req_json_default").hide();
}

/**
 * 显示动态参数
 */
function showAuto(){
	$("#req_json").hide();
	$("#req_json_default").show();
}

/**
 * 初始化能力
 */
function initAbility(){
	Utils.initSelect($("#type"), {code: "PARAMS_TYPE"});
	
	var ability_id = Utils.getUrlParams("id");
	if(ability_id){
		Invoker.async("AbilityApiDocController", "getAbility", ability_id, function(data){
			if(data){
				$("#ability_info").form("load", data);
				method = data.method;
				version = data.version;
				
				if("001" == $("#type").val()){
					showDefine();
				}
				else{
					showAuto();
				}
				
				loadAbilityRequest();
			}
			else{
				Utils.alert("能力不存在！");
			}
		});
	}
}

/**
 * 加载能力请求参数
 */
function loadAbilityRequest(){
	$("#tb_reqParams").html("");
	
	Invoker.async("AbilityApiDocController", "loadAbilityRequest", {method: method, version: version}, function(data){
		if(data){
			if($.isArray(data.keyList) && data.keyList.length > 0){
				var html = [];
				$.each(data.keyList, function(i, key){
					html.push("<tr>");
					html.push("<td>" + key + "</td>");
					html.push("<td><input type='text' id='txt_" + key + "'/></td>");
					html.push("</tr>");
				});
				$("#tb_reqParams").html(html.join(""));
			}
			
			if(data.body_content){
				$("#json_val").val(data.body_content);
			}
		}
	});
}

/**
 * 协议类型改变事件
 */
function selProtocol(){
	var protocol = $("input[name=req_type]:checked").val();
	var url = address + "/rest";
	
	if("rest" == protocol){
		$("#req_soap").hide();
		$("#params_type").show();
		
		if("001" == $("#type").val()){
			$("#req_json").show();
		}
		else{
			$("#req_json_default").show();
		}
	}
	else{
		$("#params_type").hide();
		$("#req_json").hide();
		$("#req_json_default").hide();
		
		if("soap" == protocol){
			url = address + "/soap/" + method + "/" + version + "?access_token=${access_token}";
			$("#head_info").html("<span style='display:inline-block;text-align:center;'>请求报文<br>(完整的SOAP报文)</span>");
		}
		else if("http" == protocol){
			url = address + "/http/" + method + "/" + version + "?access_token=${access_token}";
			$("#head_info").html("请求报文：");
		}
		$("#req_soap").show();
	}
	
	$("input[name=url]").val(url);
}

/**
 * 测试能力
 */
function testAbility(){
	var flag = checkAbilityInfo();
	if(flag){
		Utils.alert(flag);
		return;
	}
	
	var params = {};
	params.ability_id = $("input[name=ability_id]").val();
	params.method = $("input[name=method]").val();
	params.version = $("input[name=version]").val();
	params.url = $("input[name=url]").val();
	params.protocol = $("input[name=req_type]:checked").val();
	params.access_token = $("input[name=access_token]").val();
	if(params.access_token == "系统默认"){
		params.access_token = "";
	}
	
	if(params.protocol == "rest"){
		if("001" == $("#type").val()){
			var body_content = $("#json_val").val();
			try{
				$.parseJSON(body_content);
			}
			catch(e){
				Utils.alert("自定义参数格式错误，请以json格式输出参数，如：{\"acc_nbr\":\"13378019035\",\"lan_code\":\"0731\"}");
				return;
			}
			
			params.body_content = body_content;
		}
		else{
			var content = {};
			//获取动态请求参数
			Invoker.sync("AbilityApiDocController", "getContentKeys", {method: method, version: version}, function(data){
				if($.isArray(data)){
					$.each(data, function(i, key){
						var val = $("#txt_" + key).val();
						content[key] = val;
					});
				}
			});
			
			params.content = content;
		}
	}
	else{
		params.body_content = $("#request_context").val();
	}
	
	Invoker.async("AbilityApiDocController", "testAbility", params, function(data){
		$("#response").val(data.result);
	});
	
}

/**
 * 能力测试参数校验
 * @returns {String}
 */
function checkAbilityInfo(){
	if(!$("input[name=method]").val()){
		return "请输入方法！";
	}
	if(!$("input[name=version]").val()){
		return "请输入版本！";
	}
	if(!$("input[name=url]").val()){
		return "请输入访问地址！";
	}
	
	return null;
}

/**
 * 获取配置的地址
 */
function initUrl(){
	Invoker.async("AbilityApiDocController", "getAddress", null, function(data){
		if(data){
			address = data;
			var url = address + "/rest";
			$("#ability_info input[name='url']").val(url);
		}
	});
}

/**
 * access_token自定义
 */
function setDefind(){
	$("#ability_info input[name='access_token']").prop("disabled", false);
	$("#ability_info input[name='access_token']").val("");
	$("#ability_info input[name='access_token']").css("width", "71%");
	
	$("#defind").hide();
	$("#default").show();
}

/**
 * access_token系统默认
 */
function setDefaulf(){
	$("#ability_info input[name='access_token']").prop("disabled", true);
	$("#ability_info input[name='access_token']").val("系统默认");
	$("#ability_info input[name='access_token']").css("width", "74%");
	
	$("#defind").show();
	$("#default").hide();
}
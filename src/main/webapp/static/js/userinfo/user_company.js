/**************************企业开发者***************************/

$(function(){
	$("#user_company, #user_personal").click(function(){
		return Utils.pjax(this, index.relocate);
	});
	initSelect();
});

//初始化下拉框
function initSelect(){
	Utils.initSelect($('#province'),{code:'REGION_PRIVINCE'},'','请选择省市',null);
	$('#province').change(function(){
		if($(this).val()){
			Utils.initSelect($('#area'),{code:'REGION_AREA',parent_attr_value:$(this).val()},'','请选择区域',null);
		}
	});
}
var userCompany = {
		companySave: function(){
			var isAgm=$('#protocol').is(':checked');
			if(!Utils.checkTextNotNull(["nick_name","email","company_person","telephone_mobile","company_mobile","province","area","company_info","from","company_name","company_person_name","company_photo","auto_code"],
				["呢称","E-Mail","企业联系人","联系手机","企业联系电话","所有区域[省]","所有区域[市]","企业简介","获知来源","企业名称","法人姓名","营业执照","验证码"])){
				return false;
			}
			if(!isAgm){
				alert("请确认条款信息");
				return false;
			}
			if(!Utils.isEmail($("#email").val())){
				alert("请填写正确的邮箱");
				$("#email").focus();
				return false;
			}
			if(!Utils.match($("#telephone_mobile").val())){
				alert("请填写正确手机号码");
				$("#telephone_mobile").focus();
				return false;
			}
			//邮箱验证
			//联系电话
			$("#saveCompany").form("submit", {
				type: "POST",
				data: "Json",
				url: "UserPersonalInfoController/saveCompanyUser.do?type=company",
				success: function(data){
					if(data!=null && data!=""){
						var dataVal = JSON.parse(data);
						if(dataVal.res_code == "00000"){
							location.href = "index.html";
						}else if(dataVal.res_code == "40002"){
							alert("验证码输入错误");
							$("#auto_code").focus();
							return false;
						}else if(dataVal.res_code == "20001"){
							alert(dataVal.res_code+"-"+dataVal.res_message+"-系统错误");
							return false;
						}
					}
				},
				error:function(data){
					var dataVal = JSON.parse(data);
					alert(dataVal.res_code+"-"+dataVal.res_message);
				}
			});
		}
};

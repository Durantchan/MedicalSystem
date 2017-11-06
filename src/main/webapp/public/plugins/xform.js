/**
 * jq自定义form插件
 * 说明：
 * 1.后台校验，后台校验方法自定义，方法返回{字段定义的name值:校验出错信息} 这样的json对象。再调用xform的validate方法
 * 2.需要引入样式 public/css/style.css
 * form表单样例
 * <!--两行格式-->
 *<div class="col2-xs-12">
 *	<div class="col-xs-6">
 *		<div class="form-group ">
 *			<label class="col-sm-4 control-label">所属目录</label>
 *			<div class="col-sm-8">
 *				<div class="input-group input-group-sm input-group-minimal">
 *					<span class="input-group-addon">
 *						<a href="#"> <i class="fa fa-search"></i></a>
 *					</span>
 *					<input class="form-control" type="text" disabled="disabled">
 *				</div>											
 *			</div>
 *		</div>
 *	</div>
 *	<div class="col-xs-6">
 *		<div class="form-group">
 *			<label class="col-sm-4 control-label" for="field-1">适配器</label>
 *			<div class="col-sm-8">
 *					<select data-options="attr_code:'SERVICE_STATUS',blank_value:'-1',blank_name:'--请选择--'" style="display:none;"></select>
 *			</div>
 *		</div>
 *	</div>
 *</div>
 *<!--一行格式-->
 *<div class="col-xs-12">
 *	<div class="form-group">
 *		<label class="col-sm-2 control-label" >能力描述</label>
 *		<div class="col-sm-10">
 *			<textarea rows="3" class="form-control"></textarea>
 * 		</div>
 *	</div>
 *</div>
 */
(function($){
	$.fn.xform = function(options, params){
		var _self = this;
		if(typeof options == "string"){
			var method = $.fn.xform.methods[options];
			if($.isFunction(method)){
				return method(_self, params);
			}
		}
		return null;
	};
	
	$.fn.xform.methods = {
		getData: function(form){
			var data = {};
			$("input[type=hidden],input[type=text],input[type=password],input[type=radio],input[type=checkbox],select,textarea", form).each(function(){
				var name = $(this).attr("name");
				if(name){
					if($(this).is("input[type=radio]")){
						if(data[name] == undefined){
							data[name] = "";
						}
						
						if($(this).is(":checked")){
							data[name] = $(this).val();
						}
					}
					else if($(this).is("input[type=checkbox]")){
						if(!$.isArray(data[name])){
							data[name] = [];
						}
						
						if($(this).is(":checked")){
							data[name].push($(this).val());
						}
					}
					else{
						data[name]= $(this).val();
					}
				}
			});
			
			return data;
		},
		loadData: function(form, params){
			$.fn.xform.methods.clear(form);
			
			if(!params){
				return;
			}
			
			$.each(params, function(key, value){
				if(key){
					var ele = $("*[name=" + key + "]", form);
					if(ele.length > 0){
						if(ele.is("input[type=radio]")){
							ele.each(function(){
								if($(this).val() == value){
									$(this).prop("checked", true);
									return false;
								}
							});
						}
						else if(ele.is("input[type=checkbox]")){
							if($.isArray(value)){
								$.each(value, function(i, v){
									$("input[type=checkbox][name=" + key + "][value=" + v + "]", form).prop("checked", true);
								});
							}
						}
						else if(ele.is("select")){
							ele.val(value);
							if($.isFunction($.fn.xselect)){
								ele.each(function(){
									if($(this).is("select")){
										$(this).xselect("setValue", value);
									}
								});
							}
						}
						else if(ele.is(".datepicker")){

							ele.datepicker('setDate', new Date(value));
							ele.datepicker('update');
						}
						else{
							ele.val(value);
						}
					}
				}
			});
		},
		clearValidate: function(form){
			if($(".validate-has-error", form).length < 1){
				return;
			}
			$(".validate-has-error", form).removeClass("validate-has-error").find(".error-msg").remove();
		},
		validate: function(form, data){
			if(!data){
				return;
			}
			if($(".validate-has-error", form).length >= 1){
				$.fn.xform.methods.clearValidate(form);
			}
			$.each(data, function(key, value){
				var ele = $("*[name=" + key + "]", form);
				var parent = ele.closest(".form-group").find("div:first");
				parent = parent.length>0 ? parent:ele.closest("div");
				parent.append("<span class='error-msg'>" + value + "<span>").closest(".form-group").addClass("validate-has-error");
//				var target= ele.is(":visible") ? ele:parent.find("input:visible");
				ele.bind("change",function(){
					$(this).closest(".form-group").removeClass("validate-has-error").find(".error-msg").remove();
				});
				
			});
		},
		disable: function(form){
			$("input,select,textarea", form).prop("disabled", true);
			if($.isFunction($.fn.xselect)){
				$("select", form).xselect("disable");
			}
			$("a", form).prop("disabled", true).css({cursor: "default"});
		},
		//exclude:不可编辑的元素数组 array，可不传
		enable: function(form, exclude){
			$("input,select,textarea", form).prop("disabled",false);
			if($.isFunction($.fn.xselect)){
				$("select", form).xselect("enable");
			}
			$("a", form).prop("disabled", false).css({cursor: "pointer"});
			//某些元素依旧不可编辑
			if(!$.isArray(exclude) || exclude.length < 1){
				return ;
			}
			
			$.each(exclude, function(index, name){
				var ele = $("*[name=" + name + "]", form);
				if(ele.length > 0){
					ele.prop("disabled", true);
					
					if($.isFunction($.fn.xselect)){
						ele.each(function(){
							if($(this).is("select")){
								$(this).xselect("disable");
							}
						});
					}
					
					if(ele.is("a")){
						ele.css({cursor: "default"});
					}
				}
			});
		},
		clear: function(form){
			$("input[type=text],input[type=hidden],input[type=password], textarea", form).val("");
			$("input[type=radio]", form).prop("checked", false);
			$("input[type=checkbox]", form).prop("checked", false);
			$("select", form).find("option:first").prop("selected", true);
			if($.isFunction($.fn.xselect)){
				$("select", form).xselect("setValue", 0);
			}
		}
	};
})(jQuery);
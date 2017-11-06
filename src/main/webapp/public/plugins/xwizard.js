/**
 * css：
 * <link rel="stylesheet" type="text/css" href="../public/lib/xenon/css/bootstrap.css">
 * <link rel="stylesheet" type="text/css" href="../public/lib/xenon/css/xenon-core.css">
 * <link rel="stylesheet" type="text/css" href="../public/lib/xenon/css/xenon-forms.css">
 * js：
 * <script type="text/javascript" src="../public/lib/jquery.min.js"></script>
 * <script type="text/javascript" src="../public/lib/xenon/js/bootstrap.min.js"></script>
 * <script type="text/javascript" src="../public/lib/xenon/js/formwizard/jquery.bootstrap.wizard.js"></script>
 * 
 * html：
 * <div id="rootwizard" class="form-wizard">
 * 	<ul class="tabs">
 * 		<li class="active">
 * 			<a href="#tab1" data-toggle="tab">One</a>
 * 		</li>
 * 		<li>
 * 			<a href="#tab2" data-toggle="tab">Two</a>
 * 		</li>
 * 	</ul>
 * 	
 * 	<div class="progress-indicator">
 * 		<span></span>
 * 	</div>
 * 	
 * 	<div class="tab-content">
 * 		<!-- Tabs Content -->
 * 		<div class="tab-pane active" id="tab1">
 * 			This is first tab - 1
 * 		</div>
 * 		
 * 		<div class="tab-pane" id="tab2">
 * 			This is second tab - 2
 * 		</div>
 * 		
 * 		<!-- Tabs Pager -->
 * 		<ul class="pager wizard">
 * 			<li class="previous first">
 * 				<a href="javascript:void(0)">First</a>
 * 			</li>
 * 			<li class="previous">
 * 				<a href="javascript:void(0)">Previous</a>
 * 			</li>
 * 			
 * 			<li class="finish">
 * 				<a href="javascript:void(0)">Finish</a>
 * 			</li>
 * 			
 * 			<li class="next">
 * 				<a href="javascript:void(0)">Next</a>
 * 			</li>
 * 			<li class="next last">
 * 				<a href="javascript:void(0)">Last</a>
 * 			</li>
 * 		</ul>
 * 	</div>
 * </div>
 * 
 * 用法：
 * 1、初始化
 * $(".form-wizard").xwizard({onNext: function($activeTab, $navigation, index){
 * 
 * }});
 * 
 * 2、执行方法
 * $(".form-wizard").xwizard("show", 1);
 */
(function($){
	$.fn.xwizard = function(options){
		//执行方法
		if(typeof options == "string"){
			if(!this.data("bootstrapWizard")){
				//没初始化，不执行
				return null;
			}
			
			if($.isFunction(this.data("bootstrapWizard")[options])){
				var args = Array.prototype.slice.call(arguments, 1);
				if(args.length === 1){
					args.toString();
				}
				return this.data("bootstrapWizard")[options](args);
			}
			
			return null;
		}
		
		options = options || {};
		return this.each(function(){
			var _self = $(this);
			
			var tabs = _self.find("> .tabs > li");
			var progress = _self.find(".progress-indicator");
			var _index = _self.find("> ul > li.active").index();
			
			if(_index > 0){
				progress.css({width: _index / tabs.length * 100 + "%"});
				tabs.removeClass("completed").slice(0, _index).addClass("completed");
			}
			
			var onTabShow = null;
			if($.isFunction(options.onTabShow)){
				onTabShow = options.onTabShow;
				delete options.onTabShow;
			}
			
			var _options = $.extend({}, $.fn.xwizard.defaults, options);
			_options.onTabShow = function(activeTab, navigation, index){
				//进度条变化逻辑
				var pct = tabs.eq(index).position().left / tabs.parent().width() * 100;
				tabs.removeClass("completed").slice(0, index).addClass("completed");
				progress.css({width: pct + "%"});
				
				if($.isFunction(onTabShow)){
					onTabShow(activeTab, navigation, index);
				}
			};
			
			_self.bootstrapWizard(_options);
			_self.data("bootstrapWizard").show(_index);
			_self.find(".pager a").on("click", function(e){
				e.preventDefault();
			});
		});
	};
	
	//支持的方法名，参考jquery.bootstrap.wizard.js
	$.fn.xwizard.methods = {
		next: function(e){},
		previous: function(e){},
		first: function(e){},
		last: function(e){},
		finish: function(e){},
		back: function(){},
		currentIndex: function(){},
		firstIndex: function(){},
		lastIndex: function(){},
		getIndex: function(e){},
		nextIndex: function(){},
		previousIndex: function(){},
		navigationLength: function(){},
		activeTab: function(){},
		nextTab: function(){},
		previousTab: function(){},
		show: function(index){},
		disable: function(index){},
		enable: function(index){},
		hide: function(index){},
		display: function(index){},
		remove: function(args){}
	};
	
	//默认参数，on开头的为支持的事件方法
	$.fn.xwizard.defaults = $.extend({}, {
		tabClass: "",
		nextSelector: ".wizard li.next",
		previousSelector: ".wizard li.previous",
		firstSelector: ".wizard li.first",
		lastSelector: ".wizard li.last",
		finishSelector: ".wizard li.finish",
		backSelector: ".wizard li.back",
		onShow: function($activeTab, $navigation, index){},
		onInit: function($activeTab, $navigation, index){},
		onNext: function($activeTab, $navigation, index){},
		onPrevious: function($activeTab, $navigation, index){},
		onLast: function($activeTab, $navigation, index){},
		onFirst: function($activeTab, $navigation, index){},
		onFinish: function($activeTab, $navigation, index){},
		onBack: function($activeTab, $navigation, index){},
		onTabChange: function($activeTab, $navigation, currentIndex, nextTab){},
		onTabClick: function($activeTab, $navigation, currentIndex, clickedIndex, $clickedTab){},
		onTabShow: function($activeTab, $navigation, index){}
	});
})(jQuery);
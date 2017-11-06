/**
 * 基础父类
 * add by musoon
 */
(function(scope) {
    var BaseUtil = Base.extend({
        /**
         * 基础属性配置
         * 
         * @param config
         */
        constructor : function(config) {
            this.version = "1.0";
            this.config = {};
            
            // 应用上下文
            this.contextPath = "/AppCloud";
            
            // Rop地址
            this.infUrl = this.contextPath + "/appRouter";
            
            // 消息提示
            this.developerStr = "正在建设中，敬请期待！";
            
            // 页面传递参数对象
            this.pageParam = new Object();
            
            // 是否显示分页，默认没有显示
            this.pageShowFlag = false;
            
            // 默认分页参数
            // 显示第一页
            this.pageIndex = 1;
            // 每页10条记录
            this.pageSize = 10;
        },
        /**
         * 根据property从对象中获取对应value值
         * 
         * @param obj
         * @param key
         * @returns
         */
        getObjVal : function(obj, key) {
            var me = this;
            if (me.isEmpty(obj))
                return "";
            
            var v = obj[key];
            
            if (me.isEmpty(v))
                return "";
            return v;
        },
        /**
         * 判断对象or字符是否非空
         * 
         * @param str
         * @returns {Boolean}
         */
        isEmpty : function(str) {
            
            if (null == str || 'undefined' == str || '' === $.trim(str))
                return true;
            // if (typeof(str) == 'Array') {}
            return false;
        },
		appendElement: function($ulJQ, $liJQ, eleType) {
			var c = $ulJQ.children(eleType).size();
			if (0 == c) {
				$ulJQ.append($liJQ);
			} else {
				$ulJQ.children(eleType).last().after($liJQ);
			}
		},
		removeElement: function($ulJQ, eleType) {
			//第一个元素是复制用的，为方便处理，永远静态存在
			$ulJQ.children(eleType + ":gt(0)").each(function(i) {
				$(this).remove();
			});
		}   
    });
    window.BaseUtil = new BaseUtil();
}(window));

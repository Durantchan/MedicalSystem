package com.manage.dao;

import java.util.Map;

/**
 * 计算费用参数维护
 * @author Durantchan
 *
 */
public interface ParameterDao {
		//查找所有的参数
		public abstract Map findAllParameter();
		//查找单个参数
		public abstract Map findParameterBySingle(Map map);
		//增加参数信息
		public abstract void addNewParameter(Map map);
		//单个删除参数信息
		public abstract void deleteParameterBySingle(Map map);
		//批量删除参数信息
		public abstract void deleteParameterByPatch(Map map);
		//修改参数信息
		public abstract void updateParameter(Map map);
}

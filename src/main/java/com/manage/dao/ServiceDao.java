package com.manage.dao;

import java.util.Map;
/**
 * 服务设施维护
 * @author Durantchan
 *
 */
public interface ServiceDao {
		//查找所有的服务设施信息
		public abstract Map findAllService();
		//根据服务设施的相关属性查找
		public abstract Map findServiceByAttribute(Map map);
		//增加服务设施信息
		public abstract void addNewService(Map map);
		//批量删除服务设施信息
		public abstract void deleteServiceByPatch(Map map);
		//单个删除服务设施信息
		public abstract void deleteServiceBySingle(Map map);
		//修改服务设施信息
		public abstract void updateService(Map map);
}

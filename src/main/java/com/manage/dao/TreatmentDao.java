package com.manage.dao;

import java.util.Map;

/**
 * 诊疗信息维护
 * @author Durantchan
 *
 */
public interface TreatmentDao {
		//查找所有的诊疗信息
		public abstract Map findAllTreatment();
		//根据诊疗的相关属性查找
		public abstract Map findTreatmentByAttribute(Map map);
		//增加诊疗信息
		public abstract void addNewTreatment(Map map);
		//批量删除诊疗信息
		public abstract void deleteTreatmentByPatch(Map map);
		//单个删除诊疗信息
		public abstract void deleteTreatmentBySingle(Map map);
		//修改诊疗信息
		public abstract void updateTreatment(Map map);
}

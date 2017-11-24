package com.manage.dao;

import com.manage.domain.Mechanism;

import java.util.Map;

/**
 * 定点医疗机构维护
 * @author Durantchan
 *
 */
public interface MechanismDao {
		//查找所有的医疗机构信息
		public abstract Map findAllMechanism();
		//根据医疗机构的相关属性查找
		public abstract Map findMechanismByAttribute(Map map);
		//增加医疗机构信息
		public abstract void addNewMechanism(Map map);
		//批量删除医疗机构信息
		public abstract void deleteMechanismByPatch(Map map);
		//单个删除医疗机构信息
		public abstract void deleteMechanismBySingle(Map map);
		//修改医疗机构信息
		public abstract void updateMechanism(Map map);
	//根据机构名查找机构
	Mechanism findMechanismByName(String mechanism_name);
}

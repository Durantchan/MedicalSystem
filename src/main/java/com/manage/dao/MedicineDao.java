package com.manage.dao;

import java.util.List;
import java.util.Map;

import com.manage.domain.Medicine;
/*
 * 药品消息维护
 */
public interface MedicineDao {
	//查找所有的药品信息
	public abstract List<Map> findAllMedicine();
	//根据药品的相关属性查找
	public abstract List<Medicine> findMedicineByAttribute(Map map);
	//增加药品信息
	public abstract void addNewMedicine(Map map);
	//批量删除药品信息
	public abstract void deleteMedicineByPatch(Map map);
	//单个删除药品信息
	public abstract void deleteMedicineBySingle(Map map);
	//修改药品信息
	public abstract void updateMedicine(Map map);
}

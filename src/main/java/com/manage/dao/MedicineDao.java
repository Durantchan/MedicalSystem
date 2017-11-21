package com.manage.dao;

import java.util.List;
import java.util.Map;
/*
 * ҩƷ��Ϣά��
 */
public interface MedicineDao {
	//�������е�ҩƷ��Ϣ
	public abstract List<Map> findAllMedicine();
	//����ҩƷ��������Բ���
	public abstract List<Map> findMedicineByAttribute(Map map);
	//����ҩƷ��Ϣ
	public abstract void addNewMedicine(Map map);
	//����ɾ��ҩƷ��Ϣ
	public abstract void deleteMedicineByPatch(Map map);
	//����ɾ��ҩƷ��Ϣ
	public abstract void deleteMedicineBySingle(Map map);
	//�޸�ҩƷ��Ϣ
	public abstract void updateMedicine(Map map);
}
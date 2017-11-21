package com.manage.dao;

import java.util.Map;

/**
 * ������Ϣά��
 * @author Durantchan
 *
 */
public interface TreatmentDao {
		//�������е�������Ϣ
		public abstract Map findAllTreatment();
		//�������Ƶ�������Բ���
		public abstract Map findTreatmentByAttribute(Map map);
		//����������Ϣ
		public abstract void addNewTreatment(Map map);
		//����ɾ��������Ϣ
		public abstract void deleteTreatmentByPatch(Map map);
		//����ɾ��������Ϣ
		public abstract void deleteTreatmentBySingle(Map map);
		//�޸�������Ϣ
		public abstract void updateTreatment(Map map);
}

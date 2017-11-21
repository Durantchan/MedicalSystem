package com.manage.dao;

import java.util.Map;

/**
 * ������ò���ά��
 * @author Durantchan
 *
 */
public interface ParameterDao {
		//�������еĲ���
		public abstract Map findAllParameter();
		//���ҵ�������
		public abstract Map findParameterBySingle(Map map);
		//���Ӳ�����Ϣ
		public abstract void addNewParameter(Map map);
		//����ɾ��������Ϣ
		public abstract void deleteParameterBySingle(Map map);
		//����ɾ��������Ϣ
		public abstract void deleteParameterByPatch(Map map);
		//�޸Ĳ�����Ϣ
		public abstract void updateParameter(Map map);
}

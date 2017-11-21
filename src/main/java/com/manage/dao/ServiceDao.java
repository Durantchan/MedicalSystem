package com.manage.dao;

import java.util.Map;
/**
 * ������ʩά��
 * @author Durantchan
 *
 */
public interface ServiceDao {
		//�������еķ�����ʩ��Ϣ
		public abstract Map findAllService();
		//���ݷ�����ʩ��������Բ���
		public abstract Map findServiceByAttribute(Map map);
		//���ӷ�����ʩ��Ϣ
		public abstract void addNewService(Map map);
		//����ɾ��������ʩ��Ϣ
		public abstract void deleteServiceByPatch(Map map);
		//����ɾ��������ʩ��Ϣ
		public abstract void deleteServiceBySingle(Map map);
		//�޸ķ�����ʩ��Ϣ
		public abstract void updateService(Map map);
}

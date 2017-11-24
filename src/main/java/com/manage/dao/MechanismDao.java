package com.manage.dao;

import com.manage.domain.Mechanism;

import java.util.Map;

/**
 * ����ҽ�ƻ���ά��
 * @author Durantchan
 *
 */
public interface MechanismDao {
		//�������е�ҽ�ƻ�����Ϣ
		public abstract Map findAllMechanism();
		//����ҽ�ƻ�����������Բ���
		public abstract Map findMechanismByAttribute(Map map);
		//����ҽ�ƻ�����Ϣ
		public abstract void addNewMechanism(Map map);
		//����ɾ��ҽ�ƻ�����Ϣ
		public abstract void deleteMechanismByPatch(Map map);
		//����ɾ��ҽ�ƻ�����Ϣ
		public abstract void deleteMechanismBySingle(Map map);
		//�޸�ҽ�ƻ�����Ϣ
		public abstract void updateMechanism(Map map);
	//���ݻ��������һ���
	Mechanism findMechanismByName(String mechanism_name);
}

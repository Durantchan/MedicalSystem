package com.manage.domain;
/**
 * ������Ϣ
 * @author Durantchan
 *
 */
public class Treatment {
	private String treat_name;	//������Ŀ��
	private String treat_type;	//��������
	private String treat_info;	//��������
	private double cost;	//�շ�
	private int treat_insurance;	//�Ƿ���ҽ����
	private double treat_propotion;	//��������
	public String getTreat_name() {
		return treat_name;
	}
	public void setTreat_name(String treat_name) {
		this.treat_name = treat_name;
	}
	public String getTreat_type() {
		return treat_type;
	}
	public void setTreat_type(String treat_type) {
		this.treat_type = treat_type;
	}
	public String getTreat_info() {
		return treat_info;
	}
	public void setTreat_info(String treat_info) {
		this.treat_info = treat_info;
	}
	public double getCost() {
		return cost;
	}
	public void setCost(double cost) {
		this.cost = cost;
	}
	public int getTreat_insurance() {
		return treat_insurance;
	}
	public void setTreat_insurance(int treat_insurance) {
		this.treat_insurance = treat_insurance;
	}
	public double getTreat_propotion() {
		return treat_propotion;
	}
	public void setTreat_propotion(double treat_propotion) {
		this.treat_propotion = treat_propotion;
	}
}

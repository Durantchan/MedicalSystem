package com.manage.domain;
/**
 * ������ʩ
 * @author Durantchan
 *
 */
public class Service {
	private String service_type;	//���
	private String service_info;	//����
	private double service_propotion;	//��������
	public String getService_type() {
		return service_type;
	}
	public void setService_type(String service_type) {
		this.service_type = service_type;
	}
	public String getService_info() {
		return service_info;
	}
	public void setService_info(String service_info) {
		this.service_info = service_info;
	}
	public double getService_propotion() {
		return service_propotion;
	}
	public void setService_propotion(double service_propotion) {
		this.service_propotion = service_propotion;
	}
}

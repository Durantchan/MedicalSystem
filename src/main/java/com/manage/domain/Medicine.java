package com.manage.domain;

import java.io.Serializable;

/*
 * ҩƷ��Ϣ
 * @Durantchan 2017.11.16
 */
public class Medicine implements Serializable{
	private String drug_name;	//ҩƷ��
	private String drug_type;	//ҩƷ����
	private String manufacturer;	//��������
	private double price;			//�۸�
	private double drug_propotion;	//�Ƿ���ҽ����
	private String drug_insurance;		//��������
	private String message;			//����
	
	public Medicine(){ 
		
	}
	
	public Medicine(String name,String type,String manufacturer,double price,double drug_propotion,String drug_insurance,String message){ 
		this.drug_name = name;
		this.drug_type = type;
		this.manufacturer = manufacturer;
		this.price = price;
		this.drug_propotion = drug_propotion;
		this.drug_insurance = drug_insurance;
		this.message = message;
	
	}
	public String getDrug_name() {
		return drug_name;
	}
	public void setDrug_name(String drug_name) {
		this.drug_name = drug_name;
	}
	public String getDrug_type() {
		return drug_type;
	}
	public void setDrug_type(String drug_type) {
		this.drug_type = drug_type;
	}
	public double getPrice() {
		return price;
	}
	public void setPrice(double price) {
		this.price = price;
	}
	public double getDrug_propotion() {
		return drug_propotion;
	}
	public void setDrug_propotion(double drug_propotion) {
		this.drug_propotion = drug_propotion;
	}
	public String getDrug_insurance() {
		return drug_insurance;
	}
	public void setDrug_insurance(int drug_insurance) {
		this.drug_insurance = "��";
		if (0==drug_insurance) {
			this.drug_insurance = "��";
		}
	}
	public String getManufacturer() {
		return manufacturer;
	}
	public void setManufacturer(String manufacturer) {
		this.manufacturer = manufacturer;
	}
	public void setMessage(String message){
		this.message = message;
	}
	public String getMessage(){ 
		return message;
	}
}

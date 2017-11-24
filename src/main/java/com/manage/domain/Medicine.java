package com.manage.domain;

import java.io.Serializable;

/*
 * 药品信息
 * @Durantchan 2017.11.16
 */
public class Medicine implements Serializable{
	private String drug_name;	//药品名
	private String drug_type;	//药品类型
	private String manufacturer;	//生产产商
	private double price;			//价格
	private double drug_propotion;	//是否在医保内
	private String drug_insurance;		//报销比例
	private String message;			//功能

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
		this.drug_insurance = "是";
		if (0==drug_insurance) {
			this.drug_insurance = "否";
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

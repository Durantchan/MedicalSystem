package com.manage.domain;
/**
 * 定点医疗机构
 * @author Durantchan
 *
 */
public class Mechanism {
	private String mechanism_name;	//机构名称
	private String mechanism_address;	//机构地址
	private String mechanism_type;	//机构类型
	private int mechanism_phone;	//机构联系方式
	public String getMechanism_name() {
		return mechanism_name;
	}
	public void setMechanism_name(String mechanism_name) {
		this.mechanism_name = mechanism_name;
	}
	public String getMechanism_address() {
		return mechanism_address;
	}
	public void setMechanism_address(String mechanism_address) {
		this.mechanism_address = mechanism_address;
	}
	public String getMechanism_type() {
		return mechanism_type;
	}
	public void setMechanism_type(String mechanism_type) {
		this.mechanism_type = mechanism_type;
	}
	public int getMechanism_phone() {
		return mechanism_phone;
	}
	public void setMechanism_phone(int mechanism_phone) {
		this.mechanism_phone = mechanism_phone;
	}
}

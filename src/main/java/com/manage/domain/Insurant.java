package com.manage.domain;

import java.util.Date;

public class Insurant {
	private String idCard;
	private String userName;
	private Integer age;
	private String gender;
	private Integer phone;
	private String address;
	private  String occupation;
	private Date attendTime;
	private String attendGroup;
	private String mechanism;
	public String getIdCard() {
		return idCard;
	}
	public void setIdCard(String idCard) {
		this.idCard = idCard;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public Integer getAge() {
		return age;
	}
	public void setAge(Integer age) {
		this.age = age;
	}
	public String getGender() {
		return gender;
	}
	public void setGender(String gender) {
		this.gender = gender;
	}
	public Integer getPhone() {
		return phone;
	}
	public void setPhone(Integer phone) {
		this.phone = phone;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getOccupation() {
		return occupation;
	}
	public void setOccupation(String occupation) {
		this.occupation = occupation;
	}
	public Date getAttendTime() {
		return attendTime;
	}
	public void setAttendTime(Date attendTime) {
		this.attendTime = attendTime;
	}
	public String getAttendGroup() {
		return attendGroup;
	}
	public void setAttendGroup(String attendGroup) {
		this.attendGroup = attendGroup;
	}
	public String getMechanism() {
		return mechanism;
	}
	public void setMechanism(String mechanism) {
		this.mechanism = mechanism;
	}

	
	
}

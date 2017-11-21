package com.manage.domain;
/**
 * 诊疗信息
 * @author Durantchan
 *
 */
public class Treatment {
	private String treat_name;	//诊疗项目名
	private String treat_type;	//诊疗类型
	private String treat_info;	//诊疗详情
	private double cost;	//收费
	private int treat_insurance;	//是否在医保内
	private double treat_propotion;	//报销比例
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

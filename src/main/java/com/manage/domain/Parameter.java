package com.manage.domain;
/**
 * 费用参数
 * @author Durantchan
 *
 */
public class Parameter {
	private int standard;	//起付标准
	private double own_propotion;	//自费比例
	private int line;	//封顶线
	public int getStandard() {
		return standard;
	}
	public void setStandard(int standard) {
		this.standard = standard;
	}
	public double getOwn_propotion() {
		return own_propotion;
	}
	public void setOwn_propotion(double own_propotion) {
		this.own_propotion = own_propotion;
	}
	public int getLine() {
		return line;
	}
	public void setLine(int line) {
		this.line = line;
	}
	
}

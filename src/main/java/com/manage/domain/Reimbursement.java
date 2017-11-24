package com.manage.domain;

import java.util.Date;

/**
 * 报销信息
 */
public class Reimbursement {

    private int id;
    private String account;
    private String reimName;
    private String drug;
    private String service;
    private String mechanismName;
    private String treatName;
    private double totalPrice;
    private double sumPrice;
    private int status;
    private Date reimTime;

    public int getId() {
        return id;
    }

    public Reimbursement() {
        super();
    }

    public void setId(int id) {

        this.id = id;
    }


    public String getAccount() {
        return account;
    }

    public void setAccount(String account) {
        this.account = account;
    }

    public String getReimName() {
        return reimName;
    }

    public void setReimName(String reimName) {
        this.reimName = reimName;
    }

    public String getDrug() {
        return drug;
    }

    public void setDrug(String drug) {
        this.drug = drug;
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public String getMechanismName() {
        return mechanismName;
    }

    public void setMechanismName(String mechanismName) {
        this.mechanismName = mechanismName;
    }

    public String getTreatName() {
        return treatName;
    }

    public void setTreatName(String treatName) {
        this.treatName = treatName;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public double getSumPrice() {
        return sumPrice;
    }

    public void setSumPrice(double sumPrice) {
        this.sumPrice = sumPrice;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public Date getReimTime() {
        return reimTime;
    }

    public void setReimTime(Date reimTime) {
        this.reimTime = reimTime;
    }
}

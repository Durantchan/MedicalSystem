package com.manage.domain;
/**
 * �û���Ϣ
 */
public class User {
    // ��Ա����
    private String account;
    private String password;
    private String email;

    // ���캯��
    public User() {
        super();
    }


    public User(String account, String password, String email) {
        super();
        this.account = account;
        this.password = password;
        this.email = email;
    }

    public String getAccount() {
        return account;
    }

    public void setAccount(String account) {
        this.account = account;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String passwd) {
        this.password = passwd;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

}
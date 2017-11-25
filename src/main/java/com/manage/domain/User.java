package com.manage.domain;
/**
 * 用户信息
 */
public class User {
    // 成员变量
    private String account;
    private String password;
    private String email;

    // 构造函数
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
package com.manage.dao;

import com.manage.domain.User;

public interface UserDao {
	public abstract User findByAccount(String account);

	public abstract User findByEmail(String email);
	
}

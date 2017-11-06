package com.manage.dao;

import com.manage.domain.User;

public interface UserDao {
	public abstract User findByUsername(String username);
	
}

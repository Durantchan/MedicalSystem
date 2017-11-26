package com.manage.dao;

import com.manage.domain.User;

import java.util.Map;

public interface UserDao {
	public abstract User findByAccount(String account);

	public abstract User findByEmail(String email);

	public abstract void updateInfo(Map Map);
	
}

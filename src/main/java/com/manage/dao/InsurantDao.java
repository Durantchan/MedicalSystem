package com.manage.dao;

import java.util.List;
import java.util.Map;

import com.manage.domain.Insurant;

public interface InsurantDao {
	void saveInsurant(Insurant insurant);
	
	void delInsurant(Integer idCard);
	
	void updateInsurant(Insurant insurant, String idCard);
	
	Insurant findInsurant(String idCard);

	Map findAllInsurant();

	Map findInsurantByIdcard(String idcard);

}

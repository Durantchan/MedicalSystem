package com.manage.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;


import com.manage.dao.MedicineDao;
import com.manage.domain.Medicine;

import net.sf.json.JSONObject;
/**
 * 药品信息维护
 * @author Durantchan
 *
 */
@Controller
@RequestMapping(value = "/medicine")
public class MedicineController {
	
	@Resource
	private MedicineDao medicineDao;
	
	/*
	 * 查询所有的药品信息
	 */
	@ResponseBody
	@RequestMapping(value = "/query", method = RequestMethod.POST)
	public List<Medicine> selectAllMedicine(Map<Object, String> param){ 
		List<Medicine> list = new ArrayList<Medicine>();
		List<Map> medicine_list = medicineDao.findAllMedicine();
		Medicine medicine;
		for(Map map: medicine_list){
			medicine = new Medicine();
			medicine.setDrug_name((String.valueOf(map.get("drug_name"))));
			medicine.setDrug_type((String.valueOf(map.get("drug_type"))));
			medicine.setManufacturer((String.valueOf(map.get("manufacturer"))));
			medicine.setDrug_insurance((Integer.valueOf(String.valueOf(map.get("drug_insurance")))));
			medicine.setDrug_propotion((Double.valueOf(String.valueOf(map.get("drug_propotion")))));
			medicine.setPrice((Double.valueOf(String.valueOf(map.get("price")))));
			medicine.setMessage((String.valueOf(map.get("message"))));
			
			list.add(medicine);
		}
		return list;
	}
	
	/*
	 * 根据属性查询药品信息
	 */
	@ResponseBody
	@RequestMapping(value = "/querySome", method = RequestMethod.POST)
	public List<Medicine> selectMedicineByAttribute(HttpServletRequest param){ 
		List<Medicine> list = new ArrayList<Medicine>();
		Map<Object, Object> params = new HashMap<Object, Object>();
		params.put("drug_type", param.getParameter("drug_type"));
		params.put("drug_name", param.getParameter("drug_name"));
		List<Map> medicine_list = medicineDao.findMedicineByAttribute(params);
		Medicine medicine;
		for(Map map: medicine_list){
			medicine = new Medicine();
			medicine.setDrug_name((String.valueOf(map.get("drug_name"))));
			medicine.setDrug_type((String.valueOf(map.get("drug_type"))));
			medicine.setManufacturer((String.valueOf(map.get("manufacturer"))));
			medicine.setDrug_insurance((Integer.valueOf(String.valueOf(map.get("drug_insurance")))));
			medicine.setDrug_propotion((Double.valueOf(String.valueOf(map.get("drug_propotion")))));
			medicine.setPrice((Double.valueOf(String.valueOf(map.get("price")))));
			medicine.setMessage((String.valueOf(map.get("message"))));
			
			list.add(medicine);
		}
		return list;
	}
	
	/*
	 * 新增药品信息
	 * 0000--成功 4000--失败
	 */
	@ResponseBody
	@RequestMapping(value = "/add", method = RequestMethod.POST)
	public String addNewMedicine(HttpServletRequest param){ 
		String result = "0000";
		try{
		Map<Object, Object> map = new HashMap<Object, Object>();
		map.put("drug_name", param.getParameter("drug_name"));
		map.put("drug_type", param.getParameter("drug_type"));
		map.put("manufacturer", param.getParameter("manufacturer"));
		map.put("price", param.getParameter("price"));
		map.put("drug_propotion", param.getParameter("drug_propotion"));
		map.put("drug_insurance", param.getParameter("drug_insurance"));
		map.put("message", param.getParameter("message"));
		medicineDao.addNewMedicine(map);
		}catch (Exception e) {
			// TODO: handle exception
			result = "4000";
		}
		return result;
	}
	
	/*
	 * 批量删除药品信息
	 */
	@ResponseBody
	@RequestMapping(value = "/deletePatch", method = RequestMethod.POST)
	public String deleteMedicineByBatch(HttpServletRequest param){ 
		String result = "0000";
		
		return result;
	}
	
	/*
	 * 删除单个药品信息
	 * 0000--成功 4000--失败
	 */
	@ResponseBody
	@RequestMapping(value = "delete", method = RequestMethod.POST)
	public String deleteMedicineBySingle(HttpServletRequest param){ 
		String result = "0000";
		Map<Object, Object> map = new HashMap<Object, Object>();
		try {
			map.put("drug_name", param.getParameter("drug_name"));
			medicineDao.deleteMedicineBySingle(map);
		} catch (Exception e) {
			// TODO: handle exception
			result = "4000";
		}
		return result;
	}
	
	/*
	 * 修改药品信息
	 * 0000--成功 4000--失败
	 */
	@ResponseBody
	@RequestMapping(value = "update", method = RequestMethod.POST)
	public String updataMedicine(HttpServletRequest param){ 
		String result = "0000";
		try{
		Map<Object, Object> map = new HashMap<Object, Object>();
		map.put("drug_name", param.getParameter("drug_name"));
		map.put("drug_type", param.getParameter("drug_type"));
		map.put("manufacturer", param.getParameter("manufacturer"));
		map.put("price", param.getParameter("price"));
		map.put("drug_propotion", param.getParameter("drug_propotion"));
		map.put("drug_insurance", param.getParameter("drug_insurance"));
		map.put("message", param.getParameter("message"));
		medicineDao.updateMedicine(map);
		}catch(Exception e){ 
			result = "4000";
		}
		return result;
	}
	
}

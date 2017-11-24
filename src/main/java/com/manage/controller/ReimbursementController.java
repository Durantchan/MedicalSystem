package com.manage.controller;

import com.manage.dao.*;
import com.manage.domain.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by kkk on 2017/11/22.
 */

@Controller
@RequestMapping(value = "/reimbursement")
public class ReimbursementController {

    @Resource
    private ReimbursementDao reimbursementDao;
    @Resource
    private MechanismDao mechanismDao;
    @Resource
    private MedicineDao medicineDao;
    @Resource
    private UserDao userDao;
    @Resource
    private InsurantDao insurantDao;
    @Resource
    private ServiceDao serviceDao;
    @Resource
    private TreatmentDao treatmentDao;

    /**
     * 报销资格审核
     */
    @ResponseBody
    @RequestMapping(value = "/exam" ,method=RequestMethod.POST)
    public Map<Object, Object> qualificationExam(@RequestParam("reim_name") String reim_name,
                                                 @RequestParam("idcard") String idcard,
                                                 @RequestParam("drug") String drug,
                                                 @RequestParam("service_type") String service,
                                                 @RequestParam("mechanism_name") String mechanism_name,
                                                 @RequestParam("treat_name") String treat_name) {

        Map<Object, Object> result = new HashMap<Object, Object>();
        double total_price = 0;
        double sum_price = 0;
        String userName = "luanmaa";
        Mechanism mechanism = mechanismDao.findMechanismByName(mechanism_name);
        Map insurant = insurantDao.findInsurantByIdcard(idcard);
        if (insurant == null || !insurant.get("user_name").equals(reim_name)) {
            result.put("code", "101");
            return result;
        } else if (mechanism == null) {
            result.put("code", "102");
            return result;
        } else {
            String[] drugs = drug.replace(" ", "").split(",");
            for (String drug_name : drugs) {
                Map<Object, Object> drugmap = new HashMap<Object, Object>();
                drugmap.put("drug_name", drug_name);
                List<Medicine> drugList = medicineDao.findMedicineByAttribute(drugmap);
                for (Medicine medicine : drugList) {
                    if (medicine.getDrug_insurance().equals("是")) {
                        total_price += (Double.valueOf(medicine.getPrice()));
                        sum_price += (Double.valueOf(String.valueOf(medicine.getPrice())) * (1 - Double.valueOf(medicine.getDrug_propotion())));
                    }
                }
                drugmap.clear();
            }
            if (!treat_name.equals("") || treat_name!=null) {
                Map<Object, Object> treatMap = new HashMap<Object, Object>();
                treatMap.put("treat_name", treat_name);
                Map treatResultMap = treatmentDao.findTreatmentByAttribute(treatMap);
                if (treatResultMap != null) {
                    if (Double.valueOf(String.valueOf(treatResultMap.get("treat_insurance"))) == 1) {
                        total_price += (Double.valueOf(String.valueOf(treatResultMap.get("cost"))));
                        sum_price += (Double.valueOf(String.valueOf(treatResultMap.get("cost"))) * (1 - Double.valueOf(String.valueOf(treatResultMap.get("treat_propotion")))));
                    }
                }
            }
            if (!service.equals("") || service!=null) {
                Map<Object, Object> serviceMap = new HashMap<Object, Object>();
                serviceMap.put("service_type", service);
                Map servieResultMap = serviceDao.findServiceByAttribute(serviceMap);
                if (servieResultMap != null) {
                    sum_price = (sum_price * (1 - Double.valueOf(String.valueOf(servieResultMap.get("service_propotion")))));
                }
            }

            if (sum_price == total_price) {
                result.put("code", "103");
                return result;
            }
            Date nowTime = new Date(System.currentTimeMillis());
            SimpleDateFormat sdFormatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String retStrFormatNowDate = sdFormatter.format(nowTime);
            int id = 1;
            try {
                id = reimbursementDao.findMaxReimbursementId();
            } catch (Exception e) {
            }
            result.put("code", "200");
            result.put("reimId",id);
            result.put("total_price", total_price);
            result.put("sum_price", sum_price);
            result.put("account", userName);
            result.put("reimId", id);
            result.put("reimTime", retStrFormatNowDate);

            return result;
        }
    }

    /**
     * 新增报销单
     * 100失败 200成功
     */
    @ResponseBody
    @RequestMapping(value = "/addReim", method=RequestMethod.POST)
    public String addNewReimbursement(@RequestParam("reim_time") String reimTime,
                                      @RequestParam("userName") String account,
                                      @RequestParam("reim_name") String reim_name,
                                      @RequestParam("drug") String drug,
                                      @RequestParam("service_type") String service,
                                      @RequestParam("mechanism_name") String mechanismName,
                                      @RequestParam("treat_name") String treatName,
                                      @RequestParam("total_price") double totalPrice,
                                      @RequestParam("sum_price") double sumPrice) {

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        try {
            Reimbursement reimbursement = new Reimbursement();
            reimbursement.setAccount(account);
            reimbursement.setReimName(reim_name);
            reimbursement.setDrug(drug);
            reimbursement.setService(service);
            reimbursement.setMechanismName(mechanismName);
            reimbursement.setTreatName(treatName);
            reimbursement.setTotalPrice(totalPrice);
            reimbursement.setSumPrice(sumPrice);
            reimbursement.setStatus(1);
            reimbursement.setReimTime(sdf.parse(reimTime));
            reimbursementDao.addNewReimbursement(reimbursement);
        } catch (Exception e) {
            return "100";
        }

        return "200";
    }

}

package com.manage.dao;

import com.manage.domain.Reimbursement;

import java.util.Map;

/**
 * Created by kkk on 2017/11/21.
 */
public interface ReimbursementDao {

    //增加报销单
    void addNewReimbursement(Reimbursement reimbursement);
    //获取最大的id
    int findMaxReimbursementId();


}

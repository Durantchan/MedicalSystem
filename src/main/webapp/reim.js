function exam() {
    var reim_name = $('#reim_name').val().trim()
    var idcard = $('#idcard').val().trim()
    var drug = $('#drug').val().trim()
    var service_type = $('#service_type').val().trim()
    var mechanism_name = $('#mechanism_name').val().trim()
    var treat_name = $('#treat_name').val().trim()
    if (reim_name == "") {
        alert("报销人姓名不能为空")
    } else if(idcard ==""){
        alert("报销人身份证不能为空")
    } else if(mechanism_name ==""){
        alert("医疗机构不能为空")
    } else{
        $.ajax({
            type:"POST",
            datatype:"json",
            url:"/reimbursement/exam.action",
            data:{
                reim_name:reim_name,
                idcard:idcard,
                drug:drug,
                service_type:service_type,
                mechanism_name:mechanism_name,
                treat_name:treat_name,
            },
            success:function (data) {
                if(data.code==200){
                    alert("审核通过，点击确定跳转到报销页面");
                    window.localStorage.setItem("reimID", data.reimId+1);
                    window.localStorage.setItem("reimTime", data.reimTime);
                    window.localStorage.setItem("account",data.account);                    
                    window.localStorage.setItem("reim_name", reim_name);
                    window.localStorage.setItem("drug", drug);
                    window.localStorage.setItem("mechanism_name", mechanism_name);
                    window.localStorage.setItem("service_type", service_type);
                    window.localStorage.setItem("treat_name",treat_name);
                    window.localStorage.setItem("total_price",data.total_price);
                    window.localStorage.setItem("sum_price",data.sum_price);
                    window.location.href="reimbursement.html";
                }else if (data.code==101){
                    alert("审核失败，用户未参保");
                }else if (data.code==102){
                    alert("审核失败，机构未参保");
                }else {
                    alert("审核失败，药品或诊疗项目不在医保内")
                }
            },
            error:function () {
                alert("网络出错");
            }
        })
    }
}

function reim() {
    var reim_time = $('#reim_time').text()
    var userName = $('#userName').text()
    var reim_name = $('#reim_name').text()
    var drug = $('#drug').text()
    var mechanism_name = $('#mechanism_name').text()
    var service_type = $('#service_type').text()
    var treat_name = $('#treat_name').text()
    var total_price = $('#total_price').text()
    var sum_price = $('#sum_price').text()

    $.ajax({
        type: "POST",
        datatype: "json",
        url: "/reimbursement/addReim.action",
        data: {
            reim_time: reim_time,
            userName: userName,
            reim_name: reim_name,
            drug: drug,
            service_type: service_type,
            mechanism_name: mechanism_name,
            treat_name: treat_name,
            total_price: total_price,
            sum_price: sum_price
        },
        success: function (data) {
            if (data == 200) {
                alert("报销成功")
            } else {
                alert("报销失败，请稍后再试")
            }
        },
        error: function () {
            alert("网络出错");
        }
    })
}
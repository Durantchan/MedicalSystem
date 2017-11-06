var curr_id;//记录当前消息ID
var open_ico = "static/img/ic_notice_open.png";//邮件打开图标
var new_ico = "static/img/ic_notice_new.png";//新邮件图标
var noReadArr = [];//未读邮件ID数组
$(function(){
	listNotes('all_note','A');
});

//列出某种消息类型列表
function listNotes(id,listType){
	cssMg(id);
    Invoker.async("UserPersonalInfoController", "listNotice", {list_type:listType},function(data) {
		        if (data.res_code == "00000" && data.result != null) {
		        	var retHtml = "";
		            $.each(data.result,function(i, notice) {
		            	var title = notice.notice_title;
		            	var src;
		            	var id = notice.notice_id;
			        	if(title.length>50){
			        		title = title.substr(1,50)+'...';
			        	}
			        	if(notice.is_read=='F'){
			        		src=new_ico;
			        		noReadArr.push(notice.notice_id);
			        	}else{
			        		src=open_ico;
			        	}
		            	retHtml += "<ul><li id='li_"+id+"'>" +
		            			   "<a class='noticeTit' href='javascript:void(0)' onclick='showNoticeContent("+id+")'>" +
		            			   		"<span><img id='img_"+id+"' src='"+src+"' style='width:30px;height:30px;margin-left:5px;'/></span>" +
		            			   		"<span style='margin-left:15px;'>"+title+"</span> <span style='float:right;margin-right:20px;'>"+notice.create_date+"</span></a>" +
		            			   	"</a>" +
		            			   "<div id='div_"+id+"' style='width:100%;display:none;margin:0 0 5px 0'>" +
		            			   "<textarea disabled='disabled' id='txt_"+id+"' style='width:95%;height:80px;overflow:auto;border:1px solid #E0E0E0;border-radius:1em;padding:0 0 0 10px;')>"+notice.notice_content+"</textarea>" +
		            			   "<a href='javascript:void(0)' onclick='delNote("+id+",\""+title+"\")' style='float:right;'><img src='static/img/ic_wrong.png' width='20' height='20'/></a>" +
		            			   "</div></li> " +
		            			   "</ul>";
		            });
		            $(".noticeList").html(retHtml);
		            curr_id = -1;
		            $('.notice_icron').css('display','none');//点击去掉消息数提示框

		        }
		    });
}

//显示列表类型的CSS
function cssMg(id){
	$("#all_note").removeClass("curr");
	$("#read_note").removeClass("curr");
	$("#no_read_note").removeClass("curr");
	$("#"+id).addClass("curr");
}

//显示消息内容
function showNoticeContent(id){
	if(curr_id!=-1){
		$('#div_'+curr_id).css('display','none');
	}
	if(curr_id == id) {
		curr_id=-1;
		return;
	}
	curr_id = id;
	$('#div_'+id).css('display','');
	for(var i = 0;i<noReadArr.length;i++){
		if(id==noReadArr[i]){
			$('#img_'+id).attr("src",open_ico);
			Invoker.async("UserPersonalInfoController", "updateNoticeStatus", {notice_id:noReadArr[i]},function(data) {
				if(data.res_code=='00000'){
					remove(i);
				}
			});
			break;
		}
	}
}

//除去未读数组中已读的ID
function remove(index){ 
	if(noReadArr.length<=1){
		noReadArr = [];
		return;
	}
    for(var i=index;i<noReadArr.length-1;i++) 
    { 
      if(index==noReadArr.length-1) break;
      noReadArr[i]=noReadArr[i+1];
    } 
    arr.length-=1;
} 

//删除用户消息
function delNote(id,title){
	if(!confirm('是否要删除消息['+title+']?')) return;
	Invoker.async("UserPersonalInfoController", "delUserNotice", {notice_id:id},function(data) {
		if(data.res_code=='00000'){
			$('#li_'+id).html('');
		}
	});
}

/**
 * Created by Administrator on 2017-3-8.
 */


function Get_ago(n){
    var now = new Date;
    now.setDate(now.getDate() - n);
    return now;
}
var ttPage;
var clock=2;
var first=true;
var date=new Date();
var y=date.getFullYear();
var m=date.getMonth()+1;
var d=date.getDate();
var y2=date.getFullYear();
var m2=date.getMonth()+1;
var d2=date.getDate();
var e=date.getHours();
var f=date.getMinutes();
var g=date.getSeconds();
if(m<10){m="0"+m}
if(d<10){d="0"+d}
if(m2<10){m2="0"+m2}
if(d2<10){d2="0"+d2}
if(e<10){e="0"+e}
if(f<10){f="0"+f}
if(g<10){g="0"+g}
var CreatDate=y+"-"+m+"-"+d+" "+e+":"+f+":"+g;
var Eng_star_date=y+"-"+m+"-"+d+" 00:00:00";
var Eng_end_date=y+"-"+m+"-"+d+" 23:59:59";
var ago=Get_ago(7);
var ago7_m=(ago.getMonth()+1);
var ago7_d=ago.getDate();
if(ago7_m<10){ago7_m="0"+ago7_m}
if(ago7_d<10){ago7_d="0"+ago7_d}
var agoDate=ago.getFullYear()+"-"+ago7_m+"-"+ago7_d+" "+e+":"+f+":"+g;
function changeColor(){
    //var color=localStorage.getItem("color");
    //if(color){
    //    $("body").css("background",color);
    //}
}
(function(){
    var mydate=date.getTime();
    window.onload=function(){
        //ccc_lib_enableByPass(0,1,login_result,noticeCB);
        $(".cho_date").val( y+"-"+m+"-"+d);
        record_init();
        //OnAlarmMsgRet();
    };
    $("#minus").click(function(){
        var r=$("#cho_date").val();
        var arr= r.split("-");
        if(arr.length==1){
            y=parseInt(arr[0]);
            y--;
            $("#cho_date").val(y);
        }
        if(arr.length==2){
            m=parseInt(arr[1]);
            if(m>0&&m<13){
                m--;
            }
            if(m==0){
                m=12;
                y=y-1;
            }
            if(m<10){
                m="0"+m;
            }
            $("#cho_date").val(y+"-"+m);
        }
        if(arr.length==3){
            d=parseInt(arr[2]);
            m=parseInt(arr[1]);
            if(d>0){
                d--;
            }
            if(d==0&&m>1){
                if(m==2||m==4||m==6||m==8||m==9||m==11){
                    m--;
                    d=31;
                }else if(m==3){
                    if(y%4==0&&y%100!=0||y%400==0){
                        d=29;
                        m--;
                    }else{
                        d=28;
                        m--;
                    }

                }else{
                    d=30;
                    m--;
                }
            }
            if(d==0&&m==1){
                d=31;
                m=12;
                y--;
            }
            if(m<10){
                m="0"+m;
            }
            if(d<10){
                d="0"+d;
            }
            $("#cho_date").val(y+"-"+m+"-"+d);
        }
    });
    $("#plus").click(function(event){
        var r=$("#cho_date").val();
        var arr= r.split("-");
        var yy=new Date().getFullYear();
        var mm=new Date().getMonth()+1;
        var dd=new Date().getDate();
        var date2=(new Date(yy+"-"+mm)).getTime();
        var date4=(new Date(yy+"-"+mm+"-"+dd)).getTime();
        var date3=(new Date(arr[0]+"-"+arr[1]).getTime());
        var date5=(new Date(arr[0]+"-"+arr[1]+"-"+arr[2])).getTime();
        if(arr.length==1){
            y=parseInt(arr[0]);
            if(y<yy){
                y++;
                $("#cho_date").val(y);
            }
        }
        if(arr.length==2){
            if(date2<=date3){
                return false;
            }
            y=parseInt(arr[0]);
            m=parseInt(arr[1]);
            d=parseInt(arr[2]);
            if(y<yy && m ==12){
                y++;
                m=1;
            }else if(arr[0]<=y){
                if(m>=0&&m<12){
                    m++;
                }
            }
            if(m<10){
                m="0"+m;
            }
            $("#cho_date").val(y+"-"+m);
        }
        if(arr.length==3){
            if(date4<=date5){
                return false;
            }
            y=parseInt(arr[0]);
            m=parseInt(arr[1]);
            d=parseInt(arr[2]);
            //当闰年的时候
            if(y%4==0&&y%100!=0||y%400==0){
                //当大月的时候
                if(m==1||m==3||m==5||m==7||m==8||m==10||m==12){
                    if(d<31){
                        d++;
                    }else if(d==31&& m<12) {
                        d = 1;
                        m++;
                    }else if(m==12&&d==31){
                        m=1;d=1;y++;
                    }
                    //else if(d==31&&m==12){
                    //    d=1;m=1;y++;
                    //}
                    //2月的时候
                }else if(m==2){
                    if(d<29){
                       d++;
                    }else if(d==29){
                        d=1;m++;
                    }
                    //小月的时候
                }else{
                    if(d<30){
                        d++;
                    }else if(d==30&&m<12){
                        d=1;m++;
                    }
                }
                //平年的时候
            }else{
                //大月
                if(m==1||m==3||m==5||m==7||m==8||m==10||m==12){
                    if(d<31){
                        d++;
                    }else if(d==31&&m<12) {
                        d = 1;
                        m++;
                    }else if(m==12&&d==31){
                        m=1;d=1;y++;
                    }
                    //2月
                }else if(m==2){
                    if(d<28){
                        d++;
                    }else if(d==28){
                        d=1;m++;
                    }
                    //小月
                }else{
                    if(d<30){
                        d++;
                    }else if(d==30&&m<12){
                        d=1;m++;
                    }
                }
            }
            if(m<10){
                m="0"+m;
            }
            if(d<10){
                d="0"+d;
            }
            $("#cho_date").val(y+"-"+m+"-"+d);
        }
    });

})();
var com;
//选取日月年
$("#choose_date a").click(function(e){
    e.preventDefault();
    var yy=parseInt(new Date().getFullYear());
    var mm=parseInt(new Date().getMonth()+1);
    var dd=parseInt(new Date().getDate());
    if(mm<10){
        mm="0"+mm;
    }
    if(dd<10){
        dd="0"+dd;
    }
    com=dd;
    var date2=(new Date(y+"-"+m)).getTime();
    var date4=(new Date(y+"-"+m+"-"+d)).getTime();
    var date3=(new Date(yy+"-"+mm).getTime());
    var date5=(new Date(yy+"-"+mm+"-"+dd)).getTime();

    $(this).addClass("active").siblings("a").removeClass();
    if($(this).attr("type")=="4"){
        $("#cho_date").val(y);
        CreatDate=y+"-01-00 00:00:00";
        Eng_end_date=y+"-12-31 23:59:59";
        Group_date=y+"-00-00 00:00:00";
        Group_DateType=this.type;
        Eng_star_date=y+"-00-00 00:00:00";
    }
    if($(this).attr("type")=="3"){
        if(date2<date3){
            $("#cho_date").val(y+"-"+m);
            Group_date=y+"-"+m+"-00 00:00:00";
            Eng_end_date=y+"-"+m+"-31 23:59:59";
            Eng_star_date=y+"-"+m+"-00 00:00:00";
        }else{

            $("#cho_date").val(yy+"-"+mm);
            Group_date=yy+"-"+mm+"-00 00:00:00";
            Eng_end_date=yy+"-"+mm+"-31 23:59:59";
            Eng_star_date=yy+"-"+mm+"-00 00:00:00"
        }
        CreatDate=y+"-"+m+"-00 00:00:00";
        Group_DateType=this.type;
    }
    if($(this).attr("type")=="1"){
        if(isNaN(date4)){
            console.log(com);
            $("#cho_date").val(y+"-"+m+"-"+com);
            Group_date=y+"-"+m+"-"+com+" 00:00:00";
            Eng_end_date=y+"-"+m+"-"+com+" 23:59:59";
            Eng_star_date=y+"-"+m+"-"+com+" 00:00:00";
        }else{
            if(date4<=date5){
                $("#cho_date").val(y+"-"+m+"-"+d);
                Group_date=y+"-"+m+"-"+d+" 00:00:00";
                Eng_end_date=y+"-"+m+"-"+d+" 23:59:59";
                Eng_star_date=y+"-"+m+"-"+d+" 00:00:00";
                com=d;
            }else{
                $("#cho_date").val(yy+"-"+mm+"-"+dd);
                Group_date=yy+"-"+mm+"-"+dd+" 00:00:00";
                Eng_end_date=yy+"-"+mm+"-"+dd+" 23:59:59";
                Eng_star_date=yy+"-"+mm+"-"+dd+" 00:00:00";
            }
            CreatDate=y+"-"+m+"-"+d+" 00:00:00";

        }
        Group_DateType=this.type;
    }
    //Group_ProEnergy();
    //Group_GetEnyItem();
    //Group_GetPowerItem();
    //Group_GetTimeItem();
    //console.log(CreatDate);
    first = true;
    var type=$(".records>li.active").attr("type");
    if(type==1){
        user_contro_Info(1);
    }else if(type==2){
        device_log_Info(1);
    }else if(type==3){
        user_msg_Info(1);
    }
});
$("#plus,#minus").click(function(){
    var r=$("#cho_date").val();
    var arr= r.split("-");
    if(arr.length==1){
        r=arr[0]+"-00-"+"00"+" 00:00:00";
        Eng_end_date=y+"-12-31 23:59:59";
        Eng_star_date=y+"-01-00 00:00:00";
    }
    if(arr.length==2){
        r=arr[0]+"-"+arr[1]+"-00"+" 00:00:00";
        Eng_end_date=y+"-"+m+"-31"+" 23:59:59";
        Eng_star_date=y+"-"+m+"-00"+" 00:00:00";
    }
    if(arr.length==3){
        r=arr[0]+"-"+arr[1]+"-"+arr[2]+" 00:00:00";
        if(isNaN(d)){
            d=com;
        }
        Eng_end_date=y+"-"+m+"-"+d+" 23:59:59";
        Eng_star_date=y+"-"+m+"-"+d+" 00:00:00";
    }
    Station_date=r;
    //warn_init();
    first = true;
    var type=$(".records>li.active").attr("type");
    if(type==1){
        user_contro_Info(1);
    }else if(type==2){
        device_log_Info(1);
    }else if(type==3){
        user_msg_Info(1);
    }

});


function record_init(){
    user_contro_Info(1);
}
//切换日志菜单
$(".records>li").click(function(){
    $(this).addClass("active").siblings("li").removeClass("active");
    var type=$(this).attr("type");
    first=true;
    if(type==1){
        user_contro_Info(1);
        $("#deviceRecord").hide();
        $("#userRecord").hide();
        $("#operateRecord").show();

    }else if(type==2){
        device_log_Info(1);
        $("#deviceRecord").show();
        $("#operateRecord").hide();
        $("#userRecord").hide();
    }else if(type==3){
        user_msg_Info(1);
        $("#deviceRecord").hide();
        $("#operateRecord").hide();
        $("#userRecord").show();
    }
})

//加载操作日志
function user_contro_Info(page){
    ttPage = page;
    var ob = new Object();
    ob.pageIndex = parseInt(page);// (int)页序号(>0),
    ob.num = 10;// (int)每页条数
    ob.type = 1;//(int)日志类型,
    ob.userData = 0;
    var json = JSON.stringify(ob);
    console.log(json);
    parent.ccc_lib_reqDataByCmd("",USER_STATION_NOTE_GETBYPAGE,json,log_UserControList);
}
//加载设备日志
function device_log_Info(page){
    ttPage = page;
    var ob = new Object();
    ob.id = parent.g_strSelStnId;
    ob.pageIndex = parseInt(page);// (int)页序号(>0),
    ob.num = 10;// (int)每页条数
    ob.type = 2;//(int)日志类型,
    ob.userData = 0;
    var json = JSON.stringify(ob);
    console.log(json);
    parent.ccc_lib_reqDataByCmd("",USER_STATION_NOTE_GETBYPAGE,json,log_ShowDevLogList);
}
//加载用户日志
function user_msg_Info(page){
    ttPage = page;
    var ob = new Object();
    ob.id = parent.g_strUserName;
    ob.pageIndex = parseInt(page);// (int)页序号(>0),
    ob.num = 10;// (int)每页条数
    ob.type = 3;//(int)日志类型,
    ob.userData = 0;
    var json = JSON.stringify(ob);
    console.log(json);
    parent.ccc_lib_reqDataByCmd("",USER_STATION_NOTE_GETBYPAGE,json,log_UserMsgList);
}
var len=1;
var number=1;
var data=[];


//显示操作日志
function log_UserControList(id,info,des){
    console.log(des);
    console.log(first);
    data=[];
    $("#operateRecord>table>tbody>tr").remove();
    (function check(){
        if(des.total%10==0){
            len=parseInt(des.total*0.1);

        }else{
            len=parseInt(des.total*0.1)+1;
        }
        data=des.data;
        $("#operateRecord>table>tbody>tr").remove();
        var k=(ttPage-1)*10;
        for(var i=0;i<data.length;i++){
            var statu="";
            if(data[i].status==0){
                statu="成功";
            }else if(data[i].status==1){
                statu="失败";
            }
            $("#operateRecord>table>tbody").append('<tr><td>'+(k+1)+'</td><td>'+data[i].time+'</td><td>'+data[i].name+'</td><td>'+data[i].host+'</td><td>'+data[i].comment+'</td><td>'+statu+'</td></tr>');
            k++;
        }
    })();
    var length=$("#operateRecord>table>tbody>tr").length;
    for(var m=0;m<10-length;m++){
        $("#operateRecord>table>tbody").append('<tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>');
    }
    if(first==true){
        $('.operateRecord .M-box3').pagination({
            pageCount:len,
            jump:true,
            // coping:true,
            //homePage:'首页',
            //endPage:'末页',
            prevContent:'上页',
            nextContent:'下页'
        });
        first=false;
        $('.operateRecord .M-box3').on("click","a",function(e){
            number=$(this).attr("data-page");
            if(!isNaN(number)){
                user_contro_Info(number);
            }
        });
        $(".operateRecord .M-box3").on("click","a.jump-btn",function(e){
            number=$(".operateRecord .M-box3>span.active").html();
            if(!isNaN(number)){
                user_contro_Info(number);
            }
        });
        $(".operateRecord .M-box3").on("click","a.prev",function(e){
            number = parseInt($(".operateRecord .M-box3>span.active").html());
            if(number>0){
                user_contro_Info(number);
            }
        });
        $(".operateRecord .M-box3").on("click","a.next",function(e){
            number = parseInt($(".operateRecord .M-box3>span.active").html());
            if(number<len+1){
                user_contro_Info(number);
            }
        });
    }

    //if($("#deviceRecord>table>tbody>tr").length<=20){
    //    $("#deviceRecord>div:last-child").hide();
    //}
}

//显示设备日志
function log_ShowDevLogList(id,info,des){
    console.log(des);
    data=[];
    $("#deviceRecord>table>tbody>tr").remove();
    (function check(){
        if(des.total%10==0){
            len=parseInt(des.total*0.1);

        }else{
            len=parseInt(des.total*0.1)+1;

        }
        data=des.data;
        $("#deviceRecord>table>tbody>tr").remove();
        var k=(ttPage-1)*10;
        for(var i=0;i<data.length;i++){
            $("#deviceRecord>table>tbody").append('<tr><td>'+(k+1)+'</td><td>'+data[i].time+'</td><td>'+data[i].name+'</td><td>'+data[i].comment+'</td></tr>');
            k++;
        }
    })();
    var length=$("#deviceRecord>table>tbody>tr").length;
    for(var m=0;m<10-length;m++){
        $("#deviceRecord>table>tbody").append('<tr><td></td><td></td><td></td><td></td></tr>');
    }
    if(first==true){
        $('.operateRecord .M-box3').pagination({
            pageCount:len,
            jump:true,
            coping:true,
            //homePage:'首页',
            //endPage:'末页',
            prevContent:'上页',
            nextContent:'下页'
        });
        first=false;
        $('.operateRecord .M-box3').on("click","a",function(e){
            number=$(this).attr("data-page");
            if(!isNaN(number)){
                device_log_Info(number);
            }
        });
        $(".operateRecord .M-box3").on("click","a.jump-btn",function(e){
            number=$(".operateRecord .M-box3>span.active").html();
            if(!isNaN(number)){
                device_log_Info(number);
            }
        });
        $(".operateRecord .M-box3").on("click","a.prev",function(e){
            number = parseInt($(".operateRecord .M-box3>span.active").html());
            if(number>0){
                device_log_Info(number);
            }
        });
        $(".operateRecord .M-box3").on("click","a.next",function(e){
            number = parseInt($(".operateRecord .M-box3>span.active").html());
            if(number<len+1){
                device_log_Info(number);
            }
        });
    }

    //if($("#deviceRecord>table>tbody>tr").length<=20){
    //    $("#deviceRecord>div:last-child").hide();
    //}
}
//显示用户日志
function log_UserMsgList(id,info,des){
    console.log(des);
    data=[];
    $("#userRecord>table>tbody>tr").remove();
    (function check(){
        if(des.total%20==0){
            len=parseInt(des.total*0.05);

        }else{
            len=parseInt(des.total*0.05)+1;

        }
        data=des.data;
        $("#userRecord>table>tbody>tr").remove();
        var k=(ttPage-1)*20;
        for(var i=0;i<data.length;i++){
            $("#userRecord>table>tbody").append('<tr><td>'+(k+1)+'</td><td>'+data[i].name+'</td><td>'+data[i].time+'</td><td>'+data[i].comment+'</td></tr>');
            k++;
        }
    })();
    var length=$("#userRecord>table>tbody>tr").length;
    for(var m=0;m<20-length;m++){
        $("#userRecord>table>tbody").append('<tr><td></td><td></td><td></td><td></td></tr>');
    }
    if(first==true){
        $('.operateRecord .M-box3').pagination({
            pageCount:len,
            jump:true,
            coping:true,
            //homePage:'首页',
            //endPage:'末页',
            prevContent:'上页',
            nextContent:'下页'
        });
        first=false;
        $('.operateRecord .M-box3').on("click","a",function(e){
            number=$(this).attr("data-page");
            if(!isNaN(number)){
                user_msg_Info(number);
            }
        });
        $(".operateRecord .M-box3").on("click","a.jump-btn",function(e){
            number=$(".operateRecord .M-box3>span.active").html();
            if(!isNaN(number)){
                user_msg_Info(number);
            }
        });
        $(".operateRecord .M-box3").on("click","a.prev",function(e){
            number = parseInt($(".operateRecord .M-box3>span.active").html());
            if(number>0){
                user_msg_Info(number);
            }
        });
        $(".operateRecord .M-box3").on("click","a.next",function(e){
            number = parseInt($(".operateRecord .M-box3>span.active").html());
            if(number<len+1){
                user_msg_Info(number);
            }
        });
    }
}
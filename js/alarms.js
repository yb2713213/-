/**
 * Created by Administrator on 2020-10-19.
 */
 $(document).click(function(event){
    var _con = $('.checkOpts');   // 设置目标区域
    if(event.target.nodeName=="SELECT"){
        return false;
    }
    if(!_con.is(event.target) && _con.has(event.target).length === 0){ // Mark 1
        $('.checkOpts').fadeOut();          //淡出消失
    }
});
var date=new Date();
var y=date.getFullYear();
var m=date.getMonth()+1;
var d=date.getDate();

var ModGtw="";
var ModAddr="";
var Eng_ModType=1;
var date8=Get_ago(7);
var y8=date8.getFullYear();
var m8=date8.getMonth()+1;
var d8=date8.getDate();
var daycount=1;
var thisTime="本周";
var lastTime="上周";
if(m<10){
    m="0"+m;
}
if(d<10){
    d="0"+d;
}
first=true;
$(document).click(function(event){
    var _con = parent.$('.leftBar');   // 设置目标区域
    if(!_con.is(event.target) && _con.has(event.target).length === 0){ // Mark 1
        parent.$('.bloc').fadeOut();          //淡出消失
    }
});
var Prev_start_date=y8+"-"+m8+"-"+d8+" 00:00:00";
var Prev_end_date=y8+"-"+m8+"-"+d8+" 23:59:59";

var CreatDate=y+"-"+m+"-"+d+" 00:00:00";
var Pre_energy_date;
var Energy_date = CreatDate;
var Eng_star_date=y+"-"+m+"-"+d+" 00:00:00";
var Eng_end_date=y+"-"+m+"-"+d+" 23:59:59";
var Energy_DateType = 1;
function Get_ago(n){
    var now = new Date;
    now.setDate(now.getDate() - n);
    return now;
}
//日期插件
(function(){
    var mydate=date.getTime();
    window.onload=function(){
        $(".cho_date").val( y+"-"+m+"-"+d);
        //ccc_lib_enableByPass(0,1,login_result,noticeCB);
        loadAlarms(1);
        //energy_init();
    };
    $("#minus1").click(function(){
        var r=$("#cho_date1").val();
        var arr= r.split("-");
        if(arr.length==1){
            y=parseInt(arr[0]);
            y--;
            $("#cho_date1").val(y);
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
            $("#cho_date1").val(y+"-"+m);
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
            $("#cho_date1").val(y+"-"+m+"-"+d);
        }
    });
    $("#plus1").click(function(event){
        var r=$("#cho_date1").val();
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
                $("#cho_date1").val(y);
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
            $("#cho_date1").val(y+"-"+m);
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
            $("#cho_date1").val(y+"-"+m+"-"+d);
        }
    });
})();
var com;
//选取日月年
$("#choose_date1 a").click(function(e){
    if($(this).hasClass("active")){
        return false;
    }
    e.preventDefault();
    //if(firstType!=this.type){
    //    //alert(666)
    //    if(click==1){cmdtype=1;}
    //    if(click==2){cmdtype=2;}
    //    eng_GetModItemInfo();
    //}
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
    var date2=(new Date(y+"/"+m+"/01")).getTime();
    var date4=(new Date(y+"/"+m+"/"+d)).getTime();
    var date3=(new Date(yy+"/"+mm+"/01")).getTime();
    var date5=(new Date(yy+"/"+mm+"/"+dd)).getTime();
    $(this).addClass("active").siblings("a").removeClass();
    if($(this).attr("type")==4){
        $("#cho_date1").val(y);
        CreatDate=y+"-00-"+"00"+" 00:00:00";
        Eng_end_date=y+"-12-31 23:59:59";
        Energy_date=CreatDate;
        Eng_star_date=y+"-00-"+"00"+" 00:00:00";


    }else if($(this).attr("type")==3){
        if(date2<=date3){
            $("#cho_date1").val(y+"-"+m);
            Energy_date=y+"-"+m+"-00 00:00:00";
            Eng_end_date=y+"-"+m+"-31"+" 23:59:59";
            Eng_star_date=y+"-"+m+"-00"+" 00:00:00";

            var m25=m-1;
            if(m25<10){
                m25="0"+m25
            }else if(m25=="00"){
                m25=12;
                y--;
            }


        }else{
            $("#cho_date1").val(yy+"-"+mm);
            Energy_date=yy+"-"+mm+"-00 00:00:00";
            Eng_end_date=yy+"-"+mm+"-31"+" 23:59:59";
            Eng_star_date=yy+"-"+mm+"-00"+" 00:00:00";

            var mm25=mm-1;
            if(mm25<10) {
                mm25 = "0" + mm25
            }else if(mm25=="00"){
                mm25=12;
                yy--;
            }

        }
        CreatDate=y+"-"+m+"-00"+" 00:00:00";

        daycount=31;
    } else if($(this).attr("type")==1){

        thisTime="本周";
        lastTime="上周";
        if(isNaN(date4)){
            $("#cho_date1").val(y+"-"+m+"-"+com);
            Eng_end_date=y+"-"+m+"-"+com+" 23:59:59";
            Eng_star_date=y+"-"+m+"-"+com+" 00:00:00";
        }else{
            if(date4<=date5){
                $("#cho_date1").val(y+"-"+m+"-"+d);
                Energy_date=y+"-"+m+"-"+d+" 00:00:00";
                Eng_end_date=y+"-"+m+"-"+d+" 23:59:59";
                Eng_star_date=y+"-"+m+"-"+d+" 00:00:00";
                com=d;
            }else{
                $("#cho_date1").val(yy+"-"+mm+"-"+dd);
                Energy_date=yy+"-"+mm+"-"+dd+" 00:00:00";
                Eng_end_date=yy+"-"+mm+"-"+dd+" 23:59:59";
                Eng_star_date=yy+"-"+mm+"-"+dd+" 00:00:00";
            }
            CreatDate=y+"-"+m+"-"+d+" 00:00:00";
        }
    }
    Energy_DateType=this.type;
    first = true;
    loadAlarms(1);
});
$("#plus1,#minus1").click(function(){
    var r=$("#cho_date1").val();
    console.log(r);
    var arr= r.split("-");
    if(arr.length==1){
        r=arr[0]+"-00-"+"00"+" 00:00:00";
        Energy_date = arr[0]+"-00-"+"00"+" 00:00:00";
        Eng_end_date=arr[0]+"-12-31 23:59:59";
        Eng_star_date=arr[0]+"-00-00 00:00:00";
    }
    if(arr.length==2){
        r=arr[0]+"-"+arr[1]+"-00"+" 00:00:00";
        Energy_date = arr[0]+"-"+arr[1]+"-00"+" 00:00:00";
        Eng_end_date=arr[0]+"-"+arr[1]+"-31"+" 23:59:59";
        Eng_star_date=arr[0]+"-"+arr[1]+"-00"+" 00:00:00";
        var m25=m-1;
        if(m25<10){
            m25="0"+m25
        }else if(m25=="00"){
            m25=12;
            y--;
        }

        //Prev_end_date=arr[0]+"-"+m25+"-31"+" 23:59:59";
        //Prev_start_date=arr[0]+"-"+m25+"-00"+" 00:00:00";
    }
    if(arr.length==3){
        r=arr[0]+"-"+arr[1]+"-"+arr[2]+" 00:00:00";
        Energy_date = arr[0]+"-"+arr[1]+"-"+arr[2]+" 00:00:00";
        Eng_end_date=arr[0]+"-"+arr[1]+"-"+arr[2]+" 23:59:59";
        Eng_star_date=arr[0]+"-"+arr[1]+"-"+arr[2]+" 00:00:00";
    }

    first=true;
    loadAlarms(1);
});
//切换遥测遥信通信告警
$("header>.alarms>li").click(function(){
    $(this).addClass("active").siblings("li").removeClass("active");
    var type =$(this).attr("type");
    if(type==1){
        $("section>p:nth-child(1)").css("visibility","visible");
        $("section>p:nth-child(1)>b:nth-child(1)").click();
        $("section>div:nth-child(2)").show();
        $("section>div:nth-child(3)").hide();
    }else if(type==2){
        $("section>p:nth-child(1)").css("visibility","hidden");
        $("section>div:nth-child(3)").show();
        $("section>div:nth-child(2)").hide();
    }
    first = true;
    loadAlarms(1);
})
//切换全部严重主要普通告警
$("section>p:nth-child(1)>b").click(function(){
    $(this).addClass("active").siblings("b").removeClass("active");
    first = true;
    loadAlarms(1);
})
function outDev(type){
    var str;
    switch(type){
        case 0:str="未配置";break;
        case 1:str="低压进线";break;
        case 2:str="低压出线";break;
        case 3:str="低压母联";break;
        case 6:str="低压反向进线";break;

        case 4:str="低压电容";break;
        case 5:str="低压IPC03";break;
        case 7:str="变压器";break;

        case 8:str="远程核容充电模块";break;
        case 9:str="远程核容有源逆变";break;
        case 10:str="远程核容PLC控制器";break;
        case 11:str="远程核容双向DCDC";break;

        case 12:str="交流输入";break;
        case 13:str="DCDC充电模块";break;
        case 19:str="ACDC充电模块";break;
        case 14:str="蓄电池组";break;
        case 15:str="馈线绝缘监测仪";break;
        case 16:str="直流母线";break;
        case 17:str="母线绝缘监测仪";break;
       
        case 20:str="通信母线";break;
        case 21:str="馈线监测仪";break;

        case 22:str="UPS电源";break;
        case 23:str="馈线支路";break;

        case 24:str="逆变电源";break;

        case 25:str="DCDC通信模块";break;
        case 18:str="ACDC通信模块";break;

        case 26:str="剩余电流集中接地点";break;
        case 27:str="剩余电流馈线支路";break;
        case 28:str="剩余电流长电缆";break;
        case 29:str="RCD设备";break;
        case 30:str="二路输入开关";break;

        default:break;
    }
    return str;
};
//获取告警信息
function loadAlarms(page){
    var types=$("header>.alarms>li.active").attr("type");
    var alarms=$("section>p:nth-child(1)>b.active").attr("about");
    var status=$("header>.alarms>li.active").attr("data-status");
    var devtype=$("#filterDev").val();
    var ob = new Object();
    // ob.stationId = parent.g_strSelStnId;
    ob.pageIndex = parseInt(page);
    ob.num = 10;
    ob.level = parseInt(alarms);//101所有告警，102严重告警，103普通告警
    ob.alarmType = parseInt(types);//1遥信遥测 2通信
    ob.devType = parseInt(devtype);//设备类型
    ob.status = parseInt(status);//区分当前和历史告警
    ob.startTime = Eng_star_date;
    ob.endTime = Eng_end_date;
    ob.userData = parseInt(status);
    ttPage = parseInt(page);
    var json = JSON.stringify(ob);
    console.log(json);
    parent.ccc_lib_reqDataByCmd("",USER_HISTORY_ALARM_GETBYPAGE_V26,json,showAlarms);
}
function showAlarms(id,info,des){
    console.log(des);
    $("#alarmTable tbody>tr").remove();
    $("#TxTable tbody>tr").remove();
    // $("#filterDev").val(0);
    if(des.userData==0){//历史告警
        $("#alarmTable thead th:last-child").show();
        var data=[];
        var len=1;
        (function check(){
            if(des.total%10==0){
                len=parseInt(des.total*0.1);
    
            }else{
                len=parseInt(des.total*0.1)+1;
            }
            data=des.data;
            var k=(ttPage-1)*10;
            for(var i=0;i<data.length;i++){
                var str;
                if(des.data[i].level==1){
                    cla="red";
                    str="重要告警";
                }else if(des.data[i].level==2){
                    cla="orange";
                    str="严重告警";
                }else if(des.data[i].level==3){
                    cla="#74a130";
                    str="一般告警";
                }
                $("#alarmTable tbody").append('<tr data-type="'+data[i].devType+'"  data-id="'+data[i].noteId+'" ><td>'+(k+1)+'</td><td>'+data[i].comment+'</td><td>'+outDev(des.data[i].devType)+'</td><td class="'+cla+'">'+str+'</td><td>'+data[i].startTime+'</td><td>'+data[i].endTime+'</td></tr>');
                k++;
            }
        })();
        if(first==true){
            $('.M-box3').pagination({
                pageCount:len,
                jump:true,
                // coping:true,
                //homePage:'首页',
                //endPage:'末页',
                prevContent:'上页',
                nextContent:'下页'
            });
            first=false;
            // $('.M-box3').on("click","a:not(:last-child)",function(e){
            //     number=$(this).attr("data-page");
            //     if(!isNaN(number)){
            //         loadAlarms(number);
            //     }
            // });
            $(".M-box3").on("click","a.jump-btn",function(e){
                number=$(".M-box3>span.active").html();
                if(!isNaN(number)){
                    loadAlarms(number);
                }
            });
            $(".M-box3").on("click","a.prev",function(e){
                number = parseInt($(".M-box3>span.active").html());
                if(number>0){ loadAlarms(number);}
            });
            $(".M-box3").on("click","a.next",function(e){
                number = parseInt($(".M-box3>span.active").html());
                if(number<len+1){ loadAlarms(number);}
            });
            $('.M-box3').on("click","a",function(e){
                number=$(this).html();
                if(!isNaN(number)){
                    loadAlarms(number);
                }
            });
        }
        var leng=$("#alarmTable tbody>tr").length;
        if(leng<10){
            for(var k=0;k<(10-leng);k++){
                $("#alarmTable tbody").append('<tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>');
            }
        }
    }else if(des.userData==1){//当前告警
        $("#alarmTable thead th:last-child").hide();
        var data=[];
        var len=1;
        (function check(){
            if(des.total%10==0){
                len=parseInt(des.total*0.1);
    
            }else{
                len=parseInt(des.total*0.1)+1;
            }
            data=des.data;
            var k=(ttPage-1)*10;
            for(var i=0;i<data.length;i++){
                var str;
                if(des.data[i].level==1){
                    cla="red";
                    str="重要告警";
                }else if(des.data[i].level==2){
                    cla="orange";
                    str="严重告警";
                }else if(des.data[i].level==3){
                    cla="#74a130";
                    str="一般告警";
                }
                $("#alarmTable tbody").append('<tr data-type="'+data[i].devType+'"  data-id="'+data[i].noteId+'" ><td>'+(k+1)+'</td><td>'+data[i].comment+'</td><td>'+outDev(des.data[i].devType)+'</td><td class="'+cla+'">'+str+'</td><td>'+data[i].startTime+'</td></tr>');
                k++;
            }
        })();
        if(first==true){
            $('.M-box3').pagination({
                pageCount:len,
                jump:true,
                // coping:true,
                //homePage:'首页',
                //endPage:'末页',
                prevContent:'上页',
                nextContent:'下页'
            });
            first=false;
            // $('.M-box3').on("click","a:not(:last-child)",function(e){
            //     number=$(this).attr("data-page");
            //     if(!isNaN(number)){
            //         loadAlarms(number);
            //     }
            // });
            $(".M-box3").on("click","a.jump-btn",function(e){
                number=$(".M-box3>span.active").html();
                if(!isNaN(number)){
                    loadAlarms(number);
                }
            });
            $(".M-box3").on("click","a.prev",function(e){
                number = parseInt($(".M-box3>span.active").html());
                if(number>0){ loadAlarms(number);}
            });
            $(".M-box3").on("click","a.next",function(e){
                number = parseInt($(".M-box3>span.active").html());
                if(number<len+1){ loadAlarms(number);}
            });
            $('.M-box3').on("click","a",function(e){
                number=$(this).html();
                if(!isNaN(number)){
                    loadAlarms(number);
                }
            });
        }
        var leng=$("#alarmTable tbody>tr").length;
        if(leng<10){
            for(var k=0;k<(10-leng);k++){
                $("#alarmTable tbody").append('<tr><td></td><td></td><td></td><td></td><td></td></tr>');
            }
        }
    }else if(des.alarmType==2){
        var data=[];
        var len=1;
        (function check(){
            if(des.total%10==0){
                len=parseInt(des.total*0.1);
            }else{
                len=parseInt(des.total*0.1)+1;
            }
            data=des.data;
            $("#TxTable>tbody>tr").remove();
            var k=(ttPage-1)*10;
            for(var i=0;i<data.length;i++){
                $("#TxTable tbody").append('<tr   data-id="'+data[i].noteId+'" ><td>'+(k+1)+'</td><td>'+data[i].comment+'</td><td>'+data[i].startTime+'</td><td>'+data[i].endTime+'</td></tr>');
    
                k++;
            }
        })();
        if(first==true){
            $('.M-box3').pagination({
                pageCount:len,
                jump:true,
                // coping:true,
                //homePage:'首页',
                //endPage:'末页',
                prevContent:'上页',
                nextContent:'下页'
            });
            first=false;
            $(".M-box3").on("click","a.jump-btn",function(e){
                number=$(".M-box3>span.active").html();
                if(!isNaN(number)){
                    loadAlarms(number);
                }
            });
            $(".M-box3").on("click","a.prev",function(e){
                number = parseInt($(".M-box3>span.active").html());
                if(number>0){ loadAlarms(number);}
            });
            $(".M-box3").on("click","a.next",function(e){
                number = parseInt($(".M-box3>span.active").html());
                if(number<len+1){ loadAlarms(number);}
            });
            $('.M-box3').on("click","a",function(e){
                number=$(this).html();
                if(!isNaN(number)){
                    loadAlarms(number);
                }
            });
        }
        var leng=$("#TxTable tbody>tr").length;
        if(leng<10){
            for(var k=0;k<(10-leng);k++){
                $("#TxTable tbody").append('<tr><td></td><td></td><td></td><td></td></tr>');
            }
        }
    }
   
}
$("section").on("click",".checkOpts>li",function(){
    $(this).addClass("active");
    setTimeout(function(){
        $(".checkOpts").hide();
        $(".checkOpts>li.active").removeClass("active");
    },200);
    var val=$(this).attr("data-value");
    $("select.active").val(val).trigger('change');

})
$("#alarmTable").on("mousedown","select",function(event){
    var ht=$(this).offset().top - $("body").offset().top ;
    $("select").removeClass("active");
    event.preventDefault();
    event.stopPropagation();
    var clone=$("section>.checkOpts").clone();
    clone.attr("type",2);
    //console.log(clone.length);
    $("section > .checkOpts").hide();
 
    var width=200;
    var len=$(this).siblings(".checkOpts").length;
    if(len==1){
        if($(this).next(".checkOpts").css("display")=="none"){
          
            $(".checkOpts>li").remove();
            var adds="";
            $(this).children("option").each(function(i){
                var name=$(this).html();
                var value=$(this).val();
                adds+='<li data-value="'+value+'">'+name+'</li>';
            })
            $(this).next(".checkOpts").append(adds);
            $(this).siblings(".checkOpts").show();
            var htLen = parseInt($(this).next(".checkOpts").height());
            if($(this).attr("id")=="devTypes"){
                $(this).next(".checkOpts").css("max-height","250px");
            }else{
                $(this).next(".checkOpts").css("max-height","150px");
            }
            console.log(ht)
            if(ht<350){
                $(this).next(".checkOpts").css("top","30px");
            }else{
                // if(ht<148){
                //     $(this).next(".checkOpts").css("top","30px");
                // }else{
                    $(this).next(".checkOpts").css("top","-"+(htLen+2)+"px");
                // }
            }
        }else{
            $(this).siblings(".checkOpts").hide();
        }
    }else if(len==0){
        $(".checkOpts[type='2']").remove();
        $(this).after(clone);
        $(this).siblings(".checkOpts").css("width",width).show();
        $(".checkOpts>li").remove();
        var adds="";
        $(this).children("option").each(function(i){
            var name=$(this).html();
            var value=$(this).val();
            adds+='<li data-value="'+value+'">'+name+'</li>';
        })
        $(this).next(".checkOpts").append(adds);
    }
    var htLen = parseInt($(this).next(".checkOpts").height());
    if($(this).attr("id")=="filterDev"){
        $(this).next(".checkOpts").css("max-height","250px");
    }else{
        $(this).next(".checkOpts").css("max-height","150px");
    }
    if(ht<350){
        $(this).next(".checkOpts").css("top","30px");
    }else{
        // if(htLen<148){
            $(this).next(".checkOpts").css("top","30px");
        // }else{

            $(this).next(".checkOpts").css("top","-"+(htLen+2)+"px");
        // }
    }
    $(this).addClass("active");
})
$("#filterDev").change(function(){
     first = true;
     loadAlarms(1);
//     var val =$(this).val();
//     $("#alarmTable tbody>tr.empty").remove();
//     $("#alarmTable tbody>tr").show().removeClass("hides");
//    if(val!=0){
//         $("#alarmTable tbody>tr").hide().addClass("hides");
//         $("#alarmTable tbody>tr[data-type='"+val+"']").show().removeClass("hides");
//     }
//     var noleng=$("#alarmTable tbody>tr.hides").length;
//     var isleng=10-noleng;
//     if(isleng<10){
//         for(var k=0;k<noleng;k++){
//             $("#alarmTable tbody").append('<tr class="empty"><td></td><td></td><td></td><td></td><td></td><td></td></tr>');
//         }
//     }
//     $("#alarmTable tbody>tr[class!='hides']").each(function(i){
//         if(i % 2 != 0){
//             $(this).css("background","rgba(100, 100, 100, 0.2)");
//         }else{
//             $(this).css("background","none");
//         }
//     })
})
//切换告警类型
$("#items").change(function(){
    first=true;
    loadAlarms(1);
})
//导出

var $exportLink = document.getElementById('export');

// $exportLink.addEventListener('click', function(e){
//     var time=$("#cho_date1").val();
//     var arr= time.split("-");
//     var TotalTime="";
//     if(arr.length==1){
//         TotalTime=arr[0]+"年";
//     }else if(arr.length==2){
//         TotalTime=arr[0]+"年"+arr[1]+"月";
//     }else if(arr.length==3){
//         TotalTime=arr[0]+"年"+arr[1]+"月"+arr[2]+"日";
//     }


//     var TBid="alarmTable";
//     //var name="";

//     if(e.target.nodeName === "BUTTON" && e.target.getAttribute('data-type')){
//         tableExport(TBid, '告警列表 ('+TotalTime+') ', e.target.getAttribute('data-type'));
//     }

// }, false);
$("section").on("click",".allCheck",function(){
    $(this).toggleClass("active");
    if($(this).hasClass("active")){
        $(this).parents("table").children("tbody").children("tr").children("td").children("input").prop("checked",true);
    }else{
        $(this).parents("table").children("tbody").children("tr").children("td").children("input").prop("checked",false);
    }
})
$("#alarmTable").on("click","input[type='checkbox']",function(){

    if($(this).prop("checked")){
        $("#alarmTable input[type='checkbox']").not(this).prop("checked",false);
    }else{
        //$("#alarmTable input[type='checkbox']").not(this).prop("checked",true);
    }
})
//点击确定单条告警
$("#export>button:nth-child(1)").click(function(){
    var len=0;
    var id="";
    var type=0;
    $("#alarmTable input[type='checkbox']").each(function(){
        if($(this).prop("checked") == true){
            id=$(this).parent("td").parent("tr").attr("data-id");
            type=parseInt($(this).parent("td").parent("tr").attr("data-type"));
            len++;
            return false;
        }
    })
    console.log(len);
    console.log(id);
    if(len>0 && id){
        var items=parseInt($("#items").val());
        var ob = new Object();
        ob.noteId = id;
        ob.alarmType = type;//0:全部；1:过流；2:欠压；3:过压；4:设备掉线;5:传感器断线；6:漏电流；7:超温
        ob.userData = 0;
        var json = JSON.stringify(ob);
        console.log(json);
        parent.ccc_lib_reqDataByCmd("",USER_ALM_ACK_BYID_V25,json,confirmAlarms);
    }else{
        loadAlerts("请先选中一条告警，然后进行确认操作！");
        return false;
    }
})
function confirmAlarms(id,info,des){
    loadAlerts(des.desc);
    if(des.result==0){
        $("#alarmTable input[type='checkbox']").each(function(){
            if($(this).prop("checked")==true){
                $(this).prop("checked",false);
                $(this).parents("tr").children("td:nth-child(8)").html(parent.g_strUserName);
                return false;
            }
        })
    }
}
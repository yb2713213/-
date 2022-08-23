/**
 * Created by Administrator on 2020-10-19.
 */
 
var echarts=parent.echarts;
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
 var is10S=false;
 var inter;//刷新剩余电流模块
 var reFreshs;//刷新剩余电流模块
 var freshMod;//刷新交直流系统模块
 var DCchangeId;//选中的充电模块id
 var checkedCh;
 var checkedRcd;
function reFreshData(){ 
    var page = parseInt($(".modalBranch .M-box3>span.active").html());
    if(!page){
        page=1;
    }
    if(CheckedDevType==26){
        loadAfterCurModContentAll(1)
    }else if(CheckedDevType==27){
        loadAfterCurModContentAll(2);
    }else if(CheckedDevType==28){
        loadAfterCurModContentAll(3);
    }
}
 $(document).click(function(event){
    is10S=true;
    clearInterval(inter);
    clearInterval(reFreshs);
    let init=0;
    inter = setInterval(function(){
        init++;
        if(init==5){
            clearInterval(inter);
            reFreshData();
            reFreshs=setInterval(function(){
                reFreshData();
            },5000);
        }
    },1000)
 });
function removeInterval(){
    clearInterval(inter);
    clearInterval(reFreshs);
    clearInterval(freshMod);
}
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
 function reloadDate(){
    var date=new Date();
    var y=date.getFullYear();
    var m=date.getMonth()+1;
    var d=date.getDate();
    if(m<10){
        m="0"+m;
    }
    if(d<10){
        d="0"+d;
    }
    Eng_star_date=y+"-"+m+"-"+d+" 00:00:00";
    Eng_end_date=y+"-"+m+"-"+d+" 23:59:59";
    $(".cho_date").val(y+"-"+m+"-"+d);
 }
 //日期插件
 (function(){
     var mydate=date.getTime();
     window.onload=function(){
       
         //ccc_lib_enableByPass(0,1,login_result,noticeCB);
         if(parent.pages==6){
            loadAfterCur();
         }else{
            loadBoxList();
         }
         $(".cho_date").val( y+"-"+m+"-"+d);
         //energy_init();
     };
     $(".minus").click(function(){
         var r=$(".cho_date").val();
         var arr= r.split("-");
         if(arr.length==1){
             y=parseInt(arr[0]);
             y--;
             $(".cho_date").val(y);
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
             $(".cho_date").val(y+"-"+m);
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
             $(".cho_date").val(y+"-"+m+"-"+d);
         }
     });
     $(".plus").click(function(event){
         var r=$(".cho_date").val();
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
                 $(".cho_date").val(y);
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
             $(".cho_date").val(y+"-"+m);
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
             $(".cho_date").val(y+"-"+m+"-"+d);
         }
     });
 })();
 var com;
 //选取日月年
 $(".choose_date a").click(function(e){
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
         $(".cho_date").val(y);
         CreatDate=y+"-00-"+"00"+" 00:00:00";
         Eng_end_date=y+"-12-31 23:59:59";
         Energy_date=CreatDate;
         Eng_star_date=y+"-00-"+"00"+" 00:00:00";
     }else if($(this).attr("type")==3){
         if(date2<=date3){
             $(".cho_date").val(y+"-"+m);
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
             $(".cho_date").val(yy+"-"+mm);
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
             $(".cho_date").val(y+"-"+m+"-"+com);
             Eng_end_date=y+"-"+m+"-"+com+" 23:59:59";
             Eng_star_date=y+"-"+m+"-"+com+" 00:00:00";
         }else{
             if(date4<=date5){
                 $(".cho_date").val(y+"-"+m+"-"+d);
                 Energy_date=y+"-"+m+"-"+d+" 00:00:00";
                 Eng_end_date=y+"-"+m+"-"+d+" 23:59:59";
                 Eng_star_date=y+"-"+m+"-"+d+" 00:00:00";
 
                 com=d;
             }else{
                 $(".cho_date").val(yy+"-"+mm+"-"+dd);
                 Energy_date=yy+"-"+mm+"-"+dd+" 00:00:00";
                 Eng_end_date=yy+"-"+mm+"-"+dd+" 23:59:59";
                 Eng_star_date=yy+"-"+mm+"-"+dd+" 00:00:00";
             }
             CreatDate=y+"-"+m+"-"+d+" 00:00:00";
 
         }
 
     }
     Energy_DateType=this.type;
     first = true;
     if(CheckedDevType ==13 || CheckedDevType ==18|| CheckedDevType ==19|| CheckedDevType ==25){
        $(".fourLine2>a.active").click();
     }else if(CheckedDevType == 26 ||CheckedDevType == 27 ||CheckedDevType == 28){
        $(".loadLineBtn.active").click();
     }else{
        $(".fourLine>a.active").click();
     }
 
 
 });
 $(".plus,.minus").click(function(){
     var r=$(".cho_date").val();
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
     if(CheckedDevType ==13 || CheckedDevType ==18|| CheckedDevType ==19|| CheckedDevType ==25){
        $(".fourLine2>a.active").click();
     }else if(CheckedDevType == 26 ||CheckedDevType == 27 ||CheckedDevType == 28){
        $(".loadLineBtn.active").click();
     }else{
        $(".fourLine>a.active").click();
     }
    
 });
 //切换柜子加载模块
 $(".boxMods").on("click","ul>li.before>div",function(){
     if($(this).parent("li").hasClass("active")){
        $(this).siblings("ul").slideToggle(500);
     }else{
         $(this).parent("li").addClass("active").siblings("li").removeClass("active").children("ul").hide(500);
         $(this).siblings("ul").show(500);
         var id=$(this).attr("about");
         loadModList(id);
         CheckedBox = id;
     }
   
 })
 
 var tims;
 //剩余电流切换菜单
 $(".boxMods").on("click","ul>li.after",function(){
    if($(this).hasClass("active")){
    //    $(this).siblings("ul").slideToggle(500);
        return false;
    }else{
        $(this).addClass("active").siblings("li").removeClass("active");
    }
    var abt = $(this).attr("about");
    first=true;
    checkedCh = 0;
    checkedRcd=0;
    $(".choose_date>a:nth-child(1)").addClass("active").siblings("a").removeClass("active");
    reloadDate();
    $(".loadLineBtn").attr("data-com","").attr("data-addr","").attr("data-ch","").attr("data-type","").attr("data-noteid","").attr("data-rcdid","").removeClass("active");
    if(abt==60010100){//集中接地点
        CheckedDevType = 26;
        $(".modalCenGroundpoint").show().siblings("div").hide();
        var ob = new Object();
        ob.type = 1;
        ob.pageIndex = 0;
        ob.num = 0;
        ob.userData = 1;
        var json = JSON.stringify(ob);
        parent.ccc_lib_reqDataByCmd("",USER_RCD_YCX_GETBYID,json,showAfterModListContent);
        var timeData=[];
        var valueData=[];
        max=1;
        min=0;
        valueUnit="单位(mA)";
        chartLine1(timeData,valueData,"lineCenPointContent");
    }else if(abt==60010200){//馈线支路  
        CheckedDevType = 27;
        $(".modalBranch").show().siblings("div").hide();
        $(".modalBranch .modal1>table>thead").html('<th>柜号</th><th>开关编号</th><th>回路名称</th><th>CT值<br>(mA)</th><th>剩余电流值(mA)</th><th>补偿值(mA)</th>');
        loadAfterCurModContentAll(2);
        var timeData=[];
        var valueData=[];
        max=1;
        min=0;
        valueUnit="单位(mA)";
        chartLine1(timeData,valueData,"longLineContent");
    }else if(abt==60010300){//长电缆
        CheckedDevType = 28;
        $(".modalBranch").show().siblings("div").hide();
        $(".modalBranch .modal1>table>thead").html('<th>柜号</th><th>开关编号</th><th>回路名称</th><th>首端CT值(mA)</th><th>末端CT值(mA)</th><th>剩余电流值(mA)</th>');
        loadAfterCurModContentAll(3);
        var timeData=[];
        var valueData=[];
        max=1;
        min=0;
        valueUnit="单位(mA)";
        chartLine1(timeData,valueData,"longLineContent");
      
    }else if(abt==60010400){//故障录波
        $(".modalFaultRecord").show().siblings("div").hide();
        $(".watchBoll").hide().siblings("ul").show();
          $(".modalFaultRecord .pages").attr("about",1);
        CheckedDevType = 100;
   
        loadAfterCurModContent(4,1);
        var timeData=[];
        var valueData=[];
        max=1;
        min=0;
        chartLine1(timeData,valueData,"recordBolContent");
    }
})
//不分页
function loadAfterCurModContentAll(type){
    var ob = new Object();
    ob.type = parseInt(type);
    ob.pageIndex = 0;
    ob.num = 0;
    ob.userData = parseInt(type);
    console.log(ob);
    var json = JSON.stringify(ob);
    parent.ccc_lib_reqDataByCmd("",USER_RCD_YCX_GETBYID,json,showAfterModListContent);
}
//故障录播分页
function loadAfterCurModContent(type,pages){
    ttPage = pages;
    var ob = new Object();
    ob.type = parseInt(type);
    ob.pageIndex = parseInt(pages);
    ob.num = 15;
    ob.userData = parseInt(type);
    console.log(ob);
    var json = JSON.stringify(ob);
    parent.ccc_lib_reqDataByCmd("",USER_RCD_YCX_GETBYID,json,showAfterModListContent);
}
function showAfterModListContent(id,info,des){
    console.log(des);
    $(".zeroSeqContent .names").html("");
    $(".zeroSeqContent>p>b").html(0);
    $(".zeroSeqContent>p.content").html("");
    $(".modalCenGroundpoint .runs>p:nth-child(1)>u").html(0);
    $(".modalCenGroundpoint .runs>p:nth-child(2)>u").html(0);
    if(des.userData==1){
        $(".modalCenGroundpoint .models>li").remove();
        if(des.data.length>0){
            $(".modalCenGroundpoint .runs>p:nth-child(1)>u").html(des.data[0].maxSurplus);
            $(".modalCenGroundpoint .runs>p:nth-child(2)>u").html(des.data[0].surplusCount);
            var len = (des.data.length>3)?3:des.data.length;
            var htmlStr="";
            for(var i=0;i<len;i++){
                var arr3=((des.data[i].ctValue).toFixed(0)).split("");
                while(arr3.length<5){
                    arr3.unshift("0");
                }
                var strs="";
                for(var m=0;m<arr3.length;m++){
                    strs+='<span>'+arr3[m]+'</span>';
                }
    
                var arr4=((des.data[i].surplusVa).toFixed(0)).split("");
                while(arr4.length<5){
                    arr4.unshift("0");
                }
                var strs2="";
                for(var m=0;m<arr4.length;m++){
                    strs2+='<span>'+arr4[m]+'</span>';
                }
                var  str3="";
                if(des.data[i].isZero==0){
                    str3="否";
                }else{
                    str3="是";
                }
                htmlStr+='<li><p><button class="mybtns">'+des.data[i].rcdAddr+'</button></p><p><b>CT：</b><u>'+strs+' mA</u></p><p><b>剩余电流值：</b><u>'+strs2+' mA</u></p><p><b>点击：</b><button  data-ch="'+des.data[i].passSeq+'" data-type="'+des.data[i].passNum+'" data-com="'+des.data[i].com+'" data-addr="'+des.data[i].addr+'" class="mytbnsSolid loadLineBtn">查看历史曲线</button> </p><p><b>共零：</b><s>'+str3+'</s></p></li>'
                
            }
            $(".modalCenGroundpoint .models").append(htmlStr);
            $(".modalCenGroundpoint .afterCunBtn").attr("data-com",des.data[0].com).attr("data-addr",des.data[0].addr).attr("data-ch",des.data[0].passSeq).attr("data-type",des.data[0].passNum).attr("data-rcdid",des.data[0].rcdId);
        }
      
    }else if(des.userData==2 || des.userData==3){
        let data=[]; 
        data=des.data;
        $(".modalBranch .modal1>table>tbody>tr").remove();
        var htmlStr="";
        for(var i=0;i<data.length;i++){
            var str="";
            if(des.userData==2){
                str='<td>'+data[i].surplusVa+'</td><td>'+data[i].offSetVa+'</td>';
            }else{
                str='<td>'+data[i].CtTail+'</td><td>'+data[i].surplusVa+'</td>';
            }
            htmlStr+='<tr data-surplusCount="'+data[i].surplusCount+'" data-switch="'+data[i].switch+'" data-maxSurplus="'+data[i].maxSurplus+'" about="'+des.userData+'" data-rcdid="'+data[i].rcdId+'" data-id="'+data[i].zeroSeq+'" data-ch="'+des.data[i].passSeq+'" data-type="'+des.data[i].passNum+'" data-com="'+data[i].com+'" data-addr="'+data[i].addr+'"><td>'+(i+1)+'</td><td>'+data[i].onoffName+'</td><td>'+data[i].rcdAddr+'</td><td>'+data[i].ctValue+'</td>'+str+'</tr>';
        }
        $(".modalBranch .modal1>table>tbody").append(htmlStr);
    
        var length=$(".modalBranch .modal1>table>tbody>tr").length;
        for(var m=0;m<15-length;m++){
            $(".modalBranch .modal1>table>tbody").append('<tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>');
        }
        if(checkedCh && checkedRcd){
            $(".modalBranch .modal1>table>tbody>tr[data-ch='"+checkedCh+"'][data-rcdid='"+checkedRcd+"']").addClass("isFirst").click();
        }else{
            $(".modalBranch .modal1>table>tbody>tr:nth-child(1)").addClass("isFirst").click();
        }
    }else if(des.userData==4){
        data=[];
        $(".modalFaultRecord .modal1>table>tbody>tr").remove();
    
        (function check(){
            if(des.total%15==0){
                len=parseInt(des.total / 15);

            }else{
                len=parseInt(des.total / 15)+1;
            }
            $(".modalFaultRecord .pages").attr("data-max",len);
            // $(".modalFaultRecord .pages").attr("about",1);
            data=des.data;
            $(".modalFaultRecord .modal1>table>tbody>tr").remove();
            var k=(ttPage-1)*15;
            var htmlStr="";
            for(var i=0;i<data.length;i++){
                htmlStr+='<tr class="hasData" data-ms="'+data[i].ms+'" data-boxnum="'+data[i].boxName+'" data-time="'+data[i].time+'" about="'+des.userData+'" data-rcdid="'+data[i].rcdId+'" data-type="3" data-noteid="'+data[i].noteId+'" data-passeq="'+des.data[i].passSeq+'"  data-com="'+des.data[i].com+'" data-ch="'+des.data[i].passSeq+'" data-addr="'+des.data[i].addr+'"><td>'+(k+1)+'</td><td>'+data[i].boxName+'</td><td>'+data[i].rcdAddr+'</td><td>'+data[i].time+'</td><td>'+data[i].ms+'</td><td><img src="imgs/clo.png"></td></tr>';
                k++;
            }
            $(".modalFaultRecord .modal1>table>tbody").append(htmlStr);
        })();
        var length=$(".modalFaultRecord .modal1>table>tbody>tr").length;
        for(var m=0;m<15-length;m++){
            $(".modalFaultRecord .modal1>table>tbody").append('<tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>');
        }
        $(".modalFaultRecord .zeroSeqContent>p:nth-child(2)").html("");
        $(".modalFaultRecord .modal1>table>tbody>tr:nth-child(1)").click();
        
    }
}
//点击故障录波首页尾页上下一页
$(".modalFaultRecord .pages a.changePage").click(function(){
    var max=parseInt($("div.pages").attr("data-max"));
    var now=parseInt($("div.pages").attr("about"));
    if($(this).hasClass("first")){
        loadAfterCurModContent(4,1)
        $("div.pages").attr("about",1);
    }else if($(this).hasClass("last")){
        loadAfterCurModContent(4,max);
        $("div.pages").attr("about",max);
    }else if($(this).hasClass("prev")){
        if(now==1){
            return false;
        }else{
            now--;
            loadAfterCurModContent(4,now);
            $("div.pages").attr("about",now);
        }
    }else if($(this).hasClass("next")){
        if(now==max){
            return false;
        }else{
            now++;
            loadAfterCurModContent(4,now);
            $("div.pages").attr("about",now);
        }
    }
})
$(".modalFaultRecord .pages a.allSelected").click(function(){
    $(".modalFaultRecord .modal1>table>tbody>tr.hasData").addClass("chked");
    $(".modalFaultRecord .modal1>table>tbody>tr>td:last-child>img").attr("src","imgs/correct.png");
})
$(".modalFaultRecord .pages a.noSellected").click(function(){
    $(".modalFaultRecord .modal1>table>tbody>tr.hasData").removeClass("chked");
    $(".modalFaultRecord .modal1>table>tbody>tr>td:last-child>img").attr("src","imgs/clo.png");
})
$(".modalFaultRecord .modal1>table>tbody").on("click","tr>td>img",function(event){
    if($(this).parents("tr").hasClass("chked")){
        $(this).parents("tr").removeClass("chked");
        $(this).attr("src","imgs/clo.png");
    }else{  
        $(this).parents("tr").addClass("chked");
        $(this).attr("src","imgs/correct.png");
    }
    event.stopPropagation();
})
//点击批量删除故障录波记录
$(".modalFaultRecord a.delte").click(function(){
    var len = $(".modalFaultRecord .modal1 table>tbody>tr.chked").length;
    if(len>0){
        var ob = new Object();
        ob.type = 1;
        ob.data=[];
        $(".modalFaultRecord .modal1 table>tbody>tr.chked").each(function(){
            var rcdId=$(this).attr("data-rcdid");
            var noteId=$(this).attr("data-noteid");
            var passSeq=$(this).attr("data-passeq");
            var obj={};
            obj.noteId = noteId;
            obj.rcdId = parseInt(rcdId);
            obj.passSeq = parseInt(passSeq);
            ob.data.push(obj);
        })
        ob.userData = 0;
        var json = JSON.stringify(ob);
        parent.ccc_lib_reqDataByCmd("",USER_EXPORT_MULTI_RCD_FILE,json,reDeleteRecord);
    }
    
})
function reDeleteRecord(id,info,des){
    parent.loadAlerts(des.desc);
    $(".modalFaultRecord .pages").attr("about",1);
    loadAfterCurModContent(4,1);
}
//点击批量导出故障录波记录
$(".modalFaultRecord a.derive").click(function(){
    var len = $(".modalFaultRecord .modal1 table>tbody>tr.chked").length;
    if(len>0){
        var ob = new Object();
        ob.type = 2;
        ob.data=[];
        $(".modalFaultRecord .modal1 table>tbody>tr.chked").each(function(){
            var rcdId=$(this).attr("data-rcdid");
            var noteId=$(this).attr("data-noteid");
            var passSeq=$(this).attr("data-passeq");
            var obj={};
            obj.noteId = noteId;
            obj.rcdId = parseInt(rcdId);
            obj.passSeq = parseInt(passSeq);
            ob.data.push(obj);
        })
        ob.userData = 0;
        var json = JSON.stringify(ob);
        parent.ccc_lib_reqDataByCmd("",USER_EXPORT_MULTI_RCD_FILE,json,reDeleteRecord);
    }
    
})
// function reDeriveRecord(id,info,des){
//     loadAlerts(des.desc);
// }
//点击馈线支路、长电缆表格 获取对应的共零通道详情
$(".modalBranch .modal1").on("click","tbody>tr",function(){
    var abt =$(this).attr("about");
    if(!abt){
        return false;
    }
    checkedCh =$(this).attr("data-ch");
    checkedRcd =$(this).attr("data-rcdid");
    
    $(this).addClass("active").siblings("tr").removeClass("active");
    var types =$(this).attr("data-type");
    var swt=$(this).attr("data-switch");
    var strs=(swt==1)?"合":"分";
    $(".modalBranch .zeroSeqContent .status>b").html(strs);
    var zeroSeq = $(this).attr("data-id");
    var maxSurplus = $(this).attr("data-maxSurplus");
    var surplusCount = $(this).attr("data-surplusCount");
    var name =$(this).children("td:nth-child(3)").html();
    $(".modalBranch .zeroSeqContent .names").html(name);
  
    $(".modalBranch .zeroSeqContent>p:nth-child(2)>b").html(maxSurplus);
    $(".modalBranch .zeroSeqContent>p:nth-child(3)>b").html(surplusCount);
    if(types==8){
        $(".modalBranch .zeroSeqContent .status").show();
    }else{
        $(".modalBranch .zeroSeqContent .status").hide();
    }
    if(zeroSeq>0){
        var thisName = $(this).children("td:nth-child(3)").html();
        var str=[];
        $(".modalBranch .modal1>table>tbody>tr[data-id='"+zeroSeq+"']").each(function(i){
            if(i<=2){
                var name=$(this).children("td:nth-child(3)").html();
                str.push(name);
            }
        })
        str=str.filter(item => item != thisName);
        var s = str.join(",");
        // s=s.substring(0,s.length-1);
        $(".modalBranch .zeroSeqContent>p:nth-child(5)").html("<s>*</s>共零关联："+s);
    }else{
        $(".modalBranch .zeroSeqContent>p:nth-child(5)").html("<s>*</s>共零关联：");
    }
   

    var com =$(this).attr("data-com");
    var addr = $(this).attr("data-addr");
 
    var ch = $(this).attr("data-ch");
    var rcdid=$(this).attr("data-rcdid");
    $(".modalBranch .loadLineBtn,.modalBranch .afterCunBtn").attr("data-com",com).attr("data-addr",addr).attr("data-ch",ch).attr("data-type",types).attr("data-rcdid",rcdid);
    $(".modalBranch .loadLineBtn").attr("data-noteid","");
    if($(this).hasClass("isFirst")){
        $(this).removeClass("isFirst");
    }else{
        var timeData=[];
        var valueData=[];
        max=1;
        min=0;
        chartLine1(timeData,valueData,"longLineContent");
    }
    
})
//点击故障录波对应的共零通道详情
$(".modalFaultRecord .modal1").on("click","tbody>tr",function(){
    var abt =$(this).attr("about");
    if(!abt){
        return false;
    }
    $(this).addClass("active").siblings("tr").removeClass("active");
    var type =$(this).attr("about");
    var noteid = $(this).attr("data-noteid");
    var time = $(this).attr("data-time");
    var timeLen = $(this).attr("data-ms");
    time = time?time:"0000-00-00 00:00:00";
    timeLen = timeLen?timeLen:"0";
    var boxnum = $(this).attr("data-boxnum");
    var name = $(this).children("td:nth-child(3)").html();
    $(".watchBoll .bollContent>span:nth-child(1)>b").html(time);
    // $(".watchBoll .bollContent>span:nth-child(2)>b").html(name);
    $(".watchBoll .bollContent>span:nth-child(3)>b").html(boxnum);
    $(".watchBoll .bollContent>span:nth-child(4)>b").html(name);
    $(".watchBoll .bollContent>span:nth-child(2)>b").html(timeLen+"ms");
    
    
    var com =$(this).attr("data-com");
    var addr = $(this).attr("data-addr");
    var types = $(this).attr("data-type");
    var ch = $(this).attr("data-ch");
    $(".modalFaultRecord  .loadLineBtn").attr("data-com",com).attr("data-addr",addr).attr("data-ch",ch).attr("data-type",types).attr("data-noteid",noteid);
    var timeData=[];
    var valueData=[];
    max=1;
    min=0;
    chartLine1(timeData,valueData,"recordBolContent");
})
function showZeroSeqContent(id,info,des){
    if(des.result==0){
        if(des.userData==2 ||des.userData==3){
            var thisName = $(".modalBranch .modal1>table>tbody>tr.active>td:nth-child(3)").html();
            
            $(".modalBranch .zeroSeqContent>p:nth-child(2)>b").html(des.maxSurplus);
            $(".modalBranch .zeroSeqContent>p:nth-child(3)>b").html(des.surplusCount);
            var str=[];
            var len = (des.data.length>3)?3:des.data.length;
            for(var i=0;i<len;i++){
                str.push(des.data[i].rcdAddr);
            }
            str=str.filter(item => item != thisName);
            var s = str.join(",");
            // s=s.substring(0,s.length-1);
            $(".modalBranch .zeroSeqContent>p:nth-child(5)").html("<s>*</s>共零关联："+s);
        }else if(des.userData==4){
            
        }else if(des.userDate==1){
    
        }
    }else{
        $(".loadLineBtn").attr("data-com","").attr("data-addr","").attr("data-ch","").attr("data-type","").attr("data-noteid","").attr("data-rcdid","");
        $(".modalBranch .zeroSeqContent>p:nth-child(5)").html("<s>*</s>共零关联：");
    }
   
}
//获取剩余电流单相曲线
$("#allModContent").on("click",".loadLineBtn",function(){
    $(".loadLineBtn").removeClass("active");
    $(this).addClass("active");
    var type=$(this).attr("data-type");
    var com=$(this).attr("data-com");
    var addr=$(this).attr("data-addr");
    var ch=$(this).attr("data-ch");
    var noteid=$(this).attr("data-noteid");
    if(type==8){
        type=1;
    }else if(type==16){
        type=2;
    }
 
    if(CheckedDevType==100){
        if(!type ||!ch){
            parent.loadAlerts("请先选中一条有效的故障录波记录！")
            return false;
        }
        $(".watchBoll").show().siblings("ul").hide();
        parent.$("#loadIn .back").show().attr("about",3);
        $("#stepLong").val(20).attr("about",1);
        var ob = new Object();
        ob.type = parseInt(type);//曲线类型
        ob.com = 0;
        ob.addr = 0;
        ob.ch = parseInt(ch);
        ob.noteId = noteid?noteid:"";
        ob.startTime = Eng_star_date;//开始日期
        ob.endTime = Eng_end_date;//结束日期
        ob.userData = parseInt(CheckedDevType);
        var json = JSON.stringify(ob);
        parent.ccc_lib_reqDataByCmd("",RCD_CURVE_GETBYID,json,ShowModLine11);//获取
    }else{
        if(!type  ||!ch){
            parent.loadAlerts("请先选中一条有效的记录！")
            return false;
        }
        var ob = new Object();
        ob.type = parseInt(type);//曲线类型
        ob.com = parseInt(com);
        ob.addr = parseInt(addr);
        ob.ch = parseInt(ch);
        ob.noteId = noteid?noteid:"";
        ob.startTime = Eng_star_date;//开始日期
        ob.endTime = Eng_end_date;//结束日期
        ob.userData = parseInt(CheckedDevType);
        var json = JSON.stringify(ob);
        parent.ccc_lib_reqDataByCmd("intType",RCD_CURVE_GETBYID,json,ShowModLine1);//获取
    }
    
})
function hideBall(){
    $(".watchBoll").hide().siblings("ul").show();
    parent.$("#loadIn>b.back").attr("about",2);
}
$(".watchBoll p.names>button").click(function(){
    $(".watchBoll").hide().siblings("ul").show();
})

//切换模块
$(".boxMods").on("click","ul>li>ul>li",function(){
    $(".boxMods>ul>li>ul>li").removeClass("active");
    $(this).addClass("active");
    var recordId=$(this).attr("about");
    CheckMod = recordId;
    var devType=$(this).attr("type");
    CheckedDevType = devType;

    CheckCom = $(this).attr("data-com");
    CheckAddr = $(this).attr("data-addr");
    DCchangeId="";
    $(".choose_date>a:nth-child(1)").click();
    reloadDate();
    load4YInfo(recordId,devType);
    clearInterval(freshMod);
    freshMod = setInterval(function(){
        reFresh4YInfo(recordId,devType);
    },5000); 
 })
 //获取剩余电流菜单
 function loadAfterCur(){
    var ob = new Object();
    ob.type = 60010000;
    ob.userData = 0;
    var json = JSON.stringify(ob);
    parent.ccc_lib_reqDataByCmd("",ACDC_MENU_CONF_LIST,json,showAfterMenuList);
 }
 function showAfterMenuList(id,info,des){
     console.log(des);
     if(des.data.length>0){
        $("#allModContent").show();
    }else{
        $("#allModContent").hide();
    }
    $(".boxMods>ul>li").remove();
    var htmlStr="";
    for(var i=0;i<des.data.length;i++){
       if(des.data[i].enable==1){
            htmlStr+='<li class="after" about="'+des.data[i].code+'"><div><img src="imgs/boxes.png"> '+des.data[i].name+'</div></li>';
       }else{

       }
    }
    $(".boxMods>ul").append(htmlStr);
    setTimeout(function(){
        loadType();
    },5)
    
 }
 function loadType(){
    if(parent.checkedAfterCurType > 0){
        switch (parent.checkedAfterCurType){
            case 26:$(".boxMods>ul>li.after[about='60010100']").click();break;
            case 27:$(".boxMods>ul>li.after[about='60010200']").click();break;
            case 28:$(".boxMods>ul>li.after[about='60010300']").click();break;
            default : break;
        }
    }else{
        $(".boxMods>ul>li.after:nth-child(1)").click();
    }
 }
 //获取柜子列表
function loadBoxList(){
    var ob = new Object();
    // ob.stationId = "4403032021112400201";
    ob.gradeType = parseInt(parent.pages);
    ob.userData = 0;
    var json = JSON.stringify(ob);
    parent.ccc_lib_reqDataByCmd("",USER_STATION_GRADE_LIST_V25,json,reBoxList);
}
var CheckMod,CheckedBox,CheckedDevType,CheckCom,CheckAddr;
function reBoxList(id,info,des){
    console.log(des);
    if(des.data.length<=0){
        $("#allModContent").hide();
    }else{
        $("#allModContent").show();
    }
    (des.data).sort(sortByStr("boxSeq"));
    $(".boxMods>ul>li").remove();
    var htmlStr="";
    for(var i=0;i<des.data.length;i++){
        if(des.data[i].boxId == parent.checkedBoxId){
            CheckedBox = parent.checkedBoxId;
        }
        htmlStr+='<li class="before"><div about="'+des.data[i].boxId+'" ><img src="imgs/boxes.png"> '+des.data[i].name+'</div><ul about="'+des.data[i].boxId+'"></ul></li>';
    }
    $(".boxMods>ul").append(htmlStr);
    if(CheckedBox){
        $(".boxMods>ul>li.before>div[about='"+CheckedBox+"']").click();
    }else{
        $(".boxMods>ul>li.before:nth-child(1)>div").click();
    }
    
}
//获取模块列表
function loadModList(id){
    var ob = new Object();
    ob.boxNo = id;
    ob.userData = 0;
    var json = JSON.stringify(ob);
    console.log(ob);
    parent.ccc_lib_reqDataByCmd("",USER_ELECTRIC_LIST_GETBYID,json,reModList);
}
function reModList(id,info,des){
    console.log(des);
    (des.data).sort(sortByStr("onoffSeq"));
    
    if(des.data.length>0){
        $("ul[about='"+CheckedBox+"']>li").remove();
        var htmlStr="";
        for(var i=0;i<des.data.length;i++){
            if(des.data[i].recordId == parent.checkedModId){
                CheckMod = parent.checkedModId;
            }
            htmlStr+='<li about="'+des.data[i].recordId+'" data-com="'+des.data[i].com+'" data-addr="'+des.data[i].addr+'" type="'+des.data[i].devType+'">'+des.data[i].name+'</li>';
        }
        $("ul[about='"+CheckedBox+"']").append(htmlStr);
        $("ul[about='"+CheckedBox+"']").show();
        if(!CheckMod){
            $("ul[about='"+CheckedBox+"']>li:nth-child(1)").click();
        }else{
            $("ul[about='"+CheckedBox+"']>li[about='"+CheckMod+"']").click();
        }
    }else{
        $("#allModContent>div").hide();
        if(!CheckMod){
            $(".boxMods>ul>li.active").next("li").children("div").click();
        }
    }
}
//获取设备四遥详情
function load4YInfo(id,devType){
    var o = new Object();
    o.type = 0;
    o.recordId = parseInt(id);
    o.userData = parseInt(devType);
    var m_json = JSON.stringify(o);
    parent.ccc_lib_reqDataByCmd("",USER_ELEC_REALTIME_GETBYID,m_json,reShowModInfo);
}
//刷新设备四遥详情
function reFresh4YInfo(id,devType){
    var o = new Object();
    o.type = 0;
    o.recordId = parseInt(id);
    o.userData = parseInt(devType);
    var m_json = JSON.stringify(o);
    parent.ccc_lib_reqDataByCmd("",USER_ELEC_GETBYID,m_json,reModInfo);
}
function sortBy(props) {
    return function(a,b) {
        return a[props] - b[props];
    }
}
function sortByStr(props) {
    return function(a,b) {
        var arr1=a[props].split("");
        var x = 0;
        for(var i=0;i<arr1.length;i++){
            x+=(arr1[i]).charCodeAt();
        }
        var arr2=b[props].split("");
        var y = 0;
        for(var i=0;i<arr2.length;i++){
            y+=(arr2[i]).charCodeAt();
        }
        return x - y;
    }
}
//只允许输入数字
$(".modalIPC").on("input",".IPCyts>ul>li>input",function(){
    var str = $(this).val();
    str = str.replace(/[^\d.]/g,"");
    $(this).val(str);
})
//返回设备四遥详情
function reShowModInfo(id,info,des){
    console.log(des);
    $("#allModContent>div").hide().removeClass("active");
    $(".fourLine>a").remove();
    (des.exist).sort(sortBy("dispSeq"));
    (des.yc).sort(sortBy("disSeq"));
    (des.yx).sort(sortBy("disSeq"));
    $(".modals .runs>p").remove();
    var runs="";
    //运行信息
    for(var i=0;i<des.run.length;i++){
        if(des.run[i].type==1){
            des.run[i].value=(des.run[i].value).toFixed(1);
        }
        runs+="<p><b>"+des.run[i].name+"：</b><u>"+des.run[i].value+"</u> "+des.run[i].unit+"</p>";
    }
    //处理遥测、曲线、运行信息
    if(des.userData==1 || des.userData==2 || des.userData==3 || des.userData==6){//低压进线。低压馈线。低压反向进线。低压母联
        $(".modalInline").show().addClass("active");
        $(".modalInline .runs").append(runs);
        for(var i=0;i<des.yc.length;i++){
            if(des.yc[i].disSeq<=9){//前九个遥测
                var arr3=((des.yc[i].value).toFixed(1)).split("");
                while(arr3.length<6){
                    arr3.unshift("0");
                }
                des.yc[i].arrs=arr3;
            }  
        }
        $(".modalInline .ycs>p>u>span").html(0);
        $(".modalInline .ycs>p:nth-child(-n+3)").hide();
        $(".modalInline .ycs>p>u").css("visibility","hidden");
        $(".modalInline .ycs>p:nth-child(4)").html("");
        for(var i=0;i<des.yc.length;i++){
              var num=0;
                if((des.yc[i].disSeq) % 3 == 0){
                    num=3;
                }else{
                    num = (des.yc[i].disSeq) % 3;
                }
            if(des.yc[i].disSeq<=9 && des.yc[i].disSeq>0){//前九个遥测
                var tts=0;
                if(des.yc[i].disSeq<=3){
                    tts=2;
                }else if(des.yc[i].disSeq>3 && des.yc[i].disSeq<=6){
                    tts=3;
                }else if(des.yc[i].disSeq>6 && des.yc[i].disSeq<=9){
                    tts=4;
                }
                
                for(var m=0;m<des.yc[i].arrs.length;m++){
                    $(".modalInline .ycs>p:nth-child("+num+")>u:nth-child("+tts+")").css("visibility","visible");
                    $(".modalInline .ycs>p:nth-child("+num+")>u:nth-child("+tts+")>span:nth-child("+(m+1)+")").html(des.yc[i].arrs[m]);
                    $(".modalInline .ycs>p:nth-child("+num+")>u:nth-child("+tts+")>b").html(des.yc[i].unit);
                }
            }
            if(des.yc[i].disSeq==1 || des.yc[i].disSeq==4 || des.yc[i].disSeq==7){//第一排有数据
                $(".modalInline .ycs>p:nth-child(1)").show();
            }
            if(des.yc[i].disSeq==2 || des.yc[i].disSeq==5 || des.yc[i].disSeq==8){//二排有数据
                $(".modalInline .ycs>p:nth-child(2)").show();
            }
            if(des.yc[i].disSeq==3 || des.yc[i].disSeq==6 || des.yc[i].disSeq==9){//三排有数据
                $(".modalInline .ycs>p:nth-child(3)").show();
            }
            var val1="0.00";
            var val2="0.00";
            if(des.yc[i].disSeq==10){
                val1=des.yc[i].value?(des.yc[i].value).toFixed(1):"0.00";
                $(".modalInline .ycs>p:nth-child(4)").append('<s>'+des.yc[i].name+'：</s><b>'+val1+'</b><s>'+des.yc[i].unit+'</s>');
            }
            if(des.yc[i].disSeq==11){
                val2=des.yc[i].value?(des.yc[i].value).toFixed(1):"0.00";
                $(".modalInline .ycs>p:nth-child(4)").append('<s>'+des.yc[i].name+'：</s><b>'+val2+'</b><s>'+des.yc[i].unit+'</s>');
            }  
        }     
        if(des.exist.length==0){
            valueData=[];
            timeData=[];
            max=1;min=0;
            chartLine1(timeData,valueData,"lineContent");
        }
        for(var i=0;i<des.exist.length;i++){
            $(".modalInline .fourLine").append('<a data-comment="'+des.exist[i].comment+'" data-unit="' + des.exist[i].unit + '" about="' + des.exist[i].groupId + '">' + des.exist[i].name + '</a>')
        }
        $(".modalInline .fourLine>a:nth-child(1)").click();

       
    }else if(des.userData==5){//ipC
        $(".modalIPC").show().addClass("active");
        for(var i=0;i<des.yc.length;i++){
            var arr3=((des.yc[i].value).toFixed(1)).split("");
            while(arr3.length<6){
                arr3.unshift("0");
            }
            des.yc[i].arrs=arr3;
        }
        $(".modalIPC .ycs>div>div>p>span").html(0);
        for(var i=0;i<des.yc.length;i++){
              var num=0;
                if((des.yc[i].disSeq) % 3 ==0){
                    num=3;
                }else{
                    num = (des.yc[i].disSeq) % 3;
                }
            if(des.yc[i].disSeq<=3 && des.yc[i].disSeq>0){//母线电压
                for(var m=0;m<des.yc[i].arrs.length;m++){
                    $(".modalIPC .ycs .content1>p:nth-child("+num+")>span:nth-child("+(m+2)+")").html(des.yc[i].arrs[m]);
                }
            }else if(des.yc[i].disSeq>3 && des.yc[i].disSeq<=6){//1#进线电压
                for(var m=0;m<des.yc[i].arrs.length;m++){
                    $(".modalIPC .ycs .content2>p:nth-child("+num+")>span:nth-child("+(m+2)+")").html(des.yc[i].arrs[m]);
                }
            }else if(des.yc[i].disSeq>6 && des.yc[i].disSeq<=9){//2#进线电压
                for(var m=0;m<des.yc[i].arrs.length;m++){
                    $(".modalIPC .ycs .content3>p:nth-child("+num+")>span:nth-child("+(m+2)+")").html(des.yc[i].arrs[m]);
                }
            } 
        }   
    }else if(des.userData==4){//电容
        $(".modalCap").show().addClass("active");
        loadGroupInfo();
        for(var i=0;i<des.yc.length;i++){
            if(des.yc[i].disSeq<=6){//电压/电流
                var arr3=((des.yc[i].value).toFixed(1)).split("");
                while(arr3.length<6){
                    arr3.unshift("0");
                }
                des.yc[i].arrs=arr3;
            }else if(des.yc[i].disSeq>6 && des.yc[i].disSeq<=10){//功率因素
                var arr4=((des.yc[i].value).toFixed(2)).split("");
                while(arr4.length<4){
                    arr4.unshift("0");
                }
                des.yc[i].arrs=arr4;
            }  
        }
        $(".modalCap .ycs>p>u>span").html(0);
        for(var i=0;i<des.yc.length;i++){
              var num=0;
                if((des.yc[i].disSeq) % 3 ==0){
                    num=3;
                }else{
                    num = (des.yc[i].disSeq) % 3;
                }
            if(des.yc[i].disSeq<=3 && des.yc[i].disSeq>0){//电压
                for(var m=0;m<des.yc[i].arrs.length;m++){
                    $(".modalCap .ycs>p:nth-child("+num+")>u:nth-child(2)>span:nth-child("+(m+1)+")").html(des.yc[i].arrs[m]);
                }
            }else if(des.yc[i].disSeq>3 && des.yc[i].disSeq<=6){//电流
                for(var m=0;m<des.yc[i].arrs.length;m++){
                    $(".modalCap .ycs>p:nth-child("+num+")>u:nth-child(3)>span:nth-child("+(m+1)+")").html(des.yc[i].arrs[m]);
                }
            }else if(des.yc[i].disSeq>6 && des.yc[i].disSeq<=9){//功率因素
                for(var m=0;m<des.yc[i].arrs.length;m++){
                    $(".modalCap .ycs>p:nth-child("+num+")>u:nth-child(4)>span:nth-child("+(m+1)+")").html(des.yc[i].arrs[m]);
                }
            }else if(des.yc[i].disSeq == 10){
                for(var m=0;m<des.yc[i].arrs.length;m++){
                    $(".modalCap .ycs>p:nth-child(1)>u:nth-child(5)>span:nth-child("+(m+1)+")").html(des.yc[i].arrs[m]);
                }
            }
        }   
    }else if(des.userData==12){//直流交流输入
        $(".modalDCInput").show().addClass("active");
        $(".modalDCInput .ycs1>div>b").html("无");
        $(".modalDCInput .ycs2>div>b").html("无");
        for(var i=0;i<des.yc.length;i++){
            if((des.yc[i].disSeq>0 && des.yc[i].disSeq<=3) || (des.yc[i].disSeq>4 && des.yc[i].disSeq<=7)){//电压
                var arr3=((des.yc[i].value).toFixed(1)).split("");
                while(arr3.length<6){
                    arr3.unshift("0");
                }
                des.yc[i].arrs=arr3;
            }
        }
        $(".modalDCInput .ycs1>p>u>span").html(0);
        $(".modalDCInput .ycs2>p>u>span").html(0);
        for(var i=0;i<des.yc.length;i++){
              var num=0;
                if((des.yc[i].disSeq) % 3 ==0){
                    num=3;
                }else{
                    num = (des.yc[i].disSeq) % 3;
                }
            if(des.yc[i].disSeq<=3 && des.yc[i].disSeq>0){//1#电压
                for(var m=0;m<des.yc[i].arrs.length;m++){
                    $(".modalDCInput .ycs1>p:nth-child("+num+")>u>span:nth-child("+(m+1)+")").html(des.yc[i].arrs[m]);
                }
            }else if(des.yc[i].disSeq>4 && des.yc[i].disSeq<=7){//2#电压
                for(var m=0;m<des.yc[i].arrs.length;m++){
                    $(".modalDCInput .ycs2>p:nth-child("+num+")>u>span:nth-child("+(m+1)+")").html(des.yc[i].arrs[m]);
                }
            }
            var str="无";
            if(des.yc[i].disSeq==4){
                if(des.yc[i].value==1){
                    $(".modalDCInput .ycs1>div>b").html('工作').css("color","red");
                }else{
                    $(".modalDCInput .ycs1>div>b").html('备用').css("color","white");;
                }
            }else if(des.yc[i].disSeq==8){
                if(des.yc[i].value==1){
                    $(".modalDCInput .ycs2>div>b").html('工作').css("color","red");
                }else{
                    $(".modalDCInput .ycs2>div>b").html('备用').css("color","white");;
                }
            }
        }
        if(des.exist.length==0){
            valueData=[];
            timeData=[];
            max=1;min=0;
            chartLine1(timeData,valueData,"DCInpulineContent");
        }
        for(var i=0;i<des.exist.length;i++){
            $(".modalDCInput .fourLine").append('<a data-comment="'+des.exist[i].comment+'" data-unit="' + des.exist[i].unit + '" about="' + des.exist[i].groupId + '">' + des.exist[i].name + '</a>')
        }
        $(".modalDCInput .fourLine>a:nth-child(1)").click();
    }else if(des.userData==14){//直流蓄电池组
        $(".modalDCBattery").show().addClass("active");
        $(".singleBattery>p>a:nth-child(1)").click();
        $(".totalInfo").show().siblings("dive").hide();
        if(des.exist.length==0){
            valueData=[];
            timeData=[];
            max=1;min=0;
            chartLine1(timeData,valueData,"DCBatterylineContent");
        }
        for(var i=0;i<des.exist.length;i++){
            $(".modalDCBattery .fourLine").append('<a data-comment="'+des.exist[i].comment+'" data-unit="' + des.exist[i].unit + '" about="' + des.exist[i].groupId + '">' + des.exist[i].name + '</a>')
        }
        $(".modalDCBattery .fourLine>a:nth-child(1)").click();

        $(".modalDCBattery .batInfos>li").remove();
        for(var i=0;i<des.yc.length;i++){
            if(i<=7){
                if(des.yc[i].disSeq==1){
                    $(".modalDCBattery .totalInfo .leftCap>p>b").html((des.yc[i].value).toFixed(2));
                    var len = (des.yc[i].value)>100?154:(des.yc[i].value)/100 * 154;
                    $(".modalDCBattery .totalInfo .leftCap .less>s").css("height",len +"px");
                }else{
                    if(des.yc[i].dataType==1 || des.yc[i].dataType==3 ||des.yc[i].dataType==9){
                        var val = (des.yc[i].value).toFixed(1);
                        if(des.yc[i].disSeq == 100){
                            val = parseInt(des.yc[i].value);
                        }
                        $(".modalDCBattery .batInfos").append('<li><b>'+des.yc[i].name+'：</b><span>'+val+" "+des.yc[i].unit+'</span></li>');
                    }else{
                        $(".modalDCBattery .batInfos").append('<li><b>'+des.yc[i].name+'：</b><span>'+des.yc[i].unit+'</span></li>');
                    }
                } 
            } 
        }
    }else if(des.userData==13 || des.userData==18 ||des.userData==19 || des.userData==25){//dcdc充电模块//通信模块
        $(".modalDCcharger .runs").html("");
        for(var i=0;i<des.yc.length;i++){
            $(".modalDCcharger .runs").append("<p><b>"+des.yc[i].name+"：</b><u>"+des.yc[i].value+"</u> "+des.yc[i].unit+"</p>");
        }
        var str1,str2;
        if(des.userData==13 || des.userData==19){//充电机     
            $(".modalDCcharger .ycs>div>b:nth-child(1)").html("充电机输出电压：");
            $(".modalDCcharger .ycs>div>b:nth-child(2)").html("充电机输出电流：");
            $(".modalDCcharger .ycs>.title>b").html("充电机总输出");
            $(".modalDCcharger .mods>.title>b").html("充电机信息");
        }else if(des.userData==18 || des.userData==25){//通信模块
            $(".modalDCcharger .ycs>div>b:nth-child(1)").html("通信模块输出电压：");
            $(".modalDCcharger .ycs>div>b:nth-child(2)").html("通信模块输出电流：");
            $(".modalDCcharger .ycs>.title>b").html("遥测");
            $(".modalDCcharger .mods>.title>b").html("通信模块信息");
        }
        $(".modalDCcharger").show().addClass("active");
        for(var i=0;i<des.yc.length;i++){
            var arr3=((des.yc[i].value).toFixed(1)).split("");
            while(arr3.length<6){
                arr3.unshift("0");
            }
            des.yc[i].arrs=arr3;
        }
        if(des.group.length==0){
            valueData=[];
            timeData=[];
            max=1;min=0;
            chartLine1(timeData,valueData,"DCChargerlineContent");
        }
        $(".modalDCcharger .fourLine2>a").remove();
        var len = (des.group.length >=3)?3:des.group.length;
        for(var i=0;i<len;i++){
            $(".modalDCcharger .fourLine2").append('<a data-comment="<1<1>" data-unit="' + des.group[i].unit + '" about="' + des.group[i].pointId + '">' + des.group[i].name + '</a>')
        }
        $(".modalDCcharger .fourLine2>a:nth-child(1)").click();
        // if(des.userData==19){//ACDC充电模块
        loadGroupInfo();
        // }
    }else if(des.userData==16 || des.userData==17){//直流母线、直流母线绝缘监测
        $(".modalDCBus").show().addClass("active");
        if(des.exist.length==0){
            valueData=[];
            timeData=[];
            max=1;min=0;
            chartLine1(timeData,valueData,"DCBuslineContent");
        }
        if(des.exist.length<=3){
            $(".modalDCBus .fourLine").css("text-align","center");
        }else if(des.exist.length>3){
            $(".modalDCBus .fourLine").css("text-align","left");
        }
        for(var i=0;i<des.exist.length;i++){
            $(".modalDCBus .fourLine").append('<a data-comment="'+des.exist[i].comment+'" data-unit="' + des.exist[i].unit + '" about="' + des.exist[i].groupId + '">' + des.exist[i].name + '</a>')
        }
        $(".modalDCBus .fourLine>a:nth-child(1)").click();
        for(var i=0;i<des.yc.length;i++){
            var arr3=((des.yc[i].value).toFixed(1)).split("");
            while(arr3.length<6){
                arr3.unshift("0");
            }
            des.yc[i].arrs=arr3;
        }
        $(".modalDCBus .ycs>p>u").html("");
        if(des.userData==16){
            $(".modalDCBus .ycs>p:nth-child(1)").html("");
            $(".modalDCBus .ycs>p:nth-child(1)").show().siblings("p").hide();
            for(var i=0;i<des.yc.length;i++){
                // var num=des.yc[i].disSeq;
                var str="<u><b title='"+des.yc[i].name+"'>"+des.yc[i].name+"：</b>";
              if(des.yc[i].disSeq<=9){//电压
                  for(var m=0;m<des.yc[i].arrs.length;m++){
                    str+="<span>"+des.yc[i].arrs[m]+"</span>";
                  }
                  str+="<s>"+des.yc[i].unit+"</s></u>";
                  $(".modalDCBus .ycs>p:nth-child(1)").append(str);
              }
             }
        }else if(des.userData==17){
            $(".modalDCBus .ycs>p:nth-child(2)").html("");
            $(".modalDCBus .ycs>p:nth-child(2)").show().siblings("p").hide();
            for(var i=0;i<des.yc.length;i++){
                var num=0;
                var str2="<u><b title='"+des.yc[i].name+"'>"+des.yc[i].name+"：</b>"; 
                if(des.yc[i].disSeq<=9){//
                    for(var m=0;m<des.yc[i].arrs.length;m++){
                        str2+="<span>"+des.yc[i].arrs[m]+"</span>";
                    }
                    str2+="<s>"+des.yc[i].unit+"</s></u>";
                    $(".modalDCBus .ycs>p:nth-child(2)").append(str2);
                }
             }
        }
    }else if(des.userData==15){//直流馈线绝缘监测仪
        $(".modalDCfeeder").show().addClass("active");
        first=true;
        ttPage=1;
        loadGroupInfo();
    }else if(des.userData==21){//通信电源馈线检测仪
        $(".modalDetector").show().addClass("active");
        first=true;
        ttPage=1;
        loadGroupInfo();
    }else if(des.userData==23 ||des.userData==25){//馈线支路 DCDC通信模块
        $(".modalINVfeeder").show().addClass("active");
        $(".modalINVfeeder .runs").append(runs);
        $(".modalINVfeeder .ycsContent>ul>li").html("");
        for(var i=0;i<des.yc.length;i++){
            var arr3=((des.yc[i].value).toFixed(1)).split("");
            while(arr3.length<6){
                arr3.unshift("0");
            }
            des.yc[i].arrs=arr3;
        }
        for(var i=0;i<des.yc.length;i++){
            var num=des.yc[i].disSeq;
            var str="<b>"+des.yc[i].name+"：</b><div>";
          if(des.yc[i].disSeq<=3){
            for(var m=0;m<des.yc[i].arrs.length;m++){
                str+="<span>"+des.yc[i].arrs[m]+"</span>";
            }
            str+="<b>"+des.yc[i].unit+"</b>";
            str+="</div>";
            $(".modalINVfeeder .ycsContent>ul:nth-child(1)>li:nth-child("+num+")").append(str);
          }
         }
         if(des.exist.length==0){
            valueData=[];
            timeData=[];
            max=1;min=0;
            chartLine1(timeData,valueData,"INVfeederContent");
        }
        for(var i=0;i<des.exist.length;i++){
            $(".modalINVfeeder .fourLine").append('<a data-comment="'+des.exist[i].comment+'" data-unit="' + des.exist[i].unit + '" about="' + des.exist[i].groupId + '">' + des.exist[i].name + '</a>')
        }
        $(".modalINVfeeder .fourLine>a:nth-child(1)").click();
    }else if(des.userData==24 || des.userData==22){//逆变电源 ups电源
        $(".modalINVpower").show().addClass("active");
        $(".modalINVpower .runs").append(runs);
        if(des.exist.length==0){
            valueData=[];
            timeData=[];
            max=1;min=0;
            chartLine1(timeData,valueData,"INVPowerlineContent");
        }
        for(var i=0;i<des.exist.length;i++){
            $(".modalINVpower .fourLine").append('<a data-comment="'+des.exist[i].comment+'" data-unit="' + des.exist[i].unit + '" about="' + des.exist[i].groupId + '">' + des.exist[i].name + '</a>')
        }
        $(".modalINVpower .fourLine>a:nth-child(1)").click();
        for(var i=0;i<des.yc.length;i++){
            var arr3=((des.yc[i].value).toFixed(1)).split("");
            while(arr3.length<6){
                arr3.unshift("0");
            }
            des.yc[i].arrs=arr3;
        }
        $(".modalINVpower .ycsContent>ul>li").html("");
        if(des.userData==22){
            $(".modalINVpower .ycsContent>ul:nth-child(3)").show().siblings("ul").hide();
            for(var i=0;i<des.yc.length;i++){
                var num=des.yc[i].disSeq;
                var str="<b>"+des.yc[i].name+"：</b><div>";
              if(des.yc[i].disSeq<=9){
                if(num % 3 ==0){
                    var str="<b>"+des.yc[i].name+"：<s>"+(des.yc[i].value).toFixed(2)+"</s> "+des.yc[i].unit+"</b>";
                    $(".modalINVpower .ycsContent>ul:nth-child(3)>li:nth-child("+num+")").append(str);
                }else{
                    for(var m=0;m<des.yc[i].arrs.length;m++){
                        str+="<span>"+des.yc[i].arrs[m]+"</span>";
                    }
                    str+="<b>"+des.yc[i].unit+"</b>";
                    str+="</div>";
                    $(".modalINVpower .ycsContent>ul:nth-child(3)>li:nth-child("+num+")").append(str);
                }
              }
             }
        }else if(des.userData==24){
            $(".modalINVpower .ycsContent>ul:nth-child(3)").hide().siblings("ul").show();
            for(var i=0;i<des.yc.length;i++){
                var num=des.yc[i].disSeq;
                var str="<b>"+des.yc[i].name+"：</b><div>";
                var str2="<b>"+des.yc[i].name+"：</b>";
                if(des.yc[i].disSeq<=5 && des.yc[i].disSeq>0){//
                    for(var m=0;m<des.yc[i].arrs.length;m++){
                        str+="<span>"+des.yc[i].arrs[m]+"</span>";
                    }
                    str+="<b>"+des.yc[i].unit+"</b>";
                    str+="</div>";
                   
                    $(".modalINVpower .ycsContent>ul:nth-child(1)>li:nth-child("+num+")").append(str);
                }else if(des.yc[i].disSeq>5 && des.yc[i].disSeq<=8){
                    str2+="</b><span>"+(des.yc[i].value).toFixed(2)+"</span><i>"+des.yc[i].unit+"</i>";
                    $(".modalINVpower .ycsContent>ul:nth-child(2)>li:nth-child("+(num-5)+")").append(str2);
                }  
             }
        }
    }else if(des.userData==20){//通信母线
        $(".modalComBus .ycsContent>ul>li").html("");
        $(".modalComBus").show().addClass("active");
        for(var i=0;i<des.yc.length;i++){
            var arr3=((des.yc[i].value).toFixed(1)).split("");
            while(arr3.length<6){
                arr3.unshift("0");
            }
            des.yc[i].arrs=arr3;
        }
        for(var i=0;i<des.yc.length;i++){
            var num=des.yc[i].disSeq;
            var str="<b>"+des.yc[i].name+"：</b><div>";
            if(des.yc[i].disSeq<=2){//
                for(var m=0;m<des.yc[i].arrs.length;m++){
                    str+="<span>"+des.yc[i].arrs[m]+"</span>";
                }
                str+="<b>"+des.yc[i].unit+"</b>";
                str+="</div>";
                $(".modalComBus .ycsContent>ul:nth-child(1)>li:nth-child("+num+")").append(str);
            } 
         }
         if(des.exist.length==0){
            valueData=[];
            timeData=[];
            max=1;min=0;
            chartLine1(timeData,valueData,"ComBuslineContent");
        }
        for(var i=0;i<des.exist.length;i++){
            $(".modalComBus .fourLine").append('<a data-comment="'+des.exist[i].comment+'" data-unit="' + des.exist[i].unit + '" about="' + des.exist[i].groupId + '">' + des.exist[i].name + '</a>')
        }
        $(".modalComBus .fourLine>a:nth-child(1)").click();
    }else if(des.userData==30){//二路输入开关
        $(".modalInputSwitch").show().addClass("active");
        $(".modalInputSwitch .ycs1>div>b").html("无");
        $(".modalInputSwitch .ycs2>div>b").html("无");
        for(var i=0;i<des.yc.length;i++){
            if((des.yc[i].disSeq>0 && des.yc[i].disSeq<=3) || (des.yc[i].disSeq>4 && des.yc[i].disSeq<=7)){//电压
                var arr3=((des.yc[i].value).toFixed(1)).split("");
                while(arr3.length<6){
                    arr3.unshift("0");
                }
                des.yc[i].arrs=arr3;
            }
        }
        $(".modalInputSwitch .ycs1>p>u>span").html(0);
        $(".modalInputSwitch .ycs2>p>u>span").html(0);
        for(var i=0;i<des.yc.length;i++){
              var num=0;
                if((des.yc[i].disSeq) % 3 ==0){
                    num=3;
                }else{
                    num = (des.yc[i].disSeq) % 3;
                }
            if(des.yc[i].disSeq<=3 && des.yc[i].disSeq>0){//1#电压
                for(var m=0;m<des.yc[i].arrs.length;m++){
                    $(".modalInputSwitch .ycs1>p:nth-child("+num+")>u>span:nth-child("+(m+1)+")").html(des.yc[i].arrs[m]);
                }
            }else if(des.yc[i].disSeq>4 && des.yc[i].disSeq<=7){//2#电压
                for(var m=0;m<des.yc[i].arrs.length;m++){
                    $(".modalInputSwitch .ycs2>p:nth-child("+num+")>u>span:nth-child("+(m+1)+")").html(des.yc[i].arrs[m]);
                }
            }
            var str="无";
            if(des.yc[i].disSeq==4){
                if(des.yc[i].value==1){
                    $(".modalInputSwitch .ycs1>div>b").html('合闸').css("color","red");
                }else{
                    $(".modalInputSwitch .ycs1>div>b").html('分闸').css("color","white");
                }
            }else if(des.yc[i].disSeq==8){
                if(des.yc[i].value==1){
                    $(".modalInputSwitch .ycs2>div>b").html('合闸').css("color","red");
                }else{
                    $(".modalInputSwitch .ycs2>div>b").html('分闸').css("color","white");
                }
            }
        }
        if(des.exist.length==0){
            valueData=[];
            timeData=[];
            max=1;min=0;
            chartLine1(timeData,valueData,"InputSwitchContent");
        }
        for(var i=0;i<des.exist.length;i++){
            $(".modalInputSwitch .fourLine").append('<a data-comment="'+des.exist[i].comment+'" data-unit="' + des.exist[i].unit + '" about="' + des.exist[i].groupId + '">' + des.exist[i].name + '</a>')
        }
        $(".modalInputSwitch .fourLine>a:nth-child(1)").click();
    }
    //处理遥信，
    if(des.userData==5){//ipc
        $(".modalIPC .yxs>ul>li").remove();
        for(var i=0;i<des.yx.length;i++){
            var str="";
            var cla="";
            if(des.yx[i].dataType ==5 || des.yx[i].dataType ==7){//开关
                if(des.yx[i].value==0){
                    str='<span class="green">分</span>';
                }else{
                    str='<span class="red">合</span>';
                }
            }else if(des.yx[i].dataType ==2){//告警
                if(des.yx[i].disMode==0){//默认显示
                    if(des.yx[i].value==0){
                        str='<span class="green">正常</span>';
                    }else{
                        str='<span class="red">告警</span>';
                    }
                }else{
                    if(des.yx[i].value==1){
                        str='<span class="red">告警</span>';
                    }else{
                        cla="none";
                    }
                }
               
            }else{//状态                  
                str='<span class="green">'+des.yx[i].unit+'</span>';                   
            }
            $(".modalIPC .yxs>ul").append('<li class="'+cla+'"><b>'+des.yx[i].name+':</b>'+str+'</li>');
        }
    }else{
        $(".modals .yxs>p").remove();
        $(".modals .yxs>ul>li").remove();
        for(var i=0;i<des.yx.length;i++){
            var str="";
            var cla="";
            if(des.yx[i].dataType ==5 || des.yx[i].dataType ==7){//开关
                if(des.yx[i].value==0){
                    str='<span class="green">分</span>';
                }else{
                    str='<span class="red">合</span>';
                }
            }else if(des.yx[i].dataType ==2){//告警
                if(des.yx[i].disMode==0){//默认显示
                    if(des.yx[i].value==0){
                        str='<span class="green">!</span>';
                    }else{
                        str='<span class="red">!</span>';
                    }
                }else{
                    if(des.yx[i].value==1){
                        str='<span class="red">!</span>';
                    }else{
                        cla="none";
                    }
                }
            }else{//状态  
                    str='<s class="green">'+des.yx[i].unit+'</s>';
            }
            $(".modals.active .yxs").append('<p class="'+cla+'"><b>'+des.yx[i].name+'：</b>'+str+'</p>');
        }
    }                                                                                                                                              
    //处理遥控,遥调
    if(des.userData==4){//电容
        $(".modalCap .yks").html("");
        var str="";
        for(var i=0;i<1;i++){
            if(des.yk[i].notUseName==0){//显示名称
                str+="<b>"+des.yk[i].name+"：</b>";
            }else{
                str+="<b></b>"; 
            }
            var arr = (des.yk[i].exeResult).split(">");
            for(var k=0;k<arr.length;k++){
                if(arr[k].length>0){
                    var marr=arr[k].split("<");
                    var cla="";
                    if(des.yk[i].value==marr[0]){
                        cla="red nows";
                    }else {
                        if(marr[3]==1){
                            cla="blue";
                        }else if(marr[3]==2){
                            cla="green";
                        }else if(marr[3]==3){
                            cla="orange";
                        }
                    }
                    str+="<a data-value='"+marr[1]+"' data-pointSeq='"+des.yk[i].pointSeq+"' data-com='"+des.yk[i].com+"' data-checkvalue='"+marr[0]+"' data-number='"+des.yk[i].number+"' data-addr='"+des.yk[i].addr+"' data-refresh='"+des.yk[i].refresh+"' data-delay='"+des.yk[i].delay+"' class='ykBtn "+cla+"'>"+marr[2]+"</a>";
                }
            }
        }
        $(".modalCap .yks").append(str);
    }else if(des.userData==5){//ipc
        $(".IPCyts>ul>li").remove();
        var str="";
        for(var i=0;i<des.yt.length;i++){
            str+='<li><b>'+des.yt[i].name+'：</b><s type="text" data-pointSeq="'+des.yt[i].pointSeq+'" data-addr="'+des.yt[i].addr+'" data-checkvalue="'+des.yt[i].value+'" data-number="'+des.yt[i].number+'" data-com="'+des.yt[i].com+'" data-refresh="'+des.yt[i].refresh+'" data-delay="'+des.yt[i].delay+'" data-value="'+des.yt[i].value+'">'+(des.yt[i].value).toFixed(2)+'</s><span>'+des.yt[i].unit+'</span></li>';
        }
        $(".IPCyts>ul").append(str);
        ///ipc遥控
        $(".IPCyks>li>div").html("");
        $(".IPCyks>li>ul>li").remove();
         var str="";
         var str2="";
         var str3="";
         var str4="";
         var str5="";
         for(var i=0;i<des.yk.length;i++){
             if(des.yk[i].Area==1){
                str+="<p>";
                if(des.yk[i].notUseName==0){//显示名称
                    str+="<b>"+des.yk[i].name+"：</b>";
                }else{
                    str+="<b></b>"; 
                }
                var arr = (des.yk[i].exeResult).split(">");
                for(var k=0;k<arr.length;k++){
                    if(arr[k].length>0){
                        var marr=arr[k].split("<");
                        var cla="";
                        if(des.yk[i].value==marr[0]){
                            cla="red nows";
                        }else {
                            if(marr[3]==1){
                                cla="blue";
                            }else if(marr[3]==2){
                                cla="green";
                            }else if(marr[3]==3){
                                cla="orange";
                            }
                        }
                        str+="<a data-value='"+marr[1]+"' data-pointSeq='"+des.yk[i].pointSeq+"' data-com='"+des.yk[i].com+"' data-checkvalue='"+marr[0]+"' data-number='"+des.yk[i].number+"' data-addr='"+des.yk[i].addr+"' data-refresh='"+des.yk[i].refresh+"' data-delay='"+des.yk[i].delay+"' class='"+cla+" ykBtn'>"+marr[2]+"</a>";
                    }
                }
                str+="</p>";
             }else if(des.yk[i].Area==2){
                str2+="<p>";
                if(des.yk[i].notUseName==0){//显示名称
                    str2+="<b>"+des.yk[i].name+"：</b>";
                }else{
                    str2+="<b></b>"; 
                }
                var arr = (des.yk[i].exeResult).split(">");
                for(var k=0;k<arr.length;k++){
                    if(arr[k].length>0){
                        var marr=arr[k].split("<");
                        var cla="";
                        if(des.yk[i].value==marr[0]){
                            cla="red nows";
                        }else {
                            if(marr[3]==1){
                                cla="blue";
                            }else if(marr[3]==2){
                                cla="green";
                            }else if(marr[3]==3){
                                cla="orange";
                            }
                        }
                        str2+="<a data-value='"+marr[1]+"' data-pointSeq='"+des.yk[i].pointSeq+"' data-com='"+des.yk[i].com+"' data-checkvalue='"+marr[0]+"' data-number='"+des.yk[i].number+"' data-addr='"+des.yk[i].addr+"' data-refresh='"+des.yk[i].refresh+"' data-delay='"+des.yk[i].delay+"' class='"+cla+" ykBtn'>"+marr[2]+"</a>";
                    }
                }
                str2+="</p>";
             }else if(des.yk[i].Area==3){
                str3+="<p>";
                if(des.yk[i].notUseName==0){//显示名称
                    str3+="<b>"+des.yk[i].name+"：</b>";
                }else{
                    str3+="<b></b>"; 
                }
                var arr = (des.yk[i].exeResult).split(">");
                for(var k=0;k<arr.length;k++){
                    if(arr[k].length>0){
                        var marr=arr[k].split("<");
                        var cla="";
                        if(des.yk[i].value==marr[0]){
                            cla="red nows";
                        }else {
                            if(marr[3]==1){
                                cla="blue";
                            }else if(marr[3]==2){
                                cla="green";
                            }else if(marr[3]==3){
                                cla="orange";
                            }
                        }
                        str3+="<a data-value='"+marr[1]+"' data-pointSeq='"+des.yk[i].pointSeq+"' data-com='"+des.yk[i].com+"' data-checkvalue='"+marr[0]+"' data-number='"+des.yk[i].number+"' data-addr='"+des.yk[i].addr+"' data-refresh='"+des.yk[i].refresh+"' data-delay='"+des.yk[i].delay+"' class='"+cla+" ykBtn'>"+marr[2]+"</a>";
                    }
                }
                str3+="</p>";
            }else if(des.yk[i].Area==4){
                str4+="<p>";
                if(des.yk[i].notUseName==0){//显示名称
                    str4+="<b>"+des.yk[i].name+"：</b>";
                }else{
                    str4+="<b></b>"; 
                }
                var arr = (des.yk[i].exeResult).split(">");
                for(var k=0;k<arr.length;k++){
                    if(arr[k].length>0){
                        var marr=arr[k].split("<");
                        var cla="";
                        if(des.yk[i].value==marr[0]){
                            cla="red nows";
                        }else {
                            if(marr[3]==1){
                                cla="blue";
                            }else if(marr[3]==2){
                                cla="green";
                            }else if(marr[3]==3){
                                cla="orange";
                            }
                        }
                        str4+="<a data-value='"+marr[1]+"' data-pointSeq='"+des.yk[i].pointSeq+"' data-com='"+des.yk[i].com+"' data-checkvalue='"+marr[0]+"' data-number='"+des.yk[i].number+"' data-addr='"+des.yk[i].addr+"' data-refresh='"+des.yk[i].refresh+"' data-delay='"+des.yk[i].delay+"' class='"+cla+" ykBtn'>"+marr[2]+"</a>";
                    }
                }
                str4+="</p>";
            }
         }
         $(".IPCyks>li:nth-child(1)>div:nth-child(1)").append(str);
         $(".IPCyks>li:nth-child(1)>div:nth-child(2)").append(str2);
         $(".IPCyks>li:nth-child(2)>div").append(str3);
         $(".IPCyks>li:nth-child(3)>div").append(str4);
    }else if(des.userData==1 || des.userData==2 || des.userData==3 || des.userData==6){//低压进线。低压馈线。低压反向进线。低压母联
         $(".modalInline .yks>p").remove();
         var str="";
         for(var i=0;i<des.yk.length;i++){
             str+="<p>";
             if(des.yk[i].notUseName==0){//显示名称
                 str+="<b>"+des.yk[i].name+"</b>";
             }else{
                 str+="<b></b>"; 
             }
             var arr = (des.yk[i].exeResult).split(">");
             for(var k=0;k<arr.length;k++){
                 if(arr[k].length>0){
                     var marr=arr[k].split("<");
                     var cla="";
                     if(des.yk[i].value==marr[0]){
                         cla="red nows";
                     }else {
                         if(marr[3]==1){
                             cla="blue";
                         }else if(marr[3]==2){
                             cla="green";
                         }else if(marr[3]==3){
                             cla="orange";
                         }
                     }
                     str+="<a data-value='"+marr[1]+"' data-pointSeq='"+des.yk[i].pointSeq+"' data-com='"+des.yk[i].com+"' data-checkvalue='"+marr[0]+"' data-number='"+des.yk[i].number+"' data-addr='"+des.yk[i].addr+"' data-refresh='"+des.yk[i].refresh+"' data-delay='"+des.yk[i].delay+"' class='"+cla+" ykBtn'>"+marr[2]+"</a>";
                 }
             }
             str+="</p>";
         }
         $(".modalInline .yks").append(str);
    }else if(des.userData==30){//二路输入开关
        $(".modalInputSwitch .yks>p").remove();
        var str="";
        for(var i=0;i<des.yk.length;i++){
            str+="<p>";
            if(des.yk[i].notUseName==0){//显示名称
                str+="<b>"+des.yk[i].name+"</b>";
            }else{
                str+="<b></b>"; 
            }
            var arr = (des.yk[i].exeResult).split(">");
            for(var k=0;k<arr.length;k++){
                if(arr[k].length>0){
                    var marr=arr[k].split("<");
                    var cla="";
                    if(des.yk[i].value==marr[0]){
                        cla="red nows";
                    }else {
                        if(marr[3]==1){
                            cla="blue";
                        }else if(marr[3]==2){
                            cla="green";
                        }else if(marr[3]==3){
                            cla="orange";
                        }
                    }
                    str+="<a data-value='"+marr[1]+"' data-pointSeq='"+des.yk[i].pointSeq+"' data-com='"+des.yk[i].com+"' data-checkvalue='"+marr[0]+"' data-number='"+des.yk[i].number+"' data-addr='"+des.yk[i].addr+"' data-refresh='"+des.yk[i].refresh+"' data-delay='"+des.yk[i].delay+"' class='"+cla+" ykBtn'>"+marr[2]+"</a>";
                }
            }
            str+="</p>";
        }
        $(".modalInputSwitch .yks").append(str);
   }
}
//刷新设备四遥数据
function reModInfo(id,info,des){
    console.log(des);
    (des.yc).sort(sortBy("disSeq"));
    (des.yx).sort(sortBy("disSeq"));
    $(".modals .runs>p").remove();
    var runs="";
    //运行信息
    for(var i=0;i<des.run.length;i++){
        if(des.run[i].type==1){
            des.run[i].value=(des.run[i].value).toFixed(1);
        }
        runs+="<p><b>"+des.run[i].name+"：</b><u>"+des.run[i].value+"</u> "+des.run[i].unit+"</p>";
    }
    //处理遥测、曲线、运行信息
    if(des.userData==1 || des.userData==2 || des.userData==3 || des.userData==6){//低压进线。低压馈线。低压反向进线。低压母联
        $(".modalInline .runs").append(runs);
        for(var i=0;i<des.yc.length;i++){
            if(des.yc[i].disSeq<=9){//前九个遥测
                var arr3=((des.yc[i].value).toFixed(1)).split("");
                while(arr3.length<6){
                    arr3.unshift("0");
                }
                des.yc[i].arrs=arr3;
            }  
        }
        for(var i=0;i<des.yc.length;i++){
            var num=0;
            if((des.yc[i].disSeq) % 3 ==0){
                num=3;
            }else{
                num = (des.yc[i].disSeq) % 3;
            }
            if(des.yc[i].disSeq<=9 && des.yc[i].disSeq>0){//前九个遥测
                var tts=0;
                if(des.yc[i].disSeq<=3){
                    tts=2;
                }else if(des.yc[i].disSeq>3 && des.yc[i].disSeq<=6){
                    tts=3;
                }else if(des.yc[i].disSeq>6 && des.yc[i].disSeq<=9){
                    tts=4;
                }
                for(var m=0;m<des.yc[i].arrs.length;m++){
                    $(".modalInline .ycs>p:nth-child("+num+")>u:nth-child("+tts+")>span:nth-child("+(m+1)+")").html(des.yc[i].arrs[m]);
                }
            }
            var val1="0.00";
            var val2="0.00";
            if(des.yc[i].disSeq==10){
                val1=des.yc[i].value?(des.yc[i].value).toFixed(1):"0.00";
                $(".modalInline .ycs>p:nth-child(4)>b:nth-child(2)").html(val1);
            }
            if(des.yc[i].disSeq==11){
                val2=des.yc[i].value?(des.yc[i].value).toFixed(1):"0.00";
                $(".modalInline .ycs>p:nth-child(4)>b:nth-child(5)").html(val2);
            }  
        }         
    }else if(des.userData==5){//ipC
        for(var i=0;i<des.yc.length;i++){
            var arr3=((des.yc[i].value).toFixed(1)).split("");
            while(arr3.length<6){
                arr3.unshift("0");
            }
            des.yc[i].arrs=arr3;
        }
        $(".modalIPC .ycs>div>div>p>span").html(0);
        for(var i=0;i<des.yc.length;i++){
              var num=0;
                if((des.yc[i].disSeq) % 3 ==0){
                    num=3;
                }else{
                    num = (des.yc[i].disSeq) % 3;
                }
            if(des.yc[i].disSeq<=3 && des.yc[i].disSeq>0){//母线电压
                for(var m=0;m<des.yc[i].arrs.length;m++){
                    $(".modalIPC .ycs .content1>p:nth-child("+num+")>span:nth-child("+(m+2)+")").html(des.yc[i].arrs[m]);
                }
            }else if(des.yc[i].disSeq>3 && des.yc[i].disSeq<=6){//1#进线电压
                for(var m=0;m<des.yc[i].arrs.length;m++){
                    $(".modalIPC .ycs .content2>p:nth-child("+num+")>span:nth-child("+(m+2)+")").html(des.yc[i].arrs[m]);
                }
            }else if(des.yc[i].disSeq>6 && des.yc[i].disSeq<=9){//2#进线电压
                for(var m=0;m<des.yc[i].arrs.length;m++){
                    $(".modalIPC .ycs .content3>p:nth-child("+num+")>span:nth-child("+(m+2)+")").html(des.yc[i].arrs[m]);
                }
            } 
        }   
    }else if(des.userData==4){//电容
        loadGroupInfo();
        for(var i=0;i<des.yc.length;i++){
            if(des.yc[i].disSeq<=6){//电压/电流
                var arr3=((des.yc[i].value).toFixed(1)).split("");
                while(arr3.length<6){
                    arr3.unshift("0");
                }
                des.yc[i].arrs=arr3;
            }else if(des.yc[i].disSeq>6 && des.yc[i].disSeq<=10){//功率因素
                var arr4=((des.yc[i].value).toFixed(2)).split("");
                while(arr4.length<4){
                    arr4.unshift("0");
                }
                des.yc[i].arrs=arr4;
            }  
        }
        $(".modalCap .ycs>p>u>span").html(0);
        for(var i=0;i<des.yc.length;i++){
              var num=0;
                if((des.yc[i].disSeq) % 3 ==0){
                    num=3;
                }else{
                    num = (des.yc[i].disSeq) % 3;
                }
            if(des.yc[i].disSeq<=3 && des.yc[i].disSeq>0){//电压
                for(var m=0;m<des.yc[i].arrs.length;m++){
                    $(".modalCap .ycs>p:nth-child("+num+")>u:nth-child(2)>span:nth-child("+(m+1)+")").html(des.yc[i].arrs[m]);
                }
            }else if(des.yc[i].disSeq>3 && des.yc[i].disSeq<=6){//电流
                for(var m=0;m<des.yc[i].arrs.length;m++){
                    $(".modalCap .ycs>p:nth-child("+num+")>u:nth-child(3)>span:nth-child("+(m+1)+")").html(des.yc[i].arrs[m]);
                }
            }else if(des.yc[i].disSeq>6 && des.yc[i].disSeq<=9){//功率因素
                for(var m=0;m<des.yc[i].arrs.length;m++){
                    $(".modalCap .ycs>p:nth-child("+num+")>u:nth-child(4)>span:nth-child("+(m+1)+")").html(des.yc[i].arrs[m]);
                }
            }else if(des.yc[i].disSeq == 10){
                for(var m=0;m<des.yc[i].arrs.length;m++){
                    $(".modalCap .ycs>p:nth-child(1)>u:nth-child(5)>span:nth-child("+(m+1)+")").html(des.yc[i].arrs[m]);
                }
            }
        }   
    }else if(des.userData==12){//直流交流输入
        $(".modalDCInput .ycs1>div>b").html("无");
        $(".modalDCInput .ycs2>div>b").html("无");
        for(var i=0;i<des.yc.length;i++){
            if((des.yc[i].disSeq>0 && des.yc[i].disSeq<=3) || (des.yc[i].disSeq>4 && des.yc[i].disSeq<=7)){//电压
                var arr3=((des.yc[i].value).toFixed(1)).split("");
                while(arr3.length<6){
                    arr3.unshift("0");
                }
                des.yc[i].arrs=arr3;
            }
        }
        $(".modalDCInput .ycs1>p>u>span").html(0);
        $(".modalDCInput .ycs2>p>u>span").html(0);
        for(var i=0;i<des.yc.length;i++){
              var num=0;
                if((des.yc[i].disSeq) % 3 ==0){
                    num=3;
                }else{
                    num = (des.yc[i].disSeq) % 3;
                }
            if(des.yc[i].disSeq<=3 && des.yc[i].disSeq>0){//1#电压
                for(var m=0;m<des.yc[i].arrs.length;m++){
                    $(".modalDCInput .ycs1>p:nth-child("+num+")>u>span:nth-child("+(m+1)+")").html(des.yc[i].arrs[m]);
                }
            }else if(des.yc[i].disSeq>4 && des.yc[i].disSeq<=7){//2#电压
                for(var m=0;m<des.yc[i].arrs.length;m++){
                    $(".modalDCInput .ycs2>p:nth-child("+num+")>u>span:nth-child("+(m+1)+")").html(des.yc[i].arrs[m]);
                }
            }
            var str="无";
            if(des.yc[i].disSeq==4){
                if(des.yc[i].value==1){
                    $(".modalDCInput .ycs1>div>b").html('工作').css("color","red");
                }else{
                    $(".modalDCInput .ycs1>div>b").html('备用').css("color","white");
                }
            }else if(des.yc[i].disSeq==8){
                if(des.yc[i].value==1){
                    $(".modalDCInput .ycs2>div>b").html('工作').css("color","red");
                }else{
                    $(".modalDCInput .ycs2>div>b").html('备用').css("color","white");;
                }
            }
        }     
    }else if(des.userData==14){//直流蓄电池组
        $(".modalDCBattery .batInfos>li").remove();
        for(var i=0;i<des.yc.length;i++){
            if(i<=7){
                if(des.yc[i].disSeq==1){
                    $(".modalDCBattery .totalInfo .leftCap>p>b").html((des.yc[i].value).toFixed(2));
                    var len = (des.yc[i].value)>100?154:(des.yc[i].value)/100 * 154;
                    $(".modalDCBattery .totalInfo .leftCap .less>s").css("height",len +"px");
                }else{
                    if(des.yc[i].dataType==1 || des.yc[i].dataType==3 ||des.yc[i].dataType==9){
                        var val = (des.yc[i].value).toFixed(1);
                        if(des.yc[i].disSeq == 100){
                            val = parseInt(des.yc[i].value);
                        }
                        $(".modalDCBattery .batInfos").append('<li><b>'+des.yc[i].name+'：</b><span>'+val+" "+des.yc[i].unit+'</span></li>');
                    }else{
                        $(".modalDCBattery .batInfos").append('<li><b>'+des.yc[i].name+'：</b><span>'+des.yc[i].unit+'</span></li>');
                    }
                } 
            } 
        }
    }else if(des.userData==13 || des.userData==18 ||des.userData==19 || des.userData==25){//dcdc充电模块//通信模块
        $(".modalDCcharger .runs").html("");
        for(var i=0;i<des.yc.length;i++){
            $(".modalDCcharger .runs").append("<p><b>"+des.yc[i].name+"：</b><u>"+des.yc[i].value+"</u> "+des.yc[i].unit+"</p>");
        }
       
        var str1,str2;
        if(des.userData==13 || des.userData==19){//充电机     
            $(".modalDCcharger .ycs>div>b:nth-child(1)").html("充电机输出电压：");
            $(".modalDCcharger .ycs>div>b:nth-child(2)").html("充电机输出电流：");
            $(".modalDCcharger .ycs>.title>b").html("充电机总输出");
            $(".modalDCcharger .mods>.title>b").html("充电机信息");
        }else if(des.userData==18 || des.userData==25){//通信模块
            $(".modalDCcharger .ycs>div>b:nth-child(1)").html("通信模块输出电压：");
            $(".modalDCcharger .ycs>div>b:nth-child(2)").html("通信模块输出电流：");
            $(".modalDCcharger .ycs>.title>b").html("遥测");
            $(".modalDCcharger .mods>.title>b").html("通信模块信息");
        }
        for(var i=0;i<des.yc.length;i++){
            var arr3=((des.yc[i].value).toFixed(1)).split("");
            while(arr3.length<6){
                arr3.unshift("0");
            }
            des.yc[i].arrs=arr3;
        }        
      
        loadGroupInfo();
    }else if(des.userData==16 || des.userData==17){//直流母线、直流母线绝缘监测
        for(var i=0;i<des.yc.length;i++){
            var arr3=((des.yc[i].value).toFixed(1)).split("");
            while(arr3.length<6){
                arr3.unshift("0");
            }
            des.yc[i].arrs=arr3;
        }
        $(".modalDCBus .ycs>p>u").html("");
        if(des.userData==16){
            $(".modalDCBus .ycs>p:nth-child(1)").html("");
            $(".modalDCBus .ycs>p:nth-child(1)").show().siblings("p").hide();
            for(var i=0;i<des.yc.length;i++){
                // var num=des.yc[i].disSeq;
                var str="<u><b title='"+des.yc[i].name+"'>"+des.yc[i].name+"：</b>";
              if(des.yc[i].disSeq<=9){//电压
                  for(var m=0;m<des.yc[i].arrs.length;m++){
                    str+="<span>"+des.yc[i].arrs[m]+"</span>";
                  }
                  str+="<s>"+des.yc[i].unit+"</s></u>";
                  $(".modalDCBus .ycs>p:nth-child(1)").append(str);
              }
             }
        }else if(des.userData==17){
            $(".modalDCBus .ycs>p:nth-child(2)").html("");
            $(".modalDCBus .ycs>p:nth-child(2)").show().siblings("p").hide();
            for(var i=0;i<des.yc.length;i++){
                var num=0;
                var str2="<u><b title='"+des.yc[i].name+"'>"+des.yc[i].name+"：</b>"; 
                if(des.yc[i].disSeq<=9){//
                    for(var m=0;m<des.yc[i].arrs.length;m++){
                        str2+="<span>"+des.yc[i].arrs[m]+"</span>";
                    }
                    str2+="<s>"+des.yc[i].unit+"</s></u>";
                    $(".modalDCBus .ycs>p:nth-child(2)").append(str2);
                }
             }
        }
    }else if(des.userData==15){//直流馈线绝缘监测仪
       
        loadGroupInfo();
    }else if(des.userData==21){//通信电源馈线检测仪
      
        loadGroupInfo();
    }else if(des.userData==23 ||des.userData==25){//馈线支路 DCDC通信模块
        $(".modalINVfeeder .ycsContent>ul>li").html("");
        $(".modalINVfeeder .runs").append(runs);
        for(var i=0;i<des.yc.length;i++){
            var arr3=((des.yc[i].value).toFixed(1)).split("");
            while(arr3.length<6){
                arr3.unshift("0");
            }
            des.yc[i].arrs=arr3;
        }
        for(var i=0;i<des.yc.length;i++){
            var num=des.yc[i].disSeq;
            var str="<b>"+des.yc[i].name+"：</b><div>";
          if(des.yc[i].disSeq<=3){
            for(var m=0;m<des.yc[i].arrs.length;m++){
                str+="<span>"+des.yc[i].arrs[m]+"</span>";
            }
            str+="<b>"+des.yc[i].unit+"</b>";
            str+="</div>";
            $(".modalINVfeeder .ycsContent>ul:nth-child(1)>li:nth-child("+num+")").append(str);
          }
         }
       
    }else if(des.userData==24 || des.userData==22){//逆变电源 ups电源
        $(".modalINVpower .runs").append(runs);
        for(var i=0;i<des.yc.length;i++){
            var arr3=((des.yc[i].value).toFixed(1)).split("");
            while(arr3.length<6){
                arr3.unshift("0");
            }
            des.yc[i].arrs=arr3;
        }
        $(".modalINVpower .ycsContent>ul>li").html("");
        if(des.userData==22){
            $(".modalINVpower .ycsContent>ul:nth-child(3)").show().siblings("ul").hide();
            for(var i=0;i<des.yc.length;i++){
                var num=des.yc[i].disSeq;
                var str="<b>"+des.yc[i].name+"：</b><div>";
              if(des.yc[i].disSeq<=9){
                if(num % 3 ==0){
                    var str="<b>"+des.yc[i].name+"：<s>"+(des.yc[i].value).toFixed(2)+"</s> "+des.yc[i].unit+"</b>";
                    $(".modalINVpower .ycsContent>ul:nth-child(3)>li:nth-child("+num+")").append(str);
                }else{
                    for(var m=0;m<des.yc[i].arrs.length;m++){
                        str+="<span>"+des.yc[i].arrs[m]+"</span>";
                    }
                    str+="<b>"+des.yc[i].unit+"</b>";
                    str+="</div>";
                    $(".modalINVpower .ycsContent>ul:nth-child(3)>li:nth-child("+num+")").append(str);
                }
              }
             }
        }else if(des.userData==24){
            $(".modalINVpower .ycsContent>ul:nth-child(3)").hide().siblings("ul").show();
            for(var i=0;i<des.yc.length;i++){
                var num=des.yc[i].disSeq;
                var str="<b>"+des.yc[i].name+"：</b><div>";
                var str2="<b>"+des.yc[i].name+"：</b>";
                if(des.yc[i].disSeq<=5 && des.yc[i].disSeq>0){//
                    for(var m=0;m<des.yc[i].arrs.length;m++){
                        str+="<span>"+des.yc[i].arrs[m]+"</span>";
                    }
                    str+="<b>"+des.yc[i].unit+"</b>";
                    str+="</div>";
                   
                    $(".modalINVpower .ycsContent>ul:nth-child(1)>li:nth-child("+num+")").append(str);
                }else if(des.yc[i].disSeq>5 && des.yc[i].disSeq<=8){
                    str2+="</b><span>"+(des.yc[i].value).toFixed(2)+"</span><i>"+des.yc[i].unit+"</i>";
                    $(".modalINVpower .ycsContent>ul:nth-child(2)>li:nth-child("+(num-5)+")").append(str2);
                }  
             }
        }
    }else if(des.userData==20){//通信母线
        $(".modalComBus .ycsContent>ul>li").html("");
        for(var i=0;i<des.yc.length;i++){
            var arr3=((des.yc[i].value).toFixed(1)).split("");
            while(arr3.length<6){
                arr3.unshift("0");
            }
            des.yc[i].arrs=arr3;
        }
        for(var i=0;i<des.yc.length;i++){
            var num=des.yc[i].disSeq;
            var str="<b>"+des.yc[i].name+"：</b><div>";
            if(des.yc[i].disSeq<=2){//
                for(var m=0;m<des.yc[i].arrs.length;m++){
                    str+="<span>"+des.yc[i].arrs[m]+"</span>";
                }
                str+="<b>"+des.yc[i].unit+"</b>";
                str+="</div>";
                $(".modalComBus .ycsContent>ul:nth-child(1)>li:nth-child("+num+")").append(str);
            } 
         }
    }else if(des.userData==30){//二路输入开关
        $(".modalInputSwitch .ycs1>div>b").html("无");
        $(".modalInputSwitch .ycs2>div>b").html("无");
        for(var i=0;i<des.yc.length;i++){
            if((des.yc[i].disSeq>0 && des.yc[i].disSeq<=3) || (des.yc[i].disSeq>4 && des.yc[i].disSeq<=7)){//电压
                var arr3=((des.yc[i].value).toFixed(1)).split("");
                while(arr3.length<6){
                    arr3.unshift("0");
                }
                des.yc[i].arrs=arr3;
            }
        }
        $(".modalInputSwitch .ycs1>p>u>span").html(0);
        $(".modalInputSwitch .ycs2>p>u>span").html(0);
        for(var i=0;i<des.yc.length;i++){
              var num=0;
                if((des.yc[i].disSeq) % 3 ==0){
                    num=3;
                }else{
                    num = (des.yc[i].disSeq) % 3;
                }
            if(des.yc[i].disSeq<=3 && des.yc[i].disSeq>0){//1#电压
                for(var m=0;m<des.yc[i].arrs.length;m++){
                    $(".modalInputSwitch .ycs1>p:nth-child("+num+")>u>span:nth-child("+(m+1)+")").html(des.yc[i].arrs[m]);
                }
            }else if(des.yc[i].disSeq>4 && des.yc[i].disSeq<=7){//2#电压
                for(var m=0;m<des.yc[i].arrs.length;m++){
                    $(".modalInputSwitch .ycs2>p:nth-child("+num+")>u>span:nth-child("+(m+1)+")").html(des.yc[i].arrs[m]);
                }
            }
            var str="无";
            if(des.yc[i].disSeq==4){
                if(des.yc[i].value==1){
                    $(".modalInputSwitch .ycs1>div>b").html('合闸').css("color","red");
                }else{
                    $(".modalInputSwitch .ycs1>div>b").html('分闸').css("color","white");
                }
            }else if(des.yc[i].disSeq==8){
                if(des.yc[i].value==1){
                    $(".modalInputSwitch .ycs2>div>b").html('合闸').css("color","red");
                }else{
                    $(".modalInputSwitch .ycs2>div>b").html('分闸').css("color","white");
                }
            }
        }
       
    }
    //处理遥信，
    if(des.userData==5){//ipc
        $(".modalIPC .yxs>ul>li").remove();
        for(var i=0;i<des.yx.length;i++){
            var str="";
            var cla="";
            if(des.yx[i].dataType ==5 || des.yx[i].dataType ==7){//开关
                if(des.yx[i].value==0){
                    str='<span class="green">分</span>';
                }else{
                    str='<span class="red">合</span>';
                }
            }else if(des.yx[i].dataType ==2){//告警
                if(des.yx[i].disMode==0){//默认显示
                    if(des.yx[i].value==0){
                        str='<span class="green">正常</span>';
                    }else{
                        str='<span class="red">告警</span>';
                    }
                }else{
                    if(des.yx[i].value==1){
                        str='<span class="red">告警</span>';
                    }else{
                        cla="none";
                    }
                }
               
            }else{//状态                  
                str='<span class="green">'+des.yx[i].unit+'</span>';                   
            }
            $(".modalIPC .yxs>ul").append('<li class="'+cla+'"><b>'+des.yx[i].name+':</b>'+str+'</li>');
        }
    }else{
        $(".modals .yxs>p").remove();
        $(".modals .yxs>ul>li").remove();
        for(var i=0;i<des.yx.length;i++){
            var str="";
            var cla="";
            if(des.yx[i].dataType ==5 || des.yx[i].dataType ==7){//开关
                if(des.yx[i].value==0){
                    str='<span class="green">分</span>';
                }else{
                    str='<span class="red">合</span>';
                }
            }else if(des.yx[i].dataType ==2){//告警
                if(des.yx[i].disMode==0){//默认显示
                    if(des.yx[i].value==0){
                        str='<span class="green">!</span>';
                    }else{
                        str='<span class="red">!</span>';
                    }
                }else{
                    if(des.yx[i].value==1){
                        str='<span class="red">!</span>';
                    }else{
                        cla="none";
                    }
                }
            }else{//状态  
                    str='<s class="green">'+des.yx[i].unit+'</s>';
            }
            $(".modals.active .yxs").append('<p class="'+cla+'"><b>'+des.yx[i].name+'：</b>'+str+'</p>');
        }
    }                                                                                                                                              
}
//获取分组数据
function loadGroupInfo(){
    var ob = new Object();
    ob.recordId = parseInt(CheckMod);
    ob.userData = parseInt(CheckedDevType);
    var json = JSON.stringify(ob);
    parent.ccc_lib_reqDataByCmd("",USER_ELEC_CLUSTER_GETBYID,json,showGroupInfo);//获取
}
var BatNames;
var BatVols,MaxVolData,MaxVolNum,MinVolData,MinVolNum;
var BatTemps,MaxTempData,MaxTempNum,MinTempData,MinTempNum;
var BatInters,MaxInterData,MaxInterNum,MinInterData,MinInterNum;
var modData;
var ttPage;
function checkFeederData(page){
    ttPage = page;
    $(".modalDCfeeder .modContents>table>tbody>tr").remove();
    var end = page*13;
    var start=(page-1)*13;
    var data = modData.slice(start,end);
    (function check(){
        var m=(ttPage-1)*13;
        var tab="<tbody>";
        for(var i=0;i<data.length;i++){
          tab+="<tr><td>"+(m+1)+"</td><td>"+data[i].name+"</td>";
          for(var k=0;k<data[i].data.length;k++){
              if(data[i].data[k].dataType==1 || data[i].data[k].dataType==3 ||data[i].data[k].dataType==9){//遥测
                  tab+="<td>"+(data[i].data[k].value).toFixed(2)+" "+data[i].data[k].unit+"</td>";
              }else if(data[i].data[k].dataType==5 ||data[i].data[k].dataType==7){//开关
                  if(data[i].data[k].value==0){
                      tab+="<td class='green'>分</td>";
                  }else{
                      tab+="<td class='red'>合</td>";
                  }
              }else if(data[i].data[k].dataType ==2){//告警
                  if(data[i].data[k].value==0){
                      tab+="<td class='green'>正常</td>";
                  }else{
                      tab+="<td class='red'>告警</td>";
                  }
              }else{//状态  
                  tab+="<td>"+data[i].data[k].unit+"</td>";
              }
          }
          tab+="</tr>";
          m++;
        }
        tab+="</tbody>";
        $(".modalDCfeeder .modContents>table").append(tab);
    })();
    // var length=$(".modalDCfeeder table>tbody>tr").length;
    // for(var m=0;m<10-length;m++){
    //     $(".modalDCfeeder table>tbody").append('<tr><td></td><td></td><td></td><td></td></tr>');
    // }
}
function checkDetectorData(page){
    ttPage = page;
    $(".modalDetector .modContents>table>tbody>tr").remove();
    var end = page*13;
    var start=(page-1)*13;
    var data = modData.slice(start,end);
  
    (function check(){
        var m=(ttPage-1)*13;
        var tab="<tbody>";
        for(var i=0;i<data.length;i++){
            tab+="<tr><td>"+(m+1)+"</td><td>"+data[i].name+"</td>";
            for(var k=0;k<data[i].data.length;k++){
              if(data[i].data[k].dataType==1 || data[i].data[k].dataType==3 ||data[i].data[k].dataType==9){//遥测
                  tab+="<td>"+(data[i].data[k].value).toFixed(2)+" "+data[i].data[k].unit+"</td>";
              }else if(data[i].data[k].dataType==5 ||data[i].data[k].dataType==7){//开关
                  if(data[i].data[k].value==0){
                      tab+="<td class='green'>分</td>";
                  }else{
                      tab+="<td class='red'>合</td>";
                  }
              }else if(data[i].data[k].dataType ==2){//告警
                  if(data[i].data[k].value==0){
                      tab+="<td class='green'>正常</td>";
                  }else{
                      tab+="<td class='red'>告警</td>";
                  }
              }else{//状态  
                  
                  tab+="<td>"+data[i].data[k].unit+"</td>";
              }
            }
            tab+="</tr>";
            m++;
          }
          tab+="</tbody>";
          $(".modalDetector .modContents>table").append(tab);
    })();
    // var length=$(".modalDetector table>tbody>tr").length;
    // for(var m=0;m<10-length;m++){
    //     $(".modalDetector table>tbody").append('<tr><td></td><td></td><td></td><td></td></tr>');
    // }
}
function showGroupInfo(id,info,des){
    console.log(des);
    if(des.dev.length>0){
        (des.dev).sort(sortBy("logNum"));
    }
  
    if(des.userData==15){//馈线绝缘监测仪
      modData=des.dev;
      $(".modalDCfeeder .modContents>table").html("");
      var tab="<thead><tr><th>序号</th><th>支路名称</th>";
      var arrs=(des.dev[0].titles).split("-");
      for(var i=0;i<des.dev[0].data.length;i++){
          var str=arrs[i]?arrs[i]:"";
        tab+="<th>"+str+"</th>";
      }
      tab+="</tr></thead><tbody>";
    
    var end = ttPage*13 ;
    var start=(ttPage-1)*13;
    var data = modData.slice(start,end);
      (function check(){
        len=Math.ceil(des.dev.length/13);
          var m=(ttPage-1)*13;
          for(var i=0;i<data.length;i++){
            tab+="<tr><td>"+(m+1)+"</td><td>"+data[i].name+"</td>";
            for(var k=0;k<data[i].data.length;k++){
                if(data[i].data[k].dataType==1 || data[i].data[k].dataType==3 ||data[i].data[k].dataType==9){//遥测
                    tab+="<td>"+(data[i].data[k].value).toFixed(2)+" "+data[i].data[k].unit+"</td>";
                }else if(data[i].data[k].dataType==5 ||data[i].data[k].dataType==7){//开关
                    if(data[i].data[k].value==0){
                        tab+="<td class='green'>分</td>";
                    }else{
                        tab+="<td class='red'>合</td>";
                    }
                }else if(data[i].data[k].dataType ==2){//告警
                    if(data[i].data[k].value==0){
                        tab+="<td class='green'>正常</td>";
                    }else{
                        tab+="<td class='red'>告警</td>";
                    }
                }else{//状态  
                    tab+="<td>"+data[i].data[k].unit+"</td>";
                }
            }
            tab+="</tr>";
            m++;
          }
          tab+="</tbody>";
          $(".modalDCfeeder .modContents>table").append(tab);
      })();
    //   var length=$(".modalDCfeeder table>tbody>tr").length;
    //   for(var m=0;m<10-length;m++){
    //       $(".modalDCfeeder table>tbody").append('<tr><td></td><td></td><td></td><td></td></tr>');
    //   }
      if(first==true){
          $('.modalDCfeeder .M-box3').pagination({
              pageCount:len,
              jump:true,
              coping:true,
              //homePage:'首页',
              //endPage:'末页',
              prevContent:'上页',
              nextContent:'下页'
          });
          first=false;
          $('.modalDCfeeder .M-box3').on("click","a",function(e){
              number=$(this).attr("data-page");
              if(!isNaN(number)){
                checkFeederData(number);
              }
          });
          $(".modalDCfeeder .M-box3").on("click","a.jump-btn",function(e){
              number=$(".modalDCfeeder .M-box3>span.active").html();
              if(!isNaN(number)){
                checkFeederData(number);
              }
          });
          $(".modalDCfeeder .M-box3").on("click","a.prev",function(e){
              number = parseInt($(".modalDCfeeder .M-box3>span.active").html());
              if(number>0){
                checkFeederData(number);
              }
          });
          $(".modalDCfeeder .M-box3").on("click","a.next",function(e){
              number = parseInt($(".modalDCfeeder .M-box3>span.active").html());
              if(number<len+1){
                checkFeederData(number);
              }
          });
      }

   
    }else if(des.userData==4){//低压电容
        $(".capMods>li").remove();
        var lis="";
        for(var i=0;i<des.dev.length;i++){
            var srcs="";
            var cls="";
            if(des.dev[i].type==1){
                srcs="imgs/gb.png";
                cls="gb";
                lis+="<li class='"+cls+"'><ul><li><img src='"+srcs+"'><p>"+des.dev[i].name+"</p></li><li>";
                var arrs=(des.dev[i].titles).split("-");
                var len=(90 / (des.dev[i].data.length+1))+"px";
                var totolNum = (des.dev[i].data.length>=3)?3:des.dev[i].data.length; 
                for(var k=0;k<totolNum;k++){
                    var names=arrs[k]?arrs[k]:'';
                    if(des.dev[i].data[k].dataType==1 || des.dev[i].data[k].dataType==3 ||des.dev[i].data[k].dataType==9){//遥测 
                        lis+="<p style='height:"+len+";line-height:"+len+"'><span>"+names+"：</span><b>"+(des.dev[i].data[k].value).toFixed(1)+" "+des.dev[i].data[k].unit+"</b></p>";
                    }else{
                        var cla;
                        if(des.dev[i].data[k].value==1){
                            cla="red";
                        }else{
                            cla="green";
                        }
                        lis+="<p style='height:"+len+";line-height:"+len+"'><span>"+names+"：</span><b class='"+cla+"'>"+des.dev[i].data[k].unit+"</b></p>";
                    }
                }
                lis+="<p style='height:"+len+";line-height:"+len+"'><span>次数：</span><b>"+des.dev[i].ANum+" 次</b></p></li></ul></li>";
            }else if(des.dev[i].type==2){
                srcs="imgs/fb.png";
                cls="fb";
                lis+="<li class='"+cls+"'><ul><li><img src='"+srcs+"'><p>"+des.dev[i].name+"</p></li><li><table><thead><tr><th></th>";
                var arrs=(des.dev[i].titles).split("-");
                for(var k=0;k<3;k++){
                    var names=arrs[k]?arrs[k]:'';
                    lis+="<th>"+names+"</th>";
                }
                lis+="<th>次数</th></thead><tbody>";
                var num=0;
                
                var totolNum = Math.ceil(des.dev[i].data.length / 3);
                var arryLen = (totolNum>=3)?3:totolNum;
                while(num<arryLen){
                    var str;
                    var last;
                    if(num==0){
                        str="A相：";
                        last=des.dev[i].ANum+" 次";
                    }else if(num==1){
                        str="B相：";
                        last=des.dev[i].BNum+" 次";
                    }else if(num==2){
                        str="C相：";
                        last=des.dev[i].CNum+" 次";
                    }
                    var str1="";
                    var str2="";
                    var str3="";
                    var cla1="";
                    var cla2="";
                    var cla3="";
                    try{
                        if(des.dev[i].data[num].dataType==1 || des.dev[i].data[num].dataType==3 ||des.dev[i].data[num].dataType==9){//遥测
                            str1=(des.dev[i].data[num].value).toFixed(1)+" "+des.dev[i].data[num].unit; 
                        }else{
                            str1=des.dev[i].data[num].unit;
                            if(des.dev[i].data[num].value==1){
                                cla1="red";
                            }else{
                                cla1="green";
                            }
                        }
                        if(des.dev[i].data[num+3].dataType==1 || des.dev[i].data[num+3].dataType==3 ||des.dev[i].data[num+3].dataType==9){//遥测
                            str2=(des.dev[i].data[num+3].value).toFixed(1)+" "+des.dev[i].data[num+3].unit; 
                        }else{
                            str2=des.dev[i].data[num+3].unit;
                            if(des.dev[i].data[num+3].value==1){
                                cla2="red";
                            }else{
                                cla2="green";
                            }
                        }
                        if(des.dev[i].data[num+6].dataType==1 || des.dev[i].data[num+6].dataType==3 ||des.dev[i].data[num+6].dataType==9){//遥测
                            str3=(des.dev[i].data[num+6].value).toFixed(1)+" "+des.dev[i].data[num+6].unit; 
                        }else{
                            str3=des.dev[i].data[num+6].unit;
                            if(des.dev[i].data[num+6].value==1){
                                cla3="red";
                            }else{
                                cla3="green";
                            }
                        }
                    }catch(err){
                        console.log(err);
                    }
                   
                    lis+="<tr><td>"+str+"</td><td class='"+cla1+"'>"+str1+"</td><td class='"+cla2+"'>"+str2+"</td><td class='"+cla3+"'>"+str3+"</td><td>"+last+"</td></tr>";
                    num++;
                }
                lis+="</tbody></table></li></ul></li>"; 
            } 
        }
        $(".capMods").append(lis);
    }else if(des.userData==13 || des.userData==18 ||des.userData==19 || des.userData==25){
        $(".modalDCcharger .DCchargerMods>li").remove();
        var lis="";
        var vol = 0;
        for(var i=0;i<des.dev[0].data.length;i++){
            if(des.dev[0].data[i].regId==32){//获取第一个模块的电压
                vol = des.dev[0].data[i].value;
            }
        }
        var addCur = 0;
        var srcs;
        if(des.userData==18 || des.userData==19){
            for(var i=0;i<des.dev.length;i++){
                des.dev[i].src = 'imgs/acac.png';
                for(var k=0;k<des.dev[i].data.length;k++){
                    if(des.dev[i].data[k].dataType==1 || des.dev[i].data[k].dataType==3 ||des.dev[i].data[k].dataType==9){//遥测
                      
                    }else{
                        if(des.dev[i].data[k].value==1){
                            des.dev[i].src = 'imgs/acacRed.png';
                        }
                    }
                }    
            }
        }else if(des.userData==13 || des.userData==25){
            for(var i=0;i<des.dev.length;i++){
                des.dev[i].src = 'imgs/dcdc.png';
                for(var k=0;k<des.dev[i].data.length;k++){
                    if(des.dev[i].data[k].dataType==1 || des.dev[i].data[k].dataType==3 ||des.dev[i].data[k].dataType==9){//遥测
                      
                    }else{
                        if(des.dev[i].data[k].value==1){
                            des.dev[i].src = 'imgs/dcdcRed.png';
                        }
                    }
                }    
            }
        }
       
        for(var i=0;i<des.dev.length;i++){
            lis+="<li class='' type='"+des.dev[i].logNum+"'><ul><li><img src='"+des.dev[i].src+"'><p>"+des.dev[i].name+"</p></li><li>";
            var arrs=(des.dev[i].titles).split("-");
            for(var k=0;k<des.dev[i].data.length;k++){
                if(des.dev[i].data[k].regId==53){
                    addCur+= des.dev[i].data[k].value;
                }
                var names = arrs[k]?arrs[k]:'';
                if(des.dev[i].data[k].dataType==1 || des.dev[i].data[k].dataType==3 ||des.dev[i].data[k].dataType==9){//遥测
                    lis+="<p><span>"+names+"：</span><b>"+(des.dev[i].data[k].value).toFixed(1)+" "+des.dev[i].data[k].unit+"</b></p>";
                }else if(des.dev[i].data[k].dataType==5 || des.dev[i].data[k].dataType==6 ||des.dev[i].data[k].dataType==7){//遥信状态
                    lis+="<p><span>"+names+"：</span><b >"+des.dev[i].data[k].unit+"</b></p>";
                }
            }
            lis+="</li></ul></li>";
        }
        $(".modalDCcharger .DCchargerMods").append(lis);
        if(!DCchangeId){
            $(".modalDCcharger .DCchargerMods>li:nth-child(1)").click();
        }else{
            $(".modalDCcharger .DCchargerMods>li[type='"+DCchangeId+"']").addClass("active").siblings("li").removeClass("active");
        }
       
        $(".modalDCcharger .ycs>p>u>span").html(0);
        var arr3=(vol.toFixed(1)).split("");
        while(arr3.length<6){
            arr3.unshift("0");
        }
        var arr4=(addCur.toFixed(1)).split("");
        while(arr4.length<6){
            arr4.unshift("0");
        }
        for(var m=0;m<arr3.length;m++){
            $(".modalDCcharger .ycs>p:nth-child(3)>u:nth-child(1)>span:nth-child("+(m+1)+")").html(arr3[m]);
        }
        for(var m=0;m<arr4.length;m++){
            $(".modalDCcharger .ycs>p:nth-child(3)>u:nth-child(2)>span:nth-child("+(m+1)+")").html(arr4[m]);
        }    
       
    }else if(des.userData==21){//馈线检测仪
        modData=des.dev;
        $(".modalDetector .modContents>table").html("");
        var tab="<thead><tr><th>序号</th><th>支路名称</th>";
        var arrs=(des.dev[0].titles).split("-");
        for(var i=0;i<des.dev[0].data.length;i++){
            var str=arrs[i]?arrs[i]:"";
            tab+="<th>"+str+"</th>";
        }
        tab+="</tr></thead><tbody>";
        var end  = ttPage*13;
        var start=(ttPage-1)*13;
        var data = modData.slice(start,end);
        (function check(){
            len=Math.ceil(des.dev.length/13);
            var m=(ttPage-1)*13;
            for(var i=0;i<data.length;i++){
                tab+="<tr><td>"+(m+1)+"</td><td>"+data[i].name+"</td>";
                for(var k=0;k<data[i].data.length;k++){
                  if(data[i].data[k].dataType==1 || data[i].data[k].dataType==3 ||data[i].data[k].dataType==9){//遥测
                      tab+="<td>"+(data[i].data[k].value).toFixed(2)+" "+data[i].data[k].unit+"</td>";
                  }else if(data[i].data[k].dataType==5 ||data[i].data[k].dataType==7){//开关
                      if(data[i].data[k].value==0){
                          tab+="<td class='green'>分</td>";
                      }else{
                          tab+="<td class='red'>合</td>";
                      }
                  }else if(data[i].data[k].dataType ==2){//告警
                      if(data[i].data[k].value==0){
                          tab+="<td class='green'>正常</td>";
                      }else{
                          tab+="<td class='red'>告警</td>";
                      }
                  }else{//状态  
                      tab+="<td>"+data[i].data[k].unit+"</td>";
                  }
                }
                tab+="</tr>";
                m++;
              }
              tab+="</tbody>";
              $(".modalDetector .modContents>table").append(tab);
        })();
        // var length=$(".modalDetector table>tbody>tr").length;
        // for(var m=0;m<10-length;m++){
        //     $(".modalDetector table>tbody").append('<tr><td></td><td></td><td></td><td></td></tr>');
        // }
        if(first==true){
            $('.modalDetector .M-box3').pagination({
                pageCount:len,
                jump:true,
                coping:true,
                //homePage:'首页',
                //endPage:'末页',
                prevContent:'上页',
                nextContent:'下页'
            });
            first=false;
            $('.modalDetector .M-box3').on("click","a",function(e){
                number=$(this).attr("data-page");
                if(!isNaN(number)){
                    checkDetectorData(number);
                }
            });
            $(".modalDetector .M-box3").on("click","a.jump-btn",function(e){
                number=$(".modalDetector .M-box3>span.active").html();
                if(!isNaN(number)){
                    checkDetectorData(number);
                }
            });
            $(".modalDetector .M-box3").on("click","a.prev",function(e){
                number = parseInt($(".modalDetector .M-box3>span.active").html());
                if(number>0){
                    checkDetectorData(number);
                }
            });
            $(".modalDetector .M-box3").on("click","a.next",function(e){
                number = parseInt($(".modalDetector .M-box3>span.active").html());
                if(number<len+1){
                  checkDetectorData(number);
                }
            });
        }
       
    }else if(des.userData==14){//蓄电池组单体电池数据
        $(".singleBatContent .listModal>ul>li").remove();
        var str="";
        BatNames=[];
        BatVols=[],MaxVolData=0,MaxVolNum=0,MinVolData=999999,MinVolNum=0;
        BatTemps=[],MaxTempData=0,MaxTempNum=0,MinTempData=999999,MinTempNum=0;
        BatInters=[],MaxInterData=0,MaxInterNum=0,MinInterData=999999,MinInterNum=0;
        if(des.dev.length<=0){
            $(".BatType>b,.BatType>span").hide();
        }else{
            $(".BatType>b,.BatType>span").show();
        }
        for(var i=0;i<des.dev.length;i++){
            des.dev[i].src = 'imgs/battery.png';
            for(var k=0;k<des.dev[i].data.length;k++){
                if(des.dev[i].data[k].dataType==1 || des.dev[i].data[k].dataType==3 ||des.dev[i].data[k].dataType==9){//遥测
                  
                }else{
                    if(des.dev[i].data[k].value==1){
                        des.dev[i].src = 'imgs/batteryRed.png';
                    }
                }
            }    
        }
        for(var i=0;i<des.dev.length;i++){
            BatNames.push(des.dev[i].name);
            str+="<li><ul><li><img src='"+des.dev[i].src+"'><p>"+des.dev[i].name+"</p></li><li>";
            for(var k=0;k<des.dev[i].data.length;k++){
                var arrs=(des.dev[i].titles).split("-");
                var names=arrs[k]?arrs[k]:"";
                var cla="";
                if(des.dev[i].data[k].dataType==1 || des.dev[i].data[k].dataType==3 ||des.dev[i].data[k].dataType==9){//遥测
                    var val=parseFloat((des.dev[i].data[k].value).toFixed(2));
                    if(des.dev[i].data[k].regId==35){//电压
                        BatVols.push(val);
                        MaxVolData=(MaxVolData>val)?MaxVolData:val;
                        MaxVolNum=(MaxVolData>val)?MaxVolNum:(des.dev[i].name);
                        MinVolData=(MinVolData<val)?MinVolData:val;
                        MinVolNum=(MinVolData<val)?MinVolNum:(des.dev[i].name);
                    }else if(des.dev[i].data[k].regId==51){//内阻
                        BatInters.push(val);
                        MaxInterData=(MaxInterData>val)?MaxInterData:val;
                        MaxInterNum=(MaxInterData>val)?MaxInterNum:(des.dev[i].name);
                        MinInterData=(MinInterData<val)?MinInterData:val;
                        MinInterNum=(MinInterData<val)?MinInterNum:(des.dev[i].name);
                    }else if(des.dev[i].data[k].regId==227){//温度
                        BatTemps.push(val);
                        MaxTempData=(MaxTempData>val)?MaxTempData:val;
                        MaxTempNum=(MaxTempData>val)?MaxTempNum:(des.dev[i].name);
                        MinTempData=(MinTempData<val)?MinTempData:val;
                        MinTempNum=(MinTempData<val)?MinTempNum:(des.dev[i].name);
                    }
                    str+="<p><span>"+names+"：</span><b>"+(des.dev[i].data[k].value).toFixed(2)+"</b><s> "+des.dev[i].data[k].unit+"</s></p>";
                }
                
            }
             str+="</li></ul></li>";
        }
        $(".singleBatContent .listModal>ul").append(str);
    }
}
//点击单体电池详情
$(".SingleBatToInfo").click(function(){
    $(".singleBattery").show().siblings("div").hide();
    $(".singleBattery>p>a:nth-child(1)").click();
    loadGroupInfo();

})
$(".BacktoBatInfo").click(function(){
    $(".totalInfo").show().siblings("div").hide();
})
//切换列表、柱图、曲线模式
$(".singleBattery>p>a").click(function(){
    $(this).addClass("active").siblings("a").removeClass("active");
    var abt=$(this).attr("about");
    $(abt).show().siblings("div").hide();
    $(".BatType>a:last-child").addClass("active").siblings("a").removeClass("active");
    valueUnit="电压(V)";
    $(".BatType>b").html("单体电压最高"+MaxVolData+"V,"+MaxVolNum+"；单体电压最低"+MinVolData+"V,"+MinVolNum+"号");
     if(abt==".barModal"){
        loadBatBar(BatNames,BatVols,"barModalContent");
    }else if(abt==".lineModal"){
        max=MaxVolData;
        min=0;
        chartLine1(BatNames,BatVols,"lineModalContent");
    }
    
})
$(".BatType>a").click(function(){
    $(this).addClass("active").siblings("a").removeClass("active");
    var abt=$(this).attr("about");
    var type=$(".singleBattery>p>a.active").attr("about");
    if(abt==1){
        valueUnit="电压(V)";
        $(".BatType>b").html("单体电压最高"+MaxVolData+"V,"+MaxVolNum+"；单体电压最低"+MinVolData+"V,"+MinVolNum+"号");
        if(type==".barModal"){
            loadBatBar(BatNames,BatVols,"barModalContent");
        }else if(type==".lineModal"){
            max=MaxVolData;
            min=0;
            chartLine1(BatNames,BatVols,"lineModalContent");
        }
     
    }else if(abt==3){
        valueUnit="温度(℃)";
        $(".BatType>b").html("单体温度最高"+MaxTempData+"℃,"+MaxTempNum+"；单体温度最低"+MinTempData+"℃,"+MinTempNum+"号");
        if(type==".barModal"){
            loadBatBar(BatNames,BatTemps,"barModalContent");
        }else if(type==".lineModal"){
            max=MaxTempData;
            min=0;
            chartLine1(BatNames,BatTemps,"lineModalContent");
        }
        
    }else if(abt==2){
        valueUnit="内阻(mΩ)";
        $(".BatType>b").html("单体内阻最高"+MaxInterData+"mΩ,"+MaxInterNum+"；单体内阻最低"+MinInterData+"mΩ,"+MinInterNum+"号");
        if(type==".barModal"){
            loadBatBar(BatNames,BatInters,"barModalContent");
        }else if(type==".lineModal"){
            max=MaxInterData;
            min=0;
            chartLine1(BatNames,BatInters,"lineModalContent");
        }
    }
})

function loadBatBar(names,vals,cls){
    var xData= names;
    var yData= vals;


    var myChart = echarts.init(document.getElementsByClassName(cls)[0]);
    var option3 = {
        title:{
            //text:title,
            x:"center",
            y:"5%",
            textStyle:{
                color:'#ffffff'
            }
        },
        textStyle:{
            textColor:"#ffffff"
        },
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        color:[
            "#3970D0",
            "#99532A",
        ],
        legend: {
            //data:['本期','上期'],
            textStyle:{
                color:'#ffffff',
                fontSize:10
            },
            y:'1%',
            x:"90%",
            type:"scroll",
            orient:"vertical"
        },
        grid: {
            left: '4%',
            right: '5%',
            bottom: '5%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                data :xData,
                axisLabel:{
                    show:true,
                    intervel:'auto',
                    inside:false,
                    formatter:function(value){
                        if(value){
                            return value.split(" ").join("\n");
                        }

                    },
                    textStyle:{
                        color:'#ffffff'
                    }
                },
                axisLine:{
                    symbol:['none','arrow'],//箭头一端没效果,一端箭头
                    symbolSize:[7,10],
                    symbolOffset:[0,8],
                    lineStyle:{

                        color:'#add8e6'
                    }
                },
             
            }
        ],
        yAxis : [
            {
                type : 'value',
                name:valueUnit,
                axisLabel : {
                    textStyle: {
                        color: '#ffffff'
                    }
                },
                nameTextStyle:{
                    color:'#ffffff'
                },
                axisLine:{
                    symbol:['none','arrow'],//箭头一端没效果,一端箭头
                    symbolSize:[7,10],
                    symbolOffset:[0,8],
                    lineStyle:{
                        color:'#add8e6'
                    }
                },
                splitLine:{
                    lineStyle:{
                        color:'#add8e6'
                    }
                }
            }
        ],
        series : [
            {
                //name:'本期',
                type:'bar',
                data:yData,
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#83bff6'
                        }, {
                            offset: 1,
                            color: '#188df0'
                        }]),
                    }
                },
                label: {
                    normal: {
                        show: false
                        //position: 'top'//值显示
                    }
                },
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ],
                    symbol:"pin",
                    symbolSize:40
                },
            },
        ]
    };
    myChart.clear();
    myChart.setOption(option3);
}
var combId =0;
var lineType = 0;
var valueUnit="";
$(".fourLine").on("click","a",function(){
    var about=$(this).parent(".fourLine").attr("about");
    $(this).addClass("active").siblings("a").removeClass("active");
    $(this).addClass("active").siblings().removeClass("active");
    var unit=$(this).attr("data-unit");
    valueUnit="单位("+unit+")";
    combId=$(this).attr("about");
    var comment=$(this).attr("data-comment");
    var arr=comment.split(">");
    lineType=arr.length-1;
    if(!CheckMod || !CheckedDevType){
        return false;
    } 
    if(lineType==3){//三项
        loadLines3(combId);
    }else if(lineType==4){//四项
        loadLines4(combId);
    }else if(lineType==1){//单项
        loadLines1(combId);
    }

})
$(".fourLine2").on("click","a",function(){
    var about=$(this).parent(".fourLine").attr("about");
    $(this).addClass("active").siblings("a").removeClass("active");
    $(this).addClass("active").siblings().removeClass("active");
    var unit=$(this).attr("data-unit");
    valueUnit="单位("+unit+")";
    combId=$(this).attr("about");
    if(!CheckMod || !CheckedDevType){
        return false;
    } 
    loadGroupLine();
    
    
})
//获取分组曲线
function loadGroupLine(){
    var ob = new Object();
    var id = $(".DCchargerMods>li.active").attr("type");
    var type = $(".fourLine2>a.active").attr("about");
    if(!id || !type){
        return false;
    }
    ob.CombId = parseInt(type);
    ob.com = parseInt(CheckCom);
    ob.addr = parseInt(CheckAddr);
    ob.id = parseInt(id);
    ob.startTime = Eng_star_date;//开始日期
    ob.endTime = Eng_end_date;//结束日期

 
    ob.userData = parseInt(CheckedDevType);
    var json = JSON.stringify(ob);
    console.log(json);
    parent.ccc_lib_reqDataByCmd("",USER_CURVE_GROUP_LIST,json,ShowModLine1);//获取
    
}
//点击分组
$(".modalDCcharger ").on("click",".DCchargerMods>li",function(){
    $(this).addClass("active").siblings("li").removeClass("active");
    DCchangeId=$(this).attr("type");
    loadGroupLine();
})
//获取单相曲线
function loadLines1(type){
    var ob = new Object();
    ob.recordId = parseInt(CheckMod);//网关Id
    ob.CombId = parseInt(type);
    ob.startTime = Eng_star_date;//开始日期
    ob.endTime = Eng_end_date;//结束日期
    ob.userData = parseInt(CheckedDevType);
    var json = JSON.stringify(ob);
    console.log(json);
    parent.ccc_lib_reqDataByCmd("",USER_ELEC_HEAT_LIST_V25,json,ShowModLine1);//获取
}
function ShowModLine1(id,info,des){
    console.log(des);
    console.log(info);
    if(info=="intType"){//解整形
        des.data = UnPackLines(des.curve,1,1).data;
    }else{//解float型
        des.data = UnPackLines(des.curve,1).data;
    }
    valueData=[];
    timeData=[];
   
    Up_limit=0;
    Down_limit=0;
    if(des.data.length>0){
        max=-100;min=999999;
        try{
            Up_limit=(des.up).toFixed(1);
            Down_limit=(des.down).toFixed(1);
        }catch(err){
            console.log(err)
        }
        
        for(var i=0;i<des.data.length;i++){
            timeData.push(des.data[i].time);
            valueData.push((des.data[i].value).toFixed(2));
            max=(des.data[i].value>max)?des.data[i].value:max;
            min=(des.data[i].value<min)?des.data[i].value:min;
        }
        max=max.toFixed(2);
        min=min.toFixed(2);
    }else{
        max=1;min=0;
    }

    if(CheckedDevType == 1 || CheckedDevType == 2 || CheckedDevType == 3 || CheckedDevType == 6){//低压进线 通用
        chartLine1(timeData,valueData,"lineContent");
    }else if (CheckedDevType == 16 || CheckedDevType == 17) {//直流母线绝缘监测
        chartLine1(timeData,valueData,"DCBuslineContent");
    }else if (CheckedDevType == 14) {//蓄电池组
        chartLine1(timeData,valueData,"DCBatterylineContent");
    }else if (CheckedDevType == 18 || CheckedDevType == 13 ||CheckedDevType == 19 || CheckedDevType == 25) {//DCDC充电模块 通信模块
        chartLine1(timeData,valueData,"DCChargerlineContent");
    }else if (CheckedDevType == 12) {//直流交流输入
        chartLine1(timeData,valueData,"DCInpulineContent");
    }else if (CheckedDevType == 22 || CheckedDevType == 24) {//逆变电源 ups电源
        chartLine1(timeData,valueData,"INVPowerlineContent");
    }else if(des.userData==23 ||des.userData==25){//馈线支路 DCDC通信模块  
        chartLine1(timeData,valueData,"INVfeederContent");
    }else if(des.userData==20){//通信母线
        chartLine1(timeData,valueData,"ComBuslineContent");
    }else if(des.userData==26){
        chartLine1(timeData,valueData,"lineCenPointContent");
    }else if(des.userData==27 || des.userData==28){
        chartLine1(timeData,valueData,"longLineContent");
    }else if(des.userData==30){
        chartLine1(timeData,valueData,"InputSwitchContent");
    }
    
}
var BallData=[],BallTime=[];
function ShowModLine11(id,info,des){
    console.log(des);
    des.data = UnPackRecordBol(des.curve,des.pointNum).data;
    BallTime=[];
    BallData=[];
   
    Up_limit=0;
    Down_limit=0;
    if(des.data.length>0){
        max=-100;min=999999;
        try{
            Up_limit=(des.up).toFixed(1);
            Down_limit=(des.down).toFixed(1);
        }catch(err){
            console.log(err)
        }
        var addNum=-1;
        for(var i=0;i<des.data.length;i++){
            addNum+=1;
            BallTime.push(addNum+"");
            BallData.push(des.data[i].value);
            max=(des.data[i].value>max)?des.data[i].value:max;
            min=(des.data[i].value<min)?des.data[i].value:min;
        }
        max=max.toFixed(2);
        min=min.toFixed(2);
    }else{
        max=1;min=0;
    }
    if(CheckedDevType==100){
        $("#stepLong").attr("about",0);
        var time = BallTime.slice(0,120);
        var data = BallData.slice(0,+120);
        chartLine11(time,data,"recordBolContent");
    }
    
}

$("#toPrev").click(function(){
    var old = parseInt($("#stepLong").attr("about"));
    var step = parseInt($("#stepLong").val());
    if(old - step > 0){
       
        $("#stepLong").attr("about",old - step);
        var start = old - step;
        var time = BallTime.slice(start,start+120);
        var data = BallData.slice(start,start+120);
        chartLine11(time,data,"recordBolContent");
        
    }else{
        if(old==0){
           return false; 
        }else{
            $("#stepLong").attr("about",0);
      
            var time = BallTime.slice(0,120);
            var data = BallData.slice(0,120);
            chartLine11(time,data,"recordBolContent");
        }
       
    }
  
})
$("#toNext").click(function(){
    var old = parseInt($("#stepLong").attr("about"));
    var step = parseInt($("#stepLong").val());
    if((old + 120)>440){
    //     loadBallData();
        if(old+step<440){
            $("#stepLong").attr("about",old+step);
            var time = BallTime.slice(old+step,440);
            var data = BallData.slice(old+step,440);
            chartLine11(time,data,"recordBolContent");
        }
    }else{
        if(old+step>440){
            $("#stepLong").attr("about",old+120);
            var time = BallTime.slice(old+120,440);
            var data = BallData.slice(old+120,440);
            chartLine11(time,data,"recordBolContent");
        }else{
            $("#stepLong").attr("about",old+step);
            var start = old + step;
            var time = BallTime.slice(start,start+120);
            var data = BallData.slice(start,start+120);
            chartLine11(time,data,"recordBolContent");
        }
       
    }
    
})
// $("#stepLong").change(function(){
//     loadBallData(1);
// })
    

//获取三相曲线
function loadLines3(type){
    var ob = new Object();
    ob.recordId = parseInt(CheckMod);//网关Id
    ob.CombId = parseInt(type);
    ob.startTime = Eng_star_date;//开始日期
    ob.endTime = Eng_end_date;//结束日期
    ob.userData = parseInt(CheckedDevType);
    var json = JSON.stringify(ob);
    console.log(json);
    parent.ccc_lib_reqDataByCmd("",USER_ELEC_HEAT_LIST_V25,json,ShowModLine3);//获取
}

function UnPackLines(oArrBuf,type,intType){
    var buffer = _base64ToArrayBuffer(oArrBuf);
    var pos=0;
    
    var datas={
        num:0,
        data:[]
    };
    var oDataView = new DataView(buffer);
   
    datas.num = oDataView.getUint32(pos,false);//截取数量
    pos+=4;
    

    for(var i=0;i<datas.num;i++){
        var obj={};
        let timeLen = oDataView.getUint16(pos,false);//时间长度
        pos+=2;
        obj.time = "";//时间
        for(var nAdd = 0;nAdd < timeLen;++nAdd)
        {
            obj.time += String.fromCharCode(oDataView.getInt8(pos + nAdd));
        }
        pos+=timeLen;
        if(type==1){
            if(intType){
                obj.value = oDataView.getInt32(pos,false);
            }else{
                 obj.value = oDataView.getFloat32(pos,false);
            }
            pos+=4;
        }else if(type==3){
            obj.A = oDataView.getFloat32(pos,false);
            pos+=4;
            obj.B = oDataView.getFloat32(pos,false);
            pos+=4;
            obj.C = oDataView.getFloat32(pos,false);
            pos+=4;
        }else if(type==4){
            obj.A = oDataView.getFloat32(pos,false);
            pos+=4;
            obj.B = oDataView.getFloat32(pos,false);
            pos+=4;
            obj.C = oDataView.getFloat32(pos,false);
            pos+=4;
            obj.D = oDataView.getFloat32(pos,false);
            pos+=4;
        }
      
        
        datas.data.push(obj);
    }
    // console.log(datas);
    return datas;
}
function UnPackRecordBol(oArrBuf,num){
    var buffer = _base64ToArrayBuffer(oArrBuf);
    var pos=0;
    var datas={
        num:num,
        data:[]
    };
    var oDataView = new DataView(buffer);
    for(var i=0;i<num;i++){
        var obj={};
        obj.value = oDataView.getInt16(pos,false);
        pos+=2;
        datas.data.push(obj);
    }
    // console.log(datas);
    return datas;
}
function _base64ToArrayBuffer(base64) {

    var binary_string = window.atob(base64);
    
    var len = binary_string.length;
    
    var bytes = new Uint8Array( len );
    
    for (var i = 0; i < len; i++) {
    
    bytes[i] = binary_string.charCodeAt(i);
    
    }
    return bytes.buffer;
    
}

function ShowModLine3(id,info,des){
    console.log(des);
    // var str = window.atob("asdfsdf"); // 解码
    // console.log(str);
    des.data = UnPackLines(des.curve,3).data;

    valueData=[];
    valueData2=[];
    valueData3=[];
    timeData=[];
    Up_limit=0;
    Down_limit=0;
    if(des.data.length>0){
        max=-100;min=999999;
        Up_limit=(des.up).toFixed(1);
        Down_limit=(des.down).toFixed(1);
        for(var i=0;i<des.data.length;i++){
            timeData.push(des.data[i].time);
            valueData.push((des.data[i].A).toFixed(2));
            valueData2.push((des.data[i].B).toFixed(2));
            valueData3.push((des.data[i].C).toFixed(2));
            max=(des.data[i].A>max)?des.data[i].A:max;
            min=(des.data[i].A<min)?des.data[i].A:min;
            max=(des.data[i].B>max)?des.data[i].B:max;
            min=(des.data[i].B<min)?des.data[i].B:min;
            max=(des.data[i].C>max)?des.data[i].C:max;
            min=(des.data[i].C<min)?des.data[i].C:min;
        }
        max=max.toFixed(2);
        min=min.toFixed(2);
    }else{
        max=1;min=0;
    }
    if(CheckedDevType == 1 ||CheckedDevType == 2 || CheckedDevType == 3 || CheckedDevType==6){
       chartLine3(timeData,valueData,valueData2,valueData3,"lineContent");
    }else if (CheckedDevType == 16 || CheckedDevType == 17) {//直流母线绝缘监测
        chartLine3(timeData,valueData,valueData2,valueData3,"DCBuslineContent");
    }else if (CheckedDevType == 14) {//蓄电池组
        chartLine3(timeData,valueData,valueData2,valueData3,"DCBatterylineContent");
    }else if (CheckedDevType == 18 || CheckedDevType == 13 ||CheckedDevType == 19 || CheckedDevType == 25) {//DCDC充电模块 通信模块
        chartLine3(timeData,valueData,valueData2,valueData3,"DCChargerlineContent");
    }else if (CheckedDevType == 12) {//直流交流输入
        chartLine3(timeData,valueData,valueData2,valueData3,"DCInpulineContent");
    }else if (CheckedDevType == 22 || CheckedDevType == 24) {//逆变电源 ups电源
        chartLine3(timeData,valueData,valueData2,valueData3,"INVPowerlineContent");
    }else if(des.userData==23 ||des.userData==25){//馈线支路 DCDC通信模块  
        chartLine3(timeData,valueData,valueData2,valueData3,"INVfeederContent");
    }else if(des.userData==20){//通信母线
        chartLine3(timeData,valueData,valueData2,valueData3,"ComBuslineContent");
    }else if(des.userData==30){
        chartLine3(timeData,valueData,valueData2,valueData3,"InputSwitchContent");
    }

}
//获取四相曲线
function loadLines4(type){
    var ob = new Object();
    ob.recordId = parseInt(CheckMod);//网关Id
    ob.CombId = parseInt(type);
    ob.startTime = Eng_star_date;//开始日期
    ob.endTime = Eng_end_date;//结束日期
    ob.userData = parseInt(CheckedDevType);
    var json = JSON.stringify(ob);
    console.log(json);
    parent.ccc_lib_reqDataByCmd("",USER_ELEC_HEAT_LIST_V25,json,ShowModLine4);//获取
}
function ShowModLine4(id,info,des){
    console.log(des);
    des.data = UnPackLines(des.curve,4).data;
    valueData=[];
    valueData2=[];
    valueData3=[];
    valueData4=[];
    timeData=[];
    Up_limit=0;
    Down_limit=0;
    if(des.data.length>0){
        max=-100;min=999999;
        Up_limit=(des.up).toFixed(1);
        Down_limit=(des.down).toFixed(1);
        for(var i=0;i<des.data.length;i++){
            timeData.push(des.data[i].time);
            valueData.push((des.data[i].A).toFixed(2));
            valueData2.push((des.data[i].B).toFixed(2));
            valueData3.push((des.data[i].C).toFixed(2));
            valueData4.push((des.data[i].D).toFixed(2));
            max=(des.data[i].A>max)?des.data[i].A:max;
            min=(des.data[i].A<min)?des.data[i].A:min;
            max=(des.data[i].B>max)?des.data[i].B:max;
            min=(des.data[i].B<min)?des.data[i].B:min;
            max=(des.data[i].C>max)?des.data[i].C:max;
            min=(des.data[i].C<min)?des.data[i].C:min;
            max=(des.data[i].D>max)?des.data[i].D:max;
            min=(des.data[i].D<min)?des.data[i].D:min;
        }
        max=max.toFixed(2);
        min=min.toFixed(2);
    }else{
        max=1;min=0;
    }

    if(CheckedDevType == 1 || CheckedDevType == 2 || CheckedDevType == 3 || CheckedDevType==6){
        chartLine4(timeData,valueData,valueData2,valueData3,valueData4,"lineContent");
    } else if (CheckedDevType == 16 || CheckedDevType == 17) {//直流母线绝缘监测
        chartLine4(timeData,valueData,valueData2,valueData3,valueData4,"DCBuslineContent");
    }else if (CheckedDevType == 14) {//蓄电池组
        chartLine4(timeData,valueData,valueData2,valueData3,valueData4,"DCBatterylineContent");
    }else if (CheckedDevType == 18 || CheckedDevType == 13 ||CheckedDevType == 19 || CheckedDevType == 25) {//DCDC充电模块 通信模块
        chartLine4(timeData,valueData,valueData2,valueData3,valueData4,"DCChargerlineContent");
    }else if (CheckedDevType == 12) {//直流交流输入
        chartLine4(timeData,valueData,valueData2,valueData3,valueData4,"DCInpulineContent");
    }else if (CheckedDevType == 22 || CheckedDevType == 24) {//逆变电源 ups电源
        chartLine4(timeData,valueData,valueData2,valueData3,valueData4,"INVPowerlineContent");
    } else if(des.userData==23 ||des.userData==25){//馈线支路 DCDC通信模块  
        chartLine4(timeData,valueData,valueData2,valueData3,valueData4,"INVfeederContent");
    }else if(des.userData==20){//通信母线
        chartLine4(timeData,valueData,valueData2,valueData3,valueData4,"ComBuslineContent");
    }else if(des.userData==30){
        chartLine4(timeData,valueData,valueData2,valueData3,valueData4,"InputSwitchContent");
    }
}
function chartLine1(time,value1,cla){
    var myChart = echarts.init(document.getElementsByClassName(cla)[0]);
    // $(".cla>span").remove();
    // $(".cla").append("<span style='float:right;color:white;position:absolute;left:0%;top:100%;font-size:16px;width:100%;text-align:center'>最大值："+max+" &nbsp;&nbsp;&nbsp;最小值："+min+" &nbsp;&nbsp;&nbsp;阈值上限："+Up_limit+" &nbsp;&nbsp;&nbsp;阈值下限："+Down_limit+"</span>");
    var option3={
        title:{
            x:"center",
            y:"2%",
            textStyle:{
                color:'#ffffff'
            }
        },
        tooltip:{
            trigger:"axis",
            axisPointer:{
                animation: false
            }
        },
        color:[
            "orange",
            "green",
            "red",
            "blue",
        ],
        grid:{
            left:"60px",
            right:"50px",
            bottom:"35px",
            top:"30px"
        },
        legend:{
            data:["值"],
            textStyle:{
                color:"ffffff"
            },
            show:false
        },
        toolbox:{
            show:true,
            feture:{
                mark:{show:true},
                dataView:{
                    show:true,
                    readOnly:false
                },
                magicType:{
                    show:true,
                    type:["line","bar","stack","tiled"]
                },
                restore:{show:true}
            }
        },
        calculable:true,
        xAxis:[
            {
                type : 'category',
                boundaryGap : false,
                data : time,
                axisLabel:{
                    show:true,
                    intervel:'auto',
                    inside:false,
                    formatter:function(time){
                        if(time){
                            return time.split(" ").join("\n");
                        }
                    }
                },
                axisLine:{
                    lineStyle:{
                        color:'#add8e6'
                    }
                },
            }
        ],
        yAxis:[
            {
                name:valueUnit,
                type : 'value',
                max:max,
                min:min,
                axisLine:{
                    lineStyle:{
                        color:'#ffffff'
                    }
                },
                nameTextStyle:{
                    color:'#ffffff'
                },
                axisLine:{
                    lineStyle:{
                        color:'#add8e6'
                    }
                },
                splitLine:{
                    lineStyle:{
                        color:'#add8e6'
                    }
                }
            }
        ],
        series:[
            {
                name:'值',
                type:'line',
                smooth:true,
                symbolSize: 8,
                hoverAnimation: true,
                data:value1,
                label: {
                    normal: {
                        show: false
                        //position: 'top'//值显示
                    }
                },
                markLine:{
                    itemStyle:{
                        normal:{
                            color:"red"
                        }
                    },
                    data: [
                        // {yAxis: Up_limit, name: '上限'},
                        // {yAxis: Down_limit, name: '下限'}
                    ],
                    silent:false
                }
            },

        ]
    };
    myChart.setOption(option3);
}
function chartLine11(time,value1,cla){
    var myChart = echarts.init(document.getElementsByClassName(cla)[0]);

    var option3={
        title:{
            x:"center",
            y:"2%",
            textStyle:{
                color:'#ffffff'
            }
        },
        tooltip : {
            trigger: 'axis',
            formatter: function (obj) {
               return "时长："+obj[0].name+'(ms)</br>值：'+obj[0].value
            
            },
            // position: function (pt) {
            //     return [pt[0], '20%'];
            //   }
        },
        color:[
            "orange",
            "green",
            "red",
            "blue",
        ],
        grid:{
            left:"60px",
            right:"30px",
            bottom:"35px",
            top:"30px",
            
        },
        legend:{
            data:["值"],
            textStyle:{
                color:"ffffff"
            },
            show:false
        },
        toolbox:{
            show:true,
            feture:{
                mark:{show:true},
                dataView:{
                    show:true,
                    readOnly:false
                },
                magicType:{
                    show:true,
                    type:["line","bar","stack","tiled"]
                },
                restore:{show:true}
            }
        },
        calculable:true,
        xAxis:[
            {
                type : 'category',
                boundaryGap : false,
                data : time,
                axisLabel:{
                    show:true,
                    intervel:'auto',
                    inside:false,
                    // formatter:function(time){
                    //     console.log(time)
                    //     return "时间:"+time+"(ms)"  
                    // }
                },
                axisLine:{
                    lineStyle:{
                        color:'#add8e6'
                    }
                },
            }
        ],
        yAxis:[
            {
                name:valueUnit,
                type : 'value',
                // max:max,
                min:min,
                // boundaryGap: [0, '100%'],
                axisLine:{
                    lineStyle:{
                        color:'#ffffff'
                    }
                },
                nameTextStyle:{
                    color:'#ffffff'
                },
                axisLine:{
                    lineStyle:{
                        color:'#add8e6'
                    }
                },
                splitLine:{
                    lineStyle:{
                        color:'#add8e6'
                    }
                }
            }
        ],
        // dataZoom: [
        //     {
        //       type: 'inside',
        //       start: 0,
        //       end: 10
        //     },
        //     {
        //       start: 0,
        //       end: 10
        //     }
        //   ],
        series:[
            {
                name:'值',
                type:'line',
                smooth:true,
                symbolSize: 8,
                hoverAnimation: true,
                data:value1,
                label: {
                    normal: {
                        show: false
                        //position: 'top'//值显示
                    }
                },
                markLine:{
                    itemStyle:{
                        normal:{
                            color:"red"
                        }
                    },
                    data: [
                        // {yAxis: Up_limit, name: '上限'},
                        // {yAxis: Down_limit, name: '下限'}
                    ],
                    silent:false
                }
            },

        ]
    };
    myChart.setOption(option3);
}
function chartLine3(time,value1,value2,value3,cla){
    var myChart = echarts.init(document.getElementsByClassName(cla)[0]);
    // $(".cla>span").remove();
    // $(".cla").append("<span style='float:right;color:white;position:absolute;left:0%;top:100%;font-size:16px;width:100%;text-align:center'>最大值："+max+" &nbsp;&nbsp;&nbsp;最小值："+min+" &nbsp;&nbsp;&nbsp;阈值上限："+Up_limit+" &nbsp;&nbsp;&nbsp;阈值下限："+Down_limit+"</span>");
    var option3={
        title:{
            x:"center",
            y:"2%",
            textStyle:{
                color:'#ffffff'
            }
        },
        tooltip:{
            trigger:"axis",
            axisPointer:{
                animation: false
            }
        },
        color:[
            "orange",
            "green",
            "red",
            "blue",
        ],
        grid:{
            left:"60px",
            right:"50px",
            bottom:"35px",
            top:"30px"
        },
        legend:{
            data:["A","B","C"],
            textStyle:{
                color:"ffffff"
            }
        },
        toolbox:{
            show:true,
            feture:{
                mark:{show:true},
                dataView:{
                    show:true,
                    readOnly:false
                },
                magicType:{
                    show:true,
                    type:["line","bar","stack","tiled"]
                },
                restore:{show:true}
            }
        },
        calculable:true,
        xAxis:[
            {
                type : 'category',
                boundaryGap : false,
                data : time,
                axisLabel:{
                    show:true,
                    intervel:'auto',
                    inside:false,
                    formatter:function(time){
                        if(time){
                            return time.split(" ").join("\n");
                        }
                    }
                },
                axisLine:{
                    lineStyle:{
                        color:'#add8e6'
                    }
                },
            }
        ],
        yAxis:[
            {
                name:valueUnit,
                type : 'value',
                max:max,
                min:min,
                axisLine:{
                    lineStyle:{
                        color:'#ffffff'
                    }
                },
                nameTextStyle:{
                    color:'#ffffff'
                },
                axisLine:{
                    lineStyle:{
                        color:'#add8e6'
                    }
                },
                splitLine:{
                    lineStyle:{
                        color:'#add8e6'
                    }
                }
            }
        ],
        series:[
            {
                name:'A',
                type:'line',
                smooth:true,
                symbolSize: 8,
                hoverAnimation: true,
                data:value1,
                label: {
                    normal: {
                        show: false
                        //position: 'top'//值显示
                    }
                },
                markLine:{
                    itemStyle:{
                        normal:{
                            color:"red"
                        }
                    },
                    data: [
                        // {yAxis: Up_limit, name: '上限'},
                        // {yAxis: Down_limit, name: '下限'}
                    ],
                    silent:false
                }
            },
            {
                name:'B',
                type:'line',
                smooth:true,
                symbolSize: 8,
                hoverAnimation: true,
                data:value2,
                label: {
                    normal: {
                        show: false
                        //position: 'top'//值显示
                    }
                },
                markLine:{
                    itemStyle:{
                        normal:{
                            color:"red"
                        }
                    },
                    //data: [
                    //    {yAxis: Up_limit, name: '上限'},
                    //    {yAxis: Down_limit, name: '下限'}
                    //],
                    silent:false
                }
            },
            {
                name:'C',
                type:'line',
                smooth:true,
                symbolSize: 8,
                hoverAnimation: true,
                data:value3,
                label: {
                    normal: {
                        show: false
                        //position: 'top'//值显示
                    }
                },
                markLine:{
                    itemStyle:{
                        normal:{
                            color:"red"
                        }
                    },
                    //data: [
                    //    {yAxis: Up_limit, name: '上限'},
                    //    {yAxis: Down_limit, name: '下限'}
                    //],
                    silent:false
                }
            }
        ]
    };
    myChart.setOption(option3);
}
function chartLine4(time,value1,value2,value3,value4,cla){
    var myChart = echarts.init(document.getElementsByClassName(cla)[0]);
    // $(".cla>span").remove();
    // $(".cla").append("<span style='float:right;color:white;position:absolute;left:0%;top:100%;font-size:16px;width:100%;text-align:center'>最大值："+max+" &nbsp;&nbsp;&nbsp;最小值："+min+" &nbsp;&nbsp;&nbsp;阈值上限："+Up_limit+" &nbsp;&nbsp;&nbsp;阈值下限："+Down_limit+"</span>");
    var option3={
        title:{
            x:"center",
            y:"2%",
            textStyle:{
                color:'#ffffff'
            }
        },
        tooltip:{
            trigger:"axis",
            axisPointer:{
                animation: false
            }
        },
        color:[
            "orange",
            "green",
            "red",
            "blue",
        ],
        grid:{
            left:"60px",
            right:"50px",
            bottom:"35px",
            top:"30px"
        },
        legend:{
            data:["ALL","A","B","C"],
            textStyle:{
                color:"ffffff"
            }
        },
        toolbox:{
            show:true,
            feture:{
                mark:{show:true},
                dataView:{
                    show:true,
                    readOnly:false
                },
                magicType:{
                    show:true,
                    type:["line","bar","stack","tiled"]
                },
                restore:{show:true}
            }
        },
        calculable:true,
        xAxis:[
            {
                type : 'category',
                boundaryGap : false,
                data : time,
                axisLabel:{
                    show:true,
                    intervel:'auto',
                    inside:false,
                    formatter:function(time){
                        if(time){
                            return time.split(" ").join("\n");
                        }
                    }
                },

                axisLine:{
                    lineStyle:{
                        color:'#add8e6'
                    }
                },
            }
        ],
        yAxis:[
            {
                name:valueUnit,
                type : 'value',
                max:max,
                min:min,
                axisLine:{
                    lineStyle:{
                        color:'#ffffff'
                    }
                },
                nameTextStyle:{
                    color:'#ffffff'
                },
                axisLine:{
                    lineStyle:{
                        color:'#add8e6'
                    }
                },
                splitLine:{
                    lineStyle:{
                        color:'#add8e6'
                    }
                }
            }
        ],
        series:[
            {
                name:'ALL',
                type:'line',
                smooth:true,
                symbolSize: 8,
                hoverAnimation: true,
                data:value4,
                label: {
                    normal: {
                        show: false
                        //position: 'top'//值显示
                    }
                },
                markLine:{
                    itemStyle:{
                        normal:{
                            color:"red"
                        }
                    },
                    //data: [
                    //    {yAxis: Up_limit, name: '上限'},
                    //    {yAxis: Down_limit, name: '下限'}
                    //],
                    silent:false
                }
            },
            {
                name:'A',
                type:'line',
                smooth:true,
                symbolSize: 8,
                hoverAnimation: true,
                data:value1,
                label: {
                    normal: {
                        show: false
                        //position: 'top'//值显示
                    }
                },
                markLine:{
                    itemStyle:{
                        normal:{
                            color:"red"
                        }
                    },
                    data: [
                        // {yAxis: Up_limit, name: '上限'},
                        // {yAxis: Down_limit, name: '下限'}
                    ],
                    silent:false
                }
            },
            {
                name:'B',
                type:'line',
                smooth:true,
                symbolSize: 8,
                hoverAnimation: true,
                data:value2,
                label: {
                    normal: {
                        show: false
                        //position: 'top'//值显示
                    }
                },
                markLine:{
                    itemStyle:{
                        normal:{
                            color:"red"
                        }
                    },
                    //data: [
                    //    {yAxis: Up_limit, name: '上限'},
                    //    {yAxis: Down_limit, name: '下限'}
                    //],
                    silent:false
                }
            },
            {
                name:'C',
                type:'line',
                smooth:true,
                symbolSize: 8,
                hoverAnimation: true,
                data:value3,
                label: {
                    normal: {
                        show: false
                        //position: 'top'//值显示
                    }
                },
                markLine:{
                    itemStyle:{
                        normal:{
                            color:"red"
                        }
                    },
                    //data: [
                    //    {yAxis: Up_limit, name: '上限'},
                    //    {yAxis: Down_limit, name: '下限'}
                    //],
                    silent:false
                }
            },
            
        ]
    };
    myChart.setOption(option3);
}
//可拖动弹出框
function move(id,idTop){
    //return;
    var od = document.getElementById(id);//整个容器
    var odtop = document.getElementById(idTop);//按住拖动的顶部
    if(od && odtop){
        var sec=document.getElementsByTagName("section")[0];
        var dx,dy,mx,my,mouseD,odrag;
        var isIE = document.all ? true : false;
        document.onmousedown = function(e){
            var e = e ? e : event;
            if(e.button == (document.all ? 1 : 0))
            {
                mouseD = true;
            }
        };
        document.onmouseup = function(){
            mouseD = false;
            odrag = "";
            if(isIE)
            {
                od.releaseCapture();
                od.filters.alpha.opacity = 100;
            }
            else
            {
                window.releaseEvents(od.MOUSEMOVE);
                od.style.opacity = 1;
            }
        };
        odtop.onmousedown = function(e){
            odrag = this;
            var e = e ? e : event;
            if(e.button == (document.all ? 1 : 0))
            {
                mx = e.clientX;
                my = e.clientY;
                od.style.left = od.offsetLeft + "px";
                od.style.top = od.offsetTop + "px";
                if(isIE)
                {
                    od.setCapture();
                    od.filters.alpha.opacity = 50;
                }
                else
                {
                    window.captureEvents(Event.MOUSEMOVE);
                    od.style.opacity = 1;
                }
            }
        };
        document.onmousemove = function(e){
            var e = e ? e : event;
            if(mouseD==true && odrag)
            {
                var mrx = e.clientX - mx;
                var mry = e.clientY - my;
                var mywidth= od.clientWidth;
                var myheight=od.clientHeight;
                //console.log(mywidth)
                //console.log(myheight)
                var about = (document.documentElement.clientWidth - document.body.scrollWidth)/2;
                if(parseInt(od.style.left) < about+2){
                    od.style.left = ((document.documentElement.clientWidth - document.body.scrollWidth)/2)+2+"px";
                }else if(parseInt(od.style.left) > (document.body.scrollWidth - mywidth-2)+about){
                   od.style.left = (document.body.scrollWidth - mywidth-2)+about+"px";
                }
                var aboutY=(document.documentElement.clientHeight - document.body.scrollHeight)/2;
                //console.log(aboutY);
                if(parseInt(od.style.top)-2 < aboutY){
                    od.style.top = aboutY+2+"px";
                }else if(parseInt(od.style.top) > 600 - myheight + aboutY){
                    od.style.top = 600 - myheight + aboutY+"px";
                }
                od.style.left = parseInt(od.style.left) +mrx + "px";
                od.style.top = parseInt(od.style.top) + mry + "px";
                mx = e.clientX;
                my = e.clientY;
            }
        }
        document.onmouseout = function(e){
            return false;
        }
    }
}
//关闭遥控框
$("section").on("click","#waiting>p:first-child>span,#waiting>.content>div:nth-child(1)>p:nth-child(2)>button:nth-child(2)",function(){
    $("#waiting").hide();
});
$("#waiting").on("focus","input",function(){
    // var left=(document.documentElement.clientWidth - document.body.scrollWidth)/2 + 900+"px";
    // var top=(document.documentElement.clientHeight - document.body.scrollHeight)/2 + 310+"px";
    $("#configPwd2").show();
    move("configPwd2","configPwdTop2")
})
$("#configPwd2>p>span").click(function(){
    $("#configPwd2").hide();
})
//点击数字按钮
$("#configPwd2>ul>li>span").mousedown(function(e){
    e.preventDefault();
    var num=$(this).attr("about");
    var val=$("input:focus").val();
    if($("input:focus").attr("type")=="password"){
        if(val.length>=6){
            if(num=="back"){
                val=val.slice(0,val.length-1);
                $("input:focus").trigger("input");
                $("input:focus").val(val);
                // check();
            }
            return false;
        }
    }else {
        //if(val=="0"){
        //    val="";
        //}
    }
    if(num=="back"){
        val=val.slice(0,val.length-1);
        $("input:focus").trigger("input");
        $("input:focus").val(val);
        // check();
    }else if(num==20){//.按下
        var type=$("input:focus").attr("data-add");
        if($("input:focus").attr("type")=="password"){
            return false;
        }
        //console.log(type);
        if(type==2){
            val=val+".";
        }else{
            if(val.indexOf(".")==-1){
                val=val+".";
            }else{
                return;
            }
        }

        $("input:focus").trigger("input");
        $("input:focus").val(val);
        //check();
    }else{
        val=val+num;
        $("input:focus").trigger("input");
        $("input:focus").val(val);
        // check();
    }
})
var myType;
var delayTime;
//显示遥控操作框
$(".yks").on("click","p>a",function(){
    if($(this).hasClass("nows")){
        return false;
    }
    $(".yks>p>a").removeClass("active");
    $(this).addClass("active");
    $("#waiting").show();
    $("#waiting>div>div:nth-child(1)").show().siblings("div").hide();
    $(".show_info_inline .confirm input").focus();
    $(".wrong_pwd").hide();
    myType=1;
    delayTime=$(this).attr("data-delay");
})
$(".modalCap").on("click",".yks>a",function(){
    if($(this).hasClass("nows")){
        return false;
    }
    $(".yks>a").removeClass("active");
    $(this).addClass("active");
    $("#waiting").show();
    $("#waiting>div>div:nth-child(1)").show().siblings("div").hide();
    $(".show_info_inline .confirm input").focus();
    $(".wrong_pwd").hide();
    myType=1;
    delayTime=$(this).attr("data-delay");
})
$(".modalIPC").on("click",".IPCyks>li a",function(){
    if($(this).hasClass("nows")){
        return false;
    }
    $(".IPCyks>li a").removeClass("active");
    $(this).addClass("active");
    $("#waiting").show();
    $("#waiting>div>div:nth-child(1)").show().siblings("div").hide();
    $(".show_info_inline .confirm input").focus();
    $(".wrong_pwd").hide();
    myType=1;
    delayTime=$(this).attr("data-delay");
})
//点击选中ipc遥调
$(".modalIPC .IPCyts").on("click","ul>li",function(){
    $(this).addClass("active").siblings("li").removeClass("active");
})
//点击修改遥调
$(".modalIPC .IPCyts").on("click",".mybtns",function(){
    var len=$(".modalIPC .IPCyts>ul>li.active").length;
    if(len<1){
        parent.loadAlerts("请先选中一个遥调，然后进行修改！");
        return false;
    }else{
        $(".yks>p>a").removeClass("active");
        $("#waiting").show();
        $("#waiting>div>div:nth-child(1)").show().siblings("div").hide();
        $(".show_info_inline .confirm input").focus();
        $(".wrong_pwd").hide();
        myType=2;
    }
   
})
function reLoad4Y(id,info,des){
    console.log(des);
    parent.loadAlerts(des.desc);
    var recordId = CheckMod ;
    var devType = CheckedDevType;
    load4YInfo(recordId,devType);
}
var ytCheckVal;
//遥调输入数值确定按钮
$("section").on("click","#waiting .putin>p>button",function(){
    var val=$(".putin input").val();
    var old=$(".modalIPC .IPCyts>ul>li.active>s").attr('data-value');
    if(isNaN(val)){
        parent.loadAlerts("请输入一个有效的数值！");
        return false;
    }
    if(val && val!=old){
        $("#configPwd2").hide();
        var com=$(".modalIPC .IPCyts>ul>li.active>s").attr("data-com");
        var addr=$(".modalIPC .IPCyts>ul>li.active>s").attr("data-addr");
        var number=$(".modalIPC .IPCyts>ul>li.active>s").attr("data-number");
        ytCheckVal = val;
        if(old!=val){
            var o = new Object();
            o.recordId = parseInt(CheckMod);
            o.com = parseInt(com);
            o.addr = parseInt(addr);
            o.type = 1;
            o.number = parseInt(number);
            o.value = parseFloat(val);
            o.userData = 0;
            var m_json = JSON.stringify(o);
            parent.ccc_lib_reqDataByCmd("",CTRL_ELEC_YKT_V30,m_json,reModYt);
        }
    }
});
function checkYTstatu(){
    var number;
    var pointseq;
    if(CheckedDevType==5){//ipc
        number=$(".IPCyts>ul>li.active>s").attr("data-number");
        pointseq=$(".IPCyts>ul>li.active>s").attr("data-pointseq");
        delayTime=$(".IPCyts>ul>li.active>s").attr("data-delay");
      
    }
  
    var ob = new Object();
    ob.module = 6;// 
    ob.recordId = parseInt(CheckMod);
    ob.pointSeq = parseInt(pointseq);
    ob.number = parseInt(number);
    ob.value = parseFloat(ytCheckVal);
    ob.userData = 0;
    var json = JSON.stringify(ob);
    console.log(json);
    parent.ccc_lib_reqDataByCmd("",USER_ELEC_YKT_STATE_GETBYID,json,OutcheckYTStatu);
}
function reModYt(id,info,des){
    console.log(des);
    if(des.result==0 || des.result==-100){
        var fresh; 
        if(CheckedDevType==5){//ipc
            fresh=$(".IPCyts>ul>li.active>s").attr("data-refresh");
        }
        if(fresh==1){
            $("#waiting>.content>div:nth-child(4)").show().siblings("div").hide();
            $("#waiting>.content>div:nth-child(4)>p:nth-child(1)").html("本次执行成功！");
            $("#waiting>.content>div:nth-child(4)>div:nth-child(2)>span").attr("class","green");
            var recordId = CheckMod ;
            var devType = CheckedDevType;
            load4YInfo(recordId,devType);
        }else if(fresh==0){
            $("#waiting>.content>div:nth-child(3)").show().siblings().hide();
            $("#waiting>.content>div:nth-child(3)>p:nth-child(1)").html("命令发送成功，获取结果中！");
            $("#waiting>.content>div:nth-child(3)>div:nth-child(2)>span").attr("class","green");
            checkYTstatu();
        }
      
    }else{
        $("#waiting>.content>div:nth-child(4)").show().siblings("div").hide();
        $("#waiting>.content>div:nth-child(4)>p:nth-child(1)").html("命令发送失败,"+des.desc+"！");
        $("#waiting>.content>div:nth-child(4)>div:nth-child(2)>span").attr("class","red");
    }
}
//点击确定执行命令
$("section").on("click","#waiting>.content>div:nth-child(1)>p:nth-child(2)>button:nth-child(1)",function(){
    $("#waiting>.content>div:nth-child(2)").show().siblings("div").hide();
})
//点击取消执行命令
$("section").on("click","#waiting>.content>div:nth-child(1)>p:nth-child(2)>button:nth-child(2)",function(){
    $("#waiting").hide();
})
//点击操作失败确定按钮
$("section").on("click","#waiting>.content>div:nth-child(4)>p:nth-child(3)>button",function(){
    $("#waiting").hide();
})
//点击确定输入安全密码按钮
$("section").on("click","#waiting>.content>div:nth-child(2)>p:nth-child(2)>button",function(){
 
    var value=$(this).parent("p").prev().children("input").val();
    var o = new Object();
    o.id = 3;
    o.content = value;
    o.userData = 999;
    console.log(o);
    var m_json = JSON.stringify(o);
    parent.ccc_lib_reqDataByCmd("",USER_SYSPARA_SETBYID,m_json,ShowChkPwdInfo);
})

$("section").on("focus","#waiting>.content>div:nth-child(2)>div>input",function(){
    $(".wrong_pwd").hide();
})
//返回验证遥控密码
function ShowChkPwdInfo(id,info,des){
    console.log(des);
    bba="";
    if(des.result==0 || des.result==-100){
        $("#configPwd2").hide();
        $("#waiting>.content>div:nth-child(3)").show().siblings("div").hide();
        $("#waiting>.content>div:nth-child(3)>p:nth-child(1)").html("命令正在发送！");
        $("#waiting>.content>div:nth-child(3)>div:nth-child(2)>span").attr("class","white");
        $(".confirm input").val("");
        if(myType==1){//遥控
            // $("#waiting>.content>div:nth-child(1)").show().siblings("div").hide();
            var val;
            var com;
            var addr;
            var number;
            if(CheckedDevType==5){//ipc
                val=$(".IPCyks p>a.active").attr("data-value");
                com=$(".IPCyks p>a.active").attr("data-com");
                addr=$(".IPCyks p>a.active").attr("data-addr");
                number=$(".IPCyks p>a.active").attr("data-number");
            }else if(CheckedDevType==4){//低压电容
                val=$(".modalCap .yks>a.active").attr("data-value");
                com=$(".modalCap .yks>a.active").attr("data-com");
                addr=$(".modalCap .yks>a.active").attr("data-addr");
                number=$(".modalCap .yks>a.active").attr("data-number");
            }else{
                val=$(".yks>p>a.active").attr("data-value");
                com=$(".yks>p>a.active").attr("data-com");
                addr=$(".yks>p>a.active").attr("data-addr");
                number=$(".yks>p>a.active").attr("data-number");
            }
            var o = new Object();
            o.recordId = parseInt(CheckMod);
            o.com = parseInt(com);
            o.addr = parseInt(addr);
            o.type = 0;
            o.number = parseInt(number);
            o.value = parseInt(val);
            o.userData = 0;
            console.log(o);
            var m_json = JSON.stringify(o);
            parent.ccc_lib_reqDataByCmd("",CTRL_ELEC_YKT_V30,m_json,reCon);
        } if(myType==2){//遥调按钮
            $("#waiting>.content>div:nth-child(5)").show().siblings("div").hide();
            $("#waiting .putin input").val("");
        }
       
    }else{
        $(".wrong_pwd").show().html(des.desc);
    }
}

function reCon(id,info,des){
    console.log(des);
    if(des.result==0 || des.result==-100){
        var fresh; 
        if(CheckedDevType==5){//ipc
            fresh=$(".IPCyks p>a.active").attr("data-refresh");
        }else if(CheckedDevType==4){//低压电容
            fresh=$(".modalCap .yks>a.active").attr("data-refresh");
        }else{
            fresh=$(".yks>p>a.active").attr("data-refresh");
        }
        if(fresh==1){
            $("#waiting>.content>div:nth-child(4)").show().siblings("div").hide();
            $("#waiting>.content>div:nth-child(4)>p:nth-child(1)").html("本次执行成功！");
            $("#waiting>.content>div:nth-child(4)>div:nth-child(2)>span").attr("class","green");
            var recordId = CheckMod ;
            var devType = CheckedDevType;
            load4YInfo(recordId,devType);
        }else if(fresh==0){
            $("#waiting>.content>div:nth-child(3)").show().siblings().hide();
            $("#waiting>.content>div:nth-child(3)>p:nth-child(1)").html("命令发送成功，获取结果中！");
            $("#waiting>.content>div:nth-child(3)>div:nth-child(2)>span").attr("class","green");
            checkStatu();
        }
      
    }else{
        $("#waiting>.content>div:nth-child(4)").show().siblings("div").hide();
        $("#waiting>.content>div:nth-child(4)>p:nth-child(1)").html("命令发送失败,"+des.desc+"！");
        $("#waiting>.content>div:nth-child(4)>div:nth-child(2)>span").attr("class","red");
    }

}

var bba;
//刷新遥控遥调状态
function checkStatu(){
    var number;
    var pointseq;
    var checkvalue;
    if(CheckedDevType==5){//ipc
        number=$(".IPCyks p>a.active").attr("data-number");
        pointseq=$(".IPCyks p>a.active").attr("data-pointseq");
        checkvalue=$(".IPCyks p>a.active").attr("data-checkvalue");
      
    }else if(CheckedDevType==4){//低压电容
        number=$(".modalCap .yks>a.active").attr("data-number");
        pointseq=$(".modalCap .yks>a.active").attr("data-pointseq");
        checkvalue=$(".modalCap .yks>a.active").attr("data-checkvalue");
    }else{
        number=$(".yks>p>a.active").attr("data-number");
        pointseq=$(".yks>p>a.active").attr("data-pointseq");
        checkvalue=$(".yks>p>a.active").attr("data-checkvalue");
    }
  
    var ob = new Object();
    ob.module = 6;// 
    ob.recordId = parseInt(CheckMod);
    ob.pointSeq = parseInt(pointseq);
    ob.number = parseInt(number);
    ob.value = parseFloat(checkvalue);
    ob.userData = 0;
    var json = JSON.stringify(ob);
    console.log(json);
    parent.ccc_lib_reqDataByCmd("",USER_ELEC_YKT_STATE_GETBYID,json,OutcheckStatu);
}
function OutcheckStatu(id,info,des){
    console.log(des);
    if(des.result==0){
        $("#waiting>.content>div:nth-child(4)").show().siblings("div").hide();
        $("#waiting>.content>div:nth-child(4)>p:nth-child(1)").html("执行成功,请耐心等待执行结果刷新,勿重复操作！");
        clearInterval(bba);
        var times = (delayTime*3 >8)?8:delayTime*3;
        setTimeout(function(){
            var recordId = CheckMod ;
            var devType = CheckedDevType;
            load4YInfo(recordId,devType);
            $("#waiting>.content>div:nth-child(4)>p:nth-child(1)").html("执行结果已刷新！");
        },1000*times);
       
    }else{
        if(!bba){
            var num=0;
            bba = setInterval(function(){
                checkStatu();
                num++;
                if(num==15){
                    clearInterval(bba);
                    $("#waiting>.content>div:nth-child(4)").show().siblings("div").hide();
                    $("#waiting>.content>div:nth-child(4)>p:nth-child(1)").html("本次执行结果刷新失败！");
                    $("#waiting>.content>div:nth-child(4)>div:nth-child(2)>span").attr("class","red");
                    var recordId = CheckMod ;
                    var devType = CheckedDevType;
                    load4YInfo(recordId,devType);
                }
            },1000);
        }
    }
}
function OutcheckYTStatu(id,info,des){
    console.log(des);
    if(des.result==0){
        $("#waiting>.content>div:nth-child(4)").show().siblings("div").hide();
        $("#waiting>.content>div:nth-child(4)>p:nth-child(1)").html("执行成功,请耐心等待执行结果刷新,勿重复操作！");
        clearInterval(bba);
        var times = (delayTime*3 >8)?8:delayTime*3;
        setTimeout(function(){
            var recordId = CheckMod ;
            var devType = CheckedDevType;
            load4YInfo(recordId,devType);
            $("#waiting>.content>div:nth-child(4)>p:nth-child(1)").html("执行结果已刷新！");
        },1000*times);
       
    }else{
        if(!bba){
            var num=0;
            bba = setInterval(function(){
                checkYTstatu();
                num++;
                if(num==15){
                    clearInterval(bba);
                    $("#waiting>.content>div:nth-child(4)").show().siblings("div").hide();
                    $("#waiting>.content>div:nth-child(4)>p:nth-child(1)").html("本次执行结果刷新失败！");
                    $("#waiting>.content>div:nth-child(4)>div:nth-child(2)>span").attr("class","red");
                    var recordId = CheckMod ;
                    var devType = CheckedDevType;
                    load4YInfo(recordId,devType);
                }
            },1000);
        }
    }
}

//点击导出曲线数据到U盘
$(".my_date>a.mytbnsSolid").click(function(){
    var comid;
    var ob = new Object();
    if(CheckedDevType ==13 || CheckedDevType ==18|| CheckedDevType ==19|| CheckedDevType ==25){//分组曲线
        comid=$(this).parent(".my_date").next(".fourLine2").children("a.active").attr("about");
        ob.type=2;
        ob.id= parseInt($(".DCchargerMods>li.active").attr("type"));
     }else{
        comid=$(this).parent(".my_date").next(".fourLine").children("a.active").attr("about");
        ob.type=1;
     }
   
    if(isNaN(comid) && isNaN(comid2)){
        return false;
    }else{
       
    }


    ob.recordId = parseInt(CheckMod);//
    ob.CombId = parseInt(comid);//
    ob.startTime = Eng_star_date;//
    ob.endTime = Eng_end_date;//
    ob.userData = 0;
    var json = JSON.stringify(ob);
    console.log(json);
    parent.ccc_lib_reqDataByCmd("",USER_EXPORT_ACDC_FILE,json,ReExportsLineData);
    
})
//点击剩余电流导出曲线数据到U盘
$("a.afterCunBtn").click(function(){
    var type=$(this).attr("data-type");
    var com=$(this).attr("data-com");
    var addr=$(this).attr("data-addr");
    var ch=$(this).attr("data-ch");
    var rcdid=$(this).attr("data-rcdid");
    if(type==8){
        type=1;
    }else if(type==16){
        type=2;
    }
    if(rcdid){
        var ob = new Object();
        ob.type = 3;
        ob.passType = parseInt(type);//
        ob.rcdId = parseInt(rcdid);//
        ob.com = parseInt(com);//
        ob.addr = parseInt(addr);//
        ob.ch = parseInt(ch);//
        ob.startTime = Eng_star_date;//
        ob.endTime = Eng_end_date;//
        ob.userData = 0;
        var json = JSON.stringify(ob);
        console.log(json);
        parent.ccc_lib_reqDataByCmd("",USER_EXPORT_ACDC_FILE,json,ReExportsLineData);
    }
   
    
})
function ReExportsLineData(id,info,des){
    parent.loadAlerts(des.desc);
}
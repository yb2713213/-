/**
 * Created by Administrator on 2021-8-9.
 */
"use strict";
var isFirstLoad=0;
var pages = 0;
var checkedModId = 0;
var checkedBoxId = 0;
var checkedAfterCurType = 0;
var fileObj = {};//文件对象
var currentObj = [];//临时全局对象
fileObj.sliceLenth = 2500;//切割长度
fileObj.size = 0;//数据长度
fileObj.arr = [];//二进制数据
fileObj.fileName = "";//文件名
fileObj.status = 0;//保存的状态
$(document).click(function(event){
    var _con = $('.checkOpts');   // 设置目标区域
    if(event.target.nodeName=="SELECT"){
        return false;
    }
    if(!_con.is(event.target) && _con.has(event.target).length === 0){ // Mark 1
        $('.checkOpts').fadeOut();          //淡出消失
    }
});
$(document).click(function(event){
    var _con2 = $('#keyboard');   // 设置目标区域
    if(event.target.nodeName=="INPUT" && $('#keyboard').css("display")!="none"){
        return false;
    }
    if(event.target.className=="return lastitem"){
        $('#keyboard').fadeOut();
        return false;
    }
    if(!_con2.is(event.target) && _con2.has(event.target).length === 0){ // Mark 1
        $('#keyboard').fadeOut();          //淡出消失
    }
});
var PassWord="";//系统设置密码
var RunModel;//系统运行模式
var first=true;
var ttPage = 0;//页码(告警)
var timeInter;//对时里刷新时间的定时器
var userItem;

//可拖动弹出框
function move(id,idTop){
    //获取元素
    var id = id;
    var login = document.querySelector('#'+id);
    var title = document.querySelector('#'+idTop);
    var wid = login.offsetWidth;
    var hig = login.offsetHeight;
    // var allWid = document.body.clientWidth;
    // var allHei = document.body.clientHeight;
    // console.log(allWid);
    // console.log(allHei);
    //鼠标按下，获取登录框位置
    title.addEventListener('mousedown', function(e) {
        var x = e.pageX - login.offsetLeft;
        var y = e.pageY - login.offsetTop;
        //鼠标移动，触发移动事件
        document.addEventListener('mousemove', move);
        function move(e) {
            var toLeft = e.pageX - x;
            var toTop =  e.pageY - y;
            if(toLeft>0 && toTop>0 && (1024 - wid)>toLeft && (545 - hig)>toTop){
                login.style.left = toLeft + 'px';
                login.style.top = toTop + 'px';
            }
           
        }
        //鼠标抬起，销毁鼠标移动事件
        document.addEventListener('mouseup', function() {
            document.removeEventListener('mousemove', move);
        });
    });
    
};

function loginCB(id,info,des){
    console.log(des);
    console.log(id);
    switch(id){
        case 1000008:
            break;
        case 1000000:
            $("footer").hide();
            $("header").show();
            $("section").show();
            if(isFirstLoad==0){
                document.getElementById("mapFrame").contentWindow.loadMenuListFn();
            }
            isFirstLoad++;
            break;
        case 1000007:
            break;
        default:
            console.log(des);
            $("footer").show();
            $("header").hide();
            $("section").hide();
            break;
    }
};
function noticeCB(id,info,des){
    console.log(des);
    des=JSON.parse(des);
    if(des.type==2){
        window.loadChannelList(2);
        window.loadRCDList();
    }
 
};
window.onload=function() {
    ccc_lib_enableByVerify("admin", hex_md5("admin"), 0, g_proto_ws, loginCB, noticeCB);
    //ccc_lib_enableByVerify("admin",hex_md5("admin"),0,g_proto_ajax,"","");
    //getSingleInfo(10);
    //getSingleInfo(38);
    //getSingleInfo(44);
    getOrderListMsgSingle(3);
    getOrderListMsgSingle(120);
    getOrderListMsgSingle(110);
    // loadMenuList(1);
};
$("#system").on("input","input",function(){
    return false;
    if($(this).attr("type")=="date" || $(this).attr("type")=="time" ||$(this).attr("type")=="file" ){
        return false;
    }
    var val=$(this).val();
    val = val.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
    val = val.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
    val= val.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
    $(this).val(val);

});
$("#low_model").on("input","input",function(){
    var attrid=$(this).attr("data-id");
    var val=$(this).val();
    if(attrid==9){//限制开关序号只能输入非中文
        val = val.replace(/[^\x00-\xff]/g,"");
        $(this).val(val);
    }else{
        val = val.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
        val = val.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
        val= val.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
        $(this).val(val);
    }
});
$("#system,#configs,#identifyCode,.systemPower6,.systemNum,.systemDev,.systemAlarm,.systemRCD").on("click","input[type='text'],input[type='password']",function(){
    // $("#keyboard").hide();
  
    var id=$(this).attr("id");
    var cls=$(this).attr("class");
    if(id=="date" || id=="time"){
        return false;
    }else{
        if($(this).hasClass("loadNum")){
            if(id=="systemPwd"){
                $("#configPwd").show().css("left","690px").css("top","100px");
                return false;
            }
            $("#keyboard").hide();
            $("#configPwd").show();
            $("#keyboard").hide();
            // var left=(document.documentElement.clientWidth - document.body.scrollWidth)/2 + 720+"px";
            var left=$(this).css("width");
            var height=$(this).css("height");
            var lt=$(this).offset().left - $("body").offset().left ;
            var ht=$(this).offset().top - $("body").offset().top ;
            if((lt+parseFloat(left))> 512){
                $("#configPwd").show().css("left","150px").css("top",  "115px");
            }else{
                $("#configPwd").show().css("left","500px").css("top",  "115px");
            }
        }else if($(this).hasClass("loadWord")){
            $("#configPwd").hide();
            $("#keyboard").show();
    
        }

       
    }
    
   
});

// });
$("section").on("click",".checkOpts>li",function(){
    $(this).addClass("active");
    setTimeout(function(){
        $(".checkOpts").hide();
        $(".checkOpts>li.active").removeClass("active");
    },200);
    var val=$(this).attr("data-value");
    $("select.active.mons").change(function(event){
        window.modifyRCD(event);
    });
    $("select.active.mons2").change(function(event){
        window.modifyRCDchannel(event);
    });
    $("select.active").val(val).attr("data-setval",val).trigger('change');
});
function loadAlerts(desc){
    $(".alert>p").hide();
    if(desc.length<=15){
        $(".alert").css("line-height","40px")
    }else{
        $(".alert").css("line-height","22px")
    }
    $(".alert>strong").html(desc);
    $(".alert").show();
    setTimeout(function(){
        $(".alert").fadeOut();
    },1000)
};
function loadAlertsSuperRight(desc){
    $(".alert>p").hide();
    if(desc.length<=15){
        $(".alert").css("line-height","40px")
    }else{
        $(".alert").css("line-height","22px")
    }
    $(".alert>strong").html(desc);
    $(".alert").show();
    setTimeout(function(){
        $(".alert").fadeOut();
    },3000);
};
function loadAlertsSuperError(desc){
    $(".alert>p").show();
    if(desc.length<=15){
        $(".alert").css("line-height","40px")
    }else{
        $(".alert").css("line-height","22px")
    }
    $(".alert>strong").html(desc);
    $(".alert").show();
    //setTimeout(function(){
    //parent.$(".alert").fadeOut("slow");
    //},3000);
};
//点击进入告警和参数设置界面
$("#loadIn>a").click(function(){
    $(".alert").fadeOut();
    var about=$(this).attr("about");
    $("#"+about).show().siblings("div").hide();
    $(this).addClass("active").siblings("a").removeClass("active");
    document.getElementById("mapFrame").contentWindow.clearIntervalTimeId();
    if(about=="configs"){
        //elecClearTimeFn();//清除电气图定时器
        $("#loadIn>a").hide();
        $("#loadIn>b").show();
        $("#loadIn>b:nth-child(8)").hide();
        $("#identifyCode").show().attr("about",1);
        $("#identifyCode input").focus();
        if(RunModel==1){
            $("#identifyCode input").val(PassWord);
        }else{
            $("#identifyCode input").val("");
        }
        $("#configs").hide();
        // var left=(document.documentElement.clientWidth - document.body.scrollWidth)/2 + 650+"px";
        // var top=(document.documentElement.clientHeight - document.body.scrollHeight)/2 + 150+"px";
        $("#configPwd").show().css("left","690px").css("top","100px");

    }else if(about=="records"){
        $("#frames").attr("src","record.html").show().siblings().hide();
    }else if(about=="runs"){
        document.getElementById("mapFrame").contentWindow.loadMenuListFn();
        $("#main").show().siblings().hide();
    }else if(about=="operats"){
        $("#frames").attr("src","operating.html").show().siblings().hide();
    }else if(about=="diagnose"){
        $("#frames").attr("src","diagnose.html").show().siblings().hide();
    }else if(about=="alarms"){
        $("#frames").attr("src","alarms.html").show().siblings().hide();
    }
});
//点击返回主页
$("#loadIn>b.return").click(function(){
    // if(parent.pages==0){
        var isRight=true;
        $(".businessContent>div>div:nth-child(n+3)>table>tbody>tr").each(function(){
            if($(this).hasClass("change")){
                loadAlerts("有编辑后未保存的项，建议保存！");
                isRight=false;
            }
        });
        if(!isRight){
            return false;
        }

        $(".alert").fadeOut();
        $(".systemItem>a.active").removeClass("active");
        $("#loadIn>a").show();
        $("#loadIn>a:nth-child(7)").addClass("active").siblings("a").removeClass("active");
        $("#loadIn>b").hide();
        $("#main").show().siblings("div").hide();
        $("#batsInfo>p>span.active").removeClass("active");

        $("#loadIn>u").hide();
        try{
            document.getElementById("mapFrame").contentWindow.loadMenuListFn();
            document.getElementById("frames").contentWindow.removeInterval();
        }catch(err){
            console.log(err)
        }
       
   /* }else{
        // document.getElementById("mapFrame").contentWindow.loadMenuListFn();
        window.location.reload();
    }*/
});
//点击返回上一层
$("#loadIn>b.back").click(function(){
    var abt = $(this).attr("about");
    if(abt==2){
        $(".alert").fadeOut();
        $(".systemItem>a.active").removeClass("active");
        $("#loadIn>a").hide();
        $("#loadIn>b").hide();
        $("#loadIn>b:last-child").show();
        $("#main").show().siblings("div").hide();
        $("#batsInfo>p>span.active").removeClass("active");
        checkedModId = null;//清空;
        checkedBoxId = null;//清空;
        checkedAfterCurType = null;//清空;
        try{
            document.getElementById("frames").contentWindow.removeInterval(); 
            document.getElementById("mapFrame").contentWindow.configMap(parent.pages);//电气图实时数据
        }catch(err){
            console.log(err)
        }
      
    }else if(abt==1){
        var isRight=true;
        $(".businessContent>div>div:nth-child(n+3)>table>tbody>tr").each(function(){
            if($(this).hasClass("change")){
                loadAlerts("有编辑后未保存的项，建议保存！");
                isRight=false;
            }
        });
        if(!isRight){
            return false;
        }
        $("#system").show().siblings().hide();
        parent.$("#loadIn>b.back").hide();
    }else if(abt==3){
        $(this).hide();
        try{
            document.getElementById("frames").contentWindow.hideBall();
        }catch(err){
            console.log(err)
        }
       
    }
    
});
//点击数字按钮
$("#loadPwd>ul>li>span,#configPwd>ul>li>span").mousedown(function(e){
    e.preventDefault();
    var num=$(this).attr("about");
    var val=$("input:focus").val();
    if($("input:focus").attr("type")=="password"){
        if(val.length>=6){
            if(num=="back"){
                val=val.slice(0,val.length-1);
                $("input:focus").trigger("input");
                $("input:focus").val(val);
                check();
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
        check();
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
        check();
    }
    if($("input:focus").attr("class")=="jump-ipt"){
        var len=$("input:focus").parent(".M-box3").attr('data-length');
        if(parseInt(val)>=parseInt(len)){
            $("input:focus").trigger("input");
            $("input:focus").val(len);
        }
    }
});
$("#loadPwd,#configPwd,#keyboard").mousedown(function(e){
    e.preventDefault();
});
$("#identifyCode img[about='error'],.clearAlarm img[about='error'],.clearBat img[about='error']").click(function(){
    $(this).parent("p").prev("p").children("input").val("").focus();
});
$("#identifyCode").mousedown(function(){
    $("#identifyCode input").focus();
});
$("#configPwd>p>span").click(function(){
    $("#configPwd").hide();
});
$("#keyboard").mousedown(function(e){
    // $(".loadNum").focus();
});
$("#modifyRCD,#modifyChannel").on("click","p>b,p>button",function(){
    $("#configPwd,#keyboard").hide();
});
$("#identifyCode img[about='sure']").click(function(){
    var val=$(this).parent("p").prev("p").children("input").val();
    var abt=$("#identifyCode").attr("about");
    if(val=="211201" && abt==2){//进入工程配置菜单
        $("#configs").show().siblings("div").hide();
        parent.$("#loadIn .back").show().attr("about",1);
        $(".configItem>a:nth-child(1)").click();
    } else if(val == PassWord ){//进入系统设置配置页面
        $("#system").show().siblings("div").hide();
        $(this).parent("p").prev("p").children("input").val("");
        loadMenuList(1);
        $("#system .systemItem>a:nth-child(1)").click();
        $("#identifyCode").hide();
        $("#configPwd").hide();
    }else{
        loadAlerts("密码输入错误，请重新输入");
        $(this).parent("p").prev("p").children("input").val("").focus();
    }
});
$("input").bind("input",function(){
    check();
});
$("#loadPwd>ul>li>span,#configPwd>ul>li>span,#loadIn>a,#loadIn>b,#judgeOpera>p>a,.sureBtn,#keyboard li").mousedown(function(){
    $(this).addClass("active");
});

$("#loadPwd>ul>li>span,#configPwd>ul>li>span,#loadIn>a,#loadIn>b,#judgeOpera>p>a,.sureBtn,#keyboard li").mouseup(function(){
    $(this).removeClass("active");
});
$("body").on("mousedown","button",function(){
    $(this).addClass("bgs");
});
$("body").on("mouseup","button",function(){
    $(this).removeClass("bgs");
});
//系统时间限制输入正确格式
function check(){
    var name=$("input:focus").attr("class");
    var val=$("input:focus").val();
    val=val+"";
    //console.log(name);
    //console.log(val);
    switch(name){
        case "sysYear":
        case "bat1Year":
        case "bat2Year":
            if(val.length>4){val=val.slice(0,val.length-1);}break;
        case "sysMonth":
        case "bat1Month":
        case "bat2Month":
            if(val.length>2 || val>12){val=val.slice(0,val.length-1);}break;
        case "sysDay":
        case "bat1Day":
        case "bat2Day":
            if(val.length>2 || val>31){val=val.slice(0,val.length-1);}break;
        case "sysHour":
        case "bat1Hour":
        case "bat2Hour":
            if(val.length>2 || val>59){val=val.slice(0,val.length-1);}break;
        case "sysMin":
        case "bat1Min":
        case "bat2Min":
            if(val.length>2 || val>59){val=val.slice(0,val.length-1);}break;
        case "sysSec":
        case "bat1Sec":
        case "bat2Sec":
            if(val.length>2 || val>59){val=val.slice(0,val.length-1);}break;
        case "oldPwd":
        case "newPwd":
        case "rePwd":
            if(val.length>6){val=val.slice(0,val.length-1);}break;
        default:break;
    }
    $("input:focus").val(val);
};
////工程配置菜单内容
//切换工程配置菜单
$(".configItem>a").click(function(){
    var isRight=true;
    $(".businessContent>div>div:nth-child(n+3)>table>tbody>tr").each(function(){
        if($(this).hasClass("change")){
            loadAlerts("有编辑后未保存的项，建议保存！");
            isRight=false;
        }
    });
    if(!isRight){
        return false;
    }
    if($(this).hasClass("active")){
        return false;
    }
    CheckedFac="";
    // var old=$(".configItem>a.active>img").attr("src");
    // var old2=$(".configItem>a.active>img").attr("alt");
    // var news=$(this).children("img").attr("alt");
    // var news2=$(this).children("img").attr("src");
    // $(this).children("img").attr("src",news).attr("alt",news2);
    // $(".configItem>a.active>img").attr("src",old2).attr("alt",old);
    $(this).addClass("active").siblings("a").removeClass("active");
    var abt=$(this).attr("about");
    $(".configContent>div."+abt).show().siblings("div").hide();
    if(abt=="menuConfig"){//菜单配置
        loadMenuList(1);
        loadTypesFn()
    }else if(abt=="datamodal"){//数据模型
        loadTypesFn(1);

    }else if(abt=="itemConfig"){//用户分项
        load_userItem();
    }else if(abt=="FPGConfig"){//峰平谷配置
        daytimelist();//加载日时间表
        load_yeartimelist();//加载年时间表
    }else if(abt=="devConfig"){
        loadBoxList(2);
        loadTypes('all',4);
        currentObj = [];
    }else if(abt=="factMods"){
        loadFacts(1);
    }else if(abt=="paramConfig"){
        getOrderListMsg(2);
    }/*else if(abt=="devPoint"){//设备点表
        loadMenuList(2);
    }*/else if(abt=="mapConfig"){//电气图
        $('.menuConfig .menuList li').each(function () {
            var theType = $(this).attr('about');
            var theValue = $(this).find('span').text();
            var bigTitle = $("header .logoTitle").text();
            $('.mapConfig a[type='+theType[0]+']').parents('tr').find('td:nth-of-type(2)').text(''+theValue+'电气图');
            $('.mapConfig a[type=0]').parents('tr').find('td:nth-of-type(2)').text(''+bigTitle+'主图');
        });
    }//end if
});
///系统参数菜单内容
//切换系统配置菜单
$(".systemItem>a").click(function(){
    if($(this).hasClass("active")){
        return false;
    }
    $("#modifyRCD").hide();
    $("#modifyChannel").hide();
    $(this).addClass("active").siblings("a").removeClass("active");
    var abt=$(this).attr("about");
    $(".systemContent>div."+abt).show().siblings("div").hide();
    if(abt=="systemNum"){
        $(".systemNum>ul>li:nth-child(1)").click();
    }else if(abt=="systemDev"){
        loadBoxList(1);
        $(".systemDev>div:nth-child(1)").show();
        $(".systemDev>div:nth-child(2)").hide();
        load_userItem();
    }else if(abt=="systemAlarm"){
        loadTypesFn()
    }else if(abt=="systemPower"){
        loadMenuList(1);
    }else if(abt=="systemRCD"){
        // $(".systemRCD>div:nth-child(1)").show().siblings("div").hide();
        // getOrderListMsgSingle(119);
        // loadRCDList();
    }


});
//切换系统配置-电源系统参数菜单
$(".systemPower>ul").on("click","li",function(){
    $(this).addClass("active").siblings("li").removeClass("active");
    var about=$(this).attr("about");
    $(".systemPower div."+about).show().siblings("div").hide();
    $("#keyboard").hide();
    $("#configPwd").hide();
    var pattrn=$(this).attr("data-num");
    if(pattrn){
        getOrderListMsg(pattrn);
    }else{
        $(".systemPower div."+about+">div>a:nth-child(1)").click();
    }
  
});
//直流和通讯电源获取电源参数
$(".systemPower1,.systemPower4").on("click","div>a",function(){
    $(this).addClass("active").siblings("a").removeClass("active");
    var pattrn=$(this).attr("data-num");
    getOrderListMsg(pattrn);
});

///系统参数菜单内容
// //切换系统配置菜单
// $(".systemItem>a").click(function(){
//     if($(this).hasClass("active")){
//         return false;
//     }
//     $(this).addClass("active").siblings("a").removeClass("active");
//     var abt=$(this).attr("about");
//     $("#configPwd").hide();
//     $(".systemContent>div."+abt).show().siblings("div").hide();
//     if(abt=="systemNum"){
//         $(".systemNum>ul>li:nth-child(1)").click();
//     }else if(abt=="systemDev"){
//         loadBoxList(1);
//         $(".systemDev>div:nth-child(1)").show();
//         $(".systemDev>div:nth-child(2)").hide();
//         load_userItem();
//     }else if(abt=="systemAlarm"){
//         loadTypesFn()
//     }else if(abt=="systemPower"){
//         $(".systemPower>ul>li:nth-child(1)").click();
//     }


// });
//切换系统配置-系统参数菜单
$(".systemNum>ul>li").click(function(){
    $(this).addClass("active").siblings("li").removeClass("active");
    var about=$(this).attr("about");
    $(".systemNum div."+about).show().siblings("div").hide();
    $("#keyboard").hide();
    $("#configPwd").hide();
    var type=$(this).attr("data-num");
    clearInterval(timeInter);
    timeInter="";
    if(type==5){//获取对时
        var o = new Object();
        o.type = 5;
        o.subType = 0;
        o.userData = 0;
        var m_json = JSON.stringify(o);
        ccc_lib_reqDataByCmd("",USER_GW_DEVINFO_GETBYID,m_json,reCheckTimes);
        loadTimes();
        getTimes();
        if(!timeInter){
            timeInter=setInterval(function(){
                getTimes();
            },1000);
        }
    }else if(type==15){//获取版本信息
        var o = new Object();
        o.type = 0;
        o.subType = 0;
        o.userData = 0;
        var m_json = JSON.stringify(o);
        ccc_lib_reqDataByCmd("",USER_GW_DEVINFO_GETBYID,m_json,reNetVersion);
    }else if(type==8){//获取网卡信息
        var o = new Object();
        o.type = 1;
        o.subType = 0;
        o.userData = 0;
        var m_json = JSON.stringify(o);
        ccc_lib_reqDataByCmd("",USER_GW_DEVINFO_GETBYID,m_json,reNetCardMsg);
    }else if(type==6){
        var pattrn=$(this).attr("type");
        getOrderListMsg(pattrn);
    }
});
//返回版本信息
function reNetVersion(id,info,des){
    console.log(des);
    $(".version>ul>li:nth-child(1)>b").html(des.serial);
    $(".version>ul>li:nth-child(2)>b").html(des.hw);
    $(".version>ul>li:nth-child(3)>b").html("EMT");
    $(".version>ul>li:nth-child(4)>b").html(des.sw);
    $(".version>ul>li:nth-child(5)>b").html(des.model);
    $(".version>ul>li:nth-child(6)>b").html(des.webVer);
    $(".version>ul>li:nth-child(7)>b").html(des.os);
    $(".version>ul>li:nth-child(8)>b").html(des.t61850Ver);
};
//点击版本信息里的重启
$(".version>p:last-child>a.reSet,.sysNetMsg .alertMsg>a").click(function(){
    $(".restart_alert").show().attr("about",1);
    $(".restart_alert footer").show();
});
//点击一键清除/恢复出厂
$(".paramConfig>ul").on("click","li>button",function(){
    $(this).addClass("active");
    var ids=$(this).attr("data-id");
    if(ids==111){
        $(".restart_alert").show().attr("about",2);
    }else if(ids==121){
        $(".restart_alert").show().attr("about",4);
    }
    $(".restart_alert footer").show();
});
$(".restart_alert .popContainer>header>b,.restart_alert .popContainer>footer>a:nth-child(1)").click(function(){
    $(".restart_alert").hide();
});
$(".restart_alert .popContainer>footer>a:nth-child(2)").click(function(){
    var abt = $(".restart_alert").attr("about");
    if(abt==1){//重启设备
        $(".restart_all_alert").show();
        $(".restart_alert").hide();
        $(".restart_all_alert main>p>span").html(5);
        // $(".restart_all_alert").hide();
        var o = new Object();
        o.cmd = 2;
        o.userData = 0;
        var m_json = JSON.stringify(o);
        ccc_lib_reqDataByCmd("",USER_CONTRL_GW3X,m_json,reStartEnd);

        var tim = setInterval(function(){
            var num=parseInt($(".restart_all_alert main>p>span").html());
            num--;
            $(".restart_all_alert main>p>span").html(num);
            if(num==0){
                clearInterval(tim);
                window.location.reload();
            }
        },1000);
    }else if(abt==2){//一键清除数据库数据
        var id = $(".paramConfig>ul>li>button.active").attr("data-id");
        var o = new Object();
        o.class = 2;
        o.paraId = parseInt(id);
        o.userData = 0;
        var m_json = JSON.stringify(o);
        ccc_lib_reqDataByCmd("",USER_OPERATE_BY_CUSTOM,m_json,reCheck);
        $(".restart_alert").hide();
    }else if(abt==3){//重置告警预警
        var type = $(".agreements>ul>li.active").attr("about");
        var o = new Object();
        o.class = 3;
        o.devType = parseInt(type);
        o.userData = 0;
        var m_json = JSON.stringify(o);
        ccc_lib_reqDataByCmd("",USER_OPERATE_BY_CUSTOM,m_json,reCheck);
        $(".restart_alert").hide();
    }else if(abt==4){//恢复出厂设置
        $(".restart_all_alert").show();
        $(".restart_alert").hide();
        $(".restart_all_alert main>p>span").html(5);
        var o = new Object();
        o.cmd = 1;
        o.userData = 0;
        var m_json = JSON.stringify(o);
        ccc_lib_reqDataByCmd("",USER_CONTRL_GW3X,m_json,reStartEnd);
        var tim = setInterval(function(){
            var num=parseInt($(".restart_all_alert main>p>span").html());
            num--;
            $(".restart_all_alert main>p>span").html(num);
            if(num==0){
                clearInterval(tim);
                window.location.reload();
            }
        },1000);
    }else if(abt==5){
        window.deleteRCDdev();
        $(".restart_alert").hide();
    }
  
});
function reStartEnd(id,info,des){
    console.log(des);
    if(des.result==0){
        clearInterval(tim);
        window.location.reload();
    }else{
        loadAlerts(des.desc);
        clearInterval(tim);
    }
};
function reCheck(id,info,des){
    loadAlerts(des.desc);
    $(".paramConfig>ul>li>button.active").removeClass("active");
    $(".agreements>ul>li.active").click();
};
//修改系统密码
$(".sysModPwd>div:nth-child(1)>p:nth-child(3)>a").click(function(){
    var pwd1=$(".sysModPwd>div:nth-child(1)>p:nth-child(1)>input").val();
    var pwd2=$(".sysModPwd>div:nth-child(1)>p:nth-child(2)>input").val();
    if(pwd1.length<6){
        loadAlerts("密码长度必须输入六位！");
        return;
    }
    if(pwd1!=pwd2){
        loadAlerts("两次输入不一致！");
        return ;
    }
    if(pwd1== pwd2){
        var o = new Object();
        o.id = parseInt(3);
        o.content = pwd1;
        o.userData = 0;
        console.log(o);
        var m_json = JSON.stringify(o);
        ccc_lib_reqDataByCmd("",USER_SYSPARA_SETBYID,m_json,reModTotal);
    }
});

function reModTotal(id,info,des){
    $("#configPwd").hide();
    $("#modifyModal").hide();
    $("#keyboard").hide();
    loadAlerts(des.desc);
    getOrderListMsg(0);
    //getSingleInfo(38);
};
function getTimes(){
    var date=new Date();
    var year=date.getFullYear();
    var month=date.getMonth()+1;
    var day=date.getDate();
    var hour=date.getHours();
    var min=date.getMinutes();
    var sec=date.getSeconds();
    if(month<10){
        month="0"+month;
    }
    if(day<10){
        day="0"+day;
    }
    if(hour<10){
        hour="0"+hour;
    }
    if(min<10){
        min="0"+min;
    }
    if(sec<10){
        sec="0"+sec;
    }
    $("#times").html(year+"-"+month+"-"+day+" "+hour+":"+min+":"+sec);
};
function loadTimes(){
    $(".checkTime>p:nth-child(6) select>option").remove();
    $(".checkTime>p:nth-child(7) select>option").remove();
    //添加年列表
    var years="";
    for(var i=0;i<21;i++){
        years+="<option value='"+(2020+i)+"'>"+(2020+i)+"</option>";
    }
    $(".checkTime>p:nth-child(6)>label:nth-child(1)>select").append(years);
    //添加月列表
    var months="";
    for(var i=1;i<13;i++){
        if(i<10){
            i="0"+i;
        }
        months+="<option value='"+i+"'>"+i+"</option>";
    }
    $(".checkTime>p:nth-child(6)>label:nth-child(2)>select").append(months);
    //添加日列表
    var days="";
    for(var i=1;i<32;i++){
        if(i<10){
            i="0"+i;
        }
        days+="<option value='"+i+"'>"+i+"</option>";
    }
    $(".checkTime>p:nth-child(6)>label:nth-child(3)>select").append(days);
    //添加时列表
    var hours="";
    for(var i=0;i<24;i++){
        if(i<10){
            i="0"+i;
        }
        hours+="<option value='"+i+"'>"+i+"</option>";
    }
    $(".checkTime>p:nth-child(7)>label:nth-child(1)>select").append(hours);
    //添加分秒列表
    var min="";
    for(var i=0;i<60;i++){
        if(i<10){
            i="0"+i;
        }
        min+="<option value='"+i+"'>"+i+"</option>";
    }
    $(".checkTime>p:nth-child(7)>label:nth-child(2)>select").append(min);
    $(".checkTime>p:nth-child(7)>label:nth-child(3)>select").append(min);
};
//返回对时
function reCheckTimes(id,info,des){
    console.log(des);
    $(".checkTime>p:nth-child(6)>input").val("");
    for(var i=0;i<des.data.length;i++){
        if(des.data[i].sync==0){
            $(".checkTime>p:nth-child(2)>input:nth-child(6)").val(des.data[i].domain);
            $(".checkTime>p:nth-child(2)").attr("data-cycle",des.data[i].cycle);
            if(des.data[i].enale==0){
                $(".checkTime>p:nth-child(2)>input:nth-child(1)").prop("checked",false);
            }else{
                $(".checkTime>p:nth-child(2)>input:nth-child(1)").prop("checked",true);
                $(".checkTime>p:nth-child(2)>input:nth-child(1)").attr("tag",1);
            }
        }else  if(des.data[i].sync==1){
            $(".checkTime>p:nth-child(3)").attr("data-cycle",des.data[i].cycle);
            if(des.data[i].enale==0){
                $(".checkTime>p:nth-child(3)>input:nth-child(1)").prop("checked",false);
            }else{
                $(".checkTime>p:nth-child(3)>input:nth-child(1)").prop("checked",true);
            }

        }else  if(des.data[i].sync==2){
            $(".checkTime>p:nth-child(4)").attr("data-cycle",des.data[i].cycle);
            if(des.data[i].enale==0){
                $(".checkTime>p:nth-child(4)>input:nth-child(1)").prop("checked",false);
            }else{
                $(".checkTime>p:nth-child(4)>input:nth-child(1)").prop("checked",true);
            }

        }
    }
};
//点击对时按钮
$(".checkTime>p>input[type='radio']").click(function(e){
    e.stopPropagation();//阻止事件冒泡即可
    var name = $(this).attr("name");
    $(":radio[name="+ name +"]:not(:checked)").attr("tag",0);
    if( $(this).attr("tag") == 1 ) {
        $(this).prop("checked",false);
        $(this).attr("tag",0);
    }else {
        $(this).attr("tag",1);
        $(this).prop("checked",true);
    }
    var type=$(this).prop("checked");
    var mods=$(this).attr("data-type");
    var sync;
    var url;
    var time=$(this).parent("p").attr("data-cycle");
    if(mods==0){
        if(type==false){
            sync=-1;
        }else{
            sync=mods;
        }
        url=$(".checkTime>p:nth-child(2)>input:nth-child(6)").val()
    }else{
        if(type==false){
            sync=-1;
        }else{
            sync=mods;
        }

        url="";
    }

    var o = new Object();
    o.sync = parseInt(sync);
    o.cycle = parseInt(time);
    o.domain = url;
    o.userData = 0;
    var m_json = JSON.stringify(o);
    ccc_lib_reqDataByCmd("",USER_SYNC_TIME_CONFIG,m_json,reGetTimes);
});
//点击手动对时
$("#handCheckTime").click(function(){
    var time=$(".checkYear").val()+"-"+$(".checkMonth").val()+"-"+$(".checkDay").val()+" "+$(".checkHour").val()+":"+$(".checkMin").val()+":"+$(".checkSec").val();
    if(time){
        var o = new Object();
        o.sync = 100;
        o.cycle = 0;
        o.domain = time;
        o.userData = 0;
        var m_json = JSON.stringify(o);
        console.log(time);
        ccc_lib_reqDataByCmd("",USER_SYNC_TIME_CONFIG,m_json,reGetTimes);
    }else{
        loadAlerts("请设置正确的时间格式！");
    }
});
function reGetTimes(id,info,des){
    loadAlerts(des.desc);
    if(des.result==0){
        var o = new Object();
        o.type = 5;
        o.subType = 0;
        o.userData = 0;
        var m_json = JSON.stringify(o);
        ccc_lib_reqDataByCmd("",USER_GW_DEVINFO_GETBYID,m_json,reCheckTimes);
    }
};
//返回网卡信息
function reNetCardMsg(id,info,des){
    console.log(des);
    $(".sysNetMsg>ul>li").remove();
    var domstr="";
    for(var i=0;i<des.data.length;i++){
        var str="";
        if(des.data[i].enable==1){
            str="已使用";
        }else if(des.data[i].enable==0){
            str="未使用";
        }
        domstr+='<li class="mods"><p><s></s><span>网卡-'+des.data[i].seq+'</span></p><div><ul><li><span>IP：</span><input class="loadNum" type="text" data-add="2" data-val="'+des.data[i].ip+'" value="'+des.data[i].ip+'"></li><li><span>网关：</span><input class="loadNum" type="text" data-add="2" value="'+des.data[i].gw+'" data-val="'+des.data[i].gw+'"></li><li><span>子网掩码：</span><input class="loadNum" type="text" data-add="2" value="'+des.data[i].mask+'" data-val="'+des.data[i].mask+'"></li><li><span>状态：</span><b>'+str+'</b></li></ul><div><a class="sureBtn" data-seq="'+des.data[i].seq+'" >修改</a></div></div></li>';

    }
    $(".sysNetMsg>ul").html(domstr);
    //$(".sysNetMsg>ul>li input").each(function(){
    //    var val=$(this).attr("data-val");
    //    $(this).val(val);
    //});
    $(".sysNetMsg>div:nth-child(2)>div>ul>li:nth-child(1)>input").val(des.main);
    $(".sysNetMsg>div:nth-child(2)>div>ul>li:nth-child(2)>input").val(des.backup);
    $(".sysNetMsg>div:nth-child(2)>div a").attr("data-seq",des.subType);
};
//点击修改网卡信息
$(".sysNetMsg>ul").on("click","div>a.sureBtn",function(){

    var seq =$(this).attr("data-seq");
    var ip=$(this).parents("li.mods").children("div").children("ul").children("li:nth-child(1)").children("input").val();
    var gw=$(this).parents("li.mods").children("div").children("ul").children("li:nth-child(2)").children("input").val();
    var mask=$(this).parents("li.mods").children("div").children("ul").children("li:nth-child(3)").children("input").val();
    var reg=/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if(!ip.match(reg)){
        loadAlerts("IP地址输入有误！");
        return false;
    }
    if(!gw.match(reg)){
        loadAlerts("网关地址输入有误！");
        return false;
    }
    if(!mask.match(reg)){
        loadAlerts("子网掩码地址输入有误！");
        return false;
    }
    var isModify=false;
    $(this).parent("div").siblings("ul").children("li").children("input").each(function(){
        var val=$(this).val();
        var old=$(this).attr('data-val');
        if(val!=old){
            isModify = true;
            return false;
        }
    });
    if(!isModify){
        return false;
    }

    ip = zeroClear(ip);
    gw = zeroClear(gw);
    mask = zeroClear(mask);

    var checkarr=[];
    $(this).parents(".mods").addClass("isActive");
    $(".mods").each(function(){
        if(!($(this).hasClass("isActive"))){
            var thismsk = $(this).children("div").children("ul").children("li:nth-child(3)").children("input").val();
            var thisip = $(this).children("div").children("ul").children("li:nth-child(1)").children("input").val();
            var thisseq = $(this).find(".sureBtn").attr('data-seq');
            if(thismsk){
                checkarr.push({'ip':thisip,'mask':thismsk,'seq':thisseq});
            }
        }
    });
    for(var i=0;i<checkarr.length;i++){
        var result = isEqualIPAddress(ip,checkarr[i].ip,mask,checkarr[i].mask);
        // console.log(result);
        if(result){
            loadAlerts("不能与【网卡-"+checkarr[i].seq+"】在同一个网段，请检查后重新配置！");
            return false;
        }
    }
    var obj = IPAddressFn(ip,mask);
    // console.log(obj);
    if(gw == obj.ip||gw == obj.addr||(!isEqualIPAddress(gw,ip,mask,mask))){
        loadAlerts('网关地址不合法！请重新输入！');
        return false;
    }

    var o = new Object();
    o.type = 1;
    o.subType = parseInt(seq);
    o.gw = gw;
    o.ip = ip;
    o.mask = mask;
    o.userData = 0;
    var m_json = JSON.stringify(o);
    ccc_lib_reqDataByCmd("",USER_NET_CARD_MODBYID,m_json,reModCardList);
});
/**
 * [isEqualIPAddress 判断两个IP地址是否在同一个网段]
 * @param {[String]} addr1 [地址一]
 * @param {[String]} addr2 [地址二]
 * @param {[String]} mask1 [子网掩码1]
 * @param {[String]} mask2 [子网掩码2]
 * @return {Boolean} [true or false]
 */
function isEqualIPAddress(addr1, addr2, mask1, mask2) {
    var res1 = [],
        res2 = [];
    addr1 = addr1.split(".");
    addr2 = addr2.split(".");
    mask1 = mask1.split(".");
    mask2 = mask2.split(".");
    for (var i = 0, ilen = addr1.length; i < ilen; i += 1) {
        res1.push(parseInt(addr1[i]) & parseInt(mask1[i]));
        res2.push(parseInt(addr2[i]) & parseInt(mask2[i]));
    }
    if (res1.join(".") == res2.join(".")) {
        return true;
    } else {
        return false;
    }
};

function IPAddressFn(addr1, mask1) {
    var res1 = [],
        res2 = [],
        addr1 = addr1.split(".");
    mask1 = mask1.split(".");
    for (var i = 0, ilen = addr1.length; i < ilen; i += 1) {
        var num1 = parseInt(addr1[i]) & parseInt(mask1[i]);
        var num2 = 255 - parseInt(mask1[i]);
        res1.push(num1);
        res2.push(num1 | num2);
    }
    return {
        'ip':res1.join("."),      //子网IP
        'addr':res2.join(".")   //广播地址
    };
};
//去除多余的0
function zeroClear(ip){
    var arr = ip.split('.');
    var str = parseInt(arr[0])+'.'+parseInt(arr[1])+'.'+parseInt(arr[2])+'.'+parseInt(arr[3]);
    return str;
};
//点击修改DNS服务器地址
$(".sysNetMsg>div:nth-child(2)>div .sureBtn").click(function(){
    var seq =$(this).attr("data-seq");
    var main=$(this).parent("div").siblings("ul.mods").children("li:nth-child(1)").children("input").val();
    var backup=$(this).parent("div").siblings("ul.mods").children("li:nth-child(2)").children("input").val();
    var reg=/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if(!main.match(reg)){
        loadAlerts("首选DNS地址输入有误！");
        return false;
    }
    if(!backup.match(reg)){
        loadAlerts("备选DNS地址输入有误！");
        return false;
    }
    var isModify=false;
    $(this).parent("div").siblings("ul").children("li").children("input").each(function(){
        console.log($(this).val());
        var val=$(this).val();
        var old=$(this).attr('data-val');
        if(val!=old){
            isModify = true;
            return false;
        }
    });
    if(!isModify){
        return false;
    }
    var o = new Object();
    o.type = 1;
    o.subType = parseInt(seq);
    o.backup = zeroClear(backup);
    o.main = zeroClear(main);
    o.userData = 0;
    var m_json = JSON.stringify(o);
    ccc_lib_reqDataByCmd("",USER_NET_CARD_MODBYID,m_json,reModCardList);
});
function reModCardList(id,info,des){
    $("#configPwd").hide();
    loadAlerts(des.desc);
    if(des.result==0){
        $(".sysNetMsg .alertMsg").show();
    }
    var o = new Object();
    o.type = 1;
    o.subType = 0;
    o.userData = 0;
    var m_json = JSON.stringify(o);
    ccc_lib_reqDataByCmd("",USER_GW_DEVINFO_GETBYID,m_json,reNetCardMsg);
};
//获取参数配置
function getOrderListMsg(type){
    var o = new Object();
    o.item = parseInt(type);
    o.extDev = 0;
    o.userData = parseInt(type);
    var m_json = JSON.stringify(o);
    console.log(o);
    ccc_lib_reqDataByCmd("",USER_SYSMENU_CONTENT,m_json,reOrderListMsg);
};
function reOrderListMsg(id,info,des){
    console.log(des);
    //console.log("返回数据****");
    $(".sysModPwd input").val("");
    if(des.result==0){
        $(".alarmVoice>ul>li").remove();
        $(".paramConfig>ul>li").remove();
        
        $(".systemPower>div>div>ul>li").remove();
        for(var i=0;i<des.data.length;i++){
            if(des.data[i].pattern==1){//基本参数
                if(des.data[i].status==0){//可配置文本框
                    $(".alarmVoice>ul").append('<li><span>'+des.data[i].name+'：</span><input  data-id="'+des.data[i].id+'" value="'+des.data[i].content+'" data-val="'+des.data[i].content+'" type="text"/>'+des.data[i].unit+'</li>');
                }else if(des.data[i].status==4){//可配置数字框
                    $(".alarmVoice>ul").append('<li><span>'+des.data[i].name+'：</span><input data-id="'+des.data[i].id+'" value="'+des.data[i].content+'" data-val="'+des.data[i].content+'" type="text"/>'+des.data[i].unit+'</li>');
                }else if(des.data[i].status==1){//固定
                    $(".alarmVoice>ul").append('<li><span>'+des.data[i].name+'：</span>'+des.data[i].content +''+ des.data[i].unit+'</li>');
                }else if(des.data[i].status==2){//可选配置下拉框
                    var arr=(des.data[i].option).split(",");
                    var opts="";
                    if(arr.length>0){
                        for(var m=0;m<arr.length;m++){
                            var amm=arr[m].split("=");
                            opts+="<option value='"+amm[0]+"'>"+amm[1]+"</option>";
                        }
                    }else{
                        var amm=(des.data[i].option).split("=");
                        opts="<option value='"+amm[0]+"'>"+amm[1]+"</option>";
                    }
                    $(".alarmVoice>ul").append('<li><span>'+des.data[i].name+'：</span><label class="checkOptBox"><select data-val="'+des.data[i].content+'" data-id="'+des.data[i].id+'">'+opts+'</select></label>'+des.data[i].unit+'</li>');
                }
                $(".alarmVoice>ul li select").each(function(){
                    var val=$(this).attr("data-val");
                    $(this).val(val);
                });
            }else if(des.data[i].pattern==3){//密码
                PassWord=des.data[i].content;
            }else if(des.data[i].pattern==2){//参数配置
                if(des.data[i].status==0){//可配置文本框
                    $(".paramConfig>ul").append('<li><span>'+des.data[i].name+'：</span><input  data-id="'+des.data[i].id+'" value="'+des.data[i].content+'" data-val="'+des.data[i].content+'" type="text"/>'+des.data[i].unit+'</li>');
                }else if(des.data[i].status==4){//可配置数字框
                    $(".paramConfig>ul").append('<li><span>'+des.data[i].name+'：</span><input  data-id="'+des.data[i].id+'" value="'+des.data[i].content+'" data-val="'+des.data[i].content+'" type="text"/>'+des.data[i].unit+'</li>');
                }else if(des.data[i].status==1){//固定
                    $(".paramConfig>ul").append('<li><span>'+des.data[i].name+'：</span>'+des.data[i].content +''+ des.data[i].unit+'</li>');
                }else if(des.data[i].status==2){//可选配置下拉框
                    var arr=(des.data[i].option).split(",");
                    var opts="";
                    if(arr.length>0){
                        for(var m=0;m<arr.length;m++){
                            var amm=arr[m].split("=");
                            opts+="<option value='"+amm[0]+"'>"+amm[1]+"</option>";
                        }
                    }else{
                        var amm=(des.data[i].option).split("=");
                        opts="<option value='"+amm[0]+"'>"+amm[1]+"</option>";
                    }
                    $(".paramConfig>ul").append('<li><span>'+des.data[i].name+'：</span><label class="checkOptBox"><select data-val="'+des.data[i].content+'" data-id="'+des.data[i].id+'">'+opts+'</select></label>'+des.data[i].unit+'</li>');
                }else if(des.data[i].status==5){
                    $(".paramConfig>ul").append('<li><span>'+des.data[i].name+'：</span><button data-id="'+des.data[i].id+'" class="mytbnsSolid">执行</button></li>');
                }
                $(".paramConfig>ul li select").each(function(){
                    var val=$(this).attr("data-val");
                    $(this).val(val);
                });
                if(des.data[i].id==6){//总系统名字
                    $(".logoTitle").html(des.data[i].content);
                }else if(des.data[i].id==120){//LOGO
                    if(des.data[i].content==0){
                        $("#logos").attr("src","imgs/tieonLOGO.png").css("width","80px");;
                    }else if(des.data[i].content==1){
                        $("#logos").attr("src","imgs/nueterLOGO.png").css("width","40px");
                    }
                }else if(des.data[i].id==110){//系统运行模式
                    RunModel = des.data[i].content;
                }
            }else if(des.data[i].pattern==4 ||des.data[i].pattern==5 ||des.data[i].pattern==6){//电源系统-直流系统
                if(des.data[i].status==0){//可配置文本框
                    $(".systemPower1>ul").append('<li><span>'+des.data[i].name+'：</span><input  data-id="'+des.data[i].id+'" value="'+des.data[i].content+'" data-val="'+des.data[i].content+'" type="text"/>'+des.data[i].unit+'</li>');
                }else if(des.data[i].status==4){//可配置数字框
                    $(".systemPower1>ul").append('<li><span>'+des.data[i].name+'：</span><input  data-id="'+des.data[i].id+'" value="'+des.data[i].content+'" data-val="'+des.data[i].content+'" type="text"/>'+des.data[i].unit+'</li>');
                }else if(des.data[i].status==1){//固定
                    $(".systemPower1>ul").append('<li><span>'+des.data[i].name+'：</span>'+des.data[i].content +''+ des.data[i].unit+'</li>');
                }else if(des.data[i].status==2){//可选配置下拉框
                    var arr=(des.data[i].option).split(",");
                    var opts="";
                    if(arr.length>0){
                        for(var m=0;m<arr.length;m++){
                            var amm=arr[m].split("=");
                            opts+="<option value='"+amm[0]+"'>"+amm[1]+"</option>";
                        }
                    }else{
                        var amm=(des.data[i].option).split("=");
                        opts="<option value='"+amm[0]+"'>"+amm[1]+"</option>";
                    }
                    $(".systemPower1>ul").append('<li><span>'+des.data[i].name+'：</span><label class="checkOptBox"><select data-val="'+des.data[i].content+'" data-id="'+des.data[i].id+'">'+opts+'</select></label>'+des.data[i].unit+'</li>');
                }
                $(".systemPower1>ul li select").each(function(){
                    var val=$(this).attr("data-val");
                    $(this).val(val);
                });
            }else if(des.data[i].pattern==7){//电源系统-UPS系统
                if(des.data[i].status==0){//可配置文本框
                    $(".systemPower2>ul").append('<li><span>'+des.data[i].name+'：</span><input  data-id="'+des.data[i].id+'" value="'+des.data[i].content+'" data-val="'+des.data[i].content+'" type="text"/>'+des.data[i].unit+'</li>');
                }else if(des.data[i].status==4){//可配置数字框
                    $(".systemPower2>ul").append('<li><span>'+des.data[i].name+'：</span><input  data-id="'+des.data[i].id+'" value="'+des.data[i].content+'" data-val="'+des.data[i].content+'" type="text"/>'+des.data[i].unit+'</li>');
                }else if(des.data[i].status==1){//固定
                    $(".systemPower2>ul").append('<li><span>'+des.data[i].name+'：</span>'+des.data[i].content +''+ des.data[i].unit+'</li>');
                }else if(des.data[i].status==2){//可选配置下拉框
                    var arr=(des.data[i].option).split(",");
                    var opts="";
                    if(arr.length>0){
                        for(var m=0;m<arr.length;m++){
                            var amm=arr[m].split("=");
                            opts+="<option value='"+amm[0]+"'>"+amm[1]+"</option>";
                        }
                    }else{
                        var amm=(des.data[i].option).split("=");
                        opts="<option value='"+amm[0]+"'>"+amm[1]+"</option>";
                    }
                    $(".systemPower2>ul").append('<li><span>'+des.data[i].name+'：</span><label class="checkOptBox"><select data-val="'+des.data[i].content+'" data-id="'+des.data[i].id+'">'+opts+'</select></label>'+des.data[i].unit+'</li>');
                }
                $(".systemPower2>ul li select").each(function(){
                    var val=$(this).attr("data-val");
                    $(this).val(val);
                });
            }else if(des.data[i].pattern==8){//电源系统-INV系统
                if(des.data[i].status==0){//可配置文本框
                    $(".systemPower3>ul").append('<li><span>'+des.data[i].name+'：</span><input  data-id="'+des.data[i].id+'" value="'+des.data[i].content+'" data-val="'+des.data[i].content+'" type="text"/>'+des.data[i].unit+'</li>');
                }else if(des.data[i].status==4){//可配置数字框
                    $(".systemPower3>ul").append('<li><span>'+des.data[i].name+'：</span><input  data-id="'+des.data[i].id+'" value="'+des.data[i].content+'" data-val="'+des.data[i].content+'" type="text"/>'+des.data[i].unit+'</li>');
                }else if(des.data[i].status==1){//固定
                    $(".systemPower3>ul").append('<li><span>'+des.data[i].name+'：</span>'+des.data[i].content +''+ des.data[i].unit+'</li>');
                }else if(des.data[i].status==2){//可选配置下拉框
                    var arr=(des.data[i].option).split(",");
                    var opts="";
                    if(arr.length>0){
                        for(var m=0;m<arr.length;m++){
                            var amm=arr[m].split("=");
                            opts+="<option value='"+amm[0]+"'>"+amm[1]+"</option>";
                        }
                    }else{
                        var amm=(des.data[i].option).split("=");
                        opts="<option value='"+amm[0]+"'>"+amm[1]+"</option>";
                    }
                    $(".systemPower3>ul").append('<li><span>'+des.data[i].name+'：</span><label class="checkOptBox"><select data-val="'+des.data[i].content+'" data-id="'+des.data[i].id+'">'+opts+'</select></label>'+des.data[i].unit+'</li>');
                }
                $(".systemPower3>ul li select").each(function(){
                    var val=$(this).attr("data-val");
                    $(this).val(val);
                });
            }else if(des.data[i].pattern==9 || des.data[i].pattern==10 ||des.data[i].pattern==11){//电源系统-通信系统
                if(des.data[i].status==0){//可配置文本框
                    $(".systemPower4>ul").append('<li><span>'+des.data[i].name+'：</span><input  data-id="'+des.data[i].id+'" value="'+des.data[i].content+'" data-val="'+des.data[i].content+'" type="text"/>'+des.data[i].unit+'</li>');
                }else if(des.data[i].status==4){//可配置数字框
                    $(".systemPower4>ul").append('<li><span>'+des.data[i].name+'：</span><input  data-id="'+des.data[i].id+'" value="'+des.data[i].content+'" data-val="'+des.data[i].content+'" type="text"/>'+des.data[i].unit+'</li>');
                }else if(des.data[i].status==1){//固定
                    $(".systemPower4>ul").append('<li><span>'+des.data[i].name+'：</span>'+des.data[i].content +''+ des.data[i].unit+'</li>');
                }else if(des.data[i].status==2){//可选配置下拉框
                    var arr=(des.data[i].option).split(",");
                    var opts="";
                    if(arr.length>0){
                        for(var m=0;m<arr.length;m++){
                            var amm=arr[m].split("=");
                            opts+="<option value='"+amm[0]+"'>"+amm[1]+"</option>";
                        }
                    }else{
                        var amm=(des.data[i].option).split("=");
                        opts="<option value='"+amm[0]+"'>"+amm[1]+"</option>";
                    }
                    $(".systemPower4>ul").append('<li><span>'+des.data[i].name+'：</span><label class="checkOptBox"><select data-val="'+des.data[i].content+'" data-id="'+des.data[i].id+'">'+opts+'</select></label>'+des.data[i].unit+'</li>');
                }
                $(".systemPower4>ul li select").each(function(){
                    var val=$(this).attr("data-val");
                    $(this).val(val);
                });
            }else if(des.data[i].pattern==12){//电源系统-交流系统
                if(des.data[i].status==0){//可配置文本框
                    $(".systemPower5>ul").append('<li><span>'+des.data[i].name+'：</span><input  data-id="'+des.data[i].id+'" value="'+des.data[i].content+'" data-val="'+des.data[i].content+'" type="text"/>'+des.data[i].unit+'</li>');
                }else if(des.data[i].status==4){//可配置数字框
                    $(".systemPower5>ul").append('<li><span>'+des.data[i].name+'：</span><input  data-id="'+des.data[i].id+'" value="'+des.data[i].content+'" data-val="'+des.data[i].content+'" type="text"/>'+des.data[i].unit+'</li>');
                }else if(des.data[i].status==1){//固定
                    $(".systemPower5>ul").append('<li><span>'+des.data[i].name+'：</span>'+des.data[i].content +''+ des.data[i].unit+'</li>');
                }else if(des.data[i].status==2){//可选配置下拉框
                    var arr=(des.data[i].option).split(",");
                    var opts="";
                    if(arr.length>0){
                        for(var m=0;m<arr.length;m++){
                            var amm=arr[m].split("=");
                            opts+="<option value='"+amm[0]+"'>"+amm[1]+"</option>";
                        }
                    }else{
                        var amm=(des.data[i].option).split("=");
                        opts="<option value='"+amm[0]+"'>"+amm[1]+"</option>";
                    }
                    $(".systemPower5>ul").append('<li><span>'+des.data[i].name+'：</span><label class="checkOptBox"><select data-val="'+des.data[i].content+'" data-id="'+des.data[i].id+'">'+opts+'</select></label>'+des.data[i].unit+'</li>');
                }
                $(".systemPower5>ul li select").each(function(){
                    var val=$(this).attr("data-val");
                    $(this).val(val);
                });
            }else if(des.data[i].pattern==14){//电源系统-剩余电流系统
                if(des.data[i].status==0){//可配置文本框
                    $(".systemPower6>ul").append('<li><span>'+des.data[i].name+'：</span><input  data-id="'+des.data[i].id+'" value="'+des.data[i].content+'" data-val="'+des.data[i].content+'" type="text"/>'+des.data[i].unit+'</li>');
                }else if(des.data[i].status==4){//可配置数字框
                    $(".systemPower6>ul").append('<li><span>'+des.data[i].name+'：</span><input  data-id="'+des.data[i].id+'" value="'+des.data[i].content+'" data-val="'+des.data[i].content+'" type="text"/>'+des.data[i].unit+'</li>');
                }else if(des.data[i].status==6){//可配置数字框带区间
                    var arr=(des.data[i].option).split(",");
                    $(".systemPower6>ul").append('<li><span>'+des.data[i].name+'：</span><input placeholder="请输入'+arr[0]+'~'+arr[1]+'之间的数字" data-min="'+arr[0]+'" data-max="'+arr[1]+'" class="ranges loadNum"   data-id="'+des.data[i].id+'" value="'+des.data[i].content+'" data-val="'+des.data[i].content+'" type="text"/>'+des.data[i].unit+'（范围'+arr[0]+'~'+arr[1]+'）</li>');
                }else if(des.data[i].status==1){//固定
                    $(".systemPower6>ul").append('<li><span>'+des.data[i].name+'：</span>'+des.data[i].content +''+ des.data[i].unit+'</li>');
                }else if(des.data[i].status==2){//可选配置下拉框
                    var arr=(des.data[i].option).split(",");
                    var opts="";
                    if(arr.length>0){
                        for(var m=0;m<arr.length;m++){
                            var amm=arr[m].split("=");
                            opts+="<option value='"+amm[0]+"'>"+amm[1]+"</option>";
                        }
                    }else{
                        var amm=(des.data[i].option).split("=");
                        opts="<option value='"+amm[0]+"'>"+amm[1]+"</option>";
                    }
                    $(".systemPower6>ul").append('<li><span>'+des.data[i].name+'：</span><label class="checkOptBox"><select data-val="'+des.data[i].content+'" data-id="'+des.data[i].id+'">'+opts+'</select></label>'+des.data[i].unit+'</li>');
                }
                $(".systemPower6>ul li select").each(function(){
                    var val=$(this).attr("data-val");
                    $(this).val(val);
                });
            }
        }
       
    }else{

    }
};
//获取单个参数配置
function getOrderListMsgSingle(type){
    var o = new Object();
    o.id = parseInt(type);
    o.userData = parseInt(type);
    var m_json = JSON.stringify(o);
    console.log(o);
    ccc_lib_reqDataByCmd("",USER_SYSPARA_GETBYID,m_json,reOrderListMsgSingle);
};
function reOrderListMsgSingle(id,info,des){
        console.log(des);
        if(des.userData==3){
            PassWord = des.content;
        }else if(des.userData==119){
            $(".systemRCD>div:nth-child(1)>p>input[about="+des.content+"]").prop("checked",true).siblings("input").prop("checked",false);
            var val=des.content;
        }else if(des.userData==120){//LOGO
            if(des.content==0){
                $("#logos").attr("src","imgs/tieonLOGO.png").css("width","80px");;
            }else if(des.content==1){
                $("#logos").attr("src","imgs/nueterLOGO.png").css("width","40px");;
            }
        }else if(des.userData==110){
            RunModel = des.content;
        }
};
//点击系统参数type=6,内容修改
$(".alarmVoice,.paramConfig,.systemPower5,.systemPower6,.systemPower2,.systemPower3").on("blur","input",function(){
    var cls=$(this).attr("class");
    var val=$(this).val();
    var old=$(this).attr("data-val");
    var isRight=true;
    if(val==old){
        $("#configPwd").hide();
        isRight = false;
    }
    if(val==""){
        $("#configPwd").hide();
        $("#modifyModal").hide();
        $("#keyboard").hide();
        isRight = false;
        getOrderListMsg(0);
    }
    if($(this).hasClass("ranges")){
        if(val>parseInt($(this).attr("data-max")) || val<parseInt($(this).attr("data-min"))){
            loadAlerts("输入值超出范围！");
            $("#configPwd").hide();
            $("#modifyModal").hide();
            $("#keyboard").hide();
            isRight = false;
            getOrderListMsg(0);
        }
    }
    var cont;
    // if(cls=="loadNum"){
        cont=val;
    // }else{
    //     cont=(val)?parseFloat(val).toString():"0";
    // }
    var id=$(this).attr("data-id");
    if(isNaN(id)){
        $("#configPwd").hide();
        $("#modifyModal").hide();
        $("#keyboard").hide();
        $(this).val(0);
        isRight = false;
    }
    if(isRight){
        var o = new Object();
        o.id = parseInt(id);
        o.content = cont;
        o.userData = 0;
        console.log(o);
        var m_json = JSON.stringify(o);
        ccc_lib_reqDataByCmd("",USER_SYSPARA_SETBYID,m_json,reModTotal);
    }

});
$(".systemPower1,.systemPower4").on("blur","input",function(){
    var cls=$(this).attr("class");
    var val=$(this).val();
    var old=$(this).attr("data-val");
    var isRight=true;
    if(val==old){
        $("#configPwd").hide();
        isRight =  false;
    }
    if(val==""){
        $("#configPwd").hide();
        $("#modifyModal").hide();
        $("#keyboard").hide();
        isRight = false;
        var abt = $(".systemPower>ul>li.active").attr("about");
        $("."+abt+">div>a.active").click();
    }
    if(cls=="range"){
        if(val>$(this).attr("data-max") || val<$(this).attr("data-min")){
            loadAlerts("输入值超出范围！");
            $("#configPwd").hide();
            $("#modifyModal").hide();
            $("#keyboard").hide();
            isRight = false;
            var abt = $(".systemPower>ul>li.active").attr("about");
            $("."+abt+">div>a.active").click();
        }
    }
    var cont;
    // if(cls=="loadNum"){
        cont=val;
    // }else{
    //     cont=(val)?parseFloat(val).toString():"0";
    // }
    var id=$(this).attr("data-id");
    if(isNaN(id)){
        $("#configPwd").hide();
        $("#modifyModal").hide();
        $("#keyboard").hide();
        $(this).val(0);
        isRight = false;
    }
    if(isRight){
        var o = new Object();
        o.id = parseInt(id);
        o.content = cont;
        o.userData = 0;
        console.log(o);
        var m_json = JSON.stringify(o);
        ccc_lib_reqDataByCmd("",USER_SYSPARA_SETBYID,m_json,reModTotal2);
    }
   
});
$(".modifyBatModal").click(function(){
    var val=$(this).prev("input").val();
    var id=$(this).prev("input").attr("data-id");
    var o = new Object();
    o.id = parseInt(id);
    o.content = val;
    o.userData = 0;
    console.log(o);
    var m_json = JSON.stringify(o);
    ccc_lib_reqDataByCmd("",USER_SYSPARA_SETBYID,m_json,reModTotal);
});
$(".alarmVoice,.alarmData,.checkTime,#creatYCYX,.datamodal,.paramConfig,.systemAlarm,#low_model,.systemPower,.devConfig,#systemRCD").on("mousedown","select",function(event){
    if($(this).prop("disabled")){
        return false;
    }
    var cla = $(this).attr("id");
    var isRight=true;
    if(cla=="devTypes"){
        $(".businessContent>div>div:nth-child(n+3)>table>tbody>tr").each(function(){
            if($(this).hasClass("change")){
                loadAlerts("有编辑后未保存的项，建议保存！");
                isRight=false;
            }
        });
       
    }
    if(!isRight){
        return false;
    }
    var ht=$(this).offset().top - $("body").offset().top ;
    $("select").removeClass("active");
    event.preventDefault();
    event.stopPropagation();
    var clone=$("section>.checkOpts").clone();
    clone.attr("type",2);
    //console.log(clone.length);
    $("section > .checkOpts").hide();
    var width=$(this).css("width");
    var len=$(this).siblings(".checkOpts").length;

    if(len==1){
        if($(this).next(".checkOpts").css("display")=="none"){
          
            $(".checkOpts>li").remove();
            var adds="";
            $(this).children("option").each(function(i){
                var name=$(this).html();
                var value=$(this).val();
                adds+='<li data-value="'+value+'" title="'+name+'">'+name+'</li>';
            });
            $(this).next(".checkOpts").append(adds);
            $(this).siblings(".checkOpts").show();
            var htLen = parseInt($(this).next(".checkOpts").height());
            if($(this).attr("id")=="devTypes"){
                $(this).next(".checkOpts").css("max-height","450px");
            }else{
                $(this).next(".checkOpts").css("max-height","150px");
            }
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
            adds+='<li data-value="'+value+'" title="'+name+'">'+name+'</li>';
        });
        $(this).next(".checkOpts").append(adds);
    }
    var htLen = parseInt($(this).next(".checkOpts").height());
    if($(this).attr("id")=="devTypes"){
        $(this).next(".checkOpts").css("max-height","450px");
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
});
$(".alarmVoice,.alarmOut,.paramConfig,.systemPower5,.systemPower6,.systemPower2,.systemPower3").on("change","select",function(){
    var id=$(this).attr("data-id");
    var val=$(this).val();
    var o = new Object();
    o.id = parseInt(id);
    o.content = val;
    o.userData = 0;
    console.log(o);
    var m_json = JSON.stringify(o);
    ccc_lib_reqDataByCmd("",USER_SYSPARA_SETBYID,m_json,reModTotal);
});
$(".systemPower1,.systemPower4").on("change","select",function(){
    var id=$(this).attr("data-id");
    var val=$(this).val();
    var o = new Object();
    o.id = parseInt(id);
    o.content = val;
    o.userData = 0;
    console.log(o);
    var m_json = JSON.stringify(o);
    ccc_lib_reqDataByCmd("",USER_SYSPARA_SETBYID,m_json,reModTotal2);
});
function reModTotal(id,info,des){
    $("#configPwd").hide();
    $("#modifyModal").hide();
    $("#keyboard").hide();
    loadAlerts(des.desc);
    // getOrderListMsgSingle(6);
    getOrderListMsg(0);
};
function reModTotal2(id,info,des){
    $("#configPwd").hide();
    $("#modifyModal").hide();
    $("#keyboard").hide();
    loadAlerts(des.desc);
    var abt = $(".systemPower>ul>li.active").attr("about");
    $("."+abt+">div>a.active").click();
};
//设备配置内容
$(".systemDev>table>tbody").on("click","tr",function(){
    $(this).addClass("active").siblings("tr").removeClass("active");
});
//切换柜子
$(".systemDev>div:nth-child(1) table>tbody").on("click","tr",function(){
    $(this).addClass("active").siblings("tr").removeClass("active");
});
var selRoom = 0;
//点击进入设备详情
$(".systemDev .devDetail").click(function(){
    var len=$(".systemDev>div:nth-child(1) table>tbody>tr.active").length;
    if(len<=0){
        loadAlerts("请先选中一条归属！");
        return false;
    }
    $(".systemDev .systemDevMods").show().siblings("div").hide();
    var name =$(".systemDev>div:nth-child(1) table>tbody>tr.active>td:nth-child(2)").html();
    var id =$(".systemDev>div:nth-child(1) table>tbody>tr.active").attr("data-id");
    selRoom =$(".systemDev>div:nth-child(1) table>tbody>tr.active").attr("data-type");
    var type =$(".systemDev>div:nth-child(1) table>tbody>tr.active>td:nth-child(6)").html();
    var fac =$(".systemDev>div:nth-child(1) table>tbody>tr.active>td:nth-child(3)").html();
    var modtype =$(".systemDev>div:nth-child(1) table>tbody>tr.active>td:nth-child(4)").html();

    $(".systemDev .systemDevMods>p:nth-child(1)>span:nth-child(2)").html(name);
    $(".systemDev .systemDevMods>p:nth-child(1)>span:nth-child(4)").html(id);
    $(".systemDev .systemDevMods>p:nth-child(1)>span:nth-child(6)").html(type);
    $(".systemDev .systemDevMods>p:nth-child(1)>span:nth-child(8)").html(fac);
    $(".systemDev .systemDevMods>p:nth-child(1)>span:nth-child(10)").html(modtype);
    loadModList(id,2);
});
$(".systemDev .systemDevMods>p:nth-child(1)>button").click(function(){
    $(".systemDev .systemDevMods").hide().siblings("div").show();
});
//进入工程配置
$(".systemToconfigs .mytbnsSolid").click(function(){
    $("#identifyCode").show().attr("about",2);
    $("#identifyCode input").focus();
    if(RunModel==1){
        $("#identifyCode input").val("211201");
    }else{
        $("#identifyCode input").val("");
    }
    
    $("#configPwd").show().css("left","690px").css("top","100px");
});
$("footer img").click(function(){
    window.location.reload();
});
//工程配置

//数据模型内容
$(".box>p>b").click(function(){
    $(".box").hide();
});
//切换数据模型中的类型下拉
$(".datamodal").on("change",".devTypes",function(e){
     var tbid = $(this).children("option:selected").attr('data-tbid');
     var devtype = $(this).children("option:selected").attr('data-devtype');
    tbid= (!tbid)?0:tbid;
    var isRight=true;
    $(".businessContent>div>div:nth-child(n+3)>table>tbody>tr").each(function(){
        if($(this).hasClass("change")){
            loadAlerts("有编辑后未保存的项，建议保存！");
            // e.preventDefault();
            // e.stopPropagation();
            isRight=false;
        }
    });
    if(!isRight){
        return false;
    }
    $(".datamodal .devTypes").attr("data-tbid",tbid);
    $(".datamodal .devTypes").attr("data-devtype",devtype);
    $(".box").hide();
    if(devtype==4){
        $(".gbfb").show();
        $(".gbfb>a:nth-child(1)").addClass("active").siblings("a").removeClass("active");
    }else{
        $(".gbfb").hide();
    }
    loadConfigedPoints();
    Checkeddevl="",Checkedelec="",Checkedcurv="",Checkedpack="",Checkedstat="",Checkedykyt="",Checkedalarm="",CheckedWindow="",CheckedDia="";
    $(".modalMenu>a.active").click();
});
//加载点表中配置好的列表
function loadConfigedPoints(){
    var ob = new Object();
    var tbid = $(".datamodal .devTypes").attr("data-tbid");
    ob.recordId = parseInt(tbid);
    ob.module = 6;
    ob.userData = 0;
    var json = JSON.stringify(ob);
    console.log(ob);
    ccc_lib_reqDataByCmd("",USER_DICT_CONTENT_GETBYID,json,SaveConfigedPoints);//获取项目点表
};
var ConfigedPoints;
function SaveConfigedPoints(id,info,des){
    console.log(des);
    ConfigedPoints=[];
    if(des.result==0){
        ConfigedPoints=des.data;
    }
};
var Checkeddevl,Checkedelec,Checkedcurv,Checkedpack,Checkedstat,Checkedykyt,Checkedalarm,CheckedWindow,CheckedDia;
//切换数据模型菜单
$(".modalMenu>a").click(function(){
    var isRight=true;
    var about=$(this).attr("about");
   
    $(".businessContent>div>div:nth-child(n+3)>table>tbody>tr").each(function(){
        if($(this).hasClass("change")){
            loadAlerts("有编辑后未保存的项，建议保存！");
            isRight=false;
        }
    });
    // $(".businessContent>div>div:nth-child(3)>table>tbody>tr").remove();
    if($(this).hasClass("active")){
        
    }else{
        $("#configedYCYX").hide();
        $("#configedYCYX2").hide();
        Checkeddevl="",Checkedelec="",Checkedcurv="",Checkedpack="",Checkedstat="",Checkedykyt="",Checkedalarm="",CheckedWindow="",CheckedDia="";
    }
    var devType = $(".datamodal .devTypes").attr("data-devtype");
    if(isRight){
        $(this).addClass("active").siblings("a").removeClass("active");
        $(".businessContent>div#"+about).show().siblings("div").hide();
        if(about=="devWindow"){//加载实时数据
            $("#devWindow>p:nth-child(2)>a:nth-child(1)").click();
            loadEquipmentBusiness(8);
            
        }else if(about=="elecDiagram"){//加载电气图列表
            $("#elecDiagram>p:nth-child(2)>a:nth-child(1)").click();
            loadEquipmentBusiness(2);
           
        }else if(about=="curveStored"){//加载曲线储存
            loadEquipmentBusiness(3);
        }else if(about=="packeStorage"){//加载分组储存
            if(devType==4){
                $(".gbfb").show();
                $(".gbfb>a:nth-child(1)").click();
            }else{
                $(".gbfb").hide();
            }
            loadEquipmentBusiness(4);
            getPackLines();
        }else if(about=="statusBar"){//加载状态定制
            loadEquipmentBusiness(5);
        }else if(about=="ykyt"){//加载遥控遥调
            loadEquipmentBusiness(6);
        }else if(about=="groupAlarm"){//加载组合分析
            loadEquipmentBusiness(7);
        }else if(about=="diagnosis"){//预警诊断
            loadEquipmentBusiness(9);
        }
    }else{
        return false;
    }


});


//点击遥测遥信列表选中
$('#configedYCYX').on("click",".ycyxs>li",function(){
    var about=$("#configedYCYX").attr("about");
    if(about==1|| about==2 || about==5 || about==6 || about==44 ||about==66 ||about==8 ){
        $(this).toggleClass("active");
    }else if(about==74){
        if($(this).attr("data-flag")!=0){//组合一次加三条
            var flag=$(this).attr("data-flag");
            if($(this).hasClass("active")){
                $("#configedYCYX .ycyxs>li[data-flag='"+flag+"']").removeClass("active");
            }else{
                $("#configedYCYX .ycyxs>li[data-flag='"+flag+"']").addClass("active");
            }
        }else{//非组合或者遥信一次加一条
            $(this).toggleClass("active");
        }
    }
    var leng=$('#configedYCYX .ycyxs>li.active').length;
    if(leng>0){
        $("#configedYCYX>ul:nth-child(2)>li:nth-child(2)>img:nth-child(1)").attr("src","imgs/toRight.png").addClass("active");
    }else{
        $("#configedYCYX>ul:nth-child(2)>li:nth-child(2)>img:nth-child(1)").attr("src","imgs/toRight2.png").removeClass("active");
    }

});
//点击遥测遥信2列表选中
$('#configedYCYX2').on("click",".ycyxs>li",function(){
    if($(this).hasClass("active")){
        $("#configedYCYX2 .ycyxs>li.active").removeClass("active");
        $("#configedYCYX2 .checkedYCYX>table>tbody>tr").remove();
        return false;
    }
    var about=$("#configedYCYX").attr("about");
    $("#configedYCYX2 .ycyxs>li").removeClass("active");
    $("#configedYCYX2 .checkedYCYX>table>tbody>tr").remove();
    if(about==33){//曲线储存
        if($(this).attr("data-flag")!=0){//组合一次加三条
            var flag=$(this).attr("data-flag");
            $("#configedYCYX2 .ycyxs>li[data-flag='"+flag+"']").addClass("active");
            $('#configedYCYX2 .ycyxs>li[data-flag="'+flag+'"]').each(function(){
                var name=$(this).attr("data-name");
                var num=$(this).attr("data-num");
                var type=$(this).attr("data-type");
                var unit=$(this).attr("data-unit");
                var flag=$(this).attr("data-flag");
                var type2=$(this).attr("data-type2");
                var str=outType(type2);
                $("#configedYCYX2 .checkedYCYX>table>tbody").append("<tr   data-type='"+type2+"' data-flag='"+flag+"' data-unit='"+unit+"' about='"+type+"'><td >"+name+"</td><td>"+type+"</td><td about='"+num+"'>"+str+"</td></tr>");
            });
        }else{//非组合或者遥信一次加一条
            $(this).addClass("active");
            $('#configedYCYX2 .ycyxs>li.active').each(function(){
                var name=$('#configedYCYX2 .ycyxs>li.active').attr("data-name");
                var num=$('#configedYCYX2 .ycyxs>li.active').attr("data-num");
                var type=$('#configedYCYX2 .ycyxs>li.active').attr("data-type");
                // var ename=$('#configedYCYX2 .ycyxs>li.active').attr("data-ename");
                var unit=$('#configedYCYX2 .ycyxs>li.active').attr("data-unit");
                var flag=$('#configedYCYX2 .ycyxs>li.active').attr("data-flag");
                var type2=$('#configedYCYX2 .ycyxs>li.active').attr("data-type2");
                // var comb=$('#configedYCYX2 .ycyxs>li.active').attr("data-iscomb");
                // var id=$('#configedYCYX2 .ycyxs>li.active').attr("about");
            
                var str=outType(type2);
                $("#configedYCYX2 .checkedYCYX>table>tbody").append("<tr   data-type='"+type2+"' data-flag='"+flag+"' data-unit='"+unit+"' about='"+type+"'><td >"+name+"</td><td>"+type+"</td><td about='"+num+"'>"+str+"</td></tr>");
            });
        }
    }else if(about==5 || about==6 || about==8){//状态定制//遥控遥调//预警诊断
        $(this).addClass("active");
        $('#configedYCYX2 .ycyxs>li.active').each(function(){
            var name=$('#configedYCYX2 .ycyxs>li.active').attr("data-name");
            var num=$('#configedYCYX2 .ycyxs>li.active').attr("data-num");
            var type=$('#configedYCYX2 .ycyxs>li.active').attr("data-type");
            // var ename=$('#configedYCYX2 .ycyxs>li.active').attr("data-ename");
            var unit=$('#configedYCYX2 .ycyxs>li.active').attr("data-unit");
            var flag=$('#configedYCYX2 .ycyxs>li.active').attr("data-flag");
            var type2=$('#configedYCYX2 .ycyxs>li.active').attr("data-type2");
            var str=outType(type2);
            $("#configedYCYX2 .checkedYCYX>table>tbody").append("<tr   data-type='"+type2+"' data-flag='"+flag+"' data-unit='"+unit+"' about='"+type+"'><td >"+name+"</td><td>"+type+"</td><td about='"+num+"'>"+str+"</td></tr>");
        });
    }
    var arrs=[];
    $("#configedYCYX2 .checkedYCYX>table>tbody>tr").each(function(){
        if(arrs.indexOf($(this).attr("about"))==-1){
            arrs.push($(this).attr("about"));
        }else{
            $(this).remove();
        }
    });
    //$("#configedYCYX2 .checkedYCYX").niceScroll();
});

//点击遥测遥信2列表取消
$('#configedYCYX2').on("click",".close2",function(){
    $('#configedYCYX2').hide();
});
//点击遥测遥信右移
$("#configedYCYX>ul:nth-child(2)>li:nth-child(2)>img:nth-child(1)").click(function(){
    $("#configedYCYX .checkedYCYX>table>tbody>tr").removeClass("light");
    var about=$("#configedYCYX").attr("about");
    if(about==74 ){//组合分析、、实时数据
        if($(this).hasClass("active")){
            $('#configedYCYX .ycyxs>li.active').each(function(){
                if($(this).attr("data-flag")!=0){//组合一次加三条
                    var flags=$(this).attr("data-flag");
                    $('#configedYCYX .ycyxs>li[data-flag="'+flags+'"]').each(function(){
                        var name=$(this).attr("data-name");
                        var num=$(this).attr("data-num");
                        var type=$(this).attr("data-type");
                        var unit=$(this).attr("data-unit");
                        var flag=$(this).attr("data-flag");
                        var type2=$(this).attr("data-type2");
                        // var comb=$(this).attr("data-iscomb");
                    
                        var str=outType(type2);
                        $("#configedYCYX .checkedYCYX>table>tbody").append("<tr class='light'  data-type='"+type2+"' data-flag='"+flag+"' data-unit='"+unit+"' about='"+type+"'><td >"+name+"</td><td>"+type+"</td><td about='"+num+"'>"+str+"</td></tr>");
                    });
                }else{//非组合或者遥信一次加一条
                    var name=$(this).attr("data-name");
                    var num=$(this).attr("data-num");
                    var type=$(this).attr("data-type");
                    var unit=$(this).attr("data-unit");
                    var flag=$(this).attr("data-flag");
                    var type2=$(this).attr("data-type2");
                    var comb=$(this).attr("data-iscomb");
                
                  
                    var str=outType(type2);
                    $("#configedYCYX .checkedYCYX>table>tbody").append("<tr class='light'  data-type='"+type2+"' data-flag='"+flag+"' data-unit='"+unit+"' about='"+type+"'><td >"+name+"</td><td>"+type+"</td><td about='"+num+"'>"+str+"</td></tr>");
                }
            });

            var arrs=[];
            $("#configedYCYX .checkedYCYX>table>tbody>tr").each(function(){
                if(arrs.indexOf($(this).attr("about"))==-1){
                    arrs.push($(this).attr("about"));
                }else{
                    $(this).remove();
                }
            });
            //$("#configedYCYX .checkedYCYX").niceScroll();
            $('#configedYCYX .ycyxs>li.active').removeClass("active");
            $("#configedYCYX>ul:nth-child(2)>li:nth-child(2)>img:nth-child(1)").attr("src","imgs/toRight2.png").removeClass("active");
        }else{
            return false;
        }

    }else{
        if($(this).hasClass("active")){
            $('#configedYCYX .ycyxs>li.active').each(function(){
                var name=$(this).attr("data-name");
                var num=$(this).attr("data-num");
                var type=$(this).attr("data-type");
                var unit=$(this).attr("data-unit");
                var flag=$(this).attr("data-flag");
                var type2=$(this).attr("data-type2");
         
            
                var str=outType(type2);
                $("#configedYCYX .checkedYCYX>table>tbody").append("<tr class='light'  data-type2='"+type2+"' data-flag='"+flag+"' data-unit='"+unit+"' about='"+type+"'><td >"+name+"</td><td>"+type+"</td><td about='"+num+"'>"+str+"</td></tr>");
            });
            var arrs=[];
            $("#configedYCYX .checkedYCYX>table>tbody>tr").each(function(){
                if(arrs.indexOf($(this).attr("about"))==-1){
                    arrs.push($(this).attr("about"));
                }else{
                    $(this).remove();
                }
            });
            //$("#configedYCYX .checkedYCYX").niceScroll();
            $('#configedYCYX .ycyxs>li.active').removeClass("active");
            $("#configedYCYX>ul:nth-child(2)>li:nth-child(2)>img:nth-child(1)").attr("src","imgs/toRight2.png").removeClass("active");
        }else{
            return false;
        }
    }

});
//点击右边遥测遥信列表表格选中
$("#configedYCYX .checkedYCYX>table>tbody").on("click","tr",function(){
    $(this).addClass("active").siblings("tr").removeClass("active");
    $("#configedYCYX>ul:nth-child(2)>li:nth-child(2)>img:nth-child(2)").attr("src","imgs/toLeft.png");
});
//点击遥测遥信左移
$("#configedYCYX>ul:nth-child(2)>li:nth-child(2)>img:nth-child(2)").click(function(){

    var iscomb=$("#configedYCYX .checkedYCYX>table>tbody>tr.active").attr("data-iscomb");
    var about=$("#configedYCYX").attr("about");
    if(about==33 || about==74){
        if(iscomb==1){
            var flag = $("#configedYCYX .checkedYCYX>table>tbody>tr.active").attr("data-flag");
            $("#configedYCYX .checkedYCYX>table>tbody>tr").each(function(){
                if($(this).attr("data-flag")==flag){
                    $(this).remove();
                }
            });
        }else{
            $("#configedYCYX .checkedYCYX>table>tbody>tr.active").remove();
        }
    }else{
        $("#configedYCYX .checkedYCYX>table>tbody>tr.active").remove();
    }

    $("#configedYCYX>ul:nth-child(2)>li:nth-child(2)>img:nth-child(2)").attr("src","imgs/toLeft2.png");
});

//点击选中中英文
$("#configedYCYX .langueage>a,#configedYCYX2 .langueage>a").click(function(){
    $(this).addClass("active").siblings("a").removeClass("active");
});
//点击提交新增遥信遥测
$("#configedYCYX>ul:nth-child(2)>li:nth-child(3)>p>button:nth-child(1)").click(function(){
    if($("#configedYCYX .checkedYCYX>table>tbody>tr").length<=0){
        loadAlerts("提交内容不能为空！");
        return false;
    }
    var about=$("#configedYCYX").attr("about");
    if(about==1){//新增设备列表

        var htmlStr="";
        var len1= $("#devList>div:nth-child(3)>table>tbody>tr").length;
        var len2= $("#configedYCYX .checkedYCYX>table>tbody>tr").length;
        if((len1+len2)>5){
            loadAlerts("预览+已添加的不能超过5个！");
            return false;
        }
        $("#configedYCYX .checkedYCYX>table>tbody>tr").each(function(i){
            var name=$(this).children("td:nth-child(1)").html();
            var ename=$(this).children("td:nth-child(1)").attr("data-ename");
            var wordNum=$(this).children("td:nth-child(3)").attr("about");
            var pointNum=$(this).children("td:nth-child(2)").html();
            
            var unit=$(this).attr("data-unit");
            var id=$(this).attr("about");

            htmlStr+='<tr class="add change"   about="'+id+'" type="'+wordNum+'"><td><input type="text" value="'+name+'"></td><td>'+pointNum+'</td><td>'+unit+'</td><td><label class="checkOptBox"><select data-val="1"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select></label></td><td>新增</td></tr>';
        });
        $("#devList>div:nth-child(3)>table>tbody").append(htmlStr);
        // $("#devList>div:nth-child(3)").niceScroll();
        reloadNum2();
    }else if(about==2){//新增电气图列表
        var types=$("#elecDiagram>p:nth-child(2)>a.active").attr("type");
        var htmlStr="";
        var len1= $("#elecDiagram>div:nth-child(4)>table:nth-child(1)>tbody>tr").length;
        var len2= $("#configedYCYX .checkedYCYX>table>tbody>tr").length;
        var len3= $("#elecDiagram>div:nth-child(4)>table:nth-child(2)>tbody>tr").length;
        if(types==0){
            if((len1+len2)>40){
                loadAlerts("预览+已添加的遥信遥测不能超过40个！");
                return false;
            }
        }else{
            if((len3+len2)>40){
                loadAlerts("预览+已添加的关联开关不能超过40个！");
                return false;
            }
        }
        $("#configedYCYX .checkedYCYX>table>tbody>tr").each(function(i){
            var name=$(this).children("td:nth-child(1)").html();
            var ename=$(this).children("td:nth-child(1)").attr("data-ename");
            var wordNum=$(this).children("td:nth-child(3)").attr("about");
            var pointNum=$(this).children("td:nth-child(2)").html();
            var unit=$(this).attr("data-unit");
            var type2= $(this).attr("data-type2");
            var ids=$(this).attr("about");
            if(types==0){
                var htmlStr='<tr class="add change"  about="'+ids+'" data-type2="'+type2+'" type="'+wordNum+'"><td><input type="text" value="'+name+'"></td><td>'+pointNum+'</td><td>'+unit+'</td><td><label class="checkOptBox"><select name="" id="" data-val="1"><option value="1">红色</option><option value="2">绿色</option><option value="3">黄色</option><option value="4">黑色</option><option value="5">白色</option><option value="6">蓝色</option><option value="7">紫色</option></select></label></td><td><label class="checkOptBox"><select data-val="1"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option></select></label></td><td><label class="checkOptBox"><select data-val="1" ><option value="1">区域1</option><option value="2">区域2</option><option value="3">区域3</option><option value="4">区域4</option></select></label></td><td>新增</td></tr>';
                $("#elecDiagram>div:nth-child(4)>table:nth-child(1)>tbody").append(htmlStr);
            }else{
                var htmlStr='<tr class="add change"  about="'+ids+'" data-type2="'+type2+'" type="'+wordNum+'"><td><input type="text" value="'+name+'"></td><td>'+pointNum+'</td><td><label class="checkOptBox"><select data-val="0" ><option value="0">未配置</option><option value="1">编号1</option><option value="2">编号2</option><option value="3">编号3</option><option value="4">编号4</option><option value="5">编号5</option><option value="6">编号6</option><option value="7">编号7</option><option value="8">编号8</option><option value="9">编号9</option><option value="10">编号10</option><option value="11">编号11</option><option value="12">编号12</option><option value="13">编号13</option><option value="14">编号14</option><option value="15">编号15</option><option value="16">编号16</option><option value="17">编号17</option><option value="18">编号18</option><option value="19">编号19</option><option value="20">编号20</option><option value="21">编号21</option><option value="22">编号22</option><option value="23">编号23</option><option value="24">编号24</option><option value="25">编号25</option><option value="26">编号26</option><option value="27">编号27</option><option value="28">编号28</option><option value="29">编号29</option><option value="30">编号30</option><option value="31">编号31</option><option value="32">编号32</option><option value="33">编号33</option><option value="34">编号34</option><option value="35">编号35</option><option value="36">编号36</option><option value="37">编号37</option><option value="38">编号38</option><option value="39">编号39</option><option value="40">编号40</option></select></label></td><td>新增</td></tr>';
                $("#elecDiagram>div:nth-child(4)>table:nth-child(2)>tbody").append(htmlStr);
            }
        });

        // $("#elecDiagram>div:nth-child(4)").niceScroll();
        // reloadNum3();
    }else if(about==44){//新增分组储存数据成员
        var htmlStr="";
        var flag=0;
        var comb=0;
        $("#configedYCYX .checkedYCYX>table>tbody>tr").each(function(i){
            var name=$(this).children("td:nth-child(1)").html();
            var ename=$(this).children("td:nth-child(1)").attr("data-ename");
            var wordNum=$(this).children("td:nth-child(3)").attr("about");
            var seqNum=$(this).children("td:nth-child(2)").html();
            var id=$(this).attr("about");
            comb=$(this).attr("data-iscomb");
            flag=$(this).attr("data-flag");
            htmlStr+='<span about="'+id+'"  data-seq="'+seqNum+'" data-name="'+name+'" data-num="'+wordNum+'">'+name+'('+seqNum+')</span>';
        });
        var arrs=[];
        var id=$(".packIn>p:nth-child(1)>input").val();
        var name=$(".packIn>p:nth-child(2)>input").val();
        if(isNaN(id) || !id){
            loadAlerts("请输入有效的分组号！");
            return false;
        }
        if(id>108){
            loadAlerts("分组号不能超过108！");
            return false;
        }
        if(!name){
            name=id+"号";
        }
        var gbtype=parseInt($(".gbfb>a.active").attr("type"));
        
        // if($("#packeStorage>div:nth-child("+(gbtype+3)+")>table>tbody>tr").length>=1){//已经配置一条数据
            var arr=[];
            var len=$("#configedYCYX .checkedYCYX>table>tbody>tr").length;
            var len2=$("#packeStorage>div:nth-child("+(gbtype+3)+")>table>tbody>tr:nth-child(1)>td:nth-child(4)>span").length;

            $("#packeStorage>div:nth-child(4)>table>tbody>tr").each(function(){
                var ids=$(this).attr("about");
                if(arr.indexOf(ids)==-1){
                    arr.push(ids);
                }
            });
            $("#packeStorage>div:nth-child(5)>table>tbody>tr").each(function(){
                var ids=$(this).attr("about");
                if(arr.indexOf(ids)==-1){
                    arr.push(ids);
                }
            });
            var arr2=[];
            $("#packeStorage>div:nth-child("+(gbtype+3)+")>table>tbody>tr:nth-child(1)>td:nth-child(4)>span").each(function(){
                arr2.push($(this).attr("data-num"));
            });

            if(arr.indexOf(id)!=-1){
                loadAlerts("分组号已存在，请重新输入！");
                return false;
            }
            var arr3=[];
            $("#configedYCYX .checkedYCYX>table>tbody>tr").each(function(){
                arr3.push($(this).children("td:nth-child(3)").attr("about"));
            });
            if(len!=len2 && len2>0){
                loadAlerts("分组储存数据成员个数不一致，请重新选择！");
                return false;
            }else{

            }
            if(arr2.join()!=arr3.join() && arr2.length!=0){
                loadAlerts("分组储存数据成员顺序不一致，请重新选择！");
                return false;
            }
        // }
        $("#packeStorage>div:nth-child("+(gbtype+3)+")>table>tbody").append('<tr about="'+id+'" class="add change" data-iscomb="'+comb+'" data-flag="'+flag+'" ><td><input type="text" placeholder="请输入名称" data-val="'+name+'" value="'+name+'"></td><td>'+id+'</td><td><input type="text" placeholder="请输入列名" data-val="" value=""></td><td>'+htmlStr+'</td><td>新增</td></tr>');

        // $("#packeStorage>div:nth-child("+(gbtype+3)+")").niceScroll();
        $("#packeStorage>div:nth-child("+(gbtype+3)+")>table>tbody>tr").each(function(i){
            $(this).attr("data-add",i);
        });
    }

    else if(about==74){//新增组合分析数据成员
        if($("#configedYCYX .checkedYCYX>table>tbody>tr").length>3){
            loadAlerts("组合分析成员不能超过三个!");
            return false;
        }
        var arrs=[];
        $("#groupAlarm>div:nth-child(3)>table>tbody>tr").each(function(){
            var about=$(this).attr("about");
            if(arrs.indexOf(about)==-1){
                arrs.push(about);
            }
        });
        var htmlStr="";
        var flag=0;
        var comb=0;
        var unit="";
        $("#configedYCYX .checkedYCYX>table>tbody>tr").each(function(i){
            var name=$(this).children("td:nth-child(1)").html();
            var wordNum=$(this).children("td:nth-child(3)").attr("about");
            var seqNum=$(this).children("td:nth-child(2)").html();
            var id=$(this).attr("about");
            comb=$(this).attr("data-iscomb");
            flag=$(this).attr("data-flag");
            unit=$(this).attr("data-unit");
            htmlStr+='<span about="'+id+'" data-seq="'+seqNum+'" data-name="'+name+'" data-num="'+wordNum+'">'+name+'('+seqNum+')</span>';
        });
        var type=$(".packIn>p:nth-child(3) select").val();
        console.log(type);
        console.log(arrs);
        console.log(arrs.indexOf(type));
        if(arrs.indexOf(type)!=-1){
            loadAlerts("一类组合分析只能添加一次!");
            return false;
        }
        var name;
        if(type==1){
            name="三相电流不平衡";
        }else if(type==2){
            name="电流开关";
        }else if(type==3){
            name="电压开关";
        }else if(type==4){
            name="ATS零位";
        }else if(type==5){
            name="负载率";
        }else if(type==6){
            name="损耗率";
        }
        $("#groupAlarm>div:nth-child(3)>table>tbody").append('<tr class="add change" data-combId="'+flag+'" about="'+type+'"><td>'+name+'</td><td>'+htmlStr+'</td><td>新增</td></tr>');
        // $("#groupAlarm>div:nth-child(3)").niceScroll();
        $("#groupAlarm>div:nth-child(3)>table>tbody>tr").each(function(i){
            $(this).attr("data-add",i);
        });
    }else if(about==66){//新增实时数据

        var flag=0;
        var comb=0;
        var types=$("#devWindow>p:nth-child(2)>a.active").attr("type");
        $("#configedYCYX .checkedYCYX>table>tbody>tr").each(function(i){
            comb=$(this).attr("data-iscomb");
            flag=$(this).attr("data-flag");

            var name=$(this).children("td:nth-child(1)").html();
            var ename=$(this).children("td:nth-child(1)").attr("data-ename");
            var wordNum=$(this).children("td:nth-child(3)").attr("about");
            var pointNum=$(this).children("td:nth-child(2)").html();
            var unit=$(this).attr("data-unit");
            var id=$(this).attr("about");
            var type2=$(this).attr("data-type2");
            if(types==1){
                $("#devWindow>div:nth-child(4)>table:nth-child(1)>tbody").append('<tr class="add change" data-type2="'+type2+'" about="'+id+'" type="'+wordNum+'"  about="'+pointNum+'"><td><input type="text" value="'+name+'"></td><td>'+pointNum+'</td><td>'+unit+'</td><td><input type="text" value="0"></td><td><label class="checkOptBox"><select value="1" data-val="1"><option value="1">区域1</option><option value="2">区域2</option><option value="3">区域3</option><option value="4">区域4</option></select></label></td><td>新增</td></tr>');
            }else{
                $("#devWindow>div:nth-child(4)>table:nth-child(2)>tbody").append('<tr class="add change" data-type2="'+type2+'" about="'+id+'" type="'+wordNum+'" about="'+pointNum+'"><td><input type="text" value="'+name+'"></td><td>'+pointNum+'</td><td><label class="checkOptBox"><select name="" id=""><option value="0">默认显示</option><option value="1">告警显示</option></select></label></td><td><input type="text" value="0"></td><td><label class="checkOptBox"><select value="1" data-val="1"><option value="1">区域1</option><option value="2">区域2</option><option value="3">区域3</option><option value="4">区域4</option></select></label></td><td>新增</td></tr>');
            }
        });
        // $("#devWindow>div:nth-child(4)").niceScroll();
    }else if(about==8){//预警诊断点位
        var htmlStr="";
        var flag=0;
        var unit="";
        $("#configedYCYX .checkedYCYX>table>tbody>tr").each(function(i){
            var name=$(this).children("td:nth-child(1)").html();
            var wordNum=$(this).children("td:nth-child(3)").attr("about");
            var seqNum=$(this).children("td:nth-child(2)").html();
            var id=$(this).attr("about");
            flag=$(this).attr("data-flag");
            unit=$(this).attr("data-unit");
            htmlStr+='<span data-seq="'+seqNum+'" data-name="'+name+'" data-num="'+wordNum+'"><u>'+name+'('+seqNum+')</u><b></b></span>';
        });

        var haveLen =$("#diagnosis>div:nth-child(3)>table>tbody>tr.active>td:nth-child(4)>span").length;
        var addLen=$("#configedYCYX .checkedYCYX>table>tbody>tr").length;
        var maxLen=parseInt($("#diagnosis>div:nth-child(3)>table>tbody>tr.active").attr("data-max"));
        if((haveLen+addLen)>maxLen){
            loadAlerts("分析点位超过最大允许数量！");
            $("#configedYCYX2").hide();
            return false;
        }else{
            $("#diagnosis>div:nth-child(3)>table>tbody>tr.active>td:nth-child(4)").append(htmlStr);
            $("#diagnosis>div:nth-child(3)>table>tbody>tr.active").addClass("change");
            $("#diagnosis>div:nth-child(3)>table>tbody>tr.active>td:last-child").html("修改");
        }
    }
    $("#configedYCYX").hide();
});
//点击遥测遥信2列表确定
$('#configedYCYX2').on("click",".sure",function(){
    if($("#configedYCYX2 .ycyxs>li.active").length<=0){
        loadAlerts("提交内容不能为空！");
        return false;
    }
    var about=$("#configedYCYX").attr("about");
    if(about==5){//新增状态定制

        var name = $("#configedYCYX2 .ycyxs>li.active").attr("data-name");
        var ename= $("#configedYCYX2 .ycyxs>li.active").attr("data-ename");
        var unit= $("#configedYCYX2 .ycyxs>li.active").attr("data-unit");
        var wordNum= $("#configedYCYX2 .ycyxs>li.active").attr("data-num");
        var seqNum= $("#configedYCYX2 .ycyxs>li.active").attr("data-type");
        var id= $("#configedYCYX2 .ycyxs>li.active").attr("about");
        $("#statusBar>div:nth-child(3)>table>tbody").append('<tr class="add change" about="'+seqNum+'" type="'+wordNum+'"><td><input type="text" value="'+name+'"></td><td>'+seqNum+'</td><td><label class="checkOptBox"><select value="0" name="" id=""><option value="0">状态</option><option value="1">日志</option></select></label></td><td></td><td>新增</td></tr>');
        // $("#statusBar>div:nth-child(3)").niceScroll();
    }else if(about==6){//新增遥控遥调
        var name = $("#configedYCYX2 .ycyxs>li.active").attr("data-name");
        var ename= $("#configedYCYX2 .ycyxs>li.active").attr("data-ename");
        var unit= $("#configedYCYX2 .ycyxs>li.active").attr("data-unit");
        var wordNum= $("#configedYCYX2 .ycyxs>li.active").attr("data-num");
        var seqNum= $("#configedYCYX2 .ycyxs>li.active").attr("data-type");
        var type2=$("#configedYCYX2 .ycyxs>li.active").attr("data-type2");
        var id= $("#configedYCYX2 .ycyxs>li.active").attr("about");
        var str;
        if(type2==1 || type2==3||type2==6){
            str="遥调";
            type2=2;
        }else {
            str="遥控";
            type2=1;
        }
        $("#ykyt>div:nth-child(3)>table>tbody").append('<tr  data-show="1" data-unit="'+unit+'"  data-delay="2" data-refresh="0" data-area="1" data-id="'+id+'"  class="add change"  data-code="0"  data-regAddr="1" data-value="1" data-rt="1"  about="0" data-type="'+type2+'" type="'+wordNum+'"><td><input type="text" data-val="'+name+'" value="'+name+'"></td><td>'+str+'</td><td>'+seqNum+'</td><td>区域1</td><td>0</td><td></td><td>新增</td></tr>');
        // $("#ykyt>div:nth-child(3)").niceScroll();
        // reloadNum6();
    }else if(about==33){//新增曲线储存
        var htmlStr="";
        var flag=0;
        var unit="";
        var defaultName = $("#configedYCYX2 .checkedYCYX>table>tbody>tr:nth-child(1)>td:nth-child(1)").html();
        $("#configedYCYX2 .checkedYCYX>table>tbody>tr").each(function(i){
            var name=$(this).children("td:nth-child(1)").html();
            var wordNum=$(this).children("td:nth-child(3)").attr("about");
            var seqNum=$(this).children("td:nth-child(2)").html();
            var id=$(this).attr("about");
            flag=$(this).attr("data-flag");
            unit=$(this).attr("data-unit");
            htmlStr+='<span about="'+id+'" data-flag="'+flag+'" data-seq="'+seqNum+'" data-name="'+name+'" data-num="'+wordNum+'">'+name+'('+seqNum+')</span>';
        });

        var opt="<option value=0>不显示</option>";
        for(var i=1;i<51;i++){
            opt+='<option value="'+i+'">'+i+'</option>';
        }
        $("#curveStored>div:nth-child(3)>table>tbody").append('<tr about="'+flag+'"  data-flag="'+flag+'"  class="add change"><td><input type="text" value="'+defaultName+'" data-val="'+defaultName+'"></td><td>'+flag+'</td><td>'+unit+'</td><td><label class="checkOptBox"><select name="" id="">'+opt+'</select></label></td><td><input type="text" value="0" data-val="0"></td><td>'+htmlStr+'</td><td>新增</td></tr>');
        // $("#curveStored>div:nth-child(3)").niceScroll();
    }else if(about==8){//预警诊断点位
        var htmlStr="";
        var flag=0;
        var unit="";
        $("#configedYCYX2 .checkedYCYX>table>tbody>tr").each(function(i){
            var name=$(this).children("td:nth-child(1)").html();
            var wordNum=$(this).children("td:nth-child(3)").attr("about");
            var seqNum=$(this).children("td:nth-child(2)").html();
            var id=$(this).attr("about");
            flag=$(this).attr("data-flag");
            unit=$(this).attr("data-unit");
            htmlStr+='<span data-seq="'+seqNum+'" data-name="'+name+'" data-num="'+wordNum+'"><u>'+name+'('+seqNum+')</u><b></b></span>';
        });

        var haveLen =$("#diagnosis>div:nth-child(3)>table>tbody>tr.active>td:nth-child(4)>span").length;
        var maxLen=parseInt($("#diagnosis>div:nth-child(3)>table>tbody>tr.active").attr("data-max"));
        if(haveLen>(maxLen-1)){
            loadAlerts("分析点位超过最大允许数量！");
            $("#configedYCYX2").hide();
            return false;
        }else{
            $("#diagnosis>div:nth-child(3)>table>tbody>tr.active>td:nth-child(4)").append(htmlStr);
            $("#diagnosis>div:nth-child(3)>table>tbody>tr.active").addClass("change");
            $("#diagnosis>div:nth-child(3)>table>tbody>tr.active>td:last-child").html("修改");
        }
    }
    $("#configedYCYX2").hide();
});
$("#diagnosis>div:nth-child(3)>table>tbody").on("click","tr>td:nth-child(3)>a",function(){
    $(this).toggleClass("active");
    $(this).parents("tr").addClass("change");
    $(this).parents("tr").children("td:last-child").html("修改");
});
//点击取消新增遥测遥信
$("#configedYCYX>ul:nth-child(2)>li:nth-child(3)>p>button:nth-child(2)").click(function(){
    $("#configedYCYX .checkedYCYX>table>tbody>tr").remove();
    $("#configedYCYX").hide();
});
$("#configedYCYX2>ul:nth-child(2)>li:nth-child(2)>p>button:nth-child(2)").click(function(){
    $("#configedYCYX2 .checkedYCYX>table>tbody>tr").remove();
    $("#configedYCYX2").hide();
});
//点击模糊搜索遥测遥信
$("#configedYCYX>ul:nth-child(2)>li:nth-child(1)>ul:nth-child(1)>li:nth-child(1)").on("input","div>input",function(){
    var val=$("#configedYCYX .search").val();
    $("#configedYCYX .ycyxs>li").each(function(){
        var name=$(this).children("p:first-child").children("span").attr("title");
        if(name.indexOf(val)!=-1){
            $(this).show();
        }else{
            $(this).hide();
        }
    });
});
//点击模糊搜索遥测遥信
$("#configedYCYX2>ul:nth-child(2)>li:nth-child(1)>ul:nth-child(1)>li:nth-child(1)").on("input","div>input",function(){
    var val=$("#configedYCYX2 .search").val();
    $("#configedYCYX2 .ycyxs>li").each(function(){
        var name=$(this).children("p:first-child").children("span").attr("title");
        if(name.indexOf(val)!=-1){
            $(this).show();
        }else{
            $(this).hide();
        }
    });
});

//点击清除搜索
$("#configedYCYX .closed").click(function(){
    $("#configedYCYX .search").val("");
    $("#configedYCYX .ycyxs>li").show();
});
//点击清除搜索
$("#configedYCYX2 .closed").click(function(){
    $("#configedYCYX2 .search").val("");
    $("#configedYCYX2 .ycyxs>li").show();
});


//遥控遥调英文名不能输入中文
$("#ykyt>div:nth-child(3)>table>tbody").on("input","tr>td:nth-child(3)>input",function(){
    var str = $(this).val();
    str = str.replace(/[\u4E00-\u9FA5]/g,"");
    $(this).val(str);
});
//数字框禁止输入其他字符
$("#devList>div:nth-child(3)>table>tbody").on("input","tr>td:nth-child(5)>input",function(){
    var str = $(this).val();
    str = str.replace(/[^\d]/g,"");
    $(this).val(str);
});
//修改密码框禁止输入其他字符
$(".sysModPwd>div:nth-child(1)").on("input","input",function(){
    var str = $(this).val();
    console.log(str);
    str = str.replace(/[^\d]/g,"");
    $(this).val(str);
});
//修改归属排序序号只能输入数字
$("#modifyBox,#creatBox").on("input","ul>li:nth-child(6)>input",function(){
    var str = $(this).val();
    str = str.replace(/[^\d]/g,"");
    $(this).val(str);
});
$("#elecDiagram>div:nth-child(4)>table>tbody").on("input","tr>td:nth-child(6)>input",function(){
    var str = $(this).val();
    str = str.replace(/[^\d]/g,"");
    $(this).val(str);
});
$("#curveStored>div:nth-child(3)>table>tbody").on("input","tr>td:nth-child(4)>input",function(){
    var str = $(this).val();
    str = str.replace(/[^\d]/g,"");
    $(this).val(str);
});

$("#packeStorage>div:nth-child(4)>table>tbody,#packeStorage>div:nth-child(5)>table>tbody").on("input","tr>td:nth-child(2)>input",function(){
    var str = $(this).val();
    str = str.replace(/[^\d]/g,"");
    $(this).val(str);
});
$("#modYKYT").on("input","ul>li:nth-child(n+3)>input",function(){
    var str = $(this).val();
    str = str.replace(/[^\d]/g,"");
    $(this).val(str);
});


$("#creatStatu>ul>li:nth-child(1)>input,#modifyRCD>ul>li:nth-child(4)>input,#modifyChannel>ul>li:nth-child(8)>input,#modifyChannel>ul>li:nth-child(9)>input,#modifyChannel>ul>li:nth-child(10)>input,#modifyChannel>ul>li:nth-child(11)>input,#creatCurve>ul>li:nth-child(2)>input,.packIn>p:nth-child(1)>input,#creatResult>ul>li:nth-child(1)>input,#creatResult>ul>li:nth-child(2)>input").bind("input propertychange",function(){
    var str = $(this).val();
    str = str.replace(/[^\d]/g,"");
    $(this).val(str);
});
$("#curveStored>div:nth-child(3)>table>tbody").on("input","tr>td:nth-child(5)>input",function(){
    var str = $(this).val();
    str = str.replace(/[^\d\.]/g,"");
    $(this).val(str);
});
$("#devWindow>div:nth-child(4)>table>tbody").on("input","tr>td:nth-child(4)>input",function(){
    var str = $(this).val();
    str = str.replace(/[^\d\.]/g,"");
    $(this).val(str);
});
$("#packLine>div:nth-child(2)>table>tbody").on("input","tr>td:nth-child(2)>input",function(){
    var str = $(this).val();
    str = str.replace(/[^\d\.]/g,"");
    $(this).val(str);
});
$("#minehira-table>tbody").on("input","tr>td:nth-child(2)>input",function(){
    var str = $(this).val();
    str = str.replace(/[^\d\.]/g,"");
    $(this).val(str);
});
//点击点表详情某一条的下拉框输入框
$(".pointDetail>div:nth-child(2)>table>tbody,#devList>div:nth-child(3)>table>tbody,#elecDiagram>div:nth-child(4)>table>tbody,#curveStored>div:nth-child(3)>table>tbody,#packeStorage>div:nth-child(4)>table>tbody,#packeStorage>div:nth-child(5)>table>tbody,#statusBar>div:nth-child(3)>table>tbody,#ykyt>div:nth-child(3)>table>tbody,#devWindow>div:nth-child(4)>table>tbody").on("input","tr>td>input",function(){
    var val=$(this).val();
    var old=$(this).attr("data-val");
    if(val!=old){
        if($(this).parents("td").parent("tr").hasClass("add")){
            $(this).parents("td").parent("tr").addClass("change");
            $(this).parents("td").parent("tr").children("td:last-child").html("新增");
        }else{
            $(this).parents("td").parent("tr").addClass("change");
            $(this).parents("td").parent("tr").children("td:last-child").html("修改");
        }

    }else{
        if($(this).parents("td").parent("tr").hasClass("add")){

        }else{
            $(this).parents("td").parent("tr").removeClass("change");
            $(this).parents("td").parent("tr").children("td:last-child").html("正常");
        }
    }
});

$(".pointDetail>div:nth-child(2)>table>tbody,#devList>div:nth-child(3)>table>tbody,#elecDiagram>div:nth-child(4)>table>tbody,#curveStored>div:nth-child(3)>table>tbody,#statusBar>div:nth-child(3)>table>tbody,#ykyt>div:nth-child(3)>table>tbody,#packeStorage>div:nth-child(4)>table>tbody,#packeStorage>div:nth-child(5)>table>tbody,#devWindow>div:nth-child(4)>table>tbody").on("change","tr>td select",function(){
    var val=$(this).val();
    var old=$(this).attr("data-val");
    if(val!=old){
        if($(this).parents("td").parent("tr").hasClass("add")){
            $(this).parents("td").parent("tr").addClass("change");
            $(this).parents("td").parent("tr").children("td:last-child").html("新增");
        }else{
            $(this).parents("td").parent("tr").addClass("change");
            $(this).parents("td").parent("tr").children("td:last-child").html("修改");
        }
    }else{
        if($(this).parents("td").parent("tr").hasClass("add")){

        }else{
            $(this).parents("td").parent("tr").removeClass("change");
            $(this).parents("td").parent("tr").children("td:last-child").html("正常");
        }

    }
});

//典表业务电气图开关 开关编号限制重复
$("#elecDiagram>div:nth-child(4)>table:nth-child(2)>tbody").on("change","tr>td select",function(){
    var switchArry=[];
    $("#elecDiagram>div:nth-child(4)>table:nth-child(2)>tbody>tr").each(function(){
        var id=parseInt($(this).children("td:nth-child(3)").children("select").val());
        switchArry.push(id);
    });

    var inCont=$(this).parents("tr").children("td:nth-child(1)").children("input").val();
    var previnCont=$(this).parents("tr").children("td:nth-child(1)").children("input").attr("data-val");
    var nary=switchArry.sort();
    for(var i=0;i<nary.length;i++){
        if (nary[i]==nary[i+1] && nary[i]>0){

            $(this).val(0);
            if($(this).attr("data-val")==0 && inCont==previnCont){
                $(this).parents("tr").removeClass("change");
                $(this).parent("td").next("td").html("正常");
            }
        }
    }
    //var val=parseInt($(this).val());
    //var isRight=true;
    //if((switchArry.indexOf(val)!=-1) && (val!=0)){
    //    isRight=false;
    //}
    //if(!isRight){
    //    $(this).val(0);
    //}
});
function outType(type){
    var type=parseInt(type);
    var str="";
    if(type==0){
        str="未配置";
    }else if(type==1){
        str="遥测";
    }else if(type==2){
        str="遥信";
    }else if(type==3){
        str="遥调";
    }else if(type==4){
        str="遥控";
    }else if(type==5){
        str="开关";
    }else if(type==6){
        str="状态";
    }else if(type==7){
        str="设备开关";
    }else if(type==8){
        str="开关量";
    }else if(type==9){
        str="遥测状态";
    }
    return str;
};
function sortBy(props) {
    return function(a,b) {
        return a[props] - b[props];
    }
};
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
};
function loadEquipmentBusiness(type){
    var typeS=$(".datamodal .devTypes").val();
    var ob = new Object();
    ob.devType = parseInt(typeS);
    ob.type = parseInt(type);
    ob.userData = parseInt(type);
    var json = JSON.stringify(ob);
    console.log(ob);
    ccc_lib_reqDataByCmd("",USER_DEVICE_SERVICE_LISTGETBYTYPE,json,ShowBusinessConfig);//获取设备服务器配置
};
function ShowBusinessConfig(did,info,des){
    console.log(des);
    if(des.userData==2){
        $("#elecDiagram>div:nth-child(4 )>table>tbody>tr").remove();
        var str1="";
        var str2="";
        for(var i=0;i<des.data.length;i++){
            var cla="";
            var words="";
            if(des.data[i].status==1){
                cla="orange";
                words='<td style="color:rgba(250,50,50,.8)">异常</td>';
            }else{
                words="<td>正常</td>";
            }
            if(des.data[i].type==0){
                str1+='<tr class="'+cla+'" data-type2="'+des.data[i].dataType+'"  type="'+des.data[i].pointId+'" about="'+des.data[i].pointSeq+'"><td><input type="text" value="'+des.data[i].name+'" data-val="'+des.data[i].name+'"></td><td>'+des.data[i].pointSeq+'</td><td>'+des.data[i].unit+'</td><td><label class="checkOptBox"><select name="" class="opt'+i+'" data-val="'+des.data[i].color+'"><option value="1">红色</option><option value="2">绿色</option><option value="3">黄色</option><option value="4">黑色</option><option value="5">白色</option><option value="6">蓝色</option><option value="7">紫色</option></select></label></td><td><label class="checkOptBox"><select class="opts'+i+'" data-val="'+des.data[i].dispSeq+'"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option></select></label></td><td><label class="checkOptBox"><select class="opt2'+i+'" id="" data-val="'+des.data[i].area+'"><option value="1">区域1</option><option value="2">区域2</option><option value="3">区域3</option><option value="4">区域4</option></select></label></td>'+words+'</tr>';
               
            }else{
                str2+='<tr class="'+cla+'" data-type2="'+des.data[i].dataType+'" type="'+des.data[i].pointId+'" about="'+des.data[i].pointSeq+'"><td><input type="text" value="'+des.data[i].name+'" data-val="'+des.data[i].name+'"></td><td>'+des.data[i].pointSeq+'</td><td><label class="checkOptBox"><select class="opt2'+i+'" id="" data-val="'+des.data[i].area+'"><option value="0">未配置</option><option value="1">编号1</option><option value="2">编号2</option><option value="3">编号3</option><option value="4">编号4</option><option value="5">编号5</option><option value="6">编号6</option><option value="7">编号7</option><option value="8">编号8</option><option value="9">编号9</option><option value="10">编号10</option><option value="11">编号11</option><option value="12">编号12</option><option value="13">编号13</option><option value="14">编号14</option><option value="15">编号15</option><option value="16">编号16</option><option value="17">编号17</option><option value="18">编号18</option><option value="19">编号19</option><option value="20">编号20</option><option value="21">编号21</option><option value="22">编号22</option><option value="23">编号23</option><option value="24">编号24</option><option value="25">编号25</option><option value="26">编号26</option><option value="27">编号27</option><option value="28">编号28</option><option value="29">编号29</option><option value="30">编号30</option><option value="31">编号31</option><option value="32">编号32</option><option value="33">编号33</option><option value="34">编号34</option><option value="35">编号35</option><option value="36">编号36</option><option value="37">编号37</option><option value="38">编号38</option><option value="39">编号39</option><option value="40">编号40</option></select></label></td><td>正常</td></tr>';
            }
        }
        $("#elecDiagram>div:nth-child(4)>table:nth-child(1)>tbody").append(str1);
        $("#elecDiagram>div:nth-child(4)>table:nth-child(2)>tbody").append(str2);
        $("#elecDiagram>div:nth-child(4)>table>tbody>tr>td select").each(function(){
            var val=$(this).attr("data-val");
            $(this).val(val);
        });
        var type=$("#elecDiagram>p:nth-child(2)>a.active").attr("type");
        if(type==0){
            $("#elecDiagram>div:nth-child(4)>table:nth-child(1)>tbody>tr:nth-child(1)").click();
        }else{
            $("#elecDiagram>div:nth-child(4)>table:nth-child(2)>tbody>tr:nth-child(1)").click();
        }
        // $("#elecDiagram>div:nth-child(4)").niceScroll();
        var scrollHeight =  $("#elecDiagram>div:nth-child(4)")[0].scrollHeight;
        var clientHeight = $("#elecDiagram>div:nth-child(4)")[0].clientHeight;
        if(scrollHeight>clientHeight){//有发生滚动
            $("#elecDiagram>table:nth-child(3)").addClass("scroll").removeClass("all");
        }else{
            $("#elecDiagram>table:nth-child(3)").removeClass("scroll").addClass("all");
        }
    }else if(des.userData==3){
        $("#curveStored>div:nth-child(3)>table>tbody>tr").remove();
        var opts="<option value=0>不显示</option>";
        for(var k=1;k<51;k++){
            opts+="<option value='"+k+"'>"+k+"</option>";
        }
        var str1="";
        for(var i=0;i<des.data.length;i++){
            var cla="";
            var words="";
            if(des.data[i].status==1){
                cla="orange";
                words='<td style="color:rgba(250,50,50,.8)">异常</td>';
            }else{
                words="<td>正常</td>";
            }
            var str="";
            if(des.data[i].comment.length>0){
                var strings = des.data[i].comment;
                //strings = strings.substring(0, strings.lastIndexOf('>'));
                var arr=strings.split(">");
                for(var k=0;k<arr.length;k++){
                    if(arr[k].length>0){
                        var marr=arr[k].split("<");
                        str+="<span  data-seq='"+marr[0]+"' data-name='"+marr[2]+"' data-num='"+marr[1]+"'>"+marr[2]+"("+(marr[0])+")</span>";
                    }
                }
            }
            str1+='<tr class="'+cla+'" about="'+des.data[i].groupId+'" data-flag="'+des.data[i].groupId+'" ><td><input data-val="'+des.data[i].name+'" type="text" value="'+des.data[i].name+'" ></td><td>'+des.data[i].groupId+'</td><td>'+des.data[i].unit+'</td><td><label class="checkOptBox"><select class="opt'+i+'" data-val="'+des.data[i].dispSeq+'">'+opts+'</select></label></td><td><input data-val="'+des.data[i].jumpPer+'" type="text" value="'+des.data[i].jumpPer+'" ></td><td data-str="'+strings+'">'+str+'</td>'+words+'</tr>';
           
        }
        $("#curveStored>div:nth-child(3)>table>tbody").append(str1);
        $("#curveStored select").each(function(){
            var val=$(this).attr("data-val");
            $(this).val(val);
        });
        // $("#curveStored>div:nth-child(3)").niceScroll();
        if(Checkedcurv){
            $("#curveStored>div:nth-child(3)>table>tbody>tr[about='"+Checkedcurv+"']").click();
        }else{
            $("#curveStored>div:nth-child(3)>table>tbody>tr:nth-child(1)").click();
        }
        var scrollHeight =  $("#curveStored>div:nth-child(3)")[0].scrollHeight;
        var clientHeight = $("#curveStored>div:nth-child(3)")[0].clientHeight;
        if(scrollHeight>clientHeight){//有发生滚动
            $("#curveStored>table:nth-child(2)").addClass("scroll").removeClass("all");
        }else{
            $("#curveStored>table:nth-child(2)").removeClass("scroll").addClass("all");
        }
    }else if(des.userData==4){
        $("#packeStorage>div:nth-child(4)>table>tbody>tr").remove();
        $("#packeStorage>div:nth-child(5)>table>tbody>tr").remove();
        var gbtype=parseInt($(".gbfb>a.active").attr("type"));
        (des.data).sort(sortBy("logNum"));
        var str1="";
        var str2="";
        for(var i=0;i<des.data.length;i++){
            var cla="";
            var words="";
            if(des.data[i].status==1){
                cla="orange";
                words='<td style="color:rgba(250,50,50,.8)">异常</td>';
            }else{
                words="<td>正常</td>";
            }
            var str="";
            if(des.data[i].comment.length>0){
                var strings = des.data[i].comment;
                //strings = strings.substring(0, strings.lastIndexOf('>'));
                var arr=strings.split(">");
                console.log(arr);
                for(var k=0;k<arr.length;k++){
                    if(arr[k].length>0){
                        var marr=arr[k].split("<");
                        str+="<span data-seq='"+marr[0]+"'  data-name='"+marr[2]+"' data-num='"+marr[1]+"'>"+marr[2]+"("+(marr[0])+")</span>";
                    }
                }
            }
             if(des.data[i].subType==2){
                 str1+='<tr class="'+cla+'" about="'+des.data[i].logNum+'" ><td><input data-val="'+des.data[i].name+'" type="text" value="'+des.data[i].name+'" ></td><td>'+des.data[i].logNum+'</td><td><input data-val="'+des.data[i].titles+'" type="text" value="'+des.data[i].titles+'" ></td><td data-str="'+strings+'">'+str+'</td>'+words+'</tr>';
            }else{
                str2+='<tr class="'+cla+'" about="'+des.data[i].logNum+'" ><td><input data-val="'+des.data[i].name+'" type="text" value="'+des.data[i].name+'" ></td><td>'+des.data[i].logNum+'</td><td><input data-val="'+des.data[i].titles+'" type="text" value="'+des.data[i].titles+'" ></td><td data-str="'+strings+'">'+str+'</td>'+words+'</tr>'; 
            }
        }
        $("#packeStorage>div:nth-child(5)>table>tbody").append(str1);
        $("#packeStorage>div:nth-child(4)>table>tbody").append(str2);
        if(Checkedpack){
            $("#packeStorage>div:nth-child("+(gbtype+3)+")>table>tbody>tr[about='"+Checkedpack+"']").click();
        }else{
            $("#packeStorage>div:nth-child("+(gbtype+3)+")>table>tbody>tr:nth-child(1)").click();
        }
        var scrollHeight =  $("#packeStorage>div:nth-child(4)")[0].scrollHeight;
        var clientHeight = $("#packeStorage>div:nth-child(4)")[0].clientHeight;
        if(scrollHeight>clientHeight){//有发生滚动
            $("#packeStorage>table:nth-child(3)").addClass("scroll").removeClass("all");
        }else{
            $("#packeStorage>table:nth-child(3)").removeClass("scroll").addClass("all");
        }
        // $("#packeStorage>div:nth-child("+(gbtype+3)+")").niceScroll();
    }else if(des.userData==5){
        $("#statusBar>div:nth-child(3)>table>tbody>tr").remove();
        var str1="";
        for(var i=0;i<des.data.length;i++){
            var cla="";
            var words="";
            if(des.data[i].status==1){
                cla="orange";
                words='<td style="color:rgba(250,50,50,.8)">异常</td>';
            }else{
                words="<td>正常</td>";
            }
            var str="";
            if(des.data[i].comment.length>0){
                var strings = des.data[i].comment;
                //strings = strings.substring(0, strings.lastIndexOf('>'));
                var arr=strings.split(">");
                for(var k=0;k<arr.length;k++){
                    if(arr[k].length>0){
                        var marr=arr[k].split("<");
                        str+="<span  data-name='"+marr[1]+"' data-num='"+marr[0]+"'><u>"+(marr[0])+"."+marr[1]+"</u><b></b></span>";
                    }
                }
            }
            str1+='<tr class="'+cla+'"  type="'+des.data[i].pointId+'" about="'+des.data[i].pointSeq+'" ><td><input data-val="'+des.data[i].name+'" type="text" value="'+des.data[i].name+'" ></td><td>'+des.data[i].pointSeq+'</td><td><label class="checkOptBox"><select name="" class="statu'+i+'" data-val="'+des.data[i].method+'"><option value="0">状态</option><option value="1">日志</option></select></label></td><td data-str="'+des.data[i].comment+'">'+str+'</td>'+words+'</tr>';
        }
        $("#statusBar>div:nth-child(3)>table>tbody").append(str1);
        $("#statusBar select").each(function(){
            var val=$(this).attr("data-val");
            $(this).val(val);
        });
        if(Checkedstat){
            $("#statusBar>div:nth-child(3)>table>tbody>tr[about='"+Checkedstat+"']").click();
        }else{
            $("#statusBar>div:nth-child(3)>table>tbody>tr:nth-child(1)").click();
        }
        var scrollHeight =  $("#statusBar>div:nth-child(3)")[0].scrollHeight;
        var clientHeight = $("#statusBar>div:nth-child(3)")[0].clientHeight;
        if(scrollHeight>clientHeight){//有发生滚动
            $("#statusBar>table:nth-child(2)").addClass("scroll").removeClass("all");
        }else{
            $("#statusBar>table:nth-child(2)").removeClass("scroll").addClass("all");
        }
    }else if(des.userData==6){
        $("#ykyt>div:nth-child(3)>table>tbody>tr").remove();
        var str1="";
        for(var i=0;i<des.data.length;i++){
            var cla="";
            var words="";
            if(des.data[i].status==1){
                cla="orange";
                words='<td style="color:rgba(250,50,50,.8)">异常</td>';
            }else{
                words="<td>正常</td>";
            }
            var str;
            if(des.data[i].type==1){
                str="遥控";
            }else if(des.data[i].type==2){
                str="遥调";
            }else{
                str="未配置";
            }
            var str2="";
            if(des.data[i].exeResult.length>0){
                var arr = (des.data[i].exeResult).split(">");
                for(var k=0;k<arr.length;k++){
                    if(arr[k].length>0){
                        var arrs =arr[k].split("<");
                        var colorName = checkColor(arrs[3]);
                        str2+="<span  data-name='"+arrs[2]+"' data-num='"+arrs[0]+"' data-color='"+arrs[3]+"' data-num2='"+arrs[1]+"'><u title='"+arrs[2]+"'>期望结果:"+arrs[0]+",设置值:"+arrs[1]+",颜色:"+colorName+",名称:"+arrs[2]+"</u><b></b></span>";
                    }  
                }
            }
            str1+="<tr data-show='"+des.data[i].notUseName+"' data-unit='"+des.data[i].unit+"' class='"+cla+"' about='"+des.data[i].number+"'    data-code='"+des.data[i].code+"' data-regAddr='"+des.data[i].regAddr+"'  data-area='"+des.data[i].Area+"' data-rt='"+des.data[i].rt+"' data-refresh='"+des.data[i].refresh+"' data-delay='"+des.data[i].delay+"'  data-type='"+des.data[i].type+"'   type='"+des.data[i].pointId+"'><td><input type='text' value='"+des.data[i].name+"' data-val='"+des.data[i].name+"'></td><td>"+str+"</td><td>"+des.data[i].pointSeq+"</td><td>区域"+des.data[i].Area+"</td><td>"+des.data[i].number+"</td><td data-str='"+des.data[i].exeResult+"'>"+str2+"</td>"+words+"</tr>";
            
            // $("#ykyt .opt"+i).val(des.data[i].Area).attr("data-val",des.data[i].Area);
        }
        $("#ykyt>div:nth-child(3)>table>tbody").append(str1);
        if(Checkedykyt){
            $("#ykyt>div:nth-child(3)>table>tbody>tr[about='"+Checkedykyt+"']").click();
        }else{
            $("#ykyt>div:nth-child(3)>table>tbody>tr:nth-child(1)").click();
        }
        var scrollHeight =  $("#ykyt>div:nth-child(3)")[0].scrollHeight;
        var clientHeight = $("#ykyt>div:nth-child(3)")[0].clientHeight;
        if(scrollHeight>clientHeight){//有发生滚动
            $("#ykyt>table:nth-child(2)").addClass("scroll").removeClass("all");
        }else{
            $("#ykyt>table:nth-child(2)").removeClass("scroll").addClass("all");
        }
        // $("#ykyt>div:nth-child(3)").niceScroll();
    }else if(des.userData==7){
        $("#groupAlarm>div:nth-child(3)>table>tbody>tr").remove();
        var str1="";
        for(var i=0;i<des.data.length;i++){
            var cla="";
            var words="";
            if(des.data[i].status==1){
                cla="orange";
                words='<td style="color:rgba(250,50,50,.8)">异常</td>';
            }else{
                words="<td>正常</td>";
            }
            var str="";
            if(des.data[i].comment.length>0){
                var strings = des.data[i].comment;
                //strings = strings.substring(0, strings.lastIndexOf('>'));
                var arr=strings.split(">");
                console.log(arr);
                for(var k=0;k<arr.length;k++){
                    if(arr[k].length>0){
                        var marr=arr[k].split("<");
                        str+="<span data-seq='"+marr[0]+"' about='"+marr[3]+"' data-name='"+marr[2]+"' data-num='"+marr[1]+"'>"+marr[2]+"("+(marr[0])+")</span>";
                    }
                }
            }
            var name="";
            if(des.data[i].miscType==0){
                name="未配置";
            }else if(des.data[i].miscType==1){
                name="三相电流不平衡";
            }else if(des.data[i].miscType==2){
                name="电流开关";
            }else if(des.data[i].miscType==3){
                name="电压开关";
            }else if(des.data[i].miscType==4){
                name="ATS零位";
            }else if(des.data[i].miscType==5){
                name="负载率";
            }else if(des.data[i].miscType==6){
                name="损耗率";
            }
            str1+='<tr class="'+cla+'" about="'+des.data[i].miscType+'" ><td>'+name+'</td><td data-str="'+strings+'">'+str+'</td>'+words+'</tr>';
            
        }
        $("#groupAlarm>div:nth-child(3)>table>tbody").append(str1);
        if(Checkedalarm){
            $("#groupAlarm>div:nth-child(3)>table>tbody>tr[about='"+Checkedalarm+"']").click();
        }else{
            $("#groupAlarm>div:nth-child(3)>table>tbody>tr:nth-child(1)").click();
        }
        var scrollHeight =  $("#groupAlarm>div:nth-child(3)")[0].scrollHeight;
        var clientHeight = $("#groupAlarm>div:nth-child(3)")[0].clientHeight;
        if(scrollHeight>clientHeight){//有发生滚动
            $("#groupAlarm>table:nth-child(2)").addClass("scroll").removeClass("all");
        }else{
            $("#groupAlarm>table:nth-child(2)").removeClass("scroll").addClass("all");
        }
        // $("#groupAlarm>div:nth-child(3)").niceScroll();
    }else if(des.userData==8){
        $("#devWindow>div:nth-child(4)>table>tbody>tr").remove();
        var str1="";
        var str2="";
        for(var i=0;i<des.data.length;i++){
            var cla="";
            var words="";
            if(des.data[i].status==1){
                cla="orange";
                words='<td style="color:rgba(250,50,50,.8)">异常</td>';
            }else{
                words="<td>正常</td>";
            }
            if(des.data[i].type==1){
                str1+='<tr class="'+cla+'" data-type2="'+des.data[i].dataType+'"  type="'+des.data[i].pointId+'"  about="'+des.data[i].pointSeq+'"><td><input type="text" value="'+des.data[i].name+'" data-val="'+des.data[i].name+'"></td><td>'+des.data[i].pointSeq+'</td><td>'+des.data[i].unit+'</td><td><input type="text" value="'+des.data[i].dispSeq+'" data-val="'+des.data[i].dispSeq+'"></td><td><label class="checkOptBox"><select name="" class="oprs'+i+'" data-val="'+des.data[i].area+'"><option value="1">区域1</option><option value="2">区域2</option><option value="3">区域3</option><option value="4">区域4</option></select></label></td>'+words+'</tr>'; 
            }else{
                str2+='<tr class="'+cla+'" data-type2="'+des.data[i].dataType+'"  type="'+des.data[i].pointId+'"  about="'+des.data[i].pointSeq+'"><td><input type="text" value="'+des.data[i].name+'" data-val="'+des.data[i].name+'"></td><td>'+des.data[i].pointSeq+'</td><td><label class="checkOptBox"><select name="" class="opts'+i+'" data-val="'+des.data[i].dispMode+'"><option value="0">默认显示</option><option value="1">告警显示</option></select></label></td><td><input type="text" value="'+des.data[i].dispSeq+'" data-val="'+des.data[i].dispSeq+'"><td><label class="checkOptBox"><select name="" class="oprs'+i+'" data-val="'+des.data[i].area+'"><option value="1">区域1</option><option value="2">区域2</option><option value="3">区域3</option><option value="4">区域4</option></select></label></td></td>'+words+'</tr>';
            }
        }
        $("#devWindow>div:nth-child(4)>table:nth-child(1)>tbody").append(str1);
        $("#devWindow>div:nth-child(4)>table:nth-child(2)>tbody").append(str2);
        $("#devWindow>div:nth-child(4) select").each(function(){
            var val=$(this).attr("data-val");
            $(this).val(val);
        });
        var type=$("#devWindow>p:nth-child(2)>a.active").attr("type");
        if(type==1){
            $("#devWindow>div:nth-child(4)>table:nth-child(1)>tbody>tr:nth-child(1)").click();
        }else{
            $("#devWindow>div:nth-child(4)>table:nth-child(2)>tbody>tr:nth-child(1)").click();
        }
        var scrollHeight =  $("#devWindow>div:nth-child(4)")[0].scrollHeight;
        var clientHeight = $("#devWindow>div:nth-child(4)")[0].clientHeight;
        if(scrollHeight>clientHeight){//有发生滚动
            $("#devWindow>table:nth-child(3)").addClass("scroll").removeClass("all");
        }else{
            $("#devWindow>table:nth-child(3)").removeClass("scroll").addClass("all");
        }
        // $("#devWindow>div:nth-child(4)").niceScroll();
    }else if(des.userData==9){
        $("#diagnosis>div:nth-child(3)>table>tbody>tr").remove();
        var str1="";
        for(var i=0;i<des.data.length;i++){
            var cla="";
            var words="";
            if(des.data[i].status==1){
                cla="orange";
                words='<td style="color:rgba(250,50,50,.8)">异常</td>';
            }else{
                words="<td>正常</td>";
            }
            var str="";
            if(des.data[i].comment.length>0){
                var strings = des.data[i].comment;
                var arr=strings.split(">");
                for(var k=0;k<arr.length;k++){
                    if(arr[k].length>0){
                        var marr=arr[k].split("<");
                        str+="<span data-seq='"+marr[0]+"' data-name='"+marr[2]+"' data-num='"+marr[1]+"'><u>"+marr[2]+"("+(marr[0])+")</u><b></b></span>";
                    }
                }
            }
            var maxLen=1;
            if(des.data[i].visitId==2 ||des.data[i].visitId==12 ||des.data[i].visitId==16||des.data[i].visitId==13){
                maxLen=3;
            }else if(des.data[i].visitId==4 ||des.data[i].visitId==5||des.data[i].visitId==15){
                maxLen=4;
            }else if(des.data[i].visitId==6 ||des.data[i].visitId==7){
                maxLen=6;
            }
            var cls="";
            if(des.data[i].isUsed==1){
                cls="active";
            }
            str1+='<tr data-max="'+maxLen+'" data-str="'+des.data[i].comment+'" class="'+cla+'" data-visitId="'+des.data[i].visitId+'"  data-visitSeq="'+des.data[i].visitSeq+'"  data-devType="'+des.data[i].devType+'" data-isUse="'+des.data[i].isUsed+'"><td>'+(i+1)+'</td><td>'+des.data[i].name+'</td><td><a class="'+cls+'">启动</></td><td>'+str+'</td></td>'+words+'</tr>';
           
        }
        $("#diagnosis>div:nth-child(3)>table>tbody").append(str1);
        if(CheckedDia){
            $("#diagnosis>div:nth-child(3)>table>tbody>tr[data-visitseq='"+CheckedDia+"']").click();
        }else{
            $("#diagnosis>div:nth-child(3)>table>tbody>tr:nth-child(1)").click();
        }
        var scrollHeight =  $("#diagnosis>div:nth-child(3)")[0].scrollHeight;
        var clientHeight = $("#diagnosis>div:nth-child(3)")[0].clientHeight;
        if(scrollHeight>clientHeight){//有发生滚动
            $("#diagnosis>table:nth-child(2)").addClass("scroll").removeClass("all");
        }else{
            $("#diagnosis>table:nth-child(2)").removeClass("scroll").addClass("all");
        }
      
        // $("#diagnosis>div:nth-child(3)").niceScroll();
    }
};

//点击实时数据增加
$("#devWindow>p:first-child>button:nth-child(1)").click(function(){
    $("#configedYCYX .langueage>a:nth-child(1)").click();
    $("#configedYCYX").show().attr("about",66);
    $("#configedYCYX .checkedYCYX").css("height","380px");
    $("#configedYCYX .search").val("");
    $(".packIn").hide();
    move("configedYCYX","configedYCYXTop");
    loadYXYCconfigedList();
    $("#configedYCYX .checkedYCYX>table>tbody>tr").remove();
    $("#configedYCYX>ul:nth-child(2)>li:nth-child(2)>img:nth-child(2)").attr("src","imgs/toLeft2.png").removeClass("active");
});
//点击切换实时数据遥测遥信
$("#devWindow>p:nth-child(2)>a").click(function(){
    var isRight=true;
    $(".businessContent>div>div:nth-child(n+3)>table>tbody>tr").each(function(){
        if($(this).hasClass("change")){
            loadAlerts("有编辑后未保存的项，建议保存！");
            isRight=false;
        }
    });
    if(!isRight){
        return false;
    }
    $("#devWindow>div:nth-child(4)>table>tbody>tr").removeClass("active");
    CheckedWindow="";
    $(this).addClass("active").siblings("a").removeClass("active");
    var type=$(this).attr("type");
    if(type==1){//遥测
        $("#devWindow>table:nth-child(3)>thead>tr>th").remove();
        $("#devWindow>table:nth-child(3)>thead>tr").append('<th>名称</th><th>点位</th><th>单位</th><th>显示顺序</th><th>区域</th><th>状态</th>');
        $("#devWindow>div:nth-child(4)>table:nth-child(1)").show();
        $("#devWindow>div:nth-child(4)>table:nth-child(2)").hide();
        $("#devWindow>div:nth-child(4)>table:nth-child(1)>tbody>tr:nth-child(1)").click();
    }else{//遥信
        $("#devWindow>table:nth-child(3)>thead>tr>th").remove();
        $("#devWindow>table:nth-child(3)>thead>tr").append('<th>名称</th><th>点位</th><th>显示方式</th><th>显示顺序</th><th>区域</th><th>状态</th>');
        $("#devWindow>div:nth-child(4)>table:nth-child(1)").hide();
        $("#devWindow>div:nth-child(4)>table:nth-child(2)").show();
        $("#devWindow>div:nth-child(4)>table:nth-child(2)>tbody>tr:nth-child(1)").click();
    }
    $("#configedYCYX").hide();
});
//点击切换实时数据
$("#devWindow>div:nth-child(4)>table>tbody").on("click","tr",function(){
    $(this).addClass("active").siblings("tr").removeClass("active");
    CheckedWindow=$(this).attr("about");
});
//点击删除实时数据
$("#devWindow>p:nth-child(1)>button:nth-child(2)").click(function(){
    var leng=$("#devWindow>div:nth-child(4)>table>tbody>tr.active").length;
    if(leng<=0){
        loadAlerts("请先选择一条记录，然后进行删除操作！");
        return false;
    }
    // var com=confirm("确认删除吗？");
    // if(com){
        if($("#devWindow>div:nth-child(4)>table>tbody>tr.active").hasClass("add")){
            var id = $("#devWindow>div:nth-child(4)>table>tbody>tr.active").attr("about");
            $("#devWindow>div:nth-child(4)>table>tbody>tr").each(function(){
                if($(this).attr("about")==id){
                    if($(this).next().length!=0){
                        $(this).next().click();
                        $(this).remove();
                        return false;
                    }else{
                        $(this).prev().click();
                        $(this).remove();
                        return false;
                    }
                }
            });
        }else{
            var id = $("#devWindow>div:nth-child(4)>table>tbody>tr.active").attr("about");
            var ob = new Object();
            var devType=$(".datamodal .devTypes").val();
            var tbid=$(".datamodal .devTypes").attr("data-tbid");
            ob.devType = parseInt(devType);
            ob.tableId = parseInt(tbid);
            ob.type = 8;
            ob.id = parseInt(id);
            ob.userData = 0;
            var json = JSON.stringify(ob);
            console.log(json);
            ccc_lib_reqDataByCmd("",USER_DEVICE_SERVICE_DELBYTYPE,json,delPointDetailReturn9);//点击删除实时数据
        }
    // }
});
function delPointDetailReturn9(id,info,des){
    loadAlerts(des.desc);
    var seq = $("#devWindow>div:nth-child(4)>table>tbody>tr.active>td:nth-child(1)").attr("about");
    var id = $("#devWindow>div:nth-child(4)>table>tbody>tr.active").attr("about");
    if(des.result==0){
        $("#devWindow>div:nth-child(4)>table>tbody>tr").each(function(){
            if($(this).attr("about")==id){
                if($(this).next().length!=0){
                    $(this).next().click();
                    $(this).remove();
                    return false;
                }else{
                    $(this).prev().click();
                    $(this).remove();
                    return false;
                }
            }
        });
        //$("#devWindow>div:nth-child(4)>table>tbody>tr").each(function(i){
        //    if(i>=seq){
        //        $(this).children("td:last-child").html("修改");
        //        $(this).addClass("change");
        //    }
        //});
    }
};
//点击批量提交实时数据
$("#devWindow>p:nth-child(1)>button:nth-child(3)").click(function(){
    var type=$("#devWindow>p:nth-child(2)>a.active").attr("type");
    var allNum=0;
    if(type==1){
        allNum = $("#devWindow>div:nth-child(4)>table:nth-child(1)>tbody>tr.change").length;
    }else{
        allNum = $("#devWindow>div:nth-child(4)>table:nth-child(2)>tbody>tr.change").length;
    }

    if(allNum<=10 && allNum>0){
        PagingData9(1,allNum);
    }else if(allNum>10){
        PagingData9(1,10);
    }
});
function returnPagingData9(id,info,des){
    console.log(des);
    var type=$("#devWindow>p:nth-child(2)>a.active").attr("type");
    var length=0;
    if(type==1){
        length = $("#devWindow>div:nth-child(4)>table:nth-child(1)>tbody>tr.change").length;
    }else{
        length = $("#devWindow>div:nth-child(4)>table:nth-child(2)>tbody>tr.change").length;
    }
    var pg = document.getElementById('pg');
    var pgv = document.getElementById('pgv');
    if(des.userData>=length){
        pgv.innerHTML = '进度：100%';
        //pgv.innerHTML = '加载完成';
        loadEquipmentBusiness(8);
        $(".range").hide();
        pg.value=0;
        pgv.innerHTML = '进度：0%';
        loadAlerts(des.desc);
    }else if(des.userData<length){
        $(".range").show();
        pg.value=((des.userData/length)*100).toFixed(1);
        pgv.innerHTML = '进度：' + pg.value + '%';
        PagingData9(des.userData+1,des.userData+10);
    }
    if(des.result!=0){
        loadAlerts(des.desc);
    }
};
//分页传输数据 一次20条
function PagingData9(num1,num2){
    var ob = new Object();
    var devType=$(".datamodal .devTypes").val();
    var tbid=$(".datamodal .devTypes").attr("data-tbid");
    ob.devType = parseInt(devType);
    ob.tableId = parseInt(tbid);
    ob.type = 8;
    var arr=[];
    var type=$("#devWindow>p:nth-child(2)>a.active").attr("type");
    if(type==1){
        $("#devWindow>div:nth-child(4)>table:nth-child(1)>tbody>tr.change").each(function(i){
            if((i+1)>=num1 && (i+1)<=num2){
                var obj=new Object();
                obj.pointId=parseInt($(this).attr("type"));
                // obj.id=parseInt($(this).attr("about"));
                obj.pointSeq = parseInt($(this).children("td:nth-child(2)").html());
                obj.unit = $(this).children("td:nth-child(3)").html();
                obj.name=$(this).children("td:nth-child(1)").children("input").val();
                obj.dispMode=0;
                obj.area=parseInt($(this).children("td:nth-child(5)").find("select").val());
                obj.dispSeq=parseInt($(this).children("td:nth-child(4)").children("input").val());
                if(!obj.dispSeq){
                    obj.dispSeq=0;
                }
                obj.type=1;
                obj.dataType=parseInt($(this).attr("data-type2"));
                arr.push(obj);
            }
        });
    }else{
        $("#devWindow>div:nth-child(4)>table:nth-child(2)>tbody>tr.change").each(function(i){
            if((i+1)>=num1 && (i+1)<=num2){
                var obj=new Object();
                obj.pointId=parseInt($(this).attr("type"));
                // obj.id=parseInt($(this).attr("about"));
                obj.pointSeq = parseInt($(this).children("td:nth-child(2)").html());
                obj.unit="";
                obj.name=$(this).children("td:nth-child(1)").children("input").val();
                obj.dispMode=parseInt($(this).children("td:nth-child(3)").find("select").val());
                obj.dispSeq=parseInt($(this).children("td:nth-child(4)").find("input").val());
                obj.area=parseInt($(this).children("td:nth-child(5)").find("select").val());
                if(!obj.dispSeq){
                    obj.dispSeq=0;
                }
                if(!obj.dispMode){
                    obj.dispMode=0;
                }
                obj.type=2;
                obj.dataType=parseInt($(this).attr("data-type2"));
                arr.push(obj);
            }
        });
    }

    ob.userData = num2;
    ob.data = arr;
    var json = JSON.stringify(ob);
    console.log(json);
    ccc_lib_reqDataByCmd("",USER_DEVICE_SERVICE_CFGBYTYPE,json,returnPagingData9);//批量提交配置的所有设备列表
};

//获取已经配置好的遥信遥测等
function loadYXYCconfigedList(){
    console.log(ConfigedPoints);
    $("#configedYCYX .ycyxs>li").remove();
    $("#configedYCYX2 .ycyxs>li").remove();
    for(var i=0;i<ConfigedPoints.length;i++){
        var str;
        str = outType(ConfigedPoints[i].type);
        $("#configedYCYX .ycyxs,#configedYCYX2 .ycyxs").append('<li  data-iscomb="'+ConfigedPoints[i].IsComb+'" data-flag="'+ConfigedPoints[i].CombId+'" data-unit="'+ConfigedPoints[i].unit+'"   data-name="'+ConfigedPoints[i].name+'" data-num="'+ConfigedPoints[i].pointId+'" data-type="'+ConfigedPoints[i].seqNum+'" data-type2="'+ConfigedPoints[i].type+'"> <p><span title="'+ConfigedPoints[i].name+'">'+ConfigedPoints[i].name+'</span><img src="imgs/ok.png" alt=""/></p><p style="display:none"></p><p><span>点位：'+ConfigedPoints[i].seqNum+'</span><span>'+ConfigedPoints[i].unit+'</span><b>'+str+'</b></p></li>');

    }
    // $("#configedYCYX>ul:nth-child(2)>li:nth-child(1)>ul:nth-child(2)>li").niceScroll();
    // $("#configedYCYX2>ul:nth-child(2)>li:nth-child(1)>ul:nth-child(2)>li").niceScroll();
    var about = $("#configedYCYX").attr("about");
    if(about==1){//设备列表去重复
        $("#configedYCYX .ycyxs>li").each(function(){
            var that = this;
            var id=$(that).attr("data-type");
            $("#devList>div:nth-child(3)>table>tbody>tr").each(function(){
                var id2=$(this).children("td:nth-child(2)").html();
                if(id==id2){
                    $(that).remove();
                }
            });
        });
    }else if(about==2){//电气图去重复
        var type=$("#elecDiagram>p:nth-child(2)>a.active").attr("type");
        if(type==0){//当前是操作遥信遥测过滤掉开关
            $("#configedYCYX .ycyxs>li").each(function(){
                if($(this).attr("data-type2")==5 || $(this).attr("data-type2")==7){
                    $(this).remove();
                }
            });
        }else if(type==1){//当前是开关过滤掉遥测
            $("#configedYCYX .ycyxs>li").each(function(){
                if($(this).attr("data-type2")==1 || $(this).attr("data-type2")==2|| $(this).attr("data-type2")==3|| $(this).attr("data-type2")==4|| $(this).attr("data-type2")==6|| $(this).attr("data-type2")==8|| $(this).attr("data-type2")==9){
                    $(this).remove();
                }
            });
        }
        $("#configedYCYX .ycyxs>li").each(function(){
            var that = this;
            var id=$(that).attr("data-type");
            $("#elecDiagram>div:nth-child(4)>table>tbody>tr").each(function(){
                var id2=$(this).children("td:nth-child(2)").html();
                if(id==id2){
                    $(that).remove();
                }
            });
        });
    }else if(about==5){//状态定制去重复
        $("#configedYCYX2 .ycyxs>li").each(function(){
            var that = this;
            var id=$(that).attr("data-type2");
            if(id==6 || id==9){
                var id2=$(that).attr("data-type");
                $("#statusBar>div:nth-child(3)>table>tbody>tr").each(function(){
                    var id3=$(this).children("td:nth-child(2)").html();
                    if(id2==id3){
                        $(that).remove();
                    }
                });
            }else{
                $(that).remove();
            }
        });
    }else if(about==33){//曲线存储去重复
        var arr=[];//储存分组
        $("#configedYCYX2 .ycyxs>li").each(function(){
            var that = this;
            var flag=$(that).attr("data-flag");
            // var iscomb=$(that).attr("data-iscomb");
            if(flag==0){
                $(that).remove();
            }
            // else{
            //     // if($("#configedYCYX .ycyxs>li[data-flag='"+flag+"']").length>1){//
            //     //     arr.push(flag);
            //     // }
            //     if(arr.indexOf(flag)==-1){
            //         arr.push(flag);
            //     }
            // }
            $("#curveStored>div:nth-child(3)>table>tbody>tr").each(function(){
                var id2=$(this).attr("data-flag");
                if(flag==id2 && id2!=0 && flag!=0){
                    if(arr.indexOf(flag)==-1){
                        arr.push(flag);
                    }
                    $(that).remove();
                }
            });
        });
        console.log(arr);
        // debugger;
        $("#configedYCYX2 .ycyxs>li").each(function(){
            for(var i=0;i<arr.length;i++){
                if($(this).attr("data-type2")!=1){//过滤遥信
                    $(this).remove();
                }else{
                    if($(this).attr("data-flag")==arr[i]){//已有重复的
                        $(this).remove();
                    }
                }
            }
        });
    }else if(about==44){//分组存储去重复
        var arr=[];
        var arr2=[];
        var gbtype=parseInt($(".gbfb>a.active").attr("type"));
        $("#configedYCYX .ycyxs>li").each(function(){
            var that = this;
            if($("#packeStorage>div:nth-child("+(gbtype+3)+")>table>tbody>tr").length>=1){
                $("#packeStorage>div:nth-child("+(gbtype+3)+")>table>tbody>tr:nth-child(1)>td:nth-child(4)>span").each(function(){
                    var seq=$(this).attr("data-seq");
                    var num=$(this).attr("data-num");
                    if(arr.indexOf(num)==-1){
                        arr.push(num);
                    }
                });
                $("#packeStorage>div:nth-child(4)>table>tbody>tr>td:nth-child(4)>span").each(function(){
                    var seq=$(this).attr("data-seq");
                    var num=$(this).attr("data-num");

                    if(arr2.indexOf(seq)==-1){
                        arr2.push(seq);
                    }
                });
                $("#packeStorage>div:nth-child(5)>table>tbody>tr>td:nth-child(4)>span").each(function(){
                    var seq=$(this).attr("data-seq");
                    var num=$(this).attr("data-num");

                    if(arr2.indexOf(seq)==-1){
                        arr2.push(seq);
                    }
                });
            }
        });
        if($("#packeStorage>div:nth-child("+(gbtype+3)+")>table>tbody>tr").length>=1){
            $("#configedYCYX .ycyxs>li").each(function(){
                var num=$(this).attr("data-num");
                var seq =$(this).attr("data-type");
                if(arr.indexOf(num)==-1){
                    $(this).remove();
                }else{
                    if(arr2.indexOf(seq) != -1){
                        $(this).remove();
                    }
                }
            });
        }
    }else if(about==74){//组合分析去重复
        $("#configedYCYX .ycyxs>li").each(function(){
            var that = this;
            var id=$(that).attr("data-type");
            $("#groupAlarm>div:nth-child(3)>table>tbody>tr>td:nth-child(2)>span").each(function(){
                var id2=$(this).attr("data-seq");
                if(id==id2){
                    $(that).remove();
                }
            });
        });
    }else if(about==66){//实时数据去重复
        var type=$("#devWindow>p:nth-child(2)>a.active").attr("type");
        if(type==2){//当前是操作遥信过滤掉遥测
            $("#configedYCYX .ycyxs>li").each(function(){
                if($(this).attr("data-type2")==1 || $(this).attr("data-type2")==3 || $(this).attr("data-type2")==9){
                    $(this).remove();
                }
            });
        }
        $("#configedYCYX .ycyxs>li").each(function(){
            var that = this;
            var id=$(that).attr("data-type");
            $("#devWindow>div:nth-child(4)>table>tbody>tr").each(function(){
                var id2=$(this).children("td:nth-child(2)").html();
                if(id==id2){
                    $(that).remove();
                }
            });
        });
    }else if(about==8){//预警诊断去重复
        $("#configedYCYX2 .ycyxs>li").each(function(){
            var that = this;
            var id=$(that).attr("data-type");
            $("#diagnosis>div:nth-child(3)>table>tbody>tr.active>td:nth-child(4)>span").each(function(){
                var seq = $(this).attr("data-seq");
                if(id==seq){
                    $(that).remove();
                }
            });
        });
    }
};
//点击批量提交设备列表
$("#devList>p:nth-child(1)>button:nth-child(3)").click(function(){
    var allLen = $("#devList>div:nth-child(3)>table>tbody>tr").length;
    if(allLen>5){
        loadAlerts("设备列表最多只能五个！");
        return false;
    }
    var allNum = $("#devList>div:nth-child(3)>table>tbody>tr.change").length;
    if(allNum<=10 && allNum>0){
        PagingData2(1,allNum);
    }else if(allNum>10){
        PagingData2(1,10);
    }
});
function returnPagingData2(id,info,des){
    console.log(des);
    var length=$("#devList>div:nth-child(3)>table>tbody>tr.change").length;
    var pg = document.getElementById('pg');
    var pgv = document.getElementById('pgv');
    if(des.userData>=length){
        pgv.innerHTML = '进度：100%';
        //pgv.innerHTML = '加载完成';
        loadEquipmentBusiness(1);
        $(".range").hide();
        pg.value=0;
        pgv.innerHTML = '进度：0%';
        loadAlerts(des.desc);
    }else if(des.userData<length){
        $(".range").show();
        pg.value=((des.userData/length)*100).toFixed(1);
        pgv.innerHTML = '进度：' + pg.value + '%';
        PagingData2(des.userData+1,des.userData+10);
    }
    if(des.result!=0){
        loadAlerts(des.desc);
    }
};
//分页传输数据 一次20条
function PagingData2(num1,num2){
    var ob = new Object();
    var devType=$(".datamodal .devTypes").val();
    var tbid=$(".datamodal .devTypes").attr("data-tbid");
    ob.devType = parseInt(devType);
    ob.tableId = parseInt(tbid);
    ob.type = 1;
    var arr=[];
    $("#devList>div:nth-child(3)>table>tbody>tr.change").each(function(i){
        if((i+1)>=num1 && (i+1)<=num2){
            var obj=new Object();
            //obj.seqNum=parseInt($(this).children("td:nth-child(1)").html());
            obj.pointId=parseInt($(this).attr("type"));
            obj.pointSeq = parseInt($(this).children("td:nth-child(2)").html());
            obj.name=$(this).children("td:nth-child(1)").children("input").val();
            obj.dispSeq=parseInt($(this).children("td:nth-child(4)").children("select").val());
            // obj.id=parseInt($(this).attr("about"));
            arr.push(obj);
        }
    });
    ob.userData = num2;
    ob.data = arr;
    var json = JSON.stringify(ob);
    ccc_lib_reqDataByCmd("",USER_DEVICE_SERVICE_CFGBYTYPE,json,returnPagingData2);//批量提交配置的所有设备列表
};

//点击电气图增加按钮
$("#elecDiagram>p:first-child>button:nth-child(1)").click(function(){
    $("#configedYCYX .langueage>a:nth-child(2)").click();
    $("#configedYCYX").show().attr("about",2);
    $("#configedYCYX .checkedYCYX").css("height","380px");
    $("#configedYCYX .search").val("");
    $(".packIn").hide();
    move("configedYCYX","configedYCYXTop");
    loadYXYCconfigedList();
    $("#configedYCYX .checkedYCYX>table>tbody>tr").remove();
    $("#configedYCYX>ul:nth-child(2)>li:nth-child(2)>img:nth-child(2)").attr("src","imgs/toLeft2.png").removeClass("active");
});
//点击切换电气图遥测遥信和关联开关
$("#elecDiagram>p:nth-child(2)>a").click(function(){
    var isRight=true;
    $(".businessContent>div>div:nth-child(n+3)>table>tbody>tr").each(function(){
        if($(this).hasClass("change")){
            loadAlerts("有编辑后未保存的项，建议保存！");
            isRight=false;
        }
    });
    if(!isRight){
        return false;
    }
    $("#elecDiagram>div:nth-child(4)>table>tbody>tr").removeClass("active");
    Checkedelec="";
    $(this).addClass("active").siblings("a").removeClass("active");
    var type=$(this).attr("type");
    if(type==0){//遥测遥信
        $("#elecDiagram>table:nth-child(3)>thead>tr>th").remove();
        $("#elecDiagram>table:nth-child(3)>thead>tr").append('<th>名称</th><th>点位</th><th>单位</th><th>显示颜色</th><th>显示顺序</th><th>区域</th><th>状态</th>');
        $("#elecDiagram>div:nth-child(4)>table:nth-child(1)").show();
        $("#elecDiagram>div:nth-child(4)>table:nth-child(2)").hide();
        $("#elecDiagram>div:nth-child(4)>table:nth-child(1)>tbody>tr:nth-child(1)").click();

    }else{//关联开关
        $("#elecDiagram>table:nth-child(3)>thead>tr>th").remove();
        $("#elecDiagram>table:nth-child(3)>thead>tr").append('<th style="width:40%;">名称</th><th style="width:20%;">点位</th><th style="width:20%;">开关编号</th><th style="width:20%;">状态</th>');
        $("#elecDiagram>div:nth-child(4)>table:nth-child(1)").hide();
        $("#elecDiagram>div:nth-child(4)>table:nth-child(2)").show();
        $("#elecDiagram>div:nth-child(4)>table:nth-child(2)>tbody>tr:nth-child(1)").click();
    }

    $("#configedYCYX").hide();
});
//点击切换电气图列表
$("#elecDiagram>div:nth-child(4)>table>tbody").on("click","tr",function(){
    $(this).addClass("active").siblings("tr").removeClass("active");
    Checkedelec=$(this).attr("about");
});
//点击批量提交电气图列表
$("#elecDiagram>p:nth-child(1)>button:nth-child(3)").click(function(){
    var allLen=$("#elecDiagram>div:nth-child(4)>table:nth-child(1)>tbody>tr").length;
    if(allLen>40){
        loadAlerts("电气图遥测遥信个数不能超过40个！");
        return false;
    }
    var allLen2=$("#elecDiagram>div:nth-child(4)>table:nth-child(2)>tbody>tr").length;
    if(allLen2>40){
        loadAlerts("电气图开关个数不能超过40个！");
        return false;
    }
    var type=$("#elecDiagram>p:nth-child(2)>a.active").attr("type");
    var allNum=0;
    if(type==0){
        allNum = $("#elecDiagram>div:nth-child(4)>table:nth-child(1)>tbody>tr.change").length;
    }else{
        allNum = $("#elecDiagram>div:nth-child(4)>table:nth-child(2)>tbody>tr.change").length;
    }
    if(allNum<=10 && allNum>0){
        PagingData3(1,allNum);
    }else if(allNum>10){
        PagingData3(1,10);
    }
});
function returnPagingData3(id,info,des){
    console.log(des);
    var type=$("#elecDiagram>p:nth-child(2)>a.active").attr("type");
    var length=0;
    if(type==0){
        length = $("#elecDiagram>div:nth-child(4)>table:nth-child(1)>tbody>tr.change").length;
    }else{
        length = $("#elecDiagram>div:nth-child(4)>table:nth-child(2)>tbody>tr.change").length;
    }
    var pg = document.getElementById('pg');
    var pgv = document.getElementById('pgv');
    if(des.userData>=length){
        pgv.innerHTML = '进度：100%';
        //pgv.innerHTML = '加载完成';
        loadEquipmentBusiness(2);
        $(".range").hide();
        pg.value=0;
        pgv.innerHTML = '进度：0%';
        loadAlerts(des.desc);
    }else if(des.userData<length){
        $(".range").show();
        pg.value=((des.userData/length)*100).toFixed(1);
        pgv.innerHTML = '进度：' + pg.value + '%';
        PagingData3(des.userData+1,des.userData+10);
    }
    if(des.result!=0){
        loadAlerts(des.desc);
    }
};
//分页传输数据 一次20条
function PagingData3(num1,num2){
    var ob = new Object();
    var devType=$(".datamodal .devTypes").val();
    var tbid=$(".datamodal .devTypes").attr("data-tbid");
    ob.devType = parseInt(devType);
    ob.tableId = parseInt(tbid);
    ob.type = 2;
    var arr=[];
    var type=$("#elecDiagram>p:nth-child(2)>a.active").attr("type");
    if(type==0){
        $("#elecDiagram>div:nth-child(4)>table:nth-child(1)>tbody>tr.change").each(function(i){
            if((i+1)>=num1 && (i+1)<=num2){
                var obj=new Object();
                //obj.seqNum=parseInt($(this).children("td:nth-child(1)").html());
                obj.pointId=parseInt($(this).attr("type"));
                obj.pointSeq = parseInt($(this).children("td:nth-child(2)").html());
                obj.name = $(this).children("td:nth-child(1)").children("input").val();
                obj.color = parseInt($(this).children("td:nth-child(4)").find("select").val());
                obj.area = parseInt($(this).children("td:nth-child(6)").find("select").val());
                obj.dispSeq =parseInt($(this).children("td:nth-child(5)").find("select").val());
                // obj.id = parseInt($(this).attr("about"));
                obj.dataType = parseInt($(this).attr("data-type2"));
                obj.type = 0;
                arr.push(obj);
            }
        });
    }else{
        $("#elecDiagram>div:nth-child(4)>table:nth-child(2)>tbody>tr.change").each(function(i){
            if((i+1)>=num1 && (i+1)<=num2){
                var obj=new Object();
                //obj.seqNum=parseInt($(this).children("td:nth-child(1)").html());
                obj.pointId=parseInt($(this).attr("type"));
                obj.pointSeq = parseInt($(this).children("td:nth-child(2)").html());
                obj.name = $(this).children("td:nth-child(1)").children("input").val();
                obj.color = 0;
                obj.area = parseInt($(this).children("td:nth-child(3)").find("select").val());
                obj.dispSeq = 0;
                obj.dataType = parseInt($(this).attr("data-type2"));
                obj.type = 1;
                arr.push(obj);
            }
        });
    }

    ob.userData = num2;
    ob.data = arr;
    var json = JSON.stringify(ob);
    console.log(json);
    ccc_lib_reqDataByCmd("",USER_DEVICE_SERVICE_CFGBYTYPE,json,returnPagingData3);//批量提交配置的所有电气图
};
//点击删除电气图列表
$("#elecDiagram>p:nth-child(1)>button:nth-child(2)").click(function(){
    var leng=$("#elecDiagram>div:nth-child(4)>table>tbody>tr.active").length;
    if(leng<=0){
        loadAlerts("请先选择一条记录，然后进行删除操作！");
        return false;
    }
    // var com=confirm("确认删除吗？");
    // if(com){
        if($("#elecDiagram>div:nth-child(4)>table>tbody>tr.active").hasClass("add")){
            var id = $("#elecDiagram>div:nth-child(4)>table>tbody>tr.active").attr("about");
            $("#elecDiagram>div:nth-child(4)>table>tbody>tr").each(function(){
                if($(this).attr("about")==id){
                    if($(this).next().length!=0){
                        $(this).next().click();
                        $(this).remove();
                        return false;
                    }else{
                        $(this).prev().click();
                        $(this).remove();
                        return false;
                    }
                }
            });
            // reloadNum3();
        }else{
            var id = $("#elecDiagram>div:nth-child(4)>table>tbody>tr.active").attr("about");
            var ob = new Object();
            var devType=$(".datamodal .devTypes").val();
            var tbid=$(".datamodal .devTypes").attr("data-tbid");
            ob.devType = parseInt(devType);
            ob.tableId = parseInt(tbid);
            ob.type = 2;
            ob.id = parseInt(id);
            ob.userData = 0;
            var json = JSON.stringify(ob);
            ccc_lib_reqDataByCmd("",USER_DEVICE_SERVICE_DELBYTYPE,json,delPointDetailReturn3);//点击删除电气图列表
        }

    // }


});
function delPointDetailReturn3(id,info,des){
    loadAlerts(des.desc);
    var seq = $("#elecDiagram>div:nth-child(4)>table>tbody>tr.active>td:nth-child(1)").attr("about");
    var id = $("#elecDiagram>div:nth-child(4)>table>tbody>tr.active").attr("about");
    if(des.result==0){
        $("#elecDiagram>div:nth-child(4)>table>tbody>tr").each(function(){
            if($(this).attr("about")==id){
                if($(this).next().length!=0){
                    $(this).next().click();
                    $(this).remove();
                    return false;
                }else{
                    $(this).prev().click();
                    $(this).remove();
                    return false;
                }
            }
        });
        // reloadNum3();
        //$("#elecDiagram>div:nth-child(3)>table>tbody>tr").each(function(i){
        //    if(i>=seq){
        //        $(this).children("td:last-child").html("修改");
        //        $(this).addClass("change");
        //    }
        //});


    }
};
//点击曲线储存增加按钮
$("#curveStored>p:first-child>button:nth-child(1)").click(function(){
    $("#configedYCYX2 .langueage>a:nth-child(1)").click();
    $("#configedYCYX2").show();
    $("#configedYCYX").attr("about",33);
    $("#configedYCYX2 .checkedYCYX").css("height","380px");
    $("#configedYCYX2 .search").val("");
    $(".packIn").hide();
    move("configedYCYX2","configedYCYX2Top");
    loadYXYCconfigedList();
    $("#configedYCYX2 .checkedYCYX>table>tbody>tr").remove();
});
//点击切换曲线储存列表
$("#curveStored>div:nth-child(3)>table>tbody").on("click","tr",function(){
    $(this).addClass("active").siblings("tr").removeClass("active");
    Checkedcurv=$(this).attr("about");
});
//点击批量提交曲线储存列表
$("#curveStored>p:nth-child(1)>button:nth-child(3)").click(function(){
    var allNum = $("#curveStored>div:nth-child(3)>table>tbody>tr.change").length;
    if(allNum<=10 && allNum>0){
        PagingData4(1,allNum);
    }else if(allNum>10){
        PagingData4(1,10);
    }
});
function returnPagingData4(id,info,des){
    console.log(des);
    var length=$("#curveStored>div:nth-child(3)>table>tbody>tr.change").length;
    var pg = document.getElementById('pg');
    var pgv = document.getElementById('pgv');
    if(des.userData>=length){
        pgv.innerHTML = '进度：100%';
        //pgv.innerHTML = '加载完成';
        loadEquipmentBusiness(3);
        $(".range").hide();
        pg.value=0;
        pgv.innerHTML = '进度：0%';
        loadAlerts(des.desc);
    }else if(des.userData<length){
        $(".range").show();
        pg.value=((des.userData/length)*100).toFixed(1);
        pgv.innerHTML = '进度：' + pg.value + '%';
        PagingData4(des.userData+1,des.userData+10);
    }
    if(des.result!=0){
        loadAlerts(des.desc);
    }
};
//分页传输数据 一次20条
function PagingData4(num1,num2){
    var ob = new Object();
    var devType=$(".datamodal .devTypes").val();
    var tbid=$(".datamodal .devTypes").attr("data-tbid");
    ob.devType = parseInt(devType);
    ob.tableId = parseInt(tbid);
    ob.type = 3;
    var arr=[];
    var isRight= true;
    $("#curveStored>div:nth-child(3)>table>tbody>tr.change").each(function(i){
        if((i+1)>=num1 && (i+1)<=num2){
            var obj=new Object();
            obj.pointId=parseInt($(this).children("td:nth-child(2)").html());
            obj.name = $(this).children("td:nth-child(1)").children("input").val();
            obj.unit = $(this).children("td:nth-child(3)").html();
            obj.groupId =  parseInt($(this).attr('data-flag'));
            obj.dispSeq = parseInt($(this).children("td:nth-child(4)").find("select").val());
            obj.jumpPer = parseInt($(this).children("td:nth-child(5)").find("input").val());
            var len = $(this).children("td:nth-child(6)").children("span").length;
            var arr2=[];
            if(len<=0){
                obj.comment = "";
                arr.push(obj);
            }else{
                var str="";
                $(this).children("td:nth-child(6)").children("span").each(function(){
                    var flag=$(this).attr("data-flag");
                    if(arr2.indexOf(flag)==-1){
                        arr2.push(flag);
                    }
                    var seq = $(this).attr("data-seq");
                    var name=$(this).attr("data-name");
                    var num=$(this).attr("data-num");
                    // var id=$(this).attr("about");
                    str+=(seq+"<"+num+"<"+name+">");
                });
                obj.comment = str;
                if(arr2.length>1){
                    loadAlerts("数据成员中类型不一致！");
                    isRight=false;
                }else{
                    $(this).attr("data-flag",arr2[0]);
                    arr.push(obj);
                }
            }
        }
    });
    ob.userData = num2;
    ob.data = arr;
    var json = JSON.stringify(ob);
    console.log(ob);
    if(isRight){
        ccc_lib_reqDataByCmd("",USER_DEVICE_SERVICE_CFGBYTYPE,json,returnPagingData4);//批量提交配置的所有电气图
    }
};

//点击删除曲线储存列表
$("#curveStored>p:nth-child(1)>button:nth-child(2)").click(function(){
    var leng=$("#curveStored>div:nth-child(3)>table>tbody>tr.active").length;
    if(leng<=0){
        loadAlerts("请先选择一条记录，然后进行删除操作！");
        return false;
    }
    // var com=confirm("确认删除吗？");
    // if(com){
        if($("#curveStored>div:nth-child(3)>table>tbody>tr.active").hasClass("add")){
            var id = $("#curveStored>div:nth-child(3)>table>tbody>tr.active").attr("about");
            $("#curveStored>div:nth-child(3)>table>tbody>tr").each(function(){
                if($(this).attr("about")==id){
                    if($(this).next().length!=0){
                        $(this).next().click();
                        $(this).remove();
                        return false;
                    }else{
                        $(this).prev().click();
                        $(this).remove();
                        return false;
                    }
                }
            });
        }else{
            var id = $("#curveStored>div:nth-child(3)>table>tbody>tr.active").attr("about");
            var ob = new Object();
            var devType=$(".datamodal .devTypes").val();
            var tbid=$(".datamodal .devTypes").attr("data-tbid");
            ob.devType = parseInt(devType);
            ob.tableId = parseInt(tbid);
            ob.type = 3;
            ob.id = parseInt(id);
            ob.userData = 0;
            var json = JSON.stringify(ob);
            ccc_lib_reqDataByCmd("",USER_DEVICE_SERVICE_DELBYTYPE,json,delPointDetailReturn4);//点击删除曲线储存列表
        }
    // }
});
function delPointDetailReturn4(id,info,des){
    loadAlerts(des.desc);
    var seq = $("#curveStored>div:nth-child(3)>table>tbody>tr.active>td:nth-child(1)").attr("about");
    var id = $("#curveStored>div:nth-child(3)>table>tbody>tr.active").attr("about");
    if(des.result==0){
        $("#curveStored>div:nth-child(3)>table>tbody>tr").each(function(){
            if($(this).attr("about")==id){
                if($(this).next().length!=0){
                    $(this).next().click();
                    $(this).remove();
                    return false;
                }else{
                    $(this).prev().click();
                    $(this).remove();
                    return false;
                }
            }
        });
    }
};
//删除曲线存储数据成员
$("#curveStored>div:nth-child(3)>table>tbody").on("click","td>span>b",function(){
    $(this).parent("span").remove();
    var newStr = $("#curveStored>div:nth-child(3)>table>tbody>tr.active>td:nth-child(6)").html();
    var comment=$("#curveStored>div:nth-child(3)>table>tbody>tr.active>td:nth-child(6)").attr("data-str");
    var oldStr="";
    var arr = comment.split(">");
    for(var k=0;k<arr.length;k++){
        var marr=arr[k].split("<");
        oldStr+="<span>"+(marr[0])+"."+marr[1]+"("+(marr[2])+")<b></b></span>";
    }
    if(oldStr!=newStr){
        $("#curveStored>div:nth-child(3)>table>tbody>tr.active").addClass("change");
        $("#curveStored>div:nth-child(3)>table>tbody>tr.active>td:last-child").html("修改");
    }
    var len=$("#curveStored>div:nth-child(3)>table>tbody>tr.active>td:nth-child(6)>span").length;
    $("#curveStored>div:nth-child(3)>table>tbody>tr.active>td:nth-child(5)").html(len);

});

//点击新建分组储存
$("#packeStorage>p:nth-child(1)>button:nth-child(1)").click(function(){
    $("#configedYCYX .langueage>a:nth-child(1)").click();
    $("#configedYCYX").show().attr("about",44);
    $("#configedYCYX .checkedYCYX").css("height","305px");
    $("#configedYCYX .search").val("");
    $(".packIn").show();
    $(".packIn>p").show();
    $(".packIn>p:nth-child(3)").hide();
    $(".packIn input").val("");
    move("configedYCYX","configedYCYXTop");
    loadYXYCconfigedList();
    $("#configedYCYX .checkedYCYX>table>tbody>tr").remove();
    $("#configedYCYX>ul:nth-child(2)>li:nth-child(2)>img:nth-child(2)").attr("src","imgs/toLeft2.png").removeClass("active");
});

//点击切换分组储存列表
$("#packeStorage>div:nth-child(4)>table>tbody,#packeStorage>div:nth-child(5)>table>tbody").on("click","tr",function(){
    $(this).addClass("active").siblings("tr").removeClass("active");
    Checkedpack=$(this).attr("about");
});
//获取已经配置的分组储存曲线列表
function getPackLines(){
    var ob = new Object();
    var devType=$(".datamodal .devTypes").val();
    var tbid=$(".datamodal .devTypes").attr("data-tbid");
    ob.tableId = parseInt(tbid);
    ob.devType = parseInt(devType);
    ob.userData = 0;
    var json = JSON.stringify(ob);
    ccc_lib_reqDataByCmd("",USER_GROUP_CURVE_CFGLIST,json,ShowPackLines);//
};
function ShowPackLines(id,info,des) {
    console.log(des);
    $("#packeStorage>p:nth-child(1)>span").html("无");
    if (des.data.length > 0) {
        var str = "";
        for (var i = 0; i < des.data.length; i++) {
            str += des.data[i].name + "-" + des.data[i].pointId + "、";
            $("#packLine>div:nth-child(2)>table>tbody>tr").each(function(){
                var about=$(this).attr("about");
                if(des.data[i].pointId==about){
                    $(this).children("td:nth-child(1)").children("input").val(des.data[i].name).attr("data-val",des.data[i].name);
                    $(this).children("td:nth-child(2)").children("input").val(des.data[i].jumpPer).attr("data-val",des.data[i].jumpPer);
                    $(this).children("td:nth-child(3)").find("select").val(1);
                }
            });
        }
        str=str.substr(0,str.length-1);
        $("#packeStorage>p:nth-child(1)>span").html(str);
    } else {

    }
};
$(".gbfb>a").click(function(){
    $(this).addClass("active").siblings("a").removeClass("active");
    var type =$(this).attr("type");
    Checkedpack="";
    if(type==1){
        $("#packeStorage>div:nth-child(4)").show().siblings("div").hide();
        $("#packeStorage>div:nth-child(4)>table>tbody>tr:nth-child(1)").click();
    }else if(type==2){
        $("#packeStorage>div:nth-child(5)").show().siblings("div").hide();
        $("#packeStorage>div:nth-child(5)>table>tbody>tr:nth-child(1)").click();
    }
});
//点击分组储存分组曲线
$("#packeStorage>p:nth-child(1)>button:nth-child(4)").click(function(){
    $("#packLine>div:nth-child(2)>table>tbody>tr").remove();
    var gbfbtype=parseInt($(".gbfb>a.active").attr("type"));
    $("#packeStorage>div:nth-child("+(gbfbtype+3)+")>table>tbody>tr:nth-child(1)>td:nth-child(4)>span").each(function(i){
        var name=$(this).attr("data-name");
        var num=$(this).attr("data-num");
        $("#packLine>div:nth-child(2)>table>tbody").append('<tr about="'+num+'"><td><input type="text" value="'+name+'"></td><td> <input type="text" value="5">   </td> <td><label for="" class="checkOptBox"><select name="" class="optt'+i+'"><option value="0">不存储</option><option value="1">存储</option></select></label></td></tr>');
    });
    // $("#packLine>div:nth-child(2)").niceScroll();
    getPackLines();
    $("#packLine").show();
    move("packLine","packLineTop");
});
$("#packLine>p:nth-child(3)>button:nth-child(2)").click(function(){
    $("#packLine").hide();
});
//点击修改分组储存曲线
$("#packLine").on("click","p:nth-child(3)>button:nth-child(1)",function(){
    var arr=[];
    var isRight=true;
    $("#packLine>div:nth-child(2)>table>tbody>tr").each(function(){
        var val=$(this).children("td:nth-child(3)").find("select").val();
        if(val==1){
            var obj = new Object();
            obj.pointId = parseInt($(this).attr("about"));
            obj.jumpPer = parseInt($(this).children("td:nth-child(2)").children("input").val());
            obj.name=$(this).children("td:nth-child(1)").children("input").val();
            if(byteLength(obj.name)>64){
                loadAlerts("名称最多只能输入64个字符或21个汉字！");
                isRight=false;
                return false;
            }
            arr.push(obj);
        }
    });
    var ob = new Object();
    var devType=$(".datamodal .devTypes").val();
    var tbid=$(".datamodal .devTypes").attr("data-tbid");
    ob.devType = parseInt(devType);
    ob.tableId = parseInt(tbid);
    ob.data = arr;
    ob.userData = 0;
    var json = JSON.stringify(ob);
    console.log(json);
    if(isRight){
        ccc_lib_reqDataByCmd("",USER_CREAT_GROUP_CURVE_CFG,json,modifyPackLine);//
    }
});

function modifyPackLine(id,info,des){
    loadAlerts(des.desc);
    getPackLines();
};
//点击删除分组储存列表
$("#packeStorage>p:nth-child(1)>button:nth-child(2)").click(function(){
    var gbfbtype=parseInt($(".gbfb>a.active").attr("type"));
    var leng=$("#packeStorage>div:nth-child("+(gbfbtype+3)+")>table>tbody>tr.active").length;
    if(leng<=0){
        loadAlerts("请先选择一条记录，然后进行删除操作！");
        return false;
    }
    

    if($("#packeStorage>div:nth-child("+(gbfbtype+3)+")>table>tbody>tr.active").hasClass("add")){
        var id = $("#packeStorage>div:nth-child("+(gbfbtype+3)+")>table>tbody>tr.active").attr("data-add");
        $("#packeStorage>div:nth-child("+(gbfbtype+3)+")>table>tbody>tr").each(function(){
            if($(this).attr("data-add")==id){
                if($(this).next().length!=0){
                    $(this).next().click();
                    $(this).remove();
                    return false;
                }else{
                    $(this).prev().click();
                    $(this).remove();
                    return false;
                }
            }
        });
    }else{
        var id = $("#packeStorage>div:nth-child("+(gbfbtype+3)+")>table>tbody>tr.active").attr("about");
        var ob = new Object();
        var devType=$(".datamodal .devTypes").val();
        var tbid=$(".datamodal .devTypes").attr("data-tbid");
        ob.devType = parseInt(devType);
        ob.tableId = parseInt(tbid);
        ob.type = 4;
        ob.id = parseInt(id);
        ob.userData = 0;
        var json = JSON.stringify(ob);
        ccc_lib_reqDataByCmd("",USER_DEVICE_SERVICE_DELBYTYPE,json,delPointDetailReturn5);//点击删除分组储存列表
    }
    // }
});
function delPointDetailReturn5(id,info,des){
    loadAlerts(des.desc);
    var gbfbtype=parseInt($(".gbfb>a.active").attr("type"));
    var id = $("#packeStorage>div:nth-child("+(gbfbtype+3)+")>table>tbody>tr.active").attr("about");
    if(des.result==0){
        $("#packeStorage>div:nth-child("+(gbfbtype+3)+")>table>tbody>tr").each(function(){
            if($(this).attr("about")==id){
                if($(this).next().length!=0){
                    $(this).next().click();
                    $(this).remove();
                    return false;
                }else{
                    $(this).prev().click();
                    $(this).remove();
                    return false;
                }
            }
        });
    }
    getPackLines();
};
//点击批量提交分组储存列表
$("#packeStorage>p:nth-child(1)>button:nth-child(3)").click(function(){
    var gbtype=parseInt($(".gbfb>a.active").attr("type"));
    var allNum = $("#packeStorage>div:nth-child("+(gbtype+3)+")>table>tbody>tr.change").length;
    if(allNum<=10 && allNum>0){
        PagingData5(1,allNum);
    }else if(allNum>10){
        PagingData5(1,10);
    }
});
function returnPagingData5(id,info,des){
    console.log(des);
    var gbtype=parseInt($(".gbfb>a.active").attr("type"));
    var length=$("#packeStorage>div:nth-child("+(gbtype+3)+")>table>tbody>tr.change").length;
    var pg = document.getElementById('pg');
    var pgv = document.getElementById('pgv');
    if(des.userData>=length){
        pgv.innerHTML = '进度：100%';
        //pgv.innerHTML = '加载完成';
        loadEquipmentBusiness(4);
        $(".range").hide();
        pg.value=0;
        pgv.innerHTML = '进度：0%';
        loadAlerts(des.desc);
    }else if(des.userData<length){
        $(".range").show();
        pg.value=((des.userData/length)*100).toFixed(1);
        pgv.innerHTML = '进度：' + pg.value + '%';
        PagingData5(des.userData+1,des.userData+10);
    }
    if(des.result!=0){
        loadAlerts(des.desc);
    }
};
//分页传输数据 一次20条
function PagingData5(num1,num2){
    var ob = new Object();
    var devType=$(".datamodal .devTypes").val();
    var devTotalType=$(".datamodal .devTypes").attr("data-devtype");
    var tbid=$(".datamodal .devTypes").attr("data-tbid");
    ob.devType = parseInt(devType);
    ob.tableId = parseInt(tbid);
    ob.type = 4;
    var arr=[];
    var gbtype = parseInt($(".gbfb>a.active").attr("type"));
    $("#packeStorage>div:nth-child("+(gbtype+3)+")>table>tbody>tr.change").each(function(i){
        if((i+1)>=num1 && (i+1)<=num2){
            var obj=new Object();
            obj.logNum=parseInt($(this).children("td:nth-child(2)").html());
            obj.name = $(this).children("td:nth-child(1)").children("input").val();
            var len = $(this).children("td:nth-child(4)").children("span").length;
            obj.subType = (devTotalType==4)?parseInt(gbtype):0;
           
            var title = $(this).children("td:nth-child(3)").children("input").val();
            if(!title){
                title = $("#packeStorage>div:nth-child("+(gbtype+3)+")>table>tbody>tr:nth-child(1)>td:nth-child(3)>input").val();
            }
            obj.titles = title;
            if(len<=0){
                obj.comment = "";
            }else{
                var str="";
                $(this).children("td:nth-child(4)").children("span").each(function(){
                    var seq = $(this).attr("data-seq");
                    var name=$(this).attr("data-name");
                    var num=$(this).attr("data-num");
                    // var id=$(this).attr("about");
                    str+=(seq+"<"+num+"<"+name+">");
                });
                obj.comment = str;
            }
            arr.push(obj);
        }
    });
   
    
    ob.userData = num2;
    ob.data = arr;
    var json = JSON.stringify(ob);
    ccc_lib_reqDataByCmd("",USER_DEVICE_SERVICE_CFGBYTYPE,json,returnPagingData5);//批量提交配置的所有电气图
};
//点击新增状态定制
$("#statusBar>p:nth-child(1)>button:nth-child(1)").click(function(){
    $("#configedYCYX2 .langueage>a:nth-child(1)").click();
    $("#configedYCYX2").show();
    $("#configedYCYX").attr("about",5);
    $("#configedYCYX2 .checkedYCYX").css("height","380px");
    $("#configedYCYX2 .search").val("");
    move("configedYCYX2","configedYCYX2Top");
    loadYXYCconfigedList();
    $("#configedYCYX2 .checkedYCYX>table>tbody>tr").remove();
});
//点击批量提交状态定制列表
$("#statusBar>p:nth-child(1)>button:nth-child(3)").click(function(){
    var allNum = $("#statusBar>div:nth-child(3)>table>tbody>tr.change").length;
    if(allNum<=10 && allNum>0){
        PagingData6(1,allNum);
    }else if(allNum>10){
        PagingData6(1,10);
    }
});
function returnPagingData6(id,info,des){
    console.log(des);
    var length=$("#statusBar>div:nth-child(3)>table>tbody>tr.change").length;
    var pg = document.getElementById('pg');
    var pgv = document.getElementById('pgv');
    if(des.userData>=length){
        pgv.innerHTML = '进度：100%';
        //pgv.innerHTML = '加载完成';
        loadEquipmentBusiness(5);
        $(".range").hide();
        pg.value=0;
        pgv.innerHTML = '进度：0%';
        loadAlerts(des.desc);
    }else if(des.userData<length){
        $(".range").show();
        pg.value=((des.userData/length)*100).toFixed(1);
        pgv.innerHTML = '进度：' + pg.value + '%';
        PagingData6(des.userData+1,des.userData+10);
    }
    if(des.result!=0){
        loadAlerts(des.desc);
    }
};
//分页传输数据 一次20条
function PagingData6(num1,num2){
    var ob = new Object();
    var devType=$(".datamodal .devTypes").val();
    var tbid=$(".datamodal .devTypes").attr("data-tbid");
    ob.devType = parseInt(devType);
    ob.tableId = parseInt(tbid);
    ob.type = 5;
    var arr=[];
    $("#statusBar>div:nth-child(3)>table>tbody>tr.change").each(function(i){
        if((i+1)>=num1 && (i+1)<=num2){
            var obj=new Object();
            obj.pointId=parseInt($(this).attr("type"));
            obj.pointSeq=parseInt($(this).children("td:nth-child(2)").html());
            obj.method=parseInt($(this).children("td:nth-child(3)").find("select").val());
            obj.name = $(this).children("td:nth-child(1)").children("input").val();
            // obj.id=parseInt($(this).attr("about"));
            var len = $(this).children("td:nth-child(4)").children("span").length;
            if(len<=0){
                obj.comment = "";
            }else{
                var str="";
                $(this).children("td:nth-child(4)").children("span").each(function(){
                    var name=$(this).attr("data-name");
                    var num=$(this).attr("data-num");

                    str+=(num+"<"+name+">");
                });
                obj.comment = str;
            }
            arr.push(obj);
        }
    });
    ob.userData = num2;
    ob.data = arr;
    var json = JSON.stringify(ob);
    console.log(json);
    ccc_lib_reqDataByCmd("",USER_DEVICE_SERVICE_CFGBYTYPE,json,returnPagingData6);//批量提交配置的所有状态定制
};
//点击切换状态定制列表
$("#statusBar>div:nth-child(3)>table>tbody").on("click","tr",function(){
    $(this).addClass("active").siblings("tr").removeClass("active");
    Checkedstat=$(this).attr("about");
});
//点击删除状态定制列表
$("#statusBar>p:nth-child(1)>button:nth-child(2)").click(function(){
    var leng=$("#statusBar>div:nth-child(3)>table>tbody>tr.active").length;
    if(leng<=0){
        loadAlerts("请先选择一条记录，然后进行删除操作！");
        return false;
    }
    // var com=confirm("确认删除吗？");
    // if(com){
        if($("#statusBar>div:nth-child(3)>table>tbody>tr.active").hasClass("add")){
            var id = $("#statusBar>div:nth-child(3)>table>tbody>tr.active").attr("about");
            $("#statusBar>div:nth-child(3)>table>tbody>tr").each(function(){
                if($(this).attr("about")==id){
                    if($(this).next().length!=0){
                        $(this).next().click();
                        $(this).remove();
                        return false;
                    }else{
                        $(this).prev().click();
                        $(this).remove();
                        return false;
                    }
                }
            });
        }else{
            var id = $("#statusBar>div:nth-child(3)>table>tbody>tr.active").attr("about");
            var ob = new Object();
            var devType=$(".datamodal .devTypes").val();
            var tbid=$(".datamodal .devTypes").attr("data-tbid");
            ob.devType = parseInt(devType);
            ob.tableId = parseInt(tbid);
            ob.type = 5;
            ob.id = parseInt(id);
            ob.userData = 0;
            var json = JSON.stringify(ob);
            ccc_lib_reqDataByCmd("",USER_DEVICE_SERVICE_DELBYTYPE,json,delPointDetailReturn6);//点击删除状态定制列表
        }

    // }
});
function delPointDetailReturn6(id,info,des){
    loadAlerts(des.desc);
    var id = $("#statusBar>div:nth-child(3)>table>tbody>tr.active").attr("about");
    if(des.result==0){
        $("#statusBar>div:nth-child(3)>table>tbody>tr").each(function(){
            if($(this).attr("about")==id){
                if($(this).next().length!=0){
                    $(this).next().click();
                    $(this).remove();
                    return false;
                }else{
                    $(this).prev().click();
                    $(this).remove();
                    return false;
                }
            }
        });
    }
};
//点击状态定制数据成员增加
$("#statusBar>table:nth-child(2) button").click(function(){
    var leng=$("#statusBar>div:nth-child(3)>table>tbody>tr.active").length;
    if(leng<=0){
        loadAlerts("请先选择一条记录，然后进行数据成员增加！");
        return false;
    }
    $("#creatStatu").show();
    move("creatStatu","creatStatuTop");
});
//点击提交新增状态定制数据成员
$("#creatStatu button").click(function(){
    var num=$("#creatStatu>ul>li:nth-child(1)>input").val();
    var name=$("#creatStatu>ul>li:nth-child(2)>input").val();
    if(byteLength(name)>35){
        loadAlerts("名称最多只能输入35个字符或11个汉字！");
        return false;
    }
    var isRight=true;
    if(name.indexOf("<")!=-1 ||name.indexOf(">")!=-1 ||!name){
        loadAlerts("名称里不能含有'<' 或者 '>',且不能为空！");
        return false;
    }
    if(!num || num<0 || num>99999){
        loadAlerts("数值必须是正整数且不超过五位数，请重新输入！");
        return false;
    }
    $("#statusBar>div:nth-child(3)>table>tbody>tr.active>td:nth-child(4)>span").each(function(){
        var id=$(this).attr("data-num");
        if(num==id){
            loadAlerts("数据成员数值已存在，请重新输入！");
            isRight= false;
            return false;
        }
    });
    if(isRight){
        $("#statusBar>div:nth-child(3)>table>tbody>tr.active>td:nth-child(4)").append('<span data-name="'+name+'" data-num="'+num+'">'+num+'.'+name+'<b></b></span>');
        var newStr="";
        $("#statusBar>div:nth-child(3)>table>tbody>tr.active>td:nth-child(4)>span").each(function(i){
            var seqname=$(this).attr("data-name");
            var seqnum=$(this).attr("data-num");
            newStr+=(seqnum+"<"+seqname+">");
        });
        var old=$("#statusBar>div:nth-child(3)>table>tbody>tr.active>td:nth-child(4)").attr("data-str");
        if(old!=newStr){
            $("#statusBar>div:nth-child(3)>table>tbody>tr.active").addClass("change");
            $("#statusBar>div:nth-child(3)>table>tbody>tr.active>td:last-child").html("修改");
        }
        $("#creatStatu").hide();
        $("#creatStatu input").val("");
    }

});
//删除状态定制数据成员
$("#statusBar>div:nth-child(3)>table>tbody").on("click","td>span>b",function(){
    $(this).parent("span").parent("td").parent("tr").addClass("active").siblings("tr").removeClass("active");
    Checkedstat=$(this).attr("about");

    $(this).parent("span").remove();
    var newStr = $("#statusBar>div:nth-child(3)>table>tbody>tr.active>td:nth-child(4)").html();
    var comment=$("#statusBar>div:nth-child(3)>table>tbody>tr.active>td:nth-child(4)").attr("data-str");
    var oldStr="";
    var arr = comment.split(">");
    for(var k=0;k<arr.length;k++){
        var marr=arr[k].split("<");
        oldStr+="<span>"+(marr[0])+"."+marr[1]+"<b></b></span>";
    }
    if(oldStr!=newStr){
        $("#statusBar>div:nth-child(3)>table>tbody>tr.active").addClass("change");
        $("#statusBar>div:nth-child(3)>table>tbody>tr.active>td:last-child").html("修改");
    }
});
//点击新增遥控遥调执行结果
$("#ykyt>table>thead>tr>th:nth-child(6)>button").click(function(){
    var len=$("#ykyt>div:nth-child(3)>table>tbody>tr.active").length;
    
    if(len==0){
        loadAlerts("请先选中一条记录，然后进行添加执行结果！");
        return false;
    }else if(len==1){
        var contlen=$("#ykyt>div:nth-child(3)>table>tbody>tr.active>td:nth-child(6)>span").length;
        var type=$("#ykyt>div:nth-child(3)>table>tbody>tr.active").attr('data-type');
        if(type==2 && contlen>=1){
            loadAlerts("遥调只允许添加一条执行结果！");
            return false;
        }
        $("#creatResult").show().attr("about",1);
        $("#creatResultTop>span").html("新增执行结果");
        move("creatResult","creatResultTop");
        $("#creatResult input").val("");
    }
});
function checkColor(type){
    var str;
    if(type==1){
        str="蓝色";
    }else if(type==2){
        str="绿色";
    }else if(type==3){
        str="橙色";
    }
    return str;
};
//新增遥控遥调结果保存
$("#creatResult button").click(function(){
    var num = $("#creatResult>ul>li:nth-child(1)>input").val();
    var num2 = $("#creatResult>ul>li:nth-child(2)>input").val();
    var name = $("#creatResult>ul>li:nth-child(3)>input").val();
    var color = $("#creatResult>ul>li:nth-child(4) select").val();
    var colorName = checkColor(color);
    var about=$("#creatResult").attr("about");
    if(num && name){
        // if(num>100){
        //     loadAlerts("数值不能超过100！");
        //     return false;
        // }
        
        var arr2=[];
        $("#ykyt>div:nth-child(3)>table>tbody>tr.active>td:nth-child(6)>span").each(function(i){
            var seqnum=$(this).attr("data-num");
            arr2.push(seqnum);
        });
        console.log(arr2);
        if(arr2.indexOf(num)>=0){
            loadAlerts("数值已存在，请重新输入！");
            return false;
        }
        $("#ykyt>div:nth-child(3)>table>tbody>tr.active>td:nth-child(6)").append('<span data-name="'+name+'" data-color="'+color+'" data-num="'+num+'" data-num2="'+num2+'"><u>期望结果:'+num+',设置值:'+num2+',颜色:'+colorName+',名称:'+name+'</u><b></b></span>');

        var str='';
        $("#ykyt>div:nth-child(3)>table>tbody>tr.active>td:nth-child(6)>span").each(function(i){
            var seqname=$(this).attr("data-name");
            var seqnum=$(this).attr("data-num");
            var seqnum2=$(this).attr("data-num");
            var color=$(this).attr("data-color");
             str+=seqnum+"<"+seqnum2+"<"+seqname+"<"+color+">";
        });
        var newStr=str;
        var old=$("#statusBar>div:nth-child(3)>table>tbody>tr.active>td:nth-child(6)").attr("data-str");
        if(old!=newStr){
            $("#ykyt>div:nth-child(3)>table>tbody>tr.active").addClass("change");
            $("#ykyt>div:nth-child(3)>table>tbody>tr.active>td:last-child").html("修改");
        }
        
        $("#creatResult").hide();
    }else{
        loadAlerts("数值和名称不能为空!");
    }
    CheckResult();
});
function CheckResult(){
    $("#modYKYT>ul>li:nth-child(8)>table>tbody>tr").remove();
    $("#ykyt>div:nth-child(3)>table>tbody>tr.active>td:nth-child(6)>span").each(function(i){
        var name=$(this).attr("data-name");
        var num=$(this).attr("data-num");
        var num2 = $(this).attr("data-num2");
        var color = $(this).attr("data-color");
        $("#modYKYT>ul>li:nth-child(8)>table>tbody").append('<tr><td>'+(i+1)+'</td><td>'+name+'</td><td>'+num+'</td><td>'+num2+'</td><td>'+color+'</td></tr>');
    });
};
//点击新增遥控遥调
$("#ykyt>p:nth-child(1)>button:nth-child(1)").click(function(){
    $("#configedYCYX2 .langueage>a:nth-child(1)").click();
    $("#configedYCYX2").show();
    $("#configedYCYX").attr("about",6);
    $("#configedYCYX2 .checkedYCYX").css("height","375px");
    $("#configedYCYX2 .search").val("");
    move("configedYCYX2","configedYCYX2Top");
    loadYXYCconfigedList();
    $("#configedYCYX2 .checkedYCYX>table>tbody>tr").remove();
});
//点击批量提交遥控遥调列表
$("#ykyt>p:nth-child(1)>button:nth-child(4)").click(function(){
    var allNum = $("#ykyt>div:nth-child(3)>table>tbody>tr.change").length;
    if(allNum<=10 && allNum>0){
        PagingData7(1,allNum);
    }else if(allNum>10){
        PagingData7(1,10);
    }
});
function returnPagingData7(id,info,des){
    console.log(des);
    var length=$("#ykyt>div:nth-child(3)>table>tbody>tr.change").length;
    var pg = document.getElementById('pg');
    var pgv = document.getElementById('pgv');
    if(des.userData>=length){
        pgv.innerHTML = '进度：100%';
        //pgv.innerHTML = '加载完成';
        loadEquipmentBusiness(6);
        $(".range").hide();
        pg.value=0;
        pgv.innerHTML = '进度：0%';
        loadAlerts(des.desc);
    }else if(des.userData<length){
        $(".range").show();
        pg.value=((des.userData/length)*100).toFixed(1);
        pgv.innerHTML = '进度：' + pg.value + '%';
        PagingData7(des.userData+1,des.userData+10);
    }
    if(des.result!=0){
        loadAlerts(des.desc);
    }
};
//分页传输数据 一次20条
function PagingData7(num1,num2){
    var ob = new Object();
    var devType=$(".datamodal .devTypes").val();
    var tbid=$(".datamodal .devTypes").attr("data-tbid");
    ob.devType = parseInt(devType);
    ob.tableId = parseInt(tbid);
    ob.type = 6;
    var arr=[];
    var isRight=true;
    $("#ykyt>div:nth-child(3)>table>tbody>tr.change").each(function(i){
        if((i+1)>=num1 && (i+1)<=num2){
            var obj=new Object();
            obj.number = parseInt($(this).attr("about"));
            obj.pointId = 0;
            obj.pointSeq = parseInt($(this).children("td:nth-child(3)").html());
            obj.type = parseInt($(this).attr('data-type'));
            obj.name = $(this).children("td:nth-child(1)").children("input").val();
            obj.code = parseInt($(this).attr('data-code'));
            obj.regAddr = parseInt($(this).attr('data-regAddr'));
            obj.Area =  parseInt($(this).attr('data-area'));
            obj.refresh = parseInt($(this).attr('data-refresh'));
            obj.delay = parseInt($(this).attr('data-delay'));
            obj.unit = $(this).attr('data-unit');
            obj.notUseName = parseInt($(this).attr('data-show'));
            if(obj.regAddr>=65536){
                loadAlerts("寄存器地址请输入小于65536的值！");
                isRight=false;
                return false;
            }
            // obj.value = parseInt($(this).attr('data-value'));
            // if(obj.value>=65536){
            //     loadAlerts("执行值请输入小于65536的值！");
            //     isRight=false;
            //     return false;
            // }
            obj.rt = parseInt($(this).attr('data-rt'));
            if(obj.rt>9999){
                loadAlerts("变比值必须小于等于9999！");
                isRight=false;
                return false;
            }
            var len = $(this).children("td:nth-child(6)").children("span").length;
            if(len<=0){
                obj.exeResult = "";
            }else{
                
                var str="";
                $(this).children("td:nth-child(6)").children("span").each(function(){
                    var name=$(this).attr("data-name");
                    var num=$(this).attr("data-num");
                    var num2=$(this).attr("data-num2");
                    var color=$(this).attr("data-color");
                    str+=num+"<"+num2+"<"+name+"<"+color+">";
                    
                });
                obj.exeResult = str;
            }
            arr.push(obj);
        }
    });
    ob.userData = num2;
    ob.data = arr;
    console.log(arr);
    var json = JSON.stringify(ob);
    if(isRight){
        ccc_lib_reqDataByCmd("",USER_DEVICE_SERVICE_CFGBYTYPE,json,returnPagingData7);//批量提交配置的所有遥控遥调
    }

};
//点击切换遥控遥调列表
$("#ykyt>div:nth-child(3)>table>tbody").on("click","tr",function(){
    $(this).addClass("active").siblings("tr").removeClass("active");
    Checkedykyt=$(this).attr("about");
    $("#modYKYT").hide();
});
//点击编辑单条遥控遥调
$("#ykyt>p:nth-child(1)>button:nth-child(2)").click(function(){
    var leng=$("#ykyt>div:nth-child(3)>table>tbody>tr.active").length;
    if(leng<=0){
        loadAlerts("请先选择一条记录，然后进行编辑！");
        return false;
    }
    $("#modYKYT").show();
    move("modYKYT","modYKYTTop");
    var seq=$("#ykyt>div:nth-child(3)>table>tbody>tr.active>td:nth-child(3)").html();
    $("#modYKYT>ul>li:nth-child(1)>span").html(seq);
    var name = $("#ykyt>div:nth-child(3)>table>tbody>tr.active>td:nth-child(1)>input").val();
    $("#modYKYT>ul>li:nth-child(2)>input").val(name);
    var type = $("#ykyt>div:nth-child(3)>table>tbody>tr.active").attr("data-type");
    $("#modYKYT>ul>li:nth-child(3)>label:nth-child(2)>select").val(type);
    var code=$("#ykyt>div:nth-child(3)>table>tbody>tr.active").attr("data-code");
    $("#modYKYT>ul>li:nth-child(3)>label:nth-child(4) select").val(code);
    var regAddr=$("#ykyt>div:nth-child(3)>table>tbody>tr.active").attr("data-regAddr");
    $("#modYKYT>ul>li:nth-child(4)>input:nth-child(2)").val(regAddr);
    var area=$("#ykyt>div:nth-child(3)>table>tbody>tr.active").attr("data-area");
    $("#modYKYT>ul>li:nth-child(4)>label:nth-child(4)>select").val(area);
    var rt=$("#ykyt>div:nth-child(3)>table>tbody>tr.active").attr("data-rt");
    $("#modYKYT>ul>li:nth-child(5)>input:nth-child(2)").val(rt);
  
    var refresh=$("#ykyt>div:nth-child(3)>table>tbody>tr.active").attr("data-refresh");
    $("#modYKYT>ul>li:nth-child(5)>label:nth-child(4)>select").val(refresh);
    var delay=$("#ykyt>div:nth-child(3)>table>tbody>tr.active").attr("data-delay");
    $("#modYKYT>ul>li:nth-child(6)>label:nth-child(2)>select").val(delay);
    var show=$("#ykyt>div:nth-child(3)>table>tbody>tr.active").attr("data-show");
    $("#modYKYT>ul>li:nth-child(6)>label:nth-child(4)>select").val(show);
   

    $("#modYKYT>ul>li:nth-child(8)>table>tbody>tr").remove();
    $("#ykyt>div:nth-child(3)>table>tbody>tr.active>td:nth-child(6)>span").each(function(i){
        var num=$(this).attr("data-num");
        var name=$(this).attr("data-name");
        var num2=$(this).attr("data-num2");
        var color=$(this).attr("data-color");
        var colorName=checkColor(color);
        console.log(i);
        $("#modYKYT>ul>li:nth-child(8)>table>tbody").append('<tr><td>'+(i+1)+'</td><td>'+num+'</td><td>'+num2+'</td><td>'+colorName+'</td><td>'+name+'</td></tr>');
    });
});
//点击确认修改单条遥控遥调数据
$("#modYKYT>ul>li:last-child>p>button").click(function(){
    var name = $("#modYKYT>ul>li:nth-child(2)>input").val();
    $("#ykyt>div:nth-child(3)>table>tbody>tr.active>td:nth-child(1)>input").val(name);

    var type=$("#modYKYT>ul>li:nth-child(3)>label:nth-child(2)>select").val();
    $("#ykyt>div:nth-child(3)>table>tbody>tr.active").attr("data-type",type);
    var str;
    if(type==1){
        str="遥控";
    }else if(type==2){
        str="遥调";
    }
    $("#ykyt>div:nth-child(3)>table>tbody>tr.active>td:nth-child(2)").html(str);

    var code=$("#modYKYT>ul>li:nth-child(3)>label:nth-child(4)>select").val();
    $("#ykyt>div:nth-child(3)>table>tbody>tr.active").attr("data-code",code);

    var regAddr=$("#modYKYT>ul>li:nth-child(4)>input:nth-child(2)").val();
    $("#ykyt>div:nth-child(3)>table>tbody>tr.active").attr("data-regAddr",regAddr);

    var area=$("#modYKYT>ul>li:nth-child(4)>label:nth-child(4)>select").val();
    $("#ykyt>div:nth-child(3)>table>tbody>tr.active").attr("data-area",area);
    $("#ykyt>div:nth-child(3)>table>tbody>tr.active>td:nth-child(4)").html("区域"+area);

    var rt=$("#modYKYT>ul>li:nth-child(5)>input:nth-child(2)").val();
    $("#ykyt>div:nth-child(3)>table>tbody>tr.active").attr("data-rt",rt);

    var refresh=$("#modYKYT>ul>li:nth-child(5)>label:nth-child(4)>select").val();
    $("#ykyt>div:nth-child(3)>table>tbody>tr.active").attr("data-refresh",refresh);

    var delay=$("#modYKYT>ul>li:nth-child(6)>label:nth-child(2)>select").val();
    $("#ykyt>div:nth-child(3)>table>tbody>tr.active").attr("data-delay",delay);

    var show=$("#modYKYT>ul>li:nth-child(6)>label:nth-child(4)>select").val();
    $("#ykyt>div:nth-child(3)>table>tbody>tr.active").attr("data-show",show);

    $("#ykyt>div:nth-child(3)>table>tbody>tr.active>td:last-child").html("修改");
    $("#ykyt>div:nth-child(3)>table>tbody>tr.active").addClass("change");
    $("#modYKYT").hide();
});
//点击删除遥控遥调列表
$("#ykyt>p:nth-child(1)>button:nth-child(3)").click(function(){
    var leng=$("#ykyt>div:nth-child(3)>table>tbody>tr.active").length;
    if(leng<=0){
        loadAlerts("请先选择一条记录，然后进行删除操作！");
        return false;
    }
    // var com=confirm("确认删除吗？");
    // if(com){
        if($("#ykyt>div:nth-child(3)>table>tbody>tr.active").hasClass("add")){
            // var id = $("#ykyt>div:nth-child(3)>table>tbody>tr.active").attr("data-add");
            $("#ykyt>div:nth-child(3)>table>tbody>tr").each(function(){
                if($(this).hasClass("active")){
                    if($(this).next().length!=0){
                        $(this).next().click();
                        $(this).remove();
                        return false;
                    }else{
                        $(this).prev().click();
                        $(this).remove();
                        return false;
                    }
                }
            });
            // reloadNum6();
        }else{
            var id = $("#ykyt>div:nth-child(3)>table>tbody>tr.active").attr("about");
            var ob = new Object();
            var devType=$(".datamodal .devTypes").val();
            var tbid=$(".datamodal .devTypes").attr("data-tbid");
            ob.devType = parseInt(devType);
            ob.tableId = parseInt(tbid);
            ob.type = 6;
            ob.id = parseInt(id);
            ob.userData = 0;
            var json = JSON.stringify(ob);
            ccc_lib_reqDataByCmd("",USER_DEVICE_SERVICE_DELBYTYPE,json,delPointDetailReturn7);//点击删除状态定制列表
        }

    // }
});
function delPointDetailReturn7(id,info,des){
    loadAlerts(des.desc);
    var id = $("#ykyt>div:nth-child(3)>table>tbody>tr.active").attr("about");
    var seq = $("#ykyt>div:nth-child(3)>table>tbody>tr.active>td:nth-child(1)").attr("about");
    if(des.result==0){
        $("#ykyt>div:nth-child(3)>table>tbody>tr").each(function(){
            if($(this).attr("about")==id){
                if($(this).next().length!=0){
                    $(this).next().click();
                    $(this).remove();
                    return false;
                }else{
                    $(this).prev().click();
                    $(this).remove();
                    return false;
                }
            }
        });
        // reloadNum6();
        //$("#ykyt>div:nth-child(3)>table>tbody>tr").each(function(i){
        //    if(i>=seq){
        //        $(this).children("td:last-child").html("修改");
        //        $(this).addClass("change");
        //    }
        //});
    }
};
//删除遥控遥调结果
$("#ykyt>div:nth-child(3)>table>tbody").on("click","td:nth-child(6)>span>b",function(){
    $(this).parent("span").parent("td").parent("tr").addClass("active").siblings("tr").removeClass("active");
    // Checkedykyt=$(this).attr("about");
    $(this).parent("span").remove();
    $("#ykyt>div:nth-child(3)>table>tbody>tr.active").addClass("change");
    $("#ykyt>div:nth-child(3)>table>tbody>tr.active>td:last-child").html("修改");
    if($("#modYKYT").css("display")!="none"){
        CheckResult();
    }
});

//点击新建组合分析
$("#groupAlarm>p:nth-child(1)>button:nth-child(1)").click(function(){
    $("#configedYCYX .langueage>a:nth-child(1)").click();
    $("#configedYCYX").show().attr("about",74);
    $("#configedYCYX .checkedYCYX").css("height","265px");
    $("#configedYCYX .search").val("");
    $(".packIn").show();
    $(".packIn>p").hide();
    $(".packIn>p:nth-child(3)").show();
    $(".packIn>p:nth-child(3) select").val(1);
    move("configedYCYX","configedYCYXTop");
    loadYXYCconfigedList();
    $("#configedYCYX .checkedYCYX>table>tbody>tr").remove();
    $("#configedYCYX>ul:nth-child(2)>li:nth-child(2)>img:nth-child(2)").attr("src","imgs/toLeft2.png").removeClass("active");
});

//点击切换新建组合列表
$("#groupAlarm>div:nth-child(3)>table>tbody").on("click","tr",function(){
    $(this).addClass("active").siblings("tr").removeClass("active");
    Checkedalarm=$(this).attr("about");
});
//点击删除新建组合列表
$("#groupAlarm>p:nth-child(1)>button:nth-child(2)").click(function(){
    var leng=$("#groupAlarm>div:nth-child(3)>table>tbody>tr.active").length;
    if(leng<=0){
        loadAlerts("请先选择一条记录，然后进行删除操作！");
        return false;
    }
    // var com=confirm("确认删除吗？");
    // if(com){
        if($("#groupAlarm>div:nth-child(3)>table>tbody>tr.active").hasClass("add")){
            var id = $("#groupAlarm>div:nth-child(3)>table>tbody>tr.active").attr("data-add");
            $("#groupAlarm>div:nth-child(3)>table>tbody>tr").each(function(){
                if($(this).attr("data-add")==id){
                    if($(this).next().length!=0){
                        $(this).next().click();
                        $(this).remove();
                        return false;
                    }else{
                        $(this).prev().click();
                        $(this).remove();
                        return false;
                    }
                }
            });
        }else{
            var id = $("#groupAlarm>div:nth-child(3)>table>tbody>tr.active").attr("about");
            var ob = new Object();
            var devType=$(".datamodal .devTypes").val();
            var tbid=$(".datamodal .devTypes").attr("data-tbid");
            ob.devType = parseInt(devType);
            ob.tableId = parseInt(tbid);
            ob.type = 7;
            ob.id = parseInt(id);
            ob.userData = 0;
            var json = JSON.stringify(ob);
            ccc_lib_reqDataByCmd("",USER_DEVICE_SERVICE_DELBYTYPE,json,delPointDetailReturn8);//点击删除组合分析列表
        }

    // }
});
function delPointDetailReturn8(id,info,des){
    loadAlerts(des.desc);
    var id = $("#groupAlarm>div:nth-child(3)>table>tbody>tr.active").attr("about");
    if(des.result==0){
        $("#groupAlarm>div:nth-child(3)>table>tbody>tr").each(function(){
            if($(this).attr("about")==id){
                if($(this).next().length!=0){
                    $(this).next().click();
                    $(this).remove();
                    return false;
                }else{
                    $(this).prev().click();
                    $(this).remove();
                    return false;
                }
            }
        });
    }
};
//点击批量提交组合分析列表
$("#groupAlarm>p:nth-child(1)>button:nth-child(3)").click(function(){
    var allNum = $("#groupAlarm>div:nth-child(3)>table>tbody>tr.change").length;
    if(allNum<=10 && allNum>0){
        PagingData8(1,allNum);
    }else if(allNum>10){
        PagingData8(1,10);
    }
});
function returnPagingData8(id,info,des){
    console.log(des);
    var length=$("#groupAlarm>div:nth-child(3)>table>tbody>tr.change").length;
    var pg = document.getElementById('pg');
    var pgv = document.getElementById('pgv');
    if(des.userData>=length){
        pgv.innerHTML = '进度：100%';
        //pgv.innerHTML = '加载完成';
        loadEquipmentBusiness(7);
        $(".range").hide();
        pg.value=0;
        pgv.innerHTML = '进度：0%';
        loadAlerts(des.desc);
    }else if(des.userData<length){
        $(".range").show();
        pg.value=((des.userData/length)*100).toFixed(1);
        pgv.innerHTML = '进度：' + pg.value + '%';
        PagingData8(des.userData+1,des.userData+10);
    }
    if(des.result!=0){
        loadAlerts(des.desc);
    }
};
//分页传输数据 一次20条
function PagingData8(num1,num2){
    var ob = new Object();
    var devType=$(".datamodal .devTypes").val();
    var tbid=$(".datamodal .devTypes").attr("data-tbid");
    ob.devType = parseInt(devType);
    ob.tableId = parseInt(tbid);
    ob.type = 7;
    var arr=[];
    $("#groupAlarm>div:nth-child(3)>table>tbody>tr.change").each(function(i){
        if((i+1)>=num1 && (i+1)<=num2){
            var obj=new Object();
            obj.miscType = parseInt($(this).attr("about"));
            var len = $(this).children("td:nth-child(2)").children("span").length;
            if(len<=0){
                obj.comment = "";
            }else{
                var str="";
                $(this).children("td:nth-child(2)").children("span").each(function(){
                    var seq = $(this).attr("data-seq");
                    var name=$(this).attr("data-name");
                    var num=$(this).attr("data-num");
                    // var id=$(this).attr("about");
                    str+=(seq+"<"+num+"<"+name+">");
                });
                obj.comment = str;
            }
            arr.push(obj);
        }
    });
    ob.userData = num2;
    ob.data = arr;
    var json = JSON.stringify(ob);
    ccc_lib_reqDataByCmd("",USER_DEVICE_SERVICE_CFGBYTYPE,json,returnPagingData8);//批量提交配置的所有电气图
};
//点击组合分析数据成员增加
$("#groupAlarm>table:nth-child(2) button").click(function(){
    var len = $("#groupAlarm>div:nth-child(3)>table>tbody>tr.active").length;
    if(len==1){

    }else{
        loadAlerts("请选中一条记录，然后进行数据成员增加操作！");
        return false;
    }

});
//点击预警诊断关联点位
$("#diagnosis>p:nth-child(1)>button:nth-child(1)").click(function(){
    var leng=$("#diagnosis>div:nth-child(3)>table>tbody>tr.active").length;
    if(leng<=0){
        loadAlerts("请先选择一条记录，然后进行关联点位操作！");
        return false;
    }
    $("#configedYCYX").show();
    $("#configedYCYX").attr("about",8);
    $("#configedYCYX .checkedYCYX").css("height","375px");
    $(".packIn").hide();
    $("#configedYCYX .search").val("");
    move("configedYCYX","configedYCYXTop");
    loadYXYCconfigedList();
    $("#configedYCYX .checkedYCYX>table>tbody>tr").remove();
});

//点击切换预警诊断
$("#diagnosis>div:nth-child(3)>table>tbody").on("click","tr",function(){
    $(this).addClass("active").siblings("tr").removeClass("active");
    CheckedDia=$(this).attr("data-visitseq");
});
//点击批量提交预警诊断
$("#diagnosis>p:nth-child(1)>button:nth-child(2)").click(function(){
    var allNum = $("#diagnosis>div:nth-child(3)>table>tbody>tr.change").length;
    if(allNum<=10 && allNum>0){
        PagingData10(1,allNum);
    }else if(allNum>10){
        PagingData10(1,10);
    }
});
function returnPagingData10(id,info,des){
    console.log(des);
    var length = $("#diagnosis>div:nth-child(3)>table>tbody>tr.change").length;
    var pg = document.getElementById('pg');
    var pgv = document.getElementById('pgv');
    if(des.userData>=length){
        pgv.innerHTML = '进度：100%';
        //pgv.innerHTML = '加载完成';
        loadEquipmentBusiness(9);
        $(".range").hide();
        pg.value=0;
        pgv.innerHTML = '进度：0%';
        loadAlerts(des.desc);
    }else if(des.userData<length){
        $(".range").show();
        pg.value=((des.userData/length)*100).toFixed(1);
        pgv.innerHTML = '进度：' + pg.value + '%';
        PagingData10(des.userData+1,des.userData+10);
    }
    if(des.result!=0){
        loadAlerts(des.desc);
    }
};
//分页传输数据 一次20条
function PagingData10(num1,num2){
    var ob = new Object();
    var devType=$(".datamodal .devTypes").val();
    var tbid=$(".datamodal .devTypes").attr("data-tbid");
    ob.devType = parseInt(devType);
    ob.tableId = parseInt(tbid);
    ob.type = 9;
    var arr=[];
    $("#diagnosis>div:nth-child(3)>table>tbody>tr.change").each(function(i){
        if((i+1)>=num1 && (i+1)<=num2){
            var obj=new Object();
            obj.visitseq=parseInt($(this).attr("data-visitseq"));
            obj.devType = parseInt($(this).attr("data-devtype"));
            var len = $(this).children("td:nth-child(4)").children("span").length;
            if(len<=0){
                obj.comment = "";
            }else{
                var str="";
                $(this).children("td:nth-child(4)").children("span").each(function(){
                    var seq = $(this).attr("data-seq");
                    var name=$(this).attr("data-name");
                    var num=$(this).attr("data-num");
                    str+=(seq+"<"+num+"<"+name+">");
                });
                obj.comment = str;
            }
            var isUse=0;
            if($(this).children("td:nth-child(3)").children("a").hasClass("active")){
                isUse=1;
            }
            obj.isUsed = isUse;
            arr.push(obj);
        }
    });
    
    ob.userData = num2;
    ob.data = arr;
    var json = JSON.stringify(ob);
    console.log(json);
    ccc_lib_reqDataByCmd("",USER_DEVICE_SERVICE_CFGBYTYPE,json,returnPagingData10);//批量提交配置的所有设备列表
};
//删除预警诊断数据成员
$("#diagnosis>div:nth-child(3)>table>tbody").on("click","td>span>b",function(){
  
    $(this).parent("span").parent("td").parent("tr").addClass("change active");
    $(this).parent("span").parent("td").parent("tr").children("td:last-child").html("修改");
    $(this).parent("span").remove();
    // $("#diagnosis>div:nth-child(3)>table>tbody>tr.active>td:last-child");
    
});
function byteLength(s) {
    var totalLength = 0;
    var i;
    var charCode;
    //loadAlerts("str len="+s.length);
    for (i = 0; i < s.length; i++) {
        charCode = s.charCodeAt(i);
        if (charCode < 0x007f) {
            totalLength = totalLength + 1;
        } else if ((0x0080 <= charCode) && (charCode <= 0x07ff)) {
            totalLength += 2;
        } else if ((0x0800 <= charCode) && (charCode <= 0xffff)) {
            totalLength += 3;
        }
    }
    return totalLength;
};
//用户分项内容

//初始化加载用户分项
function load_userItem(){
    var ob = new Object();
    ob.type = 3;//1.集团 2.项目 3.站点
    // ob.id = "44030320211124001";
    ob.userData = 0;
    var json = JSON.stringify(ob);
    parent.ccc_lib_reqDataByCmd("",USER_STATION_ITEM_LIST_V26,json,site_showItemList);
};
//显示用户分项列表
function site_showItemList(id,info,des){
    console.log(des);
    $(".itemConfig>div>ul>li").remove();
    if(des.result==0){
        userItem = des;
        for(var i= 0;i<des.data.length;i++){
            $(".itemConfig>div>ul").append('<li><input type="text" name ='+des.data[i].itemId+' value="'+des.data[i].name+'"><button class="mytbnsSolid">删除</button><button class="mytbnsSolid">保存</button></li>');
        }
    }
};
//创建用户分项按钮
$(".itemConfig>div>p>.new").click(function(){
    $("#creatItem").show();
    var idArry=[];
    $(".itemConfig>div>ul>li>input").each(function(){
        idArry.push($(this).attr("name"));
    });
    var max = Math.max(...idArry);
    if(max>0){
        max++;
    }else{
        max=1;
    }
    $("#creatItem .creatItem>li:nth-child(1)>span").html(max);
    $("#creatItem .creatItem>li:nth-child(2)>input").val("");
});
$("#creatItem .mytbnsSolid").click(function(){
    var id=$("#creatItem .creatItem>li:nth-child(1)>span").html();
    var name=$("#creatItem .creatItem>li:nth-child(2)>input").val();
    var desLength=byteLength(name);
    if(!name){
        loadAlerts("用户分项名称不能为空！");
        return false;
    }
    if(desLength>60){
        loadAlerts("用户分项名称最多60个字符或20个汉字！");
        return false;
    }
    var ob = new Object();
    ob.itemId = parseInt(id);
    ob.name = name;
    // ob.groupId = "44030320211124001";
    ob.userData = 0;
    var json = JSON.stringify(ob);
    console.log(json);
    parent.ccc_lib_reqDataByCmd("",STATION_ITEM_ADDBYID_V26,json,modifyUserItem);
});
//修改创建删除用户分项
function modifyUserItem(id,info,des){
    loadAlerts(des.desc);
    $("#creatItem").hide();
    load_userItem();
};
//删除用户分项按钮
$(".itemConfig>div>ul").on("click","li>button:nth-child(2)",function(){
    // var r=confirm("分项是当前配电房所在'总项目'下的所有站点共用，删除可能会影响其他站点已配置的数据分项。请确认是否删除？");
    var itemid=$(this).siblings("input").attr("name");
    // if(r){
        var ob = new Object();
        ob.itemId = parseInt(itemid);
        // ob.groupId = "44030320211124001";
        ob.userData = 0;
        var json = JSON.stringify(ob);
        parent.ccc_lib_reqDataByCmd("",STATION_ITEM_DELBYID_V26,json,modifyUserItem);
        $(this).parent("li").attr("about","del");
    // }else{
    //     load_userItem();
    // }

});
//修改用户分项按钮
$(".itemConfig>div>ul").on("click","li>button:nth-child(3)",function(){
    // var r=confirm("确认修改吗？");
    var itemid=$(this).siblings("input").attr("name");
    var itemname=$(this).siblings("input").val();
    // if(r){
        var ob = new Object();
        ob.itemId = parseInt(itemid);
        ob.name = itemname;
        // ob.groupId = "44030320211124001";
        ob.userData = 0;
        var json = JSON.stringify(ob);
        parent.ccc_lib_reqDataByCmd("",STATION_ITEM_MODBYID_V26,json,modifyUserItem);
    // }
});
//峰平谷能耗配置
//日时间表关闭按钮
$("#daytimeList>p>span").click(function(){
    $("#daytimeList").hide();
});
var bst=0;
//年时间表-增加行
$(".FPGConfig>div>p:nth-child(2)").on("click","img",function(){
    $("#minehira-table>tbody>tr>td").each(function(i){
        bst=$("#minehira-table>tbody>tr>td")[0].className;
        if(bst<$("#minehira-table>tbody>tr>td")[i].className){
            bst=$("#minehira-table>tbody>tr>td")[i].className;
        }
    });
    bst++;
    $("#minehira-table>tbody").append('<tr class="new"><td><input autocomplete="off" type="text" placeholder="请输入月"/></td><td><input autocomplete="off" type="text" placeholder="请输入日"/></td><td class='+bst+' about="0">未配置</td><td class='+(bst+1)+' about="0">未配置</td><td class='+(bst+2)+' about="0">未配置</td><td class='+(bst+3)+' about="0">未配置</td><td class='+(bst+4)+' about="0">未配置</td><td class='+(bst+5)+' about="0">未配置</td><td class='+(bst+6)+' about="0">未配置</td><td class='+(bst+7)+' about="0">未配置</td><td><button class="mytbnsSolid">删除</button><button class="mytbnsSolid" alt="1">保存</button></td></tr>');
});
//年时间表-删除行
var del_yearrow;
$("#minehira-table>tbody").on("click","tr>td>button:first-child",function(){
    // var r=confirm("确认删除该行吗？");
    if($(this).parents("tr").hasClass("new")){
        $(this).parents("tr").remove();
    }else{
        var ob = new Object();
        // ob.stationId = "4403032021112400201";//1.集团 2.项目 3.站点
        ob.id = 3;
        ob.endMonth = parseInt($(this).parent("td").parent("tr").children("td:first-child").html());// (int)结束月,
        ob.endDay = parseInt($(this).parent("td").parent("tr").children("td:nth-child(2)").html());// (int)结束日;
        ob.userData = 0;
        var json = JSON.stringify(ob);
        parent.ccc_lib_reqDataByCmd("",STATION_TIME_YEAR_DELBYID_V26,json,yeartime_del_wait);
        del_yearrow=$(this);
    }
    // if(r){
      
    // }
});
function yeartime_del_wait(id,info,des){
    loadAlerts(des.desc);
    if(des.result==0){
        del_yearrow.parent("td").parent("tr").remove();
    }
};
//年时间表增加、修改
$("#minehira-table>tbody").on("click","tr>td>button:last-child",function(){
    if($(this).attr("alt")=="2"){
        if($(this).hasClass("isNotUse")){
            return false;
        }
        // var ret=confirm("确认修改吗？");
        // if(ret){
            var name=$(".FPGConfig>div>p:nth-child(2)>b").html();
            var ob = new Object();
            ob.name = name;
            // ob.stationId = "4403032021112400201";
            ob.id = 3;
            ob.type = 1;
            ob.endMonth = parseInt($(this).parent("td").parent("tr").children("td:first-child").html());// (int)结束月,
            ob.endDay = parseInt($(this).parent("td").parent("tr").children("td:nth-child(2)").html());// (int)结束日，
            if(isNaN(ob.endMonth)||ob.endMonth<1||ob.endMonth>12){
                loadAlerts("月份必须为1-12之内的数字！");
                return false;
            }
            if(isNaN(ob.endDay)||ob.endDay<1||ob.endDay>31){
                loadAlerts("日期必须为1-31之内的数字！");
                return false;
            }
            ob.data = new Array(8);
            var r3=$(this).parent("td").parent("tr").children("td:nth-child(3)").attr("about");
            var r4=$(this).parent("td").parent("tr").children("td:nth-child(4)").attr("about");
            var r5=$(this).parent("td").parent("tr").children("td:nth-child(5)").attr("about");
            var r6=$(this).parent("td").parent("tr").children("td:nth-child(6)").attr("about");
            var r7=$(this).parent("td").parent("tr").children("td:nth-child(7)").attr("about");
            var r8=$(this).parent("td").parent("tr").children("td:nth-child(8)").attr("about");
            var r9=$(this).parent("td").parent("tr").children("td:nth-child(9)").attr("about");
            var r10=$(this).parent("td").parent("tr").children("td:nth-child(10)").attr("about");
            ob.data[0] = parseInt(r3);
            ob.data[1] = parseInt(r4);
            ob.data[2] = parseInt(r5);
            ob.data[3] = parseInt(r6);
            ob.data[4] = parseInt(r7);
            ob.data[5] = parseInt(r8);
            ob.data[6] = parseInt(r9);
            ob.data[7] = parseInt(r10);
            ob.userData = 0;
            console.log(ob.data);
            var json = JSON.stringify(ob);
            parent.ccc_lib_reqDataByCmd("",STATION_TIME_YEAR_MODBYID_V26,json,daytime_add_wait);
            $(this).attr("alt","2");
            $(this).parent("td").parent("tr").children("td:first-child").html(ob.endMonth);
            $(this).parent("td").parent("tr").children("td:nth-child(2)").html(ob.endDay);
        // }
    }else if($(this).attr("alt")=="1"){
        // var r=confirm("确认创建吗？");
        // if(r){
            var name=$(".FPGConfig>div>p:nth-child(2)>b").html();
            var ob = new Object();
            ob.name = name;
            // ob.stationId = "4403032021112400201";
            ob.id = 3;
            ob.type = 1;
            ob.endMonth = parseInt($(this).parent("td").parent("tr").children("td:first-child").children("input").val());// (int)结束月;
            ob.endDay = parseInt($(this).parent("td").parent("tr").children("td:nth-child(2)").children("input").val());
            if(isNaN(ob.endMonth)||ob.endMonth<1||ob.endMonth>12){
                loadAlerts("月份必须为1-12之内的数字！");
                return false;
            }
            if(isNaN(ob.endDay)||ob.endDay<1||ob.endDay>31){
                loadAlerts("日期必须为1-31之内的数字！");
                return false;
            }
            ob.data = new Array(8);
            var r3=$(this).parent("td").parent("tr").children("td:nth-child(3)").attr("about");
            var r4=$(this).parent("td").parent("tr").children("td:nth-child(4)").attr("about");
            var r5=$(this).parent("td").parent("tr").children("td:nth-child(5)").attr("about");
            var r6=$(this).parent("td").parent("tr").children("td:nth-child(6)").attr("about");
            var r7=$(this).parent("td").parent("tr").children("td:nth-child(7)").attr("about");
            var r8=$(this).parent("td").parent("tr").children("td:nth-child(8)").attr("about");
            var r9=$(this).parent("td").parent("tr").children("td:nth-child(9)").attr("about");
            var r10=$(this).parent("td").parent("tr").children("td:nth-child(10)").attr("about");

            ob.data[0] = parseInt(r3);
            ob.data[1] = parseInt(r4);
            ob.data[2] = parseInt(r5);
            ob.data[3] = parseInt(r6);
            ob.data[4] = parseInt(r7);
            ob.data[5] = parseInt(r8);
            ob.data[6] = parseInt(r9);
            ob.data[7] = parseInt(r10);
            ob.userData = 0;
            var json = JSON.stringify(ob);
            parent.ccc_lib_reqDataByCmd("",STATION_TIME_YEAR_ADDBYID_V26,json,daytime_add_wait);
            $(this).attr("alt","2");
            $(this).parent("td").parent("tr").children("td:first-child").html(ob.endMonth);
            $(this).parent("td").parent("tr").children("td:nth-child(2)").html(ob.endDay);
        // }
    }
});

//日时间表增加按钮
$(".FPGConfig>div>p:nth-child(4)>img:nth-child(3)").click(function(){
    $("#electrovalence").show();
});
var del_item;
//日时间表删除
$(".FPGConfig>div>p:nth-child(4)>img:nth-child(4)").click(function(){
    if($(".FPGConfig>div>div:nth-child(5)>input:checked").length==0){
        loadAlerts("请选择需要删除的项！");
    }if($(".FPGConfig>div>div:nth-child(5)>input:checked").length>1){
        loadAlerts("每次只能有一个项被选中！");
    }else if($(".FPGConfig>div>div:nth-child(5)>input:checked").length==1){
        // var r=confirm("确认删除该时间表吗？");
        // if(r){
            $(".FPGConfig>div>div:nth-child(5)>input:checked").each(function(){
                var tableId=$(this).next("span").attr("about");
                var ob = new Object();
                // ob.groupId = "4403032021112400201";
                ob.id = parseInt(tableId);//
                ob.userData = 0;//自定义类型
                var json = JSON.stringify(ob);
                console.log(json);
                del_item=$(this);
                parent.ccc_lib_reqDataByCmd("",STATION_TIME_DAY_DELBYID_V26,json,daytime_del_wait);//
            });
        // }
    }
});
function reload(){
    //console.log(tableId);
    $("#minehira-table>tbody>tr>td").each(function(){
        if(tableId==$(this).attr("about")){
            $(this).html("0");
        }
    });
};
function daytime_del_wait(id,info,des){
    loadAlerts(des.desc);
    if(des.result==0){
        del_item.next("span").remove();
        del_item.remove();
        load_yeartimelist();
        daytimelist();
        reload();
        checkNum();
    }else{
        daytimelist();
    }
};
function checkNum(){
    $("#minehira-table>tbody>tr>td:nth-child(n+3):not(:last-child)").each(function(){
        if($(this).html()== 0 ||$(this).html()=="undefined"){
            $(this).html("未配置");
        }
    });
};
var selTableId;
var DayTimeName;
//日时间表修改
$(".FPGConfig>div>div:nth-child(5)").on("click","span",function(){
    $("#change_ele").show();
    for(var i=0;i<DayTimeInfo.data.length;i++){
        if($(this).attr("about")==DayTimeInfo.data[i].id){
            $("#change_ele>p:first-child>input").val(DayTimeInfo.data[i].name);
            for(var k=0;k<DayTimeInfo.data[i].section.length;k++){
                $("#change_ele>ul>li:nth-child("+(k+1)+")>select:nth-child(2)").val(DayTimeInfo.data[i].section[k].secType);
                var type=0;
                var realtime=DayTimeInfo.data[i].section[k].min-(k*60);
                if(realtime==59){
                    type=0;
                }
                if(realtime==45){
                    type=1;
                }
                if(realtime==30){
                    type=2;
                }
                if(realtime==15){
                    type=3;
                }
                if(realtime==0){
                    type=4;
                }
                $("#change_ele>ul>li:nth-child("+(k+1)+")>select:nth-child(1)").val(type);
            }
        }
    }
    selTableId=$(this).attr("about");
    DayTimeName=$("#change_ele>p:first-child>input").val();
});
//日时间表关闭提交
$("#change_ele>p:first-child>span").click(function(){
    $("#change_ele").hide();
});
//日时间表修改提交按钮
$("#change_ele>p:last-child>button").click(function(){
    // var r=confirm("确认修改吗？");
    // if(r){
        var name=$("#change_ele>p:first-child>input").val();
        if(name==""){
            loadAlerts("日时间表名不能为空！")
        }else{
            var ob = new Object();
            ob.name = name;
            // ob.groupId = "4403032021112400201";
            ob.id = parseInt(selTableId);
            ob.type = 1;
            ob.data = new Array(24);
            for(var nAdd = 0;nAdd < 24 ;++nAdd)
            {
                var time=0;
                //提取时间
                var value=$("#change_ele>ul>li:nth-child("+(nAdd+1)+")>select:nth-child(1)").val();
                if(value=="0"){
                    time=59;
                }
                if(value=="1"){
                    time=45;
                }
                if(value=="2"){
                    time=30;
                }
                if(value=="3"){
                    time=15;
                }
                if(value=="4"){
                    time=0;
                }
                ob.data[nAdd] = new Object();
                ob.data[nAdd].min = (nAdd*60)+parseInt(time);//(int)结束时间
                ob.data[nAdd].secType =  parseInt($("#change_ele>ul>li:nth-child("+(nAdd+1)+")>select:nth-child(2)").val());// (int)峰平谷类型
            }
            ob.userData = 0;
            var json = JSON.stringify(ob);
            parent.ccc_lib_reqDataByCmd("",STATION_TIME_DAY_MODBYID_V26,json,daytime_modify_wait);

        }
    // }
    daytimelist();
});
function daytime_modify_wait(id,info,des){
    loadAlerts(des.desc);
    if(des.result==0){
        daytimelist();
        var name=$("#change_ele>p:first-child>input").val();
        $("#change_ele").hide();
        $("#minehira>table>tbody>tr>td").each(function(){
            if(selTableId==$(this).attr("about")){
                $(this).html(name);
            }
        });
    }
    else{
        $("#change_ele").hide();
        //    daytimelist();
    }
};
//日时间表配置关闭按钮
$("#electrovalence>p:first-child>span").click(function(){
    $("#electrovalence").hide();
});
$("#creat_runtime>p:first-child>span").click(function(){
    $("#creat_runtime").hide();
});
var tableId=0;
//日时间表增加配置提交按钮
$("#electrovalence>p:last-child>button").click(function(){
    // var r=confirm("确认提交吗？");
    tableId++;
    // if(r){
        var name=$("#electrovalence>p:first-child>input").val();
        if(name==""){
            loadAlerts("日时间表名不能为空！")
        }else{
            var ob = new Object();
            ob.name = name;
            // ob.groupId = "4403032021112400201";
            ob.id = parseInt(tableId);
            ob.type = 1;
            ob.data = new Array(24);
            for(var nAdd = 0;nAdd < 24 ;++nAdd)
            {
                var time=0;
                //提取时间
                var value=$("#electrovalence>ul>li:nth-child("+(nAdd+1)+")>select:nth-child(1)").val();
                if(value=="0"){
                    time=59;
                }
                if(value=="1"){
                    time=45;
                }
                if(value=="2"){
                    time=30;
                }
                if(value=="3"){
                    time=15;
                }
                if(value=="4"){
                    time=0;
                }
                ob.data[nAdd] = new Object();
                ob.data[nAdd].min = (nAdd*60)+parseInt(time);//(int)结束时间
                ob.data[nAdd].secType =  parseInt($("#electrovalence>ul>li:nth-child("+(nAdd+1)+")>select:nth-child(2)").val());// (int)峰平谷类型
            }
            ob.userData = 0;
            var json = JSON.stringify(ob);
            console.log(json);
            parent.ccc_lib_reqDataByCmd("",STATION_TIME_DAY_ADDBYID_V26,json,daytime_add_wait);
        }
    // }
    daytimelist();
});
function daytime_add_wait(id,info,des){
    loadAlerts(des.desc);
    load_yeartimelist();
    daytimelist();
    if(des.result==0){
        $("#minehira>div:nth-child(8)").append('<input type="checkbox"> <span about='+tableId+'>'+name+'</span>');
        $("#electrovalence").hide();
        $("#electrovalence>p:first-child>input").val("");
        $("#electrovalence>ul>li select").val("1");
    }else{
        $("#electrovalence").hide();
        $("#electrovalence>p:first-child>input").val("");
        $("#electrovalence>ul>li select").val("1");
    }
};
//工作日或节假日鼠标移入
$("#minehira>table>tbody").on("mouseover","tr>td:nth-child(n+3):not(:last-child)",function(){
    $(this).css("background","deepskyblue");
    $(this).css("color","white");
    $(this).css("cursor","pointer");
});
var selename="";//选中的日时间项
//工作日或节假日鼠标移出
$("#minehira>table>tbody").on("mouseout","tr>td:nth-child(n+3)",function(){
    $(this).css("background","none");
    $(this).css("color","white");
});

//工作日或节假日鼠标点击
$("#minehira-table").on("click","tr>td:nth-child(n+3):not(:last-child)",function(){
    selename=this.className;
    $("#daytimeList>ul>li").remove();
    $(this).parent("tr").attr("about",selename);
    var ram=$(".FPGConfig>div>div:nth-child(5)>span").length;
    for(var i=1;i<ram+1;i++){
        var num=$(".FPGConfig>div>div:nth-child(5)>span:nth-child("+(2*i)+")").attr("about");
        var content=$(".FPGConfig>div>div:nth-child(5)>span:nth-child("+(2*i)+")").html();
        $("#daytimeList>ul").append('<li><button about='+num+'>'+content+'</button></li>');
    }
    $(this).attr("about",num);
    $("#daytimeList").show();
    //console.log(this.className);
});
//工作日或节假日鼠标点击后替换内容
$("#daytimeList>ul").on("click","li>button",function(){
    var content=$(this).html();
    var abt=$(this).attr("about");
    $("#minehira-table>tbody>tr[about="+selename+"]>td[class="+selename+"]").html(content).attr("about",abt).css("color","red");
    $("#minehira-table>tbody>tr[about="+selename+"]>td:last-child>button:nth-child(2)").removeClass("isNotUse");
    $("#daytimeList").hide();
});
//加载年时间表
function load_yeartimelist(){
    var ob = new Object();
    // ob.stationId = "4403032021112400201";
    ob.type = 1;
    ob.userData = 0;
    var json = JSON.stringify(ob);
    console.log(json);
    parent.ccc_lib_reqDataByCmd("",USER_STATION_TIME_YEAR_V26,json,site_ShowYearTime);//
};
//显示年时间表
function site_ShowYearTime(id,info,des){
    console.log(des);
    $("#minehira-table>tbody>tr").remove();
    var ttt=0;
    if(des.result == 0 && des.data.length!= 0 ){
        for(var i=0;i<des.data.length;i++){
            var r3=des.data[i].week[0];
            var r4=des.data[i].week[1];
            var r5=des.data[i].week[2];
            var r6=des.data[i].week[3];
            var r7=des.data[i].week[4];
            var r8=des.data[i].week[5];
            var r9=des.data[i].week[6];
            var r10=des.data[i].week[7];
            var t3,t4,t5,t6,t7,t8,t9,t10;
            ttt+=8;
            //console.log(DayTimeInfo);
            for(var k=0;k<DayTimeInfo.data.length;k++){
                if(r3==DayTimeInfo.data[k].id){
                    t3=DayTimeInfo.data[k].name;
                }else if(r3==0){t3="未配置"}
                if(r4==DayTimeInfo.data[k].id){
                    t4=DayTimeInfo.data[k].name;
                }else if(r4==0){t4="未配置"}
                if(r5==DayTimeInfo.data[k].id){
                    t5=DayTimeInfo.data[k].name;
                }else if(r5==0){t5="未配置"}
                if(r6==DayTimeInfo.data[k].id){
                    t6=DayTimeInfo.data[k].name;
                }else if(r6==0){t6="未配置"}
                if(r7==DayTimeInfo.data[k].id){
                    t7=DayTimeInfo.data[k].name;
                }else if(r7==0){t7="未配置"}
                if(r8==DayTimeInfo.data[k].id){
                    t8=DayTimeInfo.data[k].name;
                }else if(r8==0){t8="未配置"}
                if(r9==DayTimeInfo.data[k].id){
                    t9=DayTimeInfo.data[k].name;
                }else if(r9==0){t9="未配置"}
                if(r10==DayTimeInfo.data[k].id){
                    t10=DayTimeInfo.data[k].name;
                }else if(r10==0){t10="未配置"}
            }
            //console.log(r3);
            $("#minehira-table>tbody").append('<tr about="'+des.data[i].name+'"><td >'+des.data[i].endMonth+'</td><td >'+des.data[i].endDay+'</td><td class='+ttt+' about='+r3+'>'+t3+'</td><td class='+(ttt+1)+' about='+r4+'>'+t4+'</td><td class='+(ttt+2)+' about='+r5+'>'+t5+'</td><td class='+(ttt+3)+' about='+r6+'>'+t6+'</td><td class='+(ttt+4)+' about='+r7+'>'+t7+'</td><td class='+(ttt+5)+' about='+r8+'>'+t8+'</td><td class='+(ttt+6)+' about='+r9+'>'+t9+'</td><td class='+(ttt+7)+' about='+r10+'>'+t10+'</td><td><button class="mytbnsSolid">删除</button><button class="mytbnsSolid isNotUse" alt="2">保存</button></td></tr>');
            checkNum();
        }
    }
}
//加载日时间表
function daytimelist(){
    var ob = new Object();
    ob.type = 0;//0:所有；1:峰平谷；2:运行时间
    // ob.groupId = "4403032021112400201";
    ob.userData = 0;
    var json = JSON.stringify(ob);
    parent.ccc_lib_reqDataByCmd("",USER_STATION_TIME_DAY_V26,json,site_ShowDayTime);
};
//显示日时间表
var tb=0;
var DayTimeInfo;
function site_ShowDayTime(id,info,des){
    console.log(des);
    $(".FPGConfig>div>div:nth-child(5)").html("");
    if(des.result==0){
        DayTimeInfo=des;
        for(var i=0;i<des.data.length;i++){
            $(".FPGConfig>div>div:nth-child(5)").prepend('<input type="checkbox"><span about='+des.data[i].id+'>'+des.data[i].name+'</span>');
            $("#minehira-table>tbody td").each(function(){
                if($(this).attr("about")==des.data[i].id){
                    $(this).html(des.data[i].name)
                }
            });
            tb=des.data[0].id;
            if(tb< des.data[i].id){
                tb=des.data[i].id;
            }
            tableId=tb;
        }
    }

};
//设备归属内容
//获取柜子列表
function loadBoxList(type){
    var ob = new Object();
    // ob.stationId = "4403032021112400201";
    ob.gradeType = 0;
    ob.userData = parseInt(type);
    var json = JSON.stringify(ob);
    parent.ccc_lib_reqDataByCmd("",USER_STATION_GRADE_LIST_V25,json,reBoxList);
};
function checkBoxType(id){
    var CabType="";
    switch(id){
        case 0:CabType="未配置";break;
        case 1:CabType="交流系统";break;
        case 2:CabType="直流系统";break;
        case 3:CabType="通信电源";break;
        case 4:CabType="逆变系统";break;
        case 5:CabType="事故照明";break;
        default:break;
    }
    return CabType;
};
//点击新建归属按钮
$(".devConfig .boxes>p>button:nth-child(1)").click(function(){
    $("#creatBox").show();
    $("#creatBox>ul>li:nth-child(4) select>option").remove();
    $("#creatBox>ul>li:nth-child(5) select>option").remove();
    loadFacts(2);
    move("creatBox","creatBoxTop");

});

$("#creatBoxTop>b").click(function(){
    $("#creatBox input").val("");
    $("#creatBox select").val(0);
    $("#creatBox textarea").val("");
});
//新建归属切换厂家
$("#creatBox>ul>li:nth-child(4) select").change(function(){
    $("#creatBox>ul>li:nth-child(5) select>option").remove();
    var val=$(this).val();
    loadTypes(val,2);
});
//新建归属提交
$("#creatBox button").click(function(){
    var boxId=$("#creatBox>ul>li:nth-child(2)>input").val();
    var name=$("#creatBox>ul>li:nth-child(1)>input").val();
    var type=$("#creatBox>ul>li:nth-child(3) select").val();
    var fac=$("#creatBox>ul>li:nth-child(4) select").val();
    var model=$("#creatBox>ul>li:nth-child(5) select").val();
    var seq=$("#creatBox>ul>li:nth-child(6)>input").val();
    //var comment=$("#creatBox>ul>li:nth-child(6)>textarea").val();
    if(!fac){
        fac="";
    }
    if(!model){
        model="";
    }
    if(boxId>100 ||boxId<=0){
        loadAlerts("柜子编号必须为1-100之间！");
        return false;
    }
    if(byteLength(name)>64){
        loadAlerts("名称最多只能输入64个字符或21个汉字！");
        return false;
    }
    //if(byteLength(comment)>256){
    //    loadAlerts("描述最多只能输入256个字符或85个汉字！");
    //    return false;
    //}
    var date=new Date();
    var year=date.getFullYear();
    var month=date.getMonth()+1;
    if(month<10){
        month="0"+month;
    }
    if(boxId<10){
        boxId="00"+boxId;
    }else if(boxId<100 && boxId>=10){
        boxId="0"+boxId;
    }
    var ob = new Object();
    var boxid="e"+year+""+month+"g"+boxId;
    ob.boxId = boxid;
    ob.productId = fac;
    ob.model = model;
    ob.type = parseInt(type);
    ob.name = name;
    ob.boxSeq = seq;
    ob.userData = 0;
    console.log(ob);
    var json = JSON.stringify(ob);
    ccc_lib_reqDataByCmd(boxid,STATION_GRADE_CREATE_V25,json,creatBoxReturn);//新建归属
});
function creatBoxReturn(id,info,des){
    loadAlerts(des.desc);
  
    if(des.userData==1101 || des.result==0){
        CheckedBox = info;
        $("#creatBox").hide();
        $("#creatBox input").val("");
        $("#creatBox select").val(0);
        $("#creatBox textarea").val("");
    }
    loadBoxList(2);
};
//点击编辑归属按钮
$(".devConfig .boxes>p>button:nth-child(2)").click(function(){
    var len= $(".devConfig .boxList>li.active").length;
    if(len==0){
        loadAlerts("请先选中一个归属然后进行编辑！");
        return false;
    }
    $("#modifyBox>ul>li:nth-child(4) select>option").remove();
    $("#modifyBox>ul>li:nth-child(5) select>option").remove();
    loadFacts(2);
    $("#modifyBox").show();
    move("modifyBox","modifyBoxTop");

    var product=$(".devConfig .boxList>li.active").attr("data-product");
  
    $("#modifyBox>ul>li:nth-child(4) select").val(product).attr("data-val",product);
    loadTypes(product,2);
   
});
var CheckedBox;

$("#modifyBox button").click(function(){
    $("#modifyBox").hide();
});
//编辑归属
$("#modifyBox input").blur(function(){
    var boxId=$("#modifyBox>ul>li:nth-child(2)>span").html();
    var attrid=parseInt($(this).attr("data-num"));
    var name=$(this).val();
    //var des=$("#modifyBox>ul>li:nth-child(6)>textarea").val();
    if(byteLength(name)>64){
        loadAlerts("名称最多只能输入64个字符或21个汉字！");
        return false;
    }
    var old=$(this).attr("data-val");
    if(old!=name){
        var ob = new Object();
        ob.class = 1;
        ob.objId=boxId;
        ob.subId = 0;
        ob.attrId = attrid;
        ob.content = name;
        ob.userData = 0;
        console.log(ob);
        var json = JSON.stringify(ob);
        ccc_lib_reqDataByCmd("",USER_OBJECT_ATTR_MODBYID,json,modifyBoxReturn);//修改归属信息
    }
});
//编辑归属
$("#modifyBox select").change(function(){
    var boxId=$("#modifyBox>ul>li:nth-child(2)>span").html();
    var attrid=parseInt($(this).attr("data-num"));
    var type=$(this).val();

        var ob = new Object();
        ob.class = 1;
        ob.objId = boxId;
        ob.subId = 0;
        ob.attrId = attrid;
        ob.content = type;
        ob.userData = parseInt(attrid);
        var json = JSON.stringify(ob);
    console.log(ob);
        ccc_lib_reqDataByCmd("",USER_OBJECT_ATTR_MODBYID,json,modifyBoxReturn);//修改归属信息

});
function modifyBoxReturn(id,info,des){
    loadAlerts(des.desc);
    loadBoxList(2);
    if(des.userData==2){
        var value=$("#modifyBox>ul>li:nth-child(4) select").val();
        $("#modifyBox>ul>li:nth-child(4) select").attr("data-val",value);
        loadTypes(value,2);
        //$("#smartDevice>p:nth-child(1)>button:nth-child(6)").click();
    }
};
//点击删除归属按钮
$(".devConfig .boxes>p>button:nth-child(3)").click(function(){
    var len= $(".boxList>li.active").length;
    if(len==0){
        loadAlerts("请先选中一个归属然后进行删除！");
        return false;
    }
    // var con=confirm("确认删除该归属吗？");
    // if(con){
        var ob = new Object();
        ob.boxId = CheckedBox;
        ob.userData = 0;
        var json = JSON.stringify(ob);
        ccc_lib_reqDataByCmd("",STATION_GRADE_DELETE_V25,json,deleteBoxReturn);//删除归属
// 
    // }
});
function deleteBoxReturn(id,info,des){
    loadAlerts(des.desc);
    if(des.result==0){
        $(".boxList>li").each(function(){
            if($(this).attr("data-id")==CheckedBox){
                if($(this).next().length!=0){
                    $(this).next().click();
                    $(this).remove();
                    return false;
                }else{
                    $(this).prev().click();
                    $(this).remove();
                    return false;
                }
            }
        });
    }else{
        loadBoxList(2);
    }
};
//点击关联设备
$(".devConfig .addDev").click(function(){
    $("#addDev").show().attr("about",1);
    loadAboutDev("");
    move("addDev","addDevTop");
});
//点击取消关联
$(".devConfig .delDev").click(function(){
    var arr=[];
    var len=$(".devConfig .devMods>tbody>tr.active").length;
    if(len<=0){
        return false;
    }
    $(".devConfig .devMods>tbody>tr.active").each(function(){
        arr.push(parseInt($(this).attr("about")));
    });
    var ob = new Object();
    ob.boxId = "";
    ob.data = arr;
    ob.userData = 0;
    var json = JSON.stringify(ob);
    console.log(ob);
    parent.ccc_lib_reqDataByCmd("",ACDC_GRADE_RELATE_ELEC,json,reBoxAboutMod);
});
$("#addDev>p>span").click(function(){
    $("#addDev").hide();
});
function loadAboutDev(boxId){
    var ob = new Object();
    ob.boxNo = boxId;
    ob.userData = 0;
    var json = JSON.stringify(ob);
    console.log(ob);
    parent.ccc_lib_reqDataByCmd("",USER_ELECTRIC_LIST_GETBYID,json,reAboutModList);

};
function reAboutModList(id,info,des){
    console.log(des);
    $("#addDev .ycyxs>li").remove();
    var htm="";
    for(var i=0;i<des.data.length;i++){
        htm+='<li about="'+des.data[i].recordId+'"><p><span title="'+des.data[i].name+'">'+des.data[i].name+'</span></p><p><span>地址：COM'+des.data[i].com+'-'+des.data[i].addr+'</span></p></li>'
    }
    $("#addDev .ycyxs").append(htm);
};
$("#addDev .ycyxs").on("click","li",function(){
    $(this).toggleClass("active").siblings("li").removeClass("active");
});


function reBoxList(id,info,des){
    console.log(des);
    $(".devConfig .boxList>li").remove();
    $(".devConfig .devMods>tbody>tr").remove();
    $(".systemDev>div:nth-child(1) table>tbody>tr").remove();
    (des.data).sort(sortByStr("boxSeq"));
    if(des.userData==1){
        for(var i=0;i<des.data.length;i++){
            var types = checkBoxType(des.data[i].type);
            $(".systemDev>div:nth-child(1) table>tbody").append('<tr data-type="'+des.data[i].type+'" data-id="'+des.data[i].boxId+'"><td>'+(i+1)+'</td><td>'+des.data[i].name+'</td><td>'+des.data[i].product+'</td><td>'+des.data[i].model+'</td><td>'+des.data[i].boxId+'</td><td>'+types+'</td></tr>');
        }
        $(".systemDev>div:nth-child(1) table>tbody>tr:nth-child(1)").click();
    }else if(des.userData==2){
        for(var i=0;i<des.data.length;i++){
            var types = checkBoxType(des.data[i].type);
            $(".devConfig .boxList").append('<li data-product="'+des.data[i].product+'" data-seq="'+des.data[i].boxSeq+'" data-model="'+des.data[i].model+'" data-type="'+des.data[i].type+'" data-id="'+des.data[i].boxId+'" data-name="'+des.data[i].name+'"><img src="imgs/box_pic.png" alt=""/><span>'+des.data[i].name+'</span><b><span>'+des.data[i].boxSeq+'</span><br/><span>'+types+'</span></b></li>');
        }
        if(CheckedBox){
            $(".devConfig .boxList>li[data-id='"+CheckedBox+"']").click();
        }else{
            $(".devConfig .boxList>li:nth-child(1)").click();
        }

    }

};
//切换柜子列表
$(".devConfig .boxList").on("click","li",function(){
    $(this).addClass("active").siblings("li").removeClass("active");
    var abt=$(this).attr("data-id");
    var name =$(this).attr("data-name");
    if(abt){
        //$(".devConfig .mods>p>b").html(name+"设备列表：");
        loadModList(abt,1);
        CheckedBox=abt;
    }else {
        $(".devConfig .devMods>tbody>tr").remove();

    }

    var id=$(this).attr("data-id");
    var name=$(this).attr("data-name");
    var product=$(this).attr("data-product");
    var model=$(this).attr("data-model");
    var type=$(this).attr("data-type");
    var seq=$(this).attr("data-seq");
    $("#modifyBox>ul>li:nth-child(2)>span").html(id);
    $("#modifyBox>ul>li:nth-child(1)>input").val(name).attr("data-val",name);
    $("#modifyBox>ul>li:nth-child(3) select").val(type).attr("data-val",type);
    $("#modifyBox>ul>li:nth-child(4) select").val(product).attr("data-val",product);
    loadTypes(product,2);
    $("#modifyBox>ul>li:nth-child(5) select").val(model).attr("data-val",model);
    $("#modifyBox>ul>li:nth-child(6)>input").val(seq).attr("data-val",seq);
    //$("#modifyBox").hide();
});
//获取模块列表
function loadModList(id,type){
    var ob = new Object();
    ob.boxNo = id;
    ob.userData = parseInt(type);
    var json = JSON.stringify(ob);
    parent.ccc_lib_reqDataByCmd("",USER_ELECTRIC_LIST_GETBYID,json,reModList);

};
var selModGtw,selModAddr,selRocordId;
function reModList(id,info,des){
    console.log(des);
    (des.data).sort(sortByStr("onoffSeq"));
    if(des.userData==1){//工程配置获取模块列表
        loadFacts(4);
        //console.log("*******888");
        $(".devConfig .devMods>tbody>tr").remove();
        for(var i=0;i<des.data.length;i++){
            var types = outDev(des.data[i].devType);
            var model = '<option value="">未配置</option>';
            for (var j = 0; j < currentObj.length; j++) {
                if(currentObj[j].productId==des.data[i].productId){
                    if(des.data[i].model==currentObj[j].model){
                        model+='<option selected value="'+currentObj[j].model+'">'+currentObj[j].name+'</option>';
                    }else {
                        model+='<option value="'+currentObj[j].model+'">'+currentObj[j].name+'</option>';
                    }
                }
            }
            $(".devConfig .devMods>tbody").append('<tr about="'+des.data[i].recordId+'">' +
                '<td>'+(i+1)+'</td><td>'+des.data[i].name+'</td><td>COM '+des.data[i].com+' - '+des.data[i].addr+'</td><td>'+types+'</td>' +
                '<td><label class="checkOptBox"><select data-id="0" name="" class="products" data-val="'+des.data[i].productId+'"></select></label></td>' +
                '<td><label class="checkOptBox"><select data-id="1" name="" class="models" data-val="'+des.data[i].model+'">'+model+'</select></label></td>' +
                '<td>'+des.data[i].recordId+'</td></tr>');
        }
        // $(".devConfig .mods>div:nth-child(2)>div").niceScroll();
        $(".devConfig .mods tbody>tr:nth-child(1)").click();
    }else if(des.userData==2){//系统设置获取模块列表
        $(".allMod>li").remove();
      
        // $(".includeModInfo>ul").hide();
        if(des.data.length>0){

            // $(".includeModInfo>ul").show();
            selModGtw=des.data[0].boxId;
            selModAddr=des.data[0].addr;
            selRocordId=des.data[0].recordId;
            for(var k=0;k<des.data.length;k++){     
                // var state="";
                // if(des.data[k].status==1){
                //     state="在线";
                // }else{
                //     state="离线";
                // }
               
                $(".allMod").append('<li data-id="'+des.data[k].recordId+'" about='+des.data[k].addr+' type='+des.data[k].boxId+'><span class="left"><img src="imgs/model.png" alt=""/></span><span class="left"><b>'+des.data[k].name+'</b><br/>ID:  COM'+des.data[k].com+"-"+des.data[k].addr+'</span></li>');
            }
            if(selRocordId){
                $(".allMod>li[data-id='"+selRocordId+"']").click();
            }else{
                $(".allMod>li:first-child").click();
            }

        }else{
            $("#low_model>ul>li>input").val("");
            $("#low_model>ul>li select").val(0);
            $("#low_model>ul>li>span").html("")
        }
        
        // $(".includeMods .allMod").niceScroll({cursorborder:"",cursorcolor:"#00F",boxzoom:false});
        // switch(selRoom){
        //     case "1":$("#low_model").show().siblings("li").hide();break;
        //     case "2":$("#final_model").show().siblings("li").hide();break;
        //     case "3":$("#high_model").show().siblings("li").hide();break;
        //     case "4":$("#Transformer_model").show().siblings("li").hide();break;
        //     case "5":$("#box_model").show().siblings("li").hide();break;
        //     case "6":$("#prot_model").show().siblings("li").hide();break;
        //     case "7":$("#DC_model").show().siblings("li").hide();break;
        //     case "8":$("#BankedBattery_model").show().siblings("li").hide();break;
    
        //     default:break;
        // }
    }
    
};
$(".devConfig .devMods>tbody").on('change','.products',function(){
    var val = $(this).val();
    var recordId = $(this).parents('tr').attr('about');
    modifyModReturnfn(recordId,0,val);

    var model = '<option value="">未配置</option>';

    for (var i = 0; i < currentObj.length; i++) {
        if(currentObj[i].productId==val){
            model+='<option value="'+currentObj[i].model+'">'+currentObj[i].name+'</option>';
        }
    }
    $(this).parents('tr').find('.models').empty().append(model);
    modifyModReturnfn(recordId,1,'');
});
$(".devConfig .devMods>tbody").on('change','.models',function(){
    var val = $(this).val();
    var recordId = $(this).parents('tr').attr('about');
    modifyModReturnfn(recordId,1,val);
});

function modifyModReturnfn(recordId,attrid,val){
    var ob = new Object();
    ob.class = 3;
    ob.objId="";
    ob.subId = parseInt(recordId);
    ob.attrId = attrid;
    ob.content = val;
    ob.userData = 0;
    var json = JSON.stringify(ob);
    console.log(ob);
    ccc_lib_reqDataByCmd("",USER_OBJECT_ATTR_MODBYID,json,modifyModReturn);//修改模块信息
};
//切换模块
$(".includeMods .allMod").on("click","li",function(){
    $(this).addClass("active").siblings("li").removeClass("active");
    show_model_info();
});
//获取单个模块属性
function show_model_info(){
    var recordId=$(".allMod>li[class='active']").attr("data-id");
    if(recordId){
        var ob = new Object();
        ob.recordId = parseInt(recordId);
        ob.userData = 0;
        var json = JSON.stringify(ob);
        console.log(json);
        parent.ccc_lib_reqDataByCmd("",USER_ELEC_INFO_GETBYID_V25,json,show_mod_config);//
    }
};
var ModelInfo;
//显示模块配置
function show_mod_config(id,info,des){
    console.log(des);
   
     $("#low_model .products").text('');
     $("#low_model .models").text('').attr('seqId');

    loadFacts(3);
   
    if(des.result==0){
        ModelInfo=des;
        var type2 = outDev(ModelInfo.devType);
        console.log(ModelInfo.devType);
        console.log(type2);

        var swt="";
        if(ModelInfo.status==0){
            swt="离线";
        }else if(ModelInfo.status==1){
            swt="在线"
        }
        $("#relevance,.aboutDev").remove();
        if(ModelInfo.devType==2 ){//低压出线
            $("#low_model >ul>li:nth-child(n+8)").show();
            $(".load_machine select>option").remove();
            $(".load_machine select").append('<option value="0">未配置</option><option value="2">出线</option><option value="7">负荷</option>');
        }else if(ModelInfo.devType==1 ||  ModelInfo.devType==6 ){//低压进线
            $(".load_machine select>option").remove();
            $(".load_machine select").append('<option value="0">未配置</option><option value="1">进线</option><option value="2">出线</option>');
            $("#low_model >ul>li:nth-child(n+8)").show();
        }else{//其他
            $("#low_model >ul>li:nth-child(n+8)").hide();
        }

        if(ModelInfo.devType==1){//显示能源分项
            $("#low_model .userItems").hide();
            $("#low_model .powerItems").show();
            $("#low_model .powerItems select>option").remove();
            $("#low_model .powerItems select").append('<option value="0">未配置</option><option value="1">电网供电</option><option value="2">柴油机发电</option><option value="3">光伏发电</option><option value="4">风力发电</option><option value="5">其他再生能源</option><option value="6">上一级出线</option><option value="7">蓄电池放电</option>');
        }else if(ModelInfo.devType==2){//显示用户分项
            $("#low_model .userItems").show();
            $("#low_model .powerItems").hide();
            $("#low_model .userItems select>option").remove();
            $("#low_model .userItems select").append('<option value="0">未配置</option>');
            console.log(userItem);
            for(var m=0;m<userItem.data.length;m++){
                $("#low_model .userItems select").append('<option value='+userItem.data[m].itemId+'>'+userItem.data[m].name+'</option>');
            }
        }else if(ModelInfo.devType==6){
            $("#low_model .userItems").show();
            $("#low_model .powerItems").show();
            $("#low_model .userItems select>option").remove();
            $("#low_model .powerItems select>option").remove();
            $("#low_model .userItems select").append('<option value="0">未配置</option>');
            $("#low_model .powerItems select").append('<option value="0">未配置</option><option value="1">电网供电</option><option value="2">柴油机发电</option><option value="3">光伏发电</option><option value="4">风力发电</option><option value="5">其他再生能源</option><option value="6">上一级出线</option><option value="7">蓄电池放电</option>');
            for(var m=0;m<userItem.data.length;m++){
                $("#low_model .userItems select").append('<option value='+userItem.data[m].itemId+'>'+userItem.data[m].name+'</option>');
            }
        }
        //判断进线和电容显示模块容量
        if(ModelInfo.devType==8 ||ModelInfo.devType==1 || ModelInfo.devType==4 || ModelInfo.devType==6){
            $("#low_model>ul>li:nth-child(13)").show();
            if(ModelInfo.devType==1 ||ModelInfo.devType==6){
                $("#low_model>ul>li:nth-child(13)>b").html("变压器容量：");
            }else if(ModelInfo.devType==4){
                $("#low_model>ul>li:nth-child(13)>b").html("补 偿 容 量：");
            }
        }else{
            $("#low_model>ul>li:nth-child(13)").hide();
        }
         //判断蓄电池组显示电池序号
         if(ModelInfo.devType==14){
            
            $("#low_model>ul>li:nth-child(14)>b").html("电池组：");
            $("#low_model>ul>li:nth-child(14) select>option").remove();
            $("#low_model>ul>li:nth-child(14) select").html("<option value='1'>一组</option><option value='2'>二组</option>");
            $("#low_model>ul>li:nth-child(14)").show();
        }else if(ModelInfo.devType==13 || ModelInfo.devType==18|| ModelInfo.devType==19|| ModelInfo.devType==25){
          
            $("#low_model>ul>li:nth-child(14)>b").html("充电机组：");
            $("#low_model>ul>li:nth-child(14) select>option").remove();
            $("#low_model>ul>li:nth-child(14) select").html("<option value='1'>一组</option><option value='2'>二组</option><option value='3'>三组</option>");
            $("#low_model>ul>li:nth-child(14)").show();
        }else{
            $("#low_model>ul>li:nth-child(14)").hide();
        }
        $("#low_model>ul>li:first-child>span").attr("about",ModelInfo.name).html(ModelInfo.name);
        $(".allMod>li.active>span:nth-child(2)>b").html(ModelInfo.name);
        $("#low_model>ul>li:nth-child(2)>span").html("COM"+ModelInfo.com+"-"+ModelInfo.addr);
        $("#low_model>ul>li:nth-child(3)>span").html(swt);
        $("#low_model>ul>li:nth-child(4)>input").val(ModelInfo.onoffSeq).attr("data-val",ModelInfo.onoffSeq);
        $("#low_model>ul>li:nth-child(5)>span").attr("data-val",ModelInfo.productId).val(ModelInfo.productId);
        $("#low_model>ul>li:nth-child(6)>span").attr("data-val",ModelInfo.model).val(ModelInfo.model);
        $("#low_model>ul>li:nth-child(7)>span").html(type2);
        $("#low_model>ul>li:nth-child(7)>span").attr("about",ModelInfo.devType);
        $("#low_model>ul>li:nth-child(8) select").attr("about",ModelInfo.joinDev).val(ModelInfo.joinDev);
        $("#low_model>ul>li:nth-child(9) select").attr("about",ModelInfo.energyItem).val(ModelInfo.energyItem);//能源分项
        $("#low_model>ul>li:nth-child(10) select").attr("about",ModelInfo.userItem).val(ModelInfo.userItem);//用户分项
        $("#low_model>ul>li:nth-child(11)>input").attr("about",parseFloat(ModelInfo.ratingA).toFixed(2)).val(parseFloat(ModelInfo.ratingA).toFixed(2));
        $("#low_model>ul>li:nth-child(12)>input").attr("about",parseFloat(ModelInfo.rationP).toFixed(2)).val(parseFloat(ModelInfo.rationP).toFixed(2));

        $("#low_model>ul>li:nth-child(13)>input").attr("about",parseFloat(ModelInfo.kvaCap).toFixed(2)).val(parseFloat(ModelInfo.kvaCap).toFixed(2));
        $("#low_model>ul>li:nth-child(14) select").attr("about",ModelInfo.safeAnaly).val(ModelInfo.safeAnaly);//
        
        check_outline();
        loadYkYt();

    }else{
        ModelInfo = new Object();
        ModelInfo.m_strStnId = " ";//(string)站点ID，
        ModelInfo.devId = " ";//(string)网关ID，
        ModelInfo.product = " ";//生产厂商
        ModelInfo.model = " ";//配电型号
        //ModelInfo.m_nType = oDataView.getInt32(oPos.nAdd,g_bNBO);oPos.nAdd += 4;//配电类型
        ModelInfo.addr = 0;//配电地址
        ModelInfo.version = 0;//配电协议版本
        ModelInfo.time = " ";//时间
        ModelInfo.status = 0;//运行状态
        ModelInfo.projItem = 0;//用户分项
        ModelInfo.name = " ";//模块名字
        ModelInfo.level = 0;//负荷等级
        ModelInfo.joinDev = 0;//外接设备
        ModelInfo.devItem = 0;//设备分项
        ModelInfo.onoffSeq = " ";//开关序号
        ModelInfo.dataType = 0;//启用遥控遥调配置
        ModelInfo.devType = 0;//配电设备类型
        ModelInfo.supplyItem = 0;// ,(Float)变比｝

        ModelInfo.idlePower = 0;// (Float)空载功率，
        ModelInfo.ratingPower = 0;// (Float)额定功率，
        ModelInfo.cbProduct = " ";// (string)断路器厂商，
        ModelInfo.cbModel = " ";// (string)断路器型号，
        ModelInfo.ratingCurrent = 0;// (Float)断路器额定电流,
        ModelInfo.m_nRatedA1 = 0;// (Float)一次侧额定电流,
        ModelInfo.m_nRatedA2 = 0;// (Float)二次侧额定电流,
        ModelInfo.m_nRatedV1 = 0;// (Float)一次侧额定电压，
        ModelInfo.m_nRatedV2 = 0;// (Float)二次侧额定电压，
        ModelInfo.m_nCoolWay = 0;// (int)冷却模式,,
        ModelInfo.m_nShortCircuit = 0;// (Float)短路阻抗，
        ModelInfo.m_nNoLoadLost = 0;// (Float)空载损耗，
        ModelInfo.m_nRunBestLow = 0;// (Float)最佳经济运行区间A,，
        ModelInfo.m_nRunBestUp = 0;// (Float)最佳经济运行区间B
        ModelInfo.m_nStartTemp = 0;//(Float)风机启动温度,
        ModelInfo.m_nHighAlarmTemp = 0;// (Float)高温告警温度,
        ModelInfo.m_nOverTempProt = 0;// ,(Float)超温保护温度｝

        $("#low_model>ul>li>input").val("");
        $("#low_model>ul>li select").val(0);
        $("#low_model>ul>li>span").html("")
    }
};
//获取已经配置的遥控遥调列表
function loadYkYt(){
    var recordId=$(".allMod>li[class='active']").attr("data-id");
    if(recordId){
        var ob = new Object();
        ob.recordId = parseInt(recordId);
        ob.com = parseInt(ModelInfo.com);
        ob.addr = parseInt(ModelInfo.addr);
        ob.type = 100;
        ob.userData = 0;
        var json = JSON.stringify(ob);
        console.log(json);
        parent.ccc_lib_reqDataByCmd("",USER_ELEC_YKT_LIST_V25,json,OnChkGetYkYt);//获取已经配置的遥控遥调列表

    }
};
//返回模块配置好的遥控遥调
function OnChkGetYkYt(id,info,des){
    console.log(des);
    $(".far_control table>tbody>tr").remove();
    if(des.result==0){
        for(var i= 0 ;i<des.data.length;i++){
            var type;
            if(des.data[i].type==2){
                type="遥调";
            }else if(des.data[i].type==1){
                type="遥控";
            }else{
                type="未识别";
            }
            $(".far_control table>tbody").append('<tr name='+des.data[i].number+'><td>'+des.data[i].name+'</td><td>'+des.data[i].number+'</td><td>'+type+'</td><td><button class="btn btn-small btn-danger">删除</button></td></tr>');
        }
    }
};
//返回模块遥控遥调列表
function OutGetYkYtCmd(id,info,des){
    console.log(des);
    $("#addControl table>tbody>tr").remove();
    for(var i=0;i<des.data.length;i++){
        var type;
        if(des.data[i].type==2){
            type="遥调"
        }else if(des.data[i].type==1){
            type="遥控";
        }else{
            type="未定义";
        }
        $("#addControl table>tbody").append('<tr data-unit="'+des.data[i].unit+'" data-recordId="'+des.data[i].tableId+'" name='+des.data[i].name+' about='+des.data[i].number+' type='+des.data[i].type+'><td>'+(i+1)+'</td><td>'+des.data[i].name+'</td><td>'+type+'</td><td>'+des.data[i].number+'</td><td><button class="btn btn-small btn-success">添加</button></td></tr>')
    }
};
//点击添加遥控遥调
$("#low_model").on("click","#addControl table button",function(){
    var type=$(this).parents("tr").attr("type");
    var name=$(this).parents("tr").attr("name");
    var con=$(this).parents("tr").attr("about");
    var unit =$(this).parents("tr").attr("data-unit");
    var recordId=$(".allMod>li[class='active']").attr("data-id");

    var ob = new Object();
    ob.recordId = parseInt(recordId);//网关逻辑ID
    ob.com = parseInt(ModelInfo.com);//模块地址
    ob.addr = parseInt(ModelInfo.addr);//模块地址
    ob.unit = unit;//单位
    ob.number = parseInt(con);//(int)命令编号,
    ob.type = parseInt(type);// (int)类型,
    ob.name = name;/// (string)名称
    ob.userData = 0;
    console.log(ob);
    var json = JSON.stringify(ob);
    parent.ccc_lib_reqDataByCmd("",ELEC_YKT_CREATE_V25,json,addYkYt_wait);
});
//点击删除遥控遥调关联
$("#low_model").on("click",".far_control table button",function(){
    var code=$(this).parents("tr").attr("name");
    var recordId=$(".allMod>li[class='active']").attr("data-id");
    var ob = new Object();
    ob.recordId = parseInt(recordId);//
    ob.com = parseInt(ModelInfo.com);//模块地址
    ob.addr = parseInt(ModelInfo.addr);//模块地址
    ob.number = parseInt(code);//(int)命令编号,
    ob.userData = 0;
    var json = JSON.stringify(ob);
    parent.ccc_lib_reqDataByCmd("",ELEC_YKT_DELETE_V25,json,addYkYt_wait);
});
function addYkYt_wait(id,info,des){
    loadAlerts(des.desc);
    if(des.result==0){
        $("#addControl").hide();
        loadYkYt();
    }else{

    }
};
//修改模块按钮
$("#low_model input").blur(function(){
    if($(this).hasClass("openedName")){
        return false;
    }
    var val=$(this).val();
    var valPrev=$(this).attr("data-val");
    var attrid=parseInt($(this).attr("data-id"));
    var recordId=$(".allMod>li.active").attr("data-id");
    //if(val){
        if(val!=valPrev){
            if(attrid==2){
                 var totalLength = byteLength(val);
                 if(totalLength>64){
                    loadAlerts("回路名称最多输入63个字符或21个汉字！");
                    return false;
                 }
            }else if(attrid==9){

            }else{

            }
           
            var ob = new Object();
            ob.class = 3;
            ob.objId= "";
            ob.subId = parseInt(recordId);
            ob.attrId = attrid;
            ob.content = val;
            ob.userData = 0;
            var json = JSON.stringify(ob);
            console.log(ob);
            ccc_lib_reqDataByCmd("",USER_OBJECT_ATTR_MODBYID,json,modifyModReturn);//修改模块信息
            
        }
        $("#configPwd").hide();
    //}
});

$("#low_model select").change(function(){
    if($(this).hasClass("switch")){
        return false;
    }
    var val=$(this).val();
    var valPrev=$(this).attr("about");
    var attrid=parseInt($(this).attr("data-id"));
    var recordId=$(".allMod>li.active").attr("data-id");
    //if(val){
        // if(val!=valPrev){
        var ob = new Object();
        ob.class = 3;
        ob.objId="";
        ob.subId = parseInt(recordId);
        ob.attrId = attrid;
        ob.content = val;
        ob.userData = 0;
        var json = JSON.stringify(ob);
        console.log(ob);
        ccc_lib_reqDataByCmd("",USER_OBJECT_ATTR_MODBYID,json,modifyModReturn);//修改模块信息
        // }
    //}
});
function modifyModReturn(id,info,des){
    loadAlerts(des.desc);
    $(".allMod>li.active").click();
    $("#configPwd").hide();
};
$("#low_model .products").change(function(){
    var val=$(this).val();
    if(val){
        loadTypes(val,3);
    }
});
$("#addControl>p>span").click(function(){
    $("#addControl").hide();
});
//点击遥控遥调列表弹出
$("#low_model").on("click",".far_control>p>button",function(){
  
    // var devType=ModelInfo.devType;
    var devType=$("#low_model .models").attr('seqId');
    if(parseInt(devType)>0){
        $("#addControl").show();
        move("addControl","addControl_top");
        var ob = new Object();
        ob.devType = parseInt(devType);//(string)
        ob.userData = 1;
        var json = JSON.stringify(ob);
        parent.ccc_lib_reqDataByCmd("",USER_ELEC_MODEL_LIST_V25,json,OutGetYkYtCmd);//
    }else{
        loadAlerts("请先关联厂家型号！");
        $("#addControl table>tbody>tr").remove();
    }
    
});
//判断是否为出线
function check_outline(){
    if(ModelInfo.joinDev==2){//出线
        $(".powerItems").find("select").attr("disabled",true);
        $(".powerItems").find("select").val("0");
        $(".userItems").find("select").attr("disabled",true);
        $(".userItems").find("select").val("0");
    }else if(ModelInfo.joinDev==1){//进线
        if(ModelInfo.devType==6){//低压反向进线
            if(ModelInfo.energyItem==6){//能源出线
                $(".powerItems").find("select").attr("disabled",false);
                $(".userItems").find("select").attr("disabled",true);
                $(".userItems").find("select").val("0");
            }else{//非能源出线
                $(".powerItems").find("select").attr("disabled",false);
                $(".userItems").find("select").attr("disabled",false)
            }
        }else{
            $(".powerItems").find("select").attr("disabled",false);
            $(".userItems").find("select").attr("disabled",false);
        }
    }else{
        $(".powerItems").find("select").attr("disabled",false);
        $(".userItems").find("select").attr("disabled",false);
    }
};
$(".load_machine").change(function(){
    $(".powerItems").find("select").val("0");
    $(".userItems").find("select").val("0");
    if(ModelInfo.devType==6){//低压反向进线
        if($(this).find("select").val()==2){//出线
            $(".powerItems").find("select").attr("disabled",true);
            $(".userItems").find("select").attr("disabled",true);
        }else if($(this).children("select").val()==1){
            var val=$(".powerItems").find("select").val();
            if(val==6){//能源出线
                $(".userItems").find("select").attr("disabled",true);
                $(".userItems").find("select").val("0");
            }else{//非能源出线
                $(".powerItems").find("select").attr("disabled",false);
                $(".userItems").find("select").attr("disabled",false);
            }
        }
    }else{
        if($(this).find("select").val()==2){
            $(".powerItems").find("select").attr("disabled",true);
            $(".powerItems").find("select").val("0");
        
            $(".userItems").find("select").attr("disabled",true);
            $(".userItems").find("select").val("0");
        }else{
            $(".powerItems").find("select").attr("disabled",false);
         
            $(".userItems").find("select").attr("disabled",false);
        }
    }

});

$(".powerItems").change(function(){
    if(ModelInfo.devType==6){
        var val=$(".load_machine").find("select").val();//接入设备类型
        if(val==2){
            $(this).find("select").attr("disabled",true);
            $(".userItems").find("select").attr("disabled",true);
        }else{
            if($(this).find("select").val()==6){//能源出线
                $(".userItems").find("select").attr("disabled",true);
                $(".userItems").find("select").val(0);
            }else{
                $(".userItems").find("select").attr("disabled",false);
            }
        }

    }
});
$(".devConfig .devMods>tbody").on("click","tr",function(){
    $(this).addClass("active").siblings("tr").removeClass("active");
});

//告警预警内容
//获取点表列表

//切换点表列表获取告警配置
$(".systemAlarm .agreements").on("click","ul>li",function(){
    $(this).addClass("active").siblings("li").removeClass("active");
    var about=$(this).attr("about");
    var tbid=$(this).attr("type");
    load_alarm_devList(about,tbid);
});
//获取站点遥测配置列表
function load_alarm_devList(about,tbid){
    var ob = new Object();
    ob.devType = parseInt(about);
    ob.recordId = parseInt(tbid);
    ob.userData = 0;
    var json = JSON.stringify(ob);
    parent.ccc_lib_reqDataByCmd("",USER_POINT_SETTING_ALMLIST_GETBYID,json,show_StnAlarmDevList);//站点设备告警遥测配置
};
//返回站点告警遥测配置设备列表
function show_StnAlarmDevList(id,info,des){
    //$(".alarms>.ycs>tbody>tr").remove();
    for(var i=0;i<des.all.length;i++){
        if(des.all[i].pointId == 39 || des.all[i].pointId == 40 ||des.all[i].pointId == 41 ||des.all[i].pointId == 52 ||des.all[i].pointId == 207 ||des.all[i].pointId == 66 || des.all[i].pointId == 67 ||des.all[i].pointId == 68){
            des.all[i].regName = des.all[i].regName+"-%";
        }else{
            try{
                des.all[i].regName = (des.all[i].unit)?(des.all[i].regName + "-"+des.all[i].unit):des.all[i].regName;
            }catch(err){

            }
        }
        for(var k=0;k<des.data.length;k++){
            if(des.all[i].pointSeq==des.data[k].pointSeq){
                des.all[i].almcfg=des.data[k].almcfg;
                des.all[i].level=des.data[k].level;
                des.all[i].down=des.data[k].down;
                des.all[i].up=des.data[k].up;
                des.all[i].status=des.data[k].status;
               
            }
        }
    }
    var datas=des.all;
    var html='';
    for(var i=0;i<datas.length;i++){
        var str;
        var cla;
        if(datas[i].status==1){
            str="异常";
            cla="red";
        }else{
            str="正常";
            cla="green";
        }
        var cls;
        var sta;
        var name="";
        if(datas[i].almcfg==1){
            cls="active";
            sta=0;
            name="告   警";
        }else{
            cls="";
            sta=1;
            name="不告警";
        }
        if(datas[i].pointSeq>=0){
            if(datas[i].level==5){
                html+='<tr type="'+datas[i].pointSeq+'" data-type="'+datas[i].dataType+'" data-statu="'+datas[i].almcfg+'" data-up="'+datas[i].up+'" data-down="'+datas[i].down+'" data-level="'+datas[i].level+'" data-name="'+datas[i].regName+'" about="'+datas[i].pointId+'"><td>'+datas[i].regName+'</td><td></td><td></td><td class="'+cla+'">'+str+'</td></tr>';
            }else if(datas[i].level==0){
                html+='<tr type="'+datas[i].pointSeq+'" data-type="'+datas[i].dataType+'" data-statu="'+datas[i].almcfg+'" data-up="'+datas[i].up+'" data-down="'+datas[i].down+'" data-level="'+datas[i].level+'" data-name="'+datas[i].regName+'" about="'+datas[i].pointId+'"><td>'+datas[i].regName+'</td><td><label class="checkOptBox"><select data-val="'+datas[i].level+'" name="" data-id="0"><option value="0">未配置</option><option value="1">重要</option><option value="2">严重</option><option value="3">一般</option></select></label></td><td></td><td class="'+cla+'">'+str+'</td></tr>';
            }else{
                //判断遥信不显示上下限
                if(datas[i].pointId>2000){
                    html+='<tr type="'+datas[i].pointSeq+'" data-type="'+datas[i].dataType+'" data-statu="'+datas[i].almcfg+'" data-up="'+datas[i].up+'" data-down="'+datas[i].down+'" data-level="'+datas[i].level+'" data-name="'+datas[i].regName+'" about="'+datas[i].pointId+'"><td>'+datas[i].regName+'</td><td><label class="checkOptBox"><select data-val="'+datas[i].level+'" name="" id="" data-id="0"><option value="0">未配置</option><option value="1">重要</option><option value="2">严重</option><option value="3">一般</option></select></label></td><td><button class="'+cls+'" about="'+datas[i].almcfg+'" data-sta="'+sta+'">'+name+'</button><span>告警值：</span><input class="loadNum" type="text" value="'+(datas[i].up).toFixed(2)+'" data-id="1" data-val="'+(datas[i].up).toFixed(2)+'"><span></td><td class="'+cla+'">'+str+'</td></tr>';
                }else{
                    html+='<tr type="'+datas[i].pointSeq+'" data-type="'+datas[i].dataType+'" data-statu="'+datas[i].almcfg+'" data-up="'+datas[i].up+'" data-down="'+datas[i].down+'" data-level="'+datas[i].level+'" data-name="'+datas[i].regName+'" about="'+datas[i].pointId+'"><td>'+datas[i].regName+'</td><td><label class="checkOptBox"><select data-val="'+datas[i].level+'" name="" id="" data-id="0"><option value="0">未配置</option><option value="1">重要</option><option value="2">严重</option><option value="3">一般</option></select></label></label></td><td><button class="'+cls+'" about="'+datas[i].almcfg+'" data-sta="'+sta+'">'+name+'</button><span>上限：</span><input class="loadNum" type="text" value="'+(datas[i].up).toFixed(2)+'" data-id="1" data-val="'+(datas[i].up).toFixed(2)+'"><span>下限：</span><input type="text" class="loadNum" value="'+(datas[i].down).toFixed(2)+'" data-id="2" data-val="'+(datas[i].down).toFixed(2)+'"></td><td class="'+cla+'">'+str+'</td></tr>';
                }
            }
        }else{
            if(datas[i].level==5){
                html+='<tr type="'+datas[i].pointSeq+'" data-type="'+datas[i].dataType+'" data-statu="'+datas[i].almcfg+'" data-up="'+datas[i].up+'" data-down="'+datas[i].down+'" data-level="'+datas[i].level+'" data-name="'+datas[i].regName+'" about="'+datas[i].pointId+'"><td>'+datas[i].regName+'</td><td></td><td></td><td class="'+cla+'">'+str+'</td></tr>';
            }else{
                html+='<tr type="'+datas[i].pointSeq+'" data-type="'+datas[i].dataType+'" data-statu="'+datas[i].almcfg+'" data-up="'+datas[i].up+'" data-down="'+datas[i].down+'" data-level="'+datas[i].level+'" data-name="'+datas[i].regName+'" about="'+datas[i].pointId+'"><td>'+datas[i].regName+'</td><td><label class="checkOptBox"><select data-val="0" name="" data-id="0"><option value="0">未配置</option><option value="1">重要</option><option value="2">严重</option><option value="3">一般</option></select></label></td><td></td><td class="'+cla+'">'+str+'</td></tr>';
            }
        }
    }
    $(".alarms>.ycs>tbody").html(html);
    $(".alarms>.ycs>tbody>tr select").each(function(){
      $(this).val($(this).attr("data-val"));
    });
};
$("#reset").click(function(){
    var len = $(".agreements>ul>li.active").length;
    if(len<1){
        return false;
    }else{
        $(".restart_alert").show().attr("about",3);
        $(".restart_alert footer").show();
    }
});
//点击修改遥测配置
$(".systemAlarm .ycs").on("change","td select",function(){
    var level=$(this).val();
    var statu = $(this).parents("tr").attr("data-statu");
    var up = $(this).parents("tr").attr("data-up");
    var down = $(this).parents("tr").attr("data-down");
    var datatype=$(this).parents("tr").attr("data-type");
 
    var devType=$(".systemAlarm .agreements>ul>li.active").attr("about");
    var pointId=$(this).parents("tr").attr("about");
    var pointSeq = $(this).parents("tr").attr("type");
    var name = $(this).parents("tr").attr("data-name");
    var ob = new Object();
    ob.devType = parseInt(devType);
    ob.pointId = parseInt(pointId);
    ob.pointSeq = parseInt(pointSeq);
    ob.regName = name;
    ob.level = (level=="undefined")?0:parseInt(level);
    ob.cfgStatus = (statu=="undefined")?0:parseInt(statu);
    if(datatype==2){//遥信默认值为1
        ob.up = (up=="undefined")?1:parseFloat(up);
    }else{//非遥信默认值为0
        ob.up = (up=="undefined")?0:parseFloat(up);
    }
    ob.down = (down=="undefined")?0:parseFloat(down);
    ob.userData = 0;
    var json = JSON.stringify(ob);
    console.log(ob);
    parent.ccc_lib_reqDataByCmd("",POINT_SETTING_ALARM_CREATE,json,show_mod_alarm_config);//修改站点设备告警遥测配置

});
//点击修改遥测配置
$(".systemAlarm .ycs").on("click","td button",function(){
    var statu=$(this).attr("data-sta");
    var level = $(this).parents("tr").attr("data-level");
    var up = $(this).parents("tr").attr("data-up");
    var down = $(this).parents("tr").attr("data-down");
    var datatype=$(this).parents("tr").attr("data-type");
    var devType=$(".systemAlarm .agreements>ul>li.active").attr("about");
    var pointId=$(this).parents("tr").attr("about");
    var pointSeq = $(this).parents("tr").attr("type");
    var name = $(this).parents("tr").attr("data-name");
    var ob = new Object();
    ob.devType = parseInt(devType);
    ob.pointId = parseInt(pointId);
    ob.pointSeq = parseInt(pointSeq);
    ob.regName = name;
    ob.level = (level=="undefined")?0:parseInt(level);
    ob.cfgStatus = (statu=="undefined")?0:parseInt(statu);
    if(datatype==2){//遥信默认值为1
        ob.up = (up=="undefined")?1:parseFloat(up);
    }else{//非遥信默认值为0
        ob.up = (up=="undefined")?0:parseFloat(up);
    }
    ob.down = (down=="undefined")?0:parseFloat(down);
    ob.userData = 0;
    var json = JSON.stringify(ob);
    console.log(ob);
    parent.ccc_lib_reqDataByCmd("",POINT_SETTING_ALARM_CREATE,json,show_mod_alarm_config);//修改站点设备告警遥测配置

});
//点击修改遥测配置
$(".systemAlarm .ycs").on("blur","td>input",function(){
    var val=parseFloat($(this).val()).toFixed(2);
    var old=$(this).attr("data-val");
    if(isNaN(val) || val == -99){
        loadAlerts("请输入一个非-99的有效值！");
        return false;
    }else if(val!=old){
        var val=$(this).val();
        var id=$(this).attr("data-id");
        var level = $(this).parents("tr").attr("data-level");
        var statu = $(this).parents("tr").attr("data-statu");
        var up = $(this).parents("tr").attr("data-up");
        var down = $(this).parents("tr").attr("data-down");
        if(id==1){//上限
            up = val;
        }else if(id==2){//下限
            down = val;
        }
        var devType=$(".systemAlarm .agreements>ul>li.active").attr("about");
        var pointId=$(this).parents("tr").attr("about");
        var pointSeq = $(this).parents("tr").attr("type");
        var name = $(this).parents("tr").attr("data-name");
        var ob = new Object();
        ob.devType = parseInt(devType);
        ob.pointId = parseInt(pointId);
        ob.pointSeq = parseInt(pointSeq);
        ob.regName = name;
        console.log(id);
        ob.level = (level=="undefined")?0:parseInt(level);
        ob.cfgStatus = (statu=="undefined")?0:parseInt(statu);
        ob.up = (up=="undefined")?0:parseFloat(up);
        ob.down = (down=="undefined")?0:parseFloat(down);
        ob.userData = 0;
        var json = JSON.stringify(ob);
        console.log(ob);
        parent.ccc_lib_reqDataByCmd("",POINT_SETTING_ALARM_CREATE,json,show_mod_alarm_config);//修改站点设备告警遥测配置
    }
    $("#configPwd").hide();
});
//修改告警配置返回
function show_mod_alarm_config(id,info,des){
    console.log(des);
    var about=$(".systemAlarm .agreements>ul>li.active").attr("about");
    var tbid=$(".systemAlarm .agreements>ul>li.active").attr("type");
    load_alarm_devList(about,tbid);
    loadAlerts(des.desc);
    $("#configPwd").hide();
};
//菜单配置内容
//切换菜单
function loadMenuList(type){
    var ob = new Object();
    ob.type = parseInt(type);
    ob.userData = parseInt(type);
    var json = JSON.stringify(ob);
    ccc_lib_reqDataByCmd("",ACDC_MENU_CONF_LIST,json,showMenuList);
};
var checkMenu;
var menuLists;
function showMenuList(id,info,des){
    console.log(des);
    if(des.userData==1){
        menuLists = des.data;
        $(".menuList>li").remove();
        $(".diago>li").remove();
        $(".systemPower>ul>li").remove();
        var htm="";
        var dis="false";
        var isNoRcd=false;
        var isRcd=false;
        for(var i=0;i<des.data.length;i++){
            var cla;
            var names="";
            var nums=0;
            // if(des.data[i].code==10010000){
            //     if (des.data[i].enable == 1 && $("header #loadIn .return").is(':hidden')){
            //         $("header #loadIn [about='operats']").show();
            //     }else {
            //         $("header #loadIn [about='operats']").hide();
            //     }
            // }
            if(des.data[i].enable==1){
                dis = '<input about="'+des.data[i].code+'" data-val="'+des.data[i].name+'" type="text" value="'+des.data[i].name+'" >';
                cla="已启用";

                if(des.data[i].code==10010000){//交流
                    names="systemPower5";
                    nums=12;
                    isNoRcd=true;
                }else if(des.data[i].code==20010000){//直流
                    names="systemPower1";
                    nums="";
                    isNoRcd=true;
                }else if(des.data[i].code==50010000){//ups
                    names="systemPower2";
                    nums=7;
                    isNoRcd=true;
                }else if(des.data[i].code==40010000){//INV
                    names="systemPower3";
                    nums=8;
                    isNoRcd=true;
                }else if(des.data[i].code==30010000){//通信
                    names="systemPower4";
                    nums="";
                    isNoRcd=true;
                }else if(des.data[i].code==60010000){//剩余电流
                    names="systemPower6";
                    nums=14;
                    isRcd=true;
                }
                $(".systemPower>ul").append('<li about="'+names+'" data-num="'+nums+'"><span></span>'+des.data[i].name+'</li>')
            }else{
                cla="未启用";
                dis = '<input about="'+des.data[i].code+'" data-val="'+des.data[i].name+'" type="text" value="'+des.data[i].name+'" disabled>';
            }
            htm+='<li about="'+des.data[i].code+'" data-type="'+des.data[i].enable+'"><img src="imgs/system.png"/>   <span>'+des.data[i].name+'</span><b>'+cla+'</b></li>';
        }
        $(".systemPower>ul>li:nth-child(1)").click();
        if(isNoRcd){
            $(".systemItem>a:nth-child(2)").show();
        }else{
            $(".systemItem>a:nth-child(2)").hide();
        }
        if(isRcd){
            $(".systemItem>a:nth-child(3)").show();
        }else{
            $(".systemItem>a:nth-child(3)").hide();
        }
        $(".menuList").append(htm);
        if(checkMenu){
            $(".menuList>li[about='"+checkMenu+"']").click();
        }else{
            $(".menuList>li:nth-child(1)").click();
        }
        // 
    }else if(des.userData==3){
        // diagList = des.data ;
        $(".diago>li").remove();
        for(var i=0;i<des.data.length;i++){
            var code=des.data[i].code;
            $(".menuList>li.active").each(function(){
                if($(this).attr("about")==code){
                    var cla;
                    if(des.data[i].isEnable==1){
                        cla="active";
                    }else{
                        cla="";
                    }
                    $(".diago").append('<li><b>'+des.data[i].name+'</b><button class="mytbnsSolid '+cla+'" data-visitid="'+des.data[i].visitId+'" data-sysid="'+des.data[i].sysId+'" about="'+des.data[i].isEnable+'">启用</button></li>')
                }
            });
        }
    }else{//获取二级菜单
        $(".secondMenuList>li").remove();
        if(des.data.length>0){
            for(var i=0;i<des.data.length;i++){
                var cla;
                if(des.data[i].enable==1){
                    cla="active";
                }else{
                    cla="";
                }
                $(".secondMenuList").append('<li><b>'+des.data[i].name+'</b><button class="mytbnsSolid '+cla+'" data-code="'+des.data[i].code+'" about="'+des.data[i].enable+'">启用</button></li>')
            }
        }else{
            $(".secondMenuList").append('<li><b>无子菜单</b></li>');
        }
    }

};
//点击一级菜单
$(".menuList").on("click","li",function(){
    $(this).addClass("active").siblings("li").removeClass("active");
    var abt=$(this).attr("about");
    checkMenu=abt;
    var code = $(this).attr("about");
    var name = $(this).children("span").html();
    $("#modifyMenu>ul>li:nth-child(1)>input").val(name).attr("data-val",name);
    $("#modifyMenu>ul>li:nth-child(2)>span").html(code);
    loadMenuList(3);
    loadMenuList(abt);
    
    
});

//点击启用不启用
$(".menuConfig .menus").on("click","button.isOn",function(){
    var code = $(".menuList>li.active").attr("about");
    var enable = $(".menuList>li.active").attr("data-type");
    enable = (enable==1)?"0":"1";

    var ob = new Object();
    ob.class = 2;
    ob.objId = "";
    ob.subId = parseInt(code);
    ob.attrId = 0;
    ob.content = enable;
    ob.userData = 0;
    var json = JSON.stringify(ob);
    ccc_lib_reqDataByCmd("",USER_OBJECT_ATTR_MODBYID,json,modifyMenu);//修改菜单
});
//点击弹出编辑菜单名称
$(".menuConfig .menus").on("click","button.modifyMenu",function(){
    $("#modifyMenu").show();
    move("modifyMenu","modifyMenuTop");
    var code = $(".menuList>li.active").attr("about");
    var name = $(".menuList>li.active>span").html();
    $("#modifyMenu>ul>li:nth-child(1)>input").val(name).attr("data-val",name);
    $("#modifyMenu>ul>li:nth-child(2)>span").html(code);
});
$("#modifyMenu>ul>li:nth-child(3) button,#modifyMenuTop>b").click(function(){
    $("#modifyMenu").hide();
});
//点击修改菜单名称
$("#modifyMenu").on("blur","li>input",function(){
    var val=$(this).val();
    var oldval=$(this).attr("data-val");
    if(val!=oldval){
        var code = $(".menuList>li.active").attr("about");
        var ob = new Object();
        ob.class = 2;
        ob.objId = "";
        ob.subId = parseInt(code);
        ob.attrId = 1;
        ob.content = val;
        ob.userData = 0;
        var json = JSON.stringify(ob);
        ccc_lib_reqDataByCmd("",USER_OBJECT_ATTR_MODBYID,json,modifyMenu);//修改菜单
    }
    
});
function modifyMenu(id,info,des){
    loadAlerts(des.desc);
    loadMenuList(1);
    loadTypesFn();
    $("#modifyMenu").hide();
};
//点击预二级菜单是否启用
$(".secondMenuList").on("click","li>button",function(){
    var code = $(this).attr("data-code");
    var enable = $(this).attr("about");
    enable = (enable==1)?"0":"1";

    var ob = new Object();
    ob.class = 2;
    ob.objId = "";
    ob.subId = parseInt(code);
    ob.attrId = 0;
    ob.content = enable;
    ob.userData = 0;
    var json = JSON.stringify(ob);
    ccc_lib_reqDataByCmd("",USER_OBJECT_ATTR_MODBYID,json,modifySecondMenu);//修改菜单
 });
 function modifySecondMenu(id,info,des){
    loadAlerts(des.desc);
    $(".menuList>li.active").click();
 };
//点击预警诊断是否启用
$(".diago").on("click","li>button",function(){
   var oldVal=$(this).attr("about");
   var sysid=$(this).attr("data-sysid");
   var visitid=$(this).attr("data-visitid");
   var enable;
   if(oldVal==1){
       enable="0";
   }else{
       enable="1";
   }
   var ob = new Object();
   ob.class = 7;
   ob.objId = sysid+"";
   ob.subId = parseInt(visitid);
   ob.attrId = 0;
   ob.content = enable;
   ob.userData = 0;
   var json = JSON.stringify(ob);
   ccc_lib_reqDataByCmd("",USER_OBJECT_ATTR_MODBYID,json,modifyMenu);//修改菜单
});


function menuAboutDev(model){
    var ob = new Object();
    ob.model = model;
    ob.userData = 0;
    var json = JSON.stringify(ob);
    console.log(ob);
    parent.ccc_lib_reqDataByCmd("",USER_ELEC_REPORT_SUMMARY_LIST,json,munuAboutModList);

};
function munuAboutModList(id,info,des){
    console.log(des);
    $("#addDev .ycyxs>li").remove();
    var htm="";
    for(var i=0;i<des.data.length;i++){
        htm+='<li about="'+des.data[i].tableId+'"><p><span title="'+des.data[i].name+'">'+des.data[i].name+'</span></p><p>' +
            '<span>地址：COM'+des.data[i].com+'-'+des.data[i].addr+'</span></p></li>'
    }
    $("#addDev .ycyxs").append(htm);
};
//确定关联
$("#addDev p>button.btn").click(function(){
    var abt=$("#addDev").attr("about");
   
    if(abt==2){//菜单配置
        var model= $("#addDev").attr("model");
        var seqId= $("#addDev").attr("seqId");
        var tbid= $("#addDev .ycyxs>li.active").attr("about");
        if(!tbid ){
            return false;
        }

        var ob = new Object();
        ob.seqId = parseInt(seqId);
        ob.model = model;
        ob.tableId = parseInt(tbid);
        ob.userData = 0;
        var json = JSON.stringify(ob);
        console.log(ob);
        parent.ccc_lib_reqDataByCmd(ob,ACDC_DEVTYPE_MOD_RELATION,json,reMenuModList);
    }else if(abt==1){//关联设备列表
        var boxid=$(".boxList>li.active").attr("data-id");
        var arr=[];
        var len=$("#addDev .ycyxs>li.active").length;
        if(len<=0){
            return false;
        }
        $("#addDev .ycyxs>li.active").each(function(){
            arr.push(parseInt($(this).attr("about")));
        });
        var ob = new Object();
        ob.boxId = boxid;
        ob.data = arr;
        ob.userData = 0;
        var json = JSON.stringify(ob);
        console.log(ob);
        parent.ccc_lib_reqDataByCmd("",ACDC_GRADE_RELATE_ELEC,json,reBoxAboutMod);
    }
});
function reMenuModList(id,info,des){
    loadAlerts(des.desc);
    $("#addDev").hide();
    if(des.result==0){
        // $('.factMods .facts  tbody tr[seqId='+info.seqId+'] td:nth-of-type(2)').text(info.content);
    }else{
    }
    $(".factMods .groups>tbody>tr.active").click();
};
function reMenuModList2(id,info,des){
    loadAlerts(des.desc);
    if(des.result==0){
        $('.factMods .facts  tbody tr[seqId='+info.seqId+']').find('td:nth-last-of-type(1),td:nth-last-of-type(2)').text('');
    }else{
        $(".factMods .groups>tbody>tr.active").click();
    }
};
function reBoxAboutMod(id,info,des){
    loadAlerts(des.desc);
    $("#addDev").hide();
    $(".boxList>li.active").click();
}
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

//厂家型号内容
//获取厂家列表
function loadFacts(type){
    var ob = new Object();
    ob.userData = parseInt(type);
    var json = JSON.stringify(ob);
    console.log(json);
    ccc_lib_reqDataByCmd("",ACCOUNT_PRODUCT_LIST_V25,json,ShowFactList);//获取厂家列表
};
//获取型号列表
function loadTypes(fact,type,Id){
        var ob = new Object();
        if(type==1||type==4){
            Id = fact;
            ob.productId = '';
        }else {
            ob.productId = fact;
        }
        ob.userData = parseInt(type);
        var json = JSON.stringify(ob);
        console.log(ob);
        ccc_lib_reqDataByCmd(Id,ACCOUNT_DEVICE_MODEL_LIST_V26,json,ShowTypeList);//获取型号列表

};
//更新设备型号下拉框
function loadTypesFn(o){
        var ob = new Object();
        ob.productId = '';
        ob.userData = o||0;
        var json = JSON.stringify(ob);
        console.log(ob);
        ccc_lib_reqDataByCmd('',ACCOUNT_DEVICE_MODEL_LIST_V26,json,ShowTypeListFn);//获取型号列表
};
function ShowTypeListFn(id,info,des){
    console.log(des);
    // console.log('%%%%%****1');
    if(des.result==0){
        var opts="";
        var lists="";
        $(".datamodal .devTypes").attr("data-tbid",0);
        $(".datamodal .devTypes>option").remove();
        $(".systemAlarm .agreements>ul>li").remove();
        for(var i=0;i<des.data.length;i++){
            if(des.data[i].seqId>0 && des.data[i].tableId>0){
                opts+='<option value="'+des.data[i].seqId+'" data-devtype="'+des.data[i].devType+'" data-tbid="'+des.data[i].tableId+'">'+des.data[i].name+'</option>';
                lists+='<li about="'+des.data[i].seqId+'" type="'+des.data[i].tableId+'"><img src="imgs/config8.png">'+des.data[i].name+'</li>';
               /* if( des.data[i].tableId>0){//系统配置告警预警里过滤使用且关联了点表的设备类型
                }*/
            }
        }
        $(".datamodal .devTypes").append(opts);
        var tbid=$(".datamodal .devTypes>option:nth-child(1)").attr('data-tbid');
        $(".datamodal .devTypes").attr("data-tbid",tbid);

        $(".systemAlarm .agreeContents .ycs>tbody>tr").remove();
        $(".systemAlarm .agreements>ul").append(lists);
        $(".systemAlarm .agreements>ul>li:nth-child(1)").click();
        if(des.userData==1){//子页面  数据类型
            $(".modalMenu>a:nth-child(1)").click();
            loadConfigedPoints();
        }
    }
};
var allTypes;
var CheckedType;
var allTypes2;
var models;
//返回型号列表
function ShowTypeList(id,info,des){
    console.log(des);
    if(des.userData==1){
        currentObj=des.data;
        var productId=info;
        $(".factMods .facts>tbody>tr").remove();
        var n=0;
        for(var i=0;i<des.data.length;i++){
            if(des.data[i].productId==productId){
                n++;
                $(".factMods .facts>tbody").append('<tr seqId="'+des.data[i].seqId+'" devType="'+des.data[i].devType+'" about='+des.data[i].model+' title='+des.data[i].name+'><td>'+n+'</td>' +
                    '<td>'+des.data[i].name+'</td><td>'+des.data[i].model+'</td><td>'+des.data[i].tbName+'</td><td>'+(des.data[i].tableId?des.data[i].tableId:"")+'</td></tr>');
            }
        }
        $(".factMods .facts>tbody>tr:first-child").click();

        // $(".factMods>ul>li:nth-child(2)>div").niceScroll();
    }else if(des.userData==2){
        allTypes='<option value="">未配置</option>';
        allTypes2='<option value="">未配置</option>';
        $(".factMods .facts>tbody>tr").remove();
        for(var i=0;i<des.data.length;i++){
            allTypes+='<option value="'+des.data[i].model+'">'+des.data[i].name+'</option>';
            allTypes2+='<option value="'+des.data[i].model+'">'+des.data[i].name+'('+des.data[i].model+')</option>';
        }

        if($("#creatBox").css("display")!="none"){
            $("#creatBox>ul>li:nth-child(5) select>option").remove();
            $("#creatBox>ul>li:nth-child(5) select").append(allTypes2);
            $("#creatBox>ul>li:nth-child(5) select").val('');
        }
        if($("#modifyBox").css("display")!="none"){
            $("#modifyBox>ul>li:nth-child(5) select>option").remove();
            $("#modifyBox>ul>li:nth-child(5) select").append(allTypes2);
            var val=$("#modifyBox>ul>li:nth-child(5) select").attr("data-val");
            $("#modifyBox>ul>li:nth-child(5) select").val(val);
        }

    }else if(des.userData==3){
        if(des.result==0){
            var val=$("#low_model .models").attr("data-val");
            for(var i=0;i<des.data.length;i++){
                if(val==des.data[i].model){
                    $("#low_model .models").text(des.data[i].name).attr('seqId',des.data[i].seqId);
                }
            }//end for
        }

    }else if(des.userData==4){
       
        currentObj = des.data;

    }

};
var products;
var allFacts;
var allFacts2;
var CheckedFac;
//返回厂家列表
function ShowFactList(id,info,des){
    console.log(des);
    if(des.userData==1){//创建修改删除编辑厂家型号

        $(".factMods .groups>tbody>tr").remove();
        for(var i=0;i<des.data.length;i++){
            $(".factMods .groups>tbody").append('<tr about='+des.data[i].productId+' title='+des.data[i].name+'><td>'+(i+1)+'</td><td>'+des.data[i].name+'</td><td>'+des.data[i].productId+'</td></tr>');
        }
        // $(".factMods>ul>li:nth-child(1)>div").niceScroll();
        if(CheckedFac){
            $(".factMods .groups>tbody>tr[about='"+CheckedFac+"']").click();
        }else{
            $(".factMods .groups>tbody>tr:first-child").click();
        }

    }else if(des.userData==2){//创建编辑柜子
        allFacts='<option value="">未配置</option>';
        allFacts2='<option value="">未配置</option>';
        $(".factMods .groups>tbody>tr").remove();
        for(var i=0;i<des.data.length;i++){
            allFacts+='<option value="'+des.data[i].productId+'">'+des.data[i].name+'</option>';
            allFacts2+='<option value="'+des.data[i].productId+'">'+des.data[i].name+'('+des.data[i].productId+')</option>';
        }
        if($("#creatBox").css("display")!="none"){
            $("#creatBox>ul>li:nth-child(4) select").append(allFacts2);
        
            $("#creatBox>ul>li:nth-child(4) select").val('');
       
            $("#creatBox>ul>li:nth-child(5) select").append('<option value="">未配置</option>');
        }
        if($("#modifyBox").css("display")!="none"){
            $("#modifyBox>ul>li:nth-child(4) select").append(allFacts2);
            var val= $("#modifyBox>ul>li:nth-child(4) select").attr("data-val");
            $("#modifyBox>ul>li:nth-child(4) select").val(val);
        }
    }else if(des.userData==3){//修改模块厂家型号
        console.log(des);
        if(des.result==0){
            var val=$("#low_model .products").attr("data-val");
            for(var i=0;i<des.data.length;i++){
                console.log(val +'***'+ des.data[i].productId);
                if(val==des.data[i].productId){
                    $("#low_model .products").text(des.data[i].name);
                }
            }//end for
            loadTypes(val,3);
        }
    }else if(des.userData==4){//修改模块厂家型号
        console.log(des);
        products='<option value="">未配置</option>';
        if(des.result==0){
            for(var i=0;i<des.data.length;i++){
                products+='<option value="'+des.data[i].productId+'">'+des.data[i].name+'</option>';
            }
            $(".devConfig .devMods>tbody select.products").append(products).each(function () {
                // $(this).append(products);
                var val=$(this).attr("data-val");
                $(this).val(val);
            });
        }
    }


};
//切换厂家
$(".factMods .groups>tbody").on("click","tr",function(){
    $(this).addClass("active").siblings("tr").removeClass("active");
    CheckedFac = $(this).attr("about");
    currentObj=[];
    loadTypes(CheckedFac,1);
});
//切换型号
$(".factMods .facts>tbody").on("click","tr",function(){
    $(this).addClass("active").siblings("tr").removeClass("active");
    CheckedType=$(this).attr("about");
});
//打开新建厂家
$(".factMods>ul>li:nth-child(1)").on("click","p:first-child>button:nth-child(1)",function(){
    $("#creatFac").show();
    move("creatFac","creatFacTop");
    $(".creatFac>li:nth-child(1)>input").val("");
    $(".creatFac>li:nth-child(2)>input").val("");
});
//关闭新建厂家框
$("#creatFac>p>b").click(function(){
    $("#creatFac").hide();
});
//点击新建厂家提交按钮
$("#creatFac").on("click","p:last-child>button",function(){
    var name=$(".creatFac>li:nth-child(1)>input").val();
    var facid=$(".creatFac>li:nth-child(2)>input").val();
    //var grouopid=$(".factMods .groups>tbody>tr.active").attr("about");
    if(!name || !facid){
        loadAlerts("新建厂家或ID不能为空！");
        return false;
    }
    if(facid.length>32){
        loadAlerts("厂家ID长度最大为32个字符！");
        return false;
    }
    if(byteLength(name)>64){
        loadAlerts("名称最多只能输入64个字符或21个汉字！");
        return false;
    }
    var reg = /^[0-9a-zA-Z_-]+$/;
    if(!reg.test(facid)){
        loadAlerts("厂家ID只能输入数字、字母、下划线以及'-'！");
        return false;
    }
    var ob = new Object();
    ob.name = name;
    ob.productId = facid;
    //ob.groupId=grouopid;
    ob.userData = 0;
    console.log(ob);
    var json = JSON.stringify(ob);
    ccc_lib_reqDataByCmd(facid,PRODUCT_CREATE_V26,json,creatFac);//新建新建厂家
});
//新建厂家返回
function creatFac(id,info,des){
    loadAlerts(des.desc);
    if(des.result==0){
        CheckedFac = info;
        $("#creatFac").hide();
        loadFacts(1);
    }else{
    }
};
//打开编辑厂家框
$(".factMods>ul>li:nth-child(1)").on("click","p:first-child>button:nth-child(2)",function(){
    var checked=$(".factMods .groups>tbody>tr.active").length;
    if(checked==0){
        loadAlerts("请先选择一个厂家,然后进行编辑!");
        return false;
    }else if(checked==1){
        $("#modifyFac").show();
        move("modifyFac","modifyFacTop");
        var id=$(".factMods .groups>tbody>tr.active").attr("about");
        var cn=$(".factMods .groups>tbody>tr.active").attr("title");
        $(".modifyFac>li:nth-child(1)>input").val(cn);
        $(".modifyFac>li:nth-child(2)>span").html(id);
    }
});
//关闭编辑厂家框
$("#modifyFac>p>b").click(function(){
    $("#modifyFac").hide();
});
//编辑厂家提交按钮
$("#modifyFac").on("click","p:last-child>button",function(){
    var names=$(".modifyFac>li:nth-child(1)>input").val();
    var facid=$(".modifyFac>li:nth-child(2)>span").html();
    var ob = new Object();
    ob.class = 4;
    ob.objId = facid;
    ob.subId = 0;
    ob.attrId = 0;
    ob.content = names;
    ob.userData = 0;
    console.log(ob);
    var json = JSON.stringify(ob);
    ccc_lib_reqDataByCmd("",USER_OBJECT_ATTR_MODBYID,json,modifyFact);//修改厂家

});
function modifyFact(id,info,des){
    loadAlerts(des.desc);
    if(des.result==0){
        $("#modifyFac").hide();
    }else{
    }
    loadFacts(1);
};
//删除厂家
$(".factMods>ul>li:nth-child(1)").on("click","p:first-child>button:nth-child(3)",function(){
    var checked=$(".factMods .groups>tbody>tr.active").length;
    if(checked==0){
        loadAlerts("请选择一个厂家，然后进行删除操作!");
        return false;
    }else if(checked==1){
        // var con=confirm("确认删除该厂家吗？");
        // if(con){
            var facid=$(".factMods .groups>tbody>tr.active").attr("about");
            var ob = new Object();
            ob.productId = facid;
            ob.userData = 0;
            var json = JSON.stringify(ob);
            ccc_lib_reqDataByCmd("",PRODUCT_DELETE_V26,json,deleteFac);//删除厂家
        // }
    }
});
//删除厂家返回
function deleteFac(id,info,des){
    loadAlerts(des.desc);
    if(des.result==0){
        $(".factMods .groups>tbody>tr").each(function(){
            if($(this).attr("about")==CheckedFac){
                if($(this).next().length!=0){
                    $(this).next().click();
                    $(this).remove();
                    return false;
                }else{
                    $(this).prev().click();
                    $(this).remove();
                    return false;
                }
            }
        });
    }else{
        loadFacts(1);
    }
};
//点击新建型号
$(".factMods>ul>li:nth-child(2)>p:first-child>button:nth-child(1)").click(function(){
    if(currentObj.length>=50){
        loadAlerts('操作失败！数量最多为50');
        return;
    }
    $("#creatType").show();
    move("creatType","creatTypeTop");
    $(".creatType>li:nth-child(1)>input").val("");
    $(".creatType>li:nth-child(2)>input").val("");
});
//新建型号提交按钮
$("#creatType>p:last-child>button").click(function(){
    var id=$("#creatType .creatType>li:nth-child(2)>input").val();
    var name=$("#creatType .creatType>li:nth-child(1)>input").val();
    if(id.length>32){
        loadAlerts("型号最大长度为32个字符！");
        return false;
    }

    var reg = /^[0-9a-zA-Z_-]+$/;
    if(!reg.test(id)){
        loadAlerts("型号ID只能输入数字、字母、下划线以及'-'！");
        return false;
    }

    var seqId = 1;
    currentObj = currentObj.sort(compare('seqId'));
    for (var i = 0; i < currentObj.length; i++) {
        var theId = currentObj[i].seqId;
        if(theId==seqId){
            seqId++;
        }
    }

    var ob = new Object();
    ob.productId = CheckedFac;
    ob.name = name;
    ob.model = id;
    ob.seqId = seqId;
    ob.userData = 0;
    var json = JSON.stringify(ob);
    console.log(ob);
    ccc_lib_reqDataByCmd("",MODEL_RULE_CREATE_V26,json,CreatModType);//创建型号
});
function CreatModType(id,info,des){
    loadAlerts(des.desc);
    if(des.result==0){
        $(".factMods .groups>tbody>tr.active").click();
        $("#creatType").hide();
        $("#creatType input").val("");
    }else{

    }
};
//点击编辑型号
$(".factMods>ul>li:nth-child(2)>p:first-child>button:nth-child(2)").click(function(){
    var checked=$(".factMods .facts>tbody>tr.active").length;
    if(checked==0){
        loadAlerts("请先选择一个型号,然后进行编辑!");
        return false;
    }else if(checked==1){
        $("#modifyType").show();
        move("modifyType","modifyTypeTop");
        var id=$(".factMods .facts>tbody>tr.active").attr("about");
        var cn=$(".factMods .facts>tbody>tr.active").attr("title");
        $(".modifyType>li:nth-child(1)>input").val(cn);
        $(".modifyType>li:nth-child(2)>span").html(id);
    }
});
//编辑型号提交按钮
$("#modifyType").on("click","p:last-child>button",function(){
    var names=$(".modifyType>li:nth-child(1)>input").val();
    var modid=$(".modifyType>li:nth-child(2)>span").html();
    var ob = new Object();
    ob.class = 5;
    ob.objId = modid;
    ob.subId = 0;
    ob.attrId = 0;
    ob.content = names;
    ob.userData = 0;
    console.log(ob);
    var json = JSON.stringify(ob);
    ccc_lib_reqDataByCmd(ob,USER_OBJECT_ATTR_MODBYID,json,modifyType);//修改型号

});
function modifyType(id,info,des){
    loadAlerts(des.desc);
    console.log(des);
    if(des.result==0){
        $("#modifyType").hide();
        $('.factMods .facts  tbody tr[about='+info.objId+'] td:nth-of-type(2)').text(info.content);
    }else{
        $(".factMods .groups>tbody>tr.active").click();
    }

};
//删除型号
$(".factMods>ul>li:nth-child(2)").on("click","p:first-child>button:nth-child(3)",function(){
    var checked=$(".factMods .facts>tbody>tr.active").length;
    if(checked==0){
        loadAlerts("请选择一个型号，然后进行删除操作!");
        return false;
    }else if(checked==1){
        // var con=confirm("确认删除该型号吗？");
        // if(con){
            var modid=$(".factMods .facts>tbody>tr.active").attr("about");
            var ob = new Object();
            ob.model = modid;
            ob.userData = 0;
            var json = JSON.stringify(ob);
            console.log(ob);
            ccc_lib_reqDataByCmd("",MODEL_RULE_DELETE_V26,json,deleteType);//删除型号
        // }
    }
});
//删除型号返回
function deleteType(id,info,des){
    loadAlerts(des.desc);
    if(des.result==0){
        /*var id= $(".factMods .facts>tbody>tr.active").attr("about");
        $(".factMods .facts>tbody>tr").each(function(){
            if($(this).attr("about")==id){
                if($(this).next().length!=0){
                    $(this).next().click();
                    $(this).remove();
                    return false;
                }else{
                    $(this).prev().click();
                    $(this).remove();
                    return false;
                }
            }
        });*/
        $(".factMods .groups>tbody>tr.active").click();
    }else{
        $(".factMods .groups>tbody>tr.active").click();
    }
};
// 关联点表
$(".factMods>ul>li:nth-child(2)>p:first-child>button:nth-child(4)").click(function () {
    var len =  $('.factMods .facts tr.active').length;
    if(!len){
        loadAlerts("请选择一个型号");
        return ;
    }
    var model = $('.factMods .facts tr.active').attr('about');
    var seqId = $('.factMods .facts tr.active').attr('seqId');
    $("#addDev").show().attr("about",2).attr('model',model).attr('seqId',seqId);
    menuAboutDev(model);
    move("addDev","addDevTop");
});
// 取消关联
$(".factMods>ul>li:nth-child(2)>p:first-child>button:nth-child(5)").click(function () {
    var len =  $('.factMods .facts tr.active').length;
    if(!len){
        loadAlerts("请选择一个型号");
        return ;
    }
    var seqId = $('.factMods .facts tr.active').attr('seqId');
    var model = $('.factMods .facts tr.active').attr('about');
    var ob = new Object();
    ob.seqId = parseInt(seqId);
    ob.model = model;
    ob.tableId = 0;
    ob.userData = 0;
    var json = JSON.stringify(ob);
    console.log(ob);
    parent.ccc_lib_reqDataByCmd(ob,ACDC_DEVTYPE_MOD_RELATION,json,reMenuModList2);
});
//文件导入导出功能
function typeNameSw(n) {
    var Val = "";
    switch (parseInt(n)) {
        case 2: Val = "NetworkDatabase.db";break;
        case 3: Val = "SystemDatabase.db";break;
        case 4: Val = "PointDatabase.db";break;
        case 5: Val = "AcDcDatabase.db";break;
        default:  break;
    }
    return Val;
};
//导入导出 切换导入的文件类型
$('.export>div:nth-child(2) select[name=type]').on('change',function (){
    var type = $(this).val();
    var typeName =typeNameSw(type);
    $('.alertText2 span').text(typeName);
});
// 工程配置 导入
$("#inputFile1").change(function (e) {
    var file = $(this).get(0).files[0];
    if(!file){
        return;
    }
    var type = $('.export>div:nth-child(2) .fileType select').val();
    var typeName =typeNameSw(type);
    console.log(file.name);
    console.log(typeName);
    if(file.name==typeName){
        inputFn(file,typeName,parseInt(type));
        $('.input_alert .text').text('正在导入工程配置文件');
    }else {
        loadAlerts("导入失败！文件名错误");
    }
    e.target.value='';
});
var fileName;
//导出
$('.export .outputBtn').on('click',function () {
    fileObj.arr=[];
    fileObj.size = 0;
    var type = $('.export>div:nth-child(6) .fileType select').val();
    var typeName =typeNameSw(type);
    fileName = typeName;
    $('.input_alert .text').text('工程配置文件下载中');
    outputFn(parseInt(type));
});
// 清除导入文件
$('.export .clearInputBtn').on('click',function () {
    $('.clear_inputBtn_alert').show();
    $('.clear_inputBtn_alert footer').show();
});
$('.clear_inputBtn_alert .close,.clear_inputBtn_alert .btn2').click(function(){
    $('.clear_inputBtn_alert').hide();
});
$('.clear_inputBtn_alert .success').on('click',function () {
    transmitFileGenrate(0);
});
//清除导入文件
function transmitFileGenrate(type){
    var ob = new Object();
    ob.type = type;
    ob.userData = type;
    console.log(ob);
    var json = JSON.stringify(ob);
    ccc_lib_reqDataByCmd("",USER_TRANSMIT_FILE_GENERATE, json, transmitFileGenrateFn);
};
function transmitFileGenrateFn(id, info, oRet) {
    console.log(oRet);
    loadAlerts(oRet.desc);
    $('.clear_inputBtn_alert').hide();
};


// 导入导出 导入
function inputFn(file,name,type){
    var chunk = fileObj.sliceLenth;
    var chunks = [];
    var start = 0;
    //文件分片
    for (var i = 0; i < Math.ceil(file.size / chunk); i++) {
        //最后一段取文件的真实大小
        var end = 0;
        if(i == (Math.ceil(file.size / chunk)-1)){
            end = file.size;
        }else{
            end = start + chunk;
        }
        chunks[i] = file.slice(start , end);
        start = end;
    }
    fileObj.arr=chunks;
    fileObj.size = file.size;
    // 8034
    var ob = new Object();
    ob.type = type;
    // ob.name = file.name;
    ob.name = name;
    ob.size = file.size;
    ob.userData = 0;
    console.log(ob);
    var json = JSON.stringify(ob);
    ccc_lib_reqDataByCmd('',USER_POST_FILE_PREPARE, json,postFilePrepareFn);
    $('.input_alert').show();
    $('.input_alert .processNum01').text('0%');
    $('.input_alert .processBar01').css("width",  "0px");
};
// 导入导出 导出
function outputFn(type){
    // 8043
    var ob = new Object();
    ob.type = type;
    ob.name = fileName;
    ob.userData = 0;
    console.log(ob);
    var json = JSON.stringify(ob);
    ccc_lib_reqDataByCmd('',USER_GET_FILE_PREPARE, json,getFilePrepareFn);
    $('.input_alert').show();
    $('.input_alert .processNum01').text('0%');
    $('.input_alert .processBar01').css("width",  "0px");
};
//准备发送数据返回 导入
function postFilePrepareFn(id, info, oRet) {
    // console.log(oRet);
    if (oRet.result == 0) {
        var num = oRet.userData;
        var start = num*fileObj.sliceLenth;
        if(fileObj.size > start ){//没发完
            var progress = start/fileObj.size*100;
            $('.input_alert .processNum01').text(progress.toFixed(1) + "%");//数显进度
            $('.input_alert .processBar01').css("width", progress*2 + "px");//图显进度}, false);
            var reader = new FileReader();
            reader.readAsDataURL(fileObj.arr[num]);//转化二进制流，异步方法
            reader.onload = function() {//完成后this.result为二进制流
                var base64Str = this.result;
                var startNum = base64Str.indexOf("base64,");
                startNum = startNum * 1 + 7;
                //去除前部格式信息（如果有需求）
                var baseStr = base64Str.slice(startNum);
                // console.log(baseStr);
                var ob = new Object();
                ob.pos = start;
                ob.len = fileObj.arr[num].size;
                ob.body = baseStr;
                ob.userData = num+1;
                // console.log(ob);
                var json = JSON.stringify(ob);
                ccc_lib_reqDataByCmd("", USER_POST_FILE_START, json, postFilePrepareFn);
            };
        }else {//发完
            var progress = 100;
            $('.input_alert .processNum01').text(progress.toFixed(1) + "%");//数显进度
            $('.input_alert .processBar01').css("width", progress*2 + "px");//图显进度}, false);
            var ob = new Object();
            ob.operate = 1;//导入
            ob.userData = 0;
            // console.log(ob);
            var json = JSON.stringify(ob);
            ccc_lib_reqDataByCmd("", USER_POST_GET_FILE_END, json, sendDataOver);
        }

    }else{
        $('.input_alert').hide();
        fileObj.arr=[];
        loadAlerts(oRet.desc);
    }//end oRet.result == 0
};
//发送数据完毕返回 导入
function sendDataOver(id, info, oRet) {
    fileObj.arr=[];
    console.log(oRet);
    if (oRet.result == 0) {

        $('.input_alert .text').text('文件上传成功！');
        $('.input_alert').fadeOut(1200);


    } else {
        $('.input_alert').hide();
        loadAlerts(oRet.desc);
    }
};
//准备接收数据返回 导出
function getFilePrepareFn(id, info, oRet) {
    // console.log(oRet);
    if (oRet.result == 0) {
        if(oRet.size){
            fileObj.size = oRet.size;
        }
        var num = oRet.userData;
        var start = num*fileObj.sliceLenth;
        if(num>0){
            fileObj.arr[num-1]= dataURItoBlob('data:application/octet-stream;base64,'+oRet.body);
            // fileObj.arr[num-1]= oRet.body;
        }
        if(fileObj.size > start){//没发完
            var progress = start/fileObj.size*100;
            $('.input_alert .processNum01').text(progress.toFixed(1) + "%");//数显进度
            $('.input_alert .processBar01').css("width", progress*2 + "px");//图显进度}, false);
            var afterLen = fileObj.size-start;
            var newBflen = ((afterLen <= fileObj.sliceLenth) ? (afterLen) : (fileObj.sliceLenth));
            var ob = new Object();
            ob.pos = start;
            ob.len = newBflen;
            ob.userData = num+1;
            // console.log(ob);
            var json = JSON.stringify(ob);
            ccc_lib_reqDataByCmd("", USER_GET_FILE_START, json, getFilePrepareFn);
        }else {//发完
            var progress = 100;
            $('.input_alert .processNum01').text(progress.toFixed(1) + "%");//数显进度
            $('.input_alert .processBar01').css("width", progress*2 + "px");//图显进度}, false);
            var ob = new Object();
            ob.operate = 2;//导出
            ob.userData = 0;
            console.log(ob);
            var json = JSON.stringify(ob);
            ccc_lib_reqDataByCmd("", USER_POST_GET_FILE_END, json, sendDataOver2);
            
        }
    } else {
        $('.input_alert').hide();
        fileObj.arr=[];
        loadAlerts(oRet.desc);
    }
};
//发送数据完毕返回 导出
function sendDataOver2(id, info, oRet) {
    // console.log(oRet);
    if (oRet.result == 0) {
        $('.input_alert .text').text('文件下载成功！');
        $('.input_alert').fadeOut(1200);
        // console.log(fileObj.arr);
        var theBigBlob = new Blob(fileObj.arr);
        var a = document.createElement('a') ;
        var bUrl = window.URL.createObjectURL(theBigBlob);
        a.download = fileName;
        a.href = bUrl;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        fileObj.arr=[];
    } else {
        $('.input_alert').hide();
        loadAlerts(oRet.desc);
    }
};


function dataURItoBlob(base64Data) {
    //console.log(base64Data);//data:image/png;base64,
    var byteString;
    if(base64Data.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(base64Data.split(',')[1]);//base64 解码
    else{
        byteString = unescape(base64Data.split(',')[1]);
    }
    var mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];//mime类型 -- image/png

    // var arrayBuffer = new ArrayBuffer(byteString.length); //创建缓冲数组
    // var ia = new Uint8Array(arrayBuffer);//创建视图
    var ia = new Uint8Array(byteString.length);//创建视图
    for(var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    var blob = new Blob([ia], {
        type: mimeString
    });
    return blob;
};
// JS对象数组根据属性排序
function compare(property) {
    return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
    }
};
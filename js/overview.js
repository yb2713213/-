var mainEmapNo = 0; //主图
var onlyEmapNo = 0; //是否只有唯一系统
var timeId = null;
var timer1 = null;//底部告警定时器
var alertArrStr = '';//底部告警数组
var bigTitle = 'EMT交直流电源系统';
var startdate = startdateFn();
var enddate = startdateFn();
//切换左边菜单导航栏
$("#maps .menus>a").click(function () {
    $(this).addClass("active").siblings("a").removeClass("active");
    var name = $(this).children("span").html();
    var emapNo = $(this).attr("emapNo");
    parent.pages = emapNo;
    $('#maps .mapBox').hide();
    $('#maps .sonMap').show();
    $('#maps .bottom').css('width','1024px').find('.times').show();
    $('#maps .bottom .alarmBox').css('width','83%');
    configMap(emapNo);//电气图
    // parent.$("#frames").show().siblings().hide();
    parent.$("#loadIn>b").show();
    parent.$("#loadIn>b:nth-child(8)").hide();
    parent.$("#loadIn>a").hide();
    parent.$("#loadIn>u").html(name).show();
});
//设备详情
$('#maps .sonMap .stn').on('click', function () {
    // parent.$("#loadIn>b").show();
    console.log(parent.pages);
   
    if (!onlyEmapNo) {
        parent.$("#loadIn>b.back").show().attr('about',2);
    } else {
        parent.$("#loadIn>b.back").hide();
    }
    parent.$("#frames").show().siblings().hide();
    window.parent.frames[1].location.href = "ACmodal.html";
    parent.$("#loadIn>b.return").show();
    parent.$("#loadIn>a").hide();
  
    clearIntervalTimeId();
    
});
//主电气图点击跳转
$("#mainMap").on('click', '.elemBox[num]', function () {
    var type = $(this).attr('box-type');
    $('#maps .menus>a[emapNo=' + type + ']').click();
});
//子电气图点击跳转
$("#myCanvas").on('click', '.elemBox[num]', function () {
    var recordId = $(this).attr('data-recordId');
    var boxId = $(this).attr('box-id');
    parent.checkedModId = recordId;
    parent.checkedBoxId = boxId;
    console.log(recordId+'***'+boxId);
    $('#maps .sonMap .stn').click();
});
//子电气图点击跳转
$("#myCanvas").on('click', '.elemBox[img-type=7016],.elemBox[img-type=7017],.elemBox[img-type=7018]', function () {
    var imgType = $(this).attr('img-type');
    var theId = parseInt(imgType)-6990;
    parent.checkedAfterCurType = theId;
    console.log(theId);
    $('#maps .sonMap .stn').click();
});


//获取主标题
function getSysparaGetbyid() {
    var o = new Object();
    o.id = 6;
    o.userData = 0;
    var m_json = JSON.stringify(o);
    console.log(o);
    parent.ccc_lib_reqDataByCmd("", USER_SYSPARA_GETBYID, m_json, getSysparaGetbyidFn);
}

function getSysparaGetbyidFn(id, info, oRet) {
    /*console.log(oRet);*/
    if (oRet.result == 0) {
        bigTitle = oRet.content
    }
}

//获取电气图 菜单
function loadMenuListFn() {
    getSysparaGetbyid();
    parent.checkedModId = null;//清空;
    parent.checkedBoxId = null;//清空;
    parent.checkedAfterCurType = null;//清空;
    var ob = new Object();
    ob.type = 1;
    ob.userData = 1;
    var json = JSON.stringify(ob);
    parent.ccc_lib_reqDataByCmd("", ACDC_MENU_CONF_LIST, json, showMenuListFn);
}

function showMenuListFn(id, info, oRet) {
    console.log(oRet);
    if (oRet.result == 0) {
        var num = 0;
        var emapNo = mainEmapNo;
        var ii = 0;
        $('#maps .mapBox .menus a.active').removeClass('active');
        for (var i = 0; i < oRet.data.length; i++) {
            var n = parseInt(oRet.data[i].code / 10000000);
            if(oRet.data[i].code==10010000){
                if (oRet.data[i].enable == 1 && parent.$("header #loadIn .return").is(':hidden')){
                    parent.$("header #loadIn [about='operats']").show();
                }else {
                    parent.$("header #loadIn [about='operats']").hide();
                }
            }
            if (oRet.data[i].enable == 1) {
                num++;
                if (num == 1) {
                    emapNo = n;
                    ii = i;
                }
            }
            $('#maps .mapBox .menus a[emapNo=' + n + ']').css({'display': (oRet.data[i].enable ? 'inline-block' : 'none')}).find('span').text(oRet.data[i].name);
        }
        if (num == 0) {
            $('#maps .mapBox').show();
            $('#maps .sonMap').hide()
            configMap(mainEmapNo);//电气图 主图
        } else if (num == 1) {
            onlyEmapNo = 1;
            $('#maps .mapBox').hide();
            $('#maps .sonMap').show();
            console.log('***********' + emapNo);
            configMap(emapNo);//电气图 分图
            parent.$("header .logoTitle").text(oRet.data[ii].name);
            // parent.$("#loadIn>u").html(oRet.data[emapNo-1].name).show();
            parent.pages = emapNo;
        } else if (num > 1) {
            onlyEmapNo = 0;
            $('#maps .mapBox').show();
            $('#maps .sonMap').hide();
            configMap(mainEmapNo);//电气图 主图
            parent.$("header .logoTitle").text(bigTitle);
        }

    } else {
        alert(oRet.desc);
    }
}

//获取告警
function deviceAlarmGetbypage(m){
    var ob = new Object();
    ob.pageIndex = 1;
    ob.num = 5;
    ob.level = 0;//101所有告警，102严重告警，103普通告警
    ob.alarmType = parseInt(m)+100;//1遥信遥测 2通信 100主系统 101交流 102直流 103通信 104逆变 105UPS
    ob.startTime = startdate;
    ob.endTime = enddate;
    ob.devType = 0;
    ob.userData = 0;
    // console.log(ob)
    var json = JSON.stringify(ob);
    parent.ccc_lib_reqDataByCmd("",USER_HISTORY_ALARM_GETBYPAGE_V26,json,deviceAlarmGetbypageFn);
    // deviceAlarmGetbypageFn();
}
function deviceAlarmGetbypageFn(id,info,des) {
    if (des.result == 0) {
       /* var arr1=[
          /!*  {'startTime':'2021-08-11 14:25:33', 'name':'告警测试1-蓄电池1号单体电压过压蓄电池4号单体电压过压'},
            {'startTime':'2021-08-11 14:25:33', 'name':'告警测试2-蓄电池2电压过压'},*!/
            {'startTime':'2022-00-00 00:00:00', 'name':'告警测试数据-该条数据是在没有当前告警的情况下出现，仅用于测试展示。'}
        ];
        if(!des.data.length){
            des.data=arr1;
        }*/
        if(des.data.length>5){ //限制最多显示前五条
            var arr=des.data.slice(0,5);
        }else {
            var arr=des.data;
        }

        var newStr = JSON.stringify(arr);
        if(arr.length==0){
            clearInterval(timer1);
            timer1=null;
        }
        if(alertArrStr != newStr){//当告警发生变化
        // if(1){//当告警发生变化
            alertArrStr = newStr;
            alarmListFn(arr);
            console.log("*************告警");
            console.log(arr);
        }

    }
}
// 滚动告警
var w = 0;
var num = 0;
function alarmListFn(arr) {
    clearInterval(timer1);
    timer1=null;
    w = 0;
    num = 0;
    $('.alarmBox ul').empty().css({left: 0});
    if(!arr.length){
        return false;
    }
    var str= '';

    for (var i = 0; i < arr.length; i++) {
        var obj = arr[i];
        str +=  '<li><p><span>【' + (i+1) + '】</span><span>' + obj.comment + '</span> <span>' + obj.startTime + '</span></p></li>';
    }//end for

    $('.alarmBox ul').append(str)

    setTimeout(function () {
        $('.alarmBox ul').find("li").each(function () {
            w += $(this).width()+50;
        });
        w = Math.ceil(w);
        // var boxWidth = $(".bottom .alarmBox").width();
        var boxWidth = 850;
        $('.alarmBox ul').append(str);
        if(w>boxWidth){
            $('.alarmBox ul').width(w*2);
        }else {
            w = boxWidth;
            $('.alarmBox ul').width(boxWidth*2);
            var liWidth = Math.floor(boxWidth/arr.length)-50;
            if(liWidth<100){
                liWidth =800;
            }
            $('.alarmBox ul').find("li").width(liWidth);
        }

        goTop();
        //设置滚动速度
        timer1 = setInterval(goTop, 20);

    },0)







}

function goTop(){
  /*  $('.alarmBox ul').animate({'left':'-'+w+'px'},10000,"linear",function () {
        $('.alarmBox ul').css({left: 0});
    });*/
    if (num == -w) {
        num = 0;
    }
    num -= 1;
    $('.alarmBox ul').css({left: num})
}
$('.alarmBox ul').on('click',function () {
    if(timer1){
        clearInterval(timer1);
        timer1=null;
        setTimeout(function () {
            clearInterval(timer1);
            timer1 = setInterval(goTop, 20);
        },10000);
    }else {
        goTop();
        clearInterval(timer1);
        timer1 = setInterval(goTop, 20);
    }

});



getTime();
setInterval("getTime()", 1000);
function startdateFn() {
    //三十天之前日期
    var myDate = new Date();
    var lw = new Date(myDate - 1000 * 60 * 60 * 24 * 30);//最后一个数字30可改，30天的意思
    var lastY = lw.getFullYear();
    var lastM = lw.getMonth()+1;
    var lastD = lw.getDate();
    var d=lastY+"-"+(lastM<10 ? "0" + lastM : lastM)+"-"+(lastD<10 ? "0"+ lastD : lastD);//三十天之前日期
    return d+" 00:00:00";
}


//清除定时器
function clearIntervalTimeId() {
    clearInterval(timeId);
    // clearInterval(timer1);
}

function getTime() {
    var time = new Date();
    var y = time.getFullYear();
    var mon = time.getMonth() + 1;
    var day = time.getDate();
    var h = time.getHours();
    var min = time.getMinutes();
    var sec = time.getSeconds();
    if (mon < 10) {
        mon = "0" + mon;
    }
    if (day < 10) {
        day = "0" + day;
    }
    if (h < 10) {
        h = "0" + h;
    }
    if (min < 10) {
        min = "0" + min;
    }
    if (sec < 10) {
        sec = "0" + sec;
    }
    var myTime = y + "-" + mon + "-" + day + "  " + h + ":" + min + ":" + sec;
    $("#maps .times").html(myTime);
    $("#maps .theTime").html(myTime);
    enddate = y + "-" + mon + "-" + day + " " + h + ":" + min + ":" + sec;
}

(function (window, undefined) {
    /**
     * Created by Administrator on 2019-10-18.
     */
    var g_imgMapObj = new Object();//9047 电气图对象
    var g_modelList = new Object();//7026 设备列表
    var g_dataList = new Object();//7025  数据列表
    var alltype = new Object();
    var menu = '';
    var monCabType = 0;//当等于6时，为从安防页进入函数
    function configMap(m, CabType) {
        monCabType = CabType || 0;
        menu = m.toString();
        alltype.mapBox = m == mainEmapNo ? "mainMap" : "myCanvas";
        console.log("*****************电气图配置********************");
        // myCanvas.style.display = "block";
        $("#" + alltype.mapBox + " .elemBox").remove();
        load_pro_config();
        // $("#maps>div>div").css("height", "940px");//解决滚动条问题
    }

    function load_pro_config() {
        var ob = new Object();
        ob.emapNo = menu;//编号 
        ob.userData = 0;
        var json = JSON.stringify(ob);
        parent.ccc_lib_reqDataByCmd("", USER_DOWNLOAD_FILE, json, downLoad400vFile);
        // deviceAlarmGetbypage(menu);
    }

//load_pro_config 的回调函数
    function downLoad400vFile(id, info, oRet) {
        if (oRet.result == 0) {
            var offsetObj = $("#" + alltype.mapBox + "").offset().top;//记录滚动出屏幕的距离
            var content = JSON.parse(oRet.content);
            show_configed(content);
            loadLowMod2();//7026
            clearInterval(timeId);
            timeId = setInterval(function () { //每二十秒在没有滚动的情况下更新一次数据
                if (offsetObj == $("#" + alltype.mapBox + "").offset().top) {
                    loadLowMod2(parent.g_strSelStnId);//7026
                } else {
                    offsetObj = $("#" + alltype.mapBox + "").offset().top;
                }
                // console.log("*********************666");
            }, 5000);
        } else {
            myCanvas.style.background = "";
        }//end else
    }//end fn

    function show_configed(obj) {
        var alarmslong = true;//判断安防告警是否拉长
        g_imgMapObj = obj.data;
        var mydata = obj.data.content;
        console.log(obj.data);
        console.log("地图数据****************");
        myCanvas.style.background = "";
        var downArr = [4013, 3018, 5];//需要降级的图片
        $("#" + alltype.mapBox + "").css({"width": obj.data.width + "px", "height": obj.data.height + "px","overflow": "hidden"});
        $("#" + alltype.mapBox + " .elemBox").remove();
        for (var i = 0; i < mydata.length; i++) {
            if (mydata[i].type == 2011 && alarmslong && monCabType == 6) {
                alarmslong = false;
                $("section > ul > li:nth-child(2) > div > ul > li:first-child").show();
                $("section > ul > li:nth-child(2) > div > .title").show();
                $("section > ul > li:nth-child(2) > div > ul > li:nth-child(2) > div.alarms").height(390);
            }
            var strObj = {};
            // 关联的设备信息
            strObj.associatedStr = '';
            if (mydata[i].associatedArr.length) {
                var ob = new Object();
                ob.com = mydata[i].associatedArr[0].com || '';
                ob.addr = mydata[i].associatedArr[0].addr || '';
                ob.devType = mydata[i].associatedArr[0].devType || '';
                ob.boxId = mydata[i].associatedArr[0].boxId || '';
                ob.name = mydata[i].associatedArr[0].name || '';
                strObj.associatedStr = 'title="' + ob.name + '" num="' + i + '" data-gtw="' + ob.com + '" data-mod="' + ob.addr + '" data-type="' + ob.devType + '" box-id="' + ob.boxId + '"';
            }
            strObj.allStr = '<div class="elemBox" ' + strObj.associatedStr + '  img-type="' + mydata[i].type + '"' +
                'style="position: absolute;width: 0; transform:scale(1);left:' + mydata[i].sitObj.left + 'px;top:' + mydata[i].sitObj.top + 'px;' + (downArr.indexOf(mydata[i].type) == -1 ? 'z-index: 1;' : '') + '">';
            if (mydata[i].type == 1 || mydata[i].type == 2) {
                strObj.imgSrc = '<main style="float:left;padding:' + (mydata[i].type == 1 ? '4px 0' : '0 4px') + ';transform:rotate(' + mydata[i].sitObj.r + 'deg);height:' + mydata[i].sitObj.h + 'px;width:' + mydata[i].sitObj.w +
                    'px;display: inline-block;"><div style="width:100%;height: 100%;background-color: ' + mydata[i].sitObj.color + ';display: inherit;"></div></main>';
            } else if (mydata[i].type == 6001) {//半圆
                strObj.imgSrc = '<main style="float:left;padding:7px;transform:rotate(' + mydata[i].sitObj.r + 'deg);height:' + (mydata[i].sitObj.h - 4) + 'px;width:' + mydata[i].sitObj.w +
                    'px;display: inline-block;"><div style="height: 100%;border-top-right-radius: 60px;border-bottom-right-radius: 60px;border: 2px solid;' +
                    'border-left-width:0;border-color: ' + (mydata[i].sitObj.color || 'rgba(255,255,255,.3)') + ';display: inherit;"></div></main>';
            } else if (mydata[i].type == 4017) {
                strObj.imgSrc = '<main class="alertsBoxDC" style="position:relative;display: inline-block;width:' + mydata[i].nameSitObj.w + 'px;transform:scale(' + mydata[i].nameSitObj.scale + ');left:' + mydata[i].nameSitObj.left + 'px;color:'
                    + mydata[i].nameSitObj.color + ';top:' + mydata[i].nameSitObj.top + 'px;font-weight: 400;font-size: 12px;"></main>';
            } else if (mydata[i].type == 3018) {
                strObj.imgSrc = '<main img-src="testTool/configMap/' + mydata[i].src + '" style="position:relative;background: url(testTool/configMap/' + mydata[i].src + ') no-repeat;background-size: 100% 100%;display: inline-block;height:'
                    + mydata[i].sitObj.h + 'px;width:' + mydata[i].sitObj.w + 'px;transform:rotate(' + mydata[i].sitObj.r + 'deg); ">' +
                    '<div class="alarmLight" style="display: ' + (mydata[i].enableAlert ? 'inline-block' : 'none') + ';position: absolute;left: ' + mydata[i].alertSitObj.left + 'px;top: ' + mydata[i].alertSitObj.top + 'px;' +
                    'height: 13px;width: 13px;border-radius: 50%;background-color: #99a09c;"></div>' +
                    (mydata[i].type == 9 ? '<div class="direcLine" style="display: ' + (mydata[i].enableDir ? 'inline-block' : 'none') + ';' +
                        'width: 9px;height: 71px;background-image: url(testTool/configMap/img/Mgrid/w_downline.png);transform: rotate(0deg);left: -27px;top: 25px;position: absolute;"></div>' : '') +
                    '<p class="boxNum" style="color: #fff;text-align: center;line-height: 36px;font-size: 14px;"></p>' +
                    '</main>';
            } else {
                strObj.imgSrc = '<main img-src="testTool/configMap/' + mydata[i].src + '" style="position:relative;background: url(testTool/configMap/' + mydata[i].src + ') no-repeat;background-size: 100% 100%;display: inline-block;height:'
                    + mydata[i].sitObj.h + 'px;width:' + mydata[i].sitObj.w + 'px;transform:rotate(' + mydata[i].sitObj.r + 'deg); ">' +
                    '<div class="alarmLight" style="display: ' + (mydata[i].enableAlert ? 'inline-block' : 'none') + ';position: absolute;left: ' + mydata[i].alertSitObj.left + 'px;top: ' + mydata[i].alertSitObj.top + 'px;' +
                    'height: 13px;width: 13px;border-radius: 50%;background-color: #99a09c;"></div>' +
                    (mydata[i].type == 9 ? '<div class="direcLine" style="display: ' + (mydata[i].enableDir ? 'inline-block' : 'none') + ';' +
                        'width: 9px;height: 71px;background-image: url(testTool/configMap/img/Mgrid/w_downline.png);transform: rotate(0deg);left: -27px;top: 25px;position: absolute;"></div>' : '') +
                    '</main>';
            }
            strObj.allStr += (strObj.imgSrc + tool_map_imgNameDisplay(mydata[i], obj.data.isShowModName) + tool_map_imgValueDisplay(mydata[i])) + '</div>';

            $("#" + alltype.mapBox + "").append(strObj.allStr);
        }
        // $("#" + alltype.mapBox).parents('.box').niceScroll({cursorborder: "", cursorcolor: "#00F", boxzoom: true});
    }//end  show_configed
    /*显示图片的名字*/
    function tool_map_imgNameDisplay(obj, isShowModName) {
        var left = obj.nameSitObj.left;
        var top = obj.nameSitObj.top;
        var w = obj.nameSitObj.w;
        var h = obj.nameSitObj.h;
        var showName = obj.enableName ? "block" : "none";
        if ((!isShowModName) && (obj.type != 17) && (obj.type != 6002)) {
            // if (!isShowModName) {
            showName = "none";
        }
        /*scale提示有问题，实际可以运行下去*/
        var str = '';
        if (obj.type == 6002) {
            str = '<label style="display:' + showName + ';' +
                'width:' + w + 'px;height:' + h + "px;cursor: inherit;position: absolute;left:" +
                left + 'px;top:' + top + 'px;text-align:center;transform:scale(' + obj.nameSitObj.scale + ');color:'
                + obj.nameSitObj.color + ';font-size:13px;border:0px solid #E3E3E3;line-height: 25px;" class="theTime"></label>';
        } else if (obj.type != 4017) {
            str = '<label style="display:' + showName + ';line-height: 20px; font-weight: 800;' +
                'width:' + w + 'px;height:' + h + "px;cursor: inherit;position: absolute;left:" +
                left + 'px;top:' + top + 'px;text-align:center;transform:scale(' + obj.nameSitObj.scale + ');color:'
                + obj.nameSitObj.color + ';font-size:14px;border:0px solid #E3E3E3">' +
                (obj.associatedArr.length ? (obj.associatedArr[0].name || '未命名') : (obj.name ? obj.name : obj.title)) + '</label>';
        }
        return str;
    }

    /*显示图片的值*/
    function tool_map_imgValueDisplay(obj) {
        var str = '';
        for (var i = 0; i < obj.valueSitObj.length; i++) {
            var oSit = obj.valueSitObj[i];
            switch (oSit.direction) {
                case 1:
                    var direction = "left";
                    break;
                case 2:
                    var direction = "center";
                    break;
                case 3:
                    var direction = "right";
                    break;
                default:
                    var direction = "left";
                    break;
            }
            str += '<div class="valerText" valerTextNum="' + oSit.num + '"   style="position: absolute;font-size:12px;line-height:14px;text-align:' + direction + ';width:' + oSit.w + 'px;height:' + oSit.h + "px;left:" +
                oSit.left + 'px;top:' + oSit.top + 'px;transform:scale(' + oSit.scale + ');display: ' + (obj.enableYc ? 'block' : 'none') + ';">' +
                '</div>';
        }
        return str;
    }

//获取模块监控数据列表 7025
    function loadLowMod() {
        var ob = new Object();
        ob.userData = 1;
        ob.type = parseInt(menu);
        // ob.type = parseInt(0);
        var json = JSON.stringify(ob);
        parent.ccc_lib_reqDataByCmd("", USER_STATION_MONITOR_LIST_GETBYTYPE, json, modLowList);
        // modLowList();
    }

//获取模块列表 7026
    function loadLowMod2() {
        var ob = new Object();
        ob.userData = 1;
        ob.type = parseInt(menu);
        // ob.type = parseInt(0);
        var json = JSON.stringify(ob);
        parent.ccc_lib_reqDataByCmd("", USER_STATION_MONITOR_DEVLIST_GETBYID, json, modLowList2);
        deviceAlarmGetbypage(parseInt(menu));

    }

//模块监控数据列表
    function modLowList(id, info, obj) {
        console.log(obj);
        g_dataList = obj;
        //整合对应设备的数据
        for (var i = 0; i < g_modelList.data.length; i++) {
            var model = g_modelList.data[i];
            model.dataList = new Object();
            model.dataList.type1 = [];
            model.dataList.type2 = [];
            model.dataList.type3 = [];
            model.dataList.type4 = [];
            model.dataList.type5 = [];
            model.dataList.type6 = [];
            model.dataList.type7 = [];
            for (var j = 0; j < g_dataList.data.length; j++) {
                if (model.com == g_dataList.data[j].com && model.addr == g_dataList.data[j].addr) {
                    var emap = g_dataList.data[j].emap;
                    emap = emap.sort(compare('dispSeq'));//按显示顺序排序
                    for (var k = 0; k < emap.length; k++) {
                        switch (emap[k].dataType) {
                            case 1:
                                model.dataList.type1.push(emap[k]);
                                break;
                            case 2:
                                model.dataList.type2.push(emap[k]);
                                break;
                            case 3:
                                model.dataList.type3.push(emap[k]);
                                break;
                            case 4:
                                model.dataList.type4.push(emap[k]);
                                break;
                            case 5:
                                model.dataList.type5.push(emap[k]);
                                break;
                            case 6:
                            case 9:
                                model.dataList.type6.push(emap[k]);
                                break;
                            case 7:
                                model.dataList.type7.push(emap[k]);
                                break;
                        }//end switch
                    }//end for emap
                }
            }
        }//end for g_modelList.data
        console.log(g_modelList);
        //整合对应设备的数据 end
        var cab = g_modelList.box;
        var mod = g_modelList.data;
        var modStaArr = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]; //需要更新开关状态的模块数组
        $("#" + alltype.mapBox + " .elemBox[img-type='4017']").each(function () {
            var imgType = $(this).attr("img-type");
            if (imgType == 4017) {//告警TEXT
                $(this).find(".alertsBoxDC").empty();//清空告警框
                for (var i = 0; i < g_dataList.mapAlm.length; i++) {
                    var theData = g_dataList.mapAlm[i];
                    $(this).find('.alertsBoxDC').append('<p class="' + (theData.value ? 'alertInfo' : '') + '" >' + theData.name + '</p>');
                }
            }
        });
        $("#" + alltype.mapBox + " .elemBox[num]").each(function () {
            var imgType = $(this).attr("img-type");
            if (imgType == 4017) {
                return;
            }
            $(this).find(".valerText").empty();//清空遥测框
            for (var m = 0; m < cab.length; m++) {//更新柜体名称
                if ($(this).attr("box-id") == cab[m].boxId) {
                    $(this).attr('box-type', cab[m].type);
                }
                if ($(this).attr("box-id") == cab[m].boxId && $(this).attr("data-gtw") == '') {
                    $(this).find("label").text(cab[m].name);
                }
            }//end for cab

            var mapNum = $(this).attr('num');
            var mapNumArr = [];//同一个元件绑定的所有设备的信息数组
            for (var n = 0; n < g_imgMapObj.content[mapNum].associatedArr.length; n++) {
                var mapObj = g_imgMapObj.content[mapNum].associatedArr[n];
                for (var m = 0; m < mod.length; m++) {
                    var mode = mod[m];
                    // console.log($(this).attr("data-gtw"));
                    // console.log(mapObj.com);
                    //默认高压柜的柜体编号取它第一个设备的参数
                    if (imgType == 3018 && $(this).attr("box-id") == mod[m].boxId && $(this).attr("box-num") == 0) {
                        $(this).find(".boxNum").text(mod[m].onoffSeq);
                        $(this).attr("box-num", 1);
                    }
                    /* console.log('********888');
                     if(mode.addr==100&&mapObj.addr==100){
                         console.log(mapObj.com);
                         console.log(mode.com);
                     }*/
                    if (mapObj.com == mode.com && mapObj.addr == mode.addr) {//addr+com 确定设备唯一
                        $(this).attr('data-recordId', mode.recordId);
                        // if ( mapObj.addr == mode.addr) {
                        mapNumArr.push(mode);
                        if (imgType != 3018) {
                            $(this).css("cursor", "pointer").find("label").text(mode.name);//更新设备名称
                        } else {
                            $(this).remove('.point').append('<p class="point" style="position: absolute;top: 8px;left: 0px;width: 100%;text-align: center;color: white">' + mode.onoffSeq + '</p>');
                        }
                        //安防
                        if ((mode.devType >= 100) && (mode.devType <= 119) && (mode.devType != 115)) {
                            $(this).attr("data-alarmstate", mode.alarm);//总告警 暂时放这
                            $(this).attr("data-ccstate", mode.status);
                            var imgSrc = $(this).find("main").attr("img-src").split("_");
                            var imgSrc1 = imgSrc[0].substr(0, [imgSrc[0].length]);
                            if (mode.status == 0)  //判断是否在线 0为不在线
                            {
                                $(this).find("main").attr("img-src", str).css("background-image", 'url(' + imgSrc1 + '_gray.png' + ')');
                            } else {
                                if ($(this).attr("data-alarmstate") == 0) {
                                    $(this).find("main").attr("img-src", str).css("background-image", 'url(' + imgSrc1 + '_green.png' + ')');
                                } else {
                                    $(this).find("main").attr("img-src", str).css("background-image", 'url(' + imgSrc1 + '_red.png' + ')');
                                }
                            }
                        } else {
                            // 电气图告警
                            if (mode.status == 0) { //判断是否在线 0为不在线
                                $(this).find('.alarmLight').css('background-color', '#99a09c');
                            } else {
                                if (mode.alarm != 0) {
                                    $(this).find('.alarmLight').css('background-color', '#d60700');
                                } else {
                                    $(this).find('.alarmLight').css('background-color', 'rgb(0, 159, 80)');
                                }
                            }
                        }//end if 安防和电气图告警


                        //1.遥测显示
                        for (var i = 0; i < mode.dataList.type1.length; i++) {
                            var theData = mode.dataList.type1[i];
                            if (theData.dispSeq) {//排列顺序为0，不显示
                                if (g_imgMapObj.isShowDataName) {
                                    $(this).find(".valerText[valertextnum=" + theData.area + "]").append('<p style="display: block;color: ' + map_getYcColorByIndex(theData.color) + ';">' + theData.name + ':'
                                        + theData.value.toFixed(2) + ' ' + theData.unit + '</p>');
                                } else {
                                    $(this).find(".valerText[valertextnum=" + theData.area + "]").append('<p style="display: block;color: ' + map_getYcColorByIndex(theData.color) + ';">'
                                        + theData.value.toFixed(2) + ' ' + theData.unit + '</p>');
                                }
                            }//end if theData.dispSeq
                        }
                        if (imgType == 3018) {//高压柜 2
                            for (var i = 0; i < mode.dataList.type2.length; i++) {
                                var theData = mode.dataList.type2[i];
                                if (theData.dispSeq) {//排列顺序为0，不显示
                                    if (g_imgMapObj.isShowDataName) {
                                        $(this).find(".valerText[valertextnum=" + theData.area + "]").append('<p style="display: block;color: ' + map_getYcColorByIndex(theData.color) + ';">' + theData.name + ':'
                                            + ' ' + (theData.value ? '<span style="color: #1eaa39">是</span>' : '<span style="color: white">否</span>') + '</p>');
                                    }
                                }
                            }
                        }
                        if (imgType == 9) {//方向箭头 2
                            for (var i = 0; i < mode.dataList.type2.length; i++) {
                                var theData = mode.dataList.type2[i];
                                if (theData.dispSeq) {//排列顺序为0，不显示
                                    if (theData.value) {
                                        $(this).find('.direcLine').css('transform', 'rotate(0deg)');
                                    } else {
                                        $(this).find('.direcLine').css('transform', 'rotate(180deg)');
                                    }
                                }
                            }//end for
                        }//end 9
                        // 5.开关
                        for (var i = 0; i < modStaArr.length; i++) {
                            if (modStaArr[i] == imgType) {
                                var swichType = 1;
                                if (mode.status == 0)  //判断是否在线 0为不在线
                                {
                                    swichType = 1;
                                } else {
                                    swichType = 3;
                                }
                                if (mode.dataList.type5.length) {
                                    for (var j = 0; j < mode.dataList.type5.length; j++) {
                                        var theData = mode.dataList.type5[j];
                                        if (g_imgMapObj.content[mapNum].switchNum1 == theData.area) {
                                            if (theData.value == 1)   //判断开关是否闭合 1闭合
                                            {
                                                swichType += 1;
                                            }
                                        }
                                        if (imgType == 3 || imgType == 4 || imgType == 5 || imgType == 6 || imgType == 7 || imgType == 8) { //ATS
                                            if (g_imgMapObj.content[mapNum].switchNum2 == theData.area) {
                                                if (theData.value == 1) {
                                                    swichType += 4;
                                                }
                                            }
                                        }//end if imgType==3
                                    }
                                }//end if mode.dataList.type5.length
                                var imgSrc = $(this).find("main").attr("img-src").split(".");
                                var imgSrc1 = imgSrc[0].substr(0, [imgSrc[0].length - 1]);
                                var numLast = imgSrc[0].substr([imgSrc[0].length - 1], 1);
                                if (isNaN(Number(numLast))) {
                                    var str = imgSrc[0] + (swichType == 1 ? "" : swichType) + "." + imgSrc[1];
                                    $(this).find("main").attr("img-src", str).css("background-image", 'url(' + str + ')');
                                } else {
                                    var str = imgSrc1 + (swichType == 1 ? "" : swichType) + "." + imgSrc[1];
                                    $(this).find("main").attr("img-src", str).css("background-image", 'url(' + str + ')');
                                } //end if isNaN(Number(numLast))
                            }
                        } //end 5.开关
                        //6.
                        for (var i = 0; i < mode.dataList.type6.length; i++) {
                            var theData = mode.dataList.type6[i];
                            if (theData.dispSeq) {//排列顺序为0，不显示
                                if (imgType == 3018) {//高压柜
                                    if (g_imgMapObj.isShowDataName) {
                                        $(this).find(".valerText[valertextnum=" + theData.area + "]").append('<p style="display: block;color: ' + map_getYcColorByIndex(theData.color) + ';">' + theData.name + ':'
                                            + ' ' + theData.unit + '</p>');
                                    }
                                } else {
                                    if (g_imgMapObj.isShowDataName) {
                                        $(this).find(".valerText[valertextnum=" + theData.area + "]").append('<p style="display: block;color: ' + map_getYcColorByIndex(theData.color) + ';">'
                                            + ' ' + theData.unit + '</p>');
                                    }

                                }
                            }

                        }//end 6


                    }//end if
                }//end for mod
                if (imgType != 4006) {
                    break
                }
            } //end for g_imgMapObj.content
            //母线联络开关
            if (imgType == 4006) {
                console.log(mapNumArr);
                var swichType = 2;
                var status = 0;
                var val = 0;
                for (var i = 0; i < mapNumArr.length; i++) {
                    status += mapNumArr[i].status;
                    if (mapNumArr[i].dataList.type5[0]) {
                        val += mapNumArr[i].dataList.type5[0].value;
                    }
                }
                if (status) {
                    swichType = 4;
                }
                if (val == 1) {
                    swichType -= 1;
                }
                var imgSrc = $(this).find("main").attr("img-src").split(".");
                var imgSrc1 = imgSrc[0].substr(0, [imgSrc[0].length - 1]);
                var numLast = imgSrc[0].substr([imgSrc[0].length - 1], 1);
                if (isNaN(Number(numLast))) {
                    var str = imgSrc[0] + (swichType == 1 ? "" : swichType) + "." + imgSrc[1];
                    $(this).find("main").attr("img-src", str).css("background-image", 'url(' + str + ')');
                } else {
                    var str = imgSrc1 + (swichType == 1 ? "" : swichType) + "." + imgSrc[1];
                    $(this).find("main").attr("img-src", str).css("background-image", 'url(' + str + ')');
                } //end if isNaN(Number(numLast))
            }

        })//end each
    }//end fn
    function modLowList2(id, info, obj) {
        console.log(obj);
        if (obj.result == 0) {
            g_modelList = obj;
            loadLowMod(parent.g_strSelStnId);//7025
        }
    }//end fn


    var SAFE_SELECT_COLOR_RED = "#FF0000";//红色
    var SAFE_SELECT_COLOR_GREEN = "#73ec98";//绿色
    var SAFE_SELECT_COLOR_YELLOW = "#DAA520";//黄色
    var SAFE_SELECT_COLOR_BLACK = "#000000";//黑色
    var SAFE_SELECT_COLOR_WHITE = "#ffffff";//白色
    var SAFE_SELECT_COLOR_BLUE = "#1fddff";//纯蓝色
    var SAFE_SELECT_COLOR_PURPLE = "#f063fb";//紫色
    function map_getYcColorByIndex(index) {
        var colorCode = '#000000';
        switch (index) {
            case 1:
                colorCode = SAFE_SELECT_COLOR_RED;
                break;
            case 2:
                colorCode = SAFE_SELECT_COLOR_GREEN;
                break;
            case 3:
                colorCode = SAFE_SELECT_COLOR_YELLOW;
                break;
            case 4:
                colorCode = SAFE_SELECT_COLOR_BLACK;
                break;
            case 5:
                colorCode = SAFE_SELECT_COLOR_WHITE;
                break;
            case 6:
                colorCode = SAFE_SELECT_COLOR_BLUE;
                break;
            case 7:
                colorCode = SAFE_SELECT_COLOR_PURPLE;
                break;
        }

        return colorCode;
    }

    // JS对象数组根据属性排序
    function compare(property) {
        return function (a, b) {
            var value1 = a[property];
            var value2 = b[property];
            return value1 - value2;
        }
    }

    window.configMap = configMap;  //地图入口函数
}(window, undefined));
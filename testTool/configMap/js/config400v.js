var g_viewDivStatus = 0;/*调整当前控件模块信息*/
var g_imgObjStatus = 0;/*调整图片位置信息*/
var g_currNodeObj = null;/*当前节点对象*/
var g_currDivObj = null;/*当前节点对象*/
var ModList = {};//所有模块列表
var ConfigMod = [];//已经关联的模块列表；
var isImportData = false;//是否导入其他网站的数据模板
var g_currValText = 0;//当前元器件遥测文本
var modStaArr = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,16,18]; //需要更新开关状态的模块数组 4006是母线逻辑总开关
var timeoutID = null;//显示(保存中...)的定时器
var checkedArr = [];//被选中的数组
var copyArr = [];//复制的数组
var revocationArr = [];//撤销用保存数据的数组
var copyObjId = '';//单个复制元器件的ID
var g_checkedStatus = [0, 0, 0];//1.是否开启框选状态 2.是否开启框选移动 3.是否进入了移动状态
var contentDivXY = {};//记录框选框的坐标
var modStaArrXY = {};//框选移动元件组的坐标
var key = 0;//监听键盘事件
var textCopy = 0;//是否正在进行输入框操作
var vectorData = new Object();//记录矢量数据
vectorData.contentDivW = 1024;
vectorData.contentDivH = 502;
vectorData.canvL = 230;
vectorData.canvT = 107;
var modLowListData = {};//7026数据
var old_name = "";//用于记录当前背景
var uname = "admin";
var colorArr = [];
var currColor = 5;
/*横线*/
var CROSS_LINE = 1;
/*竖线*/
var VERTICAL_LINE = 2;
//文本框
var TEXT = 17;
//告警与异常
var ALERTS = 4017;
//交点半圆
var SEMICIRCLE = 6001;

var sliceLenth = 6000;//切割长度
/*位置方向：上下左右*/
var DIRECTION_UP = 1;
var DIRECTION_DOWN = 2;
var DIRECTION_LEFT = 3;
var DIRECTION_RIGHT = 4;

var BTN_TYPE_YC = 1;
var BTN_TYPE_NAME = 2;
var g_menuobj = new Object();/*工具样,提供基础图片*/
tool_menu_createObj(g_menuobj);

var g_imgMapObj = new Object();/*内容栏,图形配置区域*/


var g_x = 0;/*移动区域内的坐标*/
var g_y = 0;

var g_img_offset_x = 0;/*移动IMG对象当前的偏移量*/
var g_img_offset_y = 0;

var g_div_offset_x = 0;/*移动IMG对象当前的偏移量*/
var g_div_offset_y = 0;

//获取屏幕高度myLibrary

function menuDiv_msup(o) {
    if (isImportData) {
        $(".bloc").hide();
        isImportData = false;
    }

    g_viewDivStatus = 0;
}

function public_xySite() {
    var e = window.event;
    if (e != null) {
        var x = e.clientX;
        var y = e.clientY;

        g_x = x;
        g_y = y;
    }
}

function public_msmove(o) {
    var e = window.event;
    if (e != null && o != null) {
        var s = "view" + ",x:" + e.clientX + " y:" + e.clientY;

        var x = e.clientX;
        var y = e.clientY;

        var o_x = o.style.left;
        var o_y = o.style.top;
        if (g_imgObjStatus == 1) {
            var o_w = o.getElementsByTagName('main')[0].offsetWidth;
            var o_h = o.getElementsByTagName('main')[0].offsetHeight;
            var x0 = x - g_img_offset_x;
            var y0 = y + evt_move.getScrollTop(e) - g_img_offset_y;
            if (x0 < (-o_w / 2) || y0 < (0 - o_h / 2) || x0 > (contentDiv.offsetWidth - o_w)) {
                return false;
            }
            o.style.left = x0 + 'px';
            o.style.top = y0 + 'px';
            tool_map_updateImgSite(g_imgMapObj.content, o.id, x0, y0);
        }
        if (g_viewDivStatus == 1) {
            var x0 = x - g_div_offset_x;
            var y0 = y - g_div_offset_y;

            o.style.left = x0 + 'px';
            o.style.top = y0 + 'px';

            ////console.log('div move w:'+o_w + ', h:'+ o_h+', x:'+o.style.left + ', y:'+ o.style.top);
        }
    }
}

$('#contentDiv').on('mousedown', function () {
    // console.log('111');
    g_checkedStatus[0] = 1;//开启框选状态
    contentDivXY = {};//清空框选框的坐标
    contentDivXY.top1 = g_y - $("#contentDiv").offset().top - 5;//框选框的开始坐标
    contentDivXY.left1 = g_x - $("#contentDiv").offset().left - 5;
    $(this).append('<div class="boxChoose" style="top: ' + contentDivXY.top1 + 'px;left:' + contentDivXY.left1 + 'px;"></div>');//添加框选框
});
$('#contentDiv').on('mouseup', function () {

});
var mousemoveNum = 5;//鼠标进入函数5次后才触发事件
$('#contentDiv,#editCtrlDiv,.other').on('mousemove', function () {
    if (g_viewDivStatus == 1) {
        public_msmove(g_currDivObj);
        return;
    } else if (g_imgObjStatus == 1) {
        public_msmove(g_currNodeObj);
        return;
    } else if (g_checkedStatus[1]) {
        if (!g_checkedStatus[2]) {
            g_checkedStatus[2] = 1;
        }
        modStaArrXY.x2 = g_x - modStaArrXY.x1;
        modStaArrXY.y2 = g_y - modStaArrXY.y1;
        for (var i = 0; i < checkedArr.length; i++) {
            var id = checkedArr[i].id;
            var top = checkedArr[i].sitObj.top + modStaArrXY.y2;
            var left = checkedArr[i].sitObj.left + modStaArrXY.x2;
            $('#' + id + '').css({'top': top, 'left': left})
        }
    }
    public_xySite();
    if (g_checkedStatus[0]) {
        contentDivXY.top = Math.min((g_y - $("#contentDiv").offset().top - 5), contentDivXY.top1);
        contentDivXY.left = Math.min((g_x - $("#contentDiv").offset().left - 5), contentDivXY.left1);
        contentDivXY.height = Math.abs(g_y - $("#contentDiv").offset().top - 5 - contentDivXY.top1);
        contentDivXY.width = Math.abs(g_x - $("#contentDiv").offset().left - 5 - contentDivXY.left1);
        $('.boxChoose').css({
            'top': contentDivXY.top,
            'left': contentDivXY.left,
            'width': contentDivXY.width,
            'height': contentDivXY.height
        });
    }
    return 0;
});

/*刷新界面显示：map图片*/
function refresh_mapImg(imgMapObj) {
    /* console.log(imgMapObj);
     console.log('********');*/
    var str = tool_conentControlDisplay(imgMapObj.content);
    ////console.log(str);

    contentDiv.innerHTML = str;
}

//初始化编辑框
function refresh_ReInitEditImg() {
    tmvImgDiv.innerHTML = "";
    /*图片位置*/
    value_x.value = 0;
    value_y.value = 0;
    value_w.value = 0;
    value_h.value = 0;
    value_r.value = 0;

    /*名字位置*/
    name_value_x.value = 0;
    name_value_y.value = 0;
    name_value_w.value = 0;
    //name_value_h.value = 0;
    name_value_s.value = 0.0;

    /*遥测位置*/
    value_value_x.value = 0;
    value_value_y.value = 0;
    value_value_w.value = 0;
    //name_value_h.value = 0;
    value_value_s.value = 0;

    /*显示传感器名字和遥测值*/
    /*亮色*/
    ipt_rc.style.backgroundColor = "#1874CD";
    ipt_name.style.backgroundColor = "#1874CD";
    //名字颜色
    var selectNameObj = document.getElementById("select_namecolor");
    selectNameObj[0].selected = true;
    /*//方位
    var dirObj = document.getElementById("select_ycdir");
    dirObj[0].selected = true;
    /!*遥测配置按钮*!/
    ycs.innerHTML = "无遥测配置";*/
}

function yc_text_content_fn(ImgObj, num) {
    $("#lb_value .activeBtn").removeClass("activeBtn");
    $("#lb_value span[yc-text=" + (num) + "]").addClass("activeBtn").show();
    g_currValText = num;
    for (var i = 0; i < ImgObj.valueSitObj.length; i++) {
        if (ImgObj.valueSitObj[i].num == g_currValText) {
            /*遥测位置*/
            value_value_x.value = ImgObj.valueSitObj[i].left;
            value_value_y.value = ImgObj.valueSitObj[i].top;
            value_value_w.value = ImgObj.valueSitObj[i].w;
            value_value_s.value = ImgObj.valueSitObj[i].scale;
            select_ycdir.value = ImgObj.valueSitObj[i].direction;
        }
    }//end for
}

/*刷新界面显示：编辑图片*/
function refresh_editImg(ImgObj) {
    // console.log(ImgObj);
    // console.log("*ImgObj***************");
    var str = tool_editPictureDisplay(ImgObj);
    tmvImgDiv.innerHTML = str;
    var gtw = $("#contentDiv .elemBox.active").attr("data-gtw");
    var addr = $("#contentDiv .elemBox.active").attr("data-addr");
    load_associated_list(ImgObj.associatedArr);
    if (ImgObj.name && ImgObj.com) {
        $(".associated1").show().find("span").text(ImgObj.name);
    } else {
        $(".associated1").hide();
    }
    //只有抽出式开关才显示箭头
    if (ImgObj.type == 9) {
        $("#ipt_direction").show();
    } else {
        $("#ipt_direction").hide();
    }
    // 是否为文本输入框
    if (ImgObj.type == 17) {
        $("#textInput").val(ImgObj.name ? ImgObj.name : "").show();
        $(".boxYCText,.boxYCBtn").hide();
    } else {
        $("#textInput").hide();
        $(".boxYCText,.boxYCBtn").show();

        $("#divvaluesiteid,.delete").hide();
        $(".notText").show();
        $("#lb_value span").each(function (n) {//是否有遥测文本
            $(this).hide();
            for (var i = 0; i < ImgObj.valueSitObj.length; i++) {
                if ($(this).attr('yc-text') == ImgObj.valueSitObj[i].num) {
                    $(this).show();
                    $("#divvaluesiteid,.delete").show();
                    $(".notText").hide();
                    if (n == 0) {
                        yc_text_content_fn(ImgObj, ImgObj.valueSitObj[i].num);
                    }
                }
            }//end for
        });
    }
    $(".switchNumBox").hide();
    $(".switchNumBox .box1").hide();
    for (var i = 0; i < modStaArr.length; i++) {
        if (modStaArr[i] == ImgObj.type) {
            $(".switchNumBox").show();
            if (ImgObj.type == 3 || ImgObj.type == 4 || ImgObj.type == 5 || ImgObj.type == 6 || ImgObj.type == 7 || ImgObj.type == 8|| ImgObj.type == 16) {
                $(".switchNumBox .box1").show().find('#switchATSL').val(ImgObj.switchNum1);
                $(".switchNumBox ").find('#switchATSR').val(ImgObj.switchNum2);
                $(".switchNumBox .box2").hide();
                break;
            }
            $(".switchNumBox .box2").show().find('input').val(ImgObj.switchNum1);
            break;
        }
    }
    $("#textInput").blur(function () {
        var nameInput = $(this).val();
        var imgid = $("#contentDiv>.elemBox.active").attr("id");
        if ($('#' + imgid + '').attr('title') == '文本框') {
            $("#contentDiv>.elemBox.active").find(".nameText").text(nameInput || ImgObj.title);
            for (var k = 0; k < g_imgMapObj.content.length; k++) {
                if (g_imgMapObj.content[k].id == imgid) {
                    g_imgMapObj.content[k].name = nameInput;
                }
            }//end for
        }
    });
    /*图片位置*/
    value_x.value = ImgObj.sitObj.left;
    value_y.value = ImgObj.sitObj.top;
    value_w.value = ImgObj.sitObj.w;
    value_h.value = ImgObj.sitObj.h;
    value_r.value = ImgObj.sitObj.r ? ImgObj.sitObj.r : 0;

    /*名字位置*/
    name_value_x.value = ImgObj.nameSitObj.left;
    name_value_y.value = ImgObj.nameSitObj.top;
    name_value_w.value = ImgObj.nameSitObj.w;
    //name_value_h.value = ImgObj.nameSitObj.h;
    name_value_s.value = ImgObj.nameSitObj.scale;
    /*告警位置*/
    alert_value_x.value = ImgObj.alertSitObj.left;
    alert_value_y.value = ImgObj.alertSitObj.top;


    /*遥测位置*/
    if (ImgObj.valueSitObj.length !== 0) {
        value_value_x.value = ImgObj.valueSitObj[0].left;
        value_value_y.value = ImgObj.valueSitObj[0].top;
        value_value_w.value = ImgObj.valueSitObj[0].w;
        value_value_s.value = ImgObj.valueSitObj[0].scale;

        var dirObj = document.getElementById("select_ycdir");
        for (var i = 0; i < dirObj.length; i++) {
            if (parseInt(dirObj[i].value) == ImgObj.valueSitObj[0].direction) {
                dirObj[i].selected = true;
                break;
            }
        }
    }
    /*显示传感器名字和遥测值*/
    if (ImgObj.enableYc != 1) {
        ipt_rc.style.backgroundColor = "#808080";/*灰色*/
    } else {
        ipt_rc.style.backgroundColor = "#1874CD";/*亮色*/
    }
    if (ImgObj.enableName != 1) {
        ipt_name.style.backgroundColor = "#808080";/*灰色*/
    } else {
        ipt_name.style.backgroundColor = "#1874CD";/*亮色*/
    }
    if (ImgObj.enableDir != 1) {
        ipt_direction.style.backgroundColor = "#808080";/*灰色*/
    } else {
        ipt_direction.style.backgroundColor = "#1874CD";/*亮色*/
    }
    if (ImgObj.enableAlert != 1) {
        ipt_alert.style.backgroundColor = "#808080";/*灰色*/
    } else {
        ipt_alert.style.backgroundColor = "#1874CD";/*亮色*/
    }


    // 匹配name的颜色
    var selectNameObj = document.getElementById("select_namecolor");
    for (var i = 0; i < selectNameObj.length; i++) {
        if (parseInt(selectNameObj[i].value) == ImgObj.nameSitObj.colorIndex) {
            selectNameObj[i].selected = true;
            break;
        }
    }
    // 匹配直线的颜色
    var arr = colorArrFn(ImgObj.type);
    if (arr.length) {
        $("#img_color").find('option').hide();
        for (var i = 0; i < arr.length; i++) {
            $("#img_color").find('option[value=' + arr[i] + ']').show();
        }
        $("#img_color,.lineColor").show();
    } else {
        $("#img_color,.lineColor").hide();
    }
    $("#img_color").val(ImgObj.sitObj.colorIndex);

}

function addNewImg(imgObj) {
    if (imgObj != null) {
        /*调整新图的ID*/
        //console.log(imgObj);
        // console.log(g_imgMapObj);
        tool_menu_adjustImgMaxId(g_imgMapObj, imgObj);
        /*刷新界面显示：编辑模块*/
        refresh_editImg(imgObj);

        tool_map_addImgObj(g_imgMapObj, imgObj);

        /*刷新界面显示：内容模块*/
        refresh_mapImg(g_imgMapObj);

        g_currNodeObj = document.getElementById(imgObj.id);
        //console.log(imgObj.id);
        $("#contentDiv .elemBox").removeClass("active");
        $("#" + imgObj.id).addClass("active");
        return imgObj.id;
    }
}

function newImg(type) {
    ////console.log("type="+type);
    var imgObj = tool_map_newImgFromMenuImg(type, g_menuobj.content);
    addNewImg(imgObj);
}

function copyImg() {
    // $(".other").hide();//其他弹出框
    if (g_currNodeObj != null) {
        var imgObj = tool_map_copyImgByImgId(g_imgMapObj.content, g_currNodeObj.id);
        // console.log(imgObj);
        addNewImg(imgObj);
    }
}

function editCtrlDiv_msdown(o) {
    g_viewDivStatus = 1;
    g_currDivObj = o;

    g_div_offset_x = g_x - parseInt(o.offsetLeft);
    g_div_offset_y = g_y - parseInt(o.offsetTop);

    //console.log(o);
}

// 鼠标抬起 取消图片移动事件
$('#contentDiv').on('mouseup', '.elemBox', function () {
    var theStatus = g_checkedStatus[1] && g_checkedStatus[2];
    g_checkedStatus[1] = 0;//框选移动事件结束
    g_checkedStatus[2] = 0;//结束移动状态
    g_imgObjStatus = 0;
    // console.log(444);
    box_choose_fn();//结束框选，先清除再标记
    if (theStatus) {
        for (var i = 0; i < checkedArr.length; i++) {
            var top = checkedArr[i].sitObj.top + modStaArrXY.y2;
            var left = checkedArr[i].sitObj.left + modStaArrXY.x2;
            // if (left < (0-checkedArr[i].sitObj.w / 2) || top < (0 - checkedArr[i].sitObj.h / 2) || left > (contentDiv.offsetWidth - checkedArr[i].sitObj.w/2)) {
            if (left < (0 - checkedArr[i].sitObj.w / 2) || top < (0 - checkedArr[i].sitObj.h / 2)) {
                $('#' + checkedArr[i].id + '').css({
                    'top': checkedArr[i].sitObj.top,
                    'left': checkedArr[i].sitObj.left
                });//超过边界的元器件则还原到原位置
                continue;
            }
            checkedArr[i].sitObj.top = top;
            checkedArr[i].sitObj.left = left;
        }//end for
    }
    //记录操作，为撤销做准备
    revocationArr.unshift(JSON.stringify(g_imgMapObj));
    if (revocationArr[3]) {
        revocationArr.splice(3, 1);
    }
    return false;
});


// 给整个文档添加取消移动事件
$(window).on('mouseup', function () {
    // console.log(222);
    // console.log(g_imgMapObj.content);
    g_imgObjStatus = 0;
    g_viewDivStatus = 0;
    box_choose_fn();
    if (g_checkedStatus[1]) {
        g_checkedStatus[1] = 0;//框选移动事件结束
        for (var i = 0; i < checkedArr.length; i++) {
            var top = checkedArr[i].sitObj.top + modStaArrXY.y2;
            var left = checkedArr[i].sitObj.left + modStaArrXY.x2;
            // if (left < (0-checkedArr[i].sitObj.w / 2) || top < (0 - checkedArr[i].sitObj.h / 2) || left > (contentDiv.offsetWidth - checkedArr[i].sitObj.w/2)) {
            if (left < (0 - checkedArr[i].sitObj.w / 2) || top < (0 - checkedArr[i].sitObj.h / 2)) {
                $('#' + checkedArr[i].id + '').css({
                    'top': checkedArr[i].sitObj.top,
                    'left': checkedArr[i].sitObj.left
                });//超过边界的元器件则还原到原位置
                continue;
            }
            checkedArr[i].sitObj.top = top;
            checkedArr[i].sitObj.left = left;
        }//end for
    }
});

// 框选后执行函数
function box_choose_fn() {
    if (g_checkedStatus[0]) {
        g_checkedStatus[0] = 0;//关闭框选状态
        //清除标记
        $('.divChecked').removeClass('divChecked');
        $('.dotLine').remove();
        $('.boxChoose').remove();
        checkedArr = [];
        //查找被框选的元件，并标记
        for (var i = 0; i < g_imgMapObj.content.length; i++) {
            var obj = g_imgMapObj.content[i];
            var val = obj.id;
            if (obj.type == 17) {
                var o = {
                    "top": obj.sitObj.top + obj.nameSitObj.top,
                    "bottom": obj.sitObj.top + obj.nameSitObj.top + obj.nameSitObj.h,
                    "left": obj.sitObj.left + obj.nameSitObj.left,
                    "right": obj.sitObj.left + obj.nameSitObj.left + obj.nameSitObj.w
                };
                val = '#' + val + ' .nameText'
            } else if (obj.type == 4017) {
                var o = {
                    "top": obj.sitObj.top + obj.nameSitObj.top,
                    "bottom": obj.sitObj.top + obj.nameSitObj.top + obj.nameSitObj.h,
                    "left": obj.sitObj.left + obj.nameSitObj.left,
                    "right": obj.sitObj.left + obj.nameSitObj.left + obj.nameSitObj.w
                };
                val = '#' + val + ' label'
            } else {
                var o = {
                    "top": obj.sitObj.top,
                    "bottom": obj.sitObj.top + obj.sitObj.h,
                    "left": obj.sitObj.left,
                    "right": obj.sitObj.left + obj.sitObj.w
                };
                val = '#' + val + ' main'
            }
            contentDivXY.bottom = contentDivXY.top + contentDivXY.height;
            contentDivXY.right = contentDivXY.left + contentDivXY.width;
            if (o.right > contentDivXY.left && o.bottom > contentDivXY.top && o.left < contentDivXY.right && o.top < contentDivXY.bottom) {
                if (!checkedArr.length) {
                    $('#editCtrlDiv').hide();
                    $("#contentDiv .elemBox.active").removeClass("active");
                }
                checkedArr.push(obj);
                $('#' + obj.id + '').addClass('divChecked'); // 标记
                $(val).append(
                    '<span class="dotLine TopL"></span>' +
                    '<span class="dotLine TopR" ></span>' +
                    '<span class="dotLine BottomL" ></span>' +
                    '<span class="dotLine BottomR" ></span>' +
                    '<span class="dotLine lineTop" ></span>' +
                    '<span class="dotLine lineBottom" ></span>' +
                    '<span class="dotLine lineLeft" ></span>' +
                    '<span class="dotLine lineRight" ></span>'
                );
            }
        }//end for
    }//end if
}

$('#contentDiv').on('mousedown', '.divChecked', function () {
    // console.log(3332);
    // console.log(g_imgMapObj.content);
    if (key == 0 && g_checkedStatus[1] == 0) {
        g_checkedStatus[1] = 1;
        g_checkedStatus[2] = 0;
        modStaArrXY.x1 = g_x;
        modStaArrXY.y1 = g_y;
        return false;
    }
    return false;
});
$('#contentDiv').on('mousedown', '.elemBox', function () {
    $("#offsetX,#offsetY").blur();
    var elementId = $(this).attr("id");
    if ($('.divChecked').length > 0 && key == 0 && g_checkedStatus[1] == 1) {
        return false;
    } else if ($('.divChecked').length > 0 && key == 0) {
        checkedArr = [];
        $('.divChecked').removeClass('divChecked');
        $('.dotLine').remove();
    }
    // console.log(3331);
    imgobj_msdown(elementId);
    return false;
});

function imgobj_msdown(id) {
    var o = document.getElementById(id);
    g_currNodeObj = o;
    imgObj = tool_menu_getImgById(g_imgMapObj.content, o.id);
    var val = imgObj.id;
    if (key == 1) {
        for (var i = 0; i < checkedArr.length; i++) {
            if (checkedArr[i].id == val) {
                checkedArr.splice(i, 1);
                $('#' + val + '').removeClass('divChecked').find('.dotLine').remove();
                return false;
            }
        }
        if (imgObj.type == 17 || imgObj.type == 4017) {
            val = '#' + val + ' label'
        } else {
            val = '#' + val + ' main'
        }
        mousemoveNum = 5;
        checkedArr.push(imgObj);
        // console.log(checkedArr);
        $('#' + imgObj.id + '').addClass('divChecked');
        $(val).append(
            '<span class="dotLine TopL"></span>' +
            '<span class="dotLine TopR" ></span>' +
            '<span class="dotLine BottomL" ></span>' +
            '<span class="dotLine BottomR" ></span>' +
            '<span class="dotLine lineTop" ></span>' +
            '<span class="dotLine lineBottom" ></span>' +
            '<span class="dotLine lineLeft" ></span>' +
            '<span class="dotLine lineRight" ></span>'
        );
        $("#editCtrlDiv").hide();
        $("#contentDiv .elemBox.active").removeClass("active");
        return false;
    }
    g_imgObjStatus = 1;
    var e = window.event;
    //更新编辑控件图片
    $("#contentDiv .elemBox.active").removeClass("active");
    $("#" + o.id).addClass("active");
    /*刷新界面显示：编辑模块*/
    refresh_editImg(imgObj);
    g_img_offset_x = g_x - parseInt(o.style.left);
    g_img_offset_y = g_y + evt_move.getScrollTop(e) - parseInt(o.style.top);
    $("#editCtrlDiv").show();

    return false;

}

function handleImg(id) {

    getNodeById(id);

    return 0;
}

function getNodeById(id) {
    var aa = id.src;//document.getElementById("'"+id+"'");

    //console.log(aa);
}

function refresh_toolList() {
    $('.sonUl').empty();
    var str = tool_menu_display(g_menuobj.content, 'comment');
    $('.libList1 .sonUl').append(str);
    str = tool_menu_display(g_menuobj.content, 'low');
    $('.libList2 .sonUl').append(str);
    str = tool_menu_display(g_menuobj.content, 'switch');
    $('.libList3 .sonUl').append(str);
    /* str = tool_menu_display(g_menuobj.content, 'hight');
     $('.libList4 .sonUl').append(str);
     str = tool_menu_display(g_menuobj.content, 'Mgrid');
     $('.libList5 .sonUl').append(str);
     str = tool_menu_display(g_menuobj.content, 'DCpower');
     $('.libList6 .sonUl').append(str);*/
    return 0;
}

/*工具栏显示*/
function tool_menu_display(content, imgTypy) {
    var str = '';
    for (var i = 0; i < content.length; i++) {
        if (content[i].imgType == imgTypy) {
            var dev = content[i];
            if (dev.sitObj.w2 != 0 || dev.sitObj.h2 != 0) {
                str += '<li img-type="' + dev.type + '" style="background-image: url(' + dev.src + ') ;background-size:' + dev.sitObj.w2 + 'px ' + dev.sitObj.h2 + 'px;"><span>' + dev.title + '</span></li>';
            } else {
                str += '<li img-type="' + dev.type + '" style="background-image: url(' + dev.src + ') ;"><span>' + dev.title + '</span></li>';
            }

        }
    }
    return str;
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
    $(".times").text(myTime);
    $(".theTime").text(myTime);
}

function mapName(type) {
    var val = '';
    switch (type) {
        case '0':
            val = '交直流主图';
            break;
        case '1':
            val = '交流电源系统';
            break;
        case '2':
            val = '直流电源系统';
            break;
        case '3':
            val = '通信电源系统';
            break;
        case '4':
            val = '逆变电源系统';
            break;
        case '5':
            val = '事故照明系统';
            break;
        case '6':
            val = '剩余电流系统';
            break;
    }
    return val;
}

function init() {
    var uname = "admin";
    parent.g_strSelStnId = 1;//不重要
    parent.g_CADtype = 1;//不重要
    parent.menu = localStorage.getItem("CADmenu");//电气图类型
    // parent.menu = '2';
    parent.g_strSelStnName = mapName(parent.menu);
    if (parent.menu == '0') {//主图
        vectorData.contentDivW = 919;
        vectorData.contentDivH = 502;
    }
    $(".stns").empty();
    $("b.names").text(uname);
    setInterval("getTime()", 1000);
    ccc_lib_enableByPass(0, 1, login_result, noticeCB);
    if (parent.g_strSelStnId) {
        $(".myStn").text(parent.g_strSelStnName).attr('title', parent.g_strSelStnName);
        clearAll();
        refresh_toolList();
        load_configed();
        /*setTimeout(function () {
            if (!parent.isInit) {//是否已经成功加载了电气图
                load_configed();
            }
        }, 5000);*/
    }
    group_onload();
}

function login_result(id, info, des) {
    console.log("*************123");
    if (id == 1000005) {
        /* alert("无多方登陆权限！");
         window.opener = null;
         window.open('', '_self');
         window.close();*/
    }
    if (id == 1000009) {
        var str = window.location.href;
        var index = str.lastIndexOf("\/");
        var myhref = str.substring(0, index + 1);
        window.location.href = myhref;
    }
}

function noticeCB(id, info, des) {
    // console.log(des);
}

//获取集团列表
function getGroups() {
    var ob = new Object();
    ob.userId = uname;
    ob.seq = -1;
    ob.num = 1000000;
    ob.userData = 0;
    var json = JSON.stringify(ob);
    ccc_lib_reqDataByCmd("", ACCOUNT_GROUP_LIST_V26, json, loadGroups);//获取集团列表
}

//获取项目列表
function getProjects(groupid) {
    var ob = new Object();
    ob.userId = uname;
    ob.groupId = groupid;
    ob.userData = 0;
    var json = JSON.stringify(ob);
    ccc_lib_reqDataByCmd("", ACCOUNT_PROJECT_LIST_V26, json, loadProjects);//获取项目列表
}

//获取站点列表
function getStations(projectid) {
    var ob = new Object();
    ob.userId = uname;
    ob.projectId = projectid;
    ob.seq = -1;
    ob.num = 1000000;
    ob.userData = 0;
    var json = JSON.stringify(ob);
    ccc_lib_reqDataByCmd("", ACCOUNT_STATION_LIST_V26, json, loadStations);//获取站点列表
}

function getEmapNo(GroupId) {
    var ob = new Object();
    ob.stationId = GroupId;
    ob.userData = 0;
    var json = JSON.stringify(ob);
    parent.ccc_lib_reqDataByCmd(GroupId, USER_STATION_EMAP_LIST_GETBYID, json, loadEmapNo);
}

var theGroupId = '';//导入时当前站点ID
function loadEmapNo(id, inf, des) {
    console.log(des);
    if (des.result == 0) {
        $(".stationSon[data-about='" + theGroupId + "']").empty();
        for (var i = 0; i < des.data.length; i++) {
            if (des.data[i].type == 0) {
                $(".stationSon[data-about='" + theGroupId + "']").append('<li><a href="javascript:void(0);"  name=' + des.data[i].emapNo + ' data-name="' + des.data[i].name +
                    '"><img src="img/equipment.png" alt=""/><span>' + des.data[i].name + '</span></a></li>');
            }//end if type
        }//end for
        $(".stationSon[data-about='" + theGroupId + "']").append('<li><a href="javascript:void(0);"  name="' + theGroupId + 'safe" data-name="安防平面图"><img src="img/equipment.png" alt=""/><span>安防平面图</span></a></li>');
    }//end if
}

// <ul class="stationSon" data-about=' +  des.data[i].stationId
//返回集团列表
function loadGroups(id, inf, des) {
    console.log("返回集团列表");
    SelGroupId = localStorage.getItem("groupid");
    firstGroupId = SelGroupId;
    $(".bloc").empty();
    for (var i = 0; i < des.data.length; i++) {
        if (!firstGroupId) {
            firstGroupId = des.data[i].groupId;
            SelGroupId = firstGroupId;
        }
        $(".bloc").append('<li  id =' + des.data[i].groupId + '><b></b>' +
            '<span data-name="' + des.data[i].name + '"><img src="img/group.png" alt=""/>' +
            des.data[i].name + '<img src="img/toBot.png" alt=""/></span><ul class="items" id="group_' + i +
            '"></ul></li>');
    }
    $(".items").hide();
}

//返回项目列表
function loadProjects(id, info, des) {
    console.log("返回项目列表");
    console.log(des);
    SelProId = localStorage.getItem("proid");
    firstProId = SelProId;
    $(".bloc>li[id='" + SelGroupId + "']>ul>li").remove();
    for (var i = 0; i < des.data.length; i++) {
        if (!firstProId) {
            firstProId = des.data[i].projectId;
            SelProId = firstProId;
        }

        $(".bloc>li[id='" + SelGroupId + "']>ul.items").append('<li  id =' + des.data[i].projectId + ' data_proid="' + des.data[i].groupId +
            '"><a href="javascript:void(0);" data-name="' + des.data[i].name +
            '"><img src="img/project.png" alt=""/>' + des.data[i].name
            + '<img src="img/toBot.png" alt=""/></a><ul class="station" data-about=' + des.data[i].projectId + '></ul></li>');
    }
    $(".station").hide();
}

//返回站点列表
function loadStations(id, info, des) {
    console.log("返回站点列表");
    console.log(des);
    SelStnId = localStorage.getItem("stnid");
    firstStation = SelStnId;
    $(".station[data-about='" + SelProId + "']>li").remove();
    for (var i = 0; i < des.data.length; i++) {
        if (!firstStation) {
            firstStation = des.data[i].stationId;
            SelStnId = firstStation;
        }

        $(".station[data-about='" + SelProId + "']").append('<li><a href="javascript:void(0);"  name=' + des.data[i].stationId + ' data-name="' + des.data[i].name +
            '"><img src="img/station.png" alt=""/><span>' + des.data[i].name + '</span><img src="img/toBot.png" alt=""/></a><ul class="stationSon" data-about=' + des.data[i].stationId + '></ul></li>');
    }
}


/*map区域图片位置调整start*/
function number_x_value(va) {
    if (g_currNodeObj != null) {
        tool_MapImgSiteUpdate_X(g_imgMapObj.content, g_currNodeObj.id, va);

        g_currNodeObj.style.left = va + 'px';
    }
}

function number_y_value(va) {
    if (g_currNodeObj != null) {
        tool_MapImgSiteUpdate_y(g_imgMapObj.content, g_currNodeObj.id, va);
        g_currNodeObj.style.top = va + 'px';
    }
}

function number_width_vaue(va) {
    if (g_currNodeObj != null) {
        tool_MapImgSiteUpdate_width(g_imgMapObj.content, g_currNodeObj.id, va);

        // g_currNodeObj.style.width = va + 'px';
        g_currNodeObj.getElementsByTagName('main')[0].style.width = va + 'px';
    }
}

function number_height_value(va) {
    if (g_currNodeObj != null) {
        tool_MapImgSiteUpdate_height(g_imgMapObj.content, g_currNodeObj.id, va);

        // g_currNodeObj.style.height = va + 'px';
        g_currNodeObj.getElementsByTagName('main')[0].style.height = va + 'px';
    }
}

function number_rotate_value(va) {
    if (g_currNodeObj != null) {
        tool_MapImgSiteUpdate_rotate(g_imgMapObj.content, g_currNodeObj.id, va);
        // g_currNodeObj.style.transform = "rotate(" + va + "deg)";
        g_currNodeObj.getElementsByTagName('main')[0].style.transform = "rotate(" + va + "deg)";
        // console.log(g_imgMapObj.content);
    }
}

//图片位置移动加减号共用
function number_plusMinus(type, va) {
    switch (type) {
        case 'X':
            number_x_value(va);
            break;
        case 'Y':
            number_y_value(va);
            break;
        case 'W':
            number_width_vaue(va);
            break;
        case 'H':
            number_height_value(va);
            break;
        case 'R':
            number_rotate_value(va);
            break;
        default:
        //console.log("noknow type:" + type + ',va:' + va);
    }
}

//点击减号
function number_minus(type, id) {
    var numObj = document.getElementById(id);//获取输入框里的数字
    var va = parseInt(numObj.value);

    va -= 1;

    number_plusMinus(type, va);

    numObj.value = va;
}


//时间函数 长按按钮
function click_time(type, id, fn) {
    var timeId1;
    var timeId2;
    fn(type, id);
    this.onmousedown = function () {
        timeId1 = setTimeout(function () {
            timeId2 = setInterval(function () {
                fn(type, id);
            }, 25);
        }, 500);

    };
    this.onmouseup = function () {
        clearTimeout(timeId1);
        clearInterval(timeId2);
        this.onmousedown = null;
    };
}

// 点击旋转+90度
$(".rotate90").on('click', function () {
    var numObj = document.getElementById("value_r");//获取输入框里的数字
    var va = parseInt(numObj.value);

    va += 90;
    number_plusMinus("R", va);
    numObj.value = va;
});

//点击加号
function number_plus(type, id) {
    var numObj = document.getElementById(id);//获取输入框里的数字
    var va = parseInt(numObj.value);

    va += 1;

    number_plusMinus(type, va);

    numObj.value = va;
}

//图片位置移动输入
function number_input(type, o) {
    var va = 0;

    if (o.value == '') {
        //todo 取当前值
    } else {
        va = parseInt(o.value);

        number_plusMinus(type, va)
    }
}

/*map区域图片位置调整end*/

/*map区域图片告警位置调整start*/
function alert_x_value(va) {
    if (g_currNodeObj != null) {
        tool_MapImgAlertSiteUpdate_X(g_imgMapObj.content, g_currNodeObj.id, va);
    }
}

function alert_y_value(va) {
    if (g_currNodeObj != null) {
        tool_MapImgAlertSiteUpdate_y(g_imgMapObj.content, g_currNodeObj.id, va);
    }
}

/*map区域图片告警位置调整end*/

/*map区域图片名字位置调整start*/
function name_x_value(va) {
    if (g_currNodeObj != null) {
        tool_MapImgNameSiteUpdate_X(g_imgMapObj.content, g_currNodeObj.id, va);
    }
}

function name_y_value(va) {
    if (g_currNodeObj != null) {
        tool_MapImgNameSiteUpdate_y(g_imgMapObj.content, g_currNodeObj.id, va);
    }
}

function name_width_vaue(va) {
    if (g_currNodeObj != null) {
        tool_MapImgNameSiteUpdate_width(g_imgMapObj.content, g_currNodeObj.id, va);
    }
}

function name_height_value(va) {
    if (g_currNodeObj != null) {
        tool_MapImgNameSiteUpdate_height(g_imgMapObj.content, g_currNodeObj.id, va);
    }
}

function name_scale_value(va) {
    if (g_currNodeObj != null) {
        tool_MapImgNameSiteUpdate_scale(g_imgMapObj.content, g_currNodeObj.id, va);
    }
}

//图片位置移动加减号共用
function alert_plusMinus(type, va) {
    switch (type) {
        case 'X':
            alert_x_value(va);
            break;
        case 'Y':
            alert_y_value(va);
            break;
        default:
        //console.log("noknow type:" + type + ',va:' + va);
    }
}

//图片位置移动加减号共用
function name_plusMinus(type, va) {
    switch (type) {
        case 'X':
            name_x_value(va);
            break;
        case 'Y':
            name_y_value(va);
            break;
        case 'W':
            name_width_vaue(va);
            break;
        case 'H':
            name_height_value(va);
            break;
        case 'S':
            name_scale_value(va);
            break;
        default:
        //console.log("noknow type:" + type + ',va:' + va);
    }
}

//告警点击减号
function alert_minus(type, id) {
    var numObj = document.getElementById(id);//获取输入框里的数字
    var va = parseInt(numObj.value);

    va -= 1;

    alert_plusMinus(type, va);

    numObj.value = va;
}

//告警点击加号
function alert_plus(type, id) {
    var numObj = document.getElementById(id);//获取输入框里的数字
    var va = parseInt(numObj.value);

    va += 1;

    alert_plusMinus(type, va);

    numObj.value = va;
}

//名字点击减号
function name_minus(type, id) {
    var numObj = document.getElementById(id);//获取输入框里的数字
    var va = parseInt(numObj.value);

    va -= 1;

    name_plusMinus(type, va);

    numObj.value = va;
}

//名字点击加号
function name_plus(type, id) {
    var numObj = document.getElementById(id);//获取输入框里的数字
    var va = parseInt(numObj.value);

    va += 1;

    name_plusMinus(type, va);

    numObj.value = va;
}

//图片名字位置移动输入
function name_input(type, o) {
    var va = 0;

    if (o.value == '') {
        //todo 取当前值
    } else {
        if (type == 'S') {
            va = parseFloat(o.value);
        } else {
            va = parseInt(o.value);
        }

        name_plusMinus(type, va)
    }
}

//图片告警位置移动输入
function alert_input(type, o) {
    var va = 0;

    if (o.value == '') {
        //todo 取当前值
    } else {
        if (type == 'S') {
            va = parseFloat(o.value);
        } else {
            va = parseInt(o.value);
        }

        alert_plusMinus(type, va)
    }
}

//功能：将浮点数四舍五入，取小数点后2位
function toDecimal(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return;
    }
    f = Math.round(x * 100) / 100;
    return f;
}

//名字缩放点击减号
function name_scale_minus(type, id) {
    var numObj = document.getElementById(id);//获取输入框里的数字
    var va = parseFloat(numObj.value);

    va -= 0.1;

    va = toDecimal(va);
    name_plusMinus(type, va);

    numObj.value = va;
}

//名字缩放点击加号
function name_scale_plus(type, id) {
    var numObj = document.getElementById(id);//获取输入框里的数字
    var va = parseFloat(numObj.value);

    va += 0.1;
    va = toDecimal(va);

    name_plusMinus(type, va);

    numObj.value = va;
}

function name_updateColor(colorIndex) {
    if (g_currNodeObj != null) {
        tool_MapImgNameUpdateColor(g_imgMapObj.content, g_currNodeObj.id, colorIndex);
    }
}

function onchange_selectImgColor(o) {
    var index = o.selectedIndex;
    var colorIndex = parseInt(o.options[index].value);
    if (g_currNodeObj != null) {
        tool_MapImgImgUpdateColor(g_imgMapObj.content, g_currNodeObj.id, colorIndex);
    }
    return 0;
}

function onchange_selectNameColor(o) {
    var index = o.selectedIndex;
    var colorIndex = parseInt(o.options[index].value);

    name_updateColor(colorIndex);

    return 0;
}

/*map区域图片名字位置调整end*/

/*map区域图片遥测值位置调整start*/
function value_x_value(va) {
    if (g_currNodeObj != null) {
        tool_MapImgValueSiteUpdate_X(g_imgMapObj.content, g_currNodeObj.id, va);
    }
}

function value_y_value(va) {
    if (g_currNodeObj != null) {
        tool_MapImgValueSiteUpdate_y(g_imgMapObj.content, g_currNodeObj.id, va);
    }
}

function value_width_vaue(va) {
    if (g_currNodeObj != null) {
        tool_MapImgValueSiteUpdate_width(g_imgMapObj.content, g_currNodeObj.id, va);
    }
}

function value_height_value(va) {
    if (g_currNodeObj != null) {
        tool_MapImgValueSiteUpdate_height(g_imgMapObj.content, g_currNodeObj.id, va);
    }
}

function value_scale_value(va) {
    if (g_currNodeObj != null) {
        tool_MapImgValueSiteUpdate_scale(g_imgMapObj.content, g_currNodeObj.id, va);
    }
}

//图片位置移动加减号共用
function value_plusMinus(type, va) {
    switch (type) {
        case 'X':
            value_x_value(va);
            break;
        case 'Y':
            value_y_value(va);
            break;
        case 'W':
            value_width_vaue(va);
            break;
        case 'H':
            value_height_value(va);
            break;
        case 'S':
            value_scale_value(va);
            break;
        default:
        //console.log("noknow type:" + type + ',va:' + va);
    }
}

//名字点击减号
function value_minus(type, id) {
    var numObj = document.getElementById(id);//获取输入框里的数字
    var va = parseInt(numObj.value);

    va -= 1;

    value_plusMinus(type, va);

    numObj.value = va;
}

//名字点击加号
function value_plus(type, id) {
    var numObj = document.getElementById(id);//获取输入框里的数字
    var va = parseInt(numObj.value);

    va += 1;

    value_plusMinus(type, va);

    numObj.value = va;
}

//图片名字位置移动输入
function value_input(type, o) {
    var va = 0;

    if (o.value == '') {
        //todo 取当前值
    } else {
        if (type == 'S') {
            va = parseFloat(o.value);
        } else {
            va = parseInt(o.value);
        }

        value_plusMinus(type, va)
    }
}

//值缩放点击减号
function value_scale_minus(type, id) {
    var numObj = document.getElementById(id);//获取输入框里的数字
    var va = parseFloat(numObj.value);

    va -= 0.1;

    va = toDecimal(va);
    value_plusMinus(type, va);

    numObj.value = va;
}

//值缩放点击加号
function value_scale_plus(type, id) {
    var numObj = document.getElementById(id);//获取输入框里的数字
    var va = parseFloat(numObj.value);

    va += 0.1;
    va = toDecimal(va);

    value_plusMinus(type, va);

    numObj.value = va;
}

function value_updateDisplayDirect(ycDirect) {
    if (g_currNodeObj != null) {
        tool_MapImgValueAdjustDirect(g_imgMapObj.content, g_currNodeObj.id, ycDirect);
    }
}

function onchange_selectYcSite(o) {
    var index = o.selectedIndex;
    var ycDirect = parseInt(o.options[index].value);

    value_updateDisplayDirect(ycDirect);

    return 0;
}

function name_updateYcStatus() {
    if (g_currNodeObj != null) {
        return tool_MapImgNameUpdateDisplayStatus(g_imgMapObj.content, g_currNodeObj.id);
    }
}

function dir_updateYcStatus() {
    if (g_currNodeObj != null) {
        return tool_MapImgDirUpdateDisplayStatus(g_imgMapObj.content, g_currNodeObj.id);
    }
}

function alert_updateYcStatus() {
    if (g_currNodeObj != null) {
        return tool_MapImgAlertUpdateDisplayStatus(g_imgMapObj.content, g_currNodeObj.id);
    }
}

function value_updateYcStatus() {
    if (g_currNodeObj != null) {
        return tool_MapImgValueUpdateDisplayStatus(g_imgMapObj.content, g_currNodeObj.id);
    }
}

// 删除元器件
function btn_delDev() {
    // console.log(g_imgMapObj.content);
    if (g_currNodeObj != null) {
        // 判断若有关联，刷新左边设备库
        if ($("#" + g_currNodeObj.id + "").attr("box-id")) {
            clearModfn();//取消关联
        }
        var ret = tool_MapImgUpdateDeleteFLag(g_imgMapObj.content, g_currNodeObj.id);
        if (ret != 1) {
            // alert("未找到图片,删除失败！");
        } else {
            /*刷新界面显示：编辑模块*/
            refresh_ReInitEditImg();
            /*刷新界面显示：内容模块*/
            refresh_mapImg(g_imgMapObj);
            $("#editCtrlDiv").hide();
        }
    } else {
        alert("请选择一张待删除的图片！");
    }
    return;
}


function tool_menu_createObj(obj) {
    var path = "";


    obj.content = "";
    obj.content = new Array();/*new一个数据存储img内容的对象{网关[]{设备[]}}的设备内容*/

    var imgobj = null;
    /*坐标：宽、高、左、上面*/
    imgobj = tool_menu_createImg('comment', CROSS_LINE, path + "s5-col-01-img.png", "横线", "原始尺寸:", 151, 2, 0, 0, "告警位置:", 0, 0, 0, 0, [1, 2, 3, 4, 5, 6, 7, 9]);
    if (null != imgobj) {
        obj.content.push(imgobj);
    }
    imgobj = tool_menu_createImg('comment', VERTICAL_LINE, path + "s5-col-02-img.png", "竖线", "原始尺寸:", 2, 151, 0, 0, "告警位置:", 0, 0, 0, 0, [1, 2, 3, 4, 5, 6, 7, 9]);
    if (null != imgobj) {
        obj.content.push(imgobj);
    }
    imgobj = tool_menu_createImg('comment', SEMICIRCLE, path + "s5-col-03-img.png", "相交线", "原始尺寸:", 7, 14, 0, 0, "告警位置:", 0, 0, 0, 1, [1, 2, 3, 4, 5, 6, 7, 9]);
    if (null != imgobj) {
        obj.content.push(imgobj);
    }
    /*17文本框*/
    imgobj = tool_menu_createImg('comment', TEXT, path + "s5-col-04-img.png", "文本框", "原始尺寸:", 0, 0, 0, 0, "告警位置:", 0, 0, 0, 1, []);
    if (null != imgobj) {
        obj.content.push(imgobj);
    }
    imgobj = tool_menu_createImg('comment', ALERTS, path + "s5-col-04-img.png", "告警", "原始尺寸:", 0, 0, 0, 0, "告警位置:", 0, 0, 0, 1, []);
    if (null != imgobj) {
        obj.content.push(imgobj);
    }
    imgobj = tool_menu_createImg('comment', 6002, path + "s5-col-04-img.png", "时间", "原始尺寸:", 0, 0, 0, 0, "告警位置:", 0, 0, 0, 1, []);
    if (null != imgobj) {
        obj.content.push(imgobj);
    }
    // alertSitObj
    // "原始尺寸:",新增图片宽，新增图片高，新增图片left,新增图片高top,"告警位置:","是否显示告警","是否显示名称"
    /*10 普通开关*/
    imgobj = tool_menu_createImg('switch', 10, path + "swich-ver.png", "普通开关(大)", "原始尺寸:", 24, 33, 0, 0, "告警位置:", -16, 18, 0, 0, []);
    if (null != imgobj) {
        obj.content.push(imgobj);
    }
    /*11刀开关竖*/
    imgobj = tool_menu_createImg('switch', 11, path + "swich-knife-ver.png", "普通开关(小)", "原始尺寸:", 17, 21, 0, 0, "告警位置:", -19, 22, 0, 0, []);
    if (null != imgobj) {
        obj.content.push(imgobj);
    }
    imgobj = tool_menu_createImg('switch', 18, path + "swich-knife-ver4.png", "普通开关(灰)", "原始尺寸:", 17, 21, 0, 0, "告警位置:", -19, 22, 0, 0, []);
    if (null != imgobj) {
        obj.content.push(imgobj);
    }
    imgobj = tool_menu_createImg('switch', 9, path + "s5-col-1-img.png", "开关1", "原始尺寸:", 24, 72, 22, 60, "告警位置:", -13, 50, 0, 0, [5, 3]);
    if (null != imgobj) {
        obj.content.push(imgobj);
    }
    imgobj = tool_menu_createImg('switch', 13, path + "s5-col-6-img.png", "开关2", "原始尺寸:", 24, 43, 0, 0, "告警位置:", -13, 50, 0, 0, []);
    if (null != imgobj) {
        obj.content.push(imgobj);
    }
    imgobj = tool_menu_createImg('switch', 14, path + "swich-3-ver.png", "刀熔开关", "原始尺寸:", 19, 39, 0, 0, "告警位置:", -13, 50, 0, 0, []);
    if (null != imgobj) {
        obj.content.push(imgobj);
    }
    imgobj = tool_menu_createImg('switch', 15, path + "swich-3-ver2.png", "刀熔开关(闭合)", "原始尺寸:", 19, 39, 0, 0, "告警位置:", -13, 50, 0, 0, []);
    if (null != imgobj) {
        obj.content.push(imgobj);
    }
    imgobj = tool_menu_createImg('switch', 4006, path + "swich-ver.png", "逻辑连接开关", "原始尺寸:", 24, 33, 0, 0, "告警位置:", -16, 18, 0, 0, []);
    if (null != imgobj) {
        obj.content.push(imgobj);
    }
    imgobj = tool_menu_createImg('switch', 6, path + "s5-col-3-img.png", "ATS", "原始尺寸:", 87, 38, 0, 0, "告警位置:", 36, 9, 0, 0, [5, 3]);
    if (null != imgobj) {
        obj.content.push(imgobj);
    }
    imgobj = tool_menu_createImg('switch', 16, path + "s5-col-3-img8.png", "ATS(灰)", "原始尺寸:", 87, 38, 0, 0, "告警位置:", 36, 9, 0, 0, [5, 3]);
    if (null != imgobj) {
        obj.content.push(imgobj);
    }
    imgobj = tool_menu_createImg('switch', 7, path + "s5-col-4-img.png", "交流切换接触器", "原始尺寸:", 76, 33, 0, 0, "告警位置:", 36, 9, 0, 0, [5, 7]);
    if (null != imgobj) {
        obj.content.push(imgobj);
    }
    imgobj = tool_menu_createImg('switch', 8, path + "s5-col-5-img.png", "联锁开关", "原始尺寸:", 93, 45, 0, 0, "告警位置:", 36, 9, 0, 0, [5, 7]);
    if (null != imgobj) {
        obj.content.push(imgobj);
    }
    imgobj = tool_menu_createImg('switch', 5001, path + "s5-col-7-img.png", "静态(短)", "原始尺寸:", 20, 58, 15, 38, "告警位置:", 0, 0, 0, 0, [5, 6, 9]);
    if (null != imgobj) {
        obj.content.push(imgobj);
    }
    imgobj = tool_menu_createImg('switch', 7010, path + "s5-col-8-img.png", "静态(中)", "原始尺寸:", 20, 73, 18, 48, "告警位置:", 0, 0, 0, 0, [5, 3]);
    if (null != imgobj) {
        obj.content.push(imgobj);
    }
    imgobj = tool_menu_createImg('switch', 7007, path + "s5-col-9-img.png", "静态(长)", "原始尺寸:", 19, 161, 19, 57, "告警位置:", 0, 0, 0, 0, [5, 7]);
    if (null != imgobj) {
        obj.content.push(imgobj);
    }
    imgobj = tool_menu_createImg('low', 5006, path + "s5-col-10-img.png", "充电模块", "原始尺寸:", 55, 22, 0, 0, "告警位置:", 0, 0, 0, 0, [5, 7]);
    if (null != imgobj) {
        obj.content.push(imgobj);
    }
    imgobj = tool_menu_createImg('low', 5007, path + "s5-col-12-img.png", "熔断器", "原始尺寸:", 10, 42, 0, 0, "告警位置:", 0, 0, 0, 0, [5, 7]);

    if (null != imgobj) {
        obj.content.push(imgobj);
    }
    imgobj = tool_menu_createImg('low', 5008, path + "s5-col-13-img.png", "蓄电池组", "原始尺寸:", 57, 23, 0, 0, "告警位置:", 0, 0, 0, 0, [5, 7]);
    if (null != imgobj) {
        obj.content.push(imgobj);
    }
    imgobj = tool_menu_createImg('low', 5009, path + "s5-col-11-img.png", "UPS/INV简图", "原始尺寸:", 32, 23, 0, 0, "告警位置:", 0, 0, 0, 0, [5, 6]);
    if (null != imgobj) {
        obj.content.push(imgobj);
    }
    imgobj = tool_menu_createImg('low', 5011, path + "MODEL_6.png", "DC/DC模块", "原始尺寸:", 32, 23, 0, 0, "告警位置:", 0, 0, 0, 0, [9]);
    if (null != imgobj) {
        obj.content.push(imgobj);
    }
    imgobj = tool_menu_createImg('low', 7001, path + "1.png", "UPS", "原始尺寸:", 170, 67, 90, 42, "告警位置:", 0, 0, 0, 0, []);
    if (null != imgobj) {
        obj.content.push(imgobj);
    }
    imgobj = tool_menu_createImg('low', 7002, path + "2.png", "INV", "原始尺寸:", 160, 61, 90, 42, "告警位置:", 0, 0, 0, 0, []);
    if (null != imgobj) {
        obj.content.push(imgobj);
    }
    imgobj = tool_menu_createImg('low', 7003, path + "3.png", "矢压下电接触器", "原始尺寸:", 90, 57, 80, 50, "告警位置:", 0, 0, 0, 0, []);
    if (null != imgobj) {
        obj.content.push(imgobj);
    }
    imgobj = tool_menu_createImg('low', 7006, path + "6.png", "共补电容器", "原始尺寸:", 23, 22, 0, 0, "告警位置:", 0, 0, 0, 0, []);
    if (null != imgobj) {
        obj.content.push(imgobj);
    }

    imgobj = tool_menu_createImg('low', 7008, path + "8.png", "硅链", "原始尺寸:", 47, 29, 0, 0, "告警位置:", 0, 0, 0, 0, []);
    if (null != imgobj) {
        obj.content.push(imgobj);
    }


    imgobj = tool_menu_createImg('low', 7012, path + "12.png", "复合开关", "原始尺寸:", 20, 14, 0, 0, "告警位置:", 0, 0, 0, 0, []);
    if (null != imgobj) {
        obj.content.push(imgobj);
    }
    imgobj = tool_menu_createImg('low', 7013, path + "13.png", "DC/DC模块", "原始尺寸:", 60, 40, 0, 0, "告警位置:", 0, 0, 0, 0, []);
    if (null != imgobj) {
        obj.content.push(imgobj);
    }
    imgobj = tool_menu_createImg('low', 7014, path + "14.png", "分补电容器", "原始尺寸:", 23, 22, 0, 0, "告警位置:", 0, 0, 0, 0, []);
    if (null != imgobj) {
        obj.content.push(imgobj);
    }
    /*1021多功能仪表1*/
    imgobj = tool_menu_createImg('low', 1021, path + "allTableOne.png", "多功能仪表1", "原始尺寸:", 41, 14,  30, 11, "告警位置:", 0, 0, 0, 0,[]);
    if (null != imgobj) {
        obj.content.push(imgobj);
    }
    /*1020多功能仪表*/
    imgobj = tool_menu_createImg('low', 1020, path + "allTable.png", "多功能仪表", "原始尺寸:", 41, 28,  30, 21, "告警位置:", 0, 0, 0, 0,[]);
    if (null != imgobj) {
        obj.content.push(imgobj);
    }

    // 剩余电流
    imgobj = tool_menu_createImg('low', 7015, path + "sy0.png", "EMT", "原始尺寸:", 151, 121, 75, 60, "告警位置:", 0, 0, 0, 0, []);
    if (null != imgobj) {
        obj.content.push(imgobj);
    }
    imgobj = tool_menu_createImg('low', 7016, path + "sy1.png", "集中接地点", "原始尺寸:", 151, 121, 75, 60, "告警位置:", 0, 0, 0, 0, []);
    if (null != imgobj) {
        obj.content.push(imgobj);
    }
    imgobj = tool_menu_createImg('low', 7017, path + "sy2.png", "馈线支路", "原始尺寸:", 151, 121, 75, 60, "告警位置:", 0, 0, 0, 0, []);
    if (null != imgobj) {
        obj.content.push(imgobj);
    }
    imgobj = tool_menu_createImg('low', 7018, path + "sy3.png", "长电缆", "原始尺寸:", 151, 121, 75, 60, "告警位置:", 0, 0, 0, 0, []);
    if (null != imgobj) {
        obj.content.push(imgobj);
    }

}

/**
 *
 * @param imgType
 * @param id
 * @param src
 * @param title
 * @param str1          "原始尺寸:"
 * @param w
 * @param h
 * @param w2
 * @param h2
 * @param str2          "告警位置:"
 * @param gleft         告警位置left
 * @param gtop          告警位置top
 * @param display1      告警显示
 * @param display2      名称显示
 * @param arr           颜色改变数组,空为无颜色改变
 * @returns {Object}
 */
function tool_menu_createImg(imgType, id, src, title, str1, w, h, w2, h2, str2, gleft, gtop, display1, display2, arr) {
    var type = id;
    var path = "img/";
    var obj = new Object();
    obj.imgType = imgType;//元件库分类

    obj.id = "imgid" + type + "_" + id;
    obj.type = type;/*不同图片类型*/
    obj.src = path + imgType + '/' + src;
    obj.title = title;
    obj.sitObj = new Object();

    obj.sitObj.w = w;//原始尺寸
    obj.sitObj.h = h;
    obj.sitObj.r = 0;
    obj.sitObj.w2 = w2;
    obj.sitObj.h2 = h2;
    obj.sitObj.left = 50;
    obj.sitObj.top = 50;
    obj.alertSitObj = new Object();/*用于工具栏显示*/

    obj.alertSitObj.left = gleft;
    obj.alertSitObj.top = gtop;
    obj.enableAlert = display1;
    obj.enableName = display2;
    obj.arr = arr;

    var ob = {'type': id, 'arr': arr};
    colorArr.push(ob);
    return obj;
}

function colorArrFn(type) {
    for (var i = 0; i < colorArr.length; i++) {
        if (type == colorArr[i].type) {
            return colorArr[i].arr;
        }
    }
}


function tool_conentControlDisplay(content) {
    var downArr = [17];//需要降级的图片

    var i = 0;
    var str = '';
    for (; i < content.length; i++) {
        var dev = content[i];

        if (dev.deleteFlag != 0) {
            //console.log("delete com:" + dev.id + ",title:" + dev.title);
            continue;
        }
        if (dev.type == 1 || dev.type == 2) {  //画直线
            str +=
                '<div class="elemBox" id="' + dev.id + '" data-gtw="" data-addr="" title="' + dev.title +
                '" ' +
                'style="position: absolute;left:' + dev.sitObj.left + 'px;top:' + dev.sitObj.top + 'px; width: 0;cursor: all-scroll;">' +
                '<main style="float:left;transform: rotate(' + dev.sitObj.r + 'deg);padding:' + (dev.type == 1 ? '4px 0' : '0 4px') + ';width:'
                + dev.sitObj.w + 'px;height:' + dev.sitObj.h + 'px;display: inline-block;">' +
                '<div style="height: 100%;background-color:' + (dev.sitObj.color || 'rgba(255,255,255,.3)') + ';"></div>' +
                '</main>' +//main>div为了扩大直线的选取范围
                tool_map_imgNameDisplay(dev) +
                tool_map_imgValueDisplay(dev) +
                '</div>';
        } else if (dev.type == 6001) {  //画半圆
            str +=
                '<div class="elemBox" id="' + dev.id + '" data-gtw="" data-addr="" title="' + dev.title +
                '" ' +
                'style="position: absolute;left:' + dev.sitObj.left + 'px;top:' + dev.sitObj.top + 'px; width: 0;cursor: all-scroll;">' +
                '<main style="float:left;transform: rotate(' + dev.sitObj.r + 'deg);padding:7px;width:'
                + dev.sitObj.w + 'px;height:' + (dev.sitObj.h - 4) + 'px;display: inline-block;">' +
                '<div style="height: 100%;border-top-right-radius: 60px;border-bottom-right-radius: 60px;border: 2px solid;' +
                'border-left-width:0;border-color: ' + (dev.sitObj.color || 'rgba(255,255,255,.3)') + ';"></div>' +
                '</main>' +//main>div为了扩大直线的选取范围
                tool_map_imgNameDisplay(dev, g_imgMapObj.isShowModName) +
                tool_map_imgValueDisplay(dev) +
                '</div>';
        } else {

            str +=
                '<div class="elemBox" id="' + dev.id + '" data-gtw="" data-addr="" title="' + dev.title +
                '" ' +
                'style="position: absolute;width: 0;left:' + dev.sitObj.left + 'px;top:' + dev.sitObj.top + 'px;cursor: all-scroll;' + (downArr.indexOf(dev.type) == -1 ? '' : 'z-index: 0;') + '">' +
                '<main style="position:relative;background-image: url(' + dev.src + ');background-repeat: no-repeat;background-size:100% 100%;display: inline-block;' +
                'width:' + dev.sitObj.w + 'px;height:' + dev.sitObj.h + 'px;transform: rotate(' + dev.sitObj.r + 'deg);">' +
                '<div class="alarmLight" style="display: ' + (dev.enableAlert ? 'inline-block' : 'none') + ';position: absolute;left: ' + dev.alertSitObj.left + 'px;top: ' + dev.alertSitObj.top + 'px;"></div>' +
                (dev.type == 9 ? '<div class="direcLine" style="display: ' + (dev.enableDir ? 'inline-block' : 'none') + ';"></div>' : '') +
                '</main>' +
                tool_map_imgNameDisplay(dev, g_imgMapObj.isShowModName) +
                tool_map_imgValueDisplay(dev) +
                '</div>';
        }
        // str += tool_map_imgNameDisplay(dev);
        // str += tool_map_imgValueDisplay(dev);
    }
    return str;
}

// 选中的小图
function tool_editPictureDisplay(dev) {
    var str = '<div style="background-image: url(' + dev.src + ')"></div><p>' + dev.title + '</p>';
    // var str = '<div style="background-image: url(../' + dev.src + ')"></div><p>' + dev.title + '</p>';
    return str;
}

/*显示图片的名字*/
function tool_map_imgNameDisplay(obj, isShowModName) {
    var left = obj.nameSitObj.left;
    var top = obj.nameSitObj.top;
    var w = obj.nameSitObj.w;
    var h = obj.nameSitObj.h;
    if (obj.nameSitObj.scale == undefined) {//解决没有scale的bug
        obj.nameSitObj.scale = 1;
    }

    var showName = obj.enableName ? "block" : "none";
    // console.log(obj.type+'*******'+obj.enableName+'*******'+showName+'*******'+isShowModName);
    if ((!isShowModName) && (obj.type != 17) && (obj.type != 6002)) {
        // if(!isShowModName){
        showName = "none";
    }
    /*scale提示有问题，实际可以运行下去*/
    // console.log(obj.type+'*******'+obj.enableName+'*******'+showName);
    var str = '';
    if (obj.type == 4017) {
        str = '<label  class="alarmLight2" style="display:' + showName + ';font-weight: 400;' +
            'width:' + w + 'px;height:' + h + 'px; position: absolute;left:' +
            left + 'px;top:' + top + 'px;cursor: all-scroll;text-align:center;transform:scale(' + obj.nameSitObj.scale + ');color:' + obj.nameSitObj.color + ';font-size:12px;border:1px dashed red;line-height: 20px"><span class="nameText">' +
            (obj.associatedArr.length ? (obj.associatedArr[0].name || '未命名') : obj.title) + '</span></label>';
    } else if (obj.type == 6002) {
        str = '<label style="display:' + showName + ';cursor: all-scroll;' +
            'width:' + w + 'px;height:' + h + "px; position: absolute;left:" +
            left + 'px;top:' + top + 'px;text-align:center;transform:scale(' + obj.nameSitObj.scale + ');color:'
            + obj.nameSitObj.color + ';font-size:13px;line-height: 25px;"><span class="theTime">0000-00-00  00:00:00</span></label>';
    } else {
        str = '<label ' + (obj.type == 17 ? 'class="label17"' : '') + ' style="display:' + showName + ';cursor: all-scroll;font-weight: 800;' +
            'width:' + w + 'px; position: absolute;left:' + left + 'px;top:' + top + 'px;text-align:center;transform:scale(' + obj.nameSitObj.scale + ');' +
            'color:' + obj.nameSitObj.color + ';font-size:14px;line-height: 20px;"><div class="nameText">' +
            (obj.associatedArr.length ? (obj.associatedArr[0].name || '未命名') : (obj.name ? obj.name : obj.title)) + '</div></label>';
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
        str += '<div class="valerText" valerTextNum="' + oSit.num + '"   style="cursor: auto;text-align:' + direction + ';width:' + oSit.w + 'px;height:' + oSit.h + "px;left:" +
            oSit.left + 'px;top:' + oSit.top + 'px;transform:scale(' + oSit.scale + ');display: ' + (obj.enableYc ? 'block' : 'none') + ';">文本' + oSit.num +
            '</div>';
    }
    return str;
}

/*颜色宏定义*/
var SAFE_SELECT_COLOR_RED = "#FF0000";//红色
var SAFE_SELECT_COLOR_GREEN = "#20ea2e";//绿色
var SAFE_SELECT_COLOR_GREEN2 = "#a9e270";//青色
var SAFE_SELECT_COLOR_YELLOW = "#ffff21";//黄色
var SAFE_SELECT_COLOR_BLACK = "#000000";//黑色
var SAFE_SELECT_COLOR_WHITE = "#ffffff";//白色
var SAFE_SELECT_COLOR_BLUE = "#20ffff";//纯蓝色
var SAFE_SELECT_COLOR_PURPLE = "#ff22ff";//紫色
var SAFE_SELECT_COLOR_GRAY = "#808080";//灰色


var SAFE_SELECT_VALUE_RED = 1;//红色
var SAFE_SELECT_VALUE_GREEN = 2;//绿色
var SAFE_SELECT_VALUE_GREEN2 = 9;//青色
var SAFE_SELECT_VALUE_YELLOW = 3;//黄色
var SAFE_SELECT_VALUE_BLACK = 4;//黑色
var SAFE_SELECT_VALUE_WHITE = 5;//白色
var SAFE_SELECT_VALUE_BLUE = 6;//纯蓝色
var SAFE_SELECT_VALUE_PURPLE = 7;//紫色
var SAFE_SELECT_VALUE_GRAY = 8;//灰色

function tool_menu_getImgByType(type, imgArray) {
    var i = 0;
    var imgObj = null;

    for (; i < imgArray.length; i++) {
        var tmp = imgArray[i];

        if (tmp.type == type) {
            imgObj = tmp;
        }
    }

    return imgObj;
}

/*电气图对象*/
function tool_map_createObj(obj) {
    obj.type = "交直流电源系统";
    obj.stn = "";
    obj.version = "3.0";
    obj.maxid = 5;
    obj.content = "";
    obj.isShowModName = 1;
    obj.isShowDataName = 1;
    obj.content = new Array();/*new一个数组*/
    obj.width = vectorData.contentDivW;
    obj.height = vectorData.contentDivH;

    contentDiv.style.width = vectorData.contentDivW + "px";
    contentDiv.style.height = vectorData.contentDivH + "px";
    document.getElementById("widt").value = vectorData.contentDivW;
    document.getElementById("heig").value = vectorData.contentDivH;
    return;
}

function tool_map_addImgObj(obj, mapImgobj) {
    if (null != mapImgobj) {
        obj.content.push(mapImgobj);
    }
}

function _map_getYcColorByIndex(index) {
    var colorCode = '#ffffff';
    switch (index) {
        case SAFE_SELECT_VALUE_RED:
            colorCode = SAFE_SELECT_COLOR_RED;
            break;
        case SAFE_SELECT_VALUE_GREEN:
            colorCode = SAFE_SELECT_COLOR_GREEN;
            break;
        case SAFE_SELECT_VALUE_GREEN2:
            colorCode = SAFE_SELECT_COLOR_GREEN2;
            break;
        case SAFE_SELECT_VALUE_YELLOW:
            colorCode = SAFE_SELECT_COLOR_YELLOW;
            break;
        case SAFE_SELECT_VALUE_BLACK:
            colorCode = SAFE_SELECT_COLOR_BLACK;
            break;
        case SAFE_SELECT_VALUE_WHITE:
            colorCode = SAFE_SELECT_COLOR_WHITE;
            break;
        case SAFE_SELECT_VALUE_BLUE:
            colorCode = SAFE_SELECT_COLOR_BLUE;
            break;
        case SAFE_SELECT_VALUE_PURPLE:
            colorCode = SAFE_SELECT_COLOR_PURPLE;
            break;
        case SAFE_SELECT_VALUE_GRAY:
            colorCode = SAFE_SELECT_COLOR_GRAY;
            break;
    }

    return colorCode;
}


/*从工具列表中找到对应的图片,复制一个出来*/
function tool_map_newImgFromMenuImg(type, imgArray) {
    var mapImgobj = null;

    var imgTmp = tool_menu_getImgByType(type, imgArray);

    if (imgTmp == null) return mapImgobj;

    mapImgobj = new Object();

    mapImgobj.type = imgTmp.type;/*控件类型*/
    mapImgobj.id = imgTmp.id;/*new出来后进行调整*/
    mapImgobj.title = imgTmp.title;
    mapImgobj.enableYc = 1;/*界面为1显示,0不显示*/
    mapImgobj.deleteFlag = 0;/*删除状态 暂时没用*/
    mapImgobj.enableName = 1;/*界面为1显示,0不显示*/
    mapImgobj.enableDir = 0;/*界面为1显示,0不显示*/
    mapImgobj.enableAlert = imgTmp.enableAlert;/*界面为1显示,0不显示*/
    mapImgobj.enableName = imgTmp.enableName;/*界面为1显示,0不显示*/
    for (var i = 0; i < modStaArr.length; i++) {
        if (modStaArr[i] == type) {
            mapImgobj.switchNum1 = 1;/*默认开关编号为1*/
            if (type == 3 || type == 4 || type == 5 || type == 6 || type == 7 || type == 8|| type == 16) {
                mapImgobj.switchNum2 = 2;/*默认开关编号为2*/
            }
            break;
        }
    }

    mapImgobj.associatedArr = [];//已经关联设备数组

    mapImgobj.sitObj = new Object();/*默认图片位置大小对象*/

    mapImgobj.sitObj.w = imgTmp.sitObj.w;
    mapImgobj.sitObj.h = imgTmp.sitObj.h;
    mapImgobj.sitObj.r = imgTmp.sitObj.r;
    mapImgobj.sitObj.left = imgTmp.sitObj.left - parseInt($("#contentDiv").offset().left - vectorData.canvL);//新增时的初始位置 出现在左上角
    mapImgobj.sitObj.top = imgTmp.sitObj.top - parseInt($("#contentDiv").offset().top - vectorData.canvT);//新增时的初始位置 出现在左上角
    /* mapImgobj.sitObj.left = imgTmp.sitObj.left;//新增时的初始位置 出现在左上角
     mapImgobj.sitObj.top = imgTmp.sitObj.top;//新增时的初始位置 出现在左上角*/
    var arr = colorArrFn(imgTmp.type);
    if (imgTmp.imgType == 'comment') {
        var str = imgTmp.src.split('-col-');
        var str2 = str[0].substring(0,str[0].length-1);
        var str3 = str2+5+'-col-'+str[1];
        mapImgobj.src = str3;
    }else {
        mapImgobj.src = imgTmp.src;
    }

    if (arr.indexOf(currColor) == -1 || arr.indexOf(currColor) == 0) {
        mapImgobj.sitObj.color = imgTmp.sitObj.color || _map_getYcColorByIndex(arr[0]);
        mapImgobj.sitObj.colorIndex = imgTmp.sitObj.colorIndex || arr[0];
    } else if (imgTmp.imgType == 'comment') {
        mapImgobj.sitObj.color = _map_getYcColorByIndex(currColor);
        mapImgobj.sitObj.colorIndex = currColor;
    } else {
        // var str = imgTmp.src.split('-col-');
        // var str2 = str[0].substring(0,str[0].length-1);
        // var str3 = str2+currColor+'-col-'+str[1];
        // mapImgobj.src = str3;
        mapImgobj.sitObj.color = _map_getYcColorByIndex(currColor);
        mapImgobj.sitObj.colorIndex = currColor;
    }


    mapImgobj.nameSitObj = new Object();/*图片名字位置对象*/

    mapImgobj.nameSitObj.direction = DIRECTION_DOWN;
    mapImgobj.nameSitObj.id = "labid" + type + "_" + 0;/*new出来后进行调整*/
    if (type == 6002) {
        mapImgobj.nameSitObj.w = 175;
    } else if (type == 17) {
        mapImgobj.nameSitObj.w = 70;
    } else {
        mapImgobj.nameSitObj.w = 125;
    }
    mapImgobj.nameSitObj.h = 20;
    mapImgobj.nameSitObj.scale = 1;

    mapImgobj.alertSitObj = new Object();/*图片告警位置对象*/
    mapImgobj.alertSitObj.left = imgTmp.alertSitObj.left;
    mapImgobj.alertSitObj.top = imgTmp.alertSitObj.top;

    //配置每一个名字的位置

    var myleft = -20;
    var mytop = mapImgobj.sitObj.h + 2;
    var center1 = [3, 6, 8, 16, 10, 14, 13, 19, 3018,7016,7017,7018]; //水平居中
    var center2 = [3];//垂直居中
    var center3 = [9, 11, 31];//特殊位置

    for (var i = 0; i < center1.length; i++) {
        if (type == center1[i]) {
            myleft = (mapImgobj.sitObj.w - mapImgobj.nameSitObj.w) / 2;
        }
    }
    for (var i = 0; i < center2.length; i++) {
        if (type == center2[i]) {
            mytop = (mapImgobj.sitObj.h - mapImgobj.nameSitObj.h) / 2;
        }
    }
    for (var i = 0; i < center3.length; i++) {
        if (type == center3[i]) {
            // mytop = mapImgobj.sitObj.h - 23;
            mytop = -29;
            myleft = -9;
        }
    }
    if (type == 13) {
        mytop = 90;
    }
    if (type == 3018) {
        mytop = mytop - 25;
    }
    //安防name初始位置
    if (2000 < type && type < 3000) {
        myleft = (mapImgobj.sitObj.w - mapImgobj.nameSitObj.w) / 2;
    }

    mapImgobj.nameSitObj.left = myleft;/*是w额外加值的0.5倍*/
    mapImgobj.nameSitObj.top = mytop;

    //配置每一个名字的位置 end

    mapImgobj.nameSitObj.color = _map_getYcColorByIndex(currColor);
    if ((type >= 2001) && (type <= 2019)) {
        mapImgobj.nameSitObj.scale = 0.8;/*安防定制*/
    }
    mapImgobj.nameSitObj.colorIndex = currColor;

    mapImgobj.valueSitObj = new Array();
    var numArr = [];//元器件指定的遥测文本数组
    var arr1 = [8, 9, 10, 11, 13, 15, 16,  19, 24, 25, 31, 3018, 2001, 2002, 2003, 2004, 4008, 4009, 4011];//本数组元器件遥测文本数组初始化指定[1]
    var arr2 = [];//本数组元器件遥测文本数组初始化指定[1,2]
    var arr3 = [];//本数组元器件遥测文本数组初始化指定[1,2,3,4]
    for (var i = 0; i < arr1.length; i++) {
        if (type == arr1[i]) {
            numArr = [1];
        }
    }
    for (var i = 0; i < arr2.length; i++) {
        if (type == arr2[i]) {
            numArr = [1, 2];
        }
    }
    for (var i = 0; i < arr3.length; i++) {
        if (type == arr3[i]) {
            numArr = [1, 2, 3, 4];
        }
    }
    //生成每个元器件指定的遥测文本
    for (var i = 0; i < numArr.length; i++) {
        if (i == 0) {
            g_currValText = numArr[i];//当前文本
        }
        ycValueNew(mapImgobj.valueSitObj, numArr[i], type);
    }

    return mapImgobj;
}

//生成一个新遥测文本
function ycValueNew(arr, num, type) {
    var valueSitObj = new Object();/*图片数值位置对象*/
    valueSitObj.num = num;//文本序号
    valueSitObj.direction = 1;//1左对齐 2居中 3右对齐
    // valueSitObj.id = "lab2id" + type + "_" + 0;/*new出来后进行调整*/
    valueSitObj.w = 110;
    valueSitObj.h = 20;
    valueSitObj.left = 31;
    valueSitObj.top = 0;
    valueSitObj.size = 14;
    valueSitObj.scale = 1;/*取值范围0.1-1.0之间*/
    if (type == 8) {//馈线
        valueSitObj.left = 132;
        valueSitObj.top = -11;
    }
   /* if (type == 18) {//逆变器
        valueSitObj.left = 71;
        valueSitObj.top = -54;
        valueSitObj.w = 89;
    }*/
    if (type == 16) {//三相不平衡
        valueSitObj.left = 123;
    }
    if (type == 19) {
        valueSitObj.left = 56;
    }
    if (type == 24) {
        valueSitObj.left = 31;
        valueSitObj.top = 108;
    }
    if (type == 25) {
        valueSitObj.left = 74;
    }
    if (type == 3018) {//高压框
        valueSitObj.left = 16;
        valueSitObj.top = 346;
    }
    if (type == 4009) {//母线绝缘检测仪
        valueSitObj.left = -5;
        valueSitObj.top = -60;
    }
    if (type == 4011) {//通信电源
        valueSitObj.left = 91;
        valueSitObj.top = 39;
    }
    if (num == 2) {
        valueSitObj.left = 182;
        valueSitObj.top = -4;
        valueSitObj.w = 110;
    }
    if (num == 3) {
        valueSitObj.left = 71;
        valueSitObj.top = 96;
        valueSitObj.w = 110;
    }
    if (num == 4) {
        valueSitObj.left = -70;
        valueSitObj.top = 45;
        valueSitObj.w = 69;
    }
    arr.push(valueSitObj);
}

/*从内容列表中找到对应的图片对象,复制一个出来*/
function tool_map_copyImgByImgId(imgArray, imgId) {
    var mapImgobj = null;

    var imgObj = tool_menu_getImgById(imgArray, imgId);

    if (imgObj == null) return mapImgobj;

    mapImgobj = new Object();

    mapImgobj.type = imgObj.type;/*控件类型*/
    mapImgobj.id = imgObj.id;/*new出来后进行调整*/
    mapImgobj.src = imgObj.src;
    mapImgobj.title = imgObj.title;
    mapImgobj.enableYc = imgObj.enableYc;/*界面为1显示,0不显示*/
    mapImgobj.enableName = imgObj.enableName;/*界面为1显示,0不显示*/
    if (imgObj.enableDir !== undefined) {
        mapImgobj.enableDir = imgObj.enableDir;/*界面为1显示,0不显示*/
    }
    if (imgObj.enableAlert !== undefined) {
        mapImgobj.enableAlert = imgObj.enableAlert;/*界面为1显示,0不显示*/
    }
    if (imgObj.switchNum1 !== undefined) {
        mapImgobj.switchNum1 = 1;/*默认开关编号为1*/
    }
    if (imgObj.switchNum2 !== undefined) {
        mapImgobj.switchNum2 = 2;/*默认开关编号为2*/
    }

    mapImgobj.deleteFlag = 0/*删除状态*/

    mapImgobj.associatedArr = [];

    mapImgobj.sitObj = new Object();/*默认图片位置大小对象*/

    mapImgobj.sitObj.w = imgObj.sitObj.w;
    mapImgobj.sitObj.h = imgObj.sitObj.h;
    mapImgobj.sitObj.r = imgObj.sitObj.r;
    mapImgobj.sitObj.left = imgObj.sitObj.left + (parseInt($("#offsetX").val()) ? parseInt($("#offsetX").val()) : 0);/*复制的新图片偏移制定数*/
    mapImgobj.sitObj.top = imgObj.sitObj.top + (parseInt($("#offsetY").val()) ? parseInt($("#offsetY").val()) : 0);
    mapImgobj.sitObj.color = imgObj.sitObj.color; /*复制的新图片的颜色*/
    mapImgobj.sitObj.colorIndex = imgObj.sitObj.colorIndex;

    mapImgobj.nameSitObj = new Object();/*图片名字位置对象*/
    if (imgObj.type == 17) {
        mapImgobj.name = imgObj.name;
    }
    mapImgobj.nameSitObj.direction = imgObj.nameSitObj.direction;
    mapImgobj.nameSitObj.id = imgObj.nameSitObj.id;/*new出来后进行调整*/
    mapImgobj.nameSitObj.w = imgObj.nameSitObj.w;
    mapImgobj.nameSitObj.h = imgObj.nameSitObj.h;
    mapImgobj.nameSitObj.left = imgObj.nameSitObj.left;/*是w额外加值的0.5倍*/
    mapImgobj.nameSitObj.top = imgObj.nameSitObj.top;
    mapImgobj.nameSitObj.color = imgObj.nameSitObj.color;
    mapImgobj.nameSitObj.scale = imgObj.nameSitObj.scale;/*取值范围0.1-1.0之间*/
    mapImgobj.nameSitObj.colorIndex = imgObj.nameSitObj.colorIndex;
    mapImgobj.alertSitObj = new Object();/*图片告警位置对象*/
    mapImgobj.alertSitObj.left = imgObj.alertSitObj.left;
    mapImgobj.alertSitObj.top = imgObj.alertSitObj.top;

    mapImgobj.valueSitObj = new Array();/*图片数值位置对象*/

    mapImgobj.valueSitObj = JSON.parse(JSON.stringify(imgObj.valueSitObj));
    return mapImgobj;
}

/*调整传感器遥测显示方位*/
function tool_edit_adjustValueDirection(direct, mapImgobj) {
    switch (direct) {
        case DIRECTION_RIGHT:
            mapImgobj.valueSitObj.direction = DIRECTION_RIGHT;
            mapImgobj.valueSitObj.w = 125;
            mapImgobj.valueSitObj.h = 20;
            mapImgobj.valueSitObj.left = -4;
            mapImgobj.valueSitObj.top = -0;
            break;
        case DIRECTION_LEFT:
            mapImgobj.valueSitObj.direction = DIRECTION_LEFT;
            mapImgobj.valueSitObj.w = 125;
            mapImgobj.valueSitObj.h = 20;
            mapImgobj.valueSitObj.left = 4 - mapImgobj.valueSitObj.w;
            mapImgobj.valueSitObj.top = -0;
            break;
        case DIRECTION_DOWN:
            mapImgobj.valueSitObj.direction = DIRECTION_DOWN;
            mapImgobj.valueSitObj.w = 125;
            mapImgobj.valueSitObj.h = 20;
            mapImgobj.valueSitObj.left = (mapImgobj.valueSitObj.w - mapImgobj.sitObj.w) / 2 * (-1);
            mapImgobj.valueSitObj.top = -1;
            break;
        case DIRECTION_UP:
            mapImgobj.valueSitObj.direction = DIRECTION_UP;
            mapImgobj.valueSitObj.w = 130;
            mapImgobj.valueSitObj.h = 20;
            mapImgobj.valueSitObj.left = (mapImgobj.valueSitObj.w - mapImgobj.sitObj.w) / 2 * (-1);
            mapImgobj.valueSitObj.top = -1;
            break;
    }

    return 0;
}

/*调整新图的ID*/
function tool_menu_adjustImgMaxId(g_imgMapObj, imgObj) {
    g_imgMapObj.maxid = g_imgMapObj.maxid || 5;
    /*更新图片ID*/
    var arr = imgObj.id.split("_");

    ////console.log("old img id="+imgObj.id+", maxid="+g_imgMapObj.maxid);

    imgObj.id = arr[0] + "_" + g_imgMapObj.maxid;

    g_imgMapObj.maxid += 1;

    //console.log("new img id=" + imgObj.id + ", maxid=" + g_imgMapObj.maxid);

    /*更新名字ID*/
    var brr = imgObj.nameSitObj.id.split("_");

    ////console.log("old img name id="+imgObj.nameSitObj.id+", maxid="+g_imgMapObj.maxid);

    imgObj.nameSitObj.id = brr[0] + "_" + g_imgMapObj.maxid;

    g_imgMapObj.maxid += 1;


    return 0;
}

function tool_menu_getImgById(imgArray, id) {
    var i = 0;
    var imgObj = null;

    for (; i < imgArray.length; i++) {
        var tmp = imgArray[i];

        if (tmp.id == id) {
            imgObj = tmp;
        }
    }

    return imgObj;
}

function tool_menu_getImgIndexById(imgArray, id) {

    for (var i = 0; i < imgArray.length; i++) {
        var tmp = imgArray[i];

        if (tmp.id == id) {
            return i;
        }
    }

    return -1;
}

/*返回有效的YC值数量*/
function _map_countValidYc(valueArray) {
    var i = 0;
    var num = 0;

    for (; i < valueArray.length; i++) {
        var tmp = valueArray[i];

        if (tmp.status == 1) {
            num += 1;
        }
    }

    return num;
}

/*更新图片遥测map坐标*/
function tool_map_updateImgValueSite(obj) {
    if (obj == null) return;
    if (g_currValText) {
        for (var i = 0; i < obj.valueSitObj.length; i++) {
            if (g_currValText == obj.valueSitObj[i].num) {
                var oSit = obj.valueSitObj[i];
            }
        }
    } else {
        oSit = obj.valueSitObj[0];
        g_currValText = obj.valueSitObj[0].num;
    }

    var direction = "left";
    /* console.log(g_currValText);
     console.log(oSit);*/
    switch (oSit.direction) {
        case 1:
            direction = "left";
            break;
        case 2:
            direction = "center";
            break;
        case 3:
            direction = "right";
            break;
        default:
            break;
    }
    $('#' + obj.id + ' div[valertextnum=' + g_currValText + ']').css({
        'left': oSit.left + 'px',
        'top': oSit.top + 'px',
        'width': oSit.w + 'px',
        'height': oSit.h + 'px',
        'textAlign': direction,
        'transform': "scale(" + oSit.scale + ")"
    });
    return;
}

/*更新图片告警map坐标*/
function tool_map_updateImgAlertSite(obj) {
    if (obj == null) return;
    var left = obj.alertSitObj.left;
    var top = obj.alertSitObj.top;

    $('#' + obj.id + ' div.alarmLight').css({
        'left': left + 'px',
        'top': top + 'px'
    });

    return;
}

/*更新图片名字map坐标*/
function tool_map_updateImgNameSite(obj) {
    if (obj == null) return;
    var left = obj.nameSitObj.left;
    var top = obj.nameSitObj.top;

    var nameObj = document.getElementById(obj.id).getElementsByTagName("label")[0];//获取名字对象

    if (nameObj == null) return;
    nameObj.style.left = left + 'px';
    nameObj.style.top = top + 'px';
    nameObj.style.width = obj.nameSitObj.w + 'px';
    // nameObj.style.height = obj.nameSitObj.h + 'px';
    nameObj.style.transform = "scale(" + obj.nameSitObj.scale + ")";    //scale()在这里要使用拼接的方式才能生效。
    nameObj.style.color = obj.nameSitObj.color;

    return;
}

/*更新图片map坐标*/
function tool_map_updateImgSite(imgArray, id, x, y) {
    if (id == null) return;

    var imgObj = tool_menu_getImgById(imgArray, id);

    if (imgObj == null) return;

    imgObj.sitObj.left = x;
    imgObj.sitObj.top = y;
    /*实时更新编辑栏图片位置*/
    value_x.value = x;
    value_y.value = y;

    tool_map_updateImgNameSite(imgObj);
    if (imgObj.valueSitObj.length != 0) {
        tool_map_updateImgValueSite(imgObj);
    }


    return;
}

/*更新图片map x坐标*/
function tool_MapImgSiteUpdate_X(imgArray, id, va) {
    if (id == null) return;

    var imgObj = tool_menu_getImgById(imgArray, id);

    if (imgObj == null) return;

    imgObj.sitObj.left = va;

    return;
}

/*更新图片map x坐标*/
function tool_MapImgSiteUpdate_y(imgArray, id, va) {
    if (id == null) return;

    var imgObj = tool_menu_getImgById(imgArray, id);

    if (imgObj == null) return;

    imgObj.sitObj.top = va;

    return;
}

/*更新图片map w坐标*/
function tool_MapImgSiteUpdate_width(imgArray, id, va) {
    if (id == null) return;

    var imgObj = tool_menu_getImgById(imgArray, id);

    if (imgObj == null) return;

    imgObj.sitObj.w = va;

    return;
}

/*更新图片map w坐标*/
function tool_MapImgSiteUpdate_height(imgArray, id, va) {
    if (id == null) return;

    var imgObj = tool_menu_getImgById(imgArray, id);

    if (imgObj == null) return;

    imgObj.sitObj.h = va;

    return;
}

/*更新图片map r坐标*/
function tool_MapImgSiteUpdate_rotate(imgArray, id, va) {
    if (id == null) return;

    var imgObj = tool_menu_getImgById(imgArray, id);

    if (imgObj == null) return;

    imgObj.sitObj.r = va;

    return;
}

/*更新图片map告警 x坐标*/
function tool_MapImgAlertSiteUpdate_X(imgArray, id, va) {
    if (id == null) return;

    var imgObj = tool_menu_getImgById(imgArray, id);

    if (imgObj == null) return;

    imgObj.alertSitObj.left = va;

    tool_map_updateImgAlertSite(imgObj);

    return;
}

/*更新图片map告警 y坐标*/
function tool_MapImgAlertSiteUpdate_y(imgArray, id, va) {
    if (id == null) return;

    var imgObj = tool_menu_getImgById(imgArray, id);

    if (imgObj == null) return;

    imgObj.alertSitObj.top = va;

    tool_map_updateImgAlertSite(imgObj);

    return;
}

/*更新图片map名字 x坐标*/
function tool_MapImgNameSiteUpdate_X(imgArray, id, va) {
    if (id == null) return;

    var imgObj = tool_menu_getImgById(imgArray, id);

    if (imgObj == null) return;

    imgObj.nameSitObj.left = va;

    tool_map_updateImgNameSite(imgObj);

    return;
}

/*更新图片map名字 y坐标*/
function tool_MapImgNameSiteUpdate_y(imgArray, id, va) {
    if (id == null) return;

    var imgObj = tool_menu_getImgById(imgArray, id);

    if (imgObj == null) return;

    imgObj.nameSitObj.top = va;

    tool_map_updateImgNameSite(imgObj);

    return;
}

/*更新图片map名字 w坐标*/
function tool_MapImgNameSiteUpdate_width(imgArray, id, va) {
    if (id == null) return;

    var imgObj = tool_menu_getImgById(imgArray, id);

    if (imgObj == null) return;

    imgObj.nameSitObj.w = va;

    tool_map_updateImgNameSite(imgObj);

    return;
}

/*更新图片map名字 w坐标*/
function tool_MapImgNameSiteUpdate_height(imgArray, id, va) {
    if (id == null) return;

    var imgObj = tool_menu_getImgById(imgArray, id);

    if (imgObj == null) return;

    imgObj.nameSitObj.h = va;

    tool_map_updateImgNameSite(imgObj);

    return;
}

/*更新图片map名字 s缩放*/
function tool_MapImgNameSiteUpdate_scale(imgArray, id, va) {
    if (id == null) return;

    var imgObj = tool_menu_getImgById(imgArray, id);

    if (imgObj == null) return;

    imgObj.nameSitObj.scale = va;

    tool_map_updateImgNameSite(imgObj);

    return;
}

/*更新图片map名字显示隐藏状态*/
function tool_MapImgNameUpdateDisplayStatus(imgArray, id) {
    if (id == null) return 0;

    var imgObj = tool_menu_getImgById(imgArray, id);

    if (imgObj == null) return 0;

    // var nameObj = document.getElementById(imgObj.nameSitObj.id);//获取名字对象
    var nameObj = document.getElementById(imgObj.id).getElementsByTagName("label")[0];//获取名字对象

    if (imgObj.enableName != 1) {
        imgObj.enableName = 1;
        nameObj.style.display = "block";
    } else {
        imgObj.enableName = 0;
        nameObj.style.display = "none";
    }


    return imgObj.enableName;
}

/*更新图片map图片颜色 和直线的颜色*/
function tool_MapImgImgUpdateColor(imgArray, id, colorIndex) {
    if (id == null) return 0;

    var imgObj = tool_menu_getImgById(imgArray, id);

    if (imgObj == null) return 0;
    console.log(imgObj);
    imgObj.sitObj.color = _map_getYcColorByIndex(colorIndex);
    imgObj.sitObj.colorIndex = colorIndex;
    if (imgObj.type == 1 || imgObj.type == 2) {
        var nameObj = document.getElementById(imgObj.id).getElementsByTagName("div")[0];
        nameObj.style.backgroundColor = imgObj.sitObj.color;
        return;
    }
    if (imgObj.type == 6001) {
        var nameObj = document.getElementById(imgObj.id).getElementsByTagName("div")[0];
        nameObj.style.borderColor = imgObj.sitObj.color;
        return;
    }
    var str = imgObj.src.split('-col-');
    var str2 = str[0].substring(0, str[0].length - 1);
    var str3 = str2 + colorIndex + '-col-' + str[1];
    $('#' + imgObj.id + ' main').css('backgroundImage', 'url(' + str3 + ')');
    $('#tmvImgDiv div').css('backgroundImage', 'url(' + str3 + ')');
    imgObj.src = str3;
}

/*更新图片map名字字体的颜色 和直线的颜色*/
function tool_MapImgNameUpdateColor(imgArray, id, colorIndex) {
    if (id == null) return 0;

    var imgObj = tool_menu_getImgById(imgArray, id);

    if (imgObj == null) return 0;
    imgObj.nameSitObj.color = _map_getYcColorByIndex(colorIndex);
    imgObj.nameSitObj.colorIndex = colorIndex;
    var nameObj = document.getElementById(imgObj.id).getElementsByTagName('label')[0];//获取名字对象
    nameObj.style.color = imgObj.nameSitObj.color;
    return;
}

/*更新图片map红色方向箭头显示隐藏状态*/
function tool_MapImgDirUpdateDisplayStatus(imgArray, id) {
    if (id == null) return 0;

    var imgObj = tool_menu_getImgById(imgArray, id);

    if (imgObj == null) return 0;

    if (imgObj.enableDir != 1) {
        imgObj.enableDir = 1;
        $('#' + imgObj.id).find(".direcLine").css("display", "block");
    } else {
        imgObj.enableDir = 0;
        $('#' + imgObj.id).find(".direcLine").css("display", "none");
    }
    return imgObj.enableDir;
}

/*更新图片告警灯显示隐藏状态*/
function tool_MapImgAlertUpdateDisplayStatus(imgArray, id) {
    if (id == null) return 0;
    var imgObj = tool_menu_getImgById(imgArray, id);
    if (imgObj == null) return 0;
    if (imgObj.enableAlert != 1) {
        imgObj.enableAlert = 1;
        $('#' + imgObj.id).find(".alarmLight").css("display", "block");
    } else {
        imgObj.enableAlert = 0;
        $('#' + imgObj.id).find(".alarmLight").css("display", "none");
    }
    return imgObj.enableAlert;
}


//获取到当前要操作的遥测文本
function get_curr_val_obj(obj) {
    for (var i = 0; i < obj.valueSitObj.length; i++) {
        if (g_currValText == obj.valueSitObj[i].num) {
            return obj.valueSitObj[i];
        }
    }
}

/*更新图片map遥测 x坐标*/
function tool_MapImgValueSiteUpdate_X(imgArray, id, va) {
    if (id == null) return;

    var imgObj = tool_menu_getImgById(imgArray, id);

    if (imgObj == null) return;
    var currValueSitObj = get_curr_val_obj(imgObj);
    currValueSitObj.left = va;

    tool_map_updateImgValueSite(imgObj);

    return;
}

/*更新图片map遥测 y坐标*/
function tool_MapImgValueSiteUpdate_y(imgArray, id, va) {
    if (id == null) return;

    var imgObj = tool_menu_getImgById(imgArray, id);

    if (imgObj == null) return;

    var currValueSitObj = get_curr_val_obj(imgObj);
    currValueSitObj.top = va;
    tool_map_updateImgValueSite(imgObj);

    return;
}

/*更新图片map遥测 w坐标*/
function tool_MapImgValueSiteUpdate_width(imgArray, id, va) {
    if (id == null) return;

    var imgObj = tool_menu_getImgById(imgArray, id);

    if (imgObj == null) return;

    var currValueSitObj = get_curr_val_obj(imgObj);
    currValueSitObj.w = va;

    tool_map_updateImgValueSite(imgObj);

    return;
}

/*更新图片map遥测 w坐标*/
function tool_MapImgValueSiteUpdate_height(imgArray, id, va) {
    if (id == null) return;

    var imgObj = tool_menu_getImgById(imgArray, id);

    if (imgObj == null) return;

    var currValueSitObj = get_curr_val_obj(imgObj);
    currValueSitObj.h = va;

    tool_map_updateImgValueSite(imgObj);

    return;
}

/*更新图片map遥测 s缩放*/
function tool_MapImgValueSiteUpdate_scale(imgArray, id, va) {
    if (id == null) return;

    var imgObj = tool_menu_getImgById(imgArray, id);

    if (imgObj == null) return;
    var currValueSitObj = get_curr_val_obj(imgObj);
    currValueSitObj.scale = va;

    tool_map_updateImgValueSite(imgObj);

    return;
}

/*更新图片map遥测显示方位*/
function tool_MapImgValueAdjustDirect(imgArray, id, va) {
    if (id == null) return;

    var imgObj = tool_menu_getImgById(imgArray, id);

    if (imgObj == null) return;

    var currValueSitObj = get_curr_val_obj(imgObj);
    currValueSitObj.direction = va;


    tool_map_updateImgValueSite(imgObj);

    return;
}

/*更新图片map遥测显示隐藏状态*/
function tool_MapImgValueUpdateDisplayStatus(imgArray, id) {
    if (id == null) return 0;

    var imgObj = tool_menu_getImgById(imgArray, id);

    if (imgObj == null) return 0;

    var nameObj = $('#' + imgObj.id + ' .valerText');//获取遥测文本对象


    if (imgObj.enableYc != 1) {
        imgObj.enableYc = 1;
        nameObj.css({'display': "table"});
    } else {
        imgObj.enableYc = 0;
        nameObj.css({'display': "none"});
    }


    return imgObj.enableYc;
}


/*更新图片map的删除状态*/
function tool_MapImgUpdateDeleteFLag(imgArray, id) {
    if (id == null) return 0;

    var index = tool_menu_getImgIndexById(imgArray, id);
    if (index < 0) {
        return index;
    }
    imgArray.splice(index, 1);
    return 1;
}


//获取已经配置好400v配置 电气图
function load_configed(importDataStnId, EmapNo, isImport) {
    var theEmapNo = isImport ? EmapNo : parent.menu;
    var ob = new Object();
    ob.emapNo = theEmapNo;
    ob.userData = 0;
    // console.log(ob);
    var json = JSON.stringify(ob);
    ccc_lib_reqDataByCmd("", USER_DOWNLOAD_FILE, json, downLoadFile);//获取站点列表
    // downLoadFile();
}

//返回地图配置文件
function downLoadFile(id, info, oRet) {
    console.log(oRet);
    var isImportData2 = isImportData;
    isImportData = false; //记录下是否是导入其他站电气图进来的
    console.log("******地图配置文件******");
    parent.isInit = 1;//是否已经成功加载了电气图


    loadLowMod(parent.g_strSelStnId);//设备数据


    if (oRet.result == 0) {

        // console.log(oRet.content);
        var ob = JSON.parse(oRet.content);
        console.log(ob);
        if (isImportData2) {
            for (var i = 0; i < ob.data.content.length; i++) {
                ob.data.content[i].associatedArr = [];
            }
            ob.data.bgImg = old_name;
        }//end if isImportData2
        show_configed(ob.data);
    } else if (oRet.result == -15) {
        if (isImportData2) {
            alert("暂无数据！");
        }
    } else {
        tool_map_createObj(g_imgMapObj);
        console.log(g_imgMapObj);
        // clearAll();
    }//end if

}

//清除全部数据
function clearAll() {
    g_imgMapObj.content = [];
    $("#contentDiv .elemBox,#contentDiv div").remove();
    refresh_ReInitEditImg();
}

//显示配置好的模块
function show_configed(data) {
    console.log(data);
    console.log("********配置好的模块*********");
    g_imgMapObj = data;
    revocationArr[0] = JSON.stringify(g_imgMapObj);
    contentDiv.style.width = (g_imgMapObj.width || vectorData.contentDivW) + "px";
    contentDiv.style.height = (g_imgMapObj.height || vectorData.contentDivH) + "px";
    document.getElementById("widt").value = (g_imgMapObj.width || vectorData.contentDivW);
    document.getElementById("heig").value = (g_imgMapObj.height || vectorData.contentDivH);
    if (g_imgMapObj.bgImg) {  //    打开if启用背景图片
        contentDiv.style.background = "url(" + g_strFile + '/file/D' + parent.g_strSelStnId + '/d1' + parent.g_strSelStnId + '/' + g_imgMapObj.bgImg + ") center no-repeat";
        old_name = g_imgMapObj.bgImg;
    } else {
        contentDiv.style.background = "url('img/center.png') center no-repeat";
    }
    /*刷新界面显示：内容模块*/
    refresh_mapImg(g_imgMapObj);
    if (g_imgMapObj.isShowModName == 1) {
        $("#isShowModName").prop("checked", true);
        $("#isShowModName").val(1);
    } else {
        $("#isShowModName").prop("checked", false);
        $("#isShowModName").val(0);
    }
    if (g_imgMapObj.isShowDataName == 1) {
        $("#isShowDataName").prop("checked", true);
        $("#isShowDataName").val(1);
    } else {
        $("#isShowDataName").prop("checked", false);
        $("#isShowDataName").val(0);
    }

    //for(var i=0;i<g_imgMapObj.content.length;i++){
    //    if(g_imgMapObj.content[i].hasOwnProperty('name')){
    //        $(".myDev").append('<li>'+g_imgMapObj.content[i].name+',已关联  '+g_imgMapObj.content[i].title+'</li>');
    //    }
    //}
}

//$(document).click(function(event){
//    var _con = $('.content-left');   // 设置目标区域
//    if(!_con.is(event.target) && _con.has(event.target).length === 0){ // Mark 1
//        $('.bloc').fadeOut();          //淡出消失
//    }
//});
//获取400v低压模块列表
function loadLowMod() {
    var ob = new Object();
    ob.userData = 1;
    ob.type = parseInt(parent.menu);
    // ob.type = parseInt(0);
    var json = JSON.stringify(ob);
    ccc_lib_reqDataByCmd("", USER_STATION_MONITOR_DEVLIST_GETBYID, json, modLowList);
    // modLowList();
}

//登录连接成功之后
function group_onload(opt) {
    /*
        //点击集团
        $(".bloc").on("click", "li>span", function () {
            $(".bloc>li>b").removeClass("active");
            $(this).siblings("b").addClass("active");
            $(".bloc").show();
            $(".station").hide();
            $(this).siblings("ul").toggle();
            $(this).parent("li").siblings("li").children("ul").hide();
            var src = $(this).children("img:last-child").attr("src");
            $(".bloc>li>span>img:last-child").attr("src", "img/toBot.png");
            $(".items>li>a>img:last-child").attr("src", "img/toBot.png");
            if (src == "img/toBot.png") {
                $(this).children("img:last-child").attr("src", "img/toTop.png");
            } else {
                $(this).children("img:last-child").attr("src", "img/toBot.png");
            }
            SelGroupId = $(this).parent("li").attr("id");
            getProjects(SelGroupId);

        });

        //点击项目
        $(".bloc").on("click", ".items>li>a", function () {
            $(this).siblings("ul").toggle();
            $(this).parent("li").siblings("li").children("ul").hide();
            var src = $(this).children("img:last-child").attr("src");
            $(".items>li>a>img:last-child").attr("src", "img/toBot.png");
            if (src == "img/toBot.png") {
                $(this).children("img:last-child").attr("src", "img/toTop.png");
            } else {
                $(this).children("img:last-child").attr("src", "img/toBot.png");
            }
            SelProId = $(this).parent("li").attr("id");
            getStations(SelProId);
        });

        $(".bloc").on("click", "li>b", function () {
            $(this).parent("li").siblings("li").children("ul").hide();
            //$(this).parent("li").siblings("li").children("span").css("background","rgba(7, 101, 139, 0.6)");
        });
        //站点选中事件
        $(".bloc").on("click", ".station>li>a", function (e) {
            $(this).siblings("ul").toggle();
            $(this).parent("li").siblings("li").children("ul").hide();
            var src = $(this).children("img:last-child").attr("src");
            if (src == "img/toBot.png") {
                $(this).children("img:last-child").attr("src", "img/toTop.png");
            } else {
                $(this).children("img:last-child").attr("src", "img/toBot.png");
            }
            theGroupId = $(this).attr("name");
            getEmapNo(theGroupId);
        });
        $(".bloc").on("click", ".stationSon>li>a", function (e) {
            $(".bloc").hide();
            var theEmapNo = $(this).attr('name');
            // console.log(isImportData);
            load_configed(theGroupId, theEmapNo, isImportData);
        });

        /!*$(".bloc").on("click", ".station>li>a", function (e) {
            e.preventDefault();
            //$(".navbar_station").css("top","0px").css("display","inline-block").css("margin-right","0");
            $(".station>li>a").css("color", "white");
            //$(this).css("color","#1fddff");
            if (!isImportData) {
                var station = $(this).attr("data-name");
                parent.g_strSelStnId = this.name;
                parent.g_strSelStnName = station;
                $(".stn").text(station);
                $(".stn").attr("about", parent.g_strSelStnId);
                //$(".items").hide();
                parent.g_strSelProId = $(this).parent("li").parent("ul").attr("data-about");
                parent.g_strSelProName = $(this).parents(".station").siblings("a").attr("data-name");
                parent.g_strSelGroupId = $(this).parents(".items").parent("li").attr("id");
                var SelProName = $(this).parents(".station").siblings("a").attr("data-name");
                var SelPPName = $(this).parents(".items").siblings("span").attr("data-name");
                parent.systemType = 3;
                parent.g_strMiddle = [];
                $(".bloc>li>span>img:last-child").attr("src", "img/toBot.png");
                $(".myStn").text(parent.g_strSelStnName);
            }
            load_configed(this.name, isImportData);
            load_bg();
            // refresh_toolList();

            $(".bloc").hide();
            // console.log(isImportData)
        });*!/*/

    function load_bg() {
        // $("#contentDiv").css("background", "url('/publicresource/mapbg/safe/" + stnId + "safe.png') center center no-repeat")
    }

    function onList() {
        $(".bloc .station").each(function () {
            if ($(this).children("li").length > 5) {
                $(this).css("height", "155").css("overflow-y", "scroll").css("overflow-x", "hidden");
                //$(this).niceScroll({cursorborder:"",cursorcolor:"white",boxzoom:true}); // First scrollable DIV
            }
        })
    }

    /* //禁止页面内按F5键进行刷新
     function f_DisableF5Refresh(event) {
         var e = event || window.event;
         var keyCode = e.keyCode || e.which;
         if (keyCode == 116) {
             if (e.preventDefault) { //非IE
                 e.preventDefault();
             } else { //IE
                 e.keyCode = 0;
                 e.returnValue = false;
             }
         }
     }

     if (document.addEventListener) {
         document.addEventListener('keydown', f_DisableF5Refresh, false);
     } else {
         document.attachEvent('onkeydown', f_DisableF5Refresh);
     }
 */
    // var stnname = localStorage.getItem("stnname");
    // $(".myStn").text(stnname);

    //点击选择背景图
    $("#configBG").change(function (e) {
        var str = $(this).val();
        //console.log(str);
        //$("#contentDiv").css("background-image","url("+str+")");
        var index = str.lastIndexOf("\/");
        str = str.substring(index + 1, str.length);
        var file = this.files[0];
        if (!/image\/\w+/.test(file.type)) {
            alert("文件必须为图片！");
            return false;
        }
        if (file) {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                $("#contentDiv").css("background", "url(" + this.result + ") center no-repeat");
                var theName = file.name.split('.');
                var theLength = theName.length;
                var ext = theName[theLength - 1];
                g_imgMapObj.bgImg = parent.menu + Math.ceil(Math.random() * 100) + '.' + ext;

            };
        }
    });

    //点击重载设备
    $("#reload").click(function () {
        var con = confirm("注意：从平台重新加载项目配置信息,会覆盖当前已编辑的配置信息。");
        if (con) {
            window.location.reload();
        }
    });
    //点击导入模板数据
    /* $("#importData").click(function () {
         /!*var con = confirm("注意：从其他站点导入电气图,会覆盖当前已编辑的配置信息。");
         if (con) {*!/
             isImportData = true;

         // }

         console.log(isImportData)
     });*/
    $("#importData").change(function (e) {
        var file = $(this).get(0).files[0];
        if (!file) {
            return;
        }

        var reader = new FileReader(); //  创建 FileReader对象
        reader.readAsText(this.files[0]); //  把文件读取为字符串
        //  文件加载完成
        reader.onload = function (ev) {
            var jsonStr = ev.target.result; //  把字符串传给 jsonStr
            jsonStr = JSON.parse(jsonStr); //  把 JSON 字符串转换为 JSON 对象
            if (jsonStr.content == undefined) {
                alert('文件格式不正确！');
            } else {
                console.log(jsonStr); //  在控制台输出 JSON
                // isImportData = true;
                show_configed(jsonStr);
            }

        };
        e.target.value = '';
    });


    $(".stns>img").click(function () {
        isImportData = false;
        // console.log(isImportData)
    });

    //切换显示设备名称
    $("#isShowModName").click(function () {
        var val = $(this).val();
        if (val == 0) {
            $(this).prop("checked", true);
            $(this).val(1);
            g_imgMapObj.isShowModName = 1;
        } else {
            $(this).prop("checked", false);
            $(this).val(0);
            g_imgMapObj.isShowModName = 0;
        }
        refresh_mapImg(g_imgMapObj);
        //console.log(g_imgMapObj)
    });
    //切换显示数据名称
    $("#isShowDataName").click(function () {
        var val = $(this).val();
        if (val == 0) {
            $(this).prop("checked", true);
            $(this).val(1);
            g_imgMapObj.isShowDataName = 1;
        } else {
            $(this).prop("checked", false);
            $(this).val(0);
            g_imgMapObj.isShowDataName = 0;
        }
    });
    $(".confirm button").click(function () {
        $(".confirm").hide();
    });


    //点击弹出保存按钮
    $("#save").click(function () {
        $("#saves").show();
    });
    //点击确认保存
    $("#saves p>button:first-child").click(function () {
        timeoutID = setTimeout(function () {
            timeoutID = null;
            $('#saving').show();
        }, 1000);
        var fileInput = $('#configBG').get(0).files[0];
        if (g_imgMapObj.bgImg && fileInput) {
            var fd = new FormData();
            fd.append('file', document.getElementById("configBG").files[0]);
            fd.append('file_name', g_imgMapObj.bgImg);
            // fd.append('old_name', old_name);
            fd.append('file_id', parent.menu);
            fd.append('file_location', 'D' + parent.g_strSelStnId + '/d1' + parent.g_strSelStnId + '/');
            fd.append('pwd', hex_md5("admin"));
            fd.append('uname', "admin");
            upload(fd);
        } else if (old_name) {//删除原来的背景图
            var currObjArr = [
                {
                    file_id: parent.menu,
                    file_location: 'D' + parent.g_strSelStnId + '/d1' + parent.g_strSelStnId + '/',
                    file_name: old_name
                }
            ];
            var o = new Object;
            o.type = 2;
            o.data = currObjArr;
            postJSON(g_strFile + "/php/data.php", o, deleteFileFn);
            saveStart();
        } else {
            saveStart();
        }
    });

    //发送JSON数据
    function postJSON(url, data, success) {
        $.ajax({
            url: url,
            type: "POST",
            data: data, //参数
            success: success,
            // contentType: 'application/json; charset=utf-8',
            // dataType: 'json',
            async: true
        });
    }

    function deleteFileFn(obj) {
        console.log(obj);
    }

    //点击弹出重载设备按钮
    $("#reloadMods").click(function () {
        $("#reloaddev").show();
    });
    //点击确认重载设备
    $("#reloaddev p>button:first-child").click(function () {
        /*$("#showMods").val(1);*/
        loadLowMod(parent.g_strSelStnId);
    });
    //点击弹出刷新按钮 没有
    $(".refresh").click(function () {
        $("#refresh").show();
    });
    //点击确认刷新按钮
    $("#refresh p>button:first-child").click(function () {
        load_configed();
    });
    /* //给图片添加选中标记
     $("#contentDiv").on("click", ".elemBox", function () {
         $(this).addClass("active");
     });*/
    //点击选择左边模块 me 高亮选中设备
    $(".content-left .myDev").on("click", ".myActiveBox", function () {
        $(".myActiveBox").removeClass("active");
        $(this).addClass("active");
        if (!$('#editCtrlDiv footer>div:nth-of-type(2)').hasClass('activeBtn')) {
            $('#editCtrlDiv footer>div:nth-of-type(2)').addClass("activeBtn ").siblings().removeClass("activeBtn");
            $(".equipment").show();
            $(".ediStyle").hide();
        }
    });
}//end load
//点击设置区域
function setArea() {
    var wid = document.getElementById("widt").value;
    var hei = document.getElementById("heig").value;
    IsChkStrPlusValue(wid);
    IsChkStrPlusValue(hei);
    document.getElementById("contentDiv").style.width = wid + "px";
    document.getElementById("contentDiv").style.height = hei + "px";
    // document.getElementById("canv").style.height = hei + "px";
    // console.log(wid+'*******');
    g_imgMapObj.width = wid;
    g_imgMapObj.height = hei;

}
$('.setArea').on('click',function () {
    setArea();
});
$('#widt,#heig').on('blur',function () {
    setArea();
});

//判断输入的是否是大于0的正整数
function IsChkStrPlusValue(str) {
    var regexp = /^[1-9]\d*$/;
    if (!regexp.test(str)) {
        alert("请输入大于0的正整数");
        return false;
    }
    return;
}

//准备发送数据返回
function startedSendData(id, info, oRet) {
    if (oRet.result == -1) {
        if (timeoutID) {
            clearTimeout(timeoutID);
        } else {
            $('#saving').hide();
        }
        $("#savConfirm").show().find("p:nth-child(2)").text("保存失败！" + oRet.desc);
    }
    if (oRet.result == 0) {
        $('#saving p:nth-last-of-type(1)').html('请稍后，保存文件中<i class="coming"></i><span class="saveNum"></span>');
        var newBflen = ((arrybuffer.length <= sliceLenth) ? (arrybuffer.length) : (sliceLenth));
        var newBf = arrybuffer.slice(0, newBflen);
        var theOb = Utf8ToUc_oTme(newBf);
        var ob = new Object();
        ob.len = theOb.num;
        ob.pos = 0;
        ob.body = theOb.theString;
        var json = JSON.stringify(ob);
        ccc_lib_reqDataByCmd("", USER_TANSMIT_FILE_START, json, sendData);
    }
}

//开始发送数据返回
function sendData(id, info, oRet) {
    if (oRet.result == -1) {
        if (timeoutID) {
            clearTimeout(timeoutID);
        } else {
            $('#saving').hide();
        }
        $("#savConfirm").show().find("p:nth-child(2)").text("保存失败！" + oRet.desc);
    }
    if (oRet.result == 0) {
        var nextPos = parseInt(oRet.nextPos);
        // console.log();
        $('.saveNum').text(parseInt(nextPos / arrybuffer.length * 100) + '%');
        if (nextPos < arrybuffer.length) {//没发完
            var remain = arrybuffer.length - nextPos;
            var newBflen = (remain <= sliceLenth) ? remain : sliceLenth;
            var newBf = arrybuffer.slice(nextPos, nextPos + newBflen);
            var theOb = Utf8ToUc_oTme(newBf);
            var ob = new Object();
            ob.len = theOb.num;
            ob.pos = nextPos;
            ob.body = theOb.theString;
            var json = JSON.stringify(ob);
            ccc_lib_reqDataByCmd("", USER_TANSMIT_FILE_START, json, sendData);
        } else {
            var ob = new Object();
            var json = JSON.stringify(ob);
            ccc_lib_reqDataByCmd("", USER_TRANSMIT_FILE_END, json, sendDataOver);
        }
    }
}

//发送数据完毕返回
function sendDataOver(id, info, oRet) {
    if (timeoutID) {
        clearTimeout(timeoutID);
    } else {
        $('#saving').hide();
    }
    if (oRet.result == 0) {
        $("#savConfirm").show().find("p:nth-child(2)").text("保存成功！");
        old_name = g_imgMapObj.bgImg;
    } else {
        $("#savConfirm").show().find("p:nth-child(2)").text("保存失败！" + oRet.desc);
    }
}

// UTF8字符集实际长度计算
function getStrLeng(str) {
    var realLength = 0;
    var len = str.length;
    var charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) {
            realLength += 1;
        } else {
            if (charCode < 2048) {
                realLength += 2;
            } else {
                if (charCode < 65536) {
                    realLength += 3;
                } else {
                    //这里偷懒了，其他全部算6字节了。计算中英文，这个计算方法应该是够用了。
                    realLength += 6;
                }
            }
        }
    }
    return realLength;
}


//************me**************

window.onload = function () {
    // $("#showMods").val(1);
    g_imgMapObj.content = [];
    init();
};

var evt_move = {
    //window.event和事件参数对象e的兼容
    getEvent: function (evt) {
        return window.event || evt;
    },
    //可视区域的横坐标的兼容代码
    getClientX: function (evt) {
        return this.getEvent(evt).clientX;
    },
    //可视区域的纵坐标的兼容代码
    getClientY: function (evt) {
        return this.getEvent(evt).clientY;
    },
    //页面向左卷曲出去的横坐标
    getScrollLeft: function () {
        return window.pageXOffset || document.body.scrollLeft || document.documentElement.scrollLeft || 0;
    },
    //页面向上卷曲出去的纵坐标
    getScrollTop: function () {
        return window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop || 0;
    },
    //相对于页面的横坐标(pageX或者是clientX+scrollLeft)
    getPageX: function (evt) {
        return this.getEvent(evt).pageX ? this.getEvent(evt).pageX : this.getClientX(evt) + this.getScrollLeft();
    },
    //相对于页面的纵坐标(pageY或者是clientY+scrollTop)
    getPageY: function (evt) {
        return this.getEvent(evt).pageY ? this.getEvent(evt).pageY : this.getClientY(evt) + this.getScrollTop();
    }

};

//400v低压模块列表
function modLowList(id, info, obj) {

    console.log(obj);
    $(".myDev>li").remove();
    modLowListData = obj;
    var cab = obj.box;
    var mod = obj.data;
    console.log("***********电气图设备模块列表");
    for (var i = 0; i < cab.length; i++) {
        if (cab[i].type) {
            if (cab[i].type == 3) {
                $(".myDev").append('<li><p class="smallTitle myActiveBox" title="' + (cab[i].name || '') + '" box-id="' + cab[i].boxId + '" data-gtw="' + cab[i].boxId + '" data-addr data-type>' + cab[i].name + '<i></i></p><ul class="sonUl"></ul></li>');
            } else {
                $(".myDev").append('<li><p class="smallTitle myActiveBox" title="' + (cab[i].name || '') + '" box-id="' + cab[i].boxId + '" data-gtw data-addr data-type>' + cab[i].name + '<i></i></p><ul class="sonUl"></ul></li>');
            }
            for (var j = 0; j < mod.length; j++) {
                var date2 = mod[j];
                if (cab[i].boxId == date2.boxId) {
                    //当柜子类型为高压时柜体名等于设备名
                    /* if (cab[i].type == 3) {
                         date2.name = cab[i].name;
                     }*/
                    $(".myDev>li:nth-child(" + (i + 1) + ")>ul").append(
                        '<li class="myActiveBox" data-gtw="' + date2.com + '" data-addr="' + date2.addr + '" data-type="' + date2.devType + '" box-id="' + date2.boxId +
                        '" title="' + (date2.name || '') + '"><p>' + (date2.name || (date2.com + ' - ' + date2.addr)) + '</p></li>');
                }
            }
        }
    }//end for
    //对比显示所有关联
    for (var i = 0; i < g_imgMapObj.content.length; i++) {
        if (g_imgMapObj.content[i].associatedArr.length) {
            var associatedArr = g_imgMapObj.content[i].associatedArr;
            $(".myActiveBox").each(function () {
                var com = $(this).attr("data-gtw");
                var addr = $(this).attr("data-addr");
                var devType = $(this).attr("data-type");
                var boxId = $(this).attr("box-id");
                for (var j = 0; j < associatedArr.length; j++) {
                    if (associatedArr[j].com == com && associatedArr[j].addr == addr && associatedArr[j].devType == devType && associatedArr[j].boxId == boxId) {
                        // 同一ID关联几个设备
                        if ($(this).hasClass("abouted")) {
                            var leftInfo = $(this).find("span").text();
                            if (leftInfo) {
                                $(this).find("span").text(parseInt(leftInfo) + 1);
                            } else {
                                $(this).append("<span>2</span>");
                            }
                        } else {
                            $(this).addClass("abouted");
                        }
                        // 同一ID关联几个设备 end
                    }
                }//end for associatedArr
            })//end each
            //当后台设备名字发生变化时，自动更正电气图上的name，注意仍需记得点击保存按钮
            for (var n = 0; n < mod.length; n++) {
                for (var j = 0; j < associatedArr.length; j++) {
                    if (mod[n].com == associatedArr[j].com && associatedArr[j].addr == mod[n].addr && associatedArr[j].boxId == mod[n].boxId) {
                        if (mod[n].name) {
                            g_imgMapObj.content[i].associatedArr[j].name = mod[n].name;
                        }
                    }//end if
                }
            }//end for mod
            for (var n = 0; n < cab.length; n++) { //柜子名称改变
                for (var j = 0; j < associatedArr.length; j++) {
                    if (cab[n].boxId == associatedArr[j].boxId && associatedArr[j].com == '' && associatedArr[j].addr == '') {
                        if (cab[n].name) {
                            g_imgMapObj.content[i].associatedArr[j].name = cab[n].name;
                        }
                    }
                }
            }//end for cab
        }//end if


    }//end for g_imgMapObj.content.length

    refresh_mapImg(g_imgMapObj);
}//end fn
// 切换设备和元件库
$(".leftNav div").click(function () {
    $(this).addClass("activeBtn ").siblings().removeClass("activeBtn");
    if ($(this).text() == "设备") {
        $(".myDev").show();
        $(".myLibrary,.currColor2Box").hide();
    } else {
        $(".myLibrary,.currColor2Box").show();
        $(".myDev").hide();
    }
});

// 页面点击按钮
//遥测微导航
$(".yc_text_nar").on('click', 'span', function () {
    var num = parseInt($(this).attr('yc-text'));
    var ImgObj = tool_menu_getImgById(g_imgMapObj.content, g_currNodeObj.id);
    yc_text_content_fn(ImgObj, num);
});
//遥测添加按钮
$(".yc_text_add").on('click', function () {
    $(".selectText").show();
    if (g_currNodeObj != null) {
        var imgObj = tool_menu_getImgById(g_imgMapObj.content, g_currNodeObj.id);
        $(".selectText main div").removeClass("disabled");
        for (var i = 0; i < imgObj.valueSitObj.length; i++) {
            var num = imgObj.valueSitObj[i].num;
            $(".selectText main div[yc-text=" + num + "]").addClass("disabled");
        }

    }
});
//选定添加遥测按钮
$(".selectText main div").on("click", function () {
    if (!$(this).hasClass("disabled")) {
        var num = parseInt($(this).attr("yc-text"));
        var imgObj = tool_menu_getImgById(g_imgMapObj.content, g_currNodeObj.id);
        ycValueNew(imgObj.valueSitObj, num);
        $("#" + imgObj.id + " .valerText").remove();
        $("#" + imgObj.id + "").append(tool_map_imgValueDisplay(imgObj));
        yc_text_content_fn(imgObj, num);
        $("#divvaluesiteid,.delete").show();
        $(".notText").hide();
    }//end if
});
//删除遥测文本
$(".boxYCText .delete ").on("click", function () {
    $("#lb_value span[yc-text=" + (g_currValText) + "]").hide();
    var ImgObj = tool_menu_getImgById(g_imgMapObj.content, g_currNodeObj.id);
    for (var i = 0; i < ImgObj.valueSitObj.length; i++) {
        if (ImgObj.valueSitObj[i].num == g_currValText) {
            ImgObj.valueSitObj.splice(i, 1);
        }
    }// end for
    $("#" + ImgObj.id + " .valerText").remove();
    $("#" + ImgObj.id + "").append(tool_map_imgValueDisplay(ImgObj));
    if (!ImgObj.valueSitObj.length) {
        $("#divvaluesiteid,.delete").hide();
        $(".notText").show();
    } else {
        yc_text_content_fn(ImgObj, ImgObj.valueSitObj[0].num);
    }


});
// 添加弹出框
$(".confirm>p:first-child span").on("click", function () {
    $(this).parents(".confirm").hide();
});
$(".selectText  div").on("click", function () {
    if (!$(this).hasClass('disabled')) {
        $(this).parents(".confirm").hide();
    }
});

//导航展开、回收按钮
$(".myLibrary .smallTitle").on("click", function () {
    // $(".myLibrary .sonUl").hide();
    $(this).parent("li").siblings("li").find(".sonUl").hide();
    $(this).siblings("ul").toggle();
});
// $(".myDev").on("click", ".smallTitle i", function () {
//     $(this).parent(".smallTitle").siblings("ul").toggle();
// });
$(".myDev").on("click", ".smallTitle", function () {
    $(this).siblings("ul").toggle();
});
//点击新增元件
$(".myLibrary .sonUl").on('click', 'li', function () {
    var imgType = $(this).attr('img-type');
    newImg(imgType);
});
//切换样式 设备
$("#editCtrlDiv footer").on("click", "div", function () {
    $(this).addClass("activeBtn ").siblings().removeClass("activeBtn");
    if ($(this).text() == "设备") {
        $(".equipment").show();
        $(".ediStyle").hide();
    } else {
        $(".ediStyle").show();
        $(".equipment").hide();
    }
});
// 显示名称按钮
$("#ipt_name").on("click", function () {
    var status = name_updateYcStatus();

    if (status != 1) {
        $(this).css("backgroundColor", "#808080");
    } else {
        $(this).css("backgroundColor", "#1874CD");
    }
});
// 显示箭头按钮
$("#ipt_direction").on("click", function () {
    var status = dir_updateYcStatus();
    // console.log(status);
    if (status != 1) {
        $(this).css("backgroundColor", "#808080");
    } else {
        $(this).css("backgroundColor", "#1874CD");
    }
});
// 显示告警按钮
$("#ipt_alert").on("click", function () {
    var status = alert_updateYcStatus();

    if (status != 1) {
        $(this).css("backgroundColor", "#808080");
    } else {
        $(this).css("backgroundColor", "#1874CD");
    }
});
//地图遥测文本点击事件
$("#contentDiv").on("mousedown", ".valerText", function () {
    var id = $(this).parents('.elemBox').attr('id');
    var ImgObj = tool_menu_getImgById(g_imgMapObj.content, id);
    yc_text_content_fn(ImgObj, $(this).attr("valertextnum"));
});
//显示遥测按钮
$("#ipt_rc").on("click", function () {
    var status = value_updateYcStatus();

    if (status != 1) {
        $(this).css("backgroundColor", "#808080");
    } else {
        $(this).css("backgroundColor", "#1874CD");
    }
});
//点击关联设备
$("#aboutedMod").click(function () {
    if (!g_currNodeObj) {
        alert("请选择编辑区域内一项安防进行关联！");
        return false;
    }
    // *********左边**********
    var ob = new Object();
    ob.com = $(".myDev .active").attr("data-gtw") || "";
    ob.addr = $(".myDev .active").attr("data-addr") || "";
    ob.devType = $(".myDev .active").attr("data-type") || "";
    ob.boxId = $(".myDev .active").attr("box-id") || "";
    ob.name = $(".myDev .active").attr("title") || "";
    if (!ob.boxId) {
        alert("请选择左侧一个模块进行关联！");
        return false;
    }
    //**********总数据  加***************
    var imgid = $("#contentDiv>.elemBox.active").attr("id");
    for (var k = 0; k < g_imgMapObj.content.length; k++) {
        if (g_imgMapObj.content[k].id == imgid) {
            var associatedArr = g_imgMapObj.content[k].associatedArr;
            for (var i = 0; i < associatedArr.length; i++) {
                if (associatedArr[i].com == ob.com && associatedArr[i].addr == ob.addr && associatedArr[i].devType == ob.devType && associatedArr[i].boxId == ob.boxId) {
                    return false;
                }
            }

            g_imgMapObj.content[k].associatedArr.push(ob);
            // console.log(g_imgMapObj.content[k].associatedArr);
            load_associated_list(g_imgMapObj.content[k].associatedArr);

        }
    }
    //**********右边***************
    /*type==17时，自定义输入框*/
    // $("#textInput").val(ob.name);

    //左边 同一ID关联几个设备
    if ($(".myDev .active").hasClass("abouted")) {
        var leftInfo = $(".myDev .active").find("span").text();
        if (leftInfo) {
            $(".myDev .active").find("span").text(parseInt(leftInfo) + 1).hide().fadeIn();
        } else {

            $(".myDev .active").append("<span>2</span>").hide().fadeIn();
        }
    } else {
        $(".myDev .active").addClass("abouted");
    }
    $(".myDev .active").removeClass("active");
    // 同一ID关联几个设备 end
});//end fn
//刷新已关联设备
function load_associated_list(arr) {
    $(".associated").empty();
    if (arr.length) {
        //*********中间**********   传递数据到地图
        $("#contentDiv>.elemBox.active").attr("data-gtw", arr[0].com).attr("data-addr", arr[0].addr).attr("box-id", arr[0].boxId).find(".nameText").text(arr[0].name || "未命名");
    } else {
        var val = $("#contentDiv>.elemBox.active").attr("title");
        if (val == '文本框') {
            var imgid = $("#contentDiv>.elemBox.active").attr("id");
            for (var k = 0; k < g_imgMapObj.content.length; k++) {
                if (g_imgMapObj.content[k].id == imgid) {
                    val = g_imgMapObj.content[k].name ? g_imgMapObj.content[k].name : val;
                }
            }
        }
        $("#contentDiv>.elemBox.active").attr("data-gtw", '').attr("data-addr", '').attr("box-id", '').find(".nameText").text(val);

    }
    for (var i = 0; i < arr.length; i++) {
        $(".associated").append('<p data-gtw="' + arr[i].com + '" data-addr="' + arr[i].addr + '" data-type="' + arr[i].devType + '" box-id="' + arr[i].boxId +
            '" ><i>' + (i + 1) + '. </i><span>' + (arr[i].name || (arr[i].com + ' - ' + arr[i].addr)) + '</span><strong class="clearThis">x</strong></p>');
    }
}//end fn
//单个取消关联按钮
$(".associated").on("mouseover", "p", function () {
    $(this).find(".clearThis").show();
});
$(".associated").on("mouseout", "p", function () {
    $(this).find(".clearThis").hide();
});
$(".associated").on("click", ".clearThis", function () {
    var ob = new Object();
    ob.com = $(this).parent("p").attr("data-gtw") || '';
    ob.addr = $(this).parent("p").attr("data-addr") || '';
    ob.devType = $(this).parent("p").attr("data-type") || '';
    ob.boxId = $(this).parent("p").attr("box-id") || '';
    //**********总数据 减***************
    var imgid = $("#contentDiv>.elemBox.active").attr("id");
    for (var k = 0; k < g_imgMapObj.content.length; k++) {
        if (g_imgMapObj.content[k].id == imgid) {
            var associatedArr = g_imgMapObj.content[k].associatedArr;
            for (var i = 0; i < associatedArr.length; i++) {
                if (associatedArr[i].com == ob.com && associatedArr[i].addr == ob.addr && associatedArr[i].devType == ob.devType && associatedArr[i].boxId == ob.boxId) {
                    associatedArr.splice(i, 1);
                    load_associated_list(g_imgMapObj.content[k].associatedArr);
                    // console.log(g_imgMapObj.content[k].associatedArr);
                }
            }//end for associatedArr

        }
    }//end for
    $(".myActiveBox").each(function () {
        if ($(this).attr("data-gtw") == ob.com && $(this).attr("data-addr") == ob.addr && $(this).attr("box-id") == ob.boxId) {
            // 同一ID关联几个设备
            var leftInfo = $(this).find("span").text();
            if (leftInfo) {
                if (leftInfo == 2) {
                    $(this).hide().fadeIn().find("span").remove();
                } else {
                    $(this).hide().fadeIn().find("span").text(parseInt(leftInfo) - 1);
                }
            } else {
                $(this).removeClass("abouted");
            }
            // 同一ID关联几个设备 end
        }
    });//end each
});
//总取消关联按钮
$("#clearMod").click(clearModfn);

function clearModfn() {
    //**********总数据 清空***************
    var imgid = $("#contentDiv>.elemBox.active").attr("id");
    for (var k = 0; k < g_imgMapObj.content.length; k++) {
        if (g_imgMapObj.content[k].id == imgid) {
            var associatedArr = JSON.parse(JSON.stringify(g_imgMapObj.content[k].associatedArr));
            g_imgMapObj.content[k].associatedArr = [];
            load_associated_list([]);
        }
    }//end for

    if (associatedArr.length) {
        $(".myActiveBox").each(function () {
            for (var i = 0; i < associatedArr.length; i++) {
                var ob = associatedArr[i];
                if ($(this).attr("data-gtw") == ob.com && $(this).attr("data-addr") == ob.addr && $(this).attr("box-id") == ob.boxId) {
                    // 同一ID关联几个设备
                    var leftInfo = $(this).find("span").text();
                    if (leftInfo) {
                        if (leftInfo == 2) {
                            $(this).hide().fadeIn().find("span").remove();
                        } else {
                            $(this).hide().fadeIn().find("span").text(parseInt(leftInfo) - 1);
                        }
                    } else {
                        $(this).removeClass("abouted");
                    }
                    // 同一ID关联几个设备 end
                }
            } //end for associatedArr

        });//end each
    }//end if
}

//其他弹出框
$(".blueFont").on('click', function () {
    $(".other").show();
});
//删除背景
$(".other .clearAll").on("click", function () {
    if (g_imgMapObj.bgImg) {
        delete g_imgMapObj.bgImg;
    }
    $(".other").hide();
    $("#contentDiv").css("background", "url('img/center.png') center no-repeat");
});
//开关编号输入框
$('.switchNumBox').on('blur', 'input', function () {
    var va = parseInt($(this).val());
    var imgid = $("#contentDiv>.elemBox.active").attr("id");
    for (var k = 0; k < g_imgMapObj.content.length; k++) {
        if (g_imgMapObj.content[k].id == imgid) {
            if ($(this).attr('id') == 'switchATSR') {
                g_imgMapObj.content[k].switchNum2 = va;
            } else {
                g_imgMapObj.content[k].switchNum1 = va;
            }
            break;
        }
    }
});
//“文本框”的内容能进行复制。
$('#textInput,#editCtrlDiv input,.other input').on("mousemove", function () {
    event.stopPropagation();
    g_viewDivStatus = 0;
});
// 关闭编辑框 X按钮
$('.closeX').on('click', function () {
    $("#editCtrlDiv").hide();
    $("#contentDiv .elemBox.active").removeClass("active");
});
$('#editCtrlDiv input[type=text],#textInput,.other input[type=text]').on('focus', function () {
    textCopy = 1;
}).on('blur', function () {
    textCopy = 0;
});
// 监听键盘事件
$(window).on('keydown', function (e) {

    if (e.ctrlKey && e.keyCode == 67 && textCopy == 0) {//复制
        // console.log(checkedArr);
        if (checkedArr.length) {
            copyArr = JSON.parse(JSON.stringify(checkedArr));
        } else {
            copyArr = [];
            if (g_currNodeObj != null) {
                copyObjId = g_currNodeObj.id;
            }
        }
    } else if (e.ctrlKey && e.keyCode == 86 && textCopy == 0) {//粘贴
        if (copyArr.length) {
            checkedArr = [];
            $("#editCtrlDiv").hide();
            var idArr = [];
            for (var i = 0; i < copyArr.length; i++) {
                var imgObj = tool_map_copyImgByImgId(copyArr, copyArr[i].id);
                if (imgObj != null) {
                    tool_menu_adjustImgMaxId(g_imgMapObj, imgObj);/*调整新图的ID*/
                    tool_map_addImgObj(g_imgMapObj, imgObj);
                    idArr.push(imgObj.id);
                }
            }
            /*刷新界面显示：内容模块*/
            refresh_mapImg(g_imgMapObj);
            for (var i = 0; i < idArr.length; i++) {
                for (var j = 0; j < g_imgMapObj.content.length; j++) {
                    if (idArr[i] == g_imgMapObj.content[j].id) {
                        var val = idArr[i];
                        checkedArr.push(g_imgMapObj.content[j]);
                        if (g_imgMapObj.content[j].type == 17 || g_imgMapObj.content[j].type == 4017) {
                            val = '#' + val + ' label'
                        } else {
                            val = '#' + val + ' main'
                        }
                        $('#' + idArr[i] + '').addClass('divChecked');
                        $(val).append(
                            '<span class="dotLine TopL"></span>' +
                            '<span class="dotLine TopR" ></span>' +
                            '<span class="dotLine BottomL" ></span>' +
                            '<span class="dotLine BottomR" ></span>' +
                            '<span class="dotLine lineTop" ></span>' +
                            '<span class="dotLine lineBottom" ></span>' +
                            '<span class="dotLine lineLeft" ></span>' +
                            '<span class="dotLine lineRight" ></span>'
                        );
                    }
                }// end for j
            }//end for i
            copyArr = JSON.parse(JSON.stringify(checkedArr));
        } else {
            if (copyObjId) {
                var imgObj = tool_map_copyImgByImgId(g_imgMapObj.content, copyObjId);
                copyObjId = addNewImg(imgObj);
            }
        }
    } else if (e.ctrlKey && e.keyCode == 90) {//撤销
        event.returnValue = false;//取消网页默认的撤销操作
        checkedArr = [];
        if (revocationArr[1]) {
            $('#editCtrlDiv').hide();
            g_imgMapObj = JSON.parse(revocationArr[1]);
            refresh_mapImg(g_imgMapObj);
            revocationArr.shift();
            modLowList('', '', modLowListData);
        }
    } else if (e.keyCode == 37) {//向左
        if ($('.divChecked').length > 0 && key == 0) {
            for (var i = 0; i < checkedArr.length; i++) {
                var id = checkedArr[i].id;
                $('#' + id + '').css({'left': --checkedArr[i].sitObj.left})
            }
            return false;
        } else if ($('.elemBox.active').length > 0) {
            var ImgObj = tool_menu_getImgById(g_imgMapObj.content, g_currNodeObj.id);
            g_currNodeObj.style.left = (--ImgObj.sitObj.left) + 'px';
            $('#value_x').val(ImgObj.sitObj.left);
            return false;
        }
    } else if (e.keyCode == 39) {//向右
        if ($('.divChecked').length > 0 && key == 0) {
            for (var i = 0; i < checkedArr.length; i++) {
                var id = checkedArr[i].id;
                $('#' + id + '').css({'left': ++checkedArr[i].sitObj.left})
            }
            return false;
        } else if ($('.elemBox.active').length > 0) {
            var ImgObj = tool_menu_getImgById(g_imgMapObj.content, g_currNodeObj.id);
            g_currNodeObj.style.left = (++ImgObj.sitObj.left) + 'px';
            $('#value_x').val(ImgObj.sitObj.left);
            return false;
        }
    } else if (e.keyCode == 38) {//向上
        if ($('.divChecked').length > 0 && key == 0) {
            for (var i = 0; i < checkedArr.length; i++) {
                var id = checkedArr[i].id;
                $('#' + id + '').css({'top': --checkedArr[i].sitObj.top})
            }
            return false;
        } else if ($('.elemBox.active').length > 0) {
            var ImgObj = tool_menu_getImgById(g_imgMapObj.content, g_currNodeObj.id);
            g_currNodeObj.style.top = (--ImgObj.sitObj.top) + 'px';
            $('#value_y').val(ImgObj.sitObj.top);
            return false;
        }
    } else if (e.keyCode == 40) {//向下
        if ($('.divChecked').length > 0 && key == 0) {
            for (var i = 0; i < checkedArr.length; i++) {
                var id = checkedArr[i].id;
                $('#' + id + '').css({'top': ++checkedArr[i].sitObj.top})
            }
            return false;
        } else if ($('.elemBox.active').length > 0) {
            var ImgObj = tool_menu_getImgById(g_imgMapObj.content, g_currNodeObj.id);
            g_currNodeObj.style.top = (++ImgObj.sitObj.top) + 'px';
            $('#value_y').val(ImgObj.sitObj.top);
            return false;
        }
    } else if (e.keyCode == 46) {//删除
        if ($('.divChecked').length) {
            for (var j = 0; j < checkedArr.length; j++) {
                var checkedObj = checkedArr[j];
                for (var i = 0; i < g_imgMapObj.content.length; i++) {
                    var mapObj = g_imgMapObj.content[i];
                    if (checkedObj.id == mapObj.id) {
                        $('#' + mapObj.id + '').remove();
                        g_imgMapObj.content.splice(i, 1);
                    }
                }//end for i
            }//end for j
            checkedArr = [];
            modLowList('', '', modLowListData);
        } else {
            btn_delDev();
        }
        //记录操作，为撤销做准备
        revocationArr.unshift(JSON.stringify(g_imgMapObj));
        if (revocationArr[3]) {
            revocationArr.splice(3, 1);
        }
    } else if (e.ctrlKey) {
        key = 1;
    }
}).on('keyup', function () {
    key = 0;
});
document.getElementById('contentDiv').oncontextmenu = function () {//编辑内禁用右键
    return false;
};

//关闭网页
$('.closePage').on('click', function () {
    window.open("about:blank", "_self").close();
});

//保存背景
function upload(fd) {
    $.ajax({
        url: g_strFile + "/php/upload_file.php",//上传地址
        async: true,//异步
        type: 'post',//post方式
        data: fd,//FormData数据
        processData: false,//不处理数据流 !important
        contentType: false,//不设置http头 !important
        xhr: function () {//获取上传进度
            myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) {
                myXhr.upload.addEventListener('progress', function (e) {//监听progress事件
                    var loaded = e.loaded;//已上传
                    var total = e.total;//总大小
                    var percent = Math.floor(100 * loaded / total);//百分比
                    // $('.saveNum').text(percent + "%");
                    $('#saving p:nth-last-of-type(1)').html('请稍后，保存背景中<i class="coming"></i><span class="saveNum">' + percent + "%" + '</span>');
                });
                return myXhr;
            }
        }
        ,
        success: function (data) {//上传成功回调
            console.log("***********");//获取文件链接
            console.log(data);//获取文件链接
            saveStart();
        }
    })
}

// 保存文件
function saveStart() {
    var len = $("#contentDiv").children().length;
    var JsonData = {};
    JsonData.stnId = parent.g_strSelStnId;
    JsonData.type = 1;
    JsonData.data = [];
    JsonData.version = 1.0;
    JsonData.data = g_imgMapObj;
    // console.log(JsonData);
    var formData = JSON.stringify(JsonData);
    arrybuffer = UcToUtf8(formData, 1);
    len = arrybuffer.length;
    console.log(g_imgMapObj);
    var ob = new Object();
    ob.emapNo = parent.menu;
    ob.file = parent.menu + ".json";
    ob.totalsize = len;
    var json = JSON.stringify(ob);
    ccc_lib_reqDataByCmd("", USER_TRANSMIT_FILE_PREPARE, json, startedSendData);
    $('#saving p:nth-last-of-type(1)').html('连接服务器失败');
}

// 隐藏设备与元件图
$(".leftIcon").on('click', function () {
    $('.content-left').css({"left": "-230px"});
    $('#canv').css({"left": "0"});
    $(this).hide();
    $('.rightIcon').show();
});
$(".rightIcon").on('click', function () {
    $('.content-left').animate({"left": "0"});
    $('#canv').animate({"left": "230px"});
    $(this).hide();
    $('.leftIcon').show();
});
// 导出电气图JSON文件
$("#outportData").on('click', function () {
    console.log(g_imgMapObj);
    if (g_imgMapObj) {
        if (g_imgMapObj.content.length != 0) {
            exportJSON(g_imgMapObj);
            return;
        }
    }
    alert('暂无可导出的电气图文件！');


});

function exportJSON(data) {
    var fileName = parent.g_strSelStnName + '电气图.json';
    //  动态创建一个 a标签
    var eleLink = document.createElement("a");
    //  将 data对象字符化，并格式化4个空格缩进
    var content = JSON.stringify(data, null, 4);
    //  构建一个 blob对象
    var blob = new Blob([content]);
    //  生成 blob链接，并设置为下载链接
    eleLink.href = URL.createObjectURL(blob);
    //  设置下载文件名
    eleLink.download = fileName;
    //  触发点击事件
    eleLink.click();
}

//当前色调
$('#tools .currColor').on('change', function () {
    var color = parseInt($(this).val());

    //更新选中部分的色调
    for (var j = 0; j < checkedArr.length; j++) {
        var obj = checkedArr[j];
        var arr = colorArrFn(obj.type);
        for (var i = 0; i < g_imgMapObj.content.length; i++) {
            var data = g_imgMapObj.content[i];
            if (obj.id == data.id) {
                data.nameSitObj.color = _map_getYcColorByIndex(color);
                data.nameSitObj.colorIndex = color;
                $('#' + data.id + ' .nameText').css('color', data.nameSitObj.color);
                if (arr.length > 1) {
                    if (data.type == 1 || data.type == 2) {
                        data.sitObj.color = _map_getYcColorByIndex(color);
                        data.sitObj.colorIndex = color;
                        $('#' + data.id + ' main div').css('backgroundColor', data.sitObj.color);
                    } else if (data.type == 6001) {
                        data.sitObj.color = _map_getYcColorByIndex(color);
                        data.sitObj.colorIndex = color;
                        $('#' + data.id + ' main div').css('borderColor', data.sitObj.color);
                    } else if (arr.indexOf(color) != -1) {
                        var str = data.src.split('-col-');
                        var str2 = str[0].substring(0, str[0].length - 1);
                        var str3 = str2 + color + '-col-' + str[1];
                        data.src = str3;
                        $('#' + data.id + ' main').css('backgroundImage', 'url(' + str3 + ')');
                        data.sitObj.color = _map_getYcColorByIndex(color);
                        data.sitObj.colorIndex = color;
                    }
                }//end if arr.length > 1
            }
        }//end for i
    }//end for j
});
//元件颜色
$('.currColor2').on('change', function () {
    currColor = parseInt($(this).val());
    for (var i = 0; i < g_menuobj.content.length; i++) {
        var data = g_menuobj.content[i];
        var arr = data.arr;

        if (arr.length > 1) {

            if (arr.indexOf(currColor) == -1 && data.imgType != 'comment') {

                var str = data.src.split('-col-');
                var str2 = str[0].substring(0, str[0].length - 1);
                var str3 = str2 + arr[0] + '-col-' + str[1];
                data.src = str3;

            } else {
                var str = data.src.split('-col-');
                var str2 = str[0].substring(0, str[0].length - 1);
                var str3 = str2 + currColor + '-col-' + str[1];
                data.src = str3;
            }
        } else if (data.type == 17 || data.type == 4017 || data.type == 6002) {
            var str = data.src.split('-col-');
            var str2 = str[0].substring(0, str[0].length - 1);
            var str3 = str2 + currColor + '-col-' + str[1];
             data.src = str3;
        }//end if
    }
    refresh_toolList();//更新图片目录
});
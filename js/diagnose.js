var date=new Date();
var y=date.getFullYear();
var g_browser = getBrowser();
$(document).click(function(event){
    var _con = $('.checkOpts');   // 设置目标区域
    if(event.target.nodeName=="SELECT"){
        return false;
    }
    if(!_con.is(event.target) && _con.has(event.target).length === 0){ // Mark 1
        $('.checkOpts').fadeOut();          //淡出消失
    }
});
//浏览器内核
function getBrowser(n) {
    var ua = navigator.userAgent.toLowerCase(),
        s,
        name = '',
        ver = 0;
    //探测浏览器
    (s = ua.match(/msie ([\d.]+)/)) ? _set("ie", _toFixedVersion(s[1])):
        (s = ua.match(/firefox\/([\d.]+)/)) ? _set("firefox", _toFixedVersion(s[1])) :
            (s = ua.match(/chrome\/([\d.]+)/)) ? _set("chrome", _toFixedVersion(s[1])) :
                (s = ua.match(/opera.([\d.]+)/)) ? _set("opera", _toFixedVersion(s[1])) :
                    (s = ua.match(/version\/([\d.]+).*safari/)) ? _set("safari", _toFixedVersion(s[1])) : 0;

    function _toFixedVersion(ver, floatLength) {
        ver = ('' + ver).replace(/_/g, '.');
        floatLength = floatLength || 1;
        ver = String(ver).split('.');
        ver = ver[0] + '.' + (ver[1] || '0');
        ver = Number(ver).toFixed(floatLength);
        return ver;
    }
    function _set(bname, bver) {
        name = bname;
        ver = bver;
    }
    var vel=(n == 'n' ? name : (n == 'v' ? ver : name + ver));
    if(vel=='chrome91.0'){
        return true;
    }else {
        return false;
    }
};
window.onload=function(){
    $(".cho_date").val( y+"年");
    if(g_browser){
        $(".titles .downLoad").hide();
        $(".titles .exportToU").show();
    }else{
        $(".titles .downLoad").show();
        $(".titles .exportToU").hide();
    }
    loadMenuList(3);
    loadMenuList(1);
}
$(".minus").click(function(){
    var y= parseInt($(".cho_date").val());
    y--;
    $(".cho_date").val(y+"年");

});
$(".plus").click(function(event){
    var y=parseInt($(".cho_date").val());
    var yy=new Date().getFullYear();
    if(y<yy){
        y++;
        $(".cho_date").val(y+"年");
    }
    
});
var allChecked=[];
var CheckedType=[];
var CheckedPage=1;
//点击左边菜单
$(".menus").on("click","a",function(){
    $(this).addClass("active").siblings("a").removeClass("active");
    var about=$(this).attr("about");
    if(about==7){
        $('.generateReport').attr('data-name','');
        $(".print").show().siblings().hide();
        $("#containt>div").hide();
        loadTimes();

      
    }else{
        $(".print").hide().siblings().show();
        var code =$(this).attr("data-code");
        CheckedType=[];
        CheckedPage=1;
        for(var i=0;i<allChecked.length;i++){
            if(code==allChecked[i].code){
                CheckedType.push(allChecked[i]);
            }
        }
        console.log(CheckedType);
        var conts = getPages(1);
        console.log(conts);
        $(".content>li").html("");
        for(var i=0;i<conts.length;i++){
            $(".content>li:nth-child("+(i+1)+")").append('<ul><li><p><span></span><b>'+conts[i].name+'</b></p><ul class="content'+(i+1)+' mods" about='+(i+1)+'></ul></li><li><div id="contentLine'+(i+1)+'"></div></li></ul>').attr("type",conts[i].sysId).attr("about",conts[i].visitId).attr("data-unit",conts[i].unit);
        }
        getAboutMods();
        $(".content>li").attr("type","").attr("about","").attr("unit","");
    }
 
})
function loadTimes(){
    $(".times select>option").remove();
    //添加年列表
    var years="";
    for(var i=0;i<21;i++){
        years+="<option value='"+(2020+i)+"'>"+(2020+i)+"年</option>";
    }
    $(".times>p>label:nth-child(1)>select").append(years);
    //添加月列表
    var months="";
    for(var i=1;i<13;i++){
        if(i<10){
            i="0"+i;
        }
        months+="<option value='"+i+"'>"+i+"月</option>";
    }
    $(".times>p>label:nth-child(2)>select").append(months);
    $(".times>p>label:nth-child(3)>select").append(months);
    var time=new Date();
    var year=time.getFullYear();
    var month=time.getMonth() + 1;
    if(month<10){
        month = "0"+month;
    }
    $(".times>p>label:nth-child(1)>select").val(year);
    $(".times>p>label:nth-child(2)>select").val("01");
    $(".times>p>label:nth-child(3)>select").val(month);

}
//点击切换上一页
$(".prev").click(function(){
    var page = CheckedPage-1;
    if(page<=0){
        return false;
    }else{
        $(".content>li").attr("type","").attr("about","").attr("unit","");
        CheckedPage = page;
        var conts = getPages(page);
        console.log(conts);
        $(".content>li").html("");
        for(var i=0;i<conts.length;i++){
            $(".content>li:nth-child("+(i+1)+")").append('<ul><li><p><span></span><b>'+conts[i].name+'</b></p><ul class="content'+(i+1)+' mods" about='+(i+1)+'></ul></li><li><div id="contentLine'+(i+1)+'"></div></li></ul>').attr("type",conts[i].sysId).attr("about",conts[i].visitId).attr("data-unit",conts[i].unit);
        }
        getAboutMods();
    }
})
//点击切换下一页
$(".next").click(function(){
    var page = CheckedPage+1;
    var conts = getPages(page);
    if(conts.length<=0){
        return false;
    }else{
        $(".content>li").attr("type","").attr("about","").attr("unit","");
        CheckedPage = page;
        console.log(conts);
        $(".content>li").html("");
        for(var i=0;i<conts.length;i++){
            $(".content>li:nth-child("+(i+1)+")").append('<ul><li><p><span></span><b>'+conts[i].name+'</b></p><ul class="content'+(i+1)+' mods" about='+(i+1)+'></ul></li><li><div id="contentLine'+(i+1)+'"></div></li></ul>').attr("type",conts[i].sysId).attr("about",conts[i].visitId).attr("data-unit",conts[i].unit);
        }
        getAboutMods();
    }
})
function getPages(page){
    var total=[];
    var i=(page-1)*4;
    var len=page*4<CheckedType.length?page*4:CheckedType.length;
     while(i<len){
         total.push(CheckedType[i]);
         i++;
     }
    console.log(total);
    return total;
}
//切换菜单
function loadMenuList(type){
    var ob = new Object();
    ob.type = parseInt(type);
    ob.userData = parseInt(type);
    var json = JSON.stringify(ob);
    parent.ccc_lib_reqDataByCmd("",ACDC_MENU_CONF_LIST,json,showMenuList);//
}

function showMenuList(id,info,des){
    console.log(des);
   
    if(des.userData==1){
        $(".menus>a").remove();
        for(var i=0;i<des.data.length;i++){
            var src='';
            var abt=0;
            if(des.data[i].enable==1){
                if(des.data[i].code==10010000){
                    src="imgs/diag1.png";
                    abt=1;
                }else if(des.data[i].code==20010000){
                    src="imgs/diag2.png";
                    abt=2;
                }else if(des.data[i].code==30010000){
                    src="imgs/diag3.png";
                    abt=3;
                }else if(des.data[i].code==40010000){
                    src="imgs/diag4.png";
                    abt=4;
                }else if(des.data[i].code==50010000){
                    src="imgs/diag5.png";
                    abt=6;
                }else if(des.data[i].code==60010000){
                    src="imgs/diag6.png";
                    abt=6;
                }
                $(".menus").append('<a about="'+abt+'" data-code="'+des.data[i].code+'"><i style="background-image:url('+src+')"></i><span>'+des.data[i].name+'</span></a>');
            } 
        }
        $(".menus").append('<a about="7"><i style="background-image:url(imgs/diag7.png)"></i><span>运行报告</span></a>');
        $(".menus>a:nth-child(1)").click();
       
    }else if(des.userData==3){
        allChecked=[];
        for(var i=0;i<des.data.length;i++){
            if(des.data[i].isEnable==1){
                allChecked.push(des.data[i]);
            } 
        }
    }
    
}
//获取对应的模块
function getAboutMods(){
    $(".content>li").each(function(i){
        var sysid=$(this).attr("type");
        var visitid=$(this).attr("about");
        var year = (new Date()).getFullYear();
        if(sysid && visitid){
            var ob = new Object();
            ob.sysId = parseInt(sysid);
            ob.visitId = parseInt(visitid);
            ob.year = parseInt(year);
            ob.userData = parseInt(i+1);
            var json = JSON.stringify(ob);
            console.log(json);
            parent.ccc_lib_reqDataByCmd("",USER_ELEC_ALARM_ANALYSIS_RANK,json,showModList);//
        }
    })
    
}
function showModList(id,info,des){
    console.log(des);
    
    $(".content>li:nth-child("+des.userData+")>ul>li:nth-child(1)>ul>li").remove();
    for(var i=0;i<des.data.length;i++){
        var arr=(des.data[i].name).split("$");
        var name=(des.data[i].name).replace("$","-");
        $(".content>li:nth-child("+des.userData+")>ul>li:nth-child(1)>ul").append('<li title="'+name+'" data-pointSeq="'+des.data[i].pointSeq+'" data-recordId="'+des.data[i].recordId+'" data-sysId="'+des.data[i].sysId+'" data-visitId="'+des.data[i].visitId+'"><p>'+(i+1)+"."+arr[0]+'</p><p>'+arr[1]+'</p></li>');
    }
    $(".content>li:nth-child("+des.userData+")>ul>li:nth-child(1)>ul>li:nth-child(1)").click();
    if($(".content>li:nth-child("+des.userData+")>ul>li:nth-child(1)>ul>li").length==0){
        $(".content>li:nth-child("+des.userData+")>ul>li:nth-child(1)>ul").append('<li class="active" style="line-height:34px;text-align:center;">无异常数据</li>')
        var id="contentLine"+des.userData;
        var timedata =[0];
        var data =[0];
        var unit =" ";
        var colors =["red"];
        var errNum =[0];
        load_bar(id,timedata,data,unit,colors,errNum,0,0,1);
    }
    
}
//点击切换模块加载数据
$(".content").on("click",".mods>li",function(){
    $(this).addClass("active").siblings("li").removeClass("active");
    var sysid=$(this).attr("data-sysid");
    var visitid=$(this).attr("data-visitid");
    var year = (new Date()).getFullYear();
    var recordid = $(this).attr("data-recordid");
    var type=$(this).parent("ul").attr("about");
    var ids=$(this).parent(".mods").attr("about");
    var pointSeq=$(this).attr("data-pointseq");
    console.log(ids)
    if(!recordid || !sysid || !visitid){
        return false;
    }
    $("#contentLine"+ids).attr("about",0);
    var ob = new Object();
    ob.recordId = parseInt(recordid);
    ob.sysId = parseInt(sysid);
    ob.visitId = parseInt(visitid);
    ob.year = parseInt(year);
    ob.pointSeq = parseInt(pointSeq);
    ob.userData = parseInt(type);
    var json = JSON.stringify(ob);
    console.log(json);
    parent.ccc_lib_reqDataByCmd("",USER_ELEC_ANALYSIS_STATISTIC_LIST,json,showModData);// 
})

function showModData(id,info,des){
    console.log(des);
    var id="contentLine"+des.userData;
    var unit=$(".content>li:nth-child("+des.userData+")").attr("data-unit");
    var colors=[];
    var errNum=[];
    if(des.userData==1){
        colors=["#4560e6"];
    } else if(des.userData==2){
        colors=["#0da2cf"];
    }else if(des.userData==3){
        colors=["#40ba54"];
    }else if(des.userData==4){
        colors=["#c07800"];
    }
    if(des.visitId==5 || des.visitId==7|| des.visitId==8){
        des.up = des.down;
    }
    var timedata=[];
    var data=[];
    var updata;
    var max=0;
    if(des.visitId==5){//功率因素 取一位小数
         updata=(des.up)?((des.up).toFixed(2)):0;
         for(var i=0;i<des.data.length;i++){
            timedata.push(des.data[i].month+"月");
            data.push((des.data[i].value).toFixed(2));
            max=(max < (des.data[i].value))?((des.data[i].value).toFixed(2)):max;
            errNum.push(des.data[i].abCnt);
        }
    }else if(des.visitId==10){//绝缘异常 取次数为上限
        updata=(des.up)?((des.up).toFixed(1)):0;
        for(var i=0;i<des.data.length;i++){
            timedata.push(des.data[i].month+"月");
            data.push((des.data[i].value).toFixed(1));
            max=(max < (des.data[i].abCnt))?(des.data[i].abCnt):max;
            errNum.push(des.data[i].abCnt);
        }
    }else{
        updata=(des.up)?((des.up).toFixed(1)):0;
        for(var i=0;i<des.data.length;i++){
            timedata.push(des.data[i].month+"月");
            data.push((des.data[i].value).toFixed(1));
            max=(max < (des.data[i].value))?((des.data[i].value).toFixed(1)):max;
            errNum.push(des.data[i].abCnt);
        }
    }
    max=(parseFloat(max) < parseFloat(updata))?updata:max;
    // console.log(max);
    load_bar(id,timedata,data,unit,colors,errNum,updata,des.visitId,max);
}
//柱状图诊断
function load_bar(id,timedata,data,unit,colors,errNum,updata,visitId,max){
    var myChart = echarts.init(document.getElementById(id));
    var upData=[];
    if(visitId==10){
        unit="次";
        data = errNum;
    }else{
        upData = [
            {yAxis: updata, name: '阈值上限'},
        ]
    }
    var option3 = {
        textStyle:{
          textColor:"#ffffff"
        },
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: function (params) {
                if(visitId==10){
                    // console.log(params); // 当我们想要自定义提示框内容时，可以先将鼠标悬浮的数据打印出来，然后根据需求提取出来即
                    try{
                        let firstParams = params[0];          
                        var maxNum = errNum[firstParams.dataIndex];
                        return firstParams.name  + '<br>' + '异常次数：' + maxNum +' 次';
                    }catch(err){
                        console.log(err);
                    }
                }else{
                    // console.log(params); // 当我们想要自定义提示框内容时，可以先将鼠标悬浮的数据打印出来，然后根据需求提取出来即
                    try{
                        let firstParams = params[0];          
                        var maxNum = errNum[firstParams.dataIndex];
                        return firstParams.name  + '<br>' + '值：' + firstParams.data + ' <br>异常次数：' + maxNum +' 次';
                    }catch(err){
                        console.log(err);
                    }
                   
                }
               
            }
        },
        color:colors,
        legend: {
            // data:['值'],
            textStyle:{
                color:'#ffffff',
                fontSize:10
            },
            y:'1%',
            x:"85%",
            type:"scroll",
            orient:"vertical"
        },
        grid: {
            left: '4%',
            right: '10%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                data :timedata,
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
                    lineStyle:{
                        color:'#ffffff'
                    }
                },
            }
        ],
        yAxis : [
            {
                type : 'value',
                name:"单位("+unit+")",
                axisLabel : {
                    textStyle: {
                        color: '#ffffff'
                    }
                },
                nameTextStyle:{
                    color:'#ffffff'
                },
                axisLine:{
                    lineStyle:{
                        color:'#ffffff'
                    }
                },
                max:max
            }
        ],
        series : [
            {
                name:'值',
                type:'bar',
                data:data,
                label: {
                    normal: {
                        show: false
                        //position: 'top'//值显示
                    }
                },
                markLine:{
                    itemStyle:{
                        normal:{
                            color:"#01f5f5",

                        },
                        label:{
                            show: true,
                            //  position: 'center',
                            //  formatter: '{a}',
                        }
                    },
                    data:upData,
                    symbol:"none",
                    silent:false
                },
                // markPoint: {
                //     data: [
                //         {type: 'max', name: '最大值'},
                //     ],
                //     symbol:"pin",
                //     symbolSize:40
                // },
            },

        ]
    };
    myChart.clear();
    myChart.setOption(option3);
}
//柱状图报告
function load_barReport(id,timedata,data,unit,titles){
    var myChart = echarts.init(document.getElementById(id));
    var option3 = {
        title:{
            text:titles,
            x:"center",
            y:"1%",
            textStyle:{
                color:'#000000'
            }
            //textStyle:{
            //    color:"white"
            //}
        },
        tooltip : {
        
            trigger: 'axis',
            color:"#000",
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: function (params,i) {
                // console.log(params); // 当我们想要自定义提示框内容时，可以先将鼠标悬浮的数据打印出来，然后根据需求提取出来即
                let firstParams = params[0];
                // console.log(firstParams)
                // var maxNum = errNum[firstParams.dataIndex];
                return firstParams.name  + '<br>' + '值：' + firstParams.data ;
            }
        },
        color:["#596fe0","#0087b0","#55935f"],
        legend: {
            // data:timedata,
            textStyle:{
                color:'#000',
                fontSize:10
            },
            y:'80%',
            x:"10px",
            type:"scroll",
            orient:"horizontal"
        },
        grid: {
            left: '4%',
            right: '6%',
            bottom: '50px',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                data :timedata,
                axisLabel:{
                    show:true,
                    rotate:25,//倾斜度 -90 至 90 默认为0
                    intervel:'auto',
                    inside:false,
                },
                axisLine:{
                    lineStyle:{
                        color:'#000'
                    }
                },
            }
        ],
        yAxis : [
            {
                type : 'value',
                name:unit,
                axisLabel : {
                    textStyle: {
                        color: '#000'
                    }
                },
                nameTextStyle:{
                    color:'#000'
                },
                axisLine:{
                    lineStyle:{
                        color:'#000'
                    }
                },
            }
        ],
        series : [
            {
                // name:timedata,
                type:'bar',
                data:data,
             
                    // itemStyle: {
                    //     normal: {
                    //         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    //             offset: 0,
                    //             color: '#3d78e4'
                    //         }, {
                    //             offset: 1,
                    //             color: '#081423'
                    //         }]),
                    //     }
                    // },
                // markPoint: {
                //     data: [
                //         {type: 'max', name: '最大值'},
                //     ],
                //     symbol:"pin",
                //     symbolSize:40,
                //     itemStyle:{
                //         normal:{
                //             color:"#000"
                //         }
                //     }
                // },
            },

        ]
    };
    myChart.clear();
    myChart.setOption(option3);
}
//折线图
function load_line(id,names,serArr,unit,titles,legendName){
    var myChart = echarts.init(document.getElementById(id));
    var option3={
        title:{
            text:titles,
            x:"center",
            y:"5%",
            textStyle:{
                color:'#000000'
            }
            //textStyle:{
            //    color:"white"
            //}
        },
       
        color:[
            "orange","lightgreen","#596fe0","#0087b0","#55935f"
        ],
        tooltip:{
            show: true,
//                showTitle: false,
            trigger:"axis",
//                formatter: "Date：{b}日<br>Value：{c}",
            // formatter:function (params){

            //     var str= `${params[0].name}日<br>`;
            //     params.forEach((item , idx) => {
            //         str+= `${params[idx].marker} ${params[idx].seriesName} ${params[idx].value}(KW·h)<br>`;
            //     })
            //     return str;

            // },
//                axisPointer:{
//                    animation: true
//                }
        },
        grid:{
            left:"60px",
            right:"60px",
            bottom:"80px",
            top:"50px"
        },
        legend:{
            data:legendName,
            y:'80%',
            x:"10px",
            type:"scroll",
            orient:"horizontal"
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
                data : names,
                axisLabel:{
                    show:true,
                    rotate:45,//倾斜度 -90 至 90 默认为0
                    intervel:'auto',
                    inside:false,
                    // formatter:function(tempTime){
                    //     if(tempTime){
                    //         return tempTime;
                    //     }
                    // }
                },
                axisLine:{
                    lineStyle:{
                        color:'#000000'
                    }
                }
            }
        ],
        yAxis:[
            {
                show:true,
                name:unit,
                nameRotate:90,
                nameLocation:"middle",
                nameGap:40,
//                    nameTextStyle:{
                    fontWeight:"bolder",
//                    },
                type : 'value',
                axisTick: {
                    show: true
                },
                axisLine:{
                    show:true,
                    lineStyle:{
                        color:'#000000'
                    }
                },
                nameTextStyle:{
                    color:'#000000'
                },
                //max:max
            }
        ],
        series:serArr
    };

    
    myChart.clear();
    myChart.setOption(option3);
    

}

//点击生成报告
 $('.generateReport').on('click',function () {
    $(".containt").animate({scrollTop:0},1000);//回到顶端
     var year = $(".times>p>label:nth-child(1)>select").val();
     var startMonth = $(".times>p>label:nth-child(2)>select").val();
     var endMonth = $(".times>p>label:nth-child(3)>select").val();
     var startDate = year+'-'+startMonth+'-'+'01';
     var endDate = year+'-'+endMonth+'-'+'31';
     var fileName = 'runreport_'+year+'['+startMonth+'-'+endMonth+']';
     $(this).attr('data-name',fileName);
     var ob = new Object();
     ob.class = 1;
     ob.startDate = startDate;
     ob.endDate = endDate;
     ob.userData = 0;
     var json = JSON.stringify(ob);
     console.log(ob);
     parent.$(".covers").show().find('p').text('报告生成中，请稍后...');
     parent.ccc_lib_reqDataByCmd(fileName,USER_OPERATE_BY_CUSTOM,json,operateByCustomFn);
  
    // var url = 'test.txt';
    // postJSON(url, function (obj) {
    //     parent.$(".covers").hide();
    //     var o = getObject(obj);
    //     console.log(o);
    //     rightIn(o)
    // });

    var o = new Object();
    o.type = 11;
    o.subType = 0;
    o.userData = 0;
    var m_json = JSON.stringify(o);
    parent.ccc_lib_reqDataByCmd("",USER_GW_DEVINFO_GETBYID,m_json,reStnName);

 });
function reStnName(id,info,des){
    console.log(des);
    $(".reportAddr").html("");
    if(des.result==0){
        $(".reportAddr").html(des.data[0].station);
    }
    
}
function operateByCustomFn(id,info,des){
    console.log(des);
    if(des.result==0){
        parent.$(".covers").hide();
        var url = 'http://'+document.domain+'/Downloads/'+info+'.txt';
        postJSON(url, function (obj) {
            // console.log("数据提交成功");
            var o = getObject(obj);
            console.log(o);
            rightIn(o)
        });
    }else {
        parent.$(".covers").hide();
    }

}
 //将解析的json对象写进报告页面
 function rightIn(report){
    $("#containt>div").hide();
    var year=parseInt($(".cho_date").val());
    var nowDate=new Date();
    var nowYear=nowDate.getFullYear();
    var year = $(".times>p>label:nth-child(1)>select").val();
    var startMonth = $(".times>p>label:nth-child(2)>select").val();
    var endMonth = $(".times>p>label:nth-child(3)>select").val();
    // if(year<nowYear){//非今年的
    //     $(".reportDate").html(year+"年01月01日至"+year+"年12月31日");
    // }else{//今年的
    //     var month=nowDate.getMonth()+1;
    //     var days=nowDate.getDate();
     
    //     if(month<10){
    //         month="0"+month;
    //     }
    //     if(days<10){
    //         days="0"+days;
    //     }
    //     $(".reportDate").html(year+"年01月01日至"+year+"年"+month+"月"+days+"日");
    // }
    $(".reportDate").html(year+"年"+startMonth+"月至"+year+"年"+endMonth+"月");
    console.log(report.length);
    $(".model:not(.report_p1) table>tbody>tr").remove();
    $(".model>div>p").remove();
    $(".chart").each(function(i){
        clearChart(i);
    })
  
    for(var i=0;i<report.length;i++){
        var datas=report[i].data;
        if(report[i].title=="AC"){
            $("#containt>#system1").show();
            for(var k=0;k<datas.length;k++){
                if(datas[k].title2=="Abstract"){
                    // datas[k].arr = datas[k].arr.concat(datas[k].arr);
                    $("#system1 .report_p2>table:nth-child(3)>tbody>tr").remove();
                    for(var m=0;m<datas[k].arr.length;m++){
                        $("#system1 .report_p2>table:nth-child(3)>tbody").append('<tr><td>'+(m+1)+'</td><td>'+datas[k].arr[m].name+'</td><td>'+datas[k].arr[m].value[0]+'</td></tr>');
                    }
                }else if(datas[k].title2=="StationEnergy"){
                    $("#system1 .report_p2>table:nth-child(6)>tbody>tr").remove();
                    for(var m=0;m<datas[k].arr.length;m++){
                        var str="";
                        for(var n=0;n<datas[k].arr[m].value.length;n++){
                            str+='<td>'+parseFloat(datas[k].arr[m].value[n]).toFixed(2)+'</td>';
                        }
                        $("#system1 .report_p2>table:nth-child(6)>tbody").append('<tr><td>'+(m+1)+'</td><td>'+datas[k].arr[m].name+'</td>'+str+'</tr>');
                    }
                }else if(datas[k].title2=="FeederEnergyChart"){
                    var names=[];
                    var values=[];
                    for(var m=0;m<datas[k].arr.length;m++){
                        names.push(datas[k].arr[m].name);
                        values.push(parseFloat(datas[k].arr[m].value).toFixed(2));
                    }
                    load_barReport("chart2",names,values,"单位(kWh)","能耗排名前20线路")
                }else if(datas[k].title2=="CoilinLoadTable"){
                    $("#system1 .report_p3 table>tbody>tr").remove();
                    for(var m=0;m<datas[k].arr.length;m++){
                        var str="";
                        for(var n=0;n<datas[k].arr[m].value.length;n++){
                            str+='<td>'+parseFloat(datas[k].arr[m].value[n]).toFixed(2)+'</td>';
                        }
                        $("#system1 .report_p3 table>tbody").append('<tr><td>'+(m+1)+'</td><td>'+datas[k].arr[m].name+'</td>'+str+'</tr>');
                    }
                }else if(datas[k].title2=="CoilinLoadAnalyze"){
                    $("#system1 .report_p3>div:nth-child(5)>p").remove();
                    for(var m=0;m<datas[k].arr.length;m++){
                        var str="";
                        for(var n=0;n<datas[k].arr[m].value.length;n++){
                            var allMonth;
                            if(datas[k].arr[m].value[2] >0){
                                allMonth = datas[k].arr[m].value[2]+"月，"; 
                            }
                           
                            if(datas[k].arr[m].value[3]!=datas[k].arr[m].value[2] && datas[k].arr[m].value[3]>0){
                                allMonth+=datas[k].arr[m].value[3]+"月，";
                            }
                            if(datas[k].arr[m].value[4]!=datas[k].arr[m].value[2] && datas[k].arr[m].value[4]!=datas[k].arr[m].value[3] && datas[k].arr[m].value[4]>0){
                                allMonth+=datas[k].arr[m].value[4]+"月，";
                            }
                            // console.log(datas[k].arr[m].name);
                            str="<p>("+(m+1)+")"+datas[k].arr[m].name+"："+visiteIDtoStr(datas[k].arr[m].value[0])+"累计"+datas[k].arr[m].value[1]+"次,集中于"+allMonth+"最大值"+datas[k].arr[m].value[5]+visiteIDtoUnit(datas[k].arr[m].value[0])+",发生于"+datas[k].arr[m].value[6]+"。</p>";
                        }
                        $("#system1 .report_p3>div:nth-child(5)").append(str);
                    }
                }else if(datas[k].title2=="FactorLine"){
                    var names=[];
                    var arr=[];
                    var legendName = [];
                    for(var m=0;m<datas[k].arr.length;m++){
                        var values=[];
                        legendName.push(datas[k].arr[m].name);
                        for(var n=0;n<datas[k].arr[m].value.length;n+=2){
                            var val=datas[k].arr[m].value[n]+"月";
                            names.push(val);
                        } 
                        for(var n=1;n<datas[k].arr[m].value.length+1;n+=2){
                            var val=parseFloat(datas[k].arr[m].value[n]).toFixed(2);
                            values.push(val);
                        } 
                        var obj= {
                            name:datas[k].arr[m].name,
                            type:'line',
                            smooth:true,
                            // itemStyle: {
                            //     normal: {
                            //         color: 'orange'
                            //         //type:"dashed"
                            //     }
                            // },
                            symbolSize: 8,
                            hoverAnimation: true,
                            data:values,
                            label: {
                                normal: {
                                    show: false
                                }
                            }
                        }
                        arr.push(obj);
                    }
                    load_line("chart3",names,arr,"","每月功率因数最小值",legendName);
                }else if(datas[k].title2=="FactorAnalyze"){
                    $("#system1 .report_p4>div:nth-child(3)>p").remove();
                    for(var m=0;m<datas[k].arr.length;m++){
                        var str="";
                        for(var n=0;n<datas[k].arr[m].value.length;n++){
                            var allMonth;
                            if(datas[k].arr[m].value[2]>0){
                                allMonth = datas[k].arr[m].value[2]+"月，"; 
                            }
                            
                            if(datas[k].arr[m].value[3]!=datas[k].arr[m].value[2] && datas[k].arr[m].value[3] >0){
                                allMonth+=datas[k].arr[m].value[3]+"月，";
                            }
                            if(datas[k].arr[m].value[4]!=datas[k].arr[m].value[2] && datas[k].arr[m].value[4]!=datas[k].arr[m].value[3] && datas[k].arr[m].value[4]>0){
                                allMonth+=datas[k].arr[m].value[4]+"月，";
                            }
                            str="<p>("+(m+1)+")"+datas[k].arr[m].name+"："+visiteIDtoStr(datas[k].arr[m].value[0])+"累计"+datas[k].arr[m].value[1]+"次,集中于"+allMonth+"最小值"+datas[k].arr[m].value[5]+visiteIDtoUnit(datas[k].arr[m].value[0])+",发生于"+datas[k].arr[m].value[6]+"。</p>";
                        }
                        $("#system1 .report_p4>div:nth-child(3)").append(str);
                    }
                }else if(datas[k].title2=="EventYc"){
                    $("#system1 .report_p5 table>tbody>tr").remove();
                    for(var m=0;m<datas[k].arr.length;m++){
                        var str="";
                        if(datas[k].arr[m].value[0]==2){
                            str+='<td>越上限</td>';
                        }else if(datas[k].arr[m].value[0]==3){
                            str+='<td>越下限</td>';
                        }
                        for(var n=1;n<datas[k].arr[m].value.length;n++){
                            str+='<td>'+datas[k].arr[m].value[n]+'</td>';
                        }
                        $("#system1 .report_p5 table>tbody").append('<tr><td>'+(m+1)+'</td><td>'+datas[k].arr[m].name+'</td>'+str+'</tr>');
                    }
                }else if(datas[k].title2=="EventYx"){
                    $("#system1 .report_p6 table>tbody>tr").remove();
                    // for(var i=0;i<50;i++){
                        // datas[k].arr.push({name:"ddd",value:['regName','3']})
                    // }
                  
                    for(var m=0;m<datas[k].arr.length;m++){
                        var str="";
                        for(var n=0;n<datas[k].arr[m].value.length;n++){
                            str+='<td>'+datas[k].arr[m].value[n]+'</td>';
                        }
                        $("#system1 .report_p6 table>tbody").append('<tr><td>'+(m+1)+'</td><td>'+datas[k].arr[m].name+'</td>'+str+'</tr>');
                    }
                }
            }
        }else if(report[i].title=="DC"){
            $("#containt>#system2").show();
            for(var k=0;k<datas.length;k++){
                if(datas[k].title2=="Abstract"){
                    $("#system2 .report_p22>table:nth-child(3)>tbody>tr").remove();
                    for(var m=0;m<datas[k].arr.length;m++){
                        $("#system2 .report_p22>table:nth-child(3)>tbody").append('<tr><td>'+(m+1)+'</td><td>'+datas[k].arr[m].name+'</td><td>'+datas[k].arr[m].value[0]+'</td></tr>');
                    }
                }else if(datas[k].title2=="BusInsuTable"){
                    $("#system2 .report_p22>table:nth-child(6)>tbody>tr").remove();
                    for(var m=0;m<datas[k].arr.length;m++){
                        var str="";
                        for(var n=0;n<datas[k].arr[m].value.length;n++){
                            str+='<td>'+datas[k].arr[m].value[n]+'</td>';
                        }
                        $("#system2 .report_p22>table:nth-child(6)>tbody").append('<tr><td>'+(m+1)+'</td><td>'+datas[k].arr[m].name+'</td>'+str+'</tr>');
                    }
                }else if(datas[k].title2=="BusInsuAnalyze"){
                    $("#system2 .report_p22>div:nth-child(7)>p").remove();
                    for(var m=0;m<datas[k].arr.length;m++){
                        var str="";
                        for(var n=0;n<datas[k].arr[m].value.length;n++){
                            var allMonth;
                            if(datas[k].arr[m].value[2] > 0){
                                allMonth = datas[k].arr[m].value[2]+"月 "; 
                            }
                          
                            if(datas[k].arr[m].value[3]!=datas[k].arr[m].value[2] && datas[k].arr[m].value[3] >0){
                                allMonth+=datas[k].arr[m].value[3]+"月 ";
                            }
                            if(datas[k].arr[m].value[4]!=datas[k].arr[m].value[2] && datas[k].arr[m].value[4]!=datas[k].arr[m].value[3] && datas[k].arr[m].value[4]>0){
                                allMonth+=datas[k].arr[m].value[4]+"月 ";
                            }
                            str="<p>("+(m+1)+")"+datas[k].arr[m].name+"："+visiteIDtoStr(datas[k].arr[m].value[0])+"累计"+datas[k].arr[m].value[1]+"次,集中于"+allMonth+"。</p>";
                        }
                        $("#system2 .report_p22>div:nth-child(7)").append(str);
                    }
                }else if(datas[k].title2=="AcInputAbnLine"){
                    var names=[];
                    var arr=[];
                    var legendName=[];
                    for(var m=0;m<datas[k].arr.length;m++){
                        legendName.push(datas[k].arr[m].name);
                        var values=[];
                        for(var n=1;n<datas[k].arr[m].value.length+1;n+=2){
                            var val=parseFloat(datas[k].arr[m].value[n]).toFixed(2);
                            values.push(val);
                        } 
                        for(var n=0;n<datas[k].arr[m].value.length;n+=2){
                            var val=datas[k].arr[m].value[n]+"月";
                            names.push(val);
                        } 
                        var obj= {
                            name:datas[k].arr[m].name,
                            type:'line',
                            smooth:true,
                            // itemStyle: {
                            //     normal: {
                            //         color: 'orange'
                            //         //type:"dashed"
                            //     }
                            // },
                            symbolSize: 8,
                            hoverAnimation: true,
                            data:values,
                            label: {
                                normal: {
                                    show: false
                                }
                            }
                        }
                        arr.push(obj);
                    }
                    load_line("chart4",names,arr,"","每月电压越限总数",legendName);
                }else if(datas[k].title2=="AcInputAbnAnalyze"){
                    $("#system2 .report_p23>div:nth-child(3)>p").remove();
                    for(var m=0;m<datas[k].arr.length;m++){
                        var str="";
                        for(var n=0;n<datas[k].arr[m].value.length;n++){
                            var allMonth;
                            if(datas[k].arr[m].value[2]>0){
                                allMonth = datas[k].arr[m].value[2]+"月 "; 
                            }
                           
                            if(datas[k].arr[m].value[3]!=datas[k].arr[m].value[2] && datas[k].arr[m].value[3]>0){
                                allMonth+=datas[k].arr[m].value[3]+"月 ";
                            }
                            if(datas[k].arr[m].value[4]!=datas[k].arr[m].value[2] && datas[k].arr[m].value[4]!=datas[k].arr[m].value[3] && datas[k].arr[m].value[4]>0){
                                allMonth+=datas[k].arr[m].value[4]+"月 ";
                            }
                            str="<p>("+(m+1)+")"+datas[k].arr[m].name+"："+visiteIDtoStr(datas[k].arr[m].value[0])+"累计"+datas[k].arr[m].value[1]+"次,集中于"+allMonth+"。</p>";
                        }
                        $("#system2 .report_p23>div:nth-child(3)").append(str);
                    }
                }else if(datas[k].title2=="BusVAbnLine"){
                    var names=[];
                    var arr=[];
                    var legendName= [];
                    for(var m=0;m<datas[k].arr.length;m++){
                        legendName.push(datas[k].arr[m].name);
                        var values=[];
                        for(var n=0;n<datas[k].arr[m].value.length;n+=2){
                            var val=datas[k].arr[m].value[n]+"月";
                            names.push(val);
                        } 
                        for(var n=1;n<datas[k].arr[m].value.length+1;n+=2){
                            var val=parseFloat(datas[k].arr[m].value[n]).toFixed(2)
                            values.push(val);
                        } 
                       
                        var obj= {
                            name:datas[k].arr[m].name,
                            type:'line',
                            smooth:true,
                            // itemStyle: {
                            //     normal: {
                            //         color: 'orange'
                            //         //type:"dashed"
                            //     }
                            // },
                            symbolSize: 8,
                            hoverAnimation: true,
                            data:values,
                            label: {
                                normal: {
                                    show: false
                                }
                            }
                        }
                        arr.push(obj);
                    }
                    load_line("chart5",names,arr,"","每月电压越限总数",legendName);
                }else if(datas[k].title2=="BusVAbnAnalyze"){
                    $("#system2 .report_p24>div:nth-child(3)>p").remove();
                    for(var m=0;m<datas[k].arr.length;m++){
                        var str="";
                        for(var n=0;n<datas[k].arr[m].value.length;n++){
                            var allMonth;
                            if(datas[k].arr[m].value[2]>0){
                                allMonth = datas[k].arr[m].value[2]+"月 "; 
                            }
                           
                            if(datas[k].arr[m].value[3]!=datas[k].arr[m].value[2] && datas[k].arr[m].value[3]>0){
                                allMonth+=datas[k].arr[m].value[3]+"月 ";
                            }
                            if(datas[k].arr[m].value[4]!=datas[k].arr[m].value[2] && datas[k].arr[m].value[4]!=datas[k].arr[m].value[3] && datas[k].arr[m].value[4]>0){
                                allMonth+=datas[k].arr[m].value[4]+"月 ";
                            }
                            str="<p>("+(m+1)+")"+datas[k].arr[m].name+"："+visiteIDtoStr(datas[k].arr[m].value[0])+"累计"+datas[k].arr[m].value[1]+"次,集中于"+allMonth+"。</p>";
                        }
                        $("#system2 .report_p24>div:nth-child(3)").append(str);
                    }
                }else if(datas[k].title2=="ChargeElecTable"){
                    $("#system2 .report_p25>table:nth-child(2)>tbody>tr").remove();
                    for(var m=0;m<datas[k].arr.length;m++){
                        var str="";
                        for(var n=0;n<datas[k].arr[m].value.length;n++){
                            str+='<td>'+datas[k].arr[m].value[n]+'</td>';
                        }
                        $("#system2 .report_p25>table:nth-child(2)>tbody").append('<tr><td>'+(m+1)+'</td><td>'+datas[k].arr[m].name+'</td>'+str+'</tr>');
                    }
                }else if(datas[k].title2=="ChargeElecAnalyze"){
                    $("#system2 .report_p25>div:nth-child(3)>p").remove();
                    for(var m=0;m<datas[k].arr.length;m++){
                        var str="";
                        for(var n=0;n<datas[k].arr[m].value.length;n++){
                            var allMonth;
                            allMonth = datas[k].arr[m].value[2]+"月，"; 
                            if(datas[k].arr[m].value[3]!=datas[k].arr[m].value[2]){
                                allMonth+=datas[k].arr[m].value[3]+"月，";
                            }
                            if(datas[k].arr[m].value[4]!=datas[k].arr[m].value[2] && datas[k].arr[m].value[4]!=datas[k].arr[m].value[3]){
                                allMonth+=datas[k].arr[m].value[4]+"月，";
                            }
                            str="<p>("+(m+1)+")"+datas[k].arr[m].name+"："+visiteIDtoStr(datas[k].arr[m].value[0])+"累计"+datas[k].arr[m].value[1]+"次,集中于"+allMonth+"最大值"+datas[k].arr[m].value[5]+visiteIDtoUnit(datas[k].arr[m].value[0])+",发生于"+datas[k].arr[m].value[6]+"。</p>";
                        }
                        $("#system2 .report_p25>div:nth-child(3)").append(str);
                    }
                }else if(datas[k].title2=="BatterySingleVRAnalyze"){
                    $("#system2 .report_p26>div:nth-child(2)>p").remove();
                    $("#system2 .report_p26>div:nth-child(4)>p").remove();
                    for(var m=0;m<datas[k].arr.length;m++){
                        var str="";
                        var str2="";
                        if(datas[k].arr[m].type==8){
                            for(var n=0;n<datas[k].arr[m].value.length;n++){
                                str="<p>("+(m+1)+")"+datas[k].arr[m].name+",共有"+datas[k].arr[m].value[0]+"节电池,"+datas[k].arr[m].value[1]+"越限累计"+datas[k].arr[m].value[2]+"次,最小值"+datas[k].arr[m].value[3]+",发生于"+datas[k].arr[m].value[4]+"。</p>";
                            }
                            $("#system2 .report_p26>div:nth-child(2)").append(str);
                        }else if(datas[k].arr[m].type==9){
                            for(var n=0;n<datas[k].arr[m].value.length;n++){
                                str2="<p>("+(m+1)+")"+datas[k].arr[m].name+",共有"+datas[k].arr[m].value[0]+"节电池,"+datas[k].arr[m].value[1]+"越限累计"+datas[k].arr[m].value[2]+"次,最大值"+datas[k].arr[m].value[3]+",发生于"+datas[k].arr[m].value[4]+"。</p>";
                            }
                            $("#system2 .report_p26>div:nth-child(4)").append(str2);
                        }                      
                    }
                }else if(datas[k].title2=="EventYc"){
                    $("#system2 .report_p27 table>tbody>tr").remove();
                    for(var m=0;m<datas[k].arr.length;m++){
                        var str="";
                        if(datas[k].arr[m].value[0]==2){
                            str+='<td>越上限</td>';
                        }else if(datas[k].arr[m].value[0]==3){
                            str+='<td>越下限</td>';
                        }
                        for(var n=1;n<datas[k].arr[m].value.length;n++){
                            str+='<td>'+datas[k].arr[m].value[n]+'</td>';
                        }
                        $("#system2 .report_p27 table>tbody").append('<tr><td>'+(m+1)+'</td><td>'+datas[k].arr[m].name+'</td>'+str+'</tr>');
                    }
                }else if(datas[k].title2=="EventYx"){
                    $("#system2 .report_p28 table>tbody>tr").remove();
                    for(var m=0;m<datas[k].arr.length;m++){
                        var str="";
                        for(var n=0;n<datas[k].arr[m].value.length;n++){
                            str+='<td>'+datas[k].arr[m].value[n]+'</td>';
                        }
                        $("#system2 .report_p28 table>tbody").append('<tr><td>'+(m+1)+'</td><td>'+datas[k].arr[m].name+'</td>'+str+'</tr>');
                    }
                }
            }
        }else if(report[i].title=="INV"){
            $("#containt>#system3").show();
            for(var k=0;k<datas.length;k++){
                if(datas[k].title2=="Abstract"){
                    $("#system3 .report_p32>table:nth-child(3)>tbody>tr").remove();
                    for(var m=0;m<datas[k].arr.length;m++){
                        $("#system3 .report_p32>table:nth-child(3)>tbody").append('<tr><td>'+(m+1)+'</td><td>'+datas[k].arr[m].name+'</td><td>'+datas[k].arr[m].value[0]+'</td></tr>');
                    }
                }else if(datas[k].title2=="RunTable"){
                    $("#system3 .report_p33>table:nth-child(3)>tbody>tr").remove();
                    for(var m=0;m<datas[k].arr.length;m++){
                        var str="";
                        for(var n=0;n<datas[k].arr[m].value.length;n++){
                            str+='<td>'+datas[k].arr[m].value[n]+'</td>';
                        }
                        $("#system3 .report_p33>table:nth-child(3)>tbody").append('<tr><td>'+(m+1)+'</td><td>'+datas[k].arr[m].name+'</td>'+str+'</tr>');
                    }
                }else if(datas[k].title2=="RunAnalyze"){
                    $("#system3 .report_p33>div:nth-child(4)>p").remove();
                    for(var m=0;m<datas[k].arr.length;m++){
                        var str="";
                        for(var n=0;n<datas[k].arr[m].value.length;n++){
                            var allMonth;
                            if(datas[k].arr[m].value[2]>0){
                                allMonth = datas[k].arr[m].value[2]+"月，";
                            }
                            
                            if(datas[k].arr[m].value[3]!=datas[k].arr[m].value[2] && datas[k].arr[m].value[3]>0){
                                allMonth+=datas[k].arr[m].value[3]+"月，";
                            }
                            if(datas[k].arr[m].value[4]!=datas[k].arr[m].value[2] && datas[k].arr[m].value[4]!=datas[k].arr[m].value[3] && datas[k].arr[m].value[4]>0){
                                allMonth+=datas[k].arr[m].value[4]+"月，";
                            }
                            str="<p>("+(m+1)+")"+datas[k].arr[m].name+"："+visiteIDtoStr(datas[k].arr[m].value[0])+"累计"+datas[k].arr[m].value[1]+"次,集中于"+allMonth+"最大值"+datas[k].arr[m].value[5]+visiteIDtoUnit(datas[k].arr[m].value[0])+",发生于"+datas[k].arr[m].value[6]+"。</p>";
                        }
                        $("#system3 .report_p33>div:nth-child(4)").append(str);
                    }
                }else if(datas[k].title2=="InputVAbn"){
                    $("#system3 .report_p33>div:nth-child(7)").hide();
                    $("#system3 .report_p33>h4:nth-child(5)").hide();
                    $("#system3 .report_p34").hide();
                    $("#chart6").hide();
                    for(var devlen=0;devlen<datas[k].arr.length;devlen++){
                        if(datas[k].arr[devlen].title2=="Dev01"){
                            $("#system3 .report_p33>div:nth-child(7)").show();
                            $("#system3 .report_p33>h4:nth-child(5)").show();
                            $("#chart6").show();
                            var names=[];
                            var arr=[];
                            var legendName = [];
                            for(var m=0;m<datas[k].arr[devlen].obj.Line.length;m++){
                                legendName.push(datas[k].arr[devlen].obj.Line[m].name);
                                var values=[];
                                for(var n=1;n<datas[k].arr[devlen].obj.Line[m].value.length+1;n+=2){
                                    var val=parseFloat(datas[k].arr[devlen].obj.Line[m].value[n]).toFixed(2)
                                    values.push(val);
                                } 
                                for(var n=0;n<datas[k].arr[devlen].obj.Line[m].value.length;n+=2){
                                    var val=datas[k].arr[devlen].obj.Line[m].value[n]+"月";
                                    names.push(val);
                                } 
                                var obj= {
                                    name:datas[k].arr[devlen].obj.Line[m].name,
                                    type:'line',
                                    smooth:true,
                                    symbolSize: 8,
                                    hoverAnimation: true,
                                    data:values,
                                    label: {
                                        normal: {
                                            show: false
                                        }
                                    }
                                }
                                arr.push(obj);
                            }
                            load_line("chart6",names,arr,"","每月电压越限总数",legendName);

                            $("#system2 .report_p33>div:nth-child(7)>p").remove();
                            for(var m=0;m<datas[k].arr[devlen].obj.Analyze.length;m++){
                                var str="";
                                for(var n=0;n<datas[k].arr[devlen].obj.Analyze[m].value.length;n++){
                                    var allMonth;
                                    if(datas[k].arr[devlen].obj.Analyze[m].value[2]>0){
                                        allMonth = datas[k].arr[devlen].obj.Analyze[m].value[2]+"月，"; 
                                    }
                                    
                                    if(datas[k].arr[devlen].obj.Analyze[m].value[3]!=datas[k].arr[devlen].obj.Analyze[m].value[2] && datas[k].arr[devlen].obj.Analyze[m].value[3]>0){
                                        allMonth+=datas[k].arr[devlen].obj.Analyze[m].value[3]+"月，";
                                    }
                                    if(datas[k].arr[devlen].obj.Analyze[m].value[4]!=datas[k].arr[devlen].obj.Analyze[m].value[2] && datas[k].arr[devlen].obj.Analyze[m].value[4]!=datas[k].arr[devlen].obj.Analyze[m].value[3] && datas[k].arr[devlen].obj.Analyze[m].value[4]>0){
                                        allMonth+=datas[k].arr[devlen].obj.Analyze[m].value[4]+"月，";
                                    }
                                    str="<p>("+(m+1)+")"+datas[k].arr[devlen].obj.Analyze[m].name+"："+visiteIDtoStr(datas[k].arr[devlen].obj.Analyze[m].value[0])+"累计"+datas[k].arr[devlen].obj.Analyze[m].value[1]+"次,集中于"+allMonth+"最大值"+datas[k].arr[devlen].obj.Analyze[m].value[5]+visiteIDtoUnit(datas[k].arr[devlen].obj.Analyze[m].value[0])+",发生于"+datas[k].arr[devlen].obj.Analyze[m].value[6]+"</p>";
                                }
                                $("#system3 .report_p33>div:nth-child(7)").append(str);
                            }
                        }else if(datas[k].arr[devlen].title2=="Dev02"){
                            $("#system3 .report_p34").show();
                            var names=[];
                            var arr=[];
                            var legendName = [];
                            for(var m=0;m<datas[k].arr[devlen].obj.Line.length;m++){
                                legendName.push(datas[k].arr[devlen].obj.Line[m].name);
                                var values=[];
                                for(var n=1;n<datas[k].arr[devlen].obj.Line[m].value.length+1;n+=2){
                                    var val=parseFloat(datas[k].arr[devlen].obj.Line[m].value[n]).toFixed(2)
                                    values.push(val);
                                } 
                                for(var n=0;n<datas[k].arr[devlen].obj.Line[m].value.length;n+=2){
                                    var val=datas[k].arr[devlen].obj.Line[m].value[n]+"月";
                                    names.push(val);
                                } 
                                var obj= {
                                    name:datas[k].arr[devlen].obj.Line[m].name,
                                    type:'line',
                                    smooth:true,
                                    symbolSize: 8,
                                    hoverAnimation: true,
                                    data:values,
                                    label: {
                                        normal: {
                                            show: false
                                        }
                                    }
                                }
                                arr.push(obj);
                            }
                            load_line("chart7",names,arr,"","每月电压越限总数",legendName);
                            $("#system3 .report_p34>div:nth-child(3)>p").remove();
                            for(var m=0;m<datas[k].arr[devlen].obj.Analyze.length;m++){
                                var str="";
                                for(var n=0;n<datas[k].arr[devlen].obj.Analyze[m].value.length;n++){
                                    var allMonth;
                                    if(datas[k].arr[devlen].obj.Analyze[m].value[2]>0){
                                        allMonth = datas[k].arr[devlen].obj.Analyze[m].value[2]+"月，"; 
                                    }
                                    if(datas[k].arr[devlen].obj.Analyze[m].value[3]!=datas[k].arr[devlen].obj.Analyze[m].value[2] && datas[k].arr[devlen].obj.Analyze[m].value[3]>0){
                                        allMonth+=datas[k].arr[devlen].obj.Analyze[m].value[3]+"月，";
                                    }
                                    if(datas[k].arr[devlen].obj.Analyze[m].value[4]!=datas[k].arr[devlen].obj.Analyze[m].value[2] && datas[k].arr[devlen].obj.Analyze[m].value[4]!=datas[k].arr[devlen].obj.Analyze[m].value[3] && datas[k].arr[devlen].obj.Analyze[m].value[4]>0){
                                        allMonth+=datas[k].arr[devlen].obj.Analyze[m].value[4]+"月，";
                                    }
                                    str="<p>("+(m+1)+")"+datas[k].arr[devlen].obj.Analyze[m].name+"："+visiteIDtoStr(datas[k].arr[devlen].obj.Analyze[m].value[0])+"累计"+datas[k].arr[devlen].obj.Analyze[m].value[1]+"次,集中于"+allMonth+"最大值"+datas[k].arr[devlen].obj.Analyze[m].value[5]+visiteIDtoUnit(datas[k].arr[devlen].obj.Analyze[m].value[0])+",发生于"+datas[k].arr[devlen].obj.Analyze[m].value[6]+"</p>";
                                }
                                $("#system3 .report_p34>div:nth-child(3)").append(str);
                            }
                        }
                    }
                    
                }else if(datas[k].title2=="EventYc"){
                    $("#system3 .report_p37 table>tbody>tr").remove();
                    for(var m=0;m<datas[k].arr.length;m++){
                        var str="";
                        if(datas[k].arr[m].value[0]==2){
                            str+='<td>越上限</td>';
                        }else if(datas[k].arr[m].value[0]==3){
                            str+='<td>越下限</td>';
                        }
                        for(var n=1;n<datas[k].arr[m].value.length;n++){
                            str+='<td>'+datas[k].arr[m].value[n]+'</td>';
                        }
                        $("#system3 .report_p37 table>tbody").append('<tr><td>'+(m+1)+'</td><td>'+datas[k].arr[m].name+'</td>'+str+'</tr>');
                    }
                }else if(datas[k].title2=="EventYx"){
                    $("#system3 .report_p38 table>tbody>tr").remove();
                    for(var m=0;m<datas[k].arr.length;m++){
                        var str="";
                        for(var n=0;n<datas[k].arr[m].value.length;n++){
                            str+='<td>'+datas[k].arr[m].value[n]+'</td>';
                        }
                        $("#system3 .report_p38 table>tbody").append('<tr><td>'+(m+1)+'</td><td>'+datas[k].arr[m].name+'</td>'+str+'</tr>');
                    }
                }
            }
        }else if(report[i].title=="UPS"){
            $("#containt>#system4").show();
            for(var k=0;k<datas.length;k++){
                if(datas[k].title2=="Abstract"){
                    $("#system4 .report_p42>table:nth-child(3)>tbody>tr").remove();
                    for(var m=0;m<datas[k].arr.length;m++){
                        $("#system4 .report_p42>table:nth-child(3)>tbody").append('<tr><td>'+(m+1)+'</td><td>'+datas[k].arr[m].name+'</td><td>'+datas[k].arr[m].value[0]+'</td></tr>');
                    }
                }else if(datas[k].title2=="RunTable"){
                    $("#system4 .report_p43>table:nth-child(3)>tbody>tr").remove();
                    for(var m=0;m<datas[k].arr.length;m++){
                        var str="";
                        for(var n=0;n<datas[k].arr[m].value.length;n++){
                            str+='<td>'+datas[k].arr[m].value[n]+'</td>';
                        }
                        $("#system4 .report_p43>table:nth-child(3)>tbody").append('<tr><td>'+(m+1)+'</td><td>'+datas[k].arr[m].name+'</td>'+str+'</tr>');
                    }
                }else if(datas[k].title2=="RunAnalyze"){
                    $("#system4 .report_p43>div:nth-child(4)>p").remove();
                    for(var m=0;m<datas[k].arr.length;m++){
                        var str="";
                        for(var n=0;n<datas[k].arr[m].value.length;n++){
                            var allMonth;
                            if(datas[k].arr[m].value[2]>0){
                                allMonth = datas[k].arr[m].value[2]+"月，"; 
                            }
                           
                            if(datas[k].arr[m].value[3]!=datas[k].arr[m].value[2] && datas[k].arr[m].value[3]>0){
                                allMonth+=datas[k].arr[m].value[3]+"月，";
                            }
                            if(datas[k].arr[m].value[4]!=datas[k].arr[m].value[2] && datas[k].arr[m].value[4]!=datas[k].arr[m].value[3] && datas[k].arr[m].value[4]>0){
                                allMonth+=datas[k].arr[m].value[4]+"月，";
                            }
                            str="<p>("+(m+1)+")"+datas[k].arr[m].name+"："+visiteIDtoStr(datas[k].arr[m].value[0])+"累计"+datas[k].arr[m].value[1]+"次,集中于"+allMonth+"最大值"+datas[k].arr[m].value[5]+visiteIDtoUnit(datas[k].arr[m].value[0])+",发生于"+datas[k].arr[m].value[6]+"。</p>";
                        }
                        $("#system4 .report_p43>div:nth-child(4)").append(str);
                    }
                }else if(datas[k].title2=="InputVAbn"){
                    $("#system4 .report_p43>div:nth-child(7)").hide();
                    $("#system4 .report_p43>h4:nth-child(5)").hide();
                    $("#system4 .report_p44").hide();
                    $("#chart8").hide();
                    for(var devlen=0;devlen<datas[k].arr.length;devlen++){
                        if(datas[k].arr[devlen].title2=="Dev01"){
                            $("#system4 .report_p43>div:nth-child(7)").show();
                            $("#system4 .report_p43>h4:nth-child(5)").show();
                            $("#chart8").show();
                            var names=[];
                            var arr=[];
                            var legendName = [];
                            for(var m=0;m<datas[k].arr[devlen].obj.Line.length;m++){
                                legendName.push(datas[k].arr[devlen].obj.Line[m].name);
                                var values=[];
                                for(var n=1;n<datas[k].arr[devlen].obj.Line[m].value.length+1;n+=2){
                                    var val=parseFloat(datas[k].arr[devlen].obj.Line[m].value[n]).toFixed(2)
                                    values.push(val);
                                } 
                                for(var n=0;n<datas[k].arr[devlen].obj.Line[m].value.length;n+=2){
                                    var val=datas[k].arr[devlen].obj.Line[m].value[n]+"月";
                                    names.push(val);
                                } 
                                var obj= {
                                    name:datas[k].arr[devlen].obj.Line[m].name,
                                    type:'line',
                                    smooth:true,
                                    // itemStyle: {
                                    //     normal: {
                                    //         color: 'orange'
                                    //         //type:"dashed"
                                    //     }
                                    // },
                                    symbolSize: 8,
                                    hoverAnimation: true,
                                    data:values,
                                    label: {
                                        normal: {
                                            show: false
                                        }
                                    }
                                }
                                arr.push(obj);
                            }
                            load_line("chart8",names,arr,"","每月电压越限总数",legendName);

                            $("#system4 .report_p43>div:nth-child(7)>p").remove();
                            for(var m=0;m<datas[k].arr[devlen].obj.Analyze.length;m++){
                                var str="";
                                for(var n=0;n<datas[k].arr[devlen].obj.Analyze[m].value.length;n++){
                                    var allMonth;
                                    if(datas[k].arr[devlen].obj.Analyze[m].value[2]>0){
                                        allMonth = datas[k].arr[devlen].obj.Analyze[m].value[2]+"月，"; 
                                    }
                                    
                                    if(datas[k].arr[devlen].obj.Analyze[m].value[3]!=datas[k].arr[devlen].obj.Analyze[m].value[2] && datas[k].arr[devlen].obj.Analyze[m].value[3]>0){
                                        allMonth+=datas[k].arr[devlen].obj.Analyze[m].value[3]+"月，";
                                    }
                                    if(datas[k].arr[devlen].obj.Analyze[m].value[4]!=datas[k].arr[devlen].obj.Analyze[m].value[2] && datas[k].arr[devlen].obj.Analyze[m].value[4]!=datas[k].arr[devlen].obj.Analyze[m].value[3] && datas[k].arr[devlen].obj.Analyze[m].value[4]>0){
                                        allMonth+=datas[k].arr[devlen].obj.Analyze[m].value[4]+"月，";
                                    }
                                    str="<p>("+(m+1)+")"+datas[k].arr[devlen].obj.Analyze[m].name+"："+visiteIDtoStr(datas[k].arr[devlen].obj.Analyze[m].value[0])+"累计"+datas[k].arr[devlen].obj.Analyze[m].value[1]+"次,集中于"+allMonth+"最大值"+datas[k].arr[devlen].obj.Analyze[m].value[5]+visiteIDtoUnit(datas[k].arr[devlen].obj.Analyze[m].value[0])+",发生于"+datas[k].arr[devlen].obj.Analyze[m].value[6]+"。</p>";
                                }
                                $("#system4 .report_p43>div:nth-child(7)").append(str);
                            }
                        }else if(datas[k].arr[devlen].title2=="Dev02"){
                            $("#system4 .report_p44").show();
                            var names=[];
                            var arr=[];
                            var legendName = [];
                            for(var m=0;m<datas[k].arr[devlen].obj.Line.length;m++){
                                legendName.push(datas[k].arr[devlen].obj.Line[m].name);
                                var values=[];
                                for(var n=1;n<datas[k].arr[devlen].obj.Line[m].value.length+1;n+=2){
                                    var val=parseFloat(datas[k].arr[devlen].obj.Line[m].value[n]).toFixed(2)
                                    values.push(val);
                                } 
                                for(var n=0;n<datas[k].arr[devlen].obj.Line[m].value.length;n+=2){
                                    var val=datas[k].arr[devlen].obj.Line[m].value[n]+"月";
                                    names.push(val);
                                } 
                                var obj= {
                                    name:datas[k].arr[devlen].obj.Line[m].name,
                                    type:'line',
                                    smooth:true,
                                    // itemStyle: {
                                    //     normal: {
                                    //         color: 'orange'
                                    //         //type:"dashed"
                                    //     }
                                    // },
                                    symbolSize: 8,
                                    hoverAnimation: true,
                                    data:values,
                                    label: {
                                        normal: {
                                            show: false
                                        }
                                    }
                                }
                                arr.push(obj);
                            }
                            load_line("chart9",names,arr,"","每月电压越限总数",legendName);

                            $("#system4 .report_p44>div:nth-child(3)>p").remove();
                            for(var m=0;m<datas[k].arr[devlen].obj.Analyze.length;m++){
                                var str="";
                                for(var n=0;n<datas[k].arr[devlen].obj.Analyze[m].value.length;n++){
                                    var allMonth;
                                    if(datas[k].arr[devlen].obj.Analyze[m].value[2]>0){
                                        allMonth = datas[k].arr[devlen].obj.Analyze[m].value[2]+"月，"; 
                                    }
                                   
                                    if(datas[k].arr[devlen].obj.Analyze[m].value[3]!=datas[k].arr[devlen].obj.Analyze[m].value[2] && datas[k].arr[devlen].obj.Analyze[m].value[3]>0){
                                        allMonth+=datas[k].arr[devlen].obj.Analyze[m].value[3]+"月，";
                                    }
                                    if(datas[k].arr[devlen].obj.Analyze[m].value[4]!=datas[k].arr[devlen].obj.Analyze[m].value[2] && datas[k].arr[devlen].obj.Analyze[m].value[4]!=datas[k].arr[devlen].obj.Analyze[m].value[3] && datas[k].arr[devlen].obj.Analyze[m].value[4]>0){
                                        allMonth+=datas[k].arr[devlen].obj.Analyze[m].value[4]+"月，";
                                    }
                                    str="<p>("+(m+1)+")"+datas[k].arr[devlen].obj.Analyze[m].name+"："+visiteIDtoStr(datas[k].arr[devlen].obj.Analyze[m].value[0])+"累计"+datas[k].arr[devlen].obj.Analyze[m].value[1]+"次,集中于"+allMonth+"最大值"+datas[k].arr[devlen].obj.Analyze[m].value[5]+visiteIDtoUnit(datas[k].arr[devlen].obj.Analyze[m].value[0])+",发生于"+datas[k].arr[devlen].obj.Analyze[m].value[6]+"。</p>";
                                }
                                $("#system4 .report_p44>div:nth-child(3)").append(str);
                            }
                        }
                    }
                    
                }else if(datas[k].title2=="EventYc"){
                    $("#system4 .report_p47 table>tbody>tr").remove();
                    for(var m=0;m<datas[k].arr.length;m++){
                        var str="";
                        if(datas[k].arr[m].value[0]==2){
                            str+='<td>越上限</td>';
                        }else if(datas[k].arr[m].value[0]==3){
                            str+='<td>越下限</td>';
                        }
                        for(var n=1;n<datas[k].arr[m].value.length;n++){
                            str+='<td>'+datas[k].arr[m].value[n]+'</td>';
                        }
                        $("#system4 .report_p47 table>tbody").append('<tr><td>'+(m+1)+'</td><td>'+datas[k].arr[m].name+'</td>'+str+'</tr>');
                    }
                }else if(datas[k].title2=="EventYx"){
                    $("#system4 .report_p48 table>tbody>tr").remove();
                    for(var m=0;m<datas[k].arr.length;m++){
                        var str="";
                        for(var n=0;n<datas[k].arr[m].value.length;n++){
                            str+='<td>'+datas[k].arr[m].value[n]+'</td>';
                        }
                        $("#system4 .report_p48 table>tbody").append('<tr><td>'+(m+1)+'</td><td>'+datas[k].arr[m].name+'</td>'+str+'</tr>');
                    }
                }
            }
        }else if(report[i].title=="CC"){//通信电源系统
            $("#containt>#system5").show();
            for(var k=0;k<datas.length;k++){
                if(datas[k].title2=="Abstract"){
                    $("#system5 .report_p52>table:nth-child(3)>tbody>tr").remove();
                    for(var m=0;m<datas[k].arr.length;m++){
                        $("#system5 .report_p52>table:nth-child(3)>tbody").append('<tr><td>'+(m+1)+'</td><td>'+datas[k].arr[m].name+'</td><td>'+datas[k].arr[m].value[0]+'</td></tr>');
                    }
                }else if(datas[k].title2=="AcInputAbnLine"){
                    var names=[];
                    var arr=[];
                    var legendName =[];
                    for(var m=0;m<datas[k].arr.length;m++){
                        legendName.push(datas[k].arr[m].name);
                        var values=[];
                    
                        for(var n=0;n<datas[k].arr[m].value.length;n+=2){
                            var val=datas[k].arr[m].value[n]+"月";
                            names.push(val);
                        } 
                        for(var n=1;n<datas[k].arr[m].value.length+1;n+=2){
                            var val=parseFloat(datas[k].arr[m].value[n]).toFixed(2);
                            values.push(val);
                        } 
                        var obj= {
                            name:datas[k].arr[m].name,
                            type:'line',
                            smooth:true,
                            // itemStyle: {
                            //     normal: {
                            //         color: 'orange'
                            //         //type:"dashed"
                            //     }
                            // },
                            symbolSize: 8,
                            hoverAnimation: true,
                            data:values,
                            label: {
                                normal: {
                                    show: false
                                }
                            }
                        }
                        arr.push(obj);
                    }
                    load_line("chart10",names,arr,"","每月电压越限总数",legendName);
                }else if(datas[k].title2=="AcInputAbnLine"){
                    $("#system5 .report_p53>div:nth-child(4)>p").remove();
                    for(var m=0;m<datas[k].arr.length;m++){
                        var str="";
                        for(var n=0;n<datas[k].arr[m].value.length;n++){
                            var allMonth;
                            if(datas[k].arr[m].value[2]>0){
                                allMonth = datas[k].arr[m].value[2]+"月，"; 
                            }
                          
                            if(datas[k].arr[m].value[3]!=datas[k].arr[m].value[2] && datas[k].arr[m].value[3]>0){
                                allMonth+=datas[k].arr[m].value[3]+"月，";
                            }
                            if(datas[k].arr[m].value[4]!=datas[k].arr[m].value[2] && datas[k].arr[m].value[4]!=datas[k].arr[m].value[3] && datas[k].arr[m].value[4]>0){
                                allMonth+=datas[k].arr[m].value[4]+"月，";
                            }
                            str="<p>("+(m+1)+")"+datas[k].arr[m].name+"："+datas[k].arr[m].value[0]+","+datas[k].arr[m].value[1]+",集中于"+allMonth+"最大值"+datas[k].arr[m].value[5]+visiteIDtoUnit(datas[k].arr[m].value[0])+",发生于"+datas[k].arr[m].value[6]+"。</p>";
                        }
                        $("#system5 .report_p53>div:nth-child(4)").append(str);
                    }
                }else if(datas[k].title2=="BusVAbnLine"){
                    var names=[];
                    var arr=[];
                    var legendName =[];
                    for(var m=0;m<datas[k].arr.length;m++){
                        legendName.push(datas[k].arr[m].name);
                        var values=[];
                    
                        for(var n=0;n<datas[k].arr[m].value.length;n+=2){
                            var val=datas[k].arr[m].value[n]+"月";
                            names.push(val);
                        } 
                        for(var n=1;n<datas[k].arr[m].value.length+1;n+=2){
                            var val=parseFloat(datas[k].arr[m].value[n]).toFixed(2);
                            values.push(val);
                        } 
                        var obj= {
                            name:datas[k].arr[m].name,
                            type:'line',
                            smooth:true,
                            // itemStyle: {
                            //     normal: {
                            //         color: 'orange'
                            //         //type:"dashed"
                            //     }
                            // },
                            symbolSize: 8,
                            hoverAnimation: true,
                            data:values,
                            label: {
                                normal: {
                                    show: false
                                }
                            }
                        }
                        arr.push(obj);
                    }
                    load_line("chart11",names,arr,"","每月电压越限总数".legendName);
                }else if(datas[k].title2=="BusVAbnAnalyze"){
                    $("#system5 .report_p53>div:nth-child(7)>p").remove();
                    for(var m=0;m<datas[k].arr.length;m++){
                        var str="";
                        for(var n=0;n<datas[k].arr[m].value.length;n++){
                            var allMonth;
                            if(datas[k].arr[m].value[2]>0){
                                allMonth = datas[k].arr[m].value[2]+"月，"; 
                            }
                           
                            if(datas[k].arr[m].value[3]!=datas[k].arr[m].value[2] && datas[k].arr[m].value[3]>0){
                                allMonth+=datas[k].arr[m].value[3]+"月，";
                            }
                            if(datas[k].arr[m].value[4]!=datas[k].arr[m].value[2] && datas[k].arr[m].value[4]!=datas[k].arr[m].value[3] && datas[k].arr[m].value[4]>0){
                                allMonth+=datas[k].arr[m].value[4]+"月，";
                            }
                            str="<p>("+(m+1)+")"+datas[k].arr[m].name+"："+visiteIDtoStr(datas[k].arr[m].value[0])+"累计"+datas[k].arr[m].value[1]+"次,集中于"+allMonth+"最大值"+datas[k].arr[m].value[5]+visiteIDtoUnit(datas[k].arr[m].value[0])+",发生于"+datas[k].arr[m].value[6]+"。</p>";
                        }
                        $("#system5 .report_p53>div:nth-child(7)").append(str);
                    }
                }else if(datas[k].title2=="ChargeElecTable"){
                    $("#system5 .report_p54>table:nth-child(2)>tbody>tr").remove();
                    for(var m=0;m<datas[k].arr.length;m++){
                        var str="";
                        for(var n=0;n<datas[k].arr[m].value.length;n++){
                            str+='<td>'+datas[k].arr[m].value[n]+'</td>';
                        }
                        $("#system5 .report_p54>table:nth-child(2)>tbody").append('<tr><td>'+(m+1)+'</td><td>'+datas[k].arr[m].name+'</td>'+str+'</tr>');
                    }
                }else if(datas[k].title2=="ChargeElecAnalyze"){
                    $("#system5 .report_p54>div:nth-child(3)>p").remove();
                    for(var m=0;m<datas[k].arr.length;m++){
                        var str="";
                        for(var n=0;n<datas[k].arr[m].value.length;n++){
                            var allMonth;
                            if(datas[k].arr[m].value[2]>0){
                                allMonth = datas[k].arr[m].value[2]+"月，"; 
                            }
                            
                            if(datas[k].arr[m].value[3]!=datas[k].arr[m].value[2] && datas[k].arr[m].value[3]>0){
                                allMonth+=datas[k].arr[m].value[3]+"月，";
                            }
                            if(datas[k].arr[m].value[4]!=datas[k].arr[m].value[2] && datas[k].arr[m].value[4]!=datas[k].arr[m].value[3] && datas[k].arr[m].value[4]>0){
                                allMonth+=datas[k].arr[m].value[4]+"月，";
                            }
                            str="<p>("+(m+1)+")"+datas[k].arr[m].name+"："+visiteIDtoStr(datas[k].arr[m].value[0])+"累计"+datas[k].arr[m].value[1]+"次,集中于"+allMonth+"最大值"+datas[k].arr[m].value[5]+visiteIDtoUnit(datas[k].arr[m].value[0])+",发生于"+datas[k].arr[m].value[6]+"。</p>";
                        }
                        $("#system5 .report_p54>div:nth-child(3)").append(str);
                    }
                }else if(datas[k].title2=="BatterySingleVRAnalyze"){
                    $("#system5 .report_p55>div:nth-child(2)>p").remove();
                    $("#system5 .report_p55>div:nth-child(4)>p").remove();
                    for(var m=0;m<datas[k].arr.length;m++){
                        var str="";
                        var str2="";
                        if(datas[k].arr[m].type==8){
                            for(var n=0;n<datas[k].arr[m].value.length;n++){
                                str="<p>("+(m+1)+")"+datas[k].arr[m].name+",共有"+datas[k].arr[m].value[0]+"节电池,"+datas[k].arr[m].value[1]+"越限累计"+datas[k].arr[m].value[2]+"次,最小值"+datas[k].arr[m].value[3]+"V,发生于"+datas[k].arr[m].value[4]+"。</p>";
                            }
                            $("#system5 .report_p55>div:nth-child(2)").append(str);
                        }else if(datas[k].arr[m].type==9){
                            for(var n=0;n<datas[k].arr[m].value.length;n++){
                                str2="<p>("+(m+1)+")"+datas[k].arr[m].name+",共有"+datas[k].arr[m].value[0]+"节电池,"+datas[k].arr[m].value[1]+"越限累计"+datas[k].arr[m].value[2]+"次,最大值"+datas[k].arr[m].value[3]+"mΩ,发生于"+datas[k].arr[m].value[4]+"。</p>";
                            }
                            $("#system5 .report_p55>div:nth-child(4)").append(str2);
                        }
                        
                    }
                }else if(datas[k].title2=="EventYc"){
                    $("#system5 .report_p57 table>tbody>tr").remove();
                    for(var m=0;m<datas[k].arr.length;m++){
                        var str="";
                        if(datas[k].arr[m].value[0]==2){
                            str+='<td>越上限</td>';
                        }else if(datas[k].arr[m].value[0]==3){
                            str+='<td>越下限</td>';
                        }
                        for(var n=1;n<datas[k].arr[m].value.length;n++){
                            str+='<td>'+datas[k].arr[m].value[n]+'</td>';
                        }
                        $("#system5 .report_p57 table>tbody").append('<tr><td>'+(m+1)+'</td><td>'+datas[k].arr[m].name+'</td>'+str+'</tr>');
                    }
                }else if(datas[k].title2=="EventYx"){
                    $("#system5 .report_p58 table>tbody>tr").remove();
                    for(var m=0;m<datas[k].arr.length;m++){
                        var str="";
                        for(var n=0;n<datas[k].arr[m].value.length;n++){
                            str+='<td>'+datas[k].arr[m].value[n]+'</td>';
                        }
                        $("#system5 .report_p58 table>tbody").append('<tr><td>'+(m+1)+'</td><td>'+datas[k].arr[m].name+'</td>'+str+'</tr>');
                    }
                }
            }
        }else if(report[i].title=="RCD"){//剩余电流系统
            $("#containt>#system6").show();
            for(var k=0;k<datas.length;k++){
                if(datas[k].title2=="RcdElecTable"){
                    $("#system6 .report_p62>table:nth-child(4)>tbody>tr").remove();
                    for(var m=0;m<datas[k].arr.length;m++){
                        $("#system6 .report_p62>table:nth-child(4)>tbody").append('<tr><td>'+(m+1)+'</td><td>'+datas[k].arr[m].name+'</td><td>'+datas[k].arr[m].value[0]+'</td><td>'+datas[k].arr[m].value[1]+'</td></tr>');
                    }
                }else if(datas[k].title2=="RcdElecAnalyze"){
                    $("#system6 .report_p62>div:nth-child(5)>p").remove();
                    for(var m=0;m<datas[k].arr.length;m++){
                        var str="";
                        for(var n=0;n<datas[k].arr[m].value.length;n++){
                            var allMonth;
                            if(datas[k].arr[m].value[2]>0){
                                allMonth = datas[k].arr[m].value[2]+"月，"; 
                            }
                           
                            if(datas[k].arr[m].value[3]!=datas[k].arr[m].value[2] && datas[k].arr[m].value[3]>0){
                                allMonth+=datas[k].arr[m].value[3]+"月，";
                            }
                            if(datas[k].arr[m].value[4]!=datas[k].arr[m].value[2] && datas[k].arr[m].value[4]!=datas[k].arr[m].value[3] && datas[k].arr[m].value[4]>0){
                                allMonth+=datas[k].arr[m].value[4]+"月，";
                            }
                            str="<p>("+(m+1)+")"+datas[k].arr[m].name+"："+visiteIDtoStr(datas[k].arr[m].value[0])+"累计"+datas[k].arr[m].value[1]+"次,集中于"+allMonth+"最大值"+datas[k].arr[m].value[5]+visiteIDtoUnit(datas[k].arr[m].value[0])+",发生于"+datas[k].arr[m].value[6]+"。</p>";
                        }
                        $("#system6 .report_p62>div:nth-child(5)").append(str);
                    }
                }else if(datas[k].title2=="EventYc"){
                    $("#system6 .report_p63 table>tbody>tr").remove();
                    for(var m=0;m<datas[k].arr.length;m++){
                        var str="";
                        if(datas[k].arr[m].value[0]==2){
                            str+='<td>越上限</td>';
                        }else if(datas[k].arr[m].value[0]==3){
                            str+='<td>越下限</td>';
                        }
                        for(var n=1;n<datas[k].arr[m].value.length;n++){
                            str+='<td>'+datas[k].arr[m].value[n]+'</td>';
                        }
                        $("#system6 .report_p63 table>tbody").append('<tr><td>'+(m+1)+'</td><td>'+datas[k].arr[m].name+'</td>'+str+'</tr>');
                    }
                }else if(datas[k].title2=="EventYx"){
                    $("#system6 .report_p64 table>tbody>tr").remove();
                    for(var m=0;m<datas[k].arr.length;m++){
                        var str="";
                        for(var n=0;n<datas[k].arr[m].value.length;n++){
                            str+='<td>'+datas[k].arr[m].value[n]+'</td>';
                        }
                        $("#system6 .report_p64 table>tbody").append('<tr><td>'+(m+1)+'</td><td>'+datas[k].arr[m].name+'</td>'+str+'</tr>');
                    }
                }
            }
        }else if(report[i].title=="CCC"){//电源系统通信事件
            $("#containt>#system7").show();
            for(var k=0;k<datas.length;k++){
                if(datas[k].title2=="EventCc"){
                    $("#system7 .report_p71 table>tbody>tr").remove();
                    for(var m=0;m<datas[k].arr.length;m++){
                        var str="";
                        for(var n=0;n<datas[k].arr[m].value.length;n++){
                            var time = (datas[k].arr[m].value[n] == "0000-00-00 00:00:00")?"未恢复":datas[k].arr[m].value[n];
                            str+='<td>'+time+'</td>';
                        }
                        $("#system7 .report_p71 table>tbody").append('<tr><td>'+(m+1)+'</td><td>通信中断</td><td>'+datas[k].arr[m].name+'</td>'+str+'</tr>');
                    }
                }
            }
        }
    }
 }
 function visiteIDtoStr(id){
    var Val = "";
    switch (parseInt(id)) {
        case 1: Val = "漏电流";break;
        case 2: Val = "过负荷";break;
        case 3: Val = "电流不平衡";break;
        case 4: Val = "温度越限";break;
        case 5: Val = "功率因数越限";break;
        case 6: Val = "过电压";break;
        case 7: Val = "欠电压";break;
        case 8: Val = "单体电压越限";break;
        case 9: Val = "单体内阻越限";break;
        case 10: Val = "绝缘异常";break;
        case 11: Val = "过负载率越限";break;
        case 12: Val = "模块电流越限";break;
        case 13: Val = "开关分闸";break;
        case 14: Val = "事故跳闸";break;
        case 15: Val = "欠温";break;
        default:  break;
    }
    return Val;
 }
 function visiteIDtoUnit(id){
    var Val = "";
    switch (parseInt(id)) {
        case 1: Val = "mA";break;
        case 2: Val = "A";break;
        case 3: Val = "%";break;
        case 4: Val = "℃";break;
        case 5: Val = "";break;
        case 6: Val = "V";break;
        case 7: Val = "V";break;
        case 8: Val = "V";break;
        case 9: Val = "mΩ";break;
        case 10: Val = "";break;
        case 11: Val = "%";break;
        case 12: Val = "A";break;
        case 13: Val = "";break;
        case 14: Val = "";break;
        case 15: Val = "℃";break;
        default:  break;
    }
    return Val;
 }
function clearChart(i){
    var myChart = echarts.init(document.getElementsByClassName("chart")[i]);
    var timedata = [];
    var data = [];
    var option3 = {
        title:{
            text:"",
            x:"center",
            y:"1%",
            textStyle:{
                color:'#000000'
            }
            //textStyle:{
            //    color:"white"
            //}
        },
        tooltip : {
        
            trigger: 'axis',
            color:"#000",
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
            },
            // formatter: function (params,i) {
            //     // console.log(params); // 当我们想要自定义提示框内容时，可以先将鼠标悬浮的数据打印出来，然后根据需求提取出来即
            //     let firstParams = params[0];
            //     // console.log(firstParams)
            //     var maxNum = errNum[firstParams.dataIndex];
            //     return firstParams.name  + '<br>' + '值：' + firstParams.data + ' <br>异常次数：' + maxNum +' 次';
            // }
        },
        color:["#596fe0","#0087b0","#55935f"],
        legend: {
            // data:['值'],
            textStyle:{
                color:'#ffffff',
                fontSize:10
            },
            y:'90px',
            x:"85%",
            type:"scroll",
            orient:"vertical"
        },
        grid: {
            left: '4%',
            right: '6%',
            bottom: '50px',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                data :timedata,
                axisLabel:{
                    show:true,
                    rotate:25,//倾斜度 -90 至 90 默认为0
                    intervel:'auto',
                    inside:false,
                },
                axisLine:{
                    lineStyle:{
                        color:'#000'
                    }
                },
            }
        ],
        yAxis : [
            {
                type : 'value',
                name:"",
                axisLabel : {
                    textStyle: {
                        color: '#000'
                    }
                },
                nameTextStyle:{
                    color:'#000'
                },
                axisLine:{
                    lineStyle:{
                        color:'#000'
                    }
                },
            }
        ],
        series : [
            {
                name:'值',
                type:'bar',
                data:data,
             
                    // itemStyle: {
                    //     normal: {
                    //         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    //             offset: 0,
                    //             color: '#3d78e4'
                    //         }, {
                    //             offset: 1,
                    //             color: '#081423'
                    //         }]),
                    //     }
                    // },
                // markPoint: {
                //     data: [
                //         {type: 'max', name: '最大值'},
                //     ],
                //     symbol:"pin",
                //     symbolSize:40,
                //     itemStyle:{
                //         normal:{
                //             color:"#000"
                //         }
                //     }
                // },
            },

        ]
    };
    myChart.clear();
    myChart.setOption(option3);
}
// 文本转换
function getObject(obj) {
    var o = new Array();
    var snsArr = obj.split(/[(\r\n)\r\n]+/);
    cleanFn(snsArr);
    var data = snsArr.join('**');

    var data0 = data.replace( /</g , '\&lt;').replace( />/g, '\&gt;');;
    var data1 = data0.split('[');
    // var data1 = data.split('[');
    cleanFn(data1);
    for (var i = 0; i < data1.length; i++) {
        var temp = data1[i].split(']');
        var ob = new Object;
        ob.title = temp[0];
        ob.data = new Array();
        var arr = temp[1].split('**@');
        cleanFn(arr);
        if (temp[1] == '**') {
            arr.length = 0;
        }//清除空项
        var arr2 =[];
        for (var j = 0; j < arr.length; j++) {
            var temp2 = arr[j].split('**');
            cleanFn(temp2);
            if(temp2[0].endsWith("Line")||temp2[0].endsWith("Chart")){
                arr[j] =  arr[j].replace( /&lt;/g , '<').replace( /&gt;/g , '>');
                temp2 = arr[j].split('**');
                cleanFn(temp2);
            }
            var ob2 = new Object;
            ob2.title2 = temp2[0];
            temp2.shift();
            if(((ob2.title2 == 'Dev01') || (ob2.title2 == 'Dev02'))&&((ob.title=='INV')||(ob.title=='UPS'))){
                var str1 = temp2.join('**');
                temp2 ={};
                var str1arr = str1.split('#');
                cleanFn(str1arr);

                 for (var k = 0; k < str1arr.length; k++) {
                     var temp4 = str1arr[k].split('**');
                     cleanFn(temp4);
                     var typeName = temp4[0];
                     temp4.shift();
                     for (var l = 0; l < temp4.length; l++) {
                         var temp3 = temp4[l].split(',');
                         var ob3 = new Object;
                         ob3.name = temp3[0];
                         temp3.shift();
                         ob3.value = temp3;
                         temp4[l] = ob3;
                     }
                     var noTong = true;
                     for ( var key in temp2){
                         if(key == typeName){
                             temp2[key].push.apply(temp2[key],temp4);
                             noTong = false;
                         }
                     }
                     if(noTong){
                         temp2[typeName] = temp4;
                     }

                }

                ob2.obj= temp2;
                arr2.push(ob2);
            }else if((ob2.title2 == 'FeederEnergyChart')&&(ob.title=='AC')&&temp2.length){
                var temp2Arr = temp2[0].split(',');
                for (var k = 0; k < parseInt(temp2Arr.length/2); k++) {
                    var ob3 = new Object;
                    ob3.name = temp2Arr[2*k];
                    ob3.value = temp2Arr[2*k+1];
                    temp2[k] = ob3;
                }
                 ob2.arr = temp2;
                 ob.data.push(ob2);
            }else{
                for (var k = 0; k < temp2.length; k++) {
                    var temp3 = temp2[k].split(',');
                    var ob3 = new Object;
                    ob3.name = temp3[0];
                    temp3.shift();
                    if (ob2.title2 == 'BatterySingleVRAnalyze' && (ob.title == 'DC'|| ob.title == 'CC')) {
                        ob3.type = parseInt(temp3[0]);
                        temp3.shift();
                    }//end if
                    ob3.value = temp3;
                    temp2[k] = ob3;
                }//end for
                ob2.arr = temp2;
                ob.data.push(ob2);
            }//end else

        }

        if((ob.title=='INV')||(ob.title=='UPS')){
            for (var j = 0; j < ob.data.length; j++) {
                if(ob.data[j].title2=='InputVAbn'){
                    ob.data[j].arr = JSON.parse(JSON.stringify(arr2));
                    break;
                }
            }
        }
        o.push(ob);
    }
    return o;
}
//发送JSON数据
function postJSON(url, success) {
    $.ajax({
        url: url,
        type: "GET",
        success: success,
        error: function (obj) {
            console.log("数据请求失败");
            console.log(obj);
        },
        async: true
    });
}
//清除空项
function cleanFn(arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == '') {
            arr.splice(i, 1);//返回指定的元素
            i--;
        }
    }
}

// $("a.downLoadReport").click(function(event) {
//     // var optsStyle = $("style").html();
//     // console.log()
//     // $("#containt").wordExport("word",optsStyle);
//     printOut("containt");
// });
$('.downLoadReport').click(function () {
    var fileName =  $('.generateReport').attr('data-name');
    if(!fileName){
        parent.loadAlerts('操作失败！请先生成运行报告');
        return false;
    }
    var type = $(this).attr("type");
    if(type==1){
        // printOut("containt",type);
        downPdf("containt",type);//导出一整页 不隔断
    }else if(type==2){
        var ob = new Object();
        ob.class = 4;
        ob.userData = 0;
        var json = JSON.stringify(ob);
        console.log(ob);
        parent.ccc_lib_reqDataByCmd(type,USER_OPERATE_BY_CUSTOM,json,operateByCustom4Fn);
    }
});
function operateByCustom4Fn(id,info,des){
    console.log(des);
    if(des.result==0){
        var type = info;
        // printOut("containt",type);
        downPdf("containt",type);//导出一整页 不隔断
    }else {
        parent.loadAlerts(des.desc);
    }
}
$(".times").on("mousedown","select",function(event){
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
    if($(this).attr("id")=="devTypes"){
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
$("section").on("click",".checkOpts>li",function(){
    $(this).addClass("active");
    setTimeout(function(){
        $(".checkOpts").hide();
        $(".checkOpts>li.active").removeClass("active");
    },200);
    var val=$(this).attr("data-value");
    $("select.active").val(val).trigger('change');

})

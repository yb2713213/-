
var Interval1,Interval2,Interval3,Interval4,Interval5,Interval6,Interval7,Interval8,Interval9,Interval10,Interval12;
//日期插件
var date=new Date();
var y=date.getFullYear();
var m=date.getMonth()+1;
var d=date.getDate();
var DateType3=1;//能耗时间类型
var cmdtype=1;
var addr="";
var gtId="";
var click=1;
var SelTransId=0;
var SelTransId2=0;
var SelTransType=1;
var SelExtGtw="";
var SelExtAddr="";
var ago30=Get_ago(30);
var ago30_m=ago30.getMonth()+1;
if(ago30_m<10){ago30_m="0"+ago30_m}
var ago30_d=ago30.getDate();
if(ago30_d<10){ago30_d="0"+ago30_d}
var agoDate30=ago30.getFullYear()+"-"+ago30_m+"-"+ago30_d+" 00:00:00";

var max=0;
var min=0;
function Get_ago(n){
    var now = new Date;
    now.setDate(now.getDate() - n);
    return now;
}
function Get_prev_ago(m,n){
    var prev = new Date(m);
    prev.setDate(prev.getDate() - n);
    var yy=prev.getFullYear();
    var mm=prev.getMonth()+1;
    var dd=prev.getDate();
    var hh=prev.getHours();
    var min=prev.getMinutes();
    var ss=prev.getSeconds();
    if(mm<10){
        mm="0"+mm;
    }
    if(dd<10){
        dd="0"+dd;
    }
    if(hh<10){
        hh="0"+hh;
    }
    if(min<10){
        min="0"+min;
    }
    if(ss<10){
        ss="0"+ss;
    }
    return yy+"-"+mm+"-"+dd+" "+hh+":"+min+":"+ss;
}
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
if(m8<10){
    m8="0"+m8;
}
if(d8<10){
    d8="0"+d8;
}

function subByTransDate(dateParameter, num) {


    var translateDate = "", dateString = "", monthString = "", dayString = "";
    translateDate = dateParameter.replace("-", "/").replace("-", "/");


    var newDate = new Date(translateDate);
    newDate = newDate.valueOf();
    newDate = newDate - num * 24 * 60 * 60 * 1000; //备注 如果是往前计算日期则为减号 否则为加号
    newDate = new Date(newDate);


//如果月份长度少于2，则前加 0 补位
    if ((newDate.getMonth() + 1).toString().length == 1) {
        monthString = 0 + "" + (newDate.getMonth() + 1).toString();
    } else {
        monthString = (newDate.getMonth() + 1).toString();
    }


//如果天数长度少于2，则前加 0 补位
    if (newDate.getDate().toString().length == 1) {


        dayString = 0 + "" + newDate.getDate().toString();
    } else {


        dayString = newDate.getDate().toString();
    }


    dateString = newDate.getFullYear() + "-" + monthString + "-" + dayString;
    return dateString;
}

var CreatDate=y+"-"+m+"-"+d+" 00:00:00";
var Station_date = CreatDate;

var Station_DateType = 1;
var Eng_Name=[];
var Eng_Num=[];
var Power_Name=[];
var Power_Num=[];
var total=[];//功率目标数组
var day=[];//功率天数


var Eng_star_date=y+"-"+m+"-"+d+" 00:00:00";
var Eng_end_date=y+"-"+m+"-"+d+" 23:59:59";
var Prev_start_date=y8+"-"+m8+"-"+d8+" 00:00:00";
var Prev_end_date=y8+"-"+m8+"-"+d8+" 23:59:59";
var m_WaitTime = null;

var Eng_end_date2=y+"-"+m+"-"+d;

var mydate=date.getTime();

window.onload=function(){
    $(".cho_date1").val( y+"-"+m+"-"+d);
    // Get_menu();
    $(".menus>a:nth-child(1)").click();
    parent.AlamObj={};
};

$(".minus1").click(function(){
    var r=$(".cho_date1").val();
    var arr= r.split("-");
    if(arr.length==1){
        y=parseInt(arr[0]);
        y--;
        $(".cho_date1").val(y);
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
        $(".cho_date1").val(y+"-"+m);
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
        $(".cho_date1").val(y+"-"+m+"-"+d);
    }
});
$(".plus1").click(function(event){
    var r=$(".cho_date1").val();
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
            $(".cho_date1").val(y);
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
        $(".cho_date1").val(y+"-"+m);
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
        $(".cho_date1").val(y+"-"+m+"-"+d);
    }
});


var com;
//选取日月年
$(".choose_date a").click(function(e){
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
        $(".cho_date1").val(y);
        Eng_end_date=y+"-12-31 23:59:59";
        Station_date=y+"-00-00 00:00:00";
        DateType3=this.type;
        Eng_star_date=y+"-00-00 00:00:00";
        Prev_start_date=(y-1)+"-00-"+"00"+" 00:00:00";
        Prev_end_date=(y-1)+"-12-31 23:59:59";
    }else if($(this).attr("type")=="3"){
        if(date2<date3){
            $(".cho_date1").val(y+"-"+m);
            Station_date=y+"-"+m+"-00 00:00:00";
            Eng_end_date=y+"-"+m+"-31 23:59:59";
            Eng_star_date=y+"-"+m+"-00 00:00:00";
            var m25=m-1;
            if(m25<10){
                m25="0"+m25
            }else if(m25=="00"){
                m25=12;
                y--;
            }
            if(m25=="00"){
                Prev_end_date=(y-1)+"-"+"12-31"+" 23:59:59";
                Prev_start_date=(y-1)+"-"+"12-00"+" 00:00:00";
            }else{
                Prev_end_date=y+"-"+m25+"-31"+" 23:59:59";
                Prev_start_date=y+"-"+m25+"-00"+" 00:00:00";
            }
        }else{
         
            $(".cho_date1").val(yy+"-"+mm);
            Station_date=yy+"-"+mm+"-00 00:00:00";
            Eng_end_date=yy+"-"+mm+"-31 23:59:59";
            Eng_star_date=yy+"-"+mm+"-00 00:00:00"
            var mm25=mm-1;
            console.log(mm25)
            if(mm25<10) {
                mm25 = "0" + mm25
            } 
            if(mm25=="00"){
                mm25=12;
                yy--;
            }
            Prev_end_date=yy+"-"+mm25+"-31"+" 23:59:59";
            Prev_start_date=yy+"-"+mm25+"-00"+" 00:00:00";
        }
        DateType3=this.type;
    }else if($(this).attr("type")=="1"){
        if(isNaN(date4)){
            //console.log(com);
            $(".cho_date1").val(y+"-"+m+"-"+com);
            Station_date=y+"-"+m+"-"+com+" 00:00:00";
            Eng_end_date=y+"-"+m+"-"+com+" 23:59:59";
            Eng_star_date=y+"-"+m+"-"+com+" 00:00:00";
            Prev_end_date=Get_prev_ago(Eng_end_date,7);
            Prev_start_date=Get_prev_ago(Eng_star_date,7);
        }else{
            if(date4<=date5){
                $(".cho_date1").val(y+"-"+m+"-"+d);
                Station_date=y+"-"+m+"-"+d+" 00:00:00";
                Eng_end_date=y+"-"+m+"-"+d+" 23:59:59";
                Eng_star_date=y+"-"+m+"-"+d+" 00:00:00";
                com=d;
                Prev_end_date=Get_prev_ago(Eng_end_date,7);
                Prev_start_date=Get_prev_ago(Eng_star_date,7);
            }else{
                $(".cho_date1").val(yy+"-"+mm+"-"+dd);
                Station_date=yy+"-"+mm+"-"+dd+" 00:00:00";
                Eng_end_date=yy+"-"+mm+"-"+dd+" 23:59:59";
                Eng_star_date=yy+"-"+mm+"-"+dd+" 00:00:00";
                Prev_end_date=Get_prev_ago(Eng_end_date,7);
                Prev_start_date=Get_prev_ago(Eng_star_date,7);
            }
        }
        DateType3=this.type;
    }
    Station_DateType=this.type;
    var abt =$(".menus>a.active").attr("about");
    if(abt=="consumption"){//能源能耗
        Station_GetPowerItem();//获取能源分布
        main_GetElecInfo(1);//获取用电概览
    }else if(abt=="userItem"){//用户分项
        Station_GetEnyItem();//获取用电分布
        main_GetElecInfo(2);//获取用电概览
    }else{//回路用电
        load_all_mods();
    }
});

$(".plus1,.minus1").click(function(){
    var r=$(".cho_date1").val();
    var arr= r.split("-");
    if(arr.length==1){
        r=arr[0]+"-00-"+"00"+" 00:00:00";
        Eng_end_date=arr[0]+"-12-31 23:59:59";
        Eng_star_date=arr[0]+"-00-00 00:00:00";
        Prev_end_date=(arr[0]-1)+"-12-31 23:59:59";
        Prev_start_date=(arr[0]-1)+"-00-00 00:00:00";
    }
    if(arr.length==2){
        r=arr[0]+"-"+arr[1]+"-00"+" 00:00:00";
        Eng_end_date=arr[0]+"-"+arr[1]+"-31"+" 23:59:59";
        Eng_star_date=arr[0]+"-"+arr[1]+"-00"+" 00:00:00";

        var m25=m-1;
        if(m25<10){
            m25="0"+m25
        }
        if(m25=="00"){
            m25=12;
            y--;
        }
        if(m25=="00"){
            Prev_end_date=(arr[0]-1)+"-"+"12-31"+" 23:59:59";
            Prev_start_date=(arr[0]-1)+"-"+"12-00"+" 00:00:00";
        }else{
            Prev_end_date=arr[0]+"-"+m25+"-31"+" 23:59:59";
            Prev_start_date=arr[0]+"-"+m25+"-00"+" 00:00:00";
        }
    }
    if(arr.length==3){
        r=arr[0]+"-"+arr[1]+"-"+arr[2]+" 00:00:00";
        if(isNaN(d)){
            d=com;
            if(d<10){
                d="0"+d;
            }
        }
        Eng_end_date=arr[0]+"-"+arr[1]+"-"+arr[2]+" 23:59:59";
        Eng_star_date=arr[0]+"-"+arr[1]+"-"+arr[2]+" 00:00:00";
        Prev_end_date=Get_prev_ago(Eng_end_date,7);
        Prev_start_date=Get_prev_ago(Eng_star_date,7);
    }
    Station_date=r;

    first=true;
    // checkMenu();
    var abt =$(".menus>a.active").attr("about");
    if(abt=="consumption"){//能源能耗
        Station_GetPowerItem();//获取能源分布
        main_GetElecInfo(1);//获取用电概览
    }else if(abt=="userItem"){//用户分项
        Station_GetEnyItem();//获取用电分布
        main_GetElecInfo(2);//获取用电概览
    }else{//回路用电
        load_all_mods();
    }
});










var contentMenu;

//切换左边菜单导航栏
$("section .menus>a").click(function(){
    // var alt=$(".menus>a.active>img").attr("alt");
    // var oldSrc=$(".menus>a.active>img").attr("src");
    // $(".menus>a.active>img").attr("src",alt).attr("alt",oldSrc);

    // var alt2=$(this).children("img").attr("alt");
    // var oldSrc2=$(this).children("img").attr("src");
    // $(this).children("img").attr("src",alt2).attr("alt",oldSrc2);
    $(this).addClass("active").siblings("a").removeClass("active");
    var abt =$(this).attr("about");
    $("."+abt).show().siblings("div").hide();
    if(abt=="consumption"){//能源能耗
        Station_GetPowerItem();//获取能源分布
        main_GetElecInfo(1);//获取用电概览
    }else if(abt=="userItem"){//用户分项
        Station_GetEnyItem();//获取用电分布
        main_GetElecInfo(2);//获取用电概览
    }else{//回路用电
        load_all_mods();
    }
    if(DateType3==1){
        $(".choose_date>a:nth-child(1)").addClass("active").siblings("a").removeClass("active");
    }else if(DateType3==3){
        $(".choose_date>a:nth-child(2)").addClass("active").siblings("a").removeClass("active");
    }else if(DateType3==4){
        $(".choose_date>a:nth-child(3)").addClass("active").siblings("a").removeClass("active");
    }
   
})

//站点回路能耗排行
function load_all_mods(){
    var arr = Prev_start_date.split(" ");
    var arr2= Station_date.split(" ");
    console.log(Prev_start_date)
    console.log(Eng_end_date)
    var time1,time2;//上期时间，本期时间
    time1=arr[0];
    if(DateType3==1){
        time2=arr[0];
    }else if(DateType3==3){
        console.log(time1);
        var mon=time1.split("-");
        time2=mon[0]+"-"+(mon[1])+"-"+"00";
    }else if(DateType3==4){
        var mon=time1.split("-");
        time2=(mon[0])+"-00-00";
    }
    var ob = new Object();
    // ob.stationId = parent.g_strSelStnId;//所有(可为空)/集团/项目/站点
    ob.preDate = time2;//上期时间
    ob.curDate = arr2[0];//本期时间
    ob.timeType = parseInt(DateType3);//时间类型
    ob.userData = 0;
    var json = JSON.stringify(ob);
    console.log(json);
    parent.ccc_lib_reqDataByCmd("",USER_ELEC_ENERGY_RANK_LIST,json,show_StnModEnergyList);//站点模块能耗排行
}
var modalData;
function show_StnModEnergyList(id,info,des){
    console.log(des);
    $(".ranking>ul>li").remove();
    if(des.result==0 && des.data.length>0){
        
        var arr = des.data;
        for(var i=0;i<arr.length;i++){
            arr[i].total=(arr[i].level+arr[i].peak+arr[i].valley);
        }
        //传入ab参数
        function object(a,b) {
            return b.total-a.total;
        }
        arr.sort(object);
        console.log(arr);
       
        $(".modalTotal>p:nth-child(2)>b").html((des.cur).toFixed(2));
        loadSingModal(arr[0].com,arr[0].addr,arr[0].name);
        var nums=[];
        var names=[];
        for(var i=0;i<arr.length;i++){
            var percent=((arr[i].total)/des.cur*100).toFixed(2);
            $(".ranking>ul").append('<li><div><span>No.'+(i+1)+'</span><b>'+arr[i].name+'</b><u>'+percent+"%"+'</u></div><progress value="'+percent+'" max="100"></progress></li>');
            if(i<=9){
                nums.push((arr[i].total).toFixed(1));
                names.push(arr[i].name);
            }
        }
        var temp2,percent2,cl2;
        if(des.cur==0 && des.pre!=0){
            temp2="↓ ";
            percent2=temp2+"100%";
            $(".distribution .powerItemFPG>div:nth-child(1)>p>s").css("color","#adff2f");
        }else if(des.cur!=0 && des.pre==0){
            temp2="↑ ";
            percent2=temp2+"100%";
            $(".distribution .powerItemFPG>div:nth-child(1)>p>s").css("color","red");
        }else if(des.cur==0 && des.pre==0){
            percent2="--";
            cl2 = "green";
        }else if(parseFloat(des.cur)>parseFloat(des.pre)){
            temp2="↑ ";
            percent2= temp2+((des.cur-des.pre)/des.pre*100).toFixed(1)+"%";
            cl2="red";
        }else if(parseFloat(des.cur)<parseFloat(des.pre)){
            temp2="↓ ";
            percent2= temp2+((des.pre-des.cur)/des.pre*100).toFixed(1)+"%";
            cl2="green";
        }else{
            percent2="- -";
            cl2="white";
        }
        $(".modalTotal>p:nth-child(3)>span").html(percent2).attr("class",cl2);
        modalData=arr;
        // names= ['设备1','设备21','设备31','设备41'];
        loadDevPie(names,nums);
        // $(".ranking").niceScroll();
    }else{
        // $(".ranking>ul").append('<li><div><span>No.1</span><b>无数据</b><u>0%</u></div><progress value="0" max="100"></progress></li>');
         names=["无数据"];
         nums=["0"];
         $(".modalTotal>p:nth-child(2)>b").html(0);
        loadDevPie(names,nums);
        $(".modalTotal>p:nth-child(3)>span").html("↓"+0).attr("class","green");
        SingleModalTimes=[];
        SingleModalCur=[];
        SingleModalPre=[];
        loadModalLines();
        $(".modalBack>b").html("本期上期用电比");

    }

}





//中间的用户分项能耗饼图
function load_pie5(Eng_Name,Eng_Num){
    var Eng_total=[];
    for(var i=0;i<Eng_Name.length;i++){
        Eng_total[i]={value:Eng_Num[i],name:Eng_Name[i]};
    }
    var myChart=echarts.init(document.getElementById("pie5"));
    var option = {
        title:{
            text:"能耗",
            x:"42%",
            y:"35%",
            fontSize:"10",
            textStyle:{
                color:"#ffffff"
            }
        },
        color:[
            "#52FFFF","#FFAE00","#28B1FF","#52FF97","#F53F8C","#fa5aa2"
        ],
        tooltip : {
            trigger: 'item',
            formatter: "{b} : {c}   {a} "
            //formatter: function (obj) {
            //    return obj.seriesName+'\r'+obj.name + '\n' + obj.percent.toFixed(0) + '%'
            //
            //}
        },
        legend: {
            orient : 'horizontal',
            x : '5px',
            y:'80%',
            data:Eng_Name,
            textStyle:{
                color:'#ffffff'
            },
        },
        series : [
            {
                name:'kWh',
                type:'pie',
                radius : ['40%', '55%'],
                center:["50%","40%"],
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                data:Eng_total,
                label:{
                    normal:{
                        show:true,
                        position:'outside',
                        textStyle:{
                            // color:'#fff',
                            fontSize:12
                        },
                        formatter: function (obj) {
                            return obj.percent.toFixed(1) + '%'
                        }
                    },
                 
                },
            }
        ]
    };
    myChart.setOption(option);
    // 处理点击事件并且跳转到相应的百度搜索页面
    myChart.on('click', function (params) {
        var id = Eng_Id[params.dataIndex];
        CalcPercent(id);
    });
};
//中间的能源饼图
function load_pie6(Power_Name,Power_Num){
    var Eng_total=[];
    for(var i=0;i<Power_Name.length;i++){
        Eng_total[i]={value:Power_Num[i],name:Power_Name[i]};
    }
    var myChart=echarts.init(document.getElementById("pie6"));
    var option = {
        title:{
            text:"能源",
            x:"42%",
            y:"35%",
            fontSize:"10",
            textStyle:{
                color:"#ffffff"
            }
        },
        color:[
            "#7a58a8","#ffae00","#28b1ff","#6a4bfe","#19aaf2","#fa5aa2"
        ],
        tooltip : {
            trigger: 'item',
            formatter: "{b} : {c}   {a} "
            //formatter: function (obj) {
            //    return obj.seriesName+'\r'+obj.name + '\n' + obj.percent.toFixed(0) + '%'
            //
            //}
        },
        legend: {
            orient : 'horizontal',
            x : '5px',
            y:'80%',
            data:Power_Name,
            textStyle:{
                color:'#ffffff'
            },
            show:true
        },
        series : [
            {
                name:'kWh',
                type:'pie',
                radius : ['40%', '55%'],
                center:["50%","40%"],
                data:Eng_total,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label:{
                    normal:{
                        show:true,
                        position:'outside',
                        textStyle:{
                            color:'#fff',
                            fontSize:12
                        },
                        formatter: function (obj) {
                            return obj.percent.toFixed(1) + '%'
                        }
                    },
                    labelLine: {
                        lineStyle: {
                            color: 'white'
                        }
                    },
                },
            }
        ]
    };
    myChart.setOption(option);
    // 处理点击事件并且跳转到相应的百度搜索页面
    myChart.on('click', function (params) {
        var id = Power_Id[params.dataIndex];
        CalcPercent2(id);
    });
};

//回路用电饼图
function loadDevPie(names,nums){
    var Eng_total=[];
   
    // console.log(colors)
    for(var i=0;i<names.length;i++){
        Eng_total[i]={value:nums[i],name:names[i]};
    }
    var myChart=echarts.init(document.getElementById("allDevCicle")); 
    var option = {
        title:{
            x:"45%",
            y:"30%",
            fontSize:"10",
            textStyle:{
                color:"#ffffff"
            }
        },
        color:['#02c4fa', '#ffc920', '#2058fe', '#ff8700', '#03f9d1', '#f63f2c', '#5bd438', '#5be8e7', '#583cd3'],
        tooltip : {
            trigger: 'item',
            formatter: "{b} : {c}   {a} "
            //formatter: function (obj) {
            //    return obj.seriesName+'\r'+obj.name + '\n' + obj.percent.toFixed(0) + '%'
            //
            //}
        },
        legend: {
            show:true,
            orient : 'vertical',
            x : '10px',
            y:'5%',
            data:names,
            textStyle:{
                color:'#ffffff'
            },
        },
        series : [
            {
                name:'Kwh',
                type:'pie',
                radius : '90%',
                center:["70%","50%"],
                data:Eng_total,
                label:{
                    normal:{
                        show:true,
                        position:'inside',
                        textStyle:{
                            fontSize:12
                        },
                        formatter: function (obj) {
                            // console.log(obj);
                            return obj.percent+"%"
                        }
                    },
                    labelLine: {
                        lineStyle: {
                            color: 'white'
                        }
                    },
                },
            }
        ]
    };
    myChart.setOption(option);
    myChart.on('click', function (params) {
        var com = modalData[params.dataIndex].com;
        var addr = modalData[params.dataIndex].addr;
        var name = modalData[params.dataIndex].name;
        loadSingModal(com,addr,name);
    });

};
//点击饼图加载单个模块用电对比图
function loadSingModal(com,addr,name){
    $(".modalBack>b").html(name+"本期上期用电比");
    var ob = new Object();
    ob.com = parseInt(com);
    ob.addr = parseInt(addr);
    ob.startTime = Eng_star_date;
    ob.endTime = Eng_end_date;
    ob.timeType = parseInt(DateType3);//时间类型
    ob.userData = 0;
    var json = JSON.stringify(ob);
    console.log(json);
    parent.ccc_lib_reqDataByCmd("",USER_ELEC_SECTION_ENERGY_LIST_V25,json,ShowSingleModal);
  
    var ob2 = new Object();
    ob2.com = parseInt(com);
    ob2.addr = parseInt(addr);
    ob2.startTime = Prev_start_date;
    ob2.endTime = Prev_end_date;
    ob2.timeType = parseInt(DateType3);//时间类型
    ob2.userData = 0;
    var json2 = JSON.stringify(ob2);
    console.log(json2);
    parent.ccc_lib_reqDataByCmd("",USER_ELEC_SECTION_ENERGY_LIST_V25,json2,ShowSingleModalPrev);
}
var SingleModalPre,SingleModalCur,SingleModalTimes;
function ShowSingleModal(id,info,des){
    console.log(des);
    SingleModalTimes=[];
    SingleModalCur=[];
    for(var i=0;i<des.data.length;i++){
        //timedata.push(des.data[i].date)
        var Modaltimes=des.data[i].date;
        var myTime=Modaltimes.replace(/-/g,"/");
        for(var k=0;k<des.data[i].energy.length;k++){
              
                var temp2;
                var oTime;
                if(DateType3 == 1){
                    if(k<9){temp2="0"+(k+1)}else{temp2=(k+1)}
                    SingleModalTimes.push(Modaltimes+" "+temp2+":00:00");
                    var TTime=Modaltimes.replace(/-/g,",");
                    var arr=TTime.split(",");
                    var date=new Date();
                    var time=date.getTime();
                    oTime=new Date(arr[0],(arr[1]-1),arr[2],(temp2-1),"00","00");
                    oTime=oTime.getTime();
                    //console.log(oTime);
                }else  if(DateType3 == 3){
                    if(k<9){temp2="0"+(k+1)}else{temp2=(k+1)}
                    var strTime=(Modaltimes).substring(0,7);
                    var thisTime=myTime.substring(0,7);
                    SingleModalTimes.push(strTime+"-"+temp2);
                    var date=new Date();
                    var time=date.getTime();
                    oTime=new Date(thisTime+"/"+temp2);
                    oTime=oTime.getTime();
                }
                else if(DateType3==4){
                    if(k<9){temp2="0"+(k+1)}else{temp2=(k+1)}
                    var strTime=(Modaltimes).substring(0,4);
                    var thisTime=myTime.substring(0,4);
                    SingleModalTimes.push(strTime+"-"+temp2);
                    var date=new Date();
                    var time=date.getTime();
                    oTime=new Date(thisTime+"/"+temp2+"/01");
                    oTime=oTime.getTime();
                }
                //console.log(time - oTime)
                if((time-1800000)>oTime)
                {
                    SingleModalCur.push(((des.data[i].energy[k].peak+des.data[i].energy[k].level+des.data[i].energy[k].valley)).toFixed(1));
                }
            
            }
        
    }
    console.log(SingleModalCur)
    console.log(SingleModalTimes)
    
}
function ShowSingleModalPrev(id,info,des){
    console.log(des);
    SingleModalPre=[];
    for(var i=0;i<des.data.length;i++){
        for(var k=0;k<des.data[i].energy.length;k++){
            SingleModalPre.push(((des.data[i].energy[k].peak+des.data[i].energy[k].level+des.data[i].energy[k].valley)).toFixed(1));
        }
    }
    loadModalLines();
    
}
//加载模块本期上期用电
function loadModalLines(){
    var timedata = SingleModalTimes;
    var data = SingleModalCur;
    var data8 = SingleModalPre;
    var myChart = echarts.init(document.getElementById("modalLines"));
    // $("#"+id+">span").remove();
    // $("#"+id+">span").append("<span style='float:right;color:white;position:absolute;left:70%;top:0;font-size:12px'>max："+max+" min："+min+"</span>");
    var option3={
        title:{
            x:"center",
            y:"0%",
            textStyle:{
                color:'#ffffff',
                fontSize:15
            }
        },
        color:[
            "#db3c83","#60eaf1"
        ],
        tooltip:{
            show: true,
            trigger:"axis",
            //formatter: "{a}",
            //formatter:function (params){
            //    return params[0].name+'<br>'+params[0].seriesName+':'+params[0].value+'(m^3/s)<br>';
            //},
            axisPointer:{
                animation: false
            }
        },
        grid:{
            left:"60px",
            right:"40px",
            bottom:"40px",
            top:"35px"
        },
        legend:{
            data:["本期用电","上期用电"],
            textStyle:{
                color:'#ffffff'
            },
            y:'1%',
            x:"right",
            type:"scroll",
            icon:'stack',
            orient:"horizontal"
            //x: 'left'
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
                //interval:"auto",
                splitNumber:10,
                data : timedata,
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
                        color:'#add8e6'
                    }
                },
            }

        ],
        yAxis:[
            {
                name:"用电分析(kWh)",
                type : 'value',
                //min:0.01
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
                name:"本期用电",
                type:'line',
                smooth:false,
                //itemStyle: {normal: {areaStyle: {type: 'default'}}},
                symbolSize: 8,
                hoverAnimation: true,
                data:data,
                label: {
                    normal: {
                        show: true,
                        position: 'top'//值显示
                    }
                },
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ],
                    symbol:"pin",
                    symbolSize:40,
                    symbolRotate:180,
                },
            },
            {
                name:"上期用电",
                type:'line',
                smooth:false,
                //itemStyle: {normal: {areaStyle: {type: 'default'}}},
                lineStyle:{normal:{type:"dotted"}},
                symbolSize: 8,
                hoverAnimation: true,
                data:data8,
                label: {
                    normal: {
                        show: true,
                        position: 'bottom'//值显示
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
            }
        ]
    };
    myChart.clear();
    myChart.setOption(option3);
};
//加载用电概述数据
function main_GetElecInfo(type){
    var ob = new Object();
    // ob.stationId = id;//集团、项目、站点ID
    ob.time = Station_date;//时间
    ob.item = parseInt(type);
    ob.type = parseInt(Station_DateType);//时间类型
    ob.node = 3;//集团,项目,站点类型1 2 3
    ob.userData = parseInt(type);
    var json = JSON.stringify(ob);
    console.log(json);
    parent.ccc_lib_reqDataByCmd("",USER_STATION_ABSTRACT_V25,json,ShowStnEnergy);
}
//显示用电概述
function ShowStnEnergy(id,info,des){
    console.log(des);
    if(des.result == 0) {
        des.curTotal=(des.curTotal).toFixed(1);
        des.curCarn=(des.curCarn).toFixed(1);
        des.preTotal=(des.preTotal).toFixed(1);
        des.preCarn=(des.preCarn).toFixed(1);
        var arr=(des.curTotal).split("");
        while(arr.length<11){
            arr.unshift("0");
        }
        console.log(arr);
        $(".total>li:nth-child(2)>p:nth-child(2)>span").html(0);
       
        // var arr2=(des.curCost).split("");
        // while(arr2.length<8){
        //     arr2.unshift("0");
        // }
        // $(".total>li:nth-child(2)>p:nth-child(2)").html("");
        // for(var i=0;i<arr2.length;i++){
        //     $(".total>li:nth-child(2)>p:nth-child(2)").append('<span>'+arr2[i]+'</span>');
        // }

        var arr3=(des.curCarn).split("");
        while(arr3.length<8){
            arr3.unshift("0");
        }
       

        var temp,temp2,temp3;
        var percent,percent2,percent3;
        var cl1,cl2,cl3;
        if(parseFloat(des.curTotal) > parseFloat(des.preTotal)){
            temp="↑ ";
            percent= temp+((des.curTotal-des.preTotal)/des.preTotal*100).toFixed(1)+"%";
            cl1="red";
        }else if(parseFloat(des.curTotal) < parseFloat(des.preTotal)){
            temp="↓ ";
            percent= temp+((des.preTotal-des.curTotal)/des.preTotal*100).toFixed(1)+"%";
            cl1="green";
        }else{
            percent="- -";
            cl1="white";
        }

        // if(parseFloat(des.curCost)>parseFloat(des.preCost)){
        //     temp2="↑ ";
        //     percent2= temp2+((des.curCost-des.preCost)/des.preCost*100).toFixed(1)+"%";
        //     cl2="red";
        // }else if(parseFloat(des.curCost)<parseFloat(des.preCost)){
        //     temp2="↓ ";
        //     percent2= temp2+((des.preCost-des.curCost)/des.preCost*100).toFixed(1)+"%";
        //     cl2="green";
        // }else{
        //     percent2="- -";
        //     cl2="white";
        // }

        if(parseFloat(des.curCarn)>parseFloat(des.preCarn)){
            temp3="↑ ";
            percent3= temp3+((des.curCarn-des.preCarn)/des.preCarn*100).toFixed(1)+"%";
            cl3="red";
        }else if(parseFloat(des.curCarn)<parseFloat(des.preCarn)){
            temp3="↓ ";
            percent3= temp3+((des.preCarn-des.curCarn)/des.preCarn*100).toFixed(1)+"%";
            cl3="green";
        }else{
            percent3="- -";
            cl3="white";
        }
        if(des.userData==1){
            for(var i=0;i<arr.length;i++){
                $(".consumption .total>li:nth-child(2)>p:nth-child(2)>span:nth-child("+(i+1)+")").html(arr[i]);
            }
            for(var i=0;i<arr3.length;i++){
                $(".consumption .total>li:nth-child(3)>p:nth-child(2)>span:nth-child("+(i+1)+")").html(arr3[i]);
            }
            $(".consumption .total>li:nth-child(2)>p:nth-child(1)>b").html(percent).attr("class",cl1);
            $(".consumption .total>li:nth-child(3)>p:nth-child(1)>b").html(percent3).attr("class",cl3);
        }else if(des.userData==2){
            for(var i=0;i<arr.length;i++){
                $(".userItem .total>li:nth-child(2)>p:nth-child(2)>span:nth-child("+(i+1)+")").html(arr[i]);
            }
            $(".userItem .total>li:nth-child(3)>p:nth-child(2)").html("");
            for(var i=0;i<arr3.length;i++){
                $(".userItem .total>li:nth-child(3)>p:nth-child(2)").append('<span>'+arr3[i]+'</span>');
            }
            $(".userItem .total>li:nth-child(2)>p:nth-child(1)>b").html(percent).attr("class",cl1);
            $(".userItem .total>li:nth-child(3)>p:nth-child(1)>b").html(percent3).attr("class",cl3);
        }
     
        $(".total>li b").each(function(){
            var str=$(this).html();
            str=str.replace(/Infinity/,"100");
            str=str.replace(/NaN/,"0");
            $(this).html(str);
        })

    }else{
        $(".total>li>p>span").html(0);
    }
};

//加载用户分项能耗
function Station_GetEnyItem(){
    var arr = Prev_end_date.split(" ");
    var arr2= Station_date.split(" ");
    var time1,time2;//上期时间，本期时间
    time1=arr[0];
    if(Station_DateType==1){
        time2=arr[0];
    }else if(Station_DateType==3){
        var mon=time1.split("-");
        time2=mon[0]+"-"+(mon[1])+"-"+"00";
    }else if(Station_DateType==4){
        var mon=time1.split("-");
        time2=(mon[0])+"-00-00";
    }

    var ob = new Object();
    ob.stationId = parent.g_strSelStnId;//集团、项目、站点ID
    ob.preDate= time2;
    ob.curDate= arr2[0];
    ob.timeType = parseInt(Station_DateType);//1,3,4分别表示日、月、年；
    ob.itemType = 1;//1,2分别表示用户分项，设备分项；
    ob.other = 6;
    ob.userData = 2;
    var json = JSON.stringify(ob);
    console.log(json);
    parent.ccc_lib_reqDataByCmd("",USER_STATION_ITEM_CAKE_V25,json,Station_OutItemEny);//加载能耗分项
}
var ItemId;
//显示用户分项能耗
function Station_OutItemEny(id,info,des){
    console.log(des);
    if(des.result==0 && des.curData.length>0){
        ItemId=des.curData[0].itemId;
        Eng_Name=[];
        Eng_Num=[];
        Eng_Id=[];
        ItemDate=des.curDate;
        CurItemsEnergy=des.curData;
        PrevItemsEnergy=des.preData;
        var curTotal=(des.totalCurL+des.totalCurP+des.totalCurV).toFixed(1);
        var preTotal=(des.totalPreL+des.totalPreP+des.totalPreV).toFixed(1);
        $(".stations .dataview .energyName .energyTotol>b").html(curTotal);
        console.log(curTotal)
        console.log(preTotal)
        //计算总能耗
        var itemAllstr,itemAllper,itemAllClass;
        if(curTotal==0 && preTotal!=0){
            itemAllstr="↓";
            itemAllper="100%";
            itemAllClass="green";
        }else if(curTotal!=0 && preTotal==0){
            itemAllstr="↑";
            itemAllper="100%";
            itemAllClass="red";
        }else if(curTotal==0 && preTotal==0){
            itemAllstr="-";
            itemAllper="-";
        }else if(curTotal!=0 && preTotal!=0){
            console.log(parseFloat(curTotal) > parseFloat(preTotal));
            if(parseFloat(curTotal)>parseFloat(preTotal)){//本期大于上期
                itemAllstr="↑";
                itemAllper=((curTotal-preTotal)/preTotal*100).toFixed(1)+"%";
                itemAllClass="red";
            }else if(parseFloat(curTotal)<parseFloat(preTotal)){//本期小于上期
                itemAllstr="↓";
                itemAllper=((preTotal-curTotal)/preTotal*100).toFixed(1)+"%";
                itemAllClass="green";
            }else{//本期等于上期
                itemAllstr="-";
                itemAllper="-";
                itemAllClass="white";
            }
        }
        $(".stations .energyName .energyTotol>s").html(itemAllstr+itemAllper).attr("class",itemAllClass);

        var itemF=des.totalCurP;
        var PrevitemF=des.totalPreP;
        var itemFstr,itemFper,itemFClass;
        //计算峰
        if(itemF==0 && PrevitemF!=0){
            itemFstr="↓";
            itemFper="100%";
            itemFClass="green";
        }else if(itemF!=0 && PrevitemF==0){
            itemFstr="↑";
            itemFper="100%";
            itemFClass="red";
        }else if(itemF==0 && PrevitemF==0){
            itemFstr="-";
            itemFper="-";
        }else if(itemF!=0 && PrevitemF!=0){
            if(parseFloat(itemF)>parseFloat(PrevitemF)){//本期大于上期
                itemFstr="↑";
                itemFper=((itemF-PrevitemF)/PrevitemF*100).toFixed(1)+"%";
                itemFClass="red";
            }else if(parseFloat(itemF)<parseFloat(PrevitemF)){//本期小于上期
                itemFstr="↓";
                itemFper=((PrevitemF-itemF)/PrevitemF*100).toFixed(1)+"%";
                itemFClass="green";
            }else{//本期等于上期
                itemFstr="-";
                itemFper="-";
                itemFClass="white";
            }
        }
        $(".stations .energyTotolFPG>div:nth-child(1)>p>s").html(itemFstr+itemFper).attr("class",itemFClass);
        $(".stations .energyTotolFPG>div:nth-child(1)>p>b").html(itemF.toFixed(1));

        var itemP=des.totalCurL;
        var PrevitemP=des.totalPreL;
        var itemPstr,itemPper,itemPClass;
        //计算平
        if(itemP==0 && PrevitemP!=0){
            itemPstr="↓";
            itemPper="100%";
            itemPClass="green";
        }else if(itemP!=0 && PrevitemP==0){
            itemPstr="↑";
            itemPper="100%";
            itemPClass="red";
        }else if(itemP==0 && PrevitemP==0){
            itemPstr="-";
            itemPper="-";
        }else if(itemP!=0 && PrevitemP!=0){
            if(parseFloat(itemP)>parseFloat(PrevitemP)){//本期大于上期
                itemPstr="↑";
                itemPper=((itemP-PrevitemP)/PrevitemP*100).toFixed(1)+"%";
                itemPClass="red";
            }else if(parseFloat(itemP)<parseFloat(PrevitemP)){//本期小于上期
                itemPstr="↓";
                itemPper=((PrevitemP-itemP)/PrevitemP*100).toFixed(1)+"%";
                itemPClass="green";
            }else{//本期等于上期
                itemPstr="-";
                itemPper="-";
                itemPClass="white";
            }
        }
        $(".stations .energyTotolFPG>div:nth-child(2)>p>s").html(itemPstr+itemPper).attr("class",itemPClass);
        $(".stations .energyTotolFPG>div:nth-child(2)>p>b").html(itemP.toFixed(1));

        var itemG=des.totalCurV;
        var PrevitemG=des.totalPreV;
        var itemGstr,itemGper,itemGClass;
        //计算谷
        if(itemG==0 && PrevitemG!=0){
            itemGstr="↓";
            itemGper="100%";
            itemGClass="green";
        }else if(itemG!=0 && PrevitemG==0){
            itemGstr="↑";
            itemGper="100%";
            itemGClass="red";
        }else if(itemG==0 && PrevitemG==0){
            itemGstr="-";
            itemGper="-";
        }else if(itemG!=0 && PrevitemG!=0){
            if(parseFloat(itemG)>parseFloat(PrevitemG)){//本期大于上期
                itemGstr="↑";
                itemGper=((itemG-PrevitemG)/PrevitemG*100).toFixed(1)+"%";
                itemGClass="red";
            }else if(parseFloat(itemG)<parseFloat(PrevitemG)){//本期小于上期
                itemGstr="↓";
                itemGper=((PrevitemG-itemG)/PrevitemG*100).toFixed(1)+"%";
                itemGClass="green";
            }else{//本期等于上期
                itemGstr="-";
                itemGper="-";
                itemGClass="white";
            }
        }
        $(".stations .energyTotolFPG>div:nth-child(3)>p>s").html(itemGstr+itemGper).attr("class",itemGClass);
        $(".stations .energyTotolFPG>div:nth-child(3)>p>b").html(itemG.toFixed(1));

        var myArr=[(itemF).toFixed(1),(itemP).toFixed(1),(itemG).toFixed(1)];
        var max=Math.max.apply(null,myArr);
        var per1=((itemF).toFixed(1))/max*40+"%";
        var per2=((itemP).toFixed(1))/max*40+"%";
        var per3=((itemG).toFixed(1))/max*40+"%";

        $(".stations .energyTotolFPG>div:nth-child(1)>p>span").css("width",per1);
        $(".stations .energyTotolFPG>div:nth-child(2)>p>span").css("width",per2);
        $(".stations .energyTotolFPG>div:nth-child(3)>p>span").css("width",per3);
        var allData=[];
        if(CurItemsEnergy.length > 0){
            for(var i=0;i<CurItemsEnergy.length;i++){
                var allTime=[];
                for(var k=0;k<CurItemsEnergy[i].data.length;k++){
                        var myTime=ItemDate.replace(/-/g,"/");
                        var temp2;
                        var oTime;
                        if(Station_DateType == 1){
                            if(k<9){temp2="0"+(k+1)}else{temp2=(k+1)}
                            // allTime.push(ItemDate+" "+temp2+":00:00");
                            allTime.push(temp2+"时");
                            var TTime=ItemDate.replace(/-/g,",");
                            var arr=TTime.split(",");
                            var date=new Date();
                            var time=date.getTime();
                            oTime=new Date(arr[0],(arr[1]-1),arr[2],(temp2-1),"00","00");
                            oTime=oTime.getTime();
                            //console.log(oTime);
                        }else  if(Station_DateType == 3){
                            if(k<9){temp2="0"+(k+1)}else{temp2=(k+1)}
                            var strTime=(ItemDate).substring(0,7);
                            var thisTime=myTime.substring(0,7);
                            allTime.push(strTime+"-"+temp2);
                            var date=new Date();
                            var time=date.getTime();
                            oTime=new Date(thisTime+"/"+temp2);
                            oTime=oTime.getTime();
                        }else if(Station_DateType==4){
                            if(k<9){temp2="0"+(k+1)}else{temp2=(k+1)}
                            var strTime=(ItemDate).substring(0,4);
                            var thisTime=myTime.substring(0,4);
                            allTime.push(strTime+"-"+temp2);
                            var date=new Date();
                            var time=date.getTime();
                            oTime=new Date(thisTime+"/"+temp2+"/01");
                            oTime=oTime.getTime();
                        }
                        //console.log(time - oTime)
                        if((time-1800000)>oTime){
                            if(!allData[k]){
                                allData.push(((CurItemsEnergy[i].data[k].peak+CurItemsEnergy[i].data[k].level+CurItemsEnergy[i].data[k].valley)).toFixed(1));
                            }else{
                                var news = (CurItemsEnergy[i].data[k].peak+CurItemsEnergy[i].data[k].level+CurItemsEnergy[i].data[k].valley).toFixed(1);
                                var old = allData[k];
                                allData[k]=(parseFloat(news)+parseFloat(old)).toFixed(1);
                            }
                        }
                }
            }
            var data8=[];
            if(PrevItemsEnergy.length> 0){
                    for(var i=0;i<PrevItemsEnergy.length;i++){
                        for(var k=0;k<PrevItemsEnergy[i].data.length;k++){
                            if(k<=CurItemsEnergy[0].data.length){
                                if(!data8[k]){
                                    data8.push(((PrevItemsEnergy[i].data[k].peak+PrevItemsEnergy[i].data[k].level+PrevItemsEnergy[i].data[k].valley)).toFixed(1));
                                }else{
                                    var news = (PrevItemsEnergy[i].data[k].peak+PrevItemsEnergy[i].data[k].level+PrevItemsEnergy[i].data[k].valley).toFixed(1);
                                    var old = data8[k];
                                    data8[k]=(parseFloat(news)+parseFloat(old)).toFixed(1);
                                }
                            }
                        }
                    }
            }else{
                data8=[];
            }

        }else{
            allTime=[];
            allData=[];
            data8=[];
        }
    }else{
        Eng_Name=["无数据"];
        Eng_Num=["0"];
        CurItemsEnergy=[];
        PrevItemsEnergy=[];
        ItemId="";
        $(".stations .energyName>div>ul>li:nth-child(2)>div>p>span").css("width","50%");
        $(".stations .energyName>div>ul>li:nth-child(2)>div>p>b").html("0");
    
        $(".stations .dataview .energyName .energyTotol>b").html(0);
        $(".stations .dataview .energyName .energyTotol>s").html("- -").attr("class","white");

        $(".stations .dataview .energyName .energyItem>b").html(0);
        $(".stations .dataview .energyName .energyItem>s").html("- -").attr("class","white");

        $(".stations .energyItemName>span").html("分项能耗：");
        $(".stations .energyItemName>s").html("- -").attr("class","white");
        $(".energyTotolFPG>div>p>s").html("- -").attr("class","white");
        $(".energyItemFPG>div>p>s").html("- -").attr("class","white");
        $(".energyItemName>b").html("0");
        
        allTime=[];
        allData=[];
        data8=[];
    }
    lineTitle="分项";
    timedata=[];
    data=[];
    data8=[];
    // load_line("elePrediction",lineTitle,timedata,data,data8);
    load_bar('elePrediction',"分项名称",timedata,data,data8);

    load_lineAll("totlLineEnergy",allTime,allData,data8);
    CalcPercent(ItemId);
    load_pie5(Eng_Name,Eng_Num);
    // load_pie1(1);

}

function CalcPercent(id){//计算本期上期峰平谷能耗以及对比
    if(!id){
        lineTitle="分项";
        timedata=[];
        data=[];
        data8=[];
        // load_line("elePrediction",lineTitle,timedata,data,data8);
        load_bar('elePrediction',"分项名称",timedata,data,data8);
        return false;
    }
    var PrevId=[];
    var itemF=0,itemP=0,itemG= 0;
    for(var i=0;i<CurItemsEnergy.length;i++){
        if(CurItemsEnergy[i].itemId==0){
            CurItemsEnergy[i].itemId=9999;
        }
        var itemAll=0;
        for(var k=0;k<CurItemsEnergy[i].data.length;k++){
            itemAll+=parseFloat((CurItemsEnergy[i].data[k].peak+CurItemsEnergy[i].data[k].level+CurItemsEnergy[i].data[k].valley));
        }

        Eng_Name.push(CurItemsEnergy[i].name);
        Eng_Num.push(itemAll.toFixed(1));
        Eng_Id.push(CurItemsEnergy[i].itemId);
        if(id==CurItemsEnergy[i].itemId){//获取本期峰平谷总能耗
            var lineTitle=CurItemsEnergy[i].name;
            $(".stations .energyItemName>span").html(lineTitle+"：");
            for(var m=0;m<CurItemsEnergy[i].data.length;m++){
            itemF+=parseFloat(CurItemsEnergy[i].data[m].peak);
            itemP+=parseFloat(CurItemsEnergy[i].data[m].level);
            itemG+=parseFloat(CurItemsEnergy[i].data[m].valley);
            }
        }
    }
    var myArr=[(itemF).toFixed(1),(itemP).toFixed(1),(itemG).toFixed(1)];
    var max=Math.max.apply(null,myArr);
    var per1=((itemF).toFixed(1))/max*40+"%";
    var per2=((itemP).toFixed(1))/max*40+"%";
    var per3=((itemG).toFixed(1))/max*40+"%";
    var allItem=parseFloat(itemF+itemP+itemG);
    console.log(allItem)

    $(".stations .energyItemName>b").html(allItem.toFixed(1));
    $(".stations .energyItemFPG>div:nth-child(1)>p>b").html(itemF.toFixed(1));
    $(".stations .energyItemFPG>div:nth-child(2)>p>b").html(itemP.toFixed(1));
    $(".stations .energyItemFPG>div:nth-child(3)>p>b").html(itemG.toFixed(1));
    $(".stations .energyItemFPG>div:nth-child(1)>p>span").css("width",per1);
    $(".stations .energyItemFPG>div:nth-child(2)>p>span").css("width",per2);
    $(".stations .energyItemFPG>div:nth-child(3)>p>span").css("width",per3);


    for(var i=0;i<PrevItemsEnergy.length;i++){
        if(PrevItemsEnergy[i].itemId==0){
            PrevItemsEnergy[i].id=9999;
        }
        PrevId.push(PrevItemsEnergy[i].itemId);
    }

    var PrevitemF=0,PrevitemP=0,PrevitemG=0,itemFstr,itemPstr,itemGstr,itemFper,itemPper,itemGper;
    console.log(PrevId+","+id);
    if(PrevId.indexOf(id)!=-1){//如果上期有本期的分项
        for(var i=0;i<PrevItemsEnergy.length;i++) {
            if(id==PrevItemsEnergy[i].itemId){
                for(var m=0;m<PrevItemsEnergy[i].data.length;m++){
                PrevitemF+=parseFloat(PrevItemsEnergy[i].data[m].peak);
                PrevitemP+=parseFloat(PrevItemsEnergy[i].data[m].level);
                PrevitemG+=parseFloat(PrevItemsEnergy[i].data[m].valley);
                }
            }
        }

        //计算峰
        if(itemF==0 && PrevitemF!=0){
            itemFstr="↓";
            itemFper="100%";
            $(".stations .energyItemFPG>div:nth-child(1)>p>s").attr("class","green");
        }else if(itemF!=0 && PrevitemF==0){
            itemFstr="↑";
            itemFper="100%";
            $(".stations .energyItemFPG>div:nth-child(1)>p>s").attr("class","red");
        }else if(itemF==0 && PrevitemF==0){
            itemFstr="-";
            itemFper="-";
        }else if(itemF!=0 && PrevitemF!=0){
            if(parseFloat(itemF)>parseFloat(PrevitemF)){//本期大于上期
                itemFstr="↑";
                itemFper=((itemF-PrevitemF)/PrevitemF*100).toFixed(1)+"%";
                $(".stations .energyItemFPG>div:nth-child(1)>p>s").attr("class","red");
            }else if(parseFloat(itemF)<parseFloat(PrevitemF)){//本期小于上期
                itemFstr="↓";
                itemFper=((PrevitemF-itemF)/PrevitemF*100).toFixed(1)+"%";
                $(".stations .energyItemFPG>div:nth-child(1)>p>s").attr("class","green");
            }else{//本期等于上期
                itemFstr="-";
                itemFper="-";
                $(".stations .energyItemFPG>div:nth-child(1)>p>s").attr("class","white");
            }
        }
        $(".stations .energyItemFPG>div:nth-child(1)>p>s").html(itemFstr+itemFper);

        //计算平
        if(itemP==0 && PrevitemP!=0){
            itemPstr="↓";
            itemPper="100%";
            $(".stations .energyItemFPG>div:nth-child(2)>p>s").attr("class","green");
        }else if(itemP!=0 && PrevitemP==0){
            itemPstr="↑";
            itemPper="100%";
            $(".stations .energyItemFPG>div:nth-child(2)>p>s").attr("class","red");
        }else if(itemP==0 && PrevitemP==0){
            itemPstr="-";
            itemPper="-";
        }else if(itemP!=0 && PrevitemP!=0){
            if(parseFloat(itemP)>parseFloat(PrevitemP)){//本期大于上期
                itemPstr="↑";
                itemPper=((itemP-PrevitemP)/PrevitemP*100).toFixed(1)+"%";
                $(".stations .energyItemFPG>div:nth-child(2)>p>s").attr("class","red");
            }else if(parseFloat(itemP)<parseFloat(PrevitemP)){//本期小于上期
                itemPstr="↓";
                itemPper=((PrevitemP-itemP)/PrevitemP*100).toFixed(1)+"%";
                $(".stations .energyItemFPG>div:nth-child(2)>p>s").attr("class","green");
            }else{//本期等于上期
                itemPstr="-";
                itemPper="-";
                $(".stations .energyItemFPG>div:nth-child(2)>p>s").attr("class","white");
            }
        }
        $(".stations .energyItemFPG>div:nth-child(2)>p>s").html(itemPstr+itemPper);

        //计算谷
        if(itemG==0 && PrevitemG!=0){
            itemGstr="↓";
            itemGper="100%";
            $(".stations .energyItemFPG>div:nth-child(3)>p>s").attr("class","green");
        }else if(itemG!=0 && PrevitemG==0){
            itemGstr="↑";
            itemGper="100%";
            $(".stations .energyItemFPG>div:nth-child(3)>p>s").attr("class","red");
        }else if(itemG==0 && PrevitemG==0){
            itemGstr="-";
            itemGper="-";
        }else if(itemG!=0 && PrevitemG!=0){
            if(parseFloat(itemG)>parseFloat(PrevitemG)){//本期大于上期
                itemGstr="↑";
                itemGper=((itemG-PrevitemG)/PrevitemG*100).toFixed(1)+"%";
                $(".stations .energyItemFPG>div:nth-child(3)>p>s").attr("class","red");
            }else if(parseFloat(itemG)<parseFloat(PrevitemG)){//本期小于上期
                itemGstr="↓";
                itemGper=((PrevitemG-itemG)/PrevitemG*100).toFixed(1)+"%";
                $(".stations .energyItemFPG>div:nth-child(3)>p>s").attr("class","green");
            }else{//本期等于上期
                itemGstr="-";
                itemGper="-";
                $(".stations .energyItemFPG>div:nth-child(3)>p>s").attr("class","white");
            }
        }
        $(".stations .energyItemFPG>div:nth-child(3)>p>s").html(itemGstr+itemGper);

        //计算总的
        var allItems,PrevallItems,itemAllstr,itemAllper;
        allItems=itemG+itemP+itemF;
        PrevallItems=PrevitemG+PrevitemP+PrevitemF;
        if(allItems==0 && PrevallItems!=0){
            itemAllstr="↓";
            itemAllper="100%";
            $(".stations .energyItem>s").attr("class","green");
        }else if(allItems!=0 && PrevallItems==0){
            itemAllstr="↑";
            itemAllper="100%";
            $(".stations .energyItem>s").attr("class","red");
        }else if(allItems==0 && PrevallItems==0){
            itemAllstr="-";
            itemAllper="-";
        }else if(allItems!=0 && PrevallItems!=0){
            if(parseFloat(allItems)>parseFloat(PrevallItems)){//本期大于上期
                itemAllstr="↑";
                itemAllper=((allItems-PrevallItems)/PrevallItems*100).toFixed(1)+"%";
                $(".stations .energyItem>s").attr("class","red");
            }else if(parseFloat(allItems)<parseFloat(PrevallItems)){//本期小于上期
                itemAllstr="↓";
                itemAllper=((PrevallItems-allItems)/PrevallItems*100).toFixed(1)+"%";
                $(".stations .energyItem>s").attr("class","green");
            }else{//本期等于上期
                itemAllstr="-";
                itemAllper="-";
                $(".stations .energyItem>s").attr("class","white");
            }
        }
        $(".stations .energyItem>s").html(itemAllstr+itemAllper);
    }else{
        if(itemF==0){
            $(".stations .energyItemFPG>div:nth-child(1)>p>s").html("- -").attr("class","white");
        }else{
            $(".stations .energyItemFPG>div:nth-child(1)>p>s").html("↑"+" 100%").attr("class","red");
        }
        if(itemP==0){
            $(".stations .energyItemFPG>div:nth-child(2)>p>s").html("- -").attr("class","white");
        }else{
            $(".stations .energyItemFPG>div:nth-child(2)>p>s").html("↑"+" 100%").attr("class","red");
        }
        if(itemG==0){
            $(".stations .energyItemFPG>div:nth-child(3)>p>s").html("- -").attr("class","white");
        }else{
            $(".stations .energyItemFPG>div:nth-child(3)>p>s").html("↑"+" 100%").attr("class","red");
        }
        $(".stations .energyItem>s").html("↑"+" 100%").attr("class","red");
    }
    //计算分项对应的曲线数据
    var timedata=[];
    var data=[];
    console.log(CurItemsEnergy);
    if(CurItemsEnergy.length > 0){
        for(var i=0;i<CurItemsEnergy.length;i++){
            //timedata.push(des.data[i].date);
            for(var k=0;k<CurItemsEnergy[i].data.length;k++)
            {
                if(id==CurItemsEnergy[i].itemId){
                    var myTime=ItemDate.replace(/-/g,"/");
                    var temp2;
                    var oTime;
                    if(Station_DateType == 1)
                    {
                        if(k<9){temp2="0"+(k+1)}else{temp2=(k+1)}
                        // timedata.push(ItemDate+" "+temp2+":00:00");
                        timedata.push(temp2+"时");
                        var TTime=ItemDate.replace(/-/g,",");
                        var arr=TTime.split(",");
                        var date=new Date();
                        var time=date.getTime();
                        oTime=new Date(arr[0],(arr[1]-1),arr[2],(temp2-1),"00","00");
                        oTime=oTime.getTime();
                        //console.log(oTime);
                    }
                    else  if(Station_DateType == 3)
                    {
                        if(k<9){temp2="0"+(k+1)}else{temp2=(k+1)}
                        var strTime=(ItemDate).substring(0,7);
                        var thisTime=myTime.substring(0,7);
                        timedata.push(strTime+"-"+temp2);
                        var date=new Date();
                        var time=date.getTime();
                        oTime=new Date(thisTime+"/"+temp2);
                        oTime=oTime.getTime();
                    }
                    else if(Station_DateType==4)
                    {
                        if(k<9){temp2="0"+(k+1)}else{temp2=(k+1)}
                        var strTime=(ItemDate).substring(0,4);
                        var thisTime=myTime.substring(0,4);
                        timedata.push(strTime+"-"+temp2);
                        var date=new Date();
                        var time=date.getTime();
                        oTime=new Date(thisTime+"/"+temp2+"/01");
                        oTime=oTime.getTime();
                    }
                    //console.log(time - oTime)
                    if((time-1800000)>oTime)
                    {
                        data.push(((CurItemsEnergy[i].data[k].peak+CurItemsEnergy[i].data[k].level+CurItemsEnergy[i].data[k].valley)).toFixed(1));
                    }
                }

            }
        }

        var data8=[];
        if(PrevItemsEnergy.length> 0){
            if(PrevId.indexOf(id)!=-1){
                for(var i=0;i<PrevItemsEnergy.length;i++){
                    if(id==PrevItemsEnergy[i].itemId){
                        for(var k=0;k<PrevItemsEnergy[i].data.length;k++){
                            if(k<=CurItemsEnergy[0].data.length){
                                data8.push(((PrevItemsEnergy[i].data[k].peak+PrevItemsEnergy[i].data[k].level+PrevItemsEnergy[i].data[k].valley)).toFixed(1));
                            }
                        }
                    }
                }
            }else{
                data8=[];
            }

        }else{
            data8=[];
        }

    }else{
        lineTitle="分项名称";
        timedata=[];
        data=[];
        data8=[];
    }
    // load_line("elePrediction",lineTitle+"的本期、上期用电对比",timedata,data,data8);
    load_bar('elePrediction',lineTitle+"本期、上期用电对比",timedata,data,data8);
}
//加载设备分项
function Station_GetDevItem(){
    var arr = Prev_end_date.split(" ");
    var arr2= Station_date.split(" ");
    var time1,time2;//上期时间，本期时间
    time1=arr[0];
    if(Station_DateType==1){
        time2=arr[0];
    }else if(Station_DateType==3){
        var mon=time1.split("-");
        time2=mon[0]+"-"+(mon[1])+"-"+"00";
    }else if(Station_DateType==4){
        var mon=time1.split("-");
        time2=(mon[0])+"-00-00";
    }

    var ob = new Object();
    ob.stationId = parent.g_strSelStnId;//集团、项目、站点ID
    ob.preDate= time2;
    ob.curDate= arr2[0];
    ob.timeType = parseInt(Station_DateType);//1,3,4分别表示日、月、年；
    ob.itemType = 2;//1,2分别表示用户分项，设备分项；
    ob.other = 6;
    ob.userData = 2;
    var json = JSON.stringify(ob);
    console.log(json);
    parent.ccc_lib_reqDataByCmd("",USER_STATION_ITEM_CAKE_V25,json,Station_OutItemDev);//加载设备分项
}
var DevItemId;
var Dev_Id=[];
//显示设备分项
function Station_OutItemDev(id,info,des){
    console.log(des);
    if(des.result==0 && des.curData.length>0){
        DevItemId=des.curData[0].itemId;
        DevEng_Name=[];
        DevEng_Num=[];
        DevEng_Id=[];
        DevItemDate=des.curDate;
        DevCurItemsEnergy=des.curData;
        DevPrevItemsEnergy=des.preData;

    }else{
        DevEng_Name=["无数据"];
        DevEng_Num=["0"];
        DevCurItemsEnergy=[];
        DevPrevItemsEnergy=[];
        DevItemId="";
        $(".loadList .energyName>div>span").css("width","50%");
        $(".loadList .energyName>div>p>b").html("0");
        $(".loadList .Energynames").html("分项名称");
        $(".loadList .energyName>div>p>b").html(0);
        $(".loadList .energyName>div>p>s").html("- -").attr("class","white");
    }

    CalcPercentDev(DevItemId);
    $(".loadList .pie3").each(function(i){
        load_pie3(i,DevEng_Name,DevEng_Num);
    })
}

function CalcPercentDev(id){//计算本期上期峰平谷能耗以及对比
    DevEng_Name=[];
    DevEng_Num=[];
    if(!id){
         DevEng_Name=["无数据"];
         DevEng_Num=[0];
        $(".loadList .pie3").each(function(i){
            load_pie3(i,DevEng_Name,DevEng_Num);
        })
        return false;
    }
    console.log(id);
    var PrevId=[];
    var itemF=0,itemP=0,itemG=0;
    var lineTitle;
    for(var i=0;i<DevCurItemsEnergy.length;i++){
        if(DevCurItemsEnergy[i].itemId==0){
            DevCurItemsEnergy[i].itemId=9999;
        }
        var itemAll=0;
        for(var k=0;k<DevCurItemsEnergy[i].data.length;k++){
            itemAll+=parseFloat((DevCurItemsEnergy[i].data[k].peak+DevCurItemsEnergy[i].data[k].level+DevCurItemsEnergy[i].data[k].valley));
        }

        DevEng_Name.push(DevCurItemsEnergy[i].name);
        DevEng_Num.push(itemAll.toFixed(1));
        Dev_Id.push(DevCurItemsEnergy[i].itemId);
        if(id==DevCurItemsEnergy[i].itemId){//获取本期峰平谷总能耗
            lineTitle=DevCurItemsEnergy[i].name;
            $(".loadList .Energynames").html(lineTitle);
            for(var m=0;m<DevCurItemsEnergy[i].data.length;m++){
                itemF+=parseFloat(DevCurItemsEnergy[i].data[m].peak);
                itemP+=parseFloat(DevCurItemsEnergy[i].data[m].level);
                itemG+=parseFloat(DevCurItemsEnergy[i].data[m].valley);
            }
        }
    }
    var myArr=[(itemF).toFixed(1),(itemP).toFixed(1),(itemG).toFixed(1)];
    var max=Math.max.apply(null,myArr);
    var per1=((itemF).toFixed(1))/max*75+"%";
    var per2=((itemP).toFixed(1))/max*75+"%";
    var per3=((itemG).toFixed(1))/max*75+"%";
    $(".loadList .energyName>div:nth-child(2)>p>b").html(itemF.toFixed(1));
    $(".loadList .energyName>div:nth-child(3)>p>b").html(itemP.toFixed(1));
    $(".loadList .energyName>div:nth-child(4)>p>b").html(itemG.toFixed(1));
    $(".loadList .energyName>div:nth-child(2)>span").css("width",per1);
    $(".loadList .energyName>div:nth-child(3)>span").css("width",per2);
    $(".loadList .energyName>div:nth-child(4)>span").css("width",per3);


    for(var i=0;i<DevPrevItemsEnergy.length;i++){
        if(DevPrevItemsEnergy[i].itemId==0){
            DevPrevItemsEnergy[i].id=9999;
        }
        PrevId.push(DevPrevItemsEnergy[i].itemId);
    }

    var PrevitemF=0,PrevitemP=0,PrevitemG=0,itemFstr,itemPstr,itemGstr,itemFper,itemPper,itemGper,class1,class2,class3;
    if(PrevId.indexOf(id)!=-1){//如果上期有本期的分项
        for(var i=0;i<DevPrevItemsEnergy.length;i++) {
            if(id==DevPrevItemsEnergy[i].itemId){
                for(var m=0;m<DevPrevItemsEnergy[i].data.length;m++){
                    PrevitemF+=parseFloat(DevPrevItemsEnergy[i].data[m].peak);
                    PrevitemP+=parseFloat(DevPrevItemsEnergy[i].data[m].level);
                    PrevitemG+=parseFloat(DevPrevItemsEnergy[i].data[m].valley);
                }
            }
        }

        //计算峰
        if(itemF==0 && PrevitemF!=0){
            itemFstr="↓";
            itemFper="100%";
            class1="green";
        }else if(itemF!=0 && PrevitemF==0){
            itemFstr="↑";
            itemFper="100%";
            class1="red";
        }else if(itemF==0 && PrevitemF==0){
            itemFstr="-";
            itemFper="-";
        }else if(itemF!=0 && PrevitemF!=0){
            if(parseFloat(itemF)>parseFloat(PrevitemF)){//本期大于上期
                itemFstr="↑";
                itemFper=((itemF-PrevitemF)/PrevitemF*100).toFixed(1)+"%";
                class1="red";
            }else if(parseFloat(itemF)<parseFloat(PrevitemF)){//本期小于上期
                itemFstr="↓";
                itemFper=((PrevitemF-itemF)/PrevitemF*100).toFixed(1)+"%";
                class1="green";
            }else{//本期等于上期
                itemFstr="-";
                itemFper="-";
                class1="white";
            }
        }
        $(".loadList .energyName>div:nth-child(2)>p>s").html(itemFstr+" "+itemFper).attr("class",class1);

        //计算平
        if(itemP==0 && PrevitemP!=0){
            itemPstr="↓";
            itemPper="100%";
            class2="green";
        }else if(itemP!=0 && PrevitemP==0){
            itemPstr="↑";
            itemPper="100%";
            class2="red";
        }else if(itemP==0 && PrevitemP==0){
            itemPstr="-";
            itemPper="-";
        }else if(itemP!=0 && PrevitemP!=0){
            if(parseFloat(itemP)>parseFloat(PrevitemP)){//本期大于上期
                itemPstr="↑";
                itemPper=((itemP-PrevitemP)/PrevitemP*100).toFixed(1)+"%";
                class2="red";
            }else if(parseFloat(itemP)<parseFloat(PrevitemP)){//本期小于上期
                itemPstr="↓";
                itemPper=((PrevitemP-itemP)/PrevitemP*100).toFixed(1)+"%";
                class2="green";
            }else{//本期等于上期
                itemPstr="-";
                itemPper="-";
                class2="white";
            }
        }
        $(".loadList .energyName>div:nth-child(3)>p>s").html(itemPstr+" "+itemPper).attr("class",class2);

        //计算谷
        if(itemG==0 && PrevitemG!=0){
            itemGstr="↓";
            itemGper="100%";
            class3="green";
        }else if(itemG!=0 && PrevitemG==0){
            itemGstr="↑";
            itemGper="100%";
            class3="red";
        }else if(itemG==0 && PrevitemG==0){
            itemGstr="-";
            itemGper="-";
        }else if(itemG!=0 && PrevitemG!=0){
            if(parseFloat(itemG)>parseFloat(PrevitemG)){//本期大于上期
                itemGstr="↑";
                itemGper=((itemG-PrevitemG)/PrevitemG*100).toFixed(1)+"%";
                class3="red";
            }else if(parseFloat(itemG)<parseFloat(PrevitemG)){//本期小于上期
                itemGstr="↓";
                itemGper=((PrevitemG-itemG)/PrevitemG*100).toFixed(1)+"%";
                class3="green";
            }else{//本期等于上期
                itemGstr="-";
                itemGper="-";
                class3="white";
            }
        }
        $(".loadList .energyName>div:nth-child(4)>p>s").html(itemGstr+" "+itemGper).attr("class",class3);
    }else{
        if(itemF==0){
            $(".loadList .energyName>div:nth-child(2)>p>s").html("- -").attr("class","white");
        }else{
            $(".loadList .energyName>div:nth-child(2)>p>s").html("↑"+" 100%").attr("class","red");
        }
        if(itemP==0){
            $(".loadList .energyName>div:nth-child(3)>p>s").html("- -").attr("class","white");
        }else{
            $(".loadList .energyName>div:nth-child(3)>p>s").html("↑"+" 100%").attr("class","red");
        }
        if(itemG==0){
            $(".loadList .energyName>div:nth-child(4)>p>s").html("- -").attr("class","white");
        }else{
            $(".loadList .energyName>div:nth-child(4)>p>s").html("↑"+" 100%").attr("class","red");
        }
    }


}
//折线图
function load_line(id,title,timedata,data,data8){
    var myChart = echarts.init(document.getElementById(id));
    $("#"+id+">span").remove();
    $("#"+id+">span").append("<span style='float:right;color:white;position:absolute;left:70%;top:0;font-size:12px'>max："+max+" min："+min+"</span>");
    var option3={
        title:{
            text:title,
            x:"center",
            y:"2%",
            textStyle:{
                color:'#ffffff',
                fontSize:15
            }
        },
        color:[
            "#db3c83","#60eaf1"
        ],
        tooltip:{
            show: true,
            trigger:"axis",
            //formatter: "{a}",
            //formatter:function (params){
            //    return params[0].name+'<br>'+params[0].seriesName+':'+params[0].value+'(m^3/s)<br>';
            //},
            axisPointer:{
                animation: false
            }
        },
        grid:{
            left:"60px",
            right:"40px",
            bottom:"45px",
            top:"60px"
        },
        legend:{
            data:["本期用电","上期用电"],
            textStyle:{
                color:'#ffffff'
            },
            y:'1%',
            x:"90%",
            type:"scroll",
            icon:'stack',
            orient:"vertical"
            //x: 'left'
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
                //interval:"auto",
                splitNumber:10,
                data : timedata,
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
                        color:'#add8e6'
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
                name:"用电分析(kWh)",
                type : 'value',
                //min:0.01
                axisLabel : {
                    textStyle: {
                        color: '#add8e6'
                    }
                },
                nameTextStyle:{
                    color:'#add8e6'
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
                name:"本期用电",
                type:'line',
                smooth:true,
                //itemStyle: {normal: {areaStyle: {type: 'default'}}},
                symbolSize: 8,
                hoverAnimation: true,
                data:data,
                label: {
                    normal: {
                        show: true
                        //position: 'top'//值显示
                    }
                },
                //areaStyle: {
                //    normal: {
                //        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                //            { offset: 0, color: "#352a4e" },
                //            { offset: 1, color: "#11203b" }
                //        ])
                //    }
                //}, //填充区域样式
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ],
                    symbol:"pin",
                    symbolSize:40
                },
            },
            {
                name:"上期用电",
                type:'line',
                smooth:true,
                //itemStyle: {normal: {areaStyle: {type: 'default'}}},
                lineStyle:{normal:{type:"dotted"}},
                symbolSize: 8,
                hoverAnimation: true,
                data:data8,
                label: {
                    normal: {
                        show: true
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
            }
        ]
    };
    myChart.clear();
    myChart.setOption(option3);
    window.addEventListener("resize",function(){
        myChart.resize();
    });
};
//折线图
function load_lineAll(id,timedata,data,data8){
    var myChart = echarts.init(document.getElementById(id));
    // $("#"+id+">span").remove();
    // $("#"+id+">span").append("<span style='float:right;color:white;position:absolute;left:70%;top:0;font-size:12px'>max："+max+" min："+min+"</span>");
    var option3={
        title:{
            x:"center",
            y:"10%",
            textStyle:{
                color:'#ffffff',
                fontSize:15
            }
        },
        color:[
            "#db3c83","#60eaf1"
        ],
        tooltip:{
            show: true,
            trigger:"axis",
            //formatter: "{a}",
            //formatter:function (params){
            //    return params[0].name+'<br>'+params[0].seriesName+':'+params[0].value+'(m^3/s)<br>';
            //},
            axisPointer:{
                animation: false
            }
        },
        grid:{
            left:"60px",
            right:"40px",
            bottom:"45px",
            top:"40px"
        },
        legend:{
            data:["实际用电","预测用电"],
            textStyle:{
                color:'#ffffff'
            },
            y:'1%',
            x:'right',
            type:"scroll",
            icon:'stack',
            orient:"horizontal"
            //x: 'left'
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
                //interval:"auto",
                splitNumber:10,
                data : timedata,
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
                        color:'#add8e6'
                    }
                },
            }

        ],
        yAxis:[
            {
                name:"单位(kWh)",
                type : 'value',
                //min:0.01
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
                name:"实际用电",
                type:'line',
                smooth:true,
                //itemStyle: {normal: {areaStyle: {type: 'default'}}},
                symbolSize: 8,
                hoverAnimation: true,
                data:data,
                label: {
                    normal: {
                        show: true,
                        position: 'top'//值显示
                    }
                },
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ],
                    symbol:"pin",
                    symbolSize:40,
                    symbolRotate:180,
                },
            },
            {
                name:"预测用电",
                type:'line',
                smooth:true,
                //itemStyle: {normal: {areaStyle: {type: 'default'}}},
                lineStyle:{normal:{type:"dotted"}},
                symbolSize: 8,
                hoverAnimation: true,
                data:data8,
                label: {
                    normal: {
                        show: true,
                        position: 'bottom'//值显示
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
            }
        ]
    };
    myChart.clear();
    myChart.setOption(option3);
};
//折线图曲线带色块
function load_lineAll2(id,timedata,data,data8){
    var myChart = echarts.init(document.getElementById(id));
    // $("#"+id+">span").remove();
    // $("#"+id+">span").append("<span style='float:right;color:white;position:absolute;left:70%;top:0;font-size:12px'>max："+max+" min："+min+"</span>");
    var option3={
        title:{
            x:"center",
            y:"10%",
            textStyle:{
                color:'#ffffff',
                fontSize:15
            }
        },
        color:[
            "#60eaf1","orange"
        ],
        tooltip:{
            show: true,
            trigger:"axis",
            //formatter: "{a}",
            //formatter:function (params){
            //    return params[0].name+'<br>'+params[0].seriesName+':'+params[0].value+'(m^3/s)<br>';
            //},
            axisPointer:{
                animation: false
            }
        },
        grid:{
            left:"60px",
            right:"40px",
            bottom:"45px",
            top:"50px"
        },
        legend:{
            data:["实际用电","预测用电"],
            textStyle:{
                color:'#ffffff'
            },
            y:'1%',
            x:"right",
            type:"scroll",
            icon:'stack',
            orient:"horizontal"
            //x: 'left'
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
                //interval:"auto",
                splitNumber:10,
                data : timedata,
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
                        color:'#add8e6'
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
                name:"用电分析(kWh)",
                type : 'value',
                //min:0.01
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
                        color:'#fffff'
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
                name:"实际用电",
                type:'line',
                smooth:true,
                //itemStyle: {normal: {areaStyle: {type: 'default'}}},
                symbolSize: 8,
                hoverAnimation: false,
                data:data,
                label: {
                    normal: {
                        show: true,
                        position: 'top'//值显示
                    }
                },
                // areaStyle: {
                //     normal: {
                //         color: '#1a3f55' //改变区域颜色
                //     }
                // },
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ],
                    symbol:"pin",
                    symbolSize:40,
                    // symbolOffset: [0, 30], // 设置markpoint图标的位置
                    symbolRotate:180,
                    itemStyle:{
                        normal:{
                            label:{
                                show:true,
                                textStyle:{
                                    // color:"#355AE7",
                                    // fontWeight:"bold"
                                }
                               
                            }
                        }
                    } 
                },
            },
            {
                name:"预测用电",
                type:'line',
                smooth:true,
                //itemStyle: {normal: {areaStyle: {type: 'default'}}},
                lineStyle:{normal:{type:"dotted"}},
                symbolSize: 8,
                hoverAnimation: true,
                data:data8,
                label: {
                    normal: {
                        show: true,
                        position: 'bottom'//值显示
                    }
                },
                // areaStyle: {
                //     normal: {
                //         color: '#1b2763' //改变区域颜色
                //     }
                // },
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ],
                    symbol:"pin",
                    symbolSize:40,
                },
            }
        ]
    };
    myChart.clear();
    myChart.setOption(option3);
};
//加载能源分项
function Station_GetPowerItem(){
    var arr = Prev_end_date.split(" ");
    var arr2= Station_date.split(" ");
    var time1,time2;//上期时间，本期时间
    time1=arr[0];
    if(DateType3==1){
        time2=arr[0];
    }else if(DateType3==3){
        var mon=time1.split("-");
        time2=mon[0]+"-"+(mon[1])+"-"+"00";
    }else if(DateType3==4){
        var mon=time1.split("-");
        time2=(mon[0])+"-00-00";
    }
    console.log(time2);
    console.log(arr2[0]);

    var ob = new Object();
    // ob.stationId = parent.g_strSelStnId;
    ob.preDate = time2;//开始日期,
    ob.curDate = arr2[0];//结束日期
    ob.timeType = parseInt(DateType3);//；时间类型1 3 4
    ob.node = 3;//1 ：集团 2项目 3站点
    ob.userData = 3;//自定义类型
    ob.lang = 1;//语言
    var json = JSON.stringify(ob);
    console.log(json);
    parent.ccc_lib_reqDataByCmd("",USER_SUPPLY_ENERGY_LIST_V25,json,Station_OutItemPowerOpe);//
}

var powerId;
//显示能源分项
function Station_OutItemPowerOpe(id,info,des){
    console.log(des);
    if(des.result==0 && des.curData.length>0){
        powerId=des.curData[0].id;
        Power_Name=[];
        Power_Num=[];
        Power_Id=[];
        ItemDate=des.curDate;
        CurItemsPower=des.curData;
        PrevItemsPower=des.preData;
        var curTotal=(des.totalCurL+des.totalCurP+des.totalCurV).toFixed(1);
        var preTotal=(des.totalPreL+des.totalPreP+des.totalPreV).toFixed(1);
        $(".distribution .powerTotol>b").html(curTotal);
        //计算总能耗
        var itemAllstr,itemAllper,itemAllClass;
        if(curTotal==0 && preTotal!=0){
            itemAllstr="↓";
            itemAllper="100%";
            itemAllClass="green";
        }else if(curTotal!=0 && preTotal==0){
            itemAllstr="↑";
            itemAllper="100%";
            itemAllClass="red";
        }else if(curTotal==0 && preTotal==0){
            itemAllstr="-";
            itemAllper="-";
        }else if(curTotal!=0 && preTotal!=0){
            if(parseFloat(curTotal)>parseFloat(preTotal)){//本期大于上期
                itemAllstr="↑";
                itemAllper=((curTotal-preTotal)/preTotal*100).toFixed(1)+"%";
                itemAllClass="red";
            }else if(parseFloat(curTotal)<parseFloat(preTotal)){//本期小于上期
                itemAllstr="↓";
                itemAllper=((preTotal-curTotal)/preTotal*100).toFixed(1)+"%";
                itemAllClass="green";
            }else{//本期等于上期
                itemAllstr="-";
                itemAllper="-";
                itemAllClass="white";
            }
        }
        $(".distribution .powerTotol>s").html(itemAllstr+itemAllper).attr("class",itemAllClass);

        var itemF=des.totalCurP;
        var PrevitemF=des.totalPreP;
        var itemFstr,itemFper,itemFClass;
        //计算峰
        if(itemF==0 && PrevitemF!=0){
            itemFstr="↓";
            itemFper="100%";
            itemFClass="green";
        }else if(itemF!=0 && PrevitemF==0){
            itemFstr="↑";
            itemFper="100%";
            itemFClass="red";
        }else if(itemF==0 && PrevitemF==0){
            itemFstr="-";
            itemFper="-";
        }else if(itemF!=0 && PrevitemF!=0){
            if(parseFloat(itemF)>parseFloat(PrevitemF)){//本期大于上期
                itemFstr="↑";
                itemFper=((itemF-PrevitemF)/PrevitemF*100).toFixed(1)+"%";
                itemFClass="red";
            }else if(parseFloat(itemF)<parseFloat(PrevitemF)){//本期小于上期
                itemFstr="↓";
                itemFper=((PrevitemF-itemF)/PrevitemF*100).toFixed(1)+"%";
                itemFClass="green";
            }else{//本期等于上期
                itemFstr="-";
                itemFper="-";
                itemFClass="white";
            }
        }
        $(".distribution .powerTotolFPG>div:nth-child(1)>p>s").html(itemFstr+itemFper).attr("class",itemFClass);
        $(".distribution .powerTotolFPG>div:nth-child(1)>p>b").html(itemF.toFixed(1));

        var itemP=des.totalCurL;
        var PrevitemP=des.totalPreL;
        var itemPstr,itemPper,itemPClass;
        //计算平
        if(itemP==0 && PrevitemP!=0){
            itemPstr="↓";
            itemPper="100%";
            itemPClass="green";
        }else if(itemP!=0 && PrevitemP==0){
            itemPstr="↑";
            itemPper="100%";
            itemPClass="red";
        }else if(itemP==0 && PrevitemP==0){
            itemPstr="-";
            itemPper="-";
        }else if(itemP!=0 && PrevitemP!=0){
            if(parseFloat(itemP)>parseFloat(PrevitemP)){//本期大于上期
                itemPstr="↑";
                itemPper=((itemP-PrevitemP)/PrevitemP*100).toFixed(1)+"%";
                itemPClass="red";
            }else if(parseFloat(itemP)<parseFloat(PrevitemP)){//本期小于上期
                itemPstr="↓";
                itemPper=((PrevitemP-itemP)/PrevitemP*100).toFixed(1)+"%";
                itemPClass="green";
            }else{//本期等于上期
                itemPstr="-";
                itemPper="-";
                itemPClass="white";
            }
        }
        $(".distribution .powerTotolFPG>div:nth-child(2)>p>s").html(itemPstr+itemPper).attr("class",itemPClass);
        $(".distribution .powerTotolFPG>div:nth-child(2)>p>b").html(itemP.toFixed(1));

        var itemG=des.totalCurV;
        var PrevitemG=des.totalPreV;
        var itemGstr,itemGper,itemGClass;
        //计算谷
        if(itemG==0 && PrevitemG!=0){
            itemGstr="↓";
            itemGper="100%";
            itemGClass="green";
        }else if(itemG!=0 && PrevitemG==0){
            itemGstr="↑";
            itemGper="100%";
            itemGClass="red";
        }else if(itemG==0 && PrevitemG==0){
            itemGstr="-";
            itemGper="-";
        }else if(itemG!=0 && PrevitemG!=0){
            if(parseFloat(itemG)>parseFloat(PrevitemG)){//本期大于上期
                itemGstr="↑";
                itemGper=((itemG-PrevitemG)/PrevitemG*100).toFixed(1)+"%";
                itemGClass="red";
            }else if(parseFloat(itemG)<parseFloat(PrevitemG)){//本期小于上期
                itemGstr="↓";
                itemGper=((PrevitemG-itemG)/PrevitemG*100).toFixed(1)+"%";
                itemGClass="green";
            }else{//本期等于上期
                itemGstr="-";
                itemGper="-";
                itemGClass="white";
            }
        }
        $(".distribution .powerTotolFPG>div:nth-child(3)>p>s").html(itemGstr+itemGper).attr("class",itemGClass);
        $(".distribution .powerTotolFPG>div:nth-child(3)>p>b").html(itemG.toFixed(1));

        var myArr=[(itemF).toFixed(1),(itemP).toFixed(1),(itemG).toFixed(1)];
        var max=Math.max.apply(null,myArr);
        var per1=((itemF).toFixed(1))/max*40+"%";
        var per2=((itemP).toFixed(1))/max*40+"%";
        var per3=((itemG).toFixed(1))/max*40+"%";

        $(".distribution .powerTotolFPG>div:nth-child(1)>p>span").css("width",per1);
        $(".distribution .powerTotolFPG>div:nth-child(2)>p>span").css("width",per2);
        $(".distribution .powerTotolFPG>div:nth-child(3)>p>span").css("width",per3);

        //计算能源分项加起来的总

        var allData=[];
        for(var i=0;i<CurItemsPower.length;i++){
            var allTime=[];
            for(var k=0;k<CurItemsPower[i].data.length;k++){
                    var myTime=ItemDate.replace(/-/g,"/");
                    var temp2;
                    var oTime;
                    if(Station_DateType == 1){
                        if(k<9){temp2="0"+(k+1)}else{temp2=(k+1)}
                        // allTime.push(ItemDate+" "+temp2+":00:00");
                        allTime.push(temp2+"时");
                        var TTime=ItemDate.replace(/-/g,",");
                        var arr=TTime.split(",");
                        var date=new Date();
                        var time=date.getTime();
                        oTime=new Date(arr[0],(arr[1]-1),arr[2],(temp2-1),"00","00");
                        oTime=oTime.getTime();
                    }else  if(Station_DateType == 3){
                        if(k<9){temp2="0"+(k+1)}else{temp2=(k+1)}
                        var strTime=(ItemDate).substring(0,7);
                        var thisTime=myTime.substring(0,7);
                        allTime.push(strTime+"-"+temp2);
                        var date=new Date();
                        var time=date.getTime();
                        oTime=new Date(thisTime+"/"+temp2);
                        oTime=oTime.getTime();
                    }else if(Station_DateType==4){
                        if(k<9){temp2="0"+(k+1)}else{temp2=(k+1)}
                        var strTime=(ItemDate).substring(0,4);
                        var thisTime=myTime.substring(0,4);
                        allTime.push(strTime+"-"+temp2);
                        var date=new Date();
                        var time=date.getTime();
                        oTime=new Date(thisTime+"/"+temp2+"/01");
                        oTime=oTime.getTime();
                    }
                    //console.log(time - oTime)
                    if((time-1800000)>oTime){

                        if(!allData[k]){
                            allData.push(((CurItemsPower[i].data[k].peak+CurItemsPower[i].data[k].level+CurItemsPower[i].data[k].valley)).toFixed(1));
                        }else{
                            var news = (CurItemsPower[i].data[k].peak+CurItemsPower[i].data[k].level+CurItemsPower[i].data[k].valley).toFixed(1);
                            var old = allData[k];
                            allData[k]=(parseFloat(news)+parseFloat(old)).toFixed(1);
                        }
                    }
            }
        }
        var data8=[];
        if(PrevItemsPower.length> 0){
            for(var i=0;i<PrevItemsPower.length;i++){
                      for(var k=0;k<PrevItemsPower[i].data.length;k++){
                            if(k<=CurItemsPower[0].data.length){
                                if(!data8[k]){
                                    data8.push(((PrevItemsPower[i].data[k].peak+PrevItemsPower[i].data[k].level+PrevItemsPower[i].data[k].valley)).toFixed(1));
                                }else{
                                    var news = (PrevItemsPower[i].data[k].peak+PrevItemsPower[i].data[k].level+PrevItemsPower[i].data[k].valley).toFixed(1);
                                    var old = data8[k];
                                    data8[k]=(parseFloat(news)+parseFloat(old)).toFixed(1);
                                }

                            }
                        }
                }
        }else{
            data8=[];
        }
    }else{
        Power_Name=["无数据"];
        Power_Num=["0"];
        CurItemsPower=[];
        PrevItemsPower=[];
        powerId="";
        $(".distribution .energyName>div>ul>li:nth-child(2)>div>p>span").css("width","50%");
        $(".distribution .energyName>div>ul>li:nth-child(2)>div>p>b").html("0");
        $(".distribution .energyName>div>ul>li:nth-child(2)>div>p>s").html("- -").attr("class","white");
        $(".distribution .powerItemName>span").html("分项名称：");
        $(".distribution .powerTotol>b").html(0);
        $(".distribution .powerTotol>s").html("- -").attr("class","white");

        // $(".distribution .powerItem>b").html(0);
        // $(".distribution .powerItem>s").html("- -").attr("class","white");

        $(".distribution .powerItemName>b").html(0);
        $(".distribution .powerItemName>s").html("- -").attr("class","white");
        data8=[];
        allData=[];
        allTime=[];
    }
    console.log(allTime)
    console.log(allData)
    console.log(data8)
    load_lineAll2("totlLinePower",allTime,allData,data8);
    CalcPercent2(powerId);
    load_pie6(Power_Name,Power_Num);
    // load_lineAll("totlLineAll",allTime,allData,data8);
    // $(".pie2").each(function(i){
    //     load_pie2(i);
    // })

}
function CalcPercent2(id){//计算本期上期峰平谷能源以及对比
        if(!id){
            lineTitle="分项";
            timedata=[];
            data=[];
            data8=[];
            load_bar("powerPrediction",lineTitle,timedata,data,data8);
            // load_bar('AllPrediction',"分项名称",timedata,data,data8);
            return false;
        }
        var PrevId=[];
        var itemF=0,itemP=0,itemG=0;
         console.log(CurItemsPower);
        for(var i=0;i<CurItemsPower.length;i++){
            if(CurItemsPower[i].id==0){
                CurItemsPower[i].id=9999;
            }
            var itemAll=0;
            for(var k=0;k<CurItemsPower[i].data.length;k++){
                itemAll+=parseFloat((CurItemsPower[i].data[k].peak+CurItemsPower[i].data[k].level+CurItemsPower[i].data[k].valley));
            }
            Power_Name.push(CurItemsPower[i].name);
            Power_Num.push(itemAll.toFixed(1));
            Power_Id.push(CurItemsPower[i].id);
            if(id==CurItemsPower[i].id){//获取本期峰平谷总能耗
                var lineTitle=CurItemsPower[i].name;
                $(".powerItemName>span").html(lineTitle+"：");
                for(var m=0;m<CurItemsPower[i].data.length;m++){
                    itemF+=parseFloat(CurItemsPower[i].data[m].peak);
                    itemP+=parseFloat(CurItemsPower[i].data[m].level);
                    itemG+=parseFloat(CurItemsPower[i].data[m].valley);
                }
            }
        }
        var myArr=[(itemF).toFixed(1),(itemP).toFixed(1),(itemG).toFixed(1)];
        var max=Math.max.apply(null,myArr);
        console.log(itemF+","+itemP+","+itemG);
        var per11=((itemF).toFixed(1))/max*40+"%";
        var per12=((itemP).toFixed(1))/max*40+"%";
        var per13=((itemG).toFixed(1))/max*40+"%";
        var allItem=parseFloat(itemF+itemP+itemG);
        console.log(per11+","+per12+","+per13);
         $(".distribution .powerItemName>b").html(allItem.toFixed(1));
        $(".distribution .powerItemFPG>div:nth-child(1)>p>b").html(itemF.toFixed(1));
        $(".distribution .powerItemFPG>div:nth-child(2)>p>b").html(itemP.toFixed(1));
        $(".distribution .powerItemFPG>div:nth-child(3)>p>b").html(itemG.toFixed(1));
        $(".distribution .powerItemFPG>div:nth-child(1)>p>span").css("width",per11);
        $(".distribution .powerItemFPG>div:nth-child(2)>p>span").css("width",per12);
        $(".distribution .powerItemFPG>div:nth-child(3)>p>span").css("width",per13);


        for(var i=0;i<PrevItemsPower.length;i++){
            if(PrevItemsPower[i].id==0){
                PrevItemsPower[i].id=9999;
            }
            PrevId.push(PrevItemsPower[i].id);
        }

        var PrevitemF=0,PrevitemP=0,PrevitemG=0,itemFstr,itemPstr,itemGstr,itemFper,itemPper,itemGper;
        if(PrevId.indexOf(id)!=-1){//如果上期有本期的分项
            for(var i=0;i<PrevItemsPower.length;i++) {
                if(id==PrevItemsPower[i].id){
                    for(var m=0;m<PrevItemsPower[i].data.length;m++){
                        PrevitemF+=parseFloat(PrevItemsPower[i].data[m].peak);
                        PrevitemP+=parseFloat(PrevItemsPower[i].data[m].level);
                        PrevitemG+=parseFloat(PrevItemsPower[i].data[m].valley);
                    }
                }
            }

            //计算峰
            if(itemF==0 && PrevitemF!=0){
                itemFstr="↓";
                itemFper="100%";
                $(".distribution .powerItemFPG>div:nth-child(1)>p>s").attr("class","green");
            }else if(itemF!=0 && PrevitemF==0){
                itemFstr="↑";
                itemFper="100%";
                $(".distribution .powerItemFPG>div:nth-child(1)>p>s").attr("class","red");
            }else if(itemF==0 && PrevitemF==0){
                itemFstr="-";
                itemFper="-";
            }else if(itemF!=0 && PrevitemF!=0){
                if(parseFloat(itemF)>parseFloat(PrevitemF)){//本期大于上期
                    itemFstr="↑";
                    itemFper=((itemF-PrevitemF)/PrevitemF*100).toFixed(1)+"%";
                    $(".distribution .powerItemFPG>div:nth-child(1)>p>s").attr("class","red");
                }else if(parseFloat(itemF)<parseFloat(PrevitemF)){//本期小于上期
                    itemFstr="↓";
                    itemFper=((PrevitemF-itemF)/PrevitemF*100).toFixed(1)+"%";
                    $(".distribution .powerItemFPG>div:nth-child(1)>p>s").attr("class","green");
                }else{//本期等于上期
                    itemFstr="-";
                    itemFper="-";
                    $(".distribution .powerName>div:nth-child(1)>p>s").attr("class","white");
                }
            }
            $(".distribution .powerItemFPG>div:nth-child(1)>p>s").html(itemFstr+itemFper);

            //计算平
            if(itemP==0 && PrevitemP!=0){
                itemPstr="↓";
                itemPper="100%";
                $(".distribution .powerItemFPG>div:nth-child(2)>p>s").attr("class","green");
            }else if(itemP!=0 && PrevitemP==0){
                itemPstr="↑";
                itemPper="100%";
                $(".distribution .powerItemFPG>div:nth-child(2)>p>s").attr("class","red");
            }else if(itemP==0 && PrevitemP==0){
                itemPstr="-";
                itemPper="-";
            }else if(itemP!=0 && PrevitemP!=0){
                console.log(itemP+","+PrevitemP)
                if(parseFloat(itemP)>parseFloat(PrevitemP)){//本期大于上期
                    itemPstr="↑";
                    itemPper=((itemP-PrevitemP)/PrevitemP*100).toFixed(1)+"%";
                    $(".distribution .powerItemFPG>div:nth-child(2)>p>s").attr("class","red");
                }else if(parseFloat(itemP)<parseFloat(PrevitemP)){//本期小于上期
                    itemPstr="↓";
                    itemPper=((PrevitemP-itemP)/PrevitemP*100).toFixed(1)+"%";
                    $(".distribution .powerItemFPG>div:nth-child(2)>p>s").attr("class","green");
                }else{//本期等于上期
                    itemPstr="-";
                    itemPper="-";
                    $(".distribution .powerItemFPG>div:nth-child(2)>p>s").attr("class","white");
                }
            }

            $(".distribution .powerItemFPG>div:nth-child(2)>p>s").html(itemPstr+itemPper);

            //计算谷
            if(itemG==0 && PrevitemG!=0){
                itemGstr="↓";
                itemGper="100%";
                $(".distribution .powerItemFPG>div:nth-child(3)>p>s").attr("class","green");
            }else if(itemG!=0 && PrevitemG==0){
                itemGstr="↑";
                itemGper="100%";
                $(".distribution .powerItemFPG>div:nth-child(3)>p>s").attr("class","red");
            }else if(itemG==0 && PrevitemG==0){
                itemGstr="-";
                itemGper="-";
            }else if(itemG!=0 && PrevitemG!=0){
                if(parseFloat(itemG)>parseFloat(PrevitemG)){//本期大于上期
                    itemGstr="↑";
                    itemGper=((itemG-PrevitemG)/PrevitemG*100).toFixed(1)+"%";
                    $(".distribution .powerItemFPG>div:nth-child(3)>p>s").attr("class","red");
                }else if(parseFloat(itemG)<parseFloat(PrevitemG)){//本期小于上期
                    itemGstr="↓";
                    itemGper=((PrevitemG-itemG)/PrevitemG*100).toFixed(1)+"%";
                    $(".distribution .powerItemFPG>div:nth-child(3)>p>s").attr("class","green");
                }else{//本期等于上期
                    itemGstr="-";
                    itemGper="-";
                    $(".distribution .powerItemFPG>div:nth-child(3)>p>s").attr("class","white");
                }
            }
            $(".distribution .powerItemFPG>div:nth-child(3)>p>s").html(itemGstr+itemGper);

            //计算总的
            var allItems,PrevallItems,itemAllstr,itemAllper,classAll;
            allItems=itemG+itemP+itemF;
            PrevallItems=PrevitemG+PrevitemP+PrevitemF;
            console.log(allItems);
            console.log(PrevallItems);
            if(allItems==0 && PrevallItems!=0){
                itemAllstr="↓";
                itemAllper="100%";
                classAll="green";
            }else if(allItems!=0 && PrevallItems==0){
                itemAllstr="↑";
                itemAllper="100%";
                classAll="red";
            }else if(allItems==0 && PrevallItems==0){
                itemAllstr="-";
                itemAllper="-";
            }else if(allItems!=0 && PrevallItems!=0){
                if(parseFloat(allItems)>parseFloat(PrevallItems)){//本期大于上期
                    itemAllstr="↑";
                    itemAllper=((allItems-PrevallItems)/PrevallItems*100).toFixed(1)+"%";
                    classAll="red";
                }else if(parseFloat(allItems)<parseFloat(PrevallItems)){//本期小于上期
                    itemAllstr="↓";
                    itemAllper=((PrevallItems-allItems)/PrevallItems*100).toFixed(1)+"%";
                    classAll="green";
                }else{//本期等于上期
                    itemAllstr="-";
                    itemAllper="-";
                    classAll="white";
                }
            }
            $(".distribution .powerItemName>s").html(itemAllstr+itemAllper).attr("class",classAll);
        }else{
            if(itemF==0){
                $(".distribution .powerItemFPG>div:nth-child(1)>p>s").html("- -").attr("class","white");
            }else{
                $(".distribution .powerItemFPG>div:nth-child(1)>p>s").html("↑"+" 100%").attr("class","red");
            }
            if(itemP==0){
                $(".distribution .powerItemFPG>div:nth-child(2)>p>s").html("- -").attr("class","white");
            }else{
                $(".distribution .powerItemFPG>div:nth-child(2)>p>s").html("↑"+" 100%").attr("class","red");
            }
            if(itemG==0){
                $(".distribution .powerItemFPG>div:nth-child(3)>p>s").html("- -").attr("class","white");
            }else{
                $(".distribution .powerItemFPG>div:nth-child(3)>p>s").html("↑"+" 100%").attr("class","red");
            }
            $(".distribution .powerItemName>s").html("↑"+" 100%").attr("class","red");
        }

    //计算分项对应的曲线数据
    var timedata=[];
    var data=[];
    console.log(CurItemsPower);
    if(CurItemsPower.length > 0){
        for(var i=0;i<CurItemsPower.length;i++){
            //timedata.push(des.data[i].date);
            for(var k=0;k<CurItemsPower[i].data.length;k++)
            {
                if(id==CurItemsPower[i].id){
                    var myTime=ItemDate.replace(/-/g,"/");
                    var temp2;
                    var oTime;
                    if(Station_DateType == 1)
                    {
                        if(k<9){temp2="0"+(k+1)}else{temp2=(k+1)}
                        // timedata.push(ItemDate+" "+temp2+":00:00");
                        timedata.push(temp2+"时");
                        var TTime=ItemDate.replace(/-/g,",");
                        var arr=TTime.split(",");
                        var date=new Date();
                        var time=date.getTime();
                        oTime=new Date(arr[0],(arr[1]-1),arr[2],(temp2-1),"00","00");
                        oTime=oTime.getTime();
                        //console.log(oTime);
                    }
                    else  if(Station_DateType == 3)
                    {
                        if(k<9){temp2="0"+(k+1)}else{temp2=(k+1)}
                        var strTime=(ItemDate).substring(0,7);
                        var thisTime=myTime.substring(0,7);
                        timedata.push(strTime+"-"+temp2);
                        var date=new Date();
                        var time=date.getTime();
                        oTime=new Date(thisTime+"/"+temp2);
                        oTime=oTime.getTime();
                    }
                    else if(Station_DateType==4)
                    {
                        if(k<9){temp2="0"+(k+1)}else{temp2=(k+1)}
                        var strTime=(ItemDate).substring(0,4);
                        var thisTime=myTime.substring(0,4);
                        timedata.push(strTime+"-"+temp2);
                        var date=new Date();
                        var time=date.getTime();
                        oTime=new Date(thisTime+"/"+temp2+"/01");
                        oTime=oTime.getTime();
                    }
                    //console.log(time - oTime)
                    if((time-1800000)>oTime)
                    {
                        data.push(((CurItemsPower[i].data[k].peak+CurItemsPower[i].data[k].level+CurItemsPower[i].data[k].valley)).toFixed(1));
                    }
                }

            }
        }

        var data8=[];
        if(PrevItemsPower.length> 0){
            if(PrevId.indexOf(id)!=-1){
                for(var i=0;i<PrevItemsPower.length;i++){
                    if(id==PrevItemsPower[i].id){
                        for(var k=0;k<PrevItemsPower[i].data.length;k++){
                            if(k<=CurItemsPower[0].data.length){
                                data8.push(((PrevItemsPower[i].data[k].peak+PrevItemsPower[i].data[k].level+PrevItemsPower[i].data[k].valley)).toFixed(1));
                            }
                        }
                    }
                }
            }else{
                data8=[];
            }

        }else{
            data8=[];
        }

    }else{
        lineTitle="分项名称";
        timedata=[];
        data=[];
        data8=[];
    }
    load_bar("powerPrediction",lineTitle+"本期、上期用电对比",timedata,data,data8);
    // load_bar('AllPrediction',lineTitle+"本期、上期用电对比",timedata,data,data8);
}




var len=1;
var number=1;
var warnInfo=[];
var first=true;



//柱状图
function load_bar(id,title,timedata,data,data8){
    var myChart = echarts.init(document.getElementById(id));
    var s = "6cb147";
    var option3 = {
        title:{
            text:title,
            x:"center",
            y:"5%",
            textStyle:{
                color:'#ffffff',
                fontSize:15
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
            data:['本期','上期'],
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
            right: '6%',
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
                        color:'#add8e6'
                    }
                },
            }
        ],
        yAxis : [
            {
                type : 'value',
                name:"单位(kWh)",
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
                name:'本期',
                type:'bar',
                data:data,
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#3d78e4'
                        }, {
                            offset: 1,
                            color: '#081423'
                        }]),
                    }
                },
            },

            {
                name:'上期',
                type:'bar',
                data:data8,
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#a45222'
                        }, {
                            offset: 1,
                            color: '#222424'
                        }]),
                    }
                },
            },

        ]
    };
    myChart.clear();
    myChart.setOption(option3);
}












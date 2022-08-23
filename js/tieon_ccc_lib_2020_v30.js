var g_cccObj = new Object();
var g_ip = "192.168.4.232";         
// var g_ip = document.domain;
var g_port = 36666;
var g_proto_ws = 1;
var g_proto_ajax = 2;
var g_bNBO = false;
var g_nSepId = 0;
var g_tm_heart = 45;/*心跳间隔时间*/
var g_max_seq = 5000;/*包最大序号*/
var g_obj_init = 0;/*1已初始化*/
var g_wait_req_num = 20;/*等待请求数量*/
var g_conn_status_login_ok = 1000000;
var g_conn_STRING_login_ok = "登录成功!";
var g_conn_status_user_null = 1000001;
var g_conn_STRING_user_null = "未输入登录帐号!";
var g_conn_status_pwd_null = 1000002;
// var g_conn_STRING_pwd_null = "未输入登录密码!";
var g_conn_status_user_error = 1000003;
var g_conn_STRING_user_error = "帐号不存在!";
var g_conn_status_pwd_error = 1000004;
var g_conn_STRING_pwd_error = "密码错误!";
var g_conn_status_repeat_login = 1000005;   
var g_conn_STRING_repeat_login = "该帐号已在他处登录!";
var g_conn_status_data_error = 1000006;
var g_conn_STRING_data_error = "通信数据错误!";
var g_conn_status_not_connect = 1000007;
var g_conn_STRING_not_connect = "网络未连接!";
var g_conn_status_connected = 1000008;
var g_conn_STRING_connected = "网络已连接!";
var g_conn_status_CONFLICT = 1000009;
var g_conn_STRING_CONFLICT = "多帐户冲突退出!";
var g_conn_status_USER_AUTH = 1000010;
var g_conn_STRING_user_auth = "无权限!";
var g_conn_str ="connect information";/*连接相关*/
var g_notice_str ="server notice";/*服务器通知描述*/

/*初始状态为0,登录三种状态：1是直接连接-登录-成功;2是连接成功-登录失败(在其他地方登录过的用户服务器会断开连接,其他不断开),再登录*/
/*3是登录成功后,打开多个窗口且登录的不是同一用户的处理,检测到不同用户,直接提示页面退出*/

var g_ccc_status_init = 0;
var g_ccc_status_connecting = 1;
var g_ccc_status_connectfailed = 2;
var g_ccc_status_connected = 3;
var g_ccc_status_logining = 4;
var g_ccc_status_loginfailed = 5;
var g_ccc_status_logined = 6;
var g_ccc_status_login_conflict=7;

/*不同平台的应用要修改这几个字段名称*/
var g_save_user = "soft31tuser";
var g_save_pwd  = "soft31tpwd";
var g_save_sign = "soft31tsign";
var g_save_clientType = "soft31clienttype";

var g_save_user_tmp = null;
var g_save_pwd_tmp  = null;
var g_save_sign_tmp = null;
var g_save_clientType_tmp = null;

/*与服务器交互指令*/
var g_cmd_user_login = 1200;
var g_cmd_user_heart = 8000;

var g_lncc_head_len = 25;/*lncc头长*/
//================================================================================================
function G_GetSepId()
{
    g_nSepId++;

    if (g_nSepId >= g_max_seq)
    {
        g_nSepId = 0;
    }

    return g_nSepId;
}

function UcToUtf8(str, isGetBytes)
{
    var back = [];
    var byteSize = 0;
    for (var i = 0; i < str.length; i++)
    {
        var code = str.charCodeAt(i);
        if (0x00 <= code && code <= 0x7f)
        {
            byteSize += 1;
            back.push(code);
        }
        else if (0x80 <= code && code <= 0x7ff)
        {
            byteSize += 2;
            back.push((192 | (31 & (code >> 6))));
            back.push((128 | (63 & code)))
        }
        else if ((0x800 <= code && code <= 0xd7ff) || (0xe000 <= code && code <= 0xffff))
        {
            byteSize += 3;
            back.push((224 | (15 & (code >> 12))));
            back.push((128 | (63 & (code >> 6))));
            back.push((128 | (63 & code)))
        }
    }
    for (i = 0; i < back.length; i++)
    {
        back[i] &= 0xff;
    }
    if (isGetBytes)
    {
        return back;
    }
    if (byteSize <= 0xff)
    {
        return [0, byteSize].concat(back);
    }
    else
    {
        return [byteSize >> 8, byteSize & 0xff].concat(back);
    }
}
function Utf8ToUc(ArrBuf)
{
    if (typeof arr === 'string')
    {
        return arr;
    }
    var UTF = '', _arr = ArrBuf;
    for (var i = 0; i < _arr.length; i++)
    {
        var one = _arr[i].toString(2),
            v = one.match(/^1+?(?=0)/);
        if (v && one.length == 8)
        {
            var bytesLength = v[0].length;
            //var store = _arr[i].toString(2).slice(7 - bytesLength);
            var store = _arr[i].toString(2).slice(bytesLength);
            for (var st = 1; st < bytesLength; st++)
            {
                store += _arr[st + i].toString(2).slice(2)
            }
            UTF += String.fromCharCode(parseInt(store, 2));
            i += bytesLength - 1;
        }
        else
        {
            UTF += String.fromCharCode(_arr[i]);
        }
    }
    return UTF;
}
//解决电气图中文字被解码分割问题
function Utf8ToUc_oTme(ArrBuf)
{
    var ob=new Object();
    ob.num=ArrBuf.length;
    if (typeof arr === 'string')
    {
        return arr;
    }
    var UTF = '', _arr = ArrBuf;
    for (var i = 0; i < _arr.length; i++)
    {
        var k=i;
        var one = _arr[i].toString(2),
            v = one.match(/^1+?(?=0)/);
        if (v && one.length == 8)
        {
            var bytesLength = v[0].length;
            var store = _arr[i].toString(2).slice(7 - bytesLength);
            for (var st = 1; st < bytesLength; st++)
            {
                if(_arr[st + i]==undefined){
                    ob.num=k;
                    ob.theString=UTF;
                    return ob;
                }
                store += _arr[st + i].toString(2).slice(2)
            }
            UTF += String.fromCharCode(parseInt(store, 2));
            i += bytesLength - 1;
        }
        else
        {
            UTF += String.fromCharCode(_arr[i]);
        }
    }
    ob.theString=UTF;
    return ob;
}

function ws_ccc_reqCB(oWait, oData)
{
    if (typeof oWait.appCB === "function") {
        // console.log(oData.m_json);
        var jsonObj=JSON.parse(oData.m_json);
        oWait.appCB(oWait.command, oWait.userData, jsonObj);
        //oWait.appCB(oWait.command, oWait.userData, oData.m_json);
    } else {
        //console.log("req,not fun,cmd:" + oWait.command + "userData:" + oWait.userData + ",data:" + oData.m_json);
    }
}

function ws_ccc_noticeCB(cb,cmd, oData)
{
    if (typeof cb === "function") {
        cb(cmd, g_notice_str, oData);
    } else {
        //console.log("notice,not fun,cmd:" + cmd + ",data:" + oData);
    }
}

function ws_ccc_connCB(cb,id, des)
{
    if (typeof cb === "function") {
        cb(id, g_conn_str, des);
    } else {
        //console.log("login,not fun,id:" + id + ",des:" + des);
    }
}

/*应用输入用户名密码登录*/
function ccc_lib_enableByVerify(usr, pwd, clientType, proto, connCB, noticeCB)
{
    g_save_sign_tmp = g_save_sign+clientType;
    var sign  = window.localStorage.getItem(g_save_sign_tmp);
    g_save_user_tmp = g_save_user+clientType;
    g_save_pwd_tmp = g_save_pwd+clientType;
    g_save_clientType_tmp = g_save_clientType+clientType;
    console.log("登录******")
    ws_ccc_task(usr,pwd,clientType,proto,g_ip,g_port,sign,connCB,noticeCB);

    return ;
}

/*应用上跳转新页面时直接调用,不需要登录,连接后直接获取数据*/
function ccc_lib_enableByPass(clientType,proto,connCB,noticeCB)
{
    g_save_user_tmp = g_save_user+clientType;
    g_save_pwd_tmp = g_save_pwd+clientType;
    g_save_sign_tmp = g_save_sign+clientType;
    g_save_clientType_tmp = g_save_clientType+clientType;

    var user = window.localStorage.getItem(g_save_user_tmp);
    var pwd  = window.localStorage.getItem(g_save_pwd_tmp);
    var sign  = window.localStorage.getItem(g_save_sign_tmp);

    ws_ccc_task(user,pwd,clientType,proto,g_ip,g_port,sign,connCB,noticeCB);

    return ;
}

/*应用向服务器发送指令请求数据,并注册该指令的回调函数*/
/*userData:用户数据,appCB回调时返回*/
/*cmd:执行的指令*/
/*cmdstr:指令内容*/
/*appCB:应用接收该指令数据的函数*/
function ccc_lib_reqDataByCmd(userData, cmd, cmdstr, appCB)
{
    if(g_cccObj.status != g_ccc_status_logined)
    {
        if(g_obj_init != 0)
        {
            ws_wait_send_Obj_add(g_cccObj.oWaitSend, userData, cmd, cmdstr, appCB);
            return 0;
        }
        console.log("cmd="+cmd+", send err! netlib wait init!"+cmdstr);
        return -1;
    }
    // //console.log(cmd+","+cmdstr);
    var seqId = G_GetSepId();

    ws_user_cross_v25(cmd, seqId, cmdstr);

    ws_wait_ack_Obj_add(g_cccObj.oWatiAck, seqId, userData, cmd, cmdstr, appCB);

    return 0;
}

function ws_ccc_task(usr,pwd,clientType,proto,ip,port,sign,connCB,noticeCB)
{
    if(sign == null)
    {
        sign = 0;
    }

    //console.log("g_obj_init="+g_obj_init+",u="+usr+",p="+pwd+",type="+clientType+",ip="+ip+",port="+port+",sign="+sign+",status="+g_cccObj.status);

    if(g_obj_init != 1)
    {
        g_cccObj.ip   = ip;
        g_cccObj.port = port;
        g_cccObj.status = g_ccc_status_init;
        g_cccObj.ws = null;
        g_cccObj.randId = Math.random()*10000;/*每个连接的唯一标记*/
    }else
    {
        if(g_cccObj.status > g_ccc_status_connected && g_cccObj.status != g_ccc_status_login_conflict)
        {
            g_cccObj.status = g_ccc_status_connected;
        }else
        {
            g_cccObj.status = g_ccc_status_connectfailed;
        }
    }

    g_cccObj.user = usr;
    g_cccObj.pwd  = pwd;
    g_cccObj.proto = proto;
    g_cccObj.sign = parseInt(sign);
    g_cccObj.clientType = clientType;

    g_cccObj.connCB = connCB;
    g_cccObj.noticeCB = noticeCB;

    if(usr.length<=0)
    {
        ws_ccc_connCB(connCB,g_conn_status_user_null,g_conn_STRING_user_null);
        return;
    }

    if(pwd.length<=0)
    {
        ws_ccc_connCB(connCB,g_conn_status_pwd_null,g_conn_STRING_pwd_null);
        return;
    }

    if(g_obj_init != 1)
    {
        /*按包序号保存请求【申请空间】*/
        g_cccObj.oWatiAck = new Object();/*等待请求的对像*/
        var oAck = g_cccObj.oWatiAck;
        oAck.num = g_max_seq;
        oAck.ackArray = new Array();/*new一个数据存储命令内容*/

        ws_wait_ackArray_create(oAck);

        /*应用发送命令时，如果网络未准备好，保存缓存空间【申请空间】*/
        g_cccObj.oWaitSend = new Object();/*等待请求的对像*/
        var oSend = g_cccObj.oWaitSend;
        oSend.num = g_wait_req_num;
        oSend.pos = 0;
        oSend.sendArray = new Array();/*new一个数据存储命令内容*/

        ws_wait_sendArray_create(oSend);
        //console.log("create wait send");

        g_cccObj.taskId = 0;
    }else
    {
        if(g_cccObj.taskId != 0)/*控制任务循环*/
        {
            clearTimeout(g_cccObj.taskId);
            g_cccObj.taskId = 0;
        }
    }

    g_cccObj.heartTm = g_tm_heart;/*发送心跳间隔时间*/

    g_obj_init = 1;
    //console.log(g_proto_ws);
    //console.log(g_cccObj.proto);
    if(g_proto_ws == g_cccObj.proto)
    {
        ws_runTask();
    }else
    {
        g_cccObj.status = g_ccc_status_logined;
    }

    return ;
}

function ws_ccc_create(strIp, nPort, randId) {
    //console.log("Connecting to " + strIp + ",port:" + nPort + ",randid:" + randId);
    var wsUri = "ws://" + strIp + ":" + nPort + "/websocket";
    var webSocket = null;
    try {
        webSocket = new WebSocket(wsUri);
        webSocket.binaryType = 'arraybuffer';
        webSocket.onopen = function (evt) {
            onOpen(evt);
            onOpenApp(randId);
        };
        webSocket.onclose = function (evt) {
            onClose(evt);
            onCloseApp(randId);
        };
        webSocket.onmessage = function (evt) {
            onMessage(evt);
        };
        webSocket.onerror = function (evt) {
            onError(evt);
            //onCloseApp(randId);
        };
    } catch(ex) {
        console.log(ex);
    }

    return webSocket;
}

function onOpen(evt) {
    //console.log("ws open");
    g_cccObj.status = g_ccc_status_connected;
    ws_ccc_connCB(g_cccObj.connCB,g_conn_status_connected,g_conn_STRING_connected);

    ws_user_login_v25();/*登录*/
    g_cccObj.status = g_ccc_status_logining;
}

function onClose(evt) {
    console.log("ws close");
    $("footer").show();
    $("header").hide();
    $("section").hide();
}

function onMessage(evt) {
    //console.log("====================Socket recv message");
    OnRecvMsg(evt.data);
}

function onError(evt) {
    console.log("ws error !");
    $("footer").show();
    $("header").hide();
    $("section").hide();
}

function onOpenApp(randid) {
    var myDate = new Date();
    var mytime=myDate.toLocaleTimeString();
    console.log("Socket open, randid:"+randid+",tm="+mytime.toLocaleString());
}

function onCloseApp(randId) {
    var myDate = new Date();
    var mytime=myDate.toLocaleTimeString();
    console.log("Socket close, randId:"+randId+",tm="+mytime.toLocaleString());

    ws_conn_errHandle(randId);
}

function doSend(oArrBuf) {
    // console.log("ws send message");
    try
    {
        if(g_proto_ws == g_cccObj.proto)
        {
            g_cccObj.ws.send(oArrBuf);
        }else
        {
            ajax_sendData(oArrBuf);
        }
    } catch(ex) {
        console.log(ex);
    }
}

function doClose() {
    console.log("ws app close!");
    try
    {
        g_cccObj.ws.close();
        g_cccObj.ws=null;
    } catch(ex) {
        console.log(ex);
    }
}

function ws_conn_errHandle(randId)
{
    if(randId != g_cccObj.randId)
    {
        console.log("not equal, randId:"+randId+",OBJ randid="+g_cccObj.randId);
        return;
    }
    if(g_cccObj.status >= g_ccc_status_connected)
    {
        ws_ccc_connCB(g_cccObj.connCB,g_conn_status_not_connect,g_conn_STRING_not_connect);
    }
    if(g_cccObj.status != g_ccc_status_login_conflict)
    {
        g_cccObj.status = g_ccc_status_connectfailed;
    }

    g_cccObj.ws = null;
    g_cccObj.randId += 1;
    console.log("ws init, new randid="+g_cccObj.randId);
    console.log("****************重连**********************");
    /*准备重连*/
}

/*NEW协议lncc头的空对象*/
function ws_proHead_newObj(nCmd)
{
    //console.log(nCmd);
    var oNetHead = new Object();
    oNetHead.s_4lnccId = 0x4F434543;
    oNetHead.u_2version = 0x3000;
    oNetHead.u_2command = nCmd;
    oNetHead.u_4seqId = 0;
    oNetHead.u_4verify = 0;/*crc*/
    oNetHead.u_4len = 0;
    oNetHead.u_2keynum = 0;
    oNetHead.u_direct = 1;
    oNetHead.u_format = 1;
    oNetHead.u_userIdLen = 0;
    oNetHead.m_userId = "";

    oNetHead.o_data = new Object();
    oNetHead.o_data.m_json = "";

    oNetHead.f_pack = oV25_pack;

    oNetHead.t_count = 0;/*临时量，用于打包时记录已打包的数据*/
    oNetHead.u_4packLen = 0;/*打包后,总数据包长*/

    return oNetHead;
}


/*发送前打包成数据BUF*/
function oV25_pack(oArrBuf, oNetHead)
{
    var oDataView = new DataView(oArrBuf);

    oNetHead.u_userIdLen = oNetHead.m_userId.length;
    oNetHead.t_count = g_lncc_head_len+oNetHead.u_userIdLen;/*计算头长*/

    /*头长加上数据长*/
    oNetHead.t_count = oV25_packByCmd(oArrBuf, oNetHead);

    oNetHead.u_4packLen = oNetHead.t_count;
    oNetHead.u_4len = oNetHead.t_count;

    /*打包头*/
    oDataView.setUint32(0,oNetHead.s_4lnccId,g_bNBO);
    oDataView.setUint16(4,oNetHead.u_2version,g_bNBO);
    oDataView.setUint16(6,oNetHead.u_2command,g_bNBO);
    oDataView.setUint32(8,oNetHead.u_4seqId,g_bNBO);
    oDataView.setUint32(12,oNetHead.u_4verify,g_bNBO);
    oDataView.setUint32(16,oNetHead.u_4len,g_bNBO);
    oDataView.setUint8(20,oNetHead.u_2keynum,g_bNBO);
    oDataView.setUint8(22,oNetHead.u_direct,g_bNBO);
    oDataView.setUint8(23,oNetHead.u_format,g_bNBO);
    oDataView.setUint8(24,oNetHead.u_userIdLen,g_bNBO);
    // console.log("head:", oNetHead.s_4lnccId, oNetHead.u_2version, oNetHead.u_2command, oNetHead.u_4seqId, oNetHead.u_4verify,oNetHead.u_4len,oNetHead.u_format,oNetHead.u_direct,oNetHead.u_userIdLen,oNetHead.m_userId);

    //nPos = PackStr(oArrBuf,oDataView,oNetData.m_strHeadUserId,nPos);
    for(var nAdd = 0; nAdd < oNetHead.u_userIdLen; ++nAdd)
    {
        oDataView.setInt8(g_lncc_head_len + nAdd,oNetHead.m_userId.charCodeAt(nAdd));
    }
    return oNetHead.u_4packLen;
}

function oV25_packByCmd(oArrBuf, oNetHead)
{
    var uLen = oNetHead.t_count;

    switch(oNetHead.m_usCommand)
    {
        case g_cmd_user_heart:
            break;
        default:
            uLen = oV25_packJson(oArrBuf, oNetHead.t_count, oNetHead.o_data);
            break;
    }

    return uLen;
}

function oV25_packJson(oArrBuf, nPos, oData)
{
    nPos = PackJson(oArrBuf,oData.m_json,nPos);

    return nPos;
}

function PackJson(oArrBuf,strInput,nPos)
{
    var arrUInt = UcToUtf8(strInput,1);
    var nLen = arrUInt.length;

    var iInsert = new Int8Array(oArrBuf,nPos,nLen);

    iInsert.set(arrUInt);
    nPos += nLen;

    return nPos;
}

/*用户登录:协议见word25文档*/
function ws_user_login_v25()
{
    var oNetHead = ws_proHead_newObj(g_cmd_user_login);
    var o_data = oNetHead.o_data;
    var o = new Object();

    o.userId = g_cccObj.user;
    o.md5 = g_cccObj.pwd;
    o.type = g_cccObj.clientType;
    o.auth = 0;
    o.sign = g_cccObj.sign;

    o_data.m_json = JSON.stringify(o);

    var seqId = G_GetSepId();

    oNetHead.u_4seqId = seqId;
    oNetHead.m_userId = g_cccObj.user;

    ws_PackSend(oNetHead);

    return 0;
}

/*用户心跳:协议见word25文档**/
function ws_user_heart_v25()
{
    var oNetHead = ws_proHead_newObj(g_cmd_user_heart);

    var seqId = G_GetSepId();

    oNetHead.u_4seqId = seqId;
    oNetHead.m_userId = g_cccObj.user;

    ws_PackSend(oNetHead);

    return 0;
}

/*通用指令:协议见word25文档**/
function ws_user_cross_v25(cmd, seqId, jsonStr)
{
    var oNetHead = ws_proHead_newObj(cmd);
    var o_data = oNetHead.o_data;

    oNetHead.u_4seqId = seqId;
    oNetHead.m_userId = g_cccObj.user;

    o_data.m_json = jsonStr;

    ws_PackSend(oNetHead);

    return 0;
}

/*WS发送网络数据*/
function ws_PackSend(oNetHead)
{
    var oSendBuf = new ArrayBuffer(1024 * 50);
    var nPackLen = oNetHead.f_pack(oSendBuf, oNetHead);

    //console.log(oNetHead);

    console.log('Client SEND size>>: '+nPackLen+', cmd:'+oNetHead.u_2command+", sign:"+g_cccObj.sign+","+oNetHead.u_format);

    doSend(oSendBuf.slice(0,nPackLen));

    return 0;
}

function ws_login_check(oRetHead, oData)
{
    var json = JSON.parse(oData.m_json);

    //console.log("return:"+json.result);
    var ret = parseInt(json.result);

    switch(ret)
    {
        case 0:/*OK*/
            g_cccObj.sign = parseInt(json.sign);
            ws_ccc_connCB(g_cccObj.connCB,g_conn_status_login_ok,g_conn_STRING_login_ok);
           
            window.localStorage.setItem(g_save_user_tmp,g_cccObj.user);
            window.localStorage.setItem(g_save_pwd_tmp, g_cccObj.pwd);
            if(g_cccObj.sign==undefined){
                g_cccObj.sign=666;
            }
            window.localStorage.setItem(g_save_sign_tmp,g_cccObj.sign);/*注释掉他,测试答名错误已在他处登录的情况*/
            window.localStorage.setItem(g_save_clientType_tmp,g_cccObj.clientType);
            /*检查有未发送的消息*/
            g_cccObj.status = g_ccc_status_logined;
            ws_wait_send_Obj_checkSend(g_cccObj.oWaitSend);
            break;
        case -2:/*密码错误*/
            ws_ccc_connCB(g_cccObj.connCB,g_conn_status_pwd_error,g_conn_STRING_pwd_error);
            break;
        case -3:/*已在他处登录*/
            ws_ccc_connCB(g_cccObj.connCB,g_conn_status_repeat_login,g_conn_STRING_repeat_login);
            g_cccObj.status = g_ccc_status_login_conflict;
            //setTimeout("loaded()",1000);
            return;
            break;
        case -20:/*用户不存在*/
            ws_ccc_connCB(g_cccObj.connCB,g_conn_status_user_error,g_conn_STRING_user_error);
            break;
        case -11:/*无权限*/
            ws_ccc_connCB(g_cccObj.connCB,g_conn_status_USER_AUTH,g_conn_STRING_user_auth);
            break;
        default:/*其他错误,不重连*/
            ws_ccc_connCB(g_cccObj.connCB,g_conn_status_data_error,g_conn_STRING_data_error);
            break;
    }

    if(ret != 0)
    {
        g_cccObj.status = g_ccc_status_loginfailed;/*连接成功,登录失败,重新登陆时需要把状态修改成已连接*/
    }
}
function loaded(){
    window.location.reload();
    return false;
}
/*WS接收网络数据*/
function WS_OnRecvMsg_ext(oRetHead)
{
    switch (oRetHead.u_2command)
    {
        case g_cmd_user_login:
            ws_login_check(oRetHead, oRetHead.o_data);
            break;
        case g_cmd_user_heart:
            break;
        default:
            var oWait = ws_wait_ackObj_getBySeq(g_cccObj.oWatiAck, oRetHead.u_4seqId);

            if(oWait == null)
            {
                ws_ccc_noticeCB(g_cccObj.noticeCB,oRetHead.u_2command,oRetHead.o_data.m_json);
                return ;
            }
            if(oWait.command != oRetHead.u_2command)
            {
                ws_ccc_noticeCB(g_cccObj.noticeCB,oRetHead.u_2command,oRetHead.o_data.m_json);
                return ;
            }

            ws_ccc_reqCB(oWait, oRetHead.o_data);
            //console.log(oWait);
            ws_wait_ackObj_clear(oWait);
            break;
    }

    return 0;
}

/*WS接收网络数据*/
function OnRecvMsg(oArrBuf)
{
    console.log(oArrBuf);

    var oRetHead = oV20_NewReciveProto();

    oRetHead.f_unpack(oArrBuf, oRetHead);

     console.log(oRetHead);

    if(oRetHead.o_data.m_json == "")
    {
        //console.log("err:json is null, cmd="+oRetHead.u_2command);
        return 0;
    }

    WS_OnRecvMsg_ext(oRetHead);

    return 0;
}

/*NEW一个接收协议空对象*/
function oV20_NewReciveProto()
{
    //console.log(nCmd);
    var oNetHead = new Object();
    oNetHead.s_4lnccId = 0;
    oNetHead.u_2version = 0;
    oNetHead.u_2command = 0;
    oNetHead.u_4seqId = 0;
    oNetHead.u_4verify = 0;
    oNetHead.u_4len = 0;
    oNetHead.u_2keynum = 0;
    oNetHead.u_direct = 1;
    oNetHead.u_format = 0;
    oNetHead.u_userIdLen = 0;
    oNetHead.m_userId = "";

    oNetHead.o_data = new Object();
    oNetHead.o_data.m_json = "";

    oNetHead.f_unpack = oV25_UnPack;

    oNetHead.t_count = 0;/*临时量，用于打包时记录已打包的数据*/
    oNetHead.u_4packLen = 0;/*打包后,总数据包长*/

    return oNetHead;
}

function oV25_UnPack(oArrBuf,oNetHead)
{
    console.log(oArrBuf);
    try{
        var oDataView = new DataView(oArrBuf);
    }catch(err){
        //window.location.reload();
        //$("footer").show();
        //$("header").hide();
        //$("section").hide();
    }


    oNetHead.s_4lnccId = oDataView.getUint32(0,g_bNBO);
    oNetHead.u_2version = oDataView.getUint16(4,g_bNBO);
    oNetHead.u_2command = oDataView.getUint16(6,g_bNBO);
    oNetHead.u_4seqId = oDataView.getUint32(8,g_bNBO);
    oNetHead.u_4verify = oDataView.getUint32(12,g_bNBO);
    oNetHead.u_4len = oDataView.getUint32(16,g_bNBO);
    oNetHead.u_2keynum = oDataView.getUint16(20,g_bNBO);
    oNetHead.u_direct = oDataView.getUint8(22,g_bNBO);
    oNetHead.u_format = oDataView.getUint8(23,g_bNBO);
    oNetHead.u_userIdLen = oDataView.getUint8(24);
    oNetHead.m_userId = "";

    for(var nAdd = 0;nAdd < oNetHead.u_userIdLen;++nAdd)
    {
        oNetHead.m_userId += String.fromCharCode(oDataView.getInt8(25 + nAdd));
    }

    oNetHead.t_count = g_lncc_head_len+oNetHead.u_userIdLen;

    oV25_UnpackByCmd(oArrBuf, oNetHead);

    oNetHead.t_count = oNetHead.u_4len;

    return 0;
}

function oV25_UnpackByCmd(oArrBuf, oNetHead)
{
    oV25_UnpackJson(oArrBuf, oNetHead.t_count, oNetHead.o_data, oNetHead.u_4len);
}

function oV25_UnpackJson(oArrBuf, nPos, oData, packLen)
{
    var oDataView = new DataView(oArrBuf);

    dataLen = packLen-nPos;

    if(dataLen <= 0)
    {
        return ;
    }
    oData.m_json = UnPackJson(oArrBuf,oDataView,nPos,dataLen);
}

function UnPackJson(oArrBuf,oDataView,nPos,dataLen)
{
    var strOut = Utf8ToUc(new Uint8Array(oArrBuf,nPos,dataLen));

    return strOut;
}

/*用户循环登录处理逻辑*/
function ws_runTask()
{
    if(g_cccObj.status == g_ccc_status_logined)
    {
        var user = window.localStorage.getItem(g_save_user_tmp);
        var clientType = parseInt(window.localStorage.getItem(g_save_clientType_tmp));

        //console.log("read user="+user+", run user="+g_cccObj.user+",info");

        if(user != g_cccObj.user && clientType == g_cccObj.clientType)
        {
            clearTimeout(g_cccObj.taskId);
            g_cccObj.taskId = 0;
            window.location.reload();
            ////console.log("read user="+user+", run user="+g_cccObj.user+",change!!! exit");
            ws_ccc_connCB(g_cccObj.connCB,g_conn_status_CONFLICT,g_conn_STRING_CONFLICT);
            return;
        }
    }
    //console.log(g_cccObj.status)
    //console.log(g_cccObj.proto)
    //console.log(g_proto_ws)
    switch(g_cccObj.status)
    {
        case g_ccc_status_connectfailed:
        case g_ccc_status_init:
            if(g_cccObj.proto == g_proto_ws)
            {
                g_cccObj.status = g_ccc_status_connecting;
                g_cccObj.ws = ws_ccc_create(g_cccObj.ip,g_cccObj.port,g_cccObj.randId)
            }else
            {
                ;
            }
            break;
        case g_ccc_status_logined:
            if(g_cccObj.heartTm <= 0){
                g_cccObj.heartTm = g_tm_heart;
                ws_user_heart_v25();
            }
            break;
        case g_ccc_status_connected:
            ws_user_login_v25();/*登录*/
            g_cccObj.status = g_ccc_status_logining;
            break;
        case g_ccc_status_connecting:
            break;
        case g_ccc_status_logining:
            break;
        case g_ccc_status_loginfailed:
            clearTimeout(g_cccObj.taskId);
            g_cccObj.taskId = 0;
            return 0;
            break;
        case g_ccc_status_login_conflict:
            break;
        default:
            break;
    }

    g_cccObj.taskId=setTimeout("ws_runTask()",1000);
    g_cccObj.heartTm -= 1;

    return 0;
}

/*****************************************-----------ack seq----------******************************************/
function ws_wait_ackObj_create()
{
    var o=new Object();

    o.userData  = "";
    o.command = 0;
    o.cmdstr = "";
    o.appCB = null;
    o.flag = 0;/*0未使用*/
    o.times = 0;//时间戳，用于判断命令发送/*var timestamp = (new Date()).getTime();//毫秒*/

    return o;
}

function ws_wait_ackArray_create(ackObj)
{
    var i=0;

    for(; i<ackObj.num; i++)
    {
        var o = ws_wait_ackObj_create();

        ackObj.ackArray.push(o);
    }

    return 0;
}

function ws_wait_ackObj_fill(o, userData, command, cmdstr, appCB)
{
    o.userData = userData;
    o.command  = command;
    o.cmdstr   = cmdstr;
    o.appCB = appCB;

    o.flag = 1;
    o.times = (new Date()).getTime();//毫秒

    return 0;
}

function ws_wait_ackObj_getBySeq(ackObj, seq)
{
    if(seq >= ackObj.num) return null;

    var obj = ackObj.ackArray[seq];

    return obj;
}

function ws_wait_ackObj_clear(o)
{
    o.userData  = "";
    o.command = 0;
    o.cmdstr = "";
    o.appCB = null;
    o.flag = 0;/*0未使用*/
    o.times = 0;//时间戳，用于判断命令发送/*var timestamp = (new Date()).getTime();//毫秒*/

    return 0;
}

function ws_wait_ack_Obj_add(ackObj, seq, userData, command, cmdstr, appCB)
{
    //console.log(ackObj+","+seq+","+userData)
    var o = ws_wait_ackObj_getBySeq(ackObj, seq);

    if(o.flag != 0)
    {
        //console.log("not wait cmd:"+o.command+" return!");
    }

    ws_wait_ackObj_fill(o, userData, command, cmdstr, appCB);
}

/*****************************************-----------wait send----------******************************************/
function ws_wait_sendObj_create()
{
    var o=new Object();

    o.userData  = "";
    o.command = 0;
    o.cmdstr = "";
    o.appCB = null;
    o.flag = 0;/*0未使用*/
    o.times = 0;//时间戳，用于判断命令发送/*var timestamp = (new Date()).getTime();//毫秒*/

    return o;
}

function ws_wait_sendArray_create(sendObj)
{
    var i=0;

    for(; i<sendObj.num; i++)
    {
        var o = ws_wait_sendObj_create();

        sendObj.sendArray.push(o);
    }

    return 0;
}

function ws_wait_sendObj_fill(o, userData, command, cmdstr, appCB)
{
    o.userData = userData;
    o.command  = command;
    o.cmdstr   = cmdstr;
    o.appCB = appCB;

    o.flag = 1;
    o.times = (new Date()).getTime();//毫秒

    return 0;
}

function ws_wait_sendObj_getBySeq(sendObj)
{
    if(sendObj.pos >= sendObj.num) sendObj.pos = 0;

    var obj = sendObj.sendArray[sendObj.pos];

    sendObj.pos += 1;

    return obj;
}

function ws_wait_sendObj_clear(o)
{
    o.userData  = "";
    o.command = 0;
    o.cmdstr = "";
    o.appCB = null;
    o.flag = 0;/*0未使用*/
    o.times = 0;//时间戳，用于判断命令发送/*var timestamp = (new Date()).getTime();//毫秒*/

    return 0;
}

function ws_wait_send_Obj_add(sendObj, userData, command, cmdstr, appCB)
{
    //console.log("add num="+sendObj.num+",pos="+sendObj.pos+",arrsize="+sendObj.sendArray.length);
    //console.log(ws_wait_send_Obj_checkbycmd(sendObj, command, cmdstr));
    if(true == ws_wait_send_Obj_checkbycmd(sendObj, command, cmdstr))
    {
        return 0;
    }

    var o = ws_wait_sendObj_getBySeq(sendObj);

    if(o.flag != 0)
    {
        //console.log("not wait send cmd:"+o.command+" return!");
    }

    ws_wait_sendObj_fill(o, userData, command, cmdstr, appCB);

    return 0;
}

function ws_wait_send_Obj_checkSend(sendObj)
{
    var i=0;

    for(; i<sendObj.num;i++)
    {
        var obj = sendObj.sendArray[i];
        if(obj.flag != 0)
        {
            ccc_lib_reqDataByCmd(obj.userData, obj.command, obj.cmdstr, obj.appCB);
            ws_wait_sendObj_clear(obj);
        }
    }
}

/*重发的命令过滤掉*/
function ws_wait_send_Obj_checkbycmd(sendObj, command, cmdstr)
{
    var i=0;

    for(; i<sendObj.num;i++)
    {
        var obj = sendObj.sendArray[i];
        if(obj.flag != 0)
        {
            if(obj.command == command && cmdstr == obj.cmdstr)
            {
                //console.log("ignore resend command="+command+",str="+cmdstr);
                return true;
            }
        }
    }

    return false;
}
/*****************************************-----------HTTP----------******************************************/
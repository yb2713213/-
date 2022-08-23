//var xmlhttp = null;
//var g_ip = document.domain;
//var g_url_ajax = "http://"+g_ip+":36666/rtncV1";
var g_url_ajax = "http://192.168.4.232:36666/rtncV1";

function _createXMLHttpReq()
{
    try { return new XMLHttpRequest(); } catch(e) {}
    try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (e) {}
    try { return new ActiveXObject("Microsoft.XMLHTTP"); } catch (e) {}

    alert("XMLHttpRequest not supported");

    return null;
}

/*使用不到,ajax句柄不能全局使用*/
function ajax_createXMLHttpReq()
{
    //xmlhttp = _createXMLHttpReq();
}

//异步调用服务器段数据
function ajax_sendData(oArrBuf){
    var xmlhttp = _createXMLHttpReq();
    //console.log(xmlhttp);
    //console.log(oArrBuf.byteLength);
    if(xmlhttp!=null){
        //创建HTTP请求
        var t_url = g_url_ajax;
        xmlhttp.open("post",t_url,true);
        xmlhttp.responseType = "arraybuffer";
        //设置HTTP请求状态变化的函数
        xmlhttp.onreadystatechange = function (){
            //console.log(this);
            //判断异步调用是否完成
            if(this.readyState == 4)
            {
                //判断异步调用是否成功,如果成功开始局部更新数据
                if(this.status == 200||this.status == 0){
                    //更新数据
                    //alert(this.getAllResponseHeaders());
                    var blob = this.response;
                    //console.log("ajax return len="+blob.byteLength);
                    //console.log("str="+blob);

                    //data recv
                    //try{
                        OnRecvMsg(blob);
                        $("footer").hide();
                        $("header").show();
                        $("section").show();
                    //}catch(err){
                    //    console.log(err);
                    //    $("footer").show();
                    //    $("header").hide();
                    //    $("section").hide();
                    //}

                }else{
                    //如果异步调用未成功,弹出警告框,并显示出错信息
                    alert("异步调用出错/n返回的HTTP状态码为:"+this.status + "/n返回的HTTP状态信息为:" + this.statusText);
                }
            }
        };
        //发送请求
        //console.log("send Len="+oArrBuf.byteLength+","+t_url);
        xmlhttp.send(oArrBuf);
    }else {
        //todo no init;
        console.log("ajax not init!");
    }
}

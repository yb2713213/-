//留白
var whiteImg = 'data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAA8AAD/4QMraHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjk2QjIxRjMxMDY4RDExRUE5NEYyRUI4OUU5NEFDQzE5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjk2QjIxRjMyMDY4RDExRUE5NEYyRUI4OUU5NEFDQzE5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTZCMjFGMkYwNjhEMTFFQTk0RjJFQjg5RTk0QUNDMTkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OTZCMjFGMzAwNjhEMTFFQTk0RjJFQjg5RTk0QUNDMTkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAAGBAQEBQQGBQUGCQYFBgkLCAYGCAsMCgoLCgoMEAwMDAwMDBAMDg8QDw4MExMUFBMTHBsbGxwfHx8fHx8fHx8fAQcHBw0MDRgQEBgaFREVGh8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx//wAARCAAIAxUDAREAAhEBAxEB/8QASwABAQAAAAAAAAAAAAAAAAAAAAgBAQAAAAAAAAAAAAAAAAAAAAAQAQAAAAAAAAAAAAAAAAAAAAARAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AKpAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB//2Q==';
function base64ImgtoFile(dataurl, names) { 
    let arr = dataurl.split(',')
    let mime = arr[0].match(/:(.*?);/)[1]
    let suffix = mime.split('/')[1]
    let bstr = atob(arr[1])
    let n = bstr.length
    let u8arr = new Uint8Array(n)
    while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], `${names}.${suffix}`, {
    type: mime
    })
}
//打印
function printOut(id,type){
    html2canvas(document.querySelector('#'+id), {
        allowTaint: true,
        scale: 1 ,// 提升画面质量，但是会增加文件大小
        pagesplit:false
    }).then(function (canvas) {
        console.log(type);
        console.log("canvascanvas",canvas);
        /**jspdf将html转为pdf一页显示不截断，整体思路：
         * 1. 获取DOM 
         * 2. 将DOM转换为canvas
         * 3. 获取canvas的宽度、高度（稍微大一点） 
         * 4. 将pdf的宽高设置为canvas的宽高
         * 5. 将canvas转为图片
         * 6. 实例化jspdf，将内容图片放在pdf中（因为内容宽高和pdf宽高一样，就只需要一页，也防止内容截断问题）841.89
         */
        // 得到canvas画布的单位是px 像素单位
        var contentWidth = canvas.width
        var contentHeight = canvas.height
        // console.log("canvas宽"+canvas.width)
        // console.log("canvas高"+canvas.height)
        // 将canvas转为base64图片
        var pageData = canvas.toDataURL('image/jpeg', 1.0);
        // var imgs=document.createElement("img");
        // imgs.src=pageData;
        // console.log(imgs);
     
        
            // dataurl 为传进来的base64格式的图片地址， return 返回的为file格式
            // 设置pdf的尺寸，pdf要使用pt单位 已知 1pt/1px = 0.75   pt = (px/scale)* 0.75
            // 2为上面的scale 缩放了2倍
            var pdfX = contentWidth / 1 * 0.75
            var pdfY = contentHeight/ 1 * 0.75 

            //页面留白
            var whiteHeight = 0;

            //一张pdf尺寸
            var pdfW = 505.32;
            var pdfH = 600.89
            
            // 设置内容图片的尺寸，img是pt单位 
            var imgX = pdfX;
            var imgY = (contentHeight / 1 * 0.75); 
            var imgH = pdfH - whiteHeight*2 ;//内容区高度
            // console.log("内容区高度"+imgH)
            //偏移量
            var position = whiteHeight;
            var pageTempHeight = (contentHeight / 1 * 0.75);
            // 初始化jspdf 第一个参数方向：默认''时为纵向，第二个参数设置pdf内容图片使用的长度单位为pt，第三个参数为PDF的大小，单位是pt
            var PDF = new jsPDF('p', 'pt', 'a4',true);
            if(imgY<imgH){
                // PDF.addImage(whiteImg, 'jpeg', 0, 0, pdfW, whiteHeight)
                PDF.addImage(pageData, 'jpeg', 0, 0, imgX, imgH,'','FAST')
                // PDF.addImage(whiteImg, 'jpeg', 0, (imgH+whiteHeight), pdfW, whiteHeight)
            }else{
                while(pageTempHeight>0){
                    //内容区
                    PDF.addImage(pageData, 'jpeg', 0, position, imgX, imgY,'','FAST')
                    //头部留白
                    // PDF.addImage(whiteImg, 'jpeg', 0, 0, pdfW, whiteHeight)
                    //底部留白
                    // PDF.addImage(whiteImg, 'jpeg', 0, (imgH+whiteHeight+1), pdfW, whiteHeight)
                    position -= imgH;
                    pageTempHeight -= imgH;
                    // console.log("最后的"+pageTempHeight)
                    if(pageTempHeight>0){
                        PDF.addPage();
                    }
                }
            }
            // 将内容图片添加到pdf中，因为内容宽高和pdf宽高一样，就只需要一页，位置就是 0,0
        var fileName =  $('.generateReport').attr('data-name');

            if(type==1){
               PDF.save(fileName+'.pdf');
            }else{
                var pdfData = PDF.output('datauristring')//获取到base64 的pdf
                var file1 =base64ImgtoFile(pdfData,fileName);
                console.log(file1);
                var fd = new FormData();
                fd.append('file', file1);
                upload(fd,fileName);
            }
    })

}
function upload(fd,fileName) {
    parent.$(".covers").show().find('p').text('报告下载中，请稍后...');

    $.ajax({
        url: '../../cgi-bin/upload.cgi',//上传地址
        // url: 'js/upload.php',//上传地址
        async: true,//异步
        type: 'post',//post方式
        data: fd,//FormData数据
        processData: false,//不处理数据流 !important
        contentType: false,//不设置http头 !important
        success: function (data) {//上传成功回调
            console.log(data);
            console.log(data == 0);
            if(data == 0){
                var ob = new Object();
                ob.class = 5;
                ob.fileName = fileName+'.pdf';
                ob.userData = 0;
                var json = JSON.stringify(ob);
                console.log(ob);
                parent.ccc_lib_reqDataByCmd('',USER_OPERATE_BY_CUSTOM,json,operateByCustom5Fn);
            }
        },
        error:function() {
            parent.$(".covers").hide();
        }
    })
}

function operateByCustom5Fn(id,info,des){
    console.log(des);
    if(des.result!=0){
        parent.loadAlerts(des.desc);
    }
    parent.$(".covers").hide();
}
// 下载pdf完整方法
function downPdf (id,type) {
    // 生成的pdf只有页面窗口可见的区域，有滚动条的下面没有生成出来，需在生成PDF前，改overflow属性auto为visible
    // eslint-disable-next-line
    html2canvas(document.querySelector('#'+id), {
        allowTaint: true,
        scale: 1 ,// 提升画面质量，但是会增加文件大小
        pagesplit:false
     }).then(function (canvas) {
        var shareContent = document.querySelector('#'+id);
        var width = shareContent.offsetWidth ;
        var height = shareContent.offsetHeight ;

        var context = canvas.getContext('2d')
        context.mozImageSmoothingEnabled = false
        context.webkitImageSmoothingEnabled = false
        context.msImageSmoothingEnabled = false
        context.imageSmoothingEnabled = false
        var pageData = canvas.toDataURL('image/jpeg', 1.0)
        var img = new Image();
        img.src = pageData;
        img.onload = function () {
            // 获取dom高度、宽度
            console.log(img.width)
            // img.width = img.width / 2
            // img.height = img.height / 2
            // img.style.transform = 'scale(0.5)'
            if (width > height) {
                // 此可以根据打印的大小进行自动调节
                // eslint-disable-next-line
                var pdf = new jsPDF('l', 'pt', [
                    487.28 ,
                    height 
                ])
            } else {
                // eslint-disable-next-line
                var pdf = new jsPDF('p', 'pt', [
                    487.28 ,
                    height 
                ])
            }
            pdf.addImage(
                pageData,
                'png',
                0,
                0,
                487.28 ,
                height 
            )
            var fileName =  $('.generateReport').attr('data-name');
            if(type==1){
                pdf.save(fileName+'.pdf');
            }else{
                var pdfData = pdf.output('datauristring')//获取到base64 的pdf
                var file1 =base64ImgtoFile(pdfData,fileName);
                console.log(file1);
                var fd = new FormData();
                fd.append('file', file1);
                upload(fd,fileName);
            }
        }
    })
　　//　导出pdf后，将dom原本属性设置回去
    this.$('#boardPdf').css({'overflow-y': 'auto', 'height': '100%'})
    this.$('#app').css({'overflow-y': 'auto', 'height': '100%'})
    this.$('body').css({'overflow-y': 'auto', 'height': '100%'})
}
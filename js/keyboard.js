$(function() {
    var $write = $("input:focus"),
        shift = false,
        capslock = false;

    $("#keyboard li").on("mousedown",function(e) {
        e.preventDefault();
        var val=$("input:focus").val();
        var $this = $(this),
            character = $this.html();

        if ($this.hasClass("left-shift") || $this.hasClass("right-shift")) {
            $(".letter").toggleClass("uppercase");
            $(".symbol span").toggle();

            shift = (shift === true) ? false : true;
            capslock = false;
            return false;
        }
        if ($this.hasClass("capslock")) {
            $(".letter").toggleClass("uppercase");
            capslock = true;
            return false;
        }
        if ($this.hasClass("delete")) {
            var html = $("input:focus").val();
           
            let element = $("input:focus")[0]; // 获取到指定标签
            let startPos = element.selectionStart; // 获取光标开始的位置
            if(startPos==0){
                return false;
            }else if(startPos == html.length-1){
                $("input:focus").val(html.substr(0, html.length - 1));
            }else{
                $("input:focus").val(val.slice(0, startPos-1) + val.slice(startPos, val.length+1));//从光标处插入
                if (element.setSelectionRange) {
                    element.setSelectionRange(startPos-1, startPos-1);//设置光标位置
                }
            }
            return false;
        }
        if ($this.hasClass("symbol")){
            character = $("span:visible", $this).html();
        }
        if ($this.hasClass("space")){
            character = " ";
        }
        if ($this.hasClass("tab")){
            return false;
            character = "\t";
        }
        if ($this.hasClass("return")){
            character = "\n";
        }

        if ($this.hasClass("uppercase")) character = character.toUpperCase();
        let element = $("input:focus")[0]; // 获取到指定标签
        let startPos = element.selectionStart; // 获取光标开始的位置
        $("input:focus").trigger("input");
        $("input:focus").val(val.slice(0, startPos) + character + val.slice(startPos, val.length+1));//从光标处插入
        if (element.setSelectionRange) {
            element.setSelectionRange(startPos+1, startPos+1);//设置光标位置
        }
    });
});

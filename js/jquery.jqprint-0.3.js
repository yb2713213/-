// -----------------------------------------------------------------------
// Eros Fratini - eros@recoding.it
// jqprint 0.3
//
// - 19/06/2009 - some new implementations, added Opera support
// - 11/05/2009 - first sketch
//
// Printing plug-in for jQuery, evolution of jPrintArea: http://plugins.jquery.com/project/jPrintArea
// requires jQuery 1.3.x
//
// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
//------------------------------------------------------------------------

(function($) {
    var opt;

    $.fn.jqprint = function (options) {
        opt = $.extend({}, $.fn.jqprint.defaults, options);

        var $element = (this instanceof jQuery) ? this : $(this);
        
        if (opt.operaSupport && $.browser.opera) 
        { 
            var tab = window.open("","jqPrint-preview");
            tab.document.open();

            var doc = tab.document;
        }
        else 
        {
            var $iframe = $("<iframe  />");
        
            if (!opt.debug) { $iframe.css({ position: "absolute", width: "0px", height: "0px", left: "-600px", top: "-600px" }); }

            $iframe.appendTo("body");
            var doc = $iframe[0].contentWindow.document;
        }
        
        if (opt.importCSS)
        {
            if ($("link[media=print]").length > 0) 
            {
                $("link[media=print]").each( function() {
                    doc.write("<link type='text/css' rel='stylesheet' href='" + $(this).attr("href") + "' media='print' />");
                });
            }
            else 
            {
                $("link").each( function() {
                    doc.write("<link type='text/css' rel='stylesheet' href='" + $(this).attr("href") + "' />");
                    console.log($(this).attr("href"))
                });
            }
        }
        var canvass = document.querySelectorAll('canvas');
        var isNeedRemove = document.querySelectorAll('.isNeedRemove');
        //canvass echars图表转为图片
        for (var k4 = 0; k4 < canvass.length; k4++) {
            if (isNeedRemove.length == 0) {
                var imageURL = canvass[k4].toDataURL("image/png");
                var img = document.createElement("img");
                img.src = imageURL;
                img.setAttribute('style', 'max-width: 100%;');
                img.className = 'isNeedRemove';
                canvass[k4].style.display = 'none';
                // canvass[k4].parentNode.style.width = '100%'
                // canvass[k4].parentNode.style.textAlign = 'center'
                canvass[k4].parentNode.insertBefore(img, canvass[k4].nextElementSibling);
            }
        }
        
        if (opt.printContainer) { doc.write($element.outer()); wait();}
        else { $element.each( function() { doc.write($(this).html());wait(); }); }
        
        doc.close();

        (opt.operaSupport && $.browser.opera ? tab : $iframe[0].contentWindow).focus();
        setTimeout( function() { (opt.operaSupport && $.browser.opera ? tab : $iframe[0].contentWindow).print(); if (tab) { tab.close(); } }, 1000);
    }
    
    $.fn.jqprint.defaults = {
		debug: false,
		importCSS: false,
		printContainer: true,
		operaSupport: false
	};

    // Thanks to 9__, found at http://users.livejournal.com/9__/380664.html
    jQuery.fn.outer = function() {

      return $($('<div></div>').html(this.clone())).html();
    }
    function wait(){
        $("canvas").show();
        $(".isNeedRemove").remove();
    }

})(jQuery);
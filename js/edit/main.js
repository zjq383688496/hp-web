var editACE = editACE || {};
;(function(){
	editACE.namespace = function(name, sep) {
		var s = name.split(sep || '.'),
			d = {},
			o = function(a, b, c) {
				if (c < b.length) {
					if (!a[b[c]]) {
						a[b[c]] = {};
					}
					d = a[b[c]];
					o(a[b[c]], b, c + 1);
				}
			};
		o(window, s, 0);
		return d;
	};
	editACE.test ={
		sss:function(){
			console.log(2342424);
		}
	}
})(jQuery);
;(function($) {
  $.extend({
     scrollLoad:function(eve){
		//load img
		$(window).bind("scroll", function(event){
			var $img =eve.find('img.load');
            for(var i=0; i<$img.length; i++){
                if($img.eq(i).offset().top <= parseInt($(window).height()) + parseInt($(window).scrollTop())){
                	var _src =$img.eq(i).attr("src");
                    if(typeof(_src) == 'undefined'){
                        var lazyloadsrc=$img.eq(i).attr("lazyload");
                        $img.eq(i).attr("src",lazyloadsrc);
                        $img.eq(i).removeAttr("lazyload");
                        $img.eq(i).addClass('imageshow');
                    }
                }
                if($img.eq(i).offset().top  > parseInt($(window).height()) + parseInt($(window).scrollTop())){
                    l=i;
                    break;
                }
            }
		 });
	 },
	 Waterfall :function(evn){
		var margin = 20;//设置间距
		var lump = evn;//区块名称
		var	lump_W = lump[0].offsetWidth+margin;
		var lpFun ={
			lumpFun : function(){
				var h=[];
				var n = 4
				for(var i = 0; i< lump.length;i++) {
					lump_H = lump[i].offsetHeight;
					if(i < n) {
						h[i]=lump_H;
						lump.eq(i).css({
							"position" : "absolute",
							"top" : 0,  
							"left" : i * lump_W   
						});
						}
					else{
						min_H =Math.min.apply(null,h) ;
						minKey = lpFun.getarraykey(h, min_H);
						h[minKey] += lump_H+margin ;
						lump.eq(i).css({
							"position" : "absolute",
							"top" : min_H+margin, 
							"left" : minKey * lump_W
						});
					}
					
				}
			},
			getarraykey :function (s, v) {for(k in s) {if(s[k] == v) {return k;}}}
		}
		lpFun.lumpFun();
		/*浏览器窗口改变*/
		window.onresize = function() {lpFun.lumpFun();};
	 },
	 scroll: function (par) { //滚动加载
			$(window).bind('scroll', function () {
				var st = Math.round($(window).scrollTop());
				var ch = $(window).height();
				var bh = $(document.body).outerHeight(true);

				var winH = $(window).height(); //页面可视区域高度
				var pageH = $(document.body).height();  
		        var scrollT = $(window).scrollTop(); //滚动条top   
		        var wh = (pageH - winH - scrollT) / winH;

				var srollPos = $(window).scrollTop();
        		var totalheight = parseFloat($(window).height()) + parseFloat(srollPos);

				if($(document).height() <= totalheight){
					if (typeof(par.callback) === 'function'){
						 par.callback(st, ch, bh);
					} 
				}
			});
		},
		loadingShow: function () {
			if ($('.global-loader').length) $('.global-loader').remove();
			var loaderstr=$('<div class="global-loader"></div>');
			$("body").append(loaderstr);
			setTimeout(function(){
				loaderstr.addClass("loader-show");
			},20);
		},
		loadingHide: function () {
			if ($('.global-loader').length) {
				var loaderstr=$(".global-loader");
				loaderstr.removeClass("loader-show").addClass("loader-hide");
				setTimeout(function(){
					loaderstr.remove();
				}, 500);
			}
		},
		checkD : function(){
	    	var str="";
	    	var $cked = $("input[name='subBox']:checked");
	        $cked.each(function(i,e){
	        	var dLen = $cked.length;
	        	if(dLen >1){
	                str += $(this).val() +",";
	        	}else{
	        		str += $(this).val();
	        	}
	        })
	        str.split(",");
	        return str;
	    },
	    addUrlPara : function(name, value) {//url添加参数
			var currentUrl = window.location.href.split('#')[0];
			if (/\?/g.test(currentUrl)) {
				if (/name=[-\w]{4,25}/g.test(currentUrl)) {
					currentUrl = currentUrl.replace(/name=[-\w]{4,25}/g, name + "=" + value);
				} else {
					currentUrl += "&" + name + "=" + value;
				}
			} else {
				currentUrl += "?" + name + "=" + value;
			}
			if (window.location.href.split('#')[1]) {
				window.location.href = currentUrl + '#' + window.location.href.split('#')[1];
			} else {
				window.location.href = currentUrl;
			}
		},
		getQueryString : function(name) {
		    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		    var r = window.location.search.substr(1).match(reg);
		    if (r != null) return unescape(r[2]); return null;
		}
   });
})(jQuery);
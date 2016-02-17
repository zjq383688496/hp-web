//ontouchstart实现手机触屏中的hover效果
function mouseout(obj) {
	var className = "* hover";
	var _ecname = obj.className;
	if (_ecname.length == 0) return;
	if (_ecname == className) {
		obj.className = "";
		return
	}
	if (_ecname.match(new RegExp("(^|\s)" + className + "(\s|$)"))) obj.className = _ecname.replace((new RegExp("(^|\s)" + className + "(\s|$)")), "")
}
function hover(obj) {
	if (!obj) return;
	var className = " hover"
	var _ecname = obj.className;
	if (_ecname.length == 0) {
		obj.className = className;
		return
	}
	if (_ecname == className || _ecname.match(new RegExp("(^|\s)" + className + "(\s|$)"))) return;
	obj.className = _ecname + "" + className
}


//获取分享参数 
function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
} 
var myurl=GetQueryString("shareUserId");
if(myurl !=null && myurl.toString().length>1)
{
    
}

 
 

$(function(){ 
        
		if ( $(".video").length > 0 ) {
        $('.hasvideo').addClass("wp-mobile");
        }
		
        $(window).scroll(function(){ 
		var st = $(window).scrollTop(); 
		if( st > 50){
			$('.box_choice_find').addClass('m-test');  
		}else{
			$('.box_choice_find').removeClass('m-test');
		};
	    });
		
		$(".r-userinfo-logout").on("click",function(){
		$(".navmore,.page-mark").removeClass('show'); 
		$("body").removeClass('bd-left');
		$(".navmore,.page-mark").unbind();
        }); 
		
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        if (!isAndroid && !isiOS) {
		}
		else{
		
		//产品查看
		var proH = $("#t_div").height;
		$("#t_div").css("height",proH);
		
		//新开窗口
		$(".container .art_box.filament-ring li .art_img a,.container .art_box li .text .user").on("click","a",function(){ 	 
		$(this).removeAttr("target");
		});
		
		//弹出层禁止滚动 
		if ( $("#util-overlayer").length > 0 ) {
        $("body").css("overflow","hidden");
        }else{
		$("body").removeAttr("style");	
		}  
		
		//商品分类
			 
		$("#fenlei").append("<a class='btn-pro-cate'><font></font><span>"+LANGUAGE_NOW.new001.t0003+"</span></a><div class='pro-cate-box'><i class='iconfont icon-close-s2'></i></div>");
		$("a.btn-pro-cate").on("click",function(){
		    //$(".fenlei-product,.pro-cate-box").show;
			//$(this).parent().find(".fenlei-product").show; 
			//$(this).next().show;
			$(this).parent().addClass("open-cate");
			$("body").css("overflow","hidden");
			
			$(".icon-close-s2").on("click",function(){
			$(this).parent().parent().removeClass("open-cate"); 
		    $('.fenlei-product dt').removeClass("hover");
			$("body").removeAttr("style");
			});
			
		});
		
		//商品分类切换
		$(".box_choice dl.fenlei-product").on("click","dt",function(){ 
		$(this).addClass("hover").parent().siblings().find("dt").removeClass("hover");
		});
		//商品分类点击二级关闭
		$(".box_choice dl.fenlei-product dd").on("click","a",function(){ 	 
		$(this).parent().prev().removeClass("hover"); 
		$(this).parent().parent().parent().removeClass("open-cate");
		$("body").removeAttr("style");
		});
		
		
		
		 
		$(".box_choice dt.shopSx").on("click",function(){
			$(this).parent().addClass("hover");
		    $(this).next().removeClass("hide");
			//$(this).parent().prepend("<i class='iconfont icon-close-s2'></i>"); 
			/*$(".icon-close-s2").on("click",function(){
		    $('.box_choice dl,.box_choice dt').removeClass("hover");
			$(this).parent().find(".icon-close-s2").remove();
			window.location.reload()
			});*/   
			if ( $(".allcate").length == 0 ) {
		$(this).next().find("li:first-child div").prepend("<a data-pid='72' tag='0' class='allcate'><c>全部</c><tt>男士定制</tt></a>");
			} 
		});
		
		//商品分类切换
		$(".box_choice dd.liwu div.mune-L ul li").on("click","a",function(){ 
		//$(this).addClass("active").parent().siblings().find("span").removeClass("active");
        $(this).parent().find("div").show().parent().siblings().find("div").hide();
		$('.box_choice dd.liwu').removeClass("hide");
		var datapid = $(this).attr("data-pid");
		var catename = $(this).find("tt").html();
		var allcates = $(this).parent().find("div a:first-child").attr("class"); 
		if (allcates) { 
		}
		else{
			$(this).parent().find("div").prepend("<a data-pid="+datapid+" tag='0' class='allcate'><c>全部</c><tt>"+catename+"</tt></a>");
			}
        });
		
		$(".box_choice dd.liwu div.mune-L ul li div").on("click","a",function(){ 	 
		$('.box_choice dl,.box_choice dt').removeClass("hover");
		$(".box_choice dl").find(".icon-close-s2").remove();
		//$('.box_choice dl').find(".icon-close-s2").remove();
		});
		
		
		//兴趣  
		$(".box_choice dt.shx").on("click",function(){ 
		$(this).parent().addClass("hover");
		//$(this).next().removeClass("hide"); 
		//$(this).unbind(mouseenter).unbind(mouseleave); 	
        });
		 
		//兴趣二级  
		//$(".box_choice dd.shaixuan").on("click","a",function(){
		//$(this).parent().parent().removeClass("hover");
		//$(this).parent().prev().removeClass("hover");
		//var txtval = $(this).attr("data-name"); 
		//$(this).parent().prev().html("<font></font><span>"+txtval+"<i class='iconfont icon-close-s'></i></span>");
		//$(this).parent().prev().html("<font></font><span>"+txtval+"</span>");
        // }); 
		
		$(".box_choice dl.fenlei-special").on("click","a",function(){
		$(this).parent().parent().removeClass("hover");
		$(this).parent().prev().removeClass("hover");
        }); 
		
		  
			 
	 }	 
});
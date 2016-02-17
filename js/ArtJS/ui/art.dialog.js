/**
*  art dialog plugins
*   author  eric
*   created  2016.1.21
**/
(function(win){
	'use strict';
	var ArtDialog={
		/**
		 *  demo :   toast("上传成功！");
		     toast({close:false,closeTime:1000});
		**/
		curSelector:"",
		toast:function(){//
			var options={
				close:true,//是否自动关闭窗口 true为自动 false为不自动手动关闭
				closeTime:1000,//自动关闭窗口时间  默认1000ms 关闭
				msg:"toast消息提示窗！", //消息提示消息
				css:{"background":"#000",color:"#fff",width:"auto"},
				callback:function(){
					if(console){
						console.log("消息提示消息");
					}
				}
			}
			var args=arguments;
			if(args.length>0){
				if(typeof(args[0])==="string"){
					options["msg"]=args[0];
				}else if(isJson(args[0])){
					if(args[0]){
						for(var i in args[0]){
							options[i]=args[0][i];
						}
					}
				}
			}
			showToast(options);
		},
		//关闭toast
		closeToast:function(){
			var options={};
			if(arguments.length>0){
				options=arguments[0];
			}
			hideToast(options);
		},
		//关闭confirm
		closeConfirm:function(){
			var options={};
			if(arguments.length<1){
				options=arguments[0];
			}
			hideConfirm();
		},
		/**
		*  显示确认
		*/
		confirm:function(){
			var options={
				title:"确认窗口",//窗口标题
				msg:"config消息提示窗！", //消息提示消息
				ok:true,//是否显示OK按钮
				okTxt:"Ok",//oK按钮文字
				cancel:true,//是否显示取消按钮
				cancelTxt:"Cancel",//取消按钮文字
				cancelCall:function(){
					if(console){
						console.log("取消按钮消息");
					}
				},
				okCall:function(){
					if(console){
						console.log("确认按钮消息");
					}
				}
			}
			var args=arguments;
			if(args.length>0){
				if(typeof(args[0])==="string"){
					options["msg"]=args[0];
				}else if(isJson(args[0])){
					if(args[0]){
						for(var i in args[0]){
							options[i]=args[0][i];
						}
					}
				}
			}
			showConfirm(options);
		},
		imgPreview:function(options){
			showImgPreview(options);
		},
		closeImgPreview:function(){
			closePreview();
		}
	};

	/**
	判断是否为json对象
	*/
	function isJson(obj){
		var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
		return isjson;
	}

	/**
	* 显示图片预览
	*/
	function showImgPreview(options){
		showCover();
		// var sc=$("body").scrollTop();
		ArtDialog.curSelector=".art-img-preview";
		$(".art-img-prev").off("click");
		$(".art-img-next").off("click");
		if($(".art-img-preview").length>0){
			var htmlArr=[];
			var imgs=options.imgs;
			if(imgs){
				var len=imgs.length;
				for(var i=0;i<len;i++){
					htmlArr.push('<li><img src="'+imgs[i]+'" alt=""></li>');
				}
			}
			$("#slider").html(htmlArr.join(""));
			$(".art-img-preview").show();
		}else{
			var htmlArr=['<div class="art-img-preview">'];
			htmlArr.push('<div class="art-img-head">');
			htmlArr.push('<h3></h3>');
			htmlArr.push('<i class="ico-del">×</i>');
			htmlArr.push('</div>');
			htmlArr.push('<div class="art-img-body" id="sliderContainer">');
			htmlArr.push('<div class="art-img-prev">&lt;</div>');
			htmlArr.push('<div class="art-img-slider-box slider-box">');
			htmlArr.push('<ul class="art-img-slider" id="slider">');
			var imgs=options.imgs;
			if(imgs){
				var len=imgs.length;
				for(var i=0;i<len;i++){
					htmlArr.push('<li><img src="'+imgs[i]+'" alt=""></li>');
				}
			}
			htmlArr.push('</ul>');
			htmlArr.push('</div>');
			htmlArr.push('<div class="art-img-next">&gt;</div>');
			htmlArr.push('</div>');
			htmlArr.push('</div>');
			// htmlArr.push('<h3>'+options.msg+'</h3>');
			$("body").append(htmlArr.join(""));
			$(".art-img-preview").on("click",".ico-del",function(){
				if(options.cancelCall){
					options.cancelCall();
				}
				closePreview();
			});
		}
		// $(".art-img-preview").css("marginTop",sc);
		if(options.callback){
			options.callback();
		}
		var width=$(".art-img-preview").outerWidth(),height=$(".art-img-preview").outerHeight();
		console.log("art-img-preview---width="+width+",height="+height);
		$(".art-img-preview").css({"marginTop":-height/2,"marginLeft":-width/2});
	}

	function closePreview(){
		$(".art-img-preview").fadeOut();
		hideCover();
	}

	/**
	* 显示toast
	*/
	function showToast(options){
		ArtDialog.curSelector=".art-toast";
		showCover();
		// var sc=$("body").scrollTop();
		$(".art-toast").off("click",".ico-del");
		if($(".art-toast").length>0){
			$(".toa-body h3").html(options.msg);
			if(options.close){
				//存在删除按钮则隐藏
				if($(".art-toast .ico-del").length>0){
					$(".art-toast .ico-del").hide();
				}
				//自动关闭
				setTimeout(function(){
					hideToast(options);
				},options.closeTime);
			}else{
				//不存在删除则创建出来
				if($(".art-toast .ico-del").length<1){
					$(".toa-body").append('<i class="ico-del">×</i>');
				}else{
					//若需要主动关闭 存在就显示出来
					$(".art-toast .ico-del").show();
				}
				$(".art-toast").on("click",".ico-del",function(){
					hideToast(options);
				});
			}
			$(".art-toast").show();
		}else{
			var htmlArr=['<div class="art-toast">'];
			htmlArr.push('<div class="toa-body">');
			htmlArr.push('<h3>'+options.msg+'</h3>');
			// htmlArr.push('<i class="ico-del">×</i>');
			htmlArr.push('</div></div>');
			$("body").append(htmlArr.join(""));
			if(options.close){
				setTimeout(function(){
					hideToast(options);
				},options.closeTime);
			}else{
				$(".toa-body").append('<i class="ico-del">×</i>');
				$(".art-toast").on("click",".ico-del",function(){
					hideToast(options);
				});
			}
		}
		if(options.icoCss){
			$(".art-toast .ico-del").css(options.icoCss);
		}else{
			$(".art-toast .ico-del").removeAttr("style");
		}
		if(options.dialogCss){
			$(".art-toast").css(options.dialogCss);
		}else{
			$(".art-toast").removeAttr("style");
		}
		if(options.bodyCss){
			$(".art-toast h3").css(options.bodyCss);
		}else{
			$(".art-toast h3").removeAttr("style");
		}
		var width=$(".art-toast").outerWidth(),height=$(".art-toast").outerHeight();
		console.log("art-toast---width="+width+",height="+height);
		$(".art-toast").css({"marginTop":-height/2,"marginLeft":-width/2});
		// $(".art-toast").css("marginTop",sc);
		// return html;
	}

//关闭toast
	function hideToast(options){
		hideCover();
		$(".art-toast").fadeOut();
		if(options.callback){
			options.callback();
		}
	}
//关闭背景
	function showCover(){
		if($(".art-bg-cover").length>0){
			$(".art-bg-cover").fadeIn();
		}else{
			var htmlArr=['<div class="art-bg-cover"></div>'];
			$("body").append(htmlArr.join(""));
			$(".art-bg-cover").on("click",function(){
				hideCover();
			});
		}
		$("body").css({"overflow":"hidden"});
	}
// 显示背景
	function hideCover(){
		$(".art-bg-cover").fadeOut();
		$("body").css({"overflow":"auto"});
		if(ArtDialog.curSelector){
			$(ArtDialog.curSelector).fadeOut();
		}
	}

//显示确认弹窗
	function showConfirm(options){
		showCover();
		ArtDialog.curSelector=".art-dialog";
		// var sc=$("body").scrollTop();
		$(".art-dialog").off("click",".btn-ok");
		$(".art-dialog").off("click",".btn-cancel");
		if($(".art-dialog").length>0){
			if(options.title){
				if($(".dia-head").length>0){
					$(".dia-head h3").html(options.title);
				}else{
					$(".dia-body").before('<div class="dia-head"><h3>'+options.title+'</h3></div>');
				}
			}else{
				$(".dia-head").remove();
			}
			$(".dia-body").html(options.msg);

			if($(".dia-foot .btn-cancel").length>0){
				if(options.cancel){//存在cancel按钮
					$(".dia-foot .btn-cancel").html(options.cancelTxt);
				}				
			}else{
				$(".dia-foot").append('<button class="btn-cancel" type="button">'+options.cancelTxt+'</button>');
			}
			$(".art-dialog").on("click",".btn-cancel",function(){
				hideConfirm();
				options.cancelCall();
			});
			if($(".dia-foot .btn-ok").length>0){
				if(options.ok){//存在cancel按钮
					$(".dia-foot .btn-ok").html(options.okTxt);
				}
			}else{
				$(".dia-foot").append('<button class="btn-ok" type="button">'+options.okTxt+'</button>');
			}
			$(".art-dialog").on("click",".btn-ok",function(){
				hideConfirm();
				options.okCall();
			});
			$(".art-dialog").show();
		}else{
			var htmlArr=['<div class="art-dialog">']
			if(options.title){
				htmlArr.push('<div class="dia-head">');
				htmlArr.push('<h3>'+options.title+'</h3>');
				// htmlArr.push('<i class="ico-del">×</i>');
				htmlArr.push('</div>');
			}
			htmlArr.push('<div class="dia-body">');
			htmlArr.push(options.msg);
			htmlArr.push('</div>');
			htmlArr.push('<div class="dia-foot">');
			htmlArr.push('</div>');
			htmlArr.push('</div>');
			$("body").append(htmlArr.join(""));
			if(options.cancel){//存在cancel按钮
				$(".dia-foot").append('<button class="btn-cancel" type="button">'+options.cancelTxt+'</button>');
				$(".art-dialog").on("click",".btn-cancel",function(){
					hideConfirm();
					options.cancelCall();
				});
			}
			if(options.ok){//存在ok按钮
				$(".dia-foot").append('<button class="btn-ok" type="button">'+options.okTxt+'</button>');
				$(".art-dialog").on("click",".btn-ok",function(){
					hideConfirm();
					options.okCall();
				});
			}
		}
		var width=$(".art-dialog").outerWidth(),height=$(".art-dialog").outerHeight();
		console.log("art-dialog,width="+width+",height="+height);
		$(".art-dialog").css({"marginTop":-height/2,"marginLeft":-width/2});
		// $(".art-dialog").css("marginTop",sc);
	}

//关闭确认弹窗
	function hideConfirm(){
		hideCover();
		$(".art-dialog").fadeOut();
	}

	win["ArtDialog"]=ArtDialog;
})(window);
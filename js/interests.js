ArtJS.load(['header'], function () {
	var BanInter ={
		API:{
			getInterset: '/memberSite/members/getInterset',
			getType: '/topicSocSite/topic/getTypeBasesByPage',
			getAddInter: '/topicSocSite/topic/addTypeUserInterest',
		},
		init:function(){
			var me = this;
			$("<link>")
			    .attr({ rel: "stylesheet",
			        type: "text/css",
			        href: "/css/module/inter.css"
			    }).appendTo("head");
			me.interNologin();
		},
		interNologin:function(){
			$.getJSON(BanInter.API.getInterset,function(data){
				var iTrue = data.result;
				var inter =ArtJS.cookie.get("inter");
				if(ArtJS.login.checkUserStatus()){
					if(!iTrue){
						BanInter.interestList.interAjax();
						$('body').css({"overflow":"hidden"});
					}
				}
			});
		},
		interestList: {//兴趣
			interAjax: function(){
				var data={
					source: "web",
					page:"index",
					abbr:ArtJS.server.language,
					indexTag:2
				}
				$.ajax({
					async: false,
					url: BanInter.API.getType,
					type: "get",
					dataType: 'json',
					data:data,
					success: function (response) {
						if(response.code && response.code==200){
							$(response.result).each(function (index, v) {
								var _id = v.id;
								var text = BanInter.interestClassify(index, v);

								var $bd = $('body');
								$bd.after(text);
								BanInter.interestList.interBinEvt();
								BanInter.interestList.BinEvtFun();
							});
						}
					}
				});
			},
			interBinEvt: function(){
				//兴趣选择
				var $interUl =$("#interest ul");
				$interUl.find(".list-box").unbind("click").click(function () {
					var that = $(this);
					var $wt = $('.w-but');
					that.toggleClass("active");
					var len = $interUl.find("div.active").length;
					if (len >= 1) {
						$wt.addClass('act');
						$wt.find('font').remove();
					} else if (len < 1) {
						$wt.removeClass('act');
					}
				});
				$("#interest #Shaer_colse").click(function () {
					$("#interest,.interest-box").remove();
					$('body').css({"overflow": "auto"});
				});
			},
			BinEvtFun:function(){//兴趣选择
				var $inter =$('#i-w-but');
				$inter.click(function(event) {	 
					var that = $(this);
					var _typeIds = BanInter.typeIds();
					_typeIds = _typeIds.toString();
				   	if(_typeIds.length ==0){
					   	that.before('<font>'+LANG.TEXT.T109+'</font>');
					  	return;
				   	}
					var data={
						typeIds:_typeIds,//分类id
						userId:ArtJS.cookie.get("User_id")//用户id
					}
					$.ajax({
					 	type: "POST",
					 	url:BanInter.API.getAddInter,
					 	data:data,
					 	dataType: "json",
					 	success: function (data) {
						 	if(data.code ==200){
							 	ArtJS.cookie.set("inter","ture");
							 	$("#interest,.interest-box").remove();
							 	$('body').css({"overflow":"auto"});
						  	}
					 	}
				   	});
				});
			}
		},
		//分类interest
		interestClassify :function(index,v) {
		    var str = "";
		    str +="<div class='interest-box'></div>"
		        +"<div class='interest' id='interest'>"
		        //+"<div class='Shaer_colse_out'><i class='iconfont icon-close-b'></i></div>"
		        +"<div class='w-400'>"+LANG.TEXT.T107+"</div>"
		        +"<div class='w-tag'>"
		        +"<ul>"
		            if (v.id == 207) {
		                var len =v.children.length;
		                str += "<li>"
		                for (var i = 0; i <len; i++) {
		                    if(v.children[i].id!=218 && v.children[i].id!=345){
		                        var icon =v.children[i].icon;
		                        str += "<div class='list-box'>"
		                            +"<i style='background-image: url("+ArtJS.server.image+""+icon+"?imageView2/1/w/86/h/86/q/90)'></i>"
		                            +"<em class='iconfont icon-check'></em>"
		                            +"<span ClassifyId=" + v.children[i].id + ">" + v.children[i].typeName + "</span>"
		                            +"</div>";
		                    }
		                }
		                str += "</li>"
		            }
		    str += "</ul>"
		        +"</div>"
		        +"<div class='w-but'>"
		        +"<input type='button' id='i-w-but' value='"+LANG.BUTTON.ENTER+"'>"
		    +"</div>"
		    +"</div>"
		    return str;
		},
		typeIds:function(){
			var typeId=$("#interest .list-box.active").map(function() {
				return $(this).find(">span").attr("classifyid");
			}).get().join(',');
			return typeId;
		}
	}
	BanInter.init();
});
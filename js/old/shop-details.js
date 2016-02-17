ArtJS.load.add('shop-details-css', {"css": ArtJS.server.art+'/css/shop-details.css'});
angular.module("shop-details",['ngRoute','shear-mod','report-mod','plug-in-unit']).controller('shopDetailsCtr', ['$scope','$compile','$timeout','$http', function($scope,$compile,$timeout,$http){
	$scope.img_url=ArtJS.server.image;
	$scope.LANGUAGE_NOW=LANGUAGE_NOW;
    //购物车数量
    $scope.number=0;
	//修改背景图
	$scope.changSvgAbbreviated=function(type){
		$timeout(function(){
			$scope.GoodsDetail.svgSelect=type;
			var str='';
			if(type==1){
				str=$scope.GoodsDetail.svgContent;
			}else if($scope.GoodsDetail.backImguri!=null){
				str='<img src="'+$scope.img_url+$scope.GoodsDetail.backImguri+'?imageView2/2/w/320/q/90">';
			}
			$scope.GoodsDetail.svgPreview=str;
		});
	}
	//赋值颜色
	$scope.setGoodsColor=function(data){
		for (var i in data) {
            $scope.GoodsDetail[i] = data[i];
        }
        $scope.GoodsDetail.customFlag=data.customFlag;
    	$scope.setSvg(data);
	}
	//转svg
	$scope.setSvg=function(data){
    	var svgPreview=null,
    		svgAbbreviated=null,
    		svgstr=data.svgContent;
		if(data.uri!=null){
			if (data.uri.startWith('http')) {
				var imguri = data.uri.split(',')[0];
				svgPreview='<img src="'+imguri+'?imageView2/2/w/320/q/90">';
	    		svgAbbreviated='<img src="'+imguri+'?imageView2/2/w/50/q/90">';
			} else {
				svgPreview='<img src="'+$scope.img_url+data.uri+'?imageView2/2/w/320/q/90">';
		    	svgAbbreviated='<img src="'+$scope.img_url+data.uri+'?imageView2/2/w/50/q/90">';
			}
		}else if(svgstr!=null && svgstr!="" && svgstr!=undefined){
	    	svgPreview=$("<div/>").append($(svgGop.recombineSvg({
	    		svg:svgstr,
	    		p_w:320,
	    		mouseStar:false
	    	}).svg)).html();

	    	svgAbbreviated=$("<div/>").append($(svgGop.recombineSvg({
	    		svg:svgstr,
	    		p_w:50,
	    		mouseStar:false
	    	}).svg)).html();
    	}
    	$scope.GoodsDetail.svgPreview=svgPreview;
    	$scope.GoodsDetail.svgContent=svgPreview;
    	$scope.GoodsDetail.svgAbbreviated=svgAbbreviated;

    	if(svgAbbreviated==null){
    		$scope.changSvgAbbreviated(2);
    		$scope.GoodsDetail.svgSelect=2;
    	}else{
    		$scope.GoodsDetail.svgSelect=1;
    	}
	}
	//赋值基本信息
    $scope.setGoodsDetail=function(data){
    	$scope.GoodsDetail=data;
    	$.each(data.threeCategoryInfo,function(i,item){
    		if(item.templetId==data.templetId){
				$scope.setGoodsColor(item);
    			return;
    		}
    	});
    	if(!$scope.GoodsDetail.categoryId && data.threeCategoryInfo.length>0){
    		$scope.setGoodsColor(data.threeCategoryInfo[0]);
    	}
    	$scope.setSvg($scope.GoodsDetail);
    	$(".shopDetails").animate({"scrollTop":0},230);
    }
	//相关灯丝圈
    $scope.getGoodsTopics=function(id){
    	$http.get("/goodsSite/goods/getGoodsTopics?"+$.param({
	    	goodsId:id,//商品
			pageNo:1,
			pageSize:3,
            abbr:ArtJS.server.language
	    })).success(function(responseJSON) {
	    	if(responseJSON.code==200){
	    		$scope.GoodsTopics=responseJSON.result.pageItems;
	    	}
	    });
    }
    //获取商品
    $scope.getGoodsDetail=function(type,id){
    	request('shopId',id);
    	$http.get("/goodsSite/goods/getGoodsDetail?"+$.param({
	    	goodsIds:id,//商品
	    	loadSource:type,
            abbr:ArtJS.server.language
	    })).success(function(responseJSON) {
	    	if(responseJSON.code==200){
		    	if(responseJSON.result.suggestGoods!=undefined){
					if(type!=1){
						delete responseJSON.result.suggestGoods;
					}else{
						var suggestGoods=[];
						var sI=0;
			    		$.each(responseJSON.result.suggestGoods,function(i,item){
			    			if(item.uri!=null){
			    				suggestGoods[sI]=item;
			    				item.svgView='<img src="'+$scope.img_url+item.uri+'?imageView2/2/w/240/q/90">';
			    			}else if(item.svgContent!=undefined && item.svgContent!=null && item.svgContent!="" && item.svgContent.indexOf("<svg")>=0){
			    				suggestGoods[sI]=item;
			    				var svgs=svgGop.recombineSvg({
					        		svg:item.svgContent,
					        		p_w:240,
					        		mouseStar:false
					        	}).svg;
					        	item.svgView=$("<div/>").append($(svgs)).html();
			    			}
			    			sI+=1;
			    		});
			    		$scope.suggestGoodsData=suggestGoods;
						$scope.scrollSuggest();
					}
					$scope.setGoodsDetail(responseJSON.result);
				}
	    	}
	    });
    }
    //获取潮品
    $scope.getTideProductDetail=function(type,id){
    	request('influxGoods',id);
    	$http.get("/goodsSite/arts/getTideProductDetail?"+$.param({
	    	artsId:id,
            abbr:ArtJS.server.language
	    })).success(function(responseJSON) {
	    	if(responseJSON.code==200){
	    		var result=responseJSON.result;
		    	if(result.suggestGoods!=undefined){
					if(result.uri!=null){
	    				result.svgView='<img src="'+$scope.img_url+result.uri+'?imageView2/2/w/240/q/90">';
	    			}
	    			$.each(result.threeCategoryInfo,function(i,item){
	    				if(item.uri==null||item.uri==''){
	    					item.uri=result.uri;
	    				}else{
	    					if(item.uri.indexOf(',')>=0){
	    						item.uri=item.uri.split(',')[0];
	    					}
	    				}
	    			});
					result.suggestGoods[0]=result;
					$scope.setGoodsDetail(result);
				}
	    	}
	    });
    }

    //弹出举报方法
    $scope.ShopRoport=function(e){
    	e.stopPropagation();
    	if($scope.shopType==1){
			$scope.showReport(request('influxGoods'),"Influx");
		}else{
			$scope.showReport(request('shopId'),"Svg_Goods");
		}
    }
    //弹出分享方法
    $scope.ShopShear=function(e,result){
		e.stopPropagation();
		ArtJS.login.getUser(function(userData){
			$scope.userData=userData;
		});
		var nikeName=$scope.userData!=undefined?$scope.userData.nikeName:'';
		var summary=nikeName+" "+LANGUAGE_NOW.shear.shop+"，"+result.goodsName+"-"+result.ownerNickName+" "+LANGUAGE_NOW.shear.come;
        $scope.showShear({
            id:result.id,
            summary: summary,
            pic:$scope.img_url+result.uri,
            shareType:($scope.shopType==1?'Influx':'Svg_Goods')
        });
    }
    //定义滚动加载相关商品方法
    $scope.scrollSuggest=function(){
    	$scope.suggestGoods=[];
    	function setS(){
    		if($scope.suggestGoodsData!=undefined){
		    	var idx=($scope.suggestGoods==undefined ? 0 : $scope.suggestGoods.length),
		    		addnum=29;
		    	if(($scope.suggestGoodsData.length-1)-idx<=30){
		    		addnum=($scope.suggestGoodsData.length-1)-idx;
		    	}
		    	$timeout(function(){
			    	if(idx<$scope.suggestGoodsData.length-1){
				    	for(var i=idx;i<=idx+addnum;i++){
							$scope.suggestGoods[i]=$scope.suggestGoodsData[i];
						}
					}
				});
			}
		}

    	$(".shopDetails").scroll(function(){
    		if($(".shopDetails").scrollTop()+$(window).height()>=$("#shopDetails").outerHeight()+80-100){
				setS();
    		}
    	}).scroll();
    }

	var buy_f_box_panle=$(".buy-f-box-panle"),
		buy_f_box=buy_f_box_panle.find(".buy-f-box"),
		youhua_panle=$(".youhua-panle"),
		youhua=youhua_panle.find(".youhua");

    //赋值颜色
	$scope.setGoodsColorGet=function(data){
		if($scope.customSize.type==2) return;
		$scope.setGoodsColor(data);
		$scope.showYouhua(data);
	}
    //弹出尺码
	$scope.showYouhua=function(data){
		if($scope.shopType==1){
			var three="";
			if($scope.GoodsDetail.threeCategoryInfo.length>0){
				$.each($scope.GoodsDetail.threeCategoryInfo,function(i,item){
					if(item.templetId==$scope.GoodsDetail.templetId){
						three=item;
						return;
					}
				});
			}
			if(three=="") return;
			var cartArr={"propertyInfos":[],"fourCategoryInfo":[{
				"id":three.categoryId,
				"model":null,
				"parentCategoryId":three.parentCategoryId,
				"categoryId":three.categoryId,
				"categoryNameOne":three.categoryNameOne,
				"categoryName":three.categoryName,
				"categoryIdFour":three.categoryIdFour,
				"colorTemplet":three.colorTemplet,
				"templetId":three.templetId,
				"uri":three.uri,
				"svgContent":three.svgContent,
				"backImguri":three.backImguri,
				"commission":three.commission,
				"width":three.width,
				"hight":three.hight,
				"costPrice":three.costPrice,
				"sellPrice":three.sellPrice,
				"customFlag":three.customFlag
			}]};
			$scope.setShopCatData(cartArr);
		}else if($scope.shopType==2){
			var categoryId;
			if($scope.GoodsDetail==undefined || $scope.GoodsDetail.categoryId==undefined) {
				$("body").alertTips({
	                titles: LANGUAGE_NOW.goods.selloutMsg,//"sorry！当前商品暂时不能购买",
	                speed: 1000
	            });
				return;
			}else{
				categoryId=$scope.GoodsDetail.categoryId;
			}
			var ajData={
					artsId:$scope.GoodsDetail.artsId,
					categoryName:$scope.GoodsDetail.goodsName,
					categoryId:categoryId,
					threeCategoryName:$scope.GoodsDetail.categoryName,
	            	abbr:ArtJS.server.language
				};
			$scope.shopCatData={};
			$http.get('/goodsSite/goods/getGoodsFourCategory?'+$.param(ajData)).success(function(responseJSON) {
				if(responseJSON.code==200){
					$scope.setShopCatData(responseJSON.result);
				}
			});
		}
	}
	//赋值弹出购物车信息
	$scope.setShopCatData=function(data){
		$scope.shopCatData="";
		$scope.shopCatData=data;
		if($scope.shopCatData.propertyInfos==null && $scope.shopCatData.fourCategoryInfo.length<=0){
			$("body").alertTips({
				titles:LANGUAGE_NOW.goods.selloutMsg,//'SORRY!当前商品暂不支持购买',
				speed:1000
			});
			return;
		}
		if($scope.shopCatData.fourCategoryInfo.length>0){
			var num=1;
			$scope.fourOver=function(type){
				num+=1;
				if(num>$scope.shopCatData.StarfourCategoryInfo.length||type=="none"){
					$timeout(function(){
						if($scope.GoodsDetail.goodsSizeStyle==1003){
							//墙面
							youhua_panle.show().stop().animate({"opacity":1});
							$scope.setBoxTop(null,youhua);
						}else{
							buy_f_box_panle.show().stop().animate({"opacity":1});
							$scope.setBoxTop(null,buy_f_box);
						}
					});
				}
			}
			if($scope.shopCatData.propertyInfos!=null){
				$scope.setSize($scope.shopCatData.propertyInfos[0]);
				$.each($scope.shopCatData.fourCategoryInfo,function(i,item){
					if($scope.GoodsDetail.id==item.id){
						$scope.setCatDataThis(item);
					}
				});
			}else{
				$scope.setSize(null);
			}
		}
	}
	//计算购物车弹出位置
	$scope.setBoxTop=function(type,t){
		var win_h=$(window).height(),
			_h=t.outerHeight();
		if(win_h>_h){
			if(type=="animate"){
				t.animate({"margin-top":-_h/2});
			}else{
				t.css({"margin-top":-_h/2});
			}
			t.removeClass('position-none');;
		}else{
			t.addClass('position-none');
			$(".shopDetails").addClass('overHidden');
		}
	}

	$(window).resize(function(){
		var t;
		if($scope.GoodsDetail!=undefined){
			if($scope.GoodsDetail.goodsSizeStyle==1003){
				t=youhua;
			}else{
				t=buy_f_box;
			}
			$scope.setBoxTop('animate',t);
		}
	}).resize();

	//赋值当前选中
	$scope.setSize=function(data){
		$scope.shopCatData.StarfourCategoryInfo=[];
		if(data==null){
			$scope.shopCatData.StarfourCategoryInfo=$scope.shopCatData.fourCategoryInfo;
		}else{
			$scope.SizeCategoryId=data.categoryId;
			$.each($scope.shopCatData.fourCategoryInfo,function(i,item){
				if(item.parentCategoryId==data.categoryId){
					$scope.shopCatData.StarfourCategoryInfo.push(item);
				}
			});
		}
		if($scope.shopCatData.StarfourCategoryInfo.length<=0){
			$timeout(function(){
				$scope.fourOver("none");
			},100);
		}else{
			$scope.setCatDataThis($scope.shopCatData.StarfourCategoryInfo[0]);
			$scope.number=1;
			$scope.setNumber();
		}
	}

	//选中尺码
	$scope.setCatDataThis=function(data){
		if($scope.customSize.type==2) return;
		$scope.GoodsDetail.sellPrice=data.sellPrice;
		$scope.CatDataThis=data;
		$scope.customSize={
			width:data.width,
			height:data.hight,
			type:0
		}
		$scope.setNumber();
		$timeout(function(){
			if($scope.GoodsDetail.goodsSizeStyle==1003){
				$scope.setBoxTop('animate',youhua);
			}else{
				$scope.setBoxTop('animate',buy_f_box);
			}
		},100);
	}
	//验证
	$scope.verificationNumber=function(evt){
		$timeout(function(){
			$scope.number=parseInt(evt.target.value.replace(/[^\d]/g,''));
			$scope.setNumber();
		});
	}

	//赋值购物车数量
	$scope.setNumber=function(type){
		if($scope.number!=undefined){
			var numbers=parseInt($scope.number);
			if(type=="add"){
				numbers+=1;
			}else if(type=='reduce'){
				if(numbers>1){
					numbers-=1;
				}
			}
			$timeout(function(){
				$(".number").val(numbers);
				$scope.number=numbers;
				var sellPrice=($scope.CatDataThis==undefined?0:$scope.CatDataThis.sellPrice);
				$scope.AllNumber=numbers*sellPrice;
			});
		}
	}
	//加入购物车
	$scope.AddCat=function(){
		ArtJS.login.pop(function () {
			if($scope.customSize.type!=2){
				var ajData={
					goodsId:$scope.CatDataThis.id,
					showGoodsId:($scope.shopType==1?request('influxGoods'):request('shopId')),
					goodsCount:$scope.number,
					goodsType:$scope.GoodsDetail.goodsType,
					goodsPrice:$scope.CatDataThis.sellPrice,
					goodsJson:JSON.stringify($scope.CatDataThis),
        			abbr:ArtJS.server.language
				};
				$http.post('/orderPaySite/cart/addCart?'+$.param(ajData)).success(function(responseJSON) {
					if(responseJSON.code==200){
						$timeout(function(){
							$scope.customSize.type=2;
						});
						$timeout(function(){
							$scope.closeBuy($(".buy-f-box-panle"));
							$scope.closeBuy($(".youhua-panle"));
						},1800);
					}else{
						$("body").alertTips({
			                titles: LANGUAGE_NOW.goods.cartErr,//加入购物车失败,
			                speed: 1000
			            });
					}
				});
			}
		});
	}

	//判断是否是自定义尺寸
	$scope.customAddCat=function(){
		ArtJS.login.pop(function () {
			if($scope.customSize.type==0){
				$scope.AddCat();
			}else{
				window.open("/pips/editor/editor.ct?goodsId="+$scope.CatDataThis.id+"&countryType=cn&width="+$scope.customSize.width+"&height="+$scope.customSize.height);
			}
		});
	}

	$(".buy-f-box-panle,.youhua-panle").click(function(e){
		e.stopPropagation();
	});
	$(".buy-f-box-panle,.buy-f-box-panle .buy-f-close").click(function(){
		$scope.closeBuy($(".buy-f-box-panle"));
	}).find(".buy-f-box").click(function(e){
		e.stopPropagation();
	});

	$(".youhua-panle,.youhua-panle .buy-f-close").click(function(){
		$scope.closeBuy($(".youhua-panle"));
	}).find(".youhua").click(function(e){
		e.stopPropagation();
	});
	
	$scope.yzcustomSize=function(data,type){
		if(type=="width"){
			data.width=parseInt(data.width);
			if(data.width>=$scope.GoodsDetail.maxPrintHeight){
				data.width=$scope.GoodsDetail.maxPrintHeight;
			}
		}else{
			data.height=parseInt(data.height);
			if(data.height>=$scope.GoodsDetail.maxPrintHeight){
				data.height=$scope.GoodsDetail.maxPrintHeight;
			}
		}
	}
	$scope.closeBuy=function(t){
		t.stop().animate({"opacity":0},function(){
			$scope.customSize.type=0;
			$scope.shopCatData="";
			$(this).hide();
			$(".shopDetails").removeClass('overHidden');
		});
	};
	$scope.customSize={
		width:0,
		height:0,
		type:0
	}
	$scope.setCustom=function(){
		$scope.customSize={
			width:0,
			height:0,
			type:1
		}
		$timeout(function(){
			$scope.setBoxTop('animate',youhua);
		},100);
	}
}]).directive("shopdetailsdir", ["$timeout",function($timeout){
    return {
        restrict:'EA',
        templateUrl:'/shop-details.html',
        transclude:true,
     	controller: 'shopDetailsCtr',
        link: function (scope, element, attributes) {
        	scope.openShopDetails=function(id,type){/*"type 1是潮品，undefined or 2是商品"*/
        		if(typeof(scope.$$childTail.getGoodsDetail)=='function'){
        			ArtJS.load(['shop-details-css'], function(){
        				$timeout(function(){
			        		$(element).show().find(".shopDetails").show().animate({"opacity":1});
			        		scope.shopType=type==undefined?2:type;
			        		if(type==1){
			        			request('influxGoods',id);
			        			scope.$$childTail.getTideProductDetail(1,id);
			        		}else{
			        			request('shopId',id);
		        				scope.$$childTail.getGoodsDetail(1,id);
			        		}
		        			$("body").css({"overflow":"hidden","padding-right":"17px"});
	        			});
	        		});
        		}
        	}
        	scope.closeShopDetails=function(id){
        		$(element).find(".shopDetails").animate({"opacity":0},function(){
        			$(this).hide();
        			$(element).hide();
        			request('shopId','remove');
        			request('influxGoods','remove');
        			$("body").css({"overflow":"auto","padding-right":"0"});
        		});
        		scope.$$childTail.GoodsDetail="";
        		scope.$$childTail.suggestGoodsData=[];
        		scope.$$childTail.suggestGoods=[];
        	}
        	if(request("shopId")!=""){
    			scope.openShopDetails(request("shopId"),2);
        	}
        	if(request("influxGoods")!=""){
    			scope.openShopDetails(request("influxGoods"),1);
        	}
            $(element).find(".shopDetails .show_box").click(function(e){
                e.stopPropagation();
                if(typeof(scope.$$childTail.closeShear)=="function"){
                	scope.$$childTail.closeShear();
                }
            });
            $(element).click(function(e){
            	e.stopPropagation();

                if(typeof(scope.$$childTail.closeShear)=="function"){
	                scope.$$childTail.closeShear();
	            }
                scope.$$childTail.closeShopDetails();
            });
        }
    }
}]);
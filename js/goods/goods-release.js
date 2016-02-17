var setSvgScope,
	GoodsListScope,
	goodsReleaseScope;
angular.module('goodsRelease', ['modHeaderFull']).controller('goodsReleaseCtr', function ($scope, $http, $timeout) {
	ArtJS.load(['header','plug-in-unit'], function () {
		$scope.LANG=LANG;
		$scope.API = {
			gotoPublish               :'/goodsSite/publishOriginal/gotoPublish?',			         // 获取原有数据
			getPublishDerivation      :'/goodsSite/publishOriginal/getPublishDerivation?',           //获取衍生品
			getTypeBasesByPage        :'/topicSocSite/topic/getTypeBasesByPage?',                        //获取分类
			publishArts               :'/goodsSite/publishOriginal/publishArts'
		}
		$scope.ARTID=request('artId');
		var NoGoodsArr={
			1:[171,170,157,343,161,158,401,403,405,343],  //原作
			2:[171,170]                                   //商品
		}
		$scope.imgUrl        = ArtJS.server.image;
		$scope.PublishData;
	    $scope.goodsDetailsStar=[];        //商品类型
	    $scope.TypeList=[];                //定义分类数组
		$scope.artsClassCekd=false;        //类型选择状态
		$scope.artsClass=[];
		//初始化执行
		$scope.init=function(){
			$scope.userData=ArtJS.login.userData;
			//作者
		 	$scope.author={
		    	uri:$scope.userData.imageUrl,
		    	id:$scope.userData.memberId,
		    	nickName:$scope.userData.nikeName,
		    	list:[]
		    };
			//获取基本数据
			$http.get($scope.API.gotoPublish+ArtJS.json.toUrl({
				'originalId':$scope.ARTID,
				'abbr':LANG.NAME
			})).success(function(responseJSON) {
				if(responseJSON.code==CONFIG.CODE_SUCCESS && responseJSON.result!=null){
					var result=responseJSON.result;
					result.labelNames=result.labelNames!=null?result.labelNames.split(","):[];
					result.userLabelNames=result.userLabelNames!=null?result.userLabelNames.split(","):[];
					if(result.concent==null) result.concent='';
					$scope.PublishData=result;
					$scope.getTypeBasesByPage();
				}
		    });
		}

		//获取分类
		$scope.getTypeBasesByPage=function(){
			$http.get($scope.API.getTypeBasesByPage+ ArtJS.json.toUrl({
				'abbr':LANG.NAME,
				'source':'web',
				'page':'publish',
				'indexTag':6
			})).success(function(getTypeJSON) {
				if(getTypeJSON.code==CONFIG.CODE_SUCCESS){
					$.each(getTypeJSON.result,function(i,item){
						if(item.id==105){
							var starts=false;
							$.each(item.children,function(j,jtem){
								$scope.artsClass.push(jtem);
								if($.inArray(jtem.id,$scope.PublishData.selCategoryIds)>=0){
									$scope.changCkType(jtem);
									/*--已经发布过-start--*/
									$scope.artsClassCekd='ord';
									starts=true;
									$timeout(function(){
										$scope.ueConcent=initEditor();
										$scope.ueConcent.ready(function(){
											$scope.ueConcent.setContent($scope.PublishData.concent);
										});
									},10);
									/*--已经发布过-end--*/
								}
							});
							if(!starts){
								$scope.changCkType(item.children[0]);//赋值默认类型
							}
						}else if(item.id==2){
							$.each(item.children,function(j,jtem){
								if($.inArray(jtem.id,$scope.PublishData.selCategoryIds)>=0){
									jtem.haveRight=true;
								}
							});
							$scope.getAllTopicTypeBases=item;
						}else if(item.id==4){
							$scope.artsLip=item.children;
							$scope.scussLipc(item.children);
						}
					});
				}
			});
		}
		//显示1,2屏
		$scope.totStap=function(type){
			$scope.artsClassCekd=type;
			$timeout(function(){
				if($scope.ueConcent==undefined){
					$scope.ueConcent=initEditor();
					$scope.ueConcent.ready(function(){
						$scope.ueConcent.setContent($scope.PublishData.concent);
					});
				}
			},10);
		}
		//关闭窗体
		$scope.closeWindow=function(){
			if(confirm("离开此页面，您填写的信息不会保存 确定离开吗？")){
				window.onbeforeunload =undefined;
				location.href = '/page/'+LANG.NAME+'/user/gallery.html?uid='+CONFIG.USER.UESR_ID;
				/*if (navigator.userAgent.indexOf("Firefox") > 0) {  
	            	window.location.href = 'about:blank ';  
		        }else{
		        	window.close();
		        }*/
			}
			else{
				window.onbeforeunload =function(event){
				    event = event || window.event; 
					event.returnValue = "离开此页面，您填写的信息不会保存 确定离开吗？";
				}
			}
		}
	    //声明分类点击事件
	    $scope.typechange=function(data){
	    	var children=angular.copy($scope.getAllTopicTypeBases.children),
	    		cost=0;
    		if(data.haveRight==true){
    			data.haveRight=false;
    		}else{
		    	$.each(children,function(i,item){
		    		if(item.haveRight==true) cost+=1;
		    	});
		    	if(cost>=2){
		    		data.haveRight=false;
		    	}else{
		    		data.haveRight=true;
		    	}
	    	}
	    }
	    $scope.OriginalPrice=function(){
		    $("#OriginalPrice > li").each(function(){
		    	var lis=$(this);
		    	lis.find(".radio").click(function(){
		    		var that=$(this),
		    			type=that.attr("data-type");
	    			$timeout(function(){
						$scope.goodsDetailsStar[0].saleWay=parseInt(type);
					});
			    });
		    })
	    }
	    //改变类型事件
	    $scope.changCkType=function(datas){
	    	$scope.ckType=datas;
	    	$scope.screenSellInfos(datas);
	    	$scope.scussLipc($scope.artsLip);

	    	if($.inArray(datas.id,NoGoodsArr[1])<0){
	    		$scope.ckType.showType=1;        //原作
	    	}else if($.inArray(datas.id,NoGoodsArr[2])>=0){
	    		$scope.ckType.showType=2;        //商品
	    	}else{
	    		$scope.ckType.showType=3;
	    	}
	    }
		$scope.changArtsLip=function(datas){
	    	$scope.artsLipType=datas;
			$scope.artsLipTypeFind=(datas.children==null?"":datas.children[0]);
			$scope.screenSellInfos($scope.artsLipTypeFind);
		}
		$scope.changArtsLipc=function(datas){
			$scope.artsLipTypeFind=datas;
			if($scope.ckType!=undefined){
				if($scope.ckType.id==171 || $scope.ckType.id==170){
					$scope.screenSellInfos(datas);
				}
			}
		}
		$scope.changeInfos=function(datas,obj){
			if($scope.PublishData.saleFlag==0){
				$scope.PublishData.saleFlag=1;
				datas.saleWay=2;
			}else{
				$('.type-yz').find('input').removeClass('error');
				$('.find').find('input').removeClass('error');
				$scope.PublishData.saleFlag=0;
				datas.saleWay=1;
			}
		}
		$scope.screenSellInfos=function(datas){
			$scope.goodsDetailsStar=[];
			if($scope.PublishData.publishDetailVos!=null){
				$.each($scope.PublishData.publishDetailVos,function(i,item){
					item.domain=ArtJS.server.image;
					if(item.imageUrl!=null && typeof(item.imageUrl)=="string"){
						var dimg=item.imageUrl.split(",");
						item.imageUrl={};
						$.each(dimg,function(j,jtem){
							item.imageUrl[j]={
								'url':jtem
							};
						});
						if(dimg.length<4){
							for(var j=dimg.length;j<=3;j++){
								item.imageUrl[j]={
									'url':"null"
								};
							}
						}
					}else if(item.imageUrl==null){
						item.imageUrl={
							0:{
								'url':'null'
							},
							1:{
								'url':'null'
							},
							2:{
								'url':'null'
							},
							3:{
								'url':'null'
							}
						};
					}
					if(item.parentId==datas.id){
						$scope.goodsDetailsStar.push(item);
					}else if(datas.id!=171 && datas.id!=170 && datas.id!=157 && $scope.PublishData.publishDetailVos.length>=1){
						if($scope.artsLipTypeFind==undefined || datas.id!=$scope.artsLipTypeFind.id){
							$scope.goodsDetailsStar.push(item);
						}
					}
				});
			}
			if($scope.goodsDetailsStar.length<=0 && datas.id!=157 && datas.id!=343 && datas.id!=161){
				$scope.addSellInfos();
			}
		}
		$scope.scussLipc=function(data){
			if(data!=undefined){
				$scope.artsLipType=data[0];
				$scope.changArtsLipc(($scope.artsLipType.children==null?"":$scope.artsLipType.children[0]))
				$.each(data,function(j,jtem){
					if($.inArray(jtem.id,$scope.PublishData.selClassifiId)>=0){
						$scope.artsLipType=jtem;
						$.each(jtem.children,function(r,rtem){
							if($.inArray(rtem.id,$scope.PublishData.selClassifiId)>=0){
								$scope.changArtsLipc(rtem);
							}
						});
					}
				});
			}
		}
		//上传图片
		$scope.upfileImg=function(evt,data){
			var element=$(evt.target),
				upfile=element.find(".upfile");
			$timeout(function(){
		    	upfile.unbind().bind("change", function (changeEvent) {
		    		upfile.fileUp({
		                fload:function(el){
							$timeout(function(){
			                	data.url=el.key;
			                    upfile.val("");
		            		});
		                },
		                ferror:function(){
		                    $(element).pop({
		                        title: LANGUAGE_NOW.withdraw.Suggestions,
	                            classn: "text-center",
	                            content: LANGUAGE_NOW.withdraw.failed
		                    });
		                }
		            });
		    	});
		    	upfile.trigger("click");
	    	});
		}
		$scope.addSellInfos=function(){
			if($scope.goodsDetailsStar.length>=29){
				return;
			}
			var arr={
				domain:ArtJS.server.image,
				detailName: null,
				imageUrl:{
					0:{
						'url':'null'
					},
					1:{
						'url':'null'
					},
					2:{
						'url':'null'
					},
					3:{
						'url':'null'
					}
				},
				goodsId: $scope.ARTID,
				price: 0,
				sellHeight: 0,
				sellWidth: 0,
				selllength:0,
				stock: 0,
				saleWay:1                   //1是公开出售，2是询价出售
			}
			if($scope.ckType.id==171 || $scope.ckType.id==170){
				arr['parentId']=($scope.artsLipTypeFind!=undefined?$scope.artsLipTypeFind.id:'');
			}
			$scope.goodsDetailsStar.push(arr);
		}
		$scope.delSellInfos=function(index){
			$scope.goodsDetailsStar.splice(index,1);
		}

		var searchStar;
		//搜索作者
		$scope.searchArtists=function(text){
			clearTimeout(searchStar);
			searchStar=setTimeout(function(){
				$http.get("/memberSite/members/searchArtists?"+$.param({
		    		searchContext:text,
		    		pageSize:10,
		    		pageNo:1,
					abbr:LANG.NAME
		    	})).success(function(responseJSON) {
		    		if(responseJSON.code==200){
						$scope.author.list=responseJSON.result.pageItems;
					}
		    	});
			},1000);
		}
		//赋值作者
		$scope.setAuthor=function(data){
			$scope.author={
		    	uri:data.artistsHead,
		    	id:data.artistsId,
		    	nickName:data.artistsName,
		    	list:[]
		    };
		}
		var pushFag =true;
		$scope.postPublishArts=function (){
			var $sub = $('#btnRelease');
			if(pushFag){
		    	ArtJS.login.pop(function(user){
					//选择的分类
					var TypeList=[];
					$.each($scope.getAllTopicTypeBases.children,function(i,item){
						if(item.haveRight) TypeList.push(item.id);
					});
	   				var selClassifiId=$scope.ckType.id+","+TypeList.join(',');
					var postArr={
						originalId            :$scope.ARTID,                                 //原作ID
						title                 :$scope.PublishData.title,                     //标题
						description           :$scope.PublishData.description,               //描述
						ifContainStint        :$scope.PublishData.ifContainStint?1:0,        //是否包含限制级
						sellOriginalFlag      :$scope.PublishData.saleFlag,                  //是否售卖原作
						authorId              :$scope.author.id,                             //作者Id
						authorName            :$scope.author.nickName,                       //作者名称
						authorHead            :$scope.author.uri,                            //作者头像
						labelNames            :$scope.PublishData.labelNames.join(','),      //艺术品标签
						selCategorgyIds       :null,                                         //选择的分类

						// goodsType             :null,                                      //商品类型
						// goodsDetails          :null,                                      //商品详细
						// publishGoodsVos       :null                                       //发布的商品信息
					}
					
					if($scope.ckType.showType==2){
						selClassifiId+=","+$scope.artsLipType.id+","+$scope.artsLipTypeFind.id;
						postArr['concent']=$scope.ueConcent.getContent();
					}
					postArr['selCategorgyIds']=selClassifiId;

					if($scope.ckType.id!=170 && $scope.ckType.id!=171 && $scope.ckType.id!=344){
						//发布的商品信息
						var publishGoodsVos=[];
						$.each(GoodsListScope.GoodsListData,function(i,item){
							var defaultInfo=item.defaultInfo;
							if(defaultInfo!=null){
								publishGoodsVos.push({
									"productId":defaultInfo.productId,                         //推荐的
									"rec_Flag" :(defaultInfo.recom?1:0),
									"show_derivationId": defaultInfo.derivationId,             //显示首页的ID
									"templateId": defaultInfo.templetId,                       //模板ID
									"commission":defaultInfo.commission                        //发布佣金
								});
							}
						});
						postArr["publishGoodsVos"]=JSON.stringify(publishGoodsVos);        //商品列表
				 	}
					var goodsDetailsStar=[];
					$.each($scope.goodsDetailsStar,function(i,item){
						var itemStart=angular.copy(item),
							dimg=item.imageUrl;
						itemStart.imageUrl="";
						$.each(dimg,function(i,item){
							if(item.url!="null"){
								if(itemStart.imageUrl==""){
									imgstr=item.url;
								}else{
									imgstr=","+item.url;
								}
								itemStart.imageUrl+=imgstr;
							}
						});
						var odata={
							"detailId":itemStart.detailId,                  //"详细ID"
							"detailName":itemStart.detailName,              //"详细名称"
							"imageUrl":itemStart.imageUrl,                  //"详细图片多个已逗号隔开"
							"parentId":itemStart.parentId,                  //"分类"
							"price":itemStart.price,                        //"价格"
							"sellHeight":itemStart.sellHeight,              //"售卖高"
							"sellWidth":itemStart.sellWidth,                //"售卖宽"
							"stock":itemStart.stock,                        //"库存"
							"saleWay":itemStart.saleWay,                    //"售卖状态"
							"sellLength":itemStart.sellLength,              //"厚"
							"askEmail":itemStart.askEmail,                  //"询价邮箱"
						}
						goodsDetailsStar.push(odata);
					});
					//商品详细
					postArr["goodsDetails"]=JSON.stringify(goodsDetailsStar);

					//-----------------错误验证--star------
					$(".error").removeClass("error");
					if($("#userName").verifyNull()){
						$("#userNamePan").addClass("error");
					}
					if($("#artTiele input").verifyNull()){
						$("#artTiele").addClass("error");
					}
					if($("#description").verifyNull()){
						$(".au-description").addClass("error");
					}
					if($scope.PublishData.labelNames.length<=2){
						$("#ArryTag").addClass("error");
					}
					//原作验证
					if($scope.ckType.showType==1){
						if($scope.PublishData.saleFlag == 1){
							if(goodsDetailsStar[0].sellWidth==="" || goodsDetailsStar[0].sellWidth===undefined || goodsDetailsStar[0].sellWidth<=0){
								$("#Original .artWidth").addClass("error");
							}
							if(goodsDetailsStar[0].sellHeight==="" || goodsDetailsStar[0].sellHeight===undefined || goodsDetailsStar[0].sellHeight<=0){
								$("#Original .artHeight").addClass("error");
							}
							if(goodsDetailsStar[0].sellLength==="" || goodsDetailsStar[0].sellLength===undefined || goodsDetailsStar[0].sellLength<=0){
								$("#Original .artLength").addClass("error");
							}
							if(goodsDetailsStar[0].price==="" || goodsDetailsStar[0].price<=0 && goodsDetailsStar[0].saleWay==1){
								$("#Original .price").addClass("error");
							}
							if($("#Original .email").verifyEmail() || $("#Original .email").verifyNull() && goodsDetailsStar[0].saleWay==2){
								$("#Original .email").addClass("error");
							}
						}
						if(publishGoodsVos.length<=0){
							$(".gl-list").addClass("error");
						}
						if(TypeList.length<=0){
							$("#getAllTopicType").addClass("error");
						}
					}
					//商品验证
					else if($scope.ckType.showType==2){
						$.each(goodsDetailsStar,function(i,item){
							var products=$(".products").eq(i),
								detailName=products.find(".detailName"),
								price=products.find(".price"),
								stock=products.find(".stock"),
								artWidth=products.find(".artWidth"),
								artHeight=products.find(".artHeight"),
								artLength=products.find(".artLength");

							if(detailName.verifyNull()){
								detailName.addClass("error");
							}
							if(price.verifyNull() || item.price<=0){
								price.addClass("error");
							}
							if(stock.verifyNull()|| item.stock<=0){
								stock.addClass("error");
							}
							if(artWidth.verifyNull()|| item.sellWidth<=0){
								artWidth.addClass("error");
							}
							if(artHeight.verifyNull()|| item.sellHeight<=0){
								artHeight.addClass("error");
							}
							if(artLength.verifyNull()|| item.sellLength<=0){
								artLength.addClass("error");
							}
						});
						if($scope.ueConcent.getContent()==""){
							$("#html-concent").addClass("error");
						}
					}

					if($(".error").length>0){
						$("html,body").animate({"scrollTop":$(".error").offset().top-200});
						return;
					}else{
						pushFag =false;
						$sub.addClass('btn-push');
					}
					/* -----------------错误验证--end------- */
					$.ajax({
						type: "POST",
						url:$scope.API.publishArts,
						data: postArr,
						contentType:'application/x-www-form-urlencoded; charset=UTF-8',
						success: function (responseJSON) {
							if(responseJSON.code==200){
								$("body").alertTips({
									"titles":"发布成功",
									"speed":2000,
									"closeback":function(){
										window.onbeforeunload=undefined;
										window.location.href="/page/"+LANG.NAME+"/user/gallery.html?uid="+ArtJS.login.userData.memberId;
									}
								});
							}else{
								$("body").alertTips({
									"titles":"发布失败",
									"speed":2000
								});
								$sub.removeClass('btn-push');
								pushFag = true;
							}
								$sub.removeClass('btn-push');
								pushFag = true;
						}
					});
				});
			}
	    };
	    goodsReleaseScope=$scope;
		ArtJS.login.pop(function(){
			ArtJS.login.getUser(function(){
				$scope.init();
			});
		});
	});
}).directive("goodsList", ["$timeout","$http",function($timeout,$http){
    return {
        restrict:'AE',
        replace: true,
        link: function (scope, element, attributes) {
        	pageNo=1;
        	scope.getGoodsListByPage=function(){
        		ArtJS.load(['plug-in-unit'], function () {
		        	//获取衍生品
					$http.get('/goodsSite/publishOriginal/getPublishDerivation?'+ArtJS.json.toUrl({
						'originalId':request('artId'),
						'abbr':LANG.NAME
					})).success(function(responseJSON) {
						if(responseJSON.code ==200){
							var result=responseJSON.result;
							if(result!=undefined){
						    	scope.GoodsListData=result;
					    	}
		                }
					});
				});
			}
			ArtJS.load(['svg-grop'], function () {
				scope.getGoodsListByPage();
			});
        	scope.ChangSvgSetinit=function(data){
        		var star=true;
        		$.each(data.childInfos,function(i,item){
        			if(data.defaultInfo.derivationId==item.derivationId){
        				$timeout(function(){
	        				item.release=true;
	        				data.defaultInfo=item;
	        				delete data.defaultInfo.childInfos;
	    					star=false;
	    				});
        			}
        		});
				scope.ChangSvgSet(data.defaultInfo);
        	}
        	scope.ChangSvgSet=function(data){
        		$timeout(function(){
        			var scopes=scope;
	        		var svgContent=data.svgContent;
	        		if(svgContent.indexOf(".svg")<0) {
			        	var svgs=svgGop.recombineSvg({
			        		svg:svgContent,
			        		p_w:320,
			        		quality:75,
			        		changeCallback:function(t){
			        			var DivSvg=$(t).parents("svg").parent(".svg"),
			        				datas={
			        					'derivationId'   : DivSvg.attr("data-derivationId"),
			        					'productId'      : DivSvg.attr("data-productId"),
		        						'templetId'      : DivSvg.attr("data-templetId")
		        					};
								postRewriteSvg(datas,DivSvg.html(),DivSvg.parent(".eb-ctrl"));
			        		}
			        	});
						var transform=null;
			        	$("#svg"+data.derivationId).find("*").each(function(){
	    					var tid=$(this).attr("id");
							if(tid!=undefined && tid.indexOf("_face")>=0){
								transform=$(this).find("image")[0].getAttribute("transform");
							}
						});
						if(transform!="" &&transform!=null){
							svgs.svg.find("*").each(function(){
		    					var tid=$(this).attr("id");
								if(tid!=undefined && tid.indexOf("_face")>=0){
									$(this).find("image")[0].setAttribute("transform",transform);
								}
							});
						}
			        	$("#svg"+data.derivationId).html('');
			        	$("#svg"+data.derivationId).append(svgs.svg);
			        }
		        });
        	}


			scope.ChangSvg=function(el,dataObj,datas){
				var that=$(el.target),
					id=that.attr("data-id"),
					svgs=$("#svg"+id),
	        		eb_centent=that.find(".eb-centent"),
	        		eb_centent_i=eb_centent.find("i"),
    				outWidth=eb_centent.find("s").width();

				$.each(dataObj.childInfos,function(i,item){
					if(item.childInfos!=null){
						var stats=false;
						$.each(item.childInfos,function(j,jtem){
							if(datas.derivationId==jtem.derivationId){
								stats=true;
								jtem.release=true;
							}else{
								jtem.release=false;
							}
						});
						item.release=stats;
					}else{
						if(datas.derivationId==item.derivationId){
							item.release=true;
						}else{
							item.release=false;
						}
					}
				});
				datas.release=true;
				var datasStart=angular.copy(datas);
				delete datasStart.childInfos;
				dataObj.defaultInfo=angular.copy(datasStart);

				scope.ChangSvgSet(datas);
				if(typeof(setSvgScope.setTransform)=='function'){
					setSvgScope.setTransform({
						"id":id,
						"lX":outWidth-2,
	    				"mWidth":outWidth,
	    				"hande":eb_centent_i
					});
				}
			}

			scope.editPrce=function(evt,data){
				evt.stopPropagation();
				var defaultInfo=data.defaultInfo;
				defaultInfo.costPrice=defaultInfo.costPrice==undefined?0:defaultInfo.costPrice;
				var DeliveryRates=$("#DeliveryRates"),
					numPercent=$("#numPercent"),
					priceUser=$("#priceUser"),
					priceSell=$("#priceSell"),
					btnEnter=$("#btnEnter");
				function set(){
					if(numPercent.verifyIsnumb() || numPercent.val()<0){
						numPercent.val(0);
					}else if(numPercent.val()>9999){
						numPercent.val(9999);
					}
					if(numPercent.val()!=""){
						numPercent.val(parseFloat(numPercent.val()));
					}
					$.each(data.childInfos,function(i,item){
						item.commission=numPercent.val();
					});
					DeliveryRates.html('<i name="priceType">'+defaultInfo.currencySymbol+'</i>'+defaultInfo.costPrice);
					priceUser.html('<i>'+defaultInfo.currencySymbol+'</i><font>'+parseInt(parseFloat(defaultInfo.costPrice*(numPercent.val()/100))*100)/100+'</font>');
					priceSell.html('<i>'+defaultInfo.currencySymbol+'</i><font>'+parseInt(parseFloat(defaultInfo.costPrice+(defaultInfo.costPrice*(numPercent.val()/100)))*100)/100+'</font>');
				}
				btnEnter.unbind().bind("click",function (){
					$timeout(function(){
						defaultInfo.commission=numPercent.val();
					});
					$("#floatBox").hide();
				});
				numPercent.unbind().bind("keyup",function(){
					set();
				});
				numPercent.val(defaultInfo.commission);
				set();
				$("#floatBox").fadeIn();
			}
			scope.SellOriginal=function (data,check){
				var stats=true,
					cost=0;
				if(!check){
					$.each(scope.GoodsListData,function(i,item){
						if(item.defaultInfo!=null){
							item.defaultInfo.recom==true?(cost+=1):'';
						}
					});
					if(cost>2){
						stats=false;
					}else{
						stats=true;
					}
				}else{
					stats=false;
				}
				data.defaultInfo.recom=stats;
				$.each(data.childInfos,function(i,item){
					item.recom=stats;
				});
			}

			GoodsListScope=scope;
        }
    }
}]).directive("setSvg", ["$timeout","$http",function($timeout,$http){
    return {
        restrict:'AE',
        replace: true,
        link: function (scope, element, attributes) {
        	$timeout(function(){
	        	var el=$(element),
	        		eb_centent=el.find(".eb-centent"),
	        		eb_centent_i=eb_centent.find("i"),
    				outWidth=eb_centent.find("s").width(),
	        		moserStar=false,
	        		ebRight=el.find(".eb-right");
        		var dX=0,
        			elLeft=0,
        			ofLeft=0;
	    		eb_centent_i.bind("mousedown",function(e){
	    			e.preventDefault();
	    			moserStar=true;
	    			dX=e.pageX;
    				elLeft=parseInt(eb_centent_i.css("left"));
    				ofLeft=parseInt(eb_centent.offset().left);

					$("body").bind("mouseup",function(ev){
		    			moserStar=false;
		    			$("body").unbind();
		    		});	
	    		});
	    		el.bind("mousemove",function(ev){
	    			ev.stopPropagation();
	    			var mX=ev.pageX;
	    			if(moserStar){
	    				var lX=mX-ofLeft;
		    			scope.setTransform({
		    				"id":attributes.id,
		    				"lX":lX,
							"incremental":0.2,
		    				"mWidth":outWidth,
		    				"hande":eb_centent_i
		    			});
	    			}
	    		});
				scope.setTransform=function(options){
					var that = this;
			        that.options = {
			            id:null,
			            incremental:false,
			            lX:0,
			            mWidth:0,
			            hande:null,
			            type:null
			        };
			        for (var i in options) {
			            that.options[i] = options[i];
			        }
			        var opt=that.options;
					var svgs=$("#svg"+opt.id),
		        		face=null;
					svgs.find("*").each(function(){
						var tid=$(this).attr("id");
						if(tid!=undefined&& tid.indexOf("_face")>=0){
							face=$(this).find("image");
						}
					});
					opt.lX=opt.lX-(opt.hande.outerWidth()/2);
					var otWidth=opt.mWidth+(opt.mWidth*opt.incremental),
						scale=null,
						bar=undefined;
					var transform=face!=null?face[0].getAttribute("transform"):'';
					if(face!=null && transform!="" &&transform!=null){
						var tsn=svgGop.processTransform(transform),
							tx=parseFloat(tsn.translateArr[0]),
							ty=parseFloat(tsn.translateArr[1]),
							scaleW=tsn.scaleArr[0],
							scaleH=tsn.scaleArr[1];

						if(opt.type=="start"){
							bar=parseFloat((opt.mWidth/otWidth)*scaleW)*100;
							scale=scaleW;
						}else{
							bar = parseFloat((opt.lX/opt.mWidth)*100);
							scale=(otWidth*(bar/100))/opt.mWidth;
						}
					}
    				if(bar!=undefined && bar>=0 && bar<=100){
    					if(face!=null && scale!=null){
    						face[0].setAttributeNS(null, 'transform', 'translate(' + tx + ',' + ty + ') scale(' + scale + ',' +scale + ')');
    					}
    					opt.hande.css({"left":bar+"%"});
    					ebRight.html(parseInt(bar)+"%");
    				}
    				
    				var svg_html=svgs.html(),
    					oSvg=svgGop.reversalSvg({
	    					svg:svg_html
	    				});
    				if(opt.type!="start"){
    					var datas={
        					'derivationId'   : svgs.attr("data-derivationId"),
        					'productId'      : svgs.attr("data-productId"),
    						'templetId'      : svgs.attr("data-templetId")
    					};
    					postRewriteSvg(datas,svg_html,svgs.parent(".eb-ctrl"));
    				}
    			}
    			scope.setTransformTopCenter=function(datas,type){
    				var id=datas.derivationId;
    				var svgs=$("#svg"+id),
    					mask=svgs.find("mask").find("image")[0],
    					face=null;
    				svgs.find("*").each(function(){
    					var tid=$(this).attr("id");
						if(tid!=undefined && tid.indexOf("_face")>=0){
							face=$(this).find("image")[0];
						}
					});
    				if(face!=null){
						var transform=face.getAttribute("transform");
						if(transform!="" && transform!=null){
							if(mask==undefined){
								mask=face;
							}
							var tsn=svgGop.processTransform(transform),
								mw=parseFloat(mask.getAttribute('width')),
								mh=parseFloat(mask.getAttribute('height')),
								w=parseFloat(face.getAttribute('width'))*parseFloat(tsn.scaleArr[0]),
								h=parseFloat(face.getAttribute('height'))*parseFloat(tsn.scaleArr[1]),
								sX=(mw-w)/2,
							 	sY=(mh-h)/2;
							face.setAttributeNS(null, 'transform', 'translate(' + (type=="L"? sX:tsn.translateArr[0]) + ',' + (type=="T"? sY:tsn.translateArr[1]) + ') scale(' + tsn.scaleArr[0] + ',' + tsn.scaleArr[1] + ')');
						}
					}


    				var svg_html=svgs.html(),
    					oSvg=svgGop.reversalSvg({
	    					svg:svg_html
	    				});
    				// var oDatas=scope.GoodsListData.childInfos[id];
    				// oDatas.defaults.artsProduct.svgContent=oSvg;
    				// oDatas.list[oDatas.defaults.artsProduct.categoryId1].artsProduct.svgContent=oSvg;
    				datas.svgContent=oSvg;
				 	postRewriteSvg(datas,svg_html,svgs.parent(".eb-ctrl"));
    			}
    			//初始化执行
    			scope.setTransform({
    				"id":attributes.id,
    				"incremental":0.2,
    				"mWidth":outWidth,
    				"hande":eb_centent_i,
    				"type":"start"
    			});
    			setSvgScope=scope;
    			return this;
	    	});
        }
    }
}]).directive('labelAdd', ["$http",function ($http,$timeout) {
    //定义directive相关作品绑定完成后的事件
    return {
        restrict: 'AE',
        replace: true,
        link: function(scope, element, attr) {
			//定义标签数组
			scope.removeTag=function(val){
                scope.PublishData.labelNames.splice($.inArray(val,scope.PublishData.labelNames),1);
			}
		    scope.addClickTag=function(val){
		        if(scope.PublishData.labelNames.indexOf(val)<0){
		            scope.PublishData.labelNames.push(val);
		        }
		    }
		    scope.keyupFn=function(event){
		    	if(scope.PublishData!=undefined){
			        var e = event || window.event || arguments.callee.caller.arguments[0];
			        var val=e.target.value;
			        if(e && e.keyCode==13 || e && e.keyCode ==188){ // enter 键 逗号键
			            //要做的事情
			            if($.inArray(val,scope.PublishData.labelNames)>=0){
			            	return;
			            }
			            if(val =="" || val =="," || val =="，") {
			            	e.target.value='';
			            	return;
			            }
			            if(val.indexOf(",")>=0||val.indexOf("，")>=0){
							val=val.replace(",","");
							val=val.replace("，","");
			            }
						scope.addClickTag(val);
			            e.target.value='';
			        }
		        }
		    }
            scope.keydownFn=function(event){
                var e = event || window.event || arguments.callee.caller.arguments[0];
                if(e && e.keyCode==8 && e.target.value ==""){
                    scope.PublishData.labelNames.pop();
                }
            }
        }
    };
}]).directive("sSelect", ['$http','$timeout',function($http,$timeout){
    return {
        restrict:'AE',
        replace: true,
        link: function (scope, element, attributes) {
			var that=$(element),
				s_name=that.find(".s-name"),
				ul_list=that.find("ul");
			that.click(function(e){
				e.stopPropagation();
				if(!ul_list.is(':visible')){
					$(".s-select > ul").slideUp();
					$(".s-select").css("z-index",2);
					that.css("z-index",3);
					ul_list.slideDown();
					ul_list.find("li").click(function(e){
						e.stopPropagation();
						ul_list.slideUp()
						that.css("z-index",2);
					});	
				}
			});
        }
    }
}]);


//修改svg
var postRewriteSvgTimFn;
function postRewriteSvg(data,svgCont,panle){
	clearTimeout(postRewriteSvgTimFn);
	postRewriteSvgTimFn=setTimeout(function(){
		var oSvg=svgGop.reversalSvg({
				svg:svgCont
			});
		$.ajax({
	        type: "GET",
	        url: "/goodsSite/publishOriginal/editSvgContent",
	        data: {
	        	"originalId": request('artId'),
	        	"productId" : data.productId,
	        	"templetId" : data.templetId,
	        	"svgContent": oSvg
	        },
	        success: function (responseJSON) {
	            if(responseJSON.code==CONFIG.CODE_SUCCESS){
	            	$(panle).alertTips({
						"titles":"修改成功",
						"speed":600
					});
	            }
	        }
		});
	},1000);
}

//阻止页面关闭
window.onbeforeunload =function(event){
    event = event || window.event; 
	event.returnValue = "离开此页面，您填写的信息不会保存 确定离开吗？";
}
//页面滚动式滚动条置顶
$(window).scroll(function(){
	if($(window).scrollTop()>0){
		$("#grTopCtrl").addClass("fixed-top");
	}else{
		$("#grTopCtrl").removeClass("fixed-top");
	}
});

$("#floatBox").click(function(evt){
	$("#floatBox").hide();
}).find(".fb-dialog").click(function(evt){
	evt.stopPropagation();
});
$("body").click(function(){
	$(".s-select > ul").slideUp();
	$(".s-select").css("z-index",2);
});
function initEditor(){
	var edi=UE.getEditor('html-concent',{
		toolbars:[[
			'source', //源代码
	        'bold', //加粗
	        'italic', //斜体
	        'indent', //首行缩进
	        'underline', //下划线
	        'strikethrough', //删除线
	        'forecolor', //字体颜色
	        'link', //超链接
	        'unlink', //取消链接
	        'justifyleft', //居左对齐
	        'justifycenter', //居中对齐
	        'justifyright', //居右对齐
	        'justifyjustify' //两端对齐
	    ]],
	    initialFrameWidth:620,
	    initialFrameHeight:320,
	    maximumWords:2000,
	    autoHeight: false,
	    imageScaleEnabled:false,
	    topOffset:135
	});
	edi.ready(function(){
		var eduiToolbar=$(".edui-default .edui-toolbar");
		if(eduiToolbar.find(".inset-img").length>0) return;
		insetImg=$("<a class='inset-img'>插入图片<input type='file' class='upfile'></a>"),
		upfile=insetImg.find(".upfile");
		upfile.bind("change", function (changeEvent) {
			upfile.fileUp({
			    fload:function(el){
		        	var imgSrc=ArtJS.server.image+el.key,
		        		ineImg='<p style="text-align: center;"><img src='+imgSrc+' data-width="'+el.width+'" data-height="'+el.height+'" style="max-width:100%;"></p>';
	                edi.execCommand('insertHtml',(ineImg));

		            upfile.val("");
			    },
			    ferror:function(){
			        $(element).pop({
			            title: "上传图片",
			            classn: "text-center",
			            content: "上传图片失败"
			        });
			    }
			});
		});
		eduiToolbar.append(insetImg);
	});
	return edi;
}
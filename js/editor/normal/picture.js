/***
*  小编页处理
**/
;(function(){
	'use strict';
	var normalEditor = angular.module("normalEditor", ["editorHeaderApp","editorNavApp","editorSelectorApp","editorGoodsListApp"]);

	//导航模块
	normalEditor.controller("normalContoller",function ($scope,$http,$timeout,$sce) {
	ArtJS.load(['header'], function () {
	$timeout(function () {
		var URL={
			typeUrl:"/topicSocSite/topic/getTypeBasesByPageNoPoly",//获取基本类型URL
			// typeUrl:"/",//获取基本类型URL
			listUrl:"/goodsSite/editor/image/listEditorImage",//获取商品列表URL
			// listUrl:"/",//获取商品列表URL
			assignEditImageUrl:"/goodsSite/editor/image/assignEditImage",//获取分配图片列表地址
			verifyUnpassedUrl:"/goodsSite/goodsEditor/verifyUnpassed",//3.3小编审核不通过
			goodsEditorSubmitUrl:"/goodsSite/goodsEditor/submit",//小编/副主编/主编提交
			deleteOriginalAndGoodsUrl:"/goodsSite/goodsEditor/deleteOriginalAndGoods",//3.6小编/副主编/主编删除作品
			downloadUrl:"/goodsSite/download/source",//下载图片地址?path=https://www.baidu.com/img/bd_logo1.png
			hotWordUrl:"/goodsSite/goodsEditor/getHotwordsListByTypeId"//根据媒介分类实时查询热词  typeId=&abbr=
		};
		//语言包载入
		$scope.LANG=LANG;
		//获取基本分类查询条件
		$scope.typeBaseCondition={
			abbr:ArtJS.server.language,//国家语言
			source:"web",//来源
			page:"index",//分页
			indexTag:5//标签
		};

		$scope.searchCondition={
			pageSize:20,//每页条数
			pageNo:1,//当前页
			category:"",//分类ID
			associateId:"",//副主编id
			keyword:"",//搜索关键字
			selectedTagId:1,//查询标签 1 是图片列表 2是原作列表
			orderByType:1,// 排序方式  1 按照更新时间倒叙 2 按照更新时间正序
			editorId:""//location.search.getQueryValue("editorId") //要查询的小编id  默认为""
		};//搜索条件

		$scope.hotWordCondition={
			abbr:ArtJS.server.language,//国家语言
			typeId:""//媒介分类ID
		};//实时查询热词条件

		//小编页相关 国际化
		$scope.editorLang=editorLang[ArtJS.server.language];
		// $scope.loading="loading";
		// $scope.editorGoods.goodsList=[];//商品列表
		$scope.imgUrl= ArtJS.server.image;
		$scope.qnProduct = '?imageView2/2/format/jpg/w/270/q/90';
		$scope.qnIcon= '?imageView2/2/format/jpg/w/20/q/50';
		$scope.qn850= '?imageView2/2/format/jpg/w/850/q/90';

		var goodsStatus=false;//商品加载状态  防止多次加载

		loadNavData();

		// 导航选择相关按钮展示开关
		$scope.navSelector={
			orderByTypes:[
			{name:"按照更新时间倒序",id:1},
			{name:"按照更新时间正序",id:2}
			]
			// normalSelector:true,//小编展示
			// subSelector:true,//副主编展示
			// dataStatusSelector:true,//数据状态展示
			// derivativeBtn:false //是否显示管理相关衍生品按钮  true为显示  false不显示
		};

		$scope.hotWordsList=[];//热词列表
		$scope.typeList=[];//分类列表

		loadTypeList($scope.typeBaseCondition);
		// $scope.typeActive="";
		//pageSize=20&selectedTagId=2&orderByType=2&edited=0&editorId=0&category=&pageNo=1&abbr=US
		$scope.editorGoods={
			// editorMultiCheck:true,//是否显示多选框
			// goodsThumbnail:true,//是否显示缩略图
			// setBoutique:true,设置精品
			// isAllChecked:false,//是否全选
			goodsList:[],//商品列表
			editorNormal:true//小编页
			// editorSub:true//副主编页
			// editorChief:true//主编页
		};
		var scrollStatus=true;
		//初始加载图片列表数据
		loadGoodsList($scope.searchCondition,
			function(){
				if (scrollStatus) {
					scrollStatus = false;
					// ArtJS.page.ui.imageLoad.init(100);
					ArtJS.page.ui.scroll({
						callback: function () {
							//$scope.loading="loading";
							loadGoodsList($scope.searchCondition,null,"append");
						}
					});
				}
			});

		$scope.typeClick=function(type,item){
			var id=item?item.id:"";
			if(type.typeActive==id){//若当前选中的与之前选中的是一样的分类则直接返回
				return;
			}
			type.typeActive=id;//设置当前选中代码为点击的ID
			var typeId=type.id;//分类ID
			if(id){
				if(typeId==105){//媒介分类  typeId==105
					$scope.navSelector.mediaArr=[id];
				}else if (typeId==465){
					$scope.navSelector.languageArr=[id];
				}else if(typeId==2){
					$scope.navSelector.bigTagArr=[id];
				}
			}else{
				if(typeId==105){//媒介分类  typeId==105
					$scope.navSelector.mediaArr=[];
				}else if (typeId==465){
					$scope.navSelector.languageArr=[];
				}else if(typeId==2){
					$scope.navSelector.bigTagArr=[];
				}
			}
			var tempArr=[].concat($scope.navSelector.mediaArr?$scope.navSelector.mediaArr:[],$scope.navSelector.languageArr?$scope.navSelector.languageArr:[],$scope.navSelector.bigTagArr?$scope.navSelector.bigTagArr:[]);
			if(tempArr.length>0){
				$scope.searchCondition.category=tempArr.unique().join(",");
			}else{
				$scope.searchCondition.category="";
			}
			//搜索图片商品列表
			$scope.editorGoods.searchGoodsList();
		};

		//html输出
		$scope.editorGoods.trustAsHtml=function(str){
			return $sce.trustAsHtml(str);
		};

		//加载选择类型列表
		function loadTypeList(options){
			// var error=options.error;
			$.ajax({
			    type: "get",
			    url: URL.typeUrl,
			    data:options,
			    success: function(data){
					$scope.$apply(function(){
				    	if (data.code === CONFIG.CODE_SUCCESS) {
							var result=data.result;
							if(result&&result.length>0){
								for(var i in result){
									result[i].typeActive="";
								}
									$scope.typeList= result;
								//获取热词列表
								// getHotwordsListByTypeId($scope.hotWordCondition);
							}
						} else {
							// if (typeof(error) === 'function') error();
						}
					});
			    },
			    error:function(data){
			    	// if (typeof(error) === 'function') error();
			    }
			});
		}

		//根据媒介分类实时查询热词  typeId=&abbr=
		function getHotwordsListByTypeId(item,options){
			$.ajax({
			    type: "get",
			    url: URL.hotWordUrl,
			    data:options,
			    success: function(data){
			    	$scope.$apply(function(){
				    	if (data.code === CONFIG.CODE_SUCCESS) {
							var result=data.result;
							if(result&&result.length>0){
								// for(var i in result){
								// 	result[i].hotWordActive="";
								// }
								item.hotWordsList= result;
							}else{
								item.hotWordsList=[];
							}
						} else {
							// if (typeof(error) === 'function') error();
							item.hotWordsList=[];
						}
					});
			    },
			    error:function(data){
			    	$scope.$apply(function(){
				    	// if (typeof(error) === 'function') error();
						item.hotWordsList=[];
					});
			    }
			});
		}

		//加载商品列表
		var getGoodsListDataStatus=true;
		function loadGoodsList(options,callback,type){
			// $scope.$apply(function(){
				$scope.loading="loading";
				$scope.editorGoods.noGoodsListDataShowTxt=false;
			// });
			if(goodsStatus){
				return;
			}
			goodsStatus=true;
			// var error=options.error;
			// var callback=options.callback;
			$.ajax({
			    type: "get",
			    url: URL.listUrl,
			    data:options,
			    success: function(data){
					$scope.$apply(function(){
				    	goodsStatus=false;
						if (data.code === CONFIG.CODE_SUCCESS) {
							var result=data.result;
							// $scope.result=result;
							if(result.pageItems&&result.pageItems.length>0){
								if(type=="append"){
									$scope.editorGoods.goodsList =$scope.editorGoods.goodsList.concat(result.pageItems);
								}else{
									$scope.editorGoods.goodsList =result.pageItems;
								}
								$scope.searchCondition.pageNo++;
								ArtJS.page.ui.imageLoad.init($(window).scrollTop());
								if(getGoodsListDataStatus){
									getGoodsListDataStatus=false;
									$scope.editorGoods.noGoodsListData=false;
								}
							}else{
								$scope.editorGoods.noGoodsListDataShowTxt=true;
								if(getGoodsListDataStatus){
									getGoodsListDataStatus=false;
									$scope.editorGoods.noGoodsListData=true;
								}
							}
							$scope.recordsNumber= result.recordsNumber;
							if($scope.editorGoods.goodsList.length>0){
								$scope.editorGoods.noGoodsListDataShowTxt=false;
							}
						} else {
							if($scope.editorGoods.goodsList.length>0){
								$scope.editorGoods.noGoodsListDataShowTxt=true;
							}
							// if (typeof(error) === 'function') error();
							if(getGoodsListDataStatus){
								getGoodsListDataStatus=false;
								$scope.editorGoods.noGoodsListData=true;
							}
						}
						$scope.loading="";
						if(callback){
							callback();
						}
					});
			    },
			    error:function(data){
			    	$scope.$apply(function(){
				    	if($scope.editorGoods.goodsList.length>0){
							$scope.editorGoods.noGoodsListDataShowTxt=true;
						}
						goodsStatus=false;
						// if (typeof(error) === 'function') error();
						if(getGoodsListDataStatus){
							getGoodsListDataStatus=false;
							$scope.editorGoods.noGoodsListData=true;
						}
						$scope.loading="";
					});
			    }
			});
		}

		// 搜索商品列表
		$scope.editorGoods.searchGoodsList=function($event){
			if($event){
				if($event.keyCode == 13){
					$scope.editorGoods.goodsList=[];
					$scope.searchCondition.pageNo=1;//初始化当前分页
					loadGoodsList($scope.searchCondition);
				}
			}else{
				$scope.editorGoods.goodsList=[];
				$scope.searchCondition.pageNo=1;//初始化当前分页
				loadGoodsList($scope.searchCondition);
			}
		};

		// 获取待审核数据
		var goodsAssignStatus=false;
		$scope.editorGoods.getGoodsListData=function(){
			// alert("分配数据");
			// $scope.$apply(function(){
				$scope.loading="loading";
				$scope.editorGoods.goodsList =[];
				$scope.searchCondition.pageNo=1;//初始化当前分页
			// });
			if(goodsAssignStatus){
				return;
			}
			goodsAssignStatus=true;
			$.ajax({
			    type: "POST",
			    url: URL.assignEditImageUrl,
			    data:{},
			    success: function(data){
			    	$scope.$apply(function(){
				     	goodsAssignStatus=false;
						if (data.code === CONFIG.CODE_SUCCESS){
							$scope.editorGoods.noGoodsListData=false;
							loadGoodsList($scope.searchCondition,
								function(){
									if (scrollStatus) {
										scrollStatus = false;
										// ArtJS.page.ui.imageLoad.init(100);
										ArtJS.page.ui.scroll({
											callback: function () {
												//$scope.loading="loading";
												loadGoodsList($scope.searchCondition,null,"append");
											}
										});
									}
								});
							// var result=data.result;
							/*if(result.pageItems&&result.pageItems.length>0){
								$scope.editorGoods.goodsList =result.pageItems;
							 	$scope.editorGoods.noGoodsListData=false;
								ArtJS.page.ui.imageLoad.init($(window).scrollTop());
							}else{
								$scope.editorGoods.noGoodsListData=true;
							}
							$scope.recordsNumber= result.recordsNumber;*/
						}else {
							$scope.editorGoods.noGoodsListData=true;
							// if (typeof(error) === 'function') error();
						}
						$scope.loading="";
					});
			    },
			    error:function(){
			    	$scope.$apply(function(){
				    	$scope.editorGoods.noGoodsListData=true;
						goodsAssignStatus=false;
						// if (typeof(error) === 'function') error();
						$scope.loading="";
					});
			    }
			});
		};
		//鼠标经过事件
		/*$scope.editorGoods.tagMouseOver=function($event,liTag){
			alert(1);
			liTag.childShow=true;
		};
		//鼠标划出事件
		$scope.editorGoods.tagMouseOut=function($event,liTag){
			liTag.childShow=false;
		};*/

		//删除商品
		$scope.delGoods=function(index){
			// console.log("dialog.test----start====---"+index);
			$scope.editorGoods.goodIndex=index;
			ArtDialog.confirm({
				"title":false,
				"msg":"您确定要删除吗？这将删除该图片及该图片的所有衍生品。",
				"ok":true,
				"okTxt":"确定",
				"cancel":true,
				"cancelTxt":"取消",
				"okCall":function(){
					console.log("dialog.test-----end====okCall---"+$scope.editorGoods.goodIndex);
					var originalId=$scope.editorGoods.goodsList[$scope.editorGoods.goodIndex].originalId;
					deleteOriginalAndGoodsFunc({"originalId":originalId});
					ArtDialog.closeConfirm();
				}
			});
		};

		//3.6小编/副主编/主编删除作品
		var deleteOriginalAndGoodsStatus=false;
		function deleteOriginalAndGoodsFunc(options){
			if(deleteOriginalAndGoodsStatus){
				return;
			}
			deleteOriginalAndGoodsStatus=true;
			$.ajax({
			    type: "POST",
			    url: URL.deleteOriginalAndGoodsUrl,
			    data:options,
			    success: function(data){
			    	$scope.$apply(function(){
				     	deleteOriginalAndGoodsStatus=false;
						if (data.code === CONFIG.CODE_SUCCESS) {
							var result=data.result;
							if(result){
								//$scope.$apply(function(){
									// $scope.editorGoods.goodsList.remove($scope.editorGoods.goodsList[$scope.editorGoods.goodIndex]);
									$scope.editorGoods.goodsList[$scope.editorGoods.goodIndex].noData=true;
								// });
								ArtJS.page.ui.imageLoad.init($(window).scrollTop());
								ArtDialog.toast("删除成功");
							}
						}else {
							// if (typeof(error) === 'function') error();
							ArtDialog.toast("删除失败！");
						}
					});
			    },
			    error:function(){
			    	$scope.$apply(function(){
			    		deleteOriginalAndGoodsStatus=false;
						// if (typeof(error) === 'function') error();
						ArtDialog.toast("删除失败！");
					});
			    }
			});
		}

		// 选星星
		$scope.pictureStar = function (id, number) {
			var dom  = $('#stars_' + id);
			var data = dom.data('star') || 0;
			dom.children().removeClass('s-active');
			if (number !== data) {
				data = number;
				var star = dom.children(':lt(' + number + ')');
				star.addClass('s-active');
			} else {
				data = 0;
			}
			dom.data('star', data);
			console.log(data);
		}

		//商品提交
		$scope.submitGoods=function(item,index){
			$scope.editorGoods.goodIndex=index;
			if(!item.mediaArr||item.mediaArr.length<1){//未选择媒介
				item.mediaActive=true;//未选择媒介的外框状态
				return;
			}
			if(!item.languageArr||item.languageArr.length<1){//未选择语言
				item.languageActive=true;
				return;
			}
			if(!item.bigTagArr||item.bigTagArr.length<1){//未选择主题
				item.bigTagActive=true;
				return;
			}
			/*if(!item.hotWordArr||item.hotWordArr.length<1){//未选择热词
				item.hotWordActive=true;
			}

			//ArtDialog.toast("提交成功");*/

			var len=item.selectTypeIds ?item.selectTypeIds.length: 0;
			for(var i=0;i<len;i++){
				// if(item.selectTypeIds[i])
				item.bigTagArr.remove(item.selectTypeIds[i]);
			}
			var bigTagArr=item.bigTagArr.concat(item.secTypeArr);
			var options={
				// 商品CODE
				goodsCode:item.goodsCode,
				// 艺术品ID
				originalId:item.originalId,
				// 版权问题
				copyRightIssue:item.versionProblem,
				// 语言分类ID
				languageId:item.languageArr?item.languageArr.join(","):"",
				// 媒介分类ID
				mediumId:item.mediaArr?item.mediaArr.join(","):"",
				// 主题分类IDS
				themeIds:bigTagArr?bigTagArr.join(","):"",
				// 热词CODE
				hotwordsCodes:"",
				// 小编标签
				labels:item.labels,
				// 标签评分
				labelScore:item.labelScore,
				// 打星
				starNumber:$('#stars_' + item.id).data('star') || 0
			};
			goodsEditorSubmitFunc(options);
		}


		//小编数据提交
		var goodsEditorSubmitStatus=false;
		function goodsEditorSubmitFunc(options){
			if(goodsEditorSubmitStatus){
				return;
			}
			goodsEditorSubmitStatus=true;
			$.ajax({
			    type: "POST",
			    url: URL.goodsEditorSubmitUrl,
			    data:options,
			    success: function(data){
			    	$scope.$apply(function(){
				    	goodsEditorSubmitStatus=false;
						if (data.code === CONFIG.CODE_SUCCESS) {
							var result=data.result;
							if(result){
								// $scope.editorGoods.goodsList.remove($scope.editorGoods.goodsList[$scope.editorGoods.goodIndex]);
								$scope.editorGoods.goodsList[$scope.editorGoods.goodIndex].noData=true;
								ArtDialog.toast("提交成功");
							}
						}else {
							// if (typeof(error) === 'function') error();
							ArtDialog.toast("操作失败！");
						}
					});
			    },
			    error:function(data){
			    	$scope.$apply(function(){
				    	goodsEditorSubmitStatus=false;
						// if (typeof(error) === 'function') error();
						ArtDialog.toast("操作失败！");
					});
			    }
			});
		};
		/**
		 * 显示全文
		**/
		$scope.showFullText=function(txt){
			var msg=txt?txt:"";
			ArtDialog.toast({"msg":msg,"close":false,icoCss:{"color":"#000"},dialogCss:{background:"#fff",color:"#000"},bodyCss:{color:"#000"}});
		};

		/**
		下载图片
		*/
		$scope.saveImage=function(imgPath){
			// window.open(URL.downloadUrl+"?path="+imgPath);
			window.location.href=URL.downloadUrl+"?path="+imgPath;
		};
		/**
		加载评分结果
		**/
		$scope.loadTagScore=function(item){
			var score=100;
			if(!item){
				return score;
			}
			// console.log("loadTagScore==="+JSON.stringify(item));
			var labelStr=item.labels;
			if(labelStr){
				var labels=labelStr.split(",");
				var len=labels.length;
				for(var i=0;i<len;i++){
					score-=15;
				}
			}
			if(score<0){
				score=0;
			}
			item.labelScore=score;
			return score;
		};

		//加载是否选中
		$scope.loadLiTag=function(item,ids,typeId,id){
			// switch(type.id){
			// 	case: 105://|5  媒介

			// 	break;
			// 	case: 465://语言
			// 	break;
			// 	case: 2://大标签
			// 	break;
			// 	default:

			// }
			// return false;
			var activeId=getTagActiveStatus(ids,id);
			if(activeId==""){
				return false;
			}else{
				//if(typeId==2||typeId==465||typeId==105){//多选   105:|5  媒介   465:语言  2:大标签
				if(typeId==105){
					item.mediaArr=[id];
					item.mediaActive=false;
				}else if (typeId==465){
					item.languageArr=[id];
					item.languageActive=false;
				}else if(typeId==2){
					if(!item.bigTagArr){
						item.bigTagArr=[];
					}
					item.bigTagArr.push(id);
					item.bigTagActive=false;
					item.bigTagArr=item.bigTagArr.unique();
				}else if(typeId=="reci"){
					if(!item.hotWordArr){
						item.hotWordArr=[];
					}
					item.hotWordArr.push(id);
					item.hotWordActive=false;
					item.hotWordArr=item.hotWordArr.unique();
				}else if(typeId=="sec"){
					if(!item.secTypeArr){
						item.secTypeArr=[];
					}
					if(!item.selectTypeIds){
						item.selectTypeIds=[];
					}
					item.secTypeArr.push(id);
					item.secTypeActive=false;
					item.secTypeArr=item.secTypeArr.unique();
					// if(type&&type.selectId){
					// 	item.selectTypeIds.push(type.selectId);
					// 	item.selectTypeIds=item.selectTypeIds.unique();
					// }
				}
				return true;
			}
		};

		// $scope.tagMultClick=function(item,id){
		// 	if(id==2){//多选

		// 	}

		// };
		//初始化item type child
		$scope.editorGoods.initItemChild=function(item,children){
			/*var len=0;
			if(children&&children.length>0){
				len=children.length;
			}
			var typeChilds=[];
			for(var i=0;i<len;i++){
				typeChilds.push(children[i]);
			}
			item.typeChilds=typeChilds;*/
			item.typeChilds= jQuery.extend(true,{}, children);
		};

		$scope.tagClick=function(item,type,id,liTag,index){
			var typeId=type.id;
			if(typeId==2||typeId==465||typeId==105||typeId=='sec'){//多选   105:|5  媒介 465:语言  2:大标签
				var flag=false;

				var typeIdStr=item.typeIds;
				var typeIds=[];
				var count=0;
				if(typeIdStr){
					typeIds=typeIdStr.split(",");
					var len=typeIds.length;
					for(var i=0;i<len;i++){
						if(id==typeIds[i]){
							// typeIds.remove(id);
							flag=true;
							break;
						}
					}
				}
				/*else if(typeId=="sec"){
						var secTypeStr=item.secTypes;//二级分类
						var secTypes=[];
						if(secTypeStr){
							secTypes=secTypeStr.split(",");
							var len=secTypes.length;
							for(var i=0;i<len;i++){
								if(id==secTypes[i]){
									flag=true;
									break;
								}
							}
						}
					}*/

				if(flag){//取消选中
					//item.childShow=false;
					if(typeId==105){
						// if(!item.mediaArr){
							item.mediaArr=[];
						// }
						// mediaCount++;
					}else if (typeId==465){
						// if(!item.languageArr){
							item.languageArr=[];
						// }
						// languageCount++;
					}else if(typeId==2){
						if(liTag&&liTag.children&&liTag.children.length>0){
							// liTag.childShow=false;
							item.typeChilds[index].childShow=false;
							// $scope.editorGoods.childActiveId=item.id;
						}
						if(!item.bigTagArr){
							item.bigTagArr=[];
						}
						item.bigTagArr.remove(id);
					}else if(typeId=="sec"){						
						if(!item.secTypeArr){
							item.secTypeArr=[];
						}
						item.secTypeArr.remove(id);
						if(!item.selectTypeIds){
							item.selectTypeIds=[];
						}
						if(liTag){
							item.selectTypeIds.remove(liTag.id);
							// item.selectTypeIds=item.selectTypeIds.unique();
						}
					}
				}else{//选中
					//item.childShow=true;
					if(typeId==105){
						// if(!item.mediaArr){
							item.mediaArr=[id];
						// }
						//媒介加载热词
						// $scope.hotWordCondition.typeId=id;
						// getHotwordsListByTypeId(item,$scope.hotWordCondition);
						// mediaCount++;
					}else if (typeId==465){
						// if(!item.languageArr){
							item.languageArr=[id];
						// }
						// languageCount++;
					}else if(typeId==2){
						if(!item.bigTagArr){
							item.bigTagArr=[];
						}
						var bigTagCount=item.bigTagArr.length;
						if(bigTagCount<2){
							item.bigTagArr.push(id);
						}else{
							ArtDialog.toast("主题最多可选择两项，选择后再次点击反选");
							return;
						}						
						if(liTag&&liTag.children&&liTag.children.length>0){
							// liTag.childShow=true;
							item.typeChilds[index].childShow=true;
						}
					}else if(typeId=="sec"){						
						if(!item.secTypeArr){
							item.secTypeArr=[];
						}
						item.secTypeArr.push(id);
						if(!item.selectTypeIds){
							item.selectTypeIds=[];
						}
						if(liTag){
							item.selectTypeIds.push(liTag.id);
							item.selectTypeIds=item.selectTypeIds.unique();
						}
						// var hotWordCount=item.secTypeArr.length;
						/*if(hotWordCount<3){
							item.secTypeArr.push(id);
						}else{
							ArtDialog.toast("热词最多可选择三项，选择后再次点击反选");
						}*/
					}
				}
				var tempArr=[].concat(item.mediaArr?item.mediaArr:[],item.languageArr?item.languageArr:[],item.bigTagArr?item.bigTagArr:[]);
				if(item.secTypeArr&&item.secTypeArr.length>0){
					tempArr=tempArr.concat(item.secTypeArr?item.secTypeArr:[]).unique();
				}
				if(tempArr.length>0){
					item.typeIds=tempArr.join(",");
				}else{
					item.typeIds="";
				}
				// if(liTag){
				// 	if(item.secTypeArr&&item.secTypeArr.length>0){
				// 		liTag.childTypes=item.secTypeArr.join(",");
				// 	}
				// }
			}else{
				var flag=false;
				if(typeId=="reci"){
					var hotWordStr=item.hotWordIds;//热词
					var hotWordIds=[];
					if(hotWordStr){
						hotWordIds=hotWordStr.split(",");
						var len=hotWordIds.length;
						for(var i=0;i<len;i++){
							if(id==hotWordIds[i]){
								flag=true;
								break;
							}
						}
					}
				}


				if(flag){//取消
					if(typeId=="reci"){
						if(!item.hotWordArr){
							item.hotWordArr=[];
						}
						item.hotWordArr.remove(id);
					}
				}else{
					if(typeId=="reci"){
						if(!item.hotWordArr){
							item.hotWordArr=[];
						}
						var hotWordCount=item.hotWordArr.length;
						if(hotWordCount<3){
							item.hotWordArr.push(id);
						}else{
							ArtDialog.toast("热词最多可选择三项，选择后再次点击反选");
							return;
						}
					}
				}
				var tempArr=[].concat(item.hotWordArr?item.hotWordArr:[]);
				if(tempArr.length>0){
					item.hotWordIds=tempArr.join(",");
				}else{
					item.hotWordIds="";
				}
			}
		};

		//图片加载完成执行事件
		// $scope.editorGoods.loadImgFinish=function($event){
		// 	var $img=$($event.target);
		// 	console.log("----"+$img.attr("src"));
		// 	$img.parent().css("background","#f0f0f0");
		// }

		//审核不通过事件
		// goodsCode=&reason=
		$scope.verifyNoPass=function(goodsCode,index){
			$scope.editorGoods.goodIndex=index;
			var template='<div style="line-height:30px;padding:10px 30px 0;"><input type="checkbox" name="unPassedReason" value="标签描述不匹配">标签描述不匹配<br><input type="checkbox" name="unPassedReason" value="违反法律法规">违反法律法规<br><input type="checkbox" name="unPassedReason" value="侵权嫌疑">侵权嫌疑</div>';
			ArtDialog.confirm({title:false,
				"ok":true,
				"msg":template,
				"okTxt":"确定",
				"cancel":true,
				"cancelTxt":"取消",
				"okCall":function(){
					// $scope.editorGoods.goodsList.remove(item);
					var $unPassedReasons=$(".art-dialog input[name='unPassedReason']:checked");
					var reasons=[];
					$unPassedReasons.each(function(){
						reasons.push($(this).val());
					});
					if(reasons.length<1){
						// ArtDialog.toast("请选择不通过理由！");
						return;
					}
					verifyUnpassedFunc({"goodsCode":goodsCode,"reason":reasons.join(",")})
					ArtDialog.closeConfirm();
					//ArtDialog.toast("审核成功");

				}
			});
		};

		//审核不通过
		var verifyStatus=false;
		function verifyUnpassedFunc(options){
			if(verifyStatus){
				return;
			}
			verifyStatus=true;
			$.ajax({
			    type: "POST",
			    url: URL.verifyUnpassedUrl,
			    data:options,
			    success: function(data){
			    	$scope.$apply(function(){
				    	verifyStatus=false;
						if (data.code === CONFIG.CODE_SUCCESS) {
							var result=data.result;
							if(result){
								// $scope.editorGoods.goodsList[$scope.editorGoods.goodIndex].editStatus=30;
								// $scope.editorGoods.goodsList.remove($scope.editorGoods.goodsList[$scope.editorGoods.goodIndex]);
								$scope.editorGoods.goodsList[$scope.editorGoods.goodIndex].noData=true;
								ArtDialog.toast("已退回");
							}
						}else {
							// if (typeof(error) === 'function') error();
							ArtDialog.toast("操作失败！");
						}
					});
			    },
			    error:function(data){
			    	$scope.$apply(function(){
				    	verifyStatus=false;
						// if (typeof(error) === 'function') error();
						ArtDialog.toast("操作失败！");
					});
			    }
			});
		};

		//标签删除
		$scope.deleteTag=function($event,item,tag){
			var tags=item.labels.split(",");
			tags.remove(tag);
			if(tags.length>0){
				item.labels=tags.join(",");
			}else{
				item.labels=null;
			}
		};

		//标签添加
		$scope.addTag=function($event,item,type){
			var tagContent=item.tagContent;
			if(!tagContent){
				return;
			}
			var tags=tagContent.split(",");
			if(type=="blur"){
				if(!item.tags){
					item.tags=[];
				}
				// item.tags=item.tags.concat(tags);
				// item.tags=addUniqueTags(item.tags,tags);
				item.labels=addUniqueTags(item.labels,tags);
				item.tagContent="";
			}else if(type==="keyup"){
				if ($event.keyCode == 13 ||$event.keyCode == 188) { // enter 键 逗号键
					if(!item.tags){
						item.tags=[];
					}
					// item.tags=item.tags.concat(tags);
					item.labels=addUniqueTags(item.labels,tags);
					item.tagContent="";
				}
			}
		};

		function getTagActiveStatus(ids,id){
			if(ids){
				var typeIds=ids.split(",");
				// console
				var len=0;
				if(typeIds){
					len=typeIds.length;
				}
				for(var i=0;i<len;i++){
					if(id==typeIds[i]){
						return id;
					}
				}
			}
			return "";
		}

		//过滤重复值
		function addUniqueTags(dest,src){
			if(!dest){
				dest=[];
			}else{
				dest=dest.split(",");
			}
			if(src){
				var slen=src.length,dlen=dest.length;
				for(var i=0;i<slen;i++){
					var flag=false;
					if(!src[i]){
						break;
					}
					for(var j=0;j<dlen;j++){
						if(src[i]==dest[j]){
							flag=true;
							break;
						}
					}
					if(!flag){
						dest.push(src[i]);
					}
				}
			}
			return dest.join(",");
		}

		//上传处理
		$scope.uploadPic=function(item,index){
			// ArtDialog.toast("上传成功");
			$scope.editorGoods.goodIndex=index;
			var template='<div id="editor_upload_container">选择图片:<input type="text" class="editor-file-txt"> <button type="button" class="editor-upload-btn" id="editor_upload_btn">选择</button></div>';
			ArtDialog.confirm({title:false,
				"ok":true,
				"msg":template,
				"okTxt":"确定",
				"cancel":true,
				"cancelTxt":"取消",
				"okCall":function(){
					ArtUploader.uploader.start();
					ArtDialog.closeConfirm();
					//ArtDialog.toast("审核成功");
				}
			});
			ArtUploader.init({callback:function(imgPath){
				ArtDialog.toast("上传成功");
				// $scope.$apply(function(){
					// item.imagePath=imgPath;
					var url=$scope.imgUrl+imgPath+$scope.qnProduct;
					$("#img_box_"+index).attr("src",url);
					// $scope.editorGoods.goodsList[$scope.editorGoods.goodIndex]=item;
				// });
			},errorFunc:function(){
				// ArtDialog.closeConfirm();
				ArtDialog.toast("上传失败");
			},originalId:item.originalId});
		};
		//加载广告图
	/*	$scope.loadAdvert=function(){
			var options={
				imgs:["/images/img-loading_1x.gif",
				"/images/img-loading_1x.gif",
				"/images/img-loading_1x.gif",
				"/images/img-loading_1x.gif",
				"/images/img-loading_1x.gif"
				],
				callback:function(){
					var slider=new Slider({"id":"slider",width:500,"scrollEnd":function(index){
					}});
					var $ico_prev=$(".art-img-prev");
					$ico_prev.click(function(){
						slider.prev();
					});
					var $ico_next=$(".art-img-next");
					$ico_next.click(function(){
						slider.next();
					});
				}
			};
			//图片预览
			ArtDialog.imgPreview(options);
		};*/

		//加载导航数据
		function loadNavData(){
			var lang=$scope.editorLang;
			$scope.nav={"active":"goodList"};
			$scope.nav.navList=[{code:"goodList",name:lang.nav.pic,href:"/page/"+ArtJS.server.language+"/edit/normal/picture.html"},
			{code:"workList",name:lang.nav.original,href:"/page/"+ArtJS.server.language+"/edit/normal/original.html"},
			// {code:"blogList",name:"博客"},
			// {code:"otherList",name:"第三方商品"}
			];
			//导航跳转
			$scope.navJump=function(href){
				if(href){
					window.location.href=href;
				}
			}
			$scope.actions={
				// topSet:true,//置顶设置
				// boutiqueLib:true,//精品库
				noedit:false,//查看所有未处理数据
				recycle:true,//回收站
				recycleUrl:"/page/"+ArtJS.server.language+"/edit/recyoriginal.html"//回收站地址
			};//动作指令显示
		}

	});
	});

	});

	/*normalEditor.controller('editorNavController', function ($scope,$http,$timeout) {
		//导航Tab显示
		$scope.nav={"active":"goodList"};
		$scope.nav.navList=[{code:"goodList",name:"图片"},
		{code:"workList",name:"原作"},
		{code:"blogList",name:"博客"},
		{code:"otherList",name:"第三方商品"}];

		$scope.actions={noedit:true,recycle:true};//动作指令显示
	});*/
})();
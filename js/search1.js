/**
 *   搜索相关处理
 *   modify  2016-01-16   author eric
**/

// if (!ArtJS.login.checkUserStatus()) location.href = '/';
var mallSeach=angular.module('mallSearch', ['modHeaderFull']);
mallSeach.controller('mallSearchCtr', function ($scope, $http, $timeout) {
	var goodsStatus=false,//获取搜索商品状态  防止重复获取
	scrollStatus=true;//滚动状态 
	var URL={
		searchUrl:"/goodsSite/goods/searchGoods?",//搜索商品
		circleUrl:"/topicSocSite/topic/searchTopic?",//搜索圈子
		favoriteUrl:"/goodsSite/arts/searchArts?",//搜索收藏品
		artorUrl:"/memberSite/members/searchArtists?",//搜索艺术家
		// searchUrl:CONFIG.API.SEARCH.GOODS+"?",//搜索商品
		likeUrl:'goodsSite/goods/like/{goodsId}/{type}',// 喜欢
		pageSize:20,
		igsType:11,
		pageNo:1,
		userId:ArtJS.cookie.get('User_id')||''
	};
	//获取搜索关键字
	var searchContextVal=location.search.getQueryValue("searchContext");
	//初始化页面数据
	var tabData={
		cirList : [],//圈子列表
		goodList : [],//商品列表
		favList : [],//收藏品列表
		artList : []//艺术家列表
	};
	//导航数据
	var navData={"activeNav":"circle","navList":[
		{"code":"circle","works":2,"search":4,"href":"SearchServer/service/search/","name":"圈子"},
		{"code":"goods","works":1,"search":3,"href":"SearchServer/service/search/","name":"商品"},
		{"code":"favorite","works":0,"search":1,"href":"SearchServer/service/search/","name":"收藏品"},
		{"code":"artor","works":3,"search":2,"href":"SearchServer/service/search/","name":"艺术家"}
	]};
	// $scope.LANGUAGE_NOW = LANGUAGE_NOW;
	ArtJS.load(['header'], function () {
		$timeout(function () {
	// LANG.NAME="CN";
			//初始化语言包
			$scope.LANG      = LANG;
			//导航数据
			$scope.navData=navData;
			//初始化页面数据
			$scope.tabData=tabData;
			//图片服务器地址
			$scope.imgUrl    = ArtJS.server.image;
			//产品列表格式图片
			$scope.qnProduct = '?imageView2/2/format/jpg/w/320/q/70';
			//图标格式图片
			$scope.qnIcon    = '?imageView2/2/format/jpg/w/20/q/50';
			$scope.qn850    = '?imageView2/2/format/jpg/w/850/q/60';
			//加载中效果
			$scope.loading = 'loading';
			
			//初始化显示搜索商品列表
			$('.art-box').show();

			//获取搜索列表
			if (scrollStatus) {
				scrollStatus = false;
				ArtJS.page.ui.imageLoad.init(100);
				ArtJS.page.ui.scroll({
					callback: function () {
						/*getGoodsList(URL.searchUrl,{
							callback:function(){},
							error:function(){},
							params:{pageNo:URL.pageNo, //页码
								abbr: LANG.NAME,//语言
								igsType:URL.igsType,
								pageSize:URL.pageSize,//每页数量 
								customerId:URL.userId,//用户ID
								searchContext:searchContextVal //搜索关键字
							}});*/
							changeNav($scope.navData.activeNav,"append");
						}
					});
			}

			//获取搜索商品列表
			/*getGoodsList(URL.searchUrl,{
							callback:function(){},
							error:function(){},
							params:{pageNo:URL.pageNo, //页码
								abbr: LANG.NAME,//语言
								pageSize:URL.pageSize,//每页数量 
								igsType:URL.igsType,
								customerId:URL.userId,//用户ID
								searchContext:searchContextVal //搜索关键字
							}});*/
			changeNav($scope.navData.activeNav);

			// 商品详情
			$scope.goodsInfo = function (id) {
				ArtJS.goods.detail(id);
			};
			// 收藏品详情
			$scope.artsInfo = function (id) {
				ArtJS.arts.detail(id);
			}

			//圈子ID编码
			$scope.base64encode= function (id) {
				return base64encode(id+"");
			};

			// 导航切换
			$scope.navChange = function (code) {
				changeNav(code);
			};

			// 喜欢
			var likestatus = true;
			$scope.artsLike = function (obj) {
				var item = obj.item;
				ArtJS.login.pop(function (o) {
					likestatus = false;
					var data = {
						goodsId: item.goodsId,
                		type:    item.light? 2: 1
					}
					$http.get(URL.likeUrl.substitute(data)).
					success(function (data) {
						item.likeCount = data.result;
						item.light = item.light? false: true;
						likestatus = true;
					}).
					error(function () {
						likestatus = true;
					});
				});
			};

			// 鼠标滚动事件
			var mouseScroll = {
				init: function () {
					this.delta = 0;
					this.stNow = 0;
					this.$sideParent  = $('#modHomeSide');
					this.$sideContent = $('#modHomeSideContent');
					this.bindEvent();
				},
				bindEvent: function () {
					var that = this;
					$(document).bind('mousewheel DOMMouseScroll', function (e) {
						that.mousewheel(e);
					});

					$(window).bind('resize', function () {
						that.scrollFn();
					});
				},
				mousewheel: function (e) {
					var value = e.originalEvent.wheelDelta || -e.originalEvent.detail;
					// -1: down 1: up
					this.delta = Math.max(-1, Math.min(1, value));
					this.scrollFn();
				},
				sideArea: function () {
					var ph = this.ph = this.$sideParent.height();
					var ch = this.ch = this.$sideContent.height();
					return ph < ch;
				},
				scrollFn: function () {
					if (this.sideArea()) {
						var max = this.ch - this.ph;
						this.stNow += this.delta*30;
						this.stNow = Math.abs(this.stNow) >= max? -max: this.stNow;
						this.stNow = this.stNow >= 0? 0: this.stNow;
						this.$sideContent.css({
							transform: 'translateY('+this.stNow+'px)'
						});
					} else {
						this.$sideContent.css({
							transform: 'translateY(0px)'
						});
					}
				}
			}
			mouseScroll.init();
		});
	});

	//tab切换
	function changeNav(code,type){
		// alert(code);
		if(type!=="append"){
			URL.pageNo=1;
			for(var i in tabData){
				tabData[i]=[];
			}
			$scope.tabData=tabData;
			$scope.navData.activeNav=code;
		}
		switch(code){
			case "circle"://圈子
				getCircleList(URL.circleUrl,{
					callback:function(){},
					error:function(){},
					params:{pageNo:URL.pageNo, //页码 //&pageSize=20&customerId=&searchContext=1&searchType=02&pageNo=1&abbr=CN
						abbr: LANG.NAME,//语言
						searchType:"02",
						pageSize:URL.pageSize,//每页数量 
						customerId:URL.userId,//用户ID
						searchContext:searchContextVal //搜索关键字
					}});
			break;
			case "goods"://商品
				getGoodsList(URL.searchUrl,{
					callback:function(){},
					error:function(){},
					params:{pageNo:URL.pageNo, //页码
						abbr: LANG.NAME,//语言
						igsType:URL.igsType,
						pageSize:URL.pageSize,//每页数量 
						customerId:URL.userId,//用户ID
						searchContext:searchContextVal //搜索关键字
					}});
			break;
			case "favorite"://收藏品
			//igsType=11&pageSize=20&customerId=&searchContext=%E8%A3%85%E9%A5%B0&pageNo=1&abbr=CN
				getFavoriteList(URL.favoriteUrl,{
						callback:function(){},
						error:function(){},
						params:{pageNo:URL.pageNo, //页码
							abbr: LANG.NAME,//语言
							igsType:URL.igsType,
							pageSize:URL.pageSize,//每页数量 
							customerId:URL.userId,//用户ID
							searchContext:searchContextVal //搜索关键字
						}});
			break;
			case "artor"://艺术家
				getArtList(URL.artorUrl,{
						callback:function(){},
						error:function(){},
						params:{pageNo:URL.pageNo, //页码//searchContext=1&customerId=&pageSize=10&pageNo=1&abbr=CN
							abbr: LANG.NAME,//语言
							// igsType:URL.igsType,
							pageSize:URL.pageSize,//每页数量 
							customerId:URL.userId,//用户ID
							searchContext:searchContextVal //搜索关键字
						}});
			break;
			default:

		}
	};

	//获取搜索商品列表
	function getGoodsList(url,options){
		if(!goodsStatus){//为false的时候才进行数据获取
			goodsStatus=true;//设置为正在获取数据
			var error=options.error,callback=options.callback;
			var searchUrl=url + ArtJS.json.toUrl(options.params);
			$http.get(url + ArtJS.json.toUrl(options.params)).
				success(function (data) {
					goodsStatus=false;//设置为获取数据完成
					if (data.code === CONFIG.CODE_SUCCESS) {
						var pageItems = data.result.pageItems;
						if (pageItems.length) {
							$scope.tabData.goodList = $scope.tabData.goodList.concat(pageItems);
							if (pageItems.length === URL.pageSize) {
								++URL.pageNo;
							}
						}
						$timeout(function () {
							$(window).scroll();
							if (typeof(callback) === 'function') callback();
						});
					} else {
						if (typeof(error) === 'function') error();
					}
				}).
				error(function (data) {
					goodsStatus=false;//设置为获取数据完成
					if (typeof(error) === 'function') error();
				});
		}
	}

	//获取圈子列表
	function getCircleList(url,options){
		if(!goodsStatus){//为false的时候才进行数据获取
			goodsStatus=true;//设置为正在获取数据
			var error=options.error,callback=options.callback;
			var searchUrl=url + ArtJS.json.toUrl(options.params);
			$http.get(url + ArtJS.json.toUrl(options.params)).
				success(function (data) {
					goodsStatus=false;//设置为获取数据完成
					if (data.code === CONFIG.CODE_SUCCESS) {
						var pageItems = data.result.pageItems;
						if (pageItems.length) {
							$scope.tabData.cirList = $scope.tabData.cirList.concat(pageItems);
							if (pageItems.length === URL.pageSize) {
								++URL.pageNo;
							}
						}
						$timeout(function () {
							$(window).scroll();
							if (typeof(callback) === 'function') callback();
						});
					} else {
						if (typeof(error) === 'function') error();
					}
				}).
				error(function (data) {
					goodsStatus=false;//设置为获取数据完成
					if (typeof(error) === 'function') error();
				});
		}
	}

	//获取收藏品列表
	function getFavoriteList(url,options){
		if(!goodsStatus){//为false的时候才进行数据获取
			goodsStatus=true;//设置为正在获取数据
			var error=options.error,callback=options.callback;
			var searchUrl=url + ArtJS.json.toUrl(options.params);
			$http.get(url + ArtJS.json.toUrl(options.params)).
				success(function (data) {
					goodsStatus=false;//设置为获取数据完成
					if (data.code === CONFIG.CODE_SUCCESS) {
						var pageItems = data.result.pageItems;
						if (pageItems.length) {
							$scope.tabData.favList =$scope.tabData.favList.concat(pageItems);
							if (pageItems.length === URL.pageSize) {
								++URL.pageNo;
							}
						}
						$timeout(function () {
							$(window).scroll();
							if (typeof(callback) === 'function') callback();
						});
					} else {
						if (typeof(error) === 'function') error();
					}
				}).
				error(function (data) {
					goodsStatus=false;//设置为获取数据完成
					if (typeof(error) === 'function') error();
				});
		}
	}

	//获取艺术家列表
	function getArtList(url,options){
		if(!goodsStatus){//为false的时候才进行数据获取
			goodsStatus=true;//设置为正在获取数据
			var error=options.error,callback=options.callback;
			var searchUrl=url + ArtJS.json.toUrl(options.params);
			$http.get(url + ArtJS.json.toUrl(options.params)).
				success(function (data) {
					goodsStatus=false;//设置为获取数据完成
					if (data.code === CONFIG.CODE_SUCCESS) {
						var pageItems = data.result.pageItems;
						if (pageItems.length) {
							$scope.tabData.artList = $scope.tabData.artList.concat(pageItems);
							if (pageItems.length === URL.pageSize) {
								++URL.pageNo;
							}
						}
						$timeout(function () {
							$(window).scroll();
							if (typeof(callback) === 'function') callback();
						});
					} else {
						if (typeof(error) === 'function') error();
					}
				}).
				error(function (data) {
					goodsStatus=false;//设置为获取数据完成
					if (typeof(error) === 'function') error();
				});
		}
	}

	var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	var base64DecodeChars = new Array( - 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
	function base64encode(str) {
	    var out, i, len;
	    var c1, c2, c3;
	    len = str.length;
	    i = 0;
	    out = "";
	    while (i < len) {
	        c1 = str.charCodeAt(i++) & 0xff;
	        if (i == len) {
	            out += base64EncodeChars.charAt(c1 >> 2);
	            out += base64EncodeChars.charAt((c1 & 0x3) << 4);
	            //out += "==";
	            break;
	        }
	        c2 = str.charCodeAt(i++);
	        if (i == len) {
	            out += base64EncodeChars.charAt(c1 >> 2);
	            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
	            out += base64EncodeChars.charAt((c2 & 0xF) << 2);
	            //out += "=";
	            break;
	        }
	        c3 = str.charCodeAt(i++);
	        out += base64EncodeChars.charAt(c1 >> 2);
	        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
	        out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
	        out += base64EncodeChars.charAt(c3 & 0x3F);
	    }
	    return out+"ECDO";
	}
	function base64decode(str) {
	    var c1, c2, c3, c4;
	    var i, len, out;
	    len = str.length;
	    i = 0;
	    out = "";
	    while (i < len) {
	        /* c1 */
	        do {
	            c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
	        } while ( i < len && c1 == - 1 );
	        if (c1 == -1) break;
	        /* c2 */
	        do {
	            c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
	        } while ( i < len && c2 == - 1 );
	        if (c2 == -1) break;
	        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
	        /* c3 */
	        do {
	            c3 = str.charCodeAt(i++) & 0xff;
	            if (c3 == 61) return out;
	            c3 = base64DecodeChars[c3];
	        } while ( i < len && c3 == - 1 );
	        if (c3 == -1) break;
	        out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
	        /* c4 */
	        do {
	            c4 = str.charCodeAt(i++) & 0xff;
	            if (c4 == 61) return out;
	            c4 = base64DecodeChars[c4];
	        } while ( i < len && c4 == - 1 );
	        if (c4 == -1) break;
	        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
	    }
	    return out;
	}
});
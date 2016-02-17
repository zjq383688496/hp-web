;var shopApp = angular.module('shops', ['modHeaderFull','modUserHead','mod-icon']);
shopApp.controller('shopCtr', function ($scope, $http, $timeout) {
	ArtJS.load(['header'], function () {
		$timeout(function () {
			var UIL = {
				getMyLikeMarket:    '/goodsSite/personCenter/getLikeGoods?',          // 获取商品
				//getMyLikeMarket: '/goodsSite/market/getMyLikeMarket?',
				//ajaxLike:    '/goodsSite/arts/like?', //artlike
				ajaxLike:    '/goodsSite/goods/like?', //artlike
				shopLike:       '/goodsSite/goods/like?',//shop
				topicSocSite: '/topicSocSite/topic/getTypeBasesByPage?'//获取分类
			}
			var status = true;
			var scrollStatus = true,
				ufag = true;

			$scope.cooid =ArtJS.cookie.get("User_id");
        	$scope.id =request('uid');
        	$scope.rNumber = 0;

			$scope.DATA = {
				pageSize: 20,
				pageNo: 1,
				parentCategoryId: 0,
				customerId:$scope.id,
				abbr: LANG.NAME
			};
			$scope.DATASoc = {
				indexTag: 2,
				page: 'index',
				source: 'web',
				abbr: LANG.NAME
			}
			$scope.imgUrl    = ArtJS.server.image;
			$scope.qnIcon = '?imageView2/1/format/jpg/w/20/h/20/q/50';
			$scope.qnProduct = '?imageView2/2/format/jpg/w/270/q/50';
			$scope.LANG      = LANG;
			$scope.ushopItems = [];
			$scope.utopicSocSite = [];
			$scope.uClassShop = [];
			$scope.uName = [];

			$('.shop-nav-right,.art-shop-box').show();
			$('#nav01').addClass('active');
			$scope.getListArts = function (callback, error) {
				$('.data-not').hide();
				status = true;
				$scope.ushopItems = [];
				$scope.DATA.pageNo = 1;
				$scope.getMarketData(function () {
					if (scrollStatus) {
						scrollStatus = false;
						ArtJS.page.ui.imageLoad.init(100);
						ArtJS.page.ui.scroll({
							callback: function () {
								$scope.getMarketData();
							}
						});
					}
					if (typeof(callback) === 'function') callback();
				}, function () {
					 if (!$scope.ushopItems.length) $('.data-not').show();
					 if (typeof(error) === 'function') error();
				});
			}
			$scope.getMarketData = function (callback, error) {
				if (status) {
					status = false;
					$http.get(UIL.getMyLikeMarket + ArtJS.json.toUrl($scope.DATA)).
					success(function (data) {
						if (data.code === CONFIG.CODE_SUCCESS) {
							ufag = true;
							var ushopItems = data.result.pageItems;
							if (ushopItems.length) {
								$scope.ushopItems = $scope.ushopItems.concat(ushopItems);
								$.each(ushopItems, function (i, item) {
			                        item.uId=base64encode(item.createUserId.toString());
			                    });
								if (ushopItems.length === $scope.DATA.pageSize) {
									++$scope.DATA.pageNo;
									status = true;
								}
								$timeout(function () {
									$(window).scroll();
									if (typeof(callback) === 'function') callback();
								});
							} else if (typeof(error) === 'function') error();
						} else {
							status = true;
							ufag = true;
							if (typeof(error) === 'function') error();
						}
					}).
					error(function (data) {
						status = true;
						ufag = true;
						if (typeof(error) === 'function') error();
					});
				}
			}
			$scope.topicSocSite = function (callback, error) {//分类
					$http.get(UIL.topicSocSite + ArtJS.json.toUrl($scope.DATASoc)).
					success(function (data) {
						if (data.code === CONFIG.CODE_SUCCESS) {
							var utopicSocSite = data.result;
							$.each(utopicSocSite, function (i, item) {
								var uIDd = item.id;
								if(uIDd == 4){
									$scope.uClassShop = item.children;
									$scope.uName = item.typeName;
								}
			                 });
						} else {
							if (typeof(error) === 'function') error();
						}
					}).
					error(function (data) {
						if (typeof(error) === 'function') error();
					});
			}
			 /**
		     * like点击取消
		     * @param goodsId
		     */
		    $scope.getLikeArts = function (data) {
		        ArtJS.login.pop(function () {
		        	var dId = data.goodsId;
		        	var artType = data.type;
		        	var Pajax;
		        	var $bfont = $('.user-nav ul').find('li#nav01').find('font'),
		        		pVal = parseInt($bfont.html());
		        	$scope.LIKEDATA = {
						goodsId: data.goodsId,
		                type: (data.light?'2':'1'),
		                //memberId:ArtJS.login.userData.memberId || ''
					};
					//  0 : 艺术品 1 潮品 2 衍生品
		            if (artType == '0') {
		                Pajax = UIL.ajaxLike;
		            } else if (artType == '1' || artType == '2') {
		                Pajax = UIL.shopLike;
		            }
					$http.post(Pajax + ArtJS.json.toUrl($scope.LIKEDATA)).
						success(function (data) {
							if (data.code === CONFIG.CODE_SUCCESS) {
								$bfont.html(parseInt(pVal -1));
								var $inUl = $('.art-shop-box').find('li');
								$inUl.each(function(i, e) {
									console.log(+'sdfdsfsdf');
					        		var that = $(this);
					        		var vId = that.attr('data-in').replace(/[^0-9]/ig,"");
					        		if(vId == dId){
					        			that.fadeOut(300, function() {
							                //移除父级
							                that.remove();
							            });
					        		}
					        	});
							}
						});
		        });
		    }
		    // 商品详情
			$scope.ugoodsInfo = function (item) {
				ArtJS.goods.detail(item.goodsId);
			}
		    //分类筛选
		    $scope.uShop = function (data,obj){
		    	if(ufag){
		    		ufag = false;
			    	var act = obj.target.getAttribute('typ');
			    	if(act ==0){
			    		obj.target.setAttribute('typ',1);
			    		obj.target.className ='';
			    		$scope.DATA.parentCategoryId = 0;
			    	}else{
			    		$('.shop-nav-left dd>span').attr("typ",1);
			    		obj.target.setAttribute('typ',0);
			    		$('.shop-nav-left dd>span').removeClass('active');
			    		obj.target.className ='active';
			    		$scope.DATA.parentCategoryId = data.id;
			    	}
			    	$scope.getListArts();
		    	}
		    }
		    //滚动事件
			$(window).scroll(function(){
				var boxFind = $('.shop-nav-left');
				var gaL = $('dl');
				var gaR = $('.shop-nav-right');
				var fxdTop = boxFind.offset().top - 70;
	            if($(window).scrollTop() >=fxdTop){
					gaL.addClass("fixed");
					gaR.css({
						'left':'130px'
					});
					gaL.animate({top:"56px"},500);
				}else{
					gaL.removeClass("fixed");
					gaR.css({
						'left':'0'
					});
					gaL.css({top:"0"},2);
				}
			});
			$scope.getListArts();
			$scope.topicSocSite();
		});
	});
});
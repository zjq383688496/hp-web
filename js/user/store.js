;var storeApp = angular.module('stores', ['modHeaderFull','modUserHead','mod-icon']);
storeApp.controller('storeCtr', function ($scope, $http, $timeout) {
	ArtJS.load(['header'], function () {
		$timeout(function () {
			var UIL = {
				getMyLikeMarket:    '/goodsSite/personCenter/getStore?',          // 获取商品
				//getMyLikeMarket: '/goodsSite/market/getMyLikeMarket?',
				storeLike:       '/goodsSite/goods/like?'//store
			}
			var status = true;
			var scrollStatus = true;

			$scope.cooid =ArtJS.cookie.get("User_id");
        	$scope.id =request('uid');
        	$scope.rNumber = 0;

			$scope.DATA = {
				pageSize: 20,
				pageNo: 1,
				customerId:$scope.id,
				recordsNumber:$scope.rNumber,
				abbr: LANG.NAME
			};
			$scope.imgUrl    = ArtJS.server.image;
			$scope.qnIcon = '?imageView2/1/format/jpg/w/20/h/20/q/50';
			$scope.qnProduct = '?imageView2/2/format/jpg/w/270/q/50';
			$scope.LANG      = LANG;
			$scope.ustoreItems = [];
			$scope.uBan =ArtJS.cookie.get("uBanner");
			$scope.ueditSt =LANG.BUTTON.EDIT;

			$('.stores-nav-right,.art-stores-box').show();
			$('#nav04').addClass('active');
			$scope.getListArts = function (callback, error) {
				$('.data-not').hide();
				status = true;
				$scope.ustoreItems = [];
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
					 if (!$scope.ustoreItems.length) $('.data-not').show();
					 if (typeof(error) === 'function') error();
				});
			}

			$scope.getMarketData = function (callback, error) {
				if (status) {
					status = false;
					$http.get(UIL.getMyLikeMarket + ArtJS.json.toUrl($scope.DATA)).
					success(function (data) {
						if (data.code === CONFIG.CODE_SUCCESS) {
							var ustoreItems = data.result.pageItems;
							if (ustoreItems.length) {
								$scope.rNumber = data.result.recordsNumber;
								$scope.ustoreItems = $scope.ustoreItems.concat(ustoreItems);
								$.each(ustoreItems, function (i, item) {
			                        item.uId=base64encode(item.createUserId.toString());
			                    });
								if (ustoreItems.length === $scope.DATA.pageSize) {
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
							if (typeof(error) === 'function') error();
						}
					}).
					error(function (data) {
						status = true;
						if (typeof(error) === 'function') error();
					});
				}
			}
			 /**
		     * like点击取消
		     * @param goodsId
		     */
		    $scope.getLikeArts = function (data,obj) {
		        ArtJS.login.pop(function () {
		        	var dId = data.goodsId;
		        	var ght = data.light;
		        	var sght =obj.target.parentNode.getAttribute('data-ght');
		        	$scope.LIKEDATA = {
						goodsId: dId,
		                type: (sght=='true'?'2':'1'),
					};
					$http.post(UIL.storeLike + ArtJS.json.toUrl($scope.LIKEDATA)).
						success(function (data) {
							if (data.code === CONFIG.CODE_SUCCESS) {
								var $inUl = $('.art-stores-box').find('li');
								$inUl.each(function(i, e) {
					        		var that = $(this);
					        		var vId = that.attr('data-in').replace(/[^0-9]/ig,"");
					        		var vdiv = that.find('.light-price');
					        		var vght = vdiv.find('span');
					        		var iVal = parseInt(vdiv.find('i').html());
					        		
					        		if(vId == dId){
					        			var ght = vght.attr('data-ght');
					        			if(ght =='true'){
					        				vght.attr('data-ght',false);
					        				vdiv.find('b').removeClass('light');
					        				vdiv.find('i').html(parseInt(iVal -1));
					        			}else if(ght =='false'){
					        				vght.attr('data-ght',true);
					        				vdiv.find('b').addClass('light');
					        				vdiv.find('i').html(parseInt(iVal +1));
					        			}
					        		}
					        	});
							}
						});
		        });
		    }
		    //gCoverFun
		    $scope.gCoverFun = function(){
		    	var $gBox = $('.ga-cover-editor');
		    	mask.sk();
				$gBox.fadeIn();
				$gBox.find('.icon-close-b').click(function(){
					$gBox.fadeOut();
					$('.cover-mark').remove();
					$('body').removeAttr('style');
				});
		    }
		    // 商品详情
			$scope.ugoodsInfo = function (item) {
				ArtJS.goods.detail(item.goodsId);
			}
		    var mask ={
				sk:function(){
					$('body').after('<div class="cover-mark"></div>');
					$('body').css({
						'overflow':'hidden'
					});
				}
			}
			//滚动事件
			$(window).scroll(function(){
				var boxFind = $('.user-nav-box');
				var gaL = $('.st-box');
				var gaR = $('.stores-nav-right');
				var fxdTop = boxFind.offset().top + 340;
	            if($(window).scrollTop() + boxFind.outerHeight()>=fxdTop){
					gaL.addClass("fixed");
					gaR.css({
						'left':'130px'
					});
					gaL.animate({top:"56"},2);
				}else{
					gaL.removeClass("fixed");
					gaR.css({
						'left':'0'
					});
					gaL.animate({top:"0"},2);
				}
			});
			$scope.getListArts();
		});
	});
});
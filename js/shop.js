var shopApp = angular.module('shop', ['modHeaderFull', 'modHomeTag']);
shopApp.controller('shopCtr', function ($scope, $http, $timeout) {
	ArtJS.load(['header'], function () {
		$timeout(function () {
			var API = {
				market: '/goodsSite/market/getIndexMarket?',		// 获取商品
				like:   '/goodsSite/goods/like/{goodsId}/{type}',	// 喜欢
				banner: '/topicSocSite/topic/banner?'				// banner
			}
			var getstatus = true;
			var scrollStatus = true;
			$scope.DATA = {
				pageSize: 18,
				pageNo: 1,
				clientType: 'web',
				abbr: LANG.NAME
			};
			$scope.imgUrl    = ArtJS.server.image;
			$scope.qnProduct = '?imageView2/2/format/jpg/w/270/q/90';
			$scope.qnIcon    = '?imageView2/2/format/jpg/w/20/q/50';
			$scope.qn850    = '?imageView2/2/format/jpg/w/850/q/90';
			$scope.LANG      = LANG;
			$scope.pageItems = [];
			$scope.banner    = [];

			$('.art-box').show();

			$scope.loading = 'loading';

			// 初始化Banner
			$scope.getBanner = function () {
				$http.get(API.banner + ArtJS.json.toUrl({source: 1, abbr: LANG.NAME})).
				success(function (data) {
					if (data.code === CONFIG.CODE_SUCCESS) {
						var li  = data.result;
						var len = li.length;
						if (len) {
							for (var i = 0; i < len; i++) {
								var l = li[i];
								l.imgUrl = l.imgUrl.replace('imgsrv/', '');
							}
							$scope.banner = li;
							$scope.haveBanner = true;
							setTimeout(function () {
								ArtJS.page.ui.autoPlayer.init({
									parent: '.home-banner',
									img: '.banner-img>.img'
								});
							}, 100);
						} else if (typeof(error) === 'function') error();
					} else {
						if (typeof(error) === 'function') error();
					}
				}).
				error(function (data) {
					if (typeof(error) === 'function') error();
				});
			}

			// 初始化获取数据
			$scope.getIndexMarket = function (callback, error) {
				getstatus = true;
				$('.data-not').hide();
				$scope.pageItems = [];
				$scope.DATA.pageNo = 1;
				$scope.DATA.customerId = CONFIG.USER.UESR_ID;
				delete($scope.DATA.recordsNumber);
				$scope.getMarketData(function () {
					// 一次性执行函数
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
					if (!$scope.pageItems.length) $('.data-not').show();
					if (typeof(error) === 'function') error();
				});
			}

			// 获取数据
			$scope.getMarketData = function (callback, error) {
				if (getstatus) {
					$scope.loading = 'loading';
					getstatus = false;
					$http.get(API.market + ArtJS.json.toUrl($scope.DATA)).
					success(function (data) {
						if (data.code === CONFIG.CODE_SUCCESS) {
							var pageItems = data.result.pageItems;
							$scope.DATA.recordsNumber = data.result.recordsNumber;
							if (pageItems.length) {
								$scope.pageItems = $scope.pageItems.concat(pageItems);
								if (pageItems.length === $scope.DATA.pageSize) {
									++$scope.DATA.pageNo;
									getstatus = true;
								}
								$timeout(function () {
									$(window).scroll();
									if (typeof(callback) === 'function') callback();
								});
							} else if (typeof(error) === 'function') error();
							$scope.loading = '';
						} else {
							getstatus = true;
							if (typeof(error) === 'function') error();
							$scope.loading = '';
						}
					}).
					error(function (data) {
						getstatus = true;
						if (typeof(error) === 'function') error();
						$scope.loading = '';
					});
				}
			}

			// 商品详情
			$scope.goodsInfo = function (id) {
				ArtJS.goods.detail(id);
			}

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
					$http.get(API.like.substitute(data)).
					success(function (data) {
						item.likeCount = data.result;
						item.light = item.light? false: true;
						likestatus = true;
					}).
					error(function () {
						likestatus = true;
					});
				});
			}
			$scope.tagGetIndexMarket = function (obj, type) {
				var tagScope = scopeArr['tag'];
				tagScope.getIndexMarket(obj, type);
			}

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

			//$scope.getBanner();
			$scope.getIndexMarket();
			scopeArr['shop'] = $scope;
		});
	});
});
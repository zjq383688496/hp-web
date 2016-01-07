var shopApp = angular.module('shop', ['modHeaderFull', 'modHomeTag']);
shopApp.controller('shopCtr', function ($scope, $http, $timeout) {
	ArtJS.load(['header'], function () {
		$timeout(function () {
			var API = {
				market:    '/goodsSite/market/getIndexMarket?',	// 获取商品
				artslike:  '/goodsSite/arts/like?',				// 喜欢艺术品潮品
				goodslike: '/goodsSite/goods/like?'				// 喜欢商品
			}
			var getstatus = true;
			var scrollStatus = true;
			$scope.DATA = {
				pageSize: 20,
				pageNo: 1,
				abbr: LANG.NAME
			};
			$scope.imgUrl    = ArtJS.server.image;
			$scope.qnProduct = '?imageView2/2/format/jpg/w/270/q/50';
			$scope.qnIcon    = '?imageView2/2/format/jpg/w/20/q/50';
			$scope.LANG      = LANG;
			$scope.pageItems = [];

			$('.art-box').show();

			$scope.loading = 'loading';
			// 初始化获取数据
			$scope.getIndexMarket = function (callback, error) {
				status = true;
				$scope.pageItems = [];
				$scope.DATA.pageNo = 1;
				$scope.DATA.customerId = CONFIG.USER.UESR_ID;
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
				console.log(item);
				ArtJS.login.pop(function (o) {
					likestatus = false;
					var url = item.type < 2? API.artslike: API.goodslike;
					var data = {
						id: item.id,
						customerId: CONFIG.USER.UESR_ID,
                		like: item.light? 2: 1
					}
					$http.get(url + ArtJS.json.toUrl(data)).
					success(function (data) {
						var data = data.result;
						item.collectionNumber = data.collectionNumber;
						item.light = data.light;
						likestatus = true;
					}).
					error(function () {
						likestatus = true;
					});
				});
			}

			$scope.getIndexMarket();
			scopeArr['shop'] = $scope;
		});
	});
});
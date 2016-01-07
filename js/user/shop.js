;var shopApp = angular.module('shops', ['modHeaderFull','modUserHead','mod-icon']);
shopApp.controller('shopCtr', function ($scope, $http, $timeout) {
	ArtJS.load(['header'], function () {
		$timeout(function () {
			var UIL = {
				listArts:    '/goodsSite/arts/listArts?',          // 获取商品 
			}
			var status = true;
			var scrollStatus = true;

			$scope.cooid =ArtJS.cookie.get("User_id");

        	$scope.id =request('id');

			$scope.DATA = {
				pageSize: 16,
				pageNo: 1,
				followType: 2,
				memberId:$scope.id,
				abbr: LANG.NAME
			};
			$scope.imgUrl    = ArtJS.server.image;
			$scope.qnIcon = '?imageView2/1/format/jpg/w/20/h/20/q/50';
			$scope.qnProduct = '?imageView2/2/format/jpg/w/270/q/50';
			$scope.LANG      = LANG;
			$scope.ushopItems = [];

			$('.art-box').show();
			$scope.getListArts = function (callback, error) {
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
					 if (typeof(error) === 'function') error();
				});
			}

			$scope.getMarketData = function (callback, error) {
				if (status) {
					status = false;
					$http.get(UIL.listArts + ArtJS.json.toUrl($scope.DATA)).
					success(function (data) {
						if (data.code === CONFIG.CODE_SUCCESS) {
							var ushopItems = data.result.pageItems;
							if (ushopItems.length) {
								$scope.ushopItems = $scope.ushopItems.concat(ushopItems);
								$.each(ushopItems, function (i, item) {
			                        item.uId=base64encode(item.customerId.toString());
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
							if (typeof(error) === 'function') error();
						}
					}).
					error(function (data) {
						status = true;
						if (typeof(error) === 'function') error();
					});
				}
			}
			$scope.getListArts();
		});
	});
});
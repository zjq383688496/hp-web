;var followApp = angular.module('follow', ['modHeaderFull','modUserHead','mod-icon']);
followApp.controller('followCtr', function ($scope, $http, $timeout) {
	ArtJS.load(['header'], function () {
		
		$timeout(function () {
			var UIL = {
				url: '/memberSite/memberFollows/getFollows?',
				opFollow:'/memberSite/memberFollows/opFollow?'
			}
			var status = true;
			var scrollStatus = true;
			$scope.cooid =ArtJS.cookie.get("User_id");
        	$scope.id = request('uid');
			$scope.DATA = {
				pageSize: 16,
				pageNo: 1,
				followType: 0,
				memberId:$scope.id,
				abbr: LANG.NAME
			};
			$scope.imgUrl    = ArtJS.server.image;
			$scope.qnIcon = '?imageView2/1/format/jpg/w/60/h/60/q/50';
			$scope.qnProduct = '?imageView2/1/format/jpg/w/150/h/150/q/50';
			$scope.LANG      = LANG;
			$scope.followItems = [];

			$('.a-follow').addClass('active');
			$scope.getFollowFollows = function (callback, error) {
				$('.data-not').hide();
				status = true;
				$scope.followItems = [];
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
					 if (!$scope.followItems.length) $('.data-not').show();
					 if (typeof(error) === 'function') error();
				});
			}

			$scope.getMarketData = function (callback, error) {
				if (status) {
					status = false;
					$http.get(UIL.url + ArtJS.json.toUrl($scope.DATA)).
					success(function (data) {
						if (data.code === CONFIG.CODE_SUCCESS) {
							var followItems = data.result.pageItems;
							if (followItems.length) {
								$scope.followItems = $scope.followItems.concat(followItems);
								$.each(followItems, function (i, item) {
			                        item.uId=base64encode(item.artistsId.toString());
			                    });
								if (followItems.length === $scope.DATA.pageSize) {
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
			//Follow
			$scope.ngFollow =function(obj){

				ArtJS.login.pop(function () {
 
			        var artistsid =obj.target.getAttribute("artistsid");
			        var code =obj.target.getAttribute("code");

			        $scope.DATA = {
						memberId: $scope.cooid,
		                followingId: artistsid,
		                opType: code
					};
					$http.post(UIL.opFollow + ArtJS.json.toUrl($scope.DATA)).
						success(function (data) {
							if (data.code === CONFIG.CODE_SUCCESS) {
								window.parent.location.reload();
							}
						});
				});
			}
			$scope.getFollowFollows();
		});
	});
});
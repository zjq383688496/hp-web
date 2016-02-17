;var fansApp = angular.module('fans', ['modHeaderFull','modUserHead','mod-icon']);
fansApp.controller('fansCtr', function ($scope, $http, $timeout) {
	ArtJS.load(['header'], function () {
		$timeout(function () {
			var UIL = {
				url: '/memberSite/memberFollows/getFollows?',
				opFollow:'/memberSite/memberFollows/opFollow?'
			}
			var status = true;
			var scrollStatus = true;
			$scope.cooid = ArtJS.cookie.get("User_id");
        	$scope.id = request('uid');
			$scope.DATA = {
				pageSize: 16,
				pageNo: 1,
				followType: 2,
				memberId:$scope.id,
				abbr: LANG.NAME
			};
			$scope.imgUrl    = ArtJS.server.image;
			$scope.qnIcon = '?imageView2/1/format/jpg/w/60/h/60/q/50';
			$scope.qnProduct = '?imageView2/1/format/jpg/w/150/h/150/q/50';
			$scope.LANG      = LANG;
			$scope.fansItems = [];

			$('.fans-nav-right').show();
			$('.a-fans').addClass('active');
			$scope.getFansFollows = function (callback, error) {
				$('.data-not').hide();
				status = true;
				$scope.fansItems = [];
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
					 if (!$scope.fansItems.length) $('.data-not').show();
					 if (typeof(error) === 'function') error();
				});
			}

			$scope.getMarketData = function (callback, error) {
				if (status) {
					status = false;
					$http.get(UIL.url + ArtJS.json.toUrl($scope.DATA)).
					success(function (data) {
						if (data.code === CONFIG.CODE_SUCCESS) {
							var fansItems = data.result.pageItems;
							if (fansItems.length) {
								$scope.fansItems = $scope.fansItems.concat(fansItems);
								$.each(fansItems, function (i, item) {
			                        item.uId=base64encode(item.artistsId.toString());
			                    });
								if (fansItems.length === $scope.DATA.pageSize) {
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

			        if($scope.cooid ==artistsid){
			            $("body").alertTips({
							"titles":"你不能关注自己！！",
							"speed":1000,
							"closeback":function(){
								window.onbeforeunload=undefined;
							}
						});
			            return;
			        }

			        $scope.DATA = {
						memberId: $scope.cooid,
		                followingId: artistsid,
		                opType: code
					};
					$http.post(UIL.opFollow + ArtJS.json.toUrl($scope.DATA)).
						success(function (data) {
							if (data.code === CONFIG.CODE_SUCCESS) {
								if(code ==1){
									obj.target.parentNode.setAttribute("class","bnt");
									obj.target.setAttribute("code",0);
									obj.target.innerHTML =LANG.PAGE.FOLLOW;
								}else if(code ==0){
									obj.target.parentNode.setAttribute("class","bnt active");
									obj.target.setAttribute("code",1);
									obj.target.innerHTML =LANG.BUTTON.FOLLOWING;
								}
							}
						});
				});
			}
			$scope.getFansFollows();
		});
	});
});
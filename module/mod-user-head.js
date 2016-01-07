;var modUser = angular.module('modUserHead', []);
modUser.directive('moduserhead', function () {
	return {
		restrict: 'EA',
		templateUrl: '/module/mod-user-head.html',
		link: function () {}
	}
}).controller('userInfoController', function ($http, $scope, $timeout) {
	ArtJS.load(['header'], function () {
		$timeout(function () {
			var  URI= {
				 url: '/memberSite/members/homeIndex?'
			}
			var status = true;

        	$scope.cooid =ArtJS.cookie.get("User_id");

        	$scope.id =request('uid');

        	if($scope.cooid !=$scope.id)$('.fileDemo').remove();

			$scope.DATA = {
				memberId: $scope.id
			};
			$scope.imgUrl    = ArtJS.server.image;
			$scope.qnIcon    = '?imageView2/1/format/jpg/w/60/h/60/q/90';
			$scope.usernav = [];
			$scope.userinfo = [];
			$scope.getUser = function (callback, error) {
				if (status) {
					status = false;
					$http.get(URI.url + ArtJS.json.toUrl($scope.DATA)).
					success(function (data) {
						if (data.code === CONFIG.CODE_SUCCESS) {
							var usernav = data.result;
							var userinfo = data.result.memberInfo;
							$scope.usernav = usernav;
							$scope.userinfo = userinfo;

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
			$scope.init =function(){
				var uMain ={
					navInit: function () {
				        var that = this;
				        that.$navList = $('.user-nav a');
				        //that.$schList = $('#search a');
				        that._uid =request("uid");

				        if (that._uid) {
				            that.navEach(that.$navList);
				            //that.navEach(that.$schList);
				        }
				    },
				    navEach: function (list) {
				        var that = this;
				        list.each(function (i, e) {
				            var href = $(e).attr('href');
				            var baseEst=request("uid");
				            if (request("uid")) {
				                href = href + '?uid=' + base64encode(baseEst.toString());
				                $(e).attr({href: href});
				            }
				        });
				    }
				}
				uMain.navInit();
			}
			$scope.getUser();
			$scope.init();
		});
	});
});
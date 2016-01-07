var sideList = angular.module('modSideList', []);
sideList.directive('moduserside', function () {
	return {
		restrict: 'EA',
		templateUrl: '/module/mod-user-side.html'
	}
}).controller('userSide', function ($scope, $http, $timeout) {
	ArtJS.load(['header'], function () {
		$timeout(function () {
			$scope.sideShow = function (state) {
				if (state) $scope.navState = ' show';
				else $scope.navState = '';
			}
		});
	});
});
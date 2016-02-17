var detail=angular.module("works",['modHeaderFull','ngRoute','shop-details','art-details']);
detail.controller('works-ctr', function ($scope, $http,$compile, $timeout) {
	ArtJS.load(['header'], function () {
		$timeout(function () {
			$scope.LANG = LANG;
			$scope.loading = 'loading';
		});
	});
});


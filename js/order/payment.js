/**
 *   下单支付相关处理
 *   modify  2016-01-12   author eric
**/

var payment=angular.module('payment', ['modHeaderFull']);
payment.controller('paymentCtr', function ($scope, $http, $timeout) {
	$scope.LANGUAGE_NOW = LANGUAGE_NOW;
	ArtJS.load(['header'], function () {
		$timeout(function () {
		});
	});
});
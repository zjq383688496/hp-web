	/**
 *   订单列表相关处理
 *   modify  2016-01-12   author eric
**/
var orderList=angular.module('orderList', ['modHeaderFull']);
orderList.controller('orderListCtr', function ($scope, $http, $timeout) {
	$scope.LANGUAGE_NOW = LANGUAGE_NOW;
	ArtJS.load(['header'], function () {
		$timeout(function () {
			//增加lang语言包加载之后示刷新数据的情况
   			var intervalId=setInterval(function(){
   				if(typeof LANG !=="undefined"){
   					$scope.$apply(function () {
   						$scope.LANG = LANG;					
					});
   					clearInterval(intervalId);
   				}
   			},500);
		});
	});
});
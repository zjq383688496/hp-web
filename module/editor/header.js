/***
*  小编头部处理  
**/
(function(){
	'use strict'; 
	var editorHeaderApp = angular.module('editorHeaderApp', []);
	editorHeaderApp.directive('editorHeader', function () {
		return {
			restrict: 'EA',
			templateUrl: '/module/editor/header.html',
			scope:{},
			link: function (scope, element) {
				
			}
		}
	}).controller('editorHeaderController', function ($scope, $http,$timeout) {
		$scope.userName =ArtJS.cookie.get("loginAccount");
		$scope.welcome="欢迎：";
	});
})();
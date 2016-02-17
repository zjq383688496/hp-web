/***
*  小编导航处理  
**/
(function(){
	'use strict'; 
	var editorNavApp = angular.module('editorNavApp', []);
	editorNavApp.directive('editorNav', function () {
		return {
			restrict: 'EA',
			templateUrl: '/module/editor/nav.html',
			// scope:{},
			link: function (scope, element) {
				//渲染完成后执行的操作
			}
		}
	});
})();
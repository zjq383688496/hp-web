/***
*  小编导航处理  
**/
(function(){
	'use strict'; 
	var editorSelectorApp = angular.module('editorSelectorApp', []);
	editorSelectorApp.directive('editorSelector', function () {
		return {
			restrict: 'EA',
			templateUrl: '/module/editor/selector.html',
			// scope:{},
			link: function (scope, element) {
				//渲染完成后执行的操作
			}
		}
	});
})();
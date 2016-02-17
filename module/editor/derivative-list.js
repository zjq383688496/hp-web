/***
*  小编商品列表处理
**/
(function(){
	'use strict';
	var editorDerivativeListApp = angular.module('editorDerivativeListApp', []);
	editorDerivativeListApp.directive('editorDerivativeList', function ($timeout) {
		return {
			restrict: 'EA',
			templateUrl: '/module/editor/derivative-list.html',
			// scope:{},
			link: function (scope, element) {
				//渲染完成后执行的操作
				// if (scope.$last === true) {
	     //            $timeout(function() {
	     //                ArtJS.load(['header'], function () {
						// 	ArtJS.page.ui.imageLoad.init(100);
						// });
	     //            });
	            // }
	            // if (scope.$last === true) {
	                // $timeout(function() {
	                //     // scope.$emit('ngRepeatFinished');
	                //     alert($(".item-list").eq(0).html());
	                // });
	            // }
			}
		}
	});

	var imgLoadStatus=false;//只加载一次
	editorDerivativeListApp.directive('directiveFinished', function ($timeout) {
		return {
			restrict: 'A',
			link: function(scope,element,attr){
           		// console.log(scope.$index)
				//渲染完成后执行的操作
	            if (scope.$last === true) {
	                $timeout(function() {
	                	if(imgLoadStatus){
	                		ArtJS.page.ui.imageLoad.init($(window).scrollTop());
	                		return;
	                	}
	                    ArtJS.load(['header'], function () {
							// ArtJS.page.ui.imageLoad.init(100);
							ArtJS.page.ui.imageLoad.init($(window).scrollTop());
							imgLoadStatus=true;
						});
	                });
	            }
			}
		}
	});
})();
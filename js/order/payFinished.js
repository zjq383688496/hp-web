/*
 *   支付结果相关处理
 *   modify  2016-01-12   author eric
**/
if (!ArtJS.login.checkUserStatus()) location.href = '/';
var payFinished=angular.module('payFinished', ['modHeaderFull']);
payFinished.controller('pay-finished-ctr', function ($scope, $http, $timeout) {
	$scope.LANGUAGE_NOW = LANGUAGE_NOW;
	ArtJS.load(['header'], function () {
		$timeout(function () {
			//增加lang语言包加载之后示刷新数据的情况
   			// var intervalId=setInterval(function(){
   				// if(typeof LANG !=="undefined"){
   					// $scope.$apply(function () {
   						$scope.LANG = LANG;					
					// });
   					// clearInterval(intervalId);
   				// }
   			// },500);
		});
	});
});

var PAYFINISH = {
		init: function () {
			var me = this;
			me.$success  = $('.pay-sus');
			me.$error    = $('.pay-err');
			me.$coundown = $('#coundown');
			me.$url = $('#orderDetailUrl');
			me._orderNo  = location.href.getQueryValue('orderNo');
			if (me._orderNo) {
				me.get();
			} else {
				me.error();
			}
		},
		// 数据请求处理
		ajaxFn: function (url, data, callback, error) {
			$.ajax({
				type: 'GET',
				url: url,
				data: data || {},
				timeout: 5000,
				success: function (rs) {
					if (rs.code && rs.code == 200) {
						if (typeof callback == 'function') callback(rs.result);
					} else {
						if (typeof error == 'function') error(rs);
					}
				},
				error: function (rs) {
					if (typeof error == 'function') error(rs);
				}
			});
		},
		/* 获取订单数据 */
		get: function () {
			var me = this;
			me.ajaxFn('/orderPaySite/order/getOrderDetail', {
				orderNo: me._orderNo
			}, function (data) {
				if (data) {
					me._status = data.status;
					if (me._status == 1) {
						me.success();
					} else {
						me.error();
					}
				} else {
					me.error();
				}
			}, function () {
				me.error();
			});
		},
		success: function () {
			var me = this;
			me.$url.attr({href: '/page/'+ArtJS.server.language+'/order/orderDetail.html?orderNo=' + me._orderNo});
			me.$success.show();
			me.coundown();
		},
		coundown: function () {
			var me = this;
			me._time = 5;
			me.$coundown.html(me._time);
			me.__set = setInterval(function () {
				me.$coundown.html(--me._time);
				if (me._time < 1) {
					clearInterval(me.__set);
					location.href = '/page/'+ArtJS.server.language+'/order/orderDetail.html?orderNo=' + me._orderNo;
				}
			}, 1000);
		},
		error: function () {
			var me = this;
			me.$error.show();
		}
	};
	PAYFINISH.init();

/*
	var ngApp = angular.module('ngApp', ['mod-header-full']).controller('pay-finished-ctr', ['$scope', function($scope){
		$scope.LANGUAGE_NOW=LANGUAGE_NOW;
	}]);
*/
;var modHeader = angular.module('modHeaderFull', []);
modHeader.directive('modheaderfull', function () {
	return {
		restrict: 'EA',
		templateUrl: '/module/mod-header-full.html',
		link: function () {
			var HEADER = {
				init: function () {
					var me = this;
					me.$header = $('.header-con, .user-info');
					me.bindEvent();
				},
				bindEvent: function () {
					var me = this;
					$(window).bind('scroll', function () {me.scroll();});
				},
				scroll: function () {
					var me = this;
					var st = $(window).scrollTop();
					if (st > 0) me.$header.addClass('fixed-top');
					else me.$header.removeClass('fixed-top');
				}
			};
			HEADER.init();
		}
	}
}).controller('headerController', function ($scope, $timeout) {
	ArtJS.load(['header'], function () {
		$timeout(function () {
			$scope.LANG = LANG;
			/* 初始化数据 */
			var href = location.href;
			var data = {
				$input: $('#searchContext'),
				$map: $('#keywordsMap'),
				$btn: $('#btnSearch'),
				_keyword: unescape(location.href.getQueryValue('searchContext')) || '',
				_keyLen: 0
			};
			if (!window.SEARCH_HANDLE) window.SEARCH_HANDLE = {};
			SEARCH_HANDLE = {
				submit: function () {
					var me = this;
					var key = data.$input.val().trim();
					if (!key) {
						ArtJS.page.alert('输入不能为空!', function () {
							data.$input.val('').focus();
						});
						return false;
					} else {
						var href = me.keyHandle(key);
					}
				},
				keyHandle: function (key) {
					var key = key.trimSpaceMany();
					var keyArr = key.split(' ').unique();
					this.jump(keyArr);
				},
				jump: function (keyArr) {
					var key = keyArr.join(' ');
					var url = [
						'/page/'+ CONFIG.LOCAL +'/search.html?searchType=02',
						'&Type=' + CONFIG.SEARCH.Type,
						'&sType=' + CONFIG.SEARCH.sType,
						'&searchContext=' + key
					].join('');
					location.href = url;
				},
				focus: function () {
					if (data._keyLen) {
						data.$input.removeClass('hide').addClass('show');
						data.$map.removeClass('show').addClass('hide');
					}
				},
				blur: function () {
					if (data._keyLen) {
						data.$input.removeClass('show').addClass('hide');
						data.$map.removeClass('hide').addClass('show');
					}
				},
				removeKeyword: function (obj) {
					var obj = $(obj);
					var key = obj.attr('data-key');
					data._keyArr.remove(key);
					if (data._keyArr.length) {
						this.jump(data._keyArr);
					} else {
						location.href = CONFIG.HOST_URL;
					}
				}
			}
			/*
			 * 初始化搜索信息
			 * 需要页面初始化定义相关数据
			 * 默认为 灯丝圈
			 */
			$scope.info = {
				placeholder: LANG.PLACEHOLDER.SEARCH,
				searchType: CONFIG.SEARCH.searchType,
				Type: CONFIG.SEARCH.Type,
				sType: CONFIG.SEARCH.sType
			}
			/* 提交表单 */
			$scope.searchSubmit = function () {
				SEARCH_HANDLE.submit();
			}
			/* enter提交表单 */
			data.$input.on('keydown', function (e) {
				if (e.keyCode == 13) SEARCH_HANDLE.submit();
			});
			$scope.keywordMap = [];
			/* 初始化处理搜索信息 */
			if (data._keyword) {
				var keyArr = data._keyArr = data._keyword.split(' ');
				var len = data._keyLen = keyArr.length;
				var keywordMap = []
				for (var i = 0; i < len; i++) {
					keywordMap.push({
						text: keyArr[i],
						color: ~~(Math.random()*360)
					});
				}
				$scope.keywordMap = keywordMap;
			} else {
				data._keyLen = 0;
				data.$input.removeClass('hide').addClass('show');
			}
		});
	});
}).controller('userSide', function ($scope, $timeout) {
	ArtJS.load(['header'], function () {
		$timeout(function () {
			$scope.sideShow = function (state) {
				if (state) $scope.navState = ' show';
				else $scope.navState = '';
			}
		});
	});
});
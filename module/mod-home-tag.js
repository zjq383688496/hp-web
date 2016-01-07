;var modHeader = angular.module('modHomeTag', []);
modHeader.directive('modhometag', function () {
	return {
		restrict: 'EA',
		templateUrl: '/module/mod-home-tag.html',
		transclude: true,
		link: function (scope, http, timeout) {
		}
	}
}).controller('modHomeTagController', function ($scope, $http, $timeout) {
	ArtJS.load(['header'], function () {
		$timeout(function () {
			var status = true;
			$scope.LANG = LANG;

			// 获取分类(全部)
			$scope.cls = {
				'208': 'art',        // 艺术新语
				'209': 'master',     // 大师作品
				'210': 'anime',      // 插画动漫
				'211': 'photo',      // 摄影摄像
				'212': 'design',     // 平面设计
				'213': 'handwork',   // 手工艺品
				'214': 'anime',      // 生活创意
				'215': 'quotations', // 文艺语录
				'216': 'movie',      // 影视音乐
				'217': 'game',       // 游戏人物
				'218': 'public',     // 爱心公益
				'345': 'activity',   // 艺术新语
				'395': 'comic',      // 动漫
				'397': 'charity'     // 古董收藏
			}
			$scope.getTypeBases = function () {
				var data = {
					abbr: LANG.NAME,
					indexTag: '2',
					page: 'index',
					source: 'web'
				};
				$http.get('/topicSocSite/topic/getTypeBasesByPage?' + ArtJS.json.toUrl(data)).
				success(function (data) {
					if (data.code == CONFIG.CODE_SUCCESS) {
						$('.mod-home-tag').show();
						var sort = data.result;
						var len  = sort.length;
						for (var i = 0; i < len; i++) {
							var item = sort[i];
							var id   = item.id;
							if (id === 4) $scope.sortProduct = item.children;
							if (id === 207) {
								var items = item.children;
								for (var p in items) {
									var id = items[p].id;
									items[p].className = $scope.cls[id];
								}
								$scope.sortInterest = item;
							}
						}
					}
				}).
				error(function (data) {
				});
			};

			// 获取分类(兴趣)
			$scope.getInterestType = function (typeIds) {
				var data = {
					abbr: LANG.NAME,
					typeIds: typeIds.join(',')
				};
				$http.get('/topicSocSite/topic/listInterestIdsByGoodsCount?' + ArtJS.json.toUrl(data)).
				success(function (data) {
					if (data.code == CONFIG.CODE_SUCCESS) {
						var items = data.result;
						var len  = items.length;
						for (var p in items) {
							var id = items[p].id;
							items[p].className = $scope.cls[id];
						}
						$scope.sortInterest.children = data.result;
					}
				}).
				error(function () {
				});
			};

			// 选择筛选分类
			//  1: 商品一级分类
			//  2: 商品二级分类
			//  3: 兴趣分类
			$scope.getIndexMarket = function (obj, type) {
				console.log(obj);
				if (status && $scope.nowTag != obj) {
					status = false;
					if (scopeArr && scopeArr['shop']) {
						var shopScope = scopeArr['shop'];
						var category;
						if (type < 3) {
							var typeIds = [];
							$('.sort-product .s-active').removeClass('s-active');
							if (type === 1) {
								delete(shopScope.DATA.productTypeId);
								category = obj.category;
								category.active = 's-active';
								var product = category.children;
								var len     = product.length;
								if (len) {
									for (var i = 0; i < len; i++) {
										typeIds.push(product[i].id);
									}
								}
							} else if (type === 2) {
								var product = obj.product;
								category    = obj.$parent.category;
								product.active = 's-active';
								shopScope.DATA.productTypeId = product.id;
								typeIds.push(product.id);
							}
							$scope.getInterestType(typeIds);
							console.log(shopScope.DATA+"aaaaa");
							shopScope.DATA.category = category.id;
						} else {
							var interest = obj.interest;
							shopScope.DATA.interestTypeId = interest? interest.id: '';
						}
						shopScope.getIndexMarket(function () {
							status = true;
						}, function () {
							status = true;
						});
						$scope.nowTag = obj;
					}
				}
			};

			$scope.getTypeBases();
			scopeArr['shop'] = $scope;
		});
	});
});
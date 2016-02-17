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
			var API = {
				typeBases:   '/topicSocSite/topic/getTypeBasesByPage?',				// 获取分类(全部)
				interestIds: '/topicSocSite/topic/listInterestIdsByGoodsCount?'		// 获取分类(兴趣)
			}
			var status = true;
			var intArr = [];
			$scope.LANG = LANG;
			// 获取分类(全部)
			$scope.getTypeBases = function (callback) {
				var data = {
					abbr: LANG.NAME,
					indexTag: '2',
					page: 'index',
					source: 'web'
				};
				$http.get(API.typeBases + ArtJS.json.toUrl(data)).
				success(function (data) {
					if (data.code == CONFIG.CODE_SUCCESS) {
						$('.mod-home-tag').show();
						var sort = data.result;
						var len  = sort.length;
						var shopScope = scopeArr['shop'];
						var newItem = [];
						for (var i = 0; i < len; i++) {
							var item = sort[i];
							var id   = item.id;
							if (id === 4) {
								$scope.sortProduct = item.children;
							} else if (id === 207) {
								var items = item.children;
								for (var j = 0, ilen = items.length; j < ilen; j++) {
									var node = items[j];
									var nid = node.id;
									if (nid != 218 && nid != 345) {
										newItem.push(node);
									}
								}
								item.children = newItem;
								item.typeName = LANG.TYPE.TYPE;
								$scope.sortInterest = shopScope.sortInterest = item;
							} else if (id === 2) {
								var items = item.children;
								for (var j = 0, ilen = items.length; j < ilen; j++) {
									var node = items[j];
									var nid = node.id;
									newItem.push(node);
								}
								item.typeName = LANG.TYPE.TYPE;
								$scope.sortInterest.children = shopScope.sortInterest.children = newItem;
							};
						}
						if (typeof(callback) === 'function') callback();
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
				$http.get(API.interestIds + ArtJS.json.toUrl(data)).
				success(function (data) {
					if (data.code == CONFIG.CODE_SUCCESS) {
						var shopScope = scopeArr['shop'];
						var items = data.result;
						var len  = items.length;
						$scope.sortInterest.children = data.result;
						shopScope.sortInterest.children = data.result;
					}
				}).
				error(function () {
				});
			};

			// 选择筛选分类
			//  1: 商品一级分类
			//  2: 商品二级分类
			//  3: 兴趣分类
			$scope.filter = function (dom, data) {
				var data = shopScope.DATA[data];
			}
			$scope.gim1 = function (obj, shopScope) {
				delete(shopScope.DATA.productCategoryId);
				var typeIds = [];
				var category = obj.category;
				var dom = $('#category_'+category.id);
				var product = category.children;
				var len     = product? product.length: 0;
				if (len) {
					for (var i = 0; i < len; i++) {
						typeIds.push(product[i].id);
					}
				}
				$scope.getInterestType(typeIds);
				shopScope.DATA.parentCategoryId = category.id;
				dom.addClass('s-active');
				$scope.gimFn(shopScope, function () {
					dom.addClass('s-active');
					$scope.nowTag = obj;
				}, function () {
					dom.removeClass('s-active');
				});
			}
			$scope.gim2 = function (obj, shopScope) {
				delete(shopScope.DATA.parentCategoryId);
				var typeIds = [];
				var product  = obj.product;
				var category = obj.$parent.category;
				shopScope.DATA.productCategoryId = product.id;
				typeIds.push(product.id);
				var dom  = $('#product_'+product.id);
				var pDom = $('#category_'+product.parentId);
				$scope.getInterestType(typeIds);
				shopScope.DATA.parentCategoryId = category.id;
				dom.addClass('s-active');
				pDom.addClass('s-active');
				$scope.gimFn(shopScope, function () {
					dom.addClass('s-active');
					pDom.addClass('s-active');
					$scope.nowTag = obj;
				}, function () {
					dom.removeClass('s-active');
				});
			}
			$scope.gim3 = function (obj, shopScope) {
				var cls = 's-active';
				var id;
				var par;
				if (obj.id) {
					id  = obj.id;
					par = $('#interest_'+obj.parentId);
				} else {
					id  = obj.interest.id;
				}
				var dom = $('#interest_'+id);
				$scope.filterInt(dom, par, id);
				if (intArr.length) {
					shopScope.DATA.interestCategoryId = intArr.join(',');
				} else {
					delete(shopScope.DATA.interestCategoryId);
				}
				$scope.gimFn(shopScope, function () {
					$scope.nowTag = obj;
				}, function () {
				});
			}
			$scope.filterInt = function (dom, par, id) {
				var cls = 's-active',
					cnew = 'new-active';//临时
				intArr = [];
				if (dom.hasClass(cls) || dom.hasClass(cnew)) {
					dom.removeClass(cls);
					dom.removeClass(cnew);//临时
					var parent = dom.parent();
					if (par) {
						var child2 = parent.find('a.' + cls);
						var child3 = parent.find('a.' + cnew);//临时
						var len2   = child2.length;
						if (len2 == 0) par.removeClass(cls);
						if (child3 == 0) par.removeClass(cnew);//临时
					} else {
						var next = parent.next('.sort-dd');
						if (next.length) next.find('a.' + cls).removeClass(cls);
						if (next.length) next.find('a.' + cls).removeClass(cnew);//临时
					}
				} else {
					dom.addClass(cls);
					//if (par) par.addClass(cls);

					// if (par) par.addClass('new-active');
					if (par){
						par.removeClass(cls);
					} 
				}
				var cd = $('#sortInterest a.' + cls);
				var le = cd.length;
				if (le) {
					for (var i = 0; i < le; i++) {
						var pid = cd.eq(i).attr('data-pid');
						intArr.push(pid);
					}
				}
			}
			$scope.gimFn = function (shopScope, callback, error) {
				shopScope.getIndexMarket(function () {
					if (typeof(callback) === 'function') callback();
					status = true;
				}, function () {
					if (typeof(error) === 'function') error();
					status = true;
				});
			}
			$scope.getIndexMarket = function (obj, type) {
				var bb = (type < 3 && $scope.nowTag != obj) || type === 3;
				if (status && bb) {
					status = false;
					if (scopeArr && scopeArr['shop']) {
						var shopScope = scopeArr['shop'];
						$('.sort-product').find('.s-active').removeClass('s-active');
						if (type < 3) {
							delete(shopScope.DATA.interestCategoryId);
							intArr = [];
							if (type === 1) {
								$scope.gim1(obj, shopScope);
							} else if (type === 2) {
								$scope.gim2(obj, shopScope);
							}
						} else {
							$scope.gim3(obj, shopScope);
						}
					} else {
						status = true;
					}
				}
			};
			// 发布作品
			$scope.publish = function () {
				ArtJS.login.pop(function (o) {
					location.href = '/page/'+LANG.NAME+'/user/gallery.html?uid='+CONFIG.USER.UESR_ID;
				});
			}

			// 滚动 bar 消失
			$scope.barScrollHide = function () {
				var bar = $('#modHomeTag');
				var h   = bar.height();
				var offsetTop=bar.offset().top;
				var oldScroll=0;//记录前一次的滚动值
				$(window).bind('scroll load', function () {
					var st = Math.round($(window).scrollTop());
					if((h+offsetTop)<st){
						if(oldScroll>st){
							bar.removeClass('s-hide');
						}else{
							bar.addClass('s-hide');
						}
					}
					oldScroll=st;
					// if (st > h) bar.addClass('s-hide')
					// else bar.removeClass('s-hide');
				});
			}

			$scope.getTypeBases(function () {
				$scope.barScrollHide();
			});

			scopeArr['tag'] = $scope;
		});
	});
});
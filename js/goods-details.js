var shopApp = angular.module('goodsDetails', []);
shopApp.controller('goodsDetailsCtr', function ($scope, $http, $timeout) {
	ArtJS.load(['header'], function () {
		$timeout(function () {
			var API = {
				detail:    '/goodsSite/goods/getGoodsDetail?',			// 获取商品
				category:  '/goodsSite/goods/getGoodsFourCategory?'		// 获取尺码
			}
			var getstatus = true;
			var scrollStatus = true;
			var imgL = '?imageView2/2/format/jpg/w/';
			$scope.goodsIds      = location.href.getQueryValue('goodsIds');
			$scope.imgUrl        = ArtJS.server.image;
			$scope.qn40          = imgL + '40/q/90';
			$scope.qn50          = imgL + '50/q/90';
			$scope.qn240         = imgL + '240/q/60';
			$scope.qn270         = imgL + '270/q/60';
			$scope.qn320         = imgL + '320/q/60';
			$scope.LANG          = LANG;

			$scope.dialogBuyStatus    = false;	// 判断购买模块展现
			$scope.dialogReportStatus = false;	// 判断举报模块展现
			$scope.dialogShareStatus  = false;	// 判断分享模块展现

			//
			$scope.detail     = {};		// 当前商品详情
			$scope.sizeDetail = {};		// 当前商品筛选尺码
			$scope.colorItem  = {};		// 当前选中的颜色
			$scope.typeItem   = {sellPrice: 0};		// 当前选中的类型
			$scope.sizeItem   = {sellPrice: 0};		// 当前选中的尺码
			$scope.goodsImg   = {};		// 当前商品正反面图 (正, 反, 当前选中面)

			$scope.goodsAmount  = 1;	// 数量

			//
			$scope.DATA = {
				goodsIds:   $scope.goodsIds,
				loadSource: 1,
				abbr:       LANG.NAME
			};
			$scope.sizeDATA = {
				abbr: LANG.NAME
			};
			// 初始化获取数据
			$scope.getGoodsDetail = function (callback) {
				$scope.getData(function () {
					// 一次性执行函数
					if (scrollStatus) {
						scrollStatus = false;
						$scope.goodsAmount = 1;
						ArtJS.page.ui.imageLoad.init(100);
					}
					$('html, body').animate({scrollTop: 0}, 200);
					GoodsDetail.isIframe();
					$scope.getCategory();
					//console.log($scope.detail.ifHasWidthHeight);
					if (typeof(callback) === 'function') callback();
				}, function () {
					//if (typeof(error) === 'function') error();
				});
			}
			// 获取详情数据
			$scope.getData = function (callback, error) {
				if (getstatus) {
					getstatus = false;
					$http.get(API.detail + ArtJS.json.toUrl($scope.DATA)).
					success(function (data) {
						if (data.code === CONFIG.CODE_SUCCESS) {
							var data          = data.result;
							var pageItems     = data.suggestGoods;
							var threeCategory = data.threeCategoryInfo;
							$scope.detail     = data;
							$scope.goodsImg   = {
								uri       : data.uri,
								backImguri: data.backImguri || ''
							}
							$scope.sizeDATA.artsId       = data.artsId;
							$scope.sizeDATA.categoryName = data.goodsName;
							if (threeCategory.length) {
								for (var i = 0; i < threeCategory.length; i++) {
									var category = threeCategory[i];
									if (category.id == data.id) {
										$scope.colorItem                  = category;
										$scope.sizeDATA.categoryId        = category.categoryId;
										$scope.sizeDATA.threeCategoryName = category.categoryName;
										//console.log(category);
										break;
									}
								}
							}
							if (pageItems.length) {
								$timeout(function () {
									if (typeof(callback) === 'function') callback();
								});
							} else if (typeof(error) === 'function') error();
						} else {
							if (typeof(error) === 'function') error();
						}
						getstatus = true;
					}).
					error(function (data) {
						getstatus = true;
						if (typeof(error) === 'function') error();
					});
				}
			}
			// 获取尺码
			var getCategoryStatus = true;
			$scope.getCategory = function () {
				if (getstatus) {
					$scope.typeItem   = {sellPrice: 0};
					$scope.sizeItem   = {sellPrice: 0};
					getCategoryStatus = false;
					$http.get(API.category + ArtJS.json.toUrl($scope.sizeDATA)).
					success(function (data) {
						if (data.code === CONFIG.CODE_SUCCESS) {
							var data         = $scope.sizeDetail = data.result;
							var property     = data.propertyInfos;		// 类型
							var fourCategory = data.fourCategoryInfo;	// 尺码
							//$scope.detail.ifHasWidthHeight = false;
							if (!$scope.detail.ifHasWidthHeight) {
								property     = fourCategory;
								fourCategory = [];
							}
							$scope.goodsAmount = 1;
							// 类型初始化
							if (property.length) {
								var hasTypeItem = false;
								for (var i = 0; i < property.length; i++) {
									var item = property[i];
									if ($scope.detail.ifHasWidthHeight? item.categoryId == $scope.colorItem.parentCategoryId: item.id == $scope.detail.id) {
										$scope.typeItem = item;
										hasTypeItem = true;
										break;
									}
								}
								if (!hasTypeItem) $scope.sizeItem = property[0];
							}
							// 类型初始化
							if (fourCategory.length) {
								var hasSizeItem = false;
								for (var i = 0; i < fourCategory.length; i++) {
									var item = fourCategory[i];
									if (item.id == $scope.detail.id) {
										$scope.sizeItem = item;
										hasSizeItem = true;
										break;
									}
								}
								if (!hasSizeItem) $scope.sizeItem = fourCategory[0];
							}
							$timeout(function () {
								ArtJS.page.ui.center('.dialog-buy');
							});
						} else {
							// error
						}
						getCategoryStatus = true;
					}).
					error(function (data) {
						getCategoryStatus = true;
						// error
					});
				}
			}
			// 选择颜色
			$scope.selectColor = function (item, goodsIds) {
				if (goodsIds != $scope.goodsIds) {
					$scope.goodsIds = goodsIds;
					$scope.goodsImg = {
						uri       : item.uri,
						backImguri: item.backImguri || ''
					}
					$scope.colorItem                  = item;
					$scope.sizeDATA.categoryId        = item.categoryId;
					$scope.sizeDATA.threeCategoryName = item.categoryName;
					//console.log(item);
					$scope.getCategory();
				}
			}
			// 选择类型
			$scope.selectType = function (item, categoryId) {
				if (categoryId != $scope.typeItem.categoryId) {
					$scope.typeItem = item;
					$scope.goodsAmount = 1;
				}
			}
			// 选择尺码
			$scope.selectSize = function (item, id) {
				if (id != $scope.sizeItem.id) {
					$scope.sizeItem = item;
					$scope.goodsAmount = 1;
				}
			}
			// 选择图片面
			$scope.selectPlant = function (img) {
				if (img != $scope.goodsImg.nowImguri) $scope.goodsImg.nowImguri = img;
			}
			// 选择相关商品
			$scope.selectGoods = function (id) {
				if ($scope.goodsIds != id) {
					$scope.goodsIds = $scope.DATA.goodsIds = id;
					history.replaceState(null, '商品详情', 'goods-details.html' + location.search.refQueryValue('goodsIds', id));
					$scope.getGoodsDetail();
				}
			}
			// 数量变化
			$scope.amountChange = function (num) {
				$scope.goodsAmount = ~~($scope.goodsAmount) + num;
				$scope.goodsAmount = $scope.goodsAmount < 1? 1: $scope.goodsAmount;
				$scope.goodsAmount = $scope.goodsAmount > 999? 999: $scope.goodsAmount;
			}
			// 添加购物车
			$scope.addCart = function (e) {
				var item = $scope.detail.ifHasWidthHeight? $scope.sizeItem: $scope.typeItem;
				// 参数说明
				// 1: event  2: 商品详情  3: 选中的尺码详情  4: 商品数量
				ArtJS.cart.add(e, $scope.detail, item, $scope.goodsAmount);
			}

			window.GoodsDetail = {
				init: function () {
					this._isIframe = location.href != parent.window.location.href;
					$scope.getGoodsDetail();
					$('.a-number').inputNumber();
					this.isIframe();
				},
				// 如果是iframe
				isIframe: function () {
					if (this._isIframe) {
						var href  = location.href;
						this._idP = href.getQueryValue('p');
						this._idF = href.getQueryValue('f');
						$('body').append('<div id="iframeGoodsDetailMask" class="iframe-goods-detail-mask" onclick="parent.ArtJS && parent.ArtJS.goods.close();"></div>');
						parent.scopeArr['goodsDetails'] = $scope;
						parent.scopeArr['goodsDetails'].window = window;
					}
				}
			}
			GoodsDetail.init();

			ArtJS.share.init({ parent: '.d-top' });

			scopeArr['goodsDetails'] = $scope;
		});
	});
});
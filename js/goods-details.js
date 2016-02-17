window.GoodsDetail = {
	init: function () {
		this._isIframe = location.href != parent.window.location.href;
		//$('.a-number').inputNumber();
		this.isIframeInit();
	},
	// 如果是iframe
	isIframeInit: function () {
		var href  = location.href;
		var body  = $('body');
		if (this._isIframe) {
			this._idP = href.getQueryValue('p');
			this._idF = href.getQueryValue('f');
			$('.iframe-goods-detail-mask').remove();
			body.append('<div id="iframeGoodsDetailMask" class="iframe-goods-detail-mask" onclick="parent.ArtJS && parent.ArtJS.goods.close();"></div>');
			body.addClass('isIframe');
		}
		body.show();
	}
}
GoodsDetail.init();

var goodsDetailsApp = GoodsDetail._isIframe? angular.module('goodsDetails', []): angular.module('goodsDetails', ['modHeaderFull']);
goodsDetailsApp.controller('goodsDetailsCtr', function ($scope, $http, $timeout) {
	ArtJS.load(['header'], function () {
		$timeout(function () {
			$scope.LANG = LANG;
			var API = {
				detail:  '/goodsSite/goodsDetails/info?',			// 获取商品
				like:    '/goodsSite/goods/like/{goodsId}/{type}',	// 喜欢
				related: '/goodsSite/goodsDetails/relatedGoods?'	// 获取相关衍生品
			}
			var getstatus    = true;
			var scrollStatus = true;
			var $customPanle=$(".custom-panle");

			$scope.goodsIds  = location.href.getQueryValue('goodsIds');
			$scope.oId       = location.href.getQueryValue('goodsIds');

			// 获取参数(商品||相关衍生品)
			$scope.DATA = {
				abbr: LANG.NAME
			};
			$scope.relatedDATA = {
				clientType: 'web',
				abbr: LANG.NAME
			};

			$scope.imgUrl = ArtJS.server.image;
			$scope.qn20   = '?imageView2/2/format/jpg/w/20/q/50';
			$scope.qn50   = '?imageView2/2/format/jpg/w/50/q/50';
			$scope.qn270  = '?imageView2/2/format/jpg/w/270/q/90';
			$scope.qn355  = '?imageView2/2/format/jpg/w/355/q/90';
			
			// 
			GoodsDetail.scopeShare = function () {
				// 如果是iframe
				if (this._isIframe) {
					parent.scopeArr['goodsDetails'] = $scope;
					parent.scopeArr['goodsDetails'].window = window;
				}
			}
			GoodsDetail.scopeShare();

			// 数据初始化
			$scope.dataInit = function () {
				// 颜色类型选其一
				$scope.colorItem    = [];	// 当前商品颜色
				$scope.typeItem     = [];	// 当前商品类型

				$scope.sizeItem     = [];	// 当前商品尺码
				$scope.previewItem  = [];	// 当前商品预览
				$scope.relatedGoods = [];	// 相关衍生品
				$scope.detail       = null;	// 商品详情
				$scope.nowInfo      = null;	// 当前商品详情
				$scope.imgs         = {};	// 当前商品图片
				$scope.amount       = 1;	// 商品数量

				$scope.customArr={          //自定义商品宽高数组
					width:0,
					height:0,
					sq:0,
					price:0
				}
			}

			// 初始化关闭
			$scope.getDetails = function () {
				getstatus = true;
				$scope.DATA.goodsId = $scope.goodsIds;
				$scope.dataInit();
				$scope.getData(function () {
					// 一次性执行函数
					if (scrollStatus) {
						scrollStatus = false;
						ArtJS.page.ui.imageLoad.init(100);
					}
					$scope.share();
					$('html, body').animate({scrollTop: 0}, 0);
					$scope.getRelatedGoods();
					//if (typeof(callback) === 'function') callback();
				}, function () {
					//if (typeof(error) === 'function') error();
				});
			}
			
			// 获取数据
			$scope.getData = function (callback, error) {
				if (getstatus) {
					getstatus = false;
					$http.get(API.detail + ArtJS.json.toUrl($scope.DATA)).
					success(function (data) {
						if (data.code === CONFIG.CODE_SUCCESS) {
							var detail = $scope.detail  = data.result;
							var def    = detail.defaultSkuInfo;
							var sku    = detail.goodsSkuInfos;
							$scope.oId = location.href.getQueryValue('goodsIds');
							$scope.relatedDATA.originalId = $scope.originalId = detail.originalId;
							$scope.nowSku(def);
							$scope.imgInit(def);
							$scope.colorOrTypeInit(sku);
							//console.log(detail);
							getstatus = true;
							if (typeof(callback) === 'function') callback();
						} else {
							if (typeof(error) === 'function') error();
						}
					}).
					error(function (data) {
						getstatus = true;
						if (typeof(error) === 'function') error();
					});
				}
			}

			// 获取相关衍生品
			$scope.getRelatedGoods = function (callback, error) {
				if (getstatus) {
					getstatus = false;
					$http.get(API.related + ArtJS.json.toUrl($scope.relatedDATA)).
					success(function (data) {
						if (data.code === CONFIG.CODE_SUCCESS) {
							$scope.relatedGoods = data.result;
							$timeout(function () {
								$(window).scroll();
							});
							console.log(data.result);
						} else {
							if (typeof(error) === 'function') error();
						}
					}).
					error(function (data) {
						getstatus = true;
						if (typeof(error) === 'function') error();
					});
				}
			}

			// 正反面图
			$scope.imgInit = function (item) {
				$scope.imgs.imagePath     = item.imagePath;
				$scope.imgs.backImagePath = item.backImagePath;
			}

			// 判断颜色/类型
			$scope.colorOrTypeInit = function (items) {
				var len = items.length;
				if (len) {
					var val = items[0].skuValue || items[0].skuName;
					if (val) {
						if (val.startWith('#')) {
							$scope.colorItem = items;
							$scope.filterColor(items);
						} else {
							$scope.typeItem = items;
							$scope.filterType(items);
						}
					} else {
						//$scope.imgs.imagePath = $scope.detail.originalPath;
						$scope.imgs.imagePath = $scope.nowInfo.imagePath;
						console.log($scope.imgs);
					}
				}
			}

			// 筛选颜色
			$scope.filterColor = function (items) {
				var len = items.length;
				for (var i = 0; i < len; i++) {
					var item = items[i];
					if (item.goodsId === $scope.goodsIds) {
						$scope.selectColor(item);
						break;
					}
				}
			}

			// 筛选尺码
			$scope.filterSize = function (items) {
				var len = items.length;
				if (len) {
					for (var i = 0; i < len; i++) {
						var item = items[i];
						if (item.goodsId === $scope.goodsIds) {
							$scope.selectSize(item);
							break;
						}
					}
				}
			}

			// 筛选类型
			$scope.filterType = function (items) {
				var len = items.length;
				for (var i = 0; i < len; i++) {
					var item = items[i];
					if (item.goodsId === $scope.goodsIds) {
						$scope.selectType(item);
						break;
					}
				}
			}

			// 筛选预览
			$scope.filterPreview = function (items) {
				var len = items.length;
				if (len) {
					for (var i = 0; i < len; i++) {
						var item = items[i];
						if (item.goodsId === $scope.goodsIds) {
							$scope.selectPreview(item);
							break;
						}
					}
				}
			}

			// 当前选择商品
			$scope.nowSku = function (item) {
				if (!$scope.nowInfo || item.goodsId != $scope.nowInfo.goodsId) {
					$scope.nowInfo  = item;
					$scope.goodsIds = item.goodsId;
					//$scope.urlChange(item.goodsId);
					console.log(item);
				}
			}

			// 选择颜色
			$scope.selectColor = function (item) {
				//if (!$scope.nowColor || item.goodsId != $scope.nowColor.goodsId) {
					$scope.amount   = 1;
					$scope.nowColor = item;
					$scope.imgInit(item);
					$scope.goodsIds = item.goodsId;
					$scope.sizeItem = item.childSkuInfoVos || [];
					if (!$scope.sizeItem.length) $scope.goodsIds = item.goodsId;
					$scope.filterSize($scope.sizeItem);
					//console.log(item);
				//}
			}

			// 选择尺码
			$scope.selectSize = function (item) {
				$scope.nowSku(item);
			}

			// 选择类型
			$scope.selectType = function (item) {
				//if (!$scope.nowType || item.goodsId != $scope.nowType.goodsId) {
					$scope.amount   = 1;
					$scope.nowType  = item;
					$scope.imgInit(item);
					$scope.goodsIds = item.goodsId;
					$scope.previewItem = item.childSkuInfoVos || [];
					if (!$scope.previewItem.length) $scope.goodsIds = item.goodsId;
					$scope.filterPreview($scope.previewItem);
					//console.log(item);
				//}
			}

			// 选择预览
			$scope.selectPreview = function (item) {
				$scope.nowSku(item);
			}

			// 数量变化
			$scope.amountChange = function (num) {
				$scope.amount = ~~($scope.amount) + num;
				$scope.amount = $scope.amount < 1? 1: $scope.amount;
				$scope.amount = $scope.amount > 999? 999: $scope.amount;
			}

			// 选择商品
			$scope.selectGoods = function (goodsId) {
				$scope.goodsIds = goodsId;
				$scope.urlChange(goodsId);
				$scope.getDetails();
			}

			// url变化
			$scope.urlChange = function (goodsId) {
				history.replaceState(null, '商品详情', 'goods-details.html' + location.search.refQueryValue('goodsIds', goodsId));
				//$scope.share(goodsId);
			}

			// 添加购物车
			$scope.addCart = function (e) {
				// 参数说明
				var color = $scope.nowColor? $scope.nowColor.skuValue: '#29a4e2';
				// 1: event  2: goodsType  3: 选中的尺码详情  4: 商品数量  5: 颜色  6: 商品ID
				ArtJS.cart.add(e, $scope.detail.goodsType, $scope.nowInfo, $scope.amount, color, $scope.oId);
			}

			// 喜欢
			var likestatus = true;
			$scope.artsLike = function (id, item) {
				ArtJS.login.pop(function (o) {
					likestatus = false;
					var data = {
						goodsId: id,
						type:    item.light? 2: 1
					}
					$http.get(API.like.substitute(data)).
					success(function (data) {
						if (data.code === CONFIG.CODE_SUCCESS) {
							item.lightTotal = data.result;
							item.light = item.light? false: true;
						}
						likestatus = true;
					}).
					error(function () {
						likestatus = true;
					});
				});
			}

			//点击编辑
			var artsdiyHref;
			$scope.edit = function(e){
				ArtJS.login.pop(function () {
					ArtJS.page.header.refreshUserInfo();
					$scope.artsdiyHref=artsdiyHref="/artsdiy/index.html?id="+$scope.nowInfo.goodsId;
					
					if($scope.nowInfo.customFlg==1){
					//自定义商品
						$scope.customArr.width=$scope.nowInfo.minPrintWidth;
						$scope.customArr.height=$scope.nowInfo.minPrintHeight;
						$scope.customReckon();

						$customPanle.fadeIn();
					}else{
					//非自定义商品
						window.open($scope.artsdiyHref);
					}
				});
			}

			// 宽高改变时计算
			var customTime;
			$scope.customReckon = function (type) {
				$timeout.cancel(customTime);
				customTime   = $timeout(function () {
					var w    = $scope.customArr.width;
					var h    = $scope.customArr.height;
					var iarr = angular.copy($scope.nowInfo);
					var bar  = iarr.maxPrintWidth/iarr.maxPrintHeight;
					if (w < iarr.minPrintWidth || isNaN(w)) {
						w = iarr.minPrintWidth;
					} else if (w > iarr.maxPrintWidth) {
						w = iarr.maxPrintWidth;
					}
					if (h < iarr.minPrintHeight || isNaN(h)) {
						h = iarr.minPrintHeight;
					} else if (h > iarr.maxPrintHeight) {
						h = iarr.maxPrintHeight;
					}
					$scope.customArr.width  = parseFloat(w);
					$scope.customArr.height = parseFloat(h);
					$scope.customArr.sq     = parseFloat((w*h)/10000).toFixed(4);
					$scope.customArr.price  = parseFloat($scope.customArr.sq*$scope.nowInfo.sellPrice).toFixed(2);
					$scope.artsdiyHref      = artsdiyHref + '&width=' + w + '&height=' + h;
				}, 700);
			}
			$scope.getDetails();

			$scope.share = function () {
				$('.d-top>.util-share').remove();
				var URL  = location.origin + location.pathname + '?' + 'goodsIds=' + $scope.oId;
				var MURL = URL.replace('/goods-details', '/details/goods-details').replace('www.', 'm.');
				ArtJS.share.init({
					parent: '.d-top',
					url:  URL,
					murl: MURL,
					text: $scope.detail.goodsName
				});
			}

			scopeArr['goodsDetails'] = $scope;
		});
	});
});
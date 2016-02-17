if (!ArtJS.login.checkUserStatus()) location.href = '/';
var ngApp = angular.module('ngApp', ['mod-header-full']);
$(function() {
	var HOST_URL = ArtJS.server.art;
	var API_URL = '/orderPaySite/';
	var HOST_JUMP = '/';
	var API = {
		GET: 'cart/cartList',			// 购物车列表(OK)
		CREATE: 'order/create',			// 订单新增
		UPT: 'order/uptPayment',		// 订单支付方式变更
		FARE: 'order/getExpressAmount',	// 订单运费查询
		PAYTYPE: 'pay/getPayTypes',		// 获取支付方式
		PAY: 'pay/payOrder'				// 支付
	};
	var model = {
		dom: [
		'<tr id="goods_{id}" data-id="{id}">',
			'<td align="center">',
				'<div class="imgdiv"><img src="{goodsImage}"/></div>',
			'</td>',
			'<td class="goodsTitle">{goodsName}</td>',
			'<td class="size_color">',
				'<p>{goodsSize}</p>',
				'<p>{goodsColor}</p>',
			'</td>',
			'<td align="center" class="goodsCount">{goodsCount}</td>',
			'<td align="center" class="goodsPrice">{goodsSympay}{goodsPrice}</td>',
			'<td align="center" class="goodsTotal">{goodsSympay}{goodsTotal}</td>',
		'</tr>'].join(''),
		pay: [
		'<li>',
			'<label class="type-{payName}">',
				'<input type="radio" data-id="{payId}" name="payType" onchange="ORDER.pay.active({payId});">',
			'</label>',
		'</li>'].join('')
	};
	if (!window.ORDER) window.ORDER = {};
	ORDER = {
		init: function () {
			var me = this;

			me._href = location.href;
			me._ids = me._href.getQueryValue('ids');
			if (me._ids) {
				me.$tbody = $('#order_tb');
				me.$totalCount = $('#totalCount');
				me.$totalGoods = $('#totalGoods');
				me.$totalShipment = $('#totalShipment');
				me.$totalPay = $('#totalPay');
				me.$payType = $('#payType');
				me._totalGoods = 0;
				me._totalCount = 0;
				me.get.init(function () {
					me._init();
				});
				me.pay.init();
			} else {
				ArtJS.page.alert('购物车内没有商品!', function () {
					location.href = HOST_JUMP;
				});
			}
		},
		login: function (callback) {
			if (ArtJS.login.checkUserStatus()) {
				if (typeof callback == 'function') callback();
			} else {
				location.href = HOST_JUMP;
			}
		},
		// 数据请求处理
		ajaxFn: function (url, data, callback, error) {
			$.ajax({
				type: 'POST',
				url: API_URL + url,
				data: data || {},
				//timeout: 20000,
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
		// 初始化执行
		_init: function () {
			var me = this;
			me.$currency = $('[name=goodsCurrency]');

			me.$currency.html(me._currency);
			me.$totalGoods.html(me._totalGoods);
			me.$totalCount.html(me._totalCount);
			me.price.shipment();
		},
		/* 获取购物车数据 */
		get: {
			// 初始化
			init: function (callback) {
				var _this = this;
				_this.getList(callback);
			},
			// 获取数据
			getList: function (callback) {
				var me = ORDER;
				var _this = this;
				me.ajaxFn(API.GET, {
					abbr: ArtJS.server.language,
					pageNo: 1,
					pageSize: 30,
					shoppingCartIds: me._ids
				}, function (data) {
					me.$tbody.html('');
					_this.write(data.pageItems);
					if (typeof callback == 'function') callback();
				}, function () {
					ArtJS.page.alert('购物车内没有商品!', function () {
						location.href = HOST_JUMP;
					});
				});
			},
			// 写入数据
			write: function (data) {
				var me = ORDER;
				if (data && data.length) {
					var _ids = [];
					var _price = [];
					var len = data.length;
					me._data = {};
					for (var i = 0; i < len; i++) {
						var node = data[i];
						if (node.status != 478) {
							_ids.push(node.id);
							_price.push(node.goodsPrice);
							me._currency = me._currency? me._currency: node.goodsSympay;
							node.goodsTotal = node.goodsPrice * node.goodsCount;
							node.goodsColor = node.goodsColor || '';
							node.goodsSize = node.goodsSize || '';

							if (node.goodsImage.startWith('http')) {
								node.goodsImage = node.goodsImage.split(',')[0] + '?imageView2/2/w/130/q/50">';
							} else {
								node.goodsImage = ArtJS.server.image + node.goodsImage + '?imageView2/2/w/130/q/50';
							}
							node.goodsColor = node.goodsColor == 'ep'? '': node.goodsColor;
							node.goodsSize = (node.goodsSize.startWith('自定义') || node.goodsSize.startWith('Custom'))? node.goodsSize.split('||')[1]+'cm': node.goodsSize.split('||')[0];
							var str = model.dom.substitute(node);
							me.$tbody.append(str);
							me._totalGoods += node.goodsTotal;
							me._totalCount += node.goodsCount;
							me._data[node.id] = node;
							if (node.goodsType == 42 && node.goodsImage.indexOf('.') < 0) {
								node.goodsImage = '<embed src="'+ArtJS.server.image + node.goodsImage+'" width="130" height="130" type="image/svg+xml" pluginspage="http://www.adobe.com/svg/viewer/install/">';
							} else {
								node.goodsImage = '<img src="'+ArtJS.server.image + node.goodsImage + '?imageView2/2/w/130/q/50">';
							}
						}
					}
					me._ids = _ids.join(',');
					me._price = _price.join(',');
					me._isTotalGood = true;
				} else {
					ArtJS.page.alert('购物车内没有商品!', function () {
						location.href = HOST_JUMP;
					});
				}
			}
		},
		/* 计算价格 */
		price: {
			shipment: function (callback) {
				var me = ORDER;
				var _this = this;
				var data = {
					shoppingCartIds: me._ids,
					addressId: ADDRESS.data.addressId
				}
				me.ajaxFn(API.FARE, data, function (data) {
					me._shipment = parseFloat(data.expressAmount);
					me.$totalShipment.html(me._shipment);
					me._isShipment = true;
					_this.all();
					if (typeof callback == 'function') callback(data.expressAmount);
				}, function (data) {
					if (data.code == '250015') {
						ArtJS.page.alert(data.message, function () {
							location.href = HOST_JUMP;
						});
					}
				});
			},
			// 总价
			all: function () {
				var me = ORDER;
				me._totalPay = me._totalGoods + me._shipment;
				me.$totalPay.html(me._totalPay);
			}
		},
		/* 获取支付方式 */
		pay: {
			// 初始化
			init: function () {
				var _this = this;
				_this.getList();
			},
			// 获取数据
			getList: function () {
				var me = ORDER;
				var _this = this;
				me.ajaxFn(API.PAYTYPE, {
					source: 'web'
				}, function (data) {
					me.$payType.html('');
					_this.write(data);
				}, function () {
					ArtJS.page.alert('没有可用的支付渠道!');
				});
			},
			// 写入数据
			write: function (data) {
				var me = ORDER;
				if (data && data.length) {
					var len = data.length;
					me._data = {};
					for (var i = 0; i < len; i++) {
						var node = data[i];
						var id = node.payId;
						if (id == '12150') node.payName = 'paypal'
						else if (id == '12134') node.payName = 'alipay'
						else if (id == '12167') node.payName = 'wechat'
						var str = model.pay.substitute(node);
						me.$payType.append(str);
					}
					me.$payList = me.$payType.find('label');
					me.$payList.eq(0).click();
				} else {
					ArtJS.page.alert('没有可用的支付渠道!');
				}
			},
			// 选中
			active: function (id) {
				var me = ORDER;
				me._payType = id;
				me._isPayType = true;
			},
			// 订单校验
			check: function () {
				var me = ORDER;
				var _this = this;
				var data = {};
				// 地址
				if (!(ADDRESS.data && ADDRESS.data.addressId)) {
					data.errorMsg = '请选择地址!';
					return data;
				} else if (ADDRESS.data.countryCode != ADDRESS._regional) {
					data.errorMsg = '您的收货地址与您的地区不符, 不能发货!<br>请选择与您所在地区相同的收货地址';
					return data;
				}
				// 商品价格
				if (!me._isTotalGood) {
					data.errorMsg = '商品信息错误!';
					return data;
				}
				// 运费
				if (!me._isShipment) {
					data.errorMsg = '运费获取失败!';
					return data;
				}
				// 支付方式
				if (!me._isPayType) {
					data.errorMsg = '未选择支付方式!';
					return data;
				}
				data.source = 1;
				data.shoppingCartIds    = me._ids;
				data.shoppingCartPrices = me._price;
				data.addressId = ADDRESS.data.addressId;
				data.payId = me._payType;
				return data;
			},
			// 提交订单
			submit: function (obj) {
				var me = ORDER;
				var _this = this;
				var obj = $(obj);
				me.login(function () {
					if (obj.data('state') == null || obj.data('state')) {
						obj.data('state', false);
						var data = _this.check();
						if (data.errorMsg) {
							ArtJS.page.alert({
								message: data.errorMsg,
								width: 400,
								callback: function () {
									obj.data('state', true);
								}
							});
						} else {
							ArtJS.page.showLoading();
							me.ajaxFn(API.CREATE, data, function (data) {
								//ArtJS.page.alert(LANGUAGE_NOW.alert.orderSus);
								//ArtJS.share.submit(function () {
									me.ajaxFn(API.PAY, {orderNo: data.orderNo}, function (o) {
										obj.data('state', true);
										ArtJS.page.hideLoading();
										if (me._payType == '12150') {
											location.href = o.url;
										} else if (me._payType == '12134') {
											$('body').append('<div style="display: none;">'+o.url+'</div>');
										}
									}, function () {
										obj.data('state', true);
										ArtJS.page.hideLoading();
										ArtJS.page.alert(LANGUAGE_NOW.alert.orderFai);
									});
								//});
							}, function (err) {
								console.log(err);
								obj.data('state', true);
								ArtJS.page.hideLoading();
								ArtJS.page.alert(LANGUAGE_NOW.alert.orderFai);
							});
						}
					};
				});
			}
		}
	};
	ArtJS.load(['address'], function () {
		ADDRESS.init({
			parent: $('#address_res'),
			activeFn: function (data) {
				ORDER.price.shipment();
			},
			loadFn: function () {
				ORDER.init();
				$('.container_cart').show();
			}
		});
	});
});
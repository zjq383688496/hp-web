//var ngApp = angular.module('ngApp', ["modHeaderFull"]);
if (!ArtJS.login.checkUserStatus()) location.href = '/';
$(function() {
	var HOST_URL = ArtJS.server.art;
	var API_URL = '/orderPaySite/order/';
	var HOST_JUMP = '/';
	var API = {
		GET: 'getOrderList'			// 订单列表
	};
	var model = {
		list: [
		'<dl>',
			'<dt>',
				'<span>{createDate}</span>',
				'<span>'+LANGUAGE_NOW.title.orderNo+'：{strOrderNo}</span>',
				'<a class="od-info" href="/page/'+ArtJS.server.language+'/order/orderDetail.html?orderNo={strOrderNo}" target="_blank">'+LANGUAGE_NOW.title.orderIn+'</a>',
			'</dt>',
			'<dd>',
				'<div class="info">{child}</div>',
				'<div class="total">',
					'<b>{sympay} {goodsAmount}</b>',
					'<em>{payMethod}</em>',
					'<p>'+LANGUAGE_NOW.title.total+': {sympay} {totalAmount}</p>',
				'</div>',
				'<div class="state">',
					'<div class="order-s order-s-{status}"></div>',
					'<div class="address">',
						LANGUAGE_NOW.nav.address+': <span class="blue">{fullAddress}</span>',
					'</div>',
				'</div>',
			'</dd>',
		'</dl>'].join(''),
		child: [
		'<div class="list">',
			'<div class="img"><img src="http://image.artbulb.com/imgsrv/{imagePath}?imageView2/2/w/100/q/50"></div>',
			'<div class="text">',
				'<p>{goodsName}</p><p>{color}</p><p>{size}</p>',
			'</div>',
			'<div class="price">{goodsSympay} {price}</div>',
			'<div class="count">{count}</div>',
		'</div>'].join('')
	};
	if (!window.ORDERLIST) window.ORDERLIST = {};
	ORDERLIST = {
		init: function () {
			var me = this;

			me.$main = $('#orderList');
			me.$tab = $('.tabmenu2 a');
			me.$orderConAll = $('#orderConAll');
			me.$orderCon1 = $('#orderCon1');
			me.$orderCon3 = $('#orderCon3');
			me.$orderCon8 = $('#orderCon8');
			me._orderConAll = 0;
			me._orderCon1 = 0;
			me._orderCon3 = 0;
			me._orderCon8 = 0;
			me.get.init();
		},
		// 数据请求处理
		ajaxFn: function (url, data, callback, error) {
			$.ajax({
				type: 'GET',
				url: API_URL + url,
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
		get: {
			// 初始化
			init: function (callback) {
				var _this = this;
				_this.getList(-1);
			},
			// 获取数据
				// state说明
				// -1: 全部
				// 1: 已付款
				// 3: 已发货
				// 8: 交易成功
			getList: function (state, obj) {
				var me = ORDERLIST;
				var _this = this;
				if (obj) {
					var obj = $(obj);
					if (!obj.hasClass('active')) {
						me.$tab.removeClass('active');
						obj.addClass('active');
					} else {
						return false;
					}
				}
				me.ajaxFn(API.GET, {
					status: state,
					currPage: 1,
					pageSize: 100
				}, function (data) {
					me.$main.html('');
					_this.write(data.pageItems, state);
					if (typeof callback == 'function') callback();
				});
			},
			// 写入数据
			write: function (data, state) {
				var me = ORDERLIST;
				var _this = this;
				if (data && data.length) {
					var len = data.length;
					me._orderConAll = 0;
					me._orderCon1 = 0;
					me._orderCon3 = 0;
					me._orderCon8 = 0;
					for (var i = 0; i < len; i++) {
						var node = data[i];
						var states = node.status;
						if (states == 1 || states == 3 || states == 8) {
							if (state == -1) {
								if (states == 1) ++me._orderCon1;
								if (states == 3) ++me._orderCon3;
								if (states == 8) ++me._orderCon8;
								++me._orderConAll;
							}
							node.child = _this.child(node.orderGoodsList);
							node.fullAddress = node.orderReceiver.fullAddress;
							var str = model.list.substitute(node);
							me.$main.append(str);
						}
					}
					if (state == -1) {
						me.$orderConAll.html(me._orderConAll);
						me.$orderCon1.html(me._orderCon1);
						me.$orderCon3.html(me._orderCon3);
						me.$orderCon8.html(me._orderCon8);
					}
				}
			},
			child: function (data) {
				if (data && data.length) {
					var str = [];
					var len = data.length;
					for (var i = 0; i < len; i++) {
						var node = data[i];
						node.color = node.color || '';
						node.size = node.size || '';
						node.color = node.color == 'ep'? '': node.color;
						node.size = (node.size.startWith('自定义') || node.size.startWith('Custom'))? node.size.split('||')[1]+'cm': node.size.split('||')[0];
						str.push(model.child.substitute(node));
					}
					str = str.join('');
					return str;
				} else {
					return '';
				}
			}
		},
		/* 计算价格 */
		price: {
			
		}
	};
	ORDERLIST.init();
});
// var ngApp = angular.module('ngApp', ['modHeaderFull']);
if (!ArtJS.login.checkUserStatus()) location.href = '/';
$(function() {
	var HOST_URL = ArtJS.server.art;
	var API_URL = '/orderPaySite/order/';
	var HOST_JUMP = '/';
	var API = {
		GET: 'getOrderDetail'	// 订单详情
	};
	var model = {
		status: [
		'<div class="order-status order-status-{status}">',
			'<div class="os-t">订单状态:</div><i></i>',
			'<div class="os-i">',
				'<p>正在生产 {createDate}</p>',
				'<p>正在配送</p>',
				'<p>订单完成</p>',
			'</div>',
		'</div>'].join(''),
		ship: [
		'<li class="os-info">',
			'<p>订单编号: {strOrderNo}</p>',
			'<p>订单时间: {createDate}</p>',
			'<p><i>订单金额: {sympay} {totalAmount} ( 包含: {sympay} {expressAmount} 运费 )</i></p>',
		'</li>',
		'<li class="os-ship">',
			'<p>',
				'收货人: <span>{receiverName}</span>',
				'<span class="spa-r">{mobile}</span>',
			'</p>',
			'<p>收货地址: <i>{fullAddress}</i></p>',
		'</li>'].join(''),
		child: [
		'<dd>',
			'<div class="img">',
				'<div class="goods-pic-small">',
					'<img src="http://image.artbulb.com/imgsrv/{imagePath}?imageView2/2/w/100/q/50">',
				'</div>',
			'</div>',
			'<div class="info">',
				'<p>{goodsName}</p>',
				'<p>{size}</p>',
				'<p>{color}</p>',
			'</div>',
			'<div class="price">{goodsSympay} {price}</div>',
			'<div class="count">{count}</div>',
			'<div class="total">{goodsSympay} {totalPrice}</div>',
		'</dd>'].join('')
	};
	if (!window.ORDERLIST) window.ORDERLIST = {};
	ORDERLIST = {
		init: function () {
			var me = this;

			me.$orderStatus = $('#orderStatus');
			me.$orderShip   = $('#orderShip');
			me.$goodsList   = $('#goodsList');
			me._orderNo = location.href.getQueryValue('orderNo');
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
				_this.get();
			},
			// 获取数据
			get: function () {
				var me = ORDERLIST;
				var _this = this;
				me.ajaxFn(API.GET, {
					orderNo: me._orderNo
				}, function (data) {
					_this.write(data);
				});
			},
			// 写入数据
			write: function (data) {
				var me = ORDERLIST;
				var _this = this;
				if (data) {
					//console.log(data);
					me._data = data;
					data.expressAmount = data.orderReceiver.expressAmount;
					data.receiverName = data.orderReceiver.receiverName;
					data.fullAddress = data.orderReceiver.fullAddress;
					data.mobile = data.orderReceiver.mobile;
					var status = model.status.substitute(data);
					var ship = model.ship.substitute(data);
					var child = _this.child(data.orderGoodsList);
					me.$orderStatus.html(status);
					me.$orderShip.html(ship);
					me.$goodsList.html(child);
				}
			},
			child: function (data) {
				if (data && data.length) {
					console.log(data);
					var str = [];
					var len = data.length;
					for (var i = 0; i < len; i++) {
						var node = data[i];
						node.totalPrice = node.price * node.count;
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
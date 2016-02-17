var ngApp = angular.module('ngApp', ['mod-header-full']);
if (!ArtJS.login.checkUserStatus()) location.href = '/';

$(function() {
	var HOST_URL = ArtJS.server.art;
	var API_URL = '/orderPaySite/cart/';
	var API = {
		GET: 'cartList',		// 购物车列表
		DEL: 'delCart',			// 删除商品
		EDIT: 'editCartCount'	// 编辑商品
	};
	var model = {
		dom: [
		'<tr id="goods_{id}" data-id="{id}">',
			'<td class="select">',
				'<label><input type="checkbox" id="check_{id}" data-id="{id}" name="goodsCheck" onchange="CART.select.single({id});"></label>',
			'</td>',
			'<td>',
				'<div class="imgdiv">{goodsImage}</div>',
			'</td>',
			'<td class="img">{goodsName}',
				'<span class="remove"><a onclick="CART.del.single(this, {id});">'+LANGUAGE_NOW.cart.del+'</a></span>',
			'</td>',
			'<td class="size_color">',
				'{detail}',
				//'<p data-size="{goodsSize}">{goodsSize}</p>',
				//'<p data-color="{goodsColor}">{goodsColor}</p>',
			'</td>',
			'<td>',
				'<div class="qty" data-id="{id}">',
					'<input type="text" value="{goodsCount}" class="numInput" onblur="CART.edit.input(this);" maxlength="3" input-number="true">',
					'<a class="add" onclick="CART.edit.add(this);"></a>',
					'<a class="subtract" onclick="CART.edit.sub(this);"></a>',
				'</div>',
			'</td>',
			'<td align="center" class="price">',
				'<span>{goodsSympay}{goodsPrice}</span>',
			'</td>',
			'<td align="center" class="total">',
				'<span>{goodsSympay}</span><span id="total_{id}">{goodsTotal}</span>',
			'</td>',
		'</tr>'].join(''),
		detail: '<p>{type_name} : {name}</p>'
	};
	if (!window.CART) window.CART = {};
	CART = {
		init: function () {
			var me = this;

			me.$tbody = $('#order_tb');
			me.$cartOn = $('.container_cart');
			me.$cartOff = $('.goods-contenter');
			me.get.init(function () {
				me._init();
			});
		},
		// 数据请求处理
		ajaxFn: function (url, data, callback, error) {
			$.ajax({
				type: 'GET',
				url: API_URL + url,
				data: data || {},
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
			me.$SelectAll = $('#SelectAll');
			me.$inputNumber = $('input[input-number=true]');
			me.$tr = $('#order_tb>tr');
			me.$check = $('input[name=goodsCheck]');
			me.$totalCount = $('#totalgoodsnum');
			me.$totalPrice = $('#totalmoney');
			me.$currency = $('[name=goodsCurrency]');
			me.$currency.html(me._currency);
			me._ids = '';

			me.$SelectAll.click();
			me.$inputNumber.inputNumber();
			me.price.all();
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
				var me = CART;
				var _this = this;
				me.ajaxFn(API.GET, {
					abbr: ArtJS.server.language,
					pageNo: 1,
					pageSize: 30
				}, function (data) {
					me.$tbody.html('');
					_this.write(data.pageItems);
					if (typeof callback == 'function') callback();
				}, function () {
					me.$cartOff.show();
					$('.go_shopping mcm').css({visibility: 'hidden'});
				});
			},
			// 写入数据
			write: function (data) {
				var me = CART;
				var _this = this;
				if (data && data.length) {
					var len = data.length;
					for (var i = 0; i < len; i++) {
						var node = data[i];
						node.detail = _this.writeDetail(node.goodsSkuJson);
						me._currency = me._currency? me._currency: node.goodsSympay;
						if (node.goodsSellStatus == 4004 || node.goodsSellStatus == 4005) {
							var sName = node.goodsSellStatus == 4004? '下架': '售罄';
							node.goodsName = '抱歉 , 该商品已'+sName+'!';
							node.goodsImage = '<img src="'+ArtJS.server.image + node.goodsImage + '?imageView2/2/w/130/q/50">';
						} else {
							node.goodsImage = node.goodsImage || '';
							if (node.status == 478) {
								var json = ArtJS.json.parse(node.goodsJson);
								node.goodsTotal = node.goodsPrice = json.sellPrice;
								node.goodsImage = '<img src="'+ArtJS.server.image + (json.uri || '') + '">';
								node.goodsName = '抱歉 , 该商品已下架!';
							} else {
								node.goodsTotal = node.goodsPrice * node.goodsCount;
								if (node.goodsImage.startWith('http')) {
									node.goodsImage = '<img src="'+ node.goodsImage.split(',')[0] + '?imageView2/2/w/130/q/50">';
								} else {
									node.goodsImage = '<img src="'+ArtJS.server.image + node.goodsImage + '?imageView2/2/w/130/q/50">';
								}
							}
						}
						node.goodsColor = node.goodsColor || '';
						node.goodsColor = node.goodsColor == 'ep'? '': node.goodsColor;
						node.goodsSize = node.goodsSize || '';
						node.goodsSize = (node.goodsSize.startWith('自定义') || node.goodsSize.startWith('Custom'))? node.goodsSize.split('||')[1]+'cm': node.goodsSize.split('||')[0];
						var str = model.dom.substitute(node);
						me.$tbody.append(str);
						var nowGoods = me.$tbody.children('tr:last-child');
						if (node.status == 478 || node.goodsSellStatus == 4004 || node.goodsSellStatus == 4005) {
							nowGoods.find('.select').html('');
							nowGoods.find('.qty').parent().html('');
							nowGoods.find('.price, .total').text('-');
						}
						nowGoods.data({
							price: node.goodsPrice,
							count: node.goodsCount,
							countPay: node.goodsCount,
							total: node.goodsTotal,
							totalPay: node.goodsTotal,
							id: node.id,
							goodsSellStatus:node.goodsSellStatus,
							status: node.status
						});
					}
					me.$cartOn.show();
				} else {
					me.$cartOff.show();
					$('.go_shopping mcm').css({visibility: 'hidden'});
				}
			},
			writeDetail: function (str) {
				if (str) {
					var json = ArtJS.json.parse(str);
					var len  = json.length;
					var arr  = [];
					for (var i = 0; i < len; i++) {
						arr.push(model.detail.substitute(json[i]));
					}
					return arr.join('');
				} else {
					return '';
				}
			}
		},
		/* 删除选中商品 */ 
		del: {
			// 单选
			single: function (obj, id) {
				this.del(obj, String(id));
			},
			// 全选
			all: function (obj) {
				var me = CART;
				this.del(obj, me._ids);
			},
			// 删除
			del: function (obj, ids) {
				var me = CART;
				var obj = $(obj);
				if (obj.data('state') == null || obj.data('state')) {
					obj.data('state', false);
					me.ajaxFn(API.DEL, {ids: ids}, function (data) {
						var arr = ids.split(',');
						var len = arr.length;
						var dom = len > 1? me.$checked.parent().parent().parent(): $('#goods_'+ids);
						dom.addClass('fade-out');
						setTimeout(function () {
							var dom = len > 1? me.$checked.parent().parent().parent(): $('#goods_'+ids);
							dom.remove();
							me.$tr = $('#order_tb>tr');
							me.price.all();
							if (!me.$tr.length) location.reload();
						}, 200);
						obj.data('state', true);
					}, function () {
						obj.data('state', true);
					});
				}
			}
		},
		/* 修改数量 */
		edit: {
			// 修改数量
			change: function (obj, num) {
				var obj = $(obj);
				var parent = obj.parent();
				var id = parent.attr('data-id');
				var dom = $('#goods_'+id);
				var nowNum = dom.data('count');
				var newNum = nowNum + num;
				return newNum;
			},
			// 加
			add: function (obj) {
				var num = this.change(obj, 1);
				this.edit(obj, num, num-1);
			},
			// 减
			sub: function (obj) {
				var num = this.change(obj, -1);
				this.edit(obj, num, num+1);
			},
			// 输入
			input: function (obj) {
				var ipt = $(obj);
				var parent = ipt.parent();
				var id = parent.attr('data-id');
				var dom = $('#goods_'+id);
				var nowNum = dom.data('count');
				var newNum = ~~(ipt.val());
				this.edit(obj, newNum, nowNum);
			},
			// 修改数据(API)
			edit: function (obj, newNum, nowNum) {
				var me = CART;
				var obj = $(obj);
				var parent = obj.parent();
				var ipt = parent.find('.numInput');
				var id = parent.attr('data-id');
				var dom = $('#goods_'+id);
				newNum = (newNum < 1 || newNum > 999)? nowNum: newNum;
				if (parent.data('state') == null || parent.data('state')) {
					parent.data('state', false);
					me.ajaxFn(API.EDIT, {
						id: id,
						goodsCount: newNum
					}, function (data) {
						dom.data('count', newNum);
						ipt.val(newNum);
						me.price.single(id);
						parent.data('state', true);
					}, function (data) {
						if (data && data.message && nowNum) {
							ipt.val(nowNum);
							ArtJS.page.alert(data.message);
						}
						parent.data('state', true);
					});
				}
			}
		},
		/* 计算价格 */
		price: {
			// 单品
			single: function (id) {
				var dom = $('#goods_'+id);
				var check = $('#check_'+id);
				var total = $('#total_'+id);
				var isChecked = check.prop('checked');
				var price = dom.data('price');
				var count = dom.data('count');
				var totalPrice = price * count;
				var totalPay = isChecked? totalPrice: 0;
				var countPay = isChecked? count: 0;
				total.html(totalPrice);
				dom.data('total', totalPrice);
				dom.data('totalPay', totalPay);
				dom.data('countPay', countPay);
				this.all();
			},
			// 全部
			all: function () {
				var me = CART;
				var tr = me.$tr;
				var len = tr.length;
				var count = 0;
				var total = 0;
				tr.each(function (i, e) {
					var obj = $(e);
					if (obj.data('status') != 478 && obj.data('status') != 479 && obj.data('goodsSellStatus')!=4004 && obj.data('goodsSellStatus')!=4005) {
						count += obj.data('countPay');
						if(obj.data('totalPay')!=undefined){
							total += obj.data('totalPay');
						}
					}
				});
				me.$totalCount.html(count);
				me.$totalPrice.html(total);
				me._totalCount = count;
				me._totalPrice = total;
			}
		},
		/* 选择器 */
		select: {
			// 单选
			single: function (id) {
				var me = CART;
				me.$checked = $('input[name=goodsCheck]:checked');
				var checkLen = me.$check.length;
				var checkedLen = me.$checked.length;
				if (checkLen == checkedLen) {
					me.$SelectAll.prop('checked', true);
				} else {
					me.$SelectAll.prop('checked', false);
				}
				me.price.single(id);
				if (checkedLen) {
					var ids = [];
					me.$checked.each(function (i, e) {
						var id = $(e).attr('data-id');
						ids.push(id);
					});
					me._ids = ids.join(',');
				} else {
					me._ids = '';
				}
			},
			// 全选
			all: function (obj) {
				var me = CART;
				var obj = $(obj);
				var child = me.$check;
				var isChecked = obj.prop('checked');
				if (isChecked) {
					$('input[name=goodsCheck]:not(:checked)').click();
				} else {
					$('input[name=goodsCheck]:checked').click();
				}
			}
		},
		/* 结算 */
		submit: function (obj) {
			var me = this;
			var obj = $(obj);
			var href = obj.attr('data-href');
			if (me._ids) {
				obj.attr({href: href + '?ids=' + me._ids});
			} else {
				obj.removeAttr('href');
				ArtJS.page.alert('请选择需要购买的商品!');
				return false;
			}
		}
	}
	CART.init();
});
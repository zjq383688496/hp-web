var HOST_URL = 'http://www.artbulb.com/';
if (!ArtJS.login.checkUserStatus()) location.href = '/';
var API_URL = HOST_URL + 'memberSite/';
var API = {
	USER: 'members/getMember',		// 用户信息
	GET: 'memberAddress/list',		// 获取
	EDIT: 'memberAddress/addOrUp',	// 新增||编辑
	DEL: 'memberAddress/del'		// 删除
};
var model = {
	add: [
	'<li class="la_add">',
        '<a onclick="ADDRESS.edit.add();"><i>+</i>添加一个新的收货地址</a>',
    '</li>'].join(''),
	li: [
	'<li id="address_{addressId}" class="{actClass}" data-id="{addressId}">',
        '<div class="set-default">',
            '<a onclick="ADDRESS.edit.def(this, {addressId});" class="{defClass}" data-id="{addressId}">{defText}</a>',
        '</div>',
		'<a class="address-act" onclick="ADDRESS.edit.active({addressId});">',
            '<p class="name" id="address_input4">',
                '{shipperName} {mobile}',
            '</p>',
            '<p class="address" id="address4">',
                '{address} {zip}',
            '</p>',
		'</a>',
        '<div class="edit">',
            '<a onclick="ADDRESS.edit.edit({addressId});">编辑</a>',
            '<a onclick="ADDRESS.edit.del({addressId});">删除</a>',
        '</div>',
    '</li>'].join(''),
    address: [
    '<div class="newAddressBox">',
		'<div id="new_useradr">',
			'<div class="colse_out">',
				'<font>添加地址</font><a class="colse fx_bg" onclick="ADDRESS.info.close();"></a>',
			'</div>',
			'<ul id="maodi" class="items">',
				'<li>',
					'<label for="strName">真实姓名:<i>*</i></label>',
					'<p>',
						'<input type="text" class="input" id="strName" placeholder="2-30个字符">',
						'<span class="error"></span>',
					'</p>',
				'</li>',
				'<li>',
					'<label>地区:<i>*</i></label>',
					'<p><span id="regional" class="regional">{regional}</span></p>',
				'</li>',
				'<li>',
					'<label for="strAddress">街道名称:<i>*</i></label>',
					'<p>',
						'<textarea id="strAddress" class="w300"></textarea>',
						'<span class="f_gray">请填写省（州）/城市/地区/街道地址</span>',
						'<span class="error"></span>',
					'</p>',
				'</li>',
				'<li>',
					'<label for="strTelephone">联系电话:<i>*</i></label>',
					'<p>',
						'<input type="text" class="input" id="strTelephone">',
						'<span class="error"></span>',
					'</p>',
				'</li>',
				'<li>',
					'<label for="strPostal">邮编:</label>',
					'<p>',
						'<input type="text" class="input" id="strPostal">',
						'<span class="error"></span>',
					'</p>',
				'</li>',
				'<li class="set-default">',
					'<label><input type="checkbox" id="strDefault">设为默认</label>',
				'</li>',
				'<li>',
					'<a id="btnAddressSubmit" class="btn_addr" onclick="ADDRESS.submit.submit(this);">保存</a>',
				'</li>',
			'</ul>',
		'</div>',
		'<div class="address-mask" onclick="ADDRESS.info.close();"></div>',
	'</div>'].join('')
};
if (!window.ADDRESS) window.ADDRESS = {};
ADDRESS = {
	init: function (o) {
		var me = this;
		me.$parent = o.parent instanceof jQuery? o.parent: $(o.parent);
		if (typeof o.activeFn == 'function') me.activeFn = o.activeFn;
		if (typeof o.loadFn == 'function') me.loadFn = o.loadFn;
		me.$parent.html('');
		me._addressId = 0;
		me.user(function (regional) {
			me._regional = regional;
			me.get.init(function () {
				me._init();
			});
			me.$body = $('body');
			me.info.init();
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
		if (typeof me.loadFn == 'function') me.loadFn();
	},
	// 获取用户信息
	user: function (callback) {
		var me = this;
		me.ajaxFn(API.USER, {}, function (data) {
			me._userinfo = data;
			var regional = data.registerRegional? data.registerRegional.toUpperCase(): 'CN';
			if (typeof callback == 'function') callback(regional);
		}, function (data) {
			console.log(data);
		});
	},
	/* 获取地址 */
	get: {
		// 初始化
		init: function (callback) {
			var _this = this;
			_this.getList(callback);
		},
		// 获取数据
		getList: function (callback) {
			var me = ADDRESS;
			var _this = this;
			me.$parent.html('<div class="address-warp"><ul id="addressUl"></ul></div>');
			me.$ul = $('#addressUl');
			me.$list = $('.address-warp');
			me.$ul.append(model.add);
			me.ajaxFn(API.GET, {}, function (data) {
				var str = _this.write(data.pageItems);
				if (typeof callback == 'function') callback();
			});
			me.$list.show();
		},
		// 写入数据
		write: function (data) {
			var me = ADDRESS;
			if (data && data.length) {
				me._data = {};
				var len = data.length;
				for (var i = 0; i < len; i++) {
					var node = data[i];
					node.defClass = node.isDefault? 'def': '';
					node.defText  = node.isDefault? '默认地址': '设为默认地址';
					node.actClass = node.isDefault? 'ui-active': '';
					if (node.isDefault) me.data = node;
					node.mobile = node.mobile || node.phone;
					var str = model.li.substitute(node);
					me.$ul.append(str);
					var nowAddress = me.$ul.children('li:last-child');
					me._data[node.addressId] = node;
				}
			}
		}
	},
	/* 编辑地址 */
	edit: {
		// 激活
		active: function (id) {
			var me = ADDRESS;
			var li = $('#address_'+id);
			$('.ui-active').removeClass('ui-active');
			li.addClass('ui-active');
			me.data = me._data[id];
			if (typeof me.activeFn == 'function') me.activeFn(me._data[id]);
		},
		// 新增
		add: function () {
			var me = ADDRESS;
			me.info.show();
		},
		// 删除
		del: function (id) {
			var me = ADDRESS;
			var li = $('#address_'+id);
			var cf = confirm('确定要删除吗?');
			if (cf) {
				me.ajaxFn(API.DEL, {addressId: id}, function (data) {
					li.remove();
					delete me._data[id];
				}, function (data) {
					alert(data.message);
				});
			}
		},
		// 修改
		edit: function (id) {
			var me = ADDRESS;
			var _data = me._data[id];
			me.addressSubmit.attr('data-id', id);
			me.$strName.val(_data.shipperName);
			me.$regional.html(_data.countryCode);
			me.$strAddress.val(_data.address);
			me.$strTelephone.val(_data.mobile);
			me.$strPostal.val(_data.zip);
			me.$strDefault.attr({checked: _data.isDefault==1});
			me.info.show();
		},
		// 设置默认
		def: function (obj, id) {
			var me = ADDRESS;
			var _this = this;
			var obj = $(obj);
			var _data = me._data[id];
			var isDef = _data.isDefault;
			isDef = isDef? 0: 1;
			//if (isDef) {
				var data = {
					addressId: id,
					isDefault: isDef
				}
				console.log(isDef, id);
				me.ajaxFn(API.EDIT, data, function (data) {
					if (isDef) {
						me.$def = $('.set-default .def');
						if (me.$def.length) {
							var oldId = me.$def.attr('data-id');
							me.$def.removeClass('def').html('设置为默认地址');
							me._data[oldId].isDefault = 0;
						}
						obj.addClass('def').html('默认地址');
					} else {
						obj.removeClass('def').html('设置为默认地址');
					}
					_data.isDefault = isDef;
				});
			//}
		}
	},
	/* 地址详情 */
	info: {
		init: function () {
			var me = ADDRESS;
			var _this = this;

			_this.write();
			me.$addressInfo  = $('.newAddressBox');
			me.$strName      = $('#strName');
			me.$regional     = $('#regional');
			me.$strAddress   = $('#strAddress');
			me.$strTelephone = $('#strTelephone');
			me.$strPostal    = $('#strPostal');
			me.$strDefault   = $('#strDefault');
			me.addressSubmit = $('#btnAddressSubmit');
			me.$strError = $('#maodi .error');
		},
		// 写入国家信息
		write: function () {
			var me = ADDRESS;
			if ($('.newAddressBox').length) $('.newAddressBox').remove();
			me.$body.append(model.address.substitute({regional: me._regional}));
		},
		// 显示弹框
		show: function () {
			var me = ADDRESS;
			me.$addressInfo.show();
		},
		// 关闭弹框
		close: function () {
			var me = ADDRESS;
			me.$addressInfo.hide();
			me.$strName.val('');
			me.$regional.html(me._regional);
			me.$strAddress.val('');
			me.$strTelephone.val('');
			me.$strPostal.val('');
			me.$strDefault.attr({checked: true});
			me.addressSubmit.removeAttr('data-id');
			me.$strError.html('');
		}
	},
	/* 提交 */
	submit: {
		// 校验
		check: function () {
			var me = ADDRESS;
			var _this = this;
			var name    = me.$strName.val().trim();
			var address = me.$strAddress.val().trim();
			var mobile  = me.$strTelephone.val().trim();
			var postal  = me.$strPostal.val().trim();
			var data = {};
			// 姓名
			if (name == '') {
				_this.error(me.$strName, '姓名不能为空!');
				++_this._error;
			} else if (name.length<2 || name.length>30) {
				_this.error(me.$strName, '请填写正确的姓名!');
				++_this._error;
			} else data.shipperName = name;
			// 地址
			if (address == '') {
				_this.error(me.$strAddress, '地址不能为空!');
				++_this._error;
			} else if (address.length<5 || address.length>100) {
				_this.error(me.$strAddress, '请填写正确的地址!');
				++_this._error;
			} else data.address = address;
			// 手机
			if (mobile == '') {
				_this.error(me.$strTelephone, '手机不能为空!');
				++_this._error;
			} else if (mobile.length<10 || mobile.length>100) {
				_this.error(me.$strTelephone, '请填写正确的手机号!');
				++_this._error;
			} else data.mobile = mobile;
			// 邮编
			if (postal == '') {
				me.$strAddress.val('');
			}
			data.zip = postal;
			data.isDefault = me.$strDefault.attr('checked')? 1: 0;
			return data;
		},
		// 错误信息
		error: function (obj, message) {
			obj.val('');
			var error = obj.parent().find('.error');
			error.html(message);
		},
		// 提交
		submit: function (obj) {
			var me = ADDRESS;
			var _this = this;
			var obj = $(obj);
			var id = obj.attr('data-id') || '';
			_this._error = 0;
			me.$strError.html('');
			var data = _this.check(data);
			if (_this._error == 0) {
				data.countryCode = me.$regional.html();
				if (id) data.addressId = id;
				if (obj.data('state') == null || obj.data('state')) {
					obj.data('state', false);
					me.ajaxFn(API.EDIT, data, function (data) {
						me.init({
							parent: me.$parent,
							activeFn: me.activeFn
						});
						obj.data('state', true);
					}, function (rs) {
						ArtJS.page.alert(rs.message);
						obj.data('state', true);
					});
				}
			}
		}
	}
}
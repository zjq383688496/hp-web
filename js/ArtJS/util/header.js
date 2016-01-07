/* ArtJS.page.header */
(function($) {
	if (!$ || !window.ArtJS) return;
	ArtJS.page.setDomain();
	// ----------------------------
	ArtJS.define('ArtJS.page.header', {
		// refreshUserInfo在ArtJS.login.js中用到，用于登录后刷新内容
		refreshUserInfo: function(userData) {
			if (userData) {
				this.user.initUserInfo(userData);
			} else {
				this.user.init();
			}
		},
		user: {
			tmpl: {
				logout: [
					'<a href="javascript:ArtJS.login.pop();"><span>登录</span></a>',
					'<a href="javascript:ArtJS.login.pop({register: true});"><span>注册</span></a>'
				].join(''),
				login: [
					'<a class="user-url" href="/page/'+LANG.NAME+'/user/user-gallery.html?proprietorId={memberId}">',
						'<b class="user-icon" style="background-image:url({userImage})"></b>',
						'{nikeName}',
					'</a>',
					'<a href="/page/'+LANG.NAME+'/order/shoppingCart.html" id="my-buy" class="iconfont icon-cart"></a>'
				].join(''),
				navLogout: [
					'<li><a href="/page/'+LANG.NAME+'/"><b class="iconfont icon-home"></b>'+LANG.NAV.HOME+'</a></li>',
					'<li><a href="/page/'+LANG.NAME+'/about.html"><b class="iconfont icon-bulb"></b>'+LANG.NAV.ABOUT+'</a></li>',
					'<li><a href="/page/'+LANG.NAME+'/contact.html"><b class="iconfont icon-bulb"></b>'+LANG.NAV.CONTACT+'</a></li>',
					'<li><a href="/page/'+LANG.NAME+'/provision.html"><b class="iconfont icon-book"></b>'+LANG.NAV.PROTOCOL+'</a></li>'
				].join(''),
				navLogin: [
					'<li><a href="/page/'+LANG.NAME+'/"><b class="iconfont icon-home"></b>'+LANG.NAV.HOME+'</a></li>',
					'<li><a href="/page/'+LANG.NAME+'/order/orderList.html"><b class="iconfont icon-file"></b>'+LANG.NAV.ORDER+'</a></li>',
					'<li><a href="/page/'+LANG.NAME+'/user/userAddress.html"><b class="iconfont icon-pos"></b>'+LANG.NAV.ADDRESS+'</a></li>',
					'<li><a href="/page/'+LANG.NAME+'/subject-editor.html" class="subject"><b class="iconfont icon-home"></b>'+LANG.NAV.BLOG+'</a></li>',
					'<li><a href="/page/'+LANG.NAME+'/withdraw.html"><b class="iconfont icon-file"></b>'+LANG.NAV.WITHDRAW+'</a></li>',
					'<li><a href="/page/'+LANG.NAME+'/about.html"><b class="iconfont icon-bulb"></b>'+LANG.NAV.ABOUT+'</a></li>',
					'<li><a href="/page/'+LANG.NAME+'/contact.html"><b class="iconfont icon-bulb"></b>'+LANG.NAV.CONTACT+'</a></li>',
					'<li><a href="/page/'+LANG.NAME+'/provision.html"><b class="iconfont icon-book"></b>'+LANG.NAV.PROTOCOL+'</a></li>',
					'{edit}',
					'<li><a href="/memberSite/sso/logOut"><b class="iconfont icon-out"></b>'+LANG.NAV.LOGOUT+'</a></li>'
				].join(''),
				edit: '<li><a href="/editor/new-up.html"><b class="iconfont icon-home"></b>'+LANG.NAV.EDITOR+'</a></li>'
			},
			init: function() {
				if (ArtJS.login.checkUserStatus()) {
					this.loadUserData();
				} else {
					this.initUserInfo();
				}
			},
			loadUserData: function() {
				var that = this;
				ArtJS.login.getUser(function(data) {
					if (data) {
						that.initUserInfo(data);
					} else {
						that.initUserInfo();
					}
				});
			},
			initUserInfo: function(data) {
				this.container = $('#userLogin');
				this.navContainer = $('#navList');
				/* update #user html */
				if (data && typeof(data) == 'object') {
					var userEdit = '';
					if (data.roleId == 3 || data.roleId == 4) {	// 小编|主编
						userEdit = this.tmpl.edit;
					}
					this.container.html(this.tmpl.login.substitute(data));
					this.navContainer.html(this.tmpl.navLogin.substitute({edit: userEdit}));
				} else {
					this.container.html(this.tmpl.logout);
					this.navContainer.html(this.tmpl.navLogout);
				}
			}
		}
	}, function() {
		ArtJS.page.header.user.init();
	});
	// ----------------------------
	ArtJS.define('ArtJS.page.ui', {
		scroll: function (params) {
			$(window).bind('scroll', function () {
				var st = Math.round($(window).scrollTop());
				var ch = $(window).height();
				var bh = $(document.body).outerHeight(true);
				var offsetTop = params? params.offsetTop || 100: 100;
				if ((bh-st-ch) < offsetTop) {
					if (typeof(params.callback) === 'function') params.callback(st, ch, bh);
				}
			});
		},
		imageLoad: {
			init: function (offsetTop) {
				if (offsetTop) this.offsetTop = offsetTop;
				this.bindEvent();
			},
			bindEvent: function () {
				var that = this;

				that.scrollFn();
				$(window).scroll('scroll', function () {
					that.scrollFn();
				});
			},
			scrollFn: function () {
				var img       = $('.a-imageload img').not('.a-imageshow');
				var st        = Math.round($(window).scrollTop());
				var ch        = $(window).height();
				var offsetTop =  !isNaN(this.offsetTop)? this.offsetTop: 100;
				if (img.length) {
					img.each(function (i, e) {
						var item  = $(e);
						var imgFT = $(e).offset().top;
						if ((imgFT-st-ch) < offsetTop) {
							item.attr({
								src: item.attr('data-src')
							});
							item.removeAttr('data-src');
							item.bind('load', function () {
								item.addClass('a-imageshow');
							});
						}
					});
				}
			}
		},
		center: function (dom) {
			var dom   = $(dom);
			var width = dom.width() / 2;
			var hight = dom.height() / 2;
			dom.css({
				'margin-left': -width,
				'margin-top':  -hight
			});
		}
	});
	// ----------------------------
	ArtJS.define('ArtJS.page.ripple', {
		init: function () {
			this.bindEvent();
		},
		bindEvent: function () {
			var that = this;
			$('body').delegate('.e-ripple', 'mousedown', function (e) {
				that.mousedown($(this), e);
			});
		},
		mousedown: function (obj, e) {
			var id = 'rippleWave_' + new Date().getTime();
			obj.append('<s id="'+id+'"></s>');
			var ripple = $('#' + id);
			ripple.css({
				left: e.clientX - obj.offset().left,
				top:  e.clientY - obj.offset().top + $(window).scrollTop()
			});
			setTimeout(function () {ripple.remove();}, 600);
		}
	});
	ArtJS.page.ripple.init();
	// ----------------------------
	ArtJS.define('ArtJS.cart', {
		tmpl: {
			dom: [
			'<div id="{id}" class="a-shopping">',
				'<div><i style="background-image: url({img});"></i></div>',
				'<b style="color: hsl({h}, 100%, 60%);">+{amount}</b>',
			'</div>'].join('')
		},
		init: function () {
			this._API = '/orderPaySite/cart/addCart';
			this._STATUS = true;
		},
		// 参数说明
		// 1: event  2: 商品详情  3: 选中的尺码详情  4: 商品数量
		add: function (e, detail, item, amount) {
			var that = this;
			ArtJS.login.pop(function () {
				parent.ArtJS.page.header.refreshUserInfo();
				if (that._STATUS == null || that._STATUS) {
					that._STATUS = false;
					var data = {
						goodsId: item.id,
						goodsCount: amount,
						goodsType: detail.goodsType,
						goodsPrice: item.sellPrice,
						goodsJson: ArtJS.json.stringify(item),
						abbr: ArtJS.server.language
					}
					$.ajax({
						type: 'POST',
						url: that._API,
						data: data,
						success: function (rs) {
							if (rs.code && rs.code == 200) {
								that.anime(e.clientX, e.clientY, amount, item.uri);
								if (typeof callback == 'function') callback(rs.result);
							} else {
								if (typeof error == 'function') error(rs);
							}
							that._STATUS = true;
						},
						error: function (rs) {
							if (typeof error == 'function') error(rs);
							that._STATUS = true;
						}
					});
				}
			});
		},
		anime: function (x, y, amount, img) {
			if (scopeArr['goodsDetails']) {
				var img = ArtJS.server.image + img + '?imageView2/2/format/jpg/w/320/q/60'
				var id  = 'iconShopping_' + new Date().getTime();
				parent.$('.iframe-goods-detail').append(this.tmpl.dom.substitute({
					id: id,
					amount: amount,
					img: img,
					h: Math.floor(Math.random()*360)
				}));
				var dw  = parent.document.body.scrollWidth;
				var sp  = parent.$('#' + id);
				var spw = dw - x - sp.width()/2;
				var sph = y - sp.height()/2;
				sp.css({
					top:   sph,
					right: spw
				});
				setTimeout(function () {
					sp.addClass('fly-to-shopping-cart');
				}, 1000);
				setTimeout(function () {
					sp.remove();
				}, 4300);
			}
		}
	});
	ArtJS.cart.init();
	// ----------------------------
	ArtJS.define('ArtJS.goods', {
		tmpl: {
			url:    '/page/{lang}/goods-details.html?goodsIds={id}&p={p}&f={f}',
			iframe: '<div id="{p}" class="iframe-goods-detail"><iframe id="{f}" width="100%" height="100%" src="{url}" scrolling="yes" border="0" frameborder="0"></iframe></div>'
		},
		detail: function (id) {
			var that    = this;
			var random  = new Date().getTime();
			that.idP    = that.idP? that.idP: 'iframeGoodsDetailP_' + random;
			that.idF    = that.idF? that.idF: 'iframeGoodsDetailF_' + random;
			var pageUrl = that.tmpl.url.substitute({
				lang: ArtJS.server.language,
				id:   id,
				p:    that.idP,
				f:    that.idF
			});
			if ($('.iframe-goods-detail').length) {
				that.$domP = $('#' + that.idP);
				that.$domF = $('#' + that.idF);
				if (scopeArr['goodsDetails']) {
					$(scopeArr['goodsDetails'].window).scrollTop(0);
					scopeArr['goodsDetails'].dialogBuyStatus = false;
					scopeArr['goodsDetails'].selectGoods(id);
				} else {
					that.$domF.attr({src: pageUrl});
				}
				that.$domP.removeClass('hide').addClass('show');
			} else {
				$('body').append(that.tmpl.iframe.substitute({
					p:  that.idP,
					f:  that.idF,
					url: pageUrl
				}));
				that.$domP = $('#' + that.idP);
				that.$domF = $('#' + that.idF);
				that.$domP.addClass('show');
			}
			$('html').css({ overflow: 'hidden' });
		},
		close: function () {
			this.$domP.removeClass('show').addClass('hide');
			setTimeout(function () {
				$('html').removeAttr('style');
			}, 200);
		}
	});
	ArtJS.cart.init();
	ArtJS.debug('header.js', '初始化成功');
})(jQuery);
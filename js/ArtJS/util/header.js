// 统一修改title
document.title = LANG.LOGO;

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
				if (CONFIG && CONFIG.USER) {
					CONFIG.USER.ACCOUNT   = userData.accountName;
					CONFIG.USER.ICON_URL  = userData.imageUrl;
					CONFIG.USER.NAME      = userData.nikeName;
					CONFIG.USER.REGIONAL  = userData.registerRegional;
					CONFIG.USER.TOKEN     = ArtJS.cookie.get('toKen') || '';
					CONFIG.USER.UESR_CODE = ArtJS.cookie.get('User_code') || '';
					CONFIG.USER.UESR_ID   = userData.memberId;
				}
			} else {
				this.user.init();
			}
		},
		user: {
			tmpl: {
				logout: [
					'<a href="javascript:ArtJS.login.pop();"><span>'+LANG.GLOBAL.LOGIN+'</span></a>',
					'<a href="javascript:ArtJS.login.pop({register: true});"><span>'+LANG.GLOBAL.REG+'</span></a>'
				].join(''),
				login: [
					'<a class="user-url" href="/page/'+LANG.NAME+'/user/gallery.html?uid={memberId}">',
						'<b class="user-icon" style="background-image:url({userImage})"></b>',
						'{nikeName}',
					'</a>',
					'<a href="/page/'+LANG.NAME+'/order/shoppingCart.html" id="my-buy" class="iconfont icon-cart"></a>'
				].join(''),
				navLogout: [
					'<a href="/"><span>'+LANG.NAV.HOME+'</span></a>',
					'<a href="/page/'+LANG.NAME+'/about.html"><span>'+LANG.NAV.ABOUT+'</span></a>',
					'<a href="/page/'+LANG.NAME+'/contact.html"><span>'+LANG.NAV.CONTACT+'</span></a>',
					'<a href="/page/'+LANG.NAME+'/provision.html"><span>'+LANG.NAV.PROTOCOL+'</span></a>'
				].join(''),
				navLogin: [
					'<a href="/"><span>'+LANG.NAV.HOME+'</span></a>',
					'<a href="/page/'+LANG.NAME+'/order/orderList.html"><span>'+LANG.NAV.ORDER+'</span></a>',
					'<a href="/page/'+LANG.NAME+'/user/userAddress.html"><span>'+LANG.NAV.ADDRESS+'</span></a>',
					//'<a href="/page/'+LANG.NAME+'/subject-editor.html"><span>'+LANG.NAV.BLOG+'</span></a>',
					//'<a href="/page/'+LANG.NAME+'/withdraw.html"><span>'+LANG.NAV.WITHDRAW+'</span></a>',
					'<a href="/page/'+LANG.NAME+'/about.html"><span>'+LANG.NAV.ABOUT+'</span></a>',
					'<a href="/page/'+LANG.NAME+'/contact.html"><span>'+LANG.NAV.CONTACT+'</span></a>',
					'<a href="/page/'+LANG.NAME+'/provision.html"><span>'+LANG.NAV.PROTOCOL+'</span></a>',
					'{edit}',
					'<a href="/memberSite/sso/logOut"><span>'+LANG.NAV.LOGOUT+'</span></a>'
				].join(''),
				normalEdit: '<a href="/page/'+LANG.NAME+'/edit/normal/picture.html" target="_blank"><span>'+LANG.NAV.EDITOR+'</span></a>',
				subEdit: '<a href="/page/'+LANG.NAME+'/edit/sub/picture.html" target="_blank"><span>'+LANG.NAV.EDITOR+'</span></a>',
				chiefEdit: '<a href="/page/'+LANG.NAME+'/edit/chief/picture.html" target="_blank"><span>'+LANG.NAV.EDITOR+'</span></a>'
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
					if (data.roleId == 3 ){//小编  
						userEdit=this.tmpl.normalEdit;
					}else if(data.roleId == 4) {	// 小编|主编
						userEdit = this.tmpl.chiefEdit;
					}else if(data.roleId==8){//副主编  8
						userEdit = this.tmpl.subEdit;
					}
					this.container.html(this.tmpl.login.substitute(data));
					this.navContainer.html(this.tmpl.navLogin.substitute({edit: userEdit}));
				} else {
					this.container.html(this.tmpl.logout);
					this.navContainer.html(this.tmpl.navLogout);
				}
			}
		},
		setCookie: function() {
            var href = location.href;
            var shareUserId = href.getQueryValue("shareUserId");
            var shareSourceId = href.getQueryValue("shareSourceId");
            var shareType = href.getQueryValue("shareType");
            if (shareUserId && shareSourceId && shareType) {
                var data = {
                    shareUserId: shareUserId,
                    shareSourceId: shareSourceId,
                    shareType: shareType
                };
                localStorage.setItem("artbulb_share", ArtJS.json.stringify(data))
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
				$(window).bind('resize scroll', function () {
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
								var parent = item.parent();
								if (parent.hasClass('img-loading')) parent.removeClass('img-loading');
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
		},
		autoPlayer: {
			init: function (params) {
				this.$parent = $(params.parent);	// 父容器
				this.$img    = $(params.img);		// 图片
				this._length = this.$img.length;	// 图片数量
				this._now    = 0;					// 初始序号
				this._status = true;
				this.interval = null;
				if (this._length) {
					this.dot();
					this.bindEvent();
					this.auto();
					this.$img.eq(0).addClass('i-show');
					this.$dot.eq(0).addClass('s-active');
				} else {
					this.$parent.hide();
				}
			},
			bindEvent: function () {
				var that = this;
				that.$parent.bind('mouseover', function () {
					clearInterval(that.interval);
				});
				that.$parent.bind('mouseout', function () {
					that.auto();
				});
				if (that.$dot) {
					that.$dot.bind('click', function () {
						that.play($(this).attr('data-idx'));
					});
				}
			},
			// 生成索引
			dot: function () {
				var that = this;
				if (that._length > 1) {
					var dot = [];
					for (var i = 0; i < that._length; i++) {
						dot.push('<a data-idx="'+i+'" class="i-dot"><s></s></a>');
					}
					that.$parent.append('<div class="i-dotUl">' + dot.join('') + '</div>');
					that.$dot = that.$parent.find('.i-dot');
				}
			},
			// 播放
			play: function (num) {
				var that = this;
				if (num !== this._now && this._status) {
					this._status = false;
					this.$img.eq(this._now).removeClass('i-show');
					this.$img.eq(num).addClass('i-show');
					if (this.$dot) {
						this.$dot.eq(this._now).removeClass('s-active');
						this.$dot.eq(num).addClass('s-active');
					}
					this._now = num;
					setTimeout(function () {
						that._status = true;
					}, 1000);
				}
			},
			// 自动播放
			auto: function () {
				var that = this;
				that.interval = setInterval(function () {
					var num = that._now + 1;
					num = num >= that._length? 0: num;
					that.play(num);
				}, 3000);
			}
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
				'<b style="color: {h};">+{amount}</b>',
			'</div>'].join('')
		},
		init: function () {
			this._API = '/orderPaySite/cart/addCart';
			this._STATUS = true;
		},
		// 参数说明
		// 1: event  2: 商品详情  3: 选中的尺码详情  4: 商品数量  5: 颜色  6: 商品ID
		add: function (e, goodsType, item, amount, color, ID) {
			var that = this;
			ArtJS.login.pop(function () {
				parent.ArtJS.page.header.refreshUserInfo();
				if (that._STATUS == null || that._STATUS) {
					that._STATUS = false;
					var data = {
						goodsId: item.goodsId,
						goodsCount: amount,
						goodsType: goodsType,
						goodsPrice: item.sellPrice,
						goodsJson: ArtJS.json.stringify(item),
						abbr: ArtJS.server.language,
						showGoodsId: ID
					}
					$.ajax({
						type: 'POST',
						url: that._API,
						data: data,
						success: function (rs) {
							if (rs.code && rs.code == 200) {
								that.anime(e.clientX, e.clientY, amount, item.imagePath, color);
								if (typeof callback == 'function') callback(rs.result);
							} else {
								ArtJS.page.alert(rs.message);
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
		anime: function (x, y, amount, img, color) {
			if (scopeArr['goodsDetails']) {
				var img  = ArtJS.server.image + img + '?imageView2/2/format/jpg/w/320/q/60'
				var id   = 'iconShopping_' + new Date().getTime();
				var pDOM = parent.$('.iframe-goods-detail').length? parent.$('.iframe-goods-detail'): $('body');
				pDOM.append(this.tmpl.dom.substitute({
					id: id,
					amount: amount,
					img: img,
					h: color
				}));
				var dw  = parent.document.body.scrollWidth;
				var sp  = parent.$('#' + id);
				var spw = x - sp.width()/2;
				var sph = y - sp.height()/2;
				var l   = parent.$('#my-buy').offset().left - 10;
				//console.log(spw);
				sp.css({
					top:   sph,
					left:  spw
				});

				setTimeout(function () {
					sp.addClass('fly-to-shopping-cart');
					setTimeout(function () {
						sp.css({ left: l });
					}, 10);
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
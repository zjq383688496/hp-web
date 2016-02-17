var HOST_URL = ArtJS.server.art;
var API_URL = '/memberSite/';
var API = {
		loginThird:  'sso/thirdLoginJson',
		loginWechat: 'sso/weixinLoginJson',
		login:       'sso/loginJson',
		register:    'members/register'
	};
ArtJS.load.add('sinajs', {   js: 'http://tjs.sjs.sinajs.cn/open/api/js/wb.js?appkey=451710904' });
ArtJS.load.add('plusone', {  js: 'http://apis.google.com/js/client:plusone.js' });
ArtJS.load.add('facebook', { js: 'js/facebook.js' });

var LOGIN = {
	init: function () {
		if (ArtJS.login.checkUserStatus()) {
			if (parent.window.location.href == location.href) {
				location.href = HOST_URL;
			} else {
				parent.ArtJS.util.dialog.close();
			}
		}
		var me = this;
		var IS_REGISTER = location.href.getQueryValue('register');

		me.$main = $('.quick-login-box');
		me.$btn = $('#prev, #next');
		me.$slides = $('#slidesBox');
		me.$dialogOpen = $('.dialog-open');
		me.$dialogClose = $('.dialog-close');
		me.$dialogMask = $('.dialog-mask');
		me.$dialog = $('#localLogin,#localRegister');
		me.$dgLogin = $('#localLogin');
		me.$btnSign = $('#btnSign');

		me.slides.init();
		me.submit.init();
		me.bindEvent();
		if (IS_REGISTER) {
			me.$btnSign.click();
		} else {me.$slides.removeClass('hide');}

		me.wechat.init();
		me.QQ.init();
	},
	/* 事件绑定 */
	bindEvent: function () {
		var me = this;

		// 左右切换箭头
		me.$btn.bind('click', function () {
			var idx = ~~($(this).attr('data-index'));
			var dir = ~~($(this).attr('data-dir'));
			me.slides.change(idx, dir);
		});
		// 打开关闭dialog
		me.$dialogOpen.bind('click', function () {
			var dialogDom = $($(this).attr('data-dialog'));
			me.dialog.show(dialogDom);
		});
		me.$dialogClose.bind('click', function () {
			me.dialog.close();
		});
		// 注册登录键盘事件
		me.$inputLogin.bind('keyup', function (e) {
			var e = e || window.event;
			var c = e.keyCode || e.which;
			if (c === 13) LOGIN.submit.login();
		});
		me.$inputReg.bind('keyup', function (e) {
			var e = e || window.event;
			var c = e.keyCode || e.which;
			if (c === 13) LOGIN.submit.register();
		});
	},
	/* 根据cookie判断执行用户登录操作 */
	success: function () {
		if (ArtJS.login.checkUserStatus()) {
			if (parent.window.location.href == location.href) {
				location.href = HOST_URL;
			} else {
				parent.ArtJS.login.success();
			}
		}
	},
	/* 登录|注册|找回密码 弹层 */
	dialog: {
		show: function (obj) {
			var me = LOGIN;
			me.$dialogMask.addClass('show');
			me.$slides.addClass('hide');
			me.$dialog.removeClass('show');
			obj.addClass('show');
		},
		close: function () {
			var me = LOGIN;
			me.$inputLogin.removeClass('err').val('');
			me.$inputReg.removeClass('err').val('');
			me.$dialog.removeClass('show');
			me.$slides.removeClass('hide');
			me.$dialogMask.removeClass('show');
		}
	},
	/* 第三方登录滚动 */
	slides: {
		init: function () {
			var _this = this;

			_this.$ul = $('.slides_container');
			_this.$li = $('.slides_container>li');
			_this.$dot = $('.slides_dot');
			_this.$prev = $('#prev');
			_this.$next = $('#next');
			_this.$div = $('.slides_container div');
			_this.len = _this.$div.length;
			_this.now = 0;
			_this._state = true;

			_this.next();
			_this.initData();
		},
		// 箭头btn index生成
		next: function () {
			var _this = this;
			var now = _this.now;
			var len = _this.len;

			_this._next = now+1 == _this.len? 0: now+1;
			_this._prev = now-1 < 0? _this.len-1: now-1;
			_this.$prev.attr({'data-index': _this._prev});
			_this.$next.attr({'data-index': _this._next});
		},
		// 初始化dom
		initData: function () {
			var _this = this;

			var arr = [];
			_this.$div.each(function (i, e) {
				$(e).attr({'data-index': i});
				if (i == 0) arr.push('<a class="current"><i>'+i+'</i></a>')
				else arr.push('<a><i>'+i+'</i></a>');
			});
			_this.$dot.html(arr.join(''));
			_this.$div.eq(_this.now).addClass('current');
			_this.$dotA = _this.$dot.find('a');
			_this.$dotA.bind('click', function () {
				var idx = ~~($(this).text());
				_this.change(idx);
			})
		},
		// 主要交互
		change: function (num, direction) {
			var _this = this;
			var dir = 1;
			if (!_this._state) return false;
			_this._state = false;
			if (num == _this.now) {
				_this._state = true;
				return false;
			} else if (num < _this.now) {
				dir = -1;
			}
			if (direction) dir = direction;
			var now = _this.$div.eq(_this.now);
			var next = _this.$div.eq(num);
			_this.$dotA.eq(_this.now).removeClass('current');
			_this.$dotA.eq(num).addClass('current');
			now.css({transform: 'translateX(0%)'});
			next.addClass('current');
			next.css({transform: 'translateX(' + (100*dir) + '%)'});
			setTimeout(function () {
				_this.$div.addClass('slides-anime');
			}, 10);
			setTimeout(function () {
				now.css({transform: 'translateX(' + (-100*dir) + '%)'});
				next.css({transform: 'translateX(0%)'});
			}, 20);
			setTimeout(function () {
				now.removeClass('current');
				_this.$div.removeClass('slides-anime');
				_this.now = num;
				_this.next();
				_this._state = true;
			}, 430);
		}
	},
	/* 微信登录 */
	wechat: {
		init: function () {
			var WECHAT_CODE = location.href.getQueryValue('code');
			if (WECHAT_CODE && WECHAT_CODE.length == 32) {
				LOGIN._userWechat = { code: WECHAT_CODE };
				LOGIN.USER.loginWechatFn();
			}
		},
		signup: function () {
			location.href = 'https://open.weixin.qq.com/connect/qrconnect?appid=wx0365f093929dd552&scope=snsapi_login&redirect_uri='+HOST_URL+'login-quick.html&login_type=jssdk';
		}
	},
	/* QQ登录 */
	QQ: {
		init: function () {
			// 判断QQ登录状态
			var LOGIN_SOURCE = location.href.getQueryValue('login');
			var openId = location.href.getQueryValue('openId');
			var loginAccount = location.href.getQueryValue('loginAccount');
			var imageUrl = location.href.getQueryValue('imageUrl');
			if (LOGIN_SOURCE == 'QQ' && openId) {
				if (openId) {
					LOGIN._userThird = {
						loginType: 'QQ',
						loginAccount: loginAccount,
						openId: openId,
						imageUrl: imageUrl
					}
					LOGIN.USER.loginThirdFn();
				} else {
					ArtJS.page.alert('获取用户信息失败！');
				}
			}
		},
		signup: function () {
			location = 'https://graph.qq.com/oauth2.0/authorize?client_id=101218992&response_type=token&scope=get_user_info,permission_weibo,get_user_profile,get_user_cbinfo&redirect_uri='+HOST_URL+'userLogin/qqLogin.html', 'oauth2Login_10000';
		}
	},
	/* sina登录 */
	sina: {
		signup: function () {
			var _this = this;
			ArtJS.load(['sinajs'], function () {
				_this.xllogin();
			});
		},
		xllogin: function () {
			var status = WB2.checkLogin();
			if (!status) {
				WB2.login(function (obj) {
					LOGIN.sina.login();
				});
			}
		},
		login: function () {
			WB2.anyWhere(function (W) {
				// 调用 account/get_uid 接口，获取用户信息
				W.parseCMD('/account/get_uid.json', function (oResult, bStatus) {
					if (bStatus) {
						W.parseCMD("/users/show.json", function (sResult, bStatus) {
							try {
								LOGIN.sina.out();
								LOGIN._userThird = {
									loginType: 'WEIBO',
									loginAccount: sResult.name,
									//deviceId: '',
									openId: sResult.idstr,
									//email: '',
									imageUrl: sResult.profile_image_url
								}
								LOGIN.USER.loginThirdFn();
							} catch (e) {
								console.log(e);
							}
							;
						}, {
							uid: oResult.uid
						}, {
							method: 'get'
						});
					}
				}, {}, {
					method: 'get',
					cache_time: 30
				});
			});
		},
		out: function () {
			WB2.logout();
		}
	},
	/* facebook登录 */
	facebook: {
		state: 1,
		signup: function () {
			var _this = this;
			ArtJS.load(['facebook'], function () {
				if (_this.state == 1) {
					_this._init();
				} else {
					_this.login();
				}
			});
		},
		_init: function () {
			if (!$('.loading').length) $('body').append('<div class="loading"></div>');
			var _this = this;
			_this.state = 0;
			FB.init({ appId: '221128221414290', status: true, cookie: true, xfbml: true });
			setTimeout(function () {
				$('#facebook').click();
				$('.loading').remove();
			}, 1000);
		},
		login: function () {
			var _this = this;
			if (FB) {
				//FB.logout();
				FB.getLoginStatus(function(response) {
					if (response.status === 'connected') {
						console.log(response.authResponse.accessToken);
						_this.reg();
						FB.logout();
					} else {
						FB.login(function(response) {
							if (response.status === 'connected') {
								_this.reg();
							} else if (response.status === 'not_authorized') {
								ArtJS.page.alert("not_authorized");
							} else {
								ArtJS.page.alert("The person is not logged into Facebook, so we're not sure if");
							}
						});
					}
				});
			}
		},
		reg: function () {
			FB.api('/me', function(response) {
				var id = response.id;
				LOGIN._userThird = {
					loginType: 'FACEBOOK',
					loginAccount: response.name,
					openId: id,
					email: response.email,
					imageUrl: 'http://graph.facebook.com/' + id + '/picture?type=large'
				}
				LOGIN.USER.loginThirdFn();
			});
		}
	},
	/* Google登录 */
	google: {
		state: 1,
		signup: function () {
			var _this = this;
			ArtJS.load(['plusone'], function () {
				if (_this.state == 1) _this.render();
			});
		},
		// 初始化
		render: function () {
			if (!$('.loading').length) $('body').append('<div class="loading"></div>');
			var _this = this;
			_this.state = 0;
			gapi.signin.render('google_login', {
				'callback': 'signinCallback',
				'approvalprompt': 'auto',
				'clientid': '210397176599-klliskslk6dluvngd4l81k70eqf59cl0.apps.googleusercontent.com',
				'cookiepolicy': 'single_host_origin',
				'requestvisibleactions': 'http://schemas.google.com/AddActivity',
				'scope': 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email'
			});
			setTimeout(function () {
				$('#google_login').click();
				$('.loading').remove();
			}, 1000);
		},
		// 回调函数
		signinCallback: function (authResult) {
			if (authResult) {
				// 是否有错
				if (authResult["error"] == undefined) {
					gapi.client.load("oauth2", "v2", function () {
						var request = gapi.client.oauth2.userinfo.get();
						request.execute(function (obj) {
							LOGIN.google.disconnectUser();
							LOGIN._userThird = {
								loginType: 'GOOGLE',
								loginAccount: obj.name,
								openId: obj.id,
								email: obj.email,
								imageUrl: obj.picture.replace('https', 'http')
							}
							LOGIN.USER.loginThirdFn();
						});
					});
				}
			}
		},
		// 取消与应用关联的代码
		disconnectUser: function () {
			var revokeUrl = 'https://accounts.google.com/o/oauth2/revoke?token=' + gapi.auth.getToken().access_token;
			$.ajax({
				type: 'GET',
				url: revokeUrl,
				async: false,
				contentType: "application/json",
				dataType: 'jsonp',
				success: function (nullResponse) {
				},
				error: function (e) {
					ArtJS.page.alert('取消关联失败! 请到 https://plus.google.com/apps 手动解除!');
					window.open('https://plus.google.com/apps');
				}
			});
		}
	},
	/* 用户 */
	USER: {
		ajaxFn: function (url, data, error, success) {
			if (!$('.loading').length) $('body').append('<div class="loading"></div>');
			$.ajax({
				type: CONFIG.METHOD,
				url:  API_URL + url,
				data: data || {},
				success: function (rs) {
					if (rs.code && rs.code == 200) {
						if (typeof success == 'function') {
							success();
						} else {
							LOGIN.success();
						}
					} else {
						if (typeof error == 'function') error(rs);
					}
					$('.loading').remove();
				},
				error: function (rs) {
					if (typeof error == 'function') error(rs);
					$('.loading').remove();
				}
			});
		},
		/* 登录请求 */
		// 正常登录
		loginFn: function (errorFn) {
			var _this = this;
			_this.ajaxFn(API.login, LOGIN._userLogin, errorFn);
		},
		// 第三方登录 (QQ, 新浪微博, facebook, google)
		loginThirdFn: function () {
			var _this = this;
			_this.ajaxFn(API.loginThird, LOGIN._userThird);
		},
		// 第三方登录 (微信)
		loginWechatFn: function () {
			var _this = this;
			_this.ajaxFn(API.loginWechat, LOGIN._userWechat);
		},
		registerFn: function (errorFn, successFn) {
			var _this = this;
			_this.ajaxFn(API.register, LOGIN._userRegister, errorFn, successFn);
		}
	},
	/* 校验 */
	CHECK: {
		accountName: function (obj) {
			var _this = this;
			var val = obj.val().trim();
			if (val == '') {
				_this.error(obj);
				return false;
			} else {
				_this.success(obj);
				return val;
			}
		},
		password: function (obj) {
			var _this = this;
			var val = obj.val().trim();
			var len = val.length;
			if (len < 6 || len > 16) {
				_this.error(obj);
				return false;
			} else {
				_this.success(obj);
				return val;
			}
		},
		mail: function (obj) {
			var _this = this;
			var val = obj.val().trim();
			if (val.isEmail()) {
				_this.success(obj);
				return val;
			} else {
				_this.error(obj);
				return false;
			}
		},
		checked: function (obj) {
			var _this = this;
			var val = obj.is(':checked');
			if (val) return 1
			else return 0;
		},
		error: function (obj) {
			obj.addClass('err');
		},
		success: function (obj) {
			obj.removeClass('err');
		}
	},
	submit: {
		init: function () {
			var me = LOGIN;
			var _this = this;
			me.$unameLogin = $('#usernameLogin');
			me.$pwordLogin = $('#passwordLogin');
			me.$rememberMe = $('#rememberMe');
			me.$inputLogin = $('#usernameLogin,#passwordLogin');
			me.$btnLogin   = $('#btnLoginLocal');

			me.$unameReg   = $('#usernameReg');
			me.$umailReg   = $('#usermailReg');
			me.$pwordReg   = $('#passwordReg');
			me.$inputReg = $('#usernameReg,#usermailReg,#passwordReg');
			me.$btnReg     = $('#btnRegisterLocal');
		},
		login: function () {
			var me = LOGIN;
			var check = me.CHECK;
			var name = check.accountName(me.$unameLogin);
			var password = check.password(me.$pwordLogin);
			var checked = check.checked(me.$rememberMe);
			if (name && password) {
				me._userLogin = {
					loginAccount: name,
					password: password,
					rememberMe: checked
				}
				me.USER.loginFn(function () {
					me.$inputLogin.addClass('err');
				});
			}
		},
		register: function () {
			var me = LOGIN;
			var check = me.CHECK;
			var name = check.accountName(me.$unameReg);
			var mail = check.mail(me.$umailReg);
			var password = check.password(me.$pwordReg);
			if (name && password) {
				me._userRegister = {
					registerType: 1,
					accountName: name,
					password: password,
					email: mail
				}
				me.USER.registerFn(function (rs) {
					me.$inputReg.addClass('err');
				}, function () {
					me._userLogin = {
						loginAccount: name,
						password: password,
						rememberMe: 1
					}
					me.USER.loginFn(function () {
						me.$inputLogin.addClass('err');
					});
				});
			}
		}
	}
}
var signinCallback = LOGIN.google.signinCallback;
$(function () {
	LOGIN.init();
	ArtJS.page.setDomain();
	ArtJS.track.init({google: true, baidu: true});
});
	var loginQuick = angular.module('loginQuick', []);
	loginQuick.controller('loginQuickCtr', function ($scope, $http, $timeout) {
		ArtJS.load(['header'], function () {
			$timeout(function () {
				$scope.LANG=LANG;
			});
		});
	});
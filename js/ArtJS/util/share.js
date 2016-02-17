// --------------------------------
// ArtJS.util.share
// --------------------------------
(function($) {
	if (!$ || !window.ArtJS) return;
	// ----------------------------
	// 分享插件 ArtJS.util.share
	// ----------------------------
	ArtJS.define('ArtJS.util.share', {
		// 分享模板
		tmpls: {
			parent: [
				'<div id="{id}" class="util-share util-share-{position}" data-id="{utilId}">',
					'<div class="util-share-list">{list}</div>',
				'</div>'
			].join(''),
			list: '<a class="util-share-ico-{icon}" href="{url}" target="_blank"><i class="iconfont icon-{icon}"></i></a>',
			wechat: '<a class="util-share-ico-{icon}"><i class="iconfont icon-{icon}"></i><s id="{canvas}"></s></a>'
		},
		url: {
			'qq':         'http://connect.qq.com/widget/shareqq/index.html?url={url}&desc={text}',
			'sina-weibo': 'http://service.weibo.com/share/share.php?url={url}&title={text}',
			'facebook':   'https://www.facebook.com/sharer/sharer.php?u={url}&t={text}',
			'twitter':    'https://twitter.com/intent/tweet?text={text}&url={url}',
			'google':     'https://plus.google.com/share?url={url}&t={text}'
		},
		// 初始化分享
		init: function(obj) {
			var utilId = this.utilId = new Date().getTime();
			this['_data_'+utilId] = obj;
			ArtJS.util.share._init();
		},
		_init: function() {
			var _data = this['_data_'+this.utilId];
			var keyPos   = new RegExp('(top|right|bottom|left)', 'g');
			var position = _data && _data.position && key.test(_data.position)? _data.position: 'left';
			var parent   = _data && _data.parent? _data.parent: 'body';
			var url      = _data && _data.url? _data.url: location.href;
			var murl     = _data && _data.murl? _data.murl: url;
			var text     = _data && _data.text? _data.text: '';
			this._target = _data && _data.target || ['wechat', 'qq', 'sina-weibo', 'facebook', 'twitter', 'google'];
			this.container = $(this.tmpls.parent.substitute({
				utilId: this.utilId,
				id: 'utilShare_'+this.utilId,
				list: this.render(url, text),
				position: position
			}));
			$(parent).append(this.container);
			this.render2D(murl);
			if (typeof(_data.callback) === 'function') _data.callback($('#utilShare_' + this.utilId));
		},
		// 渲染列表
		render: function (url, text) {
			var that = this;
			var list = [];
			var len  = that._target.length;
			if (len) {
				for (var i = 0; i < len; i++) {
					var item = that._target[i];
					if (that.url[item]) {
						var surl = that.url[item].substitute({
							url:  url,
							text: text
						});
						//console.log(url);
						list.push(that.tmpls.list.substitute({
							icon: item,
							url:  surl
						}));
					} else {
						list.push(that.tmpls.wechat.substitute({
							icon: item,
							canvas: 'canvas_' + that.utilId
						}));
					}
				}
			}
			return list.join('');
		},
		render2D: function (url) {
			$('#canvas_' + this.utilId).qrcode({ 
				render: 'canvas',
				width:  150,
				height: 150,
				text: url
			});
		}
	});
	// ----------------------------
	ArtJS.debug('dialog.js', '初始化成功');
})(jQuery);
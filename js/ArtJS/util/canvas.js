// --------------------------------
// ArtJS.canvas
// --------------------------------
(function($) {
	if (!$ || !window.ArtJS) return;
	// ----------------------------
	ArtJS.define('ArtJS.canvg', {
		// SVG 转 Image
		svgToImage: {
			init: function (params) {
				var that = this;
				this.params = params;
				this.canvas = document.createElement('canvas');
				this.ctx    = this.canvas.getContext('2d');
				this.svg    = params.svg.trim();
				this.img    = new Image();
				this._init();
			},
			_init: function () {
				var that = this;
				that.getImgFormSvg(that.svg, function () {
					canvg(that.canvas, that.svg, {renderCallback: function (dom) {
						that.img.src = that.src = that.getSafeImageData(0, 0, that.canvas.width, that.canvas.height);
						if (that.src) {
							that.img.onload = function () {
								that.imageCenter();
							}
						} else ArtJS.page.alert('该功能仅支持Chrome浏览器!');
					}});
				});
			},
			// 安全级别判断
			getSafeImageData: function (x, y, w, h) {
				var that = this;
				try {
					return that.canvas.toDataURL('image/png');
				} catch (e) {
					// Remove and recreate the canvas
					that.canvas = document.createElement('canvas');
					// Set the width and height of the new canvas
					that.canvas.width = w;
					that.canvas.height = h;
					that.ctx = that.canvas.getContext('2d');
					//  Display an error message
					return '';
				}
			},
			// 图片正方形居中处理
			imageCenter: function () {
				var that = this;
				var width  = that.width  = that.canvas.width;
				var height = that.height = that.canvas.height;
				var min    = that.min    = Math.min(width, height);
				var diff   = that.diff   = (width-min || height-min) / 2;
				that.canvas.width = that.canvas.height = min;	// 重置canvas高宽
				// 计算填充范围
				if (width == height) {				// 正方形
					that.ctx.drawImage(that.img, 0, 0);
				} else if (width > height) {		// 长方形 (横向)
					that.ctx.drawImage(that.img, -diff, 0);
				} else {							// 长方形 (纵向)
					that.ctx.drawImage(that.img, 0, -diff);
				}
				that.sideLength = that.params.width || that.min;
				that.img     = new Image();						// 重新创建图片防止循环loading
				that.img.src = that.src = that.canvas.toDataURL();
				that.img.onload = function () {
					that.imageResize();
				}
			},
			// 重置图片大小
			imageResize: function () {
				var that = this;
				var sideLen = that.sideLength;
				that.canvas.width = that.canvas.height = sideLen;
				that.ctx.clearRect(0, 0, sideLen, sideLen);
				that.ctx.fillStyle = '#fff';
				that.ctx.fillRect(0, 0, sideLen, sideLen);
				that.ctx.drawImage(that.img, 0, 0, sideLen, sideLen);
				that.fixType(that.params.type, that.params.quality);
				if (typeof(that.params.callback) === 'function') that.params.callback(that.src, that.img);
			},
			// 输出类别
			fixType: function (type, quality) {
				var that = this;
				type = type || 'jpeg';
				quality = quality || 0.5;
				var reg = /png|jpeg|bmp|gif/;
				if (typeof(type) === 'string') {
					type = type.toLowerCase().replace(/jpg/i, 'jpeg');
					if (!reg.test(type)) type = 'jpeg';
				}
				var r   = 'image/' + type;
				var canvas = document.createElement('canvas');
				var ctx = canvas.getContext('2d');
				ctx.drawImage(that.img, 0, 0);
				that.img = new Image();
				var src = canvas.toDataURL(r);
				if (type === 'jpeg' && typeof(quality) === 'number' && quality>0 && quality<1) {
					src = that.canvas.toDataURL(r, quality);
				}
				that.img.src = that.src = src;
			},
			// 外网图片转 Base64
			convertImgToBase64: function (url, callback) {
				var canvas = document.createElement('canvas'); 
				var ctx = canvas.getContext('2d');
				var img = new Image();
				img.crossOrigin = 'Anonymous';
				img.onload = function () {
					canvas.height = img.height;
					canvas.width  = img.width;
					ctx.drawImage(img, 0, 0);
					var dataURL = canvas.toDataURL('image/png');
					callback(dataURL);
					canvas = null;
				}
				img.src = url;
			},
			// 从SVG的DOM转换图片路径 (Base64)
			getImgFormSvg: function (svg, callback) {
				var id = 'svg_' + new Date().getTime() + '_' + String(Math.floor(Math.random()*10000));
				$('body').append('<div id="'+id+'" style="display: none;"></div>');

				var that = this;
				var parent = $('#'+id);
				parent.html(svg);
				var svg = parent.children('svg');
				var img = svg.find('image');
				var len = img.length;
				var now = 0;
				function callbackFn() {
					now++;
					if (now == len) {
						that.svgResize(id, function () {
							that.svg = parent.html();
							parent.remove();
							if (typeof(callback) === 'function') callback();
						});
					}
				}
				if (len) {
					img.each(function (i, e) {
						var href = $(e).attr('xlink:href');
						if (href.startWith('http')) {
							that.convertImgToBase64(href, function (imgData) {
								$(e).attr('xlink:href', imgData);
								callbackFn();
							});
						} else {
							callbackFn();
						}
					});
				} else {
					now--;
					callbackFn();
				}
			},
			svgResize: function (id, callback) {
				var that = this;
				var parent = document.getElementById(id);
				var svg = parent.children[0];
				var canvas = document.createElement('canvas');
				canvg(canvas, that.svg, {renderCallback: function (dom) {
					var w = that.width = canvas.width;
					var h = that.height = canvas.height;
					var m = Math.min(w, h);
					var sl = that.params.width || m;
					var s;
					if (w == h) {							// 正方形
						s = sl / m;
					} else if (w > h) {						// 长方形 (横向)
						s = h / m;
					} else {								// 长方形 (纵向)
						s = w / m;
					}
					if (!svg.getAttribute('viewBox')) {
						svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
					}
					svg.setAttribute('width',  w * s);
					svg.setAttribute('height', h * s);
					if (typeof(callback) === 'function') callback();
				}});
			}
		}
	});
	ArtJS.debug('canvas.js', '初始化成功');
})(jQuery);
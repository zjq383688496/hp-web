// ==================================================
// ==== ArtJS v0.0.0.1 ====
// 基于jQuery v1.3.2，在旧版ArtJS基础上扩展，包括以下方法集合：
// - JS原型方法扩展： String/Number/Array/Date
// - jQuery方法扩展: $.browser/$.fn
// - ArtJS方法库： core/json/base/page
// ==================================================
/* String 原型方法扩展 */
(function($) {
	if (!$) return;
	$.extend(String.prototype, {
		_toBoolean: function() {
			return (this.toString() === 'false' || this.toString() === '' || this.toString() === '0') ? false: true;
		},
		_toNumber: function() {
			return (!isNaN(this)) ? Number(this) : this.toString();
		},
		_toRealValue: function() {
			return (this.toString() === 'true' || this.toString() === 'false') ? this._toBoolean() : this._toNumber();
		},
		trim: function() {
			return this.replace(/(^\s*)|(\s*$)/g, '');
		},
		ltrim: function() {
			return this.replace(/(^\s*)/g, '');
		},
		rtrim: function() {
			return this.replace(/(\s*$)/g, '');
		},
		trimAll: function() {
			return this.replace(/\s/g, '');
		},
		trimNoteChar: function() {
			return this.replace(/^[^\{]*\{\s*\/\*!?|\*\/[;|\s]*\}$/g, '').trim();
		},
		trimSpaceMany: function () {
			return this.replace(/\s{2,}/g, ' ').trim();
		},
		left: function(len) {
			return this.substring(0, len);
		},
		right: function(len) {
			return (this.length <= len) ? this.toString() : this.substring(this.length - len, this.length);
		},
		reverse: function() {
			return this.split('').reverse().join('');
		},
		startWith: function(start, noCase) {
			return !(noCase ? this.toLowerCase().indexOf(start.toLowerCase()) : this.indexOf(start));
		},
		endWith: function(end, noCase) {
			return noCase ? (new RegExp(end.toLowerCase() + '$').test(this.toLowerCase().trim())) : (new RegExp(end + '$').test(this.trim()));
		},
		sliceInclude: function (str) {
			return this.indexOf(str) > -1;
		},
		sliceAfter: function(str) {
			return (this.indexOf(str) >= 0) ? this.substring(this.indexOf(str) + str.length, this.length) : '';
		},
		sliceBefore: function(str) {
			return (this.indexOf(str) >= 0) ? this.substring(0, this.indexOf(str)) : '';
		},
		getByteLength: function() {
			return this.replace(/[^\x00-\xff]/ig, 'xx').length;
		},
		subByte: function(len, s) {
			if (len < 0 || this.getByteLength() <= len) {
				return this.toString();
			}
			var str = this;
			str = str.substr(0, len).replace(/([^\x00-\xff])/g,'\x241 ').substr(0, len).replace(/[^\x00-\xff]$/,'').replace(/([^\x00-\xff]) /g,'\x241');
			return str + (s || '');
		},
		encodeURI: function(type) {
			var etype = type || 'utf',
				efn = (etype == 'uni') ? escape: encodeURIComponent;
			return efn(this);
		},
		decodeURI: function(type) {
			var dtype = type || 'utf',
				dfn = (dtype == 'uni') ? unescape: decodeURIComponent;
			try {
				var os = this.toString(),
					ns = dfn(os);
				while (os != ns) {
					os = ns;
					ns = dfn(os);
				}
				return os;
			} catch(e) {
				// 备注： uni加密，再用utf解密的时候，会报错
				return this.toString();
			}
		},
		textToHtml: function() {
			return this.replace(/</ig, '&lt;').replace(/>/ig, '&gt;').replace(/\r\n/ig, '<br>').replace(/\n/ig, '<br>');
		},
		htmlToText: function() {
			return this.replace(/<br>/ig, '\r\n');
		},
		htmlEncode: function() {
			var text = this,
				re = {
					'<': '&lt;',
					'>': '&gt;',
					'&': '&amp;',
					'"': '&quot;'
				};
			for (var i in re) {
				text = text.replace(new RegExp(i, 'g'), re[i]);
			}
			return text;
		},
		htmlDecode: function() {
			var text = this,
				re = {
					'&lt;': '<',
					'&gt;': '>',
					'&amp;': '&',
					'&quot;': '"'
				};
			for (var i in re) {
				text = text.replace(new RegExp(i, 'g'), re[i]);
			}
			return text;
		},
		stripHtml: function() {
			return this.replace(/(<\/?[^>\/]*)\/?>/ig, '');
		},
		stripScript: function() {
			return this.replace(/<script(.|\n)*\/script>\s*/ig, '').replace(/on[a-z]*?\s*?=".*?"/ig, '');
		},
		replaceAll: function(os, ns) {
			return this.replace(new RegExp(os, 'gm'), ns);
		},
		escapeReg: function() {
			return this.replace(new RegExp("([.*+?^=!:\x24{}()|[\\]\/\\\\])", "g"), '\\\x241');
		},
		addQueryValue: function(name, value) {
			var url = this.getPathName();
			var param = this.getQueryJson();
			var params = this.getQueryParams(name, value);
			for (var val in params) {
				if (!param[val]) param[val] = params[val];
			}
			return url + '?' + $.param(param);
		},
		addReQueryValue: function(name, value) {
			var url = this.getPathName();
			var param = this.getQueryJson();
			var params = this.getQueryParams(name, value);
			for (var val in params) {
				param[val] = params[val];
			}
			return url + '?' + $.param(param);
		},
		editQueryValue: function(name, value) {
			var url = this.getPathName();
			var param = this.getQueryJson();
			var params = this.getQueryParams(name, value);
			for (var val in params) {
				if (param[val]) param[val] = params[val] || param[val];
			}
			return url + '?' + $.param(param);
		},
		refQueryValue: function(name, value) {
			var url = this.getPathName();
			var param = this.getQueryJson();
			var params = this.getQueryParams(name, value);
			for (var val in params) {
				param[val] = params[val];
			}
			return url + '?' + $.param(param);
		},
		getQueryValue: function(name) {
			var reg = new RegExp("(^|&|\\?|#)" + name.escapeReg() + "=([^&]*)(&|\x24)", "");
			var match = this.match(reg);
			return (match) ? match[2] : '';
		},
		getQueryJson: function() {
			if (this.indexOf('?') < 0) return {};
			var query = this.substr(this.indexOf('?') + 1);
			if (!query) return {};
			var params = query.split('&'),
				len = params.length,
				result = {},
				key,
				value,
				item,
				param;
			for (var i = 0; i < len; i++) {
				param = params[i].split('=');
				key = param[0];
				value = param[1];
				item = result[key];
				if ('undefined' == typeof item) {
					result[key] = value || '';
				} else if (Object.prototype.toString.call(item) == '[object Array]') {
					item.push(value);
				} else {
					result[key] = [item, value];
				}
			}
			return result;
		},
		getQueryParams: function (name, value) {
			var params = {};
			if (typeof(name) == 'object') {
				params = name;
			} else {
				params[name] = value;
			}
			return params;
		},
		getDomain: function() {
			if (this.startWith('http://')) return this.split('/')[2];
			return '';
		},
		getPathName: function() {
			return (this.lastIndexOf('?') == -1) ? this.toString() : this.substring(0, this.lastIndexOf('?'));
		},
		getFilePath: function() {
			return this.substring(0, this.lastIndexOf('/') + 1);
		},
		getFileName: function() {
			return this.substring(this.lastIndexOf('/') + 1);
		},
		getFileExt: function() {
			return this.substring(this.lastIndexOf('.') + 1);
		},
		parseDate: function() {
			return (new Date()).parse(this.toString());
		},
		parseJSON: function() {
			return (new Function("return " + this.toString()))();
		},
		parseAttrJSON: function() {
			var d = {},
				a = this.toString().split(';');
			for (var i = 0; i < a.length; i++) {
				if (a[i].trim() === '' || a[i].indexOf(':') < 1) continue;
				var item = a[i].sliceBefore(':').trim(),
					val = a[i].sliceAfter(':').trim();
				if (item !== '' && val !== '') d[item.toCamelCase()] = val._toRealValue();
			}
			return d;
		},
		_pad: function(width, ch, side) {
			var str = [side ? '': this, side ? this: ''];
			while (str[side].length < (width ? width: 0) && (str[side] = str[1] + (ch || ' ') + str[0]));
			return str[side];
		},
		padLeft: function(width, ch) {
			if (this.length >= width) return this.toString();
			return this._pad(width, ch, 0);
		},
		padRight: function(width, ch) {
			if (this.length >= width) return this.toString();
			return this._pad(width, ch, 1);
		},
		toHalfWidth: function() {
			return this.replace(/[\uFF01-\uFF5E]/g, function(c) {
				return String.fromCharCode(c.charCodeAt(0) - 65248);
			}).replace(/\u3000/g, " ");
		},
		toCamelCase: function() {
			if (this.indexOf('-') < 0 && this.indexOf('_') < 0) {
				return this.toString();
			}
			return this.replace(/[-_][^-_]/g, function(match) {
				return match.charAt(1).toUpperCase();
			});
		},
		format: function() {
			var result = this;
			if (arguments.length > 0) {
				var parameters = (arguments.length == 1 && $.isArray(arguments[0])) ? arguments[0] : $.makeArray(arguments);
				$.each(parameters, function(i, n) {
					result = result.replace(new RegExp("\\{" + i + "\\}", "g"), n);
				});
			}
			return result;
		},
		substitute: function(data) {
			if (data && typeof(data) == 'object') {
				return this.replace(/\{([^{}]+)\}/g, function(match, key) {
					var value = data[key];
					return (value !== undefined) ? '' + value: '';
				});
			} else {
				return this.toString();
			}
		},
		// 将ID串转化为EAN-13
		toEAN13: function(pre) {
			var len = 12 - pre.length;
			var str = pre + ((this.length >= len) ? this.left(len) : this.padLeft(len, '0'));
			var a = 0,
				b = 0,
				c = 0,
				d = str.reverse();
			for (var i = 0; i < d.length; i++) {
				if (i % 2) {
					b += parseInt(d.charAt(i), 10);
				} else {
					a += parseInt(d.charAt(i), 10);
				}
			}
			if ((a * 3 + b) % 10) {
				c = 10 - (a * 3 + b) % 10;
			}
			return str + c;
		},
		toMapObject: function(sep) {
			sep = sep || '/';
			var s = this.split(sep);
			var d = {};
			var o = function(a, b, c) {
				if (c < b.length) {
					if (!a[b[c]]) {
						a[b[c]] = {};
					}
					d = a[b[c]];
					o(a[b[c]], b, c + 1);
				}
			};
			o(window, s, 1);
			return d;
		},
		/** 
		 * base64编码 
		 */
		base64encode: function () {
			var str = this;
			if (!str) return '';
			str += '';
			if (str.length === 0) return str;
			str = escape(str);
			var map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
			var i, b, x = [],
				padchar = map[64];
			var len = str.length - str.length % 3;
			for (i = 0; i < len; i += 3) {
				b = (str.charCodeAt(i) << 16) | (str.charCodeAt(i+1) << 8) | str.charCodeAt(i+2);
				x.push(map.charAt(b >> 18));
				x.push(map.charAt((b >> 12) & 0x3f));
				x.push(map.charAt((b >> 6) & 0x3f));
				x.push(map.charAt(b & 0x3f));
			}
			switch(str.length - len) {
				case 1:
					b = str.charCodeAt(i) << 16;
					x.push(map.charAt(b >> 18) + map.charAt((b >> 12) & 0x3f) + padchar + padchar);
					break;
				case 2:
					b = (str.charCodeAt(i) << 16) | (str.charCodeAt(i + 1) << 8);
					x.push(map.charAt(b >> 18) + map.charAt((b >> 12) & 0x3f) + map.charAt((b >> 6) & 0x3f) + padchar);
					break;
			}
			return x.join('');
		},
		/** 
		 * base64解码 
		 */
		base64decode: function () {
			var str = this;
			if (!str) return '';
			str += '';
			var len = str.length;
			var map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
			if((len === 0) || (len % 4 !== 0)) return str;
			var pads = 0;
			if(str.charAt(len - 1) === map[64]){
				pads++;
				if(str.charAt(len - 2) === map[64]){
					pads++;
				}
				len -= 4;
			}
			var i, b, x = [];
			for (i = 0; i < len; i += 4) {
				b = (map.indexOf(str.charAt(i)) << 18) | (map.indexOf(str.charAt(i + 1)) << 12) | (map.indexOf(str.charAt(i + 2)) << 6) | map.indexOf(str.charAt(i + 3));
				x.push(String.fromCharCode(b >> 16, (b >> 8) & 0xff, b & 0xff));
			}
			switch(pads){
				case 1:
					b = (map.indexOf(str.charAt(i)) << 18) | (map.indexOf(str.charAt(i)) << 12) | (map.indexOf(str.charAt(i)) << 6);
					x.push(String.fromCharCode(b >> 16, (b >> 8) & 0xff));
					break;
				case 2:
					b = (map.indexOf(str.charAt(i)) << 18) | (map.indexOf(str.charAt(i)) << 12);
					x.push(String.fromCharCode(b >> 16));
					break;
			}
			return unescape(x.join(''));
		},
		/** 
		 * utf16转utf8 
		 */
		utf16to8: function () {
			var str = this;
			var out = '';
			var len = str.length;
			var c;

			for (var i = 0; i < len; i++) {
				c = str.charCodeAt(i);
				if ((c >= 0x0001) && (c <= 0x007F)) {
					out += str.charAt(i);
				} else if (c > 0x07FF) {
					out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
					out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
					out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
				} else {
					out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
					out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
				}
			}
			return out;
		},
		/** 
		 * utf8转utf16 
		 */
		utf8to16: function () {
			var str = this;
			var out = '';
			var i = 0;
			var len = str.length;
			var c;
			var char2, char3;
			while (i < len) {
				c = str.charCodeAt(i++);
				switch (c >> 4) {
					case 0:
					case 1:
					case 2:
					case 3:
					case 4:
					case 5:
					case 6:
					case 7:
						// 0xxxxxxx
						out += str.charAt(i - 1);
						break;
					case 12:
					case 13:
						// 110x xxxx 10xx xxxx
						char2 = str.charCodeAt(i++);
						out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
						break;
					case 14:
						// 1110 xxxx10xx xxxx10xx xxxx
						char2 = str.charCodeAt(i++);
						char3 = str.charCodeAt(i++);
						out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
						break;
				}
			}
			return out;
		}
	});
})(jQuery);

/* String 数据校验相关 */
(function($) {
	if (!$) return;
	$.extend(String.prototype, {
		isIP: function() {
			var re = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;
			return re.test(this.trim());
		},
		isUrl: function() {
			return (new RegExp(/^(ftp|https?):\/\/([^\s\.]+\.[^\s]{2,}|localhost)$/i).test(this.trim()));
		},
		isURL: function() {
			return this.isUrl();
		},
		isDate: function() {
			var result = this.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
			if (result === null) return false;
			var d = new Date(result[1], result[3] - 1, result[4]);
			return (d.getFullYear() == result[1] && d.getMonth() + 1 == result[3] && d.getDate() == result[4]);
		},
		isTime: function() {
			var result = this.match(/^(\d{1,2})(:)?(\d{1,2})\2(\d{1,2})$/);
			if (result === null) return false;
			if (result[1] > 24 || result[3] > 60 || result[4] > 60) return false;
			return true;
		},
		// 需要测试一下
		isDateTime: function() {
			var result = this.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/);
			if (result === null) return false;
			var d = new Date(result[1], result[3] - 1, result[4], result[5], result[6], result[7]);
			return (d.getFullYear() == result[1] && (d.getMonth() + 1) == result[3] && d.getDate() == result[4] && d.getHours() == result[5] && d.getMinutes() == result[6] && d.getSeconds() == result[7]);
		},
		// 整数
		isInteger: function() {
			return (new RegExp(/^(-|\+)?\d+$/).test(this.trim()));
		},
		// 正整数
		isPositiveInteger: function() {
			return (new RegExp(/^\d+$/).test(this.trim())) && parseInt(this, 10) > 0;
		},
		// 负整数
		isNegativeInteger: function() {
			return (new RegExp(/^-\d+$/).test(this.trim()));
		},
		isNumber: function() {
			return !isNaN(this);
		},
		isRealName: function() {
			return (new RegExp(/^[A-Za-z \u4E00-\u9FA5]+$/).test(this));
		},
		isLogName: function() {
			return (this.isEmail() || this.isMobile());
		},
		isEmail: function() {
			return (new RegExp(/^([_a-zA-Z\d\-\.])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/).test(this.trim()));
		},
		isMobile: function() {
			return (new RegExp(/^(13|14|15|17|18)\d{9}$/).test(this.trim()));
		},
		isPhone: function() {
			return (new RegExp(/^(([0\+]\d{2,3}-)?(0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/).test(this.trim()));
		},
		isAreacode: function() {
			return (new RegExp(/^0\d{2,3}$/).test(this.trim()));
		},
		isPostcode: function() {
			return (new RegExp(/^\d{6}$/).test(this.trim()));
		},
		isLetters: function() {
			return (new RegExp(/^[A-Za-z]+$/).test(this.trim()));
		},
		isDigits: function() {
			return (new RegExp(/^[1-9][0-9]+$/).test(this.trim()));
		},
		isAlphanumeric: function() {
			return (new RegExp(/^[a-zA-Z0-9]+$/).test(this.trim()));
		},
		isValidString: function() {
			return (new RegExp(/^[a-zA-Z0-9\s.\-_]+$/).test(this.trim()));
		},
		isLowerCase: function() {
			return (new RegExp(/^[a-z]+$/).test(this.trim()));
		},
		isUpperCase: function() {
			return (new RegExp(/^[A-Z]+$/).test(this.trim()));
		},
		isChinese: function() {
			return (new RegExp(/^[\u4e00-\u9fa5]+$/).test(this.trim()));
		},
		isIDCard: function() {
			//这里没有验证有效性，只验证了格式
			var r15 = new RegExp(/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/);
			var r18 = new RegExp(/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/);
			return (r15.test(this.trim()) || r18.test(this.trim()));
		},
		// 卡号校验 模10检查
		isCardNo: function(cardType) {
			var cards = {
				'UleCard': {
					lengths: '16',
					prefixes: '',
					checkdigit: true
				},
				'Visa': {
					lengths: '13,16',
					prefixes: '4',
					checkdigit: true
				},
				'MasterCard': {
					lengths: '16',
					prefixes: '51,52,53,54,55',
					checkdigit: true
				},
				'BankCard': {
					lengths: '16,17,19',
					prefixes: '3,4,5,6,9',
					checkdigit: false
				}
			};
			if (!cards[cardType]) return false;
			// remove spaces and dashes
			var cardNo = this.replace(/[\s-]/g, '');
			var cardexp = /^[0-9]{13,19}$/;
			if (cardNo.length === 0 || !cardexp.exec(cardNo)) {
				return false;
			} else {
				// strip down to digits
				cardNo = cardNo.replace(/\D/g, '');
				var modTenValid = true;
				var prefixValid = false;
				var lengthValid = false;
				// 模10检查
				if (cards[cardType].checkdigit) {
					var checksum = 0,
						j = 1,
						calc;
					for (i = cardNo.length - 1; i >= 0; i--) {
						calc = Number(cardNo.charAt(i)) * j;
						if (calc > 9) {
							checksum = checksum + 1;
							calc = calc - 10;
						}
						checksum = checksum + calc;
						if (j == 1) {
							j = 2;
						} else {
							j = 1;
						}
					}
					if (checksum % 10 !== 0) modTenValid = false;
				}
				if (cards[cardType].prefixes === '') {
					prefixValid = true;
				} else {
					// 前缀字符检查
					var prefix = cards[cardType].prefixes.split(',');
					for (i = 0; i < prefix.length; i++) {
						var exp = new RegExp("^" + prefix[i]);
						if (exp.test(cardNo)) prefixValid = true;
					}
				}
				// 卡号长度检查
				var lengths = cards[cardType].lengths.split(",");
				for (var i = 0; i < lengths.length; i++) {
					if (cardNo.length == lengths[i]) lengthValid = true;
				}
				if (!modTenValid || !prefixValid || !lengthValid) {
					return false;
				} else {
					return true;
				}
			}
		},
		isUleCard: function() {
			return this.isCardNo('UleCard');
		},
		isVisa: function() {
			return this.isCardNo('Visa');
		},
		isMasterCard: function() {
			return this.isCardNo('MasterCard');
		},
		// 判断是否为符合EAN规则的条形码串
		isValidEAN: function() {
			var code = this.trim();
			var a = 0,
				b = 0,
				c = parseInt(code.right(1), 10),
				d = code.left(code.length - 1).reverse();
			for (var i = 0; i < d.length; i++) {
				if (i % 2) {
					b += parseInt(d.charAt(i), 10);
				} else {
					a += parseInt(d.charAt(i), 10);
				}
			}
			return ((a * 3 + b + c) % 10) ? false: true;
		},
		// 判断是否为符合EAN-8规则的条形码串
		isEAN8: function() {
			var code = this.trim();
			return (new RegExp(/^\d{8}$/).test(code)) && code.isValidEAN();
		},
		// 判断是否为符合EAN-12规则的条形码串
		isEAN12: function() {
			var code = this.trim();
			return (new RegExp(/^\d{12}$/).test(code)) && code.isValidEAN();
		},
		// 判断是否为符合EAN-13规则的条形码串
		isEAN13: function() {
			var code = this.trim();
			return (new RegExp(/^\d{13}$/).test(code)) && code.isValidEAN();
		},
		// 判断是否为符合ISBN-10规则的条形码串
		isISBN10: function() {
			var code = this.trim();
			if (!new RegExp(/^\d{9}([0-9]|X|x)$/).test(code)) return false;
			var a = 0,
				b = code.right(1),
				c = code.reverse();
			for (var i = 1; i < c.length; i++) {
				a += parseInt(c.charAt(i), 10) * (i + 1);
			}
			if (b == 'X' || b == 'x') b = 10;
			return ((a + parseInt(b, 10)) % 11) ? false: true;
		},
		isISBN: function() {
			return this.isEAN13();
		},
		isEANCode: function() {
			return this.isEAN8() || this.isEAN12() || this.isEAN13() || this.isISBN10();
		}
	});
})(jQuery);

/* Number 原型方法扩展 */
(function($) {
	if (!$) return;
	$.extend(Number.prototype, {
		// 添加逗号分隔，返回为字符串
		comma: function(length) {
			if (!length || length < 1) length = 3;
			var source = ('' + this).split('.');
			source[0] = source[0].replace(new RegExp('(\\d)(?=(\\d{' + length + '})+$)', 'ig'), '$1,');
			return source.join('.');
		},
		// 生成随机数
		randomInt: function(min, max) {
			return Math.floor(Math.random() * (max - min + 1) + min);
		},
		// 左侧补齐，返回为字符串
		padLeft: function(width, ch) {
			return ('' + this).padLeft(width, ch);
		},
		// 右侧补齐，返回字符串
		padRight: function(width, ch) {
			return ('' + this).padRight(width, ch);
		}
	});
})(jQuery);

/* Array 原型方法扩展 */
(function($) {
	if (!$) return;
	$.extend(Array.prototype, {
		// 删除指定内容项
		remove: function(item, it) {
			this.removeAt(this.indexOf(item, it));
		},
		// 删除指定内容项
		removeAt: function(idx) {
			if (idx >= 0 && idx < this.length) {
				for (var i = idx; i < this.length - 1; i++) {
					this[i] = this[i + 1];
				}
				this.length--;
			}
		},
		// 清除空字符串内容
		removeEmpty: function() {
			var arr = [];
			for (var i = 0; i < this.length; i++) {
				if (this[i].trim() !== '') {
					arr.push(this[i].trim());
				}
			}
			return arr;
		},
		// 添加内容，比push多一个检查相同内容部分
		add: function(item) {
			if (this.indexOf(item) > -1) {
				return false;
			} else {
				this.push(item);
				return true;
			}
		},
		// 数组数据交换
		swap: function(i, j) {
			if (i < this.length && j < this.length && i != j) {
				var item = this[i];
				this[i] = this[j];
				this[j] = item;
			}
		},
		// 过滤重复数据
		unique: function() {
			var a = [],
				o = {},
				i,
				v,
				len = this.length;
			if (len < 2) return this;
			for (i = 0; i < len; i++) {
				v = this[i];
				if (o[v] !== 1) {
					a.push(v);
					o[v] = 1;
				}
			}
			return a;
		},
		// JSON数组排序
		// it: item name  dt: int, char  od: asc, desc
		sortby: function(it, dt, od) {
			var compareValues = function(v1, v2, dt, od) {
				if (dt == 'int') {
					v1 = parseInt(v1, 10);
					v2 = parseInt(v2, 10);
				} else if (dt == 'float') {
					v1 = parseFloat(v1);
					v2 = parseFloat(v2);
				}
				var ret = 0;
				if (v1 < v2) ret = 1;
				if (v1 > v2) ret = -1;
				if (od == 'desc') {
					ret = 0 - ret;
				}
				return ret;
			};
			var newdata = [];
			for (var i = 0; i < this.length; i++) {
				newdata[newdata.length] = this[i];
			}
			for (i = 0; i < newdata.length; i++) {
				var minIdx = i;
				var minData = (it !== '') ? newdata[i][it] : newdata[i];
				for (var j = i + 1; j < newdata.length; j++) {
					var tmpData = (it !== '') ? newdata[j][it] : newdata[j];
					var cmp = compareValues(minData, tmpData, dt, od);
					if (cmp < 0) {
						minIdx = j;
						minData = tmpData;
					}
				}
				if (minIdx > i) {
					var _child = newdata[minIdx];
					newdata[minIdx] = newdata[i];
					newdata[i] = _child;
				}
			}
			return newdata;
		}
	});
})(jQuery);

/* Date 原型方法扩展 */
(function($) {
	if (!$) return;
	$.extend(Date.prototype, {
		// 时间读取
		parse: function(time) {
			if (typeof(time) == 'string') {
				if (time.indexOf('GMT') > 0 || time.indexOf('gmt') > 0 || !isNaN(Date.parse(time))) {
					return this._parseGMT(time);
				} else if (time.indexOf('UTC') > 0 || time.indexOf('utc') > 0 || time.indexOf(',') > 0) {
					return this._parseUTC(time);
				} else {
					return this._parseCommon(time);
				}
			}
			return new Date();
		},
		_parseGMT: function(time) {
			this.setTime(Date.parse(time));
			return this;
		},
		_parseUTC: function(time) {
			return (new Date(time));
		},
		_parseCommon: function(time) {
			var d = time.split(/ |T/),
				d1 = d.length > 1 ? d[1].split(/[^\d]/) : [0, 0, 0],
				d0 = d[0].split(/[^\d]/);
			return new Date(d0[0] - 0, d0[1] - 1, d0[2] - 0, (d1[0]||0) - 0, (d1[1]||0) - 0, (d1[2]||0) - 0);
		},
		// 复制时间对象
		clone: function() {
			return new Date().setTime(this.getTime());
		},
		// 时间相加
		dateAdd: function(type, val) {
			var _y = this.getFullYear();
			var _m = this.getMonth();
			var _d = this.getDate();
			var _h = this.getHours();
			var _n = this.getMinutes();
			var _s = this.getSeconds();
			switch (type) {
				case 'y':
					this.setFullYear(_y + val);
					break;
				case 'm':
					this.setMonth(_m + val);
					break;
				case 'd':
					this.setDate(_d + val);
					break;
				case 'h':
					this.setHours(_h + val);
					break;
				case 'n':
					this.setMinutes(_n + val);
					break;
				case 's':
					this.setSeconds(_s + val);
					break;
			}
			return this;
		},
		// 时间相减
		dateDiff: function(type, date2) {
			var diff = date2 - this;
			switch (type) {
				case 'w':
					return diff / 1000 / 3600 / 24 / 7;
				case 'd':
					return diff / 1000 / 3600 / 24;
				case 'h':
					return diff / 1000 / 3600;
				case 'n':
					return diff / 1000 / 60;
				case 's':
					return diff / 1000;
			}
		},
		// 格式化为字符串输出
		format: function(format) {
			if (isNaN(this)) return '';
			var o = {
				'm+': this.getMonth() + 1,
				'd+': this.getDate(),
				'h+': this.getHours(),
				'n+': this.getMinutes(),
				's+': this.getSeconds(),
				'S': this.getMilliseconds(),
				'W': ['日', '一', '二', '三', '四', '五', '六'][this.getDay()],
				'q+': Math.floor((this.getMonth() + 3) / 3)
			};
			if (format.indexOf('am/pm') >= 0) {
				format = format.replace('am/pm', (o['h+'] >= 12) ? '下午': '上午');
				if (o['h+'] >= 12) o['h+'] -= 12;
			}
			if (/(y+)/.test(format)) {
				format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
			}
			for (var k in o) {
				if (new RegExp('('+ k +')').test(format)) {
					format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
				}
			}
			return format;
		}
	});
})(jQuery);

/* jQuery方法扩展: $.browser/$.fn */
(function($) {
	if (!$) return;
	// $.browser方法扩展
	var ua = navigator.userAgent.toLowerCase();
	if (!$.browser) {
		$.browser = {
			version: (ua.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [0,'0'])[1],
			safari: /webkit/.test(ua),
			opera: /opera/.test(ua),			
			mozilla: /mozilla/.test(ua) && !/(compatible|webkit)/.test(ua)
		};
	}
	// 增加了IE11的判断
	$.browser.msie = (/msie/.test(ua)||/trident/.test(ua)) && !/opera/.test(ua);
	$.extend($.browser, {
		isIE6: ($.browser.msie && $.browser.version == 6) ? true: false,
		IEMode: (function() {
			if ($.browser.msie) {
				if (document.documentMode) {
					// >=IE8
					return document.documentMode;
				}
				if (document.compatMode && document.compatMode == 'CSS1Compat') {
					return 7;
				}
				// quirks mode
				return 5;
			}
			return 0;
		})(),
		isIPad: (/iPad/i).test(navigator.userAgent),
		isAndroid: (/Android/i).test(navigator.userAgent),
		isIPhone: (/iPhone/i).test(navigator.userAgent),
		isSymbian: (/SymbianOS/i).test(navigator.userAgent),
		isWP: (/Windows Phone/i).test(navigator.userAgent),
		isIPod: (/iPod/i).test(navigator.userAgent),
		isWin: (/Windows/i).test(navigator.userAgent),
		isMac: (/Mac OS X/i).test(navigator.userAgent),
		isLinux: (/Linux/i).test(navigator.userAgent),
		isWechat: (/micromessenger/i).test(navigator.userAgent.toLowerCase()),
		isPC: function () {
			var userAgentInfo = navigator.userAgent;
			var Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
			var flag = true;
			for (var i = 0; i < Agents.length; i++) {
			   if (userAgentInfo.indexOf(Agents[i]) > 0) { flag = false; break; }
			}
			return flag;
		},
		isMobile: function () {
			return (!this.isPC());
		},
		language: function() {
			return (navigator.language || '').toLowerCase();
		},
		getLanguage: function () {
			var lang = this.language();
			var language = lang.indexOf('zh-') > -1? 'CN': 'US';
			var regional = ArtJS.cookie.getFilter('regional');
			regional = regional === 'CN'? regional: 'US';
			if (ArtJS.login.checkUserStatus()) language = regional || language;
			return language.toUpperCase();
		}
	});
	// ----------------------------
	// 获取tagName
	$.fn.tagName = function() {
		if (this.length === 0) return '';
		if (this.length > 1) {
			var tagNames = [];
			this.each(function(i, el) {
				tagNames.push(el.tagName.toLowerCase());
			});
			return tagNames;
		} else {
			return this[0].tagName.toLowerCase();
		}
	};
	// 获取select的文本
	$.fn.optionText = function() {
		if (this.length === 0) return '';
		var sel = this[0];
		if (sel.selectedIndex === -1) return '';
		return sel.options[sel.selectedIndex].text;
	};
	// 获取element属性的JSON值
	$.fn.attrJSON = function(attr) {
		return (this.attr(attr || 'rel') || '').parseAttrJSON();
	};
	// 绑定jQueryUI事件处理
	$.fn.bindJqueryUI = function(action, params) {
		if (this.length === 0) return this;
		var elm = this;
		ArtJS.load('jqueryui', function() {
			elm[action](params);
		});
		return this;
	};
	// 绑定ArtJS.ui事件处理
	$.fn.bindJendUI = function(type, params, file) {
		if (this.length === 0 || !ArtJS) return this;
		if (ArtJS.ui && ArtJS.ui[type]) {
			ArtJS.ui[type](this, params);
			this.data(type + '-binded', true);
			ArtJS.debug('bindJendUI.' + type, params);
		} else {
			this.bindJendUIExtend(file || 'ui', type, params);
		}
		return this;
	};
	// 绑定ArtJS.ui扩展事件处理
	$.fn.bindJendUIExtend = function(file, type, params) {
		if (this.length === 0 || !ArtJS) return this;
		var elm = this;
		ArtJS.load(file, function() {
			setTimeout(function() {
				if (!ArtJS.ui[type]) return;
				ArtJS.ui[type](elm, params);
				elm.data(type + '-binded', true);
				ArtJS.debug('bindJendUI.' + type, params);
			}, 200);
		});
		return this;
	};
	// 只能输入数字
	$.fn.inputNumber = function () {
		if (this.length === 0 || !ArtJS) return this;
		var elm = this;
		$('body').delegate(elm, 'keypress', function (e) {
            var e = e || window.event;
            var c = e.keyCode || e.which;
            if ((c < 48 || c > 57) && c != 8) {
                return false;
            }
		});
	};
})(jQuery);

/* ArtJS core: namespace/define/ready/debug/load/timestat/lang */
(function($) {
	if (!$) return;
	if (!window.ArtJS) window.ArtJS = {};
	// ----------------------------
	// ArtJS.namespace 命名空间
	ArtJS.namespace = function(name, sep) {
		var s = name.split(sep || '.'),
			d = {},
			o = function(a, b, c) {
				if (c < b.length) {
					if (!a[b[c]]) {
						a[b[c]] = {};
					}
					d = a[b[c]];
					o(a[b[c]], b, c + 1);
				}
			};
		o(window, s, 0);
		return d;
	};
	// ----------------------------
	// 模块方法定义，其中callback为定义后需要附加执行的处理
	ArtJS.define = function(name, value, callback) {
		var obj = this,
			item = name;
		if (name.indexOf('.') > 0) {
			var a = name.split('.');
			item = a.pop();
			var source = a.join('.');
			obj = ArtJS.namespace(source);
		}
		if (obj[item]) return;
		obj[item] = value;
		if (callback) callback();
		ArtJS.debug('ArtJS.define', name, 'info');
	};
	// ----------------------------
	// 类似domready的处理，用以延迟部分方法的执行
	ArtJS.ready = function(callback) {
		ArtJS.ready.addEvent(callback);
	};
	$.extend(ArtJS.ready, {
		events: [],
		addEvent: function(callback) {
			if (!this.events) {
				callback();
				return;
			}
			this.events.push(callback);
		},
		exeEvents: function() {
			if (!this.events) return;
			for (var i = 0; i < this.events.length; i++) {
				this.events[i]();
			}
			this.events = null;
		}
	});
	// ----------------------------
	// ArtJS.debug 过程调试
	ArtJS.debug = function(a, b, type) {
		if (!this.debugMode) return;
		type = type || 'log';
		if (window.console && console[type]) {
			console[type](new Date().format('hh:nn:ss.S') + ', ' + a, ' = ', b);
		} else {
			ArtJS.debug.log(new Date().format('hh:nn:ss.S') + ', ' + a + ' = ' + b);
		}
	};
	$.extend(ArtJS.debug, {
		log: function() {
			this.createDOM();
			var p = [],
				v = $('#_jend_debuglog textarea').val();
			for (var i = 0; i < arguments.length; i++) {
				p.push(arguments[i]);
			}
			v += (v === '' ? '': '\n') + p.join(' ');
			$('#_jend_debuglog textarea').val(v);
		},
		clear: function() {
			$('#_jend_debuglog textarea').val('');
		},
		createDOM: function() {
			if ($('#_jend_debuglog').length === 0) {
				var _html = '<div id="_jend_debuglog" style="position:fixed;bottom:0;left:0;right:0;_position:absolute;_bottom:auto;_top:0;padding:5px 0 5px 5px;border:solid 5px #666;background:#eee;z-index:1000;"><textarea style="font-size:12px;line-height:16px;display:block;background:#eee;border:none;width:100%;height:80px;"></textarea><a style="text-decoration:none;display:block;height:80px;width:20px;text-align:center;line-height:16px;padding:5px 0;_padding:6px 0;background:#666;color:#fff;position:absolute;right:-5px;bottom:0;" href="#">关闭调试器</a></div>';
				$('body').append(_html);
				$('#_jend_debuglog a').click(function() {
					$(this).parent().remove();
					return false;
				});
				$('#_jend_debuglog textarea').focus(function() {
					this.select();
				});
			}
		}
	});
	// ----------------------------
	// ArtJS.load/ArtJS.loader 加载管理
	ArtJS.load = function(service, action, params) {
		if ($.isArray(service)) {
			var url = service.join(',');
			var urlsize = service.length;
			var status = ArtJS.loader.checkFileLoader(url);
			if (status == urlsize + 1) {
				if (typeof(action) == 'function') action();
			} else if (status > 0) {
				ArtJS.loader.addExecute(url, action);
			} else if (status === 0) {
				ArtJS.loader.addExecute(url, action);
				ArtJS.debug('开始加载JS', url);
				ArtJS.loader.fileLoader[url] = 1;
				for (var i = 0; i < urlsize; i++) {
					ArtJS.load(service[i], function() {
						ArtJS.loader.fileLoader[url]++;
						if (ArtJS.loader.fileLoader[url] == urlsize + 1) {
							ArtJS.debug('完成加载JS', url);
							ArtJS.loader.execute(url);
						}
					});
				}
			}
		} else if (ArtJS.loader.serviceLibs[service] && ArtJS.loader.serviceLibs[service].requires) {
			ArtJS.load(ArtJS.loader.serviceLibs[service].requires, function() {
				ArtJS.load.run(service, action, params);
			});
		} else {
			ArtJS.load.run(service, action, params);
		}
	};
	$.extend(ArtJS.load, {
		setPath: function(path) {
			ArtJS.loader.serviceBase = path;
		},
		add: function(key, data) {
			if (ArtJS.loader.serviceLibs[key]) return;
			if (data.js && (!data.js.startWith('http')) && this.version) {
				data.js = data.js.addQueryValue('v', this.version);
			}
			if (data.css && (!data.css.startWith('http')) && this.version) {
				data.css = data.css.addQueryValue('v', this.version);
			}
			ArtJS.loader.serviceLibs[key] = data;
		},
		run: function(service, act, params) {
			var action = (typeof(act) == 'string') ? (function() {
				try {
					var o = eval('ArtJS.' + service);
					if (o && o[act]) o[act](params);
				} catch(e) {}
			}) : (act || function() {});
			if (ArtJS.loader.checkService(service)) {
				action();
				return;
			}
			var url = ArtJS.loader.getServiceUrl(service);
			var status = ArtJS.loader.checkFileLoader(url);
			// status:-1异常, 0未加载, 1开始加载, 2完成加载
			if (status === 2) {
				action();
			} else if (status === 1) {
				ArtJS.loader.addExecute(url, action);
			} else if (status === 0) {
				if ($('script[src="' + url + '"]').length > 0) {
					ArtJS.loader.fileLoader[url] = 2;
					action();
				} else {
					ArtJS.loader.addExecute(url, action);
					ArtJS.loader.addScript(service);
				}
			} else {
				ArtJS.debug('加载异常', service);
			}
		}
	});
	// ----------------------------
	ArtJS.define('ArtJS.loader', {
		fileLoader: {},
		executeLoader: {},
		serviceBase: (function() {
			return '//www.cmall.com/';
		})(),
		serviceLibs: {},
		checkFullUrl: function(url) {
			return (url.indexOf('/') === 0 || url.indexOf('http://') === 0);
		},
		checkService: function(service) {
			if (this.checkFullUrl(service)) return false;
			try {
				if (service.indexOf('.') > 0) {
					var o = eval('ArtJS.' + service);
					return (typeof(o) != 'undefined');
				}
				return false;
			} catch(e) {
				return false;
			}
		},
		checkFileLoader: function(url) {
			return (url !== '') ? (this.fileLoader[url] || 0) : -1;
		},
		getServiceUrl: function(service) {
			var url = '';
			if (this.checkFullUrl(service)) {
				url = service;
			} else if (this.serviceLibs[service]) {
				if (!this.serviceLibs[service].js) {
					url = (this.checkFullUrl(this.serviceLibs[service].css)) ? this.serviceLibs[service].css: (this.serviceBase + this.serviceLibs[service].css);
				} else {
					url = (this.checkFullUrl(this.serviceLibs[service].js)) ? this.serviceLibs[service].js : (this.serviceBase + this.serviceLibs[service].js);
				}
			}
			return url;
		},
		execute: function(url) {
			if (this.executeLoader[url]) {
				for (var i = 0; i < this.executeLoader[url].length; i++) {
					this.executeLoader[url][i]();
				}
				this.executeLoader[url] = null;
			}
		},
		addExecute: function(url, action) {
			if (typeof(action) != 'function') return;
			if (!this.executeLoader[url]) this.executeLoader[url] = [];
			this.executeLoader[url].push(action);
		},
		addScript: function(service) {
			var this_ = this, url;
			if (this.checkFullUrl(service)) {
				url = service;
				this.getScript(url, function() {
					ArtJS.debug('完成加载JS', url);
					this_.fileLoader[url] = 2;
					ArtJS.loader.execute(url);
				});
			} else if (this.serviceLibs[service]) {
				if (this.serviceLibs[service].css) {
					url = (this.checkFullUrl(this.serviceLibs[service].css)) ? this.serviceLibs[service].css: (this.serviceBase + this.serviceLibs[service].css);
					if (!this.fileLoader[url]) {
						ArtJS.debug('开始加载CSS', url);
						this.fileLoader[url] = 1;
						$('head').append('<link rel="stylesheet" type="text\/css"  href="' + url + '" \/>');
						if (!this.serviceLibs[service].js) {
							ArtJS.debug('完成加载CSS', url);
							this_.fileLoader[url] = 2;
							ArtJS.loader.execute(url);
						}
					}
				}
				if (this.serviceLibs[service].js) {
					url = (this.checkFullUrl(this.serviceLibs[service].js)) ? this.serviceLibs[service].js: (this.serviceBase + this.serviceLibs[service].js);
					this.getScript(url, function() {
						ArtJS.debug('完成加载JS', url);
						this_.fileLoader[url] = 2;
						ArtJS.loader.execute(url);
					});
				}
			}
		},
		getScript: function(url, onSuccess, onError) {
			ArtJS.debug('开始加载JS', url);
			this.fileLoader[url] = 1;
			this.getRemoteScript(url, onSuccess, onError);
		},
		getRemoteScript: function(url, param, onSuccess, onError) {
			if ($.isFunction(param)) {
				onError = onSuccess;
				onSuccess = param;
				param = {};
			}
			var head = document.getElementsByTagName("head")[0];
			var script = document.createElement("script");
			script.type = 'text/javascript';
			script.charset = 'utf-8';
			script.src = url;
			for (var item in param) {
				if (item == 'keepScriptTag') {
					script.keepScriptTag = true;
				} else {
					script.setAttribute(item, param[item]);
				}
			}
			script.onload = script.onreadystatechange = function() {
				if (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") {
					if (onSuccess) onSuccess();
					script.onload = script.onreadystatechange = null;
					if (!script.keepScriptTag) head.removeChild(script);
				}
			};
			script.onerror = function() {
				if (onError) onError();
			};
			head.appendChild(script);
		}
	});
	// ----------------------------
	// ArtJS.timestat 时间分析
	ArtJS.define('ArtJS.timestat', {
		libs: {},
		loadTime: (typeof(_artjs_page_loadtime) == 'number') ? _artjs_page_loadtime: new Date().getTime(),
		add: function(name) {
			this.libs[name] = new Date().getTime() - this.loadTime;
		},
		get: function(name) {
			return this.libs[name] || 0;
		}
	});
	// ----------------------------
	// ArtJS.lang 多语言支持
	ArtJS.define('ArtJS.lang', {
		language: 'zh-cn',
		text: {},
		get: function(dataset, name) {
			if (name) {
				if (this.text[dataset]) {
					return this.text[dataset][name] || '';
				} else {
					return '';
				}
			} else {
				return this.text[dataset] || null;
			}
		},
		set: function(dataset, name, value) {
			if (!this.text[dataset]) {
				this.text[dataset] = {};
			}
			if (value) {
				this.text[dataset][name] = value;
			} else {
				this.text[dataset] = name;
			}
		},
		extend: function(dataset, data) {
			if (!this.text[dataset]) {
				this.text[dataset] = {};
			}
			$.extend(this.text[dataset], data);
		}
	});
})(jQuery);

/* ArtJS.cookie */
(function($) {
	if (!$ || !window.ArtJS) return;
	// ----------------------------
	ArtJS.namespace('ArtJS.cookie');
	$.extend(ArtJS.cookie, {
		getRootDomain: function() {
			var d = document.domain;
			if (d.indexOf('.') > 0 && !d.isIP()) {
				var arr = d.split('.'),
					len = arr.length,
					d1 = arr[len - 1],
					d2 = arr[len - 2],
					d3 = arr[len - 3];
				d = (d2 == 'com' || d2 == 'net') ? (d3 + '.' + d2 + '.' + d1) : (d2 + '.' + d1);
			}
			return d;
		},
		load: function() {
			var tC = document.cookie.split('; ');
			var tO = {};
			var a = null;
			for (var i = 0; i < tC.length; i++) {
				a = tC[i].split('=');
				tO[a[0]] = a[1];
			}
			return tO;
		},
		get: function(name) {
			var value = this.load()[name];
			if (value) {
				try {
					return decodeURI(value);
				} catch(e) {
					return unescape(value);
				}
			} else {
				return false;
			}
		},
		getFilter: function (name) {
			return this.get(name)? this.filter(this.get(name)): false;
		},
		set: function(name, value, options) {
			options = (typeof(options) == 'object') ? options: {
				minute: options
			};
			var arg_len = arguments.length;
			var path = (arg_len > 3) ? arguments[3] : (options.path || '/');
			var domain = (arg_len > 4) ? arguments[4] : (options.domain || (options.root ? this.getRootDomain() : ''));
			var exptime = 0;
			if (options.day) {
				exptime = 1000 * 60 * 60 * 24 * options.day;
			} else if (options.hour) {
				exptime = 1000 * 60 * 60 * options.hour;
			} else if (options.minute) {
				exptime = 1000 * 60 * options.minute;
			} else if (options.second) {
				exptime = 1000 * options.second;
			}
			var exp = new Date(),
				expires = '';
			if (exptime > 0) {
				exp.setTime(exp.getTime() + exptime);
				expires = '; expires=' + exp.toGMTString();
			}
			domain = (domain) ? ('; domain=' + domain) : '';
			document.cookie = name + '=' + escape(value || '') + '; path=' + path + domain + expires;
		},
		del: function(name, options) {
			options = options || {};
			var path = '; path=' + (options.path || '/');
			var domain = (options.domain) ? ('; domain=' + options.domain) : '';
			if (options.root) domain = '; domain=' + this.getRootDomain();
			document.cookie = name + '=' + path + domain + '; expires=Thu,01-Jan-70 00:00:01 GMT';
		},
		filter: function (text) {
			return text.replace(/(^["])|(["]$)/g, '');
		}
	});
})(jQuery);

/* ArtJS.json */
(function($) {
	if (!$ || !window.ArtJS) return;
	// ----------------------------
	ArtJS.namespace('ArtJS.json');
	$.extend(ArtJS.json, {
		parse: function(data) {
			return (new Function("return " + data))();
		},
		stringify: function(obj) {
			var m = {
				'\b': '\\b',
				'\t': '\\t',
				'\n': '\\n',
				'\f': '\\f',
				'\r': '\\r',
				'"': '\\"',
				'\\': '\\\\'
			};
			var s = {
				'array': function(x) {
					var a = ['['],
						b,
						f,
						i,
						l = x.length,
						v;
					for (i = 0; i < l; i += 1) {
						v = x[i];
						f = s[typeof v];
						if (f) {
							v = f(v);
							if (typeof(v) == 'string') {
								if (b) {
									a[a.length] = ',';
								}
								a[a.length] = v;
								b = true;
							}
						}
					}
					a[a.length] = ']';
					return a.join('');
				},
				'boolean': function(x) {
					return String(x);
				},
				'null': function() {
					return 'null';
				},
				'number': function(x) {
					return isFinite(x) ? String(x) : 'null';
				},
				'object': function(x) {
					if (x) {
						if (x instanceof Array) {
							return s.array(x);
						}
						var a = ['{'],
							b,
							f,
							i,
							v;
						for (i in x) {
							v = x[i];
							f = s[typeof v];
							if (f) {
								v = f(v);
								if (typeof(v) == 'string') {
									if (b) {
										a[a.length] = ',';
									}
									a.push(s.string(i), ':', v);
									b = true;
								}
							}
						}
						a[a.length] = '}';
						return a.join('');
					}
					return 'null';
				},
				'string': function(x) {
					if (/["\\\x00-\x1f]/.test(x)) {
						x = x.replace(/([\x00-\x1f\\"])/g, function(a, b) {
							var c = m[b];
							if (c) {
								return c;
							}
							c = b.charCodeAt();
							return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
						});
					}
					return '\"' + x + '\"';
				}
			};
			return s.object(obj);
		},
		toAttr: function(data) {
			if (typeof(data) == 'object') {
				var attrs = [];
				for (var item in data) {
					attrs.push(item+':'+data[item]);
				}
				return attrs.join(';');
			} else {
				return data;
			}
		},
		toUrl: function (data) {
			if (typeof(data) == 'object') {
				var attrs = [];
				for (var item in data) {
					attrs.push(item+'='+data[item]);
				}
				return attrs.join('&');
			} else {
				return '';
			}
		}
	});
})(jQuery);

/* ArtJS.base */
(function($) {
	if (!$ || !window.ArtJS) return;
	// ----------------------------
	ArtJS.namespace('ArtJS.base');
	// ----------------------------
	// StringBuilder: 字符串连接
	ArtJS.base.StringBuilder = function() {
		this._strings = [];
	};
	$.extend(ArtJS.base.StringBuilder.prototype, {
		append: function() {
			var aLen = arguments.length;
			for (var i = 0; i < aLen; i++) {
				this._strings.push(arguments[i]);
			}
		},
		appendFormat: function(fmt) {
			var re = /{[0-9]+}/g;
			var aryMatch = fmt.match(re);
			var aLen = aryMatch.length;
			for (var i = 0; i < aLen; i++) {
				fmt = fmt.replace(aryMatch[i], arguments[parseInt(aryMatch[i].replace(/[{}]/g, ""), 10) + 1]);
			}
			this._strings.push(fmt);
		},
		toString: function() {
			return this._strings.join("");
		}
	});
	// ----------------------------
	// ImageLoader: 图像加载器
	ArtJS.base.ImageLoader = function(options) {
		this.options = $.extend({
			src: '',
			min: 0.5,
			max: 30,
			timer: 0.1
		}, options || {});
		var that = this;
		this.init = function() {
			this.loaderId = (new Date()).getTime();
			this.loadStatus = 0;
			this.element = new Image();
			this.element.onload = function() {
				that.loadStatus = 1;
				if (that.options.onLoad) that.options.onLoad();
				ArtJS.debug('image onload', that.loaderId + ': ' + this.width + ',' + this.height);
			};
			this.element.onerror = function() {
				that.loadStatus = -1;
				if (that.options.onError) that.options.onError();
				ArtJS.debug('image onerror', that.loaderId);
			};
			this.element.src = this.options.src;
			this.startMonitor();
			ArtJS.debug('image init', that.loaderId);
		};
		this.startMonitor = function() {
			this.theTimeout = 0;
			var that = this;
			setTimeout(function() {
				that.checkMonitor();
			}, this.options.min * 1000);
		};
		this.checkMonitor = function() {
			if (this.loadStatus !== 0) return;
			this.theTimeout = this.options.min * 1000;
			this._monitor = setInterval(function() {
				that.theTimeout += 50;
				if (that.loadStatus !== 0) {
					clearInterval(that._monitor);
				} else if (that.element.complete) {
					clearInterval(that._monitor);
					that.loadStatus = 1;
					if (that.options.onLoad) that.options.onLoad();
					ArtJS.debug('image complete', that.loaderId + ': ' + that.element.width + ',' + that.element.height);
				} else if (that.theTimeout >= (that.options.max * 1000)) {
					clearInterval(that._monitor);
					that.loadStatus = -1;
					if (that.options.onError) that.options.onError();
					ArtJS.debug('image timeout', that.loaderId);
				}
			}, that.options.timer * 1000);
		};
		this.init();
	};
})(jQuery);

/* ArtJS.login */
(function ($) {
	if (!$ || !window.ArtJS) return;
	// ----------------------------
	ArtJS.namespace('ArtJS.login');
	$.extend(ArtJS.login, {
		// 读取用户信息
		// ArtJS.login.getUser(function() {}); 获取成功后回调
		getUser: function(callback) {
			if (this.checkUserStatus()) {
				if (this.userData && this.userData.memberId) {
					if (typeof(callback) === 'function') callback(this.userData);
					return false;
				} else {
					ArtJS.login.loadUserData(callback);
				}
			}
		},
		loadUserData: function(callback) {
			$.getJSON('/memberSite/members/getMember', function(data) {
				var data = data.result;
				if (data.imageUrl) {
					if (data.imageUrl.startWith('http')) {
						data.userImage = data.imageUrl;
					} else {
						data.userImage = ArtJS.server.image + data.imageUrl + '?imageView2/2/format/jpg/w/24/q/50';
					}
				} else {
					data.userImage = '/images/avatar_default.png';
				}
				ArtJS.login.userData = data;
				if (typeof(callback) === 'function') callback(data);
			});
		},
		checkUserStatus: function() {
			this.toKen = (ArtJS.cookie.get('toKen')||'').replaceAll('"','');
			return (!!this.toKen);
		},
		// 快速登录弹窗处理
		// ArtJS.login.pop(function() {}); 登录成功后回调
		pop: function(param, callback) {
			if (!callback) {
				if (typeof(param) === 'function') {
					callback = param;
					param = null;
				}
			}
			this.callback = function() {};
			if ($.isFunction(callback)) {
				this.callback = callback;
			}
			if (this.checkUserStatus()) {
				this.callback();
			} else {
				this.dialog(param);
			}
		},
		// 打开登录弹窗
		dialog: function(param) {
			ArtJS.page.setDomain();
			var url = '/login-quick.html' + ((param) ? ('?' + $.param(param)) : '');
			ArtJS.page.dialog.pop({
				url: url,
				width: 490,
				height: 540
			});
			ArtJS.login.success = function() {
				ArtJS.login.getUser(function (data) {
					/*if (ArtJS.server.language === $.browser.getLanguage()) {
						ArtJS.page.closeDialog();
						ArtJS.page.header.refreshUserInfo(data);
						ArtJS.login.callback(data);
					} else {
						ArtJS.page.refresh();
					}*/
					ArtJS.page.refresh();
				});
			};
		},
		// 登录成功后回调
		success: function() {
			ArtJS.page.closeDialog();
		}
	});
})(jQuery);

/* ArtJS.ui */
(function($) {
	if (!$ || !window.ArtJS) return;
	// ----------------------------
	ArtJS.namespace('ArtJS.ui');
	$.extend(ArtJS.ui, {
		// == 内部方法 ==========
		// UI各方法参数分析
		bindElementParam: function(elm, params) {
			elm.each(function() {
				this._param =  this._param || {};
				$.extend(this._param, params || $(this).attrJSON());
			});
		},
		// == 模块处理 ==========
		// 模块内容初始化
		ModuleLoaded: function(elm) {
			elm.find('.e-loadmvc').bindJendUI('LoadMVC');
			elm.find('.e-loadevt').bindJendUI('LoadEVT');
			elm.find('.e-loadjui').bindJendUI('LoadJUI');
		},
		LoadEVT: function(elm, attr) {
			if (elm.data('LoadEVT-binded')) return;
			elm.each(function() {
				var attrValue = $(this).attr(attr||'data-onload') || '';
				if (attrValue) eval(attrValue);
			});
		},
		LoadJUI: function(elm) {
			if (elm.data('LoadJUI-binded')) return;
			elm.each(function() {
				var jui = $(this).attr('data-jui') || '';
				var jlib = $(this).attr('data-jlib') || '';
				if (jui !== '') {
					$(this).bindJendUI(jui, null, jlib);
				}
			});
		},
		LoadMVC: function(elm) {
			if (elm.data('LoadMVC-binded')) return;
			elm.each(function() {
				if (!$(this).attr('data-mvc')) return;
				var mvc = $(this).attrJSON('data-mvc');
				var id = mvc.name || this.id || 'mvc'+new Date().getTime();
				ArtJS.load.add(id, mvc);
				ArtJS.load(id);
			});
		}
	});
})(jQuery);

/* ArtJS.util */
(function($) {
	if (!$ || !window.ArtJS) return;
	// ----------------------------
	ArtJS.namespace('ArtJS.util');
	// ----------------------------
})(jQuery);

/* ArtJS.page */
(function($) {
	if (!$ || !window.ArtJS) return;
	// ----------------------------
	ArtJS.namespace('ArtJS.page');
	// ----------------------------
	$.extend(ArtJS.page, {
		// keyHandlers, such as: ESC
		keyHandler: {
			events: {},
			keys: {
				'ESC': 27,
				'PAGEUP': 33,
				'PAGEDOWN': 34,
				'END': 35,
				'HOME': 36,
				'LEFT': 37,
				'TOP': 38,
				'RIGHT': 39,
				'DOWN': 40,
				'INSERT': 45,
				'DELETE': 46,
				'F1': 112,
				'F2': 113,
				'F3': 114,
				'F4': 115,
				'F5': 116,
				'F6': 117,
				'F7': 118,
				'F8': 119,
				'F9': 120,
				'F10': 121,
				'F11': 122,
				'F12': 123
			},
			add: function(doc, key, eventItem, eventCallback) {
				this.events[eventItem] = function(e) {
					try {
						var code = e.which || e.keyCode || 0;
						if (code == ArtJS.page.keyHandler.keys[key]) {
							eventCallback();
						}
					} catch(err) {}
				};
				$(doc).bind('keydown', this.events[eventItem]);
			},
			remove: function(doc, eventItem) {
				$(doc).unbind('keydown', this.events[eventItem]);
				this.events[eventItem] = null;
			}
		},
		// ------------------------
		// 设为首页
		setHomepage: function() {
			var url = document.location.href;
			if (url.match(/srcid=[\w]*/)) {
				url = url.replace(/srcid=[\w]*/, 'srcid=homedefault');
			} else {
				url += ((url.indexOf('?') > 0) ? '&': '?') + 'srcid=homedefault';
			}
			if (document.all) {
				document.body.style.behavior = 'url(#default#homepage)';
				document.body.setHomePage(url);
			} else if (window.sidebar) {
				if (window.netscape) {
					try {
						netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
					} catch(e) {
						alert('该操作被浏览器拒绝，如果想启用该功能，请在地址栏内输入 about:config,\n然后将项 signed.applets.codebase_principal_support 值设为true');
					}
				}
				var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBrance);
				prefs.setCharPref('browser.startup.homepage', url);
			}
		},
		// 加入收藏
		addFavor: function(u, t) {
			var url = u || document.location.href,
				title = t || document.title;
			if (url.match(/srcid=[\w]*/)) {
				url = url.replace(/srcid=[\w]*/, 'srcid=userfavorite');
			} else {
				url += ((url.indexOf('?') > 0) ? '&': '?') + 'srcid=userfavorite';
			}
			try {
				window.external.AddFavorite(url, title);
			} catch(e) {
				try {
					window.sidebar.addPanel(title, url, '');
				} catch(e2) {
					var ctrlStr = ((navigator.userAgent.toLowerCase()).indexOf('mac') != -1) ? 'Command/Cmd': 'CTRL';
					alert('您可以尝试通过快捷键' + ctrlStr + ' + D 加入到收藏夹~');
				}
			}
		},
		// 刷新页面
		refresh: function(url) {
			if (!url) {
				url = document.location.href;
				if (url.indexOf('#') > 0) {
					url = url.sliceBefore('#');
				}
			}
			document.location.href = url;
		},
		// 设置主域(用于不同二级域下的数据访问)
		setDomain: function() {
			var d = document.domain;
			if (d.indexOf('.') < 0 || d.isIP()) return;
			var k = d.split('.'),
				d1 = k[k.length - 1],
				d2 = k[k.length - 2],
				d3 = k[k.length - 3];
			document.domain = (d2 == 'com' || d2 == 'net') ? (d3 + '.' + d2 + '.' + d1) : (d2 + '.' + d1);
		},
		// ------------------------
		// ArtJS.util.dialog 相关方法的二次封装
		alert: function(message, callback) {
			var params = (typeof(message) == 'object') ? message: {
				message: message,
				callback: callback
			};
			ArtJS.load('util.dialog', 'alert', params);
		},
		showSuccess: function(message, callback) {
			var params = (typeof(message) == 'object') ? message: {
				message: message,
				callback: callback
			};
			params.type = 'success';
			ArtJS.load('util.dialog', 'alert', params);
		},
		showError: function(message, callback) {
			var params = (typeof(message) == 'object') ? message: {
				message: message,
				callback: callback
			};
			params.type = 'error';
			ArtJS.load('util.dialog', 'alert', params);
		},
		confirm: function(message, callback, cancel) {
			var params = (typeof(message) == 'object') ? message: {
				message: message,
				callback: callback,
				cancel: cancel
			};
			ArtJS.load('util.dialog', 'confirm', params);
		},
		prompt: function(message, callback) {
			var params = (typeof(message) == 'object' && !$.isArray(message)) ? message: {
				message: message,
				callback: callback
			};
			ArtJS.load('util.dialog', 'prompt', params);
		},
		showLoading: function(message) {
			var params = (typeof(message) == 'object') ? message: {
				loadingText: message
			};
			ArtJS.load('util.dialog', 'showLoading', params);
		},
		hideLoading: function(effect) {
			ArtJS.load('util.dialog', 'close', effect || '');
		},
		closeDialog: function(effect) {
			ArtJS.load('util.dialog', 'close', effect || '');
		},
		dialog: function(params) {
			ArtJS.load('util.dialog', 'open', params);
		}
	});
	$.extend(ArtJS.page.dialog, {
		init: function(options) {
			ArtJS.load('util.dialog', function() {
				ArtJS.util.dialog.init();
				ArtJS.util.dialog.setStyle(options);
			});
		},
		pop: function(params) {
			ArtJS.load('util.dialog', 'pop', params);
		},
		poptab: function(tabs, width, height) {
			var params = tabs[0];
			$.extend(params, {
				tabs: tabs,
				width: width,
				height: height
			});
			ArtJS.load('util.dialog', 'pop', params);
		},
		show: function(params) {
			ArtJS.load('util.dialog', 'show', params);
		},
		ajax: function(params) {
			ArtJS.load('util.dialog', 'ajax', params);
		},
		form: function(frm, title, width, height) {
			// 需要考虑一个扩展，增加一个callback，以便于处理成功后由iframe页面上来调用父页面上的callback方法。
			var frameId = 'frame' + (new Date()).getTime();
			var tmpl = '<iframe id="{frameId}" name="{frameId}" src="about:blank" width="100%" height="100%" scrolling="auto" frameborder="0" marginheight="0" marginwidth="0"></iframe>';
			var params = {};
			params.title = title;
			params.width = width;
			params.height = height;
			params.content = tmpl.substitute({
				frameId: frameId
			});
			params.callback = function() {
				frm.target = frameId;
				frm.submit();
			};
			ArtJS.page.dialog(params);
			return false;
		},
		setContent: function(html) {
			ArtJS.load('util.dialog', function() {
				ArtJS.util.dialog.setContent(html);
				ArtJS.util.dialog.setAutoHeight();
			});
		},
		setConfig: function(attr, value) {
			ArtJS.load('util.dialog', function() {
				ArtJS.util.dialog[attr] = value;
			});
		},
		close: function(effect) {
			ArtJS.load('util.dialog', 'close', effect || '');
		}
	});
	// ----------------------------
	// 页面初始化处理
	ArtJS.page.init = function() {
		// 将ready的方法批量执行
		if (ArtJS.ready) ArtJS.ready.exeEvents();
		// 对标准模块进行相应处理
		$(document).bindJendUI('ModuleLoaded');
		ArtJS.debug('page', '开始初始化');
		// 解决IE6下默认不缓存背景图片的bug
		if ($.browser.isIE6) try {
			document.execCommand('BackgroundImageCache', false, true);
		} catch(e) {}
	};
	$(function() {
		ArtJS.page.init();
	});
})(jQuery);

/* ArtJS.track */
(function($) {
	if (!$ || !window.ArtJS) return;
	// ----------------------------
	ArtJS.namespace('ArtJS.track');
	$.extend(ArtJS.track, {
		// 自动设置相应js的访问源
		//scriptPath: (document.location.protocol=='https:') ? '//lo' : '//lo',
		scriptPath: '//www.cmall.com/js/ArtJS',
		// 统计初始化，默认加载baidu/google
		init: function(options) {
			options = options || {
				baidu: true,
				google: true
			};
			if (options.baidu) {
				this.baidu.init();
			}
			if (options.google) {
				this.google.init();
			}
		},
		// 页面JS文件加载
		loadJS: function(url, isAsync) {
			if (isAsync) {
				ArtJS.loader.getRemoteScript(url, { async:true, keepScriptTag:true });
			} else {
				var head = document.getElementsByTagName('head')[0];
				var script = document.createElement("script");
				script.type = 'text/javascript';
				script.charset = 'utf-8';
				if (url.indexOf('baidu' > -1)) script.charset = 'gbk';
				script.src = unescape(url);
				head.appendChild(script);
			}
		},
		timestat: {
			loadTime: window._artjs_page_loadtime || 0,
			initTime: new Date().getTime(),
			datas: {},
			add: function(name) {
				this.datas[name] = new Date().getTime() - (this.loadTime || this.initTime);
			},
			get: function(name) {
				return this.datas[name] || 0;
			}
		},
		baidu: {
			// 百度uid key值
			uid: '6b905f228492484ca5d757ea626ddfbd',
			setUid: function(uid) {
				this.uid = uid;
			},
			// 百度统计初始化, 异步加载时有问题不提交数据
			init: function(uid) {
				window._hmt = window._hmt || [];
				ArtJS.track.loadJS('//hm.baidu.com/h.js%3F'+ (uid||this.uid));
			}
		},
		google: {
			uid: 'UA-71826473-1',
			domain: 'cmall.com',
			setUid: function(uid) {
				this.uid = uid;
			},
			setDomain: function(domain) {
				this.domain = domain;
			},
			// google统计初始化
			init: function(uid, domain) {
				var url = ArtJS.track.scriptPath + '/lib/analytics.min.js';
				(function(i, s, o, g, r, a, m) {
					i['GoogleAnalyticsObject'] = r;
					i[r] = i[r] || function() {	(i[r].q = i[r].q || []).push(arguments); }, i[r].l = 1*new Date();
					a = s.createElement(o), m = s.getElementsByTagName(o)[0];
					a.async = 1;
					a.src = g;
					m.parentNode.insertBefore(a, m);
				})(window, document, 'script', url, 'ga');
				ga('create', uid||this.uid, domain||this.domain);
				ga('require', 'displayfeatures');
				ga('send', 'pageview');
			},
			// 发送自定义数据
			// hitType： pageview/event/social/timing
			send: function(hitType, data) {
				window.ga && ga('send', hitType, data);
			},
			initEC: function() {
				window.ga && ga('require', 'ecommerce', 'ecommerce.js');
			},
			sendEC: function(orderData, itemDatas) {
				if (window.ga) {
					// 暂时用tax字段来保存 cartType.payType信息
					if (orderData.metric4 && orderData.metric5) {
						if (!isNaN(orderData.metric4+'.'+orderData.metric5)) {
							orderData.tax = orderData.metric4 +'.'+ orderData.metric5;
						}
					}
					ga('ecommerce:addTransaction', orderData);
					for (var i=0; i<itemDatas.length; i++) {
						ga('ecommerce:addItem', itemDatas[i]);
					}
					ga('ecommerce:send');
				}
			}
		}
	});
})(jQuery);

/* ArtJS.share */
(function($) {
	if (!$ || !window.ArtJS) return;
	// ----------------------------
	ArtJS.namespace('ArtJS.share');
	$.extend(ArtJS.share, {
		init: function(params) {
			ArtJS.load('util.share', function() {
				ArtJS.util.share.init(params);
			});
		}
	});
})(jQuery);


/* ArtJS init */
(function($) {
	if (!$ || !window.ArtJS) return;
	var st = '//www.cmall.com/js/ArtJS';
	// ----------------------------
	//ArtJS.load.version = '151029';
	ArtJS.load.add('ui', {          js: st + '/ui/common.min.js' });
	ArtJS.load.add('suggest', {     js: st + '/ui/suggest.min.js' });
	ArtJS.load.add('calendar', {    js: st + '/ui/calendar.min.js', css: st+'/ui/calendar.css' });
	ArtJS.load.add('util.dialog', { js: st + '/util/dialog.min.js',    css: st+'/util/dialog.css' });
	ArtJS.load.add('util.qrcode', { js: st + '/util/jquery.qrcode.min.js' });
	ArtJS.load.add('jqueryui', {    js: st + '/lib/jqueryui-1.7.3.js' });
	ArtJS.load.add('swfobject', {   js: st + '/lib/swfobject.js' });
	ArtJS.load.add('address', {     js: st + '/util/address.js', css: st+'/util/address.css' });
	ArtJS.load.add('lang', {        js: st + '/lang/'+$.browser.getLanguage()+'.js' });
	ArtJS.load.add('header', {      js: st + '/util/header.js', requires: 'lang' });
	ArtJS.load.add('svg-grop', {     js: st + '/util/svgGrop.js', requires: 'lang' });
	ArtJS.load.add('plug-in-unit', {js: st + '/util/plug-in-unit.js', requires: 'lang' });
	ArtJS.load.add('util.share', {  js: st + '/util/share.js', css: st+'/util/share.css', requires: 'util.qrcode' });
	
})(jQuery);

(function($) {
	if (!$ || !window.ArtJS) return
	ArtJS.server = {
		art: document.location.protocol + '//www.cmall.com/',
		image: document.location.protocol + '//image.cmall.com/imgsrv/',
		url: 'cmall.com',
		language: $.browser.getLanguage(),
		name: ''
	}
	ArtJS.debug('ArtJS.js','加载完成')
})(jQuery);
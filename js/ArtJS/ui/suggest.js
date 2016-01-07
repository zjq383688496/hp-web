(function($) {
	if (!$ || !window.ArtJS) return;
	// ----------------------------
	ArtJS.namespace('ArtJS.ui');
	$.extend(ArtJS.ui, {
		// suggest处理，用于显示搜索相关词
		suggest: function(elm, params) {
			var _url = params.url, _input = elm, _area = params.listElm, _items, _gos = -1, _ajaxtype = params.ajaxType||'dss';
			// itemTmpl和itemExecute默认用于主站搜索
			var _itemTmpl = params.itemTmpl || '<li key="{key}"><em class="name">{name}</em><em class="num">约{num}个物品</em></li>';
			var _itemExec = params.itemExec || function(txt, data) {
				var ret = [];
				for (var key in data) {
					ret.push({ key:key, name:key.replace(txt, '<strong>'+txt+'</strong>'), num:data[key] });
				}		
				return ret;
			};
			if (_ajaxtype == 'script') {
				window[params.ajaxCallback] = function(d) {
					getSuggest(d);
				};
			}
			$.fn.extend({
				selected:function(){
					this.siblings().removeClass("selected");
					this.addClass("selected");
					_input.val(this.attr('key'));
				},
				addGo:function(){
					var v=this.attr("key");
					_input.val(v);
					sh();
				//	_input.trigger('submitKeyword');
					_input.closest("form").submit();
				}
			});
			var ref = function() {
				_items=_area.find("li");
			};
			var ss = function() {
				_area.show();
			};
			var sh = function() {
				_area.hide();
			};
			var getSuggest=function(p){
				var d = _itemExec(_input.val(), p);
				var _str = '';
				for (var i=0; i<d.length; i++) {
					_str += _itemTmpl.substitute(d[i]);
				}
				_area.html(_str);
				ref();
				if (_items.length>0) {
					ss();
				} else {
					sh();
				}
				_items.mouseover(function() {
					$(this).selected();
					_gos=_items.index($(this));
				});
				_items.click(function() {
					$(this).addGo();
				});
			};
			_input.keypress(function(e) {
				ref();
				if (_area.css("display")=="block") {
					if (e.keyCode==13&&_gos!=-1) {
						_items.eq(_gos).addGo();
						e.preventDefault();
					}
				}
			});
			_input.keyup(function(e) {
				ref();
				if (e.keyCode==38) {
					_gos-=1;
					if (_gos==-2) {
						_gos=_items.length-1;
					} else if (_gos==-1) {
						_items.removeClass("selected");
						_input.val(_input.attr('key')||'');
						return;
					}
					_items.eq(_gos).selected();
				} else if (e.keyCode==40) {
					_gos+=1;
					if (_gos==_items.length) {
						_gos=-1;
						_items.removeClass("selected");
						_input.val(_input.attr('key')||'');
						return;
					}
					_items.eq(_gos).selected();
				} else {
					_gos=-1;
					if (_input.val() !== '') {
						_input.attr('key', _input.val());
						var pSrc = _url+encodeURI(_input.val());
						if (_ajaxtype=='dss') {
							$.getDSS(pSrc+'&_='+(new Date()).getTime(), getSuggest);
						} else if (_ajaxtype=='script') {
							$.getScript(pSrc);
						} else if (_ajaxtype=='jsonp') {
							$.getJSON(pSrc, getSuggest);
						}
					} else if (_input.val() === '') {
						sh();
					}
				}
			});
			$(document).click(function() {
				sh();
			});
		}
	});
	// ----------------------------
	ArtJS.debug('suggest.js', '初始化成功');
})(jQuery);
/* ArtJS.ui.calendar */
(function($) {
	if (!$ || !window.ArtJS) return;
	// ----------------------------
	ArtJS.namespace('ArtJS.ui');
	// ----------------------------
	if (ArtJS.ui.calendar) return;
	// ----------------------------
	var utilId = 'ui-calendar';
	var utilText = ArtJS.lang.get(utilId) || {
		'year':			'年',
		'month':		'月', 
		'weekday':		'日,一,二,三,四,五,六',
		'lastmonth':	'上{months}月', 
		'nextmonth':	'下{months}月', 
		'lastyear':		'上一年', 
		'nextyear':		'下一年',
		'today':		'今天',
		'clear':		'清空'
	};
	// ----------------------------
	ArtJS.ui.calendar = function(elm, params) {
		elm.each(function() {
			var element = $(this);
			var param = params || element.attrJSON();
			new Calendar(element, param);
		});
	};
	// ----------------------------
	var Calendar = function(elm, param) {
		var that = this;
		this.data = {
			id: utilId,
			today: new Date(),
			elementStyle: 'jui-calendar-source'
		};
		this.tmpl = {
			container: [
				'<div id="'+ utilId +'" style="display:none;">',
					'<div class="date-months"></div>',
					'<div class="date-footer">',
						'<span class="date-time">',
							'<input type="text" class="date-sel-h" value="00" data-min="0" data-max="23" maxlength="2" />:',
							'<input type="text" class="date-sel-m" value="00" data-min="0" data-max="59" maxlength="2" />:',
							'<input type="text" class="date-sel-s" value="00" data-min="0" data-max="59" maxlength="2" />',
						'</span>',
						'<a class="date-button date-today">'+ utilText.today +'</a>',
						'<a class="date-clear">'+ utilText.clear +'</a>',
					'</div>',
					'<div class="date-switch">',
						'<a class="date-button nextmonth">&#187;</a>',
						'<a class="date-button lastmonth">&#171;</a>',
						'<ul class="date-yearlist"></ul>',
						'<ul class="date-monthlist"></ul>',
					'</div>',
				'</div>'].join('')
		};
		this.init = function(elm, param) {
			// 初始化elm对象
			if (!elm.hasClass(this.data.elementStyle)) {
				elm.addClass(this.data.elementStyle);
				if (param.bdate) {
					elm.attr('bdate', param.bdate);
				}
				if (param.edate) {
					elm.attr('edate', param.edate);
				}
				elm.focus(function() {
					that.showCalendar();
				});
				// 针对dwcenter中的使用做的hack，防止冒泡到label click
				if (elm.parent().tagName()=='label') {
					elm.click(function() {
						return false;
					});	
				}
			}
			// 初始化data
			this.data.element = elm;
			this.data.format = param.format || 'yyyy-mm-dd';
			this.data.months = param.months || 2;
			this.data.footer = param.footer || false;
			if (param.disablePrev) {
				this.data.disablePrev = (typeof(param.disablePrev)=='string') ? param.disablePrev.parseDate() : param.disablePrev;
			}
			if (this.data.format.indexOf(':')>0) {
				this.data.timeEnabled = true;
				this.data.footer = true;
			}
			this.data.callback = param.callback;
			// 生成日历浮层dom
			this.container = $('#'+this.data.id);
			if (this.container.length === 0) {
				this.container = $(this.tmpl.container);
				$('body').append(this.container);
				this.footer.initTimes();
				//
				this.container.bind('mouseover', function() {
					that.data.showStatus = true;
				});
				$(document).bind('mousedown', function(e) {
					var evt = e || window.event || null;
					var src = evt ? (evt.srcElement || evt.target) : null;
					var needHide = true;
					if (typeof(src)=='object') {
						if ($(src).hasClass(that.data.elementStyle) || $(src).parents('#'+ that.data.id).length>0) {
							needHide = false;
						}
					}
					if (needHide) {
						that.hideCalendar();
					}
				});
			}
		};
		this.showCalendar = function() {
			this.data.showStatus = true;
			this.data.bdate = (this.data.element.attr('bdate')) ? this.data.element.attr('bdate').parseDate() : null;
			this.data.edate = (this.data.element.attr('edate')) ? this.data.element.attr('edate').parseDate() : null;
			this.data.cdate = (this.data.element.val()==='') ? null : this.data.element.val().parseDate();
			//
			this.months.init();
			this.buttons.init();
			this.selyear.init();
			this.selmonth.init();
			this.footer.init();
			//
			this.data.showStatus = true;
			this.container.show();
			this.resize();
		};
		this.hideCalendar = function() {
			this.data.showStatus = false;
			setTimeout(function() {
				if (!that.data.showStatus) {
					that.container.fadeOut();
				}
			}, 200);
		};
		this.months = {
			tmpl: {
				month: [
					'<div class="date-month">',
						'<div class="date-title"><span year="{year}">{year} '+ utilText.year +'</span><span month="{month}">{month} '+ utilText.month +'</span></div>',
						'<div class="date-weeks"></div>',
						'<div class="date-items"></div>',
					'</div>'].join(''),
				weeklabel: '<label class="week{1}">{0}</label>',
				foretime: '<span>{0}</span>',
				datetime: '<a href="javascript:void(0);" class="{2}" date="{1}">{0}</a>'				
			},
			init: function(y, m) {
				if (!y) {
					y = (that.data.cdate || that.data.bdate || that.data.edate || new Date()).getFullYear();
					m = (that.data.cdate || that.data.bdate || that.data.edate || new Date()).getMonth();
				}
				that.data.year = new Date(y, m, 1).getFullYear();
				that.data.month = new Date(y, m, 1).getMonth();
				//
				var dt, dw, dd, dm, dy, ds, i, j;
				var weekTitles = utilText.weekday.split(",");
				var listElm = that.container.find('.date-months'), monthElm, weekElm, itemElm;
				listElm.html('');
				for (j=0; j<that.data.months; j++) {
					dt = new Date(y, m+j, 1);
					dy = dt.getFullYear();
					dm = dt.getMonth();
					dd = dt.getDate();
					dw = dt.getDay();
					monthElm = $(this.tmpl.month.substitute({year:dy, month:dm+1}));
					weekElm = monthElm.find('.date-weeks');
					itemElm = monthElm.find('.date-items');
					listElm.append(monthElm);
					for (i=0; i<=weekTitles.length-1; i++) {
						weekElm.append(this.tmpl.weeklabel.format(weekTitles[i], i));
					}
					for (i=1; i<=dw; i++) {
						itemElm.append(this.tmpl.foretime.format(''));
					}
					while (dt.getMonth() == dm) {
						ds = dt.format('yyyy-mm-dd');
						if (that.data.disablePrev && ds<that.data.disablePrev.format('yyyy-mm-dd')) {
							itemElm.append(this.tmpl.foretime.format(dd));
						} else if (that.data.bdate && ds<that.data.bdate.format('yyyy-mm-dd')) {
							itemElm.append(this.tmpl.foretime.format(dd));							
						} else if (that.data.edate && ds>that.data.edate.format('yyyy-mm-dd')) {
							itemElm.append(this.tmpl.foretime.format(dd));
						} else if (that.data.cdate && that.data.cdate.format('yyyy-mm-dd') == ds) {
							itemElm.append(this.tmpl.datetime.format(dd, ds, 'current'));
						} else if (that.data.today && that.data.today.format('yyyy-mm-dd') == ds) {
							itemElm.append(this.tmpl.datetime.format(dd, ds, 'today'));
						} else {
							itemElm.append(this.tmpl.datetime.format(dd, ds, ''));
						}
						dt.setDate(++dd);
					}
					while (dd + dw <= 42) {
						itemElm.append(this.tmpl.foretime.format(''));
						dd ++;
					}
					itemElm.find('a').click(function() {
						var dateVal = $(this).attr('date');
						that.setVal(dateVal);
						return false;
					});
				}
				listElm.find('.date-title span[year]').click(function() {
					that.selyear.toggle();
					that.selmonth.hide();
				});
				listElm.find('.date-title span[month]').click(function() {
					that.selmonth.toggle();
					that.selyear.hide();
				});
			},
			setVal: function() {
				that.container.find('.date-months a.current').click();				
			}			
		};
		// 底部按钮处理
		this.footer = {
			init: function() {
				this.element = that.container.find('.date-footer');
				if (!that.data.footer) {
					this.element.hide();
					return false;
				}
				this.element.show();
				this.initToday();
				this.initClear();
				this.updateTimes();
			},
			initToday: function() {
				var ds = new Date().format('yyyy-mm-dd');
				if (that.data.bdate && that.data.bdate.format('yyyy-mm-dd')>ds) {
					this.element.find('.date-today').addClass('disabled');
				} else if (that.data.edate && that.data.edate.format('yyyy-mm-dd')<ds) {
					this.element.find('.date-today').addClass('disabled');
				} else {
					this.element.find('.date-today').removeClass('disabled');
				}
				this.element.find('.date-today').unbind('click').bind('click', function() {
					if (!$(this).hasClass('disabled')) {
						that.setVal(ds);
					}
					return false;
				});				
			},
			initClear: function() {
				this.element.find('.date-clear').unbind('click').bind('click', function() {
					that.setVal('');
					return false;
				});
			},
			initTimes: function() {
				this.element = that.container.find('.date-footer');
				var inputs = this.element.find('.date-time input');
				inputs.css('ime-mode', 'disabled');
				inputs.bind('paste', function() {
					return !clipboardData.getData('text').match(/\D/);
				});
				inputs.bind('dragenter', function() {
					return false;
				});
				inputs.bind('blur', function() {
					var max = parseInt($(this).attr('data-max'), 10);
					if (this.value=='' || isNaN(this.value)) {
						this.value = '00';
					} else {
						var val = parseInt(this.value, 10);
						if (val > max) {
							this.value = max;
						} else {
							this.value = val.padLeft(2, '0');
						}
					}
				});
			},
			updateTimes: function() {
				var dt = that.data.cdate || new Date();
				var dh = dt.getHours();
				var dm = dt.getMinutes();
				var ds = dt.getSeconds();
				var nd = new Date().format('yyyy-mm-dd');
				if (that.data.timeEnabled) {
					this.element.find('.date-time').show();
					this.element.find('.date-sel-h').val(dh.padLeft(2, '0'));
					this.element.find('.date-sel-m').val(dm.padLeft(2, '0'));
					this.element.find('.date-sel-s').val(ds.padLeft(2, '0'));
					this.element.find('.date-time input').unbind('keypress').bind('keypress', function(e) {
						try {
							if (e.shiftKey) return false;
							var code = e.which || e.keyCode || 0;
							if (code==13) {
								$(this).blur();
								that.months.setVal();
							} else {
								return code==8 || (e.which===0 && e.keyCode==37) || (e.which===0 && e.keyCode==39) || (code>=48 && code<=57) || (e.which===0 && e.keyCode==46); 
							}
						} catch(err) {}
					});
				} else {
					this.element.find('.date-time').hide();
				}
			},
			getTimeVal: function() {
				var dh = this.element.find('.date-sel-h').val();
				var dm = this.element.find('.date-sel-m').val();
				var ds = this.element.find('.date-sel-s').val();
				return dh +':'+ dm +':'+ ds;
			}
		};
		// 前后月份按钮处理
		this.buttons = {
			init: function() {
				this.lastmonth = that.container.find('.lastmonth');
				this.lastmonth.attr('title', utilText.lastmonth.substitute({months:that.data.months}));
				this.lastmonth.unbind('click').bind('click', function() {
					that.months.init(that.data.year, that.data.month - that.data.months);
					that.buttons.update();
				});
				this.nextmonth = that.container.find('.nextmonth');
				this.nextmonth.attr('title', utilText.nextmonth.substitute({months:that.data.months}));				
				this.nextmonth.unbind('click').bind('click', function() {
					that.months.init(that.data.year, that.data.month + that.data.months);
					that.buttons.update();
				});
				this.update();
			},
			update: function() {
				if (that.data.disablePrev && that.data.disablePrev >= new Date(that.data.year, that.data.month, 1, 0, 0, 0)) {
					this.lastmonth.hide();
				} else {
					this.lastmonth.show();
				}
			}
		};
		// 年份选择列表处理
		this.selyear = {
			tmpl: {
				yearprev: '<li class="yearswitch" year="{0}">&#171;</li>',
				yearnext: '<li class="yearswitch" year="{0}">&#187;</li>',
				yearitem: '<li year="{0}">{0}'+ utilText.year +'</li>'				
			},
			init: function() {
				this.element = that.container.find('.date-yearlist');
				this.update(that.data.year-4);
				this.hide();
			},
			update: function(year) {
				var _this = this;
				this.element.html(this.tmpl.yearprev.format(year-10));
				for (var i=year; i<year+10; i++) {
					this.element.append(this.tmpl.yearitem.format(i));
				}
				this.element.append(this.tmpl.yearnext.format(year+10));
				if (that.data.disablePrev) {
					var year = that.data.disablePrev.getFullYear();
					this.element.find('li:gt(0)').each(function() {
						if ($(this).attr('year')<year) {
							$(this).addClass('disabled');
						}
					});
					if (this.element.find('li.disabled').length>0) {
						this.element.find('li:first').addClass('disabled');
					}
				}
				this.element.find('li').bind('click', function() {
					var year = parseInt($(this).attr('year'), 10);
					if (!$(this).hasClass('disabled')) {
						if ($(this).hasClass('yearswitch')) {
							_this.update(year);
						} else {
							that.months.init(year, that.data.month);
							that.selmonth.update();
							that.buttons.update();
							_this.hide();
						}
					}
				});
			},
			toggle: function() {
				this.element.toggle();
			},
			show: function() {
				this.element.show();
			},
			hide: function() {
				this.element.hide();
			}
		};
		// 月份选择列表处理
		this.selmonth = {
			tmpl: {
				monthitem: '<li month="{0}">{0}'+ utilText.month +'</li>'
			},
			init: function() {
				this.element = that.container.find('.date-monthlist');
				this.update();
				this.hide();
			},
			update: function() {
				var _this = this;
				this.element.html('');
				for (var i=1; i<=12; i++) {
					this.element.append(this.tmpl.monthitem.format(i));
				}
				if (that.data.disablePrev && that.data.disablePrev.getFullYear()==that.data.year) {
					var month = that.data.disablePrev.getMonth()+1;
					this.element.find('li').each(function() {
						if ($(this).attr('month')<month) {
							$(this).addClass('disabled');							
						}
					});
				}
				this.element.find('li').bind('click', function() {
					var month = parseInt($(this).attr('month'), 10);
					if (!$(this).hasClass('disabled')) {
						that.months.init(that.data.year, month-1);
						that.buttons.update();
						_this.hide();
					}
				});
			},
			toggle: function() {
				this.element.toggle();
			},
			show: function() {
				this.element.show();
			},
			hide: function() {
				this.element.hide();
			}
		};
		// 调整显示位置
		this.resize = function() {
			var bw = $('body').width();
			var po = this.data.element.offset();
			var ew = this.data.element.outerWidth();
			var eh = this.data.element.outerHeight();
			this.container.css({
				width: this.container.find('.date-month:first').outerWidth() * this.data.months
			});
			if (bw - po.left >= this.container.width()) {
				this.container.css({
					top: po.top + eh,
					left: po.left,
					right: 'auto'
				});
			} else {
				this.container.css({
					top: po.top + eh,
					right: bw - po.left - ew,
					left: 'auto'
				});
			}
		};
		// 设置返回值
		this.setVal = function(dateVal) {
			if (this.data.timeEnabled && dateVal!='') {
				dateVal += ' '+ this.footer.getTimeVal();
			}
			this.data.element.val(dateVal.parseDate().format(this.data.format));
			this.data.showStatus = false;
			this.container.hide();
			if (this.data.callback) {
				this.data.callback(dateVal);
			}
		};
		this.init(elm, param);
	};
	// ----------------------------
	ArtJS.debug('calendar.js', '初始化成功');
})(jQuery);